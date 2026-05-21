/**
 * Simulate AR translation on key pages (dictionary + phrase replace) and report English residue.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const KEY_PAGES = [
  'index.html',
  'product/index.html',
  'about/index.html',
  'about/gongsijianjie/index.html',
  'contactus/index.html',
  'contactus/contacts/index.html',
  'message/index.html',
  'news/index.html',
  'jishuzhichi/index.html'
];

function loadDict() {
  const w = {};
  for (const f of ['kiwl-i18n-en-ar.js', 'kiwl-ar-word-fallback.js']) {
    const p = path.join(root, 'statics/js', f);
    if (!fs.existsSync(p)) continue;
    const fn = new Function('window', fs.readFileSync(p, 'utf8') + '; return window;');
    Object.assign(w, fn({}));
  }
  return Object.assign({}, w.KIWL_I18N_EN_AR || w.KIWL_I18N_CORE_AR || {}, w.KIWL_AR_WORD_FALLBACK || {});
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalize(s) {
  return (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

const KEEP_WORD =
  /^(KIWL|PET|PLC|BPH|MPa|kW|Hz|mm|kg|ml|RMB|ISO|HMI|CIP|EDI|UHT|EN|AR|RSS|OMRON|Weintek|Airtac|Mitsubishi|Siemens|Schneider|Omron|Panasonic|Autonics|cathy|kiwlmachine|com|http|https|www|Tel|Fax)$/i;

function translate(text, map, keys) {
  if (!text) return text;
  const norm = normalize(text);
  if (map[norm]) return map[norm];
  let out = text;
  for (const en of keys) {
    if (en.length < 3) continue;
    if (out.includes(en)) out = out.split(en).join(map[en]);
  }
  out = out.replace(/\b[A-Za-z][A-Za-z'&.\-/]{1,}\b/g, (w) => {
    if (KEEP_WORD.test(w)) return w;
    if (map[w]) return map[w];
    const lower = w.toLowerCase();
    if (map[lower]) return map[lower];
    const cap = lower.charAt(0).toUpperCase() + lower.slice(1);
    if (map[cap]) return map[cap];
    return w;
  });
  return out.replace(/\s{2,}/g, ' ').trim();
}

const map = loadDict();
const keys = Object.keys(map).sort((a, b) => b.length - a.length);
const EN_WORD = /\b[A-Za-z]{4,}\b/g;
const SKIP_WORD =
  /^(KIWL|PET|PLC|BPH|MPa|kW|Hz|mm|kg|ml|RMB|ISO|HMI|CIP|EDI|UHT|EN|AR|RSS|OMRON|Weintek|Airtac|Mitsubishi|Siemens|Schneider|Omron|Panasonic|Autonics|cathy|kiwlmachine|com|http|https|www|Tel|Fax|CATUR|PUTRA|MAKMUR|SEJAHTERA|TJEN|KHIN|YAU|PT|Mr|Mrs|Ms|Glen|Affric|Nairobi|Issa|LanGuang|Guangzhou|Yanjiang|Ethiopia|Dubai|Philippines|Thailand|Kenya|Indonesia|Yemen|Uzbekistan|BAHASHWAN|COOLING|SYSTEMS|mukalla|King|Representative|Central|Asia|Republics|Eldor|Yuldoshev|Tashkent|Intermach|Injection|molding|Blow|die|casting|Bangna|Complex|Unique|International|Bldg|Cordillera|Mandaluyong|Tramp|Business|Private|Limited|Nefas|Silk|Lafto|Sub|Addis|Ababa|AYUB|nbsp|R&D)$/i;
const results = [];

for (const rel of KEY_PAGES) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    results.push({ page: rel, status: 'skip', reason: 'file missing' });
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const hasLang = html.includes('lang.js') && html.includes('kiwl-i18n-core-ar.js');
  const hasRtl = /kiwl-lang:\s*early\s*dir/.test(html) || /dir\s*=\s*["']rtl["']/i.test(html);
  const text = stripTags(html);
  const ar = translate(text, map, keys);
  const words = [
    ...new Set(
      (ar.match(EN_WORD) || []).filter((w) => !SKIP_WORD.test(w)).slice(0, 30)
    )
  ];
  const latinRatio = (ar.replace(/[^\u0600-\u06FFa-zA-Z]/g, '').match(/[a-zA-Z]/g) || []).length /
    Math.max(1, (ar.replace(/[^\u0600-\u06FFa-zA-Z]/g, '').length || 1));
  results.push({
    page: rel,
    status: words.length === 0 ? 'pass' : 'warn',
    hasLang,
    hasRtl,
    englishWordsLeft: words.length,
    sampleWords: words.slice(0, 12),
    latinRatio: Number(latinRatio.toFixed(3))
  });
}

const outPath = path.join(root, 'docs', 'ar-verify-key-pages.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ at: new Date().toISOString(), results }, null, 2));

let pass = 0;
let warn = 0;
for (const r of results) {
  if (r.status === 'pass') pass++;
  else if (r.status === 'warn') warn++;
  console.log(
    r.page,
    r.status,
    'lang=' + r.hasLang,
    'rtlScript=' + r.hasRtl,
    'enWords=' + (r.englishWordsLeft || 0)
  );
}
console.log('Summary: pass', pass, 'warn', warn, 'skip', results.filter((x) => x.status === 'skip').length);
