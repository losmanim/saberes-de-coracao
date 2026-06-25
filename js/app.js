// =============================================
// Constantes
// =============================================

const DADOS_CACHE_KEY = 'saberes_cache';
const DADOS_CACHE_VERSAO_KEY = 'saberes_cache_versao';
const FAVORITOS_KEY = 'saberes_favoritos';
const SABER_DIA_KEY = 'saberes_saber_dia';
const CONTINUE_KEY = 'saberes_continue';

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

    el.innerHTML = `
        <div class="saber-dia-card" onclick="abrirSaber('${escolha.id}')" onkeydown="if(event.key==='Enter')abrirSaber('${escolha.id}')" tabindex="0" role="button" aria-label="Saber do dia: ${escolha.titulo}">
            <div class="saber-dia-label">☀️ Saber do Dia</div>
            <div class="saber-dia-quote">${citacaoUsar}</div>
            <div class="saber-dia-fonte">— ${escolha.titulo}</div>
        </div>`;
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
    } else {
        favs.splice(idx, 1);
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
                    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💔</div><p>Nenhum favorito ainda</p><p style="font-size:0.8rem;color:var(--cor-texto-sec);margin-top:0.5rem">Clique no 🤍 nos cards para adicionar</p></div>';
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
            const status = document.getElementById('adminStatus') || document.createElement('div');
            if (!status.id) {
                status.id = 'shareStatus';
                status.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--cor-card);border:1px solid var(--cor-borda);padding:0.5rem 1rem;border-radius:var(--radius);font-size:0.85rem;z-index:999;color:var(--cor-texto)';
                document.body.appendChild(status);
            }
            status.textContent = '✅ Link copiado!';
            status.style.display = 'block';
            setTimeout(() => { status.style.display = 'none'; }, 2500);
        } catch {}
        document.body.removeChild(temp);
    }
}

// =============================================
// Atalhos do Teclado
// =============================================

function mostrarAtalhos() {
    document.getElementById('modalTitulo').textContent = '⌨️ Atalhos do Teclado';
    document.getElementById('modalContent').innerHTML = `
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
        <p style="margin-top:1rem;font-size:0.8rem;color:var(--cor-texto-sec)">Atalhos funcionam quando nenhum input está focado.</p>`;
    abrirModal();
}

// =============================================
// Player de Mídia (áudio/vídeo)
// =============================================

