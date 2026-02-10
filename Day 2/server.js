const express = require("express") //importing express module

const app = express() //creating a server instance

app.get("/", (req,res)=> {  //handling GET request to root route
    res.send("Hlw World!")
}) 

app.get("/about", (req,res)=> {  
    res.send("This is about page..")
}) 

app.get("/home", (req,res)=> {  
    res.send("This is home page...")
}) 


app.listen(3000) //server listening on port 3000

