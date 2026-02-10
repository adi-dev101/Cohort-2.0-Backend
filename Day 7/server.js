require("dotenv").config() // ye line .env file se environment variables load karne ke liye hai

const mongoose = require("mongoose")
const connectToDb = require("./src/config/database")
const app = require("./src/app")


connectToDb()

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})