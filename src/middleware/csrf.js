export function csrfProtection(req, res, next) {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = (req.headers['origin'] || req.headers['referer'] || '').replace(/\/$/, '');
    const allowedOrigins = (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim());
    const permitido = allowedOrigins.some(a => {
      if (a === '*') return true;
      return origin.startsWith(a.replace(/\/$/, ''));
    });
    if (!permitido) {
      return res.status(403).json({ erro: 'Requisição rejeitada por segurança.' });
    }
  }
  next();
}
