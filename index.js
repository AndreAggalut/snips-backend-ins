const Snippet = require('./models/Snippet.model');

async function testModels() {
  const snippets = await Snippet.select();
  console.log(snippets);
}

testModels();
