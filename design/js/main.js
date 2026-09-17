/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
const ui = {}, _ = {}, x = {}; 
const idleTO = 50; 
let isMobil = false;
let mouseX = 0, mouseY = 0;   
 
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
		
	ui.section1 = $('section1'); 
	
	//ui.vidyo = $('vidyo'); 
	//_.vidyoDuration = ui.vidyo.duration; 
	
	_.scrollTop = _.prevScrollTop = 0; 
	_.isScrolling = false; 
	_.flyDirection = 1; 
	_.currFrame = 0; 
	_.prevFrame = 0; 
	_.texIdx = 0; 
	
	/* Lenis start */
	
	const lenis = new Lenis({ autoRaf: true, autoToggle: true, anchors: true, allowNestedScroll: true, naiveDimensions: true, stopInertiaOnNavigate: true }); 

	//const lenis = new Lenis({
	//	autoRaf: true,
	//}); 
	
	//const lenis = new Lenis(); 
	
	// Listen for the scroll event and log the event data
	lenis.on('scroll', (e) => {
		//console.log(e.scroll);
		//console.log(e.direction);
		
		_.isScrolling = true; 
		_.scrollTop = e.scroll; 
		//_.flyIn = (e.direction == 1) ? true : false; 
		_.flyDirection = e.direction; 
		
		//_.currFrame = Math.round(_.scrollTop / ui.content.offsetHeight); 
	//	_.currFrame = Math.round(_.scrollTop / ui.content.offsetHeight * _.texIdx); 
		
		//_.currFrame = (_.currFrame > _.texIdx) ? (_.texIdx) : (_.currFrame); 
	//	if (_.currFrame > _.texIdx) _.currFrame = _.texIdx; 
		
		//if (_.scrollTop > _.height) playClick(); 
		
		//console.log(_.scrollTop); 
	});	


	/* Lenis end */	
	
	_.isVidPause = false; 
		
	ui.vidyo = $('vidyo'); 
	//ui.kontainer = $('kontainer'); 
	ui.content = $('content'); 
	
	//ui.swtchKam = $('swtchKam'); 
	ui.onPlay = $('onPlay'); 
	ui.offPlay = $('offPlay'); 
	
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.swtchKam.style.visibility = "hidden"; 
	ui.onPlay.style.visibility = ui.offPlay.style.visibility = ui.onAud.style.visibility = ui.offAud.style.visibility = "hidden"; 
	
	ui.loadr = $('loadr'); 
	ui.fader = $('fader'); 
	ui.fader.style.opacity = 1;		

	
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
	
	//loadFrames(); 
	
	fadeScene(); 
	
	//animate(); 
	
	//console.log(document.body.scrollTop); 
}

/*
function loadFrames() {
	x.frames = [];  
	
	const url2 = 'frames/Temp-00';
	let idX; 	
	
	for (let i = 2; i < 101; i++ ) {	
		if (i > 99) {
			idX = ''; 
		} else {
			idX = i > 9 ? '0' : '00';		
		}		
		
		imjUrl = url2 + idX + i + '.webp'; 	
		
		//console.log(imjUrl);
		
		x.frames[i] = new Image();

		x.frames[i].onload = function(){
			_.texIdx += 1; 
			
			if (_.texIdx==99) {
				fadeScene(); 	
				
				loadFrames2();
			}
			
			//console.log(x.frames[i]); 
		};

		x.frames[i].src = imjUrl;		
		
		let child = document.createElement("div");
		//child.setAttribute("id", "child");
		
		child.style.backgroundImage = '' + 'url(' + x.frames[i].src + ')' + '';
		
		ui.kontainer.appendChild(child);
		
		//const parent = document.querySelector('.parent-element');
		//const allChildren = parent.children; // Returns an HTMLCollection
		//const firstChild = parent.children[0]; // Gets the very first child
		
	}
}	

function loadFrames2() {
	const url2 = 'frames/Temp-00';
	
	for (let i = 101; i < 241; i++ ) {	
		imjUrl = url2 + i + '.webp'; 	
		
		//console.log(imjUrl);
		
		x.frames[i] = new Image();

		x.frames[i].onload = function(){
			_.texIdx += 1; 
			
			//if (_.texIdx==239) fadeScene(); 	
			//console.log(x.frames[i]); 
		};

		x.frames[i].src = imjUrl;		
		
		let child = document.createElement("div");
		//child.setAttribute("id", "child");
		
		child.style.backgroundImage = '' + 'url(' + x.frames[i].src + ')' + '';
		
		ui.kontainer.appendChild(child);
		
	}
}	*/

//function vidLoaded(event) { 
//    //if (event) event.preventDefault();
//    //event.stopPropagation(); 
//	
//	//animate(); 
//	
//	const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
//	ui.vidyo.currentTime = Math.round(scrollPosition / 47);
//}

