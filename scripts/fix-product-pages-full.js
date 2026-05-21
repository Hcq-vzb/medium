/**
 * Full product listing page fix:
 * - Sync sidebar order (canonical)
 * - Fix Online Inquiry (xunpan) links
 * - Fix garbled card descriptions and dapinshui titles
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

const DETAIL_TITLES = {
  '2017/dapinshui_0926/119.html': 'Rotary Large Bottle Water Filling Machine',
  '2017/dapinshui_0926/120.html': 'Linear Large Bottle Water Filling Machine',
  '2018/dapinshui_1024/195.html': 'Large Bottle Purified Water Filling Machine',
  '2018/dapinshui_1024/196.html': 'Fully Automatic Large Bottle Water Filling Machine',
  '2018/dapinshui_1024/197.html': 'Automatic Large Bottle Filling Machine',
  '2018/dapinshui_1024/198.html': 'Large Bottle Rinse-Fill-Cap Monoblock',
  '2018/dapinshui_1008/164.html': 'Large Bottle Water Filling Machine',
  '2019/dapinshui_0925/269.html': '3–10 L Filling Machine',
  '2019/dapinshui_0925/270.html': '5 L Rinse-Fill-Cap Monoblock',
  '2019/dapinshui_0925/271.html': '5 L Rotary Filling Machine'
};

const DESC_BY_DETAIL = {
  '2017/dapinshui_0926/119.html':
    'Rotary large-bottle water filling machine for 3–10 L PET and plastic bottles.',
  '2017/dapinshui_0926/120.html':
    'Linear filling line with photoelectric bottle detection and PLC start/stop control.',
  '2018/dapinshui_1024/195.html':
    'Rinse-fill-cap monoblock for large-bottle purified and mineral water in PET bottles.',
  '2018/dapinshui_1024/196.html':
    'Fully automatic rinse-fill-cap line for large-bottle purified and mineral water.',
  '2018/dapinshui_1024/197.html':
    'Automatic large-bottle line integrating rinsing, filling and capping in one frame.',
  '2018/dapinshui_1024/198.html':
    'Large-bottle three-in-one machine for rinsing, filling and capping mineral or purified water.',
  '2018/dapinshui_1008/164.html':
    'Large-bottle water filler with integrated rinsing, filling and capping for PET bottles.',
  '2019/dapinshui_0925/269.html':
    '3–10 L bottle line: bottles rotate 180° for rinsing, then transfer to the filling station.',
  '2019/dapinshui_0925/270.html':
    '5 L rinse-fill-cap monoblock with 180° bottle rinsing and automatic indexing.',
  '2019/dapinshui_0925/271.html':
    '5 L rotary filler with rinser gripper, 180° sanitizing rotation and PLC control.'
};

const DESC_BY_DETAIL_EXTRA = {
  '2024/gzjscx_1218/284.html':
    'Rotary blow-fill-cap monoblock integrating blow molding and filling for water and CSD applications.',
  '2024/gzjscx_1218/285.html':
    'Isobaric beverage filling line with mechanical or electronic filling valves for juice and CSD.',
  '2024/gzjscx_1218/286.html':
    'Ultra-clean rinse-fill-cap monoblock production line, 18,000–54,000 bottles per hour.',
  '2024/gzjscx_1218/287.html':
    'Automatic labeling machine for glass, PET and metal containers in beverage lines.',
  '2024/gzjscx_1218/288.html':
    'Shrink wrapping, case packing and palletizing systems for bottle packaging.',
  '2024/gzjscx_1218/289.html':
    'Beverage pre-treatment and processing systems for hot-fill and carbonated drinks.',
  '2020/qing-jie-ji-guan-zhaung-ji_1016/281.html': 'Automatic detergent filling machine for bottles and containers.',
  '2020/xi-shou-ye-guan-zhuang-ji_1016/282.html': 'Hand sanitizer filling machine with accurate volume control.',
  '2020/xiao-du-ji-guan-zhuang-ji_1016/283.html': 'Disinfectant filling machine for bottles and containers.',
  '2017/chunjinshui_0926/93.html':
    '8-8-3 purified water monoblock with neck-handling conveyor for easy bottle changeover.'
};

const DESC_PATTERN_FIXES = [
  [
    /2\s*,\s*Filling\.\s*Filling MachinePhotoelectric detection,\s*PLC,\s*PLC\./gi,
    'Linear filling with photoelectric bottle detection and PLC control.'
  ],
  [
    /,?\s*Filling,\s*Capping,\s*FillingMineral Water,\s*Purified Water\.?/gi,
    'Integrates rinsing, filling and capping for mineral and purified water in PET bottles.'
  ],
  [
    /1\s*,\s*180&deg;\.\s*2\s*,\s*/gi,
    'Bottles rotate 180° for rinsing and sanitizing, then advance to filling.'
  ],
  [
    /1\s*,180&deg;\.\s*2\s*,\s*/gi,
    'Bottles rotate 180° for rinsing and sanitizing, then advance to filling.'
  ],
  [
    /1\s*,\s*180&deg;\.\s*2\s*,\s*/gi,
    '5 L rotary filler with rinser gripper, 180° sanitizing rotation and PLC control.'
  ],
  [/Filling MachinePhotoelectric/gi, 'Filling machine photoelectric'],
  [/FillingMineral/gi, 'Filling mineral']
];

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, list);
    else if (/\.html?$/i.test(name)) list.push(p);
  }
}

