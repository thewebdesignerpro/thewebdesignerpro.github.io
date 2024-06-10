/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
let isMobil = false; 
let mouseX = mouseY = 0;
let ui = {}, win = {}, x = {}; 
let ticking = false; 

if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}				

function init() {
	//ui.kontainer = document.getElementById('kontainer'); 

	let dummy = document.createElement("div");
	dummy.setAttribute("id", "dummy");
	document.body.appendChild(dummy);
	
   if (window.getComputedStyle(dummy, null).getPropertyValue("left")=='9000px') {
        isMobil = false;
    } else {
        isMobil = true;        
    }

	win.opch1 = .001; 
	win.opch2 = .0008; 
	
    if (isMobil) {
		document.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		}, false);			
		
		document.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		}, false);		
		
		win.opch1 = .0013; 
		win.opch2 = .0011; 
    }
	
	dummy.parentNode.removeChild(dummy);		
	
	win.width = window.innerWidth; 
	win.height = window.innerHeight; 

    document.body.style.width = win.width + 'px';
    document.body.style.height = win.height + 'px';    
    document.body.style.opacity = 0;		
   // ui.kontainer.style.opacity = 0;		

	win.fobjLeft = 0; 

	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 

	win.scrollPos = 0; 
	
	win.prevScrollPos = 0; 
	
	win.deltY = 0; 
	
	win.pointerX = win.pointerY = 0; 
	
	ui.logo1 = document.getElementById('logo1'); 
	ui.logo = document.getElementById('logo'); 
	
	ui.logo1.style.opacity = 0; 
	
	ui.background1 = document.getElementById('background1'); 
	//ui.background1.style.opacity = 1;	
	
	ui.background1.style.top = '0px'; 
	win.bgTop1 = ui.background1.style.top.toString(); 

	ui.background = document.getElementById('background'); 
	
	ui.frontobj1 = document.getElementById('frontobj1'); 

	ui.frontobj1.style.left = '' + win.fobjLeft + 'px' +''; 
	ui.frontobj1.style.bottom = '0px'; 

	win.fobj1 = ui.frontobj1.style.bottom.toString(); 

	//ui.fader = document.getElementById('fader'); 
	//ui.fader.style.opacity = 0;	
	
	fadeScene(); 	
}

function fadeScene() {
	document.addEventListener('pointermove', onMouseMove, false);

    (function fadeIn() {
        //let val = parseFloat(ui.kontainer.style.opacity); 
        let val = parseFloat(document.body.style.opacity); 

        if (!((val += .02) > 1.0)) {
            //ui.kontainer.style.opacity = val; 
            document.body.style.opacity = val; 
            
			requestAnimationFrame(fadeIn); 
        } else {
            //ui.kontainer.style.opacity = 1.0; 
            document.body.style.opacity = 1.0; 
			
			onWindowResize(); 			
			
			if (isMobil) {
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			} else {
				document.addEventListener('mousemove', onMouseMove, false);
			}				
			
			document.body.addEventListener('scroll', onWindowScroll, false); 
			//document.body.addEventListener('scroll', throttled, false); 
			//document.body.addEventListener("wheel", onDocuBodyScroll2, { passive: false });
        }
    })();	
}	

var throttled = throttle(onDocuBodyScroll, 5);

function throttle(func, wait, options) {
	var timeout, context, args, result;
	var previous = 0;
	if (!options) options = {};
	
	var later = function () {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	
	var throttled = function () {
		var _now = Date.now();
		if (!previous && options.leading === false) previous = _now;
		var remaining = wait - (_now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
			clearTimeout(timeout);
			timeout = null;
			}
			previous = _now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
	
	throttled.cancel = function () {
		clearTimeout(timeout);
		previous = 0;
		timeout = context = args = null;
	};
	
	return throttled;
}

function onWindowScroll( event ) {
	win.scrollPos = document.body.scrollTop; 
	
	if (!ticking) {
		window.requestAnimationFrame(() => {
			onDocuBodyScroll(win.scrollPos);
			
			ticking = false;
		});

		ticking = true;
	}	
	
	//console.log(_.throttle(onDocuBodyScroll, 1000));
}

function onDocuBodyScroll( scrollPos ) {
	//console.log(win.prevScrollPos);
	win.scrollPos = scrollPos = document.body.scrollTop; 
	//console.log(win.scrollPos);
	
	/*if ((scrollPos + win.height) < win.scrollH) {
		//ui.background1.style.top = '' + scrollPos * .7 + 'px' +'';
		//ui.frontobj1.style.bottom = '' + scrollPos * -.64 + 'px' +'';
		
		if (win.prevScrollPos > win.scrollPos) {
			win.deltY += -20; 
		} else if (win.prevScrollPos < win.scrollPos) {
			win.deltY += 20; 
		}
		//console.log(win.deltY);
		
		//ui.background1.style.transform = '' + 'translateY(' + win.deltY + 'px)' + '';  
	}*/
	
	if (!ui.logo1.classList.contains("fadeIt2")) {
		if (scrollPos > win.logoCtr) ui.logo1.classList.add("fadeIt2"); 
	}
	
	if (scrollPos > win.opacH) {
		//ui.fader.style.opacity = (scrollPos - win.opacH) * win.opch1; 
		//ui.background1.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch1); 
		ui.background.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch1); 		
		ui.frontobj1.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch2); 
	} else {
		//ui.fader.style.opacity = 0; 
		//ui.background1.style.opacity = ui.frontobj1.style.opacity = 1; 
		ui.background.style.opacity = ui.frontobj1.style.opacity = 1; 
	}

	//win.bgTop1 = ui.background1.style.top.toString(); 
	//win.fobj1 = ui.frontobj1.style.bottom.toString(); 
	
	win.prevScrollPos = document.body.scrollTop; 
	
	ticking = false;
}

