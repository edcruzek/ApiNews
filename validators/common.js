const { body, param, validationResult } = require('express-validator');
const id = param('id').isInt({ min: 1 }).withMessage('El ID debe ser un entero positivo.').toInt();
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: 'Revisa los datos enviados.', detalles: errors.array().map(({ path, msg }) => ({ campo: path, mensaje: msg })) });
  next();
}
const name = field => body(field).isString().withMessage('Debe ser texto.').bail().trim().isLength({ min: 2, max: 100 }).withMessage('Usa entre 2 y 100 caracteres.');
module.exports = { body, id, validate, name };
