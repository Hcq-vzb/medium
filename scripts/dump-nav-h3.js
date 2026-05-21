const fs = require('fs');
const f = process.argv[2];
const h = fs.readFileSync(f, 'utf8');
const box = h.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i)[1];
let i = 0;
for (const m of box.matchAll(/<h3 class="([^"]*)"><a[^>]*href=['"]([^'"]+)['"][^>]*title=['"]([^'"]*)['"]/gi)) {
  i++;
  console.log(i, m[1], m[3], m[2]);
}
