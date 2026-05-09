const ecoleModel = require("../models/ecoleModel");

const getAllEcoles = async (_req, res, next) => {
  try {
    const ecoles = await ecoleModel.findAll();
    return res.json(ecoles);
  } catch (error) {
    return next(error);
  }
};

const getEcoleById = async (req, res, next) => {
  try {
    const ecole = await ecoleModel.findById(req.params.id);
    if (!ecole) {
      return res.status(404).json({ message: "École non trouvée." });
    }
    return res.json(ecole);
  } catch (error) {
    return next(error);
  }
};

const getEcoleStudents = async (req, res, next) => {
  try {
    const students = await ecoleModel.findStudentsById(req.params.id);
    return res.json(students);
  } catch (error) {
    return next(error);
  }
};

const createEcole = async (req, res, next) => {
  try {
    const id = await ecoleModel.create(req.body);
    const created = await ecoleModel.findById(id);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
};

const updateEcole = async (req, res, next) => {
  try {
    const updated = await ecoleModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "École non trouvée." });
    }
    const ecole = await ecoleModel.findById(req.params.id);
    return res.json(ecole);
  } catch (error) {
    return next(error);
  }
};

const deleteEcole = async (req, res, next) => {
  try {
    const deleted = await ecoleModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "École non trouvée." });
    }
    return res.json({ message: "École supprimée avec succès." });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAllEcoles, getEcoleById, getEcoleStudents, createEcole, updateEcole, deleteEcole };
