/* eslint-disable no-console */
const fs = require('fs').promises;
const path = require('path');

/**
 * Logs request method, path, and timestamp
 * @param {Request} request
 * @param {Response} response
 * @param {function} next
 * @example GET / 232534534535
 */
const logger = (request, response, next) => {
  const info = `${request.method} ${request.path} | ${Date.now()}\n`;
  const filePath = path.join(__dirname, '..', 'log.txt');
  try {
    // try to append it to file
    fs.appendFile(filePath, info);
  } catch (err) {
    // if that fails, just log it to console
    console.error(info);
  } finally {
    // next calls the next piece of middleware
    next();
  }
};

const consoleLogger = (request, response, next) => {
  console.log(request.method);
  next();
};

module.exports = {
  logger,
  consoleLogger,
};
