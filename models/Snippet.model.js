const format = require('pg-format');
const db = require('../db');
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
    const result = await db.query(
      `INSERT INTO snippet (code, title, description, author, language) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [code, title, description, author, language]
    );
    return result.rows[0];

    /*
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
    */
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
exports.select = async query => {
  try {
    const clauses = Object.keys(query)
      .map((key, i) => `%I = $${i + 1}`)
      .join(' AND ');
    const formattedSelect = format(
      `SELECT * FROM snippet ${clauses.length ? `WHERE ${clauses}` : ''}`,
      ...Object.keys(query)
    );

    const results = await db.query(formattedSelect, Object.values(query));
    return results.rows;

    /*
    const whereClause = `WHERE ${Object.keys(query)
      .map((_, i) => `%I = $${i + 1}`)
      .join(' AND ')}`;
    const sql = format(
      `SELECT * FROM snippet ${query ? whereClause : ''} ORDER BY id`,
      Object.keys(query)
    );
    const result = await db.query(sql, Object.values(query));
    return result.rows;
    */

    /* Old file-based method
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
    */
  } catch (err) {
    console.log(err);
    throw new ErrorWithHttpStatus('Database error');
  }
};

/**
 * Updates a snippet
 * @param {string} id - id of the snippet to update
 * @param {Snippet} newData - subset of values to update
 */
exports.update = async (id, newData) => {
  try {
    /* Hans' Solution */
    const { author, code, title, description, language } = newData;
    await db.query(
      `UPDATE snippet
      SET 
        author = COALESCE($2, author),
        code = COALESCE($3, code),
        title = COALESCE($4, title),
        description = COALESCE($5, description),
        language=COALESCE($6, language)
      WHERE id = ($1)`,
      [id, author, code, title, description, language]
    );

    /*
    // 1. read file
    const snippets = await readJsonFromDb('snippets');
    // 2. find the snippet with id
    let found = false;
    // 3. update the snippet with appropriate data (make sure to validate!)
    const updatedSnippets = snippets.map(snippet => {
      // if it's not the one we want, just return it
      if (snippet.id !== id) return snippet;

      // else we found what we're looking for
      found = true;
      // loop over keys in newData
      Object.keys(newData).forEach(key => {
        // check if snippet has that key and set it
        if (key in snippet) snippet[key] = newData[key];
        else throw new ErrorWithHttpStatus(`Invalid property ${key}`, 400);
      });
      return snippet;
    });

    if (!found)
      throw new ErrorWithHttpStatus(`Snippet with ID ${id} not found`, 404);

    // 4. write back to db
    return writeJsonToDb('snippets', updatedSnippets);
    */
  } catch (err) {
    if (err instanceof ErrorWithHttpStatus) throw err;
    else throw new ErrorWithHttpStatus('Database error', 500);
  }
};

/**
 * Deletes a snippet
 * @param {string} id
 */
exports.delete = async id => {
  try {
    const result = await db.query(`DELETE FROM snippet WHERE id = $1`, [id]);
    // check if some number of rows were deleted
    if (result.rowCount === 0)
      throw new ErrorWithHttpStatus(`Snippet with ID ${id} not found`, 404);

    /* Old code
    // Read in the db file
    const snippets = await readJsonFromDb('snippets');
    // filter snippets for everything except snippet.id
    const filteredSnips = snippets.filter(snippet => snippet.id !== id);
    if (filteredSnips.length === snippets.length)
      throw new ErrorWithHttpStatus(`Snippet with ID ${id} not found`, 404); // short circuit if id not found

    // write the file
    return writeJsonToDb('snippets', filteredSnips);
    */
  } catch (err) {
    if (err instanceof ErrorWithHttpStatus) throw err;
    else throw new ErrorWithHttpStatus('Database error', 500);
  }
};
