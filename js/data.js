function saberDoDia() {
    const el = document.getElementById('saberDoDia');
    if (!el || !dados || !dados.saberes) return;
    const hoje = new Date().toDateString();
    const salvo = localStorage.getItem(SABER_DIA_KEY);
    let escolha, citacaoUsar;
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
        const saberesPrincipais = dados.saberes.filter(s => s.categoria_id !== CAT_APOCRIFOS);
        const idx = Math.floor(Math.random() * saberesPrincipais.length);
        escolha = saberesPrincipais[idx];
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

const extrairCitacaoImpactante = window.Utils.extrairCitacaoImpactante;

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
    if (event) event.stopPropagation();
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

function salvarContinueLendo(id) {
    try {
        localStorage.setItem(CONTINUE_KEY, JSON.stringify({ id, data: Date.now() }));
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

function compartilharSaber(id) {
    if (!dados) return;
    const saber = dados.saberes.find(s => s.id === id);
    if (saber) window.Utils.compartilharConteudo(saber.titulo, saber.descricao);
}

function carregarDadosCache() {
    try {
        const raw = localStorage.getItem(DADOS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.saberes) return null;
        return parsed;
    } catch { return null; }
}

function salvarDadosCache(dados) {
    try {
        localStorage.setItem(DADOS_CACHE_KEY, JSON.stringify(dados));
        if (dados.meta && dados.meta.versao) {
            localStorage.setItem(DADOS_CACHE_VERSAO_KEY, dados.meta.versao);
        }
    } catch {}
}

async function carregarDados() {
    let grid = document.getElementById('cardsGrid');
    if (!grid) {
        await new Promise(r => setTimeout(r, 100));
        grid = document.getElementById('cardsGrid');
    }
    const cache = carregarDadosCache();
    if (cache) {
        dados = cache;
        window.dados = dados;
        if (dados && dados.saberes) dados.saberes = dados.saberes.map(normalizarSaber);
        atualizarEstatisticas();
        if (grid) {
            const saberesFiltrados = obterSaberesFiltrados();
            const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
            const fim = inicio + ITENS_POR_PAGINA;
            renderizarSaberes(saberesFiltrados.slice(inicio, fim));
            atualizarPaginacao();
        }
        saberDoDia();
    }
    try {
        const response = await fetch('/api/dados');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const novosDados = await response.json();
        const versaoAtual = localStorage.getItem(DADOS_CACHE_VERSAO_KEY);
        const novaVersao = novosDados.meta && novosDados.meta.versao;
        if (!cache || (novaVersao && novaVersao !== versaoAtual)) {
            dados = novosDados;
            window.dados = dados;
            if (dados && dados.saberes) dados.saberes = dados.saberes.map(normalizarSaber);
            salvarDadosCache(novosDados);
            atualizarEstatisticas();
            const gridAtualizado = document.getElementById('cardsGrid');
            if (gridAtualizado) {
                const saberesFiltrados = obterSaberesFiltrados();
                const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
                const fim = inicio + ITENS_POR_PAGINA;
                renderizarSaberes(saberesFiltrados.slice(inicio, fim));
                atualizarPaginacao();
            }
            saberDoDia();
        } else {
            const gridAtualizado = document.getElementById('cardsGrid');
            if (gridAtualizado) {
                const saberesFiltrados = obterSaberesFiltrados();
                const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
                const fim = inicio + ITENS_POR_PAGINA;
                renderizarSaberes(saberesFiltrados.slice(inicio, fim));
                atualizarPaginacao();
            }
        }
    } catch (e) {
        tratarErro(e, 'Carregar dados');
        if (!cache) {
            try {
                const jsonResponse = await fetch('/data/dados-unificados.json');
                if (!jsonResponse.ok) throw new Error('HTTP ' + jsonResponse.status);
                const dadosJson = await jsonResponse.json();
                dados = dadosJson;
                window.dados = dados;
                if (dados && dados.saberes) dados.saberes = dados.saberes.map(normalizarSaber);
                salvarDadosCache(dados);
                atualizarEstatisticas();
                const gridFallback = document.getElementById('cardsGrid');
                if (gridFallback) {
                    const saberesFiltrados = obterSaberesFiltrados();
                    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
                    const fim = inicio + ITENS_POR_PAGINA;
                    renderizarSaberes(saberesFiltrados.slice(inicio, fim));
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
    const nSaberes = dados.saberes ? dados.saberes.filter(s => s.categoria_id !== CAT_APOCRIFOS).length : 0;
    const nPraticas = dados.praticas ? dados.praticas.length : 0;
    const nMidia = (dados.midia ? (dados.midia.audios ? dados.midia.audios.length : 0) : 0) +
        (dados.midia ? (dados.midia.videos ? dados.midia.videos.length : 0) : 0);
    const el = id => document.getElementById(id);
    animarContagem(el('statSaberes'), nSaberes);
    animarContagem(el('statPraticas'), nPraticas);
    animarContagem(el('statMidia'), nMidia);
}
