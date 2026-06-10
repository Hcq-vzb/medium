/**
 * Keyword pyramid — aligned with Google Helpful Content / semantic search (2024+).
 *
 * Rules:
 * - One primary keyword per URL (no cannibalization between siblings).
 * - Title & H1 intent: primary keyword first.
 * - Description: primary once + 1–2 semantic secondaries in natural prose.
 * - meta keywords: max 3 terms (legacy; low weight but kept for Bing/AR parity).
 * - Tier 3 long-tail inherits category primary as secondary only.
 */
const cfg = require('./seo-config');

const TIER = {
  HEAD: 1,
  HUB: 2,
  LONGTAIL: 3,
  TRUST: 4
};

/** Tier 1 — homepage: brand + head commercial term */
const TIER1 = {
  primary: 'beverage filling machine',
  secondary: ['water bottling machine', 'beverage packaging machinery'],
  brand: 'medium beverage machinery'
};

/** Tier 2 — hub/listing pages */
const TIER2_HUBS = {
  'product/index.html': {
    primary: 'beverage filling machines',
    secondary: ['water bottling equipment', 'beverage production lines']
  },
  'product/tuijianchanpin/index.html': {
    primary: 'turnkey beverage filling equipment',
    secondary: ['water bottling lines', 'juice filling lines']
  },
  'news/index.html': {
    primary: 'beverage industry news',
    secondary: ['bottling technology', 'filling machine updates']
  },
  'news/conews/index.html': {
    primary: 'beverage machinery company news',
    secondary: ['filling equipment updates']
  },
  'news/hynews/index.html': {
    primary: 'beverage production industry news',
    secondary: ['water bottling trends']
  },
  'jishuzhichi/spzx/index.html': {
    primary: 'beverage filling machine videos',
    secondary: ['bottling equipment demos']
  },
  'jishuzhichi/zxxz/index.html': {
    primary: 'beverage filling machine downloads',
    secondary: ['bottling equipment manuals']
  },
  'kehuanli/kehupingjia/index.html': {
    primary: 'beverage filling machine customer reviews',
    secondary: ['bottling plant testimonials']
  },
  'kehuanli/kehuqunti/index.html': {
    primary: 'beverage filling machine customer base',
    secondary: ['global bottling clients']
  },
  'kehuanli/kehuheying/index.html': {
    primary: 'beverage filling machine customer photos',
    secondary: ['bottling plant references']
  }
};

/** Tier 4 — trust & conversion (brand + transactional modifier) */
const TIER4 = {
  about: {
    primary: 'beverage filling machine manufacturer',
    secondary: ['water bottling line supplier']
  },
  contact: {
    primary: 'beverage filling machine supplier',
    secondary: ['bottling equipment contact']
  },
  inquiry: {
    primary: 'beverage filling machine quote',
    secondary: ['water bottling line inquiry']
  },
  support: {
    primary: 'beverage filling machine technical support',
    secondary: ['bottling equipment manuals']
  },
  cases: {
    primary: 'beverage filling machine case studies',
    secondary: ['bottling plant references']
  }
};

