// =============================================
// Sanitização XSS
// =============================================

function $(el, htmlContent) {
  el.innerHTML = window.DOMPurify ? DOMPurify.sanitize(htmlContent) : htmlContent;
  return el;
}

// =============================================
// Constantes
// =============================================

const DADOS_CACHE_KEY = 'saberes_cache';
const DADOS_CACHE_VERSAO_KEY = 'saberes_cache_versao';
const FAVORITOS_KEY = 'saberes_favoritos';
const SABER_DIA_KEY = 'saberes_saber_dia';
const CONTINUE_KEY = 'saberes_continue';
const ABERTOS_KEY = 'saberes_abertos';

const CAT_EMOJIS = {1: '🜂', 2: '🧠', 3: '🔬', 4: '🧭', 5: '∞', 6: '📜'};

// =============================================
// Normalização de Dados (Appwrite compatibility)
// =============================================

function normalizarSaber(saber) {
    return {
        ...saber,
        categoria_id: Number(saber.categoria_id),
        tags: Array.isArray(saber.tags) ? saber.tags : 
              typeof saber.tags === 'string' ? saber.tags.split(',').map(t => t.trim()) : 
              [],
        praticas: Array.isArray(saber.praticas) ? saber.praticas : [],
        conexoes: Array.isArray(saber.conexoes) ? saber.conexoes : [],
    };
}

// =============================================
// Estado Global
// =============================================

let dados = null;
let categoriaAtual = 'all';
let ultimoElementoFocado = null;
let continueSaberId = null;
let paginaAtual = 1;
let itensPorPagina = 24;
let totalPaginas = 1;
let todosSaberes = [];

// =============================================
// Saber do Dia
// =============================================

function saberDoDia() {
    const el = document.getElementById('saberDoDia');
    if (!el || !dados || !dados.saberes) return;

    const hoje = new Date().toDateString();
    const salvo = localStorage.getItem(SABER_DIA_KEY);
    let escolha;
    let citacaoUsar;

    if (salvo) {
        try {
            const parsed = JSON.parse(salvo);
            if (parsed.data === hoje && parsed.id) {
                escolha = dados.saberes.find(s => s.id === parsed.id);
                citacaoUsar = parsed.citacao;
            }
        } catch {}
    }

    if (!escolha) {
        const idx = Math.floor(Math.random() * dados.saberes.length);
        escolha = dados.saberes[idx];
        citacaoUsar = extrairCitacaoImpactante(escolha);
        localStorage.setItem(SABER_DIA_KEY, JSON.stringify({ data: hoje, id: escolha.id, citacao: citacaoUsar }));
    }

    if (!escolha || !citacaoUsar) return;

    $(el, `
        <div class="saber-dia-card" tabindex="0" role="button" data-saber-id="${escolha.id}" aria-label="Saber do dia: ${escolha.titulo}">
            <div class="saber-dia-label">☀️ Saber do Dia</div>
            <div class="saber-dia-quote">${citacaoUsar}</div>
            <div class="saber-dia-fonte">— ${escolha.titulo}</div>
        </div>`);
}

