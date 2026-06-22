## Resumo Detalhado: Saberes de Coração — Site 3.0

---

### 1. Framework / Stack de Frontend

**Não há framework JavaScript moderno.** O frontend é **HTML/CSS/JavaScript puro ("Vanilla")**, tudo contido em único arquivo:

- **`index.html`** (1031 linhas) — Página principal com todo o CSS inline e JavaScript inline.
- **`biblioteca.html`** — Página "Biblioteca" com conteúdo estático em accordions.
- **`404.html`** — Página de erro 404.

Não há `package.json`, nem bundlers (Webpack, Vite), nem frameworks SPA (React, Vue, Svelte). O site foi projetado para funcionar **100% estaticamente** — basta abrir `index.html` no navegador.

---

### 2. Comunicação Cliente-Servidor

Existem **dois modos** de operação, que coexistem no projeto:

#### Modo A (Padrão / Preferido): Arquivo JSON estático
- **Sem requisição de servidor.** O frontend carrega todos os dados de único arquivo JSON via `fetch()`.
- A página principal (`index.html`, linha 702) faz:
  ```javascript
  const response = await fetch('database/dados-unificados.json');
  dados = await response.json();
  ```
- **Não é uma API REST.** É simplesmente baixar um arquivo JSON estático do disco.
- O JSON contém **todos os dados do site**: categorias, saberes, práticas, referências, mídia.

#### Modo B (Opcional): API REST em PHP + MySQL
- Há um backend PHP completo para quando um servidor com MySQL está disponível.
- Não há `fetch()` do frontend para estas APIs — elas existem como camada de dados alternativa. O código do frontend (`index.html`) **não faz chamadas para estas APIs**; ele só carrega o JSON estático.
- Os scripts PHP parecem ser para administração/desenvolvimento, não para o site em produção.

---

### 3. Onde os Endpoints da API são Definidos

Os endpoints da API estão em PHP, localizados em:

```
php/
  config.php           — Singleton Database (MySQLi) + funções auxiliares (response(), getJsonInput())
  config_mysqli.php    — Clone/Duplicata de config.php (mesmo código)
  api/
    categorias.php     — GET /php/api/categorias.php
    saberes.php        — GET|POST|PUT|DELETE /php/api/saberes.php?action=slug&slug=X&action=categoria&categoria_id=X
    praticas.php       — GET|POST|PUT|DELETE /php/api/praticas.php?action=saber&saber_id=X&action=tipo&tipo=X
```

**Rotas da API REST:**

| Método | Endpoint | Parâmetros | Descrição |
|--------|----------|-----------|-----------|
| GET | `categorias.php` | — | Listar todas as categorias |
| GET | `saberes.php` | — | Listar saberes ativos (com join em categorias) |
| GET | `saberes.php?action=slug&slug=X` | slug | Buscar saber por slug |
| GET | `saberes.php?action=categoria&categoria_id=X` | categoria_id | Filtrar saberes por categoria |
| POST | `saberes.php` | JSON body | Criar novo saber |
| PUT | `saberes.php` | JSON body | Atualizar saber |
| DELETE | `saberes.php` | JSON body | Excluir saber |
| GET | `praticas.php` | — | Listar práticas (com join em saberes) |
| GET | `praticas.php?action=saber&saber_id=X` | saber_id | Práticas por saber |
| GET | `praticas.php?action=tipo&tipo=X` | tipo | Práticas por tipo |
| POST | `praticas.php` | JSON body | Criar prática |
| PUT | `praticas.php` | JSON body | Atualizar prática |
| DELETE | `praticas.php` | JSON body | Excluir prática |

---

### 4. Como o Frontend Busca Dados do Backend

**No modo de produção (padrão):** Nenhuma chamada de rede para um servidor de aplicação. O único `fetch()` é:

```javascript
// index.html, linha 702
const response = await fetch('database/dados-unificados.json');
dados = await response.json();
```

A partir daí, todos os dados (16 saberes, 3 práticas, 10 áudios, 4 vídeos) estão disponíveis no objeto `dados` em memória. A filtragem, busca e renderização são feitas inteiramente no lado do cliente com JavaScript puro:

- **Filtro por categoria:** `dados.saberes.filter(s => s.categoria_id === parseInt(cat))`
- **Busca por texto:** `dados.saberes.filter(s => s.titulo.includes(termo) || s.descricao.includes(termo) || s.tags.some(...))`
- **Renderização:** Template strings de HTML inseridas com `innerHTML`

O PHP backend (API REST + MySQL) existe como uma camada opcional — provavelmente usada se/quando o proprietário quiser gerenciar dados através de um CMS ou dashboard, mas o site em si não depende disso.

---

### 5. Autenticação/Autorização

**Não há autenticação ou autorização.** O projeto:
- Não tem login de usuário
- Não tem sessões
- Não tem JWT/tokens
- Não tem controle de acesso baseado em função (RBAC)
- Não tem cookies de autenticação

A tabela `progresso` no schema SQL sugere que um recurso de acompanhamento de progresso do usuário foi planejado, mas não há implementação de autenticação para suportá-lo. O schema SQL não inclui uma tabela `usuarios`.

---

### 6. Principais Modelos de Dados

#### Banco de Dados MySQL (definido em `database/schema.sql`):

