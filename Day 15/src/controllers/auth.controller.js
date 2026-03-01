const userModel = require('../models/user.model')
const bcrypt = require("bcryptjs") // bcrypt is a popular library used for hashing passwords in Node.js applications. It provides a secure way to store passwords by applying a hashing algorithm that makes it computationally expensive to reverse the hash back to the original password. This helps protect user credentials in case of a data breach, as attackers would have to spend significant time and resources to crack the hashed passwords. In this code, bcrypt is used to hash the user's password before storing it in the database during registration and to compare the provided password with the stored hash during login.
const jwt = require("jsonwebtoken")


async function registerController(req, res) {
    const { email, username, password, bio, profileImage } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409)
            .json({
                message: "User already exists " + (isUserAlreadyExists.email == email ? "Email already exists" : "Username already exists")
            })
    }

    const hash = await bcrypt.hash(password, 10) // The bcrypt.hash() function is used to hash a password in Node.js applications. It takes two arguments: the first is the plain text password that you want to hash, and the second is the number of salt rounds (in this case, 10). The salt rounds determine how many times the hashing algorithm will be applied, making it more secure by increasing the time it takes to generate the hash. The resulting hash is a string that can be stored in the database instead of the plain text password, providing an added layer of security for user credentials.

    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash
    })

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User Registered successfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })


}

async function loginController(req, res) {
    const { username, email, password } = req.body

    /**
     * username
     * password
     * 
     * email
     * password
     */

    /**
     * { username:undefined,email:test@test.com,password:test } = req.body
     */

    const user = await userModel.findOne({
        $or: [
            {
                username: username
            },
            {
                email: email
            }
        ]
    })

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password) // The bcrypt.compare() function is used to compare a plain text password with a hashed password in Node.js applications. It takes two arguments: the first is the plain text password that the user is trying to authenticate with, and the second is the hashed password stored in the database. The function returns a boolean value indicating whether the provided password matches the stored hash. This is commonly used during the login process to verify that the user's inputted password is correct without exposing the actual password in the database, enhancing security.

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "password invalid"
        })
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)


    res.status(200)
        .json({
            message: "User loggedIn successfully.",
            user: {
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        })
}

module.exports = {
    registerController,
    loginController
}