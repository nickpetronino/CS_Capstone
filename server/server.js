const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
//const { response } = require('./app');

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get('/status', (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

app.post('/search', (request, response) => {
    console.log(request.body.searchString)
});

app.get('/list-files', (request, response) => {
    const rv = []
    const files = fs.readdirSync(__dirname + '/repo')
    files.forEach(file => {
        const stats = fs.statSync(__dirname + '/repo/' + file)
        rv.push({
            name: file,
            size: stats.size,
            modTime: stats.mtime
        })
    })
    console.log('rv = ', rv)
    response.send(rv)
})

app.post('/create-file', async (request, response) => {
    const courseTitle = request.body.courseTitle
    const chapterDescription = request.body.chapterDescription
    const chapterTitle = request.body.chapterTitle
    const fileName = __dirname + '/repo/' + courseTitle + "-" + chapterTitle + ".json";

    console.log("Course Title = ", request.body.courseTitle);

    const fileBody = {
        courseTitle,
        chapterTitle,
        chapterDescription,
        notes: []

    }
    //TODO: CHECK FOR FILE EXISTENCE 
    fs.writeFileSync(fileName, JSON.stringify(fileBody))
    response.send({ "Status": "File Created" })
})

app.post('/create-note', async (request, response) => {
    const fileName = request.body.file.name
    const studentID = request.body.studentID                                         //How to set this to user login?
    const time = Date.now();
    const noteTitle = request.body.noteTitle
    const note = request.body.note
    // const fileName = __dirname + '/repo/' + courseTitle + "-" + chapterTitle + ".json"; //Check this line? How to we want to write this into the actual file.
    console.log("Course Title = ", request.body.courseTitle);

    const fn = __dirname + '/repo/' + fileName;
    const contents = JSON.parse(fs.readFileSync(fn));
    

    //Based off fileBody{} from above, just now with these variables?
    const noteBody = {
        
        studentID,
        time,
        noteTitle,
        note
    }
    //TODO: CHECK FOR FILE EXISTENCE 
    contents.notes.push(noteBody)
    fs.writeFileSync(fn, JSON.stringify(contents))
    response.send({ "Status": "Note Added" })
})

app.post('/read-file', (request, response) => {
    const courseTitle = request.body.courseTitle
    const chapterTitle = request.body.chapterTitle
    const fileName = __dirname + '/repo/' + request.body.name;
    const contents = fs.readFileSync(fileName)

    console.log(contents)

    response.send(contents)
})
