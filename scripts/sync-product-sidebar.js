/**
 * Sync nva_box sidebar from canonical titles/order (product/10.html structure).
 * Fixes relative hrefs per page depth; restores correct subclass labels on current item.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const CANON_FILE = path.join(root, 'product', '10.html');

const MAIN_SLUGS = [
  'tuijianchanpin',
  'guozhiguanzhuangji',
  'hqylgzj',
  'datongshuiguanzhuangji',
  'shuichulishebei',
  'youguanzhuangji',
  'mobaoji',
  'chuipingji',
  'zhusuji',
  'guanzhuangjipeijian',
  'pijiuguanzhuangji',
  'shuiguanzhuangji',
  'tiebiaoji',
  'cuogaiji',
  'fegnmiguanzhuangji',
  'xipingji',
  'zhenkongxuangaiji'
];

const SUB_SLUGS = [
  'gzjscx',
  'qing-jie-ji-guan-zhaung-ji',
  'xi-shou-ye-guan-zhuang-ji',
  'xiao-du-ji-guan-zhuang-ji',
  'chunjinshui',
  'kuangquanshui',
  'hanqiyinliao',
  '5jialundatongshui',
  'bolipinyinliao',
  'dapinshui',
  'yilaguanyinliao',
  'guozhiyinliao'
];

function extractNvaInner(html) {
  const m = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  return m ? m[1].trim() : null;
}

function parseNavTemplate(inner) {
  const main = [];
  const subItems = [];
  const parts = inner.split(/(?=<h3)/i).filter(Boolean);
  for (const part of parts) {
    const h3m = part.match(
      /<h3 class="(on|off)"><a href='([^']*)' title='([^']*)'>([^<]*)<\/a><\/h3>/i
    );
    if (!h3m) continue;
    main.push({ title: h3m[3], text: h3m[4] });
    const ulm = part.match(/<ul class="sub_bx">([\s\S]*?)<\/ul>/i);
    if (ulm && ulm[1].trim()) {
      const lis = [...ulm[1].matchAll(
        /<li class="subclass"><a href="([^"]*)" title="([^"]*)">([^<]*)<\/a><\/li>/gi
      )];
      for (const li of lis) {
        subItems.push({ title: li[2], text: li[3] });
      }
    }
  }
  return { main, subItems };
}

function pagePaths(filePath) {
  const rel = path.relative(path.join(root, 'product'), filePath).replace(/\\/g, '/');
  const dirParts = rel.split('/');
  dirParts.pop();
  const inTuijian = dirParts[0] === 'tuijianchanpin';
  const subSlug = inTuijian && dirParts.length > 1 ? dirParts[1] : null;
  let mainSlug = null;
  if (dirParts.length === 1 && !inTuijian) mainSlug = dirParts[0];
  if (dirParts.length === 1 && inTuijian) mainSlug = 'tuijianchanpin';
  return { rel, dirParts, mainSlug, subSlug, inTuijian };
}

function buildMainHref(slug, p) {
  const { dirParts, mainSlug, subSlug } = p;

  if (dirParts.length === 0) {
    return slug === 'tuijianchanpin' ? 'tuijianchanpin/index.html' : slug + '/index.html';
  }

  if (subSlug) {
    if (slug === 'tuijianchanpin') return '../index.html';
    return '../../' + slug + '/index.html';
  }

  if (p.inTuijian && dirParts.length === 1) {
    if (slug === 'tuijianchanpin') return 'index.html';
    return '../' + slug + '/index.html';
  }

  if (slug === mainSlug) return 'index.html';
  if (slug === 'tuijianchanpin') return '../tuijianchanpin/index.html';
  return '../' + slug + '/index.html';
}

function buildSubHref(slug, p) {
  const { dirParts, subSlug } = p;

  if (dirParts.length === 0) {
    return 'tuijianchanpin/' + slug + '/index.html';
  }

  if (subSlug) {
    if (slug === subSlug) return 'index.html';
    return '../' + slug + '/index.html';
  }

  if (p.inTuijian && dirParts.length === 1) {
    return slug + '/index.html';
  }

  return '../tuijianchanpin/' + slug + '/index.html';
}

function h3Class(slug, p) {
  const { mainSlug, subSlug } = p;
  // Subcategory under Featured: keep Featured expanded (on)
  if (subSlug) {
    return slug === 'tuijianchanpin' ? 'on' : 'off';
  }
  // Featured Products index only
  if (mainSlug === 'tuijianchanpin' && slug === 'tuijianchanpin') return 'on';
  // Other main categories (juice, carbonated, etc.)
  if (mainSlug === slug) return 'on';
  // product/index.html (all products) — no category highlighted
  return 'off';
}

function buildNvaHtml(template, filePath) {
  const p = pagePaths(filePath);
  let html = '';
  template.main.forEach((item, i) => {
    const slug = MAIN_SLUGS[i];
    const cls = h3Class(slug, p);
    const href = buildMainHref(slug, p);
    html += `<h3 class="${cls}"><a href='${href}' title='${item.title}'>${item.text}</a></h3>`;
    if (i === 0) {
      html += ' <ul class="sub_bx">';
      template.subItems.forEach((sub, j) => {
        const subSlug = SUB_SLUGS[j];
        const shref = buildSubHref(subSlug, p);
        const subCls = p.subSlug === subSlug ? 'subclass kiwl-nav-current' : 'subclass';
        html += ` <li class="${subCls}"><a href="${shref}" title="${sub.title}">${sub.text}</a></li>`;
      });
      html += ' </ul>';
    } else {
      html += ' <ul class="sub_bx"> </ul>';
    }
  });
  return html;
}

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const fp = path.join(dir, name);
    if (fs.statSync(fp).isDirectory()) walk(fp, list);
    else if (/\.html?$/i.test(name)) list.push(fp);
  }
}

const canonHtml = fs.readFileSync(CANON_FILE, 'utf8');
const template = parseNavTemplate(extractNvaInner(canonHtml));
if (template.main.length !== 17 || template.subItems.length !== 12) {
  console.error('Canonical parse failed', template.main.length, template.subItems.length);
  process.exit(1);
}

const files = [];
walk(path.join(root, 'product'), files);
let updated = 0;

for (const f of files) {
  let html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const newInner = buildNvaHtml(template, f);
  const replaced = html.replace(
    /(<div class="nva_box">)[\s\S]*?(<\/div>\s*<div class="hotline_box">)/i,
    `$1 ${newInner} $2`
  );
  if (replaced !== html) {
    fs.writeFileSync(f, replaced, 'utf8');
    updated++;
  }
}

console.log('Synced nva_box in', updated, 'product files');
