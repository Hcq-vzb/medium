/**
 * Fix glued/broken English fragments across all HTML (pre-AR translation source cleanup).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const REPLACEMENTS = [
  [/Beverageproduction/gi, 'beverage production'],
  [/Fillingtechnology/gi, 'filling technology'],
  [/Fillingindustry/gi, 'filling industry'],
  [/Machineproducts/gi, 'machine products'],
  [/ChinaFilling/gi, 'China filling'],
  [/Fillingproducts/gi, 'filling products'],
  [/Fillingequipment/gi, 'filling equipment'],
  [/FillingMachine/gi, 'Filling Machine'],
  [/WaterFilling/gi, 'Water Filling'],
  [/JuiceBeverage/gi, 'Juice Beverage'],
  [/BeverageFilling/gi, 'Beverage Filling'],
  [/Carbonated DrinksFilling/gi, 'Carbonated Drink Filling'],
  [/Carbonated BeverageFilling/gi, 'Carbonated Beverage Filling'],
  [/Large Bottle WaterFilling/gi, 'Large Bottle Water Filling'],
  [/Glass Bottle Filling Machineproduction/gi, 'Glass Bottle Filling Machine production'],
  [/Glass Bottle Filling MachineFilling/gi, 'Glass Bottle Filling Machine filling'],
  [/Large Bottle Water Filling Machineproduction/gi, 'Large Bottle Water Filling Machine production'],
  [/Large Bottle Water Filling MachineFilling/gi, 'Large Bottle Water Filling Machine filling'],
  [/Large Bottle Water Filling Machineproducts/gi, 'Large Bottle Water Filling Machine products'],
  [/Large Bottle Water Filling Machineequipment/gi, 'Large Bottle Water Filling Machine equipment'],
  [/PET Carbonated Drink Filling Machineproduction/gi, 'PET Carbonated Drink Filling Machine production'],
  [/Monoblock Filling Machineproduction/gi, 'Monoblock Filling Machine production'],
  [/Packaging Machineindustry/gi, 'Packaging Machine industry'],
  [/Labeling Machineindustry/gi, 'Labeling Machine industry'],
  [/FillingCapping/gi, 'Filling and Capping'],
  [/FillingAccuracy/gi, 'Filling Accuracy'],
  [/Asepticproduction/gi, 'Aseptic production'],
  [/Fully Automatic([A-Z])/g, 'Fully Automatic $1'],
  [/production High efficiency/gi, 'production. High efficiency'],
  [/market ,/g, 'market,'],
  [/equipment ,/g, 'equipment,'],
  [/products ,/g, 'products,'],
  [/customer ,/g, 'customer '],
  [/enterprise ,/g, 'enterprise '],
  [/technology ,/g, 'technology, '],
  [/Filling, ,/g, 'Filling,'],
  [/etc\. , etc/gi, 'etc.'],
  [/ , \./g, ','],
  [/ \. ,/g, ', '],
  [/JiangsuZhangjiagang/gi, 'Jiangsu Zhangjiagang'],
  [/KIWL Machinery([A-Z])/g, 'KIWL Machinery $1'],
  [/Blow-Fill-Cap Monoblock 12000-54000\//g, 'Blow-Fill-Cap Monoblock 12,000–54,000 BPH'],
  [/12000-54000/g, '12,000–54,000'],
  [/BPH\//g, 'BPH'],
  [/FillingBeverage/gi, 'Filling Beverage'],
  [/CSDbeverage/gi, 'CSD beverage'],
  [/Fillingproduction/gi, 'Filling production'],
  [/AsepticFilling/gi, 'Aseptic Filling'],
  [/Mineral WaterProduction/gi, 'Mineral Water Production'],
  [/MachineFilling/gi, 'Machine Filling'],
  [/WaterProduction/gi, 'Water Production'],
  [/production \.+/g, 'production.'],
  [/,\s*j,\s*j/g, ','],
  [/Rinsing\+/g, 'Rinsing'],
  [/etc\.\s*,\s*etc/gi, 'etc.'],
  [/quality\s*,\s*production/gi, 'quality, production'],
  [/Filling\s*,\s*quality/gi, 'Filling, quality'],
  [/equipment\s+Accuracy/gi, 'equipment accuracy'],
  [/LineCapacity/gi, 'Line Capacity'],
  [/MachineFilling1/gi, 'Machine Filling 1'],
  [/H\+OH-/g, 'H+ and OH-'],
  [/\s{2,}/g, ' ']
];

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === 'scripts') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

const files = [];
walk(root, files);
let n = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;
  for (const [re, rep] of REPLACEMENTS) {
    html = html.replace(re, rep);
  }
  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    n++;
  }
}
console.log('Polished garbled English in', n, 'files');
