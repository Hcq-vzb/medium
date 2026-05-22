/**

 * KIWL bilingual switch: English (default) / العربية

 * Replaces visible text only; DOM structure, classes and links unchanged.

 */

(function (global) {

  'use strict';



  var COOKIE_NAME = 'kiwl_lang';

  var STORAGE_KEY = 'kiwl_lang';

  var COOKIE_DAYS = 365;

  var DEFAULT_LANG = 'en';

  var LANG_CODES = ['en', 'ar'];



  var LABELS = { en: 'English', ar: 'العربية' };

  var SEG_LABELS = { en: 'EN', ar: 'AR' };



  var I18N = {

    home: { en: 'Home', ar: 'الرئيسية' },

    about: { en: 'About Us', ar: 'من نحن' },

    products: { en: 'Products', ar: 'المنتجات' },

    news: { en: 'News', ar: 'الأخبار' },

    support: { en: 'Support', ar: 'الدعم الفني' },

    cases: { en: 'Case Studies', ar: 'دراسات الحالة' },

    online_message: { en: 'Online Inquiry', ar: 'استفسار عبر الإنترنت' },

    contact: { en: 'Contact Us', ar: 'اتصل بنا' },

    hotline: { en: 'Global Service Hotline:', ar: 'خط الخدمة العالمي:' },

    tagline1: {

      en: 'Dedicated to ideal filling and beverage production solutions',

      ar: 'ملتزمون بحلول مثالية لآلات التعبئة وإنتاج المشروبات'

    },

    tagline2: {

      en: '15 years of R&D and manufacturing — products customized to your needs',

      ar: '15 عاماً من البحث والتطوير والتصنيع — منتجات حسب الطلب'

    },

    company_profile: { en: 'Company Profile', ar: 'ملف الشركة' },

    corporate_culture: { en: 'Corporate Culture', ar: 'ثقافة الشركة' },

    dev_history: { en: 'Development History', ar: 'مسيرة التطور' },

    certifications: { en: 'Certifications & Honors', ar: 'الشهادات والجوائز' },

    org_structure: { en: 'Organization Structure', ar: 'الهيكل التنظيمي' },

    our_team: { en: 'Our Team', ar: 'فريقنا' },

    facilities: { en: 'Facilities', ar: 'مرافق الشركة' },

    hot_news: { en: 'Hot News', ar: 'أخبار بارزة' },

    latest_products: { en: 'Latest Products', ar: 'أحدث المنتجات' },

    you_are_here: { en: 'You are here:', ar: 'أنت هنا:' },

    contact_us_label: { en: 'Contact Us', ar: 'اتصل بنا' },

    mobile: { en: 'Mobile:', ar: 'جوال:' },

    tel: { en: 'Tel:', ar: 'هاتف:' },

    email: { en: 'Email:', ar: 'البريد الإلكتروني:' },

    company_news: { en: 'Company News', ar: 'أخبار الشركة' },

    industry_news: { en: 'Industry News', ar: 'أخبار الصناعة' },

    view_more: { en: 'View More', ar: 'عرض المزيد' },

    our_advantages: { en: 'Our Advantages', ar: 'مزايانا' },

    industry_updates: { en: 'Industry Updates', ar: 'مستجدات الصناعة' },

    product_showcase: { en: 'Product Showcase', ar: 'عرض المنتجات' },

    product_range: { en: 'Product Range', ar: 'سلسلة المنتجات' },

    all_rights: { en: 'All Rights Reserved', ar: 'جميع الحقوق محفوظة' },

    sitemap: { en: 'Sitemap', ar: 'خريطة الموقع' },

    inquiry_intro: {
      en: 'Fill out the form below, and our team will contact you shortly.',
      ar: 'املأ النموذج أدناه، وسيتواصل معك فريقنا قريباً.'
    },
    inquiry_subject: { en: 'Subject:', ar: 'الموضوع:' },
    inquiry_name: { en: 'Name:', ar: 'الاسم:' },
    inquiry_tel: { en: 'Tel:', ar: 'الهاتف:' },
    inquiry_message: { en: 'Message:', ar: 'رسالة:' },
    inquiry_send: { en: 'Send Inquiry', ar: 'إرسال الاستفسار' },
    inquiry_reset: { en: 'Reset', ar: 'إعادة تعيين' },
    leave_message: { en: 'Leave a Message', ar: 'اترك رسالة' }

  };



  var HREF_KEY_RULES = [

    { re: /\/about\/(?:index\.html)?$/i, key: 'about' },

    { re: /\/product\/(?:index\.html)?$/i, key: 'products' },

    { re: /\/news\/(?:index\.html)?$/i, key: 'news' },

    { re: /\/jishuzhichi\/(?:index\.html)?$/i, key: 'support' },

    { re: /\/kehuanli\/(?:index\.html)?$/i, key: 'cases' },

    { re: /\/message\/(?:index\.html)?$/i, key: 'online_message' },

    { re: /\/contactus\/(?:index\.html)?$/i, key: 'contact' },

    { re: /^\/(?:index\.html)?$/i, key: 'home' }

  ];



  var TEXT_KEY_MAP = {

    Home: 'home',

    الرئيسية: 'home',

    '网站首页': 'home',

    'About Us': 'about',

    'من نحن': 'about',

    '关于我们': 'about',

    Products: 'products',

    المنتجات: 'products',

    '产品中心': 'products',

    News: 'news',

    الأخبار: 'news',

    '新闻动态': 'news',

    Support: 'support',

    'Technical Support': 'support',

    'الدعم الفني': 'support',

    '技术支持': 'support',

    'Case Studies': 'cases',

    'دراسات الحالة': 'cases',

    '客户案例': 'cases',

    'Online Message': 'online_message',

    'Online Inquiry': 'online_message',

    'رسالة عبر الإنترنت': 'online_message',

    'استفسار عبر الإنترنت': 'online_message',

    '在线留言': 'online_message',

    'Contact Us': 'contact',

    'اتصل بنا': 'contact',

    '联系我们': 'contact',

    'Global Service Hotline:': 'hotline',

    'Global Service Hotline': 'hotline',

    'خط الخدمة العالمي:': 'hotline',

    'خط الخدمة العالمي': 'hotline',

    '全球服务热线：': 'hotline',

    '全球服务热线': 'hotline',

    '致力于提供灌装机、饮料机理想解决方案': 'tagline1',

    'Dedicated to ideal filling and beverage production solutions': 'tagline1',

    'Dedicated to providing ideal solutions for filling machines and beverage equipment': 'tagline1',

    'ملتزمون بحلول مثالية لآلات التعبئة وإنتاج المشروبات': 'tagline1',

    'ملتزمون بتقديم حلول مثالية لآلات التعبئة ومعدات المشروبات': 'tagline1',

    '15年研发生产经验 产品可按需定制': 'tagline2',

    '15 years of R&D and manufacturing — products customized to your needs': 'tagline2',

    '15 years of R&D and production experience, products can be customized': 'tagline2',

    '15 عاماً من البحث والتطوير والتصنيع — منتجات حسب الطلب': 'tagline2',

    '15 عامًا من الخبرة في البحث والتطوير والإنتاج، يمكن تخصيص المنتجات حسب الطلب': 'tagline2'

  };



  var SKIP_PARENT = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1 };

  var enArMap = null;

  var enArKeysSorted = null;

  var wordArMap = null;

  var KEEP_LATIN_WORD =
    /^(KIWL|PET|PLC|BPH|MPa|kW|Hz|mm|kg|ml|RMB|ISO|HMI|CIP|EDI|UHT|EN|AR|RSS|OMRON|Weintek|Airtac|Mitsubishi|Siemens|Schneider|Omron|Panasonic|Autonics|CSD|RCGF|Weintek|SimSun|Microsoft|YaHei|cathy|kiwlmachine|com|http|https|www|Tel|Fax|RMB)$/i;

  var textSnapshots = null;

  var attrSnapshots = null;



  function trimText(s) {

    return (s || '').replace(/\s+/g, ' ').trim();

  }



  function getCookie(name) {

    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));

    return m ? decodeURIComponent(m[1]) : '';

  }



  function setCookie(name, value, days) {

    var expires = new Date(Date.now() + days * 86400000).toUTCString();

    document.cookie =

      name + '=' + encodeURIComponent(value) + ';expires=' + expires + ';path=/;SameSite=Lax';

  }



  function normalizeLangCode(lang) {

    if (lang === 'ar' || lang === 'fr') {

      return 'ar';

    }

    if (lang === 'en') {

      return 'en';

    }

    return '';

  }



  function readLocalStorage() {

    try {

      return normalizeLangCode(localStorage.getItem(STORAGE_KEY) || '');

    } catch (e) {

      return '';

    }

  }



  function writeLocalStorage(lang) {

    try {

      localStorage.setItem(STORAGE_KEY, lang);

    } catch (e) {}

  }



  /** file:// 本地预览时，各子目录 Cookie 可能不共享，用 window.name 作兜底 */

  function readWindowNameLang() {

    try {

      var raw = global.name || '';

      if (!raw || raw.charAt(0) !== '{') {

        return '';

      }

      var data = JSON.parse(raw);

      return normalizeLangCode(data && data.kiwl_lang);

    } catch (e) {

      return '';

    }

  }



  function writeWindowNameLang(lang) {

    try {

      var data = {};

      if (global.name && global.name.charAt(0) === '{') {

        try {

          data = JSON.parse(global.name) || {};

        } catch (e2) {

          data = {};

        }

      }

      data.kiwl_lang = lang;

      global.name = JSON.stringify(data);

    } catch (e) {}

  }



  function getStoredLang() {

    var lang = readLocalStorage();

    if (!lang) {

      lang = normalizeLangCode(getCookie(COOKIE_NAME));

    }

    if (!lang) {

      lang = readWindowNameLang();

    }

    return lang || DEFAULT_LANG;

  }



  function setStoredLang(lang) {

    lang = normalizeLangCode(lang) || DEFAULT_LANG;

    writeLocalStorage(lang);

    setCookie(COOKIE_NAME, lang, COOKIE_DAYS);

    writeWindowNameLang(lang);

    return lang;

  }



  function migrateStorage() {

    var ls = readLocalStorage();

    var ck = normalizeLangCode(getCookie(COOKIE_NAME));

    if (!ls && ck) {

      writeLocalStorage(ck);

    }

    var lang = getStoredLang();

    setCookie(COOKIE_NAME, lang, COOKIE_DAYS);

    writeWindowNameLang(lang);

  }



  function normalizeHref(href) {

    if (!href) return '';

    try {

      return decodeURIComponent(new URL(href, window.location.href).pathname).toLowerCase();

    } catch (e) {

      return href.toLowerCase();

    }

  }



  function hrefToKey(href) {

    var path = normalizeHref(href);

    for (var i = 0; i < HREF_KEY_RULES.length; i++) {

      if (HREF_KEY_RULES[i].re.test(path)) {

        return HREF_KEY_RULES[i].key;

      }

    }

    return '';

  }



  function getLang() {

    return getStoredLang();

  }



  function getText(key, lang) {

    return I18N[key] && I18N[key][lang] ? I18N[key][lang] : null;

  }



  var BAD_I18N_KEY =

    /, j, j|, \. ,|H\+OH-|EDIequipment|BeverageFilling\.|Machineproducts|Fillingindustry|, , ,|etc\. , etc/;



  function isValidEnArPair(en, ar) {

    if (!en || !ar || en === ar) return false;

    en = String(en).trim();

    ar = String(ar).trim();

    if (en.length < 2 && !/^\d+$/.test(en)) return false;

    if (BAD_I18N_KEY.test(en) || BAD_I18N_KEY.test(ar)) return false;

    if ((en.match(/,/g) || []).length >= 4 && en.length < 120) return false;

    var latin = (ar.match(/[A-Za-z]/g) || []).length;

    if (latin > Math.max(12, ar.length * 0.22)) return false;

    var arWords = (ar.match(/[\u0600-\u06FF]+/g) || []).join('');

    if (arWords.length < 2 && en.length > 16) return false;

    var strayEn = (ar.match(/\b[A-Za-z]{4,}\b/g) || []).filter(function (w) {

      return !KEEP_LATIN_WORD.test(w);

    });

    if (strayEn.length > 2 && en.length > 35) return false;

    return true;

  }



  function mergeEnArSource(target, source) {

    if (!source || typeof source !== 'object') return;

    Object.keys(source).forEach(function (en) {

      var ar = source[en];

      if (isValidEnArPair(en, ar)) {

        target[en] = ar;

      }

    });

  }



  function loadEnArMap() {

    enArMap = {};

    mergeEnArSource(enArMap, global.KIWL_I18N_CORE_AR);

    mergeEnArSource(enArMap, global.KIWL_I18N_EN_AR);

    enArKeysSorted = Object.keys(enArMap).sort(function (a, b) {

      return b.length - a.length;

    });

    wordArMap = global.KIWL_AR_WORD_FALLBACK || null;

  }



  function applyWordFallback(text) {

    if (!text || !wordArMap) return text;

    var out = text.replace(/\b[A-Za-z][A-Za-z'&.\-/]{1,}\b/g, function (w) {

      if (KEEP_LATIN_WORD.test(w)) return w;

      if (wordArMap[w]) return wordArMap[w];

      var lower = w.toLowerCase();

      if (wordArMap[lower]) return wordArMap[lower];

      var cap = lower.charAt(0).toUpperCase() + lower.slice(1);

      if (wordArMap[cap]) return wordArMap[cap];

      return w;

    });

    return out.replace(/\s{2,}/g, ' ').replace(/\s+([,.؛])/g, '$1').trim();

  }



  function normalizeForLookup(s) {

    return (s || '')

      .replace(/&nbsp;/gi, ' ')

      .replace(/&ldquo;|&rdquo;|&quot;/gi, ' ')

      .replace(/\u00a0/g, ' ')

      .replace(/\s+/g, ' ')

      .trim();

  }



  function translateString(text, lang) {

    if (!text || !/\S/.test(text)) return text;

    if (lang === 'en') return text;

    var norm = normalizeForLookup(text);

    if (enArMap && enArMap[norm]) {

      return enArMap[norm];

    }

    var trimmed = trimText(text);

    if (TEXT_KEY_MAP[trimmed] && I18N[TEXT_KEY_MAP[trimmed]]) {

      return getText(TEXT_KEY_MAP[trimmed], 'ar') || text;

    }

    var out = text;

    if (enArKeysSorted) {

      for (var i = 0; i < enArKeysSorted.length; i++) {

        var en = enArKeysSorted[i];

        if (en.length < 3) continue;

        if (out.indexOf(en) !== -1) {

          out = out.split(en).join(enArMap[en]);

        }

      }

    }

    if (lang === 'ar') {

      out = applyWordFallback(out);

    }

    return out;

  }



  function shouldSkipNode(node) {

    var p = node.parentNode;

    while (p) {

      if (SKIP_PARENT[p.nodeName]) return true;

      if (p.id === 'kiwl-lang-switcher') return true;

      if (p.getAttribute && p.getAttribute('data-lang-key')) return true;

      p = p.parentNode;

    }

    return false;

  }



  function captureSnapshots() {

    textSnapshots = [];

    attrSnapshots = [];

    var root = document.body;

    if (!root) return;



    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);

    var n;

    while ((n = walker.nextNode())) {

      if (shouldSkipNode(n)) continue;

      var val = n.nodeValue;

      if (!val || !/[\u4e00-\u9fffA-Za-z]/.test(val)) continue;

      textSnapshots.push({ node: n, text: val });

    }



    var attrNames = ['title', 'alt', 'placeholder', 'aria-label'];

    root.querySelectorAll('*').forEach(function (el) {

      if (el.id === 'kiwl-lang-switcher') return;

      if (el.getAttribute('data-lang-key')) return;

      attrNames.forEach(function (attr) {

        if (!el.hasAttribute(attr)) return;

        var v = el.getAttribute(attr);

        if (!v || !/[\u4e00-\u9fffA-Za-z]/.test(v)) return;

        attrSnapshots.push({ el: el, attr: attr, text: v });

      });

    });



    var titleEl = document.querySelector('title');

    if (titleEl && titleEl.textContent) {

      attrSnapshots.push({ el: titleEl, attr: '_title', text: titleEl.textContent });

    }

    ['description', 'keywords'].forEach(function (name) {

      var meta = document.querySelector('meta[name="' + name + '"]');

      if (meta && meta.getAttribute('content')) {

        attrSnapshots.push({

          el: meta,

          attr: 'content',

          text: meta.getAttribute('content'),

          metaName: name

        });

      }

    });

  }



  function applyPageText(lang) {

    loadEnArMap();

    captureSnapshots();



    if (lang === 'en') {

      textSnapshots.forEach(function (item) {

        item.node.nodeValue = item.text;

      });

      attrSnapshots.forEach(function (item) {

        if (item.attr === '_title') {

          item.el.textContent = item.text;

        } else {

          item.el.setAttribute(item.attr, item.text);

        }

      });

      return;

    }



    textSnapshots.forEach(function (item) {

      item.node.nodeValue = translateString(item.text, 'ar');

    });

    attrSnapshots.forEach(function (item) {

      var ar = translateString(item.text, 'ar');

      if (item.attr === '_title') {

        item.el.textContent = ar;

      } else {

        item.el.setAttribute(item.attr, ar);

      }

    });

  }



  function setDocumentDirection(lang) {

    var html = document.documentElement;

    var body = document.body;

    if (lang === 'ar') {

      html.setAttribute('dir', 'rtl');

      html.setAttribute('lang', 'ar');

      if (body) body.classList.add('kiwl-rtl');

    } else {

      html.setAttribute('dir', 'ltr');

      html.setAttribute('lang', 'en');

      if (body) body.classList.remove('kiwl-rtl');

    }

  }



  function autoTagElements() {

    document.querySelectorAll('#header .link_nav ul > li > a').forEach(function (a) {

      if (a.getAttribute('data-lang-key')) return;

      var key = hrefToKey(a.getAttribute('href')) || TEXT_KEY_MAP[trimText(a.textContent)];

      if (key && I18N[key]) a.setAttribute('data-lang-key', key);

    });



    var hotlineH3 = document.querySelector('#header .hotline h3');

    if (hotlineH3 && !hotlineH3.getAttribute('data-lang-key')) {

      hotlineH3.setAttribute('data-lang-key', 'hotline');

    }



    var line1 = document.querySelector('#header .logo_desc_line1');

    if (line1 && !line1.getAttribute('data-lang-key')) line1.setAttribute('data-lang-key', 'tagline1');

    var line2 = document.querySelector('#header .logo_desc_line2');

    if (line2 && !line2.getAttribute('data-lang-key')) line2.setAttribute('data-lang-key', 'tagline2');



    document.querySelectorAll('#footer .foot_nav ul > h3 > a').forEach(function (a) {

      if (a.getAttribute('data-lang-key')) return;

      var key = hrefToKey(a.getAttribute('href')) || TEXT_KEY_MAP[trimText(a.textContent)];

      if (key && I18N[key]) a.setAttribute('data-lang-key', key);

    });



    var sideNavMap = [

      ['Company Profile', 'company_profile'],

      ['Corporate Culture', 'corporate_culture'],

      ['Development History', 'dev_history'],

      ['Certifications & Honors', 'certifications'],

      ['Organization Structure', 'org_structure'],

      ['Our Team', 'our_team'],

      ['Facilities', 'facilities']

    ];

    document.querySelectorAll('#neiye .nva_box h3 a, #neiye .bt_title').forEach(function (el) {

      if (el.getAttribute('data-lang-key')) return;

      var t = trimText(el.textContent);

      for (var si = 0; si < sideNavMap.length; si++) {

        if (t.indexOf(sideNavMap[si][0]) !== -1) {

          el.setAttribute('data-lang-key', sideNavMap[si][1]);

          if (el.hasAttribute('title')) {

            el.setAttribute('title', getText(sideNavMap[si][1], 'en'));

          }

          break;

        }

      }

    });



    document.querySelectorAll('#neiye .hotline_box h1, #neiye .rm_news h1').forEach(function (el) {

      if (el.getAttribute('data-lang-key')) return;

      var t = trimText(el.textContent);

      if (t === 'Contact Us') el.setAttribute('data-lang-key', 'contact_us_label');

      if (t === 'Hot News') el.setAttribute('data-lang-key', 'hot_news');

    });



    document.querySelectorAll('#neiye .title_bt h1, #neiye .details h3').forEach(function (el) {

      if (el.getAttribute('data-lang-key')) return;

      var t = trimText(el.textContent);

      if (t === 'About Us') el.setAttribute('data-lang-key', 'about');

      if (t === 'Company Profile') el.setAttribute('data-lang-key', 'company_profile');

    });



    document.querySelectorAll('#remen h3').forEach(function (el) {

      if (el.getAttribute('data-lang-key')) return;

      var t = trimText(el.textContent);

      if (t === 'Latest Products') el.setAttribute('data-lang-key', 'latest_products');

      if (t === 'Company News') el.setAttribute('data-lang-key', 'company_news');

      if (t === 'Industry News') el.setAttribute('data-lang-key', 'industry_news');

      if (t === 'Industry Updates') el.setAttribute('data-lang-key', 'industry_updates');

      if (t === 'Our Advantages') el.setAttribute('data-lang-key', 'our_advantages');

    });



    var leaveH1 = document.querySelector('#neiye .right_box .title_bt h1');

    if (leaveH1 && !leaveH1.getAttribute('data-lang-key')) {

      var lh = trimText(leaveH1.textContent);

      if (lh === 'Leave a Message') leaveH1.setAttribute('data-lang-key', 'leave_message');

    }



    document.querySelectorAll('#gbook_box .kiwl-inquiry-lead').forEach(function (el) {

      if (!el.getAttribute('data-lang-key')) el.setAttribute('data-lang-key', 'inquiry_intro');

    });

    document.querySelectorAll('#gbook_box .kiwl-inquiry-label').forEach(function (el) {

      if (el.getAttribute('data-lang-key')) return;

      var lt = trimText(el.textContent);

      if (lt.indexOf('Subject') === 0) el.setAttribute('data-lang-key', 'inquiry_subject');

      else if (lt.indexOf('Name') === 0) el.setAttribute('data-lang-key', 'inquiry_name');

      else if (lt.indexOf('Tel') === 0) el.setAttribute('data-lang-key', 'inquiry_tel');

      else if (lt.indexOf('Message') === 0) el.setAttribute('data-lang-key', 'inquiry_message');

    });

  }



  function applyLangKeys(lang) {

    document.querySelectorAll('[data-lang-key]').forEach(function (el) {

      var text = getText(el.getAttribute('data-lang-key'), lang);

      if (text == null) return;

      var tag = el.tagName ? el.tagName.toUpperCase() : '';

      if (
        tag === 'INPUT' &&
        (el.type === 'submit' || el.type === 'reset' || el.type === 'button')
      ) {
        el.value = text;
        return;
      }

      el.textContent = text;

      if (el.hasAttribute('title')) el.setAttribute('title', text);

    });

  }



  function applyLang(lang) {

    lang = setStoredLang(lang);

    setDocumentDirection(lang);

    autoTagElements();

    applyLangKeys(lang);

    applyPageText(lang);

    updateSwitcherState(lang);

    global.kiwlCurrentLang = lang;

  }



  function renderSwitcherButtons(wrap) {

    wrap.innerHTML = '';

    LANG_CODES.forEach(function (code, i) {

      if (i > 0) {

        var sep = document.createElement('span');

        sep.className = 'kiwl-lang-sep';

        sep.setAttribute('aria-hidden', 'true');

        sep.textContent = '|';

        wrap.appendChild(sep);

      }

      var btn = document.createElement('button');

      btn.type = 'button';

      btn.className = 'kiwl-lang-seg';

      btn.setAttribute('data-lang-select', code);

      btn.setAttribute('aria-label', LABELS[code]);

      btn.setAttribute('aria-pressed', 'false');

      btn.textContent = SEG_LABELS[code];

      wrap.appendChild(btn);

    });

  }



  function bindSwitcherEvents(wrap) {

    if (!wrap || wrap._kiwlLangBound) {

      return;

    }

    wrap.addEventListener('click', function (e) {

      var code = e.target && e.target.getAttribute('data-lang-select');

      if (code) {

        applyLang(code);

      }

    });

    wrap._kiwlLangBound = true;

  }



  function buildSwitcher() {

    var existing = document.getElementById('kiwl-lang-switcher');

    if (existing) {

      renderSwitcherButtons(existing);

      bindSwitcherEvents(existing);

      return existing;

    }



    var wrap = document.createElement('div');

    wrap.id = 'kiwl-lang-switcher';

    wrap.className = 'kiwl-lang-switcher kiwl-lang-switcher--desktop';

    wrap.setAttribute('role', 'group');

    wrap.setAttribute('aria-label', 'Language');

    renderSwitcherButtons(wrap);

    bindSwitcherEvents(wrap);

    return wrap;

  }



  function updateSwitcherState(lang) {

    document.querySelectorAll('.kiwl-lang-seg').forEach(function (btn) {

      var on = btn.getAttribute('data-lang-select') === lang;

      btn.classList.toggle('is-active', on);

      btn.setAttribute('aria-pressed', on ? 'true' : 'false');

    });

  }



  function mountSwitcher() {

    var switcher = buildSwitcher();

    var isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

    var cont = document.querySelector('#header .top_bx .cont');

    var linkNav = document.querySelector('#header .link_nav');

    var hotline = cont && cont.querySelector('.hotline');



    if (isMobile && linkNav) {

      switcher.className = 'kiwl-lang-switcher kiwl-lang-switcher--mobile';

      if (switcher.parentNode !== linkNav) {

        if (switcher.parentNode) switcher.parentNode.removeChild(switcher);

        linkNav.appendChild(switcher);

      }

    } else {

      switcher.className = 'kiwl-lang-switcher kiwl-lang-switcher--desktop';

      if (cont && hotline) {

        if (switcher.parentNode !== cont || hotline.nextElementSibling !== switcher) {

          if (switcher.parentNode) switcher.parentNode.removeChild(switcher);

          cont.insertBefore(switcher, hotline.nextSibling);

        }

      } else if (cont) {

        cont.appendChild(switcher);

      }

    }

    updateSwitcherState(getLang());

  }



  function init() {

    migrateStorage();

    applyLang(getLang());

    mountSwitcher();

    var resizeTimer;

    window.addEventListener('resize', function () {

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(mountSwitcher, 200);

    });



    window.addEventListener('storage', function (e) {

      if (e.key !== STORAGE_KEY || e.newValue == null) {

        return;

      }

      var lang = normalizeLangCode(e.newValue);

      if (lang && lang !== global.kiwlCurrentLang) {

        applyLang(lang);

      }

    });

  }



  migrateStorage();

  if (document.documentElement) {

    setDocumentDirection(getLang());

  }



  if (document.readyState === 'loading') {

    document.addEventListener('DOMContentLoaded', init);

  } else {

    init();

  }



  global.kiwlApplyLang = applyLang;

  global.kiwlGetLang = getLang;

  global.kiwlSetStoredLang = setStoredLang;

})(typeof window !== 'undefined' ? window : this);


