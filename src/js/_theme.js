function initTheme() {
  const themeBtns = document.querySelectorAll('.theme-btn');

  // === ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ===

  function updateIcons(isDark) {
    const iconName = isDark ? 'moon-icon' : 'sun-icon';

    themeBtns.forEach(function (btn) {
      const icon = btn.querySelector('use');
      if (icon) {
        icon.setAttribute('href', `images/icons/stack.svg#${iconName}`);
      }
    });
  }

  // === ГЛАВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ===
  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');

    updateIcons(isDark);

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // === ФУНКЦИЯ ЗАГРУЗКИ ===
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';

    if (isDark) {
      document.body.classList.add('dark');
      updateIcons(true);
    }
  }

  // --- ЗАПУСК ЛОГИКИ ---

  themeBtns.forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });

  loadTheme();
}