const Player = {
    currentList: [],
    currentIndex: -1,
    currentItem: null,
    isPlaying: false,

    init() {
        const audio = document.getElementById('playerAudio');
        const playPause = document.getElementById('playerPlayPause');
        const prev = document.getElementById('playerPrev');
        const next = document.getElementById('playerNext');
        const closeBtn = document.getElementById('playerClose');
        const muteBtn = document.getElementById('playerMute');
        const volumeSlider = document.getElementById('playerVolumeSlider');
        const seekSlider = document.getElementById('playerSeekSlider');
        const progressWrap = document.getElementById('playerProgressWrap');

        playPause.addEventListener('click', () => this.togglePlay());
        prev.addEventListener('click', () => this.prev());
        next.addEventListener('click', () => this.next());
        closeBtn.addEventListener('click', () => this.close());
        muteBtn.addEventListener('click', () => this.toggleMute());

        volumeSlider.addEventListener('input', e => {
            audio.volume = parseFloat(e.target.value);
            this.updateMuteIcon();
        });

        audio.addEventListener('timeupdate', () => {
            if (!audio.duration) return;
            const pct = (audio.currentTime / audio.duration) * 100;
            document.getElementById('playerProgressBar').style.width = pct + '%';
            document.getElementById('playerSeekSlider').value = pct;
            document.getElementById('playerTimeCurrent').textContent = this.formatTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
            document.getElementById('playerTimeTotal').textContent = this.formatTime(audio.duration);
        });

        audio.addEventListener('ended', () => {
            this.next();
        });

        audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayBtn();
        });

        audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayBtn();
        });

        seekSlider.addEventListener('input', e => {
            if (!audio.duration) return;
            audio.currentTime = (parseFloat(e.target.value) / 100) * audio.duration;
        });

        document.getElementById('playerProgressWrap').addEventListener('click', e => {
            if (!audio.duration || e.target.tagName === 'INPUT') return;
            const rect = progressWrap.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pct * audio.duration;
        });

        document.addEventListener('keydown', e => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const bar = document.getElementById('playerBar');
            if (bar.hasAttribute('hidden')) return;

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'p':
                case 'P':
                    this.prev();
                    break;
                case 'n':
                case 'N':
                    this.next();
                    break;
                case 'm':
                case 'M':
                    this.toggleMute();
                    break;
            }
        });
    },

    buildList(tipo) {
        if (!dados || !dados.midia) return [];
        if (tipo === 'audio') return dados.midia.audios || [];
        return dados.midia.videos || [];
    },

    open(tipo, id) {
        const list = this.buildList(tipo);
        const index = list.findIndex(m => m.id === id);
        if (index === -1) return;

        this.currentList = list;
        this.currentIndex = index;
        this.currentItem = list[index];

        // Verifica se o arquivo já é uma URL completa (Cloudinary)
        let src;
        if (this.currentItem.arquivo.startsWith('http')) {
            src = this.currentItem.arquivo;
        } else {
            const baseDir = window.midiaBaseUrl;
            const partes = this.currentItem.arquivo.split('/');
            const arquivoCod = partes.map(encodeURIComponent).join('/');
            src = baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;
        }

        const audio = document.getElementById('playerAudio');
        const bar = document.getElementById('playerBar');

        audio.onerror = () => {
            alert('Arquivo não encontrado: ' + src);
            this.close();
        };

        audio.src = src;
        audio.load();

        bar.removeAttribute('hidden');
        document.body.classList.add('player-active');

        document.getElementById('playerIcon').textContent = tipo === 'audio' ? '🎧' : '🎬';
        document.getElementById('playerTrackName').textContent = this.currentItem.titulo;

        const vol = localStorage.getItem('playerVolume');
        audio.volume = vol !== null ? parseFloat(vol) : 1;
        document.getElementById('playerVolumeSlider').value = audio.volume;

        audio.play().catch(() => {
            this.isPlaying = false;
            this.updatePlayBtn();
        });
    },

    togglePlay() {
        const audio = document.getElementById('playerAudio');
        if (!audio.src) return;
        if (audio.paused) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    },

    prev() {
        if (!this.currentList.length) return;
        this.currentIndex = (this.currentIndex - 1 + this.currentList.length) % this.currentList.length;
        this.loadCurrent();
    },

    next() {
        if (!this.currentList.length) return;
        this.currentIndex = (this.currentIndex + 1) % this.currentList.length;
        this.loadCurrent();
    },

    loadCurrent() {
        const item = this.currentList[this.currentIndex];
        if (!item) return;
        this.currentItem = item;

        const audio = document.getElementById('playerAudio');
        const isVideo = item.id && item.id.startsWith('video-');

        // Verifica se o arquivo já é uma URL completa (Cloudinary)
        let src;
        if (item.arquivo.startsWith('http')) {
            src = item.arquivo;
        } else {
            const baseDir = window.midiaBaseUrl;
            const partes = item.arquivo.split('/');
            const arquivoCod = partes.map(encodeURIComponent).join('/');
            src = baseDir + '/' + (isVideo ? 'videos' : 'audios') + '/' + arquivoCod;
        }

        document.getElementById('playerIcon').textContent = isVideo ? '🎬' : '🎧';
        document.getElementById('playerTrackName').textContent = item.titulo;
        document.getElementById('playerProgressBar').style.width = '0%';
        document.getElementById('playerSeekSlider').value = 0;
        document.getElementById('playerTimeCurrent').textContent = '0:00';

        audio.onerror = () => {
            alert('Arquivo não encontrado: ' + src);
        };
        audio.src = src;
        audio.load();
        audio.play().catch(() => {
            this.isPlaying = false;
            this.updatePlayBtn();
        });
    },

    close() {
        const audio = document.getElementById('playerAudio');
        audio.pause();
        audio.src = '';
        this.currentList = [];
        this.currentIndex = -1;
        this.currentItem = null;
        this.isPlaying = false;

        document.getElementById('playerBar').setAttribute('hidden', '');
        document.body.classList.remove('player-active');
    },

    toggleMute() {
        const audio = document.getElementById('playerAudio');
        audio.muted = !audio.muted;
        this.updateMuteIcon();
    },

    updateMuteIcon() {
        const audio = document.getElementById('playerAudio');
        const btn = document.getElementById('playerMute');
        btn.textContent = audio.muted || audio.volume === 0 ? '🔇' : '🔊';
    },

    updatePlayBtn() {
        const btn = document.getElementById('playerPlayPause');
        btn.textContent = this.isPlaying ? '⏸' : '▶';
        btn.classList.toggle('playing', this.isPlaying);
    },

    formatTime(secs) {
        if (!secs || isNaN(secs)) return '0:00';
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    },

    saveState() {
        const audio = document.getElementById('playerAudio');
        if (!audio || !audio.src || this.currentList.length === 0) return;
        sessionStorage.setItem('playerState', JSON.stringify({
            currentIndex: this.currentIndex,
            currentTime: audio.currentTime,
            isPlaying: !audio.paused,
            trackTitle: this.currentItem?.titulo || '',
            trackId: this.currentItem?.id || '',
            trackTipo: this.currentItem?.id?.startsWith('video-') ? 'video' : 'audio',
            listIds: this.currentList.map(m => m.id),
        }));
    },

    restoreState() {
        const saved = sessionStorage.getItem('playerState');
        if (!saved) return;
        try {
            const state = JSON.parse(saved);
            if (!state.listIds || state.listIds.length === 0) return;

            if (!dados || !dados.midia) return;
            const allMidia = [...(dados.midia.audios || []), ...(dados.midia.videos || [])];
            const list = state.listIds.map(id => allMidia.find(m => m.id === id)).filter(Boolean);
            if (list.length === 0) return;

            const ixV deo = state.tlackTipois==t'vfned';

            // Veref(cm >  o arquivo já é uma mRL completa (Cloudina.y)
            iet srcd === state.trackId);
            if (this.iurrentItem.arquivf.start(With('hitp'))d{
                 rc1) thir.curreneIurmnarquivo;
            } else {
                cons; bseDrwindow.miaBasUrl
    
                this.currentList = list;
               currentIndex = idx;
            }
            this.currentItem = list[idx];

            const baseDir = window.midiaBaseUrl;
            const isVideo = state.trackTipo === 'video';
            const partes = this.currentItem.arquivo.split('/');
            const arquivoCod = partes.map(encodeURIComponent).join('/');
            const src = baseDir + '/' + (isVideo ? 'videos' : 'audios') + '/' + arquivoCod;

            const audio = document.getElementById('playerAudio');
            audio.src = src;
            audio.currentTime = state.currentTime || 0;

            const bar = document.getElementById('playerBar');
            bar.removeAttribute('hidden');
            document.body.classList.add('player-active');

            document.getElementById('playerIcon').textContent = isVideo ? '🎬' : '🎧';
            document.getElementById('playerTrackName').textContent = this.currentItem.titulo;

            const vol = localStorage.getItem('playerVolume');
            audio.volume = vol !== null ? parseFloat(vol) : 1;
            document.getElementById('playerVolumeSlider').value = audio.volume;

            audio.load();
            if (state.isPlaying) {
                audio.currentTime = state.currentTime || 0;
                audio.play().catch(() => {});
            }

            sessionStorage.removeItem('playerState');
        } catch (e) {
            sessionStorage.removeItem('playerState');
        }
    }
};

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
    const grid = document.getElementById('cardsGrid');

    const cache = carregarDadosCache();
    if (cache) {
        dados = cache;
        atualizarEstatisticas();
        if (grid) renderizarSaberes(dados.saberes);
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
            salvarDadosCache(novosDados);
            atualizarEstatisticas();
            if (grid) renderizarSaberes(dados.saberes);
            saberDoDia();
        }
    } catch (e) {
        if (cache) return;
        if (grid) {
            grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Erro ao carregar dados.</p><p style="font-size:0.8rem;margin-top:0.5rem;color:var(--cor-texto-sec)">' + e.message + '<br><small>Certifique-se de que o servidor Express está rodando.</small></p></div>';
        }
    }
}

