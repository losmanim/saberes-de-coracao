import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APOCRIFOS_PATH = '/run/media/lzntn/rootMX23/home/lz-ntn/Modelos/Cursos/Gnosis/docs/apocrifos.txt';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'apocrifos-extraidos.json');

// Each book starts at a page where the PDF marks "1" (new sub-document)
// These are the EXACT page array indices from the \f split
const BOOK_STARTS = [
  [4,    'Testamento de Nephtali — Da Bondade'],
  [10,   'Testamento de Nephtali — Segundo Jerchmeel'],
  [18,   'Assunção de Moisés'],
  [26,   'História de José Carpinteiro'],
  [49,   'Sabedoria Secreta de Cristo (Sofia de Jesus Cristo)'],
  [58,   'Vingança do Salvador'],
  [69,   'Agrapha (Ditos Extra-Evangelho)'],
  [76,   'Apocalipse das Semanas (Enoch)'],
  [82,   'Apocalipse de Abraão'],
  [106,  'Apocalipse de Adão'],
  [115,  'Apocalipse de Baruch'],
  [161,  'Apocalipse de Elias'],
  [172,  'Apocalipse de Moisés'],
  [184,  'Apocalipse de Paulo'],
  [187,  'Apocalipse de Pedro'],
  [195,  'Apocalipse de Tomé'],
  [198,  'Apologia de Aristides'],
  [210,  'Atos de Paulo e Tecla'],
  [218,  'Livro de Tomé, O Atleta'],
  [222,  'Apologia de Aristides (repetição)'],
  [234,  'Atos de Paulo e Tecla (repetição)'],
  [242,  'Livro de Tomé, O Atleta (repetição)'],
  [246,  'Carta de Herodes a Pilatos'],
  [249,  'Carta de Lentulus (Retrato de Jesus)'],
  [251,  'Carta de Pedro a Felipe'],
  [256,  'Carta de Pilatos a Tibério sobre Jesus'],
  [258,  'Carta de Tibério a Pilatos'],
  [261,  'Cartas de Pilatos a Herodes'],
  [264,  'Caverna dos Tesouros (Criação do Mundo)'],
  [334,  'Contos dos Patriarcas'],
  [342,  'Correspondência entre Abgaro e Jesus'],
  [346,  'Evangelho Apócrifo de João (versão longa)'],
  [366,  'Evangelho Apócrifo de Tiago'],
  [375,  'Declarações de José de Arimatéia'],
  [382,  'Didache — Ensino dos Doze Apóstolos'],
  [391,  'Discurso sobre o Domingo'],
  [396,  'Epístola de Policarpo aos Filipenses'],
  [403,  'Evangelho Árabe da Infância de Jesus'],
  [426,  'Evangelho da Verdade'],
  [439,  'Evangelho de Nicodemus (Descida de Cristo ao Inferno)'],
  [477,  'Evangelho de Pedro (Infância e Crucificação)'],
  [514,  'Evangelho Pseudo-Mateus da Infância'],
  [521,  'Evangelho Pseudo-Tomé (Infância do Senhor)'],
  [530,  'Evangelho Segundo Felipe'],
  [552,  'Evangelho Valentino'],
  [633,  'Excertos do Evangelho Armênio da Infância'],
  [638,  'José e Asenath'],
  [672,  'Julgamento e Condenação de Pilatos'],
  [676,  'Ascensão de Isaías'],
  [699,  'Livro de Enoque (1)'],
  [787,  'Apócrifos da Assunção — Livro de São João Evangelista'],
  [800,  'Livro dos Segredos de Enoque'],
  [830,  'Maria Madalena'],
  [833,  'Melquisedeque (Fragmentos)'],
  [840,  'Morte de Pilatos que Condenou Jesus'],
  [844,  'Narração do Dilúvio (Epopéia de Gilgamesh)'],
  [849,  'Evangelho de Tomé, o Contendor'],
  [857,  'O Hino da Pérola (Gnóstico)'],
  [862,  'O Livro de Enoque (2)'],
  [966,  'O Livro de Enoque (3)'],
  [1070, 'Livro de Melquisedeque (Pseudo-Epígrafo da Gênesis)'],
  [1125, 'O Livro de Melquisedeque'],
  [1198, 'O Livro dos Jubileus'],
  [1203, 'O Martírio de Isaías'],
  [1208, 'O Pastor de Hermas'],
  [1228, 'O Primeiro Apocalipse de Tiago'],
  [1239, 'O Primeiro Livro de Adão e Eva'],
  [1318, 'O Segundo Apocalipse de Tiago'],
  [1326, 'O Segundo Livro de Adão e Eva'],
  [1357, 'O Testamento de Abraão'],
  [1382, 'O Testamento de Simeão — Da Inveja'],
  [1387, 'Oração de Manassés'],
  [1390, 'Orações Mágicas dos Essênios'],
  [1393, 'Passagem da Bem-Aventurada Virgem Maria'],
  [1400, 'Pistis Sophia'],
  [1664, 'Primeira Carta de Clemente aos Coríntios'],
  [1745, 'Proto-Evangelho de Tiago (Natividade de Maria)'],
  [1760, 'Relatório de Pilatos a César Augusto'],
  [1764, 'Retrato do Salvador'],
  [1766, 'Salmo 151'],
  [1768, 'Salmos de Salomão'],
  [1789, 'Segunda Carta de Clemente aos Coríntios'],
  [1802, 'Sentença de Pilatos contra Jesus'],
  [1805, 'Sobre a Origem do Mundo (Gnóstico)'],
  [1825, 'Testamento de Aser — Do Duplo Aspecto da Maldade'],
  [1830, 'Testamento de Benjamim — Da Reta Intenção'],
  [1836, 'Testamento de Dan — Da Raiva e da Mentira'],
  [1840, 'Testamento de Gad — Do Ódio'],
  [1845, 'Testamento de Issacar — Da Simplicidade'],
  [1850, 'Testamento de José — Da Castidade'],
  [1859, 'Testamento de Judá — Da Valentia, Cobiça e Luxúria'],
  [1870, 'Testamento de Levi — Do Sacerdócio e Presunção'],
  [1880, 'Testamento de Rúben — Da Intenção'],
  [1885, 'Testamento de Zebulom — Da Compaixão e Misericórdia'],
  [1891, 'Testamento mais antigo de Levi (Fragmento aramaico)'],
  [1898, 'Atos de João (Evangelho Gnóstico de João)'],
];

