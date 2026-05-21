const fs = require('fs');
const f = 'about/gongsihuanjing/index.html';
const ABOUT_EN = [
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. (KIWL) is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team focused on beverage filling equipment.',
  'We integrate development, engineering, production, technical service and marketing for complete lines: water filling, juice filling, carbonated beverage filling, spirits and beer filling systems, tailored to customer capacity and layout requirements.',
  'Our operations follow a modern quality management system with strict in-process control. Reliable equipment build quality and responsive after-sales service have earned long-term trust from domestic and overseas customers.',
  'Our installed base spans more than 30 cities across China and export markets including the United States, Russia, Africa and South America. We supply monoblock fillers, glass bottle lines, large PET lines, purified and mineral water systems, and 5-gallon barrel filling equipment to leading beverage producers.',
  'From inquiry and layout design to installation commissioning and production-line technical support, KIWL is dedicated to helping customers achieve stable capacity, consistent filling accuracy, and efficient beverage production.'
];
let h = fs.readFileSync(f, 'utf8');
const idx = h.indexOf('JiangsuZhangjiagang');
if (idx === -1) {
  console.log('already clean');
  process.exit(0);
}
const start = h.lastIndexOf('<div class="p">', idx);
const end = h.indexOf('</div> </div> </div> </div> </div>', idx);
if (start < 0 || end < 0) {
  console.log('markers not found');
  process.exit(1);
}
const replacement =
  '<div class="p">' +
  ABOUT_EN.map((p) => '<div>&nbsp; &nbsp;' + p + ' </div>').join(' ') +
  '</div> </div> </div> </div> </div>';
h = h.slice(0, start) + replacement + h.slice(end + '</div> </div> </div> </div> </div>'.length);
fs.writeFileSync(f, h);
console.log('fixed');
