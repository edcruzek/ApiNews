const { Profile } = require('../models');
const controller = require('./resource')(Profile, ['nombre']);
const reserved = new Set(['Administrador', 'Contribuidor']);
const baseUpdate = controller.update, baseRemove = controller.remove;
controller.update = async (req, res) => {
  const row = await Profile.findByPk(req.params.id);
  if (row && reserved.has(row.nombre) && row.nombre !== req.body.nombre) return res.status(409).json({ error: 'El nombre de los perfiles de acceso del curso es reservado.' });
  return baseUpdate(req, res);
};
controller.remove = async (req, res) => {
  const row = await Profile.findByPk(req.params.id);
  if (row && reserved.has(row.nombre)) return res.status(409).json({ error: 'Los perfiles Administrador y Contribuidor son necesarios para la API.' });
  return baseRemove(req, res);
};
module.exports = controller;
