/**
 * Generate sitemap.xml and robots.txt at site root
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./seo-config');

const root = path.join(__dirname, '..');
const SITE = cfg.SITE.replace(/\/$/, '');

function walkHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'scripts', 'docs', 'uploadfile'].includes(ent.name)) continue;
      if (ent.name.endsWith('.bak') || ent.name.includes('backup')) continue;
      walkHtml(p, list);
    } else if (ent.name.endsWith('.html') && !ent.name.endsWith('.bak.html')) {
      list.push(p);
    }
  }
  return list;
}

function toLoc(filePath) {
  let rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return SITE + '/';
  if (rel.endsWith('/index.html') || rel === 'index.html') {
    const dir = rel.replace(/\/?index\.html$/, '');
    return dir ? `${SITE}/${dir}/` : SITE + '/';
  }
  return `${SITE}/${rel}`;
}

function priority(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '1.0';
  if (rel.startsWith('product/') && rel.includes('index.html')) return '0.9';
  if (rel.match(/\d{4}\//)) return '0.7';
  if (rel.startsWith('news/') || rel.startsWith('about/')) return '0.8';
  return '0.6';
}

function changefreq(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html' || rel.startsWith('product/')) return 'weekly';
  if (rel.match(/\d{4}\//)) return 'monthly';
  return 'monthly';
}

const files = walkHtml(root).sort();
const today = new Date().toISOString().slice(0, 10);

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

for (const f of files) {
  const loc = toLoc(f);
  xml += '  <url>\n';
  xml += `    <loc>${loc}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${changefreq(f)}</changefreq>\n`;
  xml += `    <priority>${priority(f)}</priority>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="ar" href="${loc}"/>\n`;
  xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>\n`;
  xml += '  </url>\n';
}

xml += '</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *
Allow: /

Disallow: /scripts/
Disallow: /docs/
Disallow: /*.bak
Disallow: /*.bak.html
Disallow: /uploadfile/temp/
Disallow: /test/

Sitemap: ${SITE}/sitemap.xml
`;

fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');
console.log('Wrote sitemap.xml (' + files.length + ' URLs) and robots.txt');
