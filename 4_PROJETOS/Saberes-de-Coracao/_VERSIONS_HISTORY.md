# Histórico de Versões do Site

## Status das versões

| Versão | Data | Status | Documentação |
|--------|------|--------|--------------|
| 1.0 | 2026-05-03 | Arquivado | Site original com accordion, timeline, quiz |
| 2.0 | 2026-05-06 | Arquivado | SEO, favoritos, busca, 404 |
| 3.0 | 2026-05-17 | **Canônico** | Cards, modal, multimídia, refatoração |

## Site Canônico: 3.0

O site versão 3.0 é a versão ativa e principal do projeto.

- Localização: `Saberes_de_Coracao-site-3.0/`
- Funcionalidades: cards interativos, busca, filtros, multimídia, dark/light mode
- Dados: `database/dados-unificados.json`
- Código JS: `Saberes_de_Coracao-site-3.0/js/app.js`

Mantenha essa versão como a base para edição e lançamento.

## Versões Anteriores: 1.0 e 2.0

As versões 1.0 e 2.0 estão mantidas para referência histórica. Elas contêm experiências e designs anteriores que podem ser consultadas como referência, mas **não devem ser usadas como base para novas edições**.

- `Saberes_de_Coracao-site-1.0/` — Interface com accordion e timeline
- `Saberes_de_Coracao-site-2.0/` — Interface com favoritos e SEO melhorado

## Migração de conteúdo entre versões

Se você está atualizando conteúdo, sempre atualize:

1. `database/dados-unificados.json` (fonte única)
2. Teste em `Saberes_de_Coracao-site-3.0/` (site canônico)

Não é necessário atualizar as versões anteriores.

## Se quiser restaurar uma versão antiga

As pastas das versões 1.0 e 2.0 ainda existem. Se for necessário resgatar alguma funcionalidade ou design, consulte os arquivos diretamente:

- `Saberes_de_Coracao-site-1.0/index.html`
- `Saberes_de_Coracao-site-2.0/index.html`

Mas lembre: mova a funcionalidade para a versão 3.0, não volte para as antigas.
