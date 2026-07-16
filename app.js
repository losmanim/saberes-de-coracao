import 'dotenv/config';
import express from 'express';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, extname, join, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import winston from 'winston';

import * as Appwrite from './src/lib/appwrite.js';
import { enviarEmailContato } from './src/lib/emailjs.js';

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

// Validação de variáveis de ambiente obrigatórias
const requiredEnvVars = ['ADMIN_PASS', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variáveis de ambiente obrigatórias não configuradas:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nConfigure estas variáveis no arquivo .env ou nas configurações do deploy.');
  process.exit(1);
}

const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const CAMINHO_FRONTEND = resolve(__dirname, '.');
const CAMINHO_DADOS = resolve(__dirname, './data/dados-unificados.json');
const USE_APPWRITE = !!(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID);
const USE_EMAILJS = !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY);

// Validação de variáveis opcionais com warnings
if (USE_APPWRITE) {
  logger.info('✅ Appwrite configurado');
} else {
  logger.warn('⚠️  Appwrite não configurado - usando modo JSON (fallback)');
}

if (USE_EMAILJS) {
  logger.info('✅ EmailJS configurado');
} else {
  logger.warn('⚠️  EmailJS não configurado - formulário de contato não enviará emails');
}

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(express.json({ limit: '5mb' }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contatoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { erro: 'Muitas mensagens de contato. Tente novamente em 1 hora.' },
  standardHeaders: true,
  legacyHeaders: false,
});

if (USE_APPWRITE) {
  logger.info('Modo Appwrite ativado');
} else {
  logger.info('Modo JSON (fallback) — configure APPWRITE_* no .env para usar Appwrite');
}

// =====================
// Auth Helper (JWT)
// =====================

function gerarToken(payload = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function autenticar(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }
  try {
    const token = header.replace('Bearer ', '');
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

// =====================
// JSON Helpers
// =====================

async function lerDadosJSON() {
  const raw = await readFile(CAMINHO_DADOS, 'utf-8');
  return JSON.parse(raw);
}

function salvarDadosJSON(dados) {
  return writeFile(CAMINHO_DADOS, JSON.stringify(dados, null, 2), 'utf-8');
}

// =====================
// Auth Routes
// =====================

app.post('/api/login', loginLimiter, async (req, res) => {
  const { senha } = req.body;
  if (USE_APPWRITE && process.env.APPWRITE_PROJECT_ID && req.body.email) {
    try {
      const session = await Appwrite.criarSessao(req.body.email, senha);
      const token = gerarToken({ admin: true, appwrite: true, sessionId: session.$id });
      return res.json({ token, admin: true, appwrite: true });
    } catch (e) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
  }
  if (senha !== ADMIN_PASS) {
    return res.status(401).json({ erro: 'Senha incorreta' });
  }
  const token = gerarToken({ admin: true, appwrite: false });
  res.json({ token, admin: true, appwrite: false });
});

app.post('/api/logout', async (req, res) => {
  if (USE_APPWRITE) {
    try { await Appwrite.deletarSessao(); } catch {}
  }
  res.json({ ok: true });
});

app.get('/api/verificar', autenticar, (req, res) => {
  res.json({ autenticado: true, admin: true });
});

// =====================
// Categorias
// =====================

app.get('/api/categorias', async (req, res) => {
  try {
    if (USE_APPWRITE) {
      const cats = await Appwrite.listarCategorias();
      return res.json(cats.map(c => ({
        id: parseInt(c.ordem) || c.$id,
        nome: c.nome,
        slug: c.slug,
        descricao: c.descricao,
        cor: c.cor,
        icone: c.icone,
      })));
    }
    const dados = await lerDadosJSON();
    res.json(dados.categorias || []);
  } catch (erro) {
    logger.error('Erro ao ler categorias: ' + erro.message);
    res.status(500).json({ erro: 'Erro ao ler categorias' });
  }
});

// =====================
// Saberes
// =====================

app.get('/api/saberes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    if (USE_APPWRITE) {
      const saberes = await Appwrite.listarSaberes();
      const paginados = saberes.slice(offset, offset + limit);
      return res.json({
        data: paginados,
        pagination: {
          page,
          limit,
          total: saberes.length,
          totalPages: Math.ceil(saberes.length / limit)
        }
      });
    }

    const dados = await lerDadosJSON();
    const todosSaberes = dados.saberes || [];
    const paginados = todosSaberes.slice(offset, offset + limit);
    
    res.json({
      data: paginados,
      pagination: {
        page,
        limit,
        total: todosSaberes.length,
        totalPages: Math.ceil(todosSaberes.length / limit)
      }
    });
  } catch (erro) {
    logger.error('Erro ao ler saberes: ' + erro.message);
    res.status(500).json({ erro: 'Erro ao ler saberes' });
  }
});

