import { Client, Databases, Storage, ID } from 'node-appwrite';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const db = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

if (!DATABASE_ID) {
  console.error('APPWRITE_DATABASE_ID não configurado. Crie um database no Appwrite Console primeiro.');
  process.exit(1);
}

async function criarColecao(id, nome, atributos, indices = []) {
  try {
    const colecao = await db.createCollection(DATABASE_ID, id, nome);
    console.log(`  ✅ Coleção "${nome}" (${id}) criada`);

    for (const attr of atributos) {
      try {
        await db.createStringAttribute(DATABASE_ID, id, attr.key, attr.size || 256, attr.required || false);
        console.log(`    → Atributo: ${attr.key}`);
      } catch (e) {
        if (e.code === 409) console.log(`    → Atributo ${attr.key} já existe`);
        else console.error(`    → Erro em ${attr.key}:`, e.message);
      }
    }

    for (const idx of indices) {
      try {
        await db.createIndex(DATABASE_ID, id, idx.key, 'key', idx.attributes, idx.orders);
        console.log(`    → Índice: ${idx.key}`);
      } catch (e) {
        if (e.code === 409) console.log(`    → Índice ${idx.key} já existe`);
        else console.error(`    → Erro índice ${idx.key}:`, e.message);
      }
    }

    return colecao;
  } catch (e) {
    if (e.code === 409) {
      console.log(`  ⚠️ Coleção "${nome}" já existe`);
      return null;
    }
    throw e;
  }
}

console.log('\n🚀 Configurando Database do Appwrite...\n');

console.log(`📦 Database ID: ${DATABASE_ID}`);

console.log('\n📁 Coleção: Saberes');
await criarColecao(
  process.env.APPWRITE_SABERES_COLLECTION_ID || 'saberes',
  'Saberes',
  [
    { key: 'titulo', size: 256, required: true },
    { key: 'slug', size: 256 },
    { key: 'descricao', size: 1024, required: false },
    { key: 'categoria_id', size: 10, required: true },
    { key: 'nivel', size: 32 },
    { key: 'duracao', size: 10 },
    { key: 'fonte', size: 256 },
    { key: 'licenca', size: 64 },
    { key: 'conteudo', size: 16384 },
    { key: 'praticas', size: 4096 },
    { key: 'conexoes', size: 1024 },
    { key: 'tags', size: 512 },
    { key: 'criado_em', size: 64 },
    { key: 'atualizado_em', size: 64 },
  ],
  [
    { key: 'idx_categoria', attributes: ['categoria_id'], orders: ['ASC'] },
    { key: 'idx_slug', attributes: ['slug'], orders: ['ASC'] },
    { key: 'idx_titulo', attributes: ['titulo'], orders: ['ASC'] },
  ],
);

console.log('\n📁 Coleção: Categorias');
await criarColecao(
  process.env.APPWRITE_CATEGORIAS_COLLECTION_ID || 'categorias',
  'Categorias',
  [
    { key: 'nome', size: 128, required: true },
    { key: 'slug', size: 128 },
    { key: 'descricao', size: 512 },
    { key: 'cor', size: 16 },
    { key: 'icone', size: 64 },
    { key: 'ordem', size: 10 },
  ],
);

console.log('\n📁 Coleção: Mídia');
await criarColecao(
  process.env.APPWRITE_MIDIA_COLLECTION_ID || 'midia',
  'Mídia',
  [
    { key: 'titulo', size: 256, required: true },
    { key: 'tipo', size: 16, required: true },
    { key: 'arquivo', size: 512 },
    { key: 'categoria', size: 128 },
    { key: 'tags', size: 512 },
    { key: 'saberes_relacionados', size: 1024 },
    { key: 'criado_em', size: 64 },
  ],
);

console.log('\n📁 Coleção: Contatos');
await criarColecao(
  process.env.APPWRITE_CONTATOS_COLLECTION_ID || 'contatos',
  'Contatos',
  [
    { key: 'nome', size: 256, required: true },
    { key: 'email', size: 256, required: true },
    { key: 'assunto', size: 512 },
    { key: 'mensagem', size: 4096, required: true },
    { key: 'lido', size: 8 },
    { key: 'criado_em', size: 64 },
  ],
);

console.log('\n📁 Coleção: Usuários Dados');
await criarColecao(
  process.env.APPWRITE_USUARIOS_COLLECTION_ID || 'usuarios_dados',
  'Usuários Dados',
  [
    { key: 'user_id', size: 128, required: true },
    { key: 'nome_exibicao', size: 256 },
    { key: 'favoritos', size: 4096 },
    { key: 'progresso', size: 8192 },
    { key: 'anotacoes', size: 16384 },
    { key: 'criado_em', size: 64 },
    { key: 'atualizado_em', size: 64 },
  ],
  [
    { key: 'idx_user', attributes: ['user_id'], orders: ['ASC'] },
  ],
);

console.log('\n✅ Configuração concluída!\n');
console.log('Agora execute: npm run migrate');
