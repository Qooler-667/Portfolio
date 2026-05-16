function initActive() {
  console.log('Active links initialized');

  // === Links ===
  const headerItems = document.querySelectorAll('.header__menu-item');
  if (!document.querySelector('.header__menu-item')) return;
  const burgerWrapper = document.querySelector('.burger--wrapper');
  const burgerList = document.querySelector('.burger__menu-list');

  // === УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ===
  function updateActiveState(targetLi) {
    if (!targetLi) return;
    headerItems.forEach((li) => li.classList.remove('active'));
    targetLi.classList.add('active');
  }

  headerItems.forEach((item) => {
    item.addEventListener('click', () => {
      updateActiveState(item);
    });
  });

  if (burgerList) {
    burgerList.addEventListener('click', (e) => {
      const burgerLink = e.target.closest('.burger__menu-link');
      if (!burgerLink) return;

      burgerWrapper.classList.remove('is-open');
      document.body.style.overflow = '';

      const targetHref = burgerLink.getAttribute('href');
      const correspondingHeaderLink = document.querySelector(
        `.header__menu-link[href="${targetHref}"]`
      );

      if (correspondingHeaderLink) {
        updateActiveState(correspondingHeaderLink.parentElement);
      }
    });
  }
}
