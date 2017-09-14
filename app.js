var express 	= require("express"),
    app 		= express(),
    bodyParser 	= require("body-parser"),
    mongoose 	= require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// connect to DB
mongoose.connect("mongodb://localhost/yelp_camp");

// create schema
var campgroundSchema =  new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	 {
// 	 	name: "Granite Hill", 
// 	 	image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
// 	 	description: "This is a beautiful Campground."
// 	 },
// 	 function(err, newdata){
// 	 	if(err){
// 	 		console.log(err);
// 	 	}
// 	 	else{
// 	 		console.log("A new campground has been inserted\n" + newdata);
// 	 	}
// });

// var campgrounds = [
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
//         {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
//         {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
//         {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
// ];

app.get("/", function(request, response){
	response.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(request, response){
	// get data from DB and render
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			response.render("index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(request, response){
	var name = request.body.name;
	var image = request.body.image;
	var desc = request.body.description;
	var newCampground = {name: name, image: image, description: desc};
	// insert newCampground into DB
	Campground.create(newCampground, function(err, newdata){
		if(err){
			console.log(err);
		}
		else{
			console.log("A new campground has been inserted\n" + newdata);
		}
	});
	response.redirect("/campgrounds");
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(request, response){
	response.render("new");
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(request, response){
	Campground.findById(request.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            response.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, "localhost", function(){
	console.log("Server has been started at " + new Date().toUTCString());
});