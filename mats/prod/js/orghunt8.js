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
	ui.kontainer = document.getElementById('kontainer'); 

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
    ui.kontainer.style.opacity = 0;		

	win.fobjLeft = 0; 

	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 

	win.scrollPos = 0; 
	
	win.pointerX = win.pointerY = 0; 
	
	ui.logo1 = document.getElementById('logo1'); 
	ui.logo = document.getElementById('logo'); 
	
	ui.logo1.style.opacity = 0; 
	
	ui.background1 = document.getElementById('background1'); 

	ui.background1.style.top = '0px'; 
	win.bgTop1 = ui.background1.style.top.toString(); 
	
	ui.frontobj1 = document.getElementById('frontobj1'); 

	ui.frontobj1.style.left = '' + win.fobjLeft + 'px' +''; 
	ui.frontobj1.style.bottom = '0px'; 

	win.fobj1 = ui.frontobj1.style.bottom.toString(); 

	fadeScene(); 	
}

function fadeScene() {
	document.addEventListener('pointermove', onMouseMove, false);

    (function fadeIn() {
        let val = parseFloat(ui.kontainer.style.opacity); 

        if (!((val += .02) > 1.0)) {
            ui.kontainer.style.opacity = val; 
            
			requestAnimationFrame(fadeIn); 
        } else {
            ui.kontainer.style.opacity = 1.0; 
			
			onWindowResize(); 			
			
			if (isMobil) {
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			} else {
				document.addEventListener('mousemove', onMouseMove, false);
			}				
			
			document.body.addEventListener('scroll', onWindowScroll, false); 
        }
    })();	
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
}
	
function onDocuBodyScroll( scrollPos ) {
	if ((scrollPos + win.height) < win.scrollH) {
		ui.background1.style.top = '' + scrollPos * .7 + 'px' +'';
		ui.frontobj1.style.bottom = '' + scrollPos * -.64 + 'px' +'';
	}
	
	if (!ui.logo1.classList.contains("fadeIt2")) {
		if (scrollPos > win.logoCtr) ui.logo1.classList.add("fadeIt2"); 
	}
	
	if (scrollPos > win.opacH) {
		ui.background1.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch1); 
		ui.frontobj1.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch2); 
	} else {
		ui.background1.style.opacity = ui.frontobj1.style.opacity = 1; 
	}

	win.bgTop1 = ui.background1.style.top.toString(); 
	win.fobj1 = ui.frontobj1.style.bottom.toString(); 
	
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
		ui.background1.style.left = '' + bgRY*1 + 'px' + '';
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
    }
        
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

