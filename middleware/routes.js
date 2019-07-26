const express = require('express');
const snippets = require('../controllers/snippets.controller');

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
router.patch('/api/snippets/:id', (request, response) => {});
router.delete('/api/snippets/:id', (request, response) => {});

module.exports = router;
