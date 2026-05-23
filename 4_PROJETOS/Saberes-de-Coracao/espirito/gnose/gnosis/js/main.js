const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const savedTheme = localStorage.getItem('gnosis-theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '\u2600\uFE0F' : '\uD83C\uDF19';
} else {
  document.documentElement.setAttribute('data-theme', prefersDark.matches ? 'dark' : 'light');
  themeToggle.textContent = prefersDark.matches ? '\uD83C\uDF19' : '\u2600\uFE0F';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('gnosis-theme', next);
  themeToggle.textContent = next === 'light' ? '\u2600\uFE0F' : '\uD83C\uDF19';
});

/* Partículas */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function getCSS(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += 0.01;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
    ctx.fillStyle = hexToRgba(getCSS('--cor-ouro') || '#c9a227', alpha);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 8000));
for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.2;
        ctx.strokeStyle = hexToRgba(getCSS('--cor-ouro') || '#c9a227', alpha);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* Scroll animations */
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visivel'); });
}, { threshold: 0.15 });
sections.forEach(s => observer.observe(s));

/* Nav scroll suave */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Parallax header */
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.querySelector('header .titulo-sagrado');
  if (h) {
    h.style.transform = `translateY(${s * 0.3}px)`;
    h.style.opacity = Math.max(0, 1 - s / 400);
  }
});

/* ========== CONTEMPLAÇÃO ========== */
const frases = [
  { texto: 'Conhece-te a ti mesmo e conhecerás o universo e os deuses.', autor: '— Templo de Delfos' },
  { texto: 'O Reino de Deus está dentro de vós.', autor: '— Jesus (Evangelho de Tomé)' },
  { texto: 'O Todo é Mente; o Universo é Mental.', autor: '— Caibalion / Hermetismo' },
  { texto: 'A Gnosis não se aprende — se vive.', autor: '— Saberes de Coração' },
  { texto: 'O maior erro é acreditar que já despertaste.', autor: '— Provérbio Gnóstico' },
  { texto: 'O corpo é o templo do espírito. Cuida dele com reverência.', autor: '— Sabedoria Ancestral' },
  { texto: 'O silêncio é a primeira língua de Deus.', autor: '— Misticismo' },
  { texto: 'Não há conhecimento mais alto do que o autoconhecimento.', autor: '— Samael Aun Weor' },
  { texto: 'Tudo o que somos é resultado do que pensamos.', autor: '— Buda' },
  { texto: 'A verdadeira viagem do descobrimento não consiste em ver novas paisagens, mas em ter novos olhos.', autor: '— Marcel Proust' },
  { texto: 'A alma não pode viver sem amor.', autor: '— Dionísio, o Aeropagita' },
  { texto: 'O universo é uma rede onde cada parte está ligada ao todo.', autor: '— Sabedoria Hermética' },
  { texto: 'A essência é inata; a personalidade, adquirida; o ego, dissolvível.', autor: '— Gnose' },
  { texto: 'A respiração é a ponte entre o corpo e o espírito.', autor: '— Sabedoria Ancestral' },
  { texto: 'A verdade vos libertará.', autor: '— Jesus (João 8:32)' },
  { texto: 'O propósito da vida é a autorrealização.', autor: '— Vedanta' },
  { texto: 'Entre uma respiração e outra, habita o infinito.', autor: '— Contemplação Gnóstica' },
  { texto: 'O amor é a força que une o indivíduo ao todo.', autor: '— Neoplatonismo' },
  { texto: 'O símbolo é a linguagem da alma.', autor: '— Sabedoria Ancestral' },
  { texto: 'Cada pensamento é uma escolha. Escolhe com consciência.', autor: '— Gnose Prática' },
];

function getFraseDoDia() {
  const seed = new Date().toDateString().split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return frases[seed % frases.length];
}

function exibirFrase() {
  const el = document.getElementById('contemplacao-frase');
  const autor = document.getElementById('contemplacao-autor');
  const f = getFraseDoDia();
  el.textContent = `\u201C${f.texto}\u201D`;
  autor.textContent = f.autor;
}

