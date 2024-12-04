const path = require('path'); // Import the path module
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/basecontroller");
const utilities = require("./utilities/"); // Ensure utilities is required
console.log("Loading routes...");
const inventoryRoute = require('./routes/inventoryroute');

/* ******************************************
 * View Engine and Templates
 ****************************************** */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Root route - wrap with handleErrors
app.get('/', utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use('/inv', inventoryRoute); 

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

/* ***********************
 * File Not Found Route
 * Must be last route in list
 *************************/
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav(); // Get navigation for error page
  console.error(`Error at: "${req.originalUrl}": ${err.message}`); // Log error details in console

  // Generic error message for users
  let message;
  if (err.status == 404) {
    message = err.message; // For 404, display the message (e.g., "Page not found")
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'; // Generic error message for server errors
  }

  // Render the error page with a generic message and navigation
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message, // Display the generic error message
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
