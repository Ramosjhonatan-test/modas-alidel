// Función para cambiar entre modo claro y oscuro
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Cambiar clase del body
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        
        // Guardar preferencia en localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        
        // Guardar preferencia en localStorage
        localStorage.setItem('theme', 'light');
    }
}

// Función para cargar el tema guardado
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
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
}

// Menú móvil
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');
    
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        
        // Cambiar icono del botón
        const icon = mobileMenuBtn.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Efecto suave al hacer scroll a las secciones
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calcular posición considerando el header fijo
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Efecto de header al hacer scroll
function setupHeaderScrollEffect() {
    const header = document.querySelector('header');
    
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

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tema guardado
    loadTheme();
    
    // Configurar botón de tema
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Configurar menú móvil
    setupMobileMenu();
    
    // Configurar scroll suave
    setupSmoothScroll();
    
    // Configurar efecto de header al hacer scroll
    setupHeaderScrollEffect();
    
    // Añadir variables CSS para modo oscuro
    document.documentElement.style.setProperty('--color-blanco-rgb', '255, 255, 255');
});

// Actualizar variables RGB para modo oscuro
function updateRGBVariables() {
    const body = document.body;
    
    if (body.classList.contains('dark-mode')) {
        document.documentElement.style.setProperty('--color-blanco-rgb', '26, 26, 26');
    } else {
        document.documentElement.style.setProperty('--color-blanco-rgb', '255, 255, 255');
    }
}

// Actualizar variables cuando cambie el tema
document.addEventListener('DOMContentLoaded', function() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateRGBVariables();
            }
        });
    });
    
    observer.observe(document.body, { attributes: true });
    updateRGBVariables();
});