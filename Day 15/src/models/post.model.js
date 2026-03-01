const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        required: [ true, "imgUrl is required for creating an post" ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // The user field in the postSchema is defined as a reference to the ObjectId type from Mongoose. This indicates that the user field will store an ObjectId that references a document in another collection, specifically the "users" collection. By using mongoose.Schema.Types.ObjectId, we can establish a relationship between the posts and users in the database, allowing us to associate each post with a specific user and perform operations such as populating user details when fetching posts or enforcing referential integrity between the two collections.
        ref: "users", // this line establishes a reference to the "users" collection in the database. It indicates that the "user" field in the postSchema is a foreign key that references the _id field of documents in the "users" collection. This allows for the association of each post with a specific user, enabling functionalities such as retrieving posts created by a particular user or populating user details when fetching posts.
        required: [ true, "user id is required for creating an post" ]
    }
})


const postModel = mongoose.model("posts", postSchema)


module.exports = postModel