function fadeScene() {
	
    (function fadeIn() {
		
		let val = parseFloat(ui.fader.style.opacity); 
		
		if (!((val -= .05) < 0)) {
 			ui.fader.style.opacity = val;
            
			requestAnimationFrame(fadeIn); 
			
        } else {
			
 			ui.fader.style.opacity = 0;
            ui.fader.style.display = "none";
			ui.fader.parentNode.removeChild(ui.fader);	
			
			onWindowResize(); 			
			
		//	eL(ui.kontainer, 0, 'pointerdown', onPointerDown); 
		//	eL(ui.kontainer, 0, "pointermove", onPointerMove); 
			
			eL(ui.content, 0, 'pointerdown', onPointerDown); 
			eL(ui.content, 0, "pointermove", onPointerMove); 
			
			
			animate();  
			
			theOptions(); 
			
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
        }
		
    })();	
	
}	

function theOptions() {
	
	//ui.swtchKam.style.visibility = "visible"; 	
	ui.onPlay.style.visibility = ui.offPlay.style.visibility = ui.onAud.style.visibility = ui.offAud.style.visibility = "visible"; 	
	
	if (isMobil) {
		
		//eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onPlay, 0, 'touchstart', playClick); 
		eL(ui.offPlay, 0, 'touchstart', playClick);
		
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
		
	} else {
		
		//eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onPlay, 0, 'click', playClick); 
		eL(ui.offPlay, 0, 'click', playClick);
		
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);	
		
	}	 
	
}

//function swtchKamClick(event) {	
//
//    if (event) event.preventDefault(); 
//	
//	x.rotCam = !x.rotCam;  
//	
//	x.camGrup.rotation.set(0, 0, 0);  
//	camera.position.x = 0; 
//	
//	_.idleTimer = 0; 
//	
//}


function playClick(event) {
	
    if (event) event.preventDefault(); 

	if (ui.vidyo) {
		//console.log('mute');
		
		if (!ui.vidyo.paused) {
			
			cL(ui.offPlay, 0, "noneIt2");
			cL(ui.onPlay, 1, "noneIt2");

			ui.vidyo.pause(); 

		} else {
			
			cL(ui.onPlay, 0, "noneIt2");
			cL(ui.offPlay, 1, "noneIt2");			

			ui.vidyo.play(); 

		}
		
	}

	_.idleTimer = 0; 
	
}	

function audClick(event) {
	
    if (event) event.preventDefault(); 

	if (ui.vidyo) {
		//console.log('mute');
		
		if (!ui.vidyo.muted) {
			
			cL(ui.offAud, 0, "noneIt2");
			cL(ui.onAud, 1, "noneIt2");

			ui.vidyo.muted = true; 
			//x.sound.pause(); 

		} else {
			
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");			

			ui.vidyo.muted = false; 
			//x.sound.play(); 

		}
		
	}
	//else {
	//	
	//	addAud(); 
    //
	//}

	_.idleTimer = 0; 
	
}	

function onMouseMove( event ) {
	
   // if (event) event.preventDefault();

	let mouse = {}; 
	
	if (event.clientX) {
		
		mouse.x = ( event.clientX - _.widthH ) / 60;   
		mouse.y = ( event.clientY - _.heightH ) / 60; 	
		
	} else {
		
		mouse.x = ( event.x - _.widthH ) / 60; 
		mouse.y = ( event.y - _.heightH ) / 60; 
		
	}
	
	mouseX = mouse.x;
	mouseY = mouse.y; 	
	
	_.idleTimer = 0; 
	
}


function onPointerDown( event ) {
	
    if (event) event.preventDefault();

	let pointer = {}; 
	
	if (event.clientX) {
		
		pointer.x = ( event.clientX / _.width ) * 2 - 1;  
		pointer.y = - ( event.clientY / _.height ) * 2 + 1;	
		
	} else {
		
		pointer.x = ( event.x / _.width ) * 2 - 1;  
		pointer.y = - ( event.y / _.height ) * 2 + 1;		
		
	}	
	
	_.ptrDown = true; 

	//_.pointer.x = pointer.x;
	//_.pointer.y = pointer.y; 	
		
	_.idleTimer = 0; 
	
}	

function onPointerMove( event ) {
	
    if (event) event.preventDefault();

	let pointer = {}; 
	
	if (event.clientX) {
		
		pointer.x = ( event.clientX / _.width ) * 2 - 1;  
		pointer.y = - ( event.clientY / _.height ) * 2 + 1;	
		
	} else {
		
		pointer.x = ( event.x / _.width ) * 2 - 1;  
		pointer.y = - ( event.y / _.height ) * 2 + 1;		
		
	}
	
	//_.pointer.x = pointer.x;
	//_.pointer.y = pointer.y; 	
	
	_.idleTimer = 0; 
	
}

function wheelE( event ) {
	
    if (event) event.preventDefault();

	_.idleTimer = 0;
	
}	

