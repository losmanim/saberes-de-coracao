import { Client, Databases, Storage, Account, Users, Query, ID } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../.env') });

function getClient(isAdmin = false) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '');

  if (isAdmin && process.env.APPWRITE_API_KEY) {
    client.setKey(process.env.APPWRITE_API_KEY);
  }

  return client;
}

function getDB(client) {
  return new Databases(client);
}

function getStorage(client) {
  return new Storage(client);
}

function getAccount(client) {
  return new Account(client);
}

function getUsers(client) {
  return new Users(client);
}

const DB_ID = () => process.env.APPWRITE_DATABASE_ID || '';
const COL_SABERES = () => process.env.APPWRITE_SABERES_COLLECTION_ID || 'saberes';
const COL_CATEGORIAS = () => process.env.APPWRITE_CATEGORIAS_COLLECTION_ID || 'categorias';
const COL_MIDIA = () => process.env.APPWRITE_MIDIA_COLLECTION_ID || 'midia';
const COL_CONTATOS = () => process.env.APPWRITE_CONTATOS_COLLECTION_ID || 'contatos';
const COL_USUARIOS = () => process.env.APPWRITE_USUARIOS_COLLECTION_ID || 'usuarios_dados';

export async function listarSaberes() {
  const db = getDB(getClient(true));
  const result = await db.listDocuments(DB_ID(), COL_SABERES(), [Query.limit(100)]);
  return result.documents.map(formatarSaber);
}

export async function getSaber(id) {
  const db = getDB(getClient(true));
  const doc = await db.getDocument(DB_ID(), COL_SABERES(), id);
  return formatarSaber(doc);
}

export async function criarSaber(data) {
  const db = getDB(getClient(true));
  const doc = await db.createDocument(DB_ID(), COL_SABERES(), ID.unique(), {
    ...data,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
  });
  return formatarSaber(doc);
}

export async function atualizarSaber(id, data) {
  const db = getDB(getClient(true));
  const doc = await db.updateDocument(DB_ID(), COL_SABERES(), id, {
    ...data,
    atualizado_em: new Date().toISOString(),
  });
  return formatarSaber(doc);
}

export async function deletarSaber(id) {
  const db = getDB(getClient(true));
  await db.deleteDocument(DB_ID(), COL_SABERES(), id);
  return { ok: true };
}

export async function listarCategorias() {
  const db = getDB(getClient(true));
  const result = await db.listDocuments(DB_ID(), COL_CATEGORIAS(), [Query.limit(50)]);
  return result.documents;
}

function formatarMidia(doc) {
  return {
    id: doc.$id,
    $id: doc.$id,
    titulo: doc.titulo || '',
    tipo: doc.tipo || 'audio',
    arquivo: doc.arquivo || '',
    tags: doc.tags || [],
    saberes_relacionados: doc.saberes_relacionados || [],
  };
}

export async function listarMidia() {
  const db = getDB(getClient(true));
  const result = await db.listDocuments(DB_ID(), COL_MIDIA(), [Query.limit(100)]);
  const formatada = result.documents.map(formatarMidia);
  const audios = formatada.filter(m => m.tipo === 'audio');
  const videos = formatada.filter(m => m.tipo === 'video');
  return { audios, videos };
}

export async function salvarContato(data) {
  const db = getDB(getClient(true));
  const doc = await db.createDocument(DB_ID(), COL_CONTATOS(), ID.unique(), {
    ...data,
    criado_em: new Date().toISOString(),
    lido: false,
  });
  return doc;
}

export async function verificarToken(token) {
  try {
    const client = getClient(false);
    const account = getAccount(client);
    const session = await account.getSession('current');
    return !!session;
  } catch {
    return false;
  }
}

export async function criarSessao(email, senha) {
  const client = getClient(false);
  const account = getAccount(client);
  return await account.createEmailPasswordSession(email, senha);
}

export async function deletarSessao() {
  const client = getClient(false);
  const account = getAccount(client);
  await account.deleteSession('current');
}

function formatarSaber(doc) {
  return {
    id: doc.$id,
    $id: doc.$id,
    $createdAt: doc.$createdAt,
    $updatedAt: doc.$updatedAt,
    categoria_id: doc.categoria_id || 1,
    titulo: doc.titulo || '',
    slug: doc.slug || '',
    descricao: doc.descricao || '',
    nivel: doc.nivel || 'iniciante',
    duracao: doc.duracao || 15,
    tags: doc.tags || [],
    fonte: doc.fonte || '',
    licenca: doc.licenca || 'Domínio Público',
    conteudo: doc.conteudo || {},
    praticas: doc.praticas || [],
    conexoes: doc.conexoes || [],
  };
}

export const Collections = { COL_SABERES, COL_CATEGORIAS, COL_MIDIA, COL_CONTATOS, COL_USUARIOS, DB_ID };
