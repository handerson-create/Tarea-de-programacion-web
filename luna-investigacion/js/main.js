/* =============================================
   VIAJES A LA LUNA — Investigación
   main.js
   ============================================= */

/* ===== 1. ESTRELLAS GENERATIVAS ===== */
(function generarEstrellas() {
  const container = document.getElementById('stars');
  if (!container) return;

  for (let i = 0; i < 220; i++) {
    const s       = document.createElement('div');
    s.className   = 'star';
    const size    = (Math.random() * 2.2 + 0.4).toFixed(1);
    const minOp   = (Math.random() * 0.3 + 0.08).toFixed(2);
    const dur     = (Math.random() * 4 + 2).toFixed(1);
    const delay   = (Math.random() * 6).toFixed(1);
    s.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${(Math.random() * 100).toFixed(2)}%`,
      `top:${(Math.random() * 100).toFixed(2)}%`,
      `--min-op:${minOp}`,
      `--dur:${dur}s`,
      `animation-delay:${delay}s`
    ].join(';');
    container.appendChild(s);
  }
})();


/* ===== 2. EFECTO BRILLO RADIAL EN CARDS ===== */
document.querySelectorAll('.mision-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--mx');
    card.style.removeProperty('--my');
  });
});


/* ===== 3. NAVEGACIÓN DIRECCIONAL ===== */
(function navegacion() {

  /* Secciones en orden de aparición */
  const anclas = [
    { id: 'hero',     label: 'Inicio'         },
    { id: 'sec-01',   label: '§01 · Introducción'  },
    { id: 'sec-02',   label: '§02 · Datos clave'   },
    { id: 'sec-03',   label: '§03 · Historia'       },
    { id: 'sec-04',   label: '§04 · Apolo'          },
    { id: 'sec-05',   label: '§05 · Artemis'        },
    { id: 'sec-06',   label: '§06 · Misiones'       },
    { id: 'sec-07',   label: '§07 · Desafíos'       },
    { id: 'sec-08',   label: '§08 · Conclusiones'   },
  ];

  /* Asignar IDs dinámicamente */
  document.querySelector('.hero').id = 'hero';
  document.querySelectorAll('main section').forEach((sec, i) => {
    sec.id = `sec-0${i + 1}`;
  });

  /* Referencias DOM */
  const puntosWrap = document.getElementById('navPuntos');
  const tooltip    = document.getElementById('navTooltip');
  const btnUp      = document.getElementById('btnArriba');
  const btnDown    = document.getElementById('btnAbajo');
  const btnHome    = document.getElementById('btnHome');

  let actual = 0;

  /* Crear puntos */
  anclas.forEach((a, i) => {
    const p       = document.createElement('div');
    p.className   = 'nav-punto' + (i === 0 ? ' activo' : '');
    p.title       = a.label;
    p.setAttribute('aria-label', a.label);
    p.addEventListener('click', () => irA(i));
    puntosWrap.appendChild(p);
  });

  function irA(idx) {
    idx = Math.max(0, Math.min(anclas.length - 1, idx));
    const el = document.getElementById(anclas[idx].id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    actualizar(idx);
  }

  function actualizar(idx) {
    actual = idx;
    if (tooltip) tooltip.textContent = anclas[idx].label;

    document.querySelectorAll('.nav-punto').forEach((p, i) => {
      p.classList.toggle('activo', i === idx);
    });

    if (btnUp)   btnUp.disabled   = idx === 0;
    if (btnDown) btnDown.disabled = idx === anclas.length - 1;
  }

  if (btnUp)   btnUp.addEventListener('click',   () => irA(actual - 1));
  if (btnDown) btnDown.addEventListener('click',  () => irA(actual + 1));
  if (btnHome) btnHome.addEventListener('click',  () => irA(0));

  /* Teclas ↑ ↓ Home */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); irA(actual + 1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); irA(actual - 1); }
    if (e.key === 'Home')      { e.preventDefault(); irA(0); }
  });

  /* Observer — actualiza punto al hacer scroll manual */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = anclas.findIndex(a => a.id === entry.target.id);
        if (idx !== -1) actualizar(idx);
      }
    });
  }, { threshold: 0.4 });

  anclas.forEach(a => {
    const el = document.getElementById(a.id);
    if (el) observer.observe(el);
  });

  actualizar(0);
})();
