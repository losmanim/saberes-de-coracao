import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    versao: '4.0.0',
    modo: !!(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY && process.env.APPWRITE_DATABASE_ID) ? 'appwrite' : 'json',
    emailjs: !!(process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY),
  });
});

export default router;
