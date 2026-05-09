const etudiantModel = require("../models/etudiantModel");

const getAllEtudiants = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Paramètres de pagination invalides. Page >= 1, limit entre 1 et 100."
      });
    }

    const result = await etudiantModel.findAll(page, limit);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const getEtudiantById = async (req, res, next) => {
  try {
    const etudiant = await etudiantModel.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouve." });
    }
    return res.json(etudiant);
  } catch (error) {
    return next(error);
  }
};

const createEtudiant = async (req, res, next) => {
  try {
    const id = await etudiantModel.create(req.body);
    const created = await etudiantModel.findById(id);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
};

const updateEtudiant = async (req, res, next) => {
  try {
    const updated = await etudiantModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Etudiant non trouve." });
    }
    const etudiant = await etudiantModel.findById(req.params.id);
    return res.json(etudiant);
  } catch (error) {
    return next(error);
  }
};

const deleteEtudiant = async (req, res, next) => {
  try {
    const deleted = await etudiantModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Etudiant non trouve." });
    }
    return res.json({ message: "Etudiant supprime avec succes." });
  } catch (error) {
    return next(error);
  }
};

const getEtudiantStats = async (_req, res, next) => {
  try {
    const stats = await etudiantModel.getStats();
    return res.json(stats);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllEtudiants, getEtudiantById, createEtudiant, updateEtudiant, deleteEtudiant, getEtudiantStats };
