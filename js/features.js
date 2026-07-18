(function () {
  'use strict';

  const $ = window.Utils.$;

  // =============================================
  // Contato (EmailJS + Appwrite Database)
  // =============================================

  function criarFormularioContato() {
    const section = document.createElement('section');
    section.id = 'contato';
    section.className = 'contato-section reveal';
    section.setAttribute('aria-label', 'Formulário de contato');

    $(section, `
      <div class="contato-inner">
        <div class="contato-info">
          <h2 class="contato-titulo">💌 Entre em Contato</h2>
          <p class="contato-desc">Compartilhe seus insights, dúvidas ou sugestões. Sua mensagem chega diretamente a nós.</p>
          <div class="contato-detalhes">
            <div class="contato-detalhe">
              <span class="contato-detalhe-icon">🕉️</span>
              <div>
                <strong>Saberes de Coração</strong>
                <span>Conhecimento livre para todos</span>
              </div>
            </div>
            <div class="contato-detalhe">
              <span class="contato-detalhe-icon">📧</span>
              <div>
                <strong>Email</strong>
                <span>contato@saberes</span>
              </div>
            </div>
          </div>
        </div>
        <form class="contato-form" id="formContato" novalidate>
          <div class="contato-field">
            <label for="contatoNome" class="contato-label">Nome</label>
            <input type="text" id="contatoNome" class="contato-input" required placeholder="Seu nome" autocomplete="name">
          </div>
          <div class="contato-field">
            <label for="contatoEmail" class="contato-label">Email</label>
            <input type="email" id="contatoEmail" class="contato-input" required placeholder="seu@email.com" autocomplete="email">
          </div>
          <div class="contato-field">
            <label for="contatoAssunto" class="contato-label">Assunto <span class="contato-opcional">(opcional)</span></label>
            <input type="text" id="contatoAssunto" class="contato-input" placeholder="Assunto da mensagem">
          </div>
          <div class="contato-field">
            <label for="contatoMensagem" class="contato-label">Mensagem</label>
            <textarea id="contatoMensagem" class="contato-textarea" required placeholder="Sua mensagem..." rows="5"></textarea>
          </div>
          <button type="submit" class="contato-btn" id="contatoBtn">
            <span class="contato-btn-text">Enviar Mensagem</span>
            <span class="contato-btn-loading" style="display:none">Enviando...</span>
          </button>
          <div class="contato-status" id="contatoStatus" role="status" aria-live="polite"></div>
        </form>
      </div>
    `);

    return section;
  }

  async function enviarContato(event) {
    event.preventDefault();
    const form = event.target;
    const btn = document.getElementById('contatoBtn');
    const status = document.getElementById('contatoStatus');
    const btnText = btn.querySelector('.contato-btn-text');
    const btnLoading = btn.querySelector('.contato-btn-loading');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    status.className = 'contato-status';
    status.textContent = '';

    const data = {
      nome: document.getElementById('contatoNome').value.trim(),
      email: document.getElementById('contatoEmail').value.trim(),
      assunto: document.getElementById('contatoAssunto').value.trim(),
      mensagem: document.getElementById('contatoMensagem').value.trim(),
    };

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      status.className = 'contato-status contato-sucesso';

      if (result.email_enviado) {
        status.textContent = '✅ Mensagem enviada com sucesso! Responderemos em breve.';
      } else {
        status.textContent = '✅ Mensagem recebida! (Notificação por email indisponível)';
      }

      form.reset();
    } catch (err) {
      status.className = 'contato-status contato-erro';
      status.textContent = '❌ Erro ao enviar: ' + err.message;
    } finally {
      btn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  // =============================================
  // User Accounts (Appwrite Auth)
  // =============================================

  function criarModalAuth() {
    const overlay = document.createElement('div');
    overlay.id = 'authOverlay';
    overlay.className = 'auth-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'authTitulo');
    overlay.onclick = function (e) { if (e.target === this) fecharAuth(); };
    $(overlay, `
      <div class="auth-modal" onclick="event.stopPropagation()">
        <div class="auth-header">
          <h2 id="authTitulo" class="auth-titulo">🔐 Entrar</h2>
          <button class="auth-close" onclick="fecharAuth()" aria-label="Fechar">✕</button>
        </div>
        <div class="auth-body">
          <form id="formAuth" class="auth-form">
            <div class="auth-field">
              <label for="authEmail" class="auth-label">Email</label>
              <input type="email" id="authEmail" class="auth-input" required placeholder="seu@email.com" autocomplete="email">
            </div>
            <div class="auth-field">
              <label for="authSenha" class="auth-label">Senha</label>
              <input type="password" id="authSenha" class="auth-input" required placeholder="Sua senha" autocomplete="current-password">
            </div>
            <button type="submit" class="auth-btn" id="authBtn">
              <span class="auth-btn-text">Entrar</span>
              <span class="auth-btn-loading" style="display:none">Entrando...</span>
            </button>
            <div class="auth-status" id="authStatus" role="status" aria-live="polite"></div>
          </form>
          <p class="auth-aviso">Use o email e senha configurados no Appwrite. Ainda sem conta? O administrador pode criar uma.</p>
        </div>
      </div>
    `);
    return overlay;
  }

  async function handleAuth(event) {
    event.preventDefault();
    const btn = document.getElementById('authBtn');
    const status = document.getElementById('authStatus');
    const btnText = btn.querySelector('.auth-btn-text');
    const btnLoading = btn.querySelector('.auth-btn-loading');

    btn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    status.className = 'auth-status';
    status.textContent = '';

    const email = document.getElementById('authEmail').value.trim();
    const senha = document.getElementById('authSenha').value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) throw new Error('Credenciais inválidas');

      const data = await res.json();
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        status.className = 'auth-status auth-sucesso';
        status.textContent = '✅ Conectado!';
        if (window.atualizarBotaoAdmin) window.atualizarBotaoAdmin();
        setTimeout(fecharAuth, 800);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      status.className = 'auth-status auth-erro';
      status.textContent = '❌ ' + err.message;
    } finally {
      btn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  }

  window.fecharAuth = function () {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.remove();
  };

  // =============================================
  // Init
  // =============================================

  function init() {
    // Injetar seção de contato após o footer
    const footer = document.querySelector('.footer');
    if (footer) {
      const form = criarFormularioContato();
      footer.parentNode.insertBefore(form, footer);
    }

    // Event listener para o form de contato
    document.addEventListener('submit', function (e) {
      if (e.target.id === 'formContato') {
        enviarContato(e);
      }
    });

    // Event listener para auth form (delegate)
    document.addEventListener('submit', function (e) {
      if (e.target.id === 'formAuth') {
        handleAuth(e);
      }
    });

    // Adicionar botão de login no header se não existir
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('btnLogin')) {
      const btnLogin = document.createElement('button');
      btnLogin.id = 'btnLogin';
      btnLogin.className = 'btn-icon';
      btnLogin.title = 'Entrar';
      btnLogin.textContent = '🔑';
      btnLogin.onclick = function () {
        const overlay = criarModalAuth();
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));
        document.getElementById('authEmail').focus();
      };
      headerActions.insertBefore(btnLogin, headerActions.firstChild);
    }

    // Observar reveal para a seção de contato
    if (window.revealObserver) {
      const contatoSection = document.getElementById('contato');
      if (contatoSection) window.revealObserver.observe(contatoSection);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
