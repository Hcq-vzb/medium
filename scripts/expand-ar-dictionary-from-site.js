/**
 * Extract English strings from all HTML + phrase-level EN->AR, merge into i18n dictionary.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const glossary = Object.assign(
  {},
  require('./i18n-glossary-overrides'),
  require('./i18n-ui-terms')
);

/* Build EN phrase list (longest first) for term replacement */
const PHRASES = [];
for (const zh of Object.keys(glossary)) {
  const en = (glossary[zh].en || '').trim();
  const ar = (glossary[zh].ar || '').trim();
  if (en && ar && en.length >= 2) PHRASES.push({ en, ar });
}
PHRASES.sort((a, b) => b.en.length - a.en.length);

function translateEnPhrase(enText) {
  let out = enText;
  for (const { en, ar } of PHRASES) {
    if (en.length < 2) continue;
    if (out.indexOf(en) !== -1) {
      out = out.split(en).join(ar);
    }
  }
  return out.replace(/\s+/g, ' ').trim();
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

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ');
}

const SKIP_EN = /^(KIWL|EN|AR|RSS|PLC|BPH|PET|MPa|kW|Hz|mm|kg|ml|RMB|ISO|HMI|CIP|EDI|UHT|OMRON|Weintek|Airtac|Mitsubishi|Siemens|Schneider|Omron|Panasonic|Autonics)$/i;

function collectFromHtml(html, bag) {
  const add = (s) => {
    s = (s || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    if (s.length < 3) return;
    if (!/[A-Za-z]/.test(s)) return;
    if (/^[\d\s.,:;|+\-–—\/\\()]+$/.test(s)) return;
    bag.add(s);
  };

  const t = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (t) add(t[1]);
  for (const m of html.matchAll(/<meta[^>]+name=["'](?:description|keywords)["'][^>]+content=["']([^"']*)["']/gi)) {
    add(m[1]);
  }
  for (const m of html.matchAll(/(?:title|alt|placeholder|aria-label)=["']([^"']{4,})["']/gi)) {
    add(m[1]);
  }

  const text = stripScripts(html).replace(/<[^>]+>/g, '\n');
  const parts = text.split(/\n+/);
  for (const p of parts) {
    const s = p.trim();
    if (s.length > 4000) continue;
    add(s);
    if (s.length > 20 && s.length < 800) {
      const sentences = s.split(/(?<=[.!?])\s+/);
      for (const sent of sentences) add(sent.trim());
    }
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

let enToAr = {};
try {
  const js = fs.readFileSync(path.join(root, 'statics/js/kiwl-i18n-core-ar.js'), 'utf8');
  const fn = new Function('window', js + '; return window.KIWL_I18N_CORE_AR || {};');
  enToAr = fn({}) || {};
} catch (e) {
  console.warn('Load core dict failed:', e.message);
}

let added = 0;
for (const en of bag) {
  if (enToAr[en]) continue;
  const ar = translateEnPhrase(en);
  const latin = (ar.match(/[A-Za-z]/g) || []).length;
  const arChars = (ar.match(/[\u0600-\u06FF]/g) || []).length;
  if (ar === en) continue;
  if (arChars < 3 && en.length > 15) continue;
  if (latin > Math.max(15, ar.length * 0.45)) continue;
  enToAr[en] = ar;
  added++;
}

const out =
  '/* KIWL EN->AR — site-expanded dictionary */\n' +
  'window.KIWL_I18N_CORE_AR = ' +
  JSON.stringify(enToAr) +
  ';\n' +
  'window.KIWL_I18N_EN_AR = window.KIWL_I18N_CORE_AR;\n';

fs.writeFileSync(path.join(root, 'statics/js/kiwl-i18n-core-ar.js'), out, 'utf8');
fs.writeFileSync(path.join(root, 'statics/js/kiwl-i18n-en-ar.js'), out, 'utf8');
console.log('Dictionary keys:', Object.keys(enToAr).length, 'newly added:', added);
