// load our env variables
require('dotenv').config();

const pg = require('pg');

// pick variables from .env
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } = process.env;
// construct our connection string
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
// create a pg Pool object
const pool = new pg.Pool({ connectionString });
// export it
module.exports = pool;