function fraseAleatoria() {
  const el = document.getElementById('contemplacao-frase');
  const autor = document.getElementById('contemplacao-autor');
  const f = frases[Math.floor(Math.random() * frases.length)];
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = `\u201C${f.texto}\u201D`;
    autor.textContent = f.autor;
    el.style.opacity = 1;
  }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
  exibirFrase();
  document.getElementById('btn-contemplar')?.addEventListener('click', fraseAleatoria);
});

/* ========== GLOSSÁRIO ========== */
const glossario = [
  { termo: 'Pneuma', etimologia: 'Gr. \u03C0\u03BD\u03B5\u1FE6\u03BC\u03B1 — sopro, espírito', definicao: 'A centelha divina no ser humano. O espírito imortal que conecta o indivíduo ao Pleroma. Na Gnose, é o que deve despertar do sono da matéria.' },
  { termo: 'Hyle', etimologia: 'Gr. \u1F55\u03BB\u03B7 — matéria, madeira', definicao: 'A matéria-prima, o mundo físico denso. Na visão gnóstica, é a prisão do espírito, criada pelo Demiurgo para aprisionar as centelhas divinas.' },
  { termo: 'Demiurgo', etimologia: 'Gr. \u03B4\u03B7\u03BC\u03B9\u03BF\u03C5\u03C1\u03B3\u03CC\u03C2 — artesão, criador', definicao: 'O "deus criador" do mundo material, descrito como imperfeito ou ignorante. Não é o Deus supremo, mas uma emanação inferior que criou o cosmos físico.' },
  { termo: 'Pleroma', etimologia: 'Gr. \u03C0\u03BB\u03AE\u03C1\u03C9\u03BC\u03B1 — plenitude, totalidade', definicao: 'A totalidade divina, o mundo espiritual perfeito. O Pleroma é a morada do Deus incognoscível e de todas as emanações divinas (Éons).' },
  { termo: 'Kenoma', etimologia: 'Gr. \u03BA\u03AD\u03BD\u03C9\u03BC\u03B1 — vazio, vácuo', definicao: 'O mundo material, o vazio ou a ausência do divino. É o reino do Demiurgo, onde as centelhas divinas estão aprisionadas no esquecimento.' },
  { termo: 'Nous', etimologia: 'Gr. \u03BD\u03BF\u1FE6\u03C2 — mente, intelecto, espírito', definicao: 'O intelecto divino, a inteligência universal. No Hermetismo, é a primeira emanação do Uno. No ser humano, é a faculdade do conhecimento direto.' },
  { termo: 'Sophia', etimologia: 'Gr. \u03C3\u03BF\u03C6\u03AF\u03B1 — sabedoria', definicao: 'A Sabedoria divina, uma das emanações (Éons) do Pleroma. Na Gnose, sua queda e redenção simbolizam a jornada da alma humana.' },
  { termo: 'Metanoia', etimologia: 'Gr. \u03BC\u03B5\u03C4\u03AC\u03BD\u03BF\u03B9\u03B1 — mudança de mente', definicao: 'A transformação radical da mente e do coração. Mais que arrependimento — é uma virada completa de percepção, o despertar da consciência adormecida.' },
  { termo: 'Sarx / Sarcic', etimologia: 'Gr. \u03C3\u03AC\u03C1\u03BE — carne', definicao: 'O nível material e carnal do ser. O estágio mais denso da existência, onde predominam os instintos básicos e a identificação com o corpo físico.' },
  { termo: 'Autopoiese', etimologia: 'Gr. \u03B1\u1F50\u03C4\u03CC\u03C2 + \u03C0\u03BF\u03AF\u03B7\u03C3\u03B9\u03C2 — autoconstrução', definicao: 'Capacidade de um sistema se autorregenerar. Jesus aplicou este princípio através do perdão (70x7): a alma que não se autorrestaura, colapsa.' },
  { termo: 'Filoxenia', etimologia: 'Gr. \u03C6\u03B9\u03BB\u03BF\u03BE\u03B5\u03BD\u03AF\u03B1 — amor ao estrangeiro', definicao: 'A hospitalidade radical ensinada na Didache. Receber o outro como se recebe o divino. A base ética do Cristianismo Primitivo antes da institucionalização.' },
  { termo: 'Hieros Gamos', etimologia: 'Gr. \u1F31\u03B5\u03C1\u03CC\u03C2 \u03B3\u03AC\u03BC\u03BF\u03C2 — casamento sagrado', definicao: 'A união sagrada dos princípios masculino e feminino dentro do ser. A integração dos opostos que gera o equilíbrio e a totalidade espiritual.' },
];

