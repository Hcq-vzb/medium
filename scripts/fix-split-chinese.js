/**
 * Collapse whitespace between CJK characters (HTTrack line breaks), then re-apply translations.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dictPath = path.join(root, 'statics', 'js', 'kiwl-translations.json');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
const zhKeys = Object.keys(dict).sort((a, b) => b.length - a.length);

function collapseCjk(html) {
  let prev;
  let out = html;
  do {
    prev = out;
    out = out.replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, '$1$2');
  } while (out !== prev);
  return out;
}

const EXTRA = {
  '江苏鑫紫鲸机械制造集团有限公司坐落于新兴港口城市-张家港。公司总资产超过3000万，厂房面积超过21000平米，我司拥有自己的研发团队。我司在生产整条水灌装线、 果汁灌装线、碳酸饮料灌装线、酒灌装线、啤酒灌装线方面，我司集发展、设计、生产、技术服务、市场为一体。 我司严格执行现代化企业管理体系，生产过程中严格管控质量。高质量的产品和较好的服务赢得了客户的一致认可。结合国内形势，我们开发出了饮料设备全面自动化的技术，自动化 程度很高。现在我们的客户遍布国内的30多个城市、也遍布美国、俄罗斯、非洲、南美州...... 我们竭力满足我们客户的各': {
    en: 'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. is located in Zhangjiagang, a major port city. With over 4.2 million USD in total assets and more than 21,000 m² of factory space, we maintain our own R&D team. We integrate development, design, manufacturing, technical service and marketing for complete water, juice, carbonated beverage, spirits and beer filling lines. We operate under a modern enterprise management system with strict in-process quality control. High-quality products and reliable service have earned consistent customer recognition. In line with market trends, we have developed highly automated beverage equipment solutions. Our customers span more than 30 cities in China and export markets including the United States, Russia, Africa and South America. We strive to meet every customer requirement...',
    ar: 'تقع مجموعة جيانغسو شين زيجينغ لتصنيع الآلات في مدينة ميناء تشانغجياجانغ. بأصول تتجاوز 30 مليون يوان ومساحة مصانع تزيد على 21000 م²، نمتلك فريقاً للبحث والتطوير. ندمج التطوير والتصميم والإنتاج والخدمة الفنية والتسويق لخطوط تعبئة المياه والعصائر والمشروبات الغازية والمشروبات الروحية والبيرة. نطبق نظام إدارة حديثاً مع رقابة جودة صارمة أثناء الإنتاج. منتجات عالية الجودة وخدمة موثوقة حصلت على اعتراف العملاء. طورنا حلول معدات مشروبات أوتوماتيكية بالكامل. عملاؤنا في أكثر من 30 مدينة صينية وأسواق التصدير بما فيها الولايات المتحدة وروسيا وأفريقيا وأمريكا الجنوبية. نسعى لتلبية متطلبات كل عميل...'
  }
};
Object.assign(dict, EXTRA);
zhKeys.unshift(...Object.keys(EXTRA));

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

let files = 0;
let reps = 0;
for (const file of walk(root)) {
  let raw = fs.readFileSync(file, 'utf8');
  const orig = raw;
  raw = collapseCjk(raw);
  for (const zh of zhKeys) {
    const en = dict[zh].en;
    if (!en || zh === en) continue;
    const n = raw.split(zh).length - 1;
    if (n > 0) {
      raw = raw.split(zh).join(en);
      reps += n;
    }
  }
  if (raw !== orig) {
    fs.writeFileSync(file, raw, 'utf8');
    files++;
  }
}

const enToAr = {};
for (const zh of Object.keys(dict)) {
  const en = dict[zh].en;
  const ar = dict[zh].ar;
  if (en && ar && en !== ar) enToAr[en] = ar;
}
const js =
  '/* Auto-generated EN->AR map for kiwl lang switcher */\n' +
  'window.KIWL_I18N_EN_AR = ' +
  JSON.stringify(enToAr) +
  ';\n';
fs.writeFileSync(path.join(root, 'statics', 'js', 'kiwl-i18n-en-ar.js'), js, 'utf8');
fs.writeFileSync(dictPath, JSON.stringify(dict, null, 0), 'utf8');

console.log('Fixed', files, 'files,', reps, 'extra replacements');
console.log('EN->AR keys:', Object.keys(enToAr).length);
