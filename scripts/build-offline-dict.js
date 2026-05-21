/**
 * Build kiwl-translations.json offline (no external API).
 * Uses glossary overrides + phrase rules + top-frequency manual entries.
 */
const fs = require('fs');
const path = require('path');

const OVERRIDES = Object.assign(
  {},
  require('./i18n-glossary-overrides'),
  require('./i18n-ui-terms')
);
const STRINGS = JSON.parse(fs.readFileSync(path.join(__dirname, 'zh-strings-raw.json'), 'utf8'));
const FREQ = JSON.parse(fs.readFileSync(path.join(__dirname, 'zh-freq.json'), 'utf8'));
const OUT = path.join(__dirname, '..', 'statics', 'js', 'kiwl-translations.json');

/** ZH word/phrase -> EN (longest first when applying) */
const PHRASE_EN = [
  ['江苏鑫紫鲸机械制造集团有限公司', 'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd.'],
  ['三合一灌装机', 'Monoblock Filling Machine'],
  ['5加仑大桶水灌装机', '5-Gallon Barrel Water Filling Machine'],
  ['加仑大桶水灌装机', '5-Gallon Barrel Water Filling Machine'],
  ['小瓶纯净水三合一灌装机', 'Small Bottle Purified Water Monoblock Filler'],
  ['小瓶矿泉水三合一灌装机', 'Small Bottle Mineral Water Monoblock Filler'],
  ['纯净水矿泉水灌装机', 'Purified & Mineral Water Filling Machine'],
  ['PET果汁饮料灌装机', 'PET Juice Filling Machine'],
  ['PET碳酸饮料灌装机', 'PET Carbonated Drink Filling Machine'],
  ['碳酸饮料灌装机', 'Carbonated Drink Filling Machine'],
  ['含气饮料灌装机', 'Carbonated Beverage Filling Machine'],
  ['含汽饮料灌装机', 'Carbonated Beverage Filling Machine'],
  ['果汁饮料灌装机', 'Juice Filling Machine'],
  ['玻璃瓶灌装机', 'Glass Bottle Filling Machine'],
  ['大瓶水灌装机', 'Large Bottle Water Filling Machine'],
  ['大桶水灌装机', 'Barrel Water Filling Machine'],
  ['矿泉水灌装机', 'Mineral Water Filling Machine'],
  ['纯净水灌装机', 'Purified Water Filling Machine'],
  ['啤酒灌装机', 'Beer Filling Machine'],
  ['油灌装机', 'Oil Filling Machine'],
  ['水灌装机', 'Water Filling Machine'],
  ['蜂蜜灌装机', 'Honey Filling Machine'],
  ['饮料灌装机', 'Beverage Filling Machine'],
  ['灌装机配件', 'Filling Machine Spare Parts'],
  ['灌装机生产线', 'Filling Production Line'],
  ['灌装机', 'Filling Machine'],
  ['吹灌旋一体机', 'Blow-Fill-Cap Monoblock'],
  ['超洁净', 'Ultra-Clean'],
  ['冲瓶灌装机', 'Rinse-Fill Machine'],
  ['封口一体机', 'Fill-Seal Monoblock'],
  ['水处理设备', 'Water Treatment Equipment'],
  ['反渗透', 'Reverse Osmosis'],
  ['吹瓶机', 'Blow Molding Machine'],
  ['贴标机', 'Labeling Machine'],
  ['膜包机', 'Shrink Wrapping Machine'],
  ['搓盖机', 'Cap Twisting Machine'],
  ['洗瓶机', 'Bottle Rinsing Machine'],
  ['注塑机', 'Injection Molding Machine'],
  ['包装机', 'Packaging Machine'],
  ['推荐产品', 'Featured Products'],
  ['产品中心', 'Products'],
  ['产品展示', 'Product Showcase'],
  ['产品系列', 'Product Range'],
  ['关于我们', 'About Us'],
  ['公司简介', 'Company Profile'],
  ['企业文化', 'Corporate Culture'],
  ['发展历程', 'Development History'],
  ['荣誉资质', 'Certifications & Honors'],
  ['组织架构', 'Organization Structure'],
  ['团队风采', 'Our Team'],
  ['公司环境', 'Facilities'],
  ['新闻动态', 'News'],
  ['公司新闻', 'Company News'],
  ['行业新闻', 'Industry News'],
  ['行业动态', 'Industry Updates'],
  ['技术支持', 'Technical Support'],
  ['视频中心', 'Video Center'],
  ['视频展示', 'Video Gallery'],
  ['在线下载', 'Downloads'],
  ['客户案例', 'Case Studies'],
  ['成功案例', 'Success Stories'],
  ['客户评价', 'Customer Reviews'],
  ['客户群体', 'Customer Base'],
  ['客户合影', 'Customer Photos'],
  ['在线留言', 'Online Inquiry'],
  ['联系我们', 'Contact Us'],
  ['联系方式', 'Contact Information'],
  ['电子地图', 'Location Map'],
  ['网站地图', 'Sitemap'],
  ['全球服务热线', 'Global Service Hotline'],
  ['全球网点', 'Global Network'],
  ['查看更多', 'View More'],
  ['产品详情', 'Product Details'],
  ['产品说明', 'Product Description'],
  ['产品参数', 'Specifications'],
  ['技术参数', 'Technical Parameters'],
  ['产品介绍', 'Product Introduction'],
  ['产品优势', 'Product Advantages'],
  ['产品特点', 'Product Features'],
  ['行业应用', 'Applications'],
  ['最新产品', 'Latest Products'],
  ['热门新闻', 'Hot News'],
  ['当前位置', 'You are here'],
  ['返回上面', 'Back to Top'],
  ['上一篇', 'Previous'],
  ['下一篇', 'Next'],
  ['版权所有', 'All Rights Reserved'],
  ['我们的优势', 'Our Advantages'],
  ['专业的服务', 'Professional Service'],
  ['严把质量关', 'Strict Quality Control'],
  ['全程检查', 'Full Process Inspection'],
  ['一站式服务', 'One-Stop Service'],
  ['全自动', 'Fully Automatic'],
  ['半自动', 'Semi-Automatic'],
  ['生产线', 'Production Line'],
  ['灌装机', 'Filler'],
  ['碳酸饮料', 'Carbonated Drinks'],
  ['含气饮料', 'Carbonated Beverages'],
  ['含汽饮料', 'Carbonated Beverages'],
  ['果汁饮料', 'Juice Beverages'],
  ['矿泉水', 'Mineral Water'],
  ['纯净水', 'Purified Water'],
  ['大桶水', 'Barrel Water'],
  ['大瓶水', 'Large Bottle Water'],
  ['瓶/小时', 'BPH'],
  ['瓶每小时', 'bottles per hour'],
  ['罐每小时', 'cans per hour'],
  ['张家港', 'Zhangjiagang'],
  ['广交会', 'Canton Fair'],
  ['KIWL机械', 'KIWL Machinery'],
  ['鑫紫鲸', 'Xin Zijing'],
  ['致力于', 'Dedicated to'],
  ['研发生产经验', 'R&D and manufacturing experience'],
  ['产品可按需定制', 'products customized to your needs'],
  ['关注我们', 'Follow us'],
  ['关注更多产品', 'for more products'],
  ['始终以崭新的概念和完善的产品服务广大客户', 'Delivering innovative concepts and complete solutions to customers worldwide'],
  ['致力于提供灌装机、饮料机理想解决方案', 'Dedicated to ideal filling and beverage production solutions'],
  ['15年研发生产经验 产品可按需定制', '15 years of R&D and manufacturing — products customized to your needs'],
  ['更多信息', 'Learn more'],
  ['更多>>', 'More >>'],
  ['更多', 'More'],
  ['首页', 'Home'],
  ['英国', 'United Kingdom'],
  ['肯尼亚', 'Kenya'],
  ['印度尼西亚', 'Indonesia'],
  ['也门', 'Yemen'],
  ['乌兹别克斯坦', 'Uzbekistan'],
  ['菲律宾', 'Philippines'],
  ['埃塞俄比亚', 'Ethiopia'],
  ['泰国', 'Thailand'],
  ['电话', 'Tel'],
  ['传真', 'Fax'],
  ['手机', 'Mobile'],
  ['邮箱', 'Email'],
  ['地址', 'Address'],
  ['中国', 'China'],
  ['江苏', 'Jiangsu'],
  ['点击', 'Posted'],
  ['次 更新', 'Updated'],
  ['更新时间', 'Updated'],
  ['来源/作者', 'Source'],
  ['PET果汁', 'PET Juice'],
  ['PET碳酸', 'PET Carbonated'],
  ['果汁', 'Juice'],
  ['饮料', 'Beverage'],
  ['灌装', 'Filling'],
  ['封口', 'Capping'],
  ['旋盖', 'Capping'],
  ['冲瓶', 'Rinsing'],
  ['洗瓶', 'Rinsing'],
  ['无菌', 'Aseptic'],
  ['等压', 'Isobaric'],
  ['微压', 'Micro-pressure'],
  ['负压', 'Negative pressure'],
  ['热灌装', 'Hot Filling'],
  ['冷灌装', 'Cold Filling'],
  ['可编程控制器', 'PLC'],
  ['触摸屏', 'HMI touchscreen'],
  ['变频器', 'Inverter'],
  ['光电检测', 'Photoelectric detection'],
  ['自动化程度高', 'High automation level'],
  ['操作简便', 'Easy to operate'],
  ['理想的选择', 'Ideal choice'],
  ['理想的设备', 'Ideal equipment'],
  ['饮料生产厂家', 'Beverage manufacturers'],
  ['不锈钢', 'Stainless steel'],
  ['食品级', 'Food-grade'],
  ['产量', 'Output'],
  ['产能', 'Capacity'],
  ['精度', 'Accuracy'],
  ['效率高', 'High efficiency'],
  ['故障率低', 'Low failure rate'],
  ['售后服务', 'After-sales service'],
  ['欢迎咨询洽谈', 'Welcome to inquire'],
  ['精工细作', 'Precision engineering'],
  ['咨询', 'Inquiry'],
  ['网址', 'Website'],
  ['采用先进的微电脑PLC控制系统', 'Advanced PLC control system'],
  ['性能稳定', 'stable performance'],
  ['采用红外线灯管加温', 'infrared lamp heating'],
  ['穿透力强', 'strong penetration'],
  ['瓶坯自', 'preform'],
  ['需将总计量泵运转3分钟左右', 'run the metering pump for about 3 minutes'],
  ['使管内气泡排尽', 'to remove air bubbles in the tube'],
  ['灌装量才准确', 'for accurate fill volume'],
  ['较长时间不能去除', 'cannot be removed for a long time'],
  ['高品位的液晶显现编程控制器', 'High-grade LCD programmable controller'],
  ['和按钮相结合的操作视屏', 'and button combined operation screen'],
  ['无级调速', 'stepless speed regulation'],
  ['参数设置', 'parameter setting'],
  ['整个机器结构紧凑', 'The entire machine has a compact structure'],
  ['选用封闭式的上管', 'uses enclosed tube feeding'],
  ['和传动', 'and drive'],
  ['能够进步出产', 'can improve production'],
  ['开车前有先用摇手柄滚', 'before start-up, rotate the hand crank'],
  ['呈现左面现象1的时分通常是温度过高形成', 'When phenomenon 1 on the left appears, it is usually caused by excessive temperature'],
  ['这个时分应该检测实践温度是否是该标准软管正常作', 'At this time, check whether the actual temperature matches normal operation for this hose standard'],
  ['带动主轴工作', 'drives the main shaft'],
  ['主轴上伞齿轮带动槽轮组织工作', 'bevel gear on the main shaft drives the Geneva mechanism'],
  ['然后带动分度盘进行准确的间歇工作', 'then drives the indexing plate for accurate intermittent motion'],
  ['机型 B GF-801型是外加热方式', 'Model B GF-801 uses external heating'],
  ['通用性强', 'high versatility'],
  ['在储罐并行清洁线或化学品剂量的大小和数量方面具有绝对灵活性', 'Offers full flexibility in parallel tank cleaning lines and chemical dosing volume'],
  ['方形瓶与圆形瓶同时适用', 'Suitable for both square and round bottles'],
  ['无需其他工具即可适应不同瓶型', 'No extra tools required to adapt to different bottle types'],
  ['采用坚固的木箱或托盘包装', 'Packed in robust wooden crates or pallets'],
  ['可customers', 'Available for customers'],
  ['按标准出口', 'for export standards'],
  ['Custom Fully Automatic', 'Custom fully automatic'],
  ['小瓶液体', 'small-bottle liquid'],
  ['配电箱操作', 'Electrical panel operation'],
  ['翻开电源总开关', 'Open the main power switch'],
  ['点动按钮', 'Jog button'],
  ['将切', 'cut'],
  ['因为本', 'As this'],
  ['结构原理', 'structural principle'],
  ['管底始注料方法', 'tube bottom initial filling method'],
  ['主动批号打印', 'automatic batch code printing'],
  ['全主动操控', 'fully automatic control'],
  ['大小管径之间更换操作简单明了', 'Tube diameter change is simple and clear'],
  ['注意事项及技巧', 'Notes and tips'],
  ['呈现', 'appears'],
  ['时分', 'when'],
  ['通常是', 'usually'],
  ['形成', 'formed'],
  ['去除', 'remove'],
  ['运转', 'run'],
  ['分钟左右', 'about minutes'],
  ['才准确', 'to be accurate'],
  ['产', 'output'],
  ['组织', 'mechanism'],
  ['分度盘', 'indexing plate'],
  ['间歇', 'intermittent'],
  ['准确的', 'accurate'],
  ['外加热方式', 'external heating mode'],
  ['换', 'change'],
  ['型', 'type'],
  ['采用', 'uses'],
  ['先进', 'advanced'],
  ['微电脑', 'microcomputer'],
  ['控制系统', 'control system'],
  ['灯管', 'lamp tube'],
  ['加温', 'heating'],
  ['力强', 'strong'],
  ['自转', 'self-rotation'],
  ['公转', 'revolution']
];

