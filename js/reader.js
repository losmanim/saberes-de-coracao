function atualizarPaginacao() {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationInfo = document.getElementById('paginationInfo');
    if (!pagination) return;
    const saberesFiltrados = obterSaberesFiltrados();
    totalPaginas = Math.ceil(saberesFiltrados.length / ITENS_POR_PAGINA);
    if (totalPaginas <= 1) { pagination.hidden = true; return; }
    pagination.hidden = false;
    prevBtn.disabled = paginaAtual === 1;
    nextBtn.disabled = paginaAtual === totalPaginas;
    paginationInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

function mudarPagina(delta) {
    const saberesFiltrados = obterSaberesFiltrados();
    totalPaginas = Math.ceil(saberesFiltrados.length / ITENS_POR_PAGINA);
    const novaPagina = paginaAtual + delta;
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    paginaAtual = novaPagina;
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const saberesPagina = saberesFiltrados.slice(inicio, fim);
    renderizarSaberes(saberesPagina);
    atualizarPaginacao();
    document.getElementById('cardsGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function obterSaberesFiltrados() {
    if (!dados || !dados.saberes) return [];
    todosSaberes = dados.saberes.map(normalizarSaber);
    if (categoriaAtual === 'all') return todosSaberes.filter(s => s.categoria_id !== CAT_APOCRIFOS);
    if (categoriaAtual === 'fav') {
        const favs = getFavoritos();
        return todosSaberes.filter(s => favs.includes(s.id));
    }
    return todosSaberes.filter(s => String(s.categoria_id) === categoriaAtual);
}

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
                    ${s.tags.slice(0, 4).map(tag => `<span class="tag">#${tag}</span>`).join('')}
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

function filtrarCategoria(cat) {
    categoriaAtual = cat;
    paginaAtual = 1;
    document.querySelectorAll('.pilar-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (btn.dataset.cat === cat) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    if (cat === 'midia') { renderizarMidia(); return; }
    const saberesFiltrados = obterSaberesFiltrados();
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    renderizarSaberes(saberesFiltrados.slice(inicio, fim));
    atualizarPaginacao();
}

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
                    ${normalizarTags(a).map(t => `<span class="midia-tag">#${t}</span>`).join('')}
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
                    ${normalizarTags(v).map(t => `<span class="midia-tag">#${t}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
    if (!html) html = '<div class="empty-state"><div class="empty-state-icon">🎵</div><p>Nenhuma multimídia disponível</p></div>';
    document.getElementById('modalTitulo').textContent = '🎵 Multimídia';
    $(document.getElementById('modalContent'), html);
    abrirModal();
    esconderSkeleton();
    aplicarReveal();
}

function abrirMidia(tipo, id) {
    const lista = tipo === 'audio' ? dados.midia.audios : dados.midia.videos;
    const item = lista ? lista.find(m => m.id === id) : null;
    if (!item) return;
    document.getElementById('modalTitulo').textContent = item.titulo;
    let html = '';
    if (tipo === 'video') {
        const src = window.Utils.buildMidiaUrl(item, tipo);
        html += `
            <div class="player-container" style="margin-bottom:1rem">
                <video id="playerVideo" controls autoplay style="width:100%;max-height:70vh;border-radius:var(--radius);background:#000">
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

function buscarSaberes(termo) {
    const info = document.getElementById('buscaInfo');
    const pagination = document.getElementById('pagination');
    if (!termo.trim()) {
        info.textContent = '';
        const saberesFiltrados = obterSaberesFiltrados();
        const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
        const fim = inicio + ITENS_POR_PAGINA;
        renderizarSaberes(saberesFiltrados.slice(inicio, fim));
        atualizarPaginacao();
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
    if (pagination) pagination.hidden = true;
    info.textContent = filtrados.length + ' resultado' + (filtrados.length !== 1 ? 's' : '') + ' encontrado' + (filtrados.length !== 1 ? 's' : '');
    renderizarSaberes(filtrados);
}

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
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('active');
        const readerOverlay = document.getElementById('readerOverlay');
        const readerTitulo = document.getElementById('readerTitulo');
        const readerContent = document.getElementById('readerContent');
        if (!readerOverlay || !readerContent) return;
        readerTitulo.textContent = saber.titulo;
        const saberesDoContexto = categoriaAtual === 'all'
            ? dados.saberes.filter(s => s.categoria_id !== CAT_APOCRIFOS)
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
        html += `<p style="font-size:1.05rem;margin-bottom:1.5rem;color:var(--cor-texto-sec)"><em>${saber.descricao}</em></p>`;
        html += window.Utils.renderizarConteudo(saber.conteudo);
        html += window.Utils.renderizarPraticas(saber.praticas);
        html += window.Utils.renderizarConexoes(saber.conexoes, dados.saberes);
        if (saber.categoria_id === CAT_APOCRIFOS) {
            html += `<a href="apocrifos.html#${saber.id}" style="display:inline-block;margin-top:1rem;padding:0.5rem 1rem;background:var(--cor-card);border:1px solid var(--cor-borda);border-radius:var(--radius);text-decoration:none;color:var(--cor-texto)">📖 Texto completo em Apócrifos</a>`;
        }
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
        html += `<div class="reader-actions">
            <button class="reader-btn" data-compartilhar="${saber.id}">📤 Compartilhar</button>
            <button class="reader-btn" data-fav-id="${saber.id}">${isFavorito(saber.id) ? '❤️ Favoritado' : '🤍 Favoritar'}</button>
        </div>`;
        readerContent.innerHTML = html;
        readerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        readerOverlay.querySelector('.reader-body').scrollTop = 0;
        document.getElementById('readerProgressFill').style.width = '0%';
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
    if (target) abrirSaber(target.id);
}

const readerBody = document.getElementById('readerBody');
if (readerBody) {
    readerBody.addEventListener('scroll', function () {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight - this.clientHeight;
        const pct = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
        document.getElementById('readerProgressFill').style.width = pct + '%';
    }, { passive: true });
}
