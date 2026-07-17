const CATEGORIA_RULES = [
  { id: 'gnosticos', label: 'Gnostico', icon: '🔮', match: t => t.tags.some(tag => ['gnostico','pistis-sophia','pistis','sophia','nag-hammadi'].includes(tag)) || /gnostico|pistis|sophia|valentino|felipe/i.test(t.titulo) },
  { id: 'apocalipticos', label: 'Apocaliptico', icon: '🔥', match: t => t.tags.includes('apocalipse') || t.tags.includes('enoch') || t.tags.includes('enoque') || /apocalipse|enoch|enoque/i.test(t.titulo) },
  { id: 'patriarcas', label: 'Patriarcas', icon: '🕊️', match: t => t.tags.includes('testamento') || /testamento.*(aser|benjamim|dan|gad|issacar|jose|juda|levi|ruben|zebulom|abraham|simeao|nephtali|moises)/i.test(t.titulo) || /patriarcas|adao e eva|jubileus|melquisedeque|asenath|caverna dos tesouros|diluvio|gilgamesh/i.test(t.titulo) },
  { id: 'infancia', label: 'Infancia de Jesus', icon: '👶', match: t => /infancia/i.test(t.titulo) || /pseudo-mateus|pseudo-tome|proto-evangelho|jose carpinteiro|passagem.*virgem.*maria/i.test(t.titulo) },
  { id: 'paixao', label: 'Paixao e Pilatos', icon: '⚖️', match: t => /pilatos|herodes|tiberio|vinganca|salvador|julgamento|condenacao|sentenca|declaracoes.*jose.*arimateia|nicodemus|descida.*cristo.*inferno/i.test(t.titulo) || t.tags.includes('carta') && /pilatos|herodes|tiberio/i.test(t.titulo) },
  { id: 'cartas', label: 'Cartas e Epistolas', icon: '✉️', match: t => t.tags.includes('carta') || t.tags.includes('epistola') || /carta|epistola|correspondencia|abgaro|clemente/i.test(t.titulo) },
  { id: 'oracoes', label: 'Oracoes e Salmos', icon: '🙏', match: t => t.tags.includes('oracao') || t.tags.includes('salmo') || /oracao|salmo|essenios/i.test(t.titulo) },
  { id: 'atos', label: 'Atos', icon: '📖', match: t => t.tags.includes('atos') || /atos.*(paulo|tecla|joao|pedro|tome)/i.test(t.titulo) },
  { id: 'patristica', label: 'Patristica', icon: '⛪', match: t => /didache|pastor.*hermas|aristeides|policarpo|discurso.*domingo|apologia|clemente|justino|taciano|inacio|didaque/i.test(t.titulo) && !t.tags.includes('carta') },
];

function categoriaInfo(texto) {
  for (const cat of CATEGORIA_RULES) {
    if (cat.match(texto)) return cat;
  }
  return { id: 'geral', label: 'Geral', icon: '📜' };
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('tema') === 'claro') document.body.classList.add('modo-claro');
  carregarDados().then(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => abrirAccordionPorId(id), 500);
    }
  });
});

function abrirAccordionPorId(id) {
  const header = document.querySelector(`.accordion-header[data-id="${id}"]`);
  if (!header) return;
  header.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => { if (!header.classList.contains('active')) header.click(); }, 300);
}

let apocrifos_dados = {};
let apocrifos_textos = [];
let apocrifos_categoria = 'all';
let apocrifos_fontScale = 100;
let ultimoElementoFocado = null;

