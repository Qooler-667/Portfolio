document.addEventListener('DOMContentLoaded', () => {
  if (typeof initTranslate === 'function') {
    initTranslate();
  }
  if (typeof initBurger === 'function') {
    initBurger();
  }

  if (typeof initTheme === 'function') {
    initTheme();
  }

  if (typeof initActive === 'function') {
    initActive();
  }

  if (typeof initSlider === 'function') {
    initSlider();
  }

  if (typeof initFormBtn === 'function') {
    initFormBtn();
  }

  const textArea = document.querySelector('.access__form-area');

  if (textArea) {
    textArea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    });
  }
});
