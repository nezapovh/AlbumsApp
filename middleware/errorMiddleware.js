const APIError = require("../errors/apiError");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(500).json({
    description: "There was an error, please try again",
    error: err.message,
  });
};

module.exports = errorHandlerMiddleware;
