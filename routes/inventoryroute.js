const express = require('express');  // Import express
const router = express.Router();     // Define the router
const invController = require('../controllers/invController'); // Import your controller

// Define routes
router.get("/type/:classificationId", invController.buildByClassificationId);

// Export the router so it can be used in server.js
module.exports = router;
