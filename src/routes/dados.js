import { Router } from 'express';
import * as storage from '../storage/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const lite = req.query.lite !== 'false';
    const dados = await storage.obterDadosCompletos(lite);
    res.json(dados);
  } catch (erro) { next(erro); }
});

export default router;
