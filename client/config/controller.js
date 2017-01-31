
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

				
				if(Array.isArray(result) == true){
					$scope.regResult = "";
					$scope.errReg = result
					$scope.registration = "";
				}
				else {
					$scope.errReg = "";
					$scope.regResult = result;
					$scope.registration = "";
				}
				
				
			}
		});
		

	}

	$scope.loginUser = function(){
		userFactory.loginUsers($scope.login, function(result){
			console.log(result);
			if(Array.isArray(result) == true) {
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


	
	getUser();
	function getUser(){
		
			if(localStorageService.get("user")){
				$scope.user= localStorageService.get("user");
				if($scope.user){

					if($scope.user.loggedin === true){
						$location.path("/dashboard");
					}
				}
				
			}
			else if(!$scope.user){
					$location.path("/")
			}

		
	}
	
	$scope.logoutUser = function(){
		if($scope.user.loggedin === true) {
			userFactory.logoutUsers($scope.user, function(data){
				localStorageService.clearAll();
				$location.path("/");
				
			})
			
		}
		
		
	}
	

	updateScores();
	
	function updateScores() {
		userFactory.showScore(function(data){
			$scope.all_scores = data;
		})
	}
	

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
