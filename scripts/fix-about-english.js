const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const ABOUT_EN = [
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. (KIWL) is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team focused on beverage filling equipment.',
  'We integrate development, engineering, production, technical service and marketing for complete lines: water filling, juice filling, carbonated beverage filling, spirits and beer filling systems, tailored to customer capacity and layout requirements.',
  'Our operations follow a modern quality management system with strict in-process control. Reliable equipment build quality and responsive after-sales service have earned long-term trust from domestic and overseas customers.',
  'Our installed base spans more than 30 cities across China and export markets including the United States, Russia, Africa and South America. We supply monoblock fillers, glass bottle lines, large PET lines, purified and mineral water systems, and 5-gallon barrel filling equipment to leading beverage producers.',
  'From inquiry and layout design to installation commissioning and production-line technical support, KIWL is dedicated to helping customers achieve stable capacity, consistent filling accuracy, and efficient beverage production.'
];

const GARBLED_RE =
  /<div class="p">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const REPLACEMENT =
  '<div class="p">' +
  ABOUT_EN.map((p) => '<div>&nbsp; &nbsp;' + p + ' </div>').join(' ') +
  '</div> </div> </div> </div> </div>';

function fixFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('JiangsuZhangjiagang') && !html.includes('Fillingtechnology')) {
    return false;
  }
  const m = html.match(GARBLED_RE);
  if (!m) return false;
  html = html.replace(GARBLED_RE, REPLACEMENT);
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

function walk(dir) {
  let n = 0;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) n += walk(p);
    else if (name.endsWith('.html') && fixFile(p)) n++;
  }
  return n;
}

console.log('Fixed HTML files:', walk(root));
