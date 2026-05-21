/**
 * Build clean EN->AR dictionary (glossary + translations.json), filter corrupted entries.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const glossary = Object.assign(
  {},
  require('./i18n-glossary-overrides'),
  require('./i18n-ui-terms')
);

const dictPath = path.join(root, 'statics', 'js', 'kiwl-translations.json');
const dict = fs.existsSync(dictPath)
  ? JSON.parse(fs.readFileSync(dictPath, 'utf8'))
  : {};

const BAD_KEY =
  /, j, j|, \. ,|H\+OH-|EDIequipment|BeverageFilling\.|Machineproducts|Fillingindustry|ChinaFilling|, , ,|etc\. , etc|production \.|market \./;
const BAD_AR =
  /\b(operate|equipment|level|Easy|High|manufacturer|production|Filling|Beverage|Inverter|PLC|technology|market|enterprise)\b/i;

function isValidPair(en, ar) {
  if (!en || !ar || en === ar) return false;
  en = String(en).trim();
  ar = String(ar).trim();
  if (en.length < 2 && !/^\d+$/.test(en)) return false;
  if (BAD_KEY.test(en) || BAD_KEY.test(ar)) return false;
  if ((en.match(/,/g) || []).length >= 4 && en.length < 120) return false;
  if (en.length < 12 && /[,.]{2,}/.test(en)) return false;
  const latinInAr = (ar.match(/[A-Za-z]/g) || []).length;
  if (latinInAr > Math.max(12, ar.length * 0.22)) return false;
  if (BAD_AR.test(ar) && latinInAr > 8) return false;
  const arWords = (ar.match(/[\u0600-\u06FF]+/g) || []).join('');
  if (arWords.length < 3 && en.length > 20) return false;
  return true;
}

const enToAr = {};

for (const zh of Object.keys(glossary)) {
  const en = (glossary[zh].en || '').replace(/\s+/g, ' ').trim();
  const ar = (glossary[zh].ar || '').trim();
  if (isValidPair(en, ar)) enToAr[en] = ar;
}

/* Only import longer, well-formed sentences from legacy dict */
for (const zh of Object.keys(dict)) {
  const en = (dict[zh].en || '').replace(/\s+/g, ' ').trim();
  const ar = (dict[zh].ar || '').trim();
  if (en.length < 40) continue;
  if (!/[.!?…]$/.test(en) && en.length < 80) continue;
  if (isValidPair(en, ar)) enToAr[en] = ar;
}

const ABOUT_EN = [
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. (KIWL) is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team focused on beverage filling equipment.',
  'We integrate development, engineering, production, technical service and marketing for complete lines: water filling, juice filling, carbonated beverage filling, spirits and beer filling systems, tailored to customer capacity and layout requirements.',
  'Our operations follow a modern quality management system with strict in-process control. Reliable equipment build quality and responsive after-sales service have earned long-term trust from domestic and overseas customers.',
  'Our installed base spans more than 30 cities across China and export markets including the United States, Russia, Africa and South America. We supply monoblock fillers, glass bottle lines, large PET lines, purified and mineral water systems, and 5-gallon barrel filling equipment to leading beverage producers.',
  'From inquiry and layout design to installation commissioning and production-line technical support, KIWL is dedicated to helping customers achieve stable capacity, consistent filling accuracy, and efficient beverage production.'
];

const ABOUT_AR = [
  'تتخذ مجموعة جيانغسو شين زيجينغ لتصنيع الآلات المحدودة (KIWL) مقرها في تشانغجياجانغ بمقاطعة جيانغسو، إحدى المدن المينائية الرئيسية ذات اللوجستيات الدولية الميسرة. تتجاوز أصولنا 30 مليون يوان، ولدينا أكثر من 21,000 م² من مساحات التصنيع، مع فريق بحث وتطوير داخلي متخصص في معدات تعبئة المشروبات.',
  'ندمج التطوير والهندسة والإنتاج والخدمة الفنية والتسويق لتقديم خطوط متكاملة: تعبئة المياه، تعبئة العصائر، تعبئة المشروبات الغازية، وأنظمة تعبئة المشروبات الروحية والبيرة، وفق سعة العميل وتخطيط المصنع.',
  'تعمل شركتنا وفق نظام إدارة جودة حديث مع رقابة صارمة أثناء الإنتاج. جودة التصنيع الموثوقة وخدمة ما بعد البيع السريعة كسبتا ثقة عملائنا المحليين والدوليين على المدى الطويل.',
  'يمتد انتشار معداتنا إلى أكثر من 30 مدينة في الصين وأسواق التصدير بما في ذلك الولايات المتحدة وروسيا وأفريقيا وأمريكا الجنوبية. نورد خطوط التعبئة الأحادية، وخطوط الزجاجات، وخطوط PET الكبرى، وأنظمة المياه النقية والمعدنية، ومعدات تعبئة براميل 5 جالون لكبرى مصانع المشروبات.',
  'من الاستفسار وتصميم التخطيط إلى التشغيل والتكليف والدعم الفني لخط الإنتاج، تلتزم KIWL بمساعدة العملاء على تحقيق طاقة إنتاج مستقرة ودقة تعبئة ثابتة وكفاءة في إنتاج المشروبات.'
];

