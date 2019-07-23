const Snippet = require('./models/Snippet.model');

async function testModels() {
  // const snippets = await Snippet.select();
  // console.log(snippets);
  try {
    const newSnippet = await Snippet.insert({
      author: 'CJ',
      code: 'code code code',
      title: 'test.js',
      description: 'this works great!',
      language: 'javascript',
    });
    console.log(newSnippet);
  } catch (err) {
    console.error(err);
  }
}

testModels();
