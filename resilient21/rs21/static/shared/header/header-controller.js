app.controller("HeaderControl", ["$rootScope", "$scope", "$window", "$location", "EmployeeService", function($rootScope, $scope, $window, $location, EmployeeService){
	$scope.scrolledDown = false;

	angular.element($window).bind("scroll", function() {
		$scope.scrolledDown = $window.scrollY >= 100;
		$scope.$apply();
	});

	$scope.signout = function() {
		EmployeeService.signout()
			.then(function() {
				$rootScope.loggedIn = false;
				$location.path("/");
			});
	}


	// t4.length = 0;	
	// console.log(t4.length)

	// var testHelp = document.getElementsByClassName("help-page");
	// console.log('testHelp', testHelp.length);

	// var testStory = document.getElementsByClassName("story-page");
	// console.log('testStory', testStory.length);
	// // console.log('testStory', testStory.length);

	// var testCareer = document.getElementsByClassName("careers-page");
	// console.log('testCareer', testCareer.length);

	// var testContact = document.getElementsByClassName("contact-page");
	// console.log('testContact', testContact.length);

	// if(testHelp.length == 1 || testContact.length == 1 || testStory.length == 1 || testCareer.length ==1){
	// 	t4[0].classList.add("header-2");
	// 	t4[0].classList.remove("header-1");
	// }
	// else if(t4.length ==1){
	// 	window.addEventListener("scroll" , function(){
	// 		t4[0].classList.add("header-2");
	// 		var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	// 		var currentHeight = (document.documentElement && document.documentElement.scrollTop) || 
	// 			  document.body.scrollTop;

	// 		if (currentHeight >= (screenHeight * 1) - screenHeight) {
	// 			t4[0].classList.remove("header-2");
	// 			t4[0].classList.add("header-2");
	// 		}
	// 		if (currentHeight >= (screenHeight * 2) - screenHeight) {
	// 			t4[0].classList.remove("header-1");
	// 			t4[0].classList.add("header-2");
	// 		}
	// 		if (currentHeight >= (screenHeight * 3) - screenHeight) {
	// 			t4[0].classList.add("header-1");
	// 			t4[0].classList.remove("header-2");
	// 		}
	// 	})
	// }
}]);
