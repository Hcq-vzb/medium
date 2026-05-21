/**
 * Fix broken More>>, View More links; generate fix checklist.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

/** HTTrack 404 stub paths -> real site pages (relative to site root) */
const HREF_MAP = {
  'html/about/index.html': 'about/gongsijianjie/index.html',
  'html/about/gongsijianjie/index.html': 'about/gongsijianjie/index.html',
  'html/about/contactus/index.html': 'about/contactus/index.html',
  'html/about/fazhanlicheng/index.html': 'about/fazhanlicheng/index.html',
  'html/about/gongsihuanjing/index.html': 'about/gongsihuanjing/index.html',
  'html/about/rongyuzizhi/index.html': 'about/rongyuzizhi/index.html',
  'html/product/index.html': 'product/index.html'
};

function is404Stub(filePath) {
  if (!fs.existsSync(filePath)) return true;
  return /<title>404\s+Not\s+Found<\/title>/i.test(fs.readFileSync(filePath, 'utf8'));
}

function walk(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (['node_modules', 'scripts', 'docs'].includes(name)) continue;
      walk(p, list);
    } else if (/\.html?$/i.test(name)) list.push(p);
  }
}

function prefixFor(fromFile, targetRel) {
  const fromDir = path.dirname(fromFile);
  const targetAbs = path.join(root, targetRel);
  let rel = path.relative(fromDir, targetAbs).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function resolveTarget(fromFile, href) {
  if (!href || /^#|javascript:|https?:/i.test(href)) return null;
  let target = path.normalize(path.join(path.dirname(fromFile), href.split(/[?#]/)[0]));
  if (!/\.html?$/i.test(target)) target = path.join(target, 'index.html');
  return target;
}

const changelog = [];
const files = [];
walk(root, files);

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel.startsWith('html/')) continue;

  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  for (const [oldHref, targetRel] of Object.entries(HREF_MAP)) {
    if (!html.includes(oldHref)) continue;
    const newHref = prefixFor(file, targetRel);
    for (const q of ['"', "'"]) {
      const from = `href=${q}${oldHref}${q}`;
      const to = `href=${q}${newHref}${q}`;
      if (html.includes(from)) {
        html = html.split(from).join(to);
        changelog.push({
          file: rel,
          label: oldHref.includes('about') ? 'More>> / About' : 'view more / Product',
          oldHref,
          newHref
        });
      }
    }
  }

  if (html !== orig) fs.writeFileSync(file, html, 'utf8');
}

/* Audit all more-style links after fix */
const audit = [];
const RE_A = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel.startsWith('html/')) continue;
  const html = fs.readFileSync(file, 'utf8');
  let m;
  RE_A.lastIndex = 0;
  while ((m = RE_A.exec(html))) {
    const href = m[1];
    const inner = m[2].replace(/<[^>]+>/g, '').trim();
    const isMore =
      /More\s*(?:&gt;&gt;|>>)/i.test(m[2]) ||
      /View\s+More|view\s+more|View\s+Details/i.test(m[2]) ||
      /class=["'][^"']*more[^"']*["']/i.test(m[0]);
    if (!isMore) continue;
    const target = resolveTarget(file, href);
    const status = !target
      ? 'skip'
      : !fs.existsSync(target)
        ? 'missing'
        : is404Stub(target)
          ? '404-stub'
          : 'ok';
    if (status !== 'ok' && status !== 'skip') {
      audit.push({ file: rel, href, label: inner.slice(0, 40), status });
    }
  }
}

const outMd = path.join(root, 'docs', 'MORE-BUTTON-FIX-LIST.md');
const lines = [
  '# 全站 More 按钮修复清单',
  '',
  `生成时间: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
  '',
  '## 问题原因',
  '',
  '首页等页面中 `More>>`、`view more` 指向 `html/about/index.html`、`html/product/index.html`。该目录为镜像抓取的 **nginx 404 占位页**（标题为 404 Not Found），非企业详情/产品内容，打开即显示 404。',
  '',
  '## 修复规则',
  '',
  '| 场景 | 原路径 | 修正为（站点根相对） |',
  '|------|--------|----------------------|',
  '| 首页 About 摘要 More>> | `html/about/index.html` | `about/gongsijianjie/index.html`（公司简介） |',
  '| 首页优势区 view more | `html/product/index.html` | `product/index.html`（产品中心） |',
  '',
  '仅修改 `href`，未改动按钮样式与文字；双语切换不受影响（链接为相对路径）。',
  '',
  '## 已修改链接',
  '',
  '| 页面文件 | 按钮/说明 | 原链接 | 修改后链接 |',
  '|----------|-----------|--------|------------|'
];

const seen = new Set();
for (const c of changelog) {
  const k = c.file + c.oldHref;
  if (seen.has(k)) continue;
  seen.add(k);
  lines.push(`| ${c.file} | ${c.label} | \`${c.oldHref}\` | \`${c.newHref}\` |`);
}

lines.push('', '## 全站 More / View More 抽检', '');
lines.push('已扫描所有 `.html` 中带 `More>>`、`View More`、`class="more"` 的链接。');
lines.push('');
if (audit.length === 0) {
  lines.push('**结果：除上述已修复项外，其余「阅读更多」类按钮链接均指向存在的真实页面，无 404 占位目标。**');
} else {
  lines.push('| 页面 | 文字 | 链接 | 状态 |');
  lines.push('|------|------|------|------|');
  for (const a of audit) {
    lines.push(`| ${a.file} | ${a.label} | \`${a.href}\` | ${a.status} |`);
  }
}

/* Count more links site-wide */
let moreCount = 0;
let okCount = 0;
for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel.startsWith('html/')) continue;
  const html = fs.readFileSync(file, 'utf8');
  let m;
  RE_A.lastIndex = 0;
  while ((m = RE_A.exec(html))) {
    const isMore =
      /More\s*(?:&gt;&gt;|>>)/i.test(m[2]) ||
      /View\s+More|view\s+more|View\s+Details/i.test(m[2]) ||
      /class=["'][^"']*more[^"']*["']/i.test(m[0]);
    if (!isMore) continue;
    moreCount++;
    const target = resolveTarget(file, m[1]);
    if (target && fs.existsSync(target) && !is404Stub(target)) okCount++;
  }
}

lines.push('', `## 统计`, '', `- More/View More 类链接总数：${moreCount}`, `- 目标页面有效：${okCount}`, `- 本次 href 修改条数：${changelog.length}`);

fs.mkdirSync(path.dirname(outMd), { recursive: true });
fs.writeFileSync(outMd, lines.join('\n'), 'utf8');
fs.writeFileSync(path.join(root, 'docs', 'more-links-fix-log.json'), JSON.stringify({ changelog, audit, moreCount, okCount }, null, 2));

console.log('Fixed href changes:', changelog.length);
console.log('More links total:', moreCount, 'valid targets:', okCount);
console.log('Remaining issues:', audit.length);
console.log('Wrote docs/MORE-BUTTON-FIX-LIST.md');
