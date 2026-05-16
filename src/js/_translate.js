function initTranslate() {
  console.log('translate active');

  const elements = document.querySelectorAll(
    '[data-i18n], [data-i18n-aria], [data-i18n-alt], [data-i18n-placeholder]'
  );
  const langBtns = document.querySelectorAll('.lang-btn');

  let currentLang = localStorage.getItem('language') || 'ru';

  window.applyTranslation = (lang) => {
    elements.forEach((el) => {
      const textKey = el.getAttribute('data-i18n');
      if (textKey && translations[lang]?.[textKey]) {
        const translation = translations[lang][textKey];

        if (el.hasAttribute('title')) {
          el.setAttribute('title', translation);
        }

        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') {
          el.innerHTML = translation;
        }
      }

      const ariaKey = el.getAttribute('data-i18n-aria');
      if (ariaKey && translations[lang]?.[ariaKey]) {
        el.setAttribute('aria-label', translations[lang][ariaKey]);
      }

      const altKey = el.getAttribute('data-i18n-alt');
      if (altKey && translations[lang]?.[altKey]) {
        el.setAttribute('alt', translations[lang][altKey]);
      }

      const placeholderKey = el.getAttribute('data-i18n-placeholder');
      if (placeholderKey && translations[lang]?.[placeholderKey]) {
        el.setAttribute('placeholder', translations[lang][placeholderKey]);
      }
    });

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
  };

  applyTranslation(currentLang);

  langBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'ru' ? 'en' : 'ru';
      applyTranslation(currentLang);
    });
  });
}
