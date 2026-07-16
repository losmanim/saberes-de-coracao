# 🏗️ Arquitetura — Saberes de Coração v4.0

## Stack

| Camada        | Tecnologia                                              |
|---------------|---------------------------------------------------------|
| Backend       | Node.js + Express 5 (ESM)                               |
| Frontend      | HTML semântico + CSS moderno + Vanilla JS (ESM)         |
| Database      | **Appwrite Database** (primário) / JSON file (fallback) |
| Autenticação  | **Appwrite Auth** / Token simples (fallback)            |
| Storage       | **Appwrite Storage** ou Cloudinary                      |
| Email         | **EmailJS** (Node SDK)                                  |
| Service Worker| Cache-first + Network-first strategies                  |

## Estrutura de Diretórios

```
Saberes_de_Coracao-site-3.0/
├── app.js                    # Servidor Express (API + Static)
├── package.json              # Dependências (appwrite, emailjs, express)
├── .env                      # Configuração (não versionado)
├── render.yaml               # Deploy Render
├── sw.js                     # Service Worker (PWA)
│
├── src/
│   └── lib/
│       ├── appwrite.js       # Appwrite SDK wrapper (CRUD saberes, categorias, midia, contatos)
│       └── emailjs.js        # EmailJS SDK wrapper (envio de contato)
│
├── scripts/
│   ├── migrate-to-appwrite.js    # Migra JSON → Appwrite Database
│   └── setup-appwrite-db.js      # Cria coleções no Appwrite
│
├── js/
│   ├── app.js                # Frontend principal (cards, modal, player, busca, admin)
│   └── features.js           # Contato, Auth modal, User accounts (auto-injetado)
│
├── css/
│   └── style.css             # Estilos com glassmorphism, dark/light mode, animações
│
├── data/
│   └── dados-unificados.json # Fonte de verdade JSON (fallback + migração)
│
└── index.html, biblioteca.html, apocrifos.html, 404.html
```

## Fluxo de Dados

### Modo Appwrite (produção)
```
Cliente → API Express (/api/*) → Appwrite SDK → Appwrite Cloud
                                            ↕
                                  Appwrite Database (saberes, categorias, midia, contatos)
                                  Appwrite Auth (sessões)
                                  Appwrite Storage (mídia futuramente)
```

### Modo JSON (desenvolvimento / fallback)
```
Cliente → API Express (/api/*) → lerDadosJSON() / salvarDadosJSON()
                                            ↕
                                  data/dados-unificados.json
```

A detecção é automática: se `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY` e `APPWRITE_DATABASE_ID` estiverem configurados no `.env`, o sistema usa Appwrite. Caso contrário, opera com o JSON.

## API Endpoints

### Autenticação
| Método | Rota              | Descrição                    |
|--------|-------------------|------------------------------|
| POST   | /api/login        | Login (admin password ou Appwrite Auth) |
| POST   | /api/logout       | Logout                       |
| GET    | /api/verificar    | Verifica token               |

### Saberes (CRUD)
| Método | Rota                       | Descrição              |
|--------|----------------------------|------------------------|
| GET    | /api/saberes               | Lista todos            |
| GET    | /api/saberes/:id           | Busca por ID           |
| POST   | /api/saberes               | Criar (auth)           |
| PUT    | /api/saberes/:id           | Atualizar (auth)       |
| DELETE | /api/saberes/:id           | Remover (auth)         |
| GET    | /api/saberes/:id/conteudo  | Conteúdo completo      |

### Outros
| Método | Rota              | Descrição                    |
|--------|-------------------|------------------------------|
| GET    | /api/categorias   | Lista categorias             |
| GET    | /api/midia        | Lista mídia (áudios/vídeos)  |
| GET    | /api/dados        | Dados completos (lite)       |
| POST   | /api/contato      | Enviar contato (EmailJS + DB)|
| GET    | /api/health       | Health check                 |

## Coleções Appwrite Database
Configure as variáveis no arquivo `.env` (não versionado) — veja `.env.example`
### `saberes`
| Campo          | Tipo   | Descrição                     |
|----------------|--------|-------------------------------|
| titulo         | string | Nome do saber                 |
| slug           | string | URL-friendly identifier       |
| descricao      | string | Resumo curto                  |
| categoria_id   | string | ID da categoria               |
| nivel          | string | iniciante / intermediario / avancado |
| duracao        | int    | Minutos estimados             |
| fonte          | string | Origem do conhecimento        |
| licenca        | string | Licença (padrão: Domínio Público) |
| conteudo       | text   | JSON com conteúdo detalhado   |
| praticas       | text   | JSON array de práticas        |
| conexoes       | text   | IDs de saberes relacionados   |
| tags           | text   | CSV de tags                   |

### `categorias`
| Campo    | Tipo   | Descrição        |
|----------|--------|------------------|
| nome     | string | Nome da categoria|
| slug     | string | URL-friendly     |
| descricao| string | Descrição curta  |
| cor      | string | Cor HEX          |
| icone    | string | Ícone CSS        |
| ordem    | int    | Ordem de exibição|

### `contatos`
| Campo    | Tipo   | Descrição              |
|----------|--------|------------------------|
| nome     | string | Nome do contatante     |
| email    | string | Email                  |
| assunto  | string | Assunto da mensagem    |
| mensagem | text   | Conteúdo da mensagem   |
| lido     | bool   | Status de leitura      |

## Configuração Inicial

```bash
# 1. Clonar e instalar
cd Saberes_de_Coracao-site-3.0
npm install

# 2. Configurar variáveis
cp .env.example .env
# Editar .env com suas credenciais

# 3. (Opcional) Configurar Appwrite
npm run setup-db     # Cria as coleções no Appwrite
npm run migrate      # Migra dados do JSON para Appwrite

# 4. Iniciar
npm run dev          # Desenvolvimento com hot-reload
npm start            # Produção
```

## Segurança

- Tokens de admin com 24 bytes aleatórios (crypto.randomBytes)
- Appwrite Auth como camada primária de autenticação
- Admin password como fallback local
- CORS não configurado (servidor serve frontend + API no mesmo origin)
- .env com credenciais não versionado
- Validação de dados no backend (titulo e descricao obrigatórios)
