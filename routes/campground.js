const express   =  require("express"),
     Campground = require("../models/campground"),
      router    =  express.Router({mergeParams:true}),
      middleware= require("../middleware");


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
router.post("/", middleware.isLoggedIn ,function (req, res) {
    const name = req.body.campname;
    const url = req.body.campurl;
    const desc = req.body.campdesc;
    const grabauthor={
        id:req.user._id,
        username:req.user.username
    };
    const newCamp = { name: name, image: url, description: desc, author:grabauthor };
    Campground.create(newCamp, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            console.log(newCamp);
            res.redirect("/campgrounds");
        }
    }
    );
});

    //2. FORM TO ADD NEW CAMPGROUND ROUTE
router.get("/new", middleware.isLoggedIn ,function (req, res) {
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

//EDIT AND UPDATE CAMPGROUND ROUTES
    //1.EDIT FORM ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        }else{
            res.render("campgrounds/editcampground", {camps:foundCampground});
        }
    });
});

    //HANDLE EDIT AND UPDATE DATA PUT ROUTE
router.put("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    const name=req.body.campname,
          img =req.body.campurl,
          desc=req.body.campdesc,
          newData={
              name:name,
              image:img,
              description:desc
          };
    Campground.findByIdAndUpdate(req.params.id, newData, function(err,updatedCampground){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds/"+updatedCampground._id);
        }
    });
});

//DELETE/DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports=router;