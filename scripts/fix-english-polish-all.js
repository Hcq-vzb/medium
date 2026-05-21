const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const REPLACEMENTS = [
  [/15R&D and manufacturing experience/g, '15 years of R&D and manufacturing —'],
  [/logo_desc_line2">15R&D/g, 'logo_desc_line2">15 years of R&D and manufacturing — products customized to your needs</p><p class="logo_desc_line2_removed" style="display:none">'],
  [/Fully AutomaticOil/g, 'Fully Automatic Oil'],
  [/Fully AutomaticFilling/g, 'Fully Automatic Filling'],
  [/Fillingequipment/g, 'Filling equipment'],
  [/FillingFilling/g, 'Filling'],
  [/equipmentequipment/g, 'equipment'],
  [/Oil Filling MachineFilling/g, 'Oil Filling Machine filling'],
  [/Monoblock Filling Machineequipment/g, 'monoblock filling machine'],
  [/Monoblock Filling Machine, equipment/g, 'monoblock filling machine'],
  [/Glass Bottle Filling Machineequipment/g, 'glass bottle filling machine'],
  [/Purified Watermonoblock/g, 'purified water monoblock'],
  [/Purified WaterMonoblock/g, 'Purified Water Monoblock'],
  [/Juice BeveragesMonoblock/g, 'Juice Beverage Monoblock'],
  [/PET Juice_Carbonated/g, 'PET Juice, Carbonated'],
  [/Carbonated Drinks_/g, 'Carbonated Drinks, '],
  [/55-Gallon Barrel Water_/g, '5-Gallon Barrel Water, '],
  [/KIWLLarge/g, 'KIWL Large'],
  [/KIWLChina/g, 'KIWL China'],
  [/ChinaBeverage/g, 'China Beverage'],
  [/Beverageenterprise/g, 'Beverage enterprise'],
  [/enterprise KIWL/g, 'enterprise, KIWL'],
  [/Ultra-Clean RinsingFilling/g, 'Ultra-Clean Rinse-Fill'],
  [/Blow-Fill-Cap Monoblock12/g, 'Blow-Fill-Cap Monoblock 12'],
  [/Production Lineequipment/g, 'production line equipment'],
  [/FillingProduction Line/g, 'Filling Production Line'],
  [/Water Filling Machine？/g, 'Water Filling Machine?'],
  [/PET Carbonated Drink Filling Machine？/g, 'PET Carbonated Drink Filling Machine?'],
  [/Carbonated Drink Filling Machine？/g, 'Carbonated Drink Filling Machine?'],
  [/,\s*,/g, ', '],
  [/,\s*\./g, '.'],
  [/equipment\s*,\s*equipment/g, 'equipment'],
  [/Filling,\s*Filling/g, 'Filling'],
  [/,\s*etc\.\s*,\s*etc\./g, 'etc.'],
  [/technology\.\s*-\s*technology/g, 'technology'],
  [/Food-grade304/g, 'Food-grade 304'],
  [/Stainless steel/gi, 'stainless steel'],
  [/2300\*1300\*2300m/g, '2300×1300×2300 mm'],
  [/KIWL([A-Z])/g, 'KIWL $1'],
  [/Beverage([A-Z])/g, 'Beverage $1'],
  [/Juice([A-Z])/g, 'Juice $1'],
  [/customer ([a-z])/g, 'customer $1'],
  [/facility([a-z])/g, 'facility $1'],
  [/Pre-Treatment equipment/g, 'Pre-Treatment Equipment'],
  [/Fully Automatic([A-Z])/g, 'Fully Automatic $1'],
  [/Production Line,/g, 'Production Line'],
  [/,\s*,/g, ', '],
  [/,\s*$/g, ''],
  [/2016China/g, '2016 China'],
  [/Chinaenterprise/g, 'China enterprise'],
  [/China Canton Fair/g, 'China Canton Fair'],
  [/55-Gallon/g, '5-Gallon'],
  [/Online Message/g, 'Online Inquiry'],
  [/title="Online Message"/g, 'title="Online Inquiry"'],
  [/>Online Message</g, '>Online Inquiry<'],
  [/PET Juice_Carbonated Drinks_5/g, 'PET Juice, Carbonated Drinks, 5'],
  [/PET\/Juice\/Carbonated\/5-Gallon Water Monoblock Filling Lines - Jiangsu Xin Zijing Machinery Group/g,
    'KIWL Machinery — Filling & Packaging Equipment'],
  [/,\s*$/gm, ''],
  [/\s{2,}/g, ' ']
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
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;
  for (const [re, rep] of REPLACEMENTS) html = html.replace(re, rep);
  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    n++;
  }
}
console.log('Polished', n, 'files');
