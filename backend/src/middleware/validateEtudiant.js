const validateEtudiant = (req, res, next) => {
  const { nom, prenoms, pays_id, civilites_id } = req.body;

  if (!nom || !prenoms || !pays_id || !civilites_id) {
    return res.status(400).json({
      message: "Les champs nom, prenoms, pays_id et civilites_id sont obligatoires.",
    });
  }

  if (!Number.isInteger(Number(pays_id)) || Number(pays_id) <= 0) {
    return res.status(400).json({ message: "pays_id doit etre un entier valide." });
  }

  if (!Number.isInteger(Number(civilites_id)) || Number(civilites_id) <= 0) {
    return res.status(400).json({ message: "civilites_id doit etre un entier valide." });
  }

  return next();
};

module.exports = validateEtudiant;
