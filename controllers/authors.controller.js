const bcrypt = require('bcrypt');
const Author = require('../models/Author.model');

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

exports.login = () => {};
