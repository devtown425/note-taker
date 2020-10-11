// requires express, path, file system (fs) and uuid for generating unique id
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid').v4;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// gets you the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// gets you the objects in json db
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// gets you the notes in json db
app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

// gets you index.html when type in random address
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// post input into json db
app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));
    const note = req.body;


    notes.push({
        id: uuid4(),
        title: note.title,
        text: note.text
    });

    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));
    res.json(notes); 
});


//deletes object from json db
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
   
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = uuid4();
        
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port ${port}.`);
});
