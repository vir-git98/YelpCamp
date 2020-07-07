const mongoose=require("mongoose");

//MongoDB SCHEMA FOR COMMENTS COLLECTION
const commentsSchema=mongoose.Schema({
    text:String,
    author:String
});

//MONGOOSE MODEL FOR MONGODB COLLECTION 'comments'
const Comment=mongoose.model("Comment", commentsSchema);

//EXPORT MONGOOSE MODEL
module.exports=Comment;