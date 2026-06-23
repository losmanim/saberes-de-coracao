# 📚 Índice Unificado - Saberes de Coração

> **Versão:** 3.2 | **Atualizado:** 2026-05-24  
> **Propósito:** Fonte única de navegação para todo o projeto  
> **Nota:** Este documento substitui todos os índices anteriores

---

## 🎯 Visão Geral

```
Saberes de Coração (Raiz)
├── ESPÍRITO (Conhecimento Gnóstico)
│   ├── Gnose              → espirito/gnose/
│   │   ├── Curso de Gnose → espirito/gnose/curso/
│   │   ├── Gnosis (site)  → espirito/gnose/gnosis/
│   │   ├── Pistis Sophia  → espirito/gnose/pistis-sofia/
│   │   └── Pindorama      → espirito/gnose/pindorama/
│   ├── Hermetismo        → espirito/hermetismo/
│   ├── Teosofia (site)   → espirito/teosofia/
│   └── Cristianismo Primitivo → espirito/cristianismo-primitivo/
│       └── iCosmica       → espirito/cristianismo-primitivo/iCosmica/
├── PRÁTICAS (Trabalho Interior)
│   ├── Respiração   → practica/respiracao/
│   ├── Meditação  → practica/tecnica-meditacao/
│   └── Mantras    → practica/mantras/
├── CIÊNCIA (Baseado em Evidências)
│   └── Epigenética → ciencia/epigenetica/
├── JORNADA (Transformação)
│   └── Jornada Consciência → jornada/
├── VIVER (Integração)
│   ├── Viver Sem Filtros → viver/
│   └── Regra de Ouro    → viver/regra-de-ouro/
├── VIDA VERDADEIRA
│   └── Camino Verdade → vida-verdadeira/
├── SITE PRINCIPAL
│   └── Saberes_de_Coracao-site-3.0/index.html
└── MULTIMÍDIA
    ├── Áudios (28 arquivos) → /home/lzntn/Público/audios-lz/
    ├── Vídeos (9 arquivos) → /home/lzntn/Público/videos-lz/
    └── Rock Brasil → 5_RECURSOS/cultura/rock-brasil/
```

---

## 📖 Navegação por Categoria

### 🟣 ESPÍRITO

| Módulo | Arquivo Principal | Nível | Duração |
|--------|--------------|-------|--------|
| Gnose: O Que É | `_indice.md`, `site` | Iniciante | 15min |
| Gnose: Curso Completo | `curso/Sumario-do-Curso-de-Gnose.md` | Iniciante | 7 sem |
| Gnose: Gnosis (site) | `gnosis/index.html` | Iniciante | 15min |
| Gnose: Pistis Sophia | `pistis-sofia/` | Avançado | 60min |
| Gnose: Pindorama | `pindorama/index.html` | Intermediário | 30min |
| Hermetismo: 7 Princípios | `site`, `hermetismo-ebook` | Iniciante | 30min |
| Lei da Correspondência | `correspondencia.md` | Iniciante | 20min |
| Kundalini | `kundalini-ebook` | Intermediário | 25min |
| Teosofia (site) | `teosofia/index.html` | Iniciante | 20min |
| Cristianismo Primitivo | `cristianismo-primitivo/index.html` | Iniciante | 20min |
| iCosmica | `cristianismo-primitivo/iCosmica/index.html` | Intermediário | 30min |

### 🔵 PRÁTICAS

| Módulo | Arquivo Principal | Nível | Duração |
|--------|----------------|-------|--------|
| Respiração Quadrada | `resida.md`, `site` | Iniciante | 10min |
| Respiração Alternada | `resida.md` | Intermediário | 15min |
| Meditação Chakras | `site` | Iniciante | 20min |
| Mantras de Poder | `mantras.md`, `site` | Iniciante | 15min |
| Autoobservação | `site` | Iniciante | 10min |

### 🟢 CIÊNCIA

| Módulo | Arquivo Principal | Nível | Duração |
|--------|------------------|-------|--------|
| O Que É Epigenética | `site`, `epigenetica-ebook` | Iniciante | 20min |
| 3 Mecanismos | `site` | Intermediário | 25min |
| O Que Influencia | `site` | Iniciante | 20min |
| Campo Cardíaco | `site` | Iniciante | 15min |
| Coerência Cardíaca | `site` | Iniciante | 15min |

### 🟠 JORNADA

| Módulo | Arquivo Principal | Nível | Duração |
|--------|---------------|-------|--------|
| Três Visões | `site` | Avançado | 30min |

---

## 🔗 Conexões entre Saberes

```
GNOSE ──────────────────────────────────┐
   │                                    │
   ├──▶ Pistis Sophia ──▶ Textos Gnósticos Fundamentais
   │                                    │
   ├──▶ Pindorama ──▶ Raio Maia / Cultura Indígena
   │                                    │
   ├──▶ KUNDALINI ──▶ PRÁTICAS          │
   │                                    │
   ├──▶ PNEUMA ──▶ CORAÇÃO              │
   │                                    │
   ├──▶ HERMETISMO ──▶ LEI DA CORRESPONDÊNCIA
   │                         │          │
   │                         └─▶ EPIGENÉTICA
   │                                    │
   ├──▶ Teosofia ──▶ Sabedoria Divina   │
   │                                    │
   ├──▶ Cristianismo Primitivo ──▶ iCosmica ──▶ Ciência & Fé
   │
   └──▶ VIVER ──▶ Regra de Ouro ──▶ Ética Universal
```

