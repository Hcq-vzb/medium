/**
 * Full-site Arabic/i18n audit for kiwlmachine.com
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'docs');
const issues = [];

function walkHtml(dir, list) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walkHtml(p, list);
    } else if (/\.html?$/i.test(name)) {
      list.push(p);
    }
  }
}

function rel(p) {
  return path.relative(root, p).replace(/\\/g, '/');
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = [];
walkHtml(root, files);

/* Load dictionary */
let enAr = {};
try {
  const w = { KIWL_I18N_EN_AR: null, KIWL_I18N_CORE_AR: null };
  const src = fs.readFileSync(path.join(root, 'statics/js/kiwl-i18n-en-ar.js'), 'utf8');
  const fn = new Function('window', src + '; return window.KIWL_I18N_EN_AR || window.KIWL_I18N_CORE_AR || {};');
  enAr = fn(w) || {};
} catch (e) {
  console.warn('dict load failed:', e.message);
}
const dictKeys = new Set(Object.keys(enAr));

const CN_RE = /[\u4e00-\u9fff]/;
const GARBLED_RE =
  /JiangsuZhangjiagang|Fillingtechnology|Beverageproduction|Machineproducts|Fillingindustry|, , ,|etc\. , etc|production \.|, j, j|H\+OH-/;
const EN_WORD_RE = /\b[A-Za-z]{4,}\b/g;

let noLangJs = 0;
let noEarlyDir = 0;
let noCoreAr = 0;
let hasChinese = 0;
let hasGarbled = 0;
let missingDictSamples = new Map();

for (const file of files) {
  const r = rel(file);
  if (r.startsWith('statics/') && !r.includes('ckeditor')) continue;
  if (r.startsWith('uploadfile/')) continue;

  const html = fs.readFileSync(file, 'utf8');

  if (!html.includes('lang.js')) {
    noLangJs++;
    issues.push({ file: r, type: 'missing-lang-js', detail: '未引入 lang.js' });
  }
  if (html.includes('lang.js') && !html.includes('kiwl-lang: early dir')) {
    noEarlyDir++;
    issues.push({ file: r, type: 'missing-early-rtl', detail: '缺少 head 内 early dir 脚本' });
  }
  if (html.includes('lang.js') && !html.includes('kiwl-i18n-core-ar.js')) {
    noCoreAr++;
    issues.push({ file: r, type: 'missing-core-ar', detail: '缺少 kiwl-i18n-core-ar.js' });
  }

  if (CN_RE.test(html)) {
    hasChinese++;
    const m = html.match(/[\u4e00-\u9fff]{2,}/);
    issues.push({
      file: r,
      type: 'chinese-in-html',
      detail: '页面源码含中文: ' + (m ? m[0].slice(0, 30) : '')
    });
  }

  if (GARBLED_RE.test(html)) {
    hasGarbled++;
    issues.push({ file: r, type: 'garbled-english', detail: '含损坏/乱码英文片段' });
  }

  const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descM = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const alts = [...html.matchAll(/alt=["']([^"']{8,})["']/gi)].map((x) => x[1]);

  for (const block of [titleM && titleM[1], descM && descM[1], ...alts].filter(Boolean)) {
    const t = block.replace(/\s+/g, ' ').trim();
    if (t.length < 6 || !/[A-Za-z]/.test(t)) continue;
    if (dictKeys.has(t)) continue;
    const norm = t;
    if (!missingDictSamples.has(norm) && missingDictSamples.size < 500) {
      missingDictSamples.set(norm, r);
    }
  }

  /* Sample body text nodes (rough) */
  const text = stripTags(html);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 25 && s.length < 600);
  for (const s of sentences.slice(0, 8)) {
    const clean = s.replace(/\s+/g, ' ').trim();
    if (!/[A-Za-z]{5,}/.test(clean)) continue;
    if (dictKeys.has(clean)) continue;
    if (CN_RE.test(clean) || GARBLED_RE.test(clean)) continue;
    if (!missingDictSamples.has(clean) && missingDictSamples.size < 800) {
      missingDictSamples.set(clean, r);
    }
  }
}

/* Top missing strings */
const missingList = [...missingDictSamples.entries()]
  .sort((a, b) => b[0].length - a[0].length)
  .slice(0, 200);

for (const [text, file] of missingList.slice(0, 80)) {
  if (text.length < 15) continue;
  issues.push({
    file,
    type: 'missing-ar-translation',
    detail: '词典未覆盖英文: ' + text.slice(0, 120) + (text.length > 120 ? '…' : '')
  });
}

const summary = {
  totalHtml: files.length,
  scannedPages: files.length - files.filter((f) => rel(f).startsWith('statics/')).length,
  issueCount: issues.length,
  noLangJs,
  noEarlyDir,
  noCoreAr,
  hasChinese,
  hasGarbled,
  missingDictCount: missingDictSamples.size,
  dictKeyCount: dictKeys.size
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const lines = [
  '# 切换到阿拉伯语问题清单',
  '',
  `生成时间: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`,
  '',
  '## 扫描摘要',
  '',
  `- 扫描 HTML 文件: ${summary.totalHtml}`,
  `- 词典词条数: ${summary.dictKeyCount}`,
  `- 发现问题条目: ${summary.issueCount}`,
  `- 源码含中文页面: ${summary.hasChinese}`,
  `- 含乱码英文页面: ${summary.hasGarbled}`,
  `- 未引入 lang.js: ${summary.noLangJs}`,
  `- 缺少 early RTL 脚本: ${summary.noEarlyDir}`,
  `- 词典未覆盖估计: ${summary.missingDictCount} 条字符串`,
  '',
  '## 问题明细（按类型）',
  ''
];

const byType = {};
for (const i of issues) {
  byType[i.type] = byType[i.type] || [];
  byType[i.type].push(i);
}

for (const [type, list] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
  lines.push(`### ${type} (${list.length})`, '');
  const shown = list.slice(0, 50);
  for (const i of shown) {
    lines.push(`- **${i.file}**: ${i.detail}`);
  }
  if (list.length > 50) lines.push(`- … 另有 ${list.length - 50} 条`);
  lines.push('');
}

fs.writeFileSync(path.join(outDir, 'AR-ISSUES-CHECKLIST.md'), lines.join('\n'), 'utf8');
fs.writeFileSync(path.join(outDir, 'ar-audit-summary.json'), JSON.stringify({ summary, issues: issues.slice(0, 500) }, null, 2), 'utf8');
console.log(JSON.stringify(summary, null, 2));
