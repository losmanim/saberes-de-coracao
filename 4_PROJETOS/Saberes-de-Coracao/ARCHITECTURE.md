# Arquitetura do projeto Saberes de Coração

Este documento descreve a estrutura principal do repositório, como os dados fluem para o site e quais pastas são canônicas.

## 1. Visão geral

O projeto combina conteúdo em Markdown com um site estático que consome JSON. A ideia central é manter o conteúdo aberto, navegável e fácil de manter.

## 2. Site canônico

A versão principal do site é:

- `Saberes_de_Coracao-site-3.0/`

As versões 1.0 e 2.0 podem ser mantidas como histórico, mas não devem ser a base de edição ativa.

## 3. Fonte de verdade dos dados

- `database/dados-unificados.json`

Esse arquivo é a fonte de verdade para a interface do site 3.0. Ele contém:

- `meta` — informações de versão e descrição
- `categorias` — pilares do projeto
- `saberes` — conteúdo principal exibido em cards
- `midia` — áudios e vídeos apresentados no site

## 4. Fluxo de conteúdo

1. Edite ou adicione conteúdo em Markdown nas pastas temáticas (quando houver).
2. Atualize `database/dados-unificados.json` com os novos saberes e metadados.
3. Abra `Saberes_de_Coracao-site-3.0/index.html` ou rode um servidor local.
4. Navegue e valide o conteúdo no site.

## 5. Pastas temáticas

- `espirito/` — Gnose, Hermetismo, Teosofia, Cristianismo Primitivo
- `practica/` — Meditação, Respiração, Mantras
- `ciencia/` — Epigenética e ciência aplicada
- `viver/` — Conteúdo de integração prática
- `vida-verdadeira/` — Camino Verdade e projetos relacionados
- `Apoie/` — materiais de estudo, ebooks e vendas

## 6. Estrutura do site 3.0

- `index.html` — página principal que carrega o app
- `css/style.css` — estilos visuais
- `js/app.js` — lógica de interface e carregamento de dados
- `database/dados-unificados.json` — dados do site
- `404.html` — página de erro
- `biblioteca.html` — página de conteúdo extra e navegação
- `php/` — scripts opcionais para banco de dados e APIs

## 7. Como o site carrega dados

O `app.js` faz:

- `fetch('database/dados-unificados.json')`
- renderiza cards de saberes
- atualiza estatísticas
- filtra por categoria e busca
- exibe modal de conteúdo
- abre mídia via player de áudio

## 8. Recomendações de evolução

- Padronizar conteúdo em Markdown com frontmatter e gerar o JSON automaticamente
- Consolidar as pastas de conteúdo temático em uma única estrutura `content/`
- Evitar duplicação entre o JSON e arquivos HTML estáticos
- Manter `Saberes_de_Coracao-site-3.0/` como o único site ativo

## 9. Notas sobre multimídia

O site 3.0 usa arquivos de mídia referenciados por caminho relativo:

- `midia/audios/`
- `midia/videos/`

Esses caminhos podem ser criados como links simbólicos localmente para facilitar o desenvolvimento.

## 10. Uso de produtos

`Apoie/` contém materiais editorial e comerciais. Mantenha esse conteúdo separado do fluxo principal de conhecimento livre.
