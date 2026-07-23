import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { contatoSchema, validar } from '../schemas.js';
import { enviarEmailContato } from '../lib/emailjs.js';
import * as storage from '../storage/index.js';

const contatoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { erro: 'Muitas mensagens de contato. Tente novamente em 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/', contatoLimiter, validar(contatoSchema), async (req, res, next) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;
    const contatoData = { nome, email, assunto: assunto || '', mensagem };

    await storage.salvarContato(contatoData);

    const USE_EMAILJS = !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY);
    if (USE_EMAILJS) {
      try {
        await enviarEmailContato({ nome, email, assunto, mensagem });
        return res.json({ ok: true, email_enviado: true });
      } catch (err) {
        return res.json({ ok: true, email_enviado: false, aviso: 'Contato salvo, mas email não pôde ser enviado.' });
      }
    }
    res.json({ ok: true, email_enviado: false });
  } catch (erro) { next(erro); }
});

export default router;
