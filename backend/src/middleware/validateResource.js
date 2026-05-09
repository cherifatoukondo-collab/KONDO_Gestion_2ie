const validateResource = (requiredFields = [], numericFields = [], booleanFields = []) => {
  return (req, res, next) => {
    const body = req.body || {};

    for (const field of requiredFields) {
      const value = body[field];
      if (value === undefined || value === null || (typeof value === "string" && value.trim().length === 0)) {
        return res.status(400).json({ message: `Le champ ${field} est obligatoire.` });
      }
    }

    for (const field of numericFields) {
      const value = body[field];
      if (value !== undefined && value !== null && value !== "" && !Number.isInteger(Number(value))) {
        return res.status(400).json({ message: `Le champ ${field} doit être un entier valide.` });
      }
    }

    for (const field of booleanFields) {
      const value = body[field];
      if (value !== undefined && value !== null && typeof value !== "boolean" && value !== "true" && value !== "false") {
        return res.status(400).json({ message: `Le champ ${field} doit être vrai ou faux.` });
      }
    }

    return next();
  };
};

module.exports = validateResource;
