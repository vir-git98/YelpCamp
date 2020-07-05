//Packages
const express=require("express");
const ejs=require("ejs");
const app=express();
const bodyParser = require ("body-parser");
const mongoose=require("mongoose");

//MongoDB connection
mongoose.connect('mongodb://localhost/yelpcamp', {useUnifiedTopology: true, useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//MongoDB schema
const campgroundsSchema = new mongoose.Schema({
    name: String,
    image:String,
    description:String
});

//MongoDB model
const Campground= mongoose.model('Campground', campgroundsSchema);

//MongoDB DB
/*
Campground.create(
    {
        name:"Spiti Valley, Himachal Pradesh",
        image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/spiti-valley-himachal-pradesh.jpg",
        description:"Great place for family holidays."
    },
    function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            console.log(campgrounds);
        }
    }
);
/*

const camps=[
    {
    name:"Spiti Valley, Himachal Pradesh",
    image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/spiti-valley-himachal-pradesh.jpg"
    },
    {
        name:"Chandratal Lake, Himachal Pradesh",
        image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/chandratal-lake-himachal-pradesh.jpg"
    },
    {
        name:"Solang Valley, Manali",
        image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/solang-valley-manali.jpg"
    },

    {
        name:"Tso Moriri, Ladakh",
        image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/tso-Moriri-Ladakh.jpg"
    }
];
*/
//HOME
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req,res){
    Campground.find({},function(err, campgrounds){
            if(err){
                console.log(err);
            }else{
                res.render("campgrounds",{camps:campgrounds});
            }
        }
    );    
});

//NEW CAMPGROUND
app.post("/campgrounds", function(req,res){
    const name=req.body.campname;
    const url=req.body.campurl;
    const desc=req.body.camdesc;
    const newCamp={name:name,image:url, description:desc};
    Campground.create(newCamp,function(err, campgrounds){
            if(err){
                console.log(err);
            }else{
                res.redirect("/campgrounds");
            }
        }
    );
});

//FORM TO ADD NEW CAMPGROUND
app.get("/campgrounds/new", function(req,res){
    res.render("addcampground");
});

//SHOW CAMPGROUND DESCRIPTION
app.get("/campgrounds/:id", function(req,res){
    
    Campground.findById(req.params.id, function(err, campgrounds){
            if(err){
            console.log(err);
            }else{
            res.render("showcampground",{camps:campgrounds});
            }
        }
    ); 
});

//CONNECTION
app.listen(3000);