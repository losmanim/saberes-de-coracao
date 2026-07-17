import { describe, it, expect } from 'vitest';

describe('API — Health', () => {
  it('deve responder health check', async () => {
    const res = await fetch('http://localhost:3000/api/health');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.versao).toBe('4.0.0');
  });
});

describe('API — Categorias', () => {
  it('deve listar categorias', async () => {
    const res = await fetch('http://localhost:3000/api/categorias');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('API — Login /auth', () => {
  it('deve rejeitar senha incorreta', async () => {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: 'senha_errada' }),
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.erro).toBeDefined();
  });

  it('deve rejeitar acesso sem token', async () => {
    const res = await fetch('http://localhost:3000/api/verificar');
    expect(res.status).toBe(401);
  });
});

describe('API — Saberes', () => {
  it('deve listar saberes (paginado)', async () => {
    const res = await fetch('http://localhost:3000/api/saberes?page=1&limit=5');
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(5);
    expect(data.data.length).toBeLessThanOrEqual(5);
  });

  it('cada saber deve ter campos obrigatorios', async () => {
    const res = await fetch('http://localhost:3000/api/dados?lite=true');
    const data = await res.json();
    for (const s of data.saberes) {
      expect(s.id).toBeDefined();
      expect(s.titulo).toBeDefined();
      expect(s.descricao).toBeDefined();
      expect(s.categoria_id).toBeDefined();
      expect(s.nivel).toBeDefined();
    }
  });
});
