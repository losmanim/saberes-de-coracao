import { describe, it, expect } from 'vitest';
import {
  loginSchema, criacaoSaberSchema, atualizacaoSaberSchema,
  contatoSchema, validar,
} from '../src/schemas.js';

describe('loginSchema', () => {
  it('aceita email + senha', () => {
    const r = loginSchema.safeParse({ email: 'a@b.com', senha: '123' });
    expect(r.success).toBe(true);
  });

  it('aceita apenas senha (email opcional)', () => {
    const r = loginSchema.safeParse({ senha: '123' });
    expect(r.success).toBe(true);
  });

  it('rejeita senha vazia', () => {
    const r = loginSchema.safeParse({ senha: '' });
    expect(r.success).toBe(false);
  });

  it('rejeita email inválido', () => {
    const r = loginSchema.safeParse({ email: 'invalido', senha: '123' });
    expect(r.success).toBe(false);
  });
});

describe('criacaoSaberSchema', () => {
  it('aceita dados mínimos', () => {
    const r = criacaoSaberSchema.safeParse({
      titulo: 'Teste', descricao: 'Descrição',
    });
    expect(r.success).toBe(true);
    expect(r.data.categoria_id).toBe(1);
    expect(r.data.nivel).toBe('iniciante');
    expect(r.data.tags).toEqual([]);
  });

  it('rejeita título vazio', () => {
    const r = criacaoSaberSchema.safeParse({ titulo: '', descricao: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejeita título muito longo', () => {
    const r = criacaoSaberSchema.safeParse({ titulo: 'x'.repeat(201), descricao: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejeita nível inválido', () => {
    const r = criacaoSaberSchema.safeParse({
      titulo: 'x', descricao: 'x', nivel: 'expert',
    });
    expect(r.success).toBe(false);
  });

  it('aceita categoria_id como string numérica', () => {
    const r = criacaoSaberSchema.safeParse({
      titulo: 'x', descricao: 'x', categoria_id: '3',
    });
    expect(r.success).toBe(true);
  });

  it('aceita tags como array', () => {
    const r = criacaoSaberSchema.safeParse({
      titulo: 'x', descricao: 'x', tags: ['tag1', 'tag2'],
    });
    expect(r.success).toBe(true);
  });

  it('aceita conteudo como objeto', () => {
    const r = criacaoSaberSchema.safeParse({
      titulo: 'x', descricao: 'x',
      conteudo: { citacoes: ['c1'], insight: 'i1' },
    });
    expect(r.success).toBe(true);
  });

  it('rejeita tag com mais de 50 caracteres', () => {
    const r = criacaoSaberSchema.safeParse({
      titulo: 'x', descricao: 'x', tags: ['a'.repeat(51)],
    });
    expect(r.success).toBe(false);
  });
});

describe('atualizacaoSaberSchema', () => {
  it('aceita atualização parcial', () => {
    const r = atualizacaoSaberSchema.safeParse({ titulo: 'Novo título' });
    expect(r.success).toBe(true);
  });

  it('aceita body vazio', () => {
    const r = atualizacaoSaberSchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it('rejeita descricao muito longa', () => {
    const r = atualizacaoSaberSchema.safeParse({ descricao: 'x'.repeat(2001) });
    expect(r.success).toBe(false);
  });

  it('rejeita nivel inválido', () => {
    const r = atualizacaoSaberSchema.safeParse({ nivel: 'ultra' });
    expect(r.success).toBe(false);
  });
});

describe('contatoSchema', () => {
  it('aceita dados válidos', () => {
    const r = contatoSchema.safeParse({
      nome: 'João', email: 'joao@email.com', mensagem: 'Olá',
    });
    expect(r.success).toBe(true);
    expect(r.data.assunto).toBe('');
  });

  it('rejeita nome vazio', () => {
    const r = contatoSchema.safeParse({ nome: '', email: 'a@b.com', mensagem: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejeita email inválido', () => {
    const r = contatoSchema.safeParse({ nome: 'João', email: 'invalido', mensagem: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejeita mensagem vazia', () => {
    const r = contatoSchema.safeParse({ nome: 'João', email: 'a@b.com', mensagem: '' });
    expect(r.success).toBe(false);
  });

  it('rejeita mensagem muito longa', () => {
    const r = contatoSchema.safeParse({
      nome: 'João', email: 'a@b.com', mensagem: 'x'.repeat(5001),
    });
    expect(r.success).toBe(false);
  });
});

describe('validar middleware', () => {
  function mockReqRes(body) {
    const req = { body };
    const res = {
      _status: null,
      _json: null,
      status(code) { this._status = code; return this; },
      json(obj) { this._json = obj; },
    };
    return { req, res };
  }

  it('chama next quando dados são válidos', () => {
    const { req, res } = mockReqRes({ senha: '123' });
    let nextCalled = false;
    const middleware = validar(loginSchema);
    middleware(req, res, () => { nextCalled = true; });
    expect(nextCalled).toBe(true);
    expect(req.body.senha).toBe('123');
  });

  it('retorna 400 com detalhes quando inválido', () => {
    const { req, res } = mockReqRes({ senha: '' });
    validar(loginSchema)(req, res, () => {});
    expect(res._status).toBe(400);
    expect(res._json.erro).toBe('Dados inválidos');
    expect(Array.isArray(res._json.detalhes)).toBe(true);
    expect(res._json.detalhes.length).toBeGreaterThan(0);
    expect(res._json.detalhes[0].campo).toBe('senha');
  });
});
