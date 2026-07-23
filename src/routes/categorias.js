import { Router } from 'express';
import * as storage from '../storage/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categorias = await storage.listarCategorias();
    res.json(categorias);
  } catch (erro) { next(erro); }
});

export default router;
