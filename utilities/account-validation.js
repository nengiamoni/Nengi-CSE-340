const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
const bcrypt = require('bcryptjs');


/* **************************************
  *  Validation Rules for Registration
  * ************************************ */
validate.registationRules = () => {
    return [
      // Ensure first name is provided and is a valid string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("First name is required."), // Error message if validation fails.
  
      // Ensure last name is provided and is a valid string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Last name is required."), // Error message if validation fails.
        
      // Ensure the email is valid and not already in use
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // Normalize email according to validator.js
      .withMessage("Please provide a valid email.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email already exists. Please log in or use another email.")
        }
      }),
  
      // Ensure the password is strong and meets requirements
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet the required strength."),
    ]
  }

  /* ***************************************
  *  Validate Registration Data and Handle Errors
  * ************************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Register",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }


/* **************************************
  *  Validation Rules for Login
  * ************************************ */
validate.loginRules = () => {
    return [
      // Ensure the email exists in the database
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // Normalize email according to validator.js
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
      
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if (!emailExists) {
            throw new Error("Email not found. Please sign up.");
          }
        }),
  
      // Ensure the password meets strength requirements
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet security requirements."),
    ]
  }

    /* ***************************************
 *  Validate Login Data and Handle Errors
 * ************************************** */
    validate.checkLoginData = async (req, res, next) => {
      const { account_email } = req.body
      let errors = []
      errors = validationResult(req)
      if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
          errors,
          title: "Login",
          nav,
          account_email,
        })
        return
      }
      next()
    }

  module.exports = validate