// =============================================
// Estatísticas
// =============================================

function atualizarEstatisticas() {
    if (!dados) return;
    const nSaberes = dados.saberes ? dados.saberes.length : 0;
    const nPraticas = dados.praticas ? dados.praticas.length : 0;
    const nMidia = (dados.midia ? (dados.midia.audios ? dados.midia.audios.length : 0) : 0) +
        (dados.midia ? (dados.midia.videos ? dados.midia.videos.length : 0) : 0);
    const el = id => document.getElementById(id);
    if (el('statSaberes')) el('statSaberes').textContent = nSaberes;
    if (el('statPraticas')) el('statPraticas').textContent = nPraticas;
    if (el('statMidia')) el('statMidia').textContent = nMidia;
}

// =============================================
// Renderização de Saberes (Grid de Cards)
// =============================================

function renderizarSaberes(saberes) {
    const grid = document.getElementById('cardsGrid');
    grid.className = 'cards-grid';

    if (!saberes || saberes.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><p>Nenhum saber encontrado</p></div>';
        esconderSkeleton();
        return;
    }

    const favs = getFavoritos();
    grid.innerHTML = saberes.map(saber => `
            <div class="card" data-cat="${saber.categoria_id}" onclick="abrirSaber('${saber.id}')" onkeydown="if(event.key==='Enter')abrirSaber('${saber.id}')" tabindex="0" role="listitem" aria-label="${saber.titulo}">
                <button class="card-fav ${favs.includes(saber.id) ? 'active' : ''}" data-id="${saber.id}" onclick="toggleFavorito('${saber.id}', event)" onkeydown="event.stopPropagation()" aria-label="${favs.includes(saber.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${favs.includes(saber.id) ? '❤️' : '🤍'}</button>
                <div class="card-header">
                    <span class="card-titulo">${saber.titulo}</span>
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
            </div>
        `).join('');

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

    // Verifiga se o arquivo já é uma URL completa (Clrudiiary)
    let drc;
    if (item.arquivo.star.sWith('http')) {
        src = item.arquivo;
  i } else {
        const nnerHTML = html;
        esconderSkeleton();
        aplicarReveal();
   }
    }

