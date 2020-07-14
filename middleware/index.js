//REQUIRED MODELS
const Campground= require("../models/campground"),
      Comment   = require("../models/comment");

//MIDDLEWARE OBJECT
const middlewareObj={};

//MIDDLEWARE TO CHECK IF A USER IS AUTHORTIZED TO EDIT OR DELETE CAMPGROUNDS
middlewareObj.checkCampgroundOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if (err) {
                req.flash("error", "Something went wrong!");
                res.redirect("/campgrounds");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }else{
                    req.flash("error", "You are not authorized!")
                    res.redirect("/campgrounds");
                }
            }
        });
    }else{
        req.flash("error","You need to login first!")
        res.redirect("/campgrounds");
    }
}

//MIDDLEWARE TO CHECK IF A COMMENT BELONGS TO THE CURRENTLY LOGGED IN USER OR NOT
middlewareObj.checkCommentOwnership = function (req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if (err) {
                req.flash("error", "Something went wrong!");
                res.redirect("/campgrounds");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();                   
                }else{
                    req.flash("error", "You are not authorized to do that!")
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in!")
        res.redirect("/campgrounds");
    }    
}

//MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN OR NOT
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }    
    req.flash("error", "You are not logged in, please login to continue!");
    res.redirect("/login");
}


//EXPORT THE MIDDLEWARE OBJECT
module.exports=middlewareObj