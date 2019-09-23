const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Author = require('../models/Author.model');
const ErrorWithHttpStatus = require('../utils/ErrorWithHttpStatus');

exports.signup = async (request, response, next) => {
  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(request.body.password, 2);
    await Author.insert({
      name: request.body.name,
      password: hashedPassword,
    });
    response.status(201).send('Signed up!');
  } catch (error) {
    next(error);
  }
};

exports.login = async (request, response, next) => {
  try {
    // 1. get the author
    const author = await Author.select(request.body.name);
    console.log(author);
    // 2. check if they exist
    if (!author) throw new ErrorWithHttpStatus('User does not exist', 404);

    // 3. check if the password matches
    const isMatch = await bcrypt.compare(
      request.body.password,
      author.password
    );
    console.log(isMatch);
    if (!isMatch) throw new ErrorWithHttpStatus('Incorrect password', 401);

    // 4. sign a json web token
    const token = jwt.sign(author.name, process.env.JWT_SECRET);

    response.send({ message: 'Logged in!', token });
  } catch (error) {
    next(error);
  }
};
