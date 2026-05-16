function initFormBtn() {
  const form = document.querySelector('.access__form');
  const submitBtn = form?.querySelector('[type="submit"]');
  const resetBtn = form?.querySelector('[type="reset"]');

  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.setAttribute('data-i18n', 'form-sending');
      submitBtn.disabled = true;

      if (typeof applyTranslation === 'function') {
        applyTranslation(localStorage.getItem('language') || 'ru');
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          submitBtn.setAttribute('data-i18n', 'form-sent');
          submitBtn.classList.add('_success');
          if (typeof applyTranslation === 'function') {
            applyTranslation(localStorage.getItem('language') || 'ru');
          }
        } else {
          throw new Error();
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.setAttribute('data-i18n', 'form-submit');
        if (typeof applyTranslation === 'function') {
          applyTranslation(localStorage.getItem('language') || 'ru');
        }
      }
    });

    resetBtn?.addEventListener('click', () => {
      submitBtn.disabled = false;
      submitBtn.classList.remove('_success');
      submitBtn.setAttribute('data-i18n', 'form-submit');
      if (typeof applyTranslation === 'function') {
        applyTranslation(localStorage.getItem('language') || 'ru');
      }
    });
  }
}
