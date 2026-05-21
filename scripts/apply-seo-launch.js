/**
 * Full-site SEO launch: domain, meta tags, canonical, image alt, inject AR meta script ref
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./seo-config');

const root = path.join(__dirname, '..');
const BRAND_SUFFIX = ' | ' + cfg.BRAND;
const MAX_TITLE = 60;
const MAX_DESC = 160;

function walkHtml(dir, list = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'scripts', 'docs'].includes(ent.name)) continue;
      walkHtml(p, list);
    } else if (ent.name.endsWith('.html')) list.push(p);
  }
  return list;
}

function relUrl(filePath) {
  let rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
}

function canonicalUrl(filePath) {
  const rel = relUrl(filePath);
  const base = cfg.SITE.replace(/\/$/, '');
  if (rel === '/') return base + '/';
  return base + (rel.endsWith('/') ? rel.slice(0, -1) : rel);
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max - 3).trim() + '...';
}

function buildTitle(mainPart) {
  let t = mainPart + BRAND_SUFFIX;
  if (t.length <= MAX_TITLE) return t;
  const avail = MAX_TITLE - BRAND_SUFFIX.length - 3;
  return truncate(mainPart, avail) + BRAND_SUFFIX;
}

function extractText(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

function resolveSeo(filePath, html) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/').toLowerCase();
  const h2 = extractText(html, /<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const h1 = extractText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const headline = extractText(html, /class="headline"[^>]*>([\s\S]*?)<\//i);
  const titleBt = extractText(html, /class="title_bt"[^>]*>([\s\S]*?)<\//i);
  const pageName = h2 || headline || titleBt || h1 || 'Beverage Machinery';

  if (rel === 'index.html') return { ...cfg.PAGES.home, pageName: 'Home' };

  if (rel.startsWith('product/index')) return { ...cfg.PAGES.products, pageName: 'Products' };
  if (rel === 'product/tuijianchanpin/index.html' || rel.match(/^product\/tuijianchanpin\/index-\d+\.html$/))
    return { ...cfg.PAGES.featured, pageName: 'Featured Products' };

  const catM = rel.match(/product\/(?:tuijianchanpin\/)?([^/]+)\/index(?:-\d+)?\.html$/);
  if (catM && cfg.CATEGORY[catM[1]]) {
    const c = cfg.CATEGORY[catM[1]];
    return {
      enTitle: c.enTitle,
      enDesc: c.enDesc,
      enKw: c.enKw,
      arTitle: c.arTitle,
      arAlt: c.arAlt,
      enAlt: c.enAlt,
      pageName: c.name,
      categorySlug: catM[1]
    };
  }

  const mainCat = rel.match(/^product\/([^/]+)\/index(?:-\d+)?\.html$/);
  if (mainCat && cfg.CATEGORY[mainCat[1]]) {
    const c = cfg.CATEGORY[mainCat[1]];
    return {
      enTitle: c.enTitle,
      enDesc: c.enDesc,
      enKw: c.enKw,
      arTitle: c.arTitle,
      arAlt: c.arAlt,
      enAlt: c.enAlt,
      pageName: c.name,
      categorySlug: mainCat[1]
    };
  }

  if (rel.startsWith('message/')) return { ...cfg.PAGES.inquiry, pageName: 'Online Inquiry' };
  if (rel.startsWith('contactus/')) return { ...cfg.PAGES.contact, pageName: 'Contact Us' };

  if (rel.startsWith('about/')) {
    const slug = rel.split('/')[1] || '';
    const label = cfg.ABOUT_SLUG[slug] || pageName;
    return {
      enTitle: `About ${label} - Beverage Filling Manufacturer`,
      enDesc: cfg.PAGES.about.enDesc,
      enKw: cfg.PAGES.about.enKw,
      arTitle: cfg.PAGES.about.arTitle,
      arDesc: cfg.PAGES.about.arDesc,
      arKw: cfg.PAGES.about.arKw,
      pageName: label
    };
  }

  if (rel.match(/\/companynews\//)) return { ...cfg.PAGES.companyNews, pageName };
  if (rel.match(/\/industrynews\//)) return { ...cfg.PAGES.industryNews, pageName };
  if (rel.startsWith('news/')) return { ...cfg.PAGES.news, pageName };

  if (rel.includes('/support/') || rel.includes('/download') || rel.includes('/video'))
    return { ...cfg.PAGES.support, pageName };

  if (rel.includes('/case') || rel.includes('/anli')) return { ...cfg.PAGES.cases, pageName };

  // product detail / article
  if (rel.match(/\d{4}\//) || rel.includes('/product/') && rel.endsWith('.html') && !rel.includes('index')) {
    const clean = pageName.replace(/\s*-\s*KIWL.*$/i, '').trim();
    return {
      enTitle: `${clean} - Beverage Filling Machine`,
      enDesc: truncate(
        `${clean} from Medium Beverage Machinery. Professional beverage filling machine and water bottling solutions for export.`,
        MAX_DESC
      ),
      enKw: 'beverage filling machine, water bottling machine, medium beverage machinery',
      arTitle: `${clean} - آلة تعبئة المشروبات`,
      pageName: clean,
      enAlt: `${clean} - beverage filling equipment`,
      arAlt: `${clean} - معدات تعبئة المشروبات`
    };
  }

  return {
    enTitle: `${pageName} - Beverage Filling Machinery`,
    enDesc: truncate(
      `${pageName} — Medium Beverage Machinery supplies beverage filling machines and water bottling lines worldwide.`,
      MAX_DESC
    ),
    enKw: cfg.CORE_EN.kw,
    pageName
  };
}

function setMeta(html, name, content) {
  const esc = content.replace(/"/g, '&quot;');
  const tag = `<meta name="${name}" content="${esc}" />`;
  const re = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i');
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<head>/i, `<head>\n${tag}`);
}

function setCanonicalAndHreflang(html, can) {
  html = html.replace(/<link\s+rel=["'](?:canonical|alternate)["'][^>]*>/gi, '');
  const block =
    `<link rel="canonical" href="${can}" />\n` +
    `<link rel="alternate" hreflang="en" href="${can}" />\n` +
    `<link rel="alternate" hreflang="ar" href="${can}" />\n` +
    `<link rel="alternate" hreflang="x-default" href="${can}" />\n`;
  return html.replace(/<\/head>/i, block + '</head>');
}

function injectSeoScript(html, depth) {
  const prefix = depth <= 0 ? 'statics/' : '../'.repeat(depth) + 'statics/';
  const src = prefix + 'js/seo-meta-ar.js';
  if (html.includes('seo-meta-ar.js')) return html;
  const tag = `<script src="${src}" defer></script>`;
  if (html.includes('lang.js')) {
    return html.replace(/(<script[^>]*lang\.js[^>]*><\/script>)/i, `$1\n${tag}`);
  }
  return html.replace(/<\/body>/i, `${tag}\n</body>`);
}

function fixAlts(html, seo) {
  if (!seo.enAlt) return html;
  const enAlt = seo.enAlt.replace(/"/g, '&quot;');
  return html.replace(/<img([^>]*?)alt=["'][^"']*["']([^>]*?)>/gi, (full, a, b) => {
    if (/logo|icon|arrow|blank|spacer/i.test(full)) return full;
    return `<img${a}alt="${enAlt}"${b}>`;
  });
}

function fixBreadcrumb(html, titleMain) {
  const short = titleMain.split(' - ')[0].split(' | ')[0].trim();
  return html.replace(
    /(<div class="title_bt"[^>]*>)([\s\S]*?)(<\/div>)/i,
    (m, o, inner, c) => {
      if (inner.length > 120) return m;
      return `${o}${short}${c}`;
    }
  );
}

function migrateDomain(html) {
  let h = html;
  h = h.replace(/https?:\/\/(?:www\.)?kiwlmachine\.com/gi, cfg.SITE.replace(/\/$/, ''));
  h = h.replace(/https?:\/\/(?:www\.)?zjgjmx\.cn/gi, cfg.SITE.replace(/\/$/, ''));
  h = h.replace(/https?:\/\/(?:www\.)?zjgjmx\.com/gi, cfg.SITE.replace(/\/$/, ''));
  return h;
}

function depthFromRoot(filePath) {
  const rel = path.relative(root, filePath);
  const parts = rel.split(path.sep);
  parts.pop();
  return parts.length;
}

function applyFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const seo = resolveSeo(filePath, html);
  const title = buildTitle(seo.enTitle || seo.pageName);
  const desc = truncate(seo.enDesc, MAX_DESC);
  const kw = seo.enKw || cfg.CORE_EN.kw;

  html = migrateDomain(html);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = setMeta(html, 'description', desc);
  html = setMeta(html, 'keywords', kw);

  const can = canonicalUrl(filePath);
  html = setCanonicalAndHreflang(html, can);
  html = html.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*>/gi, '');

  html = html.replace(/<html([^>]*)>/i, (m, attrs) => {
    if (/data-seo-ar-title/i.test(attrs)) return m;
    const arTitle = (seo.arTitle || '').replace(/"/g, '&quot;');
    const arDesc = truncate(seo.arDesc || '', MAX_DESC).replace(/"/g, '&quot;');
    const arKw = (seo.arKw || cfg.CORE_AR.kw).replace(/"/g, '&quot;');
    return `<html${attrs} data-seo-ar-title="${arTitle}" data-seo-ar-desc="${arDesc}" data-seo-ar-keywords="${arKw}">`;
  });

  html = fixAlts(html, seo);
  if (seo.enTitle) html = fixBreadcrumb(html, seo.enTitle);

  html = injectSeoScript(html, depthFromRoot(filePath));

  // Brand name in visible KIWL -> Medium Beverage Machinery (selective, meta only areas)
  html = html.replace(/KIWL Machinery/g, cfg.BRAND_NAME);
  html = html.replace(/KIWL Machine/gi, cfg.BRAND_NAME);

  fs.writeFileSync(filePath, html, 'utf8');
  return { rel: path.relative(root, filePath), title };
}

const files = walkHtml(root);
const titles = new Map();
let dup = 0;
for (const f of files) {
  const r = applyFile(f);
  if (titles.has(r.title)) dup++;
  else titles.set(r.title, r.rel);
}
console.log('SEO applied to', files.length, 'HTML files. Duplicate titles:', dup);
