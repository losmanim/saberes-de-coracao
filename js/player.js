const Player = {
    currentList: [],
    currentIndex: -1,
    currentItem: null,
    isPlaying: false,

    _buildSrc(item, tipo) {
        if (item.arquivo.startsWith('http')) return item.arquivo;
        const baseDir = window.midiaBaseUrl;
        const partes = item.arquivo.split('/');
        const arquivoCod = partes.map(encodeURIComponent).join('/');
        return baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;
    },

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

    _updateMediaSession() {
        if (!('mediaSession' in navigator) || !this.currentItem) return;
        navigator.mediaSession.metadata = new MediaMetadata({
            title: this.currentItem.titulo,
            artist: 'Saberes de Coração',
            album: 'Saberes de Coração',
            artwork: [
                { src: '/icons/icon.svg', sizes: '512x512', type: 'image/svg+xml' },
            ],
        });
        navigator.mediaSession.setActionHandler('play', () => this.togglePlay());
        navigator.mediaSession.setActionHandler('pause', () => this.togglePlay());
        navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
    },

    open(tipo, id) {
        const list = this.buildList(tipo);
        const index = list.findIndex(m => m.id === id);
        if (index === -1) return;

        this.currentList = list;
        this.currentIndex = index;
        this.currentItem = list[index];

        const src = this._buildSrc(this.currentItem, tipo);

        const audio = document.getElementById('playerAudio');
        const bar = document.getElementById('playerBar');

        audio.onerror = () => {
            if (typeof mostrarToast === 'function') mostrarToast('❌ Arquivo não encontrado', 'erro');
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

        this._updateMediaSession();
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

        const src = this._buildSrc(item, isVideo ? 'video' : 'audio');

        document.getElementById('playerIcon').textContent = isVideo ? '🎬' : '🎧';
        document.getElementById('playerTrackName').textContent = item.titulo;
        document.getElementById('playerProgressBar').style.width = '0%';
        document.getElementById('playerSeekSlider').value = 0;
        document.getElementById('playerTimeCurrent').textContent = '0:00';

        audio.onerror = () => {
            if (typeof mostrarToast === 'function') mostrarToast('❌ Arquivo não encontrado', 'erro');
        };
        audio.src = src;
        audio.load();
        this._updateMediaSession();
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

            const idx = list.findIndex(m => m.id === state.trackId);
            if (idx === -1) return;

            this.currentList = list;
            this.currentIndex = idx;
            this.currentItem = list[idx];

            const isVideo = state.trackTipo === 'video';
            const src = this._buildSrc(this.currentItem, isVideo ? 'video' : 'audio');

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

window.Player = Player;
