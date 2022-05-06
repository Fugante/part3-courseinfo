const cors = require("cors")
const express = require("express")


const requestLogger = (request, response, next) => {
    console.log("Method:", request.method)
    console.log("Path: ", request.path)
    console.log("Body: ", request.body)
    console.log("---")
    next()
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    }
]

const generateId = () => (
    (notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0) + 1
)


app.get("/api/notes", (request, response) => {
    response.json(notes)
})
app.post("/api/notes/", (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({error: "content missing"})
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
    notes = notes.concat(note)
    response.json(note)
})
app.get("/api/notes/:id", (request, response) => {
    const note = notes.find(note => note.id === Number(request.params.id))
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})
app.delete("/api/notes/:id", (request, response) => {
    notes = notes.filter(note => note.id !== Number(request.params.id))
    response.status(204).end()
})

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({error: "unknown endpoint"})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running in port ${PORT}`)
})