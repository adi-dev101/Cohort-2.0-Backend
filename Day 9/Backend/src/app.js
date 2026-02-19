const express = require("express")
const noteModel = require("./models/note.model")  // Import the note model to interact with the notes collection in the database
const cors = require("cors") // Import the CORS middleware to enable Cross-Origin Resource Sharing, allowing the frontend application to make requests to the backend API from a different origin
const path = require("path") // Import the path module to work with file and directory paths

const app = express()
app.use(cors())  // Use the CORS middleware to enable Cross-Origin Resource Sharing for all routes in the application
app.use(express.json())  // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, "../public")))  // Middleware to serve static files from the public directory, allowing the frontend application to access the necessary assets such as HTML, CSS, and JavaScript files to render the user interface and interact with the backend API
/**     
 * - POST /api/notes 
 * - Create a new note and save it to the mongoDb database.
 * - req.body will contain the title and description of the note.
 */

app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body

    const note =await noteModel.create({ title, description })  // Create a new note document in the database using the note model

    res.status(201).json({
        message: "Note created successfully",
        note  // Return the created note in the response
    })
})

/**     
 * - GET /api/notes 
 * - Retrieve all notes from the mongoDb database and return them in the response.
 */
app.get("/api/notes", async (req, res) => {
    const notes = await noteModel.find()  // Retrieve all note documents from the database using the note model

    res.status(200).json({
        message: "Notes retrieved successfully",
        notes  // Return the retrieved notes in the response in the form of an array of note objects
    })
})

/**     
 * - DELETE /api/notes/:id 
 * - Delete a note with the specified id from the mongoDb database.
 * - req.params.id will contain the id of the note to be deleted.
 */
app.delete("/api/notes/:id", async (req, res) => {
    const id = req.params.id  // Extract the id of the note to be deleted from the request parameters 
    const deletedNote = await noteModel.findByIdAndDelete(id)  // Delete the note with the specified id from the database

    // if (!deletedNote) { // !deletedNote means that if the note with the specified id was not found in the database, then return a 404 Not Found response with a message indicating that the note was not found 
    //     return res.status(404).json({
    //         message: "Note not found"
    //     })
    // }
    res.status(200).json({
        message: "Note deleted successfully",
        deletedNote  // Return the deleted note in the response
    })
})

/**
 * - PATCH /api/notes/:id 
 * - Update a note's description with the specified id in the mongoDb database.
 * - req.params.id will contain the id of the note to be updated.
 */
app.patch("/api/notes/:id", async (req, res) => {
    const id = req.params.id  // Extract the id of the note to be updated from the request parameters 
    const { description } = req.body  // Extract the updated description of the note from the request body

    const updatedNote = await noteModel.findByIdAndUpdate(id, { description })  // Update the note with the specified id in the database with the new description and return the updated note

    res.status(200).json({
        message: "Note updated successfully",
        updatedNote  // Return the updated note in the response 
    })
})

app.use('*name', (req,res) => {  // Middleware to handle any requests that do not match the defined API routes, serves the index.html file from the public directory to allow the frontend application to handle client-side routing and display the appropriate content based on the URL path
    res.sendFile(path.join(__dirname, "../public/index.html")) // Send the index.html file located in the public directory as the response to any requests that do not match the defined API routes, allowing the frontend application to handle client-side routing and display the appropriate content based on the URL path
})
//__dirname is a global variable in Node.js that represents the directory name of the current module, path.join is used to construct the absolute path to the index.html file by joining the __dirname with the relative path to the index.html file in the public directory
module.exports = app