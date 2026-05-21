const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const REF = path.join(root, 'product', 'index.html');

function normHref(h) {
  return h
    .replace(/^\.\//, '')
    .replace(/^(\.\.\/)+/, '')
    .replace(/^\//, '');
}

function extractNav(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  const main = [];
  const sub = [];
  let m;
  const reH3 = /<h3[^>]*><a[^>]*href=['"]([^'"]+)['"]/gi;
  const reLi = /<li class="subclass"><a[^>]*href=['"]([^'"]+)['"]/gi;
  while ((m = reH3.exec(box[1]))) main.push(normHref(m[1]));
  while ((m = reLi.exec(box[1]))) sub.push(normHref(m[1]));
  return { main, sub };
}

function extractCards(html) {
  const cards = [];
  const re = /<div class="cp_box_one">([\s\S]*?)<\/div>\s*<div class="cp_box_one">|<div class="cp_box_one">([\s\S]*?)<div class="clear"><\/div>\s*<\/div>\s*<div class="pages">/gi;
  let m;
  const blockRe = /<div class="cp_box_one">([\s\S]*?)(?=<div class="cp_box_one">|<div class="clear"><\/div>\s*<\/div>\s*<div class="pages">)/gi;
  while ((m = blockRe.exec(html))) {
    const block = m[1];
    const hrefM = block.match(/class="more"[^>]*href=['"]([^'"]+)['"]/i) ||
      block.match(/<a[^>]*class="more"[^>]*href=['"]([^'"]+)['"]/i) ||
      block.match(/<A[^>]*href=['"]([^'"]+)['"][^>]*>[\s\S]*?<\/A><\/h4>/i);
    if (hrefM) cards.push(normHref(hrefM[1]));
  }
  return cards;
}

const refHtml = fs.readFileSync(REF, 'utf8');
const refNav = extractNav(refHtml);
const refCards = extractCards(refHtml);

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const navIssues = [];
const cardIssues = [];
const weirdNav = [];

const productFiles = [];
walk(path.join(root, 'product'), productFiles);

for (const f of productFiles) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const nav = extractNav(html);
  if (!nav) continue;

  if (nav.main.join('|') !== refNav.main.join('|')) {
    navIssues.push(rel);
  }
  if (nav.sub.length && nav.sub.join('|') !== refNav.sub.join('|')) {
    navIssues.push(rel + ' (sub)');
  }

  // Detect h3/sub_bx structure breaks: sub_bx before first h3, or between wrong h3s
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i)[1];
  const chunks = box.split(/<h3/i);
  for (let i = 1; i < chunks.length; i++) {
    const part = chunks[i];
    const ulCount = (part.match(/<ul class="sub_bx">/g) || []).length;
    if (ulCount > 1) weirdNav.push({ file: rel, issue: 'multiple sub_bx in one h3 block' });
  }

  const cards = extractCards(html);
  if (cards.length > 1 && rel !== 'product/index.html') {
    // category pages should have their own order - skip comparing to product index
  }
}

// Find pages where main nav order is unique/wrong vs ref
const orderCounts = new Map();

for (const f of productFiles) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const nav = extractNav(html);
  if (!nav) continue;
  const key = nav.main.join('|');
  orderCounts.set(key, (orderCounts.get(key) || 0) + 1);
}

console.log('Reference main order:', refNav.main.length, 'items');
console.log('Reference sub order:', refNav.sub.length, 'items');
console.log('Pages with different MAIN order than product/index:', navIssues.filter((x) => !x.includes('(sub)')).length);
console.log('Pages with different SUB order:', navIssues.filter((x) => x.includes('(sub)')).length);
console.log('Distinct main orders across site:', orderCounts.size);
[...orderCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([k, c]) => console.log(c, 'pages', k.split('|').slice(0, 3).join(' | ')));

// Sample wrong-order page
if (navIssues.length) {
  const sample = navIssues.find((x) => !x.includes('(sub)')) || navIssues[0];
  const nav = extractNav(fs.readFileSync(path.join(root, sample.replace(' (sub)', '')), 'utf8'));
  console.log('\nSample diff', sample);
  for (let i = 0; i < refNav.main.length; i++) {
    if (refNav.main[i] !== nav.main[i]) {
      console.log(i, 'ref:', refNav.main[i], 'got:', nav.main[i]);
    }
  }
}

console.log('weird structure:', weirdNav.length);
