const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Render inventory by classification
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) {
      throw new Error("Classification not found")
    }
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (err) {
    next(err) // Forward error to error handler middleware
  }
}

/* ***************************
 *  Display vehicle details page
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicle_id = req.params.vehicleId
    const vehicleData = await invModel.getVehicleById(vehicle_id)

    // Ensure data exists for the requested vehicle
    if (!vehicleData) {
      const err = new Error("Vehicle not found")
      err.status = 404
      return next(err) // Forward error for centralized handling
    }

    const nav = await utilities.getNav()
    const details = utilities.buildVehicleDetails(vehicleData)
    res.render("./inventory/vehicle-detail", {
      title: `${vehicleData.inv_year || "Unknown Year"} ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      details, // Include vehicle details in response
    })
  } catch (err) {
    next(err) // Handle unexpected errors
  }
}

/* ***************************
 *  Render Inventory Management page
 * ************************** */
invCont.renderManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.chooseClassification()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    })
  } catch (err) {
    next(err) // Handle errors while rendering management page
  }
}

/* ***************************
 *  Show Add Classification Form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Save new classification to database
 * ************************** */
invCont.addNewClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const addResult = await invModel.addNewClassification(
    classification_name
  )
  if (addResult) {
    req.flash(
      "notice", 
      `The ${classification_name} classification was added successfully.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management", 
      nav: await utilities.getNav(),  
      errors: null,    
    })
  } else {
    req.flash(
      "notice", 
      "Sorry! classification was not added."
    )
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification", 
      nav: await utilities.getNav(),
      errors: null,      
    })
  }
}

/* ***************************
 *  Show Add Inventory Form
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const typeSelector = await utilities.chooseClassification()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    typeSelector,
    errors: null,
  })
}

/* ***************************
 *  Save new inventory to database
 * ************************** */
invCont.addNewInventory = async function (req, res, next) {
  const nav = await utilities.getNav()

  let typeSelector
  try {
    // Generate dropdown menu for classifications
    typeSelector = await utilities.chooseClassification()
  } catch (error) {
    console.error("Error creating typeSelector:", error)
  }

  const { classification_id, inv_make, inv_model, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color } = req.body
  const addResult = await invModel.addNewInventory(
    classification_id, inv_make, inv_model, inv_description, inv_image, 
      inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  if (addResult) {
    req.flash(
      "notice", 
      "The new vehicle was added successfully."
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management", 
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice", 
      "The new vehicle was not added."
    )
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory", 
      nav,
      typeSelector, 
      errors: null,     
    })
  }
}

/* ***************************
 *  Fetch Inventory by Classification (JSON)
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData) // Return JSON response for inventory data
  } else {
    next(new Error("No data returned")) // Trigger error handler for empty data
  }
}

module.exports = invCont
