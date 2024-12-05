exports.triggerError = (req, res, next) => {
    try {
      throw new Error("This is an intentional 500 error for testing purposes.");
    } catch (error) {
      next(error); // Pass the error to the middleware
    }
  };
  