const { Router } = require('express');
const { body, validate } = require('../validators/common');
const { authenticate } = require('../middlewares/auth');
const c = require('../controllers/AuthController');
const r = Router();
// Un límite sencillo por IP evita repetir indefinidamente intentos de contraseña.
const attempts = new Map();
function limit(req, res, next) {
  const key = req.ip; const now = Date.now(); let entry = attempts.get(key);
  if (!entry || now - entry.start > 60000) { if (attempts.size > 1000) attempts.clear(); entry = { start: now, count: 0 }; attempts.set(key, entry); }
  if (++entry.count > 30) return res.status(429).json({ error: 'Demasiados intentos. Espera un minuto.' });
  next();
}
r.post('/registro', limit, require('../validators/UserValidator'), validate, c.register);
r.post('/login', limit, body('correo').isEmail().bail().trim().toLowerCase(), body('password').isString().isLength({ min: 1, max: 100 }), validate, c.login);
r.get('/yo', authenticate, c.me);
module.exports = r;
