var express = require("express");
var router  = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(request, response){
	response.render("landing");
});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
router.get("/register", function(request, response){
   response.render("register"); 
});

// handle sign up logic
router.post("/register", function(request, response){
	var newUser = new User({username: request.body.username});
	console.log(newUser);
	User.register(newUser, request.body.password, function(err, user){
		if(err){
			console.log(err);
			return response.render("/register");
		}
		passport.authenticate("local")(request, response, function(){
			response.redirect("/campground");
		});
	});
});

// show login form
router.get("/login", function(request, response){
   response.render("login"); 
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campground",
        failureRedirect: "/login"
    }), function(request, response){
});

// logout route
router.get("/logout", function(request, response){
   request.logout();
   response.redirect("/campground");
});


//middleware
function isLoggedIn(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }
    response.redirect("/login");
}

module.exports = router;