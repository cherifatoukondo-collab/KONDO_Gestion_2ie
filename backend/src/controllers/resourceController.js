const createResourceController = (model, name = "Ressource") => {
  const notFoundMessage = `${name} non trouvée.`;

  const getAll = async (_req, res, next) => {
    try {
      const items = await model.findAll();
      return res.json(items);
    } catch (error) {
      return next(error);
    }
  };

  const getById = async (req, res, next) => {
    try {
      const item = await model.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: notFoundMessage });
      }
      return res.json(item);
    } catch (error) {
      return next(error);
    }
  };

  const create = async (req, res, next) => {
    try {
      const id = await model.create(req.body);
      const created = await model.findById(id);
      return res.status(201).json(created);
    } catch (error) {
      return next(error);
    }
  };

  const update = async (req, res, next) => {
    try {
      const updated = await model.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: notFoundMessage });
      }
      const item = await model.findById(req.params.id);
      return res.json(item);
    } catch (error) {
      return next(error);
    }
  };

  const remove = async (req, res, next) => {
    try {
      const deleted = await model.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: notFoundMessage });
      }
      return res.json({ message: `${name} supprimée avec succès.` });
    } catch (error) {
      return next(error);
    }
  };

  return { getAll, getById, create, update, remove };
};

module.exports = createResourceController;
