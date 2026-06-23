# Contribuindo para Saberes de Coração

Obrigado por querer ajudar a manter este projeto vivo. Este arquivo descreve como contribuir de forma clara, consistente e sustentável.

## 1. Qual é o ponto central

O site canônico do projeto é:

- `Saberes_de_Coracao-site-3.0/`

Essa é a versão ativa que deve ser mantida e atualizada.

## 2. Estrutura do repositório

- `README.md` — Introdução geral e proposta do projeto.
- `_indice.md` — Índice unificado para navegação de conteúdo.
- `_grafo.md` — Mapa de conexões entre ideias.
- `_tags.md` — Sistema de tags para navegação temática.
- `_guia-didatico.md` — Guia honesto sobre o que o projeto é e não é.
- `database/dados-unificados.json` — Fonte única de dados para o site 3.0.
- `Saberes_de_Coracao-site-3.0/` — Site funcional e canônico.
- `espirito/`, `practica/`, `ciencia/`, `viver/`, `vida-verdadeira/` — Conteúdos por área temática.
- `Apoie/` — materiais de produto e ebooks.

## 3. Como contribuir

### A. Adicionar ou atualizar conteúdo

1. Prefira editar o conteúdo em Markdown ou no JSON principal quando houver suporte.
2. Se for criar um novo saber para o site, adicione-o em `database/dados-unificados.json` na lista `saberes`.
3. Use `categoria_id` para definir o pilar correto:
   - 1 = ESPÍRITO
   - 2 = PRÁTICAS
   - 3 = CIÊNCIA
   - 4 = JORNADA
   - 5 = VIDA VERDADEIRA
4. Garanta que `tags` não contenham espaços antes ou depois.
5. Sempre mantenha `id` único.
6. Ao adicionar multimídia, atualize `dados-unificados.json` em `midia.audios` ou `midia.videos`.

### B. Ajustar o site

- O site lê `database/dados-unificados.json` em `Saberes_de_Coracao-site-3.0/js/app.js`.
- Não edite a lógica do `app.js` sem necessidade. Prefira manter o padrão de dados atual antes de alterar o código.

### C. Testar localmente

#### Opção 1 — Abrir `index.html` no navegador

Basta abrir `Saberes_de_Coracao-site-3.0/index.html` em qualquer navegador.

#### Opção 2 — Servidor local simples

```bash
cd Saberes_de_Coracao-site-3.0
python3 -m http.server 8080
```

Acesse: `http://localhost:8080`

### D. Validar o JSON

- Antes de abrir o site, confira se `database/dados-unificados.json` está válido.
- Use ferramentas online ou `python -m json.tool`:

```bash
python3 -m json.tool database/dados-unificados.json > /dev/null
```

## 4. Boas práticas

- Mantenha títulos e descrições sucintos e claros.
- Use português consistente em todo o texto.
- Prefira `slug` com palavras ligadas por hífen e sem acentos.
- Adicione fontes e créditos quando o conteúdo vier de uma tradição ou texto específico.
- Preserve a filosofia do projeto: conhecimento livre, aberto, sem paywall.

## 5. Quando criar novos arquivos

- Use pastas temáticas existentes sempre que possível.
- Se for um novo conjunto de conteúdo extenso, crie um arquivo Markdown nas pastas de tema antes de adicionar ao JSON.
- Atualize `_indice.md` e `_tags.md` quando criar novos módulos importantes.

## 6. Ferramentas úteis

- `grep` ou `ripgrep` para localizar referências a termos e `id`s.
- Um editor com suporte a JSON e Markdown.
- Navegador para testar a interface do site.

## 7. Processo de revisão

- Faça commits pequenos e descritivos.
- Se possível, crie um rascunho para revisão antes de mesclar grandes conteúdos.
- Explique no commit ou no pull request:
  - o que foi adicionado
  - onde o conteúdo aparece no site
  - se alguma dependência foi alterada

---

Obrigado por contribuir com Saberes de Coração.
