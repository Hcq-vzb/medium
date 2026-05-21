/**
 * Audit More>>, View More, class=more links and html/ broken prefixes.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const issues = [];

const RE_MORE = /<a\b([^>]*?)href=["']([^"']+)["']([^>]*?)>([\s\S]*?)<\/a>/gi;
const RE_MORE_TEXT = /More\s*(?:&gt;&gt;|>>)|View\s+More|view\s+more|View\s+Details/i;

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'scripts') continue;
      walk(p, list);
    } else if (/\.html?$/i.test(name)) list.push(p);
  }
}

function resolveTarget(fromFile, href) {
  if (!href || /^#/.test(href) || /^javascript:/i.test(href)) return { ok: true, reason: 'skip' };
  if (/^https?:\/\//i.test(href)) return { ok: true, reason: 'external' };
  const base = path.dirname(fromFile);
  let target = path.normalize(path.join(base, href.split('?')[0].split('#')[0]));
  if (!target.endsWith('.html') && !target.endsWith('.htm')) {
    target = path.join(target, 'index.html');
  }
  const rel = path.relative(root, target).replace(/\\/g, '/');
  return { ok: fs.existsSync(target), target: rel };
}

const files = [];
walk(root, files);

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');

  let m;
  RE_MORE.lastIndex = 0;
  while ((m = RE_MORE.exec(html))) {
    const attrs = m[1] + m[3];
    const href = m[2];
    const inner = m[4];
    const isMore =
      RE_MORE_TEXT.test(inner) ||
      /class=["'][^"']*more[^"']*["']/i.test(attrs);
    if (!isMore) continue;

    const check = resolveTarget(file, href);
    const brokenPrefix = /^html\//i.test(href);
    if (!check.ok || brokenPrefix) {
      issues.push({
        file: rel,
        href,
        label: inner.replace(/<[^>]+>/g, '').trim().slice(0, 40),
        brokenPrefix,
        exists: check.ok,
        target: check.target || '(missing)'
      });
    }
  }

  for (const hm of html.matchAll(/href=["'](html\/[^"']+)["']/gi)) {
    const href = hm[1];
    const check = resolveTarget(file, href);
    issues.push({
      file: rel,
      href,
      label: '(html/ prefix)',
      brokenPrefix: true,
      exists: check.ok,
      target: check.target || '(missing)'
    });
  }
}

const outPath = path.join(root, 'docs', 'more-links-audit.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ at: new Date().toISOString(), count: issues.length, issues }, null, 2));
console.log('Issues found:', issues.length);
const byHref = {};
for (const i of issues) {
  byHref[i.href] = (byHref[i.href] || 0) + 1;
}
console.log('Unique broken hrefs:', Object.keys(byHref).length);
Object.entries(byHref)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([h, c]) => console.log(c, h));
