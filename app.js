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
      methodOverride= require("method-override"),
      passportLocalMongoose = require("passport-local-mongoose");

//REQUIRED ROUTES
const indexRoutes       =   require("./routes/index"),
      campgroundRoutes  =   require("./routes/campground"),
      commentRoutes     =   require("./routes/comment");

      seedDB();
//MongoDB/Mongoose CONFIGURATION
mongoose.connect('mongodb://localhost/yelpcamp', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify:false });
app.use(bodyParser.urlencoded({ extended: true }));

//EJS CONFIGURATION
app.set('view engine', 'ejs');


//method-override CONFIGURATION
app.use(methodOverride("_method"));

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

//EXPRESS ROUTER 
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//APP CONNECTION TO THE SERVER
app.listen(3000);