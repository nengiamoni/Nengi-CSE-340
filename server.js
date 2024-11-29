const path = require('path'); // Import the path module
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");

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

// Root route
app.get('/', baseController.buildHome);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

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
  console.log(App listening on http://${host}:${port});
});