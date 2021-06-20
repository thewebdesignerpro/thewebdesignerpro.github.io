app.service("ApplicationService", function($http) {
	this.post = function(application) {
		return $http.post("/api/application/", application);
	}
});