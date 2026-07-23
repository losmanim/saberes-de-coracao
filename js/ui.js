function mostrarAtalhos() {
    document.getElementById('modalTitulo').textContent = '⌨️ Atalhos do Teclado';
    $(document.getElementById('modalContent'), `
        <div class="atalhos-grid">
            <div class="atalhos-item"><span class="atalhos-key">?</span> Mostrar atalhos</div>
            <div class="atalhos-item"><span class="atalhos-key">Esc</span> Fechar modal</div>
            <div class="atalhos-item"><span class="atalhos-key">Espaço</span> Tocar/Pausar mídia</div>
            <div class="atalhos-item"><span class="atalhos-key">P</span> Faixa anterior</div>
            <div class="atalhos-item"><span class="atalhos-key">N</span> Próxima faixa</div>
            <div class="atalhos-item"><span class="atalhos-key">M</span> Mudo</div>
            <div class="atalhos-item"><span class="atalhos-key">/</span> Focar busca</div>
            <div class="atalhos-item"><span class="atalhos-key">D</span> Saber aleatório</div>
            <div class="atalhos-item"><span class="atalhos-key">T</span> Alternar tema</div>
        </div>
        <p style="margin-top:1rem;font-size:0.8rem;color:var(--cor-texto-sec)">Atalhos funcionam quando nenhum input está focado.</p>`);
    abrirModal();
}

function toggleBusca() {
    const container = document.getElementById('buscaContainer');
    const isVisible = container.style.display !== 'none';
    container.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) document.getElementById('buscaInput').focus();
}

function saberAleatorio() {
    if (!dados || !dados.saberes || dados.saberes.length === 0) return;
    const saberesPrincipais = dados.saberes.filter(s => s.categoria_id !== CAT_APOCRIFOS);
    if (saberesPrincipais.length === 0) return;
    const idx = Math.floor(Math.random() * saberesPrincipais.length);
    abrirSaber(saberesPrincipais[idx].id);
}

let readingRAF = null;

