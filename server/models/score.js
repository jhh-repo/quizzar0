var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//score schema with user id, username, score, percentage, and date
scoreSchema = new mongoose.Schema({
	_user: {type: Schema.ObjectId, ref: "User"},
	user_name: String,
	score: Number,
	percentage: Number,
	date: Date
})
//creates model with name score
mongoose.model("Score", scoreSchema);
