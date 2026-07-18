# Comunicação Cliente-Servidor — Saberes de Coração v4.0

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | HTML5 Semântico + CSS3 Variables + Vanilla JS (ES6+) |
| **Backend** | Node.js + Express 5 (API REST) |
| **Dados** | JSON estático (fallback) + Appwrite Database (produção) |
| **Email** | EmailJS |
| **Mídia** | Cloudinary |
| **Deploy** | Render |
| **PWA** | Service Worker + Manifest |
| **Auth** | JWT (cookie httpOnly + localStorage) |

## Arquitetura de Frontend

O frontend é **multi-página** (não SPA), com cada página em seu próprio HTML:

| Página | Arquivo | Função |
|--------|---------|--------|
| Início | `index.html` (295 linhas) | Grid de cards, leitor imersivo, paginação |
| Biblioteca | `biblioteca.html` (300 linhas) | Seções por categoria com accordions dinâmicos |
| Apócrifos | `apocrifos.html` (171 linhas) | Textos apócrifos com filtros e busca |
| 404 | `404.html` | Página de erro |

### Assets Compartilhados

| Arquivo | Função |
|---------|--------|
| `js/utils.js` | Funções utilitárias compartilhadas: `$()`, `normalizarSaber()`, `mostrarToast()`, `tratarErro()`, `debounce()` |
| `js/content.js` | `contentHandlers` — 30+ funções que convertem campos do JSON em HTML |
| `js/player.js` | Player de áudio/vídeo flutuante com suporte a Media Session API |
| `js/app.js` | Core do index.html: carregamento, cache, renderização, busca, favoritos, autenticação, CRUD |
| `js/biblioteca.js` | ES Module — lógica da página de biblioteca |
| `js/apocrifos.js` | Lógica da página de apócrifos |
| `js/features.js` | Formulário de contato + modal de autenticação |
| `css/style.css` | Design system: variáveis, temas, componentes, animações (2.714 linhas) |
| `sw.js` | Service Worker com cache-first e network-first |

## Comunicação Frontend ↔ Backend

### Fluxo de Dados

```
                       Fonte de Dados
                      ┌──────────────┐
                      │ Appwrite DB  │ (produção)
                      │  (opcional)  │
                      └──────┬───────┘
                             │
                    ┌────────▼────────┐
                    │  Express API    │
                    │  (app.js)       │
                    └──┬──────────┬───┘
                       │          │
              ┌────────▼──┐  ┌────▼────────┐
              │ /api/*    │  │ JSON local  │
              │ endpoints │  │ (fallback)  │
              └─────┬─────┘  └──────┬──────┘
                    │               │
              ┌─────▼───────────────▼──────┐
              │    Navegador (fetch)       │
              │    + localStorage (cache)  │
              └────────────────────────────┘
```

