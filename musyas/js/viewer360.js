/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import WEBGL from 'three/addons/WebGL.js'; 
import WEBGL from 'three/addons/capabilities/WebGL.js'; 
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { TWEEN } from 'three/addons/tween.module.min.js'; 
//import TWEEN from 'three/addons/tween.module.js';
//import TWEEN from 'three/addons/libs/tween.module.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const idleTO = 120, florY = 0, ceilY = 140;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3, grup4, grup1, grup2; 
//let grup1, grup2, grup3; 
let grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer; 
let ui = {}, win = {}, x = {}; 

// temp
//let controls; 


if ( WEBGL.isWebGLAvailable() === false ) {	
    let warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);	
} else {	
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
}

function init() {
	ui.kontainer = document.getElementById('kontainer'); 
	//ui.loadr = document.getElementById('loadr'); 

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
		
		ui.kontainer.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		}, false);		
    }
	
	dummy.parentNode.removeChild(dummy);		
	
	win.width = window.innerWidth; 
	win.height = window.innerHeight; 

    document.body.style.width = win.width + 'px';
    document.body.style.height = win.height + 'px';    

    ui.kontainer.style.width = win.width + 'px';    
    ui.kontainer.style.height = win.height + 'px';
    ui.kontainer.style.opacity = 0;		
	//ui.kontainer.style.backgroundColor = '#000000';	

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	renderer.setClearColor(0xffffff, 1.0); 
	//renderer.shadowMap.enabled = true;
	renderer.shadowMap.enabled = false; 
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
	renderer.sortObjects = false;	
	ui.kontainer.appendChild(renderer.domElement); 

	//kanvas = document.getElementsByTagName("canvas");
	
	if (document.getElementsByTagName("canvas").length > 0) {
		document.getElementsByTagName("canvas")[0].setAttribute("id", "kanvas"); 
		
		ui.kanvas = document.getElementById('kanvas'); 	
	}
	
	ui.kanvas.style.display = "none"; 
	
	//console.log(ui.kanvas);
	
	// Check for float-RT support
	// TODO (abelnation): figure out fall-back for float textures
	if ( renderer.capabilities.isWebGL2 === false && ! renderer.extensions.get( 'OES_texture_float' ) ) {
		alert( 'OES_texture_float not supported' );
		throw 'missing webgl extension';
	}

	if ( renderer.capabilities.isWebGL2 === false && ! renderer.extensions.get( 'OES_texture_float_linear' ) ) {
		alert( 'OES_texture_float_linear not supported' );
		throw 'missing webgl extension';
	}	
	
    scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 50, win.width / win.height, 1, 30000 );
	//camera.position.set(0, 0, 0); 
	//camera.lookAt( 0, 0, 0 );

    scene.add(camera);	
	
	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 
	
	//TEMP!!
