/**
 * Pre-launch audit report
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function walkHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'scripts'].includes(ent.name)) continue;
      walkHtml(p, list);
    } else if (ent.name.endsWith('.html')) list.push(p);
  }
  return list;
}

const issues = {
  zjgjmx: [],
  kiwlDomain: [],
  missingMeta: [],
  emptyAlt: [],
  duplicateTitles: new Map(),
  brokenLocal: []
};

const files = walkHtml(root);
const titleCount = new Map();

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(root, f);

  if (/zjgjmx/i.test(html)) issues.zjgjmx.push(rel);
  if (/kiwlmachine\.com/i.test(html) && !/cathy@kiwlmachine/i.test(html)) {
    const hits = html.match(/kiwlmachine\.com/gi) || [];
    if (hits.length) issues.kiwlDomain.push({ rel, n: hits.length });
  }
  if (!/<meta\s+name=["']description["']/i.test(html)) issues.missingMeta.push(rel);
  if (!/<title>/i.test(html)) issues.missingMeta.push(rel + ' (no title)');

  const titleM = html.match(/<title>([^<]*)<\/title>/i);
  if (titleM) {
    const t = titleM[1];
    titleCount.set(t, (titleCount.get(t) || 0) + 1);
  }

  const imgs = [...html.matchAll(/<img[^>]*>/gi)];
  for (const im of imgs) {
    if (/logo|icon|1x1|spacer|blank/i.test(im[0])) continue;
    const altM = im[0].match(/alt=["']([^"']*)["']/i);
    if (!altM || !altM[1].trim() || altM[1].length < 8) issues.emptyAlt.push(rel);
    break;
  }

  const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)];
  for (const h of hrefs) {
    const u = h[1];
    if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(u)) continue;
    let target = u.split('#')[0].split('?')[0];
    if (!target || target === '/') continue;
    const base = path.dirname(f);
    const resolved = path.normalize(path.join(base, target));
    if (!fs.existsSync(resolved) && !fs.existsSync(resolved + '.html')) {
      if (!fs.existsSync(path.join(resolved, 'index.html'))) {
        issues.brokenLocal.push({ from: rel, href: u });
      }
    }
  }
}

const dupTitles = [...titleCount.entries()].filter(([, c]) => c > 1);

const report = {
  htmlFiles: files.length,
  zjgjmxResidual: issues.zjgjmx.length,
  kiwlDomainRefs: issues.kiwlDomain.length,
  missingMeta: issues.missingMeta.length,
  pagesWithWeakAlt: new Set(issues.emptyAlt).size,
  duplicateTitleCount: dupTitles.length,
  brokenLinksSample: issues.brokenLocal.slice(0, 30),
  sitemapExists: fs.existsSync(path.join(root, 'sitemap.xml')),
  robotsExists: fs.existsSync(path.join(root, 'robots.txt'))
};

const out = path.join(root, 'docs', 'PRELAUNCH-AUDIT.md');
fs.mkdirSync(path.dirname(out), { recursive: true });
let md = '# Pre-launch SEO audit\n\n';
md += `Generated: ${new Date().toISOString()}\n\n`;
md += '| Check | Result |\n|-------|--------|\n';
for (const [k, v] of Object.entries(report)) {
  md += `| ${k} | ${typeof v === 'object' ? JSON.stringify(v) : v} |\n`;
}
if (dupTitles.length) {
  md += '\n## Duplicate titles (sample)\n\n';
  dupTitles.slice(0, 15).forEach(([t, c]) => {
    md += `- (${c}x) ${t}\n`;
  });
}
if (issues.brokenLocal.length) {
  md += '\n## Broken local links (sample)\n\n';
  issues.brokenLocal.slice(0, 40).forEach((x) => {
    md += `- ${x.from} → ${x.href}\n`;
  });
}
fs.writeFileSync(out, md, 'utf8');
console.log(JSON.stringify(report, null, 2));
console.log('Report:', out);