function initGlossario() {
  const container = document.getElementById('glossario-grid');
  if (!container) return;
  glossario.forEach(item => {
    const div = document.createElement('div');
    div.className = 'glossario-item';
    div.innerHTML = `
      <div class="termo">${item.termo}</div>
      <div class="etimologia">${item.etimologia}</div>
      <div class="definicao">${item.definicao}</div>
    `;
    div.addEventListener('click', () => div.classList.toggle('ativo'));
    container.appendChild(div);
  });

  document.querySelectorAll('.glossario-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const termo = el.dataset.termo;
      if (termo) {
        const item = glossario.find(g => g.termo.toLowerCase() === termo.toLowerCase());
        if (item) {
          document.getElementById('modal-titulo').textContent = item.termo;
          document.getElementById('modal-etimologia').textContent = item.etimologia;
          document.getElementById('modal-descricao').textContent = item.definicao;
          document.getElementById('modal-glossario').classList.add('visivel');
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initGlossario);

document.getElementById('modal-fechar')?.addEventListener('click', () => {
  document.getElementById('modal-glossario').classList.remove('visivel');
});
document.getElementById('modal-glossario')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) e.target.classList.remove('visivel');
});

/* ========== CADEIA CAUSA E EFEITO ========== */
const cadeiaData = [
  { nome: 'Pensamento', numero: 1, descricao: 'Tudo começa numa ideia. Um pensamento é uma semente que, plantada, cresce e frutifica. O universo mental é o campo onde toda realidade se origina.', pergunta: 'Que pensamentos tens cultivado hoje? Eles te aproximam ou te afastam da tua essência?' },
  { nome: 'Emoção', numero: 2, descricao: 'O pensamento gera uma carga emocional. A emoção é o combustível que move a alma. Sem ela, o pensamento permanece estéril. Com ela, torna-se força criadora ou destrutiva.', pergunta: 'Que emoção nasce dos teus pensamentos repetidos? Medo ou amor? Raiva ou compaixão?' },
  { nome: 'Ação', numero: 3, descricao: 'A emoção busca expressão. A ação é o parto do mundo interior no mundo exterior. Cada ação é um tijolo na construção do teu destino.', pergunta: 'As tuas ações nascem de impulsos conscientes ou de reações automáticas?' },
  { nome: 'Hábito', numero: 4, descricao: 'A ação repetida torna-se hábito. O hábito é o piloto automático do ser. Ele economiza energia, mas também pode aprisionar se não for observado.', pergunta: 'Que hábitos silenciosos governam o teu dia sem que notes?' },
  { nome: 'Caráter', numero: 5, descricao: 'O conjunto dos hábitos forma o caráter. O caráter é a estrutura visível da alma. Mudar o caráter é o trabalho mais difícil — e mais nobre — da Gnose.', pergunta: 'Se o teu caráter fosse um templo, que materiais o compõem?' },
  { nome: 'Destino', numero: 6, descricao: 'O caráter tecido ao longo do tempo manifesta-se como destino. Mas a Gnose ensina: o destino não é sentença — é colheita. E a plantação recomeça a cada pensamento.', pergunta: 'Qual elo da corrente podes quebrar hoje para mudar o teu destino?' },
];

