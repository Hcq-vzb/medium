/**
 * 为未注入汉堡结构的旧页面自动补充导航开关（不修改可见内容）
 */
(function () {
  function init() {
    var linkNav = document.querySelector('#header .link_nav');
    if (!linkNav || linkNav.querySelector('.kiwl-nav-toggle')) {
      return;
    }
    var ul = linkNav.querySelector('ul');
    if (!ul) {
      return;
    }
    var toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'kiwl-nav-toggle';
    toggle.className = 'kiwl-nav-toggle';
    toggle.setAttribute('aria-hidden', 'true');

    var label = document.createElement('label');
    label.htmlFor = 'kiwl-nav-toggle';
    label.className = 'kiwl-nav-btn';
    label.setAttribute('aria-label', '打开菜单');
    label.innerHTML = '<span></span><span></span><span></span>';

    linkNav.insertBefore(label, ul);
    linkNav.insertBefore(toggle, label);

    ul.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.checked = false;
        linkNav.classList.remove('kiwl-nav-is-open');
      });
    });

    toggle.addEventListener('change', function () {
      linkNav.classList.toggle('kiwl-nav-is-open', toggle.checked);
      document.body.classList.toggle('kiwl-nav-open', toggle.checked);
    });

    /* 手机端：将内页侧栏栏目并入主导航下拉（不修改 HTML 文件） */
    if (window.matchMedia('(max-width: 768px)').matches) {
      var nva = document.querySelector('#neiye .content .left_box .nva_box');
      if (nva && !ul.querySelector('.kiwl-subnav-label')) {
        var heads = nva.querySelectorAll('h3 > a');
        if (heads.length) {
          var labelLi = document.createElement('li');
          labelLi.className = 'kiwl-subnav-label';
          labelLi.textContent = '栏目导航';
          ul.appendChild(labelLi);
          heads.forEach(function (a) {
            var li = document.createElement('li');
            li.className = 'kiwl-subnav-item';
            var link = a.cloneNode(true);
            li.appendChild(link);
            ul.appendChild(li);
          });
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
