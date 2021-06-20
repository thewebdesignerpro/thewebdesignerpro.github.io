app.directive("navbar", function() {
	return {
		scope: {
			isHome: "=",
			showApplication: "="
		},
		controller: "HeaderControl",
		templateUrl: "/static/shared/header/header-view.html"
	};
});
