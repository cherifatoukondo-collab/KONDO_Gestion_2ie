const express = require("express");
const authRoutes = require("./authRoutes");
const etudiantRoutes = require("./etudiantRoutes");
const ecoleRoutes = require("./ecoleRoutes");
const createResourceRoutes = require("./resourceRoutes");
const createResourceController = require("../controllers/resourceController");
const validateResource = require("../middleware/validateResource");
const resultatRoutes = require("./resultatsRoutes");

const paysModel = require("../models/paysModel");
const civiliteModel = require("../models/civiliteModel");
const cycleModel = require("../models/cycleModel");
const decisionModel = require("../models/decisionModel");
const filieresModel = require("../models/filieresModel");
const specialitesModel = require("../models/specialitesModel");
const anneeAcademiqueModel = require("../models/anneeAcademiqueModel");
const parcoursModel = require("../models/parcoursModel");

const router = express.Router();

router.use("/api/auth", authRoutes);
router.use("/api/etudiants", etudiantRoutes);
router.use("/api/resultats", resultatRoutes);
router.use("/api/ecoles", ecoleRoutes);
router.use(
  "/api/pays",
  createResourceRoutes(
    createResourceController(paysModel, "Pays"),
    validateResource(["libelle"], [], []),
  ),
);
router.use(
  "/api/civilites",
  createResourceRoutes(
    createResourceController(civiliteModel, "Civilité"),
    validateResource(["libelle"], [], []),
  ),
);
router.use(
  "/api/cycles",
  createResourceRoutes(
    createResourceController(cycleModel, "Cycle"),
    validateResource(["libelle", "duree_annees"], ["duree_annees"], []),
  ),
);
router.use(
  "/api/decisions",
  createResourceRoutes(
    createResourceController(decisionModel, "Décision"),
    validateResource(["libelle"], [], []),
  ),
);
router.use(
  "/api/filieres",
  createResourceRoutes(
    createResourceController(filieresModel, "Filière"),
    validateResource(["libelle"], [], []),
  ),
);
router.use(
  "/api/annees-academiques",
  createResourceRoutes(
    createResourceController(anneeAcademiqueModel, "Année académique"),
    validateResource(["libelle", "date_debut", "date_fin", "est_active"], [], ["est_active"]),
  ),
);
router.use(
  "/api/specialites",
  createResourceRoutes(
    createResourceController(specialitesModel, "Spécialité"),
    validateResource(["libelle", "filieres_id"], ["filieres_id"], []),
  ),
);

router.use(
  "/api/parcours",
  createResourceRoutes(
    createResourceController(parcoursModel, "Parcours"),
    validateResource(["libelle", "specialites_id", "niveaux_id"], ["specialites_id", "niveaux_id", "cycles_id"], []),
  ),
);

module.exports = router;
