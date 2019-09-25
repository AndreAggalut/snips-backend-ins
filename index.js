const app = require('./app');

/* Now start our app */
app.listen(process.env.PORT || 5000, () => {
  console.log('Snips server running on port 5000');
});
