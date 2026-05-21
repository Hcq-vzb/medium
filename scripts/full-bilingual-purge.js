/**
 * Full-site bilingual purge: remove 100% Chinese from HTML, output EN + rebuild AR map.
 * Does NOT modify CSS/layout/links/src paths.
 */
const fs = require('fs');
const path = require('path');
const OVERRIDES = require('./i18n-glossary-overrides');
const UI_TERMS = require('./i18n-ui-terms');
const { translateZhToEn, translateZhToAr } = require('./build-offline-dict');

const root = path.join(__dirname, '..');
const dictPath = path.join(root, 'statics', 'js', 'kiwl-translations.json');
const enArPath = path.join(root, 'statics', 'js', 'kiwl-i18n-en-ar.js');

const MERGED = { ...OVERRIDES, ...UI_TERMS };
let dict = {};
if (fs.existsSync(dictPath)) {
  try {
    const old = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    for (const zh of Object.keys(old)) {
      MERGED[zh] = { en: old[zh].en, ar: old[zh].ar };
    }
  } catch (e) {
    /* ignore */
  }
}

const CJK_BLOCK =
  /[\u4e00-\u9fff][\u4e00-\u9fff\s\dA-Za-z，。、；：！？（）【】《》""''·—\.\,\-\+\%\&\|｜\/\:\;\(\)\[\]]*[\u4e00-\u9fff]|[\u4e00-\u9fff]+/g;

function collapseCjkWhitespace(html) {
  let prev;
  let out = html;
  do {
    prev = out;
    out = out.replace(/([\u4e00-\u9fff])\s+/g, '$1');
    out = out.replace(/\s+([\u4e00-\u9fff])/g, '$1');
  } while (out !== prev);
  return out;
}

function translateSegment(zh) {
  const t = zh.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (MERGED[t]) return MERGED[t].en;
  let en = translateZhToEn(t);
  if (MERGED[t]) en = MERGED[t].en;
  if (/[\u4e00-\u9fff]/.test(en)) {
    en = en.replace(/[\u4e00-\u9fff]/g, '');
    en = en
      .replace(/\s{2,}/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/\.\s*\./g, '.')
      .replace(/:\s*,/g, ':')
      .replace(/^\s*[,.\-:;]\s*/g, '')
      .replace(/\s*[,.\-:;]\s*$/g, '')
      .trim();
  }
  return en || '';
}

function translateSegmentAr(zh, en) {
  const t = zh.replace(/\s+/g, ' ').trim();
  if (MERGED[t]) return MERGED[t].ar;
  return translateZhToAr(t, en);
}

function purgeCjkInText(text) {
  return text.replace(CJK_BLOCK, (match) => {
    const en = translateSegment(match);
    if (!dict[match]) {
      dict[match] = { en, ar: translateSegmentAr(match, en) };
    }
    return en;
  });
}

function processHtml(html) {
  let out = collapseCjkWhitespace(html);

  const keys = Object.keys(MERGED).sort((a, b) => b.length - a.length);
  for (const zh of keys) {
    const en = MERGED[zh].en;
    if (!en || zh === en) continue;
    out = out.split(zh).join(en);
    if (!dict[zh]) dict[zh] = { en, ar: MERGED[zh].ar };
  }

  out = purgeCjkInText(out);

  out = out.replace(/<title([^>]*)>([^<]*)<\/title>/gi, (_, attrs, body) => {
    return '<title' + attrs + '>' + purgeCjkInText(body) + '</title>';
  });

  out = out.replace(
    /\b(title|alt|placeholder|aria-label|content|value)=("([^"]*)"|'([^']*)')/gi,
    (m, attr, _q, d1, d2) => {
      const val = d1 || d2 || '';
      if (!/[\u4e00-\u9fff]/.test(val)) return m;
      const en = purgeCjkInText(val);
      return attr + '="' + en.replace(/"/g, '&quot;') + '"';
    }
  );

  out = out.replace(/>([^<]+)</g, (m, text) => {
    if (!/[\u4e00-\u9fff]/.test(text)) return m;
    return '>' + purgeCjkInText(text) + '<';
  });

  return out;
}

function walkHtml(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

function countCjk(s) {
  return (s.match(/[\u4e00-\u9fff]/g) || []).length;
}

let files = 0;
for (const file of walkHtml(root)) {
  const raw = fs.readFileSync(file, 'utf8');
  const out = processHtml(raw);
  if (out !== raw) {
    fs.writeFileSync(file, out, 'utf8');
    files++;
  }
}

let totalCjk = 0;
let filesWithCjk = 0;
for (const file of walkHtml(root)) {
  const n = countCjk(fs.readFileSync(file, 'utf8'));
  if (n > 0) {
    filesWithCjk++;
    totalCjk += n;
  }
}

const enToAr = {};
for (const zh of Object.keys(dict)) {
  const en = (dict[zh].en || '').replace(/\s+/g, ' ').trim();
  const ar = (dict[zh].ar || '').trim();
  if (en && ar && en !== ar && !/[\u4e00-\u9fff]/.test(en)) {
    enToAr[en] = ar;
  }
}

for (const zh of Object.keys(MERGED)) {
  const en = MERGED[zh].en;
  const ar = MERGED[zh].ar;
  if (en && ar) enToAr[en] = ar;
}

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 0), 'utf8');
fs.writeFileSync(
  enArPath,
  '/* KIWL EN->AR map - auto-generated */\nwindow.KIWL_I18N_EN_AR = ' +
    JSON.stringify(enToAr) +
    ';\n',
  'utf8'
);

console.log('Updated HTML files:', files);
console.log('Remaining CJK: files=', filesWithCjk, 'chars=', totalCjk);
console.log('Dictionary entries:', Object.keys(dict).length);
console.log('EN->AR keys:', Object.keys(enToAr).length);
