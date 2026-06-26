// ===================================================
//  JA PC – script.js
// ===================================================

/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- VALIDACIÓN Y ENVÍO A WHATSAPP ---------- */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// ⚠️ CAMBIÁ este número por el tuyo (código de país sin + ni espacios)
// Ejemplo Argentina: 549 + número sin el 0 inicial → 5493812345678
const WHATSAPP_NUMBER = '5493885823375';

const fields = {
  nombre:   { el: document.getElementById('nombre'),   err: document.getElementById('error-nombre') },
  telefono: { el: document.getElementById('telefono'), err: document.getElementById('error-telefono') },
  problema: { el: document.getElementById('problema'), err: document.getElementById('error-problema') },
};

function validate() {
  let valid = true;

  const nombre = fields.nombre.el.value.trim();
  if (!nombre) {
    showError(fields.nombre, 'Por favor ingresá tu nombre completo.');
    valid = false;
  } else if (nombre.length < 3) {
    showError(fields.nombre, 'El nombre debe tener al menos 3 caracteres.');
    valid = false;
  } else {
    clearError(fields.nombre);
  }

  const telefono = fields.telefono.el.value.trim();
  const telefonoRegex = /^[\d\s\+\-\(\)]{7,20}$/;
  if (!telefono) {
    showError(fields.telefono, 'Por favor ingresá tu número de teléfono.');
    valid = false;
  } else if (!telefonoRegex.test(telefono)) {
    showError(fields.telefono, 'Ingresá un número de teléfono válido.');
    valid = false;
  } else {
    clearError(fields.telefono);
  }

  const problema = fields.problema.el.value.trim();
  if (!problema) {
    showError(fields.problema, 'Por favor describí el problema de tu equipo.');
    valid = false;
  } else if (problema.length < 15) {
    showError(fields.problema, 'Agregá un poco más de detalle (mínimo 15 caracteres).');
    valid = false;
  } else {
    clearError(fields.problema);
  }

  return valid;
}

function showError(field, msg) {
  field.el.classList.add('invalid');
  field.err.textContent = msg;
}

function clearError(field) {
  field.el.classList.remove('invalid');
  field.err.textContent = '';
}

Object.values(fields).forEach(field => {
  field.el.addEventListener('input', () => {
    if (field.el.classList.contains('invalid')) {
      if (field.el.value.trim().length > 0) clearError(field);
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validate()) return;

  const nombre   = fields.nombre.el.value.trim();
  const telefono = fields.telefono.el.value.trim();
  const problema = fields.problema.el.value.trim();

  const mensaje =
`¡Hola! Me comunico desde la página web de *JA PC*. 🖥️

*Nombre:* ${nombre}
*Teléfono de contacto:* ${telefono}

*Problema o consulta:*
${problema}

Quedo a la espera de su respuesta. ¡Muchas gracias!`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeCodificado}`;

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Abriendo WhatsApp…';
  submitBtn.disabled = true;

  formSuccess.style.display = 'block';

  setTimeout(() => {
    window.open(url, '_blank');
    form.reset();
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.154 1.523 5.927L.057 23.882a.5.5 0 0 0 .611.611l5.955-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 0 1-5.006-1.374l-.359-.214-3.532.869.884-3.438-.234-.374A9.789 9.789 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
      </svg>
      Enviar por WhatsApp`;
    submitBtn.disabled = false;

    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
  }, 900);
});

/* ---------- SCROLL ACTIVO EN NAVBAR ---------- */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');

const observerOptions = {
  rootMargin: '-30% 0px -60% 0px',
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

/* ---------- ANIMACIÓN DE ENTRADA (scroll reveal) ---------- */
const revealElements = document.querySelectorAll(
  '.service-card, .about-card, .form-wrapper, .upgrade-inner, .about-description'
);

const styleReveal = document.createElement('style');
styleReveal.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(styleReveal);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});