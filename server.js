const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path");
const uniqid = require('uniqid'); 

const PORT = process.env.PORT || 3010;
const { db } = require("./db/db.json");

// app.use method allows us to mount function to the server known as middleware
// takes incoming POST data and parse the string or array into key/value pairs
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data into the req.body object
app.use(express.json());


//Funtion to find notes
function findByTitle(title, notesArray) {
  const result = notesArray.filter(note => note.title === title)[0];
  return result;
}

//Funtion to create new notes
function createNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({db: notesArray}, null, 2)
  );
  return note;
}

//Funtion to validate date when creating new note
function validateNewNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
}

//GET routes
app.get('/api/notes', (req, res) => {
  res.json(db);
});

app.get('/api/notes/:title', (req, res) => {
  const result = findByTitle(req.params.title, db);
  if (result) {
    res.json(result);
  } else {
    res.send(404)
  }
});

//POST routes
app.post('/api/notes', (req, res) => {
  //re.body is where the user inputs the content
  //req.body.id = (db.length+1).toString(); -> Option to create ID
  
  //Using uniqid to generate a the notes ID based on the time and the process
  req.body.id = (uniqid.process('id-')).toString();

  if (!validateNewNote(req.body)) {
    res.status(400).send('Please introduce a name and a text for your note.');
  } else {
    const note = createNote(req.body, db);
    res.json(note);
  }
});


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});