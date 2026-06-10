/**
 * Full-site SEO launch: domain, meta tags, canonical, image alt, inject AR meta script ref
 */
const fs = require('fs');
const path = require('path');
const cfg = require('./seo-config');
const pyramid = require('./keyword-pyramid');

const root = path.join(__dirname, '..');
const BRAND_SUFFIX = ' | ' + cfg.BRAND;
const MAX_TITLE = 70;
const MAX_DESC = 160;
const PHONE_RE = /0086|18151132311|global service hotline|contact us\s*$/i;
const SKIP_DIRS = new Set(['node_modules', '.git', 'scripts', 'docs', 'statics', 'uploadfile']);

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

const GENERIC_LABELS =
  /^(article|products?|product details|news\s*&\s*insights|company news|industry news|contact us|hot news|case studies|technical support|video gallery|hot news|online inquiry|about us|home|first|next|previous|product description|specifications|applications|featured products?)$/i;

function isNoiseText(text) {
  if (!text || text.length < 3) return true;
  const t = text.trim();
  if (PHONE_RE.test(t)) return true;
  if (/^404\b/i.test(t)) return true;
  if (/^nginx$/i.test(t)) return true;
  if (GENERIC_LABELS.test(t)) return true;
  if (/^contact us$/i.test(t)) return true;
  if (/^you are here:/i.test(t)) return true;
  return false;
}