function onDocuBodyScroll2( event ) {
    //if (event) event.preventDefault();
    //event.stopPropagation();
	
	win.deltY += event.deltaY * -.2; 

	console.log(win.deltY);
	
	//ui.background1.style.transform = '' + 'translateY(' + win.deltY + 'px)' + '';   
	//ui.frontobj1.style.transform = '' + 'translateY(' + (win.deltY * .914) + 'px)' + '';   
	
	ticking = false;
}
	
function onMouseMove( event ) {
    if (event) event.preventDefault();

	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointerX = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointerY = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointerX = ( event.clientX / win.width ) * 2 - 1;
		win.pointerY = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	let fobjB = win.fobj1; 
	fobjB = fobjB.slice(0, -2); 	
	fobjB = parseFloat(fobjB); 
	
	let bgTop = win.bgTop1; 
	bgTop = bgTop.slice(0, -2); 	
	bgTop = parseFloat(bgTop); 
	
	const bgRX = win.pointerY * 10,   
		  bgRY = win.pointerX * -12; 

	const rotX = win.pointerY * .001,   
		  rotY = win.pointerX * .001; 
	
	const fob1l = bgRY*5 + win.fobjLeft; 
	
	if (!ticking) {
		//ui.background.style.transform = '' + 'translateX(' + bgRY*1 + 'px)' + '';
		ui.background.style.left = '' + bgRY*1 + 'px' + '';
		//ui.background1.style.left = '' + bgRY*1 + 'px' + '';
		ui.frontobj1.style.left = '' + fob1l + 'px' + ''; 	
		ui.frontobj1.style.bottom = '' + fobjB - bgRX*1 + 'px' + ''; 	
	}
}

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH; 
		
		win.pointerX = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointerY = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;			
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH;
	}
}

function onDocumentTouchEnd( event ) {
	if ( event.touches.length === 1 ) {	
		win.pointerX = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointerY = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;		
	
		document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
	}
}

function onWindowResize() {
    win.width = window.innerWidth;
    win.height = window.innerHeight;
    
	/*
	if (isMobil) {
        let winWH = document.documentElement.getBoundingClientRect();
        let winWHx = document.documentElement.clientWidth, 
            winWHy = document.documentElement.clientHeight;
        if (winWH) {
            win.width = winWH.width;
            win.height = winWH.height;
        } else if (winWHx) {
            win.width = winWHx;
            win.height = winWHy;            
        } else {
            let tmpWW = win.width;
            win.width = win.height; 
            win.height = tmpWW;
        }
    }	*/
        
    win.widthH = win.width / 2;
    win.heightH = win.height / 2;        	
	
    document.body.style.width = win.width + 'px';
    document.body.style.height = win.height + 'px';    
	
	if (!ticking) win.scrollH = document.body.scrollHeight; 

	win.logoCtr = win.scrollH * .6;  
	
	if (win.width < win.height) {
		win.fobjLeft = ((win.height * 1.02) - win.width) / -2; 
		
		win.opacH = win.scrollH * .18; 			
	} else {
		win.fobjLeft = 0; 
		
		win.opacH = win.scrollH * .27; 	
	}
	
	if (ui.frontobj1) ui.frontobj1.style.left = '' + win.fobjLeft + 'px' +''; 
}

