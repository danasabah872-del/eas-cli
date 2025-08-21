document.addEventListener('DOMContentLoaded', function() {
    // --- Existing Interactive Elements Logic ---
    const authButtons = document.querySelectorAll('.auth-buttons .btn');
    authButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('This is just a demo. In the real application, this would lead to a registration or download page.');
        });
    });

    const features = document.querySelectorAll('.feature-card');
    features.forEach(feature => {
        feature.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            alert(`Feature "${title}" is currently under development.`);
        });
    });

    const heroButton = document.querySelector('.hero .btn-primary');
    if(heroButton) {
        heroButton.addEventListener('click', function() {
            alert('This is just a demo. In the real application, this would lead to a registration or download page.');
        });
    }

    // --- Language Switcher Logic ---
    const languageSelect = document.getElementById('languageSelect');

    // Function to update text content based on selected language
    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update HTML dir and lang attributes
        if (lang === 'ar' || lang === 'ku') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
        document.documentElement.setAttribute('lang', lang);

        // Persist language choice
        localStorage.setItem('selectedLanguage', lang);
    }

    languageSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });

    // --- Initial Load ---
    // Check for saved language on load
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        languageSelect.value = savedLang;
        setLanguage(savedLang);
    } else {
        // Default to Arabic if no language is saved
        setLanguage('ar');
    }
});
