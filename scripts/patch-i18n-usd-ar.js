/**
 * Add/update Arabic entries for USD assets wording in i18n dictionaries.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = [
  path.join(root, 'statics/js/kiwl-i18n-core-ar.js'),
  path.join(root, 'statics/js/kiwl-i18n-en-ar.js'),
];

const EN_KIWL =
  'Jiangsu Xin Zijing Machinery Manufacturing Group Co., Ltd. (KIWL) is headquartered in Zhangjiagang, Jiangsu—a major port city with convenient international logistics. With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team focused on beverage filling equipment.';
const AR_KIWL =
  'تتخذ مجموعة جيانغسو شين زيجينغ لتصنيع الآلات المحدودة (KIWL) مقرها في تشانغجياغانغ بمقاطعة جيانغسو — مدينة ميناء رئيسية بخدمات لوجستية دولية ميسرة. يتجاوز إجمالي أصولنا 4.2 مليون دولار أمريكي، ولدينا أكثر من 21,000 م² من مساحات التصنيع، مع فريق بحث وتطوير داخلي متخصص في معدات تعبئة المشروبات.';

const EN_SHORT =
  'With over 4.2 million USD in total assets and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team focused on beverage filling equipment.';
const AR_SHORT =
  'يتجاوز إجمالي أصولنا 4.2 مليون دولار أمريكي، ولدينا أكثر من 21,000 م² من مساحات التصنيع، مع فريق بحث وتطوير داخلي متخصص في معدات تعبئة المشروبات.';

const EN_OLD_RMB =
  'With total assets exceeding RMB 30 million and more than 21,000 m² of manufacturing space, we maintain an in-house R&D team focused on beverage filling equipment.';

function patchFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const m = s.match(/window\.KIWL_I18N_CORE_AR\s*=\s*(\{[\s\S]*\})\s*;?/);
  if (!m) {
    console.warn('Skip (no dict):', file);
    return;
  }
  const prefix = s.slice(0, m.index);
  const dict = JSON.parse(m[1]);
  dict[EN_KIWL] = AR_KIWL;
  dict[EN_SHORT] = AR_SHORT;
  delete dict[EN_OLD_RMB];
  const out = prefix + 'window.KIWL_I18N_CORE_AR = ' + JSON.stringify(dict) + ';\n';
  fs.writeFileSync(file, out, 'utf8');
  console.log('Patched:', path.basename(file));
}

for (const f of files) patchFile(f);
