/**
 * Batch translate zh-strings-raw.json -> kiwl-translations.json (en + ar)
 * Uses glossary overrides first, then @vitalets/google-translate-api
 */
const fs = require('fs');
const path = require('path');

const OVERRIDES = require('./i18n-glossary-overrides');
const STRINGS = JSON.parse(fs.readFileSync(path.join(__dirname, 'zh-strings-raw.json'), 'utf8'));
const OUT = path.join(__dirname, '..', 'statics', 'js', 'kiwl-translations.json');
const CACHE = path.join(__dirname, 'translate-cache.json');

const DELAY_MS = 120;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function applyTermFix(text, lang) {
  if (!text) return text;
  let t = text;
  const fixes =
    lang === 'en'
      ? [
          [/filling machine machine/gi, 'filling machine'],
          [/bottle bottle/gi, 'bottle'],
          [/KIWL Machinery Machinery/gi, 'KIWL Machinery'],
          [/Monoblock Block/gi, 'Monoblock'],
          [/5 gallon-gallon/gi, '5-gallon'],
          [/BPH\/hour/gi, 'BPH'],
          [/bottles\/hour\/hour/gi, 'BPH']
        ]
      : [
          [/آلة آلة/g, 'آلة'],
          [/تعبئة تعبئة/g, 'تعبئة']
        ];
  for (const [re, rep] of fixes) t = t.replace(re, rep);
  return t.trim();
}

async function translateText(text, to) {
  const { translate } = await import('@vitalets/google-translate-api');
  const res = await translate(text, { from: 'zh-CN', to });
  return applyTermFix(res.text, to);
}

async function main() {
  let cache = {};
  if (fs.existsSync(CACHE)) {
    try {
      cache = JSON.parse(fs.readFileSync(CACHE, 'utf8'));
    } catch (e) {
      cache = {};
    }
  }

  const dict = {};
  let done = 0;
  const total = STRINGS.length;

  for (const zh of STRINGS) {
    if (OVERRIDES[zh]) {
      dict[zh] = { en: OVERRIDES[zh].en, ar: OVERRIDES[zh].ar };
      done++;
      continue;
    }
    if (cache[zh] && cache[zh].en && cache[zh].ar) {
      dict[zh] = cache[zh];
      done++;
      continue;
    }

    try {
      const en = await translateText(zh, 'en');
      await sleep(DELAY_MS);
      const ar = await translateText(zh, 'ar');
      await sleep(DELAY_MS);
      dict[zh] = { en, ar };
      cache[zh] = dict[zh];
      done++;
      if (done % 20 === 0) {
        fs.writeFileSync(CACHE, JSON.stringify(cache, null, 0), 'utf8');
        console.log(`Progress: ${done}/${total}`);
      }
    } catch (err) {
      console.error('FAIL:', zh.slice(0, 60), err.message);
      dict[zh] = cache[zh] || { en: zh, ar: zh };
    }
  }

  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 0), 'utf8');
  fs.writeFileSync(OUT, JSON.stringify(dict, null, 0), 'utf8');
  console.log('Wrote', OUT, 'entries:', Object.keys(dict).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
