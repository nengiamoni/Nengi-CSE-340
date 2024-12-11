/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/basecontroller");
const inventoryRoute = require("./routes/inventoryroute"); // Import the route
const utilities = require("./utilities/");
const session = require("express-session");
const pool = require("./database/");
const accountRoute = require("./routes/accountRoute");
const accountController = require("./controllers/accountcontroller");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 ************************/
const sessionSecret = process.env.SESSION_SECRET || 'default-secret'; // Use default for development
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
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Log the session secret to ensure it's loaded (development only)
if (process.env.NODE_ENV !== "production") {
  console.log("SESSION_SECRET:", sessionSecret);
}

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Activity of Account: Process Registration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Week05 Login activity
app.use(cookieParser());

// Week05 cookie activity
app.use(utilities.checkJWTToken);

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"));

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes from Week04: Activity
app.use("/account", accountRoute);

// Add a route that will cause an error
app.get("/trigger-error", utilities.handleErrors(baseController.triggerError));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  // Set error message
  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }

  // Sending error data to view
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});