| Tabela | Campos Principais |
|--------|------------------|
| **categorias** | `id`, `nome`, `descricao`, `cor`, `icone`, `created_at`, `updated_at` |
| **saberes** | `id`, `titulo`, `slug` (UNIQUE), `categoria_id` (FK), `descricao`, `conteudo` (MEDIUMTEXT), `tags` (JSON), `fonte`, `nivel` (ENUM: iniciante|intermediario|avancado), `duracao_minutos`, `ativo`, `created_at`, `updated_at` |
| **praticas** | `id`, `saber_id` (FK), `titulo`, `tipo` (ENUM: respiracao|meditacao|contemplacao|chakra|outro), `instrucoes`, `duracao_minutos`, `frequencia` (ENUM: diaria|semanal|sob-demanda) |
| **progresso** | `id`, `saber_id` (FK), `status` (ENUM: nao-iniciado|em-progresso|concluido), `nota`, `concluido_em` |
| **diarios** | `id`, `data` (UNIQUE), `reflexao`, `sentimento`, `nivel_energia` (1-10), `observacoes` |
| **conexoes** | `id`, `saber_de_id` (FK), `saber_para_id` (FK), `tipo_conexao` (ENUM: requisito|complementar|continuacao|relacionado), UNIQUE(saber_de_id, saber_para_id) |

#### Modelo JSON (arquivo `database/dados-unificados.json`):

O JSON é a **fonte única de verdade** usada pelo site. Estrutura:

```json
{
  "meta": { "versao", "atualizado", "descricao" },
  "categorias": [ { "id", "nome", "slug", "descricao", "cor", "icone" } ],
  "saberes": [ {
    "id", "categoria_id", "titulo", "slug", "descricao", "nivel",
    "duracao", "tags", "fonte", "licenca",
    "conteudo": { "definicao", "citacoes", "conceitos", "analogia",
                  "insight", "principios", "mundos", "textos",
                  "aplicacoes", "fatores", "mecanismos" },
    "praticas": [ { "titulo", "instrucoes", "duracao", "frequencia" } ],
    "conexoes": [ "id-outro-saber" ]
  } ],
  "praticas": [ { "id", "nome", "saberes": [], "instrucoes", "duracao", "frequencia" } ],
  "referencias": { "obras": [], "links": [] },
  "midia": {
    "audios": [ { "id", "titulo", "categoria", "tags", "arquivo", "saberes_relacionados" } ],
    "videos": [ { "id", "titulo", "categoria", "tags", "arquivo", "saberes_relacionados" } ]
  }
}
```

O JSON contém: **5 categorias** (Espírito, Práticas, Ciência, Jornada, Vida Verdadeira), **16 saberes**, **3 práticas**, **10 áudios**, **4 vídeos**.

---

### 7. Arquivos Chave e Suas Funções

| Arquivo | Função |
|---------|--------|
| `index.html` | Página principal e único JS/CSS; todo o frontend em um arquivo |
| `biblioteca.html` | Página "Biblioteca" estática com accordions para leitura aprofundada |
| `404.html` | Página de erro 404 |
| `database/dados-unificados.json` | **Fonte única de dados** — todos os conteúdos do site |
| `database/schema.sql` | Schema do banco MySQL (tabelas, índices, views) |
| `php/config.php` | Classe Database (singleton MySQLi) + helpers `response()` e `getJsonInput()` |
| `php/config_mysqli.php` | Duplicata de config.php |
| `php/api/categorias.php` | API REST: CRUD de categorias (só GET implementado) |
| `php/api/saberes.php` | API REST: CRUD completo de saberes |
| `php/api/praticas.php` | API REST: CRUD completo de práticas |
| `import-data.php` | Script CLI para importar JSON para MySQL |
| `import-data-mysqli.php` | Script de import alternativo |
| `import-data-mysqli-v2.php` | Script de import alternativo v2 |
| `midia/audios/` | Arquivos de áudio (links simbólicos para `/home/lzntn/Público/audios-lz/`) |
| `midia/videos/` | Arquivos de vídeo (links simbólicos para `/home/lzntn/Público/videos-lz/`) |
| `sitemap.xml` | Sitemap para SEO |

---

### Resumo da Arquitetura

```
                   Modo Produção (Padrão)
                   ======================
  Navegador  ---fetch()--->  database/dados-unificados.json  (arquivo JSON estático)
     |                            |
     |  JavaScript puro           |
     |  - Filtra localmente       |
     |  - Busca localmente        |
     |  - Renderiza com innerHTML |
     v                            |
  DOM atualizado                  |

                   Modo Servidor (Opcional)
                   =========================
  Cliente HTTP  --->  php/api/*.php  --->  MySQL (saberes_de_coracao)
                      (REST API, JSON responses)
```

**Principais conclusões:**

1. **Não há framework frontend** — é HTML/CSS/JS puro.
2. **Não há framework backend** — PHP vanilla com MySQLi.
3. **Comunicação cliente-servidor**: O modo padrão não requer servidor (fetch de JSON estático). O backend PHP é opcional.
4. **Sem autenticação**: Site completamente público.
5. **Arquivo único**: `index.html` contém todo o CSS e JS do site principal.
6. **Dados centralizados**: `database/dados-unificados.json` é a fonte de dados definitiva.
