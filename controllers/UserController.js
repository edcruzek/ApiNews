const bcrypt = require('bcryptjs');
const { User, Profile, State, New } = require('../models');
const include = [{ model: Profile, as: 'perfil' }, { model: State, as: 'estado' }, { model: New, as: 'noticias' }];
module.exports = {
  list: async (req, res) => res.json(await User.findAll({ include, order: [['id', 'ASC']] })),
  one: async (req, res) => { if (req.user.perfil.nombre !== 'Administrador' && req.user.id !== req.params.id) return res.status(403).json({ error: 'Solo puedes consultar tu cuenta.' }); const user = await User.findByPk(req.params.id, { include }); return user ? res.json(user) : res.status(404).json({ error: 'Usuario no encontrado.' }); },
  create: async (req, res) => { const { nombre, apellido, correo, password, estado_id } = req.body; const profile = await Profile.findOne({ where: { nombre: 'Contribuidor' } }); const user = await User.create({ nombre, apellido, correo, estado_id, perfil_id: profile.id, password_hash: await bcrypt.hash(password, 12) }); res.status(201).json(await User.findByPk(user.id, { include })); },
  update: async (req, res) => { const user = await User.findByPk(req.params.id); if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' }); const { nombre, apellido, correo, password, estado_id } = req.body; await user.update({ nombre, apellido, correo, estado_id, password_hash: await bcrypt.hash(password, 12) }); res.json(await User.findByPk(user.id, { include })); },
  remove: async (req, res) => { if (req.params.id === req.user.id) return res.status(409).json({ error: 'No elimines la cuenta con la que estás demostrando la API.' }); const user = await User.findByPk(req.params.id); if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' }); await user.destroy(); res.status(204).end(); },
};
