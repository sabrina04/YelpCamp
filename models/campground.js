var mongoose 	= require("mongoose");

// create schema
var campgroundSchema =  new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments : [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);