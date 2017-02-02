
myApp.controller("userController", function($scope, $log, $route, $timeout, $location, userFactory, localStorageService) {


	//collects bootstrap alerts from logging in and scoring
	$scope.alerts = [];
	//anounces the score from the quiz
	if(localStorageService.get("scores")){
		console.log("doing it?", $scope.alerts)
		$scope.alerts.push({type:"success", msg: localStorageService.get("scores")})
		localStorageService.remove("scores")
	}
	//alert for successful login
	if(localStorageService.get("userloggedin")){
		$scope.alerts.push({type:"success", msg: "Login Successful"});
		localStorageService.remove("userloggedin")
	}
	//$scope for user registration, allows user to register
	$scope.regUser = function(){
		userFactory.regUsers($scope.registration, function(result){
			if(result){

				// empties $scope.registration if result returns as error
				// error message added to $scope
				if(Array.isArray(result) == true){
					$scope.regResult = "";
					$scope.errReg = result
					$scope.registration = "";
				}
				// empties $scope.rergistration fi registration came through
				//
				else {
					$scope.errReg = "";
					$scope.regResult = result;
					$scope.registration = "";
				}


			}
		});


	}

//for logging in users
	$scope.loginUser = function(){
		//login information from $scope taken
		userFactory.loginUsers($scope.login, function(result){
			console.log(result);
			//goes to database and asks if the data is valid
			if(Array.isArray(result) == true) {
				exists
				$scope.errLogin = result;
			}
			else $scope.errInd = result;
			if(result.loggedin == true){
				console.log(result);
				$location.path("/dashboard");
				localStorageService.set("user", result);
				localStorageService.set("userloggedin", true);
			}

		});
	}


	// quirk in the js in general: function needs to be called
	// before the function is defined in order for it
	// to update properly in the front end
	getUser();
	// get user data
	function getUser(){
			// if user is in localStorageService
			if(localStorageService.get("user")){

				$scope.user= localStorageService.get("user");
				if($scope.user){
					//and if the user is logged in send him to the dashboard
					if($scope.user.loggedin === true){
						$location.path("/dashboard");
					}
				}

			}
			//is there is no userdata in the $scope
			else if(!$scope.user){
					$location.path("/")
			}


	}
	// logs out user
	$scope.logoutUser = function(){
		if($scope.user.loggedin === true) {
			userFactory.logoutUsers($scope.user, function(data){
				localStorageService.clearAll();
				$location.path("/");

			})

		}


	}

//updates the score when new score is entered
	updateScores();

	function updateScores() {
		//updates the scoreboard with data from factory
		userFactory.showScore(function(data){
			$scope.all_scores = data;

		})
	}

//closes alert if you press the x
	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	};

});
myApp.controller("questionController", function($scope, $route, $location, userFactory, questionFactory, localStorageService){
	updateQuestions();
	var score = 0;
	var counter = 0;
	$scope.alerts = [];

	function updateQuestions() {
		questionFactory.showQuestions(function(data){
			$scope.all_questions=data;

			console.log($scope);


		})
	}
	getUser();

	function getUser(){

		$scope.user= localStorageService.get("user");


	}
	$scope.addQuestions =function(){

			questionFactory.addQuestions($scope.new_question, function(result){
				if(Array.isArray(result) == true){
					$scope.questionResult = "";
					$scope.errQuestion = result
					console.log($scope)
				}
				else {
					$scope.errQuestion = "";
					$scope.questionResult = result;

				}
			});

	}

	$scope.scoreUser = function(){

		scorecard = {};
		scorecard.questions = $scope.all_questions.reference;
		scorecard.user = $scope.user;
		scorecard.answers = $scope.answers;
		console.log($scope.answers)
		userFactory.addScores(scorecard, function(result){
			$scope.alerts=[];
			if(result.message){
				$scope.errScore = result;
			}
			else {
				message = "Congratulations " +result.user_name+ "! You got "+ result.score +
				" out of 3 ("+ result.percentage +"%)";
				localStorageService.set("scores", message);

				$location.path("/dashboard");

			}
		});

	}

	$scope.logoutUser = function(){
		if($scope.user.loggedin === true) {
			console.log("user is logged in");
			userFactory.logoutUsers($scope.user, function(data){
				localStorageService.clearAll();
				$scope.loggedout=data;
				$location.path("/");
				$scope.alerts.push({type:"success", msg: "Logged Out"});


			})
		}

	}

	$scope.closeAlert = function(index) {
	    $scope.alerts.splice(index, 1);
	};

});
