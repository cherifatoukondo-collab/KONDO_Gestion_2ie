const resultatModel = require("../models/resultatModel");

const getAllResultats = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await resultatModel.findAll(page, limit);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllResultats };
