/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 

let isMobil = false; 
//let mouseX = 0, mouseY = -50;  
let mouseX = mouseY = 0;
let ui = {}, win = {}, x = {}; 
let clock; 

if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}				


function init() {
//	ui.kontainer = document.getElementById('kontainer'); 

	let dummy = document.createElement("div");
	dummy.setAttribute("id", "dummy");
	document.body.appendChild(dummy);
	
   if (window.getComputedStyle(dummy, null).getPropertyValue("left")=='9000px') {
        isMobil = false;
    } else {
        isMobil = true;        
    }

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
    }
	
	dummy.parentNode.removeChild(dummy);		
	
	win.width = window.innerWidth; 
	win.height = window.innerHeight; 

    document.body.style.width = win.width + 'px';
    document.body.style.height = win.height + 'px';    
//    ui.kontainer.style.width = win.width + 'px';    
//    ui.kontainer.style.height = win.height + 'px';
//    ui.kontainer.style.opacity = 0;		
    //ui.kontainer.style.backgroundColor = '#000000';		

	document.body.style.opacity = 0;		

	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 
	
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
	
	ui.background1 = document.getElementById('background1'); 
	ui.background2 = document.getElementById('background2'); 
	
	ui.frontobj1 = document.getElementById('frontobj1'); 
	ui.frontobj2 = document.getElementById('frontobj2'); 

	ui.ctr1 = document.getElementById('ctr1'); 
	
	win.ctrt1 = 0;  
	
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
    //    let val = parseFloat(ui.kontainer.style.opacity); 
        let val = parseFloat(document.body.style.opacity); 
        if (!((val += .005) > 1.0)) {
        //    ui.kontainer.style.opacity = val; 
            document.body.style.opacity = val; 
			//console.log(ui.background1.style.opacity); 			
            
			requestAnimationFrame(fadeIn); 
        } else {
        //    ui.kontainer.style.opacity = 1.0; 
            document.body.style.opacity = 1.0; 
			
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
				document.addEventListener('click', kontainerClick, false);  
				//ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
			}				
			
		//	ui.kontainer.addEventListener('pointermove', onMouseMove, false);
		//	document.addEventListener('pointermove', onMouseMove, false);
			
			//ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
		//	ui.kontainer.addEventListener("wheel", wheelE, false);			
			
		//	animate();  
		
			ui.ctr1.addEventListener('click', ctr1Click, false);  
			
        }
    })();	
}	

function ctr1Click( event ) {
	if (event) event.preventDefault();
	
	win.ctrt1 += 1; 
	
	ui.ctr1.innerText = win.ctrt1; 
	
	//console.log('1');
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
	
	const bgRX = win.pointerY * -.001,   
		  bgRY = win.pointerX * -.001; 

	const rotX = win.pointerY * .001,   
		  rotY = win.pointerX * .001; 
		  
	//ui.frontobj1.style.transform = 'rotateX('+rotY+'deg)'; 
	
	ui.background1.style.transform = 'rotateX('+bgRX+'deg) rotateY('+bgRY+'deg)'; 
//	ui.background2.style.transform = 'rotateX('+bgRX+'deg) rotateY('+bgRY+'deg)'; 
	
	ui.frontobj1.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg)'; 
//	ui.frontobj1.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg)'; 
//	ui.frontobj2.style.transform = 'rotateX('+rotX+'deg) rotateY('+rotY+'deg)'; 
	
	//ui.frontobj1.style.transform = 'rotate3D(1, 1, 0, '+rotY+'deg)'; 
	//console.log(win.pointerY);
	
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
	
	//win.idleTimer = 0; 
}


function animate() { 
	

    requestAnimationFrame(animate);
}

