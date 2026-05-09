const express = require("express");
const ecoleController = require("../controllers/ecoleController");
const validateEcole = require("../middleware/validateEcole");

const router = express.Router();

router.get("/", ecoleController.getAllEcoles);
router.get("/:id/etudiants", ecoleController.getEcoleStudents);
router.get("/:id", ecoleController.getEcoleById);
router.post("/", validateEcole, ecoleController.createEcole);
router.put("/:id", validateEcole, ecoleController.updateEcole);
router.delete("/:id", ecoleController.deleteEcole);

module.exports = router;
