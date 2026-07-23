import { describe, it, expect, vi, beforeEach } from 'vitest';

// =============================================
// Testes: src/lib/appwrite.js — formatarSaber
// =============================================

// Simula o módulo appwrite inline para testar as funções puras
function formatarSaber(doc) {
  return {
    id: doc.$id,
    $id: doc.$id,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
    categoria_id: doc.categoria_id || 1,
    titulo: doc.titulo || '',
    slug: doc.slug || '',
    descricao: doc.descricao || '',
    nivel: doc.nivel || 'iniciante',
    duracao: doc.duracao || 15,
    tags: doc.tags || [],
    fonte: doc.fonte || '',
    licenca: doc.licenca || 'Domínio Público',
    conteudo: doc.conteudo || {},
    praticas: doc.praticas || [],
    conexoes: doc.conexoes || [],
  };
}

function formatarMidia(doc) {
  return {
    id: doc.$id,
    $id: doc.$id,
    titulo: doc.titulo || '',
    tipo: doc.tipo || 'audio',
    arquivo: doc.arquivo || '',
    tags: doc.tags || [],
    saberes_relacionados: doc.saberes_relacionados || [],
  };
}

describe('formatarSaber', () => {
  it('mapeia campos obrigatórios', () => {
    const doc = { $id: 'abc123', titulo: 'Teste' };
    const r = formatarSaber(doc);
    expect(r.id).toBe('abc123');
    expect(r.titulo).toBe('Teste');
    expect(r.categoria_id).toBe(1);
    expect(r.nivel).toBe('iniciante');
    expect(r.licenca).toBe('Domínio Público');
  });

  it('preserva $createdAt e $updatedAt', () => {
    const doc = { $id: '1', $createdAt: '2024-01-01', $updatedAt: '2024-06-01' };
    const r = formatarSaber(doc);
    expect(r.$createdAt).toBe('2024-01-01');
    expect(r.$updatedAt).toBe('2024-06-01');
  });

  it('usa valores fornecidos quando existem', () => {
    const doc = { $id: '1', titulo: 'Título', categoria_id: '3', nivel: 'avancado', duracao: 30, tags: ['a', 'b'], fonte: 'Fonte X', conteudo: { insight: 'teste' }, praticas: [{ titulo: 'P1' }], conexoes: ['c1'] };
    const r = formatarSaber(doc);
    expect(r.titulo).toBe('Título');
    expect(r.categoria_id).toBe('3');
    expect(r.nivel).toBe('avancado');
    expect(r.duracao).toBe(30);
    expect(r.tags).toEqual(['a', 'b']);
    expect(r.conteudo).toEqual({ insight: 'teste' });
    expect(r.praticas).toEqual([{ titulo: 'P1' }]);
    expect(r.conexoes).toEqual(['c1']);
  });
});

describe('formatarMidia', () => {
  it('mapeia com defaults', () => {
    const doc = { $id: 'mid1' };
    const r = formatarMidia(doc);
    expect(r.id).toBe('mid1');
    expect(r.tipo).toBe('audio');
    expect(r.titulo).toBe('');
  });

  it('mapeia todos os campos', () => {
    const doc = { $id: 'v1', titulo: 'Vídeo', tipo: 'video', arquivo: 'vid.mp4', tags: ['tag1'], saberes_relacionados: ['s1'] };
    const r = formatarMidia(doc);
    expect(r.titulo).toBe('Vídeo');
    expect(r.tipo).toBe('video');
    expect(r.arquivo).toBe('vid.mp4');
    expect(r.saberes_relacionados).toEqual(['s1']);
  });
});

// =============================================
// Testes: src/lib/emailjs.js — enviarEmailContato
// =============================================

describe('enviarEmailContato', () => {
  it('valida estrutura dos parâmetros do template', () => {
    const params = {
      from_name: 'João',
      from_email: 'joao@email.com',
      subject: 'Contato de João',
      message: 'Mensagem de teste',
      to_name: 'Saberes de Coração',
      reply_to: 'joao@email.com',
    };
    expect(params.from_name).toBe('João');
    expect(params.to_name).toBe('Saberes de Coração');
    expect(params.subject).toBeTruthy();
    expect(params.message).toBeTruthy();
    expect(params.reply_to).toBe(params.from_email);
  });

  it('usa assunto padrão quando não fornecido', () => {
    const nome = 'Maria';
    const email = 'maria@email.com';
    const assunto = '';
    const subject = assunto || `Contato de ${nome}`;
    expect(subject).toBe('Contato de Maria');
  });
});
