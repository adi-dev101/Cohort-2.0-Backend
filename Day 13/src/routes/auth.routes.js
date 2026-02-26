const express = require('express')
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const authRouter = express.Router() // this line creates a new router object using Express. The authRouter will be used to define routes related to authentication, such as user registration and login. By using a router, we can modularize our code and keep the authentication-related routes separate from other parts of the application, making it easier to manage and maintain.
const crypto = require("crypto")

// this file defines the authentication routes for user registration and login. It uses Express to create a router, interacts with the user model to manage user data, and utilizes JSON Web Tokens (JWT) for authentication. The crypto module is used to hash passwords securely before storing them in the database. The routes handle incoming requests for registering new users and logging in existing users, providing appropriate responses based on the success or failure of these operations.


/**
 * /api/auth/register
 */
authRouter.post("/register", async (req, res) => { // this line defines a POST route for the endpoint "/register" on the authRouter. When a POST request is made to this endpoint, the provided asynchronous callback function will be executed to handle the registration logic for a new user.
    const { email, name, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({ email }) // this line checks if a user with the provided email already exists in the database. It uses the userModel to query the database for a user document that matches the given email. If a user is found, it will be stored in the variable 'isUserAlreadyExists'. This check is important to prevent duplicate user registrations with the same email address.

    if (isUserAlreadyExists) { 
        return res.status(409).json({
            message: "User already exists with this email address"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex") // this line creates an MD5 hash of the password provided by the user. It uses the crypto module to create a hash object, updates it with the password, and then generates the final hash in hexadecimal format. This is a common practice to securely store passwords in a database, as it prevents storing plain text passwords and adds a layer of security against potential data breaches.

    const user = await userModel.create({ // this line creates a new user in the database using the userModel. It takes an object with the user's email, name, and the hashed password (instead of the plain text password) and saves it to the database. The created user object is then stored in the variable 'user' for further use, such as generating a JWT token or sending a response back to the client.
        email, password: hash, name
    })

    const token = jwt.sign( // this line generates a JSON Web Token (JWT) for the newly registered user. It uses the jwt.sign() method to create a token that includes the user's id and email as the payload. The token is signed using a secret key (process.env.JWT_SECRET) to ensure its integrity and security. This token can be used for authentication purposes in subsequent requests made by the user, allowing them to access protected routes or resources without needing to log in again until the token expires.
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token) // this line sets a cookie named "jwt_token" in the response, containing the generated JWT token. This allows the client to store the token in their browser and include it in subsequent requests for authentication purposes. By using cookies, the server can easily manage user sessions and maintain authentication state across different requests without requiring the client to manually include the token in each request header.

    res.status(201).json({
        message: "user registered",
        user,
        token
    })
}

)


/**
 * POST /api/auth/login
 */
authRouter.post("/login", async (req, res) => { // this line defines a POST route for the endpoint "/login" on the authRouter. When a POST request is made to this endpoint, the provided asynchronous callback function will be executed to handle the login logic for an existing user.

    const { email, password } = req.body

    const user = await userModel.findOne({ email }) // this line checks if a user with the provided email exists in the database. It uses the userModel to query the database for a user document that matches the given email. If a user is found, it will be stored in the variable 'user'. This check is important to verify that the user attempting to log in has an account associated with the provided email address. If no user is found, it indicates that the email address is not registered, and an appropriate response can be sent back to the client.

    if (!user) { 
        return res.status(404).json({
            message: "User not found with this email address"
        })
    }

    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex") // this line checks if the provided password matches the stored hashed password for the user. It creates an MD5 hash of the input password and compares it to the hashed password stored in the database (user.password). If they match, it means the user has entered the correct password, and the variable 'isPasswordMatched' will be set to true. If they do not match, it indicates that the password is incorrect, and appropriate action can be taken, such as sending an error response back to the client.

    if (!isPasswordMatched) { // this condition checks if the password provided by the user does not match the stored hashed password. If the passwords do not match, it means the user has entered an incorrect password, and the server responds with a 401 Unauthorized status code along with a JSON message indicating that the password is invalid. This is an important security measure to prevent unauthorized access to user accounts.
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({ // this line generates a JSON Web Token (JWT) for the authenticated user. It uses the jwt.sign() method to create a token that includes the user's id as the payload. The token is signed using a secret key (process.env.JWT_SECRET) to ensure its integrity and security. This token can be used for authentication purposes in subsequent requests made by the user, allowing them to access protected routes or resources without needing to log in again until the token expires.
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("jwt_token", token) // this line sets a cookie named "jwt_token" in the response, containing the generated JWT token. This allows the client to store the token in their browser and include it in subsequent requests for authentication purposes. By using cookies, the server can easily manage user sessions and maintain authentication state across different requests without requiring the client to manually include the token in each request header.

    res.status(200).json({
        message: "user logged in",
        user,
    })
})

module.exports = authRouter // this line exports the authRouter, making it available for use in other parts of the application. By exporting the authRouter, it can be imported and used in the main application file (e.g., app.js) to set up the authentication routes for handling user registration and login functionality. This modular approach helps keep the code organized and maintainable by separating concerns into different files.