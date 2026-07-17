import { describe, it, expect } from 'vitest';

// =============================================
// Testes: normalizarSaber (fidelidade ao app.js)
// =============================================

function normalizarSaber(saber) {
  return {
    ...saber,
    categoria_id: Number(saber.categoria_id),
    tags: Array.isArray(saber.tags) ? saber.tags :
      typeof saber.tags === 'string' ? saber.tags.split(',').map(t => t.trim()) : [],
    praticas: Array.isArray(saber.praticas) ? saber.praticas : [],
    conexoes: Array.isArray(saber.conexoes) ? saber.conexoes : [],
  };
}

describe('normalizarSaber', () => {
  it('normaliza categoria_id para numero', () => {
    expect(normalizarSaber({ id: '1', categoria_id: '6' }).categoria_id).toBe(6);
    expect(normalizarSaber({ id: '1', categoria_id: 6 }).categoria_id).toBe(6);
  });
  it('mantem tags array intacto', () => {
    const s = normalizarSaber({ id: '1', tags: ['a', 'b'] });
    expect(s.tags).toEqual(['a', 'b']);
  });

  it('converte tags string em array', () => {
    const s = normalizarSaber({ id: '1', tags: 'a,b,c' });
    expect(s.tags).toEqual(['a', 'b', 'c']);
  });

  it('tags undefined vira array vazio', () => {
    const s = normalizarSaber({ id: '1' });
    expect(s.tags).toEqual([]);
  });

  it('praticas undefined vira array vazio', () => {
    const s = normalizarSaber({ id: '1' });
    expect(s.praticas).toEqual([]);
  });

  it('praticas array intacto', () => {
    const s = normalizarSaber({ id: '1', praticas: [{ titulo: 'P1' }] });
    expect(s.praticas).toEqual([{ titulo: 'P1' }]);
  });

  it('conexoes string normalizada para array vazio (nao quebra)', () => {
    const s = normalizarSaber({ id: '1', conexoes: 'a,b' });
    expect(Array.isArray(s.conexoes)).toBe(true);
    expect(s.conexoes).toEqual([]);
  });

  it('preserva outras propriedades', () => {
    const s = normalizarSaber({ id: '1', titulo: 'Test', nivel: 'iniciante' });
    expect(s.titulo).toBe('Test');
    expect(s.nivel).toBe('iniciante');
  });
});

// =============================================
// Testes: extrairCitacaoImpactante
// =============================================

function extrairCitacaoImpactante(saber) {
  if (!saber.conteudo) return saber.descricao;
  if (Array.isArray(saber.conteudo.citacoes) && saber.conteudo.citacoes.length > 0) {
    const citacoes = saber.conteudo.citacoes.filter(c => c.length > 20 && c.length < 300);
    if (citacoes.length > 0) {
      return citacoes[Math.floor(Math.random() * citacoes.length)];
    }
  }
  if (saber.conteudo.insight) {
    const insight = saber.conteudo.insight;
    if (insight.length < 250) return insight;
  }
  return saber.descricao;
}

describe('extrairCitacaoImpactante', () => {
  it('retorna citacao valida quando disponivel', () => {
    const s = { descricao: 'desc', conteudo: { citacoes: ['Citacao curta', 'Citacao media com mais de 20 caracteres'] } };
    const cit = extrairCitacaoImpactante(s);
    expect(cit.length).toBeGreaterThan(20);
    expect(cit.length).toBeLessThan(300);
  });

  it('ignora citacoes muito curtas', () => {
    const s = { descricao: 'desc fallback', conteudo: { citacoes: ['Curta'] } };
    const cit = extrairCitacaoImpactante(s);
    expect(cit).toBe('desc fallback');
  });

  it('usa insight se nao ha citacoes validas', () => {
    const s = { descricao: 'desc', conteudo: { insight: 'Um insight curto e impactante' } };
    expect(extrairCitacaoImpactante(s)).toBe('Um insight curto e impactante');
  });

  it('fallback para descricao', () => {
    const s = { descricao: 'Descricao padrao' };
    expect(extrairCitacaoImpactante(s)).toBe('Descricao padrao');
  });

  it('citacoes string tratada como nao-array', () => {
    const s = { descricao: 'fallback', conteudo: { citacoes: 'nao sou array' } };
    expect(extrairCitacaoImpactante(s)).toBe('fallback');
  });
});

// =============================================
// Testes: CATEGORIA_RULES (apocrifos)
// =============================================

