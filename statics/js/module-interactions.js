/**
 * 产品系列侧边栏 + 我们的优势：当前项标记、优势区滚动渐入
 */
(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function normalizePath(href) {
    try {
      var url = new URL(href, window.location.href);
      var path = decodeURIComponent(url.pathname).toLowerCase();
      if (path.endsWith('/')) {
        path += 'index.html';
      }
      return path;
    } catch (e) {
      return '';
    }
  }

  function markCurrentNav() {
    var current = normalizePath(window.location.href);
    if (!current) {
      return;
    }

    var links = document.querySelectorAll(
      '#index .products .cp_cont .class_bx ul li a, #neiye .content .left_box .nva_box a'
    );

    links.forEach(function (anchor) {
      var href = anchor.getAttribute('href');
      if (!href || href === '#' || href.indexOf('javascript:') === 0) {
        return;
      }

      var linkPath = normalizePath(href);
      if (!linkPath) {
        return;
      }

      var isMatch =
        linkPath === current ||
        (current.indexOf(linkPath.replace(/\/index\.html$/, '')) !== -1 &&
          linkPath.length > 8);

      if (!isMatch) {
        return;
      }

      var li = anchor.closest('li');
      var h3 = anchor.closest('h3');

      anchor.classList.add('kiwl-nav-current');
      if (li) {
        li.classList.add('kiwl-nav-current');
      }
      if (h3) {
        h3.classList.add('kiwl-nav-current');
      }
    });
  }

  function initYoushiReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var section = document.querySelector('#index .youshi');
    if (!section || !('IntersectionObserver' in window)) {
      return;
    }

    section.classList.add('kiwl-youshi-reveal');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('kiwl-youshi-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );

    observer.observe(section);
  }

  onReady(function () {
    markCurrentNav();
    initYoushiReveal();
  });
})();
