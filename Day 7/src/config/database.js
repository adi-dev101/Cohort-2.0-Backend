// src/config/database.js yeh file database se connect hone ka kaam karti hai halanki ye kaam server.js me bhi ho sakta tha lekin humne isse alag file me rakhna behtar samjha taaki code zyada organized rahe.

const mongoose = require("mongoose")


function connectToDb(){
    mongoose.connect(process.env.MONG0_URI) // ye line environment variable se MongoDB URI le rahi hai
    .then(() => {
        console.log("Connected to MongoDB")
    })
}

module.exports = connectToDb