function initCadeia() {
  const container = document.getElementById('cadeia-container');
  const detalhe = document.getElementById('cadeia-detalhe');
  if (!container) return;

  cadeiaData.forEach((item, i) => {
    const elo = document.createElement('div');
    elo.className = 'cadeia-elo';
    elo.innerHTML = `<span class="elo-numero">${item.numero}</span><span class="elo-nome">${item.nome}</span>`;
    elo.addEventListener('click', () => {
      container.querySelectorAll('.cadeia-elo').forEach(e => e.classList.remove('ativo'));
      elo.classList.add('ativo');
      detalhe.classList.add('visivel');
      document.getElementById('cadeia-titulo').textContent = `${item.numero}. ${item.nome}`;
      document.getElementById('cadeia-descricao').textContent = item.descricao;
      document.getElementById('cadeia-pergunta').textContent = `\u201C${item.pergunta}\u201D`;
      detalhe.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    container.appendChild(elo);

    if (i < cadeiaData.length - 1) {
      const seta = document.createElement('div');
      seta.className = 'cadeia-seta';
      seta.textContent = '\u2193';
      container.appendChild(seta);
    }
  });
}

document.addEventListener('DOMContentLoaded', initCadeia);

/* ========== 6 DEFEITOS ========== */
const defeitosData = [
  { nome: 'Ira', icone: '\uD83D\uDCA5', origem: 'Lat. ira — raiva, cólera', efeitoFisico: 'Inflamações, tensão muscular, pressão alta, dores de cabeça', efeitoEmocional: 'Impaciência, agressividade, julgamento constante', pratica: 'Respira fundo 3 vezes antes de reagir. Pergunta: "O que está realmente a doer em mim?"' },
  { nome: 'Gula', icone: '\uD83C\uDF54', origem: 'Lat. gula — vontade excessiva de comer', efeitoFisico: 'Metabolismo desregulado, cansaço, compulsão alimentar', efeitoEmocional: 'Ansiedade, busca de conforto no exterior, insatisfação crónica', pratica: 'Come com atenção plena. Mastiga devagar. Pergunta: "Que vazio estou a tentar preencher?"' },
  { nome: 'Vaidade', icone: '\u2728', origem: 'Lat. vanitas — vazio, futilidade', efeitoFisico: 'Preocupação excessiva com aparência, tensão na pele e postura', efeitoEmocional: 'Comparação constante, necessidade de validação, medo do julgamento', pratica: 'Olha-te ao espelho sem julgar. Pergunta: "Quem sou eu quando ninguém me vê?"' },
  { nome: 'Preguiça', icone: '\uD83D\uDE34', origem: 'Lat. pigritia — lentidão, inércia', efeitoFisico: 'Atrofia muscular, falta de energia, má circulação', efeitoEmocional: 'Apatia, procrastinação, falta de propósito', pratica: 'Faz uma pequena ação agora. Move o corpo. Pergunta: "O que está paralisado em mim?"' },
  { nome: 'Orgulho', icone: '\uD83D\uDC51', origem: 'Lat. superbia — soberba, arrogância', efeitoFisico: 'Rigidez na coluna, tensão no pescoço e ombros', efeitoEmocional: 'Dificuldade em pedir desculpa, isolamento, incapacidade de aprender', pratica: 'Pratica humildade ativa. Pede desculpa a alguém hoje. Pergunta: "O que o meu orgulho me impede de ver?"' },
  { nome: 'Luxúria', icone: '\u2764\uFE0F', origem: 'Lat. luxuria — excesso, desregramento', efeitoFisico: 'Exaustão, desequilíbrios hormonais, inquietação', efeitoEmocional: 'Dependência afetiva, objetificação, insaciabilidade', pratica: 'Canaliza a energia criadora para algo construtivo. Pergunta: "Que desejo não reconhecido está a controlar-me?"' },
];

function initDefeitos() {
  const grid = document.getElementById('defeitos-grid');
  if (!grid) return;

  defeitosData.forEach(item => {
    const key = `defeito-${item.nome.toLowerCase()}`;
    const contagem = parseInt(localStorage.getItem(key) || '0');

    const card = document.createElement('div');
    card.className = 'defeito-card';
    card.innerHTML = `
      <span class="defeito-icone">${item.icone}</span>
      <div class="defeito-nome">${item.nome}</div>
      <div class="defeito-origem">${item.origem}</div>
      <div class="defeito-detalhe">
        <p><strong>Corpo:</strong> ${item.efeitoFisico}</p>
        <p><strong>Alma:</strong> ${item.efeitoEmocional}</p>
        <p><strong>Prática:</strong> ${item.pratica}</p>
        <button class="defeito-obs-btn" data-defeito="${item.nome}">Observei hoje</button>
        <div class="defeito-contador">Observado ${contagem} vez(es)</div>
      </div>
    `;

    card.addEventListener('click', e => {
      if (e.target.classList.contains('defeito-obs-btn')) return;
      card.classList.toggle('ativo');
    });

    card.querySelector('.defeito-obs-btn').addEventListener('click', function() {
      const c = parseInt(localStorage.getItem(key) || '0') + 1;
      localStorage.setItem(key, c);
      this.nextElementSibling.textContent = `Observado ${c} vez(es)`;
      this.textContent = '\u2713 Observado';
      this.style.background = getCSS('--cor-esmeralda') || '#2d6a4f';
      this.style.color = '#fff';
      setTimeout(() => {
        this.textContent = 'Observei hoje';
        this.style.background = '';
        this.style.color = '';
      }, 2000);
    });

    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', initDefeitos);

/* ========== CORRESPONDÊNCIAS ========== */
const correspondenciasData = [
  { esquerda: 'Sol', subEsq: 'Centro do sistema', direita: 'Coração', subDir: 'Centro do ser', explicacao: 'O Sol é o coração do sistema solar, irradiando luz e vida. O coração é o sol do corpo humano, gerando o campo eletromagnético que sustenta a vida. "Como em cima, assim embaixo."' },
  { esquerda: 'Lua', subEsq: 'Reflete a luz', direita: 'Mente', subDir: 'Reflete a consciência', explicacao: 'A Lua reflete a luz do Sol sem luz própria. A mente reflete a consciência do espírito. Ambas podem obscurecer-se ou iluminar-se conforme a fonte que as atinge.' },
  { esquerda: 'Planetas', subEsq: 'Órbitas ao redor do Sol', direita: 'Chakras', subDir: 'Centros ao redor da coluna', explicacao: 'Cada planeta ocupa uma posição específica no sistema solar, como cada chakra ocupa uma posição na coluna. O movimento harmónico dos astros reflete o fluxo de energia nos centros sutis.' },
  { esquerda: 'Elementos', subEsq: 'Fogo, Água, Ar, Terra', direita: 'Temperamentos', subDir: 'Colérico, Fleumático, Sanguíneo, Melancólico', explicacao: 'Os quatro elementos da natureza correspondem aos quatro temperamentos humanos. O fogo = colérico (ação), água = fleumático (calma), ar = sanguíneo (comunicação), terra = melancólico (reflexão).' },
  { esquerda: 'Céu', subEsq: 'O invisível, o divino', direita: 'Espírito', subDir: 'O invisível, a essência', explicacao: 'O céu é o que está acima, o que contemplamos mas não tocamos. O espírito é o céu interior — igualmente invisível, igualmente vasto, igualmente presente.' },
  { esquerda: 'Terra', subEsq: 'Onde pisamos, o concreto', direita: 'Corpo', subDir: 'Onde habitamos, o instrumento', explicacao: 'A terra é o solo que nos sustenta, onde plantamos e colhemos. O corpo é a terra do espírito — o instrumento físico através do qual a alma experimenta o mundo.' },
  { esquerda: 'Árvore', subEsq: 'Raízes na terra, copa no céu', direita: 'Ser Humano', subDir: 'Corpo na matéria, espírito no divino', explicacao: 'A árvore é o símbolo do ser humano: raízes na terra (corpo, instintos) e copa no céu (espírito, aspirações). Entre ambas, o tronco — a vida vivida.' },
];

function initCorrespondencias() {
  const container = document.getElementById('correspondencias-container');
  if (!container) return;

  correspondenciasData.forEach(item => {
    const par = document.createElement('div');
    par.className = 'correspondencia-par';
    par.innerHTML = `
      <div class="corresp-esquerda">${item.esquerda}<span class="corresp-sub">${item.subEsq}</span></div>
      <div class="corresp-seta">\u2194</div>
      <div class="corresp-direita">${item.direita}<span class="corresp-sub">${item.subDir}</span></div>
    `;
    const exp = document.createElement('div');
    exp.className = 'correspondencia-explicacao';
    exp.textContent = item.explicacao;

    par.addEventListener('click', () => {
      container.querySelectorAll('.correspondencia-par').forEach(p => p.classList.remove('ativo'));
      par.classList.add('ativo');
    });

    container.appendChild(par);
    container.appendChild(exp);
  });
}

document.addEventListener('DOMContentLoaded', initCorrespondencias);

/* ========== RESPIRAÇÃO QUADRADA ========== */
let respInterval = null;
let respRodando = false;
let respCicloAtual = 0;
let respFaseAtual = 'inspira';
let respTotalCiclos = 5;
const fases = ['inspira', 'segura1', 'expira', 'segura2'];
const faseLabels = { inspira: 'Inspira...', segura1: 'Segura...', expira: 'Expira...', segura2: 'Segura...' };
const faseCores = { inspira: '#c9a227', segura1: '#2a7a8c', expira: '#2d6a4f', segura2: '#8b4513' };

function initRespiracao() {
  const startBtn = document.getElementById('resp-start');
  const ciclosBtns = document.querySelectorAll('.resp-ciclos');
  if (!startBtn) return;

  ciclosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ciclosBtns.forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      respTotalCiclos = parseInt(btn.dataset.ciclos);
      if (!respRodando) {
        respCicloAtual = 0;
        document.getElementById('resp-ciclos-label').textContent = `0 / ${respTotalCiclos} ciclos`;
      }
    });
  });

  startBtn.addEventListener('click', () => {
    if (respRodando) {
      clearInterval(respInterval);
      respInterval = null;
      respRodando = false;
      startBtn.textContent = 'Iniciar';
      document.getElementById('resp-fase').textContent = '';
      document.getElementById('resp-fase').style.color = '';
      return;
    }
    respRodando = true;
    respCicloAtual = 0;
    respFaseAtual = 'inspira';
    startBtn.textContent = 'Parar';
    iniciarCiclo();
  });
}

function iniciarCiclo() {
  let faseIdx = 0;
  const path = document.querySelector('.resp-path');
  const label = document.getElementById('resp-fase');

  function avancarFase() {
    if (faseIdx >= 4) {
      respCicloAtual++;
      document.getElementById('resp-ciclos-label').textContent = `${respCicloAtual} / ${respTotalCiclos} ciclos`;
      if (respCicloAtual >= respTotalCiclos) {
        clearInterval(respInterval);
        respInterval = null;
        respRodando = false;
        document.getElementById('resp-start').textContent = 'Iniciar';
        label.textContent = '\u2728 Prática concluída';
        label.style.color = getCSS('--cor-esmeralda') || '#2d6a4f';
        if (path) path.classList.remove('animando');
        return;
      }
      faseIdx = 0;
    }
    const fase = fases[faseIdx];
    label.textContent = faseLabels[fase];
    label.style.color = faseCores[fase];
    if (path) {
      path.classList.remove('animando');
      void path.offsetWidth;
      path.classList.add('animando');
      path.style.stroke = faseCores[fase];
    }
    faseIdx++;
  }

  avancarFase();
  respInterval = setInterval(avancarFase, 4000);
}

document.addEventListener('DOMContentLoaded', initRespiracao);

/* ========== RODA 3 FATORES - AUTOAVALIAÇÃO ========== */
function initRodaAvaliacao() {
  const salvarBtn = document.getElementById('roda-salvar');
  if (!salvarBtn) return;

  const hoje = new Date().toISOString().split('T')[0];
  const prefix = `roda-${hoje}`;

  ['nascer', 'morrer', 'sacrificar'].forEach(fator => {
    const textarea = document.getElementById(`roda-${fator}`);
    const saved = localStorage.getItem(`${prefix}-${fator}`);
    if (saved) textarea.value = saved;
  });

  salvarBtn.addEventListener('click', () => {
    ['nascer', 'morrer', 'sacrificar'].forEach(fator => {
      const textarea = document.getElementById(`roda-${fator}`);
      localStorage.setItem(`${prefix}-${fator}`, textarea.value);
    });
    salvarBtn.textContent = '\u2713 Salvo';
    setTimeout(() => { salvarBtn.textContent = 'Salvar'; }, 2000);
  });

  const streakEl = document.getElementById('roda-streak');
  if (streakEl) {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dia = new Date(d);
      dia.setDate(dia.getDate() - i);
      const chave = `roda-${dia.toISOString().split('T')[0]}-nascer`;
      if (localStorage.getItem(chave)) streak++;
      else break;
    }
    streakEl.textContent = `${streak} dias seguidos`;
  }
}

