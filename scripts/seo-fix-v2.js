/**
 * SEO fix pass: dedupe meta, hreflang, unique product titles, AR desc, banner alts
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./seo-config');

const root = path.join(__dirname, '..');
const BRAND_SUFFIX = ' | ' + cfg.BRAND;
const MAX_TITLE = 60;
const MAX_DESC = 160;

function walkHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'scripts', 'docs'].includes(ent.name)) continue;
      walkHtml(p, list);
    } else if (ent.name.endsWith('.html')) list.push(p);
  }
  return list;
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max - 3).trim() + '...';
}

function buildTitle(mainPart) {
  let t = mainPart + BRAND_SUFFIX;
  if (t.length <= MAX_TITLE) return t;
  const avail = MAX_TITLE - BRAND_SUFFIX.length - 3;
  return mainPart.slice(0, avail).trim() + '...' + BRAND_SUFFIX;
}

function extractText(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

function slugFromPath(rel) {
  const parts = rel.split('/');
  for (const p of parts) {
    for (const key of Object.keys(cfg.CATEGORY)) {
      if (p.includes(key)) return key;
    }
  }
  return null;
}

function canonicalUrl(filePath) {
  let rel = path.relative(root, filePath).replace(/\\/g, '/');
  const base = cfg.SITE.replace(/\/$/, '');
  if (rel === 'index.html') return base + '/';
  rel = rel.replace(/index\.html$/, '').replace(/\/$/, '');
  return base + '/' + rel;
}

function dedupeMeta(html) {
  let seenDesc = false;
  let seenKw = false;
  html = html.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, (tag) => {
    if (seenDesc) return '';
    seenDesc = true;
    return tag;
  });
  html = html.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*>/gi, (tag) => {
    if (seenKw) return '';
    seenKw = true;
    return tag;
  });
  return html;
}

function setHreflang(html, can) {
  html = html.replace(/<link\s+rel=["']alternate["'][^>]*>/gi, '');
  const block =
    `<link rel="alternate" hreflang="en" href="${can}" />\n` +
    `<link rel="alternate" hreflang="ar" href="${can}" />\n` +
    `<link rel="alternate" hreflang="x-default" href="${can}" />\n`;
  if (/<link\s+rel=["']canonical["']/i.test(html)) {
    return html.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1\n${block}`);
  }
  return html.replace(/<\/head>/i, block + '</head>');
}

function productTitle(html, filePath) {
  const base = path.basename(filePath, '.html');
  let name =
    extractText(html, /class="bt"[^>]*>[\s\S]*?<a[^>]*title=["']([^"']+)["']/i) ||
    extractText(html, /class="[^"]*bt[^"]*"[^>]*>[\s\S]*?<a[^>]*title=["']([^"']+)["']/i) ||
    extractText(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i) ||
    extractText(html, /class="headline"[^>]*>([\s\S]*?)<\//i) ||
    extractText(html, /class="title_bt"[^>]*>[\s\S]*?<h1>([\s\S]*?)<\/h1>/i);
  name = name.replace(/\s*-\s*KIWL.*$/i, '').replace(/Medium Beverage Machineryry/gi, cfg.BRAND_NAME).trim();
  if (!name || name.length < 4) name = 'Beverage Filling Machine';
  if (name.length < 50 && base.match(/^\d+$/)) {
    const short = name.length > 38 ? name.slice(0, 38) + '…' : name;
    return buildTitle(`${short} #${base}`);
  }
  return buildTitle(`${name} - Beverage Filling Machine`);
}

function fixBannerAlts(html) {
  html = html.replace(
    /alt="KIWL filling and beverage production lines"/i,
    'alt="Medium Beverage Machinery beverage filling machine production lines"'
  );
  html = html.replace(
    /alt="Complete filling solutions"/i,
    'alt="Beverage filling machine and water bottling line solutions"'
  );
  return html;
}

function ensureArDesc(html, slug) {
  if (!slug || !cfg.CATEGORY[slug]) return html;
  const c = cfg.CATEGORY[slug];
  const arDesc =
    c.arDesc ||
    `معدات ${c.arTitle || c.name} من Medium Beverage Machinery لمصانع المشروبات والتصدير.`;
  const esc = truncate(arDesc, MAX_DESC).replace(/"/g, '&quot;');
  return html.replace(/data-seo-ar-desc="[^"]*"/i, `data-seo-ar-desc="${esc}"`);
}

const files = walkHtml(root);
let n = 0;
for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(root, f).replace(/\\/g, '/').toLowerCase();
  const slug = slugFromPath(rel);
  const can = canonicalUrl(f);

  html = dedupeMeta(html);
  html = setHreflang(html, can);

  if (rel.match(/\d{4}\//) && /\d+\.html$/.test(rel)) {
    const title = productTitle(html, f);
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  }

  html = fixBannerAlts(html);
  html = ensureArDesc(html, slug);
  fs.writeFileSync(f, html, 'utf8');
  n++;
}
console.log('SEO fix v2 on', n, 'files');
