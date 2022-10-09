const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

const { notes } = require('./db/db.json')


function findByTitle(title, notesArray) {
  const result = notesArray.filter(note => note.title === title)[0];
  return result;
}

app.get('/api/notes', (req, res) => {
  let results = notes;
  console.log(req.query)
  res.json(results);
});


app.get('/api/notes/:title', (req, res) => {
  const result = findByTitle(req.params.title, notes);
    res.json(result);
});


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});