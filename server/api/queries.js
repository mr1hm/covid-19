const Pool = require('pg').Pool;
const conn = require('./db_conn');

const getLastUpdated = (req, res, next) => {
  conn.query(`select * from lastupdated WHERE id = 1`)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
}

// const getLastUpdated = (req, res) => {
//   conn.query(`SELECT * FROM lastUpdated ORDER BY id ASC`, (err, results) => {
//     console.log(results.rows);
//     if (err) throw err;
//     res.status(200).json(results.rows);
//   })
// }

const storeLastUpdated = (req, res, next) => {
  const { unixTimestamp } = req.body;
  conn.query(`INSERT INTO lastupdated (datetime) VALUES ($1)`, [unixTimestamp], (err, results) => {
    if (err) throw err;
    res.status(201).json({
      insertID: results.insertId
    });
  })
  // .then(result => res.json(result.rows[0]))
  // .catch(err => next(err));
}

// const storeLastUpdated = (req, res) => {
//   const { lastUpdated } = req.body;
//   conn.query(`INSERT INTO users (lastUpdated) VALUES ($1)`, [lastUpdated], (err, results) => {
//     if (err) throw err;
//     res.status(201).send(`LastUpdated stored with ID: ${results.insertId}`);
//   })
// }

module.exports = {
  getLastUpdated,
  storeLastUpdated,
}
