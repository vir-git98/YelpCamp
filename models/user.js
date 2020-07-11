//REQUIREMENTS
const mongoose  =   require("mongoose"),
      passportLocalMongoose= require("passport-local-mongoose");

//MongoDB SCHEMA FOR users COLLECTION
const userSchema=new mongoose.Schema({
    username: String,
    password: String
});

//plugIn FOR PASSPORT LOCAL MONGOOSE
userSchema.plugin(passportLocalMongoose);

//MONGOOSE MODEL FOR user COLLECTION
const User= mongoose.model("User", userSchema);

//EXPORT MODEL
module.exports=User;