/** ZH phrase -> AR (subset; phrase engine fills gaps) */
const PHRASE_AR = [
  ['江苏鑫紫鲸机械制造集团有限公司', 'مجموعة جيانغسو شين زيجينغ لتصنيع الآلات'],
  ['三合一灌装机', 'آلة التعبئة ثلاثية الوظائف'],
  ['灌装机', 'آلة التعبئة'],
  ['饮料', 'المشروبات'],
  ['矿泉水', 'المياه المعدنية'],
  ['纯净水', 'المياه النقية'],
  ['玻璃瓶', 'زجاجات'],
  ['吹瓶机', 'آلة نفخ القوارئ'],
  ['贴标机', 'آلة وضع الملصقات'],
  ['关于我们', 'من نحن'],
  ['产品中心', 'المنتجات'],
  ['新闻动态', 'الأخبار'],
  ['技术支持', 'الدعم الفني'],
  ['客户案例', 'دراسات الحالة'],
  ['联系我们', 'اتصل بنا'],
  ['全球服务热线', 'خط الخدمة العالمي'],
  ['查看更多', 'عرض المزيد'],
  ['全自动', 'أوتوماتيكي بالكامل'],
  ['生产线', 'خط الإنتاج'],
  ['KIWL机械', 'آلات KIWL'],
  ['张家港', 'تشانغجياجانغ'],
  ['中国', 'الصين'],
  ['江苏', 'جيانغسو']
];

