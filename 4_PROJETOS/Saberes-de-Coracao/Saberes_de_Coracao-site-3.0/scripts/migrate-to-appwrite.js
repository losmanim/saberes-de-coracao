import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import {
  Client,
  Databases,
  ID,
} from 'node-appwrite';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const db = new Databases(client);

const DB_ID = process.env.APPWRITE_DATABASE_ID;
const COL_SABERES = process.env.APPWRITE_SABERES_COLLECTION_ID || 'saberes';
const COL_CATEGORIAS = process.env.APPWRITE_CATEGORIAS_COLLECTION_ID || 'categorias';
const COL_MIDIA = process.env.APPWRITE_MIDIA_COLLECTION_ID || 'midia';

async function migrar() {
  console.log('\n🚀 Iniciando migração JSON → Appwrite Database...\n');

  const caminhoJson = resolve(__dirname, '../data/dados-unificados.json');
  const raw = await readFile(caminhoJson, 'utf-8');
  const dados = JSON.parse(raw);

  console.log(`📄 JSON carregado: versão ${dados.meta?.versao || '?'}`);
  console.log(`   ${dados.categorias?.length || 0} categorias`);
  console.log(`   ${dados.saberes?.length || 0} saberes`);
  console.log(`   ${dados.midia?.audios?.length || 0} áudios`);
  console.log(`   ${dados.midia?.videos?.length || 0} vídeos\n`);

  // 1. Migrar Categorias
  if (dados.categorias) {
    console.log('📁 Migrando categorias...');
    for (const cat of dados.categorias) {
      try {
        await db.createDocument(DB_ID, COL_CATEGORIAS, ID.unique(), {
          nome: cat.nome,
          slug: cat.slug,
          descricao: cat.descricao,
          cor: cat.cor,
          icone: cat.icone,
          ordem: String(cat.id),
        });
        console.log(`  ✅ ${cat.nome}`);
      } catch (e) {
        if (e.code === 409) console.log(`  ⚠️ ${cat.nome} já existe`);
        else console.error(`  ❌ ${cat.nome}: ${e.message}`);
      }
    }
  }

  // 2. Migrar Saberes
  if (dados.saberes) {
    console.log('\n📁 Migrando saberes...');
    for (const saber of dados.saberes) {
      try {
        const doc = {
          titulo: saber.titulo || '',
          slug: saber.slug || '',
          descricao: saber.descricao || '',
          categoria_id: String(saber.categoria_id || 1),
          nivel: saber.nivel || 'iniciante',
          duracao: String(saber.duracao || 15),
          fonte: saber.fonte || '',
          licenca: saber.licenca || 'Domínio Público',
          tags: saber.tags?.join(',') || '',
          conteudo: JSON.stringify(saber.conteudo || {}),
          praticas: JSON.stringify(saber.praticas || []),
          conexoes: saber.conexoes?.join(',') || '',
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        };
        await db.createDocument(DB_ID, COL_SABERES, ID.unique(), doc);
        console.log(`  ✅ ${saber.titulo}`);
      } catch (e) {
        console.error(`  ❌ ${saber.titulo}: ${e.message}`);
      }
    }
  }

  // 3. Migrar Mídia
  if (dados.midia) {
    console.log('\n📁 Migrando mídia...');
    const migrarItem = (item, tipo) => {
      if (!item || !item.id) return;
      const doc = {
        titulo: item.titulo || '',
        tipo,
        arquivo: item.arquivo || '',
        categoria: item.categoria || '',
        tags: item.tags?.join(',') || '',
        criado_em: new Date().toISOString(),
      };
      if (item.saberes_relacionados?.length) {
        doc.saberes_relacionados = item.saberes_relacionados.join(',');
      }
      return doc;
    };

    for (const audio of dados.midia.audios || []) {
      try {
        await db.createDocument(DB_ID, COL_MIDIA, ID.unique(), migrarItem(audio, 'audio'));
        console.log(`  ✅ Áudio: ${audio.titulo}`);
      } catch (e) {
        console.error(`  ❌ Áudio ${audio.titulo}: ${e.message}`);
      }
    }

    for (const video of dados.midia.videos || []) {
      try {
        await db.createDocument(DB_ID, COL_MIDIA, ID.unique(), migrarItem(video, 'video'));
        console.log(`  ✅ Vídeo: ${video.titulo}`);
      } catch (e) {
        console.error(`  ❌ Vídeo ${video.titulo}: ${e.message}`);
      }
    }
  }

  console.log('\n✅ Migração concluída!\n');
}

migrar().catch(console.error);
