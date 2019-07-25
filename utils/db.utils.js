const fs = require('fs').promises;
const path = require('path');

/**
 * Gets absolute path to `resource` DB file
 * @param {string} resource
 * @returns {string} file path
 */
const dbPath = resource => path.join(__dirname, '..', 'db', `${resource}.json`);

/**
 * Reads and parses JSON data from DB
 * @param {string} resource - resource to fetch
 * @returns {Promise<Object>} parsed data
 */
exports.readJsonFromDb = async resource =>
  JSON.parse(await fs.readFile(dbPath(resource)));

/**
 * Writes JSON data to DB file
 * @param {string} resource - resource to write to
 * @param {Object} data - data to write
 * @returns {Promise<void>}
 */
exports.writeJsonToDb = (resource, data) =>
  fs.writeFile(dbPath(resource), JSON.stringify(data));
