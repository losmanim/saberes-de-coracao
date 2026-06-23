# Deploy — Saberes de Coração

## Visão Geral

O site usa **Node.js + Express** para servir os arquivos estáticos e a API.
O deploy recomendado é no **Render** (render.com), que tem free tier generoso.

**Pré-requisitos:**
- Conta no [GitHub](https://github.com)
- Conta no [Render](https://render.com) (login com GitHub)

---

## 1. Publicar o código no GitHub

Abra o terminal na pasta do projeto:

```bash
cd /home/lzntn/Documentos/Cofre-Lz_ntn/4_PROJETOS/Saberes-de-Coracao/Saberes_de_Coracao-site-3.0
```

Inicialize o repositório:

```bash
git init
git add .
git commit -m "feat: site 3.0 pronto para deploy"
```

Crie um repositório novo no GitHub (sem README, sem .gitignore):
- Acesse https://github.com/new
- Nome: `saberes-de-coracao`
- Deixe público ou privado (sua escolha)
- **Não** marque "Add a README" nem ".gitignore"

Envie o código:

```bash
git remote add origin https://github.com/SEU-USUARIO/saberes-de-coracao.git
git branch -M main
git push -u origin main
```
https://res.cloudinary.com/deblzssiw/image/upload/f_auto,q_auto/estradaLuz_f9121g
---

## 2. Fazer deploy no Render

### 2.1. Conectar o repositório

1. Acesse https://dashboard.render.com
2. Clique em **New +** → **Web Service**
3. Conecte seu GitHub e selecione o repositório `saberes-de-coracao`

### 2.2. Configurar o serviço

O Render lê automaticamente o `render.yaml`. As configurações serão:

| Campo | Valor |
|-------|-------|
| **Name** | `saberes-de-coracao` |
| **Region** | `Frankfurt (EU)` (mais próximo do Brasil) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | **Free** |

### 2.3. Variáveis de ambiente

Clique em **Environment** e adicione:

| Chave | Valor | Obrigatório |
|-------|-------|-------------|
| `ADMIN_PASS` | Sua senha de admin (a que quiser) | Sim |
| `NODE_VERSION` | `22` | Sim |

### 2.4. Finalizar

Clique em **Create Web Service**.

O Render vai fazer o deploy automaticamente. Em 3-5 minutos o site estará no ar em:

```
https://saberes-de-coracao.onrender.com
```

---

## 3. Próximos deploys

Toda vez que você fizer `git push` para a branch `main`, o Render faz deploy automaticamente.

```bash
git add .
git commit -m "descrição das mudanças"
git push
```

---

## 4. Configurar domínio próprio (opcional)

1. No Render dashboard, vá em **Settings** → **Custom Domain**
2. Adicione seu domínio (ex: `saberesdecoracao.com.br`)
3. Configure os registros DNS apontando para o IP fornecido pelo Render
4. Render gerencia SSL automaticamente (HTTPS grátis)

---

## 5. Alternativas de hospedagem

### Railway (railway.app)
- Semelhante ao Render
- Free tier com créditos mensais (US$ 5/mês grátis)
- Conecta GitHub e faz deploy automático

### Vercel (vercel.com)
- Precisa adaptar o Express para serverless functions
- Mais complexo, mas gratuito e rápido

### Fly.io (fly.io)
- Precisa de Docker ou `flyctl launch`
- Free tier com 3 VMs pequenas

**Recomendação:** Comece com Render. Se precisar de algo mais, migre depois.

---

## 6. Solução de problemas

**Erro: "Cannot find module 'express'"**
→ Certifique-se de que o build command é `npm install`

**Erro 404 na API**
→ Verifique se o servidor está rodando em `https://saberes-de-coracao.onrender.com` (não localhost)

**Site carrega mas sem dados**
→ O JSON em `database/dados-unificados.json` pode ter erro de sintaxe

**Quer testar localmente antes do deploy:**

```bash
cd /home/lzntn/Documentos/Cofre-Lz_ntn/4_PROJETOS/Saberes-de-Coracao/Saberes_de_Coracao-site-3.0
npm install
npm start
```

Acesse: http://localhost:3000
