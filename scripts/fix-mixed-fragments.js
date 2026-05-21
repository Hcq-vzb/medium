const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const REPLACEMENTS = [
  [/推\s*荐\s*产\s*品/g, 'Featured Products'],
  [/推\s*荐/g, 'Featured '],
  [/果\s*汁/g, 'Juice'],
  [/含\s*气/g, 'Carbonated '],
  [/大\s*桶/g, 'Barrel '],
  [/水\s*处\s*理/g, 'Water Treatment '],
  [/油\s*灌/g, 'Oil '],
  [/膜\s*包\s*机/g, 'Shrink Wrapper'],
  [/吹\s*瓶\s*机/g, 'Blow Molder'],
  [/注\s*塑\s*机/g, 'Injection Molder'],
  [/灌\s*装\s*机\s*配\s*件/g, 'Filler Spare Parts'],
  [/灌\s*装\s*机/g, 'Filler'],
  [/啤\s*酒/g, 'Beer '],
  [/贴\s*标\s*机/g, 'Labeler'],
  [/搓\s*盖\s*机/g, 'Cap Twister'],
  [/蜂\s*蜜/g, 'Honey '],
  [/酒\s*灌/g, 'Liquor '],
  [/吹\s*灌/g, 'Blow-Fill '],
  [/超\s*洁\s*净/g, 'Ultra-Clean '],
  [/瓶\s*子/g, 'Bottle '],
  [/包\s*装\s*机/g, 'Packager'],
  [/饮\s*料/g, 'Beverage '],
  [/预\s*处\s*理/g, 'Pre-Treatment '],
  [/更\s*多/g, 'More'],
  [/产\s*品/g, 'Products'],
  [/客\s*户/g, 'Customer '],
  [/公\s*司/g, 'Company '],
  [/行\s*业/g, 'Industry '],
  [/联\s*系/g, 'Contact '],
  [/地\s*图/g, 'Map'],
  [/网\s*站/g, 'Site '],
  [/版\s*权/g, 'Copyright '],
  [/三\s*合\s*一/g, 'Monoblock '],
  [/碳\s*酸/g, 'Carbonated '],
  [/矿\s*泉/g, 'Mineral '],
  [/纯\s*净/g, 'Purified '],
  [/加\s*仑/g, 'Gallon '],
  [/为\s*什\s*么/g, 'Why '],
  [/定\s*制/g, 'Custom '],
  [/全\s*自\s*动/g, 'Fully Automatic '],
  [/瓶\s*\/\s*时/g, 'BPH'],
  [/南\s*美\s*州/g, 'South America'],
  [/较\s*好/g, 'reliable'],
  [/我司/g, 'We '],
  [/我们/g, 'We '],
  [/酒灌装线/g, 'spirits filling line'],
  [/酒/g, 'spirits '],
  [/Beverageequipment/g, 'beverage equipment'],
  [/equipment全面/g, 'fully automated equipment'],
  [/Juice灌装线/g, 'juice filling line'],
  [/Filling Machine Machine/g, 'Filling Machine'],
  [/equipment equipment/g, 'equipment']
];

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
  if (raw !== orig) {
    fs.writeFileSync(file, raw, 'utf8');
    n++;
  }
}
console.log('Updated', n, 'files');
