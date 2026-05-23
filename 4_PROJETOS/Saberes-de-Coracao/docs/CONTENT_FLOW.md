# Fluxo de Conteúdo

Este documento descreve como o conteúdo flui pelo projeto, de onde vem, onde é armazenado e como aparece no site.

## 1. Fontes de conteúdo

### Primária: `database/dados-unificados.json`

Esse é o arquivo único de verdade para o site. Ele contém:

- Categorias/Pilares
- Saberes (conteúdo principal)
- Práticas (exercícios)
- Referências (livros e links)
- Multimídia (áudios e vídeos)

### Secundária: Pastas temáticas

Conteúdo editorial em Markdown em:
- `espirito/` — Textos e artigos sobre Gnose, Hermetismo, Teosofia
- `practica/` — Técnicas de meditação, respiração, mantras
- `ciencia/` — Estudos sobre epigenética
- `viver/` — Conteúdo de integração prática

Essa é uma base de conhecimento complementar. Pode ser consultada para referência, mas o conteúdo exibido no site vem do JSON.

## 2. Ciclo de edição

### A. Adicionar um novo saber

1. Abra `database/dados-unificados.json` em um editor
2. Vá para a array `"saberes"`
3. Copie um saber existente como modelo
4. Preenchaa os campos obrigatórios:
   - `id` — Único, sem espaços (ex: `gnose-4`)
   - `categoria_id` — 1 a 5 (ver seção "Categorias" abaixo)
   - `titulo` — Nome do saber
   - `slug` — Versão em URL-friendly (ex: `gnose-novo-saber`)
   - `descricao` — Uma linha descrevendo o saber
   - `nivel` — `iniciante`, `intermediario` ou `avancado`
   - `duracao` — Tempo em minutos
   - `tags` — Array de palavras-chave sem espaços
   - `fonte` — Origem do conhecimento
5. Preencha o `conteudo` com a estrutura apropriada (ver "Estruturas de conteúdo" abaixo)
6. Se houver práticas associadas, preencha a array `praticas`
7. Se houver conexões com outros saberes, adicione os IDs em `conexoes`
8. Salve o arquivo
9. Valide: `python3 scripts/validate-content.py`
10. Teste no site: abra `Saberes_de_Coracao-site-3.0/index.html`

### B. Atualizar um saber existente

1. Abra `database/dados-unificados.json`
2. Localize o saber pelo `id`
3. Edite os campos desejados
4. Salve
5. Valide: `python3 scripts/validate-content.py`
6. Teste no site

### C. Adicionar multimídia

1. Coloque o arquivo em:
   - `midia/audios/` (para áudios)
   - `midia/videos/` (para vídeos)

2. Vá para `database/dados-unificados.json`, seção `"midia"`

3. Adicione um objeto em `audios` ou `videos`:
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

4. Salve e teste

## 3. Categorias e IDs

| Categoria ID | Nome | Slug |
|--------------|------|------|
| 1 | ESPÍRITO | espirito |
| 2 | PRÁTICAS | praticas |
| 3 | CIÊNCIA | ciencia |
| 4 | JORNADA | jornada |
| 5 | VIDA VERDADEIRA | vida-verdadeira |

## 4. Estruturas de conteúdo

Dependendo do tipo de saber, o campo `conteudo` pode ter diferentes estruturas:

### Estrutura 1: Definição + Conceitos

```json
"conteudo": {
  "definicao": "...",
  "conceitos": [
    {"termo": "...", "def": "..."}
  ],
  "citacoes": ["..."]
}
```

### Estrutura 2: Analogia + Insight

```json
"conteudo": {
  "analogia": "...",
  "insight": "..."
}
```

### Estrutura 3: Tabela (Aplicações, Mecanismos)

```json
"conteudo": {
  "aplicacoes": [
    {"maior": "...", "menor": "..."}
  ]
}
```

### Estrutura 4: Listas (Mundos, Princípios, Chakras)

```json
"conteudo": {
  "mundos": [
    {"nome": "...", "simbolo": "...", "desc": "..."}
  ],
  "principios": [
    {"num": 1, "nome": "...", "frase": "...", "desc": "..."}
  ],
  "chakras": [
    {"nome": "...", "cor": "...", "desc": "..."}
  ]
}
```

**Nota:** O site `app.js` renderiza cada estrutura diferentemente. Use as existentes como modelo.

## 5. Validação

Sempre execute antes de testar no site:

```bash
python3 scripts/validate-content.py
```

Isso verifica:
- Sintaxe JSON
- IDs únicos
- Tags sem espaços
- Campos obrigatórios
- Referências válidas

## 6. Teste local

### Opção 1: Abrir arquivo diretamente

```bash
xdg-open Saberes_de_Coracao-site-3.0/index.html
```

### Opção 2: Servidor local

```bash
cd Saberes_de_Coracao-site-3.0
python3 -m http.server 8080
```

Acesse: `http://localhost:8080`

## 7. Fluxo resumido

```
Editar JSON
    ↓
Salvar arquivo
    ↓
Validar: python3 scripts/validate-content.py
    ↓
Testar no site
    ↓
Git commit (opcional)
    ↓
Deploy (quando pronto)
```

## 8. Boas práticas

- ✓ Use português consistente
- ✓ Slugs em minúsculas, sem acentos, com hífens
- ✓ Tags descritivas mas concisas
- ✓ Sempre inclua fonte e créditos
- ✓ Revise antes de fazer commit
- ✓ Teste no site antes de publicar

## 9. Quando criar arquivo Markdown em vez de JSON

Use um arquivo Markdown em uma pasta temática se:

- O conteúdo for muito longo (>2000 caracteres)
- For um tutorial com muitas etapas
- Houver muita formatação de código
- For um artigo que possa ser lido independentemente

Depois, crie um resumo em JSON que link para o arquivo Markdown.

## 10. Troubleshooting

### "Arquivo não encontrado"

Certifique-se de que o caminho para `dados-unificados.json` está correto:
```
/projeto-raiz/database/dados-unificados.json
```

### "JSON inválido"

Verifique:
- Vírgulas ausentes ou extras
- Aspas não fechadas
- Caracteres especiais não escapados

Use um validador JSON online ou:
```bash
python3 -m json.tool database/dados-unificados.json
```

### "Referência não encontrada"

Se ver um erro como "conexão 'xyz' não existe":
- Verifique se o ID citado realmente existe
- Use grep para procurar:
  ```bash
  grep '"id": "xyz"' database/dados-unificados.json
  ```

---

Para dúvidas, consulte `CONTRIBUTING.md` ou `ARCHITECTURE.md`.
