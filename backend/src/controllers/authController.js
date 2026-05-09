const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utilisateurModel = require("../models/utilisateurModel");

const sanitizeUser = (user) => ({
  id: user.id,
  nom: user.nom,
  email: user.email,
  created_at: user.created_at,
});

const register = async (req, res, next) => {
  try {
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
      return res.status(400).json({ message: "Les champs nom, email et password sont obligatoires." });
    }

    const existingUser = await utilisateurModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Un utilisateur existe deja avec cet email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await utilisateurModel.create({ nom, email, password: hashedPassword });
    const createdUser = await utilisateurModel.findById(userId);

    return res.status(201).json({
      message: "Utilisateur cree avec succes.",
      utilisateur: sanitizeUser(createdUser),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Les champs email et password sont obligatoires." });
    }

    const user = await utilisateurModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ message: "Connexion reussie.", token, utilisateur: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (_req, res, next) => {
  try {
    const users = await utilisateurModel.findAll();
    return res.json(users.map(sanitizeUser));
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await utilisateurModel.findById(req.utilisateur.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }
    return res.json(sanitizeUser(user));
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, listUsers, getMe };
