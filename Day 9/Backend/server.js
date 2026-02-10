require("dotenv").config()  // Load environment variables from .env file

const app = require("./src/app")
const connectDB = require("./src/config/database")

connectDB()  // Connect to the database



app.listen(3000, () => {
    console.log("Server is running on port 3000")
})