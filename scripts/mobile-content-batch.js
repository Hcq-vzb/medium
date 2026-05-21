/**
 * Mobile content fixes: USD assets wording, dedupe company name on homepage.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CO = 'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd.';
const RMB_OLD = 'over 4.2 million USD in total assets';
const USD_NEW = 'over 4.2 million USD in total assets';
const DUP_PREFIX =
  CO + '-' + CO;
const DUP_FIX = CO + ' (KIWL)';

const TEXT_EXTS = new Set(['.html', '.js', '.json']);

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (p.includes(path.join('scripts', 'node_modules'))) continue;
      walk(p, list);
    } else {
      const ext = path.extname(name).toLowerCase();
      if (TEXT_EXTS.has(ext)) list.push(p);
    }
  }
}

const files = [];
walk(root, files);

let rmb = 0;
let dup = 0;

for (const file of files) {
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (s.includes(RMB_OLD)) {
    s = s.split(RMB_OLD).join(USD_NEW);
    rmb++;
    changed = true;
  }
  if (s.includes(DUP_PREFIX)) {
    s = s.split(DUP_PREFIX).join(DUP_FIX);
    dup++;
    changed = true;
  }
  if (changed) fs.writeFileSync(file, s, 'utf8');
}

console.log('RMB→USD files:', rmb, 'Homepage dedupe:', dup);