function atualizarProgressoLeitura() {
    const bar = document.getElementById('readingProgressBar');
    if (!bar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
    bar.style.width = pct + '%';
}

window.addEventListener('scroll', () => {
    if (readingRAF) cancelAnimationFrame(readingRAF);
    readingRAF = requestAnimationFrame(atualizarProgressoLeitura);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

function observarReveal() {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function aplicarReveal() {
    const cards = document.querySelectorAll('.cards-grid .card, .midia-grid .midia-card');
    cards.forEach((card, i) => {
        card.classList.add('reveal');
        if (i < 5) card.classList.add('reveal-delay-' + (i + 1));
    });
    observarReveal();
}

function abrirModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) return;
    ultimoElementoFocado = document.activeElement;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        const modal = this.querySelector('.modal');
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
}

function fecharModal(e) {
    if (e.target && e.target.id === 'modalOverlay') fecharModalBtn();
}

function fecharModalBtn() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (ultimoElementoFocado) ultimoElementoFocado.focus();
}

document.addEventListener('click', function (e) {
  try {
    if (e.target.closest('#readerBackBtn')) { fecharLeitor(); return; }
    if (e.target.closest('#readerPrevBtn')) { navegarSaber(-1); return; }
    if (e.target.closest('#readerNextBtn')) { navegarSaber(1); return; }
    const next = e.target.closest('[data-next-saber]');
    if (next) { abrirSaber(next.dataset.nextSaber); return; }
    const card = e.target.closest('[data-saber-id]');
    if (card) {
      const id = card.dataset.saberId;
      if (e.target.closest('.card-fav')) {
        const btn = e.target.closest('.card-fav');
        toggleFavorito(id, e);
        btn.textContent = isFavorito(id) ? '❤️' : '🤍';
        btn.classList.toggle('active', isFavorito(id));
        return;
      }
      abrirSaber(id);
      return;
    }
    const midia = e.target.closest('[data-midia-tipo]');
    if (midia) { abrirMidia(midia.dataset.midiaTipo, midia.dataset.midiaId); return; }
    const share = e.target.closest('[data-compartilhar]');
    if (share) { compartilharSaber(share.dataset.compartilhar); return; }
    const favModal = e.target.closest('[data-fav-id]');
    if (favModal) {
      const id = favModal.dataset.favId;
      toggleFavorito(id, e);
      favModal.textContent = isFavorito(id) ? '❤️ Favoritado' : '🤍 Favoritar';
      return;
    }
    const relac = e.target.closest('.tag-relacionado');
    if (relac) { fecharLeitor(); abrirSaber(relac.dataset.saberId); return; }
    const action = e.target.closest('[data-action]');
    if (action) {
      const a = action.dataset.action;
      if (a === 'logout') { logout(); return; }
      if (a === 'close-login') {
        const c = document.getElementById('loginContainer');
        if (c) c.style.display = 'none';
        return;
      }
      if (a === 'close-admin') {
        const c = document.getElementById('adminContainer');
        if (c) c.style.display = 'none';
        return;
      }
    }
  } catch (erro) { tratarErro(erro, 'Navegação'); }
});

document.addEventListener('keydown', function (e) {
  const next = e.target.closest('[data-next-saber]');
  if (next && e.key === 'Enter') {
    fecharModalBtn();
    setTimeout(() => abrirSaber(next.dataset.nextSaber), 300);
    e.preventDefault();
    return;
  }
  const card = e.target.closest('[data-saber-id]');
  if (card && e.key === 'Enter') {
    if (e.target.closest('.card-fav')) return;
    abrirSaber(card.dataset.saberId);
    return;
  }
  const midia = e.target.closest('[data-midia-tipo]');
  if (midia && e.key === 'Enter') {
    abrirMidia(midia.dataset.midiaTipo, midia.dataset.midiaId);
    return;
  }
});

document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'Escape') {
        const reader = document.getElementById('readerOverlay');
        if (reader && reader.classList.contains('active')) { fecharLeitor(); return; }
        fecharModalBtn();
        return;
    }
    if (e.key === 'ArrowLeft') { navegarSaber(-1); return; }
    if (e.key === 'ArrowRight') { navegarSaber(1); return; }
    if (e.key === '?') { e.preventDefault(); mostrarAtalhos(); return; }
    if (e.key === '/') { e.preventDefault(); toggleBusca(); return; }
    if (e.key === 'd' || e.key === 'D') { e.preventDefault(); saberAleatorio(); return; }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTema(); return; }
});

window.addEventListener('DOMContentLoaded', async () => {
    if (typeof Player !== 'undefined' && Player.init) Player.init();
    if (localStorage.getItem('tema') === 'claro') document.body.classList.add('modo-claro');
    async function carregarMidiaConfig() {
        try {
            const res = await fetch('/api/midia-config');
            const cfg = await res.json();
            window.midiaBaseUrl = cfg.baseUrl.replace(/\/$/, '');
        } catch (e) {
            window.midiaBaseUrl = 'midia';
        }
    }
    await carregarMidiaConfig();
    observarReveal();
    carregarDados().then(() => {
        if (typeof Player !== 'undefined' && Player.restoreState) Player.restoreState();
        saberDoDia();
        mostrarContinueLendo();
    });
    const buscaInput = document.getElementById('buscaInput');
    if (buscaInput) {
        const debouncedBusca = Utils.debounce(function() {
            buscarSaberes(this.value);
        }, 250);
        buscaInput.addEventListener('input', debouncedBusca);
    }
});

window.addEventListener('beforeunload', () => { if (typeof Player !== 'undefined') Player.saveState(); });
window.addEventListener('pagehide', () => { if (typeof Player !== 'undefined') Player.saveState(); });

window.mudarPagina = mudarPagina;
window.fecharContinue = fecharContinue;
window.abrirSaber = abrirSaber;
window.fecharLeitor = fecharLeitor;
window.navegarSaber = navegarSaber;
window.fecharModal = fecharModal;
window.fecharModalBtn = fecharModalBtn;
window.filtrarCategoria = filtrarCategoria;
window.toggleFavorito = toggleFavorito;
window.compartilharSaber = compartilharSaber;
window.toggleBusca = toggleBusca;
window.buscarSaberes = buscarSaberes;
window.saberAleatorio = saberAleatorio;
window.mostrarAtalhos = mostrarAtalhos;
