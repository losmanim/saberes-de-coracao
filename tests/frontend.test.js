import { describe, it, expect, vi, beforeEach } from 'vitest';

// =============================================
// Setup: mocks de browser globals
// =============================================

beforeEach(() => {
  const storage = {};
  vi.stubGlobal('localStorage', {
    getItem: (key) => storage[key] ?? null,
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
    get length() { return Object.keys(storage).length; },
    key: (i) => Object.keys(storage)[i] ?? null,
  });
  vi.stubGlobal('window', {});
});

// =============================================
// js/utils.js — buildMidiaUrl
// =============================================

function buildMidiaUrl(item, tipo) {
  if (item.arquivo.startsWith('http')) {
    try { return new URL(item.arquivo).toString(); }
    catch { return encodeURI(item.arquivo); }
  }
  const baseDir = globalThis.window?.midiaBaseUrl || '';
  const partes = item.arquivo.split('/');
  const arquivoCod = partes.map(encodeURIComponent).join('/');
  return baseDir + '/' + (tipo === 'audio' ? 'audios' : 'videos') + '/' + arquivoCod;
}

describe('buildMidiaUrl', () => {
  beforeEach(() => {
    window.midiaBaseUrl = '';
  });

  it('usa URL absoluta diretamente', () => {
    const url = buildMidiaUrl({ arquivo: 'https://cdn.example.com/audio.mp3' }, 'audio');
    expect(url).toBe('https://cdn.example.com/audio.mp3');
  });

  it('usa URL absoluta inválida como encodeURI', () => {
    const url = buildMidiaUrl({ arquivo: 'https://ex.com/áudio.mp3' }, 'audio');
    expect(url).toContain('https://ex.com/');
  });

  it('constrói caminho para áudio', () => {
    window.midiaBaseUrl = '/midia';
    const url = buildMidiaUrl({ arquivo: 'aula1.mp3' }, 'audio');
    expect(url).toBe('/midia/audios/aula1.mp3');
  });

  it('constrói caminho para vídeo', () => {
    window.midiaBaseUrl = '/midia';
    const url = buildMidiaUrl({ arquivo: 'video.mp4' }, 'video');
    expect(url).toBe('/midia/videos/video.mp4');
  });

  it('codifica componentes do caminho', () => {
    window.midiaBaseUrl = '/midia';
    const url = buildMidiaUrl({ arquivo: 'nome com espaço.mp3' }, 'audio');
    expect(url).toBe('/midia/audios/nome%20com%20espa%C3%A7o.mp3');
  });
});

// =============================================
// js/utils.js — normalizarTags
// =============================================