document.addEventListener('DOMContentLoaded', initRodaAvaliacao);

/* ========== TIMER ========== */
let timerInterval = null;
let timerSegundos = 0;
let timerRodando = false;
let timerSelecionado = 300;

const timerDisplay = document.getElementById('timer-display');
const timerSeletores = document.querySelectorAll('.timer-select');
const timerStart = document.getElementById('timer-start');
const timerReset = document.getElementById('timer-reset');
const timerFrase = document.getElementById('timer-frase');

const timerFrases = [
  'Respira. Observa. Apenas sê.',
  'O silêncio é a morada da verdade.',
  'Cada pensamento é uma escolha. Escolhe com consciência.',
  'O corpo respira sozinho. A alma observa.',
  'Não faças. Apenas presencia.',
  'O agora é a única porta para o eterno.',
  'Deixa os pensamentos passarem como nuvens.',
  'Observa sem julgar. Apenas vê.',
  'O centro está em ti. Quieto. Presente.',
  'Entre uma respiração e outra, habita o infinito.',
  'Tudo o que buscas já está em ti.',
  'A paz não se encontra — reconhece-se.',
];

function atualizarTimerDisplay() {
  const m = Math.floor(timerSegundos / 60);
  const s = timerSegundos % 60;
  timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function timerParar() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRodando = false;
  timerStart.textContent = 'Iniciar';
}