app.get('/api/saberes/:id', async (req, res) => {
  try {
    if (USE_APPWRITE) {
      const saber = await Appwrite.getSaber(req.params.id);
      return res.json(saber);
    }
    const dados = await lerDadosJSON();
    const saber = (dados.saberes || []).find(s => s.id === req.params.id);
    if (!saber) return res.status(404).json({ erro: 'Saber não encontrado' });
    res.json(saber);
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao ler saber' });
  }
});

app.post('/api/saberes', autenticar, async (req, res) => {
  try {
    const { titulo, descricao, categoria_id, nivel, tags, fonte, conteudo } = req.body;
    if (!titulo || !descricao) {
      return res.status(400).json({ erro: 'titulo e descricao são obrigatórios' });
    }

    if (USE_APPWRITE) {
      const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const criado = await Appwrite.criarSaber({
        titulo, descricao, slug,
        categoria_id: String(categoria_id || 1),
        nivel: nivel || 'iniciante',
        tags: tags || [],
        fonte: fonte || '',
        conteudo: JSON.stringify(conteudo || {}),
      });
      return res.status(201).json(criado);
    }

    const dados = await lerDadosJSON();
    const id = 'saber-' + Date.now();
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const novo = {
      id, categoria_id: categoria_id || 1, titulo, slug, descricao,
      nivel: nivel || 'iniciante', duracao: 15, tags: tags || [],
      fonte: fonte || '', licenca: 'Domínio Público', conteudo: conteudo || {},
    };
    dados.saberes = dados.saberes || [];
    dados.saberes.push(novo);
    await salvarDadosJSON(dados);
    res.status(201).json(novo);
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao criar saber' });
  }
});

app.put('/api/saberes/:id', autenticar, async (req, res) => {
  try {
    if (USE_APPWRITE) {
      const atualizado = await Appwrite.atualizarSaber(req.params.id, req.body);
      return res.json(atualizado);
    }
    const dados = await lerDadosJSON();
    const index = (dados.saberes || []).findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ erro: 'Saber não encontrado' });
    const atualizado = { ...dados.saberes[index], ...req.body, id: req.params.id };
    dados.saberes[index] = atualizado;
    await salvarDadosJSON(dados);
    res.json(atualizado);
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao atualizar saber' });
  }
});

app.delete('/api/saberes/:id', autenticar, async (req, res) => {
  try {
    if (USE_APPWRITE) {
      await Appwrite.deletarSaber(req.params.id);
      return res.status(204).end();
    }
    const dados = await lerDadosJSON();
    const index = (dados.saberes || []).findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ erro: 'Saber não encontrado' });
    dados.saberes.splice(index, 1);
    await salvarDadosJSON(dados);
    res.status(204).end();
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao remover saber' });
  }
});

app.get('/api/saberes/:id/conteudo', async (req, res) => {
  try {
    if (USE_APPWRITE) {
      const saber = await Appwrite.getSaber(req.params.id);
      return res.json({
        conteudo: typeof saber.conteudo === 'string' ? JSON.parse(saber.conteudo) : (saber.conteudo || {})
      });
    }
    const dados = await lerDadosJSON();
    const saber = (dados.saberes || []).find(s => s.id === req.params.id);
    if (!saber) return res.status(404).json({ erro: 'Saber não encontrado' });
    res.json({ conteudo: saber.conteudo });
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao ler conteúdo' });
  }
});

// =====================
// Mídia
// =====================

app.get('/api/midia', async (req, res) => {
  try {
    if (USE_APPWRITE) {
      const midia = await Appwrite.listarMidia();
      return res.json(midia);
    }
    const dados = await lerDadosJSON();
    res.json(dados.midia || { audios: [], videos: [] });
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao ler mídia' });
  }
});

