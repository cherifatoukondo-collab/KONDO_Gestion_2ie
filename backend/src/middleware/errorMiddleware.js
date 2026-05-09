const notFound = (req, res, _next) => {
  res.status(404).json({ message: `Route introuvable: ${req.originalUrl}` });
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "Une ressource avec cette valeur existe deja." });
  }

  return res.status(statusCode).json({
    message: error.message || "Erreur interne du serveur.",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
