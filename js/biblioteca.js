const NAV_MAP = { gnose: 1, praticas: 2, ciencia: 3, jornada: 4, vida: 5, apocrifos: 6 };
let dados = null;

window.mostrarSecao = function (id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  const secao = document.getElementById('sec-' + id);
  if (secao) secao.classList.add('active');
  if (el) el.classList.add('active');
};

window.toggleAccordion = window.Utils.toggleAccordion;

async function carregarDados() {
  try {
    const res = await fetch('/api/dados');
    if (res.ok) { dados = await res.json(); return; }
  } catch {}
  try {
    const res = await fetch('/data/dados-unificados.json');
    if (res.ok) { dados = await res.json(); return; }
  } catch {}
  console.error('Falha ao carregar dados');
}

function renderizarConteudo(saber) {
  if (!saber.conteudo) return '';
  let html = '';
  for (const [key, val] of Object.entries(saber.conteudo)) {
    if (window.contentHandlers?.[key]) html += window.contentHandlers[key](val);
  }
  return html;
}

function renderizarPraticas(praticas) {
  if (!praticas?.length) return '';
  let html = '<h3>🧘 Práticas</h3>';
  praticas.forEach(p => {
    html += `<div class="pratica-box"><h4>${p.titulo}</h4><p>${p.instrucoes.replace(/\n/g, '<br>')}</p>`;
    if (p.duracao || p.frequencia) {
      html += `<p style="margin-top:0.5rem;font-size:0.85rem;color:var(--cor-texto-sec)"><em>⏱️ ${p.duracao || '-'} min | 🔄 ${p.frequencia || '-'}</em></p>`;
    }
    html += '</div>';
  });
  return html;
}

function renderizarConexoes(saber) {
  if (!saber.conexoes?.length || !dados) return '';
  return '<h3>🔗 Conexões</h3><div>' +
    saber.conexoes.map(cid => {
      const s = dados.saberes.find(x => x.id === cid);
      return s ? `<span class="tag tag-relacionado" style="cursor:pointer">${s.titulo}</span>` : '';
    }).filter(Boolean).join(' ') +
  '</div>';
}

function renderizarSecao(categoriaId) {
  const secao = document.getElementById('sec-' + Object.keys(NAV_MAP).find(k => NAV_MAP[k] === categoriaId));
  if (!secao || !dados) return;

  const saberes = dados.saberes.filter(s => Number(s.categoria_id) === categoriaId).map(window.Utils.normalizarSaber);
  if (!saberes.length) {
    window.Utils.$(secao, '<div class="empty-state" style="padding:2rem;text-align:center"><p>Nenhum saber nesta categoria.</p></div>');
    return;
  }

  let html = '';
  saberes.forEach(saber => {
    html += `<div class="accordion">
      <button class="accordion-header" onclick="window.toggleAccordion(this)" aria-expanded="false">
        <span>${window.Utils.CAT_EMOJIS[saber.categoria_id] || '📖'} ${saber.titulo}</span>
        <span class="accordion-arrow">▼</span>
      </button>
      <div class="accordion-content"><div class="content">
        <span class="badge ${window.Utils.CAT_BADGE[saber.categoria_id] || ''}">${window.Utils.CAT_NOME[saber.categoria_id] || ''}</span>
        ${saber.tags.map(t => `<span class="tag">#${t}</span>`).join(' ')}
        <p style="margin-top:0.8rem;color:var(--cor-texto-sec)"><em>${saber.descricao}</em></p>
        ${saber.fonte ? `<p style="font-size:0.85rem;color:var(--cor-texto-sec)">📖 ${saber.fonte} | ⏱️ ${saber.duracao || '-'} min | 🏷️ ${saber.nivel || '-'}</p>` : ''}
        ${renderizarConteudo(saber)}
        ${renderizarPraticas(saber.praticas)}
        ${renderizarConexoes(saber)}
      </div></div>
    </div>`;
  });

  window.Utils.$(secao, html);
}

function renderizarTodasSecoes() {
  Object.values(NAV_MAP).forEach(catId => renderizarSecao(catId));
}

const buscarNaBiblioteca = window.Utils.debounce(function (termo) {
  const info = document.getElementById('buscaInfo');
  if (!termo.trim()) {
    info.textContent = '';
    document.querySelectorAll('.accordion').forEach(a => { a.style.display = ''; });
    document.querySelectorAll('.section').forEach(s => s.classList.add('active'));
    return;
  }
  const t = termo.toLowerCase();
  let count = 0;
  document.querySelectorAll('.accordion').forEach(a => {
    const match = a.textContent.toLowerCase().includes(t);
    a.style.display = match ? '' : 'none';
    if (match) count++;
  });
  info.textContent = `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
  document.querySelectorAll('.section').forEach(s => {
    s.classList.toggle('active', !!s.querySelector('.accordion:not([style*="display: none"])') || count === 0);
  });
}, 250);

document.addEventListener('DOMContentLoaded', async () => {
  window.Utils.aplicarTema();
  await carregarDados();
  if (dados) renderizarTodasSecoes();

  const buscaInput = document.getElementById('buscaInput');
  if (buscaInput) buscaInput.addEventListener('input', e => buscarNaBiblioteca(e.target.value));

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
});
