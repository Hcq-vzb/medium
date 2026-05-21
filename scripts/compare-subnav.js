const fs = require('fs');
const ref = fs.readFileSync('product/tuijianchanpin/index.html', 'utf8');
const box = ref.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/)[1];
const subs = [...box.matchAll(/<li class="subclass"><a[^>]*href=['"]([^'"]+)['"][^>]*title=['"]([^'"]*)['"]/gi)];
console.log('REF sub count', subs.length);
subs.forEach((m, i) => console.log(i, m[1], m[2]));

const page = fs.readFileSync('product/tuijianchanpin/10.html', 'utf8');
const box2 = page.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/)[1];
const subs2 = [...box2.matchAll(/<li class="subclass"><a[^>]*href=['"]([^'"]+)['"][^>]*title=['"]([^'"]*)['"]/gi)];
console.log('\n10.html sub count', subs2.length);
subs2.forEach((m, i) => console.log(i, m[1], m[2]));
