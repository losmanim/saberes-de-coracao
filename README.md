# Saberes de Coração

> *"O verdadeiro conhecimento deve ser passado de coração, com boa vontade, em empatia ativa, elevando o campo."*

Plataforma interativa dedicada à exploração do conhecimento em suas múltiplas dimensões — espiritual, prática, científica, existencial e social. Um ecossistema digital que reúne saberes ancestrais e contemporâneos, convidando à experiência direta e à integração do conhecimento no viver cotidiano.

---

## Visão

Saberes de Coração não é uma religião, nem um culto. É um **mapa de sabedoria** que convida à experiência direta, à prática e à transmissão de coração para coração. A plataforma busca integrar diferentes tradições e conhecimentos — Gnose, Teosofia, Taoísmo, Estoicismo, Cristianismo Primitivo, Ciência Moderna, Práticas Contemplativas e Filosofia da Mente — em um único espaço de aprendizado transformador.

## Filosofia

O conhecimento transformador não se acumula — pratica-se, vive-se, transmite-se. Cada saber apresentado é um convite à verificação pessoal, à experiência direta, à aplicação no cotidiano. A plataforma valoriza:

- **Experiência sobre crença**: O que você pode verificar por si mesmo
- **Prática sobre teoria**: Métodos aplicáveis no dia a dia
- **Integração sobre fragmentação**: Conexão entre diferentes saberes
- **Coração sobre mente**: Transmissão com empatia e boa vontade

---

## Pilares do Conhecimento

O conteúdo é organizado em seis pilares fundamentais, cada um representando uma dimensão do saber:

| Pilar | Descrição | Cor |
|-------|-----------|-----|
| **Espírito** 🜂 | Conhecimento Gnóstico — Gnose, Teosofia, Cristianismo Primitivo. Estudos sobre a natureza da consciência, tradições espirituais e o desenvolvimento interior. | Roxo |
| **Práticas** 🧠 | Trabalho Interior — Meditação, Kundalini, Respiração, Autoobservação. Métodos e exercícios para aplicação do conhecimento no dia a dia. | Azul |
| **Ciência** 🔬 | Conhecimento Baseado em Evidências — Epigenética, Éter, Física Quântica. Saberes fundamentados em pesquisa, observação e evidências científicas. | Verde |
| **Jornada** 🧭 | Transformação — Jornada da Consciência, Autoconhecimento. Reflexões sobre o caminho individual de crescimento e evolução da consciência. | Laranja |
| **Vida Verdadeira** ∞ | Integração — Tao, Pneuma. A integração de todos os saberes em uma existência autêntica, plena e alinhada. | Vermelho |
| **Apócrifos** 📜 | Textos Gnósticos — Evangelhos, Testamentos, Revelações. Escritos gnósticos dos primeiros séculos, preservados em Nag Hammadi. | Dourado |

---

## Funcionalidades

### Experiência do Usuário

- **Saber do Dia**: Uma citação ou insight diferente a cada dia, selecionado aleatoriamente do acervo
- **Cards Interativos**: Cada saber apresentado em cards elegantes com conteúdo completo e estruturado
- **Sistema de Favoritos**: Marque saberes para retornar posteriormente, com seção dedicada
- **Continuar Lendo**: Retome automaticamente de onde parou na última leitura
- **Busca Inteligente**: Encontre saberes por título, descrição ou tags
- **Filtros por Pilar**: Navegue facilmente entre as diferentes categorias de conhecimento

### Conteúdo Multimídia

- **Player de Áudio**: Integração com áudios meditativos e palestras via Cloudinary
- **Player de Vídeo**: Suporte a conteúdos em vídeo para experiências mais imersivas
- **Conexões entre Saberes**: Navegação contextual entre saberes relacionados
- **Textos Apócrifos**: Seção dedicada aos textos gnósticos dos primeiros séculos

### Design e Interface