### Endpoints da API REST

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/login` | — | Login admin (rate limited: 10/15min) |
| POST | `/api/logout` | — | Logout |
| GET | `/api/verificar` | JWT | Verificar token |
| GET | `/api/categorias` | — | Listar categorias |
| GET | `/api/saberes` | — | Listar saberes (paginado: page+limit) |
| GET | `/api/saberes/:id` | — | Buscar saber por ID |
| POST | `/api/saberes` | JWT | Criar saber (validado com Zod) |
| PUT | `/api/saberes/:id` | JWT | Atualizar saber (validado com Zod) |
| DELETE | `/api/saberes/:id` | JWT | Remover saber |
| GET | `/api/saberes/:id/conteudo` | — | Conteúdo completo (lazy load) |
| GET | `/api/midia` | — | Listar mídia |
| GET | `/api/dados` | — | Todos dados (lite ou full) |
| POST | `/api/contato` | — | Enviar contato (rate limited: 5/h) |
| GET | `/api/midia-config` | — | Configuração de base URL da mídia |
| GET | `/api/health` | — | Health check |

### Validação de Entrada

Todas as rotas POST/PUT usam **Zod** para validação de schema:

| Schema | Campos |
|--------|--------|
| `loginSchema` | `email` (email, opcional), `senha` (string, obrigatória) |
| `criacaoSaberSchema` | `titulo` (1-200 chars), `descricao` (1-2000), `categoria_id`, `nivel` (enum), `tags` (array), `fonte`, `conteudo` |
| `atualizacaoSaberSchema` | Mesmo que criação, mas todos opcionais |
| `contatoSchema` | `nome` (1-200), `email` (email válido), `assunto` (0-500), `mensagem` (1-5000) |

### Cache no Cliente

O frontend implementa cache em duas camadas:

1. **localStorage**: Dados completos em `saberes_cache` com versão em `saberes_cache_versao`
2. **Service Worker**: Cache-first para assets estáticos, network-first para API

```javascript
// Estratégia de carregamento (js/app.js)
carregarDados() {
  1. Tenta carregar do localStorage (cache)
  2. Se existir, renderiza imediatamente
  3. Fetch de /api/dados em paralelo
  4. Se versão diferente, atualiza cache e re-renderiza
  5. Se fetch falhar, usa cache existente
  6. Se não houver cache, tenta fallback: /data/dados-unificados.json
}
```

## Dados

### Fonte Principal: `data/dados-unificados.json`

- **93+ saberes** em 6 categorias
- Estrutura hierárquica com suporte a lazy loading de conteúdo
- Textos apócrifos integrais incluídos (apócrifos da Biblioteca de Nag Hammadi)

### Estrutura do JSON

```json
{
  "meta": { "versao", "atualizado", "total_apocrifos" },
  "categorias": [ { "id", "nome", "slug", "descricao", "cor", "icone" } ],
  "saberes": [{
    "id", "categoria_id", "titulo", "slug", "descricao",
    "nivel", "duracao", "tags", "fonte", "licenca",
    "conteudo": { /* definicao, insight, citacoes, conceitos, ... */ },
    "praticas": [ { "titulo", "instrucoes", "duracao", "frequencia" } ],
    "conexoes": [ "id-outro-saber" ]
  }],
  "midia": {
    "audios": [...],
    "videos": [...]
  }
}
```

## Segurança

- **JWT**: Tokens com expiração (24h), assinados com `JWT_SECRET`
- **Rate Limiting**: 200 req/15min na API geral, 10/15min no login, 5/h no contato
- **CSRF**: Verificação de Origin/Referer em métodos POST/PUT/DELETE
- **Helmet**: Headers de segurança (HSTS, frameguard, referrerPolicy)
- **CORS**: Configurável via `CORS_ORIGIN`
- **Validação Zod**: Schemas estritos para todas as entradas de usuário
- **Cookies httpOnly**: Token JWT também enviado como cookie seguro

## Service Worker (`sw.js`)

| Estratégia | Aplicação |
|-----------|-----------|
| **Cache First** | Assets estáticos (CSS, JS, fontes, imagens), Cloudinary, Appwrite CDN |
| **Network First** | API calls (`/api/*`), navegação, fallback para cache |
| **Network Only** | Rotas admin (login, logout) |

## Ambiente de Desenvolvimento

```bash
npm run dev     # Servidor com --watch (reinicia automático)
npm start       # Servidor em produção
npm test        # Vitest (testes unitários + integração)
npm run migrate # Migrar JSON → Appwrite
```

## Migração do Projeto

### v3.0 → v4.0 (Arquitetura Atual)

| Componente | v3.0 (Legado) | v4.0 (Atual) |
|-----------|---------------|--------------|
| Backend | PHP + MySQL | Node.js + Express 5 |
| Dados | MySQL + JSON | JSON (fallback) + Appwrite |
| Frontend | HTML único (1031 linhas) | HTML modular + JS modular |
| Auth | Nenhuma | JWT + cookies |
| Cache | Nenhum | localStorage + Service Worker |
| Validação | Nenhuma | Zod (backend) |
| PWA | Nenhum | Manifest + Service Worker |
| Email | Nenhum | EmailJS |
| Mídia | Local | Cloudinary |

## Contagem de Arquivos

| Categoria | Arquivos | Linhas |
|-----------|----------|--------|
| Frontend JS | 7 | ~2.800 |
| CSS | 1 | 2.714 |
| Backend | 1 app.js + 3 libs | ~750 |
| Dados JSON | 1 | 4.508 |
| Scripts | 4 | ~613 |
| Testes | 2 | ~286 |
| Documentação | 6 | ~3.400 |
| **Total** | **~25** | **~15.000** |
