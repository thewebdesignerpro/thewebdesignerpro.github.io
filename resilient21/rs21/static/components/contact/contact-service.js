app.service("ContactService", function($http) {
	this.post = function(contact) {
		return $http.post("/api/contact/", contact);
	}
});