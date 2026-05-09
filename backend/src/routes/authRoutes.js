const express = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/users", authController.listUsers);
router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/me", verifyToken, authController.getMe);

module.exports = router;
