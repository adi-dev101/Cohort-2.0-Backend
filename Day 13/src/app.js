const express = require("express")
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser") // this middleware is used to parse cookies from the incoming request headers, making it easier to access cookie data in the application

const app = express()

app.use(express.json())
app.use(cookieParser())  // this middleware is for parsing cookies from the request headers

app.use("/api/auth", authRouter) // this sets up the route for authentication-related endpoints, which will be handled by the authRouter

module.exports = app