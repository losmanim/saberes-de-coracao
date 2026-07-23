import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';
const shouldRun = process.env.TEST_INTEGRATION === 'true';

function itIf(condition) {
  return condition ? it : it.skip;
}

const itIntegration = itIf(shouldRun);

describe('API — Health', () => {
  itIntegration('deve responder health check', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.versao).toBe('4.0.0');
  });
});

describe('API — Categorias', () => {
  itIntegration('deve listar categorias', async () => {
    const res = await fetch(`${BASE_URL}/api/categorias`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

describe('API — Login /auth', () => {
  itIntegration('deve rejeitar senha incorreta', async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: 'senha_errada' }),
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.erro).toBeDefined();
  });

  itIntegration('deve rejeitar acesso sem token', async () => {
    const res = await fetch(`${BASE_URL}/api/verificar`);
    expect(res.status).toBe(401);
  });
});

describe('API — Saberes', () => {
  itIntegration('deve listar saberes (paginado)', async () => {
    const res = await fetch(`${BASE_URL}/api/saberes?page=1&limit=5`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.pagination).toBeDefined();
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(5);
    expect(data.data.length).toBeLessThanOrEqual(5);
  });

  itIntegration('cada saber deve ter campos obrigatorios', async () => {
    const res = await fetch(`${BASE_URL}/api/dados?lite=true`);
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
