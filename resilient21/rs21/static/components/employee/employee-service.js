app.service("EmployeeService", function($http) {
	this.signin = function(newhire) {
		return $http.post("/api/login/", newhire);
	}

	this.signout = function() {
		return $http.get("/api/logout/");
	}
});