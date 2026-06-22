# 🌐 Saberes de Coração — Site 3.0

> "O verdadeiro conhecimento deve ser passado de coração, com boa vontade, em empatia ativa, elevando o campo."

---

## 📋 O Que É

O Site 3.0 é a interface interativa do projeto Saberes de Coração. É uma aplicação web **100% estática** (apenas HTML + CSS + JavaScript) que carrega dados dinamicamente de um arquivo JSON.

**Não precisa de servidor** para funcionar localmente — basta abrir o `index.html` no navegador.

---

## 🚀 Como Abrir (3 Formas)

### Forma 1: Diretamente no Navegador (Mais Fácil)

1. Abra o gerenciador de arquivos
2. Navegue até a pasta `Saberes_de_Coracao-site-3.0/`
3. Clique duas vezes em `index.html`
4. Pronto! O site abre no navegador

### Forma 2: Via Terminal

```bash
# Abra com o navegador padrão
xdg-open "Saberes_de_Coracao-site-3.0/index.html"

# Ou com Firefox
firefox "Saberes_de_Coracao-site-3.0/index.html"

# Ou com Chrome
google-chrome "Saberes_de_Coracao-site-3.0/index.html"
```

### Forma 3: Servidor Local (Para Desenvolvimento)

```bash
# Com Python (já vem instalado no Linux)
cd "Saberes_de_Coracao-site-3.0/"
python3 -m http.server 8080

# Acesse: http://localhost:8080
```

---

## 🏗️ Estrutura do Site

```
Saberes_de_Coracao-site-3.0/
├── index.html              ← Página principal (único arquivo do site)
├── 404.html                ← Página de erro
├── sitemap.xml             ← Mapa do site para SEO
├── database/
│   └── dados-unificados.json  ← Fonte de dados (JSON)
├── php/                    ← Scripts para banco de dados (opcional)
│   ├── config.php
│   ├── config_mysqli.php
│   └── api/
│       ├── categorias.php
│       ├── praticas.php
│       └── saberes.php
└── README.md               ← Este arquivo
```

---

## 🎯 Funcionalidades

| Funcionalidade | Descrição |
|---------------|-----------|
| **Cards interativos** | Clique em qualquer card para ver o conteúdo completo |
| **Busca** | Pesquise por título, descrição ou tags |
| **Filtro por pilares** | Filtre por: Espírito, Práticas, Ciência, Jornada, Vida Verdadeira |
| **Multimídia** | Aba dedicada com áudios e vídeos |
| **Dark/Light mode** | Alterne entre tema escuro e claro |
| **Responsivo** | Funciona em celular, tablet e desktop |
| **Conexões** | Cada saber mostra conexões com outros saberes |
| **Práticas** | Instruções detalhadas dentro de cada card |

---

## 📊 Dados do Site

O site carrega dados de `database/dados-unificados.json`:

| Seção | Quantidade |
|-------|-----------|
| Categorias | 5 (Espírito, Práticas, Ciência, Jornada, Vida Verdadeira) |
| Saberes | 16 |
| Práticas | 3 |
| Áudios | 10 |
| Vídeos | 4 |

---

## 🔧 Como Adicionar Novo Conteúdo

### Adicionar um Novo Saber

Edite `database/dados-unificados.json` e adicione um objeto na array `saberes`:

```json
{
  "id": "novo-saber-1",
  "categoria_id": 1,
  "titulo": "Título do Saber",
  "slug": "novo-saber",
  "descricao": "Descrição breve",
  "nivel": "iniciante",
  "duracao": 15,
  "tags": ["tag1", "tag2"],
  "fonte": "Fonte do conteúdo",
  "conteudo": {
    "definicao": "Definição completa",
    "citacoes": ["Citação relevante"]
  },
  "praticas": [],
  "conexoes": ["gnose-1"]
}
```

### Adicionar Multimídia

1. Coloque o arquivo na pasta correta:
   - Áudios: `/home/lzntn/Público/audios-lz/`
   - Vídeos: `/home/lzntn/Público/videos-lz/`

2. Adicione a entrada no JSON (`midia.audios` ou `midia.videos`):

```json
{
  "id": "audio-011",
  "titulo": "Título do Áudio",
  "categoria": "categoria",
  "tags": ["tag1", "tag2"],
  "arquivo": "caminho/relativo/arquivo.mp3",
  "saberes_relacionados": ["gnose-1"]
}
```

3. **Importante:** Para multimídia funcionar, crie links simbólicos:
   ```bash
   cd Saberes_de_Coracao-site-3.0/
   mkdir -p midia
   ln -s /home/lzntn/Público/audios-lz midia/audios
   ln -s /home/lzntn/Público/videos-lz midia/videos
   ```

---

## 🎨 Cores dos Pilares

| Pilar | Cor | ID |
|-------|-----|-----|
| 🜂 Espírito | Roxo (#9b59b6) | 1 |
| 🧠 Práticas | Azul (#3498db) | 2 |
| 🔬 Ciência | Verde (#2ecc71) | 3 |
| 🧭 Jornada | Laranja (#e67e22) | 4 |
| ∞ Vida Verdadeira | Vermelho (#e74c3c) | 5 |
| 🎵 Multimídia | Rosa (#e91e63) | midia |

---

## ⚠️ Notas Importantes

1. **JSON deve ser válido** — Um erro de sintaxe no JSON quebra o site inteiro
2. **IDs devem ser únicos** — Cada saber precisa de um `id` único
3. **Conexões devem existir** — Se um saber referencia `conexoes: ["x"]`, o saber `x` deve existir
4. **Multimídia requer servidor** — Para áudio/vídeo funcionar, use `python3 -m http.server`

---

## 📝 Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 2026-05-03 | Site original com accordion, timeline, quiz |
| 2.0 | 2026-05-06 | SEO, favoritos, busca, 404 |
| 3.0 | 2026-05-17 | Cards, modal, multimídia, refatoração |

---

*"O conhecimento que não se compartilha é como a luz sob o alqueire."*

© 2026 — Saberes de Coração
