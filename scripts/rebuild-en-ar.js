const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dict = JSON.parse(
  fs.readFileSync(path.join(root, 'statics', 'js', 'kiwl-translations.json'), 'utf8')
);

const enToAr = {};
for (const zh of Object.keys(dict)) {
  const en = (dict[zh].en || '').replace(/\s+/g, ' ').trim();
  const ar = (dict[zh].ar || '').trim();
  if (en && ar && en !== ar) enToAr[en] = ar;
}

const EXTRA_EN_AR = {
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team. We integrate development, engineering, production, technical service and marketing for complete water, juice, carbonated beverage, spirits and beer filling lines. Our operations follow a modern quality management system with strict in-process control. Reliable equipment and responsive service have earned long-term customer trust. We continue to advance fully automated beverage production solutions. Our installed base spans more than 30 cities across China and export markets including the United States, Russia, Africa and South America. We are committed to meeting each customer\'s requirements...':
    'تقع مجموعة جيانغسو شين زيجينغ لتصنيع الآلات في تشانغجياجانغ بمقاطعة جيانغسو، مدينة ميناء رئيسية. بأصول تتجاوز 30 مليون يوان ومساحة تصنيع تزيد على 21000 م²، نمتلك فريق بحث وتطوير داخلي. ندمج التطوير والهندسة والإنتاج والخدمة الفنية والتسويق لخطوط المياه والعصائر والمشروبات الغازية والمشروبات الروحية والبيرة. نطبق نظام إدارة جودة حديثاً مع رقابة صارمة أثناء الإنتاج. معدات موثوقة وخدمة سريعة كسبت ثقة العملاء. نطور حلول إنتاج مشروبات أوتوماتيكية بالكامل. قاعدة عملائنا في أكثر من 30 مدينة صينية وأسواق تصدير تشمل الولايات المتحدة وروسيا وأفريقيا وأمريكا الجنوبية. نلتزم بتلبية متطلبات كل عميل...',
  'PET Juice & Carbonated Drink Monoblock Lines | 5-Gallon Water Filler | KIWL Machinery':
    'خطوط تعبئة PET للعصير والمشروبات الغازية | معبئ مياه 5 جالون | آلات KIWL',
  'Oil Filling Machine': 'آلة تعبئة الزيوت',
  'Water Filling Machine': 'آلة تعبئة المياه',
  'Featured Products': 'المنتجات المميزة',
  'Juice Filling Machine': 'آلة تعبئة العصير',
  'View More': 'عرض المزيد',
  'Gulf Food Expo Dubai 2016': 'معرض غذاء الخليج دبي 2016',
  'Canton Fair 2016': 'معرض كانتون 2016'
};

Object.assign(enToAr, EXTRA_EN_AR);

const js =
  '/* Auto-generated EN->AR map for kiwl lang switcher */\n' +
  'window.KIWL_I18N_EN_AR = ' +
  JSON.stringify(enToAr) +
  ';\n';
fs.writeFileSync(path.join(root, 'statics', 'js', 'kiwl-i18n-en-ar.js'), js, 'utf8');
console.log('Keys:', Object.keys(enToAr).length);