function extrairCitacaoImpactante(saber) {
    if (!saber.conteudo) return saber.descricao;

    if (Array.isArray(saber.conteudo.citacoes) && saber.conteudo.citacoes.length > 0) {
        const citacoes = saber.conteudo.citacoes.filter(c => c.length > 20 && c.length < 300);
        if (citacoes.length > 0) {
            return citacoes[Math.floor(Math.random() * citacoes.length)];
        }
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

// =============================================
// Favoritos
// =============================================

function getFavoritos() {
    try {
        const raw = localStorage.getItem(FAVORITOS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function salvarFavoritos(lista) {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
}

function isFavorito(id) {
    return getFavoritos().includes(id);
}

function toggleFavorito(id, event) {
    if (event) { event.stopPropagation(); }
    let favs = getFavoritos();
    const idx = favs.indexOf(id);
    if (idx === -1) {
        favs.push(id);
        mostrarToast('❤️ Adicionado aos favoritos', 'sucesso');
    } else {
        favs.splice(idx, 1);
        mostrarToast('💔 Removido dos favoritos');
    }
    salvarFavoritos(favs);

    document.querySelectorAll(`.card-fav[data-id="${id}"]`).forEach(btn => {
        btn.classList.toggle('active', isFavorito(id));
        btn.textContent = isFavorito(id) ? '❤️' : '🤍';
    });

    if (categoriaAtual === 'fav' && !isFavorito(id)) {
        const btn2 = document.querySelector(`.card-fav[data-id="${id}"]`);
        if (btn2) {
            const card = btn2.closest('.card');
            if (card) {
                card.remove();
                const grid = document.getElementById('cardsGrid');
                const remaining = grid.querySelectorAll('.card, .empty-state');
                if (remaining.length === 0) {
                    $(grid, '<div class="empty-state"><div class="empty-state-icon">💔</div><p>Nenhum favorito ainda</p><p style="font-size:0.8rem;color:var(--cor-texto-sec);margin-top:0.5rem">Clique no 🤍 nos cards para adicionar</p></div>');
                }
            }
        }
    }
}

// =============================================
// Continuar Lendo
// =============================================

function salvarContinueLendo(id) {
    try {
        localStorage.setItem(CONTINUE_KEY, JSON.stringify({
            id: id,
            data: Date.now()
        }));
    } catch {}
}

function mostrarContinueLendo() {
    const bar = document.getElementById('continueBar');
    const titulo = document.getElementById('continueTitulo');
    if (!bar || !titulo) return;

    try {
        const raw = localStorage.getItem(CONTINUE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (!saved.id || !dados) return;
        const saber = dados.saberes.find(s => s.id === saved.id);
        if (!saber) return;

        continueSaberId = saved.id;
        titulo.textContent = saber.titulo;
        bar.removeAttribute('hidden');
    } catch {}
}

function fecharContinue() {
    const bar = document.getElementById('continueBar');
    if (bar) bar.setAttribute('hidden', '');
    localStorage.removeItem(CONTINUE_KEY);
}

// =============================================
// Rastreio de Saberes Abertos
// =============================================

function getSaberesAbertos() {
    try { return JSON.parse(localStorage.getItem(ABERTOS_KEY) || '[]'); }
    catch { return []; }
}

function marcarSaberAberto(id) {
    const abertos = getSaberesAbertos();
    if (!abertos.includes(id)) {
        abertos.push(id);
        localStorage.setItem(ABERTOS_KEY, JSON.stringify(abertos));
    }
}

// =============================================
// Error Handler Global
// =============================================

function tratarErro(erro, contexto = 'Operação') {
    console.error(`[${contexto}] Erro:`, erro);
    
    let mensagem = 'Ocorreu um erro inesperado.';
    
    if (erro instanceof TypeError) {
        mensagem = 'Erro de processamento de dados.';
    } else if (erro instanceof SyntaxError) {
        mensagem = 'Erro ao interpretar os dados recebidos.';
    } else if (erro.message) {
        if (erro.message.includes('fetch')) {
            mensagem = 'Erro de conexão. Verifique sua internet.';
        } else if (erro.message.includes('HTTP 4')) {
            mensagem = 'Recurso não encontrado ou dados inválidos.';
        } else if (erro.message.includes('HTTP 5')) {
            mensagem = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
            mensagem = erro.message;
        }
    }
    
    mostrarToast(`❌ ${mensagem}`, 'erro');
    return mensagem;
}

// =============================================
// Toast Notifications
// =============================================

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

// =============================================
// Compartilhar
// =============================================

function compartilharSaber(id) {
    if (!dados) return;
    const saber = dados.saberes.find(s => s.id === id);
    if (!saber) return;

    const url = window.location.origin + window.location.pathname;
    const texto = `📖 ${saber.titulo}\n\n${saber.descricao}\n\nFonte: Saberes de Coração\n${url}`;

    if (navigator.share) {
        navigator.share({
            title: saber.titulo,
            text: saber.descricao,
            url: url,
        }).catch(() => {});
    } else {
        const temp = document.createElement('textarea');
        temp.value = texto;
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand('copy');
            mostrarToast('✅ Link copiado!', 'sucesso');
        } catch {}
        document.body.removeChild(temp);
    }
}

// =============================================
// Paginação
// =============================================

function atualizarPaginacao() {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationInfo = document.getElementById('paginationInfo');

    if (!pagination) return;

    const saberesFiltrados = obterSaberesFiltrados();
    totalPaginas = Math.ceil(saberesFiltrados.length / itensPorPagina);

    if (totalPaginas <= 1) {
        pagination.hidden = true;
        return;
    }

    pagination.hidden = false;
    prevBtn.disabled = paginaAtual === 1;
    nextBtn.disabled = paginaAtual === totalPaginas;
    paginationInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

function mudarPagina(delta) {
    const saberesFiltrados = obterSaberesFiltrados();
    totalPaginas = Math.ceil(saberesFiltrados.length / itensPorPagina);
    
    const novaPagina = paginaAtual + delta;
    if (novaPagina < 1 || novaPagina > totalPaginas) return;

    paginaAtual = novaPagina;
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const saberesPagina = saberesFiltrados.slice(inicio, fim);

    renderizarSaberes(saberesPagina);
    atualizarPaginacao();
    
    // Scroll para o topo da grid
    document.getElementById('cardsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function obterSaberesFiltrados() {
    if (!dados || !dados.saberes) return [];
    
    todosSaberes = dados.saberes.map(normalizarSaber);

    if (categoriaAtual === 'all') {
        return todosSaberes;
    } else if (categoriaAtual === 'fav') {
        const favs = getFavoritos();
        return todosSaberes.filter(s => favs.includes(s.id));
    } else {
        return todosSaberes.filter(s => String(s.categoria_id) === categoriaAtual);
    }
}

// =============================================
// Atalhos do Teclado
// =============================================

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



document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === 'Escape') {
        const reader = document.getElementById('readerOverlay');
        if (reader && reader.classList.contains('active')) {
            fecharLeitor();
            return;
        }
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
    if (typeof Player !== 'undefined' && Player.init) {
        Player.init();
    }

    if (localStorage.getItem('tema') === 'claro') {
        document.body.classList.add('modo-claro');
    }

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
        if (typeof Player !== 'undefined' && Player.restoreState) {
            Player.restoreState();
        }
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

// =============================================
// Reading Progress Bar
// =============================================

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

// =============================================
// Scroll Reveal (Intersection Observer)
// =============================================

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

// Aplicar reveal nos cards após renderizar
function aplicarReveal() {
    const cards = document.querySelectorAll('.cards-grid .card, .midia-grid .midia-card');
    cards.forEach((card, i) => {
        card.classList.add('reveal');
        if (i < 5) card.classList.add('reveal-delay-' + (i + 1));
    });
    observarReveal();
}

// =============================================
// Cache e Carregamento de Dados
// =============================================

function carregarDadosCache() {
    try {
        const raw = localStorage.getItem(DADOS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.saberes) return null;
        return parsed;
    } catch {
        return null;
    }
}

function salvarDadosCache(dados) {
    try {
        localStorage.setItem(DADOS_CACHE_KEY, JSON.stringify(dados));
        if (dados.meta && dados.meta.versao) {
            localStorage.setItem(DADOS_CACHE_VERSAO_KEY, dados.meta.versao);
        }
    } catch {
    }
}

async function carregarDados() {
    console.log('Iniciando carregamento de dados...');
    let grid = document.getElementById('cardsGrid');
    
    // Retry se grid não encontrado (timing issue)
    if (!grid) {
        console.warn('Grid não encontrado na primeira tentativa, aguardando DOM...');
        await new Promise(r => setTimeout(r, 100));
        grid = document.getElementById('cardsGrid');
    }
    
    console.log('Grid encontrado:', !!grid);

    const cache = carregarDadosCache();
    if (cache) {
        console.log('Usando cache do localStorage');
        dados = cache;
        if (dados && dados.saberes) dados.saberes = dados.saberes.map(normalizarSaber);
        atualizarEstatisticas();
        if (grid) {
            console.log('Renderizando saberes do cache:', dados.saberes?.length);
            renderizarSaberes(dados.saberes);
        }
        saberDoDia();
    }

    try {
        console.log('Buscando dados da API /api/dados...');
        const response = await fetch('/api/dados');
        console.log('Resposta da API:', response.status);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const novosDados = await response.json();
        console.log('Dados recebidos:', novosDados.meta?.versao, 'saberes:', novosDados.saberes?.length);

        const versaoAtual = localStorage.getItem(DADOS_CACHE_VERSAO_KEY);
        const novaVersao = novosDados.meta && novosDados.meta.versao;
        console.log('Versões - atual:', versaoAtual, 'nova:', novaVersao);

        if (!cache || (novaVersao && novaVersao !== versaoAtual)) {
            console.log('Atualizando dados...');
            dados = novosDados;
            if (dados && dados.saberes) dados.saberes = dados.saberes.map(normalizarSaber);
            salvarDadosCache(novosDados);
            atualizarEstatisticas();
            // Buscar grid novamente após carregar dados
            const gridAtualizado = document.getElementById('cardsGrid');
            if (gridAtualizado) {
                console.log('Dados carregados:', dados.saberes?.length, 'saberes');
                // Aplicar paginação
                const saberesFiltrados = obterSaberesFiltrados();
                const inicio = (paginaAtual - 1) * itensPorPagina;
                const fim = inicio + itensPorPagina;
                const saberesPagina = saberesFiltrados.slice(inicio, fim);
                renderizarSaberes(saberesPagina);
                atualizarPaginacao();
            }
            saberDoDia();
        } else {
            console.log('Dados em cache estão atualizados');
            // Buscar grid novamente para cache atualizado
            const gridAtualizado = document.getElementById('cardsGrid');
            if (gridAtualizado) {
                console.log('Renderizando do cache:', dados.saberes?.length, 'saberes');
                // Aplicar paginação mesmo do cache
                const saberesFiltrados = obterSaberesFiltrados();
                const inicio = (paginaAtual - 1) * itensPorPagina;
                const fim = inicio + itensPorPagina;
                const saberesPagina = saberesFiltrados.slice(inicio, fim);
                renderizarSaberes(saberesPagina);
                atualizarPaginacao();
            }
        }
    } catch (e) {
        tratarErro(e, 'Carregar dados');
        // Fallback: tentar carregar JSON diretamente
        if (!cache) {
            try {
                console.log('Tentando fallback para JSON direto...');
                const jsonResponse = await fetch('/data/dados-unificados.json');
                if (!jsonResponse.ok) throw new Error('HTTP ' + jsonResponse.status);
                const dadosJson = await jsonResponse.json();
                console.log('Dados JSON recebidos:', dadosJson.meta?.versao, 'saberes:', dadosJson.saberes?.length);
                dados = dadosJson;
                if (dados && dados.saberes) dados.saberes = dados.saberes.map(normalizarSaber);
                salvarDadosCache(dados);
                atualizarEstatisticas();
                // Buscar grid novamente no fallback
                const gridFallback = document.getElementById('cardsGrid');
                if (gridFallback) {
                    console.log('Dados carregados via fallback:', dados.saberes?.length, 'saberes');
                    // Aplicar paginação no fallback
                    const saberesFiltrados = obterSaberesFiltrados();
                    const inicio = (paginaAtual - 1) * itensPorPagina;
                    const fim = inicio + itensPorPagina;
                    const saberesPagina = saberesFiltrados.slice(inicio, fim);
                    renderizarSaberes(saberesPagina);
                    atualizarPaginacao();
                }
                saberDoDia();
                mostrarToast('✅ Dados carregados via fallback', 'sucesso');
            } catch (fallbackError) {
                tratarErro(fallbackError, 'Fallback JSON');
                if (grid) {
                    $(grid, '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Erro ao carregar dados.</p><p style="font-size:0.8rem;margin-top:0.5rem;color:var(--cor-texto-sec)">' + e.message + '<br><small>Tentativa de fallback: ' + fallbackError.message + '</small></p></div>');
                }
            }
        }
    }
}

// =============================================
// Estatísticas
// =============================================

function animarContagem(el, alvo) {
    if (!el) return;
    const dur = 600;
    const inicio = performance.now();
    const inicial = parseInt(el.dataset.valorInicial) || 0;
    function atualizar(agora) {
        const progresso = Math.min((agora - inicio) / dur, 1);
        const eased = 1 - Math.pow(1 - progresso, 3);
        const valor = Math.floor(inicial + eased * (alvo - inicial));
        el.textContent = valor;
        if (progresso < 1) requestAnimationFrame(atualizar);
    }
    requestAnimationFrame(atualizar);
}

function atualizarEstatisticas() {
    if (!dados) return;
    const nSaberes = dados.saberes ? dados.saberes.length : 0;
    const nPraticas = dados.praticas ? dados.praticas.length : 0;
    const nMidia = (dados.midia ? (dados.midia.audios ? dados.midia.audios.length : 0) : 0) +
        (dados.midia ? (dados.midia.videos ? dados.midia.videos.length : 0) : 0);
    const el = id => document.getElementById(id);
    animarContagem(el('statSaberes'), nSaberes);
    animarContagem(el('statPraticas'), nPraticas);
    animarContagem(el('statMidia'), nMidia);
}

// =============================================
// Renderização de Saberes (Grid de Cards)
// =============================================

function renderizarSaberes(saberes) {
    const grid = document.getElementById('cardsGrid');
    if (!grid) return;
    grid.className = 'cards-grid';

    if (!saberes || saberes.length === 0) {
        $(grid, '<div class="empty-state"><div class="empty-state-icon">📚</div><p>Nenhum saber encontrado</p></div>');
        esconderSkeleton();
        return;
    }

    const favs = getFavoritos();
    const abertos = getSaberesAbertos();
    const cardsHtml = saberes.map(saber => {
        const s = normalizarSaber(saber);
        const isNovo = !abertos.includes(s.id);
        const isVisited = abertos.includes(s.id);
        const catIcon = CAT_EMOJIS[s.categoria_id] || '📖';
        return `
            <div class="card ${isVisited ? 'visited' : ''}" tabindex="0" role="button" data-saber-id="${s.id}" data-cat="${s.categoria_id}" aria-label="${s.titulo} — Abrir">
                ${isNovo ? '<span class="card-novo">✨ Novo</span>' : ''}
                <button class="card-fav ${favs.includes(s.id) ? 'active' : ''}" data-id="${s.id}" aria-label="${favs.includes(s.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${favs.includes(s.id) ? '❤️' : '🤍'}</button>
                <div class="card-header">
                    <span class="card-titulo"><span class="cat-icon">${catIcon}</span>${s.titulo}</span>
                    <span class="card-nivel ${s.nivel}">${s.nivel}</span>
                </div>
                <p class="card-desc">${s.descricao}</p>
                <div class="card-meta">
                    <span>⏱️ ${s.duracao} min</span>
                    <span>📖 ${s.fonte}</span>
                </div>
                <div class="card-tags">
                    ${s.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>`;
    }).join('');

    $(grid, cardsHtml);
    esconderSkeleton();
    aplicarReveal();
}

function esconderSkeleton() {
    const sk = document.getElementById('skeletonGrid');
    if (sk) sk.style.display = 'none';
}

// =============================================
// Filtragem por Categoria
// =============================================

function filtrarCategoria(cat) {
    categoriaAtual = cat;
    paginaAtual = 1; // Resetar para página 1 ao mudar categoria

    document.querySelectorAll('.pilar-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (btn.dataset.cat === cat) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });

    if (cat === 'midia') {
        renderizarMidia();
        return;
    }

    const saberesFiltrados = obterSaberesFiltrados();
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const saberesPagina = saberesFiltrados.slice(inicio, fim);
    
    renderizarSaberes(saberesPagina);
    atualizarPaginacao();
}

// =============================================
// Renderização de Mídia
// =============================================

function renderizarMidia() {
    const grid = document.getElementById('cardsGrid');
    grid.className = 'midia-grid';

    let html = '';

    if (dados.midia && dados.midia.audios && dados.midia.audios.length > 0) {
        html += '<h3 class="midia-section-title">🎵 Áudios (' + dados.midia.audios.length + ')</h3>';
        html += dados.midia.audios.map(a => `
            <div class="midia-card" tabindex="0" role="button" data-midia-tipo="audio" data-midia-id="${a.id}" aria-label="Áudio: ${a.titulo}">
                <div class="midia-icon">🎧</div>
                <div class="midia-titulo">${a.titulo}</div>
                <div class="midia-tags">
                    ${a.tags.map(t => `<span class="midia-tag">#${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    if (dados.midia && dados.midia.videos && dados.midia.videos.length > 0) {
        html += '<h3 class="midia-section-title" style="margin-top:1rem">🎬 Vídeos (' + dados.midia.videos.length + ')</h3>';
        html += dados.midia.videos.map(v => `
            <div class="midia-card" tabindex="0" role="button" data-midia-tipo="video" data-midia-id="${v.id}" aria-label="Vídeo: ${v.titulo}">
                <div class="midia-icon">🎬</div>
                <div class="midia-titulo">${v.titulo}</div>
                <div class="midia-tags">
                    ${v.tags.map(t => `<span class="midia-tag">#${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    if (!html) {
        html = '<div class="empty-state"><div class="empty-state-icon">🎵</div><p>Nenhuma multimídia disponível</p></div>';
    }

    document.getElementById('modalTitulo').textContent = '🎵 Multimídia';
    $(document.getElementById('modalContent'), html);
    abrirModal();
    esconderSkeleton();
    aplicarReveal();
}

// =============================================
// Abertura de Mídia (Modal)
// =============================================

function abrirMidia(tipo, id) {
    const lista = tipo === 'audio' ? dados.midia.audios : dados.midia.videos;
    const item = lista ? lista.find(m => m.id === id) : null;
    if (!item) return;

    // Verifica se o arquivo já é uma URL completa (Cloudinary)
    let src;
    if (item.arquivo.startsWith('http')) {
        src = item.arquivo;
    } else {
        const baseDir = window.midiaBaseUrl;
        const partes = item.arquivo.split('/');
        const arquivoCod = partes.map(encodeURIComponent).join('/');
        src = baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;
    }

    document.getElementById('modalTitulo').textContent = item.titulo;

    let html = '';

    if (tipo === 'video') {
        html += `
            <div class="player-container" style="margin-bottom:1rem">
                <video controls style="width:100%;max-height:70vh;border-radius:var(--radius);background:#000">
                    <source src="${src}" type="video/${src.endsWith('.mkv') ? 'x-matroska' : 'mp4'}">
                    Seu navegador não suporta vídeo.
                </video>
            </div>`;
    } else {
        Player.open(tipo, id);
        html += `<div class="pratica-box" style="text-align:center"><p style="margin:0;font-size:0.9rem">🎧 Reproduzindo <strong>${item.titulo}</strong> na barra inferior</p><p style="margin:0.3rem 0 0;font-size:0.8rem;color:var(--cor-texto-sec)">Use os controles na barra para pausar, ajustar volume ou navegar</p></div>`;
    }

    if (item.saberes_relacionados && item.saberes_relacionados.length > 0) {
        const conectados = item.saberes_relacionados.map(sid => {
            const s = dados.saberes.find(x => x.id === sid);
            return s ? `<span class="tag tag-relacionado" data-saber-id="${s.id}" style="cursor:pointer">${s.titulo}</span>` : '';
        }).filter(Boolean).join(' ');
        if (conectados) {
            html += `<h3 style="margin-top:0">🔗 Saberes Relacionados</h3><div class="card-tags">${conectados}</div>`;
        }
    }

    html += `<p style="margin-top:0.8rem;font-size:0.9rem"><strong>Categoria:</strong> ${item.categoria}</p>`;
    html += `<div class="card-tags" style="margin-top:0.4rem">${item.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>`;

    $(document.getElementById('modalContent'), html);
    abrirModal();
}

// =============================================
// Busca
// =============================================

function buscarSaberes(termo) {
    const info = document.getElementById('buscaInfo');
    if (!termo.trim()) {
        info.textContent = '';
        filtrarCategoria(categoriaAtual);
        return;
    }

    const t = termo.toLowerCase();
    let filtrados = dados.saberes.filter(s =>
        s.titulo.toLowerCase().includes(t) ||
        s.descricao.toLowerCase().includes(t) ||
        s.tags.some(tag => tag.toLowerCase().includes(t))
    );

    if (categoriaAtual !== 'all') {
        filtrados = filtrados.filter(s => s.categoria_id === parseInt(categoriaAtual));
    }

    info.textContent = filtrados.length + ' resultado' + (filtrados.length !== 1 ? 's' : '') + ' encontrado' + (filtrados.length !== 1 ? 's' : '');
    renderizarSaberes(filtrados);
}



// =============================================
// Abertura de Saber (Modal de Conteúdo)
// =============================================

async function abrirSaber(id) {
    try {
        if (!dados || !dados.saberes) {
            tratarErro(new Error('Dados não carregados'), 'Abrir saber');
            return;
        }
        const saber = dados.saberes.find(s => s.id === id);
        if (!saber) return;

        marcarSaberAberto(id);
        salvarContinueLendo(id);
        mostrarContinueLendo();

        // Fecha modal antigo se aberto
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('active');

        const readerOverlay = document.getElementById('readerOverlay');
        const readerTitulo = document.getElementById('readerTitulo');
        const readerContent = document.getElementById('readerContent');
        if (!readerOverlay || !readerContent) return;

        readerTitulo.textContent = saber.titulo;

        // Atualiza navegação
        const saberesDoContexto = categoriaAtual === 'all'
            ? dados.saberes
            : dados.saberes.filter(s => String(s.categoria_id) === categoriaAtual);
        const saberIdx = saberesDoContexto.findIndex(s => s.id === id);
        const prevSaber = saberIdx > 0 ? saberesDoContexto[saberIdx - 1] : null;
        const nextSaber = saberIdx !== -1
            ? saberesDoContexto[saberIdx + 1] || saberesDoContexto[0]
            : null;
        document.getElementById('readerPrevBtn').disabled = !prevSaber;
        document.getElementById('readerNextBtn').disabled = !nextSaber || nextSaber.id === id;
        window._readerContexto = saberesDoContexto;
        window._readerIdx = saberIdx;

        let html = `<div class="reader-meta">
            <span>📖 ${saber.fonte}</span>
            <span>⏱️ ${saber.duracao} min</span>
            <span>🏷️ ${saber.nivel}</span>
        </div>`;

        // Lazy loading do conteúdo
        if (!saber.conteudo) {
            html += `<div id="loading-conteudo" style="text-align:center;padding:3rem">
                <div class="skeleton" style="height:80px;margin-bottom:1rem"></div>
                <p style="color:var(--cor-texto-sec)">Carregando conteúdo...</p>
            </div>`;
            readerContent.innerHTML = html;
            readerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            try {
                const res = await fetch(`/api/saberes/${id}/conteudo`);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json();
                saber.conteudo = data.conteudo;
                html = `<div class="reader-meta">
                    <span>📖 ${saber.fonte}</span>
                    <span>⏱️ ${saber.duracao} min</span>
                    <span>🏷️ ${saber.nivel}</span>
                </div>`;
            } catch (e) {
                tratarErro(e, 'Carregar conteúdo');
                readerContent.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--cor-destaque)">Erro ao carregar conteúdo.</p>`;
                return;
            }
        }

        // Descrição
        html += `<p style="font-size:1.05rem;margin-bottom:1.5rem;color:var(--cor-texto-sec)"><em>${saber.descricao}</em></p>`;

        if (saber.conteudo) {
            for (const [key, val] of Object.entries(saber.conteudo)) {
                const handler = contentHandlers[key];
                if (handler) {
                    html += handler(val);
                }
            }
        }

        if (Array.isArray(saber.praticas) && saber.praticas.length > 0) {
            html += `<h3>🧘 Práticas</h3>`;
            saber.praticas.forEach(p => {
                html += `<div class="pratica-box"><h4>${p.titulo}</h4><p>${p.instrucoes.replace(/\n/g, '<br>')}</p><p style="margin-top:0.5rem;font-size:0.85rem;color:var(--cor-texto-sec)"><em>⏱️ ${p.duracao} min | 🔄 ${p.frequencia}</em></p></div>`;
            });
        }

        if (Array.isArray(saber.conexoes) && saber.conexoes.length > 0) {
            const conectados = saber.conexoes.map(cid => {
                const s = dados.saberes.find(x => x.id === cid);
                return s ? `<span class="tag tag-relacionado" data-saber-id="${s.id}">${s.titulo}</span>` : '';
            }).filter(Boolean).join(' ');
            if (conectados) {
                html += `<h3>🔗 Conexões</h3><div>${conectados}</div>`;
            }
        }

        if (saber.categoria_id === 6) {
            html += `<a href="apocrifos.html#${saber.id}" style="display:inline-block;margin-top:1rem;padding:0.5rem 1rem;background:var(--cor-card);border:1px solid var(--cor-borda);border-radius:var(--radius);text-decoration:none;color:var(--cor-texto)">📖 Texto completo em Apócrifos</a>`;
        }

        // Próximo Saber (no fim do conteúdo)
        if (nextSaber && nextSaber.id !== id) {
            html += `<div class="reader-next-section">
                <h3>📌 Continuar Jornada</h3>
                <div class="reader-next-card" tabindex="0" role="button" data-next-saber="${nextSaber.id}" aria-label="Próximo: ${nextSaber.titulo}">
                    <div class="reader-next-icon">${CAT_EMOJIS[nextSaber.categoria_id] || '📖'}</div>
                    <div class="reader-next-info">
                        <div class="reader-next-label">Próximo ${dados.categorias.find(c => c.id === nextSaber.categoria_id)?.nome || 'Saber'}</div>
                        <div class="reader-next-titulo">${nextSaber.titulo}</div>
                    </div>
                    <div class="reader-next-arrow">→</div>
                </div>
            </div>`;
        }

        // Ações
        html += `<div class="reader-actions">
            <button class="reader-btn" data-compartilhar="${saber.id}">📤 Compartilhar</button>
            <button class="reader-btn" data-fav-id="${saber.id}">${isFavorito(saber.id) ? '❤️ Favoritado' : '🤍 Favoritar'}</button>
        </div>`;

        readerContent.innerHTML = html;
        readerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        readerOverlay.querySelector('.reader-body').scrollTop = 0;
        document.getElementById('readerProgressFill').style.width = '0%';

        // Foco no conteúdo
        readerContent.querySelector('p')?.focus();
    } catch (erro) {
        tratarErro(erro, 'Abrir saber');
    }
}

function fecharLeitor() {
    const readerOverlay = document.getElementById('readerOverlay');
    if (readerOverlay) readerOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function navegarSaber(delta) {
    const idx = window._readerIdx;
    const ctx = window._readerContexto;
    if (!ctx || idx === undefined) return;
    const target = ctx[idx + delta];
    if (target) {
        abrirSaber(target.id);
    }
}

// Barra de progresso do leitor
const readerBody = document.getElementById('readerBody');
if (readerBody) {
    readerBody.addEventListener('scroll', function () {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight - this.clientHeight;
        const pct = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
        document.getElementById('readerProgressFill').style.width = pct + '%';
    }, { passive: true });
}

// =============================================
// Modal (Abrir/Fechar/Gerenciamento de Foco)
// =============================================

function abrirModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) {
        console.error('modalOverlay não encontrado');
        return;
    }
    ultimoElementoFocado = document.activeElement;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

// Event listener para trap de foco no modal (só quando o elemento existir)
const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
    modalOverlay.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        const modal = this.querySelector('.modal');
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
    if (e.target && e.target.id === 'modalOverlay') {
        fecharModalBtn();
    }
}

function fecharModalBtn() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    if (ultimoElementoFocado) {
        ultimoElementoFocado.focus();
    }
}

// =============================================
// Utilitários (Busca, Tema, Aleatório)
// =============================================

function toggleBusca() {
    const container = document.getElementById('buscaContainer');
    const isVisible = container.style.display !== 'none';
    container.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        document.getElementById('buscaInput').focus();
    }
}

function toggleTema() {
    document.body.classList.toggle('modo-claro');
    const tema = document.body.classList.contains('modo-claro') ? 'claro' : 'escuro';
    localStorage.setItem('tema', tema);
}

function saberAleatorio() {
    if (!dados || !dados.saberes || dados.saberes.length === 0) return;
    const idx = Math.floor(Math.random() * dados.saberes.length);
    abrirSaber(dados.saberes[idx].id);
}

// =============================================
// Autenticação
// =============================================

// =============================================
// Autenticação (Login/Logout)
// =============================================

function getToken() {
    return localStorage.getItem('adminToken');
}

function isAutenticado() {
    return !!getToken();
}

function toggleLogin() {
    const container = document.getElementById('loginContainer');
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
        return;
    }
    const main = document.querySelector('.main');
    const div = document.createElement('section');
    div.id = 'loginContainer';
    div.style.cssText = 'margin-bottom:2rem;padding:1.5rem;max-width:400px;margin-left:auto;margin-right:auto;background:var(--cor-card);border:1px solid var(--cor-borda);border-radius:var(--radius)';
    $(div, `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h3 style="margin:0">🔐 Admin</h3>
            <button data-action="close-login" style="background:none;border:1px solid var(--cor-borda);color:var(--cor-texto-sec);padding:0.3rem 0.6rem;border-radius:4px;cursor:pointer">✕</button>
        </div>
        ${isAutenticado() ? `
            <p style="color:var(--cor-ciencia);margin-bottom:0.8rem">✅ Conectado como administrador</p>
            <button data-action="logout" class="pilar-btn active" style="background:#f85149;color:#fff;border:none;padding:0.5rem 1rem;border-radius:var(--radius);cursor:pointer;width:100%">Sair</button>
        ` : `
            <form id="formLogin" style="display:grid;gap:0.8rem">
                <input type="password" id="inputSenha" class="busca-input" placeholder="Senha de administrador" required autofocus>
                <button type="submit" class="pilar-btn active" style="background:var(--cor-destaque);color:#fff;border:none;padding:0.5rem 1rem;border-radius:var(--radius);cursor:pointer">Entrar</button>
            </form>
            <div id="loginStatus" style="margin-top:0.5rem;font-size:0.85rem;color:var(--cor-texto-sec)"></div>
        `}
    `);
    main.insertBefore(div, main.querySelector('.pilares').nextSibling);

    const form = document.getElementById('formLogin');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const status = document.getElementById('loginStatus');
            status.textContent = 'Autenticando...';
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ senha: document.getElementById('inputSenha').value }),
                });
                if (!res.ok) throw new Error('Senha incorreta');
                const data = await res.json();
                localStorage.setItem('adminToken', data.token);
                status.textContent = '✅ Conectado!';
                status.style.color = '#7ee787';
                setTimeout(() => { div.style.display = 'none'; atualizarBotaoAdmin(); }, 500);
            } catch (err) {
                status.textContent = '❌ ' + err.message;
                status.style.color = '#f85149';
            }
        });
    }
}

