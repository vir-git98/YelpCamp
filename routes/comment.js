const express   =  require("express"),
      Comment   = require("../models/comment"),
      router    =  express.Router({mergeParams:true}); 

//ROUTES FOR ADDING A COMMENT
    //1. FORM TO ADD NEW COMMENT ROUTE
    router.get("/new", isLoggedIn ,function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                console.log(err);
            }else{
                res.render("comments/addcomment",{camps:foundCampground});
            }
        });
    });
    
        //2. CREATE NEW COMMENT POST ROUTE
    router.post("/", isLoggedIn ,function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){
            if (err) {
                console.log(err);
            }else{
                Comment.create(req.body.comment, function(err,foundComment){
                    if (err) {
                        console.log(err);
                    } else {
                        foundCampground.comments.push(foundComment);
                        foundCampground.save();
                        res.redirect('/campgrounds/'+foundCampground._id);
                    }
                });
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