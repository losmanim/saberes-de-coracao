# Roadmap de melhoria do Saberes de Coração

Este documento descreve os próximos passos para tornar o projeto mais organizado, sustentável e fácil de manter.

## Horizonte 1 — Curto prazo

1. Consolidar o site canônico em `Saberes_de_Coracao-site-3.0/`.
2. Criar documentação de contribuição e arquitetura.
3. Atualizar `README.md` para indicar onde editar conteúdo e como testar o site.
4. Validar e limpar `database/dados-unificados.json` (tags, IDs e categorias).
5. Definir um processo de contribuição simples para novos saberes.

## Horizonte 2 — Médio prazo

1. Padronizar o conteúdo com metadados claros (título, descrição, tags, categoria, nível).
2. Criar um gerador simples de páginas a partir de Markdown e JSON.
3. Unificar a navegação entre site, índices e tags.
4. Adicionar controle de qualidade para JSON e links internos.
5. Criar uma página de rota única para percursos de estudo e aprendizagem.

## Horizonte 3 — Longo prazo

1. Transformar o projeto em uma única base de conteúdo e múltiplas saídas (site estático, ebook, PDF, app).
2. Construir um editor leve para contribuir com conteúdo diretamente no navegador.
3. Adicionar suporte a tradução multilíngue.
4. Incluir recursos de comunidade, como comentários, fórum ou contribuições abertas.
5. Lançar um roadmap público dentro do site para transparência do projeto.

## Próximas tarefas recomendadas (após análise)

- [ ] **Eliminar duplicação do JSON**: fazer o site 3.0 ler diretamente `../database/dados-unificados.json` ou criar sincronização automática (symlink/cópia via script)
- [ ] **Adicionar práticas aos 10 saberes que ainda não têm** (Gnose 2/3, Hermetismo, Kundalini, Epigenética 1/2/3, Teosofia, Campo Cardíaco)
- [ ] **Criar multimídia faltante**: a seção `midia` no JSON foi populada mas os arquivos de mídia precisam estar em `midia/audios/` e `midia/videos/`
- [ ] **Implementar busca textual completa** no site (atualmente busca só em título, descrição e tags)
- [ ] **Melhorar acessibilidade do modal** (travar foco dentro do modal, fechar com Escape)
- [ ] **Adicionar um favicon real** (em vez do SVG inline)
- [ ] **Expandir Vida Verdadeira** (mais saberes: propósito, ética, comunidade)
- [ ] **Criar página de percursos de estudo** (rotas de aprendizado do Horizonte 2)
- [ ] **Publicar em domínio público** (GitHub Pages, Netlify, ou similar)
- [ ] **Primeiro commit no git** e push para o GitHub

## Tarefas iniciais sugeridas (concluídas)

- [x] Criar `CONTRIBUTING.md`
- [x] Criar `ARCHITECTURE.md`
- [x] Criar `ROADMAP.md`
- [x] Atualizar `README.md` com a visão canônica e instruções de uso
- [x] Criar `.gitignore` para arquivos temporários e mídia local
- [x] Verificar se há versões antigas em `Saberes_de_Coracao-site-1.0/` e `-2.0/` que podem ser arquivadas
- [x] Confirmar se todos os IDs em `database/dados-unificados.json` são únicos

## Meta do projeto

A meta principal é manter Saberes de Coração como um repositório de conteúdo livre, com uma experiência de navegação clara e um lugar central onde o conhecimento é atualizado de forma consistente.
