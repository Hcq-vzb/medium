const fs = require('fs');
const file = process.argv[2] || 'product/guozhiguanzhuangji/index.html';
const h = fs.readFileSync(file, 'utf8');
const re =
  /<div class="cp_box_one">([\s\S]*?)(?=<div class="cp_box_one">|<div class="clear"><\/div>\s*<\/div>\s*<div class="pages">)/gi;
let m;
const titles = [];
while ((m = re.exec(h))) {
  const h4 = m[1].match(/<h4[^>]*>[\s\S]*?title=['"]([^'"]+)['"]/i);
  titles.push(h4 ? h4[1] : '?');
}
console.log(file, titles.length);
titles.forEach((t, i) => console.log(i + 1, t));