const CATEGORIA_RULES = [
  { id: 'gnosticos', label: 'Gnostico', match: t => t.tags.some(tag => ['gnostico','pistis-sophia','pistis','sophia','nag-hammadi'].includes(tag)) || /gnostico|pistis|sophia|valentino|felipe/i.test(t.titulo) },
  { id: 'apocalipticos', label: 'Apocaliptico', match: t => t.tags.includes('apocalipse') || t.tags.includes('enoch') || /apocalipse|enoch|enoque/i.test(t.titulo) },
  { id: 'patriarcas', label: 'Patriarcas', match: t => t.tags.includes('testamento') || /testamento.*(levi|jose)/i.test(t.titulo) },
  { id: 'cartas', label: 'Cartas', match: t => t.tags.includes('carta') || /carta|epistola/i.test(t.titulo) },
  { id: 'oracoes', label: 'Oracoes', match: t => t.tags.includes('oracao') || /oracao|salmo/i.test(t.titulo) },
];

function categoriaInfo(texto) {
  for (const cat of CATEGORIA_RULES) {
    if (cat.match(texto)) return cat;
  }
  return { id: 'geral', label: 'Geral' };
}

function prepararTexto(texto) {
  if (typeof texto.tags === 'string') texto.tags = texto.tags.split(',').map(t => t.trim());
  if (!Array.isArray(texto.tags)) texto.tags = [];
  return texto;
}

describe('categoriaInfo (apocrifos)', () => {
  it('identifica gnosticos por tag', () => {
    expect(categoriaInfo(prepararTexto({ titulo: 'Pistis Sophia', tags: ['gnostico'] })).id).toBe('gnosticos');
  });

  it('identifica gnosticos por titulo', () => {
    expect(categoriaInfo(prepararTexto({ titulo: 'Evangelho de Felipe', tags: [] })).id).toBe('gnosticos');
  });

  it('identifica apocalipticos', () => {
    expect(categoriaInfo(prepararTexto({ titulo: 'Apocalipse de Enoque', tags: ['apocalipse'] })).id).toBe('apocalipticos');
  });

  it('identifica cartas', () => {
    expect(categoriaInfo(prepararTexto({ titulo: 'Carta aos Corintios', tags: ['carta'] })).id).toBe('cartas');
  });

  it('fallback para geral', () => {
    expect(categoriaInfo(prepararTexto({ titulo: 'Texto desconhecido', tags: [] })).id).toBe('geral');
  });

  it('tags string normalizada antes da classificacao', () => {
    expect(() => categoriaInfo(prepararTexto({ titulo: 'Test', tags: 'gnostico,teste' }))).not.toThrow();
    expect(categoriaInfo(prepararTexto({ titulo: 'Test', tags: 'gnostico,teste' })).id).toBe('gnosticos');
  });
});

// =============================================
// Testes: contentHandlers — estrutura HTML
// =============================================

const contentHandlers = {
  citacoes: (val) => {
    if (!Array.isArray(val)) return '';
    return val.filter(c => c && c.trim()).map(c =>
      `<blockquote class="citacao">${c.replace(/\n/g, '<br>')}</blockquote>`
    ).join('');
  },

  praticas: (val) => {
    if (!Array.isArray(val)) return '';
    return val.map(p =>
      `<div class="pratica-box"><h4>${p.titulo || ''}</h4><p>${(p.instrucoes || '').replace(/\n/g, '<br>')}</p></div>`
    ).join('');
  },

  insight: (val) => {
    if (!val || typeof val !== 'string') return '';
    return `<div class="insight-box">${val.replace(/\n/g, '<br>')}</div>`;
  },
};

describe('contentHandlers', () => {
  it('citacoes: gera blockquote para strings validas', () => {
    const html = contentHandlers.citacoes(['Citacao 1', 'Citacao 2']);
    expect(html).toContain('<blockquote');
    expect(html).toContain('Citacao 1');
    expect(html).toContain('Citacao 2');
  });

  it('citacoes: retorna vazio se nao for array', () => {
    expect(contentHandlers.citacoes('string')).toBe('');
    expect(contentHandlers.citacoes(null)).toBe('');
  });

  it('praticas: gera estrutura correta', () => {
    const html = contentHandlers.praticas([{ titulo: 'Meditar', instrucoes: 'Sente-se' }]);
    expect(html).toContain('Meditar');
    expect(html).toContain('Sente-se');
    expect(html).toContain('pratica-box');
  });

  it('praticas: retorna vazio se nao for array', () => {
    expect(contentHandlers.praticas(null)).toBe('');
    expect(contentHandlers.praticas({})).toBe('');
  });

  it('insight: gera div w/ texto', () => {
    const html = contentHandlers.insight('Este eh um insight');
    expect(html).toContain('insight-box');
    expect(html).toContain('Este eh um insight');
  });

  it('insight: retorna vazio para nao-string', () => {
    expect(contentHandlers.insight(null)).toBe('');
    expect(contentHandlers.insight(123)).toBe('');
  });
});
