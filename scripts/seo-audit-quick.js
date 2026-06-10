/**
 * Full-site SEO audit — outputs docs/SEO-AUDIT.md
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./seo-config');

const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile', 'html']);
const PHONE_RE = /0086|18151132311|global service hotline/i;
const SITE = cfg.SITE.replace(/\/$/, '');

function walkHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walkHtml(p, list);
    } else if (ent.name.endsWith('.html')) list.push(p);
  }
  return list;
}

function relUrl(filePath) {
  let rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

const files = walkHtml(root);
const stats = {
  totalPages: files.length,
  missingTitle: [],
  missingDesc: [],
  missingCanonical: [],
  missingOg: [],
  missingJsonLd: [],
  missingH1: [],
  missingArMeta: [],
  missingSeoMetaAr: [],
  phoneInTitle: [],
  titleTooLong: [],
  descTooLong: [],
  descTooShort: [],
  noindex: [],
  oldFloatContact: [],
  missingChatWidget: [],
  oldDomain: [],
  zjgjmx: [],
  weakAlt: [],
  duplicateTitles: new Map(),
  sitemapUrls: new Set(),
  inSitemapNotOnDisk: [],
  onDiskNotInSitemap: []
};

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const indexable = !/noindex/i.test(html);

  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  const descM = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const desc = descM ? descM[1] : '';

  if (!title) stats.missingTitle.push(rel);
  else {
    if (indexable) {
      const c = stats.duplicateTitles.get(title) || [];
      c.push(rel);
      stats.duplicateTitles.set(title, c);
    }
    if (title.length > 70) stats.titleTooLong.push({ rel, len: title.length, title });
    if (PHONE_RE.test(title)) stats.phoneInTitle.push(rel);
  }

  if (!desc) stats.missingDesc.push(rel);
  else {
    if (desc.length > 160) stats.descTooLong.push({ rel, len: desc.length });
    if (desc.length < 50) stats.descTooShort.push({ rel, len: desc.length });
    if (PHONE_RE.test(desc)) stats.phoneInTitle.push(rel + ' (desc)');
  }

  if (!/<link\s+rel=["']canonical["']/i.test(html)) stats.missingCanonical.push(rel);
  if (!/<meta\s+property=["']og:title["']/i.test(html)) stats.missingOg.push(rel);
  if (!/<script\s+type=["']application\/ld\+json["']/i.test(html)) stats.missingJsonLd.push(rel);
  if (!/<h1[\s>]/i.test(html)) stats.missingH1.push(rel);
  if (!html.includes('data-seo-ar-title')) stats.missingArMeta.push(rel);
  if (!html.includes('seo-meta-ar.js')) stats.missingSeoMetaAr.push(rel);
  if (/noindex/i.test(html)) stats.noindex.push(rel);
  if (/kiwl-float-contact/.test(html)) stats.oldFloatContact.push(rel);
  if (!html.includes('kiwl-chat-widget')) stats.missingChatWidget.push(rel);
  if (/zjgjmx\.(cn|com)/i.test(html)) stats.zjgjmx.push(rel);
  if (/kiwlmachine\.com/i.test(html) && !/cathy@kiwlmachine/i.test(html)) {
    if (/https?:\/\/[^"']*kiwlmachine\.com/i.test(html)) stats.oldDomain.push(rel);
  }

  const imgs = [...html.matchAll(/<img[^>]*>/gi)];
  for (const im of imgs) {
    if (/logo|icon|1x1|spacer|blank|arrow|news_rm/i.test(im[0])) continue;
    const altM = im[0].match(/alt=["']([^"']*)["']/i);
    if (!altM || altM[1].trim().length < 8) {
      stats.weakAlt.push(rel);
      break;
    }
  }
}

const dupTitles = [...stats.duplicateTitles.entries()].filter(([, pages]) => pages.length > 1);

// Sitemap cross-check
if (fs.existsSync(path.join(root, 'sitemap.xml'))) {
  const sm = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    stats.sitemapUrls.add(m[1].replace(SITE, '').replace(/\/$/, '') || '/');
  }
}

const indexablePaths = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (/noindex/i.test(html)) continue;
  if (/index-2\.html$/i.test(f)) continue;
  if (f.includes(path.join('uploadfile'))) continue;
  if (f.includes(path.join('statics'))) continue;
  if (f.includes(path.join('html'))) continue;
  const url = relUrl(f);
  indexablePaths.add(url === '/' ? '/' : url.replace(/\/$/, ''));
}

for (const u of stats.sitemapUrls) {
  const norm = u === '' ? '/' : u;
  let found = false;
  for (const p of indexablePaths) {
    if (p === norm || p + '/' === norm || p === norm + '/') { found = true; break; }
  }
  if (!found && !norm.includes('uploadfile') && !norm.includes('statics')) {
    stats.inSitemapNotOnDisk.push(norm);
  }
}

let notInSm = 0;
const notInSmSample = [];
for (const p of indexablePaths) {
  const check = p === '/' ? '/' : p;
  let inSm = stats.sitemapUrls.has(SITE + check) || stats.sitemapUrls.has(SITE + check + '/') ||
    stats.sitemapUrls.has(check) || stats.sitemapUrls.has(check + '/');
  if (!inSm) {
    notInSm++;
    if (notInSmSample.length < 20) notInSmSample.push(p);
  }
}

const score = {
  pass: 0,
  warn: 0,
  fail: 0
};
function grade(name, count, warnAt, failAt) {
  if (count === 0) { score.pass++; return '✅'; }
  if (count >= failAt) { score.fail++; return '❌'; }
  if (count >= warnAt) { score.warn++; return '⚠️'; }
  score.warn++;
  return '⚠️';
}

const rows = [
  ['HTML pages scanned', stats.totalPages, '—'],
  ['Missing title', stats.missingTitle.length, grade('title', stats.missingTitle.length, 1, 5)],
  ['Missing meta description', stats.missingDesc.length, grade('desc', stats.missingDesc.length, 1, 10)],
  ['Missing canonical', stats.missingCanonical.length, grade('can', stats.missingCanonical.length, 5, 50)],
  ['Missing Open Graph', stats.missingOg.length, grade('og', stats.missingOg.length, 5, 50)],
  ['Missing JSON-LD', stats.missingJsonLd.length, grade('ld', stats.missingJsonLd.length, 5, 50)],
  ['Missing H1', stats.missingH1.length, grade('h1', stats.missingH1.length, 3, 20)],
  ['Missing data-seo-ar-title', stats.missingArMeta.length, grade('ar', stats.missingArMeta.length, 5, 50)],
  ['Missing seo-meta-ar.js', stats.missingSeoMetaAr.length, grade('arjs', stats.missingSeoMetaAr.length, 5, 50)],
  ['Phone in title/desc', stats.phoneInTitle.length, grade('phone', stats.phoneInTitle.length, 1, 3)],
  ['Title > 70 chars', stats.titleTooLong.length, grade('tlong', stats.titleTooLong.length, 5, 30)],
  ['Description > 160 chars', stats.descTooLong.length, grade('dlong', stats.descTooLong.length, 10, 50)],
  ['Description < 50 chars', stats.descTooShort.length, grade('dshort', stats.descTooShort.length, 10, 50)],
  ['Duplicate titles (groups)', dupTitles.length, grade('dup', dupTitles.length, 3, 20)],
  ['noindex pages', stats.noindex.length, 'ℹ️'],
  ['Old float contact remnant', stats.oldFloatContact.length, grade('float', stats.oldFloatContact.length, 1, 1)],
  ['Missing chat widget', stats.missingChatWidget.length, grade('chat', stats.missingChatWidget.length, 1, 5)],
  ['Old kiwlmachine.com URL', stats.oldDomain.length, grade('old', stats.oldDomain.length, 1, 5)],
  ['zjgjmx domain remnant', stats.zjgjmx.length, grade('zjg', stats.zjgjmx.length, 1, 1)],
  ['Pages with weak img alt', new Set(stats.weakAlt).size, grade('alt', new Set(stats.weakAlt).size, 20, 100)],
  ['Sitemap URLs', stats.sitemapUrls.size, 'ℹ️'],
  ['Indexable pages not in sitemap', notInSm, grade('sm', notInSm, 10, 100)],
  ['robots.txt', fs.existsSync(path.join(root, 'robots.txt')) ? '✅' : '❌', '—'],
  ['sitemap.xml', fs.existsSync(path.join(root, 'sitemap.xml')) ? '✅' : '❌', '—']
];

let md = '# Full-site SEO Audit\n\n';
md += `Generated: ${new Date().toISOString().slice(0, 10)}\n\n`;
md += '## Summary\n\n';
md += `| Check | Count | Status |\n|-------|------:|--------|\n`;
for (const [k, v, s] of rows) md += `| ${k} | ${v} | ${s} |\n`;

md += `\n**Score:** ${score.pass} pass · ${score.warn} warn · ${score.fail} fail\n`;

if (stats.phoneInTitle.length) {
  md += '\n## Phone pollution in title/description\n\n';
  stats.phoneInTitle.slice(0, 15).forEach((p) => { md += `- ${p}\n`; });
}
if (dupTitles.length) {
  md += '\n## Duplicate titles (top 15)\n\n';
  dupTitles.sort((a, b) => b[1].length - a[1].length).slice(0, 15).forEach(([t, pages]) => {
    md += `- **(${pages.length}x)** ${t.slice(0, 80)}\n`;
    pages.slice(0, 3).forEach((p) => { md += `  - ${p}\n`; });
  });
}
if (stats.titleTooLong.length) {
  md += '\n## Titles over 70 chars (sample)\n\n';
  stats.titleTooLong.slice(0, 10).forEach(({ rel, len, title }) => {
    md += `- (${len}) ${rel}: ${title.slice(0, 90)}…\n`;
  });
}
if (stats.missingH1.length) {
  md += '\n## Missing H1 (sample)\n\n';
  stats.missingH1.slice(0, 15).forEach((p) => { md += `- ${p}\n`; });
}
if (notInSmSample.length) {
  md += '\n## Not in sitemap (sample)\n\n';
  notInSmSample.forEach((p) => { md += `- ${p}\n`; });
}

const out = path.join(root, 'docs', 'SEO-AUDIT.md');
fs.writeFileSync(out, md, 'utf8');

const summary = {};
for (const [k, v, s] of rows) summary[k] = v;
console.log(JSON.stringify(summary, null, 2));
console.log('Score:', score);
console.log('Report:', out);
