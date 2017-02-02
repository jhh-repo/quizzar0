var mongoose = require("mongoose");
//require mongoose randomizing module
var random = require("mongoose-simple-random");
var schema = mongoose.Schema;
//question schema with question text, two fake answers and one correct answer
var questionSchema = new mongoose.Schema({
	question_text: String,
	fake_answer_first: String,
	fake_answer_second: String,
	correct_answer: String

});
//plugin the randomizing module
questionSchema.plugin(random);
//create model with name Question
mongoose.model("Question", questionSchema)
