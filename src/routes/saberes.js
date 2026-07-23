import { Router } from 'express';
import { autenticar } from '../middleware/auth.js';
import { criacaoSaberSchema, atualizacaoSaberSchema, validar } from '../schemas.js';
import * as storage from '../storage/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const result = await storage.listarSaberes(page, limit);
    res.json(result);
  } catch (erro) { next(erro); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const saber = await storage.getSaber(req.params.id);
    res.json(saber);
  } catch (erro) {
    if (erro.status === 404) return res.status(404).json({ erro: 'Saber não encontrado' });
    next(erro);
  }
});

router.post('/', autenticar, validar(criacaoSaberSchema), async (req, res, next) => {
  try {
    const criado = await storage.criarSaber(req.body);
    res.status(201).json(criado);
  } catch (erro) { next(erro); }
});

router.put('/:id', autenticar, validar(atualizacaoSaberSchema), async (req, res, next) => {
  try {
    const atualizado = await storage.atualizarSaber(req.params.id, req.body);
    res.json(atualizado);
  } catch (erro) {
    if (erro.status === 404) return res.status(404).json({ erro: 'Saber não encontrado' });
    next(erro);
  }
});

router.delete('/:id', autenticar, async (req, res, next) => {
  try {
    await storage.deletarSaber(req.params.id);
    res.status(204).end();
  } catch (erro) {
    if (erro.status === 404) return res.status(404).json({ erro: 'Saber não encontrado' });
    next(erro);
  }
});

router.get('/:id/conteudo', async (req, res, next) => {
  try {
    const result = await storage.getSaberConteudo(req.params.id);
    res.json(result);
  } catch (erro) {
    if (erro.status === 404) return res.status(404).json({ erro: 'Saber não encontrado' });
    next(erro);
  }
});

export default router;
