// Required dependencies 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountcontroller.js")
const utilities = require("../utilities/index.js")
const regValidate = require('../utilities/account-validation')

// Route for the login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for the registration page
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Handle registration form submission
router.post("/register", regValidate.registationRules(),
regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

/* **************************************
* Handle user login
* week04: Implemented login activity
* Updated in week 05: Enhanced login process
* ************************************ */
router.post("/login", regValidate.loginRules(),
regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin)) //updated from accountController.loginAccount

// week 05: Added account management page route
router.get("/account-management", utilities.handleErrors(accountController.buildAccountManagementView))

/* ****************************************
* Display Account Management page
* week 05: Implemented JWT Authentication
* *************************************** */
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView))

module.exports = router;
