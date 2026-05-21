/**
 * Online Inquiry: mailto submit + confirm dialog + bilingual button labels
 */
(function (global) {
  'use strict';

  var MAIL = 'cathy@kiwlmachine.com';
  var CONFIRM = {
    en: 'Your inquiry will be sent via your default email client. Please confirm to send.',
    ar: 'سيتم إرسال استفسارك عبر بريدك الإلكتروني الافتراضي. يرجى التأكيد للإرسال.'
  };

  var BTN = {
    submit: { en: 'Send Inquiry', ar: 'إرسال الاستفسار' },
    reset: { en: 'Reset', ar: 'إعادة تعيين' }
  };

  function currentLang() {
    if (global.kiwlCurrentLang) return global.kiwlCurrentLang;
    try {
      var l = localStorage.getItem('kiwl_lang') || '';
      if (l === 'ar' || l === 'fr') return 'ar';
    } catch (e) {}
    return document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
  }

  function updateButtons(lang) {
    var form = document.getElementById('kiwl-inquiry-form');
    if (!form) return;
    var submit = form.querySelector('.kiwl-btn-submit, input.Confirm[type="submit"]');
    var reset = form.querySelector('.kiwl-btn-reset, input.Reset[type="reset"]');
    if (submit) submit.value = BTN.submit[lang] || BTN.submit.en;
    if (reset) reset.value = BTN.reset[lang] || BTN.reset.en;
  }

  function buildMailtoBody(form) {
    var subject = (form.querySelector('[name="Subject"]') || {}).value || '';
    var name = (form.querySelector('[name="Name"]') || {}).value || '';
    var tel = (form.querySelector('[name="Tel"]') || {}).value || '';
    var message = (form.querySelector('[name="Message"]') || {}).value || '';
    return (
      'Subject: ' + subject + '\n' +
      'Name: ' + name + '\n' +
      'Tel: ' + tel + '\n' +
      'Message:\n' + message
    );
  }

  function initForm() {
    var form = document.getElementById('kiwl-inquiry-form');
    if (!form || form.getAttribute('data-kiwl-inquiry-init')) return;
    form.setAttribute('data-kiwl-inquiry-init', '1');

    updateButtons(currentLang());

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lang = currentLang();
      var msg = CONFIRM[lang] || CONFIRM.en;
      if (!global.confirm(msg)) return;

      var subjectVal =
        (form.querySelector('[name="Subject"]') || {}).value || 'Website Inquiry';
      var body = buildMailtoBody(form);
      var mailto =
        'mailto:' +
        MAIL +
        '?subject=' +
        encodeURIComponent(subjectVal) +
        '&body=' +
        encodeURIComponent(body);

      global.location.href = mailto;
    });
  }

  function hookLang() {
    if (typeof global.kiwlApplyLang !== 'function') return;
    var orig = global.kiwlApplyLang;
    global.kiwlApplyLang = function (lang) {
      orig(lang);
      updateButtons(lang);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initForm();
      hookLang();
      updateButtons(currentLang());
    });
  } else {
    initForm();
    hookLang();
    updateButtons(currentLang());
  }
})(typeof window !== 'undefined' ? window : this);