function timerIniciar() {
  if (timerRodando) { timerParar(); return; }
  if (timerSegundos <= 0) { timerSegundos = timerSelecionado; atualizarTimerDisplay(); }
  timerRodando = true;
  timerStart.textContent = 'Pausar';
  timerInterval = setInterval(() => {
    timerSegundos--;
    atualizarTimerDisplay();
    if (timerSegundos <= 0) {
      timerParar();
      timerDisplay.textContent = '00:00';
      const f = timerFrases[Math.floor(Math.random() * timerFrases.length)];
      timerFrase.textContent = `\u2728 ${f}`;
      setTimeout(() => { timerFrase.textContent = ''; }, 5000);
    }
  }, 1000);
}

if (timerStart) timerStart.addEventListener('click', timerIniciar);
if (timerReset) timerReset.addEventListener('click', () => {
  timerParar();
  timerSegundos = timerSelecionado;
  atualizarTimerDisplay();
  timerFrase.textContent = '';
});

timerSeletores.forEach(btn => {
  btn.addEventListener('click', () => {
    timerSeletores.forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    const valor = parseInt(btn.dataset.minutos, 10);
    if (valor) {
      timerSelecionado = valor * 60;
      if (!timerRodando) { timerSegundos = timerSelecionado; atualizarTimerDisplay(); }
    }
  });
});

