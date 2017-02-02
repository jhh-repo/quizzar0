var mongoose = require("mongoose");
var Schema = mongoose.Schema
//user schema has user_name, array for scores, email, password, date of id creation and login boolean to confirm whether or not the user is logged in
userSchema = new mongoose.Schema({
	user_name: String,
	score: [{type: Schema.Types.ObjectId, ref: "Score"}],
	email: String,
	password: String,
	date: Date,
	loggedin: Boolean
})
//put out model with name User
mongoose.model("User", userSchema);
