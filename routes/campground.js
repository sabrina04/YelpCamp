var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/", function(request, response){
	// get data from DB and render
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			response.render("campground/index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", isLoggedIn, function(request, response){
	var name = request.body.name;
	var image = request.body.image;
	var desc = request.body.description;
	var author = {id: request.user._id, username: request.user.username };
	var newCampground = {name: name, image: image, description: desc, author: author};
	// insert newCampground into DB
	Campground.create(newCampground, function(err, newdata){
		if(err){
			console.log(err);
		}
		else{
      response.redirect("/campground");		}
	});
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(request, response){
	response.render("campground/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function(request, response){
	Campground.findById(request.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            response.render("campground/show", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(request, response){
    Campground.findById(request.params.id, function(err, foundCampground){
    	if(err){
    		console.log(err);
    	}
    	else{
    		 response.render("campground/edit", {campground: foundCampground});
    	}
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function(request, response){
    // find and update the correct campground
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(err, updatedCampground){
       if(err){
           response.redirect("/campground");
       } else {
           //redirect somewhere(show page)
           response.redirect("/campground/" + request.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function(request, response){
   Campground.findByIdAndRemove(request.params.id, function(err){
      if(err){
          response.redirect("/campground");
      } else {
          response.redirect("/campground");
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

function checkCampgroundOwnership(req, res, next) {
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("back");
           }  
           else {
               // does user own the campground?
              if(foundCampground.author.id.equals(req.user._id)) {
                next();
              } 
              else {
                res.redirect("back");
              }
           }
      });
    } 
    else {
        res.redirect("back");
    }
}

module.exports = router;