/* ========== 3 FATORES (existing) ========== */
const fatoresData = [
  { titulo: 'Nascer', simbolo: '\u2655', descricao: 'Criar qualidades superiores no ser. A autoconstrução interior.', itens: ['Cultivar a atenção plena no momento presente', 'Desenvolver a compaixão ativa pelo próximo', 'Nutrir pensamentos de paz e amor universal', 'Praticar a gratidão diariamente', 'Criar novos hábitos alinhados com a essência'] },
  { titulo: 'Morrer', simbolo: '\u265C', descricao: 'Eliminar os defeitos psicológicos — a morte iniciática do ego.', itens: ['Observar e dissolver o orgulho e a vaidade', 'Transformar a ira em compreensão serena', 'Libertar-se do apego e do medo da perda', 'Eliminar os pensamentos de autossabotagem', 'Desidentificar-se da personalidade adquirida'] },
  { titulo: 'Sacrificar', simbolo: '\u265F', descricao: 'Entregar-se ao bem maior — a alma que se dá ao mundo.', itens: ['Servir sem esperar reconhecimento', 'Doar tempo e energia a quem precisa', 'Agir com generosidade e desapego', 'Colocar o bem comum acima do pessoal', 'Viver a fraternidade universal em atos'] },
];

document.querySelectorAll('.fator-card').forEach((card, i) => {
  const data = fatoresData[i];
  if (!data) return;
  const detalhe = card.querySelector('.fator-detalhe');
  detalhe.innerHTML = `<p>${data.descricao}</p><ul style="list-style:none;padding:0;margin-top:0.8rem;">${data.itens.map(item => `<li style="padding:0.3rem 0;padding-left:1rem;border-left:2px solid color-mix(in srgb, var(--accent) 30%, transparent);margin-bottom:0.2rem;font-size:0.85rem;">${item}</li>`).join('')}</ul>`;
  card.addEventListener('click', e => { e.stopPropagation(); card.classList.toggle('ativo'); });
});

