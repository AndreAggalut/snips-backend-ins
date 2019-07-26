const shortid = require('shortid');
const { readJsonFromDb, writeJsonToDb } = require('../utils/db.utils');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

/**
 * a snippet object
 * @typedef {Object} Snippet
 * @property {string} id
 * @property {string} author
 * @property {string} code
 * @property {string} title
 * @property {string} description
 * @property {string} language
 * @property {string[]} comments
 * @property {number} favorites
 */

/**
 * Inserts a new snippet into the db.
 * @param {Snippet} newSnippet - the data to create the snippet with
 * @returns {Promise<Snippet>} the created snippet
 */
exports.insert = async ({ author, code, title, description, language }) => {
  try {
    if (!author || !code || !title || !description || !language)
      throw new ErrorWithHttpStatus('Missing properties', 400);

    // read snippets.json
    const snippets = await readJsonFromDb('snippets');
    // grab data from newSnippet (validate)
    // make newSnippet a proper object
    // generate default data (id, comments, favorites)
    // push that object into snippets
    snippets.push({
      id: shortid.generate(),
      author,
      code,
      title,
      description,
      language,
      comments: [],
      favorites: 0,
    });
    // write back to the file
    await writeJsonToDb('snippets', snippets);
    return snippets[snippets.length - 1];
  } catch (err) {
    if (err instanceof ErrorWithHttpStatus) throw err;
    else throw new ErrorWithHttpStatus('Database error');
  }
};

/**
 * Selects snippets from DB.
 * Can accept optional query object to filter results;
 * otherwise, returns all snippets.
 * @param {Object} [query]
 * @returns {Promise<Snippet[]>} array of Snippet objects
 */
exports.select = async (query = {}) => {
  try {
    // 1. read the file
    // 2. parse it
    const snippets = await readJsonFromDb('snippets');
    // filter snippets with query
    // check if every query key
    // snippet[key] === query[key]
    const filtered = snippets.filter(snippet =>
      Object.keys(query).every(key => query[key] === snippet[key])
    );
    // 3. return the data
    return filtered;
  } catch (err) {
    throw new ErrorWithHttpStatus('Database error');
  }
};

/**
 * Updates a snippet
 * @param {string} id - id of the snippet to update
 * @param {Snippet} newData - subset of values to update
 */
exports.update = async (id, newData) => {
  // TODO: error on id not found

  // 1. read file
  const snippets = await readJsonFromDb('snippets');
  // 2. find the snippet with id
  // 3. update the snippet with appropriate data (make sure to validate!)
  const updatedSnippets = snippets.map(snippet => {
    // if it's not the one we want, just return it
    if (snippet.id !== id) return snippet;

    // loop over keys in newData
    Object.keys(newData).forEach(key => {
      // check if snippet has that key and set it
      if (key in snippet) snippet[key] = newData[key];
      // TODO: 400 error on key DNE
    });
    return snippet;
  });
  // 4. write back to db
  return writeJsonToDb('snippets', updatedSnippets);
};

/**
 * Deletes a snippet
 * @param {string} id
 */
exports.delete = async id => {
  // Read in the db file
  const snippets = await readJsonFromDb('snippets');
  // filter snippets for everything except snippet.id
  const filteredSnips = snippets.filter(snippet => snippet.id !== id);
  if (filteredSnips.length === snippets.length) return; // short circuit if id not found
  // TODO: error if trying to delete a snippet DNE

  // write the file
  return writeJsonToDb('snippets', filteredSnips);
};
