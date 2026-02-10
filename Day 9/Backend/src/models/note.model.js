const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({  //Database ke bhasa me format ko schema kehte hai
    title: String,
    description: String,
})

const noteModel = mongoose.model("notes", noteSchema)  //notes is the name of the collection in the database, noteSchema is the format of the data in that collection

module.exports = noteModel // taaki is model ko baaki jagah use kar sake