/*    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1;	
    controls.autoRotate = false;    	
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 10000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = .5;
    controls.panSpeed = .1;
	//controls.update();		
*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = new THREE.Group(); 
	//grups[1] = new THREE.Group(); 
	//grups[2] = new THREE.Group(); 
	

	//addSky(); 

	win.mouse = new THREE.Vector2(); 	
	win.entro = true; 
	win.idleTimer = 0; 
	win.fokus = true; 
	
	//win.raycaster = new THREE.Raycaster();
	win.pointer = new THREE.Vector2();

	win.v360Idx = 0; 
	win.texIdx = 0; 
	win.iScale = 1; 
	
	load360Tex(); 
	
	//fadeScene(); 	
}

function load360Tex() {
	x.tex360 = [];  
	
	let imjUrl = 'images/360/360-00-';
	let idX; 	
	
	for (let i = 0; i < 361; i++ ) {	
		if (i > 99) {
			idX = '0'; 
		} else {
			idX = i > 9 ? '00' : '000';		
		}		
		
		imjUrl = 'images/360/360-00-.' + idX + i + '.jpg'; 	
		
		//console.log(imjUrl);
		
		x.tex360[i] = new Image();

		x.tex360[i].onload = function(){
			win.texIdx += 1; 
			
			if (win.texIdx==360) fadeScene(); 	
			//console.log(x.tex360[i]); 
		};

		x.tex360[i].src = imjUrl;		
		
		
	}
}
	
function load360Tex2() {
	x.tex360 = [];  
	
	let imjUrl = 'images/360/360-00-';
	
	let idX; 
	
	//console.log(idX + win.v360Idx);
	
	//imjUrl = 'images/360/360-00-.' + idX; 
	
	let loader = []; 
	
	for ( let i = 0; i < 361; i++ ) {	
		//win.texIdx = i; 
		
		if (i > 99) {
			idX = '0'; 
		} else {
			idX = i > 9 ? '00' : '000';		
		}		
		
		imjUrl = 'images/360/360-00-.' + idX; 

		//console.log(imjUrl + win.texIdx + '.jpg'); 
		//console.log(idX); 		

		loader[i] = new THREE.TextureLoader(); 
		
		loader[i].load( imjUrl + i + '.jpg', function(tx) { 	
			x.tex360[i] = tx;  
			
			//console.log(x.tex360[i]);

			//scene.background = x.tex360[i]; 			
			//win.texIdx += 1; 
		}); 	
	}
	
	fadeScene(); 
}

function fadeScene() {
	
    (function fadeIn() {
		let val = parseFloat(kontainer.style.opacity); 
		
        if (!((val += .05) > 1.0)) {
            ui.kontainer.style.opacity = val;
            //document.body.style.opacity = .5;
			
            requestAnimationFrame(fadeIn); 
        } else {
            ui.kontainer.style.opacity = 1.0;
            //document.body.style.opacity = 1.0;
			
			onWindowResize(); 			
			
			ui.kontainer.addEventListener('pointerdown', onPointerDown, false);
			
			ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
		//	ui.kontainer.addEventListener("wheel", wheelE, false);			
			
			animate();  

			//viewer360(); 
			
			const loadr = document.getElementById('loadr'); 
			loadr.parentNode.removeChild(loadr);	
			
			//ui.kontainer.style.backgroundImage = "url('images/360/360-00-.0000.jpg')"; 
			ui.kontainer.style.backgroundImage = '' + 'url(' + x.tex360[0].src + ')' + '';
        }
    })();	
}	

function viewer360() {
	//console.log(win.v360Idx); 
	
	let idX = '0'; 
	
	if (win.v360Idx < 100) {
		idX = win.v360Idx > 9 ? '00' : '000';		
	}
	
	//console.log(idX + win.v360Idx);
	
	const imjUrl = 'images/360/360-00-.' + idX + win.v360Idx + '.jpg'; 
	
	//console.log(x.tex360[win.v360Idx]);
	
	//ui.kontainer.style.backgroundImage = "url('images/360/' + imjUrl + ')"; 
//	ui.kontainer.style.backgroundImage = '' + 'url(' + imjUrl + ')' + ''; 

	//ui.kontainer.style.backgroundImage = x.tex360[win.v360Idx]; 
	
	ui.kontainer.style.backgroundImage = '' + 'url(' + x.tex360[win.v360Idx].src + ')' + ''; 


	//console.log(ui.kontainer.style.backgroundImage);
}

function onPointerDown( event ) {
    if (event) event.preventDefault();

	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointer.x = ( event.clientX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	ui.kontainer.addEventListener('pointermove', onPointerMove, false);
	ui.kontainer.addEventListener('pointerup', onPointerUp, false);
	ui.kontainer.addEventListener('pointercancel', onPointerCancel, false);
	
	//win.pointer.ex = win.pointer.x; 
	
	win.idleTimer = 0; 
}

function onPointerMove( event ) {
    if (event) event.preventDefault();

	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointer.x = ( event.clientX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	//const ptrX = win.pointer.x + 1; 
	
	win.v360Idx = Math.round((win.pointer.x + 1) * 180); 
	//win.v360Idx = Math.round(((win.pointer.x - win.pointer.ex) + 1) * 180); 
	
	//console.log(win.v360Idx); 
	
	viewer360(); 
	
	win.idleTimer = 0; 
}

function onPointerUp( event ) {
    if (event) event.preventDefault();

	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointer.x = ( event.clientX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	ui.kontainer.removeEventListener('pointermove', onPointerMove, false);
	ui.kontainer.removeEventListener('pointerup', onPointerUp, false);
	ui.kontainer.removeEventListener('pointercancel', onPointerUp, false);
	
	win.idleTimer = 0; 
}

function onPointerCancel( event ) {
    if (event) event.preventDefault();

	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointer.x = ( event.clientX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	ui.kontainer.removeEventListener('pointermove', onPointerMove, false);
	ui.kontainer.removeEventListener('pointerup', onPointerUp, false);
	ui.kontainer.removeEventListener('pointercancel', onPointerCancel, false);
	
	win.idleTimer = 0; 
}

function wheelE( event ) {
    event.preventDefault();
    //event.stopPropagation(); 

	win.iScale += event.deltaY * -.0005; 	

	// Restrict scale
	win.iScale = Math.min(Math.max(0.9, win.iScale), 1.1); 
	console.log(win.iScale);
	
	//ui.kontainer.style.transform = 'scale(${win.iScale})';  
	ui.kontainer.style.transform = '' + 'scale(' + win.iScale + ')' + '';   
	
	win.idleTimer = 0;
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
	
    document.body.style.width = ui.kontainer.style.width = win.width + 'px';
    document.body.style.height = ui.kontainer.style.height = win.height + 'px';    
	
	camera.aspect = win.width / win.height;
	camera.updateProjectionMatrix();

	renderer.setSize(win.width, win.height);	
	
	
	win.idleTimer = 0; 
}


	
function animate() { 
    requestAnimationFrame(animate);

	if (win.idleTimer < idleTO) {
		//if (!clock.running) clock.start(); 

		//console.log(); 
	
		win.idleTimer += 0.01; 
		
		render();
	} else {
		//if (clock.running) clock.stop(); 
		
	}
	
	if (document.hasFocus()) {
		if (!win.fokus) {
			win.idleTimer = 0; 
			win.fokus = true; 
		}
	} else {
		win.idleTimer = idleTO; 	
		win.fokus = false; 
	}	
	
	//TWEEN.update();	
}

function render() {
	//camera.lookAt(scene.position); 	
	
	//controls.update(); 
	
	renderer.render( scene, camera );	
}

	