async function carregarDados() {
  const container = document.getElementById('apocrifosContainer');
  
  // Wait for app.js to load data if not already loaded
  if (!dados) {
    const maxWait = 10000;
    const startTime = Date.now();
    while (!dados && Date.now() - startTime < maxWait) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  
  if (!dados || !dados.saberes) {
    try { mostrarToast('Erro ao carregar dados', 'erro'); } catch(e) {}
    container.innerHTML = window.DOMPurify ? DOMPurify.sanitize(`
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Erro ao carregar dados.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;color:var(--cor-texto-sec)">
          Dados não disponíveis<br>
          <small>Tente recarregar a página.</small>
        </p>
        <button onclick="location.reload()" class="pilar-btn" style="margin-top:1rem">🔄 Recarregar</button>
      </div>`) : `<div class="empty-state"><p>Erro ao carregar dados.</p></div>`;
    return;
  }
  
  apocrifos_textos = dados.saberes.filter(s => s.categoria_id === 6).map(s => {
    if (typeof s.tags === 'string') s.tags = s.tags.split(',').map(t => t.trim());
    if (!Array.isArray(s.tags)) s.tags = [];
    return s;
  });
  atualizarStats();
  renderizarBotoesCategoria();
  renderizarTextos(apocrifos_textos);
}

function atualizarStats() {
  const cats = new Set(apocrifos_textos.map(t => categoriaInfo(t).id));
  const totalChar = apocrifos_textos.reduce((s, t) => s + (t.conteudo?.texto_integral?.length || 0), 0);
  document.getElementById('statTextos').textContent = apocrifos_textos.length;
  document.getElementById('statCategoriasAp').textContent = cats.size;
  document.getElementById('statTextosTotal').textContent = apocrifos_textos.length;
  const pages = Math.max(1, Math.round(totalChar / 3000));
  document.getElementById('statPaginas').textContent = `~${pages}`;
}

function renderizarBotoesCategoria() {
  const nav = document.getElementById('categoriasNav');
  const catCounts = {};
  const catInfo = {};
  for (const t of apocrifos_textos) {
    const ci = categoriaInfo(t);
    catCounts[ci.id] = (catCounts[ci.id] || 0) + 1;
    catInfo[ci.id] = ci;
  }
  const sorted = Object.entries(catCounts)
    .filter(([id]) => id !== 'geral')
    .sort((a, b) => b[1] - a[1]);

  let html = `<button class="pilar-btn active" data-cat="all" onclick="filtrarCategoria('all')">📜 Todos (${apocrifos_textos.length})</button>`;
  for (const [id, count] of sorted) {
    const info = catInfo[id];
    html += `<button class="pilar-btn" data-cat="${id}" onclick="filtrarCategoria('${id}')">${info.icon} ${info.label} (${count})</button>`;
  }
  nav.innerHTML = html;
}

function renderizarTextos(textos) {
  const container = document.getElementById('apocrifosContainer');
  if (!textos || textos.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📜</div><p>Nenhum texto encontrado</p></div>';
    return;
  }
  let html = textos.map(texto => {
    const cat = categoriaInfo(texto);
    return `
      <div class="accordion">
        <button class="accordion-header" onclick="toggleAccordion(this)" data-id="${texto.id}">
          <span>${texto.titulo}</span>
          <span style="display:flex;align-items:center;gap:0.5rem">
            <span class="badge badge-apocrifo">${cat.icon} ${cat.label}</span>
            <span class="accordion-arrow">▼</span>
          </span>
        </button>
        <div class="accordion-content">
          <div class="content">
            <p><strong>${texto.descricao || ''}</strong></p>
            <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
              <button class="pilar-btn active" style="background:var(--cor-destaque);color:#fff;border:none;flex:1;min-width:150px" onclick="abrirTextoCompleto('${texto.id}')">
                📖 Ler texto completo
              </button>
              <button class="pilar-btn" style="border:1px solid var(--cor-borda)" onclick="compartilharTexto('${texto.id}')">
                🔗 Compartilhar
              </button>
            </div>
            <div class="card-tags" style="margin-top:0.8rem">
              ${(texto.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
  container.innerHTML = html;
}

function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const isActive = header.classList.contains('active');
  header.classList.toggle('active');
  content.classList.toggle('active');
  if (!isActive) setTimeout(() => content.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function filtrarCategoria(cat) {
  apocrifos_categoria = cat;
  document.querySelectorAll('.pilar-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.cat === cat) btn.classList.add('active');
  });
  if (cat === 'all') { renderizarTextos(apocrifos_textos); return; }
  const filtrados = apocrifos_textos.filter(t => categoriaInfo(t).id === cat);
  renderizarTextos(filtrados);
}

function buscarTextos(termo) {
  const info = document.getElementById('buscaInfo');
  const container = document.getElementById('apocrifosContainer');
  if (!termo.trim()) {
    info.textContent = '';
    filtrarCategoria(apocrifos_categoria);
    container.classList.remove('buscando');
    return;
  }
  container.classList.add('buscando');
  const t = termo.toLowerCase();
  let filtrados = apocrifos_textos.filter(s =>
    s.titulo.toLowerCase().includes(t) ||
    s.descricao.toLowerCase().includes(t) ||
    (s.tags || []).some(tag => tag.toLowerCase().includes(t))
  );
  if (apocrifos_categoria !== 'all') {
    filtrados = filtrados.filter(s => categoriaInfo(s).id === apocrifos_categoria);
  }
  info.textContent = filtrados.length + ' resultado' + (filtrados.length !== 1 ? 's' : '') + ' encontrado' + (filtrados.length !== 1 ? 's' : '');
  renderizarTextos(filtrados);
}

function abrirTextoCompleto(id) {
  const texto = apocrifos_textos.find(t => t.id === id);
  if (!texto) return;
  document.getElementById('modalTitulo').textContent = texto.titulo;
  const conteudo = texto.conteudo || {};
  let html = `<div class="texto-toolbar">
    <button class="btn-icon" onclick="ajustarFonte(-10)" title="Diminuir fonte">A-</button>
    <button class="btn-icon" onclick="ajustarFonte(10)" title="Aumentar fonte">A+</button>
    <button class="btn-icon" onclick="ajustarFonte(0)" title="Resetar fonte">A</button>
    <button class="btn-icon" onclick="window.print()" title="Imprimir">🖨️</button>
  </div>`;
  if (texto.descricao) {
    html += `<p style="font-size:1.05rem;margin-bottom:1rem"><strong>${texto.descricao}</strong></p>`;
  }
  if (conteudo.texto_integral) {
    html += `<hr style="border-color:var(--cor-borda);margin:1.5rem 0"><div class="texto-integral" id="textoIntegral" style="font-size:${apocrifos_fontScale}%">`;
    const paragrafos = conteudo.texto_integral.split('\n').filter(p => p.trim());
    html += paragrafos.map(p => {
      const trimmed = p.trim();
      if (/^cap[ií]tulo\s/i.test(trimmed)) return `<h3>${trimmed}</h3>`;
      if (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) return `<h4>${trimmed}</h4>`;
      return `<p>${trimmed}</p>`;
    }).join('');
    html += `</div>`;
  }
  if (Array.isArray(texto.tags) && texto.tags.length > 0) {
    html += `<div class="card-tags" style="margin-top:1.5rem;border-top:1px solid var(--cor-borda);padding-top:1rem">`;
    html += texto.tags.map(t => `<span class="tag">#${t}</span>`).join('');
    html += `</div>`;
  }
  document.getElementById('modalContent').innerHTML = html;
  ultimoElementoFocado = document.activeElement;
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.querySelector('.modal-close').focus();
  salvarProgressoLeitura(id);
}

function ajustarFonte(delta) {
  if (delta === 0) apocrifos_fontScale = 100;
  else apocrifos_fontScale = Math.max(60, Math.min(200, apocrifos_fontScale + delta));
  const el = document.getElementById('textoIntegral');
  if (el) el.style.fontSize = apocrifos_fontScale + '%';
}

function salvarProgressoLeitura(id) {
  try {
    const progressos = JSON.parse(localStorage.getItem('progresso_leitura') || '{}');
    progressos[id] = { id, data: new Date().toISOString() };
    localStorage.setItem('progresso_leitura', JSON.stringify(progressos));
  } catch (e) {}
}

function compartilharTexto(id) {
  const url = window.location.origin + '/apocrifos.html#' + id;
  if (navigator.share) {
    navigator.share({ title: 'Texto Apocrifo', url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => { if (typeof mostrarToast === 'function') mostrarToast('✅ Link copiado!', 'sucesso'); });
  }
}

function fecharModal(e) { if (e.target.id === 'modalOverlay') fecharModalBtn(); }
function fecharModalBtn() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
  if (ultimoElementoFocado) ultimoElementoFocado.focus();
}

function toggleBusca() {
  const c = document.getElementById('buscaContainer');
  const isVisible = c.style.display !== 'none';
  c.style.display = isVisible ? 'none' : 'block';
  if (!isVisible) document.getElementById('buscaInput').focus();
}

function toggleTema() {
  document.body.classList.toggle('modo-claro');
  localStorage.setItem('tema', document.body.classList.contains('modo-claro') ? 'claro' : 'escuro');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModalBtn(); });

const modalOverlayApocrifos = document.getElementById('modalOverlay');
if (modalOverlayApocrifos) {
  modalOverlayApocrifos.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    const modal = this.querySelector('.modal');
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
