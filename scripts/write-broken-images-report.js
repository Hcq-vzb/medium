const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'scripts', 'broken-images-report-data.json');
const metaPath = path.join(root, 'scripts', 'broken-images-report-meta.json');
const auditPath = path.join(root, 'scripts', 'audit-broken-images-result.json');

let rows = [];
let meta = { generated: new Date().toISOString().slice(0, 19).replace('T', ' '), filesModified: 0, removed: 0, fixed: 0 };

function readJson(p) {
  const raw = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}
if (fs.existsSync(dataPath)) rows = readJson(dataPath);
if (fs.existsSync(metaPath)) meta = { ...meta, ...readJson(metaPath) };

let audit = { totalImg: 0, okImg: 0, brokenCount: 0 };
if (fs.existsSync(auditPath)) {
  audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
}

const lines = [];
lines.push('# 全站无效图片清理报告');
lines.push('');
lines.push(`生成时间：${meta.generated}`);
lines.push('');
lines.push('## 汇总');
lines.push(`- 修改文件数：**${meta.filesModified}**`);
lines.push(`- 删除无效 \`<img>\` 标签：**${meta.removed}**`);
lines.push(`- 修正为本地有效图片路径：**${meta.fixed}**`);
lines.push(`- 全站验收扫描：共 **${audit.totalImg}** 个 img，有效 **${audit.okImg}**，仍无效 **${audit.brokenCount}**`);
lines.push('');
lines.push('## 处理规则');
lines.push('- 删除：无 src、空 src、本地文件不存在、外链无法映射到本地、src 指向非图片文件（如 .html）');
lines.push('- 保留并修正路径：uploadfile/ 与 statics/images/ 下真实图片文件');
lines.push('- 未改动：HTML 结构、文字、CSS、链接、正常产品图/logo/轮播/优势图标');
lines.push('');
lines.push('## 明细（按文件）');
lines.push('');
lines.push('| 文件路径 | 删除数 | 路径修正数 |');
lines.push('|----------|--------|------------|');

if (!rows.length) {
  lines.push('| （本次脚本无新增变更） | 0 | 0 |');
} else {
  for (const r of rows) {
    const file = (r.File || r.file || '').replace(/\\/g, '/');
    const removed = r.Removed ?? r.removed ?? 0;
    const fixed = r.FixedPaths ?? r.fixed ?? 0;
    lines.push(`| ${file} | ${removed} | ${fixed} |`);
  }
}

lines.push('');
lines.push('## 说明');
lines.push('- 报告数据来自 `scripts/clean-broken-images.ps1` 本次运行输出');
lines.push('- 验收数据来自 `scripts/audit-broken-images.js` 全站扫描');
lines.push('- 可重复执行清理脚本；已无无效引用时不会再次修改文件');

fs.writeFileSync(path.join(root, 'scripts', 'broken-images-report.md'), lines.join('\n'), 'utf8');
console.log('Written scripts/broken-images-report.md');
