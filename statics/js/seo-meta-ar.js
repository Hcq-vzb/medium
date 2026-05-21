/**
 * Apply Arabic title/description/keywords when user switches to AR (client-side i18n site).
 */
(function () {
  function applyArMeta() {
    var html = document.documentElement;
    var lang = html.getAttribute('lang') || (html.classList.contains('lang-ar') ? 'ar' : 'en');
    if (lang !== 'ar' && !html.classList.contains('lang-ar')) {
      if (window.__seoEnTitle) document.title = window.__seoEnTitle;
      if (window.__seoEnDesc) setMeta('description', window.__seoEnDesc);
      if (window.__seoEnKw) setMeta('keywords', window.__seoEnKw);
      return;
    }
    var t = html.getAttribute('data-seo-ar-title');
    var d = html.getAttribute('data-seo-ar-desc');
    var k = html.getAttribute('data-seo-ar-keywords');
    if (!window.__seoEnTitle) {
      window.__seoEnTitle = document.title;
      window.__seoEnDesc = getMeta('description');
      window.__seoEnKw = getMeta('keywords');
    }
    if (t) document.title = t + ' | mediumbeveragemachinery.com';
    if (d) setMeta('description', d);
    if (k) setMeta('keywords', k);
  }

  function setMeta(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function getMeta(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute('content') : '';
  }

  function hookLang() {
    applyArMeta();
    var obs = new MutationObserver(function () {
      applyArMeta();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang', 'class']
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.lang-switch, [data-lang], .lang_en, .lang_ar')) {
        setTimeout(applyArMeta, 80);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookLang);
  } else {
    hookLang();
  }
  window.kiwlApplyArSeo = applyArMeta;
})();
