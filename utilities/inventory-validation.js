const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Validation rules for adding classification
* ********************************* */
validate.addClassificationRules = () => {
    return [
        body("classification_name")
            .isAlpha()
            .withMessage("Please provide a valid name.") // Error message if input is not a valid string
            .notEmpty()
            .custom(async (classification_name) => {
                const classExists = await inventoryModel.checkExistingClassification(classification_name)
                if (classExists){
                  throw new Error("Classification already exists. Please enter a new classification.") // Error if classification name already exists
                }
              }),
        ]
}

/*  **********************************
*  Middleware to check classification data
* ********************************* */
validate.checkClassificationData = async (req, res, next) => {
    let errors = []
    const { classification_name } = req.body
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        classification_name,
   
      })
      return
    }
    next()
}

/*  **********************************
*  Validation rules for adding inventory
* ********************************* */
validate.addInventoryRules = () => {
    return [
       body("classification_id")
            .isInt()
            .notEmpty()
            .withMessage("Please Choose a Classification List."), // Error if classification is not selected

        body("inv_make")
            .notEmpty()
            .withMessage("Please provide a Make."), // Error if make is missing
            
        body("inv_model")
            .notEmpty()
            .withMessage("Please provide a Model."), // Error if model is missing

        body("inv_description")
            .notEmpty()
            .withMessage("Please provide Description."), // Error if description is missing

        body("inv_image")
            .notEmpty(), // Error if image is not provided

        body("inv_thumbnail")
            .notEmpty(), // Error if thumbnail is missing    
            
        body("inv_year")
            .isInt()
            .notEmpty()
            .withMessage("Please provide Year."), // Error if year is not a number
        
        body("inv_miles")
            .isInt()
            .notEmpty()
            .withMessage("Please provide Miles."), // Error if miles is not a number

        body("inv_color")
            .isAlpha()
            .notEmpty()
            .withMessage("Please provide a Color.") // Error if color is not valid
    ]
}

/* ******************************
 * Middleware to validate inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {

    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const typeSelector = await utilities.chooseClassification()
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add New Vechicle",
        typeSelector,
        nav,
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_price, 
        inv_year,  
        inv_miles, 
        inv_color,
      })
      return
    }
    next()
}


module.exports = validate
