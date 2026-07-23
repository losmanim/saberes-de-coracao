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
    if (token) fetch('/api/logout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } });
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

function toggleAdmin() {
    if (!isAutenticado()) { toggleLogin(); return; }
    const container = document.getElementById('adminContainer');
    if (!container) criarAdminPanel();
    else container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

function criarAdminPanel() {
    const main = document.querySelector('.main');
    const panel = document.createElement('section');
    panel.id = 'adminContainer';
    panel.style.cssText = 'display:block;margin-bottom:2rem;padding:1.5rem;background:var(--cor-card);border:1px solid var(--cor-borda);border-radius:var(--radius)';
    const catOptions = dados && dados.categorias
        ? dados.categorias.map(c => `<option value="${c.id}">${c.nome}</option>`).join('') : '';
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
        const tags = document.getElementById('inputTags').value.split(',').map(t => t.trim()).filter(Boolean);
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
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
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
            if (!data.autenticado) localStorage.removeItem('adminToken');
            atualizarBotaoAdmin();
        } catch {
            localStorage.removeItem('adminToken');
            atualizarBotaoAdmin();
        }
    }
});

window.toggleTema = toggleTema;
window.toggleLogin = toggleLogin;
window.toggleAdmin = toggleAdmin;
