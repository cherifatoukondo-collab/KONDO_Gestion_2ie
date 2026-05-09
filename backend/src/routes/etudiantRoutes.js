const express = require("express");

const etudiantController = require("../controllers/etudiantController");
const validateEtudiant = require("../middleware/validateEtudiant");

const router = express.Router();

router.get("/stats", etudiantController.getEtudiantStats);
router.get("/", etudiantController.getAllEtudiants);
router.get("/:id", etudiantController.getEtudiantById);
router.post("/", validateEtudiant, etudiantController.createEtudiant);
router.put("/:id", validateEtudiant, etudiantController.updateEtudiant);
router.delete("/:id", etudiantController.deleteEtudiant);

module.exports = router;
