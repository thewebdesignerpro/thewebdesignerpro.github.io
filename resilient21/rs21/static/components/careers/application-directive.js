app.directive("application", function() {
		return {
			scope: {
				position: "=",
				showApplication: "=",
				navHeight: "="
			},
			controller: "applicationControl",
			templateUrl: "/static/components/careers/application.html"
		};
	});
