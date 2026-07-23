import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import * as Appwrite from '../lib/appwrite.js';
import { loginSchema, validar } from '../schemas.js';
import { autenticar } from '../middleware/auth.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

function gerarToken(payload = {}) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
}

function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 };
}

router.post('/login', loginLimiter, validar(loginSchema), async (req, res, next) => {
  try {
    const { senha } = req.body;
    const USE_APPWRITE = !!(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID);
    if (USE_APPWRITE && process.env.APPWRITE_PROJECT_ID && req.body.email) {
      try {
        const session = await Appwrite.criarSessao(req.body.email, senha);
        const token = gerarToken({ admin: true, appwrite: true, sessionId: session.$id });
        res.cookie('token', token, cookieOptions());
        return res.json({ token, admin: true, appwrite: true });
      } catch (e) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
    }
    if (senha !== process.env.ADMIN_PASS) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }
    const token = gerarToken({ admin: true, appwrite: false });
    res.cookie('token', token, cookieOptions());
    res.json({ token, admin: true, appwrite: false });
  } catch (erro) {
    next(erro);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const USE_APPWRITE = !!(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID);
    if (USE_APPWRITE) {
      try { await Appwrite.deletarSessao(); } catch {}
    }
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.json({ ok: true });
  } catch (erro) { next(erro); }
});

router.get('/verificar', autenticar, (req, res) => {
  res.json({ autenticado: true, admin: true });
});

export default router;
