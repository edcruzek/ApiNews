const { body, name } = require('./common');
module.exports = [name('nombre'), name('apellido'), body('correo').isEmail().withMessage('Escribe un correo válido.').bail().trim().toLowerCase(),
  body('password').isString().bail().isLength({ min: 8, max: 100 }).withMessage('La contraseña debe tener de 8 a 100 caracteres.'),
  body('estado_id').isInt({ min: 1 }).withMessage('Selecciona un estado.').toInt()];