/** Unique primary per category slug — prevents tier-2 cannibalization */
const CATEGORY_PRIMARY = {
  '5jialundatongshui': '5 gallon barrel water filling machine',
  chunjinshui: 'purified water filling machine',
  kuangquanshui: 'mineral water filling machine',
  hanqiyinliao: 'carbonated drink filling machine',
  guozhiyinliao: 'juice filling machine',
  yilaguanyinliao: 'aseptic PET filling machine',
  bolipinyinliao: 'glass bottle beverage filling machine',
  dapinshui: 'large bottle water filling machine',
  gzjscx: 'beverage production line',
  shuichulishebei: 'water treatment equipment for beverages',
  guozhiguanzhuangji: 'fruit juice monoblock filling machine',
  hqylgzj: 'isobaric carbonated filling machine',
  datongshuiguanzhuangji: 'barrel water filling machine',
  shuiguanzhuangji: 'PET water filling machine',
  pijiuguanzhuangji: 'beer filling machine',
  chuipingji: 'PET bottle blow molding machine',
  zhusuji: 'PET preform injection molding machine',
  tiebiaoji: 'bottle labeling machine',
  xipingji: 'bottle rinsing machine',
  mobaoji: 'shrink wrap packaging machine',
  zhenkongxuangaiji: 'vacuum bottle capping machine',
  youguanzhuangji: 'cooking oil filling machine',
  guanzhuangjipeijian: 'filling machine spare parts',
  cuogaiji: 'bottle cap twisting machine',
  fegnmiguanzhuangji: 'honey filling machine',
  'qing-jie-ji-guan-zhaung-ji': 'detergent filling machine',
  'xi-shou-ye-guan-zhuang-ji': 'hand sanitizer filling machine',
  'xiao-du-ji-guan-zhuang-ji': 'disinfectant filling machine'
};

const CATEGORY_SECONDARY = {
  '5jialundatongshui': ['water bottling plant', 'barrel filler'],
  chunjinshui: ['water bottling line', 'PET bottle filler'],
  kuangquanshui: ['mineral water bottling', 'beverage filler'],
  hanqiyinliao: ['CSD filling line', 'sparkling water filler'],
  guozhiyinliao: ['fruit juice bottling', 'aseptic juice line'],
  yilaguanyinliao: ['sterile beverage filling', 'juice aseptic line'],
  bolipinyinliao: ['glass bottle filler', 'wine bottling machine'],
  dapinshui: ['3L water filler', 'large format bottling'],
  gzjscx: ['turnkey bottling line', 'beverage packaging line'],
  shuichulishebei: ['RO water treatment', 'beverage pre-treatment'],
  guozhiguanzhuangji: ['juice monoblock filler', 'aseptic juice bottling'],
  hqylgzj: ['carbonated beverage filler', 'soft drink filling line'],
  datongshuiguanzhuangji: ['5 gallon water line', 'water dispenser filler'],
  shuiguanzhuangji: ['water bottling monoblock', 'bottle filling line'],
  pijiuguanzhuangji: ['beer bottling line', 'glass beer filler'],
  chuipingji: ['PET bottle making', 'blow moulder'],
  zhusuji: ['preform production', 'bottle moulding'],
  tiebiaoji: ['self-adhesive labeler', 'beverage labeler'],
  xipingji: ['pre-fill bottle rinser', 'bottle washer'],
  mobaoji: ['heat shrink wrapper', 'bottle packer'],
  zhenkongxuangaiji: ['jar vacuum sealer', 'bottle capper'],
  youguanzhuangji: ['edible oil filler', 'viscous liquid filler'],
  guanzhuangjipeijian: ['filler spare parts', 'bottling components'],
  cuogaiji: ['ROPP capper', 'aluminum cap sealer'],
  fegnmiguanzhuangji: ['viscous food filler', 'syrup filling machine'],
  'qing-jie-ji-guan-zhaung-ji': ['liquid detergent filler'],
  'xi-shou-ye-guan-zhuang-ji': ['liquid soap filler'],
  'xiao-du-ji-guan-zhuang-ji': ['sanitizer bottling machine']
};

