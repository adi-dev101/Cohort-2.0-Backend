const express = require("express")
const postRouter = express.Router()
const postController = require("../controllers/post.controller")
const multer = require("multer") // Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files in Node.js applications. It allows you to easily handle file uploads by parsing the incoming request and providing access to the uploaded files through the req.file or req.files object. In this code, multer is used to handle the image file upload when creating a new post, allowing users to attach an image to their post along with a caption.
const upload = multer({ storage: multer.memoryStorage() }) // This line configures Multer to use memory storage for handling file uploads. By using multer.memoryStorage(), the uploaded files will be stored in memory as Buffer objects instead of being saved to disk. This is useful when you want to process the uploaded files directly in your application without needing to save them to the server's filesystem. In this code, it allows the uploaded image file to be accessed as a Buffer, which can then be used for further processing, such as uploading it to a cloud storage service like ImageKit.



/**
 * POST /api/posts [protected]
 * - req.body = { caption,image-file }
 */
postRouter.post("/", upload.single("chacha"), postController.createPostController) // This line defines a POST route for creating a new post at the endpoint /api/posts. The upload.single("chacha") middleware is used to handle the file upload, where "chacha" is the name of the form field that contains the image file. When a request is made to this endpoint, Multer will process the incoming multipart/form-data request, extract the file from the "chacha" field, and make it available in the req.file object for further processing in the createPostController function. This allows users to create a new post with an attached image by sending a POST request to this endpoint with the appropriate form data.


/**
 * GET /api/posts/ [protected]
 */
postRouter.get("/", postController.getPostController)


/**
 * GET /api/posts/details/:postid
 * - return an detail about specific post with the id. also check whether the post belongs to the user that the request come from
 */
postRouter.get("/details/:postId", postController.getPostDetailsController)


module.exports = postRouter