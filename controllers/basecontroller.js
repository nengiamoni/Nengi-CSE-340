const utilities = require("../utilities/");
const baseController = {};

// Home route handler
baseController.buildHome = async function (req, res) {
  // Removed the comment to restore functionality
  const nav = await utilities.getNav();  // This line now works correctly
  res.render("index", { title: "Home", nav }); // Render with the nav
};

module.exports = baseController;
