const express   =  require("express"),
      passport  = require("passport"),
      router    =  express.Router({mergeParams:true}),
      User      = require("../models/user"),
      middleware= require("../middleware");

//HOME
router.get("/", function (req, res) {
    res.render("landing");
});

//REGISTER USER ROUTES
    //1.SHOW SIGN UP FORM ROUTE
router.get("/register", function (req,res) {
    res.render("signup");    
});

    //2. HANDLE SIGN UP ROUTE
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });  
})

//LOGIN ROUTES
    //1.LOGIN FORM ROUTE
router.get("/login", function (req,res) {
   res.render("login"); 
});

    //2.LOGIN HANDLE ROUTE
router.post("/login",passport.authenticate("local",
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),
    function (req,res) {}
);

//LOGOUT ROUTE
router.get("/logout", function (req,res) {
   req.logout(); 
   res.redirect("/");
});

module.exports=router;