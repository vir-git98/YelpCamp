const express=require("express");
const ejs=require("ejs");
const app=express();
app.set('view engine', 'ejs');
var bodyParser = require ("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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


app.get("/", function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds", function(req,res){
    res.render("campgrounds.ejs",{camps:camps});
});

app.post("/campgrounds", function(req,res){
    const name=req.body.campname;
    const url=req.body.campurl;
    const newCamp={name:name,image:url};
    camps.push(newCamp);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
    res.render("addcampground.ejs");
});


app.listen(3000);