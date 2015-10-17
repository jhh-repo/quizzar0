// require mongoose, User, Score and Question model
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Score = mongoose.model("Score");
var Question = mongoose.model("Question")
module.exports = (function(app) {
	return {
		//add to score
		add: function(req, res) {
			// counter and percentage variable
			var counter = 0;
			var percentage = 0;
			//answers from req.body
			var answers = req.body.answers;
			//userdata from req.body
			var userdata = req.body.user;
			//if any of the answers are empty return to front end  error message
			if(!answers || !answers.first || !answers.second || !answers.third){
				res.json({message: "Please answers all the questions."})
			}
			//if all answers are answered
			else
			{
				// get variable fro reference
				//compare answers with correct answer in the reference
				reference= req.body.questions;
				//add to counter for every correct answer
				if(reference[0].correct_answer == answers.first) counter++;
				if(reference[1].correct_answer == answers.second) counter++;
				if(reference[2].correct_answer == answers.third) counter++;
				//get percentage from score
				percentage = parseInt(parseFloat(counter/3)*100);
				//pace into scorecard object
				scorecard = {score: counter, percentage: percentage, userid: userdata._id, user_name: userdata.user_name }
				console.log("userdata", userdata);
				//find user who took the ttest 
				User.findOne({_id: userdata._id},function(err, user){
								
					//create new score
					var score = new Score(scorecard);
					//add new date
					score.date = new Date();
					//push into user's scoredata
					user.score.push(score);
					//then save score
					score.save({}, function(err,result){
						//then save user
						user.save({}, function(err,result){
							//if error console log error in back end 
							if(err) console.log("there was error in adding data");
							else {
								//if successful send scorecard to front end 
								console.log(result);
								res.json(scorecard);
							}
						})
						
					});
				});
			}
			
		},
		
		show: function(req, res) {
			//bring back all score to frontend arranged by percentage
			Score.find({}).sort({percentage: 'desc'}).exec(function(err, data){
				if(err) console.log(err);
				else res.json(data);
				
			})
		}

	}
})();

