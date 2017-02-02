var mongoose = require("mongoose");
var Question = mongoose.model("Question");
var random = require("mongoose-simple-random")
module.exports = (function(app) {
	return {
		//adding question
		add: function(req,res) {
			//error collection
			errors = [];
			//need to enter question
			if(!req.body.question_text){
				errors.push({message: "Please enter the text for questions"});

			}
			//question needs to be longer than 15 characters
			if(req.body.question_text && req.body.question_text.length < 15){
				errors.push({message: "Question should be longer than 15 characters."})
			}
			//all the answer choices must be filled
			if(!req.body.fake_answer_first || !req.body.fake_answer_second || !req.body.correct_answer){
				errors.push({message: "Please fill in all the answer choices"})
			}
			//if there is any single error, return all validation error messages to front end
			if(errors.length > 0){
				res.json(errors);
			}
			else{
				//make new question
				var question = new Question(req.body);
				//if no error, new question is created and returns message to front end
				question.save({}, function(err, result){
					if(err) console.log(err);
					else res.json({message: "Question added"});
				})
			}


		},

		//returns questions
		show: function(req,res) {
			//find 3 random questions from the database using mongoose simple random
			Question.findRandom({}, {}, {limit: 3}, function(err, data){
				//send back if there is error
				if(err) console.log(err);
				else {
					//make array for modified data
					var modData = [];
					//make shuffler
					var shuffler = [];
					//if data has three questions or more shuffle the answers in the questions
					if(data.length >= 3){
						//shuffler randomizes order of answers

						for(i=0; i<3; i++){
							//first push answers to shuffler
							shuffler.push(data[i].fake_answer_first);
							shuffler.push(data[i].fake_answer_second);
							shuffler.push(data[i].correct_answer);
							var temp = 0;
							for(j=0;j<3;j++){
								//change their order
								var rand = Math.floor(Math.random()*3);
								temp = shuffler[j];
								shuffler[j] = shuffler[rand];
								shuffler[rand] = temp;

							}
							//rename moddata's answer choices to stop attempt to find out answer through console
							modData.push({question_text: data[i].question_text, first: shuffler[0], second: shuffler[1], third: shuffler[2]})
							shuffler = [];
					}
					// if there are less than three questions ask for more questions to be added to start the quiz
					else
					{
						res.json({message:"More questions need ot be added"})
					}



					}


					//make empty object allData to contain reference with answers and modData with the modified questions
					allData = {};
					allData.reference = data;
					allData.questions = modData;
					//send allData to front end
					res.json(allData);
				}
			})
		}



	}
})();
