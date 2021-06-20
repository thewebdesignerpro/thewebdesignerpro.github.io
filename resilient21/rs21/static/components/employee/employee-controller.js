app.controller("EmployeeControl", ["$rootScope", "$scope", "$location", "EmployeeService", function($rootScope, $scope, $location, EmployeeService) {
	$scope.newhire = {}

    $scope.submit = function() {

        EmployeeService.signin($scope.newhire)
            .then(function(reply) {
                if (reply.data.status === 200) {
                	$rootScope.loggedIn = true;
                	$location.path('/portal');

                }
                console.log(reply);
            });

    }

}]);
