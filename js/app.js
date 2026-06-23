let dados = null;
let categoriaAtual = 'all';
let ultimoElementoFocado = null;

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

        const baseDir = window.midiaBaseUrl;
        const partes = this.currentItem.arquivo.split('/');
        const arquivoCod = partes.map(encodeURIComponent).join('/');
        const src = baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;

        const audio = document.getElementById('playerAudio');
        audio.src = src;
        audio.load();
        audio.onerror = () => {
            alert('Arquivo de mídia não encontrado: ' + src);
        };

        const bar = document.getElementById('playerBar');
        bar.removeAttribute('hidden');
        document.body.classList.add('player-active');

        document.getElementById('playerIcon').textContent = tipo === 'audio' ? '🎧' : '🎬';
        document.getElementById('playerTrackName').textContent = this.currentItem.titulo;

        const vol = localStorage.getItem('playerVolume');
        audio.volume = vol !== null ? parseFloat(vol) : 1;
        document.getElementById('playerVolumeSlider').value = audio.volume;

        audio.play().catch(() => {});
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
        const baseDir = window.midiaBaseUrl;
        const partes = item.arquivo.split('/');
        const arquivoCod = partes.map(encodeURIComponent).join('/');
        const src = baseDir + '/' + (isVideo ? 'videos' : 'audios') + '/' + arquivoCod;

        audio.src = src;
        document.getElementById('playerIcon').textContent = isVideo ? '🎬' : '🎧';
        document.getElementById('playerTrackName').textContent = item.titulo;
        document.getElementById('playerProgressBar').style.width = '0%';
        document.getElementById('playerSeekSlider').value = 0;
        document.getElementById('playerTimeCurrent').textContent = '0:00';

        audio.load();
        audio.onerror = () => {
            alert('Arquivo não encontrado: ' + audio.src);
        };
        audio.play().catch(() => {});
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

            const idx = list.findIndex(m => m.id === state.trackId);
            if (idx === -1) return;

            this.currentList = list;
            this.currentIndex = idx;
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
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') fecharModalBtn();
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
    carregarDados().then(() => Player.restoreState());
});

window.addEventListener('beforeunload', () => Player.saveState());
window.addEventListener('pagehide', () => Player.saveState());

async function carregarDados() {
    try {
        const response = await fetch('/api/dados');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        dados = await response.json();
        atualizarEstatisticas();
        if (document.getElementById('cardsGrid')) {
            renderizarSaberes(dados.saberes);
        }
    } catch (e) {
        const grid = document.getElementById('cardsGrid');
        if (grid) {
            grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Erro ao carregar dados.</p><p style="font-size:0.8rem;margin-top:0.5rem;color:var(--cor-texto-sec)">' + e.message + '<br><small>Certifique-se de que o servidor Express está rodando.</small></p></div>';
        }
    }
}

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

