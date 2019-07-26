const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

/**
 * Sends appropriate error message and code to the client
 * @param {Error} err
 * @param {Request} request
 * @param {Response} response
 * @param {Function} next
 */
const errorHandler = (err, request, response, next) => {
  if (err instanceof ErrorWithHttpStatus)
    response.status(err.status).send(err.message);
  else response.status(500).send('Server error');
};

module.exports = errorHandler;
