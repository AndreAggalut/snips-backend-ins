const express = require('express');
const snippets = require('../controllers/snippets.controller');
const authors = require('../controllers/authors.controller');

const router = express.Router();

router.get('/', (request, response, next) => {
  response.send('Welcome to Snips!');
});

router.get('/api', (request, response) => {
  response.send('Welcome to the Snips API!');
});

/* Snippets routes */
router.post('/api/snippets', snippets.createSnippet);
router.get('/api/snippets', snippets.getAllSnippets);
router.get('/api/snippets/:id', snippets.getSnippetById);
router.patch('/api/snippets/:id', snippets.update);
router.delete('/api/snippets/:id', snippets.delete);

/* Author routes */
router.post('/api/signup', authors.signup);

module.exports = router;
