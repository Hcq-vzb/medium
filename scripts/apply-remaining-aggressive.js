const fs = require('fs');
const path = require('path');
const { translateZhToEn, translateZhToAr } = require('./build-offline-dict');

const root = path.join(__dirname, '..');
const remaining = JSON.parse(fs.readFileSync(path.join(__dirname, 'remaining-cn.json'), 'utf8'));

const pairs = remaining
  .map((zh) => [zh, translateZhToEn(zh), translateZhToAr(zh, translateZhToEn(zh))])
  .filter(([zh, en]) => zh !== en && en)
  .sort((a, b) => b[0].length - a[0].length);

console.log('Aggressive pairs:', pairs.length);

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'scripts' || name === 'node_modules') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html$/i.test(name)) list.push(p);
  }
  return list;
}

let files = 0;
let reps = 0;
for (const file of walk(root)) {
  let raw = fs.readFileSync(file, 'utf8');
  const orig = raw;
  for (const [zh, en] of pairs) {
    const n = raw.split(zh).length - 1;
    if (n > 0) {
      raw = raw.split(zh).join(en);
      reps += n;
    }
  }
  if (raw !== orig) {
    fs.writeFileSync(file, raw, 'utf8');
    files++;
  }
}

const dict = JSON.parse(fs.readFileSync(path.join(root, 'statics/js/kiwl-translations.json'), 'utf8'));
for (const [zh, en, ar] of pairs) dict[zh] = { en, ar };
fs.writeFileSync(path.join(root, 'statics/js/kiwl-translations.json'), JSON.stringify(dict, null, 0));

const enToAr = {};
for (const k of Object.keys(dict)) {
  if (dict[k].en && dict[k].ar) enToAr[dict[k].en] = dict[k].ar;
}
fs.writeFileSync(
  path.join(root, 'statics/js/kiwl-i18n-en-ar.js'),
  'window.KIWL_I18N_EN_AR = ' + JSON.stringify(enToAr) + ';\n',
  'utf8'
);

console.log('Updated', files, 'files,', reps, 'replacements');
