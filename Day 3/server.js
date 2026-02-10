const express = require("express")

const app = express()

app.use(express.json()) // Middleware to parse JSON request bodies otherwise req.body will be undefined

const notes = [
    {
        title: "test title 1",
        description: "test description 1"
    },

    {
        title: "test title 2",
        description: "test description 2"
        
    }
]

app.post("/notes", (req, res) => { // Endpoint to create a new note

    console.log(req.body)

    notes.push(req.body)

    res.send("Note created")
})

app.get("/notes", (req, res) => { // Endpoint to get all notes
    res.send(notes)
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000")
})