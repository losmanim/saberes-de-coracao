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

            switch(e.key) {
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

        const src = tipo === 'audio'
            ? 'midia/audios/' + this.currentItem.arquivo
            : 'midia/videos/' + this.currentItem.arquivo;

        const audio = document.getElementById('playerAudio');
        audio.src = src;
        audio.load();

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
        const src = isVideo
            ? 'midia/videos/' + item.arquivo
            : 'midia/audios/' + item.arquivo;

        audio.src = src;
        document.getElementById('playerIcon').textContent = isVideo ? '🎬' : '🎧';
        document.getElementById('playerTrackName').textContent = item.titulo;
        document.getElementById('playerProgressBar').style.width = '0%';
        document.getElementById('playerSeekSlider').value = 0;
        document.getElementById('playerTimeCurrent').textContent = '0:00';

        audio.load();
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
    }
};

document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') fecharModalBtn();
});

window.addEventListener('DOMContentLoaded', () => {
    Player.init();

    if (localStorage.getItem('tema') === 'claro') {
        document.body.classList.add('modo-claro');
    }
    carregarDados();
});

async function carregarDados() {
    try {
        const response = await fetch('database/dados-unificados.json');
        if (!response.ok) throw new Error('HTTP ' + response.status);
        dados = await response.json();
        atualizarEstatisticas();
        renderizarSaberes(dados.saberes);
    } catch (e) {
        document.getElementById('cardsGrid').innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Erro ao carregar dados. Verifique se o arquivo database/dados-unificados.json existe.</p><p style="font-size:0.8rem;margin-top:0.5rem;color:var(--cor-texto-sec)">' + e.message + '</p></div>';
    }
}

function atualizarEstatisticas() {
    if (!dados) return;
    const nSaberes = dados.saberes ? dados.saberes.length : 0;
    const nPraticas = dados.praticas ? dados.praticas.length : 0;
    const nMidia = (dados.midia ? (dados.midia.audios ? dados.midia.audios.length : 0) : 0) +
                   (dados.midia ? (dados.midia.videos ? dados.midia.videos.length : 0) : 0);
    document.getElementById('statSaberes').textContent = nSaberes;
    document.getElementById('statPraticas').textContent = nPraticas;
    document.getElementById('statMidia').textContent = nMidia;
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

    Player.open(tipo, id);

    document.getElementById('modalTitulo').textContent = item.titulo;

    let html = '';

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