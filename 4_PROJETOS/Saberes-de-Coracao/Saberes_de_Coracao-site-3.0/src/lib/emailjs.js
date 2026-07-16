import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../.env') });

export async function enviarEmailContato({ nome, email, assunto, mensagem }) {
  const templateParams = {
    from_name: nome,
    from_email: email,
    subject: assunto || `Contato de ${nome}`,
    message: mensagem,
    to_name: 'Saberes de Coração',
    reply_to: email,
  };

  try {
    const { createRequire } = await import('node:module');
    const require = createRequire(import.meta.url);
    const emailjs = require('@emailjs/nodejs/cjs/index.js');
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      },
    );

    return { ok: true, status: result.status };
  } catch (err) {
    console.error('Erro EmailJS:', err);
    throw new Error('Falha ao enviar email');
  }
}