ABOUT_EN.forEach((en, i) => {
  enToAr[en] = ABOUT_AR[i];
});

const GARBLED = [
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. (KIWL) JiangsuZhangjiagang, Beverage, Filling equipment . , 21000, market , equipment , technology.',
  'Filling, Juice Filling, Carbonated DrinksFilling, etc. . , customer , Capacity, etc. , Fillingtechnology.',
  'enterprise . technology , Filling, etc. , production , FillingAccuracyproducts , customers.',
  'products , customer . market ; market , products , etc. , Beverageproduction enterprise.',
  'customer , technology , equipment Inquiry, Production Line Technical Support. We Dedicated to, customer Capacity.'
];
GARBLED.forEach((g, i) => {
  enToAr[g.replace(/\s+/g, ' ').trim()] = ABOUT_AR[i];
});

const FACILITIES_EN = [
  'The KIWL manufacturing campus in Zhangjiagang, Jiangsu covers more than 21,000 m², including machining, assembly, inspection and test areas dedicated to beverage filling and packaging lines.',
  'We operate CNC machining, welding, sheet-metal and assembly workshops with in-process quality checks and final equipment testing before shipment.',
  'Clean, organized production areas and experienced teams ensure stable build quality for monoblock fillers, water treatment skids, and complete beverage production lines.'
];
const FACILITIES_AR = [
  'يغطي مجمع تصنيع KIWL في تشانغجياجانغ بمقاطعة جيانغسو أكثر من 21,000 م²، ويشمل مناطق التشغيل والتجميع والفحص والاختبار المخصصة لخطوط تعبئة وتغليف المشروبات.',
  'نشغّل ورش التشغيل CNC واللحام والصفائح المعدنية والتجميع مع فحوصات جودة أثناء الإنتاج واختبارات نهائية للمعدات قبل الشحن.',
  'توفر مناطق الإنتاج النظيفة والمنظمة وفرقنا ذات الخبرة جودة تصنيع مستقرة لخطوط التعبئة الأحادية ووحدات معالجة المياه وخطوط إنتاج المشروبات المتكاملة.'
];
FACILITIES_EN.forEach((en, i) => {
  enToAr[en] = FACILITIES_AR[i];
});

