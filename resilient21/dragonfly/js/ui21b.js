// UI-related scripts

// Sample DOM event listener
/*
myButton.addEventListener("click", function(e) {
	
	e.preventDefault();
}, false);	
*/

// Temporary UI. Feel free to delete
function readyStream() {
	scene.add(streamGroup[currStream]);	// Add to the scene the current group of fireflies and pathway lines
	
	var timerId, timerDelay = parseInt(100000 / fireflyCount[currStream]), i = 0;
	clearTimeout(timerId);
	
	if (timerDelay > 5000) timerDelay = 500;
	
	for (i = 0; i < fireflyCount[currStream]; i++) {
		//iii[i] = 0;
		//tweenSet[currStream][i][0].start();	// currStream is current Stream, id = 0			
		
		// create a closure to preserve the value of "i"
		(function(i){
			//setTimeout(function() {
			timerId = window.setTimeout(function() {
				iii[i] = 0;
				
				tweenSet[currStream][i][0].start();
			}, i * (timerDelay));
		}(i));
		
	}

	tweeningOn = true;
				
	colorNodes();
}

stream0.addEventListener("click", function(e) {
	stopStream(function() {
		currStream = 0;
	
		readyStream();	
	});
	
	e.preventDefault();
}, false);	

stream1.addEventListener("click", function(e) {
	stopStream(function() {
		currStream = 1;
	
		readyStream();	
	});
	
	e.preventDefault();	
}, false);	

stream2.addEventListener("click", function(e) {
	stopStream(function() {
		currStream = 2;
	
		readyStream();	
	});

	e.preventDefault();
}, false);	

stream3.addEventListener("click", function(e) {
	stopStream(function() {
		currStream = 3;
	
		readyStream();	
	});

	e.preventDefault();
}, false);	
// Temporary UI. Feel free to delete

