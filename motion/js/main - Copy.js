/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
const ui = {}, _ = {}; 
const idleTO = 120; 
let isMobil = false; 
 
if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	

function eL(e, aor, evt, f) {
	if (aor == 0) {
		e.addEventListener(evt, f, false);
	} else {
		e.removeEventListener(evt, f, false);
	}
}

function cL(e, aor, cls) {
	if (aor == 0) {
		if (!e.classList.contains(cls)) e.classList.add(cls); 
	} else {		
		if (e.classList.contains(cls)) e.classList.remove(cls); 
	}
}

function init() {
	function $(id) {
		return document.getElementById(id);
	}	
		
	ui.vidyo = $('vidyo'); 
	_.vidyoDuration = ui.vidyo.duration; 
	
	let dummy = document.createElement("div");
	dummy.setAttribute("id", "dummy");
	document.body.appendChild(dummy);
	
   if (window.getComputedStyle(dummy, null).getPropertyValue("left")=='9000px') {
        isMobil = false;
    } else {
        isMobil = true;        
    }

    //if (isMobil) {
	//	//document.addEventListener('gesturestart', function (e) {
	//		//e.preventDefault();
	//	//}, false);
	//	
	//	document.addEventListener('gesturechange', function (e) {
	//		e.preventDefault();
	//	}, false);			
	//	
	//	ui.kontainer.addEventListener('gesturechange', function (e) {
	//		e.preventDefault();
	//	}, false);		
    //
	//	_.prevW = _.prevH = 0; 	
	//}
	
	dummy.parentNode.removeChild(dummy);		
	
	_.width = window.innerWidth; 
	_.height = window.innerHeight; 
	
    //document.body.style.width = _.width + 'px';
    //document.body.style.height = _.height + 'px';    	
	
	_.idleTimer = 0; 
	_.fokus = true; 
	
	//eL(ui.vidyo, 0, 'loadedmetadata', vidLoaded); 
	
	//ui.vidyo.addEventListener('canplay', () => {
	//	// Now the browser knows the duration and timeline
	//	ui.vidyo.currentTime = 5; // Seeks to 5 seconds
	//	
	//	console.log(ui.vidyo.currentTime); 
	//});
	
	//ui.vidyo.play();
	
	animate(); 
	
	//console.log(document.body.scrollTop); 
}

//function vidLoaded(event) { 
//    //if (event) event.preventDefault();
//    //event.stopPropagation(); 
//	
//	//animate(); 
//	
//	const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
//	ui.vidyo.currentTime = Math.round(scrollPosition / 47);
//}

function animate() { 
	//console.log(_.idleTimer); 
    //requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		//if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		//const delta = clock.getDelta() * .4; 
		//console.log( Math.sin(delta) ); 
		
		const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

		//console.log(document.body.scrollTop); 
		//console.log(document.documentElement.scrollTop); 
		//console.log(window.scrollY); 
		console.log(ui.vidyo.currentTime); 

		
		//ui.vidyo.play();
		//ui.vidyo.pause();
		ui.vidyo.currentTime = Math.round(scrollPosition / 47); 
		//ui.vidyo.currentTime = 5; 
		
		
		
		
//		_.idleTimer += 0.01; 

	} else {
		//if (clock.running) clock.stop(); 
		
		//if (x.sound) {
		//	if (x.sound.isPlaying) x.sound.pause(); 
		//}
		
		//console.log(document.body.scrollTop); 
	}
	
	if (document.hasFocus()) {
		if (!_.fokus) {
			_.idleTimer = 0; 
			_.fokus = true; 
			
			//if (x.sound) {
			//	if (!x.sound.isPlaying) x.sound.play(); 
			//}
		}
	} else {
		_.idleTimer = idleTO; 	
		_.fokus = false; 
		
		//if (x.sound) {
		//	if (x.sound.isPlaying) x.sound.pause(); 
		//}
	}	
	
//	TWEEN.update();	

    requestAnimationFrame(animate);
	
}