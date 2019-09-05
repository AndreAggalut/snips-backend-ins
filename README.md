# Snips ✂️ Backend

Backend for Snips app.
Built with MVC architecture and a file-based DB.

## Setup

1. Clone
2. `$ npm install`
3. `$ npm run dev`

## Code-along Detailed Notes

### Day 1

- Make a snips directory with directories:
  - backend
  - frontend
- `index.js`
  - entry point for the server
- `db` folder
  - Just files that we will use to hold data
- `snippets.json` (goes in db folder)
  - seed data for our snippet data
- `models`
  - Make a model that will allow us to do CRUD operations
- `Snippet.model.js` (goes in models folder)
  - Models are upper-case by convention
  - The `.model` is used for clarity so that we can see which file is our model
  - `select()` is just a READ in SQL
    - We want to use similar naming to be less confusing in the future
    - Psuedo-code the steps with comments
    - > Make sure to import `fs` at the top
    - Use a `readfile` to try and get our `snippet.json`
    - > Explain that Node.js fails with relative paths in nested files
    - > Explain that Node.js has `__dirname` and `__filename` to be relative from the root module
    - Import the `path` module to fix all of the pathing problems
    - Using `path.join`, we make sure we have all of our OS friendly paths
    - Parse the snippets to make sure they are friendly objects
- `index.js`
  - test out that `Snippet.select()` works and you can get the list of snippet objects
- `Snippet.model.js`

  - `select()`

    - refactor `select` to have better code quality
    - Add `query` parameter for fine control searching
    - Figure out how to actually implement a filter that compares objects

      - Hint: Take an approach that use keys to compare in the objects. If the object keys match, then the objects are valid and should be returned.
      - Answer:

        ```js
        const filtered = snippets.filter(snippet =>
          Object.keys(query).every(key => query[key] === snippet[key])
        );
        ```

    - We now need to figure out why a call with no parameters fails
      - Time to DEBUG!!!
      - We didn't set our `query` parameter with a default value

  - Oh boy! We need some error handling to prevent this in the future
    - wrap that whole function in a try/catch
  - `insert()`

    - Pseudo-code the steps with comments
    - Copy / paste the reading of snippet from the `select` function
      - We will eventually re-factor this... NO COPY PASTA
    - We know that we eventually want to push a new object to the db, but how do we get the right object _stuff_?
      - We can **destructure** the parameter to make sure we get the properties that we want.
    - Now we can reassemble the object

      ```js
      snippets.push({
        id: ???,
        author,
        code,
        title,
        description,
        language,
        comments: [],
        favorites: 0,
      });
      ```

    - How do we auto-generate `id`?
      - Timestamp is a good suggestion
      - Use a package that does it for us.
    - Create a package.json to hold 3rd party packages
    - Install `shortid` package
    - Require `shortid` package at the top and use it to generate a unique id
    - `shortid.generate()` makes pseudo-random, unique ids
    - write that `snippets` object onto the `snippets.json`
    - However, what happens if I don't use all the properties when I call this?
      - ERROR HANDLING!!
    - Wrap everything in a try / catch
    - Check for each parameter in the function

      ```js
      if (!author || !code || !title || !description || !language)
        throw Error("missing properties");
      ```

### Day 2

#### Review

- Data relationships (ERD)
- MVC (without the view)
- Insert functionality review

#### Code

- `Snippet.model.js`
- `utils` folder:
  - All the utility functions that can be repeated across our code base.
  - The extras that help with organization
- `db.utils.js` (goes in `utils` folder)
  - All the utilities related to the db.
  - `readJsonFromDb` definition for clarity
  - `writeJsonToDb` definition for clarity
  - `readJsonFromDb`
    - Parameters: accepts a file name because they just need to know the file that they want
  - Refactor the `select` function from `Snippet.model.js` and put the "reading files" functionality in the `readJsonFromDb`
- `Snippetmodel.js`
  - Import the dbUtils from `db.utils.js`
  - refactor `select` and `insert` to use the dbUtils
- `index.js`
  - Instead of deleting our "test cases", we should start making functions that test our code ➝ we will transition to unit tests.
