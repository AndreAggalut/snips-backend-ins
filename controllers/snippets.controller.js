const Snippet = require('../models/Snippet.model');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

exports.createSnippet = async (request, response, next) => {
  try {
    // create a snippet
    const snippet = await Snippet.insert(request.body);
    response.status(201).send(snippet);
  } catch (err) {
    next(err);
  }
};

exports.getAllSnippets = async ({ query }, response, next) => {
  try {
    // 1. get data from Snippets model
    const snippets = await Snippet.select(query);
    // 2. send that out
    return response.send(snippets);
  } catch (err) {
    next(err);
  }
};

exports.getSnippetById = async ({ params: { id } }, response, next) => {
  try {
    // get the snippet: call Snippet.select passing an id (from request.params)
    const snippet = await Snippet.select({ id });
    if (snippet.length === 0) {
      throw new ErrorWithHttpStatus('ID does not exist', 404);
    }
    // send that snippet back
    response.send(snippet[0]);
  } catch (err) {
    next(err);
  }
};
