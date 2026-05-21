const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const m = h.match(/class_bx[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
if (!m) {
  console.log('no class_bx');
  process.exit(1);
}
const items = [...m[1].matchAll(/<a[^>]*title=['"]([^'"]*)['"][^>]*href=['"]([^'"]*)['"]/gi)];
console.log('Home class_bx count:', items.length);
items.forEach((x, i) => console.log(i + 1, x[1], x[2]));

const ref = fs.readFileSync('product/index.html', 'utf8');
const nav = [...ref.matchAll(/<h3[^>]*><a[^>]*title=['"]([^'"]*)['"]/gi)].map((x) => x[1]);
console.log('\nProduct nav h3 count:', nav.length);
nav.forEach((t, i) => console.log(i + 1, t));
