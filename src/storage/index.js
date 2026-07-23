import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Appwrite from '../lib/appwrite.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAMINHO_DADOS = resolve(__dirname, '../../data/dados-unificados.json');
const USE_APPWRITE = !!(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID);

let writeQueue = Promise.resolve();

async function lerDadosJSON() {
  const raw = await readFile(CAMINHO_DADOS, 'utf-8');
  return JSON.parse(raw);
}

function salvarDadosJSON(dados) {
  writeQueue = writeQueue.then(() =>
    writeFile(CAMINHO_DADOS, JSON.stringify(dados, null, 2), 'utf-8')
  );
  return writeQueue;
}

export async function listarCategorias() {
  if (USE_APPWRITE) {
    const cats = await Appwrite.listarCategorias();
    return cats.map(c => ({
      id: parseInt(c.ordem) || c.$id, nome: c.nome, slug: c.slug,
      descricao: c.descricao, cor: c.cor, icone: c.icone,
    }));
  }
  const dados = await lerDadosJSON();
  return dados.categorias || [];
}

export async function listarSaberes(page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  if (USE_APPWRITE) {
    const saberes = await Appwrite.listarSaberes();
    const paginados = saberes.slice(offset, offset + limit);
    return {
      data: paginados,
      pagination: { page, limit, total: saberes.length, totalPages: Math.ceil(saberes.length / limit) },
    };
  }
  const dados = await lerDadosJSON();
  const todosSaberes = dados.saberes || [];
  const paginados = todosSaberes.slice(offset, offset + limit);
  return {
    data: paginados,
    pagination: { page, limit, total: todosSaberes.length, totalPages: Math.ceil(todosSaberes.length / limit) },
  };
}

export async function getSaber(id) {
  if (USE_APPWRITE) return Appwrite.getSaber(id);
  const dados = await lerDadosJSON();
  const saber = (dados.saberes || []).find(s => s.id === id);
  if (!saber) throw Object.assign(new Error('Saber não encontrado'), { status: 404 });
  return saber;
}

export async function getSaberConteudo(id) {
  if (USE_APPWRITE) {
    const saber = await Appwrite.getSaber(id);
    return { conteudo: typeof saber.conteudo === 'string' ? JSON.parse(saber.conteudo) : (saber.conteudo || {}) };
  }
  const dados = await lerDadosJSON();
  const saber = (dados.saberes || []).find(s => s.id === id);
  if (!saber) throw Object.assign(new Error('Saber não encontrado'), { status: 404 });
  return { conteudo: saber.conteudo };
}

export async function criarSaber(body) {
  const { titulo, descricao, categoria_id, nivel, tags, fonte, conteudo } = body;
  const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (USE_APPWRITE) {
    return Appwrite.criarSaber({
      titulo, descricao, slug,
      categoria_id: String(categoria_id || 1),
      nivel: nivel || 'iniciante',
      tags: tags || [], fonte: fonte || '',
      conteudo: JSON.stringify(conteudo || {}),
    });
  }
  const dados = await lerDadosJSON();
  const id = 'saber-' + Date.now();
  const novo = {
    id, categoria_id: categoria_id || 1, titulo, slug, descricao,
    nivel: nivel || 'iniciante', duracao: 15, tags: tags || [],
    fonte: fonte || '', licenca: 'Domínio Público', conteudo: conteudo || {},
  };
  dados.saberes = dados.saberes || [];
  dados.saberes.push(novo);
  await salvarDadosJSON(dados);
  return novo;
}

export async function atualizarSaber(id, body) {
  if (USE_APPWRITE) return Appwrite.atualizarSaber(id, body);
  const dados = await lerDadosJSON();
  const index = (dados.saberes || []).findIndex(s => s.id === id);
  if (index === -1) throw Object.assign(new Error('Saber não encontrado'), { status: 404 });
  const atualizado = { ...dados.saberes[index], ...body, id };
  dados.saberes[index] = atualizado;
  await salvarDadosJSON(dados);
  return atualizado;
}

export async function deletarSaber(id) {
  if (USE_APPWRITE) return Appwrite.deletarSaber(id);
  const dados = await lerDadosJSON();
  const index = (dados.saberes || []).findIndex(s => s.id === id);
  if (index === -1) throw Object.assign(new Error('Saber não encontrado'), { status: 404 });
  dados.saberes.splice(index, 1);
  await salvarDadosJSON(dados);
}

export async function listarMidia() {
  if (USE_APPWRITE) return Appwrite.listarMidia();
  const dados = await lerDadosJSON();
  return dados.midia || { audios: [], videos: [] };
}

export async function salvarContato(data) {
  if (USE_APPWRITE) return Appwrite.salvarContato(data);
  const dados = await lerDadosJSON();
  dados.contatos = dados.contatos || [];
  dados.contatos.push({ ...data, id: 'ct-' + Date.now(), criado_em: new Date().toISOString(), lido: false });
  await salvarDadosJSON(dados);
}

export async function obterDadosCompletos(lite = true) {
  if (USE_APPWRITE) {
    const [saberes, midiaList] = await Promise.all([Appwrite.listarSaberes(), Appwrite.listarMidia()]);
    const categorias = await Appwrite.listarCategorias();
    return {
      meta: { versao: '4.0-appwrite', atualizado: new Date().toISOString() },
      categorias: categorias.map(c => ({ id: parseInt(c.ordem) || c.$id, nome: c.nome, slug: c.slug, descricao: c.descricao, cor: c.cor, icone: c.icone })),
      saberes: lite ? saberes.map(s => {
        let preview = '';
        try {
          const c = typeof s.conteudo === 'string' ? JSON.parse(s.conteudo) : (s.conteudo || {});
          preview = (c.texto_integral || '').slice(0, 150).replace(/\n+/g, ' ');
        } catch (e) {}
        return { ...s, conteudo: undefined, preview };
      }) : saberes,
      midia: midiaList,
    };
  }
  const dados = await lerDadosJSON();
  return {
    ...dados,
    saberes: lite ? dados.saberes.map(s => ({
      ...s, conteudo: undefined,
      preview: (s.conteudo?.texto_integral || '').slice(0, 150).replace(/\n+/g, ' '),
    })) : dados.saberes,
  };
}
