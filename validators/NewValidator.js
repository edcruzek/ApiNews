const { body } = require('./common');
module.exports = [body('titulo').isString().bail().trim().isLength({ min: 5, max: 180 }).withMessage('El título debe tener de 5 a 180 caracteres.'),
  body('contenido').isString().bail().trim().isLength({ min: 10, max: 100000 }).withMessage('Escribe un contenido de al menos 10 caracteres.'),
  body('categoria_id').isInt({ min: 1 }).toInt(), body('estado_id').isInt({ min: 1 }).toInt(),
  body('imagen').optional({ values: 'falsy' }).isString().bail().isLength({ max: 1000000 })];
