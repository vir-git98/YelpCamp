const express=require("express");
const app=express();

app.get("/", function(req,res){
    res.render("landing.ejs");
});

app.get("/campgrounds", function(req,res){
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
    res.render("campgrounds.ejs",{camps:camps});
});

app.listen(3000);