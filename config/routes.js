//routes for all the backend controllers are here
var questions = require("../server/controllers/questions.js");
var scores = require("../server/controllers/scores.js");
var users = require("../server/controllers/users.js");
//routes direct posts and get files to dfferent controllers
module.exports = function(app){
	//register
	app.post('/register', function(req,res){

		users.register(req,res);
	})
	//login
	app.post('/login', function(req,res){
		users.login(req,res)
	})
	//logout
	app.post('/logout', function(req,res){
		users.logout(req,res)
	})
	//get test question
	app.get('/test/questions', function(req,res){
		questions.show(req,res);
	})
	//get list of users' scores
	app.get('/frontpage', function(req,res){
		scores.show(req,res);
	})
	//add a new question
	app.post('/addquestion', function(req,res){
		console.log("adding quesiton");
		questions.add(req,res);
	})
	//answering question and adding a new score
	app.post('/score', function(req,res){
		scores.add(req,res);
	})
}
