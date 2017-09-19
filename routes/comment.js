var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// COMMENT ROUTE NEW
router.get("/new", isLoggedIn, function(request, response){
	Campground.findById(request.params.id, function(err, foundCampground){
		response.render("comment/new", {campground : foundCampground});
	});
});

//COMMENT ROUTE NEW POST
router.post("/", isLoggedIn, function(request, response){
	Campground.findById(request.params.id, function(err, campground){
		if(err){
			console.log(err);
			response.redirect("/campground");
		}
		else{
			var comment = {text: request.body.text, author: request.body.author};
			Comment.create(comment, function(err, comment){
				comment.author.id = request.user._id;
				comment.author.username = request.user.username;
				comment.save();
				campground.comments.push(comment);
				campground.save();
				response.redirect("/campground/" + campground._id);
			});
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;