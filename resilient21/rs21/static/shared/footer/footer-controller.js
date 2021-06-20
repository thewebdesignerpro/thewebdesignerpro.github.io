app.controller("FooterControl", ["$rootScope", "$scope", function($rootScope, $scope){
	// console.log("FooterControler Firing");

	var today = new Date();
	var year = today.getFullYear();

	var newContent = document.createTextNode(year); 
	var currentDiv = document.getElementById("copyright-year"); 
	currentDiv.appendChild(newContent);
}])
