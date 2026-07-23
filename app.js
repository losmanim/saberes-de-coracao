import 'dotenv/config';
import express from 'express';
import { resolve, extname, join, dirname } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import winston from 'winston';

import authRoutes from './src/routes/auth.js';
import saberesRoutes from './src/routes/saberes.js';
import categoriasRoutes from './src/routes/categorias.js';
import dadosRoutes from './src/routes/dados.js';
import contatoRoutes from './src/routes/contato.js';
import midiaRoutes from './src/routes/midia.js';
import healthRoutes from './src/routes/health.js';
import { csrfProtection } from './src/middleware/csrf.js';

const logsDir = join(dirname(fileURLToPath(import.meta.url)), 'logs');
try { mkdirSync(logsDir, { recursive: true }); } catch {}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}${stack ? '\n' + stack : ''}`)
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.printf(({ timestamp, level, message, stack }) => `${timestamp} ${level} ${message}${stack ? '\n' + stack : ''}`)) }),
    new winston.transports.File({ filename: 'logs/erros.log', level: 'error', maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: 'logs/combined.log', maxsize: 5242880, maxFiles: 5 }),
  ],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
const CAMINHO_FRONTEND = resolve(__dirname, '.');
const USE_APPWRITE = !!(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID);
const USE_EMAILJS = !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY);

const requiredEnvVars = ['ADMIN_PASS', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('❌ Variáveis de ambiente obrigatórias não configuradas:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nConfigure estas variáveis no arquivo .env ou nas configurações do deploy.');
  process.exit(1);
}

logger.info(USE_APPWRITE ? '✅ Appwrite configurado' : '⚠️  Appwrite não configurado - usando modo JSON (fallback)');
logger.info(USE_EMAILJS ? '✅ EmailJS configurado' : '⚠️  EmailJS não configurado - formulário de contato não enviará emails');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use(cookieParser());
const corsOrigins = (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim());
app.use(cors({ origin: corsOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(compression());
app.use(express.json({ limit: '5mb' }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' }, standardHeaders: true, legacyHeaders: false });

app.use('/api/', apiLimiter);
app.use('/api/', csrfProtection);

app.use('/api', authRoutes);
app.use('/api/saberes', saberesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/dados', dadosRoutes);
app.use('/api/contato', contatoRoutes);
app.use('/api/midia', midiaRoutes);
app.use('/api/health', healthRoutes);

app.get('/api/midia-config', (req, res) => {
  res.json({ baseUrl: process.env.MIDIA_BASE_URL || 'midia' });
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

app.use(express.static(CAMINHO_FRONTEND, {
  fallthrough: true,
  setHeaders(res, filePath) {
    const ext = extname(filePath);
    if (MIME_TYPES[ext]) res.setHeader('Content-Type', MIME_TYPES[ext]);
  },
}));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ erro: 'Rota não encontrada' });
  const index = join(CAMINHO_FRONTEND, 'index.html');
  if (existsSync(index)) res.sendFile(index);
  else res.status(404).type('html').send('404 - Página não encontrada');
});

app.use((err, req, res, next) => {
  logger.error(`Erro não tratado: ${err.message}`, { stack: err.stack, url: req.url, method: req.method });
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  logger.info(`\n🕉️  Saberes de Coração v4.0`);
  logger.info(`   Servidor: http://localhost:${PORT}`);
  logger.info(`   Modo: ${USE_APPWRITE ? '🔥 Appwrite' : '📄 JSON (legado)'}`);
  logger.info(`   EmailJS: ${USE_EMAILJS ? '✅' : '❌ (configure EMAILJS_* no .env)'}`);
  logger.info('');
});
