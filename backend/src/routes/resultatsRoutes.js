const express = require("express");
const resultatController = require("../controllers/resultatController");

const router = express.Router();

router.get("/", resultatController.getAllResultats);

module.exports = router;