function logout() {
    const token = getToken();
    if (token) {
        fetch('/api/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
    }
    localStorage.removeItem('adminToken');
    const container = document.getElementById('loginContainer');
    if (container) container.style.display = 'none';
    atualizarBotaoAdmin();
}

function atualizarBotaoAdmin() {
    const btn = document.getElementById('btnAdmin');
    if (btn) {
        btn.textContent = isAutenticado() ? '🔐' : '🔓';
        btn.title = isAutenticado() ? 'Admin — Painel de controle' : 'Admin — Fazer login';
    }
}

// =============================================
// =============================================
// Admin — CRUD de Saberes via API
// =============================================
// =============================================

function toggleAdmin() {
    if (!isAutenticado()) {
        toggleLogin();
        return;
    }
    const container = document.getElementById('adminContainer');
    if (!container) {
        criarAdminPanel();
    } else {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
}

function criarAdminPanel() {
    const main = document.querySelector('.main');
    const panel = document.createElement('section');
    panel.id = 'adminContainer';
    panel.style.cssText = 'display:block;margin-bottom:2rem;padding:1.5rem;background:var(--cor-card);border:1px solid var(--cor-borda);border-radius:var(--radius)';

    const catOptions = dados && dados.categorias
        ? dados.categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')
        : '';

    $(panel, `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h3 style="margin:0">📝 Admin — Adicionar Saber</h3>
            <div style="display:flex;gap:0.5rem">
                <span style="font-size:0.8rem;color:var(--cor-ciencia)">✅ Admin</span>
                <button data-action="logout" style="background:none;border:1px solid var(--cor-borda);color:var(--cor-texto-sec);padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;font-size:0.8rem">Sair</button>
                <button data-action="close-admin" style="background:none;border:1px solid var(--cor-borda);color:var(--cor-texto-sec);padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer">✕</button>
            </div>
        </div>
        <form id="formSaber" style="display:grid;gap:0.8rem">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem">
                <label for="inputTitulo" class="sr-only">Título do saber</label>
                <input type="text" id="inputTitulo" class="busca-input" placeholder="Título" required>
                <label for="inputCategoria" class="sr-only">Categoria</label>
                <select id="inputCategoria" class="busca-input" required>
                    <option value="">Categoria</option>
                    ${catOptions}
                </select>
            </div>
            <label for="inputDescricao" class="sr-only">Descrição</label>
            <textarea id="inputDescricao" class="busca-input" placeholder="Descrição" rows="2" required></textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.8rem">
                <label for="inputNivel" class="sr-only">Nível</label>
                <select id="inputNivel" class="busca-input">
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                </select>
                <label for="inputFonte" class="sr-only">Fonte</label>
                <input type="text" id="inputFonte" class="busca-input" placeholder="Fonte">
                <label for="inputTags" class="sr-only">Tags</label>
                <input type="text" id="inputTags" class="busca-input" placeholder="Tags (separadas por vírgula)">
            </div>
            <button type="submit" class="pilar-btn active" style="background:var(--cor-destaque);color:#fff;border:none;padding:0.6rem 1rem;border-radius:var(--radius);cursor:pointer;font-size:0.9rem">
                + Adicionar Saber
            </button>
        </form>
        <div id="adminStatus" style="margin-top:0.5rem;font-size:0.85rem"></div>
    `);

    main.insertBefore(panel, main.querySelector('.pilares').nextSibling);

    document.getElementById('formSaber').addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.getElementById('adminStatus');
        status.textContent = 'Salvando...';
        status.style.color = 'var(--cor-texto-sec)';

        const tags = document.getElementById('inputTags').value
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);

        const body = {
            titulo: document.getElementById('inputTitulo').value.trim(),
            descricao: document.getElementById('inputDescricao').value.trim(),
            categoria_id: parseInt(document.getElementById('inputCategoria').value),
            nivel: document.getElementById('inputNivel').value,
            fonte: document.getElementById('inputFonte').value.trim(),
            tags,
        };

        try {
            const res = await fetch('/api/saberes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken(),
                },
                body: JSON.stringify(body),
            });
            if (res.status === 401) {
                localStorage.removeItem('adminToken');
                panel.style.display = 'none';
                toggleLogin();
                throw new Error('Sessão expirada. Faça login novamente.');
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const criado = await res.json();
            status.textContent = `✅ "${criado.titulo}" criado com sucesso!`;
            status.style.color = '#7ee787';
            document.getElementById('formSaber').reset();
            carregarDados();
        } catch (err) {
            status.textContent = '❌ Erro: ' + err.message;
            status.style.color = '#f85149';
        }
    });
}

