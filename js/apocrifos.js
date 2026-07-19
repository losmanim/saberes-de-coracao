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

let apocrifos_textos = [];
let apocrifos_categoria = 'all';
let apocrifos_fontScale = 100;

document.addEventListener('DOMContentLoaded', () => {
  carregarFonteSalva();
  carregarApocrifos().then(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => abrirAccordionPorId(id), 500);
    }
  });

  const buscaInput = document.getElementById('buscaInput');
  if (buscaInput) {
    const debouncedBusca = Utils.debounce(function() {
      buscarTextos(this.value);
    }, 250);
    buscaInput.addEventListener('input', debouncedBusca);
  }
});

function abrirAccordionPorId(id) {
  const header = document.querySelector(`.accordion-header[data-id="${id}"]`);
  if (!header) return;
  header.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => { if (!header.classList.contains('active')) header.click(); }, 300);
}

async function carregarApocrifos() {
  const container = document.getElementById('apocrifosContainer');
  if (!dados) {
    const maxWait = 10000;
    const startTime = Date.now();
    while (!dados && Date.now() - startTime < maxWait) {
      await new Promise(r => setTimeout(r, 100));
    }
  }
  if (!dados || !dados.saberes) {
    try { mostrarToast('Erro ao carregar dados', 'erro'); } catch (e) {}
    window.Utils.$(container, '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Erro ao carregar dados.</p><p class="texto-aux">Dados não disponíveis<br><small>Tente recarregar a página.</small></p><button data-action="reload" class="pilar-btn" style="margin-top:1rem">🔄 Recarregar</button></div>');
    return;
  }
  apocrifos_textos = dados.saberes.map(window.Utils.normalizarSaber).filter(s => s.categoria_id === 6);
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
  document.getElementById('statPaginas').textContent = '~' + Math.max(1, Math.round(totalChar / 3000));
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
  const sorted = Object.entries(catCounts).filter(([id]) => id !== 'geral').sort((a, b) => b[1] - a[1]);
  let html = '<button class="pilar-btn active" data-cat="all" data-action="filtrar-cat">📜 Todos (' + apocrifos_textos.length + ')</button>';
  for (const [id, count] of sorted) {
    const info = catInfo[id];
    html += '<button class="pilar-btn" data-cat="' + id + '" data-action="filtrar-cat">' + info.icon + ' ' + info.label + ' (' + count + ')</button>';
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
    return '<div class="accordion">'
      + '<button class="accordion-header" data-id="' + texto.id + '" data-action="toggle-accordion">'
      + '<span>' + texto.titulo + '</span>'
      + '<span class="accordion-header-right">'
      + '<span class="badge badge-apocrifo">' + cat.icon + ' ' + cat.label + '</span>'
      + '<span class="accordion-arrow">▼</span>'
      + '</span></button>'
      + '<div class="accordion-content">'
      + '<div class="content">'
      + '<p><strong>' + (texto.preview || texto.descricao || '') + '</strong></p>'
      + '<div class="flex-wrap" style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">'
      + '<button class="pilar-btn active btn-ler" data-saber-id="' + texto.id + '" data-action="abrir-texto">📖 Ler texto completo</button>'
      + '<button class="pilar-btn" data-saber-id="' + texto.id + '" data-action="compartilhar-texto">🔗 Compartilhar</button>'
      + '</div>'
      + '<div class="card-tags">'
      + (Array.isArray(texto.tags) ? texto.tags.map(t => '<span class="tag">#' + t + '</span>').join('') : '')
      + '</div>'
      + '</div></div></div>';
  }).join('');
  container.innerHTML = html;
}

const toggleAccordion = window.Utils.toggleAccordion;

function filtrarCategoria(cat) {
  apocrifos_categoria = cat;
  document.querySelectorAll('#categoriasNav .pilar-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  if (cat === 'all') { renderizarTextos(apocrifos_textos); return; }
  renderizarTextos(apocrifos_textos.filter(t => categoriaInfo(t).id === cat));
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
    (Array.isArray(s.tags) ? s.tags : []).some(tag => tag.toLowerCase().includes(t))
  );
  if (apocrifos_categoria !== 'all') {
    filtrados = filtrados.filter(s => categoriaInfo(s).id === apocrifos_categoria);
  }
  info.textContent = filtrados.length + ' resultado' + (filtrados.length !== 1 ? 's' : '') + ' encontrado' + (filtrados.length !== 1 ? 's' : '');
  renderizarTextos(filtrados);
}

