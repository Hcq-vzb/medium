/**
 * Site-wide customer service chat widget (EN / AR).
 * Floating button opens a mini chat with company intro and WhatsApp handoff.
 */
(function (global) {
  'use strict';

  var WA_NUMBER = '8617751189576';
  var ROOT_ID = 'kiwl-chat-widget';

  var COPY = {
    en: {
      ariaWidget: 'Customer service chat',
      ariaToggle: 'Open customer service chat',
      ariaClose: 'Close chat',
      headerTitle: 'Medium Beverage Machinery',
      headerStatus: 'Online · Sales team',
      greeting: 'Hello! Welcome to Medium Beverage Machinery 👋',
      introLead: 'We engineer beverage filling machines and complete bottling lines for export markets worldwide.',
      introPage: 'You are viewing:',
      menuTitle: 'How can we help you today?',
      menuProducts: 'Products & solutions',
      menuQuote: 'Request a quotation',
      menuAbout: 'About our company',
      menuWhatsapp: 'Chat on WhatsApp',
      replyProducts:
        'We supply water, juice, carbonated drink and barrel-water filling lines, plus labeling, packaging and water-treatment equipment. Browse our full range on the Products page or tell our sales manager what capacity and bottle type you need.',
      replyQuote:
        'For pricing, lead time and layout drawings, our export sales manager will reply on WhatsApp. Tap the button below — your current page link is included automatically so we know exactly what you are looking at.',
      replyAbout:
        'Medium Beverage Machinery (KIWL) is based in Zhangjiagang, Jiangsu, China, with 15+ years of R&D and manufacturing. We integrate engineering, production and after-sales service for turnkey beverage plants shipped to Asia, Africa, Europe and the Americas.',
      replyWhatsapp: 'Great — opening WhatsApp with your page link included. Our sales manager will respond as soon as possible.',
      waBtn: 'WhatsApp Sales Manager',
      waHint: 'Page link included in your message',
      productsLink: 'View products',
      aboutLink: 'About us'
    },
    ar: {
      ariaWidget: 'دردشة خدمة العملاء',
      ariaToggle: 'فتح دردشة خدمة العملاء',
      ariaClose: 'إغلاق الدردشة',
      headerTitle: 'Medium Beverage Machinery',
      headerStatus: 'متصل · فريق المبيعات',
      greeting: 'مرحباً! أهلاً بكم في Medium Beverage Machinery 👋',
      introLead: 'نصمّم ونصنع آلات تعبئة المشروبات وخطوط التعبئة الكاملة للأسواق العالمية.',
      introPage: 'أنت تتصفح:',
      menuTitle: 'كيف يمكننا مساعدتك اليوم؟',
      menuProducts: 'المنتجات والحلول',
      menuQuote: 'طلب عرض سعر',
      menuAbout: 'عن شركتنا',
      menuWhatsapp: 'الدردشة عبر واتساب',
      replyProducts:
        'نوفر خطوط تعبئة المياه والعصائر والمشروبات الغازية ومياه البراميل، إضافة إلى معدات الوسم والتغليف ومعالجة المياه. تصفح صفحة المنتجات أو أخبر مدير المبيعات بالسعة ونوع الزجاجة المطلوب.',
      replyQuote:
        'للأسعار ومدة التسليم ومخططات التخطيط، سيرد مدير مبيعات التصدير عبر واتساب. اضغط الزر أدناه — سيتضمن الرابط الحالي للصفحة تلقائياً لنعرف ما الذي تطلع عليه.',
      replyAbout:
        'Medium Beverage Machinery (KIWL) مقرها Zhangjiagang، Jiangsu، الصين، مع أكثر من 15 عاماً من البحث والتطوير والتصنيع. نقدم هندسة وإنتاج وخدمة ما بعد البيع لمصانع المشروبات المتكاملة في آسيا وأفريقيا وأوروبا والأمريكتين.',
      replyWhatsapp: 'ممتاز — جاري فتح واتساب مع رابط صفحتك. سيرد مدير المبيعات في أقرب وقت.',
      waBtn: 'مدير المبيعات على واتساب',
      waHint: 'رابط الصفحة مضمن في رسالتك',
      productsLink: 'عرض المنتجات',
      aboutLink: 'من نحن'
    }
  };

  function getLang() {
    if (global.kiwlGetLang) return global.kiwlGetLang();
    var dir = document.documentElement.getAttribute('dir');
    if (dir === 'rtl') return 'ar';
    try {
      var l = localStorage.getItem('kiwl_lang');
      if (l === 'ar') return 'ar';
    } catch (e) {}
    return 'en';
  }

  function t(key) {
    var lang = getLang();
    return (COPY[lang] && COPY[lang][key]) || COPY.en[key] || key;
  }

  function resolvePath(relative) {
    var base = document.querySelector('base');
    if (base && base.href) {
      try {
        return new URL(relative, base.href).pathname.replace(/^\//, '');
      } catch (e) {}
    }
    var path = location.pathname.replace(/\\/g, '/');
    var parts = path.split('/');
    parts.pop();
    var depth = parts.filter(Boolean).length;
    var prefix = depth ? Array(depth + 1).join('../') : '';
    return prefix + relative;
  }

  function pageUrl() {
    if (location.protocol === 'file:') {
      return location.href;
    }
    return location.href.split('#')[0];
  }

  function pageTitle() {
    var h1 = document.querySelector('.kiwl-seo-h1, .des_box .text_title h3, .des_box h3, h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    return (document.title || '').replace(/\s*\|\s*mediumbeveragemachinery\.com.*/i, '').trim();
  }

  function pageSummary() {
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.content) return meta.content.trim();
    var tagline = document.querySelector('.logo_desc_line1');
    if (tagline && tagline.textContent.trim()) return tagline.textContent.trim();
    return t('introLead');
  }

  function waMessage(topic) {
    var lang = getLang();
    var url = pageUrl();
    var title = pageTitle();
    if (lang === 'ar') {
      return (
        'مرحباً! أتصفح موقع Medium Beverage Machinery وأود التحدث مع مدير المبيعات.\n\n' +
        'الصفحة: ' + url + '\n' +
        'الموضوع: ' + (title || 'استفسار عام') +
        (topic ? '\nالطلب: ' + topic : '')
      );
    }
    return (
      'Hello! I am browsing Medium Beverage Machinery and would like to speak with a sales manager.\n\n' +
      'Page: ' + url + '\n' +
      'Topic: ' + (title || 'General inquiry') +
      (topic ? '\nRequest: ' + topic : '')
    );
  }

  function waLink(topic) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(waMessage(topic));
  }

  function injectStyles() {
    if (document.getElementById('kiwl-chat-widget-css')) return;
    var st = document.createElement('style');
    st.id = 'kiwl-chat-widget-css';
    st.textContent =
      '#kiwl-chat-widget{font-family:"Segoe UI",Tahoma,Arial,sans-serif}' +
      '.kiwl-chat-fab{position:fixed;right:18px;bottom:24px;z-index:10000;width:56px;height:56px;border:none;border-radius:50%;background:linear-gradient(135deg,#0e4d90,#1565b8);color:#fff;cursor:pointer;box-shadow:0 4px 18px rgba(14,77,144,.45);display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s}' +
      '.kiwl-chat-fab:hover,.kiwl-chat-fab:focus{transform:scale(1.06);box-shadow:0 6px 22px rgba(14,77,144,.55);outline:none}' +
      '.kiwl-chat-fab svg{width:28px;height:28px;fill:currentColor}' +
      '.kiwl-chat-fab.is-open{background:#64748b}' +
      '.kiwl-chat-panel{position:fixed;right:18px;bottom:92px;z-index:10000;width:340px;max-width:calc(100vw - 24px);height:460px;max-height:calc(100vh - 110px);background:#fff;border-radius:14px;box-shadow:0 12px 40px rgba(15,23,42,.22);display:flex;flex-direction:column;overflow:hidden;opacity:0;visibility:hidden;transform:translateY(12px) scale(.98);transition:opacity .22s,transform .22s,visibility .22s}' +
      '.kiwl-chat-panel.is-open{opacity:1;visibility:visible;transform:translateY(0) scale(1)}' +
      '.kiwl-chat-head{background:linear-gradient(135deg,#0e4d90,#1565b8);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0}' +
      '.kiwl-chat-head-avatar{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}' +
      '.kiwl-chat-head-text{flex:1;min-width:0}' +
      '.kiwl-chat-head-text strong{display:block;font-size:14px;line-height:1.3}' +
      '.kiwl-chat-head-text span{font-size:11px;opacity:.9}' +
      '.kiwl-chat-close{background:none;border:none;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:4px;opacity:.85}' +
      '.kiwl-chat-body{flex:1;overflow-y:auto;padding:14px;background:#f1f5f9;display:flex;flex-direction:column;gap:10px}' +
      '.kiwl-chat-msg{max-width:92%;padding:10px 12px;border-radius:12px;font-size:13px;line-height:1.5;word-break:break-word}' +
      '.kiwl-chat-msg--bot{background:#fff;color:#1e293b;border:1px solid #e2e8f0;border-bottom-left-radius:4px;align-self:flex-start}' +
      '.kiwl-chat-msg--user{background:#0e4d90;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
      '.kiwl-chat-msg em{display:block;font-size:11px;color:#64748b;margin-top:6px;font-style:normal}' +
      'html[dir=rtl] .kiwl-chat-msg--bot{border-bottom-left-radius:12px;border-bottom-right-radius:4px;align-self:flex-end}' +
      'html[dir=rtl] .kiwl-chat-msg--user{border-bottom-right-radius:12px;border-bottom-left-radius:4px;align-self:flex-start}' +
      '.kiwl-chat-menu{display:flex;flex-direction:column;gap:8px;margin-top:4px}' +
      '.kiwl-chat-menu button{background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:13px;text-align:start;cursor:pointer;color:#0f172a;transition:background .15s,border-color .15s}' +
      '.kiwl-chat-menu button:hover,.kiwl-chat-menu button:focus{background:#eff6ff;border-color:#0e4d90;outline:none}' +
      '.kiwl-chat-foot{padding:12px;border-top:1px solid #e2e8f0;background:#fff;flex-shrink:0}' +
      '.kiwl-chat-wa{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;border:none;border-radius:10px;background:#25d366;color:#fff;font-size:14px;font-weight:600;text-decoration:none;cursor:pointer;transition:background .15s}' +
      '.kiwl-chat-wa:hover,.kiwl-chat-wa:focus{background:#1da851;color:#fff;outline:none}' +
      '.kiwl-chat-wa svg{width:20px;height:20px;fill:currentColor;flex-shrink:0}' +
      '.kiwl-chat-wa-hint{font-size:10px;color:#64748b;text-align:center;margin-top:6px}' +
      '.kiwl-chat-link{display:inline-block;margin-top:8px;color:#0e4d90;font-size:12px;font-weight:600;text-decoration:none}' +
      '.kiwl-chat-link:hover{text-decoration:underline}' +
      'html[dir=rtl] .kiwl-chat-fab,html[dir=rtl] .kiwl-chat-panel{right:auto;left:18px}' +
      '@media(max-width:768px){.kiwl-chat-fab{right:14px;bottom:14px;width:52px;height:52px}html[dir=rtl] .kiwl-chat-fab{left:14px;right:auto}.kiwl-chat-panel{right:8px;left:8px;bottom:76px;width:auto;height:min(460px,calc(100vh - 90px))}html[dir=rtl] .kiwl-chat-panel{left:8px;right:8px}}';
    document.head.appendChild(st);
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function addBotMsg(body, text, extraHtml) {
    var wrap = el('div', 'kiwl-chat-msg kiwl-chat-msg--bot');
    wrap.innerHTML = text + (extraHtml || '');
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return wrap;
  }

  function addUserMsg(body, text) {
    var wrap = el('div', 'kiwl-chat-msg kiwl-chat-msg--user', text);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  function buildWidget() {
    if (document.getElementById(ROOT_ID)) return;

    injectStyles();

    var root = el('div');
    root.id = ROOT_ID;
    root.setAttribute('role', 'complementary');
    root.setAttribute('aria-label', t('ariaWidget'));

    var fab = el('button', 'kiwl-chat-fab');
    fab.type = 'button';
    fab.setAttribute('aria-label', t('ariaToggle'));
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';

    var panel = el('div', 'kiwl-chat-panel');
    panel.setAttribute('aria-hidden', 'true');

    var head = el('div', 'kiwl-chat-head');
    head.innerHTML =
      '<div class="kiwl-chat-head-avatar">MB</div>' +
      '<div class="kiwl-chat-head-text"><strong>' + t('headerTitle') + '</strong><span>' + t('headerStatus') + '</span></div>';
    var closeBtn = el('button', 'kiwl-chat-close', '&times;');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', t('ariaClose'));
    head.appendChild(closeBtn);

    var body = el('div', 'kiwl-chat-body');
    var foot = el('div', 'kiwl-chat-foot');
    var waBtn = el('a', 'kiwl-chat-wa');
    waBtn.href = waLink();
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
      '<span>' + t('waBtn') + '</span>';
    foot.appendChild(waBtn);
    foot.appendChild(el('div', 'kiwl-chat-wa-hint', t('waHint')));

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(foot);
    root.appendChild(fab);
    root.appendChild(panel);
    document.body.appendChild(root);

    var opened = false;
    var menuShown = false;

    function refreshLabels() {
      root.setAttribute('aria-label', t('ariaWidget'));
      fab.setAttribute('aria-label', t('ariaToggle'));
      closeBtn.setAttribute('aria-label', t('ariaClose'));
      head.querySelector('strong').textContent = t('headerTitle');
      head.querySelector('span').textContent = t('headerStatus');
      waBtn.querySelector('span').textContent = t('waBtn');
      foot.querySelector('.kiwl-chat-wa-hint').textContent = t('waHint');
      waBtn.href = waLink();
    }

    function showMenu() {
      if (menuShown) return;
      menuShown = true;
      var msg = el('div', 'kiwl-chat-msg kiwl-chat-msg--bot');
      msg.innerHTML = '<strong>' + t('menuTitle') + '</strong>';
      var menuWrap = el('div', 'kiwl-chat-menu');
      var items = [
        { key: 'menuProducts', action: 'products' },
        { key: 'menuQuote', action: 'quote' },
        { key: 'menuAbout', action: 'about' },
        { key: 'menuWhatsapp', action: 'whatsapp' }
      ];
      items.forEach(function (item) {
        var btn = el('button', '', t(item.key));
        btn.type = 'button';
        btn.addEventListener('click', function () {
          handleAction(item.action, item.key);
        });
        menuWrap.appendChild(btn);
      });
      msg.appendChild(menuWrap);
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    function handleAction(action, labelKey) {
      addUserMsg(body, t(labelKey));
      var topic = t(labelKey);
      waBtn.href = waLink(topic);

      if (action === 'products') {
        var extra =
          '<a class="kiwl-chat-link" href="' + resolvePath('product/index.html') + '">' + t('productsLink') + ' →</a>';
        addBotMsg(body, t('replyProducts'), extra);
      } else if (action === 'quote') {
        addBotMsg(body, t('replyQuote'));
      } else if (action === 'about') {
        var extra2 =
          '<a class="kiwl-chat-link" href="' + resolvePath('about/index.html') + '">' + t('aboutLink') + ' →</a>';
        addBotMsg(body, t('replyAbout'), extra2);
      } else if (action === 'whatsapp') {
        addBotMsg(body, t('replyWhatsapp'));
        window.open(waLink(topic), '_blank', 'noopener,noreferrer');
      }
    }

    function startConversation() {
      body.innerHTML = '';
      menuShown = false;
      var title = pageTitle();
      var summary = pageSummary();
      addBotMsg(body, t('greeting'));
      addBotMsg(
        body,
        t('introLead') +
          (title ? '<em>' + t('introPage') + ' ' + title + '</em>' : '') +
          (summary && summary !== t('introLead') ? '<br /><br />' + summary : '')
      );
      setTimeout(showMenu, 400);
    }

    function setOpen(open) {
      opened = open;
      panel.classList.toggle('is-open', open);
      fab.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      if (open && !body.childElementCount) {
        startConversation();
      }
    }

    fab.addEventListener('click', function () {
      setOpen(!opened);
    });
    closeBtn.addEventListener('click', function () {
      setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!opened) return;
      if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-lang-select]');
      if (!btn) return;
      setTimeout(function () {
        refreshLabels();
        if (opened && body.childElementCount) {
          startConversation();
        }
      }, 80);
    });

    global.kiwlChatRefresh = refreshLabels;
  }

  function init() {
    if (document.body) {
      buildWidget();
    } else {
      document.addEventListener('DOMContentLoaded', buildWidget);
    }
  }

  init();
})(typeof window !== 'undefined' ? window : this);
