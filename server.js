/* ******************************************
 * The server.js file acts as the main entry 
 * point of the application, managing the 
 * project’s server-side functionality.
 *******************************************/
/* ***********************
 * Importing Required Modules
 *************************/
const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/basecontroller");
const inventoryRoute = require("./routes/inventoryroute"); // Adding inventory route
const utilities = require("./utilities/");
const session = require("express-session");
const pool = require("./database/");
const accountRoute = require("./routes/accountRoute");
const accountController = require("./controllers/accountcontroller");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Setting Up Middleware
 ************************/
const sessionSecret = process.env.SESSION_SECRET || 'default-secret'; // Default secret in development mode
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: {
      secure: process.env.NODE_ENV === "production", // Enable secure cookies for production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // Set cookie expiration to 1 day
    },
  })
);

// Log session secret during development to ensure it is correctly loaded
if (process.env.NODE_ENV !== "production") {
  console.log("SESSION_SECRET:", sessionSecret);
}

// Enabling Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Account Registration Handler
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Allows parsing of x-www-form-urlencoded data

// Handling Cookies (Week05 feature)
app.use(cookieParser());

// JWT Token Validation Middleware (Week05 feature)
app.use(utilities.checkJWTToken);

/* ***********************
 * Template Engine Configuration
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Specifies a custom layout for the views

/* ***********************
 * Defining Routes
 *************************/
app.use(require("./routes/static"));

// Main Index Route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory Route Definitions
app.use("/inv", inventoryRoute);

// Account-related Routes
app.use("/account", accountRoute);

// Route to trigger an error for testing purposes
app.get("/trigger-error", utilities.handleErrors(baseController.triggerError));

// Custom 404 Error Route (must be the last route)
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we couldn’t find that page." });
});

/* ***********************
 * Global Error Handling Middleware
 * Should be placed after all other routes
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error occurred at: "${req.originalUrl}": ${err.message}`);

  // Error message based on status
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oops! Something went wrong. You might want to try a different path.";
  }

  // Send error details to the view
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Server Configuration
 * Values loaded from the .env file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST;

/* ***********************
 * Starting the Express Server
 *************************/
app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);

});