// =============================================
// Event Delegation (clicks)
// =============================================

document.addEventListener('click', function (e) {
  try {
    // Botão voltar do leitor
    if (e.target.closest('#readerBackBtn')) {
      fecharLeitor();
      return;
    }

    // Navegação anterior/próximo no leitor
    if (e.target.closest('#readerPrevBtn')) {
      navegarSaber(-1);
      return;
    }
    if (e.target.closest('#readerNextBtn')) {
      navegarSaber(1);
      return;
    }

    // Próximo saber (dentro do conteúdo)
    const next = e.target.closest('[data-next-saber]');
    if (next) {
      abrirSaber(next.dataset.nextSaber);
      return;
    }

    // Card de saber na grid
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
    if (midia) {
      abrirMidia(midia.dataset.midiaTipo, midia.dataset.midiaId);
      return;
    }

    const share = e.target.closest('[data-compartilhar]');
    if (share) {
      compartilharSaber(share.dataset.compartilhar);
      return;
    }

    const favModal = e.target.closest('[data-fav-id]');
    if (favModal) {
      const id = favModal.dataset.favId;
      toggleFavorito(id, e);
      favModal.textContent = isFavorito(id) ? '❤️ Favoritado' : '🤍 Favoritar';
      return;
    }

    const relac = e.target.closest('.tag-relacionado');
    if (relac) {
      fecharLeitor();
      abrirSaber(relac.dataset.saberId);
      return;
    }

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
  } catch (erro) {
    tratarErro(erro, 'Navegação');
  }
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

// Botão Admin no header
document.addEventListener('DOMContentLoaded', async () => {
    const header = document.querySelector('.header-actions');
    if (!header) return;

    const btn = document.createElement('button');
    btn.id = 'btnAdmin';
    btn.className = 'btn-icon';
    btn.title = 'Admin';
    btn.textContent = '🔓';
    btn.onclick = toggleAdmin;
    header.insertBefore(btn, header.firstChild);

    if (getToken()) {
        try {
            const res = await fetch('/api/verificar', {
                headers: { 'Authorization': 'Bearer ' + getToken() },
            });
            const data = await res.json();
            if (!data.autenticado) {
                localStorage.removeItem('adminToken');
            }
            atualizarBotaoAdmin();
        } catch {
            localStorage.removeItem('adminToken');
            atualizarBotaoAdmin();
        }
    }
});
// =============================================
// Exportar funções para window (legado — inline onclick)
// =============================================
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
window.toggleTema = toggleTema;
window.mostrarAtalhos = mostrarAtalhos;
window.mudarPagina = mudarPagina;
window.fecharContinue = fecharContinue;
window.toggleLogin = toggleLogin;
window.toggleAdmin = toggleAdmin;
