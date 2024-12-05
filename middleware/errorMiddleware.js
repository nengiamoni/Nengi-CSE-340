const utilities = require("../utilities/");

const errorMiddleware = async (err, req, res, next) => {
  let nav = await utilities.getNav(); // Get navigation for error page
  console.error(`Error at: "${req.originalUrl}": ${err.message}`); // Log error details in console

  // Define a message for the user
  let message;
  if (err.status == 404) {
    message = err.message; // For 404, display the message (e.g., "Page not found")
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'; // Generic error message for server errors
  }

  // Render the error page with the message and navigation
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
};

module.exports = errorMiddleware;