function slugFromRel(rel) {
  const normalized = rel.replace(/^product\/tuijianchanpin\//, 'product/');
  for (const key of Object.keys(CATEGORY_PRIMARY)) {
    if (normalized.includes('/' + key + '/') || normalized.includes('/' + key + '/')) {
      return key;
    }
    if (rel.includes(key)) return key;
  }
  return null;
}

function extractModelToken(pageName, htmlSnippet) {
  const src = `${pageName || ''} ${htmlSnippet || ''}`;
  const cgf = src.match(/\b(?:CGF|DCGF|XGF|RCGF|QGF|RXGF|WZGF)\s*[\d-]+(?:\s*[\d-]+)*/i);
  if (cgf) return cgf[0].replace(/\s+/g, ' ').trim();
  const bph = src.match(/\b(\d{1,2}-\d{1,2}-\d{1,3})\b/);
  if (bph) return bph[1];
  return null;
}

function isGenericProductName(name, catPrimary) {
  if (!name) return true;
  const n = name.toLowerCase().trim();
  if (n.length < 8) return true;
  if (/^(products?|product details|article|news)$/i.test(n)) return true;
  if (catPrimary && n === catPrimary.toLowerCase()) return true;
  return false;
}

function getTier(rel) {
  if (rel === 'index.html') return TIER.HEAD;
  if (TIER2_HUBS[rel]) return TIER.HUB;
  if (/index-2\.html$/.test(rel)) return TIER.HUB;
  if (rel.match(/product\/(?:tuijianchanpin\/)?[^/]+\/index(?:-\d+)?\.html$/)) return TIER.HUB;
  if (rel.match(/\d{4}\//)) return TIER.LONGTAIL;
  if (rel.startsWith('about/') || rel.startsWith('contactus/') || rel.startsWith('message/')) return TIER.TRUST;
  if (rel.startsWith('jishuzhichi/') || rel.startsWith('kehuanli/')) return TIER.TRUST;
  if (rel.startsWith('news/')) return TIER.HUB;
  return TIER.LONGTAIL;
}

function formatKwList(primary, secondary, max = 3) {
  const list = [primary, ...(secondary || [])].filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const k of list) {
    const n = k.toLowerCase().trim();
    if (!n || seen.has(n)) continue;
    seen.add(n);
    out.push(k);
    if (out.length >= max) break;
  }
  return out.join(', ');
}

function buildTitleFromPrimary(primary, suffix) {
  const s = suffix || cfg.BRAND;
  const main = (primary || '').trim();
  if (!main) return `Beverage Filling Machinery | ${s}`;
  const candidate = `${main} | ${s}`;
  if (candidate.length <= 70) return candidate;
  const avail = 70 - (` | ${s}`).length;
  let cut = main.slice(0, avail);
  const sp = cut.lastIndexOf(' ');
  if (sp > avail * 0.5) cut = cut.slice(0, sp);
  return `${cut.trim()} | ${s}`;
}

function buildDescFromPyramid(primary, secondary, context) {
  const p = primary || 'beverage filling machine';
  const sec = (secondary && secondary[0]) || 'water bottling';
  const brand = cfg.BRAND_NAME;
  if (context === 'home') {
    return `${brand} manufactures ${p} and ${sec} lines for water, juice and carbonated drinks. Export-ready bottling solutions with global support.`;
  }
  if (context === 'hub') {
    return `Explore ${p} from ${brand}. ${sec} solutions for bottling plants worldwide — engineering, installation and after-sales service.`;
  }
  if (context === 'category') {
    return `${p.charAt(0).toUpperCase() + p.slice(1)} from ${brand} for export bottling plants. Includes ${sec} options with customized capacity and layout.`;
  }
  if (context === 'detail') {
    return `${p}. ${brand} supplies ${sec} for international beverage and water bottling projects. Request specifications and pricing.`;
  }
  if (context === 'trust') {
    return `Contact ${brand} — ${p}. ${sec} with factory-direct support, technical consultation and global after-sales service.`;
  }
  return `${p} from ${brand}. Professional ${sec} for beverage production and export markets.`;
}

/**
 * Resolve pyramid-aligned SEO fields for a page.
 * @returns {{ tier, primary, secondary, enTitle, enDesc, enKw, h1 }}
 */
function resolvePyramid(rel, pageName, categorySlug, htmlSnippet) {
  const tier = getTier(rel);
  const slug = categorySlug || slugFromRel(rel);

  if (/index-2\.html$/.test(rel)) {
    const parentRel = rel.replace(/index-2\.html$/, 'index.html');
    const parent = resolvePyramid(parentRel, pageName, slug, htmlSnippet);
    const label = `${parent.h1 || parent.primary} — Page 2`;
    return {
      tier: TIER.HUB,
      primary: parent.primary,
      secondary: parent.secondary,
      enTitle: buildTitleFromPrimary(label),
      enDesc: `Page 2 — ${parent.enDesc || buildDescFromPyramid(parent.primary, parent.secondary, 'hub')}`,
      enKw: formatKwList(parent.primary, parent.secondary),
      h1: label,
      paginationPage: 2
    };
  }

  if (tier === TIER.HEAD) {
    return {
      tier,
      primary: TIER1.primary,
      secondary: TIER1.secondary,
      enTitle: buildTitleFromPrimary('Beverage Filling Machine & Water Bottling Lines'),
      enDesc: buildDescFromPyramid(TIER1.primary, TIER1.secondary, 'home'),
      enKw: formatKwList(TIER1.primary, TIER1.secondary),
      h1: 'Beverage Filling Machine & Water Bottling Lines'
    };
  }

  if (TIER2_HUBS[rel]) {
    const h = TIER2_HUBS[rel];
    return {
      tier,
      primary: h.primary,
      secondary: h.secondary,
      enTitle: buildTitleFromPrimary(h.primary.charAt(0).toUpperCase() + h.primary.slice(1)),
      enDesc: buildDescFromPyramid(h.primary, h.secondary, 'hub'),
      enKw: formatKwList(h.primary, h.secondary),
      h1: h.primary.charAt(0).toUpperCase() + h.primary.slice(1)
    };
  }

  if (rel.startsWith('product/') && slug && CATEGORY_PRIMARY[slug]) {
    const primary = CATEGORY_PRIMARY[slug];
    const secondary = CATEGORY_SECONDARY[slug] || ['beverage filling machine'];
    const name = cfg.CATEGORY[slug] ? cfg.CATEGORY[slug].name : primary;
    return {
      tier: TIER.HUB,
      primary,
      secondary,
      enTitle: buildTitleFromPrimary(name),
      enDesc: buildDescFromPyramid(primary, secondary, 'category'),
      enKw: formatKwList(primary, secondary),
      h1: name
    };
  }

  if (tier === TIER.LONGTAIL && rel.match(/\d{4}\//)) {
    const clean = (pageName || 'Beverage filling equipment').replace(/\s*-\s*KIWL.*$/i, '').trim();
    const catPrimary = slug && CATEGORY_PRIMARY[slug] ? CATEGORY_PRIMARY[slug] : 'beverage filling machine';
    const model = extractModelToken(clean, htmlSnippet);
    let displayName = clean;
    if (model && !clean.toLowerCase().includes(model.toLowerCase())) {
      displayName = `${model} ${isGenericProductName(clean, catPrimary) ? catPrimary : clean}`.trim();
    } else if (isGenericProductName(clean, catPrimary)) {
      displayName = model ? `${model} ${catPrimary}` : catPrimary;
    }
    const primary = displayName.length > 10 ? displayName : `${displayName} ${catPrimary}`;
    const secondary = [catPrimary];
    const titleMain = model && isGenericProductName(clean, catPrimary) ? `${model} ${catPrimary}` : clean;
    return {
      tier,
      primary,
      secondary,
      enTitle: buildTitleFromPrimary(titleMain),
      enDesc: buildDescFromPyramid(displayName, secondary, 'detail'),
      enKw: formatKwList(titleMain, secondary.slice(0, 1)),
      h1: titleMain
    };
  }

  if (rel.startsWith('contactus/')) {
    const t = TIER4.contact;
    const sub = rel.split('/')[1] || '';
    const labelMap = { contacts: 'Contact Information', maps: 'Location Map', index: 'Contact Us' };
    const label = labelMap[sub] || 'Contact Us';
    return {
      tier: TIER.TRUST,
      primary: t.primary,
      secondary: t.secondary,
      enTitle: buildTitleFromPrimary(label === 'Contact Us' ? 'Contact Beverage Filling Machine Supplier' : label),
      enDesc: buildDescFromPyramid(t.primary, t.secondary, 'trust'),
      enKw: formatKwList(t.primary, t.secondary),
      h1: label
    };
  }

  if (rel.startsWith('about/')) {
    const t = TIER4.about;
    const sub = rel.split('/')[1] || '';
    const label = cfg.ABOUT_SLUG[sub];
    const primary = label && sub !== 'index.html'
      ? `beverage filling machine manufacturer — ${label.toLowerCase()}`
      : t.primary;
    return {
      tier: TIER.TRUST,
      primary: t.primary,
      secondary: t.secondary,
      enTitle: buildTitleFromPrimary(label ? `About ${label}` : 'About Us — Beverage Filling Machine Manufacturer'),
      enDesc: buildDescFromPyramid(t.primary, t.secondary, 'trust'),
      enKw: formatKwList(primary, t.secondary),
      h1: label ? `About ${label}` : 'About Us'
    };
  }

  if (rel.startsWith('message/')) {
    const t = TIER4.inquiry;
    return {
      tier: TIER.TRUST,
      primary: t.primary,
      secondary: t.secondary,
      enTitle: buildTitleFromPrimary('Request Beverage Filling Machine Quote'),
      enDesc: buildDescFromPyramid(t.primary, t.secondary, 'trust'),
      enKw: formatKwList(t.primary, t.secondary),
      h1: 'Online Inquiry'
    };
  }

  if (rel.startsWith('jishuzhichi/')) {
    const t = TIER4.support;
    return {
      tier: TIER.TRUST,
      primary: t.primary,
      secondary: t.secondary,
      enTitle: buildTitleFromPrimary('Beverage Filling Machine Technical Support'),
      enDesc: buildDescFromPyramid(t.primary, t.secondary, 'trust'),
      enKw: formatKwList(t.primary, t.secondary),
      h1: 'Technical Support'
    };
  }

  if (rel.startsWith('kehuanli/')) {
    const t = TIER4.cases;
    return {
      tier: TIER.TRUST,
      primary: t.primary,
      secondary: t.secondary,
      enTitle: buildTitleFromPrimary('Beverage Filling Machine Case Studies'),
      enDesc: buildDescFromPyramid(t.primary, t.secondary, 'trust'),
      enKw: formatKwList(t.primary, t.secondary),
      h1: 'Case Studies'
    };
  }

  if (rel.startsWith('news/')) {
    const hub = TIER2_HUBS[rel] || TIER2_HUBS['news/index.html'];
    const safe = pageName && pageName.length > 4 ? pageName : hub.primary;
    return {
      tier: TIER.HUB,
      primary: safe,
      secondary: hub.secondary,
      enTitle: buildTitleFromPrimary(safe),
      enDesc: buildDescFromPyramid(hub.primary, hub.secondary, 'hub'),
      enKw: formatKwList(safe, hub.secondary.slice(0, 1)),
      h1: safe
    };
  }

  const fallback = pageName || 'Beverage filling machinery';
  return {
    tier: TIER.LONGTAIL,
    primary: fallback.toLowerCase(),
    secondary: ['beverage filling machine'],
    enTitle: buildTitleFromPrimary(fallback),
    enDesc: buildDescFromPyramid(fallback, ['water bottling'], 'detail'),
    enKw: formatKwList(fallback, ['beverage filling machine']),
    h1: fallback
  };
}

module.exports = {
  TIER,
  TIER1,
  TIER2_HUBS,
  TIER4,
  CATEGORY_PRIMARY,
  CATEGORY_SECONDARY,
  slugFromRel,
  getTier,
  formatKwList,
  buildTitleFromPrimary,
  buildDescFromPyramid,
  extractModelToken,
  isGenericProductName,
  resolvePyramid
};
