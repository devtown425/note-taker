const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid4 = require('uuid').v4;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));
    const note = req.body;

    // push note to notes
    notes.push({
        id: uuid4(),
        title: note.title,
        text: note.text
    });

    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(notes));
    res.json(notes); 
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    res.json()
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Express server listening on port ${port}.`);
});