async function abrirTextoCompleto(id) {
  const texto = apocrifos_textos.find(t => t.id === id);
  if (!texto) return;
  document.getElementById('modalTitulo').textContent = texto.titulo;
  const faceis = apocrifos_fontScale;
  var baseHtml = '<div class="texto-toolbar">'
    + '<button class="btn-icon" data-action="ajustar-fonte" data-delta="-10" title="Diminuir fonte">A-</button>'
    + '<button class="btn-icon" data-action="ajustar-fonte" data-delta="10" title="Aumentar fonte">A+</button>'
    + '<button class="btn-icon" data-action="ajustar-fonte" data-delta="0" title="Resetar fonte">A</button>'
    + '<button class="btn-icon" data-action="imprimir" title="Imprimir">🖨️</button>'
    + '</div>';
  if (texto.descricao) {
    baseHtml += '<p class="descricao-modal"><strong>' + texto.descricao + '</strong></p>';
  }
  var html = baseHtml + '<div id="apocrifoLoading" style="text-align:center;padding:2rem"><div class="loading-spinner"></div><p style="color:var(--cor-texto-sec);margin-top:0.5rem">Carregando texto...</p></div>';
  window.Utils.$(document.getElementById('modalContent'), html);
  abrirModal();
  salvarProgressoLeitura(id);
  try {
    if (!texto.conteudo || !texto.conteudo.texto_integral) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/saberes/' + id + '/conteudo', { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        texto.conteudo = data.conteudo;
      }
    }
  } catch (e) {
    texto.conteudo = texto.conteudo || {};
  }
  const conteudo = texto.conteudo || {};
  if (!conteudo.texto_integral) {
    baseHtml += '<div class="empty-state" style="padding:2rem"><p>Conteúdo não disponível no momento.</p><button class="pilar-btn active" data-action="abrir-texto" data-saber-id="' + id + '" style="margin-top:1rem">🔄 Tentar novamente</button></div>';
  } else {
    baseHtml += '<hr style="border-color:var(--cor-borda);margin:1.5rem 0"><div class="texto-integral" id="textoIntegral" style="font-size:' + faceis + '%">';
    var linhas = conteudo.texto_integral.split('\n');
    var buffer = [];
    function flushBuffer() {
      if (!buffer.length) return;
      var primeira = buffer[0];
      if (/^cap[ií]tulo\s/i.test(primeira)) {
        baseHtml += '<h3>' + buffer.join('<br>') + '</h3>';
      } else if (primeira.length < 60 && primeira === primeira.toUpperCase() && primeira.length > 3) {
        baseHtml += '<h4>' + primeira + '</h4>';
        if (buffer.length > 1) baseHtml += '<p>' + buffer.slice(1).join('<br>') + '</p>';
      } else {
        baseHtml += '<p>' + buffer.join('<br>') + '</p>';
      }
      buffer = [];
    }
    for (var i = 0; i < linhas.length; i++) {
      var l = linhas[i].trim();
      if (l) { buffer.push(l); continue; }
      flushBuffer();
    }
    flushBuffer();
    baseHtml += '</div>';
  }
  if (Array.isArray(texto.tags) && texto.tags.length > 0) {
    baseHtml += '<div class="card-tags" style="margin-top:1.5rem;border-top:1px solid var(--cor-borda);padding-top:1rem">'
      + texto.tags.map(t => '<span class="tag">#' + t + '</span>').join('') + '</div>';
  }
  window.Utils.$(document.getElementById('modalContent'), baseHtml);
}

function ajustarFonte(delta) {
  apocrifos_fontScale = delta === 0 ? 100 : Math.max(60, Math.min(200, apocrifos_fontScale + delta));
  const el = document.getElementById('textoIntegral');
  if (el) el.style.fontSize = apocrifos_fontScale + '%';
  try { localStorage.setItem('apocrifos_fonte', apocrifos_fontScale); } catch (e) {}
}

function carregarFonteSalva() {
  try {
    const salva = parseInt(localStorage.getItem('apocrifos_fonte'), 10);
    if (salva >= 60 && salva <= 200) apocrifos_fontScale = salva;
  } catch (e) {}
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

document.addEventListener('click', function (e) {
  const action = e.target.closest('[data-action]');
  if (!action) return;
  const a = action.dataset.action;

  if (a === 'reload') { location.reload(); return; }

  if (a === 'filtrar-cat') {
    filtrarCategoria(action.dataset.cat);
    return;
  }

  if (a === 'toggle-accordion') {
    toggleAccordion(action);
    return;
  }

  if (a === 'abrir-texto') {
    abrirTextoCompleto(action.dataset.saberId);
    return;
  }

  if (a === 'compartilhar-texto') {
    compartilharTexto(action.dataset.saberId);
    return;
  }

  if (a === 'ajustar-fonte') {
    ajustarFonte(parseInt(action.dataset.delta));
    return;
  }

  if (a === 'imprimir') {
    window.print();
  }
});

document.addEventListener('keydown', function (e) {
  const header = e.target.closest('[data-action="toggle-accordion"]');
  if (header && e.key === 'Enter') {
    toggleAccordion(header);
  }
});
