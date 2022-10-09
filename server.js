const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

// app.use method allows us to mount function to the server known as middleware
// takes incoming POST data and parse the string or array into key/value pairs
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data into the req.body object
app.use(express.json());

const PORT = process.env.PORT || 3001;

const { notes } = require('./db/db.json')


//GET functions
function findByTitle(title, notesArray) {
  const result = notesArray.filter(note => note.title === title)[0];
  return result;
}

//POST functions
function createNote (body, notesArray) {
  const note = body;
  notesArray.push(note)
  fs.writeFileSync(
    //join value of __dirname where we execute the code and db/db.json
    path.join(__dirname, 'db/db.json'),

    //use JSON.stringify() to convert data to json format
    JSON.stringify({ db: notesArray }, null, 2)
  );
  return note;
}

//GET routes
//Returns all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  let results = notes;
  console.log(req.query);
  res.json(results);
});

app.get('/api/notes/:title', (req, res) => {
  const result = findByTitle(req.params.title, notes);
  res.json(result);
});


//POST routes
app.post('/api/notes', (req, res) => {
  //re.body is where the user inputs the content
  //Using uniqid to generate a the notes ID based on the time and the process
  req.body.id = (uniqid.process('id-')).toString();
  const note = createNote(req.body, notes)

  res.json(note);
});



app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});