---

## 📊 Dados Unificados

### Fontes de Dados

| Recurso | Localização | Uso |
|---------|-----------|-----|
| **JSON Principal** | `database/dados-unificados.json` | Site, DB |
| **Schema SQL** | `database/schema.sql` | MySQL |
| **APIs PHP** | `Saberes_de_Coracao-site/php/api/` | Backend |
| **Ebooks** | `Apoie/ebooks/` | PDF/EPUB |

### Consistência

O site e os ebooks compartilham o mesmo conteúdo base. Atualizações devem ser feitas no `dados-unificados.json` e regeneradas as derivadas.

---

## 🎓 Percursos de Estudo

### Percurso 1: Fundamentos (Iniciante)
```
Gnose (15min) → Hermetismo 7 Princípios (30min) → Epigenética (20min)
```

### Percurso 2: Práticas (Iniciante)
```
Respiração Quadrada (10min) → Meditação Chakras (20min) → Mantras (15min)
```

### Percurso 3: Jornada (Avançado)
```
Gnose → Pistis Sophia → Kundalini → Jornada Consciência → Vida Verdadeira
```

### Percurso 4: Cultura e Raízes
```
Pindorama → Gnose (Raio Maia) → Rock Brasil → Viver Sem Filtros
```

### Percurso 5: Ética e Conexão
```
Regra de Ouro → Cristianismo Primitivo → iCosmica → Teosofia
```

---

## 📁 Estrutura de Arquivos

### Arquivos Essenciais (Raiz)
```
Saberes-de-Coracao/
├── _indice.md         ← Este arquivo (v3.2)
├── _grafo.md          ← Conexões visuais
├── _tags.md           ← Sistema de tags
├── _guia-didatico.md  ← Guia honesto
├── _resumo-melhorias.md← Histórico
├── README.md          ← Introdução
├── TUTORIAL.md        ← Como usar
└── compartilhamento.md ← Filosofia
```

### Site
```
Saberes_de_Coracao-site-3.0/
├── index.html      ← Página principal
├── biblioteca.html ← Biblioteca completa
├── css/style.css   ← Estilos unificados
├── js/app.js       ← JavaScript (v3.0)
├── database/       ← Dados unificados
└── _archive/       ← Versões anteriores (1.0, 2.0)
```

### Banco de Dados
```
database/
├── schema.sql              ← Schema MySQL
├── dados-unificados.json ← Fonte única
└── config.php           ← Conexão
```

### Conteúdo Integrado
```
espirito/gnose/gnosis/        → Site Gnosis (HTML/CSS/JS)
espirito/gnose/curso/          → Curso de Gnose (Markdown)
espirito/gnose/pistis-sofia/   → Pistis Sophia (PDFs)
espirito/gnose/pindorama/      → Pindorama (site completo)
espirito/hermetismo/           → 7 Princípios (Markdown)
espirito/teosofia/             → Site Teosofia (HTML/CSS/JS)
espirito/cristianismo-primitivo/ → Site Crist. Primitivo
espirito/cristianismo-primitivo/iCosmica/ → Site iCosmica
viver/regra-de-ouro/           → Site Regra de Ouro
5_RECURSOS/cultura/rock-brasil/ → Site Rock Brasil
practica/respiracao/           → Local (resida.md)
practica/mantras/              → Local (mantras.md)
ciencia/epigenetica/           → Symlink (externo)
```

---

## ⚠️ Nota sobre Redundâncias

### O Que Foi Unificado

1. **Dados do site** (`index.html` ~1208 linhas) + **conteúdos .md** → `dados-unificados.json`
2. **Índices separados** (_indice.md, ciencia/indice.md, etc.) → Este arquivo
3. **JavaScript** separado → `app.js` unificado

### O Que NÃO É Redundante

- **Ebooks** (`Apoie/ebooks/*.md`) - Versões expandidas para leitura offline
- **Site interativo** - UI com animações, quiz, calculadora
- **Database schema** - Estrutura para futura implementação DB

---

## 🛠️ Como Atualizar

### 1. Atualizar Dados Base
Editar `database/dados-unificados.json`

### 2. Regenerar Site (se necessário)
Recarregar página (dados são carregados via JavaScript)

### 3. Regenerar Ebooks
Usar conteúdo do JSON como base

---

## 📅 Histórico de Versões

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | 2026-05-03 | Estrutura inicial |
| 2.0 | 2026-05-06 | Dados unificados, sem redundâncias |
| 3.0 | 2026-05-17 | Multimídia, Lição 6, práticas, correções, Canvas |
| 3.1 | 2026-05-22 | Integração de 6 modelos: Teosofia, Pistis Sophia, Pindorama, iCosmica, Regra de Ouro, Rock Brasil |
| 3.2 | 2026-05-24 | JSON unificado (raiz+site), conteúdo para Jornada e Vida Verdadeira, correção de scripts, ROADMAP atualizado |

---

*Para navegação rápida, use este arquivo. Para detalhes de cada tópico, consulte o site em `Saberes_de_Coracao-site-3.0/index.html` ou os ebooks em `Apoie/ebooks/`.*

---

## 📎 Arquivos Relacionados

- [[_tags|Sistema de Tags]] — Navegação por categoria, tradição, prática e conceito
- [compartilhamento|Filosofia de Compartilhamento]] — Como e por que compartilhar
- [_grafo|Grafo de Conexões]] — Mapa visual dos conceitos
- [_guia-didatico|Guia Didático]] — O que esperar do projeto