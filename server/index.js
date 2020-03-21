require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path');
const staticPath = path.join(__dirname, 'public');
const port = process.env.PORT;

app.use(express.static(staticPath));
app.use(express.json());

app.get('/', (req, res) => res.render('main'));

app.listen(port, () => console.log(`Listening on port ${port}`));
