const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { User, Profile, State } = require('../models');
const includes = [{ model: Profile, as: 'perfil' }, { model: State, as: 'estado' }];
async function register(req, res) {
  const profile = await Profile.findOne({ where: { nombre: 'Contribuidor' } });
  if (!profile) return res.status(503).json({ error: 'Falta configurar los perfiles de la API.' });
  const { nombre, apellido, correo, password, estado_id } = req.body;
  const user = await User.create({ nombre, apellido, correo, estado_id, perfil_id: profile.id, password_hash: await bcrypt.hash(password, 12) });
  res.status(201).json({ mensaje: 'Registro completado. Ya puedes iniciar sesión.', usuario: await User.findByPk(user.id, { include: includes }) });
}
async function login(req, res) {
  const user = await User.scope('conPassword').findOne({ where: { correo: req.body.correo }, include: includes });
  if (!user || !user.activo || !(await bcrypt.compare(req.body.password, user.password_hash))) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
  const token = jwt.sign({}, config.jwtSecret, { subject: String(user.id), algorithm: 'HS256', expiresIn: config.jwtExpires, issuer: 'ApiNews', audience: 'curso-express' });
  res.json({ token, tipo: 'Bearer', usuario: await User.findByPk(user.id, { include: includes }) });
}
module.exports = { register, login, me: async (req, res) => res.json(await User.findByPk(req.user.id, { include: includes })) };
