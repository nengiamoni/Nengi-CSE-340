const path = require('path'); // Import the path module
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/basecontroller");
const utilities = require("./utilities/"); // Ensure utilities is required
const errorMiddleware = require("./middleware/errorMiddleware"); // Import the error middleware
const inventoryRoute = require('./routes/inventoryroute');
const errorRoute = require('./routes/errorRoute'); // Import intentional error route

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

// Intentional Error Route
app.use('/error', errorRoute);

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
 * Express Error Handler Middleware
 * Place after all other middleware
 *************************/
app.use(errorMiddleware); // Apply error handling middleware

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
