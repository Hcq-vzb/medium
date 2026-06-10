/**
 * Remove decorative section header / marketing banner images from product detail pages.
 * Handles inline-styled banners and unstylized 1F–4F / KIWL title strips (by file size).
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

function imageSize(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 8) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m === 0xc0 || m === 0xc2 || m === 0xc1) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  if (buf.toString('ascii', 1, 4) === 'PNG') {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  return null;
}

function isBannerByStyle(tag) {
  const style = (tag.match(/style="([^"]*)"/i) || [])[1] || '';
  if (!/width:\s*850px/i.test(style)) return false;
  const h = Number((style.match(/height:\s*(\d+)px/i) || [])[1] || 0);
  return !h || (h >= 60 && h <= 74) || h >= 700;
}

function isBannerBySize(w, h) {
  if (!w || !h) return false;
  if (w >= 500 && h <= 120 && w / h >= 5) return true;
  if (w >= 700 && h >= 400 && h <= 1200 && w / h >= 1.05 && w / h <= 2.2) return true;
  if (w >= 700 && h >= 350 && h < 400 && w / h >= 2) return true;
  return false;
}

function isBannerImg(tag, htmlFile) {
  const src = (tag.match(/src="([^"]+)"/i) || [])[1];
  if (!src || /statics\//.test(src)) return false;
  if (isBannerByStyle(tag)) return true;
  const fp = path.normalize(path.join(path.dirname(htmlFile), src));
  const sz = imageSize(fp);
  return sz ? isBannerBySize(sz.width, sz.height) : false;
}

function stripTextBoxBanners(html, htmlFile) {
  let removed = 0;
  html = html.replace(/<div class="text_box">([\s\S]*?)<\/div>/gi, (full, inner) => {
    const next = inner
      .replace(/<img[^>]*>/gi, (tag) => {
        if (isBannerImg(tag, htmlFile)) {
          removed++;
          return '';
        }
        return tag;
      })
      .replace(/(<br\s*\/?>\s*){2,}/gi, '<br />');
    return `<div class="text_box">${next}</div>`;
  });
  return { html, removed };
}

let filesChanged = 0;
let imgsRemoved = 0;

for (const filePath of walkHtml(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!isProductDetail(html)) continue;
  const { html: next, removed } = stripTextBoxBanners(html, filePath);
  if (removed > 0) {
    fs.writeFileSync(filePath, next, 'utf8');
    filesChanged++;
    imgsRemoved += removed;
  }
}

console.log('Files updated:', filesChanged);
console.log('Banner images removed:', imgsRemoved);
