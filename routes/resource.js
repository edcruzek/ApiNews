const { Router } = require('express');
const { authenticate, administrator } = require('../middlewares/auth');
const { id, validate } = require('../validators/common');
module.exports = (controller, rules) => {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', id, validate, controller.one);
  router.post('/', authenticate, administrator, rules, validate, controller.create);
  router.put('/:id', authenticate, administrator, id, rules, validate, controller.update);
  router.delete('/:id', authenticate, administrator, id, validate, controller.remove);
  return router;
};
