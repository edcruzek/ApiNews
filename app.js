const express = require('express');
const cors = require('cors');
const path = require('node:path');
const config = require('./config');
const { sequelize } = require('./models');
const { logger } = require('./middlewares/logger');
function createApp() {
  const app = express(); app.disable('x-powered-by');
  app.use(logger);
  app.use(cors({ origin: config.corsOrigins.length ? config.corsOrigins : true, exposedHeaders: ['X-Request-Id', 'X-Curso-Middleware'] }));
  app.use(express.json({ limit: '2mb' }));
  app.get('/api/salud', async (req, res) => { await sequelize.authenticate(); res.json({ estado: 'ok', framework: 'Express', base: 'MySQL', fecha: new Date().toISOString() }); });
  app.get('/api/info', (req, res) => res.json({ base: 'MySQL', entorno: config.production ? 'producción' : 'local', curso: 'Express y ApiNews', demoLocal: !config.production && config.seedDemo, demoCorreo: !config.production && config.seedDemo ? 'admin@curso.local' : null }));
  app.use('/api/practicas', require('./routes/PracticeRoute'));
  app.use('/api/usuarios-practica', require('./practicas/PracticaInformacionRutas/routes/UserRoute'));
  app.use('/api/teoria', require('./practicas/TeoriaInformacionRutas/routes/UserRoute'));
  app.use('/api/auth', require('./routes/AuthRoute'));
  app.use('/api/perfiles', require('./routes/ProfileRoute'));
  app.use('/api/categorias', require('./routes/CategoryRoute'));
  app.use('/api/estados', require('./routes/StateRoute'));
  app.use('/api/usuarios', require('./routes/UserRoute'));
  app.use('/api/noticias', require('./routes/NewRoute'));
  const swagger = require('swagger-ui-express');
  app.use('/docs', swagger.serve, swagger.setup(require('./docs/openapi.json')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));
  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'El cuerpo no contiene JSON válido.' });
    if (err.type === 'entity.too.large') return res.status(413).json({ error: 'El cuerpo supera el límite de 2 MB.' });
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ error: 'Ya existe un registro con ese dato único.' });
    if (err.name === 'SequelizeForeignKeyConstraintError') return res.status(409).json({ error: 'Revisa los IDs relacionados. No puedes eliminar registros que siguen en uso.' });
    if (err.status === 503) return res.status(503).json({ error: 'SERVIDOR EN MANTENIMIENTO' });
    console.error('Error de API:', err.name);
    res.status(500).json({ error: 'No se pudo completar la operación.' });
  });
  return app;
}
async function start() {
  await sequelize.authenticate();
  // sync crea las tablas que falten sin borrar ni alterar los datos existentes.
  await sequelize.sync();
  if (config.seedDemo) await require('./scripts/seed')();
  const app = createApp();
  const server = app.listen(config.port, '0.0.0.0', () => console.log(`Curso Express en http://localhost:${config.port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close(() => sequelize.close().then(() => process.exit(0))));
  return server;
}
if (require.main === module) start().catch(err => { console.error('No se pudo iniciar ApiNews:', err.name, err.message); process.exitCode = 1; });
module.exports = { createApp, start };
