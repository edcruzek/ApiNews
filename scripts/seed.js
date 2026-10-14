const bcrypt = require('bcryptjs');
const config = require('../config');
const { sequelize, Profile, State, Category, User, New } = require('../models');
async function seed() {
  const [adminProfile] = await Profile.findOrCreate({ where: { nombre: 'Administrador' } });
  await Profile.findOrCreate({ where: { nombre: 'Contribuidor' } });
  const states = [];
  for (const nombre of ['Yucatán', 'Campeche', 'Quintana Roo', 'Jalisco', 'Ciudad de México']) states.push((await State.findOrCreate({ where: { nombre } }))[0]);
  const categories = [];
  for (const [nombre, descripcion] of [['Tecnología', 'Software y herramientas digitales'], ['Ciencia', 'Investigación y aprendizaje'], ['Cultura', 'Arte y comunidad']]) categories.push((await Category.findOrCreate({ where: { nombre }, defaults: { descripcion } }))[0]);
  if (config.adminPassword) {
    const [admin] = await User.findOrCreate({ where: { correo: 'admin@curso.local' }, defaults: {
      nombre: 'Administrador', apellido: 'Curso', password_hash: await bcrypt.hash(config.adminPassword, 12), perfil_id: adminProfile.id, estado_id: states[0].id,
    } });
    for (const [titulo, contenido, categoria_id, estado_id] of [
      ['Aprender Express por bloques', 'Una solicitud pasa por las rutas, validaciones y controladores antes de recibir la respuesta.', categories[0].id, states[0].id],
      ['La ciencia de probar una API', 'Comprobar casos válidos e inválidos permite encontrar errores antes de publicar.', categories[1].id, states[1].id],
      ['Lectura y comunidad', 'La API organiza noticias por categorías, estados y autores.', categories[2].id, states[2].id],
    ]) await New.findOrCreate({ where: { titulo }, defaults: { contenido, categoria_id, estado_id, usuario_id: admin.id, estatus: 'aprobada' } });
  }
}
if (require.main === module) sequelize.sync().then(seed).then(() => sequelize.close()).catch(e => { console.error(e.message); process.exitCode = 1; });
module.exports = seed;
