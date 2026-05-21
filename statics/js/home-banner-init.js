/**
 * Homepage kinMaxShow carousel — reliable init, autoplay, prev/next arrows
 */
(function () {
  'use strict';

  var DESKTOP_H = 650;

  function getBannerHeight() {
    if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
      return Math.max(220, Math.min(Math.round(window.innerWidth * 0.56), 320));
    }
    return DESKTOP_H;
  }

  function patchKinMaxShowOnce() {
    var $ = window.jQuery;
    if (!$ || !$.fn.kinMaxShow || $.fn.kinMaxShow._kiwlHomeBannerPatch) {
      return;
    }
    var original = $.fn.kinMaxShow;
    $.fn.kinMaxShow = function (options) {
      var opts = $.extend(
        true,
        {
          height: getBannerHeight(),
          intervalTime: 6,
          switchTime: 800,
          easing: 'linear',
          mouseOverPause: true,
          button: {
            switchEvent: 'click',
            showIndex: true
          }
        },
        options || {}
      );
      return original.call(this, opts);
    };
    $.fn.kinMaxShow._kiwlHomeBannerPatch = true;
  }

  function showFallback($el) {
    $el.addClass('kiwl-banner-fallback kiwl-banner-ready').css({
      visibility: 'visible',
      display: 'block',
      opacity: 1,
      height: getBannerHeight() + 'px'
    });
    var $first = $el.children('div').first();
    if ($first.length) {
      $first.show();
    }
  }

  function bindArrows($banner) {
    var $wrap = $banner.closest('.indx_banner');
    if (!$wrap.length) {
      $wrap = $banner.parent();
    }
    $wrap.css('position', 'relative');
    var $prev = $wrap.find('.kiwl-banner-prev');
    var $next = $wrap.find('.kiwl-banner-next');
    if (!$prev.length) {
      $prev = $('<button type="button" class="kiwl-banner-arrow kiwl-banner-prev" aria-label="Previous slide"></button>');
      $next = $('<button type="button" class="kiwl-banner-arrow kiwl-banner-next" aria-label="Next slide"></button>');
      $wrap.append($prev, $next);
    }
    if ($prev.data('kiwlArrowBound')) {
      return;
    }
    $prev.data('kiwlArrowBound', true);

    function go(delta) {
      var $ul = $banner.children('ul');
      if (!$ul.length) {
        return;
      }
      var $lis = $ul.children('li');
      if ($lis.length < 2) {
        return;
      }
      var $focus = $lis.filter(function () {
        return $(this).attr('class') && $(this).attr('class').indexOf('focus') !== -1;
      });
      var idx = $focus.length ? $lis.index($focus) : 0;
      idx = (idx + delta + $lis.length) % $lis.length;
      $lis.eq(idx).trigger('click');
    }

    $prev.on('click', function (e) {
      e.preventDefault();
      go(-1);
    });
    $next.on('click', function (e) {
      e.preventDefault();
      go(1);
    });
  }

  function initBanner() {
    var $ = window.jQuery;
    if (!$) {
      return;
    }
    var $banner = $('#kinMaxShow');
    if (!$banner.length || $banner.data('kiwlBannerInited')) {
      return;
    }

    patchKinMaxShowOnce();

    var h = getBannerHeight();
    $banner.addClass('kiwl-banner-loading').css({ height: h + 'px' });

    if (!$.fn.kinMaxShow) {
      showFallback($banner);
      bindArrows($banner);
      return;
    }

    try {
      $banner.kinMaxShow({
        height: h,
        intervalTime: 6,
        switchTime: 800,
        easing: 'linear',
        mouseOverPause: true
      });
      $banner.data('kiwlBannerInited', true);
      $banner.removeClass('kiwl-banner-loading').addClass('kiwl-banner-ready').css({
        visibility: 'visible',
        display: 'block',
        opacity: 1
      });
      bindArrows($banner);
    } catch (err) {
      console.warn('kinMaxShow init failed:', err);
      showFallback($banner);
      bindArrows($banner);
    }

    /* Safety: force visible after plugin layout */
    window.setTimeout(function () {
      $banner.addClass('kiwl-banner-ready').css('visibility', 'visible');
      var $box = $banner.find('[class*="_image_box"]');
      if ($box.length) {
        $box.css('height', getBannerHeight() + 'px');
      }
    }, 200);
  }

  function boot() {
    if (document.getElementById('kinMaxShow')) {
      initBanner();
    }
  }

  if (window.jQuery) {
    window.jQuery(boot);
    window.jQuery(window).on('load', boot);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      var n = 0;
      var t = window.setInterval(function () {
        if (window.jQuery || ++n > 100) {
          window.clearInterval(t);
          boot();
        }
      }, 50);
    });
  }

  window.addEventListener('resize', function () {
    var el = document.getElementById('kinMaxShow');
    if (!el || !el.classList.contains('kiwl-banner-ready')) {
      return;
    }
    var h = getBannerHeight() + 'px';
    el.style.height = h;
    var box = el.querySelector('[class*="_image_box"]');
    if (box) {
      box.style.height = h;
    }
  });
})();
