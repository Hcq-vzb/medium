const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const layoutFixes = [];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(p, out);
    } else if (/\.html?$/i.test(name)) out.push(p);
  }
  return out;
}

const patterns = [
  [/<div\s+style="text-align:\s*center;"\s*>\s*<\/div>/gi, 'empty-center-div'],
  [/<div\s+style="text-align:\s*center;"\s*>\s*<br\s*\/?>\s*<\/div>/gi, 'center-br-only'],
  [
    /<div\s+style="text-align:\s*center;"\s*>\s*<br\s*\/?>\s*<div\s+style="text-align:\s*center;"\s*>\s*<br\s*\/?>\s*<div\s+style="text-align:\s*center;"\s*>\s*&nbsp;\s*<\/div>\s*<\/div>\s*<\/div>/gi,
    'nested-empty-center',
  ],
  [/<div\s+class="img"\s*>\s*<\/div>/gi, 'empty-img-div'],
];

for (const htmlPath of walk(root)) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  const orig = content;
  let fixes = 0;
  for (const [re, label] of patterns) {
    const before = content;
    content = content.replace(re, '');
    if (content !== before) fixes++;
  }
  if (content !== orig) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    layoutFixes.push({
      file: path.relative(root, htmlPath).replace(/\\/g, '/'),
      fixes,
    });
  }
}

console.log('Layout cleanup files:', layoutFixes.length);
console.log(JSON.stringify(layoutFixes, null, 2));
