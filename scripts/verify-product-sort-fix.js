const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const checks = [];

function extractTitles(html) {
  const box = html.match(/<div class="nva_box">([\s\S]*?)<\/div>\s*<div class="hotline_box">/i);
  if (!box) return null;
  return {
    main: [...box[1].matchAll(/<h3[^>]*><a[^>]*title=['"]([^'"]+)['"]/gi)].map((m) => m[1]),
    sub: [...box[1].matchAll(/<li class="subclass"><a[^>]*title=['"]([^'"]+)['"]/gi)].map(
      (m) => m[1]
    )
  };
}

const ref = extractTitles(fs.readFileSync(path.join(root, 'product', 'index.html'), 'utf8'));
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const homeBox = home.match(/class_bx[\s\S]*?<ul>([\s\S]*?)<\/ul>/i);
const homeUnique = homeBox
  ? [...homeBox[1].matchAll(/<a[^>]*title=['"]([^'"]+)['"]/gi)].map((m) => m[1])
  : [];

checks.push({
  name: 'Homepage class_bx count',
  ok: homeUnique.length === 17,
  detail: homeUnique.length + ' categories'
});

const classBx = home.match(/<div class="class_bx">[\s\S]*?<\/ul>/i);
checks.push({
  name: 'Homepage class_bx Juice title',
  ok: classBx && classBx[0].includes('title="Juice Filling Machine"'),
  detail: ''
});

function walk(d, l) {
  for (const n of fs.readdirSync(d)) {
    const p = path.join(d, n);
    if (fs.statSync(p).isDirectory()) walk(p, l);
    else if (/\.html$/i.test(n)) l.push(p);
  }
}

const files = [];
walk(path.join(root, 'product'), files);
let navBad = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('nva_box')) continue;
  const t = extractTitles(html);
  if (JSON.stringify(t.main) !== JSON.stringify(ref.main)) navBad++;
  if (t.sub.length && JSON.stringify(t.sub) !== JSON.stringify(ref.sub)) navBad++;
}

checks.push({
  name: 'Product pages nav title order',
  ok: navBad === 0,
  detail: navBad + ' mismatches'
});

const floatOk = fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('kiwl-chat-widget');
checks.push({ name: 'Float contact on index', ok: floatOk, detail: '' });

const moreOk =
  !fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes('html/product/index.html');
checks.push({ name: 'More link not 404', ok: moreOk, detail: '' });

let garbled = 0;
let badXunpan = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  if (!html.includes('cp_box_one')) continue;
  if (/Filling MachinePhotoelectric|FillingMineral|1 ,180&deg;\. 2 ,/.test(html)) garbled++;
  if (/href=["']#["'][^>]*class=["']xunpan["']/i.test(html)) badXunpan++;
}
checks.push({
  name: 'No garbled product card descriptions',
  ok: garbled === 0,
  detail: garbled + ' files'
});
checks.push({
  name: 'Online Inquiry links on product cards',
  ok: badXunpan === 0,
  detail: badXunpan + ' broken'
});

const prodIndex = fs.readFileSync(path.join(root, 'product', 'index.html'), 'utf8');
const featOff = /Featured Products<\/a><\/h3>\s*<ul class="sub_bx">/.test(prodIndex)
  ? !/<h3 class="on"><a[^>]*Featured Products/.test(prodIndex)
  : false;
checks.push({
  name: 'product/index Featured not forced on',
  ok: featOff,
  detail: featOff ? 'Featured is off' : 'Featured still on'
});

let pass = 0;
console.log('=== Product sort fix verification ===\n');
for (const c of checks) {
  const st = c.ok ? 'PASS' : 'FAIL';
  if (c.ok) pass++;
  console.log(st, c.name, c.detail ? '- ' + c.detail : '');
}
console.log('\n' + pass + '/' + checks.length + ' checks passed');
process.exit(pass === checks.length ? 0 : 1);
