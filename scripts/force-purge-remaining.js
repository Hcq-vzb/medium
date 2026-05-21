const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const purgeScript = path.join(__dirname, 'full-bilingual-purge.js');

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

const OVERRIDES = Object.assign(
  {},
  require('./i18n-glossary-overrides'),
  require('./i18n-ui-terms')
);
const keys = Object.keys(OVERRIDES).sort((a, b) => b.length - a.length);

let n = 0;
for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!/[\u4e00-\u9fff]/.test(html)) continue;
  const orig = html;
  for (const zh of keys) {
    const en = OVERRIDES[zh].en;
    if (en && zh !== en) html = html.split(zh).join(en);
  }
  html = html.replace(/[\u4e00-\u9fff]+/g, (m) => {
    const map = OVERRIDES[m];
    if (map && map.en) return map.en;
    return '';
  });
  html = html
    .replace(/\s{2,}/g, ' ')
    .replace(/,\s*,/g, ',')
    .replace(/>\s+</g, '><');
  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    n++;
  }
}

console.log('Force-updated', n, 'files');
execSync('node "' + purgeScript + '"', { stdio: 'inherit', cwd: __dirname });
