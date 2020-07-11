const express   =  require("express"),
     Campground = require("../models/campground"),
      router    =  express.Router({mergeParams:true}); 


//CAMPGROUNDS INDEX
router.get("/", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds", { camps: campgrounds });
        }
    }
    );
});

//ADD NEW CAMPGROUND ROUTES

    //1. NEW CAMPGROUND POST HANDLE ROUTE
router.post("/", isLoggedIn ,function (req, res) {
    const name = req.body.campname;
    const url = req.body.campurl;
    const desc = req.body.camdesc;
    const newCamp = { name: name, image: url, description: desc };
    Campground.create(newCamp, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    }
    );
});

    //2. FORM TO ADD NEW CAMPGROUND ROUTE
router.get("/new", isLoggedIn ,function (req, res) {
    res.render("campgrounds/addcampground");
});

//SHOW CAMPGROUND DESCRIPTION
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/showcampground", { camps: campgrounds });
        }
    });
});

//MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN OR NOT
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }    
    res.redirect("/login");
}

module.exports=router;