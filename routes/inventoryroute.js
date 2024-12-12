// Importing required modules and dependencies
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js");
const regValidate = require('../utilities/inventory-validation')

// Fetch inventory items by classification ID
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Fetch vehicle details by its unique ID
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Render the inventory management dashboard
router.get("/", utilities.handleErrors(invController.renderManagementView));

// Load the add classification page
router.get("/add-classification", utilities.handleErrors(invController.addClassification));

// Handle form submission for adding a new classification
router.post("/add-classification", regValidate.addClassificationRules(),
regValidate.checkClassificationData, utilities.handleErrors(invController.addNewClassification));

// Load the add inventory page
router.get("/add-inventory", utilities.handleErrors(invController.addInventory))

// Process the form submission for adding new inventory items
router.post("/add-inventory", regValidate.addInventoryRules(),
regValidate.checkInventoryData, utilities.handleErrors(invController.addNewInventory))

// Provide JSON response for inventory items based on classification ID (Week 05 AJAX task)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;
