var mongoose= require("mongoose");
var fs = require("fs");
//connect to MongoDB database
//mongoose promise deprecated, and need to use local 
// mongoose.connect("mongodb://localhost/blackbelt_quiz");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/quizzar0");
//variable for directory to models
var models_path = __dirname+"/../server/models";
//connect mongoose to models
fs.readdirSync(models_path).forEach(function(file){
	//grab JS file from models
	if(file.indexOf('.js')> 0) {
		require(models_path +'/'+ file);
	}
})
