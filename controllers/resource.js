// Factoría compartida: cada controlador elige modelo y campos; no copia la lógica CRUD.
function resource(model, fields) {
  const data = body => Object.fromEntries(fields.filter(key => body[key] !== undefined).map(key => [key, body[key]]));
  return {
    list: async (req, res) => res.json(await model.findAll({ order: [['id', 'ASC']] })),
    one: async (req, res) => { const row = await model.findByPk(req.params.id); return row ? res.json(row) : res.status(404).json({ error: 'No existe ese registro.' }); },
    create: async (req, res) => res.status(201).json(await model.create(data(req.body))),
    update: async (req, res) => { const row = await model.findByPk(req.params.id); if (!row) return res.status(404).json({ error: 'No existe ese registro.' }); res.json(await row.update(data(req.body))); },
    remove: async (req, res) => { const row = await model.findByPk(req.params.id); if (!row) return res.status(404).json({ error: 'No existe ese registro.' }); await row.destroy(); res.status(204).end(); },
  };
}
module.exports = resource;