function onWindowResize() {
	
//  _.width = window.innerWidth;
//  _.height = window.innerHeight;
    
//	if (isMobil) {
//		
//		if (_.width == _.prevW) {
//			
//			_.width = _.prevH; 
//			_.height = _.prevW; 
//			
//		}
//		
//		_.prevW = _.width; 
//		_.prevH = _.height; 	
//
//	}
	
//	_.width = ui.kontainer.offsetWidth; 
//	_.height = ui.kontainer.offsetHeight; 
	
	_.width = ui.section1.offsetWidth; 
	_.height = ui.section1.offsetHeight; 
	
	//console.log(_.width + ', ' + _.height)
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
//    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
//    //document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
//    ui.kontainer.style.height = _.height + 'px';    
	
	//_.camPosZ = 20; 
	
	if (_.width > _.height) {


		
	} else {


	}		
	
	//_.scrollPtr = Math.round(ui.content.offsetHeight / _.camPosZ); 
	
	//console.log(ui.content.offsetHeight); 
	
	//_.checkPt[0] = Math.round(ui.content.offsetHeight * .3); 

	
	//console.log(_.height);
	
	_.idleTimer = 0; 
	
}

/*
function addAud() {
	
	if (!x.sound) {
		
		let url = 'mntn'; 			
		url += '.mp3'; 	

		const listener = new THREE.AudioListener();
		camera.add( listener );
		
		x.sound = new THREE.Audio( listener );
		
		const audioLoader = new THREE.AudioLoader();
		
		audioLoader.load( 'aud/' + url, function( buffer ) {
		
			x.sound.setBuffer( buffer );
			x.sound.setLoop( true );
			x.sound.setVolume( 1.0 );

			x.sound.play(); 
			
			x.analyser = new THREE.AudioAnalyser( x.sound, 32 );

			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
			
		}); 
	
	}
	
}	*/

function animate() { 
	//console.log(_.idleTimer); 
    //requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		//if (!clock.running) clock.start(); 
	//	const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		//const delta = clock.getDelta() * .4; 
		//console.log( Math.sin(delta) ); 
		
	//	const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

		//console.log(document.body.scrollTop); 
		//console.log(document.documentElement.scrollTop); 
		//console.log(window.scrollY); 
		//console.log(ui.vidyo.currentTime); 

		
		//ui.vidyo.play();
		//ui.vidyo.pause();
		//ui.vidyo.currentTime = Math.round(scrollPosition / 47); 
		//ui.vidyo.currentTime = 5; 
		
		//for (let i = 0; i < 241; i++ ) {
		//	
		//}
		
	//	ui.kontainer.children[_.prevFrame].style.display = "none"; 	
	//	ui.kontainer.children[_.currFrame].style.display = "block"; 
		
	//	_.prevFrame = _.currFrame; 
		
		
		if (_.scrollTop > _.height) {
			if (ui.vidyo) {
				if (!ui.vidyo.paused) {
					//console.log('idle');				
					
					cL(ui.offPlay, 0, "noneIt2");
					cL(ui.onPlay, 1, "noneIt2");
		
					ui.vidyo.pause(); 
				}
				
				_.isVidPause = true; 
			}				
		} else {
			if ((ui.vidyo) && (_.isVidPause)) {
				if (ui.vidyo.paused) {
					
					cL(ui.onPlay, 0, "noneIt2");
					cL(ui.offPlay, 1, "noneIt2");
		
					ui.vidyo.play(); 
					
					_.isVidPause = false; 
		
				}
			}			
		}
		
		
		_.idleTimer += 0.01; 

	} else {
		//if (clock.running) clock.stop(); 
		
		//if (x.sound) {
		//	if (x.sound.isPlaying) x.sound.pause(); 
		//}
		

		if (ui.vidyo) {
			if (!ui.vidyo.paused) {
				//console.log('idle');				
				
				cL(ui.offPlay, 0, "noneIt2");
				cL(ui.onPlay, 1, "noneIt2");
	
				ui.vidyo.pause(); 
	
			}
		}	
		
		//console.log(document.body.scrollTop); 
	}
	
	if (document.hasFocus()) {
		if (!_.fokus) {
			_.idleTimer = 0; 
			_.fokus = true; 
			
			if ((ui.vidyo) && (_.scrollTop <= _.height)) {
				if (ui.vidyo.paused) {
					
					cL(ui.onPlay, 0, "noneIt2");
					cL(ui.offPlay, 1, "noneIt2");
		
					ui.vidyo.play(); 
		
				}
			}	
		}
	} else {
		_.idleTimer = idleTO; 	
		_.fokus = false; 
		
		//if (x.sound) {
		//	if (x.sound.isPlaying) x.sound.pause(); 
		//}
		
		if (ui.vidyo) {
			if (!ui.vidyo.paused) {
				
				cL(ui.offPlay, 0, "noneIt2");
				cL(ui.onPlay, 1, "noneIt2");
	
				ui.vidyo.pause(); 
	
			}
		}		
	}	
	
//	TWEEN.update();	

    requestAnimationFrame(animate);
	
}