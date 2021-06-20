app.controller("contactControl", ["$rootScope", "$scope", "ContactService", function($rootScope, $scope, ContactService) {
    $scope.contact = {}

    $scope.submission = {
        submitted: false,
        loading: false,
        submittedOk: false,
        message: ""
    }

    $scope.submit = function() {
    	$scope.submission.submitted = true;
    	$scope.submission.loading = true;
        ContactService.post($scope.contact)
            .then(function(reply) {
                console.log(reply);
                $scope.submission.loading = false;
                // $scope.submission.message = reply.data.message;
                if (reply.status === 200) {
                    console.log("2000000000");
                    $scope.submission.submittedOk = true;
                    $scope.submission.message = "Message has been sent! We'll get back to you soon."
                } else {
                    $scope.submission.submittedOk = false;
                    $scope.submission.message = "There was a problem."
                }
            });

    }
}]);
