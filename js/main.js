// js/main.js
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar funcionalidades
    initNavigation();
    initContactForm();
    initAnimations();
    initScrollEffects();
    initServicesDropdown();
});

// ===== NAVEGACIÓN Y MENÚ DESPLEGABLE =====
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Menú hamburguesa
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navMenu.classList.toggle('show');

            // Cerrar menú desplegable si está abierto
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        });
    }

    // Cerrar menú al hacer clic en enlace (móvil)
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // No cerrar si es el enlace de servicios (maneja dropdown)
            if (this.classList.contains('has-dropdown')) {
                e.preventDefault();
                return;
            }

            if (navMenu.classList.contains('show')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('show');
            }
        });
    });
}

// ===== MENÚ DESPLEGABLE DE SERVICIOS =====
function initServicesDropdown() {
    const servicesLink = document.querySelector('.nav-link.has-dropdown');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (servicesLink && dropdownMenu) {
        let isTouchDevice = 'ontouchstart' in window;

        if (isTouchDevice) {
            // Para dispositivos táctiles (móviles/tablets)
            servicesLink.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
        } else {
            // Para desktop (hover)
            servicesLink.addEventListener('mouseenter', function () {
                dropdownMenu.classList.add('show');
            });

            servicesLink.addEventListener('mouseleave', function () {
                setTimeout(() => {
                    if (!dropdownMenu.matches(':hover')) {
                        dropdownMenu.classList.remove('show');
                    }
                }, 100);
            });

            dropdownMenu.addEventListener('mouseenter', function () {
                this.classList.add('show');
            });

            dropdownMenu.addEventListener('mouseleave', function () {
                this.classList.remove('show');
            });
        }

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!servicesLink.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });

        // Cerrar dropdown al hacer scroll (solo en móvil)
        window.addEventListener('scroll', function () {
            if (window.innerWidth <= 768) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// ===== CAMBIO DE COLOR DEL HEADER AL SCROLL =====
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Header al hacer scroll
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Simular envío
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Mostrar mensaje de éxito
            submitBtn.textContent = '¡Mensaje Enviado!';
            submitBtn.classList.add('success');

            // Resetear después de 3 segundos
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('success');
                contactForm.reset();

                // Mostrar mensaje de agradecimiento
                showNotification('¡Gracias por tu mensaje! Te contactaremos pronto.');
            }, 3000);
        }, 1500);
    });
}

// ===== ANIMACIONES =====
function initAnimations() {
    // Contadores animados
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length > 0) {
        animateCounters();
    }

    // Animaciones al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observar elementos animables
    document.querySelectorAll('.fade-in-up, .scale-in, .slide-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== FUNCIONES AUXILIARES =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (target > 3 ? '+' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (current >= target ? '+' : '');
            }
        }, 20);
    });
}

function showNotification(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Agregar al body
    document.body.appendChild(notification);

    // Mostrar
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Ocultar después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Estilos para notificaciones
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-500);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    transform: translateX(150%);
    transition: transform 0.3s ease;
    z-index: 9999;
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    background: var(--color-500);
}

.notification.error {
    background: #e74c3c;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-content i {
    font-size: 1.2rem;
}
`;
document.head.appendChild(style);