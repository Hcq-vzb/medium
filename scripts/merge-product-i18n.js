/**
 * Merge product-content-i18n.json into kiwl i18n dictionaries and lang.js section labels.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const productI18nPath = path.join(__dirname, 'product-content-i18n.json');

if (!fs.existsSync(productI18nPath)) {
  console.log('No product-content-i18n.json — skip');
  process.exit(0);
}

const productPairs = JSON.parse(fs.readFileSync(productI18nPath, 'utf8'));

// Regenerate clean i18n (includes glossary + legacy)
require('./build-clean-i18n-ar');

const corePath = path.join(root, 'statics', 'js', 'kiwl-i18n-core-ar.js');
const enArPath = path.join(root, 'statics', 'js', 'kiwl-i18n-en-ar.js');

function loadMap(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const m = src.match(/=\s*(\{[\s\S]*\})\s*;/);
  return m ? JSON.parse(m[1]) : {};
}

const core = loadMap(corePath);
const enAr = loadMap(enArPath);
let added = 0;

for (const [en, ar] of Object.entries(productPairs)) {
  if (!en || !ar || en === ar) continue;
  if (en.length < 4) continue;
  if (!core[en]) {
    core[en] = ar;
    added++;
  }
  enAr[en] = ar;
}

const coreJs =
  '/* KIWL clean EN->AR core dictionary (machinery trade terms) */\n' +
  'window.KIWL_I18N_CORE_AR = ' +
  JSON.stringify(core, null, 0) +
  ';\n';
const legacyJs =
  '/* KIWL EN->AR map (filtered) */\n' +
  'window.KIWL_I18N_EN_AR = ' +
  JSON.stringify(enAr, null, 0) +
  ';\n';

fs.writeFileSync(corePath, coreJs, 'utf8');
fs.writeFileSync(enArPath, legacyJs, 'utf8');

console.log('Merged product i18n pairs:', added, 'new keys into core dictionary');
console.log('Total EN->AR keys:', Object.keys(enAr).length);