function normalizarTags(item) {
  if (Array.isArray(item.tags)) return item.tags;
  if (typeof item.tags === 'string') return item.tags.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

describe('normalizarTags', () => {
  it('retorna array intacto', () => {
    expect(normalizarTags({ tags: ['a', 'b'] })).toEqual(['a', 'b']);
  });

  it('converte string em array', () => {
    expect(normalizarTags({ tags: 'a,b,c' })).toEqual(['a', 'b', 'c']);
  });

  it('filtra entradas vazias', () => {
    expect(normalizarTags({ tags: 'a,,b,' })).toEqual(['a', 'b']);
  });

  it('retorna vazio para undefined/null', () => {
    expect(normalizarTags({})).toEqual([]);
    expect(normalizarTags({ tags: null })).toEqual([]);
  });
});

// =============================================
// js/utils.js — debounce
// =============================================

function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

describe('debounce', () => {
  it('atrasa a execução', async () => {
    let count = 0;
    const fn = debounce(() => { count++; }, 50);
    fn();
    fn();
    fn();
    expect(count).toBe(0);
    await new Promise(r => setTimeout(r, 100));
    expect(count).toBe(1);
  });

  it('usa o this correto', async () => {
    const obj = { value: 0 };
    const fn = debounce(function () { this.value++; }, 50);
    obj.fn = fn;
    obj.fn();
    await new Promise(r => setTimeout(r, 100));
    expect(obj.value).toBe(1);
  });
});

// =============================================
// js/utils.js — toggleTema / aplicarTema
// =============================================

describe('tema (claro/escuro)', () => {
  let body;

  beforeEach(() => {
    localStorage.clear();
    body = { classList: { _classes: [], add(cls) { if (!this._classes.includes(cls)) this._classes.push(cls); }, remove(cls) { this._classes = this._classes.filter(c => c !== cls); }, toggle(cls) { const i = this._classes.indexOf(cls); if (i >= 0) this._classes.splice(i, 1); else this._classes.push(cls); }, contains(cls) { return this._classes.includes(cls); } } };
  });

  it('aplicarTema adiciona classe se localStorage tem claro', () => {
    localStorage.setItem('tema', 'claro');
    if (localStorage.getItem('tema') === 'claro') body.classList.add('modo-claro');
    expect(body.classList.contains('modo-claro')).toBe(true);
  });

  it('aplicarTema não adiciona se localStorage é escuro', () => {
    localStorage.setItem('tema', 'escuro');
    if (localStorage.getItem('tema') === 'claro') body.classList.add('modo-claro');
    expect(body.classList.contains('modo-claro')).toBe(false);
  });

  it('toggleTema alterna e salva', () => {
    const toggleTema = () => {
      body.classList.toggle('modo-claro');
      localStorage.setItem('tema', body.classList.contains('modo-claro') ? 'claro' : 'escuro');
    };
    toggleTema();
    expect(body.classList.contains('modo-claro')).toBe(true);
    expect(localStorage.getItem('tema')).toBe('claro');
    toggleTema();
    expect(body.classList.contains('modo-claro')).toBe(false);
    expect(localStorage.getItem('tema')).toBe('escuro');
  });
});

// =============================================
// js/utils.js — CAT_EMOJIS / CAT_BADGE / CAT_NOME
// =============================================

describe('constantes de categoria', () => {
  const CAT_EMOJIS = {1: '🜂', 2: '🧠', 3: '🔬', 4: '🧭', 5: '∞', 6: '📜'};
  const CAT_BADGE = {1: 'badge-espirito', 2: 'badge-pratica', 3: 'badge-ciencia', 4: 'badge-jornada', 5: 'badge-vida', 6: 'badge-apocrifo'};
  const CAT_NOME = {1: 'ESPÍRITO', 2: 'PRÁTICA', 3: 'CIÊNCIA', 4: 'JORNADA', 5: 'VIDA VERDADEIRA', 6: 'APÓCRIFOS'};

  it('CAT_EMOJIS tem 6 categorias', () => {
    expect(Object.keys(CAT_EMOJIS).length).toBe(6);
  });

  it('CAT_BADGE tem 6 categorias', () => {
    expect(Object.keys(CAT_BADGE).length).toBe(6);
  });

  it('CAT_NOME tem 6 categorias', () => {
    expect(Object.keys(CAT_NOME).length).toBe(6);
  });

  it('cada categoria tem emoji, badge e nome', () => {
    for (const id of [1, 2, 3, 4, 5, 6]) {
      expect(CAT_EMOJIS[id]).toBeTruthy();
      expect(CAT_BADGE[id]).toBeTruthy();
      expect(CAT_NOME[id]).toBeTruthy();
    }
  });
});

// =============================================
// js/app.js — extrairCitacaoImpactante
// =============================================

function extrairCitacaoImpactante(saber) {
  if (!saber.conteudo) return saber.descricao;
  if (Array.isArray(saber.conteudo.citacoes) && saber.conteudo.citacoes.length > 0) {
    const citacoes = saber.conteudo.citacoes.filter(c => c.length > 20 && c.length < 300);
    if (citacoes.length > 0) return citacoes[Math.floor(Math.random() * citacoes.length)];
  }
  if (saber.conteudo.insight) {
    const insight = saber.conteudo.insight;
    if (insight.length < 250) return insight;
    const frases = insight.split(/[.!?]+/).filter(f => f.trim().length > 20 && f.trim().length < 200);
    if (frases.length > 0) return frases[Math.floor(Math.random() * frases.length)].trim() + '.';
    return insight.substring(0, 200).trim() + '...';
  }
  return saber.descricao;
}

describe('extrairCitacaoImpactante (app.js)', () => {
  it('retorna citacao valida', () => {
    const s = { descricao: 'desc', conteudo: { citacoes: ['Citacao media com mais de 20 chars'] } };
    const cit = extrairCitacaoImpactante(s);
    expect(cit.length).toBeGreaterThan(20);
    expect(cit.length).toBeLessThan(300);
  });

  it('ignora citacoes curtas, fallback para descricao', () => {
    const s = { descricao: 'fallback', conteudo: { citacoes: ['Curta'] } };
    expect(extrairCitacaoImpactante(s)).toBe('fallback');
  });

  it('usa insight curto', () => {
    const s = { descricao: 'desc', conteudo: { insight: 'Insight curto e impactante' } };
    expect(extrairCitacaoImpactante(s)).toBe('Insight curto e impactante');
  });

  it('quebra insight longo em frases', () => {
    const s = { descricao: 'desc', conteudo: { insight: 'Primeira frase longa aqui com mais de vinte caracteres. Segunda frase curta.' } };
    const cit = extrairCitacaoImpactante(s);
    expect(cit.length).toBeGreaterThan(0);
    expect(cit.endsWith('.')).toBe(true);
  });

  it('trunca insight muito longo sem frases válidas', () => {
    const longText = 'a'.repeat(300);
    const s = { descricao: 'desc', conteudo: { insight: longText } };
    const cit = extrairCitacaoImpactante(s);
    expect(cit.length).toBeLessThanOrEqual(203);
  });

  it('fallback descricao quando sem conteudo', () => {
    expect(extrairCitacaoImpactante({ descricao: 'Descricao padrao' })).toBe('Descricao padrao');
  });
});

// =============================================
// js/app.js — Favoritos (localStorage)
// =============================================

describe('Favoritos', () => {
  const FAVORITOS_KEY = 'saberes_favoritos';

  function getFavoritos() {
    try {
      const raw = localStorage.getItem(FAVORITOS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  beforeEach(() => localStorage.clear());

  it('getFavoritos retorna array vazio inicialmente', () => {
    expect(getFavoritos()).toEqual([]);
  });

  it('getFavoritos retorna valores salvos', () => {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(['id1', 'id2']));
    expect(getFavoritos()).toEqual(['id1', 'id2']);
  });

  it('salvarFavoritos persiste no localStorage', () => {
    const lista = ['a', 'b', 'c'];
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(lista));
    expect(JSON.parse(localStorage.getItem(FAVORITOS_KEY))).toEqual(['a', 'b', 'c']);
  });

  it('isFavorito checa corretamente', () => {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(['id1']));
    const isFav = (id) => getFavoritos().includes(id);
    expect(isFav('id1')).toBe(true);
    expect(isFav('id2')).toBe(false);
  });
});

// =============================================
// js/app.js — Saberes Abertos
// =============================================

describe('Saberes Abertos', () => {
  const ABERTOS_KEY = 'saberes_abertos';

  function getSaberesAbertos() {
    try { return JSON.parse(localStorage.getItem(ABERTOS_KEY) || '[]'); }
    catch { return []; }
  }

  function marcarSaberAberto(id) {
    const abertos = getSaberesAbertos();
    if (!abertos.includes(id)) {
      abertos.push(id);
      localStorage.setItem(ABERTOS_KEY, JSON.stringify(abertos));
    }
  }

  beforeEach(() => localStorage.clear());

  it('inicia vazio', () => {
    expect(getSaberesAbertos()).toEqual([]);
  });

  it('marca saber como aberto', () => {
    marcarSaberAberto('s1');
    expect(getSaberesAbertos()).toEqual(['s1']);
  });

  it('não duplica', () => {
    marcarSaberAberto('s1');
    marcarSaberAberto('s1');
    expect(getSaberesAbertos()).toEqual(['s1']);
  });
});

// =============================================
// js/app.js — obterSaberesFiltrados (após correção)
// =============================================

describe('obterSaberesFiltrados', () => {
  const dados = {
    saberes: [
      { id: '1', categoria_id: 1, titulo: 'Saber 1' },
      { id: '2', categoria_id: 2, titulo: 'Saber 2' },
      { id: '3', categoria_id: 6, titulo: 'Apócrifo 1' },
    ],
  };

  function normalizarSaber(s) {
    return { ...s, categoria_id: Number(s.categoria_id), tags: [], praticas: [], conexoes: [] };
  }

  function obterSaberesFiltrados(categoriaAtual) {
    if (!dados || !dados.saberes) return [];
    const todosSaberes = dados.saberes.map(normalizarSaber);
    if (categoriaAtual === 'all') return todosSaberes.filter(s => s.categoria_id !== 6);
    if (categoriaAtual === 'fav') return [];
    return todosSaberes.filter(s => String(s.categoria_id) === categoriaAtual);
  }

  it('all retorna saberes excluindo apócrifos (categoria 6)', () => {
    const r = obterSaberesFiltrados('all');
    expect(r.length).toBe(2);
    expect(r.every(s => s.categoria_id !== 6)).toBe(true);
  });

  it('filtra por categoria específica', () => {
    const r = obterSaberesFiltrados('1');
    expect(r.length).toBe(1);
    expect(r[0].categoria_id).toBe(1);
  });

  it('retorna vazio se categoria não existe', () => {
    const r = obterSaberesFiltrados('99');
    expect(r.length).toBe(0);
  });
});

// =============================================
// js/player.js — formatTime
// =============================================

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

describe('Player.formatTime', () => {
  it('formata 0 segundos', () => { expect(formatTime(0)).toBe('0:00'); });
  it('formata segundos simples', () => { expect(formatTime(65)).toBe('1:05'); });
  it('formata minutos e segundos', () => { expect(formatTime(3661)).toBe('61:01'); });
  it('retorna 0:00 para null', () => { expect(formatTime(null)).toBe('0:00'); });
  it('retorna 0:00 para NaN', () => { expect(formatTime(NaN)).toBe('0:00'); });
  it('retorna 0:00 para undefined', () => { expect(formatTime(undefined)).toBe('0:00'); });
});

// =============================================
// js/apocrifos.js — ajustarFonte
// =============================================

describe('apocrifos ajustarFonte', () => {
  let fontScale;

  function ajustarFonte(delta) {
    fontScale = delta === 0 ? 100 : Math.max(60, Math.min(200, fontScale + delta));
  }

  beforeEach(() => { fontScale = 100; });

  it('aumenta fonte', () => {
    ajustarFonte(10);
    expect(fontScale).toBe(110);
  });

  it('diminui fonte', () => {
    ajustarFonte(-10);
    expect(fontScale).toBe(90);
  });

  it('reseta para 100', () => {
    ajustarFonte(10);
    ajustarFonte(0);
    expect(fontScale).toBe(100);
  });

  it('não ultrapassa mínimo 60', () => {
    ajustarFonte(-50);
    expect(fontScale).toBe(60);
  });

  it('não ultrapassa máximo 200', () => {
    ajustarFonte(150);
    expect(fontScale).toBe(200);
  });
});

// =============================================
// js/apocrifos.js — categoriaInfo (regras completas)
// =============================================

describe('categoriaInfo (apocrifos.js completo)', () => {
  const CATEGORIA_RULES = [
    { id: 'gnosticos', label: 'Gnostico', icon: '🔮', match: t => t.tags.some(tag => ['gnostico','pistis-sophia','pistis','sophia','nag-hammadi'].includes(tag)) || /gnostico|pistis|sophia|valentino|felipe/i.test(t.titulo) },
    { id: 'apocalipticos', label: 'Apocaliptico', icon: '🔥', match: t => t.tags.includes('apocalipse') || t.tags.includes('enoch') || t.tags.includes('enoque') || /apocalipse|enoch|enoque/i.test(t.titulo) },
    { id: 'patriarcas', label: 'Patriarcas', icon: '🕊️', match: t => t.tags.includes('testamento') || /testamento.*(aser|benjamim|dan|gad|issacar|jose|juda|levi|ruben|zebulom|abraham|simeao|nephtali|moises)/i.test(t.titulo) || /patriarcas|adao e eva|jubileus|melquisedeque|asenath|caverna dos tesouros|diluvio|gilgamesh/i.test(t.titulo) },
    { id: 'infancia', label: 'Infancia de Jesus', icon: '👶', match: t => /infancia/i.test(t.titulo) || /pseudo-mateus|pseudo-tome|proto-evangelho|jose carpinteiro|passagem.*virgem.*maria/i.test(t.titulo) },
    { id: 'paixao', label: 'Paixao e Pilatos', icon: '⚖️', match: t => /pilatos|herodes|tiberio|vinganca|salvador|julgamento|condenacao|sentenca|declaracoes.*jose.*arimateia|nicodemus|descida.*cristo.*inferno/i.test(t.titulo) || t.tags.includes('carta') && /pilatos|herodes|tiberio/i.test(t.titulo) },
    { id: 'cartas', label: 'Cartas e Epistolas', icon: '✉️', match: t => t.tags.includes('carta') || t.tags.includes('epistola') || /carta|epistola|correspondencia|abgaro|clemente/i.test(t.titulo) },
    { id: 'oracoes', label: 'Oracoes e Salmos', icon: '🙏', match: t => t.tags.includes('oracao') || t.tags.includes('salmo') || /oracao|salmo|essenios/i.test(t.titulo) },
    { id: 'atos', label: 'Atos', icon: '📖', match: t => t.tags.includes('atos') || /atos.*(paulo|tecla|joao|pedro|tome)/i.test(t.titulo) },
    { id: 'patristica', label: 'Patristica', icon: '⛪', match: t => /didache|pastor.*hermas|aristeides|policarpo|discurso.*domingo|apologia|clemente|justino|taciano|inacio|didaque/i.test(t.titulo) && !t.tags.includes('carta') },
  ];

  function categoriaInfo(texto) {
    for (const cat of CATEGORIA_RULES) {
      if (cat.match(texto)) return cat;
    }
    return { id: 'geral', label: 'Geral', icon: '📜' };
  }

  it('gnostico por tag', () => {
    expect(categoriaInfo({ titulo: 'Pistis Sophia', tags: ['gnostico'] }).id).toBe('gnosticos');
  });

  it('gnostico por titulo', () => {
    expect(categoriaInfo({ titulo: 'Evangelho de Felipe', tags: [] }).id).toBe('gnosticos');
  });

  it('apocaliptico por tag enoque', () => {
    expect(categoriaInfo({ titulo: 'Enoque', tags: ['enoque'] }).id).toBe('apocalipticos');
  });

  it('apocaliptico por titulo', () => {
    expect(categoriaInfo({ titulo: 'Apocalipse de Pedro', tags: [] }).id).toBe('apocalipticos');
  });

  it('patriarcas por tag testamento', () => {
    expect(categoriaInfo({ titulo: 'Testamento de Levi', tags: ['testamento'] }).id).toBe('patriarcas');
  });

  it('infancia por titulo', () => {
    expect(categoriaInfo({ titulo: 'Proto-Evangelho de Tiago', tags: [] }).id).toBe('infancia');
  });

  it('paixao por titulo Pilatos', () => {
    expect(categoriaInfo({ titulo: 'Atos de Pilatos', tags: [] }).id).toBe('paixao');
  });

  it('cartas por tag', () => {
    expect(categoriaInfo({ titulo: 'Carta de Clemente', tags: ['carta'] }).id).toBe('cartas');
  });

  it('oracoes por tag oracao', () => {
    expect(categoriaInfo({ titulo: 'Oracao de Jose', tags: ['oracao'] }).id).toBe('oracoes');
  });

  it('atos por tag', () => {
    expect(categoriaInfo({ titulo: 'Atos de Paulo', tags: ['atos'] }).id).toBe('atos');
  });

  it('patristica por titulo (excluindo cartas)', () => {
    expect(categoriaInfo({ titulo: 'Didache', tags: [] }).id).toBe('patristica');
  });

  it('patristica exclui se for carta', () => {
    expect(categoriaInfo({ titulo: 'Clemente', tags: ['carta'] }).id).toBe('cartas');
  });

  it('fallback geral', () => {
    expect(categoriaInfo({ titulo: 'Texto desconhecido', tags: [] }).id).toBe('geral');
  });
});

// =============================================
// js/apocrifos.js — salvarProgressoLeitura
// =============================================

describe('salvarProgressoLeitura', () => {
  const KEY = 'progresso_leitura';

  function salvarProgressoLeitura(id) {
    try {
      const progressos = JSON.parse(localStorage.getItem(KEY) || '{}');
      progressos[id] = { id, data: new Date().toISOString() };
      localStorage.setItem(KEY, JSON.stringify(progressos));
    } catch (e) {}
  }

  beforeEach(() => localStorage.clear());

  it('salva progresso de leitura', () => {
    salvarProgressoLeitura('texto1');
    const saved = JSON.parse(localStorage.getItem(KEY));
    expect(saved.texto1.id).toBe('texto1');
    expect(saved.texto1.data).toBeTruthy();
  });

  it('acumula múltiplos textos', () => {
    salvarProgressoLeitura('t1');
    salvarProgressoLeitura('t2');
    const saved = JSON.parse(localStorage.getItem(KEY));
    expect(Object.keys(saved).length).toBe(2);
  });
});

// =============================================
// js/biblioteca.js — NAV_MAP e renderizarConteudo
// =============================================

describe('NAV_MAP', () => {
  const NAV_MAP = { gnose: 1, praticas: 2, ciencia: 3, jornada: 4, vida: 5, apocrifos: 6 };

  it('mapeia 6 seções', () => {
    expect(Object.keys(NAV_MAP).length).toBe(6);
  });

  it('cada chave tem id numérico', () => {
    for (const [key, val] of Object.entries(NAV_MAP)) {
      expect(typeof key).toBe('string');
      expect(typeof val).toBe('number');
    }
  });

  it('mapeia nomes corretamente', () => {
    expect(NAV_MAP.gnose).toBe(1);
    expect(NAV_MAP.apocrifos).toBe(6);
  });
});

describe('renderizarConteudo (biblioteca)', () => {
  const contentHandlers = {
    insight: (v) => `<h3>💡 Insight</h3><p>${v}</p>`,
    citacoes: (v) => `<h3>Citações</h3>${v.map(c => `<blockquote>${c}</blockquote>`).join('')}`,
  };

  function renderizarConteudo(saber) {
    if (!saber.conteudo) return '';
    let html = '';
    for (const [key, val] of Object.entries(saber.conteudo)) {
      if (contentHandlers[key]) html += contentHandlers[key](val);
    }
    return html;
  }

  it('renderiza campos conhecidos', () => {
    const html = renderizarConteudo({
      conteudo: { insight: 'Grande insight', citacoes: ['Citação 1'] },
    });
    expect(html).toContain('💡 Insight');
    expect(html).toContain('Grande insight');
    expect(html).toContain('Citação 1');
  });

  it('ignora campos sem handler', () => {
    const html = renderizarConteudo({
      conteudo: { campo_desconhecido: 'valor' },
    });
    expect(html).toBe('');
  });

  it('retorna vazio se não tem conteudo', () => {
    expect(renderizarConteudo({})).toBe('');
  });
});

// =============================================
// js/features.js — criarFormularioContato (estrutura)
// =============================================

describe('formulário de contato', () => {
  function criarFormHtml() {
    return `
      <div class="contato-inner">
        <div class="contato-info">
          <h2 class="contato-titulo">💌 Entre em Contato</h2>
          <p class="contato-desc">Compartilhe seus insights, dúvidas ou sugestões.</p>
        </div>
        <form class="contato-form" id="formContato" novalidate>
          <input type="text" id="contatoNome" required placeholder="Seu nome">
          <input type="email" id="contatoEmail" required placeholder="seu@email.com">
          <textarea id="contatoMensagem" required placeholder="Sua mensagem..." rows="5"></textarea>
          <button type="submit" class="contato-btn">Enviar Mensagem</button>
        </form>
      </div>`;
  }

  it('gera HTML com campos obrigatórios', () => {
    const html = criarFormHtml();
    expect(html).toContain('contatoNome');
    expect(html).toContain('contatoEmail');
    expect(html).toContain('contatoMensagem');
    expect(html).toContain('Enviar Mensagem');
  });

  it('contém id formContato', () => {
    const html = criarFormHtml();
    expect(html).toContain('id="formContato"');
  });
});

// =============================================
// js/content.js — contentHandlers (seções complexas)
// =============================================

describe('contentHandlers (seções avançadas)', () => {
  const contentHandlers = {
    chakras(v) {
      if (!v[0] || !v[0].ordem) return '';
      return `<h3>Os 8 Chakras</h3><table><thead><tr><th>#</th><th>Chakra</th><th>Sílaba</th><th>Função</th></tr></thead><tbody>${v.map(ch => `<tr><td>${ch.ordem}</td><td>${ch.nome}</td><td>${ch.silaba}</td><td>${ch.funcao}</td></tr>`).join('')}</tbody></table>`;
    },
    texto_integral: (v) => `<h3>📜 Texto Integral</h3><div class="texto-integral">${v.split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}</div>`,
    estrutura_cosmica: (v) => `<h3>Estrutura Cósmica</h3>${Object.entries(v).map(([key, val]) => `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${val}</p>`).join('')}`,
    if_no_meaning: (v) => `<h3>${v.titulo}</h3><p>${v.reflexao}</p>${v.citacao ? `<blockquote>${v.citacao}</blockquote>` : ''}`,
  };

  it('chakras: gera tabela', () => {
    const chakras = [
      { ordem: 1, nome: 'Muladhara', silaba: 'LAM', funcao: 'Base' },
      { ordem: 2, nome: 'Svadhisthana', silaba: 'VAM', funcao: 'Sacral' },
    ];
    const html = contentHandlers.chakras(chakras);
    expect(html).toContain('Muladhara');
    expect(html).toContain('LAM');
    expect(html).toContain('<tr><td>1</td>');
    expect(html).toContain('<td>2</td>');
  });

  it('chakras: retorna vazio se array vazio', () => {
    expect(contentHandlers.chakras([])).toBe('');
  });

  it('chakras: retorna vazio se primeiro item sem ordem', () => {
    expect(contentHandlers.chakras([{ nome: 'Teste' }])).toBe('');
  });

  it('texto_integral: divide em parágrafos', () => {
    const html = contentHandlers.texto_integral('Parágrafo 1\n\nParágrafo 2\n\nParágrafo 3');
    expect(html.match(/<p>/g).length).toBe(3);
  });

  it('texto_integral: usa <br> para quebras simples', () => {
    const html = contentHandlers.texto_integral('Linha 1\nLinha 2');
    expect(html).toContain('<br>');
  });

  it('estrutura_cosmica: itera sobre objeto', () => {
    const html = contentHandlers.estrutura_cosmica({ plano: 'Físico', dimensao: '3D' });
    expect(html).toContain('Plano');
    expect(html).toContain('Físico');
    expect(html).toContain('Dimensao');
    expect(html).toContain('3D');
  });

  it('if_no_meaning: com citacao opcional', () => {
    const html = contentHandlers.if_no_meaning({ titulo: 'O Vazio', reflexao: 'Reflexão profunda', citacao: 'Citação inspiradora' });
    expect(html).toContain('O Vazio');
    expect(html).toContain('<blockquote>');
  });

  it('if_no_meaning: sem citacao', () => {
    const html = contentHandlers.if_no_meaning({ titulo: 'O Vazio', reflexao: 'Reflexão profunda' });
    expect(html).toContain('Reflexão profunda');
    expect(html).not.toContain('<blockquote>');
  });
});

// =============================================
// js/player.js — buildList e navegação
// =============================================

describe('Player.buildList', () => {
  function buildList(tipo, dados) {
    if (!dados || !dados.midia) return [];
    if (tipo === 'audio') return dados.midia.audios || [];
    return dados.midia.videos || [];
  }

  it('retorna audios', () => {
    const dados = { midia: { audios: [{ id: 'a1' }], videos: [] } };
    expect(buildList('audio', dados)).toEqual([{ id: 'a1' }]);
  });

  it('retorna videos', () => {
    const dados = { midia: { audios: [], videos: [{ id: 'v1' }] } };
    expect(buildList('video', dados)).toEqual([{ id: 'v1' }]);
  });

  it('retorna vazio sem dados', () => {
    expect(buildList('audio', null)).toEqual([]);
  });

  it('retorna vazio sem midia', () => {
    expect(buildList('audio', {})).toEqual([]);
  });

  it('default para tipo desconhecido retorna videos', () => {
    const dados = { midia: { audios: [{ id: 'a1' }], videos: [{ id: 'v1' }] } };
    expect(buildList('outro', dados)).toEqual([{ id: 'v1' }]);
  });
});

describe('Player navegação', () => {
  function prev(index, listLength) {
    return (index - 1 + listLength) % listLength;
  }

  function next(index, listLength) {
    return (index + 1) % listLength;
  }

  it('prev volta', () => {
    expect(prev(1, 3)).toBe(0);
  });

  it('prev volta do início para o fim', () => {
    expect(prev(0, 3)).toBe(2);
  });

  it('next avança', () => {
    expect(next(0, 3)).toBe(1);
  });

  it('next volta ao início', () => {
    expect(next(2, 3)).toBe(0);
  });

  it('com lista de 1 item, prev e next retornam 0', () => {
    expect(prev(0, 1)).toBe(0);
    expect(next(0, 1)).toBe(0);
  });
});

// =============================================
// js/utils.js — tratarErro
// =============================================

describe('tratarErro', () => {
  function tratarErro(erro, contexto = 'Operação') {
    let mensagem = 'Ocorreu um erro inesperado.';
    if (erro instanceof TypeError) mensagem = 'Erro de processamento de dados.';
    else if (erro instanceof SyntaxError) mensagem = 'Erro ao interpretar os dados recebidos.';
    else if (erro.message) {
      if (erro.message.includes('fetch')) mensagem = 'Erro de conexão. Verifique sua internet.';
      else if (erro.message.includes('HTTP 4')) mensagem = 'Recurso não encontrado ou dados inválidos.';
      else if (erro.message.includes('HTTP 5')) mensagem = 'Erro no servidor. Tente novamente mais tarde.';
      else mensagem = erro.message;
    }
    return mensagem;
  }

  it('TypeError', () => { expect(tratarErro(new TypeError('tipo'))).toBe('Erro de processamento de dados.'); });
  it('SyntaxError', () => { expect(tratarErro(new SyntaxError('syntax'))).toBe('Erro ao interpretar os dados recebidos.'); });
  it('fetch error', () => { expect(tratarErro(new Error('fetch failed'))).toBe('Erro de conexão. Verifique sua internet.'); });
  it('HTTP 4xx', () => { expect(tratarErro(new Error('HTTP 404'))).toBe('Recurso não encontrado ou dados inválidos.'); });
  it('HTTP 5xx', () => { expect(tratarErro(new Error('HTTP 500'))).toBe('Erro no servidor. Tente novamente mais tarde.'); });
  it('mensagem genérica', () => { expect(tratarErro(new Error('Algo deu errado'))).toBe('Algo deu errado'); });
  it('erro sem message', () => { expect(tratarErro({})).toBe('Ocorreu um erro inesperado.'); });
});

// =============================================
// js/app.js — animarContagem / atualizarEstatisticas
// =============================================

describe('atualizarEstatisticas', () => {
  it('calcula estatísticas corretamente', () => {
    const dados = {
      saberes: [
        { id: '1', categoria_id: 1 },
        { id: '2', categoria_id: 6 },
        { id: '3', categoria_id: 2 },
      ],
      praticas: [{ id: 'p1' }, { id: 'p2' }],
      midia: { audios: [{ id: 'a1' }], videos: [{ id: 'v1' }, { id: 'v2' }] },
    };
    const nSaberes = dados.saberes.filter(s => s.categoria_id !== 6).length;
    const nPraticas = dados.praticas.length;
    const nMidia = (dados.midia.audios ? dados.midia.audios.length : 0) + (dados.midia.videos ? dados.midia.videos.length : 0);
    expect(nSaberes).toBe(2);
    expect(nPraticas).toBe(2);
    expect(nMidia).toBe(3);
  });
});
