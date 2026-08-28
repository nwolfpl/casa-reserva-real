/* Rua Hortênsia Real, 2 — Reserva Real | Montes Claros/MG */
(function () {
  'use strict';

  var ZAP = '5531998264493';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var pct = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  /* ---------- nav condensada + barra móvel ---------- */
  var nav = $('#nav');
  var barra = $('#barra-movel');
  var limite = function () { return Math.min(window.innerHeight * 0.75, 640); };

  function aoRolar() {
    var y = window.scrollY;
    nav.classList.toggle('is-fixa', y > 40);
    barra.classList.toggle('is-visivel', y > limite());
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  /* ---------- revelação em scroll ---------- */
  var alvos = $$('.rev');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-vis'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('is-vis'); });
  }

  /* ---------- galeria: filtros ---------- */
  var fotos = $$('.foto');
  $$('.filtro').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.dataset.filtro;
      $$('.filtro').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      fotos.forEach(function (f) {
        f.hidden = !(cat === 'todas' || f.dataset.cat === cat);
      });
    });
  });

  /* ---------- galeria: lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbLeg = $('#lb-legenda'), lbCont = $('#lb-contador');
  var atual = 0;

  function visiveis() { return fotos.filter(function (f) { return !f.hidden; }); }

  function mostrar(i) {
    var lista = visiveis();
    if (!lista.length) return;
    atual = (i + lista.length) % lista.length;
    var alvo = lista[atual];
    var img = $('img', alvo);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbLeg.textContent = $('.foto__legenda', alvo).textContent;
    lbCont.textContent = (atual + 1) + ' / ' + lista.length;
  }

  fotos.forEach(function (f) {
    f.addEventListener('click', function () {
      mostrar(visiveis().indexOf(f));
      if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    });
  });

  function fechar() {
    if (typeof lb.close === 'function' && lb.open) lb.close(); else lb.removeAttribute('open');
    document.body.style.overflow = '';
  }
  $('#lb-fechar').addEventListener('click', fechar);
  $('#lb-ant').addEventListener('click', function () { mostrar(atual - 1); });
  $('#lb-prox').addEventListener('click', function () { mostrar(atual + 1); });
  lb.addEventListener('close', function () { document.body.style.overflow = ''; });
  lb.addEventListener('click', function (e) { if (e.target === lb) fechar(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.open) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); mostrar(atual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(atual + 1); }
  });

  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var d = e.changedTouches[0].clientX - x0;
    if (Math.abs(d) > 45) mostrar(atual + (d < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  /* ---------- corte esquemático: isolar um sistema ---------- */
  var corte = $('#corte');
  var focado = null;
  $$('#legenda button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.fluxo;
      focado = (focado === f) ? null : f;
      corte.classList.toggle('tem-foco', focado !== null);
      $$('.fluxo', corte).forEach(function (g) {
        g.classList.toggle('is-ativo', g.dataset.fluxo === focado);
      });
      $$('#legenda button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.fluxo === focado));
      });
    });
  });

  /* ---------- simulador de financiamento ---------- */
  var sim = $('#sim');
  if (sim) {
    var sistema = 'SAC';
    var campos = { valor: $('#valor'), entrada: $('#entrada'), prazo: $('#prazo'), taxa: $('#taxa') };

    $$('.sistema-tabs button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sistema = btn.dataset.sistema;
        $$('.sistema-tabs button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        calcular();
      });
    });

    function calcular() {
      var valor   = +campos.valor.value;
      var pctEnt  = +campos.entrada.value;
      var anos    = +campos.prazo.value;
      var taxaAno = +campos.taxa.value;

      var entrada    = valor * pctEnt / 100;
      var financiado = valor - entrada;
      var n = anos * 12;
      var i = Math.pow(1 + taxaAno / 100, 1 / 12) - 1;

      var primeira, ultima, total;
      if (sistema === 'SAC') {
        var amort = financiado / n;
        primeira = amort + financiado * i;
        ultima   = amort * (1 + i);
        total    = amort * n + i * financiado * (n + 1) / 2;
        $('#rot-parcela').textContent = 'Primeira parcela';
      } else {
        var pmt = i === 0 ? financiado / n : financiado * i / (1 - Math.pow(1 + i, -n));
        primeira = ultima = pmt;
        total    = pmt * n;
        $('#rot-parcela').textContent = 'Parcela fixa';
      }

      $('#valor-out').textContent   = brl.format(valor);
      $('#entrada-out').textContent = pctEnt + '% · ' + brl.format(entrada);
      $('#prazo-out').textContent   = anos + (anos === 1 ? ' ano' : ' anos');
      $('#taxa-out').textContent    = pct.format(taxaAno) + '%';

      $('#r-primeira').textContent   = brl.format(primeira);
      $('#r-financiado').textContent = brl.format(financiado);
      $('#r-entrada').textContent    = brl.format(entrada);
      $('#r-ultima').textContent     = brl.format(ultima);
      $('#r-total').textContent      = brl.format(total);
      $('#r-parcelas').textContent   = n + 'x';

      var texto = 'Olá! Simulei o financiamento da casa da Rua Hortênsia Real, 2 — Reserva Real:\n\n'
        + '• Valor considerado: ' + brl.format(valor) + '\n'
        + '• Entrada: ' + pctEnt + '% (' + brl.format(entrada) + ')\n'
        + '• Financiado: ' + brl.format(financiado) + ' em ' + n + 'x (' + sistema + ')\n'
        + '• ' + (sistema === 'SAC' ? 'Primeira parcela' : 'Parcela') + ': ' + brl.format(primeira) + '\n\n'
        + 'Podemos agendar uma visita?';
      $('#zap-sim').href = 'https://wa.me/' + ZAP + '?text=' + encodeURIComponent(texto);
    }

    Object.keys(campos).forEach(function (k) {
      campos[k].addEventListener('input', calcular);
    });
    calcular();
    sim.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ---------- formulário → WhatsApp ---------- */
  var form = $('#form-contato');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = $('#f-nome').value.trim();
      var fone = $('#f-fone').value.trim();
      var msg  = $('#f-msg').value.trim();

      if (!nome) { $('#f-nome').focus(); return; }

      var texto = 'Olá! Meu nome é ' + nome + '.\n'
        + 'Vi o anúncio da casa na Rua Hortênsia Real, 2 — Reserva Real (Montes Claros/MG).\n'
        + (fone ? 'Meu contato: ' + fone + '\n' : '')
        + (msg ? 'Melhor horário para visita: ' + msg + '\n' : '')
        + '\nGostaria de saber o valor e agendar uma visita.';
      window.open('https://wa.me/' + ZAP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  /* ---------- copiar link ---------- */
  var copiar = $('#copiar');
  if (copiar) {
    copiar.addEventListener('click', function () {
      var url = window.location.href;
      var ok = function () {
        var antes = copiar.textContent;
        copiar.textContent = 'Link copiado';
        setTimeout(function () { copiar.textContent = antes; }, 2200);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(ok, function () {});
      } else {
        var t = document.createElement('textarea');
        t.value = url; t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); ok(); } catch (err) {}
        document.body.removeChild(t);
      }
    });
  }
})();
