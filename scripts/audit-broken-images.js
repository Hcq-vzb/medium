const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico']);

function isImageFile(fullPath) {
  return IMAGE_EXT.has(path.extname(fullPath).toLowerCase());
}

function getUploadRelative(src) {
  let m = src.match(/(?:www\.zjgjmx\.(?:com|cn)[/\\]+)?(uploadfile[/\\].+)$/i);
  if (m) return m[1].replace(/\\/g, '/');
  m = src.match(/https?:\/\/[^/]+\/(uploadfile\/.+)$/i);
  if (m) return m[1];
  return null;
}

function resolveImg(htmlPath, src) {
  src = src.trim();
  if (!src || src === '#' || /^javascript:/i.test(src)) return null;

  if (/^(https?:)?\/\//i.test(src)) {
    const rel = getUploadRelative(src);
    if (rel) {
      const full = path.join(root, rel.replace(/\//g, path.sep));
      if (fs.existsSync(full) && isImageFile(full)) return { ok: true, fixed: rel };
    }
    return null;
  }

  const htmlDir = path.dirname(htmlPath);
  const candidate = path.resolve(htmlDir, src.replace(/\//g, path.sep));
  if (fs.existsSync(candidate) && isImageFile(candidate)) return { ok: true, fixed: src };

  const rel = getUploadRelative(src);
  if (rel) {
    const full = path.join(root, rel.replace(/\//g, path.sep));
    if (fs.existsSync(full) && isImageFile(full)) {
      const sub = htmlDir.slice(root.length).replace(/^[/\\]/, '');
      const depth = sub ? sub.split(/[/\\]/).length : 0;
      const fixedRel = depth <= 0 ? rel : '../'.repeat(depth) + rel;
      return { ok: true, fixed: fixedRel };
    }
  }
  return null;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(p, out);
    } else if (/\.html?$/i.test(name)) out.push(p);
  }
  return out;
}

const broken = [];
let totalImg = 0;
let okImg = 0;

for (const htmlPath of walk(root)) {
  const content = fs.readFileSync(htmlPath, 'utf8');
  const re = /<img\b[^>]*>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    totalImg++;
    const tag = m[0];
    const sm = tag.match(/\bsrc\s*=\s*(["'])(.*?)\1/i);
    if (!sm) {
      broken.push({ file: path.relative(root, htmlPath), src: '(no src)', tag: tag.slice(0, 80) });
      continue;
    }
    const src = sm[2];
    const r = resolveImg(htmlPath, src);
    if (!r) {
      broken.push({ file: path.relative(root, htmlPath).replace(/\\/g, '/'), src });
    } else {
      okImg++;
    }
  }
}

const outPath = path.join(root, 'scripts', 'audit-broken-images-result.json');
fs.writeFileSync(outPath, JSON.stringify({ totalImg, okImg, brokenCount: broken.length, broken }, null, 2));
console.log('Total img:', totalImg, 'OK:', okImg, 'Broken:', broken.length);
console.log('Written:', outPath);
if (broken.length) {
  const byFile = {};
  for (const b of broken) {
    byFile[b.file] = (byFile[b.file] || 0) + 1;
  }
  console.log('Files with broken imgs:', Object.keys(byFile).length);
  console.log(JSON.stringify(byFile, null, 2).slice(0, 3000));
}