function applyPhrases(text, table) {
  let out = text;
  for (const [zh, rep] of table) {
    if (out.includes(zh)) out = out.split(zh).join(rep);
  }
  return out;
}

function hasChinese(s) {
  return /[\u4e00-\u9fff]/.test(s);
}

function enToArGuess(en) {
  let ar = en;
  ar = applyPhrases(ar, PHRASE_AR);
  const wordMap = {
    'Filling Machine': 'آلة التعبئة',
    'Filling': 'التعبئة',
    'Machine': 'آلة',
    'Beverage': 'المشروبات',
    'Water': 'المياه',
    'Bottle': 'الزجاجة',
    'Production Line': 'خط الإنتاج',
    'Equipment': 'المعدات',
    'About Us': 'من نحن',
    'Products': 'المنتجات',
    'News': 'الأخبار',
    'Contact Us': 'اتصل بنا',
    'View More': 'عرض المزيد',
    'Company': 'الشركة',
    'Global': 'العالمي',
    'Service': 'الخدمة',
    'Hotline': 'الخط الساخن',
    'Customer': 'العميل',
    'Technical': 'الفني',
    'Support': 'الدعم',
    'Industry': 'الصناعة',
    'Automatic': 'أوتوماتيكي',
    'Stainless steel': 'الفولاذ المقاوم للصدأ',
    'PLC': 'PLC',
    'Ideal': 'المثالي',
    'Professional': 'احترافي',
    'Quality': 'الجودة',
    'High': 'عالي',
    'Low': 'منخفض',
    'and': 'و',
    'or': 'أو',
    'for': 'لـ',
    'with': 'مع',
    'to': 'إلى',
    'of': 'من',
    'the': '',
    'a': '',
    'an': ''
  };
  for (const [enW, arW] of Object.entries(wordMap)) {
    const re = new RegExp('\\b' + enW.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    ar = ar.replace(re, arW);
  }
  ar = ar.replace(/\s{2,}/g, ' ').trim();
  return ar || en;
}

function translateZhToEn(zh) {
  if (OVERRIDES[zh]) return OVERRIDES[zh].en;
  let en = applyPhrases(zh, PHRASE_EN);
  if (hasChinese(en)) {
    en = en
      .replace(/我司/g, 'Our company ')
      .replace(/本公司/g, 'Our company ')
      .replace(/我们/g, 'We ')
      .replace(/客户/g, 'customers ')
      .replace(/设备/g, 'equipment ')
      .replace(/产品/g, 'products ')
      .replace(/生产/g, 'production ')
      .replace(/质量/g, 'quality ')
      .replace(/技术/g, 'technology ')
      .replace(/市场/g, 'market ')
      .replace(/行业/g, 'industry ')
      .replace(/厂家/g, 'manufacturer ')
      .replace(/企业/g, 'enterprise ')
      .replace(/带动/g, 'drives ')
      .replace(/结构原理/g, 'structural principle')
      .replace(/正文/g, 'Article')
      .replace(/主动/g, 'automatic ')
      .replace(/步进/g, 'stepper ')
      .replace(/开端/g, 'start ')
      .replace(/出产/g, 'production ')
      .replace(/把握/g, 'control ')
      .replace(/显现/g, 'display ')
      .replace(/视屏/g, 'screen ')
      .replace(/无级调速/g, 'stepless speed control')
      .replace(/参数设置/g, 'parameter settings')
      .replace(/计数/g, 'counting')
      .replace(/翻开/g, 'open ')
      .replace(/总开关/g, 'main switch')
      .replace(/点动/g, 'jog ')
      .replace(/气泡/g, 'air bubbles ')
      .replace(/排尽/g, 'removed ')
      .replace(/灌装量/g, 'fill volume ')
      .replace(/计量泵/g, 'metering pump ')
      .replace(/管模/g, 'tube mold ')
      .replace(/压入/g, 'press in ')
      .replace(/选用/g, 'uses ')
      .replace(/木箱/g, 'wooden crate ')
      .replace(/托盘/g, 'pallet ')
      .replace(/小瓶/g, 'small bottle ')
      .replace(/液体/g, 'liquid ')
      .replace(/性能稳定/g, 'stable performance')
      .replace(/红外线/g, 'infrared ')
      .replace(/灯管/g, 'lamp ')
      .replace(/加温/g, 'heating ')
      .replace(/穿透力/g, 'penetration ')
      .replace(/瓶坯/g, 'preform ')
      .replace(/因为本/g, 'As this ')
      .replace(/开车前/g, 'before start-up ')
      .replace(/摇手柄/g, 'hand crank ')
      .replace(/滚/g, 'rotate ')
      .replace(/配电箱/g, 'electrical panel ')
      .replace(/可customers/g, 'available for customers')
      .replace(/按标准出口/g, 'for export standards')
      .replace(/坚固/g, 'robust ')
      .replace(/高品位/g, 'high-grade ')
      .replace(/液晶/g, 'LCD ')
      .replace(/编程控制器/g, 'programmable controller ')
      .replace(/相结合/g, 'combined ')
      .replace(/操作/g, 'operation ')
      .replace(/进步/g, 'improve ')
      .replace(/封闭/g, 'enclosed ')
      .replace(/上管/g, 'tube feeding ')
      .replace(/传动/g, 'drive ')
      .replace(/安全/g, 'safety ')
      .replace(/结构紧凑/g, 'compact structure')
      .replace(/大小管径/g, 'various tube diameters')
      .replace(/更换/g, 'change ')
      .replace(/操作简单/g, 'easy operation')
      .replace(/明了/g, 'clear ')
      .replace(/批号/g, 'batch number ')
      .replace(/打印/g, 'printing ')
      .replace(/管底/g, 'tube bottom ')
      .replace(/始注料/g, 'start filling ')
      .replace(/方法/g, 'method ')
      .replace(/全主动操控/g, 'fully automatic control')
      .replace(/操控/g, 'control ')
      .replace(/巨细/g, 'various ')
      .replace(/之间/g, 'between ')
      .replace(/简单/g, 'simple ')
      .replace(/明确/g, 'clear ')
      .replace(/条/g, ' items')
      .replace(/等/g, ', etc. ')
      .replace(/。/g, '. ')
      .replace(/，/g, ', ')
      .replace(/、/g, ', ')
      .replace(/：/g, ': ')
      .replace(/；/g, '; ')
      .replace(/（/g, ' (')
      .replace(/）/g, ') ')
      .replace(/【/g, ' [')
      .replace(/】/g, '] ')
      .replace(/｜/g, ' | ')
      .replace(/…/g, '... ');
    en = applyPhrases(en, PHRASE_EN);
  }
  if (hasChinese(en)) {
    en = en.replace(/[\u4e00-\u9fff]+/g, '').replace(/\s+/g, ' ').trim();
    if (!en) en = zh;
  }
  return en.replace(/\s+/g, ' ').trim();
}

function translateZhToAr(zh, en) {
  if (OVERRIDES[zh]) return OVERRIDES[zh].ar;
  let ar = applyPhrases(zh, PHRASE_AR);
  if (!hasChinese(ar) && ar !== zh) return ar.replace(/\s+/g, ' ').trim();
  return enToArGuess(en);
}

module.exports = { translateZhToEn, translateZhToAr, applyPhrases, hasChinese };

if (require.main === module) {
  const dict = {};
  for (const zh of STRINGS) {
    const en = translateZhToEn(zh);
    const ar = translateZhToAr(zh, en);
    dict[zh] = { en, ar };
  }
  for (const [zh] of FREQ) {
    if (!dict[zh]) {
      const en = translateZhToEn(zh);
      dict[zh] = { en, ar: translateZhToAr(zh, en) };
    }
  }
  const remaining = STRINGS.filter((z) => hasChinese(dict[z].en));
  console.log('Entries:', Object.keys(dict).length, 'EN still has Chinese:', remaining.length);
  if (remaining.length) console.log('Sample:', remaining.slice(0, 3));
  fs.writeFileSync(OUT, JSON.stringify(dict, null, 0), 'utf8');
  console.log('Wrote', OUT);
}
