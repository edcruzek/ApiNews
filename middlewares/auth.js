const jwt = require('jsonwebtoken');
const config = require('../config');
const { User, Profile } = require('../models');
async function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Debes iniciar sesión y enviar el token Bearer.' });
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret, { algorithms: ['HS256'], issuer: 'ApiNews', audience: 'curso-express' });
    const user = await User.findByPk(payload.sub, { include: { model: Profile, as: 'perfil' } });
    if (!user || !user.activo) return res.status(401).json({ error: 'La cuenta ya no está disponible.' });
    req.user = user; next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' || error.name === 'NotBeforeError') return res.status(401).json({ error: 'Token inválido o vencido. Inicia sesión otra vez.' });
    next(error);
  }
}
function administrator(req, res, next) {
  if (req.user.perfil.nombre !== 'Administrador') return res.status(403).json({ error: 'Esta operación requiere perfil Administrador.' });
  next();
}
module.exports = { authenticate, administrator };
