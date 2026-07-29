/* ═══════════════════════════════════════════════════════
   LUANZZO FITNESS

   ►► TROQUE AQUI O NÚMERO DO WHATSAPP ◄◄
   Formato: 55 + DDD + número, só dígitos, sem espaço nem traço.
   Ex.: (11) 98888-7777  →  '5511988887777'
   ═══════════════════════════════════════════════════════ */
const WHATSAPP = '5511999999999';

/* Monta todos os links de WhatsApp da página.
   Cada elemento .js-whatsapp leva sua própria mensagem em data-msg. */
document.querySelectorAll('.js-whatsapp').forEach(el => {
  const msg = el.dataset.msg || 'Olá! Vim pelo site da Luanzzo Fitness.';
  el.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  el.target = '_blank';
  el.rel = 'noopener';
});

/* Ano no rodapé */
document.getElementById('ano').textContent = new Date().getFullYear();

/* ═══ Carrossel do topo ═══
   Troca sozinho a cada 5s. Pausa quando o mouse está em cima,
   quando a aba perde o foco e quando o usuário arrasta o dedo. */
const carrossel = document.getElementById('carrossel');
if (carrossel) {
  const slides = [...carrossel.querySelectorAll('.slide')];
  const bolinhas = carrossel.querySelector('.carrossel__bolinhas');
  const INTERVALO = 5000;
  let atual = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'carrossel__bolinha' + (i === 0 ? ' is-on' : '');
    b.setAttribute('aria-label', `Foto ${i + 1} de ${slides.length}`);
    b.addEventListener('click', () => { ir(i); reiniciar(); });
    bolinhas.appendChild(b);
  });
  const pontos = [...bolinhas.children];

  function ir(i) {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-on', n === atual));
    pontos.forEach((p, n) => p.classList.toggle('is-on', n === atual));
  }

  const reiniciar = () => { parar(); iniciar(); };
  const parar = () => { clearInterval(timer); timer = null; };
  function iniciar() {
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(() => ir(atual + 1), INTERVALO);
  }

  carrossel.querySelector('.carrossel__seta--ant')
    .addEventListener('click', () => { ir(atual - 1); reiniciar(); });
  carrossel.querySelector('.carrossel__seta--prox')
    .addEventListener('click', () => { ir(atual + 1); reiniciar(); });

  carrossel.addEventListener('mouseenter', parar);
  carrossel.addEventListener('mouseleave', iniciar);
  document.addEventListener('visibilitychange', () => document.hidden ? parar() : iniciar());

  /* arrastar com o dedo no celular */
  let xInicial = null;
  carrossel.addEventListener('touchstart', e => { xInicial = e.touches[0].clientX; parar(); }, { passive: true });
  carrossel.addEventListener('touchend', e => {
    if (xInicial === null) return;
    const dx = e.changedTouches[0].clientX - xInicial;
    if (Math.abs(dx) > 40) ir(atual + (dx < 0 ? 1 : -1));
    xInicial = null;
    iniciar();
  }, { passive: true });

  iniciar();
}

/* Fecha as outras perguntas do FAQ ao abrir uma */
const faqs = document.querySelectorAll('.faq');
faqs.forEach(d => d.addEventListener('toggle', () => {
  if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
}));

/* Aparição suave das seções ao rolar */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const alvos = document.querySelectorAll('.card, .review, .gallery img, .split__media, .split__copy');
  alvos.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
  });
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
      }, i * 70);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  alvos.forEach(el => obs.observe(el));
}
