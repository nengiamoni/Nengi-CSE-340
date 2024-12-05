const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;

  try {
    // Fetch vehicle data
    const vehicleData = await invModel.getVehicleById(inventoryId);

    if (!vehicleData) {
      res.status(404).send("Vehicle not found");
      return;
    }

    // Build the HTML for vehicle detail
    const vehicleHtml = await utilities.buildVehicleDetailHtml(vehicleData);
    const nav = await utilities.getNav();

    // Render the detail view
    res.render("./inventory/vehicle-detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHtml,
    });
  } catch (error) {
    console.error("Error building vehicle detail view: ", error);
    next(error);
  }
};

module.exports = invCont;