//REQUIRED ENTITIES
const express       = require("express"),
      ejs           = require("ejs"),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeddb"),
      app           = express(),
      expressSession= require("express-session"),
      passport      = require("passport"),
      passportLocal = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose");

      seedDB();
//MongoDB/Mongoose CONFIGURATION
mongoose.connect('mongodb://localhost/yelpcamp', { useUnifiedTopology: true, useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));

//EJS CONFIGURATION
app.set('view engine', 'ejs');

//PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "Yelpcamp session secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//HOLD INFO OF LOGGED IN USER AND RUN IT AS A MIDDLEWARE FOR ALL PAGES
app.use(function (req,res,next) {
   res.locals.currentUser=req.user;
   console.log(req.user);
   next(); 
});

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
app.get("/", function (req, res) {
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function (req, res) {
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
app.post("/campgrounds", isLoggedIn ,function (req, res) {
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
app.get("/campgrounds/new", isLoggedIn ,function (req, res) {
    res.render("campgrounds/addcampground");
});

//SHOW CAMPGROUND DESCRIPTION
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/showcampground", { camps: campgrounds });
        }
    });
});

//ROUTES FOR ADDING A COMMENT

    //1. FORM TO ADD NEW COMMENT ROUTE
app.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/addcomment",{camps:foundCampground});
        }
    });
});

    //2. CREATE NEW COMMENT POST ROUTE
app.post("/campgrounds/:id/comments", isLoggedIn ,function(req,res){
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

//REGISTER USER ROUTES
    //1.SHOW SIGN UP FORM ROUTE
app.get("/register", function (req,res) {
    res.render("signup");    
});

    //2. HANDLE SIGN UP ROUTE
app.post("/register", function(req, res) {
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
app.get("/login", function (req,res) {
   res.render("login"); 
});

    //2.LOGIN HANDLE ROUTE
app.post("/login",passport.authenticate("local",
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }),
    function (req,res) {}
);

//LOGOUT ROUTE
app.get("/logout", function (req,res) {
   req.logout(); 
   res.redirect("/");
});

//MIDDLEWARE TO CHECK IF THE USER IS LOGGED IN OR NOT
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }    
    res.redirect("/login");
}

//CONNECTION
app.listen(3000);