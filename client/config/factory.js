//front end factories
myApp.factory("userFactory", function($http){
	factory = {};
	
	


	factory.regUsers= function(user, callback){
		console.log(user);
		$http.post("/register",user).success(function(feedback){
			callback(feedback);
		})
	}

	factory.loginUsers= function(user, callback){
		$http.post("/login", user).success(function(result){
			console.log("logging in")
			callback(result);
		})
	}
	factory.logoutUsers= function(user, callback){
		$http.post("/logout", user).success(function(result){
			console.log("User successfully logged out");
			callback(result);
		})
	}
	

	
	factory.addScores = function(score, callback){
		$http.post("/score", score).success(function(result){
			console.log("score successfully added");
			callback(result);
		})
		
	}

	factory.showScore = function(callback){
		$http.get("/frontpage").success(function(result){
			callback(result);
		})
	}


	return factory;
});

myApp.factory("questionFactory", function($http){
	factory = {};
	
	
	factory.showQuestions = function(callback){
		$http.get("/test/questions").success(function(result){
			console.log(result);
			callback(result);
		});
		
	}

	factory.addQuestions = function(question, callback){
		
		$http.post('addquestion',question).success(function(result){
			console.log("successfully added a quesiton");
			callback(result);
		});

	}

	return factory;
});
