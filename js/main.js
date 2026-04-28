/* =============================================================
   INTIS - main.js  |  v1.0
   Datos de empresa configurables — editar antes de publicar
   ============================================================= */

// ─── Datos de la empresa (personalizar antes de publicar) ──────────────────────
const COMPANY = {
    name:      'INTIS',
    fullName:  'Innovación en Tecnologías de Información y Soluciones Empresariales',
    email:     'contacto@intis.pe',        // ← cambiar correo real
    phone:     '+51 999 999 999',          // ← cambiar teléfono real
    whatsapp:  '51999999999',              // ← número sin + ni espacios (código país + número)
    city:      'Cajamarca, Perú',
    domain:    'https://www.intis.pe'      // ← cambiar dominio real
};

// ─── Copyright dinámico ────────────────────────────────────────────────────────
(function setCopyrightYear() {
    const els = document.querySelectorAll('#copyright-year');
    const year = new Date().getFullYear();
    els.forEach(el => { el.textContent = year; });
})();

// ─── Inyectar datos de empresa en elementos marcados ──────────────────────────
(function injectCompanyData() {
    document.querySelectorAll('[data-company-email]').forEach(el => {
        el.textContent = COMPANY.email;
        if (el.tagName === 'A') el.href = `mailto:${COMPANY.email}`;
    });
    document.querySelectorAll('[data-company-phone]').forEach(el => {
        el.textContent = COMPANY.phone;
    });
    document.querySelectorAll('[data-company-whatsapp]').forEach(el => {
        el.href = `https://wa.me/${COMPANY.whatsapp}`;
    });
})();

// ─── Navbar scroll effect ──────────────────────────────────────────────────────
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ─── Mobile nav toggle ─────────────────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        const spans = navToggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        }
    });

    // Cerrar menú al hacer clic en un enlace
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity   = '';
            spans[2].style.transform = '';
        });
    });
}

// ─── Active nav link on scroll ─────────────────────────────────────────────────
(function initActiveNav() {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
})();

// ─── Scroll-reveal (Intersection Observer) ─────────────────────────────────────
(function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach((el, i) => {
        el.dataset.delay = String((i % 4) * 100);
        observer.observe(el);
    });
})();

// ─── Back-to-top button ────────────────────────────────────────────────────────
(function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ─── Contact form (visual / estático — conectar a API backend después) ─────────
(function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn     = form.querySelector('button[type="submit"]');
    const successMsg    = form.querySelector('.form__success');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const data = {
            nombre:   form.nombre  ? form.nombre.value.trim()   : '',
            empresa:  form.empresa ? form.empresa.value.trim()  : '',
            correo:   form.correo  ? form.correo.value.trim()   : '',
            telefono: form.telefono? form.telefono.value.trim() : '',
            servicio: form.servicio? form.servicio.value        : '',
            mensaje:  form.mensaje ? form.mensaje.value.trim()  : ''
        };

        // Validación básica
        if (!data.nombre || !data.correo || !data.mensaje) {
            alert('Por favor complete los campos obligatorios: nombre, correo y mensaje.');
            return;
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(data.correo)) {
            alert('Por favor ingrese un correo electrónico válido.');
            return;
        }

        /*
         * TODO: Reemplazar el bloque siguiente con una llamada real a su API,
         * por ejemplo con fetch():
         *
         * submitBtn.disabled = true;
         * submitBtn.textContent = 'Enviando...';
         * fetch('/api/contacto', {
         *   method: 'POST',
         *   headers: { 'Content-Type': 'application/json' },
         *   body: JSON.stringify(data)
         * })
         * .then(r => r.json())
         * .then(() => { showSuccess(); })
         * .catch(() => { alert('Error al enviar. Intente de nuevo.'); })
         * .finally(() => { submitBtn.disabled = false; });
         */

        // Simulación visual (remover cuando integre backend real)
        submitBtn.disabled = true;
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled  = false;
            if (successMsg) {
                successMsg.style.display = 'block';
                setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
            }
        }, 1500);
    });
})();
