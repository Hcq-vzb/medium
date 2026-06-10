/**
 * Remove all video/embed from product detail pages — keep product intro text/images only.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile', 'html']);

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

function stripProductVideo(html) {
  let out = html;

  // h5swf player (newer pages)
  out = out.replace(/<link[^>]*h5swf_jsmodern\.min\.css[^>]*>/gi, '');
  out = out.replace(/<script[^>]*h5swf_jsmodern\.min\.js[^>]*>\s*<\/script>/gi, '');
  out = out.replace(/<script[^>]*swfobject\.js[^>]*>\s*<\/script>/gi, '');
  out = out.replace(/<script[^>]*h5swfvideo\.min\.js[^>]*>\s*<\/script>/gi, '');
  out = out.replace(/<div\s+class="jm_video_bx"[^>]*>\s*<\/div>/gi, '');
  out = out.replace(
    /<script>\s*\$\s*\(\s*function\s*\(\s*\)\s*\{\s*h5swfvideo_Info\s*\(\s*\)\s*\}\s*\)\s*<\/script>/gi,
    ''
  );

  // Legacy Flash / Taobao embed videos (older pages)
  out = out.replace(/<div[^>]*>\s*<embed[^>]*>[\s\S]*?<\/embed>\s*<\/div>/gi, '');
  out = out.replace(/<embed[^>]*>[\s\S]*?<\/embed>/gi, '');
  out = out.replace(/<embed[^>]*\/?>/gi, '');
  out = out.replace(/<object[\s\S]*?<\/object>/gi, '');

  // HTML5 / iframe video fallbacks
  out = out.replace(/<video[\s\S]*?<\/video>/gi, '');
  out = out.replace(/<iframe[^>]*(?:youtube|video|mp4|taobao|youku)[^>]*>[\s\S]*?<\/iframe>/gi, '');

  return out;
}

function cleanProductMeta(html) {
  let out = html;
  out = out.replace(/<li>Category:\s*<\/li>/gi, '');
  out = out.replace(/<li>type:\s*<\/li>/gi, '');
  out = out.replace(/<li>Price:\s*<\/li>/gi, '');
  out = out.replace(/<li>TAG:\s*<\/li>/gi, '');
  out = out.replace(/<h4>\/instructions<\/h4>/gi, '');
  return out;
}

function fixProductDetail(html) {
  return cleanProductMeta(stripProductVideo(html));
}

const files = walkHtml(root);
let changed = 0;
let skipped = 0;

for (const filePath of files) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (!isProductDetail(html)) {
    skipped++;
    continue;
  }
  const next = fixProductDetail(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next, 'utf8');
    changed++;
  }
}

console.log('Product detail pages processed:', changed + skipped);
console.log('Updated:', changed);
