const { Router } = require('express');
const r = Router();
r.get('/usuarios/:id', (req, res) => res.json({ origen: 'req.params', recibido: req.params.id, explicacion: 'El ID ocupa un segmento de la URL.' }));
r.get('/busqueda', (req, res) => res.json({ origen: 'req.query', recibido: req.query, explicacion: 'Los filtros van después del signo de interrogación.' }));
r.post('/usuarios', (req, res) => res.status(201).json({ origen: 'req.body', recibido: req.body, explicacion: 'express.json convierte el cuerpo JSON en un objeto.' }));
module.exports = r;
