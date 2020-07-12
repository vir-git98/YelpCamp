const mongoose=require("mongoose");

//MongoDB SCHEMA FOR CAMPGROUNDS COLLECTION
const campgroundsSchema = new mongoose.Schema({
    name: String,
    image:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

//MONGOOSE MODEL FOR MONGODB COLLECTION 'campgrounds'
const Campground= mongoose.model('Campground', campgroundsSchema);

//EXPORT MONGOOSE MODEL
module.exports=Campground;