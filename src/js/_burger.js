function initBurger() {
  const burgerBtn = document.querySelector('.header__burger');
  if (!document.querySelector('.header__burger')) return;
  const exitBtn = document.querySelector('.burger__exit');
  const menuWrapper = document.querySelector('.burger--wrapper');
  const burgerMenuList = document.querySelector('.burger__menu-list');
  const headerMenuItems = document.querySelectorAll('.header__menu-item');

  const toggleMenu = (isOpen) => {
    menuWrapper.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    burgerBtn.setAttribute('aria-expanded', isOpen);
  };

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => toggleMenu(true));
  }

  if (exitBtn) {
    exitBtn.addEventListener('click', () => toggleMenu(false));
  }

  menuWrapper.addEventListener('click', (e) => {
    if (e.target === menuWrapper) toggleMenu(false);
  });

  // === Логика навигации и активных классов ===

  if (burgerMenuList) {
    burgerMenuList.addEventListener('click', (e) => {
      const link = e.target.closest('.burger__menu-link');
      if (!link) return;

      toggleMenu(false);

      const targetHref = link.getAttribute('href');

      const syncHeaderLink = document.querySelector(
        `.header__menu-link[href="${targetHref}"]`
      );

      if (syncHeaderLink) {
        headerMenuItems.forEach((item) => item.classList.remove('active'));
        syncHeaderLink.parentElement.classList.add('active');
      }
    });
  }
}