function cleanPageName(text) {
  return (text || '')
    .replace(/\s*-\s*KIWL.*$/i, '')
    .replace(/^[,.\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractArticleTitle(html) {
  return extractText(html, /class="article"[^>]*>[\s\S]*?<div class="title"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i);
}

function extractArticleLead(html) {
  const block = html.match(/class="article"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<div class="(?:next_page|clear)/i);
  if (!block) return '';
  const plain = block[1]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.slice(0, 155);
}

function extractDisambiguator(html, filePath) {
  const model = html.match(/\b(\d{1,2}-\d{1,2}-\d{1,2})\b/);
  if (model) return model[1];
  const bph = html.match(/\b(\d{1,3}(?:,\d{3})*|\d{2,5})\s*BPH\b/i);
  if (bph) return `${bph[1].replace(/,/g, '')} BPH`;
  const id = path.basename(filePath, '.html');
  if (/^\d+$/.test(id) && id !== '0' && !/^0+$/.test(id)) return id;
  return null;
}

function isLegacyPagedList(rel) {
  if (/^product\/\d+\.html$/i.test(rel)) return true;
  if (/^(news|kehuanli|jishuzhichi)\/\d+\.html$/i.test(rel)) return true;
  if (/^(news|kehuanli|jishuzhichi)\/[^/]+\/\d+\.html$/i.test(rel)) return true;
  if (/^product\/(?:tuijianchanpin\/)?[^/]+\/\d+\.html$/i.test(rel)) return true;
  if (/^product\/tuijianchanpin\/\d+\.html$/i.test(rel)) return true;
  return false;
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
  const clean = (mainPart || 'Beverage Filling Machinery')
    .replace(PHONE_RE, '')
    .replace(/\s+/g, ' ')
    .trim();
  let t = clean + BRAND_SUFFIX;
  if (t.length <= MAX_TITLE) return t;
  const avail = MAX_TITLE - BRAND_SUFFIX.length;
  let cut = clean.slice(0, avail);
  const sp = cut.lastIndexOf(' ');
  if (sp > avail * 0.5) cut = cut.slice(0, sp);
  return cut.trim() + BRAND_SUFFIX;
}

function extractText(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
}

function extractPageName(html, filePath) {
  const mainHtml = html.replace(/class="left_box"[\s\S]*?(?=class="right_box")/i, '');
  const candidates = [
    extractText(mainHtml, /class="des_box"[^>]*>[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/i),
    extractArticleTitle(html),
    extractText(mainHtml, /class="des_box"[^>]*>[\s\S]*?<h4[^>]*>([\s\S]*?)<\/h4>/i),
    extractText(html, /id="main_img"[^>]*alt=["']([^"']+)["']/i),
    extractText(mainHtml, /class="title_bt"[^>]*>[\s\S]*?<h1>([\s\S]*?)<\/h1>/i),
    extractText(mainHtml, /class="bt"[^>]*>[\s\S]*?<a[^>]*title=["']([^"']+)["']/i),
    extractText(mainHtml, /class="details"[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/i)
  ];
  for (const c of candidates) {
    const clean = cleanPageName(c);
    if (clean && !isNoiseText(clean)) return clean;
  }
  const h2all = [...mainHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  for (const m of h2all) {
    const t = cleanPageName(m[1].replace(/<[^>]+>/g, ' '));
    if (!isNoiseText(t) && t.length > 4) return t;
  }
  const model = pyramid.extractModelToken('', mainHtml);
  if (model) {
    const slug = pyramid.slugFromRel(path.relative(root, filePath).replace(/\\/g, '/').toLowerCase());
    const cat = slug && pyramid.CATEGORY_PRIMARY[slug] ? pyramid.CATEGORY_PRIMARY[slug] : 'beverage filling machine';
    return `${model} ${cat}`;
  }
  const tag = extractDisambiguator(html, filePath);
  if (tag) return `Beverage Filling Machine ${tag}`;
  return 'Beverage Filling Machine';
}

function pageKey(filePath) {
  const base = path.basename(filePath, '.html');
  if (base !== 'index') return base;
  const dir = path.basename(path.dirname(filePath));
  if (dir === '.' || dir === path.basename(root)) return 'home';
  return dir;
}

function getArMeta(rel, slug) {
  if (rel === 'index.html') return cfg.PAGES.home;
  if (rel === 'product/index.html') return cfg.PAGES.products;
  if (rel === 'product/tuijianchanpin/index.html') return cfg.PAGES.featured;
  if (slug && cfg.CATEGORY[slug]) {
    const c = cfg.CATEGORY[slug];
    return {
      arTitle: c.arTitle,
      arDesc: c.arDesc || cfg.PAGES.products.arDesc,
      arKw: cfg.CORE_AR.kw,
      enAlt: c.enAlt,
      arAlt: c.arAlt
    };
  }
  if (rel.startsWith('about/')) return cfg.PAGES.about;
  if (rel.startsWith('contactus/')) return cfg.PAGES.contact;
  if (rel.startsWith('message/')) return cfg.PAGES.inquiry;
  if (rel.startsWith('jishuzhichi/')) return cfg.PAGES.support;
  if (rel.startsWith('kehuanli/')) return cfg.PAGES.cases;
  if (rel.includes('conews')) return cfg.PAGES.companyNews;
  if (rel.includes('hynews')) return cfg.PAGES.industryNews;
  if (rel.startsWith('news/')) return cfg.PAGES.news;
  return { arTitle: '', arDesc: '', arKw: cfg.CORE_AR.kw };
}

function resolveSeo(filePath, html) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/').toLowerCase();
  const pageName = extractPageName(html, filePath);

  if (rel.startsWith('html/')) {
    return {
      enTitle: pyramid.buildTitleFromPrimary('Page Not Found'),
      enDesc: 'The requested page was not found. Browse beverage filling machines at Medium Beverage Machinery.',
      enKw: pyramid.formatKwList('beverage filling machine', ['water bottling machine']),
      pageName: '404',
      noindex: true,
      pyramidTitle: true
    };
  }

  if (isLegacyPagedList(rel)) {
    const section =
      rel.startsWith('product/') ? 'Products' :
      rel.startsWith('news/') ? 'News' :
      rel.startsWith('kehuanli/') ? 'Case Studies' :
      rel.startsWith('jishuzhichi/') ? 'Support' : pageName;
    const pageNum = (rel.match(/(\d+)\.html$/) || [])[1] || '2';
    return {
      enTitle: pyramid.buildTitleFromPrimary(`${section} — page ${pageNum}`),
      enDesc: `Page ${pageNum} of ${section}. ${cfg.BRAND_NAME} supplies export bottling equipment with global support.`,
      enKw: pyramid.formatKwList(section, ['water bottling machine']),
      pageName: section,
      noindex: true,
      pyramidTitle: true
    };
  }

  const slug = pyramid.slugFromRel(rel);
  const ar = getArMeta(rel, slug);
  const mainSnippet = html.replace(/class="left_box"[\s\S]*?(?=class="right_box")/i, '').slice(0, 8000);
  const p = pyramid.resolvePyramid(rel, pageName, slug, mainSnippet);
  const cat = slug && cfg.CATEGORY[slug] ? cfg.CATEGORY[slug] : null;
  const clean = cleanPageName(pageName.replace(PHONE_RE, '')) || p.h1;
  const articleLead = extractArticleLead(html);
  const enDesc = articleLead
    ? truncate(cleanDesc(articleLead), MAX_DESC)
    : truncate(cleanDesc(p.enDesc), MAX_DESC);

  return {
    tier: p.tier,
    primary: p.primary,
    secondary: p.secondary,
    enTitle: p.enTitle,
    enDesc,
    enKw: p.enKw,
    h1: clean.length > 4 ? clean : p.h1,
    pageName: clean,
    pyramidTitle: true,
    disambiguator: extractDisambiguator(html, filePath),
    arTitle: ar.arTitle || (cat ? cat.arTitle : ''),
    arDesc: ar.arDesc || '',
    arKw: ar.arKw || cfg.CORE_AR.kw,
    enAlt: ar.enAlt || (cat ? cat.enAlt : `${clean} - beverage filling equipment`),
    arAlt: ar.arAlt || `${clean} - معدات تعبئة المشروبات`,
    categorySlug: slug,
    isHome: rel === 'index.html',
    isProduct: !!rel.match(/\d{4}\//),
    productName: clean,
    paginationPage: p.paginationPage || null
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
  const defaultAlt = (seo.enAlt || `${seo.pageName || 'Beverage equipment'} - beverage filling equipment`)
    .replace(/"/g, '&quot;');

  html = html.replace(/<a([^>]*\btitle=["']([^"']+)["'][^>]*)>\s*<img((?![^>]*\balt=)[^>]*?)>/gi, (full, a, title, img) => {
    if (/logo|icon|arrow|blank|spacer|news_rm/i.test(full)) return full;
    const alt = `${title} - beverage filling equipment`.replace(/"/g, '&quot;');
    return `<a${a}><img alt="${alt}"${img}>`;
  });

  html = html.replace(/<img((?![^>]*\balt=)[^>]*?)src=["']([^"']*uploadfile[^"']+)["']([^>]*?)>/gi, (full, a, src, b) => {
    if (/logo|icon|arrow|blank|spacer|news_rm/i.test(full)) return full;
    return `<img${a}src="${src}" alt="${defaultAlt}"${b}>`;
  });

  const usInfoLabels = ['Corporate Culture', 'Facilities', 'Certifications and Honors', 'Development History'];
  let usInfoIdx = 0;
  html = html.replace(/<img((?![^>]*\balt=)[^>]*?)src=["']([^"']*us_info_\d+\.jpg)["']([^>]*?)>/gi, (full, a, src, b) => {
    const label = usInfoLabels[usInfoIdx++] || 'About Medium Beverage Machinery';
    const alt = `${label} - beverage filling equipment`.replace(/"/g, '&quot;');
    return `<img alt="${alt}"${a}src="${src}"${b}>`;
  });

  html = html.replace(/<img([^>]*?)alt=["']([^"']*)["']([^>]*?)>/gi, (full, a, alt, b) => {
    if (/logo|icon|arrow|blank|spacer|news_rm/i.test(full)) return full;
    if (alt.trim().length >= 8) return full;
    return `<img${a}alt="${defaultAlt}"${b}>`;
  });

  return html;
}

function fixBreadcrumb(html, titleMain) {
  const short = titleMain.split(' - ')[0].split(' | ')[0].trim();
  html = html.replace(
    /(<div class="title_bt"[^>]*>)([\s\S]*?)(<\/div>)/i,
    (m, o, inner, c) => {
      if (inner.length > 120) return m;
      return `${o}${short}${c}`;
    }
  );
  html = html.replace(/>\s*Article\s*<\/h4>/gi, `> ${short} </h4>`);
  html = html.replace(/class="headline">\s*Article\s*<\/div>/gi, `class="headline">${short}</div>`);
  return html;
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

function cleanDesc(text) {
  return (text || '')
    .replace(PHONE_RE, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractOgImage(html, depth) {
  const prefix = depth <= 0 ? '' : '../'.repeat(depth);
  const m =
    html.match(/<img[^>]+src=["'](uploadfile\/[^"']+)["']/i) ||
    html.match(/<img[^>]+src=["'](statics\/images\/[^"']+)["']/i);
  if (m) return cfg.SITE.replace(/\/$/, '') + '/' + prefix + m[1].replace(/^\.\.\//, '');
  return cfg.SITE.replace(/\/$/, '') + '/statics/images/logo.jpg';
}

function injectOpenGraph(html, seo, can, ogImage) {
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '');
  const title = (seo.enTitle || seo.pageName || cfg.BRAND_NAME).replace(/"/g, '&quot;');
  const desc = cleanDesc(seo.enDesc || '').replace(/"/g, '&quot;');
  const type = seo.isProduct ? 'product' : seo.isHome ? 'website' : 'article';
  const block =
    `<meta property="og:type" content="${type}" />\n` +
    `<meta property="og:site_name" content="${cfg.BRAND_NAME}" />\n` +
    `<meta property="og:title" content="${title}" />\n` +
    `<meta property="og:description" content="${desc}" />\n` +
    `<meta property="og:url" content="${can}" />\n` +
    `<meta property="og:image" content="${ogImage}" />\n` +
    `<meta name="twitter:card" content="summary_large_image" />\n` +
    `<meta name="twitter:title" content="${title}" />\n` +
    `<meta name="twitter:description" content="${desc}" />\n` +
    `<meta name="twitter:image" content="${ogImage}" />\n`;
  return html.replace(/<\/head>/i, block + '</head>');
}

function injectJsonLd(html, seo, can, ogImage) {
  html = html.replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  let schema;
  if (seo.isHome) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: cfg.BRAND_NAME,
      url: cfg.SITE,
      logo: cfg.SITE.replace(/\/$/, '') + '/statics/images/logo.jpg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+86-18151132311',
        contactType: 'sales',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Arabic']
      }
    };
  } else if (seo.isProduct && seo.productName) {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: seo.productName,
      description: cleanDesc(seo.enDesc),
      image: ogImage,
      brand: { '@type': 'Brand', name: cfg.BRAND_NAME },
      manufacturer: { '@type': 'Organization', name: cfg.BRAND_NAME, url: cfg.SITE },
      url: can
    };
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.enTitle || seo.pageName,
      description: cleanDesc(seo.enDesc),
      url: can,
      isPartOf: { '@type': 'WebSite', name: cfg.BRAND_NAME, url: cfg.SITE }
    };
  }
  const tag = `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n`;
  return html.replace(/<\/head>/i, tag + '</head>');
}

function setRobotsMeta(html, noindex) {
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');
  if (!noindex) return html;
  return html.replace(/<\/head>/i, '<meta name="robots" content="noindex, follow" />\n</head>');
}

function injectPaginationRel(html, filePath, seo) {
  html = html.replace(/<link\s+rel=["'](?:prev|next)["'][^>]*>/gi, '');
  const dir = path.dirname(filePath);
  const rel = path.relative(root, filePath).replace(/\\/g, '/').toLowerCase();
  const index2Path = path.join(dir, 'index-2.html');

  if (seo.paginationPage === 2) {
    const page1 = canonicalUrl(path.join(dir, 'index.html'));
    return html.replace(/<\/head>/i, `<link rel="prev" href="${page1}" />\n</head>`);
  }
  if (/index\.html$/i.test(rel) && fs.existsSync(index2Path)) {
    const page2 = canonicalUrl(index2Path);
    return html.replace(/<\/head>/i, `<link rel="next" href="${page2}" />\n</head>`);
  }
  return html;
}

function fixPhoneInContent(html) {
  return html
    .replace(/(<div class="title_bt"[^>]*>)\s*About\s*0086[^<]*(<\/div>)/gi, '$1About Us$2')
    .replace(/(<div class="title_bt"[^>]*>)\s*[^<]*0086-18151132311[^<]*(<\/div>)/gi, '$1Products$2')
    .replace(/alt="0086-18151132311[^"]*"/gi, (m) => m.replace(/0086-18151132311\s*-?\s*/i, ''));
}

function injectSemanticH1(html, h1Text) {
  if (!h1Text || html.includes('class="kiwl-seo-h1"') || /<h1[^>]*>/i.test(html)) return html;
  const esc = h1Text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const h1 = `<h1 class="kiwl-seo-h1">${esc}</h1>\n`;
  return html.replace(/<body[^>]*>/i, (m) => m + h1);
}

function dedupeMetaTags(html) {
  let seenDesc = false;
  let seenKw = false;
  html = html.replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, (tag) => {
    if (seenDesc) return '';
    seenDesc = true;
    return tag;
  });
  html = html.replace(/<meta\s+[^>]*name=["']keywords["'][^>]*>/gi, (tag) => {
    if (seenKw) return '';
    seenKw = true;
    return tag;
  });
  return html;
}

function applyFile(filePath, seoOverride) {
  let html = fs.readFileSync(filePath, 'utf8');
  const seo = seoOverride || resolveSeo(filePath, html);
  let title = seo.pyramidTitle ? seo.enTitle : buildTitle(seo.enTitle || seo.pageName);
  if (title.length > MAX_TITLE) {
    title = pyramid.buildTitleFromPrimary(seo.pageName || seo.h1 || 'Beverage Filling Machine');
  }
  const desc = truncate(cleanDesc(seo.enDesc || ''), MAX_DESC);
  const kw = seo.enKw || cfg.CORE_EN.kw;
  const depth = depthFromRoot(filePath);
  const can = canonicalUrl(filePath);
  const ogImage = extractOgImage(html, depth);

  html = migrateDomain(html);
  html = dedupeMetaTags(html);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = setMeta(html, 'description', desc);
  html = setMeta(html, 'keywords', kw);
  html = setCanonicalAndHreflang(html, can);
  html = setRobotsMeta(html, seo.noindex);
  html = injectPaginationRel(html, filePath, seo);
  html = injectOpenGraph(html, seo, can, ogImage);
  html = injectJsonLd(html, seo, can, ogImage);

  html = html.replace(/<html([^>]*)>/i, (m, attrs) => {
    let a = attrs.replace(/\s*data-seo-ar-\w+="[^"]*"/gi, '');
    const arTitle = (seo.arTitle || '').replace(/"/g, '&quot;');
    const arDesc = truncate(cleanDesc(seo.arDesc || ''), MAX_DESC).replace(/"/g, '&quot;');
    const arKw = (seo.arKw || cfg.CORE_AR.kw).replace(/"/g, '&quot;');
    return `<html${a} data-seo-ar-title="${arTitle}" data-seo-ar-desc="${arDesc}" data-seo-ar-keywords="${arKw}">`;
  });

  html = fixAlts(html, seo);
  if (seo.h1) html = fixBreadcrumb(html, seo.h1);
  html = fixPhoneInContent(html);
  if (seo.h1) html = injectSemanticH1(html, seo.h1);
  html = injectSeoScript(html, depth);

  fs.writeFileSync(filePath, html, 'utf8');
  return { rel: path.relative(root, filePath), title };
}

const files = walkHtml(root);

// Pass 1: resolve SEO and dedupe titles
const planned = files.map((f) => {
  const html = fs.readFileSync(f, 'utf8');
  const seo = resolveSeo(f, html);
  let title = seo.pyramidTitle ? seo.enTitle : buildTitle(seo.enTitle || seo.pageName);
  return { filePath: f, seo, title };
});

const titleGroups = new Map();
for (const item of planned) {
  const list = titleGroups.get(item.title) || [];
  list.push(item);
  titleGroups.set(item.title, list);
}

function buildUniqueTitle(pageName, fileId) {
  const suffix = ` | ${cfg.BRAND}`;
  const idPart = fileId ? ` (${fileId})` : '';
  const avail = MAX_TITLE - suffix.length - idPart.length;
  let main = (pageName || 'Beverage Filling Machine').trim();
  if (main.length > avail) {
    main = main.slice(0, avail);
    const sp = main.lastIndexOf(' ');
    if (sp > avail * 0.45) main = main.slice(0, sp);
  }
  return `${main.trim()}${idPart}${suffix}`;
}

for (const [, group] of titleGroups) {
  if (group.length < 2) continue;
  group.forEach((item) => {
    const fileId = pageKey(item.filePath);
    const base = cleanPageName(item.seo.pageName.replace(/\s+\(\w+\)$/, '').replace(/\s+\d+$/, ''));
    item.seo.pageName = `${base} (${fileId})`;
    item.seo.h1 = item.seo.pageName;
    item.seo.enTitle = buildUniqueTitle(base, fileId);
    item.seo.enAlt = `${item.seo.pageName} - beverage filling equipment`;
    item.title = item.seo.enTitle;
  });
}

let dup = 0;
const seenTitles = new Set();
for (const item of planned) {
  applyFile(item.filePath, item.seo);
  if (seenTitles.has(item.title)) dup++;
  else seenTitles.add(item.title);
}
console.log('SEO applied to', files.length, 'HTML files. Duplicate titles:', dup);
