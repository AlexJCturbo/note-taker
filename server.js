const express = require('express');
const app = express();

const { notes } = require('./db/db.json')

app.get('/notes', (req, res) => {
  res.send('Hello!');
});

app.listen(3001, () => {
  console.log(`API server now on port 3001!`);
});