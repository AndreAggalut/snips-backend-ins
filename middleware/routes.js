const express = require('express');
const snippets = require('../controllers/snippets.controller');
const authors = require('../controllers/authors.controller');
const validate = require('./validate');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.send('Welcome to Snips!');
});

router.get('/api', (request, response) => {
  response.send('Welcome to the Snips API!');
});

/* Snippets routes */
router.post('/api/snippets', validate, snippets.createSnippet);
router.get('/api/snippets', snippets.getAllSnippets);
router.get('/api/snippets/:id', snippets.getSnippetById);
router.patch('/api/snippets/:id', validate, snippets.update);
router.delete('/api/snippets/:id', validate, snippets.delete);

/* Author routes */
router.post('/api/signup', authors.signup);
router.post('/api/login', authors.login);

module.exports = router;
