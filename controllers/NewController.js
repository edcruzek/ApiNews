const { Op } = require('sequelize');
const { New, Category, State, User } = require('../models');
const include = [{ model: Category, as: 'categoria' }, { model: State, as: 'estado' }, { model: User, as: 'autor', attributes: ['id', 'nombre', 'apellido'] }];
const owned = (req, row) => req.user.perfil.nombre === 'Administrador' || row.usuario_id === req.user.id;
const fields = b => ({ titulo: b.titulo, contenido: b.contenido, imagen: b.imagen || null, categoria_id: b.categoria_id, estado_id: b.estado_id });
module.exports = {
  list: async (req, res) => { const where = { estatus: 'aprobada' }; if (req.query.categoria_id) where.categoria_id = req.query.categoria_id; if (req.query.estado_id) where.estado_id = req.query.estado_id; if (req.query.q) where.titulo = { [Op.like]: `%${req.query.q}%` }; res.json(await New.findAll({ where, include, limit: 100, order: [['id', 'DESC']] })); },
  management: async (req, res) => { const where = req.user.perfil.nombre === 'Administrador' ? {} : { usuario_id: req.user.id }; res.json(await New.findAll({ where, include, limit: 100, order: [['id', 'DESC']] })); },
  one: async (req, res) => { const row = await New.findOne({ where: { id: req.params.id, estatus: 'aprobada' }, include }); return row ? res.json(row) : res.status(404).json({ error: 'La noticia no existe o no está aprobada.' }); },
  create: async (req, res) => { const row = await New.create({ ...fields(req.body), usuario_id: req.user.id, estatus: 'pendiente' }); res.status(201).json(await New.findByPk(row.id, { include })); },
  update: async (req, res) => { const row = await New.findByPk(req.params.id); if (!row) return res.status(404).json({ error: 'Noticia no encontrada.' }); if (!owned(req, row)) return res.status(403).json({ error: 'Solo el autor o un administrador puede modificarla.' }); await row.update({ ...fields(req.body), estatus: 'pendiente' }); res.json(await New.findByPk(row.id, { include })); },
  moderate: async (req, res) => { const row = await New.findByPk(req.params.id); if (!row) return res.status(404).json({ error: 'Noticia no encontrada.' }); await row.update({ estatus: req.body.estatus }); res.json(await New.findByPk(row.id, { include })); },
  remove: async (req, res) => { const row = await New.findByPk(req.params.id); if (!row) return res.status(404).json({ error: 'Noticia no encontrada.' }); if (!owned(req, row)) return res.status(403).json({ error: 'No tienes permiso para eliminarla.' }); await row.destroy(); res.status(204).end(); },
};
