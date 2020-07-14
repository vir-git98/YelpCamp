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
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }else{
                    res.redirect("back");
                    console.log("Need authorization.")
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

//MIDDLEWARE TO CHECK IF A COMMENT BELONGS TO THE CURRENTLY LOGGED IN USER OR NOT
middlewareObj.checkCommentOwnership = function (req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if (err) {
                console.log(err);
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();                   
                }else{
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }    
}

//MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN OR NOT
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }    
    res.redirect("/login");
}


//EXPORT THE MIDDLEWARE OBJECT
module.exports=middlewareObj