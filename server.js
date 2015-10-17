//server
var express = require("express");
var path = require("path");

//using express
var app = express();

var bodyParser = require("body-parser");

//allows serve static files from client 
app.use(express.static(path.join(__dirname,'./client')));
//allows serve files from node modules 
app.use("/node_modules", express.static(path.join(__dirname,'/node_modules')));
//allows use of bodyparser
app.use(bodyParser.json());

//require mongoose and routes
require("./config/mongoose.js");
//connect routes to express
require("./config/routes.js")(app);
//connect to port 8000
app.listen(8000, function(){
	console.log("listening to port 8000 for Quizzaro")
})