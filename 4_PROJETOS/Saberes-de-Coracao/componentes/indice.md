# 🧩 Componentes Interativos

> Biblioteca de componentes reutilizáveis para todos os sites do projeto.

---

## Como Usar

### 1. Incluir no HTML

```html
<!-- CSS -->
<link rel="stylesheet" href="componentes/css/interativo.css">

<!-- JS -->
<script src="componentes/js/interativo.js"></script>
```

### 2. Inicializar Componentes

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Progresso de leitura
    Interativo.progresso.init();
    
    // Accordion moderno
    Interativo.accordion.init('.accordion-item');
    
    // Tabs
    Interativo.tabs.init('nome-do-grupo');
    
    // Timeline animado
    Interativo.timeline.init();
    
    // Quiz interativo
    Interativo.quiz.init({
        containerId: 'meu-quiz',
        perguntas: [
            {
                pergunta: "Minha pergunta?",
                opcoes: ["Opção 1", "Opção 2", "Opção 3"],
                correta: 1
            }
        ]
    });
    
    // Calculadora epigenética
    Interativo.calculadoraEpigenetica.init();
    
    // Dark/Light mode
    Interativo.tema.init();
});
```

---

## Componentes Disponíveis

### ✅ Progresso de Leitura
Barra de progresso que mostra quanto do conteúdo foi lido.

### ✅ Accordion Moderno
Clique para expandir/recolher seções com animação.

### ✅ Tabs/Navegação por Abas
Organize conteúdo em abas clicáveis.

### ✅ Timeline Animado
Linha do tempo que revela itens conforme o usuário rola.

### ✅ Quiz Interativo
Teste conhecimento com perguntas e feedback.

### ✅ Calculadora Epigenética
Ferramenta para calcular impacto dos hábitos.

### ✅ Dark/Light Mode
Toggle para alternar entre temas.

### ✅ Animações de Entrada
Elementos que animam ao entrar na tela.

---

## Estrutura

```
componentes/
├── css/
│   └── interativo.css    # Estilos de todos os componentes
├── js/
│   └── interativo.js     # Biblioteca JavaScript
└── README.md             # Este arquivo
```

---

## Exemplos de Uso

### Accordion
```html
<div class="accordion-item">
    <div class="accordion-header">Clique para expandir</div>
    <div class="accordion-content">Conteúdo aqui...</div>
</div>
```

### Tabs
```html
<div class="tab-group">
    <button class="tab-button active" data-tab-group="exemplo" data-tab-target="tab1">Tab 1</button>
    <button class="tab-button" data-tab-group="exemplo" data-tab-target="tab2">Tab 2</button>
</div>
<div class="tab-content" data-tab-content="exemplo" data-tab="tab1">Conteúdo 1</div>
<div class="tab-content" data-tab-content="exemplo" data-tab="tab2">Conteúdo 2</div>
```

### Timeline
```html
<div class="timeline">
    <div class="timeline-item">
        <h4>Título</h4>
        <p>Descrição</p>
    </div>
</div>
```

---

## Sites Melhorados

| Site | Componentes | Status |
|------|-------------|--------|
| **Kundalini** | Tabs, Accordion, Timeline, Quiz, Dark Mode, Progresso | ✅ |
| **Viver** | Tabs, Accordion, Timeline, Quiz, Dark Mode, Progresso, Cards | ✅ |
| **Epigenética** | Tabs, Accordion, Calculadora, Timeline, Progresso | ✅ |
| **Jornada** | Tabs, Accordion, Timeline, Quiz, Dark Mode, Progresso | ✅ |
| **Camino-Verdade** | Tabs, Timeline, Quiz, Dark Mode, Cards, Progresso | ✅ |
| **Pneuma** | Tabs, Accordion, Timeline, Quiz, Dark Mode, Progresso | ✅ |
| **Técnica-Meditacao** | Tabs, Accordion, Quiz, Timer, Progresso | ✅ |

---

## Próximos Melhorias

- [ ] Adicionar mais quizzes
- [ ] Criar componentes para formulário de contato
- [ ] Adicionar animações scroll-reveal
- [ ] Implementar sistema de notas/favoritos