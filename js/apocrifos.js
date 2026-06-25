let todosTextos = [];

const CATEGORIAS_TEXTO = {
    'patriarcas': ['apoc-1', 'apoc-2', 'apoc-3', 'apoc-8', 'apoc-9'],
    'infancia': ['apoc-4', 'apoc-7', 'apoc-11'],
    'gnosticos': ['apoc-5', 'apoc-6', 'apoc-10'],
};

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tema') === 'claro') {
        document.body.classList.add('modo-claro');
    }
    carregarDados().then(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => abrirAccordionPorId(id), 500);
        }
    });
});

function abrirAccordionPorId(id) {
    const header = document.querySelector(`.accordion-header[data-id="${id}"]`);
    if (!header) return;
    header.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        if (!header.classList.contains('active')) {
            header.click();
        }
    }, 300);
}

async function carregarDados() {
    const container = document.getElementById('apocrifosContainer');
    try {
        const res = await fetch('/api/dados');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        dados = await res.json();
        todosTextos = dados.saberes.filter(s => s.categoria_id === 6);
        document.getElementById('statTextos').textContent = todosTextos.length;
        renderizarTextos(todosTextos);
    } catch (e) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Erro ao carregar dados.</p>
                <p style="font-size:0.8rem;margin-top:0.5rem;color:var(--cor-texto-sec)">
                    ${e.message}<br>
                    <small>Certifique-se de que o servidor Express está rodando.</small>
                </p>
            </div>`;
    }
}

function renderizarTextos(textos) {
    const container = document.getElementById('apocrifosContainer');

    if (!textos || textos.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📜</div><p>Nenhum texto encontrado</p></div>';
        return;
    }

    container.innerHTML = textos.map(texto => {
        const catLabel = categoriaLabel(texto.id);
        return `
            <div class="accordion">
                <button class="accordion-header" onclick="toggleAccordion(this)" data-id="${texto.id}">
                    <span>${texto.titulo}</span>
                    <span style="display:flex;align-items:center;gap:0.5rem">
                        <span class="badge badge-apocrifo">${catLabel}</span>
                        <span class="accordion-arrow">▼</span>
                    </span>
                </button>
                <div class="accordion-content">
                    <div class="content">
                        <p><strong>${texto.descricao}</strong></p>
                        <div style="margin-top:1rem">
                            ${texto.conteudo && texto.conteudo.insight ? `
                                <div class="pratica-box" style="margin-bottom:1rem">
                                    <h4 style="margin-bottom:0.3rem">💡 Insight</h4>
                                    <p>${texto.conteudo.insight}</p>
                                </div>
                            ` : ''}
                            <button class="pilar-btn active" style="background:var(--cor-destaque);color:#fff;border:none;margin-top:0.5rem" onclick="abrirTextoCompleto('${texto.id}')">
                                📖 Ler texto completo
                            </button>
                        </div>
                        <div class="card-tags" style="margin-top:0.8rem">
                            ${(texto.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function categoriaLabel(id) {
    if (CATEGORIAS_TEXTO.patriarcas.includes(id)) return 'Patriarcas';
    if (CATEGORIAS_TEXTO.infancia.includes(id)) return 'Infância de Jesus';
    if (CATEGORIAS_TEXTO.gnosticos.includes(id)) return 'Gnósticos';
    return 'Apócrifo';
}

function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');

    header.classList.toggle('active');
    content.classList.toggle('active');

    if (!isActive) {
        setTimeout(() => content.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
}

function filtrarCategoria(cat) {
    categoriaAtual = cat;

    document.querySelectorAll('.pilar-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.cat === cat) btn.classList.add('active');
    });

    if (cat === 'all') {
        renderizarTextos(todosTextos);
        return;
    }

    const ids = CATEGORIAS_TEXTO[cat] || [];
    const filtrados = todosTextos.filter(t => ids.includes(t.id));
    renderizarTextos(filtrados);
}

function buscarTextos(termo) {
    const info = document.getElementById('buscaInfo');
    if (!termo.trim()) {
        info.textContent = '';
        filtrarCategoria(categoriaAtual);
        return;
    }

    const t = termo.toLowerCase();
    let filtrados = todosTextos.filter(s =>
        s.titulo.toLowerCase().includes(t) ||
        s.descricao.toLowerCase().includes(t) ||
        (s.tags || []).some(tag => tag.toLowerCase().includes(t))
    );

    if (categoriaAtual !== 'all') {
        const ids = CATEGORIAS_TEXTO[categoriaAtual] || [];
        filtrados = filtrados.filter(s => ids.includes(s.id));
    }

    info.textContent = filtrados.length + ' resultado' + (filtrados.length !== 1 ? 's' : '') + ' encontrado' + (filtrados.length !== 1 ? 's' : '');
    renderizarTextos(filtrados);
}

function abrirTextoCompleto(id) {
    const texto = todosTextos.find(t => t.id === id);
    if (!texto) return;

    document.getElementById('modalTitulo').textContent = texto.titulo;

    const conteudo = texto.conteudo || {};
    let html = `<p style="font-size:1.05rem;margin-bottom:1rem"><strong>${texto.descricao}</strong></p>`;

    if (conteudo.insight) {
        html += `<div class="pratica-box" style="margin-bottom:1rem"><h4 style="margin-bottom:0.3rem">💡 Insight</h4><p>${conteudo.insight}</p></div>`;
    }

    if (conteudo.texto_integral) {
        html += `<hr style="border-color:var(--cor-borda);margin:1.5rem 0"><div class="texto-integral">`;
        const paragrafos = conteudo.texto_integral.split('\n').filter(p => p.trim());
        html += paragrafos.map(p => {
            const trimmed = p.trim();
            if (/^cap[ií]tulo\s/i.test(trimmed)) {
                return `<h3>${trimmed}</h3>`;
            }
            if (trimmed.length < 60 && trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
                return `<h4>${trimmed}</h4>`;
            }
            return `<p>${trimmed}</p>`;
        }).join('');
        html += `</div>`;
    }

    if (texto.tags && texto.tags.length > 0) {
        html += `<div class="card-tags" style="margin-top:1.5rem;border-top:1px solid var(--cor-borda);padding-top:1rem">`;
        html += texto.tags.map(t => `<span class="tag">#${t}</span>`).join('');
        html += `</div>`;
    }

    document.getElementById('modalContent').innerHTML = html;
    ultimoElementoFocado = document.activeElement;
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-close').focus();
}

function fecharModal(e) {
    if (e.target.id === 'modalOverlay') fecharModalBtn();
}

function fecharModalBtn() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    if (ultimoElementoFocado) ultimoElementoFocado.focus();
}

function toggleBusca() {
    const c = document.getElementById('buscaContainer');
    const isVisible = c.style.display !== 'none';
    c.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) document.getElementById('buscaInput').focus();
}

function toggleTema() {
    document.body.classList.toggle('modo-claro');
    localStorage.setItem('tema', document.body.classList.contains('modo-claro') ? 'claro' : 'escuro');
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModalBtn();
});

document.getElementById('modalOverlay').addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    const modal = this.querySelector('.modal');
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