function renderizarSaberes(saberes) {
    const grid = document.getElementById('cardsGrid');
    grid.className = 'cards-grid';

    if (!saberes || saberes.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📚</div><p>Nenhum saber encontrado</p></div>';
        return;
    }

    grid.innerHTML = saberes.map(saber => `
            <div class="card" data-cat="${saber.categoria_id}" onclick="abrirSaber('${saber.id}')" onkeydown="if(event.key==='Enter')abrirSaber('${saber.id}')" tabindex="0" role="listitem" aria-label="${saber.titulo}">
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
}

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

    if (cat === 'all') {
        renderizarSaberes(dados.saberes);
    } else {
        const filtrados = dados.saberes.filter(s => s.categoria_id === parseInt(cat));
        renderizarSaberes(filtrados);
    }
}

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

    grid.innerHTML = html;
}

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
                <video controls autoplay style="width:100%;max-height:70vh;border-radius:var(--radius);background:#000">
                    <source src="${src}" type="video/${src.endsWith('.mkv') ? 'x-matroska' : 'mp4'}">
                    Seu navegador não suporta vídeo.
                </video>
            </div>`;
    } else {
        Player.open(tipo, id);
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

function abrirSaber(id) {
    const saber = dados.saberes.find(s => s.id === id);
    if (!saber) return;

    document.getElementById('modalTitulo').textContent = saber.titulo;

    let html = `<p style="font-size:1.05rem;margin-bottom:0.5rem"><strong>${saber.descricao}</strong></p>`;
    html += `<p style="color: var(--cor-texto-sec); margin: 0.5rem 0; font-size: 0.85rem;">Nível: <strong>${saber.nivel}</strong> | Duração: <strong>${saber.duracao} min</strong> | Fonte: ${saber.fonte}</p>`;

    if (saber.conteudo) {
        const c = saber.conteudo;

        if (c.definicao) {
            html += `<h3>Definição</h3><p>${c.definicao}</p>`;
        }
        if (c.analogia) {
            html += `<h3>📝 Analogia</h3><p>${c.analogia}</p>`;
        }
        if (c.insight) {
            html += `<h3>💡 Insight</h3><p>${c.insight}</p>`;
        }
        if (c.conceitos) {
            html += `<h3>Conceitos</h3><ul>`;
            c.conceitos.forEach(item => {
                html += `<li><strong>${item.termo}:</strong> ${item.def}</li>`;
            });
            html += `</ul>`;
        }
        if (c.principios) {
            html += `<h3>Os Sete Princípios</h3><ul>`;
            c.principios.forEach(p => {
                html += `<li><strong>${p.num}. ${p.nome}</strong> — "${p.frase}"<br><span style="color:var(--cor-texto-sec);font-size:0.9rem">${p.desc}</span></li>`;
            });
            html += `</ul>`;
        }
        if (c.mundos) {
            html += `<h3>Os Três Mundos</h3><ul>`;
            c.mundos.forEach(m => {
                html += `<li><strong>${m.simbolo} ${m.nome}</strong><br><span style="color:var(--cor-texto-sec);font-size:0.9rem">${m.desc}</span></li>`;
            });
            html += `</ul>`;
        }
        if (c.textos) {
            html += `<h3>Textos da Biblioteca de Nag Hammadi</h3><ul>`;
            c.textos.forEach(t => {
                html += `<li><strong>${t.nome}</strong>: ${t.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.aplicacoes) {
            html += `<h3>Lei da Correspondência</h3><table style="width:100%; border-collapse: collapse; margin-top:0.5rem;">`;
            c.aplicacoes.forEach(a => {
                html += `<tr><td style="padding:6px 8px; border:1px solid var(--cor-borda); font-weight:600">${a.maior}</td><td style="padding:6px 8px; border:1px solid var(--cor-borda)">${a.menor}</td></tr>`;
            });
            html += `</table>`;
        }
        if (c.fatores) {
            html += `<h3>Fatores que Influenciam</h3><ul>`;
            c.fatores.forEach(f => {
                html += `<li><strong>${f.icone} ${f.nome}</strong>: ${f.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.mecanismos) {
            html += `<h3>Os Três Mecanismos Epigenéticos</h3><ul>`;
            c.mecanismos.forEach(m => {
                html += `<li><strong>${m.icone} ${m.nome}</strong>: ${m.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.citacoes) {
            html += `<h3>Citações</h3><blockquote style="border-left: 3px solid var(--cor-destaque); padding-left: 1rem; font-style: italic; margin: 0.5rem 0;">${c.citacoes.join('<br>')}</blockquote>`;
        }
        if (c.parabolas) {
            html += `<h3>Parábolas</h3>`;
            c.parabolas.forEach(p => {
                html += `<div class="content-card" style="background:var(--cor-fundo);padding:1rem;border-radius:var(--radius);margin-bottom:0.8rem;border-left:3px solid var(--cor-destaque)">`;
                html += `<h4 style="color:var(--cor-destaque);margin-bottom:0.3rem">${p.nome}</h4>`;
                html += `<p><em>"${p.texto}"</em></p>`;
                html += `<p style="margin-top:0.4rem;color:var(--cor-texto-sec);font-size:0.9rem"><strong>Sentido:</strong> ${p.sentido}</p>`;
                html += `</div>`;
            });
        }
        if (c.ensinamentos_chave) {
            html += `<h3>Ensinamentos Chave</h3>`;
            c.ensinamentos_chave.forEach(e => {
                html += `<div class="pratica-box"><h4>${e.tema}</h4><p>${e.ensino}</p></div>`;
            });
        }
        if (c.estrutura_cosmica) {
            html += `<h3>Estrutura Cósmica</h3>`;
            for (const [key, val] of Object.entries(c.estrutura_cosmica)) {
                const nome = key.charAt(0).toUpperCase() + key.slice(1);
                html += `<p><strong>${nome}:</strong> ${val}</p>`;
            }
        }
        if (c.personagens) {
            html += `<h3>Personagens do Drama Cósmico</h3><ul>`;
            c.personagens.forEach(p => {
                html += `<li><strong>${p.nome}:</strong> ${p.descricao}</li>`;
            });
            html += `</ul>`;
        }
        if (c.misterios) {
            html += `<h3>Os Mistérios</h3><ul>`;
            c.misterios.forEach(m => {
                html += `<li><strong>${m.nome}:</strong> ${m.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.caracteristicas) {
            html += `<h3>Características das Primeiras Comunidades</h3><ul>`;
            c.caracteristicas.forEach(c => {
                html += `<li><strong>${c.nome}:</strong> ${c.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.desafios) {
            html += `<h3>Desafios e Expansão</h3><ul>`;
            c.desafios.forEach(d => {
                html += `<li><strong>${d.nome}:</strong> ${d.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.nag_hammadi) {
            html += `<h3>Nag Hammadi (1945)</h3>`;
            html += `<p>${c.nag_hammadi.descricao}</p>`;
            if (c.nag_hammadi.textos) {
                html += `<ul>`;
                c.nag_hammadi.textos.forEach(t => {
                    html += `<li><strong>${t.nome}:</strong> ${t.desc}</li>`;
                });
                html += `</ul>`;
            }
        }
        if (c.controversias) {
            html += `<h3>Controvérsias e Legado</h3><ul>`;
            c.controversias.forEach(ct => {
                html += `<li><strong>${ct.tema}:</strong> ${ct.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.mitos_desmistificados) {
            html += `<h3>Mitos Desmistificados</h3><ul>`;
            c.mitos_desmistificados.forEach(m => {
                html += `<li><strong>${m.mito}</strong> → ${m.verdade}</li>`;
            });
            html += `</ul>`;
        }
        if (c.tres_fatores) {
            html += `<h3>Os 3 Fatores da Revolução da Consciência</h3><ul>`;
            c.tres_fatores.forEach(f => {
                html += `<li><strong>${f.fator}:</strong> ${f.descricao}</li>`;
            });
            html += `</ul>`;
        }
        if (c.ascensao) {
            html += `<h3>A Ascensão da Kundalini</h3><p>${c.ascensao}</p>`;
        }
        if (c.chakras && c.chakras[0] && c.chakras[0].ordem) {
            html += `<h3>Os 8 Chakras da Meditação</h3>`;
            html += `<table style="width:100%;border-collapse:collapse;margin:0.8rem 0">`;
            html += `<tr><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">#</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Chakra</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Sílaba</th><th style="padding:6px 8px;border:1px solid var(--cor-borda);background:var(--cor-fundo)">Função</th></tr>`;
            c.chakras.forEach(ch => {
                html += `<tr><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.ordem}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.nome}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.silaba}</td><td style="padding:6px 8px;border:1px solid var(--cor-borda)">${ch.funcao}</td></tr>`;
            });
            html += `</table>`;
        }
        if (c.instrucoes_passos) {
            html += `<h3>Passo a Passo</h3><p>${c.instrucoes_passos.replace(/\n/g, '<br>')}</p>`;
        }
        if (c.ciencia_moderna) {
            html += `<h3>Ciência Moderna e o Éter</h3>`;
            c.ciencia_moderna.forEach(cm => {
                html += `<div class="pratica-box"><h4>${cm.topico}</h4><p>${cm.desc}</p></div>`;
            });
        }
        if (c.alquimia_interior) {
            html += `<h3>${c.alquimia_interior.nome}</h3>`;
            if (c.alquimia_interior.operacoes) {
                html += `<ul>`;
                c.alquimia_interior.operacoes.forEach(op => {
                    html += `<li><strong>${op.etapa}:</strong> ${op.desc}</li>`;
                });
                html += `</ul>`;
            }
        }
        if (c.praticas_acesso) {
            html += `<h3>Práticas de Acesso ao Éter</h3><ul>`;
            c.praticas_acesso.forEach(pa => {
                html += `<li><strong>${pa.nome}</strong>${pa.proporcao ? ' (' + pa.proporcao + ')' : ''}: ${pa.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.mapa_exoterico_esoterico) {
            html += `<h3>Exotérico vs. Esotérico</h3>`;
            html += `<div class="pratica-box"><h4>Exotérico (Público)</h4><p>${c.mapa_exoterico_esoterico.exoterico}</p></div>`;
            html += `<div class="pratica-box"><h4>Esotérico (Reservado)</h4><p>${c.mapa_exoterico_esoterico.esoterico}</p></div>`;
        }
        if (c.quatro_mapas) {
            html += `<h3>Os 4 Mapas de Sabedoria</h3>`;
            c.quatro_mapas.forEach(m => {
                html += `<div class="content-card" style="background:var(--cor-fundo);padding:1rem;border-radius:var(--radius);margin-bottom:0.8rem;border-left:3px solid var(--cor-destaque)">`;
                html += `<h4 style="color:var(--cor-destaque)">${m.nome}</h4>`;
                html += `<p>${m.ensinamento}</p>`;
                html += `<p style="margin-top:0.4rem;color:var(--cor-texto-sec);font-size:0.9rem"><strong>Prática:</strong> ${m.pratica}</p>`;
                html += `</div>`;
            });
        }
        if (c.ruido_moderno) {
            html += `<h3>O Ruído Moderno</h3><p>${c.ruido_moderno}</p>`;
        }
        if (c.correntes) {
            html += `<h3>As Grandes Correntes Filosóficas</h3>`;
            c.correntes.forEach(cr => {
                html += `<div class="pratica-box"><h4>${cr.nome}</h4><p>${cr.desc}</p></div>`;
            });
        }
        if (c.ponte_ciencia_teosofia) {
            html += `<h3>Ponte entre Ciência e Teosofia</h3>`;
            html += `<div class="pratica-box"><h4>Ciência</h4><p>${c.ponte_ciencia_teosofia.ciencia}</p></div>`;
            html += `<div class="pratica-box"><h4>Teosofia</h4><p>${c.ponte_ciencia_teosofia.teosofia}</p></div>`;
            html += `<div class="pratica-box"><h4>Ponte</h4><p>${c.ponte_ciencia_teosofia.ponte}</p></div>`;
        }
        if (c.perspectivas) {
            html += `<h3>Perspectivas sobre o Sentido</h3>`;
            c.perspectivas.forEach(p => {
                html += `<div class="pratica-box"><h4>${p.nome}</h4><p>${p.desc}</p></div>`;
            });
        }
        if (c.if_no_meaning) {
            html += `<h3>${c.if_no_meaning.titulo}</h3>`;
            html += `<p>${c.if_no_meaning.reflexao}</p>`;
            if (c.if_no_meaning.citacao) {
                html += `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0">${c.if_no_meaning.citacao}</blockquote>`;
            }
        }
        if (c.dimensoes) {
            html += `<h3>As Dimensões do Pneuma</h3><ul>`;
            c.dimensoes.forEach(d => {
                html += `<li><strong>${d.nome}:</strong> ${d.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.tool_musica) {
            html += `<h3>Pneuma na Música (Tool)</h3>`;
            html += `<p>${c.tool_musica.analise}</p>`;
            if (c.tool_musica.citacao) {
                html += `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0;color:var(--cor-texto-sec)">${c.tool_musica.citacao}</blockquote>`;
            }
        }
        if (c.praticas_diarias) {
            html += `<h3>Práticas Diárias</h3><ul>`;
            c.praticas_diarias.forEach(pd => {
                html += `<li><strong>${pd.nome}:</strong> ${pd.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.conexao_heartmath) {
            html += `<h3>Conexão com HeartMath/GCI</h3>`;
            html += `<p>${c.conexao_heartmath.descricao}</p>`;
            html += `<p style="margin-top:0.5rem;font-style:italic;color:var(--cor-texto-sec)">${c.conexao_heartmath.pratica}</p>`;
        }
        if (c.dicotomia) {
            html += `<h3>Ser vs. Ter</h3>`;
            c.dicotomia.forEach(d => {
                const icone = d.polo === 'SER' ? '🜁' : '🜂';
                html += `<div class="pratica-box"><h4>${icone} ${d.polo}</h4><ul>`;
                d.caracteristicas.forEach(car => {
                    html += `<li>${car}</li>`;
                });
                html += `</ul></div>`;
            });
        }
        if (c.felicidade_como_verbo) {
            html += `<h3>Felicidade como Verbo</h3>`;
            html += `<p>${c.felicidade_como_verbo.tese}</p>`;
            html += `<p style="margin-top:0.5rem">${c.felicidade_como_verbo.mecanica}</p>`;
            if (c.felicidade_como_verbo.citacao) {
                html += `<blockquote style="border-left:3px solid var(--cor-destaque);padding-left:1rem;font-style:italic;margin:0.5rem 0">${c.felicidade_como_verbo.citacao}</blockquote>`;
            }
        }
        if (c.tres_filtros) {
            html += `<h3>Os 3 Filtros da Percepção</h3><ul>`;
            c.tres_filtros.forEach(f => {
                html += `<li><strong>${f.nome}:</strong> ${f.desc}</li>`;
            });
            html += `</ul>`;
        }
        if (c.ferramentas_praticas) {
            html += `<h3>Ferramentas Práticas</h3>`;
            c.ferramentas_praticas.forEach(fp => {
                html += `<div class="pratica-box"><h4>${fp.nome}</h4><p>${fp.desc}</p></div>`;
            });
        }
        if (c.filtros_da_percepcao) {
            html += `<h3>Filtros da Percepção</h3>`;
            c.filtros_da_percepcao.forEach(fp => {
                html += `<div class="pratica-box"><h4>${fp.nome}</h4>`;
                html += `<p><strong>Mecanismo:</strong> ${fp.mecanismo}</p>`;
                html += `<p style="margin-top:0.3rem"><strong>Transcendência:</strong> ${fp.transcendencia}</p>`;
                html += `</div>`;
            });
        }
        if (c.integracao_pratica) {
            html += `<h3>Integração Prática no Dia a Dia</h3>`;
            for (const [periodo, passos] of Object.entries(c.integracao_pratica)) {
                html += `<div class="pratica-box"><h4>${periodo.charAt(0).toUpperCase() + periodo.slice(1)}</h4>`;
                passos.forEach(p => { html += `<p>${p}</p>`; });
                html += `</div>`;
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

    document.getElementById('modalContent').innerHTML = html;
    abrirModal();
}

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
// Admin — CRUD de saberes via API
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