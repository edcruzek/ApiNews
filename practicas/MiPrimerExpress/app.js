const express = require('express');
const app = express();
app.use((req, res, next) => { console.log('SE HA REALIZADO UNA SOLICITUD'); res.set('X-Practica', 'Middleware ejecutado'); next(); });
app.get('/', (req, res) => res.json({ mensaje: 'Mi primer servidor Express', metodo: req.method }));
app.get('/home', (req, res) => res.json({ mensaje: 'Esta es la ruta home' }));
app.get('/error', (req, res, next) => { const error = new Error('SERVIDOR EN MANTENIMIENTO'); error.status = 503; next(error); });
app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
if (require.main === module) app.listen(3101, () => console.log('MiPrimerExpress en http://localhost:3101'));
module.exports = app;