function messageHref(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  return '../'.repeat(depth) + 'message/index.html';
}

function normDetail(href) {
  return href
    .replace(/^\.\//, '')
    .replace(/^(\.\.\/)+/, '')
    .split(/[?#]/)[0];
}

function extractDetailFromCard(block) {
  const m = block.match(/<a[^>]*class=["']more["'][^>]*>/i) || block.match(/<a[^>]*href=['"]([^'"]+)['"][^>]*class=["']more["']/i);
  if (!m) return null;
  const tag = m[0];
  const hrefM = tag.match(/href=['"]([^'"]+)['"]/i);
  return hrefM ? normDetail(hrefM[1]) : null;
}

function fixCardBlock(block, filePath) {
  let out = block;
  const detail = extractDetailFromCard(block);
  const msg = messageHref(filePath);

  out = out.replace(/<a\s+href=["']#["'][^>]*\s+class=["']xunpan["'][^>]*>/gi, () => {
    return `<a href="${msg}" class="xunpan">`;
  });

  if (detail && (DETAIL_TITLES[detail] || DESC_BY_DETAIL_EXTRA[detail])) {
    const title = DETAIL_TITLES[detail];
    const desc = DESC_BY_DETAIL[detail] || DESC_BY_DETAIL_EXTRA[detail] || title || '';
    out = out.replace(/<div class="desc">[\s\S]*?<\/div>/i, `<div class="desc">${desc}</div>`);
    if (title) {
      out = out.replace(
        /(<h4>\s*<a[^>]*title=["'])([^"']*)(["'][^>]*>)[^<]*(<\/a><\/h4>)/i,
        `$1${title}$3${title}$4`
      );
      out = out.replace(/(<div class="img"><a[^>]*title=["'])([^"']*)(["'])/i, `$1${title}$3`);
      out = out.replace(/alt=["'][^"']*["']/i, `alt="${title}"`);
    }
    return out;
  }

  for (const [re, rep] of DESC_PATTERN_FIXES) {
    out = out.replace(re, rep);
  }
  return out;
}

function splitProductCards(inner) {
  const cardRe =
    /<div class="cp_box_one">\s*<div class="n_box"[\s\S]*?<div class="more_box">[\s\S]*?<\/div>\s*<\/div>/gi;
  return inner.match(cardRe) || [];
}

function fixProductsSection(html, filePath) {
  const sectionRe =
    /(<div class="products">)([\s\S]*?)(<div class="clear"><\/div>\s*<\/div>\s*<div class="pages">)/i;
  const m = html.match(sectionRe);
  if (!m) return html;

  const cards = splitProductCards(m[2]);
  if (!cards.length) return html;

  const fixed = cards.map((c) => fixCardBlock(c, filePath));
  if (fixed.join('') === cards.join('')) return html;

  let idx = 0;
  const cardRe =
    /<div class="cp_box_one">\s*<div class="n_box"[\s\S]*?<div class="more_box">[\s\S]*?<\/div>\s*<\/div>/gi;
  const newInner = m[2].replace(cardRe, () => fixed[idx++]);
  return html.replace(sectionRe, m[1] + newInner + m[3]);
}

const productFiles = [];
walk(path.join(root, 'product'), productFiles);

let updated = 0;
let xunpanGlobal = 0;
for (const f of productFiles) {
  let html = fs.readFileSync(f, 'utf8');
  if (!html.includes('cp_box_one')) continue;
  const orig = html;
  html = fixProductsSection(html, f);
  const msg = messageHref(f);
  const xBefore = (html.match(/href=["']#["'][^>]*class=["']xunpan["']/gi) || []).length;
  html = html.replace(
    /<a\s+href=["']#["'][^>]*class=["']xunpan["'][^>]*>/gi,
    `<a href="${msg}" class="xunpan">`
  );
  html = html.replace(
    /<a\s+class=["']xunpan["'][^>]*href=["']#["'][^>]*>/gi,
    `<a href="${msg}" class="xunpan">`
  );
  xunpanGlobal += xBefore;
  if (html !== orig) {
    fs.writeFileSync(f, html, 'utf8');
    updated++;
  }
}

console.log('Updated product listing files:', updated);

try {
  execSync('node scripts/sync-product-sidebar.js', { cwd: root, stdio: 'inherit' });
} catch (e) {
  console.warn('sync-product-sidebar:', e.message);
}
