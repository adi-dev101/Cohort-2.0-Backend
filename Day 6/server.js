// server.js ke do teen hain:
// 1. app.js ko import karna
// 2. server ko start karna
// 3. Server ko database se connect karna (agar zarurat ho toh) 

const app = require("./src/app")
const mongoose = require("mongoose")

function connectToDb() {
    mongoose.connect("mongodb+srv://gigwork121_db_user:cXPT118HWnTZ4qZm@cluster0.uuzg06l.mongodb.net/day-6")
    .then(() => {
        console.log("Connected to DB")
    })
}

connectToDb()

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})