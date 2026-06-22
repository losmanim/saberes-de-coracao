import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, extname, join, dirname } from "node:path";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORTA = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";
const CAMINHO_FRONTEND = resolve(__dirname, "..");
const CAMINHO_DADOS = resolve(__dirname, "../database/dados-unificados.json");

console.log("[startup] PORTA:", PORTA);
console.log("[startup] CAMINHO_FRONTEND:", CAMINHO_FRONTEND);
console.log("[startup] CAMINHO_DADOS:", CAMINHO_DADOS);
console.log("[startup] __dirname:", __dirname);

const app = express();
const tokens = new Set();

app.use(express.json());

function gerarToken() {
	const token = randomBytes(24).toString("hex");
	tokens.add(token);
	return token;
}

function autenticar(req, res, next) {
	const token = req.headers["authorization"];
	if (!token || !tokens.has(token.replace("Bearer ", ""))) {
		return res.status(401).json({ erro: "Não autorizado. Faça login primeiro." });
	}
	next();
}

// =============================================
// Utilitários
// =============================================

async function lerDados() {
	const raw = await readFile(CAMINHO_DADOS, "utf-8");
	return JSON.parse(raw);
}

function salvarDados(dados) {
	return writeFile(CAMINHO_DADOS, JSON.stringify(dados, null, 2), "utf-8");
}

// =============================================
// Rotas da API
// =============================================

app.post("/api/login", (req, res) => {
	const { senha } = req.body;
	if (senha !== ADMIN_PASS) {
		return res.status(401).json({ erro: "Senha incorreta" });
	}
	const token = gerarToken();
	res.json({ token, admin: true });
});

app.post("/api/logout", (req, res) => {
	const header = req.headers["authorization"];
	if (header) tokens.delete(header.replace("Bearer ", ""));
	res.json({ ok: true });
});

app.get("/api/verificar", (req, res) => {
	const header = req.headers["authorization"];
	if (!header || !tokens.has(header.replace("Bearer ", ""))) {
		return res.json({ autenticado: false });
	}
	res.json({ autenticado: true });
});

app.get("/api/categorias", async (req, res) => {
	try {
		const dados = await lerDados();
		res.json(dados.categorias || []);
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao ler dados" });
	}
});

app.get("/api/saberes", async (req, res) => {
	try {
		const dados = await lerDados();
		res.json(dados.saberes || []);
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao ler dados" });
	}
});

app.get("/api/saberes/:id", async (req, res) => {
	try {
		const dados = await lerDados();
		const saber = (dados.saberes || []).find(s => s.id === req.params.id);
		if (!saber) return res.status(404).json({ erro: "Saber não encontrado" });
		res.json(saber);
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao ler dados" });
	}
});

app.post("/api/saberes", autenticar, async (req, res) => {
	try {
		const dados = await lerDados();
		const { titulo, descricao, categoria_id, nivel, tags, fonte, conteudo } = req.body;

		if (!titulo || !descricao) {
			return res.status(400).json({ erro: "titulo e descricao são obrigatórios" });
		}

		const id = "saber-" + Date.now();
		const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

		const novo = {
			id,
			categoria_id: categoria_id || 1,
			titulo,
			slug,
			descricao,
			nivel: nivel || "iniciante",
			duracao: 15,
			tags: tags || [],
			fonte: fonte || "",
			licenca: "Domínio Público",
			conteudo: conteudo || {},
		};

		dados.saberes = dados.saberes || [];
		dados.saberes.push(novo);
		await salvarDados(dados);

		res.status(201).json(novo);
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao criar saber" });
	}
});

app.put("/api/saberes/:id", autenticar, async (req, res) => {
	try {
		const dados = await lerDados();
		const index = (dados.saberes || []).findIndex(s => s.id === req.params.id);
		if (index === -1) return res.status(404).json({ erro: "Saber não encontrado" });

		const atualizado = { ...dados.saberes[index], ...req.body, id: req.params.id };
		dados.saberes[index] = atualizado;
		await salvarDados(dados);

		res.json(atualizado);
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao atualizar saber" });
	}
});

app.delete("/api/saberes/:id", autenticar, async (req, res) => {
	try {
		const dados = await lerDados();
		const index = (dados.saberes || []).findIndex(s => s.id === req.params.id);
		if (index === -1) return res.status(404).json({ erro: "Saber não encontrado" });

		dados.saberes.splice(index, 1);
		await salvarDados(dados);

		res.status(204).end();
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao remover saber" });
	}
});

app.get("/api/midia", async (req, res) => {
	try {
		const dados = await lerDados();
		res.json(dados.midia || { audios: [], videos: [] });
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao ler dados" });
	}
});

app.get("/api/dados", async (req, res) => {
	try {
		const dados = await lerDados();
		res.json(dados);
	} catch (erro) {
		console.error(erro);
		res.status(500).json({ erro: "Erro ao ler dados" });
	}
});

app.get("/api/health", (req, res) => {
	res.json({ status: "ok", versao: "1.0.0" });
});

// =============================================
// Arquivos estáticos
// =============================================

const MIME_TYPES = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png",
	".jpg": "image/jpeg",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".mp3": "audio/mpeg",
	".mp4": "video/mp4",
	".webm": "video/webm",
	".woff2": "font/woff2",
};

app.use(express.static(CAMINHO_FRONTEND, {
	fallthrough: true,
	setHeaders(res, filePath) {
		const ext = extname(filePath);
		if (MIME_TYPES[ext]) {
			res.setHeader("Content-Type", MIME_TYPES[ext]);
		}
	},
}));

// Fallback SPA
app.use((req, res) => {
	const index = join(CAMINHO_FRONTEND, "index.html");
	if (existsSync(index)) {
		res.sendFile(index);
	} else {
		res.status(404).type("html").send("404 - Página não encontrada");
	}
});

// =============================================
// Tratamento de erros
// =============================================

app.use((err, req, res, next) => {
	console.error("Erro não tratado:", err);
	res.status(500).json({ erro: "Erro interno do servidor" });
});

app.listen(PORTA, () => {
	console.log(`Saberes de Coração — servidor rodando em http://localhost:${PORTA}`);
});
