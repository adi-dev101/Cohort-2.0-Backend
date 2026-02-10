// Is App.js ka kaam server create karna aur use configure karna hai

const express = require('express') // express module ko import kar rahe hain

const notes=[]


const app = express() // express application create kar rahe hain


app.use(express.json()) // JSON request bodies ko parse karne ke liye middleware use kar rahe hain


// Root route
app.get("/", (req,res) => {
    res.send('Hello World! This is my first Express Server.')   
})

// Add a new note
app.post("/notes",(req,res)  => {
    console.log(req.body)
    notes.push(req.body)

    console.log(notes)

    res.send("Note added successfully")
})

// Get all notes
app.get("/notes",(req,res) => {
    res.send(notes)
})

// Delete note by index
app.delete("/notes/:index",(req,res) => {
    delete notes [req.params.index] //delete makes it null but keeps the index but if we use splice it will remove the index also
    res.send("Note deleted successfully")
})

//patch request to update a note partially
app.patch("/notes/:index",(req,res) => {
    notes[req.params.index].description = req.body.description
    res.send("Note updated successfully")
})

module.exports = app // app ko export kar rahe hain taaki server.js me use kiya ja 


