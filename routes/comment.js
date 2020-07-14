const Campground = require("../models/campground"),
      express    =  require("express"),
      Comment    = require("../models/comment"),
      router     =  express.Router({mergeParams:true}),
      middleware = require("../middleware");

//ROUTES FOR ADDING A COMMENT
    //1. FORM TO ADD NEW COMMENT ROUTE
    router.get("/new", middleware.isLoggedIn ,function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.flash("error", "Something went wrong!");
                res.redirect("/campgrounds");
            }else{
                res.render("comments/addcomment",{camps:foundCampground});
            }
        });
    });
    
        //2. CREATE NEW COMMENT POST ROUTE
    router.post("/", middleware.isLoggedIn ,function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){
            if (err) {
                req.flash("error", "Something went wrong!");
                res.redirect("/campgrounds");
            }else{
                Comment.create(req.body.comment, function(err,foundComment){
                    if (err) {
                        req.flash("error", "Something went wrong!");
                        res.redirect("/campgrounds");
                    } else {
                        foundComment.author.id=req.user._id;
                        foundComment.author.username=req.user.username;
                        foundComment.save();
                        foundCampground.comments.push(foundComment);
                        foundCampground.save();
                        req.flash("success", "Comment added!")
                        res.redirect('/campgrounds/'+foundCampground._id);
                    }
                });
            }
        });
    });

//EDIT COMMENT ROUTES
    //1.SHOW EDIT FORM ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req,res){
    const CampgroundID=req.params.id;
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");            
        } else {
            res.render("comments/editcomment", {comment:foundComment, CampgroundID:CampgroundID});   
        }
    });
});

    //2.HANDLE THE EDIT FORM AND UPDATE COMMENT PUT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership ,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if (err) {            
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment updated!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DELETE/DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership ,function (req,res) {
   Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        } else {
            req.flash("error", "Comment deleted!")
            res.redirect("/campgrounds/"+req.params.id);
        }
   });
});

module.exports=router;