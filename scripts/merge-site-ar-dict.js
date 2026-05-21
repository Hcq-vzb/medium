/**
 * Merge glossary + site strings into full EN->AR dictionary (aggressive phrase + word pass).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const glossary = Object.assign(
  {},
  require('./i18n-glossary-overrides'),
  require('./i18n-ui-terms')
);
const wordFallback = require('./ar-en-word-fallback');

function loadDictFile() {
  const p = path.join(root, 'statics/js/kiwl-i18n-core-ar.js');
  if (!fs.existsSync(p)) return {};
  try {
    const fn = new Function(
      'window',
      fs.readFileSync(p, 'utf8') + '; return window.KIWL_I18N_CORE_AR || {};'
    );
    return fn({}) || {};
  } catch (e) {
    return {};
  }
}

const PHRASES = [];
for (const zh of Object.keys(glossary)) {
  const en = (glossary[zh].en || '').trim();
  const ar = (glossary[zh].ar || '').trim();
  if (en && ar && en.length >= 2) PHRASES.push({ en, ar });
}
for (const en of Object.keys(wordFallback)) {
  PHRASES.push({ en, ar: wordFallback[en] });
}
PHRASES.sort((a, b) => b.en.length - a.en.length);

const KEEP_LATIN =
  /^(KIWL|PET|PLC|BPH|MPa|kW|Hz|mm|kg|ml|RMB|ISO|HMI|CIP|EDI|UHT|EN|AR|RSS|OMRON|Weintek|Airtac|Mitsubishi|Siemens|Schneider|Omron|Panasonic|Autonics|CSD|RCGF|BPH)$/i;

function translateText(enText) {
  let out = (enText || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  if (!out) return out;
  for (const { en, ar } of PHRASES) {
    if (!en || en.length < 2) continue;
    if (out.indexOf(en) !== -1) out = out.split(en).join(ar);
  }
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

function isGoodPair(en, ar) {
  if (!en || !ar || en === ar) return false;
  if (en.length < 2) return false;
  const arChars = (ar.match(/[\u0600-\u06FF]/g) || []).length;
  if (arChars < 2 && en.length > 8) return false;
  const latin = (ar.match(/[A-Za-z]{3,}/g) || []).filter((w) => !KEEP_LATIN.test(w));
  if (latin.length > 3 && en.length > 30) return false;
  return true;
}

function walkHtml(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'scripts') continue;
      walkHtml(p, list);
    } else if (/\.html?$/i.test(name)) list.push(p);
  }
}

function collectFromHtml(html, bag) {
  const add = (s) => {
    s = (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    if (s.length < 2 || !/[A-Za-z]/.test(s)) return;
    bag.add(s);
  };
  const t = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (t) add(t[1]);
  for (const m of html.matchAll(
    /<meta[^>]+name=["'](?:description|keywords)["'][^>]+content=["']([^"']*)["']/gi
  )) {
    add(m[1]);
  }
  for (const m of html.matchAll(
    /(?:title|alt|placeholder|aria-label)=["']([^"']{3,})["']/gi
  )) {
    add(m[1]);
  }
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n');
  for (const p of text.split(/\n+/)) {
    const s = p.trim();
    if (!s || s.length > 5000) continue;
    add(s);
    if (s.length > 25 && s.length < 1200) {
      for (const sent of s.split(/(?<=[.!?])\s+/)) add(sent.trim());
    }
  }
}

const enToAr = loadDictFile();
let added = 0;

/* Force high-quality phrase overrides */
for (const en of Object.keys(wordFallback)) {
  const ar = wordFallback[en];
  if (en.length >= 12 && (ar.match(/[\u0600-\u06FF]/g) || []).length >= 8) {
    enToAr[en] = ar;
  }
}

const bag = new Set();
const files = [];
walkHtml(root, files);
for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (rel.startsWith('statics/ckeditor')) continue;
  collectFromHtml(fs.readFileSync(f, 'utf8'), bag);
}

for (const en of bag) {
  if (wordFallback[en] && (wordFallback[en].match(/[\u0600-\u06FF]/g) || []).length >= 6) {
    if (enToAr[en] !== wordFallback[en]) {
      enToAr[en] = wordFallback[en];
      added++;
    }
    continue;
  }
  const ar = translateText(en);
  if (!isGoodPair(en, ar)) continue;
  const latinLeft = (ar.match(/\b[A-Za-z]{4,}\b/g) || []).filter((w) => !KEEP_LATIN.test(w));
  if (latinLeft.length > 2 && en.length > 40) continue;
  if (!enToAr[en]) {
    enToAr[en] = ar;
    added++;
  }
}

const out =
  '/* KIWL EN->AR — merged site dictionary */\n' +
  'window.KIWL_I18N_CORE_AR = ' +
  JSON.stringify(enToAr) +
  ';\n' +
  'window.KIWL_I18N_EN_AR = window.KIWL_I18N_CORE_AR;\n';

fs.writeFileSync(path.join(root, 'statics/js/kiwl-i18n-core-ar.js'), out, 'utf8');
fs.writeFileSync(path.join(root, 'statics/js/kiwl-i18n-en-ar.js'), out, 'utf8');

const wfOut =
  '/* KIWL runtime word fallback EN->AR */\n' +
  'window.KIWL_AR_WORD_FALLBACK = ' +
  JSON.stringify(wordFallback) +
  ';\n';
fs.writeFileSync(path.join(root, 'statics/js/kiwl-ar-word-fallback.js'), wfOut, 'utf8');
console.log('Total keys:', Object.keys(enToAr).length, 'newly merged:', added);
