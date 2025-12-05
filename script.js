// ============================================
// CONFIGURACIÓN DE IDIOMAS
// ============================================
const languageConfig = {
    es: {
        code: 'es',
        name: 'Español',
        currency: 'Bs.',
        flag: 'flags/bolivia.png',
        prices: {
            '89.99': 'Bs. 89.99',
            '149.99': 'Bs. 149.99',
            '129.99': 'Bs. 129.99',
            '69.99': 'Bs. 69.99',
            '179.99': 'Bs. 179.99',
            '199.99': 'Bs. 199.99'
        }
    },
    pt: {
        code: 'pt',
        name: 'Português',
        currency: 'R$',
        flag: 'flags/brazil.png',
        prices: {
            '89.99': 'R$ 65.69',
            '149.99': 'R$ 109.49',
            '129.99': 'R$ 94.89',
            '69.99': 'R$ 51.09',
            '179.99': 'R$ 131.39',
            '199.99': 'R$ 145.99'
        }
    }
};

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentLanguage = 'es';

// ============================================
// FUNCIONES DE TRADUCCIÓN
// ============================================

/**
 * Cambia el idioma de toda la página
 * @param {string} langCode - Código del idioma ('es' o 'pt')
 */
function changeLanguage(langCode) {
    console.log(`Cambiando idioma a: ${langCode}`);
    
    const lang = languageConfig[langCode];
    if (!lang) {
        console.error(`Idioma no soportado: ${langCode}`);
        return;
    }
    
    // Actualizar variable global
    currentLanguage = langCode;
    
    // Actualizar botón de idioma actual
    updateLanguageButton(lang);
    
    // Traducir todos los textos de la página
    translatePage(lang);
    
    // Actualizar precios según la moneda
    updatePrices(lang);
    
    // Cambiar atributo lang del HTML
    document.documentElement.lang = langCode;
    
    // Guardar preferencia en localStorage
    localStorage.setItem('language', langCode);
    
    console.log(`Idioma cambiado a ${lang.name}`);
}

/**
 * Actualiza el botón del selector de idioma
 * @param {Object} lang - Configuración del idioma
 */
function updateLanguageButton(lang) {
    const currentLangBtn = document.getElementById('current-language');
    if (!currentLangBtn) return;
    
    const flagImg = currentLangBtn.querySelector('img');
    const langSpan = currentLangBtn.querySelector('span');
    
    if (flagImg) flagImg.src = lang.flag;
    if (flagImg) flagImg.alt = lang.name;
    if (langSpan) langSpan.textContent = lang.code.toUpperCase();
}

/**
 * Traduce todos los textos de la página
 * @param {Object} lang - Configuración del idioma
 */
function translatePage(lang) {
    // Traducir elementos con atributos data-es y data-pt
    document.querySelectorAll('[data-es]').forEach(element => {
        if (element.dataset[lang.code]) {
            const translation = element.dataset[lang.code];
            
            // Elementos de entrada (input, textarea)
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = translation;
                element.placeholder = translation;
            } 
            // Elementos de precio (manejados separadamente)
            else if (element.hasAttribute('data-price')) {
                // Los precios se manejan en updatePrices()
                return;
            }
            // Otros elementos (p, span, h1, h2, h3, h4, a, button, etc.)
            else {
                element.textContent = translation;
            }
        }
    });
    
    // Traducir atributos como placeholder, title, alt
    document.querySelectorAll('[data-es-placeholder]').forEach(element => {
        if (element.dataset[`${lang.code}-placeholder`]) {
            element.placeholder = element.dataset[`${lang.code}-placeholder`];
        }
    });
    
    document.querySelectorAll('[data-es-title]').forEach(element => {
        if (element.dataset[`${lang.code}-title`]) {
            element.title = element.dataset[`${lang.code}-title`];
        }
    });
    
    document.querySelectorAll('[data-es-alt]').forEach(element => {
        if (element.dataset[`${lang.code}-alt`]) {
            element.alt = element.dataset[`${lang.code}-alt`];
        }
    });
}

/**
 * Actualiza los precios según la moneda del idioma
 * @param {Object} lang - Configuración del idioma
 */
function updatePrices(lang) {
    // Actualizar precios de productos
    document.querySelectorAll('.product-price').forEach(priceElement => {
        const priceValue = priceElement.getAttribute('data-price');
        if (priceValue && lang.prices[priceValue]) {
            priceElement.textContent = lang.prices[priceValue];
        }
    });
    
    // Actualizar precios destacados
    document.querySelectorAll('.featured-price').forEach(priceElement => {
        const priceValue = priceElement.getAttribute('data-price');
        if (priceValue && lang.prices[priceValue]) {
            priceElement.textContent = lang.prices[priceValue];
        }
    });
    
    // Actualizar otros elementos con atributo data-price
    document.querySelectorAll('[data-price]').forEach(element => {
        if (!element.classList.contains('product-price') && 
            !element.classList.contains('featured-price')) {
            const priceValue = element.getAttribute('data-price');
            if (priceValue && lang.prices[priceValue]) {
                element.textContent = lang.prices[priceValue];
            }
        }
    });
}

