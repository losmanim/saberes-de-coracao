import { Router } from 'express';
import * as storage from '../storage/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const midia = await storage.listarMidia();
    res.json(midia);
  } catch (erro) { next(erro); }
});

export default router;
