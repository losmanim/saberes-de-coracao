import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'dados-unificados.json');
const EXTRACTED_PATH = path.join(__dirname, '..', 'data', 'apocrifos-extraidos.json');
const BACKUP_PATH = path.join(__dirname, '..', 'data', 'dados-unificados-backup.json');

// Matching map: existing slug -> extracted entry
const MATCH_MAP = {
  'testamento-nephtali-bondade': 'testamento-de-nephtali-da-bondade',
  'testamento-nephtali-jerchmeel': 'testamento-de-nephtali-segundo-jerchmeel',
  'assuncao-moises': 'assuncao-de-moises',
  'historia-jose-carpinteiro': 'historia-de-jose-carpinteiro',
  'evangelho-da-verdade': 'evangelho-da-verdade',
  'evangelho-segundo-felipe': 'evangelho-segundo-felipe',
  'proto-evangelho-de-tiago': 'proto-evangelho-de-tiago-natividade-de-maria',
  'testamento-de-abraao': 'o-testamento-de-abraao',
  'oracao-de-manasses': 'oracao-de-manasses',
  'apocalipse-de-adao': 'apocalipse-de-adao',
  'evangelho-pseudo-tome': 'evangelho-pseudo-tome-infancia-do-senhor',
};

function main() {
  console.log('Lendo dados existentes...');
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8'));

  // Backup
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Backup salvo: ${BACKUP_PATH}`);

  // Map extracted slugs to entries
  const extBySlug = {};
  for (const ext of extracted) {
    extBySlug[ext.slug] = ext;
  }

  // Separate existing saberes into apocrypha and non-apocrypha
  const nonApocSaberes = data.saberes.filter(s => s.categoria_id !== 6);
  const oldApocSaberes = data.saberes.filter(s => s.categoria_id === 6);

  console.log(`Saberes existentes: ${data.saberes.length} (${nonApocSaberes.length} nao-apocrifos + ${oldApocSaberes.length} apocrifos)`);
  console.log(`Extraidos: ${extracted.length}`);

  // Update existing apocrypha entries with full content from extracted
  const newApocSaberes = [];
  const usedSlugs = new Set();

  for (const old of oldApocSaberes) {
    const matchSlug = MATCH_MAP[old.slug];
    const ext = matchSlug ? extBySlug[matchSlug] : null;

    if (ext) {
      // Update content with the full extracted version
      old.conteudo.texto_integral = ext.conteudo.texto_integral;
      old.descricao = ext.descricao;
      old.tags = [...new Set([...old.tags, ...ext.tags])];
      delete old.conteudo.insight; // remove old insights, texto_integral is enough
      if (!old.conteudo.definicao && ext.conteudo.definicao) {
        old.conteudo.definicao = ext.conteudo.definicao;
      }
      newApocSaberes.push(old);
      usedSlugs.add(matchSlug);
      console.log(`  ATUALIZADO: ${old.titulo}`);
    } else {
      // Keep existing but mark
      newApocSaberes.push(old);
      console.log(`  MANTIDO: ${old.titulo} (sem correspondente)`);
    }
  }

  // Add NEW apocrypha entries (those not already matched)
  let newIdCounter = oldApocSaberes.length + 1;
  for (const ext of extracted) {
    if (usedSlugs.has(ext.slug)) continue;

    const newEntry = {
      id: `apoc-${String(newIdCounter).padStart(2, '0')}`,
      categoria_id: 6,
      titulo: ext.titulo,
      slug: ext.slug,
      descricao: ext.descricao,
      nivel: ext.nivel,
      duracao: ext.duracao,
      tags: ext.tags,
      fonte: ext.fonte || 'Evangelhos Apócrifos',
      licenca: ext.licenca || 'Domínio Público',
      conteudo: {
        texto_integral: ext.conteudo.texto_integral
      },
      conexoes: ext.conexoes || []
    };

    if (ext.conteudo.definicao) {
      newEntry.conteudo.definicao = ext.conteudo.definicao;
    }

    newApocSaberes.push(newEntry);
    usedSlugs.add(ext.slug);
    console.log(`  ADICIONADO: apoc-${String(newIdCounter).padStart(2, '0')} - ${ext.titulo}`);
    newIdCounter++;
  }

  // Combine back
  data.saberes = [...nonApocSaberes, ...newApocSaberes];

  // Update meta
  data.meta.versao = '5.0';
  data.meta.atualizado = new Date().toISOString().split('T')[0];
  data.meta.total_apocrifos = newApocSaberes.length;

  // Write
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\nFEITO! Total saberes: ${data.saberes.length} (${newApocSaberes.length} apocrifos)`);
}

main();
