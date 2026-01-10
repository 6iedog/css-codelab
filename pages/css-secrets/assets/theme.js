// CSS Secrets - Theme Manager
(function () {
    const body = document.body

    function applyTheme(mode) {
        body.setAttribute('data-theme', mode)
        body.setAttribute('data-bs-theme', mode)
    }

    function updateButtons(mode) {
        const buttons = document.querySelectorAll('[data-theme]')
        buttons.forEach(btn => {
            if (btn.tagName === 'BUTTON') {
                btn.classList.toggle('active', btn.dataset.theme === mode)
            }
        })
    }

    function getSystemTheme() {
        const mediaQueryList = matchMedia('(prefers-color-scheme: dark)')
        applyTheme(mediaQueryList.matches ? 'dark' : 'light')
        mediaQueryList.addEventListener('change', (evt) => {
            applyTheme(evt.matches ? 'dark' : 'light')
        })

    }

    function updateTheme() {
        const savedMode = localStorage.getItem('themeMode') || 'auto'
        if (savedMode === 'dark' || savedMode === 'light') {
            applyTheme(savedMode)
        } else {
            getSystemTheme()
        }
        updateButtons(savedMode)
    }

    function initTheme() {
        updateTheme()
        // Bind button events
        document.querySelectorAll('.btn-group [data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.theme
                localStorage.setItem('themeMode', mode)
                updateTheme()
            })
        })
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme)
    } else {
        initTheme()
    }
})()
