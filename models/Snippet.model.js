const fs = require('fs').promises;
const path = require('path');
const shortid = require('shortid');

/**
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
      throw Error('Missing properties');
    // read snippets.json
    const dbpath = path.join(__dirname, '..', 'db', 'snippets.json');
    const snippets = JSON.parse(await fs.readFile(dbpath));
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
    await fs.writeFile(dbpath, JSON.stringify(snippets));
    return snippets[snippets.length - 1];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * Selects snippets from db.
 * Can accept optional query object to filter results.
 * @param {Object} [query]
 * @returns {Promise<Snippet[]>} array of Snippet objects
 */
exports.select = async (query = {}) => {
  try {
    // 1. read the file
    // 2. parse it
    const dbpath = path.join(__dirname, '..', 'db', 'snippets.json');
    const snippets = JSON.parse(await fs.readFile(dbpath));
    // filter snippets with query
    // check if every query key
    // snippet[key] === query[key]
    const filtered = snippets.filter(snippet =>
      Object.keys(query).every(key => query[key] === snippet[key])
    );
    // 3. return the data
    return filtered;
  } catch (err) {
    console.log('ERROR in Snippet model');
    throw err;
  }
};

/* Update */

/* Delete */
