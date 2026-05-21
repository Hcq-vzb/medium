/**
 * Batch replace www.zjgjmx.cn (and protocol variants) in all .html files.
 * Target base: https://kiwlmachine.com/
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const NEW_BASE = 'https://kiwlmachine.com';

function replaceDomain(text) {
  let s = text;
  // Protocol + www domain first
  s = s.replace(/https?:\/\/www\.zjgjmx\.(?:cn|com)/gi, NEW_BASE);
  s = s.replace(/https?:\/\/zjgjmx\.(?:cn|com)/gi, NEW_BASE);
  // Bare www domain (.cn and legacy .com)
  s = s.replace(/www\.zjgjmx\.(?:cn|com)/gi, NEW_BASE);
  // Bare domain without www
  s = s.replace(/(?<![\w.-])zjgjmx\.(?:cn|com)/gi, NEW_BASE);
  // Fix double slashes after host (not in https://)
  s = s.replace(/https:\/\/kiwlmachine\.com\/\//g, 'https://kiwlmachine.com/');
  return s;
}

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name) && !/\.bak/i.test(name)) list.push(p);
  }
}

const files = [];
walk(root, files);

let changed = 0;
let totalReplacements = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  if (!/zjgjmx\.(?:cn|com)/i.test(before)) continue;
  const after = replaceDomain(before);
  if (after !== before) {
    const n = (before.match(/zjgjmx\.(?:cn|com)/gi) || []).length;
    fs.writeFileSync(file, after, 'utf8');
    changed++;
    totalReplacements += n;
  }
}

// Verify
let remaining = [];
for (const file of files) {
  const s = fs.readFileSync(file, 'utf8');
  if (/zjgjmx\.(?:cn|com)/i.test(s)) remaining.push(path.relative(root, file));
}

console.log('HTML files scanned:', files.length);
console.log('Files updated:', changed);
console.log('Old-domain occurrences replaced (approx):', totalReplacements);
console.log('Remaining files with zjgjmx.cn:', remaining.length);
if (remaining.length) {
  console.log(remaining.slice(0, 20).join('\n'));
}
