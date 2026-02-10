const express = require("express")
const noteModel = require("./models/notes.model")

const app = express()

app.use(express.json())

app.post("/notes", async(req,res) =>{
    const { title,description,age } = req.body // ye line request body se title aur description nikal rahi hai

    const note = await noteModel.create({ // ye line database me naya note create karegi
        title,
        description,
        age
    })

    res.status(201).json({ // 201 status code ka matlab hai "Created"
        message: "Note created successfully",
        note // ye line newly created note ko response me bhej rahi hai
    })
})

app.get("/notes", async(req,res) => {
    const notes = await noteModel.find() //ye line database se sabhi notes ko fetch karegi.... [.find() method notes ko fetch karti hai in form of array of objects]

    res.status(200).json({ // 200 status code ka matlab hai "OK"
        message: "Notes fetched successfully",
        notes // ye line fetched notes ko response me bhej rahi hai
    })
})

module.exports = app