// =============================================
// Abertura de Mídia (Modal)
// =============================================

function abrirMidia(tipo, id) {
    const lista = tipo === 'audio' ? dados.midia.audios : dados.midia.videos;
    const item = lista ? lista.find(m => m.id === id) : null;
    if (!item) return;

    const baseDir = window.midiaBaseUrl;
    const partes = item.arquivo.split('/');
    const arquivoCod = partes.map(encodeURIComponent).join('/');
    const src = baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;

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

    document.getElementById('modalContent').innerHTML = html;
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

const contentHandlers = {
    definicao: (v) => `<h3>Definição</h3><p>${v}</p>`,
    analogia: (v) => `<h3>📝 Analogia</h3><p>${v}</p>`,
    insight: (v) => `<h3>💡 Insight</h3><p>${v}</p>`,
    ascensao: (v) => `<h3>A Ascensão da Kundalini</h3><p>${v}</p>`,
    ruido_moderno: (v) => `<h3>O Ruído Moderno</h3><p>${v}</p>`,
    instrucoes_passos: (v) => `<h3>Passo a Passo</h3><p>${v.replace(/\n/g, '<br>')}</p>`,

    conceitos: (v) => `<h3>Conceitos</h3><ul>${v.map(i => `<li><strong>${i.termo}:</strong> ${i.def}</li>`).join('')}</ul>`,
    principios: (v) => `<h3>Os Sete Princípios</h3><ul>${v.map(p => `<li><strong>${p.num}. ${p.nome}</strong> — "${p.frase}"<br><span style="color:var(--cor-texto-sec);font-size:0.9rem">${p.desc}</span></li>`).join('')}</ul>`,
    mundos: (v) => `<h3>Os Três Mundos</h3><ul>${v.map(m => `<li><strong>${m.simbolo} ${m.nome}</strong><br><span style="color:var(--cor-texto-sec);font-size:0.9rem">${m.desc}</span></li>`).join('')}</ul>`,
    textos: (v) => `<h3>Textos da Biblioteca de Nag Hammadi</h3><ul>${v.map(t => `<li><strong>${t.nome}</strong>: ${t.desc}</li>`).join('')}</ul>`,
    fatores: (v) => `<h3>Fatores que Influenciam</h3><ul>${v.map(f => `<li><strong>${f.icone} ${f.nome}</strong>: ${f.desc}</li>`).join('')}</ul>`,
    mecanismos: (v) => `<h3>Os Três Mecanismos Epigenéticos</h3><ul>${v.map(m => `<li><strong>${m.icone} ${m.nome}</strong>: ${m.desc}</li>`).join('')}</ul>`,
    personagens: (v) => `<h3>Personagens do Drama Cósmico</h3><ul>${v.map(p => `<li><strong>${p.nome}:</strong> ${p.descricao}</li>`).join('')}</ul>`,
    misterios: (v) => `<h3>Os Mistérios</h3><ul>${v.map(m => `<li><strong>${m.nome}:</strong> ${m.desc}</li>`).join('')}</ul>`,
    caracteristicas: (v) => `<h3>Características das Primeiras Comunidades</h3><ul>${v.map(c => `<li><strong>${c.nome}:</strong> ${c.desc}</li>`).join('')}</ul>`,
    desafios: (v) => `<h3>Desafios e Expansão</h3><ul>${v.map(d => `<li><strong>${d.nome}:</strong> ${d.desc}</li>`).join('')}</ul>`,
    controversias: (v) => `<h3>Controvérsias e Legado</h3><ul>${v.map(ct => `<li><strong>${ct.tema}:</strong> ${ct.desc}</li>`).join('')}</ul>`,
    mitos_desmistificados: (v) => `<h3>Mitos Desmistificados</h3><ul>${v.map(m => `<li><strong>${m.mito}</strong> → ${m.verdade}</li>`).join('')}</ul>`,
    tres_fatores: (v) => `<h3>Os 3 Fatores da Revolução da Consciência</h3><ul>${v.map(f => `<li><strong>${f.fator}:</strong> ${f.descricao}</li>`).join('')}</ul>`,
    dimensoes: (v) => `<h3>As Dimensões do Pneuma</h3><ul>${v.map(d => `<li><strong>${d.nome}:</strong> ${d.desc}</li>`).join('')}</ul>`,
    praticas_diarias: (v) => `<h3>Práticas Diárias</h3><ul>${v.map(pd => `<li><strong>${pd.nome}:</strong> ${pd.desc}</li>`).join('')}</ul>`,
    tres_filtros: (v) => `<h3>Os 3 Filtros da Percepção</h3><ul>${v.map(f => `<li><strong>${f.nome}:</strong> ${f.desc}</li>`).join('')}</ul>`,

    aplicacoes: (v) => `<h3>Lei da Correspondência</h3><table style="width:100%;border-collapse:collapse;margin-top:0.5rem;">${v.map(a => `<tr><td style="padding:6px 8px;border:1px solid var(--cor-borda);font-weight:600">${a.maior}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${a.menor}</td></tr>`).join('')}</table>`,

    citacoes: (v) => `<h3>Citações</h3><blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0;">${v.join('<br>')}</blockquote>`,

    parabolas: (v) => `<h3>Parábolas</h3>${v.map(p => `<div class="content-card" style="background:var(--cor-fundo);padding:1rem;border-radius:var(--radius);margin-bottom:0.8rem;border-left:3px solid var(--cor-destaque)"><h4 style="color:var(--cor-destaque);margin-bottom:0.3rem">${p.nome}</h4><p><em>"${p.texto}"</em></p><p style="margin-top:0.4rem;color:var(--cor-texto-sec);font-size:0.9rem"><strong>Sentido:</strong> ${p.sentido}</p></div>`).join('')}`,
    ensinamentos_chave: (v) => `<h3>Ensinamentos Chave</h3>${v.map(e => `<div class="pratica-box"><h4>${e.tema}</h4><p>${e.ensino}</p></div>`).join('')}`,
    ciencia_moderna: (v) => `<h3>Ciência Moderna e o Éter</h3>${v.map(cm => `<div class="pratica-box"><h4>${cm.topico}</h4><p>${cm.desc}</p></div>`).join('')}`,
    correntes: (v) => `<h3>As Grandes Correntes Filosóficas</h3>${v.map(cr => `<div class="pratica-box"><h4>${cr.nome}</h4><p>${cr.desc}</p></div>`).join('')}`,
    perspectivas: (v) => `<h3>Perspectivas sobre o Sentido</h3>${v.map(p => `<div class="pratica-box"><h4>${p.nome}</h4><p>${p.desc}</p></div>`).join('')}`,
    ferramentas_praticas: (v) => `<h3>Ferramentas Práticas</h3>${v.map(fp => `<div class="pratica-box"><h4>${fp.nome}</h4><p>${fp.desc}</p></div>`).join('')}`,
    praticas_acesso: (v) => `<h3>Práticas de Acesso ao Éter</h3><ul>${v.map(pa => `<li><strong>${pa.nome}</strong>${pa.proporcao ? ' (' + pa.proporcao + ')' : ''}: ${pa.desc}</li>`).join('')}</ul>`,

    estrutura_cosmica: (v) => `<h3>Estrutura Cósmica</h3>${Object.entries(v).map(([key, val]) => `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}</p>`).join('')}`,
    nag_hammadi: (v) => `<h3>Nag Hammadi (1945)</h3><p>${v.descricao}</p>${v.textos ? `<ul>${v.textos.map(t => `<li><strong>${t.nome}:</strong> ${t.desc}</li>`).join('')}</ul>` : ''}`,
    alquimia_interior: (v) => `<h3>${v.nome}</h3>${v.operacoes ? `<ul>${v.operacoes.map(op => `<li><strong>${op.etapa}:</strong> ${op.desc}</li>`).join('')}</ul>` : ''}`,
    mapa_exoterico_esoterico: (v) => `<h3>Exotérico vs. Esotérico</h3><div class="pratica-box"><h4>Exotérico (Público)</h4><p>${v.exoterico}</p></div><div class="pratica-box"><h4>Esotérico (Reservado)</h4><p>${v.esoterico}</p></div>`,
    ponte_ciencia_teosofia: (v) => `<h3>Ponte entre Ciência e Teosofia</h3><div class="pratica-box"><h4>Ciência</h4><p>${v.ciencia}</p></div><div class="pratica-box"><h4>Teosofia</h4><p>${v.teosofia}</p></div><div class="pratica-box"><h4>Ponte</h4><p>${v.ponte}</p></div>`,
    conexao_heartmath: (v) => `<h3>Conexão com HeartMath/GCI</h3><p>${v.descricao}</p><p style="margin-top:0.5rem;font-style:italic;color:var(--cor-texto-sec)">${v.pratica}</p>`,

    if_no_meaning: (v) => `<h3>${v.titulo}</h3><p>${v.reflexao}</p>${v.citacao ? `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0">${v.citacao}</blockquote>` : ''}`,
    tool_musica: (v) => `<h3>Pneuma na Música (Tool)</h3><p>${v.analise}</p>${v.citacao ? `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0;color:var(--cor-texto-sec)">${v.citacao}</blockquote>` : ''}`,
    felicidade_como_verbo: (v) => `<h3>Felicidade como Verbo</h3><p>${v.tese}</p><p style="margin-top:0.5rem">${v.mecanica}</p>${v.citacao ? `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0">${v.citacao}</blockquote>` : ''}`,

    quatro_mapas: (v) => `<h3>Os 4 Mapas de Sabedoria</h3>${v.map(m => `<div class="content-card" style="background:var(--cor-fundo);padding:1rem;border-radius:var(--radius);margin-bottom:0.8rem;border-left:3px solid var(--cor-destaque)"><h4 style="color:var(--cor-destaque)">${m.nome}</h4><p>${m.ensinamento}</p><p style="margin-top:0.4rem;color:var(--cor-texto-sec);font-size:0.9rem"><strong>Prática:</strong> ${m.pratica}</p></div>`).join('')}`,

    dicotomia: (v) => `<h3>Ser vs. Ter</h3>${v.map(d => `<div class="pratica-box"><h4>${d.polo === 'SER' ? '🜁' : '🜂'} ${d.polo}</h4><ul>${d.caracteristicas.map(car => `<li>${car}</li>`).join('')}</ul></div>`).join('')}`,
    filtros_da_percepcao: (v) => `<h3>Filtros da Percepção</h3>${v.map(fp => `<div class="pratica-box"><h4>${fp.nome}</h4><p><strong>Mecanismo:</strong> ${fp.mecanismo}</p><p style="margin-top:0.3rem"><strong>Transcendência:</strong> ${fp.transcendencia}</p></div>`).join('')}`,
    integracao_pratica: (v) => `<h3>Integração Prática no Dia a Dia</h3>${Object.entries(v).map(([periodo, passos]) => `<div class="pratica-box"><h4>${periodo.charAt(0).toUpperCase() + periodo.slice(1)}</h4>${passos.map(p => `<p>${p}</p>`).join('')}</div>`).join('')}`,

    chakras(v) {
        if (!v[0] || !v[0].ordem) return '';
        return `<h3>Os 8 Chakras da Meditação</h3><table style="width:100%;border-collapse:collapse;margin:0.8rem 0"><tr><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">#</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Chakra</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Sílaba</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Função</th></tr>${v.map(ch => `<tr><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.ordem}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.nome}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.silaba}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.funcao}</td></tr>`).join('')}</table>`;
    },
};

