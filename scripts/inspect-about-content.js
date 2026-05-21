const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const files = [
  'index.html',
  'about/index.html',
  'about/gongsijianjie/index.html',
];
const CO =
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd.';
for (const rel of files) {
  const h = fs.readFileSync(path.join(root, rel), 'utf8');
  const re = new RegExp(CO.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const n = (h.match(re) || []).length;
  console.log(rel, 'company count:', n, 'RMB:', h.includes('RMB'));
  const idx = h.indexOf('class="details"');
  if (idx >= 0) console.log(h.slice(idx, idx + 1200).replace(/\s+/g, ' ').slice(0, 800));
  const aidx = h.indexOf('id="index"');
  const about = h.indexOf('class="about"');
  if (about >= 0) {
    console.log('about section:', h.slice(about, about + 600).replace(/\s+/g, ' '));
  }
}
