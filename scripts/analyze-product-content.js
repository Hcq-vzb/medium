const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile', 'html']);

function walk(d, l = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(p, l);
    } else if (e.name.endsWith('.html')) l.push(p);
  }
  return l;
}

function extract(html) {
  const name = (html.match(/class="des_box"[^>]*>[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/i) || [])[1] || '';
  const slugM = html.match(/\/product\/([^/"']+)/i);
  const yearM = (html.match(/\/(\d{4})\/([^/]+)\//) || []);
  const slug = yearM[2] || '';
  const tb = html.match(/class="text_box"[^>]*>([\s\S]*?)(?=<div class="text_title"|<\/div>\s*<\/div>\s*<div class="clear")/i);
  const inner = tb ? tb[1] : '';
  const plain = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const hasTable = /<table/i.test(inner);
  const hasImg = /<img/i.test(inner);
  return { name: name.replace(/<[^>]+>/g, '').trim(), slug, plain, hasTable, hasImg, inner };
}

function classify({ plain, inner }) {
  if (plain.length < 80) return 'thin';
  if (
    /technology\s*\.|equipment\s*\.|Filling\.|,\s*We\s*\.|KIWL China|PETtechnology|\.{3,}|products\s+Precision|Monoblock\s+Filling\s+Machineequipment/i.test(
      plain
    )
  )
    return 'garbled';
  if (/[\u4e00-\u9fff]/.test(plain)) return 'chinese';
  return 'ok';
}

const stats = { thin: 0, garbled: 0, chinese: 0, ok: 0, total: 0 };
const bySlug = {};

for (const f of walk(root)) {
  const h = fs.readFileSync(f, 'utf8');
  if (!h.includes('des_box')) continue;
  stats.total++;
  const ex = extract(h);
  const c = classify(ex);
  stats[c]++;
  bySlug[ex.slug] = bySlug[ex.slug] || { thin: 0, garbled: 0, chinese: 0, ok: 0 };
  bySlug[ex.slug][c]++;
}

console.log(JSON.stringify({ stats, bySlug }, null, 2));