/* ========== CONEXÕES ========== */
const conexoesData = [
  { conceito: 'O Uno / Deus Primordial', explicacao: 'Em todas as tradições encontra-se a noção de uma Realidade Última, fonte inefável de toda existência. Cada cultura deu-lhe um nome, mas a essência é a mesma: o Absoluto que transcende toda definição.' },
  { conceito: 'Morte e Renascimento', explicacao: 'O ciclo de morte e renascimento é universal. Da ressurreição de Osíris ao samsara budista, da tauroctonia mitraica ao Cristo que morre e ressuscita — a mensagem é que a transformação exige deixar morrer o velho para que o novo nasça.' },
  { conceito: 'O Caminho do Meio', explicacao: 'Nem excesso nem falta — o equilíbrio é a via da sabedoria.' },
  { conceito: 'O Conhecimento Interior', explicacao: 'Gnosis, Nous, Prajna, Shen — o conhecimento que liberta não vem de fora, mas do despertar da consciência interior.' },
  { conceito: 'A Lei de Causa e Efeito', explicacao: 'Karma no Oriente, Causa e Efeito no Hermetismo, semeadura no Cristianismo. Toda ação gera uma reação. Esta lei universal ensina responsabilidade e consciência das escolhas.' },
  { conceito: 'O Amor como Força Cósmica', explicacao: 'Ágape no Cristianismo, Metta no Budismo, Eros divino no Neoplatonismo, Bhakti no Hinduísmo. O amor é a força que une o indivíduo ao todo.' },
  { conceito: 'Símbolos Universais', explicacao: 'A serpente, a árvore, o círculo, a cruz, a luz — símbolos que atravessam culturas e épocas. O símbolo é a linguagem da alma.' },
];

document.querySelectorAll('.conexao-item').forEach((item, i) => {
  const data = conexoesData[i];
  if (!data) return;
  const md = item.querySelector('.mapa-detalhe');
  if (md) md.textContent = data.explicacao;
  item.addEventListener('click', e => { if (e.target.tagName !== 'SPAN') item.classList.toggle('ativo'); });
  item.querySelectorAll('.tradicoes span').forEach(span => {
    span.addEventListener('click', e => {
      e.stopPropagation();
      span.style.background = getCSS('--cor-ouro') || '#c9a227';
      span.style.color = '#000';
      setTimeout(() => { span.style.background = ''; span.style.color = ''; }, 600);
    });
  });
});
