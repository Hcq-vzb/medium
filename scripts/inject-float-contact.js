/**
 * Inject kiwl-float-contact snippet before </body> on all HTML pages.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const snippetPath = path.join(root, 'statics', 'snippets', 'kiwl-float-contact.html');
const MARKER = 'kiwl-float-contact';
const snippet = fs.readFileSync(snippetPath, 'utf8').trim();

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

let updated = 0;
let skipped = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes(MARKER)) {
    skipped++;
    continue;
  }
  const bodyClose = /<\/body>/i;
  if (!bodyClose.test(html)) {
    console.warn('No </body>:', path.relative(root, file));
    continue;
  }
  html = html.replace(bodyClose, snippet + '\n</body>');
  fs.writeFileSync(file, html, 'utf8');
  updated++;
}

console.log('Injected:', updated, 'Already had snippet:', skipped, 'Total HTML:', files.length);
