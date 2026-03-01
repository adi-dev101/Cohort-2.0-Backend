const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs") // ImageKit is a cloud-based image and video management service that provides a Node.js SDK for handling media uploads, transformations, and optimizations. In this code, the ImageKit SDK is used to upload images to the ImageKit platform when creating new posts. It allows developers to easily integrate image handling capabilities into their applications, enabling features such as resizing, cropping, and optimizing images for better performance and user experience.
const { toFile } = require("@imagekit/nodejs") // The toFile function is a utility provided by the ImageKit Node.js SDK that converts a Buffer object into a file format that can be uploaded to the ImageKit service. In this code, it is used to convert the uploaded image file (which is received as a Buffer from Multer) into a format that can be processed by the imagekit.files.upload() method for uploading the image to the ImageKit platform. This allows the application to handle image uploads seamlessly and integrate with ImageKit's features for managing and optimizing images.
const jwt = require("jsonwebtoken")


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY // The private key is a sensitive credential used to authenticate and authorize access to the ImageKit service. It should be kept secure and not exposed in client-side code or public repositories. In this code, the private key is stored in an environment variable (process.env.IMAGEKIT_PRIVATE_KEY) to ensure that it remains confidential and can be easily managed across different environments (development, staging, production) without hardcoding it into the source code. This allows the application to securely interact with the ImageKit API for uploading and managing images.
})


async function createPostController(req, res) {
    console.log(req.body, req.file)

    const token = req.cookies.token // The token is retrieved from the cookies of the incoming request (req.cookies.token) to authenticate the user making the request. This token is typically a JSON Web Token (JWT) that contains encoded information about the user, such as their user ID. By extracting the token from the cookies, the server can verify the user's identity and authorize access to protected routes or resources, such as creating a new post in this case. If the token is not provided or is invalid, the server can respond with an appropriate error message indicating unauthorized access.

    if (!token) {
        return res.status(401).json({
            message: "Token not provided, Unauthorized access"
        })
    }

    let decoded = null // to avoid block scope of decoded variable only inside try block, we are declaring it here and assigning value inside try block

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET) // The jwt.verify() function is used to verify the authenticity and integrity of a JSON Web Token (JWT) in Node.js applications. It takes the token as the first argument and the secret key (process.env.JWT_SECRET) as the second argument. The function checks if the token is valid, has not expired, and was signed with the correct secret key. If the token is valid, it returns the decoded payload contained within the token, which can include user information such as their ID. If the token is invalid or has expired, it throws an error, which can be caught and handled to respond with an appropriate error message indicating unauthorized access.
    } catch (err) {
        return res.status(401).json({
            message: "user not authorized"
        })
    }


    console.log(decoded)

    const file = await imagekit.files.upload({ // The file object is created by uploading the image file to the ImageKit service using the imagekit.files.upload() method. This method takes an object as an argument that contains the file data and metadata for the upload. In this code, the file data is provided as a Buffer created from the uploaded file (Buffer.from(req.file.buffer)), and additional metadata such as the file name ("Test") and the folder path ("cohort-2-insta-clone-posts") are also included. The resulting file object returned by the upload method contains information about the uploaded file, including its URL, which can be used to reference the image in the post being created.
        file: await toFile(Buffer.from(req.file.buffer), 'file'), // The toFile function is used to convert the uploaded image file, which is received as a Buffer from Multer (req.file.buffer), into a file format that can be processed by the ImageKit SDK for uploading. By calling await toFile(Buffer.from(req.file.buffer), 'file'), the code creates a file object that can be passed to the imagekit.files.upload() method for uploading the image to the ImageKit platform. This allows the application to handle image uploads seamlessly and integrate with ImageKit's features for managing and optimizing images.
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts" // The folder property in the file upload configuration specifies the directory or folder path within the ImageKit service where the uploaded file will be stored. In this code, the folder is set to "cohort-2-insta-clone-posts", which means that all images uploaded through this endpoint will be organized under this specific folder in the ImageKit account. This helps in managing and categorizing uploaded files, making it easier to retrieve and organize them later based on their associated posts or other criteria.
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decoded.id
    })

    res.status(201).json({
        message: "Post created successfully.",
        post
    })
}


async function getPostController(req, res) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "UnAuthorized Access"
        })
    }

    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "Token invalid"
        })
    }

    const userId = decoded.id // The userId is extracted from the decoded JWT token (decoded.id) to identify the user making the request. This userId is typically included in the payload of the JWT when it is generated during user authentication. By extracting the userId from the token, the server can associate the incoming request with a specific user and perform operations such as fetching posts created by that user or enforcing access control based on the user's identity. In this code, the userId is used to query the database for posts that belong to the authenticated user, ensuring that users can only access their own posts.

    const posts = await postModel.find({
        user: userId
    })

    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })

}

async function getPostDetailsController(req, res) {

    const token = req.cookies.token // The token is retrieved from the cookies of the incoming request (req.cookies.token) to authenticate the user making the request. This token is typically a JSON Web Token (JWT) that contains encoded information about the user, such as their user ID. By extracting the token from the cookies, the server can verify the user's identity and authorize access to protected routes or resources, such as fetching details about a specific post in this case. If the token is not provided or is invalid, the server can respond with an appropriate error message indicating unauthorized access.

    if (!token) {
        return res.status(401).json({
            message: "UnAuthorized Access"
        })
    }

    let decoded = null; // to avoid block scope of decoded variable only inside try block, we are declaring it here and assigning value inside try block

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }
    const userId = decoded.id 
    const postId = req.params.postId // The postId is extracted from the request parameters (req.params.postId) to identify the specific post for which the details are being requested. In this code, the postId is used to query the database for a post with that specific ID. By retrieving the postId from the request parameters, the server can fetch and return the details of the requested post, while also ensuring that the user making the request has the necessary permissions to access that post's information. This allows for secure and targeted retrieval of post details based on user requests.

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const isValidUser = post.user.toString() === userId // tostring() is used here because post.user is likely a Mongoose ObjectId, which needs to be converted to a string for comparison with the userId extracted from the JWT, which is also a string.

    if (!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched  successfully.",
        post
    })

}


module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
}