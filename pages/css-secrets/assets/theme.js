// CSS Secrets - Theme Manager
(function() {
  const body = document.body;

  function applyTheme(mode) {
    body.setAttribute('data-theme', mode);
  }

  function updateButtons(mode) {
    const buttons = document.querySelectorAll('[data-theme]');
    buttons.forEach(btn => {
      if (btn.tagName === 'BUTTON') {
        btn.classList.toggle('active', btn.dataset.theme === mode);
      }
    });
  }

  function initTheme() {
    const savedMode = localStorage.getItem('themeMode') || 'auto';
    applyTheme(savedMode);
    updateButtons(savedMode);

    // Bind button events
    document.querySelectorAll('.btn-group [data-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.theme;
        localStorage.setItem('themeMode', mode);
        applyTheme(mode);
        updateButtons(mode);
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
