// load our env variables
require('dotenv').config();
const pg = require('pg');

// create a pg Pool object
const pool = new pg.Pool({
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
});

// export it
module.exports = pool;
