/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 

let isMobil = false; 
//let mouseX = 0, mouseY = -50;  
let mouseX = mouseY = 0;
let ui = {}, win = {}, x = {}; 
let clock; 
//let debounce = true;
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
		//document.addEventListener('gesturestart', function (e) {
			//e.preventDefault();
		//}, false);
		
		document.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		}, false);			
		
	//	ui.kontainer.addEventListener('gesturechange', function (e) {
	//		e.preventDefault();
	//	}, false);				
		
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
//    ui.kontainer.style.width = win.width + 'px';    
//    ui.kontainer.style.height = win.height + 'px';
    ui.kontainer.style.opacity = 0;		
    //ui.kontainer.style.backgroundColor = '#000000';		

//	document.body.style.opacity = 0;		

	win.fobjLeft = 0; 

	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 

	win.scrollPos = 0; 
	
    //clock = new THREE.Clock();	
	//clock.autoStart = false; 	
	//clock.start(); 		
	
	//win.mouse = new THREE.Vector2(); 	
	//win.entro = true; 
	//win.idleTimer = 0; 
	//win.fokus = true; 
	
	/*
	if (isMobil) {
		//ui.kontainer.addEventListener( 'touchstart', onMouseMove2, false );
		//ui.kontainer.addEventListener( 'touchmove', onMouseMove2, false );		
		
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		
		//ui.kontainer.addEventListener('touchend', kontainerClick, false);  
	} else {
		ui.kontainer.addEventListener('mousemove', onMouseMove, false);
		
		ui.kontainer.addEventListener('click', kontainerClick, false);  
		ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
	}
	
	ui.kontainer.addEventListener("wheel", wheelE, false);	*/
	
	win.pointerX = win.pointerY = 0; 
	
	ui.logo1 = document.getElementById('logo1'); 
	ui.logo = document.getElementById('logo'); 
	
	ui.logo1.style.opacity = 0; 
	
	ui.background1 = document.getElementById('background1'); 
//	ui.background2 = document.getElementById('background2'); 

	ui.background1.style.top = '0px'; 
	win.bgTop1 = ui.background1.style.top.toString(); 
	
	ui.frontobj1 = document.getElementById('frontobj1'); 
//	ui.frontobj2 = document.getElementById('frontobj2'); 

	ui.frontobj1.style.left = '' + win.fobjLeft + 'px' +''; 

	ui.frontobj1.style.bottom = '0px'; 
	win.fobj1 = ui.frontobj1.style.bottom.toString(); 

//	ui.ctr1 = document.getElementById('ctr1'); 
//	ui.counter1 = document.getElementById('counter1'); 
	
	//win.ctrt1 = 0;  
	
	//ui.background1.style.opacity = 0; 
	
	fadeScene(); 	
}



function fadeScene2() {

	//console.log(ui.background1.classList);
	ui.background1.classList.remove("fadeIt"); 
	//console.log(ui.background1.classList);

	onWindowResize(); 	
	
	if (isMobil) {
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
	} else {
		document.addEventListener('click', kontainerClick, false);  
	}				
	
	document.addEventListener('pointermove', onMouseMove, false);	
	
	
	
	//animate();
}
	
