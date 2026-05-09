const validateEcole = (req, res, next) => {
  const { libelle, adresse, telephone, email } = req.body;

  if (!libelle || typeof libelle !== "string" || libelle.trim().length === 0) {
    return res.status(400).json({ message: "Le champ libelle est obligatoire." });
  }

  if (telephone && typeof telephone !== "string") {
    return res.status(400).json({ message: "Le telephone doit être une chaîne de caractères." });
  }

  if (email && typeof email !== "string") {
    return res.status(400).json({ message: "L'email doit être une chaîne de caractères." });
  }

  return next();
};

module.exports = validateEcole;
