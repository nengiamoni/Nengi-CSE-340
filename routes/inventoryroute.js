// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for specific vehicle detail view
router.get("/detail/:inventoryId", invController.buildVehicleDetail);

module.exports = router;
