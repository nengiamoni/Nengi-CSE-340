const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Intentional Error Route
router.get("/intentional-error", errorController.triggerError);

module.exports = router;
