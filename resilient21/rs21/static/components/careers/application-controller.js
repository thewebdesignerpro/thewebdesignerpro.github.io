app.controller("applicationControl", ["$rootScope", "$scope", "$timeout", "ApplicationService", "Upload", function($rootScope, $scope, $timeout, ApplicationService, Upload) {
    $scope.application = {
        links: [],
        reference: [],
        employer: [{
            addressline2: ""
        }],
        education: [],
        addressline2: "",
        appnamemiddle: "",
        apphearabout: "",
        appfelonreason: "",
        eddegree: "",
        resume: null,
        coverLetter: null
    };

    $scope.submission = {
        submitted: false,
        loading: false,
        submittedOk: false,
        message: ""
    }

    $scope.linkContents = {
        labelName: "Portfolio/GitHub/Link URL"
    }

    $scope.refContents = {
        labelName: "Name",
        labelRelationship: "Relationship",
        labelCompany: "Company",
        labelPhone: "Phone",
        labelEmail: "Email",
        labelAddress: "Address"
    }

    $scope.empContents = {
        labelSupervisor: "Supervisor",
        labelRelationship: "Relationship",
        labelCompany: "Company",
        labelPhone: "Phone",
        labelEmail: "Email",
        labelAddress: "Address",
        labelJob: "Job Title",
        labelStart: "Starting Salary",
        labelEnd: "Ending Salary",
        labelResp: "Responsibilities",
        labelFrom: "From",
        labelTo: "To",
        labelReason: "Reason for Leaving",
        labelContact: "May we contact your previous supervisor for a reference?",
        labelUnit: "Unit",
        labelCity: "City",
        labelState: "State",
        labelZip: "Zip"

    }

    $scope.edContents = {
        labelSchool: "College",
        labelStart: "From",
        labelEnd: "To",
        labelGrad: "Did you graduate?",
        labelDeg: "Degree"
    }

    $scope.links = [$scope.linkContents];

    $scope.references = [$scope.refContents];

    $scope.prevEmp = [$scope.empContents];

    $scope.education = [$scope.edContents];

    $scope.addLink = function() {
        $scope.links.push($scope.linkContents);
    }

    $scope.remLink = function() {
        $scope.links.pop();
        $scope.application.links.pop();
    }

    $scope.addRef = function() {
        $scope.references.push($scope.refContents);
    }

    $scope.remRef = function() {
        $scope.references.pop();
        $scope.application.reference.pop();
    }

    $scope.addEmp = function() {
        $scope.prevEmp.push($scope.empContents);
        $scope.application.employer.push({ addressline2: "" });
    }

    $scope.remEmp = function() {
        $scope.prevEmp.pop();
        $scope.application.employer.pop();
    }


    $scope.addEd = function() {
        $scope.education.push($scope.edContents);
    }

    $scope.remEd = function() {
        $scope.education.pop();
        $scope.application.education.pop();
    }

    $scope.submit = function() {
        $scope.application.timestamp = Date.now();

        upload = Upload.upload({
            url: "/api/file/",
            data: { timestamp: $scope.application.timestamp, firstName: $scope.application.appnamefirst, lastName: $scope.application.appnamelast, resume: $scope.application.resume, coverLetter: $scope.application.coverLetter }
        });

        upload.then(function(response) {
            $timeout(function() {
                var result = response.data;
                $scope.submission.submitted = true;
                $scope.submission.loading = true;

                ApplicationService.post($scope.application)
                    .then(function(reply) {
                        $scope.submission.loading = false;
                        if (reply.status === 200) {
                            $scope.submission.submittedOk = true;
                            $scope.submission.message = "Application Received! We'll get back to you soon."
                        } else {
                            $scope.submission.submittedOk = false;
                            $scope.submission.message = "There was a problem. Please email your resume to hr@rs21.io"
                        }

                    });
            });
        });
    }



    $scope.showPosition = function() {
        $scope.application.appjobtitle = $scope.position
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str) {
                return str.toUpperCase();
            });
    };

}]);
