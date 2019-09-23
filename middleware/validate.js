const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
  // 1. get the token
  const auth = request.headers.authorization;
  if (!auth) return response.send(401);

  const token = auth.split(' ')[1];
  try {
    // 2. verify it
    jwt.verify(token, process.env.JWT_SECRET);
    // move on if good
    next();
  } catch (error) {
    // else die if bad
    response.sendStatus(401);
  }
};
