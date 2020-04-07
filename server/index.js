require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path');
const publicPath = path.join(__dirname, 'public/');
const db = require('./api/queries');
const conn = require('./api/db_conn');
const ClientError = require('./api/client-error');

app.use(express.static(publicPath));
app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  conn.query(`select 'successfully connected' as "message"`)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});
app.get('/api/lastUpdated', db.getLastUpdated);
app.post('/api/lastUpdated', db.storeLastUpdated);

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
})

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
})

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/api/lastUpdated', db.getLastUpdated);
app.post('/api/lastUpdated', db.storeLastUpdated);


app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
