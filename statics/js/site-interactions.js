/**
 * 全站轻量交互：轮播优化、滚动顶栏、移动端菜单动画（不改动业务逻辑）
 */
(function () {
  'use strict';

  /* kinMaxShow：在页面 init 前合并默认参数（略放慢 + 悬停暂停） */
  function patchKinMaxShow() {
    if (typeof window.jQuery === 'undefined') {
      setTimeout(patchKinMaxShow, 40);
      return;
    }
    var $ = window.jQuery;
    if (!$.fn.kinMaxShow || $.fn.kinMaxShow._kiwlPatched) {
      return;
    }
    var original = $.fn.kinMaxShow;
    $.fn.kinMaxShow = function (options) {
      var opts = $.extend(
        true,
        {
          interval: 6000,
          mouseOverPause: true
        },
        options || {}
      );
      if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
        var mobileH = Math.max(220, Math.min(Math.round(window.innerWidth * 0.56), 320));
        opts.height = mobileH;
      }
      return original.call(this, opts);
    };
    $.fn.kinMaxShow._kiwlPatched = true;
  }
  patchKinMaxShow();

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    initScrollHeader();
    initMobileNav();
    initKinMaxHoverFallback();
    initKinMaxShowMobileFix();
  });

  /** 手机端：同步 kinMaxShow 高度与可见性，修复仅显示指示器无图 */
  function initKinMaxShowMobileFix() {
    if (!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) {
      return;
    }
    function apply() {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        return;
      }
      var el = document.getElementById('kinMaxShow');
      if (!el) {
        return;
      }
      var h = Math.max(220, Math.min(Math.round(window.innerWidth * 0.56), 320));
      el.style.visibility = 'visible';
      el.style.height = h + 'px';
      var box = el.querySelector('[class*="_image_box"]');
      if (box) {
        box.style.height = h + 'px';
      }
      var items = el.querySelectorAll('[class*="_image_item"]');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.style.height = h + 'px';
        item.style.maxHeight = h + 'px';
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center center';
        item.style.backgroundRepeat = 'no-repeat';
        if (item.style.display === 'none' && i === 0) {
          item.style.display = 'block';
        }
        var img = item.querySelector('img');
        if (img) {
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.visibility = 'visible';
          img.style.display = 'block';
        }
      }
    }
    apply();
    setTimeout(apply, 120);
    setTimeout(apply, 600);
    window.addEventListener('resize', function () {
      clearTimeout(apply._t);
      apply._t = setTimeout(apply, 150);
    });
  }

  /** 滚动时顶栏轻微阴影 */
  function initScrollHeader() {
    var header = document.getElementById('header');
    if (!header) {
      return;
    }
    var ticking = false;
    function update() {
      ticking = false;
      if (window.scrollY > 24) {
        header.classList.add('kiwl-scrolled');
      } else {
        header.classList.remove('kiwl-scrolled');
      }
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /** 汉堡菜单：打开/关闭状态类 + 点击区域扩大 */
  function initMobileNav() {
    var linkNav = document.querySelector('#header .link_nav');
    if (!linkNav) {
      return;
    }
    var toggle = linkNav.querySelector('.kiwl-nav-toggle');
    if (!toggle) {
      return;
    }

    function syncOpen() {
      if (toggle.checked) {
        linkNav.classList.add('kiwl-nav-is-open');
        document.body.classList.add('kiwl-nav-open');
      } else {
        linkNav.classList.remove('kiwl-nav-is-open');
        document.body.classList.remove('kiwl-nav-open');
      }
    }

    toggle.addEventListener('change', syncOpen);
    syncOpen();

    var label = linkNav.querySelector('.kiwl-nav-btn');
    if (label) {
      label.addEventListener('click', function () {
        window.requestAnimationFrame(syncOpen);
      });
    }
  }

  /** 轮播区域悬停时触发插件 mouseover 事件（配合 mouseOverPause） */
  function initKinMaxHoverFallback() {
    if (typeof window.jQuery === 'undefined') {
      return;
    }
    var $ = window.jQuery;
    var $banner = $('#kinMaxShow');
    if (!$banner.length) {
      return;
    }
    var $wrap = $banner.closest('.indx_banner').length ? $banner.closest('.indx_banner') : $banner;
    $wrap.on('mouseenter', function () {
      $banner.trigger('mouseenter');
    });
    $wrap.on('mouseleave', function () {
      $banner.trigger('mouseleave');
    });
  }
})();
