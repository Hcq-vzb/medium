/**
 * Remove legacy numeric pagination HTML (product/2.html, news/3.html, etc.)
 * Fix pagination blocks to index.html + index-2.html only.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile', 'html']);

function walk(d, l = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(p, l);
    } else if (e.name.endsWith('.html') && !e.name.endsWith('.bak.html')) {
      l.push(p);
    }
  }
  return l;
}

function isLegacyNumericPage(rel) {
  if (/^product\/\d+\.html$/i.test(rel)) return true;
  if (/^news\/\d+\.html$/i.test(rel)) return true;
  if (/^kehuanli\/\d+\.html$/i.test(rel)) return true;
  if (/^jishuzhichi\/\d+\.html$/i.test(rel)) return true;
  if (/^product\/tuijianchanpin\/\d+\.html$/i.test(rel)) return true;
  if (/^product\/(?:tuijianchanpin\/)?[^/]+\/\d+\.html$/i.test(rel)) return true;
  if (/^news\/(?:conews|hynews)\/\d+\.html$/i.test(rel)) return true;
  if (/^kehuanli\/[^/]+\/\d+\.html$/i.test(rel)) return true;
  if (/^jishuzhichi\/[^/]+\/\d+\.html$/i.test(rel)) return true;
  return false;
}

function fixPaginationBlock(html, isPage2) {
  return html.replace(/<div class="pages">[\s\S]*?<\/div>/gi, (block) => {
    if (!/<a href="\d+\.html"/i.test(block) && !/index-2\.html/i.test(block)) return block;
    const count = (block.match(/(\d+)\s*items/i) || [])[1] || '';
    const countPart = count ? `<a class="a1">${count} items</a> ` : '';
    if (isPage2) {
      return `<div class="pages">${countPart}<a href="index.html" class="a1">Previous</a> <a href="index.html">1</a> <span>2</span></div>`;
    }
    return `<div class="pages">${countPart}<span>1</span> <a href="index-2.html">2</a> <a href="index-2.html" class="a1">Next</a></div>`;
  });
}

function fixLegacyLinks(html) {
  return html
    .replace(/href=(["'])(\d+)\.html\1/gi, (full, q, n) => {
      if (parseInt(n, 10) >= 2) return `href=${q}index-2.html${q}`;
      return full;
    })
    .replace(/href=(["'])([^"']*\/)?(\d+)\.html\1/gi, (full, q, prefix, n) => {
      if (parseInt(n, 10) >= 2) {
        const p = prefix || '';
        return `href=${q}${p}index-2.html${q}`;
      }
      return full;
    });
}

const files = walk(root);
const toDelete = [];
let linksFixed = 0;
let paginationFixed = 0;

for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (isLegacyNumericPage(rel)) {
    toDelete.push(f);
    continue;
  }
  let html = fs.readFileSync(f, 'utf8');
  const orig = html;
  const isPage2 = /index-2\.html$/i.test(rel);
  html = fixPaginationBlock(html, isPage2);
  html = fixLegacyLinks(html);
  if (html !== orig) {
    fs.writeFileSync(f, html, 'utf8');
    linksFixed++;
    if (/<div class="pages">/.test(orig)) paginationFixed++;
  }
}

for (const f of toDelete) {
  fs.unlinkSync(f);
}

console.log(`Deleted ${toDelete.length} legacy pagination files`);
console.log(`Fixed links/pagination in ${linksFixed} files (${paginationFixed} with pages block)`);
