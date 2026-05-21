const fs = require('fs');
const path = require('path');
const { translateZhToEn, translateZhToAr } = require('./build-offline-dict');

const root = path.join(__dirname, '..');
const remaining = JSON.parse(fs.readFileSync(path.join(__dirname, 'remaining-cn.json'), 'utf8'));

const pairs = remaining
  .map((zh) => {
    const en = translateZhToEn(zh);
    const ar = translateZhToAr(zh, en);
    return [zh, en, ar];
  })
  .filter(([zh, en]) => {
    if (!en || zh === en) return false;
    const zc = (zh.match(/[\u4e00-\u9fff]/g) || []).length;
    const ec = (en.match(/[\u4e00-\u9fff]/g) || []).length;
    return ec < zc || ec === 0;
  })
  .sort((a, b) => b[0].length - a[0].length);

console.log('Replaceable pairs:', pairs.length, 'of', remaining.length);

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
  const en = dict[k].en;
  const ar = dict[k].ar;
  if (en && ar && en !== ar) enToAr[en] = ar;
}
fs.writeFileSync(
  path.join(root, 'statics/js/kiwl-i18n-en-ar.js'),
  '/* Auto-generated EN->AR map */\nwindow.KIWL_I18N_EN_AR = ' + JSON.stringify(enToAr) + ';\n',
  'utf8'
);

console.log('Updated', files, 'files,', reps, 'replacements');
