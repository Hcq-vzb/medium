/**
 * 须在 kinMaxShow 插件加载后、页面 $(fn) 初始化前执行，为手机端注入正确高度
 */
(function () {
  'use strict';
  function patch() {
    var $ = window.jQuery;
    if (!$ || !$.fn.kinMaxShow || $.fn.kinMaxShow._kiwlPrepatched) {
      return !!($.fn && $.fn.kinMaxShow);
    }
    var original = $.fn.kinMaxShow;
    $.fn.kinMaxShow = function (options) {
      var opts = $.extend(true, { interval: 6000, mouseOverPause: true }, options || {});
      if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
        opts.height = Math.max(220, Math.min(Math.round(window.innerWidth * 0.56), 320));
      }
      return original.call(this, opts);
    };
    $.fn.kinMaxShow._kiwlPrepatched = true;
    return true;
  }
  if (!patch()) {
    var n = 0;
    var t = setInterval(function () {
      if (patch() || ++n > 50) {
        clearInterval(t);
      }
    }, 20);
  }
})();
