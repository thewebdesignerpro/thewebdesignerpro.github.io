app.config(["$routeProvider", "$locationProvider", function($routeProvider) {
	// $locationProvider.html5Mode(true);

	$routeProvider
		.when("/", {
			controller: "HomeControl",
			templateUrl: "/static/components/home/home-view.html",
			access: false
		})
		.when("/help", {
			templateUrl: "/static/components/help/help-view.html",
			access: false
		})
		.when("/story", {
			templateUrl: "/static/components/story/story-view.html",
			access: false
		})
		.when("/contact", {
			controller: "contactControl",
			templateUrl: "/static/components/contact/contact-view.html",
			access: false
		})
		.when("/careers", {
			controller: "CareersController",
			templateUrl: "/static/components/careers/careers-view.html",
			access: false
		})
		.when("/login", {
			controller: "EmployeeControl",
			templateUrl: "/static/components/employee/employee-view.html",
			access: false
		})
		.when("/portal", {
			templateUrl: "/static/components/employee-portal/employee-portal-view.html",
			controller: "EmployeePortalControl",
			access: true
		})		
		.otherwise({
			redirectTo: "/"
		});
}]);

app.run(function ($rootScope, $location, $route) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		if (next.access && !$rootScope.loggedIn) {
			$location.path('/login');
			$route.reload();
		}
	});
});