function fadeScene() {
	//onWindowResize(); 	
	document.addEventListener('pointermove', onMouseMove, false);

    (function fadeIn() {
        let val = parseFloat(ui.kontainer.style.opacity); 
        //let val = parseFloat(document.body.style.opacity); 
    //    if (!((val += .005) > 1.0)) {
        if (!((val += .02) > 1.0)) {
            ui.kontainer.style.opacity = val; 
            //document.body.style.opacity = val; 
			//console.log(ui.background1.style.opacity); 			
            
			requestAnimationFrame(fadeIn); 
        } else {
            ui.kontainer.style.opacity = 1.0; 
            //document.body.style.opacity = 1.0; 
			
			onWindowResize(); 			
			
			if (isMobil) {
				//ui.kontainer.addEventListener( 'touchstart', onMouseMove2, false );
				//ui.kontainer.addEventListener( 'touchmove', onMouseMove2, false );		
				
				//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
			//	ui.kontainer.addEventListener( 'touchstart', onDocumentTouchStart, false );
			//	ui.kontainer.addEventListener( 'touchmove', onDocumentTouchMove, false );
				
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );
				
				//ui.kontainer.addEventListener('touchend', onDocumentTouchEnd, false);  
			} else {
			//	ui.kontainer.addEventListener('mousemove', onMouseMove, false);
				document.addEventListener('mousemove', onMouseMove, false);
				
				//console.log('not'); 	
				
			//	ui.kontainer.addEventListener('click', kontainerClick, false);  
			//	document.addEventListener('click', kontainerClick, false);  
				//ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
			}				
			
		//	ui.kontainer.addEventListener('pointermove', onMouseMove, false);
		//	document.addEventListener('pointermove', onMouseMove, false);
			
			//ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
		//	ui.kontainer.addEventListener("wheel", wheelE, false);			
			
		//	animate();  
		
		//	ui.ctr1.addEventListener('click', ctr1Click, false);  
			document.body.addEventListener('scroll', onWindowScroll, false); 
			//document.body.addEventListener('scroll', debounce, false); 
			//document.body.addEventListener('scroll', onWindowScroll, {passive: true}); 
        }
    })();	
}	

function ctr1Click( event ) {
	if (event) event.preventDefault();
	
	//win.ctrt1 += 1; 

	ui.ctr1.style.display = 'none'; 

	ui.counter1.style.opacity = 0; 	
	ui.counter1.innerText = 'Where am I? What are these stiches? I can\'t breathe! Is that... MY HEART? God help me! Must. Stay. Alive. Somehow...'; 
	ui.counter1.classList.add("fadeIt"); 
	
	//console.log('1');
}
	
function debounce(event) {
		
	let timer;
	win.scrollPos = document.body.scrollTop; 
  
	if (!ticking) {
	//return function() {
		clearTimeout(timer);
	//console.log('dbouns');
		
		timer = setTimeout(() => {
			onDocuBodyScroll(win.scrollPos);
			
		}, 10);
	//}
		
		ticking = true;
	}
}

//const onWindowScroll2 = debounce(onDocuBodyScroll, 1000);
	
