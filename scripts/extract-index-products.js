const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

const classM = h.match(/class_bx[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
if (classM) {
  const items = [...classM[1].matchAll(/<a[^>]*title=['"]([^'"]*)['"][^>]*href=['"]([^'"]*)['"]/gi)];
  console.log('=== Homepage class_bx ===', items.length);
  items.forEach((x, i) => console.log(i + 1, x[1]));
}

const prodM = h.match(/id="index"[\s\S]*?class="products"[\s\S]*?<div class="cp_cont">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div id="youshi"/i);
if (prodM) {
  const re =
    /<div class="cp_box_one">([\s\S]*?)(?=<div class="cp_box_one">|<div class="clear">)/gi;
  let m;
  const titles = [];
  while ((m = re.exec(prodM[1]))) {
    const t = m[1].match(/<h4[^>]*>[\s\S]*?title=['"]([^'"]+)['"]/i);
    titles.push(t ? t[1] : '?');
  }
  console.log('\n=== Homepage featured cards ===', titles.length);
  titles.forEach((t, i) => console.log(i + 1, t));
}
