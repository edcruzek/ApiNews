const { body, name } = require('./common');
module.exports = [name('nombre'), body('descripcion').optional().isString().isLength({ max: 2000 })];