function onWindowScroll( event ) {
	//if (event) event.preventDefault();
	
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
	//win.scrollPos = document.body.scrollTop;
	//let scrollPos = win.scrollPos; 
	//let scrollPos = window.pageYOffset; 
//	let scrollPos = document.body.scrollTop; 
//	let logoCtr = (win.width / win.height) * 1.05; 
//	if (win.height > win.width) logoCtr = 1.6; 
//	let logoCtr = (win.width / win.height) * .7; 
//	if (win.height > win.width) logoCtr = 1.1; 

//	let logoCtr = (win.width / win.height) * 1; 
//	if (win.height > win.width) logoCtr = 1.85; 	

//	win.logoCtr = win.scrollH * .6;  
//	if (win.height > win.width) logoCtr = 1.85; 	
	
//	let opacH = (win.width / win.height) * .51; 
//	if (win.height > win.width) opacH = .8; 
//	win.opacH = win.scrollH * .18; 
//	if (win.height > win.width) opacH = .8; 
	
	//ui.background1.style.top = scrollPos * -1;
//	ui.background1.style.top = '' + scrollPos * .5 + 'px' +'';
//	ui.frontobj1.style.bottom = '' + scrollPos * -.35 + 'px' +'';

	if ((scrollPos + win.height) < win.scrollH) {
		ui.background1.style.top = '' + scrollPos * .7 + 'px' +'';
		ui.frontobj1.style.bottom = '' + scrollPos * -.64 + 'px' +'';
	}
	
	if (!ui.logo1.classList.contains("fadeIt2")) {
		//if (scrollPos < (win.height*.65)) ui.logo.style.top = '' + scrollPos * 1.5 + 'px' +'';
	//	if (scrollPos > (win.height*logoCtr)) {
		if (scrollPos > win.logoCtr) {
			//ui.logo.style.top = '' + scrollPos * -.0001 + 'px' +'';
			//ui.logo.style.opacity = scrollPos * .0004; 		
			ui.logo1.classList.add("fadeIt2"); 
			
			//console.log('pass2');
		}
	}
	
//	if (scrollPos > (win.height*opacH)) {
	if (scrollPos > win.opacH) {
		ui.background1.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch1); 
		ui.frontobj1.style.opacity = 1 - ((scrollPos - win.opacH) * win.opch2); 
		//ui.background1.style.opacity = 1 - (scrollPos * .0003); 
		//ui.frontobj1.style.opacity = 1 - (scrollPos * .0003);  
		
		//console.log('pass'); 
	} else {
		ui.background1.style.opacity = ui.frontobj1.style.opacity = 1; 
	}
	//ui.frontobj1.style.opacity = scrollPos * .002; 
	
	//ui.logo.style.opacity = scrollPos * .002; 
	
	//if ((scrollPos < (win.height*1.9)) && (scrollPos > (win.height*1.4)))  ui.ctr1.style.bottom = '' - scrollPos * 1 + 'px' +'';
	
	//ui.counter1.style.bottom = '' + scrollPos * .05 + 'px' +'';

	win.bgTop1 = ui.background1.style.top.toString(); 
	win.fobj1 = ui.frontobj1.style.bottom.toString(); 
	
	//console.log(scrollPos);
	//console.log(win.scrollH);
	
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
	
	//console.log(ui.frontobj1.style.bottom);
	
	let fobjB = win.fobj1; 
	//fobjB.slice(0, -1);
	//fobjB.replace(/[^0-9]/g, ''); 
	//fobjB.replace(/.$/, ''); 
	//let fobjB2 = fobjB.substring(0, fobjB.length - 1); 	
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
	
//	ui.frontobj1.style.left = '' + bgRY*5 + 'px' + ''; 
	
	//ui.background1.style.top = '' + bgTop + bgRX + 'px' + ''; 
	
	//ui.frontobj1.style.transform = 'rotateX('+rotY+'deg)'; 
	
	//ui.background1.style.transform = 'rotateX('+bgRX+'deg) rotateY('+bgRY+'deg)'; 
//	ui.background2.style.transform = 'rotateX('+bgRX+'deg) rotateY('+bgRY+'deg)'; 
	
	//ui.frontobj1.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg)'; 
//	ui.frontobj1.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg)'; 
//	ui.frontobj2.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg)'; 
	
	//ui.frontobj1.style.transform = 'rotate3D(1, 1, 0, '+rotY+'deg)'; 
	//console.log(ui.frontobj1.style.left);
	
	//mouseY -= 50; 	
	
	//win.idleTimer = 0; 
}

function onMouseWheel( event ) {
    event.preventDefault();
    //event.stopPropagation();                

    //win.idleTimer = 0;
}	

function wheelE( event ) {
    event.preventDefault();
    //event.stopPropagation(); 

	//win.idleTimer = 0;
}	

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
	//	event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH; 
		
		win.pointerX = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointerY = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;			
		
		//win.idleTimer = 0; 
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
	//	event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH;
	}
}

function onDocumentTouchEnd( event ) {
	if ( event.touches.length === 1 ) {	
		win.pointerX = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointerY = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;		
	
		//document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		//document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
	//	ui.kontainer.removeEventListener( 'touchmove', onDocumentTouchMove, false );
	//	ui.kontainer.removeEventListener( 'touchend', onDocumentTouchEnd, false );
		document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
	
		//win.idleTimer = 0; 	
	}
}

function kontainerClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();

	//win.idleTimer = 0; 
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
	
//    document.body.style.width = ui.kontainer.style.width = win.width + 'px';
//    document.body.style.height = ui.kontainer.style.height = win.height + 'px';    
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

	
	//console.log(win.scrollH); 
	
	//win.idleTimer = 0; 
}

/*
function animate() { 
	

    requestAnimationFrame(animate);
}
*/
