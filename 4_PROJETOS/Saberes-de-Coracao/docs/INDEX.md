# 📖 Documentação do Projeto

Bem-vindo ao Saberes de Coração! Este é o índice central da documentação do projeto.

## 🚀 Comece aqui

Se é sua primeira vez no projeto, leia nesta ordem:

1. [README.md](../README.md) — Visão geral e apresentação do projeto
2. [_guia-didatico.md](../_guia-didatico.md) — O que o projeto oferece e é
3. [ARCHITECTURE.md](./ARCHITECTURE.md) — Como o projeto está estruturado
4. [CONTRIBUTING.md](../CONTRIBUTING.md) — Como contribuir

## 📚 Documentação Completa

### Estrutura do Projeto

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Arquitetura técnica e fluxo de dados
- [_VERSIONS_HISTORY.md](../_VERSIONS_HISTORY.md) — Histórico das versões do site
- [_indice.md](../_indice.md) — Índice unificado de navegação
- [_grafo.md](../_grafo.md) — Mapa visual de conexões
- [_tags.md](../_tags.md) — Sistema de tags

### Como Trabalhar

- [CONTRIBUTING.md](../CONTRIBUTING.md) — Guia de contribuição
- [CONTENT_FLOW.md](./CONTENT_FLOW.md) — Fluxo de conteúdo e edição
- [TEMPLATE_SABER.json](./TEMPLATE_SABER.json) — Template para novo conteúdo

### Planejamento e Roadmap

- [ROADMAP.md](../ROADMAP.md) — Plano de evolução do projeto
- [PHASE_1_COMPLETE.md](./PHASE_1_COMPLETE.md) — Resumo da Fase 1

### Relatórios

- [CONTENT_REPORT.md](./CONTENT_REPORT.md) — Relatório atual do conteúdo

## 🛠️ Scripts Disponíveis

### Validação de Conteúdo

```bash
python3 scripts/validate-content.py
```

Valida:
- Sintaxe JSON
- IDs únicos
- Tags sem espaços
- Campos obrigatórios
- Referências válidas

**Use antes de fazer commit!**

### Geração de Relatório

```bash
python3 scripts/generate-report.py
```

Gera estatísticas e análise do conteúdo atual. Salva em `docs/CONTENT_REPORT.md`.

## 📁 Estrutura de Pastas

```
Saberes-de-Coracao/
├── README.md                      ← Apresentação
├── CONTRIBUTING.md               ← Como contribuir
├── ARCHITECTURE.md               ← Estrutura técnica
├── ROADMAP.md                    ← Plano de evolução
├── database/
│   └── dados-unificados.json    ← Fonte única de dados
├── Saberes_de_Coracao-site-3.0/ ← Site canônico
├── docs/
│   ├── CONTENT_FLOW.md          ← Fluxo de edição
│   ├── TEMPLATE_SABER.json      ← Template novo saber
│   ├── CONTENT_REPORT.md        ← Relatório atual
│   ├── PHASE_1_COMPLETE.md      ← Resumo Fase 1
│   └── INDEX.md                 ← Este arquivo
├── scripts/
│   ├── validate-content.py      ← Validação
│   └── generate-report.py       ← Geração de relatório
└── [conteúdo temático por pilar]
    ├── espirito/
    ├── practica/
    ├── ciencia/
    ├── viver/
    └── vida-verdadeira/
```

## 🎯 Tarefas Comuns

### Adicionar um novo saber

1. Leia [CONTENT_FLOW.md](./CONTENT_FLOW.md)
2. Use [TEMPLATE_SABER.json](./TEMPLATE_SABER.json)
3. Edite `database/dados-unificados.json`
4. Execute `python3 scripts/validate-content.py`
5. Teste em `Saberes_de_Coracao-site-3.0/index.html`

### Editar um saber existente

1. Abra `database/dados-unificados.json`
2. Encontre o saber pelo `id`
3. Faça as alterações
4. Execute `python3 scripts/validate-content.py`
5. Teste no site

### Adicionar multimídia

1. Coloque o arquivo em `midia/audios/` ou `midia/videos/`
2. Adicione entrada em `database/dados-unificados.json`
3. Valide com `python3 scripts/validate-content.py`
4. Teste no site

### Gerar um relatório atualizado

```bash
python3 scripts/generate-report.py
```

O relatório é salvo em `docs/CONTENT_REPORT.md`.

## 🔗 Links Úteis

- [Site 3.0 (Canônico)](../Saberes_de_Coracao-site-3.0/index.html)
- [Dados do Projeto](../database/dados-unificados.json)
- [Validação JSON Online](https://jsonlint.com/)

## ❓ Perguntas Frequentes

### Onde adiciono conteúdo novo?

Sempre no arquivo `database/dados-unificados.json` para que apareça no site. Se for conteúdo extenso, crie um arquivo Markdown nas pastas temáticas e depois referencia no JSON.

### Como testo as mudanças?

1. Valide: `python3 scripts/validate-content.py`
2. Abra o site: `Saberes_de_Coracao-site-3.0/index.html`
3. Procure seu conteúdo nos filtros e buscas

### Posso editar as versões antigas do site (1.0, 2.0)?

Não recomenda-se. O site canônico é a versão 3.0. As versões antigas estão mantidas apenas como referência histórica.

### Onde está meu arquivo de multimídia?

Coloque em:
- Áudios: `midia/audios/`
- Vídeos: `midia/videos/`

Depois adicione a referência em `database/dados-unificados.json`.

## 📞 Suporte

Se tiver dúvidas:

1. Consulte [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Leia [ARCHITECTURE.md](./ARCHITECTURE.md)
3. Revise [CONTENT_FLOW.md](./CONTENT_FLOW.md)
4. Verifique [CONTENT_REPORT.md](./CONTENT_REPORT.md)

---

**Última atualização:** 22 de maio de 2026

Mantenha a documentação atualizada conforme o projeto evolui.
