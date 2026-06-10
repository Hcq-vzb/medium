/**
 * Replace old kiwl-float-contact (WhatsApp + email icons) with kiwl-chat-widget loader.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const snippetPath = path.join(root, 'statics', 'snippets', 'kiwl-chat-widget.html');
const snippet = fs.readFileSync(snippetPath, 'utf8').trim();

const OLD_BLOCK =
  /<!-- kiwl-float-contact -->[\s\S]*?<div class="kiwl-float-contact"[\s\S]*?<\/div>\s*/gi;

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (['node_modules', 'scripts', 'docs'].includes(name)) continue;
      if (p.includes(path.join('statics', 'snippets'))) continue;
      walk(p, list);
    } else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const files = [];
walk(root, files);

let replaced = 0;
let inserted = 0;
let already = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const hadOld = OLD_BLOCK.test(html);
  OLD_BLOCK.lastIndex = 0;
  if (hadOld) {
    html = html.replace(OLD_BLOCK, snippet + '\n');
    replaced++;
  } else if (html.includes('kiwl-chat-widget')) {
    already++;
    continue;
  } else if (html.includes('</body>')) {
    html = html.replace(/<\/body>/i, snippet + '\n</body>');
    inserted++;
  } else {
    continue;
  }
  fs.writeFileSync(file, html, 'utf8');
}

console.log('Replaced old float contact:', replaced);
console.log('Inserted new widget:', inserted);
console.log('Already up to date:', already);
