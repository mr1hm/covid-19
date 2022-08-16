const pg = require('pg');

const conn = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// const Pool = require('pg').Pool;
// const conn = new Pool({
//   user: 'dev',
//   host: 'localhost',
//   database: 'cvtracker',
//   password: 'lfz',
//   port: 5432
// });

module.exports = conn;
