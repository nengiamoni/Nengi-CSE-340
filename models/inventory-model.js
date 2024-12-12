const pool = require("../database/")

/* ***************************
 *  Fetch all classifications
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name") /* Ensures data is sorted alphabetically by classification name */
}

/* ***************************
 *  Retrieve inventory by classification ID
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("Error fetching inventory by classification ID: " + error)
  }
}

/* ***************************
 *  Fetch vehicle details by ID
 * ************************** */
async function getVehicleById(id) {
  try {
    const result = await pool.query(
      `SELECT 
         inv_id, inv_make, inv_model, inv_year, inv_description, 
         inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
         classification.classification_name
       FROM inventory 
       INNER JOIN classification 
       ON inventory.classification_id = classification.classification_id
       WHERE inv_id = $1`, 
      [id]
    )
    return result.rows[0] // Returns a single vehicle's details
  } catch (error) {
    console.error('Error retrieving vehicle by ID:', error)
    throw error
  }
}

/* ***************************
 *  Insert a new classification
 * ************************** */
async function addClassification(classification_name) {
  if (!classification_name) {
    throw new Error("Classification name cannot be empty");
  }

  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("Error adding classification:", error.message);
    throw error;
  }
}

/* ***************************
 *  Add classification to database
 * ************************** */
async function addNewClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.error("Error while adding new classification: " + error.message)
  }
}

/* ***************************
 *  Check if classification exists
 * ************************** */
function capitalize(str) { 
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
}  

async function checkExistingClassification(classification_name) { 
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification1 = await pool.query(sql, [classification_name.toLowerCase()])
    const classification2 = await pool.query(sql, [classification_name.toUpperCase()])
    const classification3 = await pool.query(sql, [capitalize(classification_name)])
    return classification1.rowCount + classification2.rowCount + classification3.rowCount
  } catch (error) { 
    console.error("Error checking classification existence: " + error.message);
  } 
}

/* ***************************
 *  Insert a new vehicle (inventory item)
 * ************************** */
async function addNewInventory(classification_id, inv_make, inv_model, inv_description, inv_image, 
  inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color) {
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year,  inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, 
      inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
  } catch (error) {
    console.error("Error adding new vehicle: " + error.message)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, 
  checkExistingClassification, addNewClassification, addNewInventory};
