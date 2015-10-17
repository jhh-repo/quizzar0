myApp.config(function($routeProvider){
	$routeProvider
		.when('/',{templateUrl: 'partials/reglog.html', css:"client/config/stylingsheet.css"})
		.when('/dashboard', {templateUrl: 'partials/intro.html', css:"client/config/stylingsheet.css"})
		.when('/test',{templateUrl: 'partials/test.html', css:"client/config/stylingsheet.css"})
		.when('/new_question',{templateUrl: 'partials/new_question.html', css:"client/config/stylingsheet.css"})
		.otherwise({ redirectTo: '/' })

});