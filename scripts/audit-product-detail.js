/**
 * Audit product detail pages for video remnants and common content issues.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile', 'html']);

function walkHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walkHtml(p, list);
    } else if (ent.name.endsWith('.html')) list.push(p);
  }
  return list;
}

function isProductDetail(html) {
  return html.includes('des_box') || html.includes('porduct_show');
}

function auditFile(filePath, html) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const issues = [];

  if (/<embed[^>]*(swf|shockwave)/i.test(html)) issues.push('embed_swf');
  if (/taobao\.com\/play|cloud\.video\.taobao/i.test(html)) issues.push('taobao_video');
  if (/<object[^>]*(flash|swf)/i.test(html)) issues.push('object_flash');
  if (/jm_video_bx|h5swfvideo|h5swf_jsmodern/i.test(html)) issues.push('h5swf_player');
  if (/data-mp4|\.mp4/i.test(html)) issues.push('mp4_url');
  if (/<video[\s>]/i.test(html)) issues.push('video_tag');
  if (/<iframe[^>]*(youtube|video|mp4|taobao)/i.test(html)) issues.push('iframe_video');

  if (/<li>Category:\s*<\/li>/.test(html)) issues.push('empty_category');
  if (/<li>type:\s*<\/li>/.test(html)) issues.push('empty_type');
  if (/<li>Price:\s*<\/li>/.test(html)) issues.push('empty_price');
  if (/<li>TAG:\s*<\/li>/.test(html)) issues.push('empty_tag');

  const textBox = html.match(/class="text_box"[^>]*>([\s\S]*?)(?:<div class="text_title"|<\/div>\s*<\/div>\s*<div class="clear")/i);
  if (textBox) {
    const plain = textBox[1]
      .replace(/<embed[\s\S]*?<\/embed>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length < 40) issues.push('thin_intro');
  }

  return issues.length ? { rel, issues } : null;
}

const summary = {};
const rows = [];

for (const filePath of walkHtml(root)) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (!isProductDetail(html)) continue;
  const row = auditFile(filePath, html);
  if (!row) continue;
  rows.push(row);
  for (const issue of row.issues) {
    summary[issue] = (summary[issue] || 0) + 1;
  }
}

rows.sort((a, b) => a.rel.localeCompare(b.rel));

const report = [
  '# Product Detail Page Audit',
  '',
  `Scanned: ${walkHtml(root).filter((f) => isProductDetail(fs.readFileSync(f, 'utf8'))).length} product detail pages`,
  `Pages with issues: ${rows.length}`,
  '',
  '## Issue counts',
  '',
  ...Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `- **${k}**: ${v}`),
  '',
  '## Affected pages',
  '',
  ...rows.map((r) => `- \`${r.rel}\`: ${r.issues.join(', ')}`)
];

const outPath = path.join(root, 'docs', 'PRODUCT-DETAIL-AUDIT.md');
fs.writeFileSync(outPath, report.join('\n'), 'utf8');

console.log(JSON.stringify({ pagesWithIssues: rows.length, summary }, null, 2));
console.log('Report:', outPath);
