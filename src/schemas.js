import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const criacaoSaberSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(2000, 'Descrição muito longa'),
  categoria_id: z.union([z.string(), z.number()]).optional().default(1),
  nivel: z.enum(['iniciante', 'intermediario', 'avancado']).optional().default('iniciante'),
  tags: z.array(z.string().max(50)).optional().default([]),
  fonte: z.string().max(500).optional().default(''),
  conteudo: z.record(z.any()).optional().default({}),
});

export const atualizacaoSaberSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  descricao: z.string().min(1).max(2000).optional(),
  categoria_id: z.union([z.string(), z.number()]).optional(),
  nivel: z.enum(['iniciante', 'intermediario', 'avancado']).optional(),
  tags: z.array(z.string().max(50)).optional(),
  fonte: z.string().max(500).optional(),
  conteudo: z.record(z.any()).optional(),
});

export const contatoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  assunto: z.string().max(500).optional().default(''),
  mensagem: z.string().min(1, 'Mensagem é obrigatória').max(5000, 'Mensagem muito longa'),
});

export function validar(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const erros = result.error.issues.map(i => ({
        campo: i.path.join('.'),
        mensagem: i.message,
      }));
      return res.status(400).json({ erro: 'Dados inválidos', detalhes: erros });
    }
    req.body = result.data;
    next();
  };
}
