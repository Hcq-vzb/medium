const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const ABOUT_EN =
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team. We integrate development, engineering, production, technical service and marketing for complete water, juice, carbonated beverage, spirits and beer filling lines. Our operations follow a modern quality management system with strict in-process control. Reliable equipment and responsive service have earned long-term customer trust. We continue to advance fully automated beverage production solutions. Our installed base spans more than 30 cities across China and export markets including the United States, Russia, Africa and South America. We are committed to meeting each customer\'s requirements...';

const REPLACEMENTS = [
  [/>\s*油\s*[\r\n]+\s*Filling Machine\s*</gi, '>Oil Filling Machine<'],
  [/>\s*水\s*[\r\n]+\s*Filling Machine\s*</gi, '>Water Filling Machine<'],
  [/JuiceFilling Machine/g, 'Juice Filling Machine'],
  [/Water Treatment equipment/g, 'Water Treatment Equipment'],
  [/Global Service Hotline：/g, 'Global Service Hotline:'],
  [/Global Service Hotline:/g, 'Global Service Hotline:'],
  [/Blow-Fill-Cap MonoblockBlow Molding MachineFilling Machine/g, 'Blow-fill-cap monoblock integrating blow molding and filling'],
  [/BeverageFilling Machine/g, 'Beverage Filling Machine'],
  [/机械阀,电子阀,等压/g, 'mechanical valve, electronic valve, isobaric'],
  [/Ultra-Clean 冲瓶Filling Machine封口一体机/g, 'Ultra-Clean Rinse-Fill-Seal Monoblock'],
  [/冷胶贴标Beer 瓶 Juice玻璃瓶Labeling Machine/g, 'Cold-glue labeling for beer and juice glass bottles'],
  [/Customer 现场/g, 'On-site at customer facility'],
  [/customers production/g, 'customer production'],
  [/customers /g, 'customer '],
  [/Customer /g, 'Customer '],
  [/装箱机/g, 'case packer'],
  [/机械手码垛机/g, 'robotic palletizer'],
  [/热收缩/g, 'heat shrink'],
  [/调试安装60天！出口到United Kingdom的富氧/g, '60-day commissioning: oxygen-rich water line exported to the UK'],
  [/2016年海湾迪拜食品展/g, 'Gulf Food Expo Dubai 2016'],
  [/2016\s*年海湾迪拜食品展/g, 'Gulf Food Expo Dubai 2016'],
  [/2016年中国广交会/g, 'Canton Fair 2016'],
  [/2016\s*年中国广交会/g, 'Canton Fair 2016'],
  [/2016年西非包装展/g, 'West Africa Packaging Expo 2016'],
  [/2017年埃塞展会4\.29-5\.2/g, 'Ethiopia Expo Apr 29–May 2, 2017'],
  [/2017年巴基斯坦展会/g, 'Pakistan Expo 2017'],
  [/2017年迪拜展会3\.7-9/g, 'Dubai Expo Mar 7–9, 2017'],
  [/2017年广交会4\.15-19/g, 'Canton Fair Apr 15–19, 2017'],
  [/Why 中国Beverage企业选择KIWL？蓝光集团瓶装/g, 'Why do Chinese beverage producers choose KIWL? LanGuang Group bottled water'],
  [/自2020年起，由KIWL机械提供的瓶装水生产线正式投入生产，目前equipment仍保持良好运行状态，在销售旺季实现全天候连续生产/g,
    'Since 2020, the bottled water line supplied by KIWL Machinery has been in stable operation, including 24/7 production during peak season'],
  [/KIWLChina本企业参与外贸运行数据监测/g, 'KIWL Machinery selected for China Customs trade sentiment index monitoring'],
  [/On-site at customer facility生产之Labeling Machine运行/g, 'On-site hot-melt glue labeler in operation'],
  [/Address: 广州阅江/g, 'Address: Guangzhou Yanjiang'],
  [/适配不同水厂Capacity与场景需求/g, 'matched to plant capacity and application scenarios'],
  [/, , production , Capacity, purified water production line, Capacity,标等问题\. 专业Customized purified water production line打破equipment/g,
    'Generic lines may waste capacity or miss quality targets. Professional customized purified water lines overcome equipment'],
  [/Custom 化Purified WaterProduction Line/g, 'Customized purified water production line'],
  [/Purified WaterProduction Line/g, 'purified water production line'],
  [/China Customs trade sentiment index样本企业/g, 'China Customs trade sentiment index sample enterprise'],
  [/张家港。Company 总资产超过3000万[\s\S]*?We 竭力满足We Customer 的各\.\.\./g, ABOUT_EN],
  [/Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd\.-\.\.\./g,
    'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd....'],
  [/，/g, ', '],
  [/。/g, '. '],
  [/：/g, ': '],
  [/（/g, ' ('],
  [/）/g, ') '],
  [/｜/g, ' | '],
  [/　　/g, ' '],
  [/　/g, ' '],
  [/【类别】/g, 'Category'],
  [/225条/g, '225 items'],
  [/上一页/g, 'Previous'],
  [/下一页/g, 'Next'],
  [/Company 动态/g, 'Company News'],
  [/PETCarbonated/g, 'PET Carbonated'],
  [/Purified WaterMineral Water/g, 'Purified & Mineral Water'],
  [/Ultra-CleanRinsing/g, 'Ultra-Clean Rinsing'],
  [/Blow-Fill-Cap Monoblock12/g, 'Blow-Fill-Cap Monoblock 12'],
  [/电机发动、减速器工作/g, 'Motor and reducer drive'],
  [/将软管主动压入管模内/g, 'automatically feeds tube into mold'],
  [/选用弹/g, 'uses spring'],
  [/products Precision engineering,After-sales service,Welcome to inquire/g,
    'precision engineering and dedicated after-sales service. Welcome to inquire'],
  [/Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd\.production/g,
    'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. produces'],
  [/Monoblock Filling Machineequipment/g, 'monoblock filling machines and'],
  [/Purified WaterMineral WaterMonoblock/g, 'purified and mineral water monoblock'],
  [/,Glass Bottle/g, ', glass bottle'],
  [/,Large Bottle/g, ', large bottle'],
  [/,PET Juice/g, ', PET juice'],
  [/,PET Carbonated/g, ', PET carbonated'],
  [/,5-Gallon/g, ', 5-gallon']
];

const TITLE_EN =
  'PET Juice & Carbonated Drink Monoblock Lines | 5-Gallon Water Filler | KIWL Machinery';

function walk(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
  return list;
}

let n = 0;
for (const file of walk(root)) {
  let raw = fs.readFileSync(file, 'utf8');
  const orig = raw;
  for (const [re, rep] of REPLACEMENTS) raw = raw.replace(re, rep);
  if (file.endsWith('index.html') && file.replace(/\\/g, '/').endsWith('/kiwlmachine.com/index.html')) {
    raw = raw.replace(/<title>[^<]*<\/title>/, '<title>' + TITLE_EN + '</title>');
  }
  if (raw !== orig) {
    fs.writeFileSync(file, raw, 'utf8');
    n++;
  }
}
console.log('Polished', n, 'files');
