const crypto = require('node:crypto');
const sessions = new Map();
function logger(req, res, next) {
  console.log('SE HA REALIZADO UNA SOLICITUD');
  const session = /^[a-zA-Z0-9-]{8,80}$/.test(req.get('X-Demo-Session') || '') ? req.get('X-Demo-Session') : 'sin-sesion';
  const id = crypto.randomUUID();
  res.set('X-Request-Id', id); res.set('X-Curso-Middleware', 'SE HA REALIZADO UNA SOLICITUD');
  res.on('finish', () => {
    if (session === 'sin-sesion' || req.path.endsWith('/solicitudes')) return;
    if (!sessions.has(session)) { if (sessions.size >= 100) sessions.delete(sessions.keys().next().value); sessions.set(session, []); }
    const list = sessions.get(session);
    list.unshift({ id, hora: new Date().toISOString(), metodo: req.method, ruta: req.path, estado: res.statusCode, mensaje: 'SE HA REALIZADO UNA SOLICITUD' });
    if (list.length > 40) list.pop();
  });
  next();
}
function getLogs(req, res) { res.json(sessions.get(req.get('X-Demo-Session')) || []); }
module.exports = { logger, getLogs };
