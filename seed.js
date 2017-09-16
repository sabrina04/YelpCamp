var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    {
        name: "Mountain Goat's Rest", 
        image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
];

function seedDB(){
    // REMOVE ALL EXISTING DATA
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("All campgrounds are removed.");
            // ADD A NEW CAMPGROUND
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }
                    else{
                        // ADD A NEW COMMENT UNDER THE CAMPGROUND
                        console.log("added a campground");
                        Comment.create({ text: "This place is great, but I wish there was internet", author: "Homer" }, function(err, comment){
                            campground.comments.push(comment);
                            campground.save();
                            console.log("added a comment");
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
