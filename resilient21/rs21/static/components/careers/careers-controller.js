app.controller("CareersController", ["$scope", "smoothScroll", "$timeout", "$document", function($scope, smoothScroll, $timeout, $document) {
	$scope.currentCareer = '';
	$scope.showApplication = false;
	$scope.navHeight = 74;

	$scope.$watch("showApplication", function(newValue, oldValue) {
		if (newValue) {
			document.getElementsByTagName("body")[0].style.overflowY = "hidden";
		} else {
			document.getElementsByTagName("body")[0].style.overflowY = "auto";
		}
	});

	// $scope.navHeight = angular.element.find("nav")[0].offsetHeight;
	// console.log($scope.navHeight, angular.element.find("nav")[0].offsetHeight);

	$scope.showCareer = function(career) {
		$scope.currentCareer = career;
		var jobDescription = document.getElementById($scope.currentCareer);
		document.getElementById("applicationJobDescription").innerHTML = jobDescription.innerHTML;
		// $timeout(function() {smoothScroll(jobDescription);}, 25);
		smoothScroll(document.getElementById("jobDescriptionSection"));
	};
}]);
