import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RAIZ_PROJETO = resolve(__dirname, "..");
const BASE_AUDIOS = "/media/lz-ntn/5109c857-645d-40f2-a6c5-36c96cb83473/@home/lzntn/Público/multimidia/audios-lz";
const BASE_VIDEOS = "/media/lz-ntn/5109c857-645d-40f2-a6c5-36c96cb83473/@home/lzntn/Público/multimidia/videos-lz";

cloudinary.config({
 cloud_name: "deblzssiw",
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadArquivo(caminhoLocal, publicId) {
 if (!existsSync(caminhoLocal)) {
   return { status: "pulado", motivo: "arquivo não encontrado" };
 }
 try {
   const result = await cloudinary.uploader.upload(caminhoLocal, {
     public_id: publicId,
     resource_type: "video",
     overwrite: true,
     invalidate: true,
     chunked: true,
   });
   return { status: "ok", result };
 } catch (err) {
   return { status: "erro", motivo: err.message };
 }
}

async function main() {
 if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
   console.error("ERRO: Defina as variáveis CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET");
   process.exit(1);
 }

 const dados = JSON.parse(await readFile(resolve(RAIZ_PROJETO, "database/dados-unificados.json"), "utf-8"));

 const fila = [];

 for (const audio of dados.midia.audios) {
   const caminho = resolve(BASE_AUDIOS, audio.arquivo);
   const publicId = `audios/${audio.arquivo.replace(/\.\w+$/, "")}`;
   fila.push({ tipo: "audio", titulo: audio.titulo, caminho, publicId });
 }

 for (const video of dados.midia.videos) {
   const caminho = resolve(BASE_VIDEOS, video.arquivo);
   const publicId = `videos/${video.arquivo.replace(/\.\w+$/, "")}`;
   fila.push({ tipo: "video", titulo: video.titulo, caminho, publicId });
 }

 const CONCORRENCIA = 3;
 for (let i = 0; i < fila.length; i += CONCORRENCIA) {
   const lote = fila.slice(i, i + CONCORRENCIA);
   const resultados = await Promise.all(
     lote.map(item =>
       uploadArquivo(item.caminho, item.publicId).then(res => ({
         ...item,
         ...res,
       }))
     )
   );
   for (const r of resultados) {
     const icone = r.status === "ok" ? "OK" : r.status === "pulado" ? "~" : "ERRO";
     console.log(`[${icone}] ${r.tipo} - ${r.titulo}`);
     if (r.status === "erro") console.log(`       motivo: ${r.motivo}`);
   }
 }

 console.log("\n=== FINALIZADO ===");
}

main().catch(console.error);