function main() {
  console.log('Lendo apocrifos.txt...');
  const text = fs.readFileSync(APOCRIFOS_PATH, 'utf8');
  const pages = text.split('\x0c');
  console.log(`Total de paginas: ${pages.length}, Livros no catalogo: ${BOOK_STARTS.length}`);

  function cleanPage(raw) {
    let lines = raw.split('\n');
    if (lines[0] && /^\s*\d+\s*$/.test(lines[0])) lines.shift();
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    let t = lines.join('\n');
    t = t.replace(/(\w)-\n(\w)/g, '$1$2');
    t = t.replace(/^\d+\s*$/gm, '');
    t = t.replace(/\n{3,}/g, '\n\n');
    return t.trim();
  }

  const results = [];

  for (let b = 0; b < BOOK_STARTS.length; b++) {
    const [startIdx, rawTitle] = BOOK_STARTS[b];
    const endIdx = b < BOOK_STARTS.length - 1 ? BOOK_STARTS[b + 1][0] : pages.length;

    if (startIdx >= pages.length) {
      console.log(`  [INVALIDO] ${rawTitle} (start ${startIdx} > pages ${pages.length})`);
      continue;
    }

    const contentParts = [];
    for (let p = startIdx; p < endIdx; p++) {
      const cleaned = cleanPage(pages[p]);
      if (cleaned) contentParts.push(cleaned);
    }

    const fullContent = contentParts.join('\n\n').trim();
    if (!fullContent || fullContent.length < 100) {
      console.log(`  [CONT. INSUF.] ${rawTitle} (${fullContent.length} chars)`);
      continue;
    }

    // Clean title
    const title = rawTitle.replace(/ \(repetição\)$/, '');
    if (title !== rawTitle) {
      console.log(`  [DUPLICATA] ${title} — pulando`);
      continue;
    }

    // Generate description and tags
    const firstPara = fullContent.match(/^[^\n]{10,}/);
    const desc = firstPara ? firstPara[0].substring(0, 400) : title;

    const tags = ['apocrifo', 'evangelhos-apocrifos'];
    const tl = title.toLowerCase();
    if (tl.includes('apocalipse')) tags.push('apocalipse');
    if (tl.includes('testamento')) tags.push('testamento');
    if (tl.includes('evangelho')) tags.push('evangelho');
    if (tl.includes('carta')) tags.push('carta');
    if (tl.includes('epistola')) tags.push('epistola');
    if (tl.includes('oracao')) tags.push('oracao');
    if (tl.includes('atos')) tags.push('atos');
    if (tl.includes('enoch') || tl.includes('enoque')) tags.push('enoque');
    if (tl.includes('hermas')) tags.push('pastor');
    if (tl.includes('salmo')) tags.push('salmo');
    if (tl.includes('pistis') || tl.includes('sophia')) tags.push('pistis-sophia');
    if (tl.includes('diluvio') || tl.includes('gilgamesh')) tags.push('diluvio');

    const result = {
      id: `apoc-ext-${String(results.length + 1).padStart(2, '0')}`,
      categoria_id: 6,
      titulo: title,
      slug: toSlug(title),
      descricao: desc.substring(0, 500),
      nivel: 'avancado',
      duracao: Math.max(1, Math.ceil(fullContent.length / 3000)),
      tags: [...new Set(tags)],
      fonte: 'Evangelhos Apocrifos',
      licenca: 'Dominio Publico',
      conteudo: {
        definicao: '',
        texto_integral: fullContent
      },
      conexoes: []
    };

    results.push(result);
    console.log(`  OK ${title} (${(fullContent.length / 1024).toFixed(0)} KB, ${endIdx - startIdx} pag)`);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nFEITO! ${results.length} livros extraidos -> ${OUTPUT_PATH}`);
  console.log(`Tamanho total: ${(results.reduce((s, r) => s + r.conteudo.texto_integral.length, 0) / (1024*1024)).toFixed(1)} MB`);
}

function toSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

main();
