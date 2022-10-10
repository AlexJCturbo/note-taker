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





function findByTitle(title, notesArray) {
  const result = notesArray.filter(note => note.title === title)[0];
  return result;
}

function createNewAnimal(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({db: notesArray}, null, 2)
  );

  return note;
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
  //Using uniqid to generate a the notes ID based on the time and the process
  //req.body.id = (db.length+1).toString();
  req.body.id = (uniqid.process('id-')).toString();
  //const note = createNote(req.body, db)

  const note = createNewAnimal(req.body, db);

  res.json(note);
});


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});