// src/models/notes.model.js is folder ka kaam hai ki database me notes kis tarah data store hoga yeh define karna.Iske bina hum database me data ka structure nahi bana sakte.

const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({ // ye batata hai ki schema banaya jisme teen fields hai: title, description aur age yahi kewal hai jo hum store karenge
    title: String,
    description: String,
    age: Number
})    

const noteModel = mongoose.model("notes", noteSchema) // notes naam ka collection banega jisme noteSchema ke hisab se data store hoga

module.exports = noteModel // taaki is model ko baaki jagah use kar sake