const EXTRA = {
  'About Us': 'من نحن',
  'Company Profile': 'ملف الشركة',
  'Corporate Culture': 'ثقافة الشركة',
  'Development History': 'مسيرة التطور',
  'Certifications & Honors': 'الشهادات والجوائز',
  'Organization Structure': 'الهيكل التنظيمي',
  'Our Team': 'فريقنا',
  Facilities: 'مرافق الشركة',
  'Hot News': 'أخبار بارزة',
  'Latest Products': 'أحدث المنتجات',
  'You are here:': 'أنت هنا:',
  'You are here': 'أنت هنا',
  Home: 'الرئيسية',
  Mobile: 'جوال',
  Tel: 'هاتف',
  Fax: 'فاكس',
  Email: 'البريد الإلكتروني',
  'Contact Us:': 'اتصل بنا:',
  'All Rights Reserved': 'جميع الحقوق محفوظة',
  Sitemap: 'خريطة الموقع',
  'Global Service Hotline:': 'خط الخدمة العالمي:',
  'Dedicated to ideal filling and beverage production solutions':
    'ملتزمون بحلول مثالية لآلات التعبئة وإنتاج المشروبات',
  '15 years of R&D and manufacturing — products customized to your needs':
    '15 عاماً من البحث والتطوير والتصنيع — منتجات حسب الطلب',
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team. We integrate development, engineering, production, technical service and marketing for complete water, juice, carbonated beverage, spirits and beer filling lines. Our operations follow a modern quality management system with strict in-process control. Reliable equipment and responsive service have earned long-term customer trust. We continue to advance fully automated beverage production solutions. Our installed base spans more than 30 cities across China and export markets including the United States, Russia, Africa and South America. We are committed to meeting each customer\'s requirements...':
    'تقع مجموعة جيانغسو شين زيجينغ لتصنيع الآلات في تشانغجياجانغ بمقاطعة جيانغسو، مدينة ميناء رئيسية. بأصول تتجاوز 30 مليون يوان ومساحة تصنيع تزيد على 21,000 م²، نمتلك فريق بحث وتطوير داخلي. ندمج التطوير والهندسة والإنتاج والخدمة الفنية والتسويق لخطوط المياه والعصائر والمشروبات الغازية والمشروبات الروحية والبيرة. نطبق نظام إدارة جودة حديثاً مع رقابة صارمة أثناء الإنتاج. معدات موثوقة وخدمة سريعة كسبت ثقة العملاء. نطور حلول إنتاج مشروبات أوتوماتيكية بالكامل. قاعدة عملائنا في أكثر من 30 مدينة صينية وأسواق تصدير تشمل الولايات المتحدة وروسيا وأفريقيا وأمريكا الجنوبية. نلتزم بتلبية متطلبات كل عميل...',
  'Product Showcase': 'عرض المنتجات',
  'Product Range': 'سلسلة المنتجات',
  'Case Studies': 'دراسات الحالة',
  'Online Inquiry': 'استفسار عبر الإنترنت',
  'Video Gallery': 'معرض الفيديو',
  'Our Advantages': 'مزايانا',
  'Success Stories': 'قصص النجاح',
  'Global Network': 'الشبكة العالمية',
  'Company News': 'أخبار الشركة',
  'Industry News': 'أخبار الصناعة',
  'Industry Updates': 'مستجدات الصناعة',
  'Technical Support': 'الدعم الفني',
  'Support': 'الدعم الفني',
  'Video Center': 'مركز الفيديو',
  Downloads: 'التنزيلات',
  'Customer Reviews': 'آراء العملاء',
  'Customer Base': 'قاعدة العملاء',
  'Customer Photos': 'صور العملاء',
  'Contact Information': 'معلومات الاتصال',
  'Location Map': 'خريطة الموقع',
  'Featured Products': 'المنتجات المميزة',
  'Barrel Water Filling Machine': 'آلة تعبئة مياه البراميل',
  'Carbonated Beverage Filling Machine': 'آلة تعبئة المشروبات الغازية',
  'Water Treatment Equipment': 'معدات معالجة المياه',
  'Oil Filling Machine': 'آلة تعبئة الزيوت',
  'Beverage Pre-Treatment Equipment': 'معدات المعالجة المسبقة للمشروبات',
  'Packaging Machine': 'آلة التعبئة والتغليف',
  'Bottle Labeling Machine': 'آلة وضع ملصقات الزجاجات',
  'Ultra-Clean Rinse-Fill-Seal Monoblock': 'خط غسل-تعبئة-إغلاق فائق النظافة',
  'Blow-Fill-Cap Monoblock 12,000–54,000 BPH': 'خط نفخ-تعبئة-غطاء 12,000–54,000 زجاجة/ساعة',
  'View More': 'عرض المزيد',
  'Monoblock Filling Machine': 'آلة التعبئة الأحادية',
  'Glass Bottle Filling Machine': 'آلة تعبئة الزجاجات',
  'Large Bottle Water Filling Machine': 'آلة تعبئة الزجاجات الكبيرة',
  'Purified & Mineral Water Filling Machine': 'آلة تعبئة المياه النقية والمعدنية',
  'Juice Filler': 'آلة تعبئة العصير',
  'Carbonated Drink Filling Machine': 'آلة تعبئة المشروبات الغازية',
  '5-Gallon Barrel Water Filling Machine': 'آلة تعبئة مياه براميل 5 جالون',
  'Building 4, Xingyuan Road, Nanfeng Town, Zhangjiagang City, Jiangsu Province, China':
    'المبنى 4، طريق شينغيوان، بلدة نانفنغ، مدينة تشانغجياجانغ، مقاطعة جيانغسو، الصين',
  'PET Juice': 'عصير PET',
  'Carbonated Drinks': 'مشروبات غازية',
  'Carbonated Drink': 'مشروب غازي',
  '5-Gallon Barrel Water': 'مياه براميل 5 جالون',
  'KIWL Machinery': 'ماكينات KIWL',
  'Filling & Packaging Equipment': 'معدات التعبئة والتغليف',
  'Filling and Packaging Equipment': 'معدات التعبئة والتغليف',
  'Delivering innovative concepts': 'نقدّم مفاهيم مبتكرة',
  'innovative concepts': 'مفاهيم مبتكرة',
  'complete solutions': 'حلول متكاملة',
  'Hand Sanitizer': 'معقم اليدين',
  'Detergent Machine': 'آلة المنظفات',
  'Production Line': 'خط الإنتاج',
  'Motor reducer': 'مخفّض المحرك',
  'gear reducer': 'مخفّض التروس',
  'drive system': 'نظام التشغيل',
  'drive drives': 'أنظمة التشغيل',
  'Monoblock Lines': 'خطوط التعبئة الأحادية',
  'Monoblock Filler': 'آلة التعبئة الأحادية',
  'Water Filler': 'آلة تعبئة المياه',
  'Juice Filler': 'آلة تعبئة العصير',
  ' — Filling & Packaging Equipment Dedicated to ideal filling and beverage production solutions':
    ' — معدات التعبئة والتغليف، ملتزمون بحلول مثالية لآلات التعبئة وإنتاج المشروبات',
  ' - PET Juice, Carbonated Drinks, 5-Gallon Barrel Water, KIWL Machinery — Filling & Packaging Equipment Dedicated to ideal filling and beverage production solutions':
    ' - عصير PET، مشروبات غازية، مياه براميل 5 جالون، ماكينات KIWL — معدات التعبئة والتغليف، ملتزمون بحلول مثالية لآلات التعبئة وإنتاج المشروبات',
  'PET Juice & Carbonated Drink Monoblock Lines | 5-Gallon Water Filler | KIWL Machinery':
    'خطوط تعبئة عصير PET والمشروبات الغازية | معبئة مياه 5 جالون | ماكينات KIWL',
  'Delivering innovative concepts and complete solutions to customers worldwide':
    'نقدّم مفاهيم مبتكرة وحلولاً متكاملة لعملائنا حول العالم',
  'Delivering innovative concepts and complete solutions to customer worldwide':
    'نقدّم مفاهيم مبتكرة وحلولاً متكاملة لعملائنا حول العالم',
  'Jiangsu Xin Zijing Machinery Group manufactures monoblock, glass bottle, large bottle, purified/mineral water, PET juice and carbonated drink filling lines. Precision engineering and dedicated global after-sales service.':
    'تصنع مجموعة جيانغسو شين زيجينغ خطوط التعبئة الأحادية والزجاجات والزجاجات الكبيرة والمياه النقية/المعدنية وعصير PET والمشروبات الغازية. هندسة دقيقة وخدمة ما بعد البيع عالمية مخصصة.',
  'monoblock filling machine, glass bottle filler, large bottle water filler, purified and mineral water line, PET juice filler, carbonated drink filler, 5-gallon barrel filler, KIWL machinery':
    'آلة التعبئة الأحادية، معبئة الزجاجات، معبئة الزجاجات الكبيرة، خط المياه النقية والمعدنية، معبئة عصير PET، معبئة المشروبات الغازية، معبئة براميل 5 جالون، ماكينات KIWL',
  'Blow-fill-cap monoblock integrating blow molding and filling':
    'خط نفخ-تعبئة-غطاء متكامل يدمج النفخ والتعبئة',
  'KIWL filling and beverage production lines': 'خطوط تعبئة وإنتاج المشروبات KIWL',
  'Complete filling solutions': 'حلول تعبئة متكاملة',
  'Previous slide': 'الشريحة السابقة',
  'Next slide': 'الشريحة التالية',
  'You are here: Home > Products > Featured Products >': 'أنت هنا: الرئيسية > المنتجات > المنتجات المميزة >',
  'You are here: Home > Products >': 'أنت هنا: الرئيسية > المنتجات >',
  'You are here: Home > Support >': 'أنت هنا: الرئيسية > الدعم الفني >',
  'You are here: Home > News >': 'أنت هنا: الرئيسية > الأخبار >',
  'You are here: Home > About Us >': 'أنت هنا: الرئيسية > من نحن >',
  'Product Details': 'تفاصيل المنتج',
  'Video Gallery': 'معرض الفيديو',
  'produces Monoblock Filling Machine, glass bottle Filling Machine, large bottle Water Filling Machine,Purified Water Monoblock Filling Machine':
    'تنتج آلة التعبئة الأحادية، وآلة تعبئة الزجاجات، وآلة تعبئة الزجاجات الكبيرة، وآلة تعبئة المياه النقية ثلاثية الوظائف'
};

Object.assign(enToAr, EXTRA);

const coreJs =
  '/* KIWL clean EN->AR core dictionary (machinery trade terms) */\n' +
  'window.KIWL_I18N_CORE_AR = ' +
  JSON.stringify(enToAr, null, 0) +
  ';\n';

const legacyJs =
  '/* KIWL EN->AR map (filtered) */\n' +
  'window.KIWL_I18N_EN_AR = ' +
  JSON.stringify(enToAr, null, 0) +
  ';\n';

fs.writeFileSync(path.join(root, 'statics', 'js', 'kiwl-i18n-core-ar.js'), coreJs, 'utf8');
fs.writeFileSync(path.join(root, 'statics', 'js', 'kiwl-i18n-en-ar.js'), legacyJs, 'utf8');
console.log('Clean dictionary keys:', Object.keys(enToAr).length);
