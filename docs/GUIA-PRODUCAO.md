# GUIA DE PRODUÇÃO — Saberes de Coração

Setup completo para ambiente de produção com Appwrite, EmailJS e Cloudinary.

---

## ÍNDICE

1. [Pré-requisitos](#1-pré-requisitos)
2. [Appwrite — Banco de Dados](#2-appwrite--banco-de-dados)
3. [EmailJS — Envio de Emails](#3-emailjs--envio-de-emails)
4. [Cloudinary — Mídia](#4-cloudinary--mídia)
5. [Variáveis de Ambiente](#5-variáveis-de-ambiente)
6. [Deploy no Render](#6-deploy-no-render)
7. [Verificação Pós-Deploy](#7-verificação-pós-deploy)

---

## 1. PRÉ-REQUISITOS

- Conta gratuita em: [Appwrite Cloud](https://cloud.appwrite.io)
- Conta gratuita em: [EmailJS](https://www.emailjs.com)
- Conta (opcional) em: [Cloudinary](https://cloudinary.com)
- Conta em: [Render](https://render.com) (para deploy)

---

## 2. APPWRITE — BANCO DE DADOS

### 2.1 Criar Projeto

1. Acesse https://cloud.appwrite.io
2. Crie um **Novo Projeto**
   - Nome: `Saberes de Coração`
   - ID: `saberes-de-coracao` (ou um personalizado)
   - Região: escolha a mais próxima (EUA ou Europa)
3. Após criar, vá em **Settings** → copie o **Project ID**

### 2.2 Criar API Key

1. Vá em **Settings** → **API Keys**
2. Clique **Create API Key**
3. Nome: `Admin API Key`
4. Escopos (selecionar todos):
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `users.read`
   - `users.write`
5. Clique **Create**
6. **COPIE A CHAVE IMEDIATAMENTE**ope (não será mostrada novamente)

> ⚠️ `collections.read` e `collections.write` aparecem como **Deprecated** no console do Appwrite 1.9.x, mas ainda são exigidas para criação programática de coleções. Se preferir, pule estes escopos e crie as coleções manualmente (seção 2.5).

### 2.3 Criar Database

1. Vá em **Databases**
2. Clique **Create Database**
3. Nome: `saberes-coracao`
4. ID: pode ser o gerado automaticamente
5. **COPIE O DATABASE ID**

### 2.4 Configurar Variáveis no .env

Edite o `.env` na raiz do projeto:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<cole_o_project_id_aqui>
APPWRITE_API_KEY=<cole_a_api_key_aqui>
APPWRITE_DATABASE_ID=<cole_o_database_id_aqui>
APPWRITE_SABERES_COLLECTION_ID=saberes
APPWRITE_CATEGORIAS_COLLECTION_ID=categorias
APPWRITE_MIDIA_COLLECTION_ID=midia
APPWRITE_CONTATOS_COLLECTION_ID=contatos
APPWRITE_USUARIOS_COLLECTION_ID=usuarios_dados
```

### 2.5 Criar Coleções Manualmente (Recomendado)

O console do Appwrite 1.9.x depreciou os escopos `collections.*` para API Keys, então o script `npm run setup-db` pode falhar. Crie as **5 coleções manualmente** pelo Console Appwrite.

**Passo a passo para cada coleção:**

1. No Console Appwrite, vá em **Databases** → sua database `saberes-coracao`
2. Clique **Create Collection**
   - **Collection ID:** use o nome exato abaixo
   - **Name:** use o nome exato abaixo
3. Após criar, vá na aba **Attributes** e clique **Create Attribute** para **cada campo** da tabela
4. ⚠️ Só depois de criar **todos os atributos**, vá na aba **Indexes** e crie os índices

> ⚠️ Respeite **exatamente** os nomes, tipos e tamanhos dos atributos — o código espera esses nomes.
>
> ⚠️ **ATENÇÃO — Índices:** Crie todos os atributos da coleção **antes** de criar os índices. O dropdown de atributos no Indexes só funciona se o atributo já existir. O tipo do índice é **Key** (padrão), não Fulltext.

---

#### 📁 Coleção: `saberes` — "Saberes"

| Atributo | Tipo | Tamanho | Requerido |
|----------|------|---------|-----------|
| `titulo` | string | 256 | sim |
| `slug` | string | 256 | não |
| `descricao` | string | 1024 | não |
| `categoria_id` | string | 10 | sim |
| `nivel` | string | 32 | não |
| `duracao` | string | 10 | não |
| `fonte` | string | 256 | não |
| `licenca` | string | 64 | não |
| `conteudo` | string | 16384 | não |
| `praticas` | string | 4096 | não |
| `conexoes` | string | 1024 | não |
| `tags` | string | 512 | não |
| `criado_em` | string | 64 | não |
| `atualizado_em` | string | 64 | não |

**Índices:**
- `idx_categoria` → atributo: `categoria_id`, ordem: ASC
- `idx_slug` → atributo: `slug`, ordem: ASC
- `idx_titulo` → atributo: `titulo`, ordem: ASC

---

#### 📁 Coleção: `categorias` — "Categorias"

| Atributo | Tipo | Tamanho | Requerido |
|----------|------|---------|-----------|
| `nome` | string | 128 | sim |
| `slug` | string | 128 | não |
| `descricao` | string | 512 | não |
| `cor` | string | 16 | não |
| `icone` | string | 64 | não |
| `ordem` | string | 10 | não |

---

#### 📁 Coleção: `midia` — "Mídia"

| Atributo | Tipo | Tamanho | Requerido |
|----------|------|---------|-----------|
| `titulo` | string | 256 | sim |
| `tipo` | string | 16 | sim |
| `arquivo` | string | 512 | não |
| `categoria` | string | 128 | não |
| `tags` | string | 512 | não |
| `saberes_relacionados` | string | 1024 | não |
| `criado_em` | string | 64 | não |

---

#### 📁 Coleção: `contatos` — "Contatos"

| Atributo | Tipo | Tamanho | Requerido |
|----------|------|---------|-----------|
| `nome` | string | 256 | sim |
| `email` | string | 256 | sim |
| `assunto` | string | 512 | não |
| `mensagem` | string | 4096 | sim |
| `lido` | string | 8 | não |
| `criado_em` | string | 64 | não |

---

#### 📁 Coleção: `usuarios_dados` — "Usuários Dados"

| Atributo | Tipo | Tamanho | Requerido |
|----------|------|---------|-----------|
| `user_id` | string | 128 | sim |
| `nome_exibicao` | string | 256 | não |
| `favoritos` | string | 4096 | não |
| `progresso` | string | 8192 | não |
| `anotacoes` | string | 16384 | não |
| `criado_em` | string | 64 | não |
| `atualizado_em` | string | 64 | não |

**Índice:**
- `idx_user` → atributo: `user_id`, ordem: ASC

---

> 💡 **Dica:** Crie uma coleção por vez. Após criar todos os atributos de uma, passe para a próxima. O processo leva cerca de 15 minutos.

### 2.6 Criar Usuário Admin no Appwrite Auth

O script de setup **não** cria usuários — você precisa criar manualmente:

1. No console Appwrite, vá em **Auth** → **Users**
2. Clique **Create User**
3. Email: `admin@saberes.com` (ou seu email pessoal)
4. Senha: **anote essa senha** (será usada como `ADMIN_PASS`)
5. Clique **Create**

### 2.7 Migrar Dados do JSON para Appwrite

Com as coleções criadas e o `.env` configurado:

```bash
npm run migrate
```

Isso irá:
- Importar todas as **categorias** do `data/dados-unificados.json`
- Importar todos os **saberes** (com conteúdo, tags, práticas)
- Importar toda a **mídia** (áudios e vídeos)

### 2.8 Verificar Migração

1. No console Appwrite, vá em **Databases** → sua database
2. Clique em cada coleção e verifique se os documentos foram criados
3. Teste localmente: inicie o servidor e veja se aparece "Modo Appwrite ativado"

```bash
node app.js
# Deve mostrar: 🔌 Modo Appwrite ativado
```

---

## 3. EMAILJS — ENVIO DE EMAILS

### 3.1 Criar Conta e Service

1. Acesse https://www.emailjs.com
2. Crie uma conta gratuita (200 emails/mês)
3. Vá em **Email Services** → **Add New Service**
4. Escolha seu provedor de email (Gmail, Outlook, SMTP, etc.)
5. Conecte sua conta de email e **anote o Service ID** (ex: `service_xxxxx`)

### 3.2 Criar Template de Email

1. Vá em **Email Templates** → **Create New Template**
2. Nome: `Contato Saberes de Coração`
3. **Template ID**: anote (ex: `template_xxxxx`)
4. Conteúdo do template (modo HTML ou editor visual):

```
📬 Nova mensagem de {{from_name}}

Nome: {{from_name}}
Email: {{from_email}}
Assunto: {{subject}}

Mensagem:
{{message}}

---
Responder para: {{reply_to}}
```

Variáveis necessárias que o código envia:
- `from_name` — nome do remetente
- `from_email` — email do remetente
- `subject` — assunto da mensagem
- `message` — corpo da mensagem
- `reply_to` — email para resposta
- `to_name` — "Saberes de Coração"

### 3.3 Obter Chaves de API

1. Vá em **Account** → **API Keys**
2. Anote a **Public Key** e a **Private Key**

### 3.4 Adicionar ao .env

```env
EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_ID=template_xxxxx
EMAILJS_PUBLIC_KEY=sua_public_key
EMAILJS_PRIVATE_KEY=sua_private_key
```

---

## 4. CLOUDINARY — MÍDIA

### 4.1 Setup Opcional

O projeto pode servir mídia local ou via Cloudinary. Se seus áudios/vídeos estiverem armazenados localmente, coloque-os em:

```
midia/audios/
midia/videos/
```

### 4.2 Se usar Cloudinary

1. Crie conta em https://cloudinary.com
2. Faça upload dos arquivos de áudio/vídeo
3. Copie as URLs completas para o campo `arquivo` no JSON
4. Configure a URL base no `.env`:

```env
MIDIA_BASE_URL=https://res.cloudinary.com/seu_usuario
```

> **Nota:** Se o campo `arquivo` no JSON começar com `http`, o código usa a URL diretamente. Caso contrário, ele monta a URL como `MIDIA_BASE_URL/audios/nome-do-arquivo`.

---

## 5. VARIÁVEIS DE AMBIENTE

### 5.1 Arquivo `.env` completo para produção

```env
PORT=3000
ADMIN_PASS=<senha_forte_que_você_criou_no_usuario_admin>
JWT_SECRET=<gere_um_hash_seguro_64_caracteres>
CORS_ORIGIN=https://saberes-de-coracao.onrender.com
NODE_VERSION=22
LOG_LEVEL=info

# Appwrite
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=seu_project_id
APPWRITE_API_KEY=sua_api_key
APPWRITE_DATABASE_ID=seu_database_id
APPWRITE_SABERES_COLLECTION_ID=saberes
APPWRITE_CATEGORIAS_COLLECTION_ID=categorias
APPWRITE_MIDIA_COLLECTION_ID=midia
APPWRITE_CONTATOS_COLLECTION_ID=contatos
APPWRITE_USUARIOS_COLLECTION_ID=usuarios_dados

# EmailJS
EMAILJS_SERVICE_ID=service_xxxxx
EMAILJS_TEMPLATE_ID=template_xxxxx
EMAILJS_PUBLIC_KEY=sua_public_key
EMAILJS_PRIVATE_KEY=sua_private_key

# Cloudinary (opcional)
MIDIA_BASE_URL=https://res.cloudinary.com/deblzssiw
```

### 5.2 Gerar JWT_SECRET seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copie o resultado e use como JWT_SECRET
```

### 5.3 Gerar ADMIN_PASS seguro

Use o mesmo email e senha que você criou no Appwrite Auth (etapa 2.6).

---

## 6. DEPLOY NO RENDER

### 6.1 Via Render Dashboard

1. Faça login em https://dashboard.render.com
2. Clique **New** → **Web Service**
3. Conecte seu repositório GitHub
4. Configure:

| Campo | Valor |
|-------|-------|
| Name | `saberes-de-coracao` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `node app.js` |
| Plan | `Free` (ou pago para mais recursos) |

### 6.2 Adicionar Variáveis de Ambiente no Render

Em **Environment Variables**, adicione **TODAS** as variáveis da seção 5.1:

**Importante:** Para `ADMIN_PASS` e `JWT_SECRET`, marque a opção **"Generate a value..."** ou digite manualmente e marque como `secret`.

**Variáveis obrigatórias no Render:**

```
ADMIN_PASS=<valor secreto>
JWT_SECRET=<valor secreto>
CORS_ORIGIN=https://saberes-de-coracao.onrender.com
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<id>
APPWRITE_API_KEY=<chave>
APPWRITE_DATABASE_ID=<id>
APPWRITE_SABERES_COLLECTION_ID=saberes
APPWRITE_CATEGORIAS_COLLECTION_ID=categorias
APPWRITE_MIDIA_COLLECTION_ID=midia
APPWRITE_CONTATOS_COLLECTION_ID=contatos
APPWRITE_USUARIOS_COLLECTION_ID=usuarios_dados
EMAILJS_SERVICE_ID=<id>
EMAILJS_TEMPLATE_ID=<id>
EMAILJS_PUBLIC_KEY=<chave>
EMAILJS_PRIVATE_KEY=<chave>
MIDIA_BASE_URL=https://res.cloudinary.com/deblzssiw
```

### 6.3 Via render.yaml (auto-deploy)

O arquivo `render.yaml` já está configurado no repositório. Mas você precisa adicionar as variáveis manualmente no dashboard do Render, pois as variáveis sensíveis (`sync: false`) não vão no YAML.

### 6.4 Após o Deploy

1. Acesse `https://saberes-de-coracao.onrender.com`
2. Verifique se o site carrega corretamente
3. Teste o login admin
4. Teste o formulário de contato (verifique se o email chega)
5. Teste a busca e filtros
6. Teste o player de mídia

---

## 7. VERIFICAÇÃO PÓS-DEPLOY

### 7.1 Health Check

```bash
curl https://saberes-de-coracao.onrender.com/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "versao": "4.0.0",
  "modo": "appwrite",
  "emailjs": true
}
```

### 7.2 Testar API

```bash
# Listar saberes
curl https://saberes-de-coracao.onrender.com/api/saberes | jq '. | length'

# Listar categorias
curl https://saberes-de-coracao.onrender.com/api/categorias | jq

# Login admin
curl -X POST https://saberes-de-coracao.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"senha":"sua_senha_admin"}'
```

### 7.3 Verificar Logs

No Render: Dashboard → seu serviço → **Logs**

Verifique se:
- O servidor iniciou sem erros
- Aparece "Modo Appwrite ativado"
- Não há erros de conexão com Appwrite

### 7.4 Troubleshooting

| Problema | Causa Provável | Solução |
|----------|---------------|---------|
| Modo JSON em produção | Appwrite não configurado | Verificar `APPWRITE_*` no .env |
| Login falha | ADMIN_PASS ≠ senha do usuário Appwrite | Verificar se USER existe no Auth |
| Email não chega | EmailJS configurado incorretamente | Verificar template e service IDs |
| 404.html sem CSS | Link para `estilo.css` | Já corrigido — puxe a versão mais recente |
| Service Worker falha | Path `/database/` inexistente | Já corrigido — puxe a versão mais recente |
| Player não toca | Mídia não encontrada | Verificar caminho do arquivo ou Cloudinary |

---

## Checklist Final

- [ ] Projeto Appwrite criado
- [ ] API Key gerada com escopos `databases.*` e `users.*`
- [ ] Database criado
- [ ] 5 coleções criadas manualmente (saberes, categorias, midia, contatos, usuarios_dados)
- [ ] Usuário admin criado no Appwrite Auth
- [ ] `npm run migrate` executado com sucesso
- [ ] Conta EmailJS criada
- [ ] Service EmailJS configurado (Gmail/SMTP)
- [ ] Template EmailJS criado com as variáveis corretas
- [ ] Arquivo `.env` com todas as variáveis preenchidas
- [ ] `JWT_SECRET` gerado com `crypto.randomBytes(32)`
- [ ] `CORS_ORIGIN` configurado para o domínio do Render
- [ ] Deploy no Render com todas as env vars
- [ ] Health check retorna `modo: "appwrite"`
- [ ] Login admin funcional
- [ ] Formulário de contato envia email
- [ ] PWA funcional (manifest, service worker)