- `Snippetmodel.js`
  - Everyone needs to try to implement `writeJsonToDb`
    - Make sure you include the resource location and data for the file writing!
- `Snippetmodel.js`
  - refactor `insert` to use the `writeJsonToDb`
  - `delete`
    - Pseudo-code comments
    - We decided that if we do not find an id to delete, it should not error out. The delete operation is still successful because it is deleting and object that doesn't exist in the first place.
  - `update`
    - Pseudo-code comments
    - We need to figure out how to edit an object and put it back into the file
    - `Array.map`
      - Can go through each one and find the one to edit.
    - `Array.find`
      - Finds the element we need and stores it in a reference
      - You can edit the reference which affects the original array

### Day 3

Express!!

- `npm i express`

#### Code

- `index.js`
  - import express into your app
  - construct your server by calling `express()`
  - Start up your server by having it `listen()` to a port
- `package.json`
  - make a `start` script that uses node to run your index
- Postman
  - Make a collection for your "Snips" request calls
  - Make a "Home" request and put it in the "Snips" collections
- `index.js`
  - Make a route by using `app.<httpVerb>()` in order to establish a route for any of those request types
    - First: Takes a string parameter for the path
    - Second: Callback for request and response objects
- `package.json`
  - Install nodemon
  - Add a `dev` script to run `nodemon index.js`

#### Review

- Compare the older node project with the new way of doing things to check for some understanding.

#### Code

- `index.js`
  - Create function stubs for all routes
- Create a `models` folder
- Bring in `Snippet.model.js` from the other node project
- `index.js`
  - `app.get('/api/snippets')`
    - Use `Snippet.select()` to get all of the data
      - But this a promise, so what do we need to do to get the data?
        - ASYNC / AWAIT
    - Then send that data out! `response.send()`

#### Review

- The `send` function will set the response headers and send the response to the client in one step - Show that express just obfuscates the node details with wrapper functions.

#### Code

- `routes.js`
  - require `express`
  - `express.Router()`: get the Router object off of express
  - cut out all of our routes from `index.js` and put them into this file
  - Change all instances of `app` to `router` to use the router object
  - require `Snippet.model.js`
- `index.js`

  - Remove `Snippet` required statement
  - Require `./router`
  - `app.use(router)`: Start using the router
    - Adds in the router as a middleware

#### Review

- Draw a diagram of what middleware is and how it passes information from one module to another
- Use Request and Response objects to simulate what it is doing

#### Code

- Create `middleware` folder
- Create `logger.js` (Put it in the `middleware` folder)
  - Make sure to explain what `next` is so that people can understand moving around the express middleware chain
- `index.js`

  - Add the `logger.js` file into the middleware pipeline

    ```js
    app.use(logger);

    // is the same as

    app.use(() => logger(request, response, next));
    ```

- Move `routes.js` to the middleware file
- `logger.js`
  - Have everyone build the logger and send the information to the `log.txt` file
    - This shows that you can still use raw node modules to do operations with Express
  - Use the `fs` and `path` module from node to get

#### Review

- We now want to code out the inserting of snippets
- Explain that we can make a post with query parameters or a body to pass information

- `routes.js`
  - Test that we can make a request to the "insert" route
- `index.js`
  - `app.use(express.json())`: this lets us parse the body of an **incoming** request body.
- `routes.js`
  - `router.post('api/snippets')`
    - Add the Snippet insert function to this route
    - Send the snippet back after it has been created
    - However! We send a `200` response code
    - `.status(201)` can be chained to send a different response
- Make a `controllers` folder

#### Review

- We architect a controller object to be in between the route and models. So we are going to abstract the route logic to be in the controller logic. This makes the routes **lean**.

#### Code

- `snippets.controller.js`
  - All of the snippet logic from `routes` needs to go to their own functions in this file.
- `routes.js`

  - Each of the routes now will look small.

    ```js
    // This is a lean route that passes the request and
    // response to the controller function `createSnippet`
    router.post("/api/snippets", snippets.createSnippet);
    ```

  - All routes should look something like the one above.

### PostgreSQL

-
