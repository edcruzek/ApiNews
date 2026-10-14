const { Router } = require('express');
const { body, param, query, validationResult } = require('express-validator');
const r = Router(); const sessions = new Map();
const iniciales = () => [{ id: 1, nombre: 'Math Jhon', edad: 25 }, { id: 2, nombre: 'Ana', edad: 22 }, { id: 3, nombre: 'Luis', edad: 30 }, { id: 4, nombre: 'María', edad: 19 }, { id: 5, nombre: 'Carlos', edad: 28 }];
r.use((req, res, next) => {
  const header = req.get('X-Demo-Session') || 'anonimo';
  const key = /^[a-zA-Z0-9-]{7,80}$/.test(header) ? header : 'anonimo';
  if (!sessions.has(key)) { if (sessions.size >= 100) sessions.delete(sessions.keys().next().value); sessions.set(key, { usuarios: iniciales(), siguiente: 6 }); }
  req.practica = sessions.get(key); next();
});
function valid(req, res, next) { const errors = validationResult(req); return errors.isEmpty() ? next() : res.status(422).json({ error: 'Datos inválidos.', detalles: errors.array().map(({ path, msg }) => ({ campo: path, mensaje: msg })) }); }
const id = param('id').isInt({ min: 1 }).toInt();
r.get('/', query('edadMin').optional().isInt({ min: 0, max: 120 }), query('q').optional().isString().isLength({ max: 80 }), valid, (req, res) => res.json(req.practica.usuarios.filter(u => (!req.query.q || u.nombre.toLowerCase().includes(req.query.q.toLowerCase())) && (!req.query.edadMin || u.edad >= Number(req.query.edadMin)))));
r.post('/', body('nombre').isString().bail().trim().isLength({ min: 2, max: 80 }), body('edad').isInt({ min: 0, max: 120 }).toInt(), valid, (req, res) => { const user = { id: req.practica.siguiente++, nombre: req.body.nombre, edad: req.body.edad }; req.practica.usuarios.push(user); res.status(201).json(user); });
r.get('/:id', id, valid, (req, res) => { const user = req.practica.usuarios.find(u => u.id === req.params.id); return user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado.' }); });
r.delete('/:id', id, valid, (req, res) => { const index = req.practica.usuarios.findIndex(u => u.id === req.params.id); if (index < 0) return res.status(404).json({ error: 'Usuario no encontrado.' }); req.practica.usuarios.splice(index, 1); res.status(204).end(); });
module.exports = r;