// ============================================
// CONFIGURACIÓN DEL SELECTOR DE IDIOMA
// ============================================

/**
 * Configura el selector de idioma con eventos
 */
function setupLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (!languageSelector) {
        console.error('No se encontró el selector de idioma');
        return;
    }
    
    // Mostrar/ocultar dropdown al hacer clic en el botón principal
    const currentLangBtn = document.getElementById('current-language');
    const languageDropdown = document.querySelector('.language-dropdown');
    
    if (currentLangBtn && languageDropdown) {
        currentLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = languageDropdown.style.visibility === 'visible';
            
            if (isVisible) {
                hideLanguageDropdown();
            } else {
                showLanguageDropdown();
            }
        });
    }
    
    // Configurar eventos para las opciones de idioma
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const langCode = this.getAttribute('data-lang');
            changeLanguage(langCode);
            hideLanguageDropdown();
        });
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', () => {
        hideLanguageDropdown();
    });
    
    // Prevenir que el dropdown se cierre al hacer clic dentro
    if (languageDropdown) {
        languageDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

/**
 * Muestra el dropdown de idiomas
 */
function showLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown) {
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(5px)';
    }
}

/**
 * Oculta el dropdown de idiomas
 */
function hideLanguageDropdown() {
    const dropdown = document.querySelector('.language-dropdown');
    if (dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-10px)';
    }
}

// ============================================
// FUNCIONES PARA TEMA CLARO/OSCURO
// ============================================

/**
 * Cambia entre tema claro y oscuro
 */
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!body || !themeToggle || !themeIcon) return;
    
    // Cambiar clase del body
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
    
    updateRGBVariables();
}

/**
 * Carga el tema guardado en localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!body || !themeToggle || !themeIcon) return;
    
    if (savedTheme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
    
    updateRGBVariables();
}

/**
 * Actualiza variables CSS para modo oscuro
 */
function updateRGBVariables() {
    const body = document.body;
    
    if (body.classList.contains('dark-mode')) {
        document.documentElement.style.setProperty('--color-blanco-rgb', '26, 26, 26');
    } else {
        document.documentElement.style.setProperty('--color-blanco-rgb', '255, 255, 255');
    }
}

// ============================================
// FUNCIONES PARA EL MENÚ MÓVIL
// ============================================

/**
 * Configura el menú móvil
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    
    if (!mobileMenuBtn || !mainNav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = mainNav.classList.contains('active');
        const icon = mobileMenuBtn.querySelector('i');
        
        if (isActive) {
            mainNav.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            mainNav.classList.add('active');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ============================================
// FUNCIONES PARA SCROLL SUAVE
// ============================================

/**
 * Configura el scroll suave a las secciones
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// FUNCIONES PARA EFECTOS DEL HEADER
// ============================================

/**
 * Configura el efecto del header al hacer scroll
 */
function setupHeaderScrollEffect() {
    const header = document.querySelector('header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = 'var(--sombra-fuerte)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.backgroundColor = 'rgba(var(--color-blanco-rgb), 0.95)';
        } else {
            header.style.boxShadow = 'var(--sombra-suave)';
            header.style.backdropFilter = 'none';
            header.style.backgroundColor = 'var(--color-blanco)';
        }
    });
}

// ============================================
// CARGA DEL IDIOMA GUARDADO
// ============================================

/**
 * Carga el idioma guardado en localStorage
 */
function loadLanguage() {
    const savedLanguage = localStorage.getItem('language') || 'es';
    changeLanguage(savedLanguage);
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

/**
 * Inicializa todas las funcionalidades cuando el DOM esté cargado
 */
function initApp() {
    console.log('Inicializando aplicación MODAS ALIDEL...');
    
    // 1. Cargar configuración de tema
    loadTheme();
    
    // 2. Configurar botón de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 3. Cargar idioma guardado
    loadLanguage();
    
    // 4. Configurar selector de idioma
    setupLanguageSelector();
    
    // 5. Configurar menú móvil
    setupMobileMenu();
    
    // 6. Configurar scroll suave
    setupSmoothScroll();
    
    // 7. Configurar efecto del header
    setupHeaderScrollEffect();
    
    // 8. Configurar observador para cambios de tema
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateRGBVariables();
            }
        });
    });
    
    observer.observe(document.body, { attributes: true });
    
    // 9. Asegurar que las variables CSS estén inicializadas
    document.documentElement.style.setProperty('--color-blanco-rgb', '255, 255, 255');
    
    console.log('Aplicación inicializada correctamente');
}

// ============================================
// EJECUCIÓN AL CARGAR LA PÁGINA
// ============================================

// Inicializar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Hacer funciones disponibles globalmente para depuración
window.changeLanguage = changeLanguage;
window.toggleTheme = toggleTheme;