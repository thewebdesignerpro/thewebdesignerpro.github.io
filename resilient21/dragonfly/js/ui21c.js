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
	
	if (timerDelay > 4000) timerDelay = 100;
	
	for (i = 0; i < fireflyCount[currStream]; i++) {
		iii[i] = 0;
		stopProc[i] = false;
		
		tweenSet[currStream][i][0].start(); // currStream is current Stream
	}

	/*for (i = 0; i < fireflyCount[currStream] + 1; i++) {
		// create a closure to preserve the value of "i"
		(function(i){
			//setTimeout(function() {
			timerId = setTimeout(function() {
				if (i < fireflyCount[currStream]) {
					iii[i] = 0;
				
					tweenSet[currStream][i][0].start(); // currStream is current Stream
				} else {
					clearTimeout(timerId);
				}
			}, i * (timerDelay));
		}(i));
	}*/
	
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

