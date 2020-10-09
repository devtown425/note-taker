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
