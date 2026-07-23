(function () {
'use strict';

const CAT_EMOJIS = {1: '🜂', 2: '🧠', 3: '🔬', 4: '🧭', 5: '∞', 6: '📜'};
const CAT_BADGE = {1: 'badge-espirito', 2: 'badge-pratica', 3: 'badge-ciencia', 4: 'badge-jornada', 5: 'badge-vida', 6: 'badge-apocrifo'};
const CAT_NOME = {1: 'ESPÍRITO', 2: 'PRÁTICA', 3: 'CIÊNCIA', 4: 'JORNADA', 5: 'VIDA VERDADEIRA', 6: 'APÓCRIFOS'};

function $(el, html) {
  el.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  return el;
}

function normalizarSaber(saber) {
  return {
    ...saber,
    categoria_id: Number(saber.categoria_id),
    tags: Array.isArray(saber.tags) ? saber.tags :
          typeof saber.tags === 'string' ? saber.tags.split(',').map(t => t.trim()) : [],
    praticas: Array.isArray(saber.praticas) ? saber.praticas : [],
    conexoes: Array.isArray(saber.conexoes) ? saber.conexoes : [],
  };
}

function normalizarTags(item) {
  if (Array.isArray(item.tags)) return item.tags;
  if (typeof item.tags === 'string') return item.tags.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function buildMidiaUrl(item, tipo) {
  if (item.arquivo.startsWith('http')) {
    try { return new URL(item.arquivo).toString(); }
    catch { return encodeURI(item.arquivo); }
  }
  const baseDir = window.midiaBaseUrl || '';
  const partes = item.arquivo.split('/');
  const arquivoCod = partes.map(encodeURIComponent).join('/');
  return baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;
}

function mostrarToast(mensagem, tipo) {
  const container = document.getElementById('toastContainer') || (() => {
    const c = document.createElement('div');
    c.id = 'toastContainer';
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  if (tipo === 'sucesso') toast.style.color = '#7ee787';
  else if (tipo === 'erro') toast.style.color = '#f85149';
  toast.textContent = mensagem;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

function tratarErro(erro, contexto = 'Operação') {
  console.error(`[${contexto}] Erro:`, erro);
  let mensagem = 'Ocorreu um erro inesperado.';
  if (erro instanceof TypeError) mensagem = 'Erro de processamento de dados.';
  else if (erro instanceof SyntaxError) mensagem = 'Erro ao interpretar os dados recebidos.';
  else if (erro.message) {
    if (erro.message.includes('fetch')) mensagem = 'Erro de conexão. Verifique sua internet.';
    else if (erro.message.includes('HTTP 4')) mensagem = 'Recurso não encontrado ou dados inválidos.';
    else if (erro.message.includes('HTTP 5')) mensagem = 'Erro no servidor. Tente novamente mais tarde.';
    else mensagem = erro.message;
  }
  mostrarToast(`❌ ${mensagem}`, 'erro');
  return mensagem;
}

function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function toggleTema() {
  document.body.classList.toggle('modo-claro');
  localStorage.setItem('tema', document.body.classList.contains('modo-claro') ? 'claro' : 'escuro');
}

function aplicarTema() {
  if (localStorage.getItem('tema') === 'claro') document.body.classList.add('modo-claro');
}

function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const isActive = header.classList.contains('active');
  header.classList.toggle('active');
  content.classList.toggle('active');
  header.setAttribute('aria-expanded', !isActive);
  if (!isActive) setTimeout(() => content.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

function renderizarPraticas(praticas) {
  if (!Array.isArray(praticas) || !praticas.length) return '';
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

function renderizarConteudo(conteudo) {
  if (!conteudo) return '';
  let html = '';
  for (const [key, val] of Object.entries(conteudo)) {
    const handler = window.contentHandlers?.[key];
    if (handler) html += handler(val);
  }
  return html;
}

function renderizarConexoes(conexoes, saberes) {
  if (!Array.isArray(conexoes) || !conexoes.length || !saberes) return '';
  const conectados = conexoes.map(cid => {
    const s = saberes.find(x => x.id === cid);
    return s ? `<span class="tag tag-relacionado" data-saber-id="${s.id}" style="cursor:pointer">${s.titulo}</span>` : '';
  }).filter(Boolean).join(' ');
  if (!conectados) return '';
  return `<h3>🔗 Conexões</h3><div>${conectados}</div>`;
}

function compartilharConteudo(titulo, descricao) {
  const url = window.location.origin + window.location.pathname;
  const texto = `📖 ${titulo}\n\n${descricao}\n\nFonte: Saberes de Coração\n${url}`;
  if (navigator.share) {
    navigator.share({ title, text: descricao, url }).catch(() => {});
  } else if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(texto).then(() => {
      if (typeof mostrarToast === 'function') mostrarToast('✅ Link copiado!', 'sucesso');
    }).catch(() => {});
  } else {
    const temp = document.createElement('textarea');
    temp.value = texto;
    document.body.appendChild(temp);
    temp.select();
    try { document.execCommand('copy'); mostrarToast('✅ Link copiado!', 'sucesso'); } catch {}
    document.body.removeChild(temp);
  }
}

function extrairCitacaoImpactante(saber) {
  if (!saber.conteudo) return saber.descricao;
  if (Array.isArray(saber.conteudo.citacoes) && saber.conteudo.citacoes.length > 0) {
    const citacoes = saber.conteudo.citacoes.filter(c => c.length > 20 && c.length < 300);
    if (citacoes.length > 0) return citacoes[Math.floor(Math.random() * citacoes.length)];
  }
  if (saber.conteudo.insight) {
    const insight = saber.conteudo.insight;
    if (insight.length < 250) return insight;
    const frases = insight.split(/[.!?]+/).filter(f => f.trim().length > 20 && f.trim().length < 200);
    if (frases.length > 0) return frases[Math.floor(Math.random() * frases.length)].trim() + '.';
    return insight.substring(0, 200).trim() + '...';
  }
  return saber.descricao;
}

window.toggleTema = toggleTema;
window.aplicarTema = aplicarTema;
window.extrairCitacaoImpactante = extrairCitacaoImpactante;
window.toggleAccordion = toggleAccordion;
window.compartilharConteudo = compartilharConteudo;

window.Utils = {
  CAT_EMOJIS, CAT_BADGE, CAT_NOME,
  $, normalizarSaber, normalizarTags, buildMidiaUrl,
  mostrarToast, tratarErro, debounce, toggleTema, aplicarTema,
  toggleAccordion, renderizarPraticas, renderizarConteudo,
  renderizarConexoes, compartilharConteudo, extrairCitacaoImpactante,
};
})();
