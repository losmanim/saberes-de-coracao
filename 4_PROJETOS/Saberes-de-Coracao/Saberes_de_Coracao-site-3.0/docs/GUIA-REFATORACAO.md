# Guia de Refatoração — Saberes de Coração v4.0

> **Data:** 2026-05-25  
> **Versão do Documento:** 1.0  
> **Autor:** Equipe de Desenvolvimento — Saberes de Coração  
> **Propósito:** Guia didático completo para desenvolvedores que desejam entender, manter e estender o projeto Saberes de Coração v4.0.

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [O Problema: Conteúdo Disperso](#2-o-problema-conteúdo-dispero)
3. [A Solução: Integração no `dados-unificados.json`](#3-a-solução-integração-no-dados-unificadosjson)
4. [Mapeamento Completo dos Novos Saberes](#4-mapeamento-completo-dos-novos-saberes)
5. [Estrutura do JSON (Guia de Schema)](#5-estrutura-do-json-guia-de-schema)
6. [Como Adicionar um Novo Saber (Passo a Passo)](#6-como-adicionar-um-novo-saber-passo-a-passo)
7. [Formatos de Conteúdo (Content Shapes)](#7-formatos-de-conteúdo-content-shapes)
8. [Guia do `app.js` (Arquitetura do Frontend)](#8-guia-do-appjs-arquitetura-do-frontend)
9. [Guia do CSS (Design System)](#9-guia-do-css-design-system)
10. [Guia da `biblioteca.html`](#10-guia-da-bibliotecahtml)
11. [Fluxo de Trabalho Recomendado](#11-fluxo-de-trabalho-recomendado)
12. [Manutenção e Boas Práticas](#12-manutenção-e-boas-práticas)

---

## 1. Visão Geral do Projeto

### 1.1 O Que é Saberes de Coração?

Saberes de Coração é uma **plataforma de conhecimento espiritual/filosófico** de código aberto que reúne saberes de múltiplas tradições — Gnose, Hermetismo, Teosofia, Taoísmo, Estoicismo, Cristianismo Primitivo, Ciência (Epigenética, Física Quântica), Práticas Contemplativas e Filosofia da Mente — em um único ecossistema digital integrado.

O projeto não é uma religião nem um culto. É um **mapa de sabedoria** que convida à experiência direta, à prática e à integração do conhecimento no viver cotidiano.

### 1.2 Os 5 Pilares

Todo o conteúdo está organizado em 5 categorias (pilares):

| ID | Nome | Slug | Cor | Ícone | Descrição |
|----|------|------|-----|-------|-----------|
| 1 | ESPÍRITO | `espirito` | `#9b59b6` (roxo) | `fa-heart` | Conhecimento Gnóstico — Gnose, Hermetismo, Teosofia |
| 2 | PRÁTICAS | `praticas` | `#3498db` (azul) | `fa-brain` | Trabalho Interior — Meditação, Kundalini, Respiração |
| 3 | CIÊNCIA | `ciencia` | `#2ecc71` (verde) | `fa-flask` | Conhecimento Baseado em Evidências — Epigenética, Éter |
| 4 | JORNADA | `jornada` | `#e67e22` (laranja) | `fa-compass` | Transformação — Jornada da Consciência |
| 5 | VIDA VERDADEIRA | `vida-verdadeira` | `#e74c3c` (vermelho) | `fa-infinity` | Integração — Tao, Pneuma, Hermetismo |

### 1.3 Arquitetura Geral

O projeto adota uma arquitetura **static JSON + Vanilla JS SPA** (Single Page Application):

```
┌─────────────────────────────────────────────────┐
│                   index.html                     │
│  (SPA — carrega dados via fetch, renderiza DOM) │
└───────────────────────┬─────────────────────────┘
                        │ fetch('database/dados-unificados.json')
                        ▼
┌─────────────────────────────────────────────────┐
│           database/dados-unificados.json         │
│  (Fonte única de verdade — ~2500 linhas)        │
│  Contém: meta, categorias, saberes, praticas,   │
│          referencias, midia                      │
└─────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   app.js     │ │  style.css   │ │biblioteca.html│
│ (lógica SPA) │ │ (design sys) │ │ (leitura    )│
└──────────────┘ └──────────────┘ └──────────────┘
```

### 1.4 Tech Stack

| Camada | Tecnologia | Função |
|--------|-----------|--------|
| **HTML** | HTML5 semântico | Estrutura das páginas (`index.html`, `biblioteca.html`, `404.html`) |
| **CSS** | CSS3 com variáveis custom | Design system, temas claro/escuro, responsividade |
| **JavaScript** | Vanilla JS (ES6+) | SPA, fetch do JSON, manipulação do DOM, player de mídia |
| **Dados** | JSON estruturado | Fonte única de dados (`dados-unificados.json`) |
| **Banco** | MySQL (opcional) | `schema.sql` para deploy com backend PHP |
| **Backend** | PHP (opcional) | APIs REST para servir dados via MySQL |

### 1.5 Estrutura de Arquivos

```
Saberes_de_Coracao-site-3.0/
├── index.html                  # Página principal (SPA)
├── biblioteca.html             # Página estática de leitura profunda
├── 404.html                    # Página de erro 404
├── README.md                   # Documentação inicial
├── sitemap.xml                 # Sitemap para SEO
├── css/
│   └── style.css               # Design system completo (780 linhas)
├── js/
│   └── app.js                  # Lógica SPA (771 linhas)
├── database/
│   ├── dados-unificados.json   # Fonte única de dados (~2500 linhas)
│   ├── schema.sql              # Schema MySQL
│   └── comunicacaoClientServer.md
├── php/
│   ├── config.php
│   ├── config_mysqli.php
│   ├── import-data.php
│   ├── import-data-mysqli.php
│   ├── import-data-mysqli-v2.php
│   └── api/
│       ├── categorias.php
│       ├── saberes.php
│       └── praticas.php
└── midia/
    ├── audios/                 # Arquivos .mp3
    └── videos/                 # Arquivos .mp4
```

---

## 2. O Problema: Conteúdo Disperso

### 2.1 Antes da Refatoração

Antes da v4.0, o conteúdo do projeto existia espalhado por **4 caminhos diferentes** no sistema de arquivos, com **mais de 30 projetos web independentes**:

#### Caminho 1: `/home/lzntn/Modelos/`

```
Modelos/
├── JESUS/
├── helena-blavatsky/
├── kundalini/
├── Lvrs - gnss/
├── oCoracao/
├── oTaoOuDao/
├── pistisSofia/
├── pneuma/
├── serOuConsciencia/
├── sentidoGitHub/
├── siteGnostico/
├── tecnica-meditacao/
├── teosofia/
├── vidaVerdadeira/
└── camino-verdade/
```

#### Caminho 2: `/run/media/lzntn/rootMX23/home/lz-ntn/Modelos/Lz_ntn/`

```
Lz_ntn/
├── Conhecimento Antigo/
├── Coração/
├── Cristianismo Primitivo/
├── Epigenética/
├── Éter/
├── Gnose/
├── Hermetismo/
├── Jornada da Consciência/
├── Kundalini/
├── Mantras/
├── Meditação/
├── Pneuma/
├── Respiração/
├── Saberes/
├── Ser ou Consciência/
├── Tao/
└── Teosofia/
```

#### Caminho 3: `/home/lzntn/Documentos/iCosmica/`

Projetos avulsos sobre cosmologia gnóstica e textos sagrados.

#### Caminho 4: `/home/lzntn/Documentos/CristianismoPrimitivo/`

Conteúdo sobre as primeiras comunidades cristãs, Didache, Nag Hammadi.

### 2.2 Problemas Identificados

1. **Sem fonte única de verdade** — cada projeto tinha seu próprio HTML/JSON
2. **Temas sobrepostos** — o mesmo tópico aparecia em projetos diferentes com versões diferentes
3. **Esforço duplicado** — manutenção repetida em múltiplos lugares
4. **Navegação fragmentada** — usuário precisava visitar sites diferentes para temas relacionados
5. **Sem conexões entre saberes** — conteúdo isolado, sem links entre tópicos complementares
6. **Dificuldade de expansão** — adicionar um novo saber exigia criar um projeto do zero

### 2.3 O Problema em Números

| Métrica | Antes (v3.0) | Depois (v4.0) |
|---------|---------------|----------------|
| Projetos separados | ~30+ | 1 (unificado) |
| Saberes | 18 | 34 (+16 novos) |
| Fonte de dados | Múltiplos JSONs | 1 JSON central |
| Conexões entre saberes | 0 | ~60+ ligações |
| Práticas | 3 | 12 |
| Mídia (áudio+vídeo) | 0 | 14 itens |

---

## 3. A Solução: Integração no `dados-unificados.json`

### 3.1 O Conceito

A refatoração v3.0 → v4.0 consolidou **todo o conteúdo** em um único arquivo JSON: `database/dados-unificados.json`. Este arquivo é a **fonte única de verdade** (Single Source of Truth) do projeto. Tudo que o site exibe vem dele.

### 3.2 O Que Mudou

| Aspecto | v3.0 | v4.0 |
|---------|------|------|
| **Número de saberes** | 18 | 34 |
| **Novos saberes** | — | 16 (gnose-4, gnose-5, cristianismo-1, teosofia-2, hermetismo-2, kundalini-2, meditacao-2, ether-1, conhecimento-1, jornada-3, jornada-4, vida-verdadeira-2, vida-verdadeira-3, vida-verdadeira-4, vida-verdadeira-5, vida-verdadeira-6) |
| **Conexões** | Inexistentes | Bidirecionais entre saberes |
| **Práticas** | 3 | 6 (standalone) + várias embutidas nos saberes |
| **Mídia** | 0 | 10 áudios + 4 vídeos |
| **Referências** | 0 | 5 obras + 2 links |
| **Categorias** | 5 (mesmas) | 5 (mesmas, refinadas) |
| **Licença** | Mista | Domínio Público (preferencial) |

### 3.3 Filosofia do Schema

Cada **saber** no JSON representa uma unidade de conhecimento. O identificador único (`id`) segue o padrão `[tema]-[numero]`:

```
gnose-1    → primeiro saber sobre Gnose
gnose-2    → segundo saber sobre Gnose
hermetismo-1 → primeiro saber sobre Hermetismo
epigenetica-1 → primeiro saber sobre Epigenética
```

Os saberes são conectados entre si através do campo `conexoes`, que contém uma lista de IDs de outros saberes. Isso cria uma **rede de conhecimento** onde o usuário pode navegar de um tópico a outro.

---

## 4. Mapeamento Completo dos Novos Saberes

A tabela abaixo documenta todos os **16 novos saberes** adicionados na v4.0, suas fontes originais e o conteúdo integrado.

### 4.1 Pilar ESPÍRITO (Categoria 1)

| ID | Título | Fonte Original | Conteúdo Integrado |
|----|--------|---------------|---------------------|
| `gnose-4` | Yeshua: o Cristo Gnóstico | `Modelos/JESUS/` + `iCosmica/` | Evangelhos Gnósticos (Tomé, Filipe), Didache, parábolas (Fermento, Rede, Amigo à Meia-Noite), 5 ensinamentos-chave, Lectio Divina Gnóstica |
| `gnose-5` | Pistis Sophia e os Mistérios Gnósticos | `pistisSofia/` + `siteGnostico/` | Drama de Sophia, Pleroma/Caos/Kenoma, Personagens (Bythos, Yaldabaoth, Arcontes), 3 Mistérios, Meditação da Alma Caída |
| `cristianismo-1` | Cristianismo Primitivo | `Documentos/CristianismoPrimitivo/` | Nag Hammadi (Tomé, Filipe, Apócrifo de João, Maria), mulheres na liderança (Lidia, Priscila, Junia), diversidade teológica |
| `teosofia-2` | Helena Blavatsky: Doutrina e Legado | `helena-blavatsky/` + `Modelos/teosofia/` | Doutrina Secreta, 7 princípios do ser humano, obras (Ísis sem Véu, A Voz do Silêncio), controvérsias |
| `hermetismo-2` | O Caibalion e o Ser-Todo | `Lvrs - gnss/` | 7 leis herméticas (refinadas), Ser-Todo, Mentalismo, Contemplação dos 7 Princípios (prática semanal) |

### 4.2 Pilar PRÁTICAS (Categoria 2)

| ID | Título | Fonte Original | Conteúdo Integrado |
|----|--------|---------------|---------------------|
| `kundalini-2` | Kundalini: Fogo do Espírito Santo | `kundalini/` | 3 Fatores da Revolução da Consciência (Samael Aun Weor), mitos desmistificados, ascensão por 33 vértebras, prática dos 3 Fatores |
| `meditacao-2` | Meditação dos Chakras com Mantras | `tecnica-meditacao/` | 8 chakras com ordem, sílabas (S, M, A, U, O, E, I, I), cores, funções, timer de meditação, instruções passo a passo |

### 4.3 Pilar CIÊNCIA (Categoria 3)

| ID | Título | Fonte Original | Conteúdo Integrado |
|----|--------|---------------|---------------------|
| `ether-1` | Éter: A Quintessência | `Ether/` + `conhecimento-antigo/` | Campo quântico, biofótons, campo cardíaco, Registros Akáshicos, Alquimia Interior (7 operações), Pranayama Áureo (1.618) |
| `conhecimento-1` | Conhecimento Antigo: Mapas de Sabedoria | `conhecimento-antigo/` | 4 Mapas (Hermético, Não-Dual, Sombra, Ritmo), exotérico vs. esotérico, ruído moderno |

### 4.4 Pilar JORNADA (Categoria 4)

| ID | Título | Fonte Original | Conteúdo Integrado |
|----|--------|---------------|---------------------|
| `jornada-3` | Ser ou Consciência? | `serOuConsciencia/` | Filosofia da mente, IIT (Tononi), Orch-OR (Penrose), panpsiquismo, ponte ciência-teosofia |
| `jornada-4` | O Sentido da Existência | `sentidoGitHub/` | 5 perspectivas (Filosófica, Científica, Espiritual, Relacional, Criativa), Viktor Frankl, Ikigai, niilismo construtivo |

### 4.5 Pilar VIDA VERDADEIRA (Categoria 5)

| ID | Título | Fonte Original | Conteúdo Integrado |
|----|--------|---------------|---------------------|
| `vida-verdadeira-2` | Pneuma: O Sopro Vital | `pneuma/` | Estoicismo, Logos, Nous, Psyche, Hyle, análise da música "Pneuma" (Tool), práticas diárias |
| `vida-verdadeira-3` | Tao: O Caminho | `oTaoOuDao/` | Wu Wei, Yin-Yang, Te, Ziran, 3 Tesouros, Conexão HeartMath/GCI |
| `vida-verdadeira-4` | O Coração como Arquitetor | `oCoracao/` + `livro(Ser-Ter)/` | Dicotomia Ser vs. Ter, felicidade como verbo, Inventário SER-TER |
| `vida-verdadeira-5` | Eu Sou: O Poder Criador | `vidaVerdadeira/` + `camino-verdade/` | 3 filtros (Biológico, Social, Emocional), Chama Violeta, Neville Goddard, Decreto Sentido |
| `vida-verdadeira-6` | Camino Verdad: A Vida Sem Filtros | `camino-verdade/` | Filtros da Percepção, integração prática (manhã/dia/noite), rotina diária de 20 min |

---

## 5. Estrutura do JSON (Guia de Schema)

### 5.1 Visão Geral do Arquivo

O arquivo `dados-unificados.json` (~2476 linhas) contém 6 seções principais:

```json
{
  "meta": { ... },
  "categorias": [ ... ],
  "saberes": [ ... ],
  "praticas": [ ... ],
  "referencias": { ... },
  "midia": { ... }
}
```

### 5.2 `meta`

Metadados do arquivo:

```json
{
  "versao": "4.0",
  "atualizado": "2026-05-25",
  "descricao": "Dados unificados do Projeto Saberes de Coração - Fonte única para site, banco de dados, ebooks e multimídia"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `versao` | string | sim | Versão semântica do dataset |
| `atualizado` | string | sim | Data ISO da última atualização |
| `descricao` | string | sim | Propósito do arquivo |

### 5.3 `categorias`

Array com as 5 categorias (pilares):

```json
{
  "id": 1,
  "nome": "ESPÍRITO",
  "slug": "espirito",
  "descricao": "Conhecimento Gnóstico - Gnose, Hermetismo, Teosofia",
  "cor": "#9b59b6",
  "icone": "fa-heart"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | 1-5, referenciado por `saberes[].categoria_id` |
| `nome` | string | Nome em maiúsculas |
| `slug` | string | URL-friendly |
| `descricao` | string | Breve descrição |
| `cor` | string | HEX da cor do pilar |
| `icone` | string | Classe Font Awesome |

### 5.4 `saberes`

Array principal com todos os itens de conhecimento. Cada objeto segue este schema:

```json
{
  "id": "gnose-1",
  "categoria_id": 1,
  "titulo": "O Que é Gnose?",
  "slug": "gnose-o-que-e",
  "descricao": "Conhecimento direto e experiencial da natureza divina",
  "nivel": "iniciante",
  "duracao": 15,
  "tags": ["gnose", "conhecimento", "autoconhecimento"],
  "fonte": "Tradição Gnóstica",
  "licenca": "Domínio Público",
  "conteudo": { ... },
  "praticas": [ ... ],
  "conexoes": ["kundalini-1", "hermetismo-1"]
}
```

#### Campos Obrigatórios

| Campo | Tipo | Formato | Exemplo |
|-------|------|---------|---------|
| `id` | string | `[tema]-[numero]` | `gnose-1` |
| `categoria_id` | int | 1-5 | `1` |
| `titulo` | string | Curto e descritivo | `"O Que é Gnose?"` |
| `slug` | string | URL-friendly | `"gnose-o-que-e"` |
| `descricao` | string | Máx 120 caracteres | `"Conhecimento direto..."` |
| `nivel` | string | `iniciante`, `intermediario` ou `avancado` | `"iniciante"` |
| `duracao` | int | Em minutos | `15` |
| `tags` | string[] | Tags em minúsculas | `["gnose", "conhecimento"]` |
| `fonte` | string | Origem do conteúdo | `"Tradição Gnóstica"` |
| `conteudo` | object | Ver seção 7 | `{ "definicao": "...", ... }` |
| `conexoes` | string[] | IDs de outros saberes | `["kundalini-1"]` |

#### Campos Opcionais

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `licenca` | string | `"Domínio Público"` | Licença do conteúdo |
| `praticas` | array | `[]` | Práticas embutidas (ver abaixo) |

#### Práticas Embutidas

Cada saber pode conter práticas no formato:

```json
{
  "titulo": "Autoobservação",
  "instrucoes": "Sente-se em silêncio por 10 minutos...",
  "duracao": 10,
  "frequencia": "diaria"
}
```

| Campo | Tipo | Valores |
|-------|------|---------|
| `titulo` | string | Nome da prática |
| `instrucoes` | string | Passo a passo (pode usar `\n`) |
| `duracao` | int | Minutos |
| `frequencia` | string | `"diaria"`, `"semanal"`, `"sob-demanda"` |

#### Conexões

O campo `conexoes` é uma lista de IDs de outros saberes. Exemplo:

```json
"conexoes": ["kundalini-1", "hermetismo-1", "gnose-1"]
```

Isso faz com que, no modal do saber, apareçam links clicáveis para os saberes relacionados.

### 5.5 `praticas`

Práticas standalone (não vinculadas a um saber específico):

```json
{
  "id": "pratica-1",
  "nome": "Respiração 4x4",
  "saberes": ["respiracao-1", "epigenetica-3", "coracao-2"],
  "instrucoes": "Inspire 4s, segure 4s, exale 4s, segure 4s...",
  "duracao": 4,
  "frequencia": "diaria"
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | `"pratica-[numero]"` |
| `nome` | string | Nome |
| `saberes` | string[] | IDs dos saberes relacionados |
| `instrucoes` | string | Descrição |
| `duracao` | int | Minutos |
| `frequencia` | string | `"diaria"`, `"semanal"`, `"sob-demanda"` |

### 5.6 `referencias`

```json
{
  "obras": [
    { "titulo": "A Doutrina Secreta", "autora": "Helena Blavatsky" },
    { "titulo": "O Kybalion", "autores": "Três Iniciados" }
  ],
  "links": [
    { "nome": "HeartMath Institute", "url": "heartmath.org" }
  ]
}
```

### 5.7 `midia`

```json
{
  "audios": [
    {
      "id": "audio-001",
      "titulo": "A Frequência Proibida de Thoth",
      "categoria": "gnose-esoterismo",
      "tags": ["thoth", "tesla", "energia"],
      "arquivo": "01_gnose-esoterismo/Nome do Arquivo.mp3",
      "saberes_relacionados": ["hermetismo-1", "gnose-1"]
    }
  ],
  "videos": [
    {
      "id": "video-001",
      "titulo": "9 Frequências Solfeggio",
      "categoria": "frequencias-curacao",
      "tags": ["solfeggio", "frequencia", "cura"],
      "arquivo": "01_frequencias-curacao/Nome do Arquivo.mp4",
      "saberes_relacionados": ["mantras-1", "coracao-2"]
    }
  ]
}
```

Os arquivos de mídia ficam em `midia/audios/` e `midia/videos/`, organizados em subpastas por categoria.

---

## 6. Como Adicionar um Novo Saber (Passo a Passo)

Este guia passo a passo ensina como adicionar um novo saber do zero.

### 6.1 Passo 1: Escolher o ID

O ID segue o padrão `[tema]-[numero]`. Consulte os IDs existentes para saber o próximo número disponível:

```
gnose-1, gnose-2, gnose-3, gnose-4, gnose-5  → próx: gnose-6
hermetismo-1, hermetismo-2                      → próx: hermetismo-3
teosofia-1, teosofia-2                          → próx: teosofia-3
cristianismo-1                                  → próx: cristianismo-2
kundalini-1, kundalini-2                        → próx: kundalini-3
meditacao-1, meditacao-2                        → próx: meditacao-3
respiracao-1                                    → próx: respiracao-2
mantras-1                                       → próx: mantras-2
epigenetica-1, epigenetica-2, epigenetica-3     → próx: epigenetica-4
coracao-1, coracao-2                            → próx: coracao-3
ether-1                                         → próx: ether-2
conhecimento-1                                  → próx: conhecimento-2
correspondencia-1                               → próx: correspondencia-2
jornada-1, jornada-2, jornada-3, jornada-4      → próx: jornada-5
vida-verdadeira-1, ...-2, ...-3, ...-4, ...-5, ...-6 → próx: vida-verdadeira-7
```

### 6.2 Passo 2: Criar o Objeto no JSON

Adicione o novo objeto ao array `saberes` no `dados-unificados.json`:

```json
{
  "id": "gnose-6",
  "categoria_id": 1,
  "titulo": "Arcontes: Os Governantes do Cosmo",
  "slug": "gnose-arcontes",
  "descricao": "As entidades que governam o mundo material segundo a cosmovisão gnóstica",
  "nivel": "intermediario",
  "duracao": 25,
  "tags": ["gnose", "arcontes", "cosmologia", "demiurgo"],
  "fonte": "Tradição Gnóstica + Nag Hammadi",
  "licenca": "Domínio Público",
  "conteudo": { ... },
  "praticas": [],
  "conexoes": ["gnose-1", "gnose-2", "gnose-5"]
}
```

### 6.3 Passo 3: Definir o Conteúdo

O campo `conteudo` é um objeto que pode conter qualquer combinação das "content shapes" listadas na seção 7. Exemplo mínimo:

```json
"conteudo": {
  "definicao": "Texto de definição...",
  "citacoes": ["Citação 1", "Citação 2"]
}
```

### 6.4 Passo 4: Adicionar Práticas (Opcional)

Se o saber tiver práticas associadas:

```json
"praticas": [
  {
    "titulo": "Meditação dos Arcontes",
    "instrucoes": "1. Sente-se...",
    "duracao": 10,
    "frequencia": "semanal"
  }
]
```

### 6.5 Passo 5: Adicionar Conexões

Mapeie conexões bidirecionais:

```json
"conexoes": ["gnose-1", "gnose-2", "gnose-5"]
```

**IMPORTANTE:** Sempre que adicionar uma conexão de A para B, considere se B também deveria se conectar a A. Se sim, adicione A ao `conexoes` de B. As conexões devem ser **mutuamente benéficas**.

### 6.6 Passo 6: Verificar se é Necessário Handler em `app.js`

Se você usou apenas content shapes já existentes (ver seção 7), **nenhuma modificação** no `app.js` é necessária. O sistema é auto-descobrível: se o handler para `definicao` existe, ele será usado.

Se você criou uma **nova content shape** que não existe em `app.js`, vá para o [Passo 6 alternativo na seção 8.7](#87-como-adicionar-um-novo-handler-de-content-shape).

### 6.7 Passo 7: Adicionar Accordion na `biblioteca.html`

Se o novo saber se enquadra em uma seção existente da biblioteca (gnose, hermetismo, praticas, ciencia, jornada, mestres, vida, referencias), adicione um novo accordion na seção correspondente.

Veja [seção 10](#10-guia-da-bibliotecahtml) para instruções detalhadas.

### 6.8 Passo 8: Validar o JSON

Sempre valide o JSON após qualquer edição:

```bash
# Usando Python
python3 -m json.tool database/dados-unificados.json > /dev/null && echo "JSON válido"

# Usando Node.js
node -e "JSON.parse(require('fs').readFileSync('database/dados-unificados.json'))" && echo "JSON válido"

# Se existir o script de validação
python3 validate-content.py
```

### 6.9 Checklist de Adição

- [ ] ID único e no formato correto
- [ ] `categoria_id` corresponde a um ID existente (1-5)
- [ ] `slug` URL-friendly
- [ ] `nivel` é um dos 3 valores válidos
- [ ] `duracao` é um número inteiro positivo
- [ ] `tags` contém tags relevantes
- [ ] `fonte` preenchida
- [ ] `conteudo` com pelo menos uma content shape
- [ ] Conexões existentes e bidirecionais (quando aplicável)
- [ ] JSON validado sintaticamente
- [ ] Accordion adicionado na biblioteca (se aplicável)
- [ ] Testado no navegador

---

## 7. Formatos de Conteúdo (Content Shapes)

Esta seção documenta **todos os formatos de conteúdo** suportados pelo sistema. Cada formato é um campo dentro do objeto `conteudo` de um saber.

### 7.1 Formatos Simples (String)

#### `definicao`

Texto de definição do conceito. Sempre aparece primeiro no modal.

```json
"definicao": "Gnose (γνῶσις) significa 'conhecimento' em grego. É o conhecimento direto e experiencial da natureza divina."
```

#### `analogia`

Uma analogia para facilitar a compreensão.

```json
"analogia": "Pense no seu DNA como um livro de receitas..."
```

#### `insight`

Uma percepção ou revelação importante.

```json
"insight": "Você pode ter genes 'de risco' que nunca se expressam se mantiver bons hábitos epigenéticos!"
```

#### `ruido_moderno`

Texto sobre como o ruído da modernidade afeta o tema.

```json
"ruido_moderno": "Na era da informação, o conhecimento profundo é soterrado por ruído superficial..."
```

#### `ascensao`

Texto sobre a ascensão da Kundalini.

```json
"ascensao": "A Kundalini sobe pelo canal Sushumna na medula espinhal..."
```

#### `instrucoes_passos`

Instruções em formato de texto (usa `\n` para quebras):

```json
"instrucoes_passos": "1. Sente-se com a coluna ereta\n2. Respire profundamente 3 vezes\n3. Inicie pelo chakra Coccígeo..."
```

### 7.2 Formatos de Array de Objetos Simples

#### `conceitos`

Lista de conceitos com termo e definição.

```json
"conceitos": [
  { "termo": "Pneuma", "def": "A centelha divina dentro do ser humano" },
  { "termo": "Hyle", "def": "A matéria como prisão espiritual" }
]
```

#### `citacoes`

Array de strings com citações.

```json
"citacoes": [
  "Conhece-te a ti mesmo e conhecerás o universo e os deuses.",
  "O Reino de Deus está dentro de vós."
]
```

### 7.3 Formatos com Estrutura Específica

#### `principios`

Princípios numerados com nome, frase e descrição.

```json
"principios": [
  {
    "num": 1,
    "nome": "Mentalismo",
    "frase": "O Todo é Mente",
    "desc": "Tudo existe na consciência divina..."
  }
]
```

#### `mundos`

Mundos cosmológicos com nome, símbolo e descrição.

```json
"mundos": [
  {
    "nome": "Plerooma",
    "simbolo": "🔥",
    "desc": "O mundo da plenitude divina..."
  }
]
```

#### `textos`

Lista de textos com nome e descrição.

```json
"textos": [
  { "nome": "Evangelho de Tomé", "desc": "Contém ditos de Jesus..." }
]
```

#### `aplicacoes`

Tabela de correspondências (maior/menor).

```json
"aplicacoes": [
  { "maior": "Sol", "menor": "Coração" },
  { "maior": "Lua", "menor": "Mente" }
]
```

#### `fatores`

Fatores com nome, ícone e descrição.

```json
"fatores": [
  { "nome": "Alimentação", "icone": "🍎", "desc": "Folatos, ômega-3..." }
]
```

#### `mecanismos`

Mecanismos com nome, ícone e descrição (similar a fatores).

```json
"mecanismos": [
  { "nome": "Metilação", "icone": "🎯", "desc": "Adição de grupos metil..." }
]
```

#### `parabolas`

Parábolas com nome, texto e sentido.

```json
"parabolas": [
  {
    "nome": "O Fermento",
    "texto": "O Reino é como fermento...",
    "sentido": "O conhecimento divino começa pequeno..."
  }
]
```

#### `ensinamentos_chave`

Ensinamentos com tema e ensino.

```json
"ensinamentos_chave": [
  {
    "tema": "O Reino Interior",
    "ensino": "O Reino de Deus não vem com sinais exteriores..."
  }
]
```

#### `personagens`

Personagens com nome e descrição.

```json
"personagens": [
  { "nome": "Bythos", "descricao": "O Deus Primeiro, incognoscível..." }
]
```

#### `misterios`

Mistérios com nome e descrição.

```json
"misterios": [
  { "nome": "Primeiro Mistério", "desc": "O mistério do Perdão..." }
]
```

#### `caracteristicas`

Características com nome e descrição.

```json
"caracteristicas": [
  { "nome": "Comunidade e Unidade", "desc": "Igrejas domésticas..." }
]
```

#### `desafios`

Desafios com nome e descrição.

```json
"desafios": [
  { "nome": "Perseguição", "desc": "De imperadores romanos..." }
]
```

#### `controversias`

Controvérsias com tema e descrição.

```json
"controversias": [
  { "tema": "Acusações de Fraude", "desc": "Críticos apontaram..." }
]
```

#### `mitos_desmistificados`

Mitos com mito e verdade.

```json
"mitos_desmistificados": [
  { "mito": "Despertar é acidental", "verdade": "Não ocorre por acaso..." }
]
```

#### `tres_fatores`

Os 3 Fatores da Revolução da Consciência.

```json
"tres_fatores": [
  { "fator": "Morrer — Morte do Ego", "descricao": "Eliminação dos defeitos..." }
]
```

### 7.4 Formatos Específicos de Chakras

#### `chakras` (com ordem — meditacao-2)

Chakras com ordem numérica, sílaba, cor, local, função e duração:

```json
"chakras": [
  {
    "ordem": 1,
    "nome": "Coccígeo",
    "silaba": "S",
    "cor": "#f87171",
    "local": "Base da coluna",
    "funcao": "Segurança, enraizamento",
    "duracao": "1 min"
  }
]
```

**Nota:** O handler em `app.js` verifica se `chakras[0].ordem` existe para escolher entre este formato (tabela) e o formato simplificado de `kundalini-1` (lista).

#### `chakras` (simplificado — kundalini-1)

Chakras sem ordem, apenas nome, cor e descrição:

```json
"chakras": [
  { "nome": "Múládhara", "cor": "#f87271", "desc": "Raiz - Base da coluna" }
]
```

### 7.5 Formatos Específicos de Ciência

#### `ciencia_moderna`

Tópicos da ciência moderna com nome e descrição:

```json
"ciencia_moderna": [
  { "topico": "Campo Quântico", "desc": "O vácuo quântico não é vazio..." }
]
```

#### `alquimia_interior`

Operações alquímicas com nome e etapas:

```json
"alquimia_interior": {
  "nome": "Magnum Opus (A Grande Obra)",
  "operacoes": [
    { "etapa": "1. Calcinação", "desc": "Queimar o ego..." }
  ]
}
```

#### `praticas_acesso`

Práticas com nome, proporção (opcional) e descrição:

```json
"praticas_acesso": [
  { "nome": "Pranayama Áureo", "proporcao": "1.618", "desc": "Inspire por 1.618s..." }
]
```

### 7.6 Formatos de Conhecimento

#### `mapa_exoterico_esoterico`

Objeto com dois campos:

```json
"mapa_exoterico_esoterico": {
  "exoterico": "Conhecimento público...",
  "esoterico": "Conhecimento reservado..."
}
```

#### `quatro_mapas`

Array de mapas com nome, ensinamento e prática:

```json
"quatro_mapas": [
  {
    "nome": "Código Hermético",
    "ensinamento": "'O que está em cima...'",
    "pratica": "Encontre uma situação exterior..."
  }
]
```

#### `correntes`

Correntes filosóficas com nome e descrição:

```json
"correntes": [
  { "nome": "Dualismo Materialista", "desc": "A consciência é um produto físico do cérebro..." }
]
```

#### `ponte_ciencia_teosofia`

Ponte entre ciência e teosofia:

```json
"ponte_ciencia_teosofia": {
  "ciencia": "IIT de Tononi...",
  "teosofia": "Blavatsky propôs...",
  "ponte": "Ambas convergem..."
}
```

### 7.7 Formatos de Sentido/Filosofia

#### `perspectivas`

Perspectivas com nome e descrição:

```json
"perspectivas": [
  { "nome": "Filosófica", "desc": "O sentido não é encontrado — é criado..." }
]
```

#### `if_no_meaning`

Objeto com título, reflexão e citação:

```json
"if_no_meaning": {
  "titulo": "E Se Não Houver Sentido?",
  "reflexao": "O niilismo construtivo propõe...",
  "citacao": "O ser humano não é um problema a ser resolvido..."
}
```

#### `dimensoes`

Dimensões com nome e descrição:

```json
"dimensoes": [
  { "nome": "Logos", "desc": "A razão ordenadora do cosmos..." }
]
```

#### `tool_musica`

Análise de música da banda Tool:

```json
"tool_musica": {
  "analise": "A música 'Pneuma' da banda Tool...",
  "citacao": "We are spirit bound to this flesh..."
}
```

#### `praticas_diarias`

Práticas para o dia a dia:

```json
"praticas_diarias": [
  { "nome": "Consciência da Presença", "desc": "3x ao dia, pare e sinta a respiração..." }
]
```

#### `conexao_heartmath`

Conexão com HeartMath:

```json
"conexao_heartmath": {
  "descricao": "O HeartMath Institute tem demonstrado...",
  "pratica": "Estudos globais da GCI..."
}
```

### 7.8 Formatos de Vida Verdadeira

#### `dicotomia`

Dicotomia entre polos com características:

```json
"dicotomia": [
  {
    "polo": "SER",
    "caracteristicas": [
      "É verbo, não substantivo",
      "Expansão contínua"
    ]
  },
  {
    "polo": "TER",
    "caracteristicas": [
      "Acumulação",
      "Existência em tempo linear"
    ]
  }
]
```

#### `felicidade_como_verbo`

Tese sobre felicidade como ação:

```json
"felicidade_como_verbo": {
  "tese": "A felicidade não é algo que você É...",
  "mecanica": "A motivação é a faísca...",
  "citacao": "A felicidade não é o prêmio..."
}
```

#### `tres_filtros`

Filtros com nome e descrição:

```json
"tres_filtros": [
  { "nome": "Filtro Biológico", "desc": "O cérebro evoluiu para a sobrevivência..." }
]
```

#### `ferramentas_praticas`

Ferramentas com nome e descrição:

```json
"ferramentas_praticas": [
  { "nome": "Chama Violeta", "desc": "O 'solvente universal' para detritos energéticos..." }
]
```

#### `filtros_da_percepcao`

Filtros com mecanismo e transcendência:

```json
"filtros_da_percepcao": [
  {
    "nome": "Biológico",
    "mecanismo": "O cérebro é uma máquina de sobrevivência...",
    "transcendencia": "Auto-observação: 'Meu cérebro está me contando uma história...'"
  }
]
```

#### `integracao_pratica`

Rotina integrada de manhã/dia/noite:

```json
"integracao_pratica": {
  "manha": [
    "1. Acorde e sinta o EU SOU...",
    "2. Pratique Pranayama Áureo..."
  ],
  "dia": [
    "1. Ao encontrar resistência: Wu Wei..."
  ],
  "noite": [
    "1. Exame Diário..."
  ]
}
```

### 7.9 Formatos de Nag Hammadi

#### `nag_hammadi`

Objeto com descrição e textos:

```json
"nag_hammadi": {
  "descricao": "Em 1945, no Egito, 13 códices...",
  "textos": [
    { "nome": "Evangelho de Tomé", "desc": "114 ditos de Jesus..." }
  ]
}
```

---

## 8. Guia do `app.js` (Arquitetura do Frontend)

### 8.1 Visão Geral

O arquivo `js/app.js` (771 linhas) é o **coração da SPA**. Ele contém toda a lógica JavaScript do `index.html`.

```
app.js
├── Variáveis Globais
├── Player (objeto)
├── Event Listeners
├── carregarDados()
├── atualizarEstatisticas()
├── renderizarSaberes()
├── filtrarCategoria()
├── renderizarMidia()
├── buscarSaberes()
├── abrirSaber() ← função principal (maior)
├── abrirMidia()
├── Modal (abrir/fechar)
├── toggleBusca()
├── toggleTema()
└── saberAleatorio()
```

### 8.2 Variáveis Globais

```javascript
let dados = null;           // Dados carregados do JSON
let categoriaAtual = 'all'; // Filtro ativo
let ultimoElementoFocado = null; // Para retorno de foco (acessibilidade)
```

### 8.3 Objeto `Player`

Responsável pelo player de áudio/vídeo flutuante. Métodos principais:

```javascript
const Player = {
    currentList: [],   // Lista atual (audios ou videos)
    currentIndex: -1,  // Índice atual na lista
    currentItem: null, // Item atual
    isPlaying: false,  // Estado de reprodução

    init()          // Inicializa eventos do player (DOM)
    buildList(tipo) // Monta lista de mídia ('audio' | 'video')
    open(tipo, id)  // Abre player com item específico
    togglePlay()    // Play/Pause
    prev()          // Anterior
    next()          // Próximo
    loadCurrent()   // Carrega item atual no player
    close()         // Fecha player
    toggleMute()    // Muta/desmuta
    formatTime(secs) // Formata segundos em MM:SS
}
```

#### Eventos do Player

O player escuta estes eventos do elemento `<audio>`:

| Evento | Handler |
|--------|---------|
| `timeupdate` | Atualiza barra de progresso e tempo |
| `loadedmetadata` | Atualiza tempo total |
| `ended` | Avança para próxima faixa |
| `play` | Atualiza estado para tocando |
| `pause` | Atualiza estado para pausado |

#### Teclas de Atalho

Quando o player está ativo:

| Tecla | Ação |
|-------|------|
| `Espaço` | Play/Pause |
| `P` / `p` | Faixa anterior |
| `N` / `n` | Próxima faixa |
| `M` / `m` | Mutar/Desmutar |
| `Escape` | Fecha modal |

### 8.4 `carregarDados()`

Função assíncrona que carrega o JSON e inicia a renderização:

```javascript
async function carregarDados() {
    const response = await fetch('database/dados-unificados.json');
    dados = await response.json();
    atualizarEstatisticas();
    renderizarSaberes(dados.saberes);
}
```

**Fluxo:** `DOMContentLoaded` → `Player.init()` → `carregarDados()`.

### 8.5 `renderizarSaberes()`

Cria o grid de cards. Recebe um array de saberes (pode ser filtrado):

```javascript
function renderizarSaberes(saberes) {
    const grid = document.getElementById('cardsGrid');
    grid.className = 'cards-grid';
    grid.innerHTML = saberes.map(saber => `
        <div class="card" data-cat="${saber.categoria_id}"
             onclick="abrirSaber('${saber.id}')" tabindex="0">
            <div class="card-header">
                <span class="card-titulo">${saber.titulo}</span>
                <span class="card-nivel ${saber.nivel}">${saber.nivel}</span>
            </div>
            <p class="card-desc">${saber.descricao}</p>
            <div class="card-meta">
                <span>⏱️ ${saber.duracao} min</span>
                <span>📖 ${saber.fonte}</span>
            </div>
            <div class="card-tags">
                ${saber.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}
```

### 8.6 `abrirSaber()` — O Coração do Sistema

Esta é a função mais importante. Ela constrói o conteúdo do modal dinamicamente com base no campo `conteudo` de cada saber.

**Estrutura:**

```
abrirSaber(id)
  ├── Busca saber em dados.saberes
  ├── Define título do modal
  ├── Adiciona metadados (nível, duração, fonte)
  ├── Para cada campo em conteudo:
  │   ├── Se definicao → renderiza <h3> + <p>
  │   ├── Se analogia → renderiza <h3> + <p>
  │   ├── Se insight → renderiza <h3> + <p>
  │   ├── Se conceitos → renderiza <h3> + <ul>
  │   ├── Se principios → renderiza <h3> + <ul>
  │   ├── Se mundos → renderiza <h3> + <ul>
  │   ├── Se textos → renderiza <h3> + <ul>
  │   ├── Se aplicacoes → renderiza <h3> + <table>
  │   ├── Se fatores → renderiza <h3> + <ul>
  │   ├── Se mecanismos → renderiza <h3> + <ul>
  │   ├── Se citacoes → renderiza <blockquote>
  │   ├── Se parabolas → renderiza cards estilizados
  │   ├── Se ensinamentos_chave → renderiza pratica-box
  │   ├── Se estrutura_cosmica → renderiza pares key: value
  │   ├── Se personagens → renderiza <ul>
  │   ├── Se misterios → renderiza <ul>
  │   ├── Se caracteristicas → renderiza <ul>
  │   ├── Se desafios → renderiza <ul>
  │   ├── Se nag_hammadi → renderiza desc + <ul>
  │   ├── Se controversias → renderiza <ul>
  │   ├── Se mitos_desmistificados → renderiza <ul>
  │   ├── Se tres_fatores → renderiza <ul>
  │   ├── Se ascensao → renderiza <p>
  │   ├── Se chakras (com ordem) → renderiza <table> detalhada
  │   ├── Se instrucoes_passos → renderiza <p> com <br>
  │   ├── Se ciencia_moderna → renderiza pratica-box
  │   ├── Se alquimia_interior → renderiza com operações
  │   ├── Se praticas_acesso → renderiza <ul>
  │   ├── Se mapa_exoterico_esoterico → renderiza pratica-box duplo
  │   ├── Se quatro_mapas → renderiza content-card
  │   ├── Se ruido_moderno → renderiza <p>
  │   ├── Se correntes → renderiza pratica-box
  │   ├── Se ponte_ciencia_teosofia → renderiza triple pratica-box
  │   ├── Se perspectivas → renderiza pratica-box
  │   ├── Se if_no_meaning → renderiza + blockquote
  │   ├── Se dimensoes → renderiza <ul>
  │   ├── Se tool_musica → renderiza + blockquote
  │   ├── Se praticas_diarias → renderiza <ul>
  │   ├── Se conexao_heartmath → renderiza <p>
  │   ├── Se dicotomia → renderiza pratica-box com ícones
  │   ├── Se felicidade_como_verbo → renderiza <p> + blockquote
  │   ├── Se tres_filtros → renderiza <ul>
  │   ├── Se ferramentas_praticas → renderiza pratica-box
  │   ├── Se filtros_da_percepcao → renderiza pratica-box
  │   └── Se integracao_pratica → renderiza pratica-box por período
  ├── Práticas do saber
  ├── Conexões (links para outros saberes)
  └── Abre modal
```

### 8.7 Como Adicionar um Novo Handler de Content Shape

Se você criou um novo formato de conteúdo (ex: `"meu_novo_formato": [...]`), precisa adicionar o handler em `abrirSaber()`.

**Passo a passo:**

1. Localize a função `abrirSaber()` em `app.js`
2. Encontre o bloco de condicionais `if (c.definicao)`, `if (c.analogia)`, etc.
3. Adicione seu handler seguindo o padrão:

```javascript
if (c.meu_novo_formato) {
    html += `<h3>Título do Meu Formato</h3>`;
    c.meu_novo_formato.forEach(item => {
        html += `<div class="pratica-box">
            <h4>${item.nome}</h4>
            <p>${item.desc}</p>
        </div>`;
    });
}
```

**Padrões de renderização disponíveis:**

| Elemento HTML | Uso |
|--------------|-----|
| `<p>` | Texto simples |
| `<ul><li>` | Lista simples |
| `<table>` | Dados tabulares |
| `<blockquote>` | Citações |
| `<div class="pratica-box">` | Card com borda azul |
| `<div class="content-card">` | Card com borda colorida |
| `<pre>` | Código/bloco pré-formatado |

### 8.8 Outras Funções

#### `filtrarCategoria(cat)`

Filtra os saberes por categoria. Se `cat === 'midia'`, chama `renderizarMidia()`. Atualiza os botões de pilar visualmente.

#### `renderizarMidia()`

Renderiza o grid de mídia (áudios e vídeos). Cada card de mídia chama `abrirMidia(tipo, id)` ao clicar.

#### `abrirMidia(tipo, id)`

Abre o modal de mídia e inicia o player. Mostra saberes relacionados.

#### `buscarSaberes(termo)`

Filtra saberes por texto no título, descrição ou tags. Integra com o filtro de categoria ativo.

#### `toggleBusca()`

Mostra/esconde o campo de busca.

#### `toggleTema()`

Alterna entre tema escuro (padrão) e claro. Salva preferência no `localStorage`.

#### `saberAleatorio()`

Abre um saber aleatório. Acionado pelo botão "🎲".

#### Funções do Modal

```javascript
abrirModal()      // Abre overlay com animação
fecharModal(e)    // Fecha ao clicar no overlay
fecharModalBtn()  // Fecha ao clicar no X
```

### 8.9 Fluxo Completo de Interação

```
Usuário abre index.html
  ↓
DOMContentLoaded → Player.init() + carregarDados()
  ↓
fetch('database/dados-unificados.json')
  ↓
JSON parseado → dados = response
  ↓
atualizarEstatisticas() → mostra contadores
  ↓
renderizarSaberes(dados.saberes) → grid de cards
  ↓
Usuário clica em um card
  ↓
abrirSaber(id)
  ↓
Constrói HTML do conteúdo
  ↓
abrirModal() → modal aparece com animação
  ↓
Usuário pode:
  ├── Clicar em conexões → abrirSaber(outroId)
  ├── Clicar em X ou ESC → fecharModal()
  ├── Clicar em mídia → Player.open()
  └── Navegar por filtros/busca
```

---

## 9. Guia do CSS (Design System)

### 9.1 Arquivo `css/style.css`

O arquivo `style.css` (780 linhas) implementa um **design system completo** usando CSS custom properties (variáveis CSS).

### 9.2 CSS Custom Properties (Variáveis)

```css
:root {
    --cor-fundo: #0d1117;
    --cor-card: #161b22;
    --cor-borda: #30363d;
    --cor-texto: #c9d1d9;
    --cor-texto-sec: #8b949e;
    --cor-destaque: #58a6ff;
    --cor-espirito: #9b59b6;
    --cor-praticas: #3498db;
    --cor-ciencia: #2ecc71;
    --cor-jornada: #e67e22;
    --cor-vida: #e74c3c;
    --cor-midia: #e91e63;
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    --radius: 8px;
    --shadow: 0 4px 12px rgba(0,0,0,0.3);
    --transition: 0.2s ease;
}
```

### 9.3 Tema Claro

Quando o body recebe a classe `modo-claro`, as variáveis são sobrescritas:

```css
body.modo-claro {
    --cor-fundo: #f5f7fa;
    --cor-card: #ffffff;
    --cor-borda: #d0d7de;
    --cor-texto: #24292f;
    --cor-texto-sec: #57606a;
    --cor-destaque: #0969da;
    --shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

Alternância feita via `toggleTema()` em JS, com persistência em `localStorage`.

### 9.4 Sistema de Grid de Cards

```css
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
}
```

Cada card tem cor de borda lateral conforme categoria:

```css
.card[data-cat="1"] { border-left-color: var(--cor-espirito); }
.card[data-cat="2"] { border-left-color: var(--cor-praticas); }
.card[data-cat="3"] { border-left-color: var(--cor-ciencia); }
.card[data-cat="4"] { border-left-color: var(--cor-jornada); }
.card[data-cat="5"] { border-left-color: var(--cor-vida); }
```

### 9.5 Sistema de Modal

```css
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85);
    z-index: 200;
    overflow-y: auto;
    padding: 2rem 1rem;
    backdrop-filter: blur(4px);
    display: none; /* Ativado via classe .active */
}
```

Animação de entrada:

```css
@keyframes modalIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal { animation: modalIn 0.2s ease; }
```

### 9.6 Player Bar Flutuante

Barra fixa no rodapé com animação slide-up:

```css
.player-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--cor-card);
    border-top: 1px solid var(--cor-borda);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    z-index: 300;
    animation: playerSlideUp 0.25s ease;
}

.player-bar[hidden] { display: none; }
```

### 9.7 Responsividade

Breakpoints:

```css
@media (max-width: 600px) {
    .cards-grid { grid-template-columns: 1fr; }     /* Cards em coluna única */
    .midia-grid { grid-template-columns: 1fr; }     /* Mídia em coluna única */
    .modal { padding: 1rem; margin: 0.5rem; }       /* Modal mais compacto */
    .hero h1 { font-size: 1.4rem; }                  /* Título menor */
    .player-volume-wrap { display: none; }           /* Esconde volume no mobile */
}
```

### 9.8 Acessibilidade

```css
.sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

:focus-visible {
    outline: 2px solid var(--cor-destaque);
    outline-offset: 2px;
}
```

### 9.9 Níveis de Saber (Badges)

```css
.card-nivel.iniciante { background: #1f4a2e; color: #7ee787; }
.card-nivel.intermediario { background: #3d2f00; color: #d29922; }
.card-nivel.avancado { background: #5c1f2e; color: #f85149; }
```

### 9.10 Tabela de Componentes CSS

| Componente | Seletor | Descrição |
|------------|---------|-----------|
| Header | `.header` | Barra superior fixa (sticky) |
| Logo | `.logo` | Logo com gradiente |
| Hero | `.hero` | Seção de boas-vindas |
| Botões de Pilar | `.pilar-btn` | Filtros de categoria |
| Grid de Cards | `.cards-grid` | Grid responsivo de saberes |
| Card | `.card` | Card de saber individual |
| Tags | `.tag` | Tags de conteúdo |
| Midia Grid | `.midia-grid` | Grid de mídia |
| Player Bar | `.player-bar` | Player flutuante |
| Modal | `.modal-overlay` | Modal de conteúdo |
| Pratica Box | `.pratica-box` | Card de prática |
| Content Card | `.content-card` | Card de conteúdo |
| Footer | `.footer` | Rodapé |
| Loading | `.loading` | Estado de carregamento |
| Empty State | `.empty-state` | Estado vazio |

---

## 10. Guia da `biblioteca.html`

### 10.1 Propósito

`biblioteca.html` é uma **página estática de leitura profunda**. Diferente do `index.html` (que é uma SPA dinâmica com cards e modais), a biblioteca oferece conteúdo textual expansivo, organizado em abas e accordions para navegação.

### 10.2 Arquitetura

```
biblioteca.html (1350 linhas)
├── CSS embutido no <head> (completo, 362 linhas)
├── Header (navegação)
├── Hero (título)
├── Nav Tabs (8 abas)
├── Sections (8 seções)
│   ├── sec-gnose      → 7 accordions
│   ├── sec-hermetismo → 2 accordions
│   ├── sec-praticas    → 5 accordions
│   ├── sec-ciencia     → 4 accordions
│   ├── sec-jornada     → 2 accordions
│   ├── sec-mestres     → 1 accordion
│   ├── sec-vida        → 2 accordions
│   └── sec-referencias → 3 accordions
├── Footer
└── Script (3 funções JS)
```

### 10.3 Sistema de Abas (Nav Tabs)

```html
<nav class="nav-tabs" aria-label="Categorias da biblioteca">
    <button class="nav-tab active" onclick="mostrarSecao('gnose')">🜂 Gnose</button>
    <button class="nav-tab" onclick="mostrarSecao('hermetismo')">🔮 Hermetismo</button>
    <button class="nav-tab" onclick="mostrarSecao('praticas')">🧘 Práticas</button>
    <button class="nav-tab" onclick="mostrarSecao('ciencia')">🔬 Ciência</button>
    <button class="nav-tab" onclick="mostrarSecao('jornada')">🧭 Jornada</button>
    <button class="nav-tab" onclick="mostrarSecao('mestres')">👁️ Mestres</button>
    <button class="nav-tab" onclick="mostrarSecao('vida')">∞ Vida Verdadeira</button>
    <button class="nav-tab" onclick="mostrarSecao('referencias')">📖 Referências</button>
</nav>
```

Cada aba corresponde a uma `<div class="section" id="sec-[slug]">`.

### 10.4 Sistema de Accordion

```html
<div class="accordion">
    <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="false">
        <span>📖 Lição 1 — Título</span>
        <span class="accordion-arrow">▼</span>
    </button>
    <div class="accordion-content">
        <div class="content">
            <!-- Conteúdo HTML estático aqui -->
        </div>
    </div>
</div>
```

### 10.5 Funções JavaScript

```javascript
// Mostra uma seção e esconde as outras
function mostrarSecao(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    event.target.classList.add('active');
}

// Abre/fecha accordion
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    header.classList.toggle('active');
    content.classList.toggle('active');
    header.setAttribute('aria-expanded', !isActive);
}

// Alterna tema claro/escuro
function toggleTema() {
    document.body.classList.toggle('modo-claro');
    localStorage.setItem('tema',
        document.body.classList.contains('modo-claro') ? 'claro' : 'escuro');
}
```

### 10.6 Como Adicionar um Novo Accordion

**Passo 1:** Identifique a seção correta (gnose, hermetismo, etc.)

**Passo 2:** Adicione o accordion dentro da `<div class="section">` correspondente:

```html
<div class="accordion">
    <button class="accordion-header" onclick="toggleAccordion(this)" aria-expanded="false">
        <span>📖 Sua Nova Lição</span>
        <span class="accordion-arrow">▼</span>
    </button>
    <div class="accordion-content">
        <div class="content">
            <span class="badge badge-espirito">ESPÍRITO</span>
            <span class="tag">#tag1</span>
            <span class="tag">#tag2</span>

            <h3>Título</h3>
            <p>Conteúdo...</p>

            <div class="pratica-box">
                <h4>🧘 Prática</h4>
                <p>Instruções...</p>
            </div>

            <blockquote>"Citação..."</blockquote>
        </div>
    </div>
</div>
```

**Passo 3:** Escolha o badge correto:

| Seção | Badge |
|-------|-------|
| Gnose, Hermetismo, Mestres | `badge badge-espirito` |
| Práticas | `badge badge-pratica` |
| Ciência | `badge badge-ciencia` |
| Jornada | `badge badge-jornada` |
| Vida Verdadeira | `badge badge-vida` |

**Passo 4:** Verifique se o accordion está dentro da `<div class="section">` correta e se o HTML está bem formado.

### 10.7 Componentes de Estilo da Biblioteca

| Componente | Classe | Descrição |
|------------|--------|-----------|
| Badge | `.badge-espirito` etc. | Tag colorida de categoria |
| Tabela | `<table>` + `.content th/td` | Dados tabulares |
| Citação | `<blockquote>` | Citação em itálico |
| Prática | `.pratica-box` | Card de exercício |
| Código | `<pre>` / `<code>` | Bloco de código |

---

## 11. Fluxo de Trabalho Recomendado

### 11.1 Para Adicionar Conteúdo

```
1. dados-unificados.json  ← ADICIONE/MODIFIQUE SABERES AQUI
        │
        ▼
2. NOVO FORMATO?          ← SE SIM, vá para app.js
        │                        │
        ▼                        ▼
3. app.js                 ← ADICIONE HANDLER EM abrirSaber()
        │
        ▼
4. biblioteca.html        ← ADICIONE ACCORDION NA SEÇÃO CORRETA
        │
        ▼
5. Teste no navegador     ← Abra index.html, verifique cards e modais
        │
        ▼
6. Valide JSON            ← python3 -m json.tool database/dados-unificados.json
        │
        ▼
7. Commit                 ← git add . && git commit -m "descrição"
```

### 11.2 Para Modificar Design

```
1. style.css  ← ALTERE VARIÁVEIS CSS OU ADICIONE NOVOS ESTILOS
        │
        ▼
2. Teste no navegador ← Verifique index.html e biblioteca.html
        │
        ▼
3. Commit
```

### 11.3 Para Adicionar Mídia

```
1. Coloque o arquivo em midia/audios/ ou midia/videos/
   (organize em subpastas por categoria)
        │
        ▼
2. Adicione entrada em dados-unificados.json → midia → audios[] ou videos[]
        │
        ▼
3. Defina saberes_relacionados para conectar a saberes existentes
        │
        ▼
4. Teste no navegador
        │
        ▼
5. Commit
```

### 11.4 Para Deploy com Banco de Dados (Opcional)

```
1. Execute schema.sql no MySQL
2. Use os PHP scripts em php/ para importar dados
3. Configure php/config.php com credenciais
4. As APIs em php/api/ servem dados via REST
```

---

## 12. Manutenção e Boas Práticas

### 12.1 Validação de JSON

Sempre valide o JSON após qualquer edição:

```bash
python3 -m json.tool database/dados-unificados.json > /dev/null && echo "✓ JSON válido" || echo "✗ JSON inválido"
```

Erros comuns:
- **Vírgula sobrando** no último elemento de um array/objeto
- **Aspas quebradas** em strings com caracteres especiais
- **Chaves/colchetes desbalanceados**

### 12.2 Conexões Bidirecionais

Sempre que adicionar uma conexão de A para B, considere se B também deveria se conectar a A.

**Exemplo correto:**

```json
// Saber A (gnose-4)
"conexoes": ["gnose-1", "gnose-3", "cristianismo-1", "vida-verdadeira-1"]

// Saber B (cristianismo-1)
"conexoes": ["gnose-3", "gnose-4", "gnose-5", "vida-verdadeira-1"]
```

Note que `gnose-4` e `cristianismo-1` se conectam mutuamente.

### 12.3 Consistência de Tags

Use **minúsculas** e **sem acentos** nas tags:

```json
// ✅ Correto
"tags": ["gnose", "conhecimento", "autoconhecimento"]

// ❌ Incorreto
"tags": ["Gnose", "Conhecimento", "Auto-Conhecimento"]
```

Tags existentes:

```
gnose, hermetismo, teosofia, kybalion, leis, correspondencia, macrocosmo,
yeshua, cristo, gnosticismo, nag-hammadi, textos, pistis-sophia, misterios,
cristianismo, primitivo, historia, didache, blavatsky, doutrina-secreta,
fraternidade, caibalion, todo, kundalini, energia, chakra, fogo, espirito-santo,
samael, meditacao, mantra, vocalizacao, timer, respiracao, pranayama, calma,
ether, eter, akasha, quintessencia, campo, conhecimento, antigo, oculto, mapas,
sabedoria, jornada, consciencia, filosofia, ser, dualismo, sentido, existencia,
proposito, vida-verdadeira, integracao, pratica, caminho, pneuma, sopro,
estoicismo, logos, tool, tao, dao, wu-wei, laozi, yin-yang, coracao, ser, ter,
dicotomia, felicidade, eu-sou, poder-criador, identidade, manifestacao,
camino-verdad, filtros, percepcao, ciencia, genes, epigeneticam, mecanismos,
biologia, habitos, estilo-de-vida, coracao, coerencia, heartmath, hrv,
epigenetica, mecanismos, biologia, ciencia, genes
```

### 12.4 Consistência de Nível

3 níveis possíveis:

| Nível | Significado | Cor (badge) |
|-------|-------------|-------------|
| `iniciante` | Conceitos básicos, sem pré-requisitos | Verde |
| `intermediario` | Requer algum conhecimento prévio | Amarelo |
| `avancado` | Conteúdo complexo, prática exigida | Vermelho |

### 12.5 Duração

Sempre em **minutos**, como número inteiro:

```json
// ✅ Correto
"duracao": 15

// ❌ Incorreto
"duracao": "15 minutos"
"duracao": 15.5
```

### 12.6 Fontes e Licenças

Mantenha `fonte` e `licenca` precisas:

```json
// ✅ Correto
"fonte": "Evangelhos Gnósticos + Didache",
"licenca": "Domínio Público"

// ✅ Correto
"fonte": "Samael Aun Weor — Tradição Gnóstica",
"licenca": "Domínio Público"
```

**Preferência:** Sempre que possível, use `"licenca": "Domínio Público"`.

### 12.7 Organização de Mídia

Os arquivos de mídia devem ser organizados em subpastas:

```
midia/
├── audios/
│   ├── 01_gnose-esoterismo/
│   ├── 02_cristianismo-esoterico/
│   ├── 03_hermetismo-teosofia/
│   ├── 04_consciencia-meditacao/
│   └── 05_corpo-regeneracao/
└── videos/
    ├── 01_frequencias-curacao/
    ├── 02_filosofia-consciencia/
    └── 03_historia-cultura/
```

### 12.8 Performance

- O JSON tem ~2500 linhas e é carregado via `fetch` (cache do navegador)
- O grid de cards usa `auto-fill` com `minmax(280px, 1fr)` — sem media queries para quebras
- O modal é construído dinamicamente (sem páginas separadas)
- O player usa um único elemento `<audio>` que troca de fonte

### 12.9 Segurança

- Todo conteúdo é estático e público (não há dados de usuário)
- O JSON é servido como arquivo estático
- Não há formulários, logins ou processamento de dados sensíveis
- Os PHP scripts são opcionais e para uso local

### 12.10 Convenções de Código

**JavaScript (`app.js`):**

- Funções nomeadas (não arrow functions para funções principais)
- `camelCase` para variáveis e funções
- `const` para valores que não mudam, `let` para mutáveis
- Objeto `Player` em notação literal
- Strings com template literais (`` `${var}` ``)

**CSS (`style.css`):**

- Custom properties no `:root`
- Classes descritivas em kebab-case
- Seletores sem especificidade excessiva
- Media queries no final

**JSON (`dados-unificados.json`):**

- 4 espaços de indentação
- Vírgula no último elemento? **NÃO** (JSON puro)
- Strings com aspas duplas
- IDs em kebab-case

---

## Apêndice A: Mapa Mental do Projeto

```
SABERES DE CORAÇÃO
├── ESPÍRITO (cat 1)
│   ├── Gnose
│   │   ├── gnose-1: O Que é Gnose?
│   │   ├── gnose-2: Os Três Mundos
│   │   ├── gnose-3: Textos Gnósticos
│   │   ├── gnose-4: Yeshua: o Cristo Gnóstico
│   │   └── gnose-5: Pistis Sophia
│   ├── Hermetismo
│   │   ├── hermetismo-1: Sete Princípios do Kybalion
│   │   ├── hermetismo-2: Caibalion e Ser-Todo
│   │   └── correspondencia-1: Lei da Correspondência
│   ├── Teosofia
│   │   ├── teosofia-1: O Que é Teosofia?
│   │   └── teosofia-2: Helena Blavatsky
│   ├── Cristianismo
│   │   └── cristianismo-1: Cristianismo Primitivo
│   └── Kundalini
│       └── kundalini-1: O Que é Kundalini?
│
├── PRÁTICAS (cat 2)
│   ├── respiracao-1: Respiração Quadrada
│   ├── meditacao-1: Técnica de Meditação
│   ├── meditacao-2: Meditação dos Chakras com Mantras
│   ├── kundalini-2: Kundalini — Fogo do Espírito Santo
│   └── mantras-1: Mantras de Poder
│
├── CIÊNCIA (cat 3)
│   ├── epigenetica-1: O Que é Epigenética?
│   ├── epigenetica-2: Os Três Mecanismos
│   ├── epigenetica-3: O Que Influencia?
│   ├── coracao-1: Campo Eletromagnético
│   ├── coracao-2: Coerência Cardíaca
│   ├── ether-1: Éter: A Quintessência
│   └── conhecimento-1: Conhecimento Antigo
│
├── JORNADA (cat 4)
│   ├── jornada-1: A Jornada da Consciência
│   ├── jornada-2: Estados de Consciência
│   ├── jornada-3: Ser ou Consciência?
│   └── jornada-4: O Sentido da Existência
│
└── VIDA VERDADEIRA (cat 5)
    ├── vida-verdadeira-1: Vida Verdadeira
    ├── vida-verdadeira-2: Pneuma: O Sopro Vital
    ├── vida-verdadeira-3: Tao: O Caminho
    ├── vida-verdadeira-4: Coração como Arquitetor
    ├── vida-verdadeira-5: Eu Sou: O Poder Criador
    └── vida-verdadeira-6: Camino Verdad
```

## Apêndice B: Referência Rápida de Comandos

```bash
# Validar JSON
python3 -m json.tool database/dados-unificados.json > /dev/null && echo "OK"

# Servir localmente (teste)
python3 -m http.server 8080
# ou
npx serve .

# Verificar estrutura do projeto
ls -la
tree -L 2

# Git (quando aplicável)
git status
git diff
git log --oneline -10
```

## Apêndice C: Glossário

| Termo | Definição |
|-------|-----------|
| **Saber** | Unidade de conhecimento (equivalente a um artigo/lição) |
| **Pilar** | Categoria principal (5 no total) |
| **Content Shape** | Formato de conteúdo dentro de um saber (ex: `definicao`, `conceitos`) |
| **Handler** | Função em `app.js` que renderiza um content shape |
| **SPA** | Single Page Application — aplicação de página única |
| **SSOT** | Single Source of Truth — fonte única de verdade |
| **Conexão** | Link bidirecional entre saberes |
| **Accordion** | Componente expansível na biblioteca |
| **Card** | Cartão no grid da página inicial |

---

> **Guia de Refatoração — Saberes de Coração v4.0**  
> Licença: Domínio Público — Sinta-se livre para compartilhar, modificar e expandir.  
> "O conhecimento que não se compartilha é como a luz sob o alqueire."
