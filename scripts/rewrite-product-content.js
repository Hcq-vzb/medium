/**
 * Rewrite product detail page introductions — professional EN + AR i18n pairs.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const tpl = require('./product-content-templates');
const cfg = require('./seo-config');

const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile', 'html']);
const MAX_DESC = 160;
const BRAND_SUFFIX = ' | ' + cfg.BRAND;

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

function isProductDetail(html) {
  return html.includes('des_box') || html.includes('porduct_show');
}

function needsRewrite(plain) {
  if (plain.length < 80) return true;
  return /technology\s*\.|equipment\s*\.|Filling\.|,\s*We\s*\.|KIWL China|PETtechnology|\.{3,}|products\s+Precision|Monoblock\s+Filling\s+Machineequipment/i.test(
    plain
  );
}

function extractPlain(inner) {
  return inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractAssets(inner) {
  const imgs = [];
  const tables = [];
  const imgRe = /<img[^>]*>/gi;
  const tableRe = /<table[\s\S]*?<\/table>/gi;
  let m;
  while ((m = imgRe.exec(inner))) imgs.push(m[0]);
  while ((m = tableRe.exec(inner))) tables.push(m[0]);
  return { imgs, tables };
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max - 3).trim() + '...';
}

function buildTitle(name) {
  const candidate = `${name}${BRAND_SUFFIX}`;
  if (candidate.length <= 72) return candidate;
  const avail = 72 - BRAND_SUFFIX.length;
  let cut = name.slice(0, avail);
  const sp = cut.lastIndexOf(' ');
  if (sp > avail * 0.5) cut = cut.slice(0, sp);
  return cut.trim() + BRAND_SUFFIX;
}

function replaceTextBox(html, newInner) {
  const re =
    /(<div class="text_box">)([\s\S]*?)(<\/div>\s*(?=<div class="text_title"|<\/div>\s*<\/div>\s*<div class="clear"))/i;
  if (!re.test(html)) return null;
  return html.replace(re, `$1${newInner}$3`);
}

function updateMeta(html, productName, overview) {
  const title = buildTitle(productName);
  const desc = truncate(`${productName}. ${overview} Request specifications and export pricing from ${tpl.BRAND}.`, MAX_DESC);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${desc.replace(/"/g, '&quot;')}" />`
  );
  return html;
}

function updateDesBoxTitle(html, productName) {
  return html.replace(
    /(<div class="des_box"[^>]*>[\s\S]*?<h4[^>]*>)[\s\S]*?(<\/h4>)/i,
    `$1${productName}$2`
  );
}

function updateProductDescriptionHeader(html) {
  return html.replace(
    /<div class="text_title"><h3>Product Description<\/h3>\s*<\/div>/i,
    `<div class="text_title"><h3>${tpl.SECTION.productDescription.en}</h3></div>`
  );
}

const allI18n = {};
let rewritten = 0;
let skippedOk = 0;
let failed = 0;

for (const filePath of walkHtml(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!isProductDetail(html)) continue;

  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const slug = tpl.categorySlugFromRel(rel);
  const rawName = (html.match(/class="des_box"[^>]*>[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/i) || [])[1] || '';
  const productName = tpl.formatProductName(rawName);

  const tbMatch = html.match(
    /<div class="text_box">([\s\S]*?)(?=<\/div>\s*(?:<div class="text_title"|<\/div>\s*<\/div>\s*<div class="clear"))/i
  );
  const inner = tbMatch ? tbMatch[1] : '';
  const plain = extractPlain(inner);

  const forceRewrite = needsRewrite(plain) || !plain.includes('Overview');
  if (!forceRewrite) {
    skippedOk++;
    continue;
  }

  const { html: introHtml, i18n, productName: finalName, overviewEn } = tpl.buildContent(productName, slug, rel);
  const assets = extractAssets(inner);
  const assetHtml = [...assets.imgs, ...assets.tables].join('<br />');
  const newInner = introHtml + (assetHtml ? `<br />${assetHtml}` : '');

  const updated = replaceTextBox(html, newInner);
  if (!updated) {
    failed++;
    continue;
  }
  html = updated;
  html = updateDesBoxTitle(html, finalName);
  html = updateProductDescriptionHeader(html);
  html = updateMeta(html, finalName, overviewEn);

  if (slug && cfg.CATEGORY[slug]) {
    const arTitle = cfg.CATEGORY[slug].arTitle;
    const arDesc = `معدات ${arTitle} من ${cfg.BRAND_NAME} لمصانع المشروبات والتصدير.`;
    html = html.replace(/data-seo-ar-title="[^"]*"/i, `data-seo-ar-title="${arTitle}"`);
    html = html.replace(/data-seo-ar-desc="[^"]*"/i, `data-seo-ar-desc="${arDesc.replace(/"/g, '&quot;')}"`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  Object.assign(allI18n, i18n);
  rewritten++;
}

const i18nPath = path.join(__dirname, 'product-content-i18n.json');
fs.writeFileSync(i18nPath, JSON.stringify(allI18n, null, 2), 'utf8');

console.log('Rewritten:', rewritten);
console.log('Skipped (already OK):', skippedOk);
console.log('Failed:', failed);
console.log('I18n pairs:', Object.keys(allI18n).length);
console.log('Wrote', i18nPath);

try {
  execSync('node scripts/merge-product-i18n.js', { cwd: root, stdio: 'inherit' });
} catch (e) {
  console.warn('merge-product-i18n:', e.message);
}
