### Experiências Visuais Únicas
Funcionalidades Muito Interactivas
- **Parallax filosófico** — camadas de texto e símbolos ao rolar
- **Canvas com partículas** — representar a "luz do conhecimento"
- **Transições de página cinematográficas**
- **Modo Dia/Noite** com temáticas distintas

Interactividade Educacional
Tutor ia offline

## Design — Identidade Visual Gnóstica

**Paleta sugerida:**

- `#1a0a2e` — Azul profundo (cosmos, mistério)
- `#c9a227` — Dourado (sabedoria, luz)
- `#f0e6d3` — Pergaminho (conhecimento antigo)
- `#2d6a4f` — Verde esmeralda (crescimento, natureza)

**Tipografia:**

- Títulos: `Cinzel` ou `Playfair Display` (clássico, solene)
- Corpo: `Lora` ou `Merriweather` (legível, elegante)
- Código/citações: `EB Garamond`

## Biblioteca Ancestral — Estrutura na Base de Dados

-- Tradições e linhagens do saber
CREATE TABLE tradicoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),           -- "Hermetismo Egípcio"
  origem_regiao VARCHAR(100),  -- "Norte de África"
  periodo_historico VARCHAR(80),
  simbolo_unicode VARCHAR(10), -- "𓂀"
  cor_tema VARCHAR(7)          -- "#C9A227" (dourado)
);

-- Textos sagrados e tratados ancestrais
CREATE TABLE textos_ancestrais (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tradicao_id INT,
  titulo VARCHAR(200),
  autor_atribuido VARCHAR(150), -- "Hermes Trismegisto (atribuído)"
  periodo_estimado VARCHAR(80), -- "séc. II-III d.C."
  tipo ENUM('texto_sagrado','tratado','poema','ensinamento','dialogo'),
  conteudo LONGTEXT,
  nivel_acesso ENUM('publico','iniciado','avancado'),
  FOREIGN KEY (tradicao_id) REFERENCES tradicoes(id)
);

-- Ensinamentos estruturados por conceito
CREATE TABLE ensinamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(200),
  conceito_central VARCHAR(100), -- "A Lei do Uno", "Maya (ilusão)"
  tradicoes_relacionadas JSON,   -- [1, 3, 5] (IDs das tradições)
  texto_explicativo TEXT,
  nivel TINYINT DEFAULT 1        -- 1=iniciante ... 5=avançado
);

### Conexões entre Tradições — O Grande Mapa

Uma das funcionalidades mais poderosas: mostrar como **o mesmo ensinamento** aparece em culturas diferentes, separadas por milénios:

// Exemplo: o conceito de "Tudo é Um" em várias tradições
const conexoes = [
  { conceito: "O Uno / Deus Primordial",
    tradicoes: [
      { nome: "Hermetismo",  texto: "O Todo é Mente; o Universo é Mental" },
      { nome: "Vedanta",     texto: "Brahman — a única realidade absoluta" },
      { nome: "Taoismo",     texto: "O Tao que pode ser nomeado não é o Tao eterno" },
      { nome: "Neoplatonismo", texto: "O Uno de Plotino — além do ser e do pensamento" },
      { nome: "Sufismo",     texto: "Wahdat al-Wujud — a unicidade do Ser (Ibn Arabi)" },
      { nome: "Kabbalah",    texto: "Ein Sof — o Infinito sem fim nem forma" }
    ]
  }
];
// → Renderizar como mapa visual interactivo com SVG/Canvas

## Identidade Visual Ancestral (CSS)
:root {
  /* Paleta da Sabedoria */
  --cor-cosmos:     #0d0a1a;  /* Azul-negro profundo */
  --cor-ouro:       #c9a227;  /* Dourado ancestral */
  --cor-pergaminho: #f5ede0;  /* Pergaminho antigo */
  --cor-esmeralda:  #1a5c3a;  /* Verde vida/natureza */
  --cor-turquesa:   #2a7a8c;  /* Azul-turquesa egípcio */
  --cor-ocre:       #8b4513;  /* Terracota/barro */

  /* Tipografia */
  --fonte-titulo:   'Cinzel', serif;       /* Solenidade clássica */
  --fonte-corpo:    'EB Garamond', serif;  /* Elegância atemporal */
  --fonte-citacao:  'Playfair Display', serif;
}

/* Efeito de "revelação do conhecimento" */
@keyframes revelar {
  from { opacity: 0; letter-spacing: 0.3em; filter: blur(4px); }
  to   { opacity: 1; letter-spacing: normal; filter: blur(0); }
}
.titulo-sagrado {
  animation: revelar 1.5s ease-out forwards;
  font-family: var(--fonte-titulo);
  color: var(--cor-ouro);
}

/* Separador estilo manuscrito antigo */
.divisor-ancestral::after {
  content: '⊕ · ⊕ · ⊕';
  display: block; text-align: center;
  color: var(--cor-ouro); opacity: 0.5;
  letter-spacing: 1em; margin: 2rem 0;
}

## Tutor com Contexto Ancestral (PHP + 'informações offline')