- **Temas Claro/Escuro**: Alternância entre temas para conforto visual em diferentes ambientes
- **Design Responsivo**: Experiência otimizada para desktop, tablet e dispositivos móveis
- **Animações Suaves**: Transições elegantes que melhoram a experiência de navegação
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
- **Skeleton Loading**: Indicadores visuais durante o carregamento de conteúdo

---

## Conteúdo Disponível

### Tradições Espirituais

- **Gnose**: Conhecimento direto e experimental do divino, incluindo cosmologia gnóstica (Pleroma, Kenoma, Demiurgo)
- **Teosofia**: Saberes sobre a natureza do ser humano e do cosmos
- **Cristianismo Primitivo**: Visões gnósticas dos primeiros séculos da era cristã

### Práticas Contemplativas

- **Meditação**: Técnicas de silêncio interior e observação da mente
- **Respiração**: Exercícios respiratórios para equilíbrio energético
- **Autoobservação**: Prática de observar pensamentos e emoções sem identificação
- **Kundalini**: Trabalho com a energia vital e despertar da consciência

### Ciência Moderna

- **Epigenética**: Como ambiente, emoções e crenças influenciam a expressão genética
- **Éter**: Estudos sobre a energia sutil e sua relação com a consciência
- **Física Quântica**: Pontes entre física moderna e consciência

### Textos Clássicos

- **Biblioteca de Nag Hammadi**: Textos gnósticos descobertos em 1945
- **Evangelho de Tomé**: Ditos de Jesus preservados independentemente
- **Apócrifo de João**: Revelações gnósticas sobre a origem do cosmos
- **Outros textos**: Evangelho da Verdade, Apocalipse de Pedro, e mais

---

## Arquitetura Técnica

### Frontend

- **HTML5 Semântico**: Estrutura acessível e bem organizada
- **CSS3 Moderno**: Design system com variáveis custom, temas e responsividade
- **JavaScript Vanilla**: SPA (Single Page Application) sem frameworks pesados
- **LocalStorage**: Persistência de favoritos, histórico e preferências do usuário

### Backend

- **Node.js + Express**: Servidor API REST para servir conteúdo estático e endpoints
- **JSON Estruturado**: Fonte única de dados contendo todo o conteúdo do projeto
- **Cloudinary**: Hospedagem e entrega de mídia (áudios e vídeos)
- **Render Deploy**: Hospedagem em nuvem com deploy automático via GitHub

### Estrutura de Dados

- **dados-unificados.json**: Arquivo central (~2500 linhas) contendo meta informações, categorias, saberes, práticas, referências e mídia
- **Schema Normalizado**: Estrutura consistente para fácil manutenção e extensão
- **Sistema de Tags**: Organização flexível do conteúdo
- **Conexões Inter-saberes**: Grafo de relacionamentos entre diferentes conteúdos

---

## Design System

### Identidade Visual

- **Paleta de Cores**: Cores específicas para cada pilar, com suporte a temas claro/escuro
- **Tipografia**: Fontes sans-serif modernas para máxima legibilidade
- **Ícones**: Sistema de ícones consistente representando cada categoria
- **Animações**: Transições suaves e orbes decorativos no hero section

### Temas

- **Modo Escuro (Padrão)**: Cores escuras inspiradas em interfaces de desenvolvedor
- **Modo Claro**: Cores claras para ambientes bem iluminados
- **Persistência**: Preferência de tema salva no localStorage

---

## Acesse a Plataforma

**Versão em Produção**: [saberes-de-coracao.onrender.com](https://saberes-de-coracao.onrender.com)

A plataforma está disponível 24/7 para exploração gratuita de todo o conteúdo.

---

## Licença e Uso

© 2026 — Saberes de Coração

Este projeto é mantido como um recurso educacional e espiritual de código aberto. Todo o conteúdo é disponibilizado para estudo, reflexão e prática pessoal.

---

*"O conhecimento transformador não se acumula — pratica-se, vive-se, transmite-se de coração para coração, através dos tempos."*
