# Manual do Projeto Teosofia

## O que foi modificado

Este documento explica, de forma simples, todas as alterações feitas no projeto.

---

## Resumo das Mudanças

| Arquivo | O que mudou |
|---------|-------------|
| `index.html` | Estrutura HTML estava correta |
| `js/main.js` | **5 botões** agora funcionam (antes só 1) |
| `css/estilo.css` | Estilos completados e responsivos |

---

## Explicação Técnica

### 1. JavaScript (js/main.js)

**Problema original:**
- Apenas o botão "Contexto Histórico" tinha função
- Os outros 4 botões não faziam nada

**Solução aplicada:**
- Foi criado um sistema onde cada botão carrega conteúdo específico
- Ao clicar num botão, ele muda visualmente (apura qual está ativo)
- O conteúdo muda conforme o botão

**Os 5 conteúdos:**
1. **Contexto Histórico** - Por que a Teosofia surgiu no século XIX
2. **Princípios Fundamentais** - Os 4 pilares da Teosofia
3. **Obras Fundamentais** - Os livros principais de Blavatsky
4. **Controvérsias** - Críticas e polêmicas
5. **O Legado** -Influências em outros movimentos

### 2. CSS (css/estilo.css)

**Melhorias:**
- Sistema responsivo (funciona em celular)
- Botões têm feedback visual (mudam ao clicar)
- Scroll automático no conteúdo
- Configurações de cores centralizadas (variáveis CSS)

---

## Como usar

1. Abra o arquivo `index.html` num navegador
2. Você verá 5 botões na parte "Análise Completa"
3. Clique em qualquer um para ver o conteúdo
4. O conteúdo aparece abaixo dos botões

---

## Para desenvolvedores

### Variáveis CSS (css/estilo.css)

O projeto usa variáveis para facilitar alterações:

```css
:root {
    --cor-titulo: darkcyan;      /* Cor dos títulos */
    --cor-fundo: rgba(0, 0, 0, 0.888);  /* Cor do fundo */
    --titulo: "Bangers", sans-serif;   /* Fonte do título principal */
}
```

Para mudar cores, basta alterar os valores acima.

### Adicionar novo conteúdo

Para adicionar um novo botão:

1. No HTML, adicione um botão dentro de `#buttons`:
   ```html
   <button id="novo-botao">Novo Tema</button>
   ```

2. No JavaScript, adicione em `botoes`:
   ```javascript
   { elemento: novoBotao, tipo: 'novo' }
   ```

3. Adicione o caso no switch:
   ```javascript
   case 'novo':
       conteudo = '<h2>Novo Tema</h2><p>Conteúdo...</p>';
       break;
   ```

---

## Estrutura do projeto

```
teosofia/
├── index.html          (Página principal)
├── css/
│   └── estilo.css    (Estilos)
├── js/
│   └── main.js       (Interatividade)
└── docs/
    ├── descricaoLeoAi.md
    └── MANUAL_TEOSOFIA.md  (Este arquivo)
```

---

## Cores do projeto

Para alterar as cores, edite o `:root` no CSS:

```css
:root {
    --cor-fundo: #0d0d0d;      /* Fundo principal (preto) */
    --cor-fundo-h: #1a1a2e;   /* Fundo do header (azul escuro) */
    --cor-titulo: #00d4aa;    /* Cor dos títulos (verde azulado) */
    --cor-destaque: #00fff5;  /* Cor de destaque (ciano neon) */
    --cor-texto: #e0e0e0;    /* Texto (cinza claro) */
    --cor-secundario: #ff6b6b; /* Destaque secundario (vermelho) */
}
```

---

## Cronologia das alterações

| Data | Alteração |
|------|----------|
| 17/04/2026 | Corrigido HTML (já estava correto) |
| 17/04/2026 | Expandido JS com 5 funções |
| 17/04/2026 | Completado CSS |
| 17/04/2026 | Criado documento explicativo |
| 17/04/2026 | Corrigido contraste das cores |

---

Feito por Lz_ntn - 2026