app.controller("TopButtonController", ["$scope", "$window", "smoothScroll", function($scope, $window, smoothScroll) {
	$scope.scrolledDown = false;

	angular.element($window).bind("scroll", function() {
		$scope.scrolledDown = $window.scrollY >= $window.innerHeight / 2;
		$scope.$apply();
	});

	$scope.toTop = function() {
		smoothScroll(document.getElementsByTagName("body")[0]);
	};
}]);