// =====================
// Dados (Lite)
// =====================

app.get('/api/dados', async (req, res) => {
  try {
    const lite = req.query.lite !== 'false'; // Default é true (lite mode)
    
    if (USE_APPWRITE) {
      const [saberes, midiaList] = await Promise.all([
        Appwrite.listarSaberes(),
        Appwrite.listarMidia(),
      ]);
      const categorias = await Appwrite.listarCategorias();
      return res.json({
        meta: { versao: '4.0-appwrite', atualizado: new Date().toISOString() },
        categorias: categorias.map(c => ({ id: parseInt(c.ordem) || c.$id, nome: c.nome, slug: c.slug, descricao: c.descricao, cor: c.cor, icone: c.icone })),
        saberes: lite ? saberes.map(s => ({ ...s, conteudo: undefined })) : saberes,
        midia: midiaList,
      });
    }
    
    const dados = await lerDadosJSON();
    const dadosLite = {
      ...dados,
      saberes: lite ? dados.saberes.map(s => ({ ...s, conteudo: undefined })) : dados.saberes,
    };
    res.json(dadosLite);
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao ler dados' });
  }
});

// =====================
// Contato (EmailJS)
// =====================

app.post('/api/contato', contatoLimiter, async (req, res) => {
  try {
    const { nome, email, assunto, mensagem } = req.body;
    if (!nome || !email || !mensagem) {
      return res.status(400).json({ erro: 'nome, email e mensagem são obrigatórios' });
    }

    // Sempre salva no banco (Appwrite ou JSON)
    const contatoData = { nome, email, assunto: assunto || '', mensagem };
    if (USE_APPWRITE) {
      await Appwrite.salvarContato(contatoData);
    } else {
      try {
        const dados = await lerDadosJSON();
        dados.contatos = dados.contatos || [];
        dados.contatos.push({ ...contatoData, id: 'ct-' + Date.now(), criado_em: new Date().toISOString(), lido: false });
        await salvarDadosJSON(dados);
      } catch {}
    }

    // Envia email via EmailJS se configurado
    if (USE_EMAILJS) {
      try {
        await enviarEmailContato({ nome, email, assunto, mensagem });
        return res.json({ ok: true, email_enviado: true });
      } catch (err) {
        logger.error('Erro EmailJS: ' + (err?.message || err));
        return res.json({ ok: true, email_enviado: false, aviso: 'Contato salvo, mas email não pôde ser enviado.' });
      }
    }

    res.json({ ok: true, email_enviado: false });
  } catch (erro) {
    logger.error('Erro: ' + (erro?.message || erro));
    res.status(500).json({ erro: 'Erro ao processar contato' });
  }
});

// =====================
// Mídia Config
// =====================

app.get('/api/midia-config', (req, res) => {
  res.json({
    baseUrl: process.env.MIDIA_BASE_URL || 'midia',
  });
});

// =====================
// Health
// =====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    versao: '4.0.0',
    modo: USE_APPWRITE ? 'appwrite' : 'json',
    emailjs: USE_EMAILJS,
  });
});

// =====================
// Static Files & SPA Fallback
// =====================

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
    if (MIME_TYPES[ext]) {
      res.setHeader('Content-Type', MIME_TYPES[ext]);
    }
  },
}));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ erro: 'Rota não encontrada' });
  }
  const index = join(CAMINHO_FRONTEND, 'index.html');
  if (existsSync(index)) {
    res.sendFile(index);
  } else {
    res.status(404).type('html').send('404 - Página não encontrada');
  }
});

app.use((err, req, res, next) => {
  logger.error('Erro não tratado: ' + err.message, { stack: err.stack, url: req.url, method: req.method });
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// =====================
// Start
// =====================

app.listen(PORT, () => {
  logger.info(`\n🕉️  Saberes de Coração v4.0`);
  logger.info(`   Servidor: http://localhost:${PORT}`);
  logger.info(`   Modo: ${USE_APPWRITE ? '🔥 Appwrite' : '📄 JSON (legado)'}`);
  logger.info(`   EmailJS: ${USE_EMAILJS ? '✅' : '❌ (configure EMAILJS_* no .env)'}`);
  logger.info('');
});
