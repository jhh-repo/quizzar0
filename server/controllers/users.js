//use mongoose, User model, bcrypt, and email validator

var mongoose = require("mongoose");
var User = mongoose.model("User");
var bcrypt = require("bcryptjs");
var validator = require("email-validator");

module.exports = (function(app) {
	return {
		// put registration information in the database
		register: function(req, res) {
			//regex allowing only characters in []
			re = /^[a-zA-Z0-9_-]{3,16}$/;
			//take all the elements of req.body from the frontend to identify for error collectino
			nickname = req.body.user_name;
			email = req.body.email;
			password = req.body.password;
			repeated = req.body.password_repeat;
			//error array for collecting error messages
			errors = [];
			
			//error messages for each instance of validation error
			//no nickname
			if(!nickname){
				errors.push({message: "You need a nickname"})
			} 
			//nickname needs to be certain length
			if(nickname){ 
				if (nickname.length <3 || nickname.length > 16) errors.push({message: "Your nickname needs to be between 3 and 16 characters"});
			}
			//nickname needs to be alphanumeric and characters - and _
			if(nickname && !re.test(nickname)){
				errors.push({message: "Nicknames can only contain alphanumerics and - and _"});
			}
			//needs email
			if(!email){
				errors.push({message: "Account needs an email"});
			}
			//using email validator from NPM
			emailVal = validator.validate(req.body.email);
			if(email && emailVal === false){
				errors.push( { message: "Email not formatted correctly ex. example@example.com" }) ;
				
			}
			//needs password
			if(!password){
				errors.push({message: "You need a password"})

			}
			//pasword need to be length of 6 at least
			if(password && password.length < 6){
					errors.push({ message: "Password needs to be at least six characters" });
			}
			//password also need to be alphanumeric and characters - and _
			if(password && !re.test(password)===true){
				errors.push({message: "Password can only contain alphanumerics and - and _ "});
			}
			//there is no repeated password
			if(!repeated){
				errors.push({message: "Please repeat password"});
			}
			//repeated password doesn't match the original
			if(repeated && repeated != password){
				errors.push({message: "Repeated password must match the original"});
			}
			// if more than one error message, it returns error messages to front end instead of registering user
			if(errors.length > 0){
				console.log(errors)
				res.json(errors);
			}
			//else when there's no errors
			else {
				//find the user by nickname from req.body
				User.find({user_name: nickname}, function(err, data){
					
					var dataLength = data.length;

					//returns to frontend with message and it will invalidate attempt to create redundant ids
					if(dataLength > 0){
						res.json({message:"There is already another user with that nickname"})
					}
					//if no one found with that username...
					if(dataLength == 0){
						User.find({email: email}, function(err, emaildata){
							//returns message to front end and invalidate users with multiple email
							if(emaildata.length > 0) {
								res.json({ message:"There is already another user with this email."})
							}
							//
							else{
								//make empty object userdata
								var userdata = {};
								//using bcrypt to encrypt password
								//generate salt with factor of 10
								bcrypt.genSalt(10, function(err, salt){
									//create password hash using the salt
									bcrypt.hash(password, salt, function(err,hash){
										//if error return message in backend
										if(err) console.log("didn't work",err);
										else {
											//fill userdata with the req.body information from before and add date of registration
											//set login as false
											userdata.user_name = nickname;
											userdata.email = email;
											userdata.password = hash;
											userdata.date = new Date();
											userdata.loggedin = false;
											user = new User(userdata);
											//create user
											user.save(function(err,result){
												if(err){
													//return error message to front end
													console.log(err);
													res.json(err);
												}
												else {
													//return message when new user account successfully created
													console.log("new user added", userdata);
													data =  { message: "Registration Successful" }
													res.json(data);
												}

											});
										};
									})
								})
							}
						})
					}
				
				})
			}
		},

		login: function(req,res){
			//error collection
			errors = [];
			// error messages
			if(!req.body.user_name){
				errors.push({message: "Require the username"})
			}
			if(!req.body.password){
				errors.push({message: "Require password"});
			}
			//if there an error return the messages to front end
			if(errors.length > 0){
				res.json(errors);
			}
			//if no error...
			else {
				//find the user's name in the db
				User.find({user_name: req.body.user_name}, function(err, data){
					
					//if nothing found return error message to front end that no username was found
					if(data.length === 0){
						res.json({message: "no user by that user name"});
					}
					else 
					{	//if user is already logged in return error message and would prevent a second login through same username and returns message to front end
						if(data.loggedin === true){
						
							res.json({	message: "This user is already logged in"})
						}
						else{
							 
							username = data[0].user_name;
							id = data[0]._id;
							
							passwordCandidate = req.body.password;
							//compare passwords through bcrypt
							bcrypt.compare(passwordCandidate, data[0].password, function(err, match){
								//console log error mesage
								if(err) console.log("error in the password confirmation", err)
								//if return false return message saying it's the wrong password	
								if(match=== false){
									res.json({message: "wrong password"})
								}
								//if there is a match then update the logged in variable to true and return userdata to front end 
								if(match === true){
								
									User.update({user_name: req.body.user_name}, {loggedin: true}, function(err, data){
										
										res.json({ _id: id, user_name: username, loggedin: match });
									})
								}

							})
						}
						
					}
				})
			}
		},
		//logging out
		logout: function(req, res){
			//find user name and see if they're logged in
			User.find( {user_name: req.body.user_name, loggedin: true} , function(err,data){
				//variable to see if there is a user with the username and is loggedin
				found_user = data.length;
				//if no user found return error message
				if(!found_user){
					
					res.json(err);
				}
				//if user found update user loggedin as false and send back data
				else 
				{
					User.update({user_name: req.body.user_name}, {loggedin: false}, function(err,data){
						res.json(data);

					})	
				}
			})

		}
		
		
	}	

	
})();