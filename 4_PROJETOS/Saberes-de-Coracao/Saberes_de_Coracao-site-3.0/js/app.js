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
// Estado Global
// =============================================

let dados = null;
let categoriaAtual = 'all';
let ultimoElementoFocado = null;
let continueSaberId = null;

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
        <div class="saber-dia-card" onclick="abrirSaber('${escolha.id}')" onkeydown="if(event.key==='Enter')abrirSaber('${escolha.id}')" tabindex="0" role="button" aria-label="Saber do dia: ${escolha.titulo}">
            <div class="saber-dia-label">☀️ Saber do Dia</div>
            <div class="saber-dia-quote">${citacaoUsar}</div>
            <div class="saber-dia-fonte">— ${escolha.titulo}</div>
        </div>`);
}

function extrairCitacaoImpactante(saber) {
    if (!saber.conteudo) return saber.descricao;

    if (saber.conteudo.citacoes && saber.conteudo.citacoes.length > 0) {
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
    if (tipo === 'sucesso') toast.style.color = '#7ee787';
    else if (tipo === 'erro') toast.style.color = '#f85149';
    toast.textContent = mensagem;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 2500);
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
    if (e.key === 'Escape') { fecharModalBtn(); return; }
    if (e.key === '?') { e.preventDefault(); mostrarAtalhos(); return; }
    if (e.key === '/') { e.preventDefault(); toggleBusca(); return; }
    if (e.key === 'd' || e.key === 'D') { e.preventDefault(); saberAleatorio(); return; }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); toggleTema(); return; }
});

window.addEventListener('DOMContentLoaded', async () => {
    Player.init();

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
        Player.restoreState();
        saberDoDia();
        mostrarContinueLendo();
    });
});

window.addEventListener('beforeunload', () => Player.saveState());
window.addEventListener('pagehide', () => Player.saveState());

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
    const grid = document.getElementById('cardsGrid');
    console.log('Grid encontrado:', !!grid);

    const cache = carregarDadosCache();
    if (cache) {
        console.log('Usando cache do localStorage');
        dados = cache;
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
            salvarDadosCache(novosDados);
            atualizarEstatisticas();
            if (grid) {
                console.log('Renderizando saberes novos:', dados.saberes?.length);
                renderizarSaberes(dados.saberes);
            }
            saberDoDia();
        } else {
            console.log('Dados em cache estão atualizados');
        }
    } catch (e) {
        console.error('Erro ao carregar dados da API:', e);
        // Fallback: tentar carregar JSON diretamente
        if (!cache) {
            try {
                console.log('Tentando fallback para JSON direto...');
                const jsonResponse = await fetch('/data/dados-unificados.json');
                if (!jsonResponse.ok) throw new Error('HTTP ' + jsonResponse.status);
                const dadosJson = await jsonResponse.json();
                console.log('Dados JSON recebidos:', dadosJson.meta?.versao, 'saberes:', dadosJson.saberes?.length);
                dados = dadosJson;
                salvarDadosCache(dadosJson);
                atualizarEstatisticas();
                if (grid) {
                    console.log('Renderizando saberes do JSON:', dados.saberes?.length);
                    renderizarSaberes(dados.saberes);
                }
                saberDoDia();
            } catch (fallbackError) {
                console.error('Fallback também falhou:', fallbackError);
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
    console.log('renderizarSaberes chamado com:', saberes?.length, 'saberes');
    const grid = document.getElementById('cardsGrid');
    console.log('Grid no renderizarSaberes:', !!grid);
    if (!grid) {
        console.error('Grid não encontrado!');
        return;
    }
    grid.className = 'cards-grid';

    if (!saberes || saberes.length === 0) {
        console.log('Nenhum saber para renderizar');
        $(grid, '<div class="empty-state"><div class="empty-state-icon">📚</div><p>Nenhum saber encontrado</p></div>');
        esconderSkeleton();
        return;
    }

    console.log('Renderizando', saberes.length, 'saberes');
    const favs = getFavoritos();
    const abertos = getSaberesAbertos();
    const cardsHtml = saberes.map(saber => {
        const isNovo = !abertos.includes(saber.id);
        const isVisited = abertos.includes(saber.id);
        const catIcon = CAT_EMOJIS[saber.categoria_id] || '📖';
        return `
            <div class="card ${isVisited ? 'visited' : ''}" data-cat="${saber.categoria_id}" onclick="abrirSaber('${saber.id}')" onkeydown="if(event.key==='Enter')abrirSaber('${saber.id}')" tabindex="0" role="listitem" aria-label="${saber.titulo}">
                ${isNovo ? '<span class="card-novo">✨ Novo</span>' : ''}
                <button class="card-fav ${favs.includes(saber.id) ? 'active' : ''}" data-id="${saber.id}" onclick="toggleFavorito('${saber.id}', event)" onkeydown="event.stopPropagation()" aria-label="${favs.includes(saber.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${favs.includes(saber.id) ? '❤️' : '🤍'}</button>
                <div class="card-header">
                    <span class="card-titulo"><span class="cat-icon">${catIcon}</span>${saber.titulo}</span>
                    <span class="card-nivel ${saber.nivel}">${saber.nivel}</span>
                </div>
                <p class="card-desc">${saber.descricao}</p>
                <div class="card-meta">
                    <span>⏱️ ${saber.duracao} min</span>
                    <span>📖 ${saber.fonte}</span>
                </div>
                <div class="card-tags">
                    ${saber.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>`;
    }).join('');

    $(grid, cardsHtml);

    console.log('Renderização concluída');
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

    if (cat === 'fav') {
        const favs = getFavoritos();
        const filtrados = dados.saberes.filter(s => favs.includes(s.id));
        renderizarSaberes(filtrados);
        return;
    }

    if (cat === 'all') {
        renderizarSaberes(dados.saberes);
    } else {
        const filtrados = dados.saberes.filter(s => s.categoria_id === parseInt(cat));
        renderizarSaberes(filtrados);
    }
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
            <div class="midia-card" onclick="abrirMidia('audio', '${a.id}')" onkeydown="if(event.key==='Enter')abrirMidia('audio', '${a.id}')" tabindex="0" role="listitem" aria-label="Áudio: ${a.titulo}">
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
            <div class="midia-card" onclick="abrirMidia('video', '${v.id}')" onkeydown="if(event.key==='Enter')abrirMidia('video', '${v.id}')" tabindex="0" role="listitem" aria-label="Vídeo: ${v.titulo}">
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
            return s ? `<span class="tag" style="cursor:pointer" onclick="fecharModalBtn(); setTimeout(() => abrirSaber('${s.id}'), 300)">${s.titulo}</span>` : '';
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
    const saber = dados.saberes.find(s => s.id === id);
    if (!saber) return;

    marcarSaberAberto(id);
    salvarContinueLendo(id);
    mostrarContinueLendo();

    document.getElementById('modalTitulo').textContent = saber.titulo;

    let html = `<p style="font-size:1.05rem;margin-bottom:0.5rem"><strong>${saber.descricao}</strong></p>`;
    html += `<p style="color: var(--cor-texto-sec); margin: 0.5rem 0; font-size: 0.85rem;">Nível: <strong>${saber.nivel}</strong> | Duração: <strong>${saber.duracao} min</strong> | Fonte: ${saber.fonte}</p>`;

    // Lazy loading do conteúdo
    if (!saber.conteudo) {
        html += `<div id="loading-conteudo" style="text-align:center;padding:2rem"><div class="skeleton" style="height:100px;margin-bottom:1rem"></div><p style="color:var(--cor-texto-sec)">Carregando conteúdo...</p></div>`;
        $(document.getElementById('modalContent'), html);
        abrirModal();

        try {
            const res = await fetch(`/api/saberes/${id}/conteudo`);
            if (!res.ok) throw new Error('Erro ao carregar conteúdo');
            const data = await res.json();
            saber.conteudo = data.conteudo;

            html = `<p style="font-size:1.05rem;margin-bottom:0.5rem"><strong>${saber.descricao}</strong></p>`;
            html += `<p style="color: var(--cor-texto-sec); margin: 0.5rem 0; font-size: 0.85rem;">Nível: <strong>${saber.nivel}</strong> | Duração: <strong>${saber.duracao} min</strong> | Fonte: ${saber.fonte}</p>`;
        } catch (e) {
            $(document.getElementById('loading-conteudo'), `<p style="color:var(--cor-destaque)">Erro ao carregar conteúdo: ${e.message}</p>`);
            return;
        }
    }

    if (saber.conteudo) {
        for (const [key, val] of Object.entries(saber.conteudo)) {
            const handler = contentHandlers[key];
            if (handler) {
                html += handler(val);
            }
        }
    }

    if (saber.praticas && saber.praticas.length > 0) {
        html += `<h3>🧘 Práticas</h3>`;
        saber.praticas.forEach(p => {
            html += `<div class="pratica-box"><h4>${p.titulo}</h4><p>${p.instrucoes.replace(/\n/g, '<br>')}</p><p style="margin-top:0.5rem;font-size:0.85rem;color:var(--cor-texto-sec)"><em>⏱️ ${p.duracao} min | 🔄 ${p.frequencia}</em></p></div>`;
        });
    }

    if (saber.conexoes && saber.conexoes.length > 0) {
        const conectados = saber.conexoes.map(cid => {
            const s = dados.saberes.find(x => x.id === cid);
            return s ? `<span class="tag" style="cursor:pointer" onclick="abrirSaber('${s.id}')">${s.titulo}</span>` : '';
        }).filter(Boolean).join(' ');
        if (conectados) {
            html += `<h3>🔗 Conexões</h3><div class="card-tags">${conectados}</div>`;
        }
    }

    if (saber.categoria_id === 6) {
        html += `<a href="apocrifos.html#${saber.id}" class="card-apocrifo-link" style="margin-top:1rem">📖 Texto completo em Apócrifos</a>`;
    }

    // Próximo Saber
    const saberIdx = dados.saberes.findIndex(s => s.id === id);
    const nextSaber = saberIdx !== -1 ? dados.saberes.slice(saberIdx + 1).find(s => s.categoria_id === saber.categoria_id) || dados.saberes.find((s, i) => i !== saberIdx && s.categoria_id === saber.categoria_id) : null;
    if (nextSaber && nextSaber.id !== id) {
        html += `<div class="next-saber-wrap">
            <h3>📌 Continuar Jornada</h3>
            <div class="next-saber-card" onclick="fecharModalBtn();setTimeout(()=>abrirSaber('${nextSaber.id}'),300)" tabindex="0" role="button" aria-label="Próximo: ${nextSaber.titulo}">
                <div class="next-saber-icon">${CAT_EMOJIS[nextSaber.categoria_id] || '📖'}</div>
                <div class="next-saber-info">
                    <div class="next-saber-label">Próximo ${dados.categorias.find(c => c.id === nextSaber.categoria_id)?.nome || 'Saber'}</div>
                    <div class="next-saber-titulo">${nextSaber.titulo}</div>
                </div>
                <div class="next-saber-arrow">→</div>
            </div>
        </div>`;
    }

    html += `<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--cor-borda);display:flex;gap:0.5rem;flex-wrap:wrap">
        <button class="btn-share" onclick="compartilharSaber('${saber.id}')" aria-label="Compartilhar">📤 Compartilhar</button>
        <button class="btn-share" onclick="toggleFavorito('${saber.id}', event); this.textContent = isFavorito('${saber.id}') ? '❤️ Favoritado' : '🤍 Favoritar'" aria-label="Favoritar">${isFavorito(saber.id) ? '❤️ Favoritado' : '🤍 Favoritar'}</button>
    </div>`;

    $(document.getElementById('modalContent'), html);
    abrirModal();
}

// =============================================
// Modal (Abrir/Fechar/Gerenciamento de Foco)
// =============================================

function abrirModal() {
    ultimoElementoFocado = document.activeElement;
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-close').focus();
}

document.getElementById('modalOverlay').addEventListener('keydown', function(e) {
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

function fecharModal(e) {
    if (e.target.id === 'modalOverlay') {
        fecharModalBtn();
    }
}

function fecharModalBtn() {
    document.getElementById('modalOverlay').classList.remove('active');
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
            <button onclick="this.parentElement.parentElement.style.display='none'" style="background:none;border:1px solid var(--cor-borda);color:var(--cor-texto-sec);padding:0.3rem 0.6rem;border-radius:4px;cursor:pointer">✕</button>
        </div>
        ${isAutenticado() ? `
            <p style="color:var(--cor-ciencia);margin-bottom:0.8rem">✅ Conectado como administrador</p>
            <button onclick="logout()" class="pilar-btn active" style="background:#f85149;color:#fff;border:none;padding:0.5rem 1rem;border-radius:var(--radius);cursor:pointer;width:100%">Sair</button>
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
                <button onclick="logout()" style="background:none;border:1px solid var(--cor-borda);color:var(--cor-texto-sec);padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer;font-size:0.8rem">Sair</button>
                <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="background:none;border:1px solid var(--cor-borda);color:var(--cor-texto-sec);padding:0.2rem 0.5rem;border-radius:4px;cursor:pointer">✕</button>
            </div>
        </div>
        <form id="formSaber" style="display:grid;gap:0.8rem">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem">
                <input type="text" id="inputTitulo" class="busca-input" placeholder="Título" required>
                <select id="inputCategoria" class="busca-input" required>
                    <option value="">Categoria</option>
                    ${catOptions}
                </select>
            </div>
            <textarea id="inputDescricao" class="busca-input" placeholder="Descrição" rows="2" required></textarea>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.8rem">
                <select id="inputNivel" class="busca-input">
                    <option value="iniciante">Iniciante</option>
                    <option value="intermediario">Intermediário</option>
                    <option value="avancado">Avançado</option>
                </select>
                <input type="text" id="inputFonte" class="busca-input" placeholder="Fonte">
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