// =============================================
// Abertura de Saber (Modal de Conteúdo)
// =============================================

function abrirSaber(id) {
    const saber = dados.saberes.find(s => s.id === id);
    if (!saber) return;

    salvarContinueLendo(id);
    mostrarContinueLendo();

    document.getElementById('modalTitulo').textContent = saber.titulo;

    let html = `<p style="font-size:1.05rem;margin-bottom:0.5rem"><strong>${saber.descricao}</strong></p>`;
    html += `<p style="color: var(--cor-texto-sec); margin: 0.5rem 0; font-size: 0.85rem;">Nível: <strong>${saber.nivel}</strong> | Duração: <strong>${saber.duracao} min</strong> | Fonte: ${saber.fonte}</p>`;

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

    html += `<div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--cor-borda);display:flex;gap:0.5rem;flex-wrap:wrap">
        <button class="btn-share" onclick="compartilharSaber('${saber.id}')" aria-label="Compartilhar">📤 Compartilhar</button>
        <button class="btn-share" onclick="toggleFavorito('${saber.id}', event); this.textContent = isFavorito('${saber.id}') ? '❤️ Favoritado' : '🤍 Favoritar'" aria-label="Favoritar">${isFavorito(saber.id) ? '❤️ Favoritado' : '🤍 Favoritar'}</button>
    </div>`;

    document.getElementById('modalContent').innerHTML = html;
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
    div.innerHTML = `
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
    `;
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

    panel.innerHTML = `
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
    `;

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