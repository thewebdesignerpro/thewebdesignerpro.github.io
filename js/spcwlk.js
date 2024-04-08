/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import WEBGL from 'three/addons/WebGL.js'; 
import WEBGL from 'three/addons/capabilities/WebGL.js'; 
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { TWEEN } from 'three/addons/tween.module.min.js'; 
//import TWEEN from 'three/addons/tween.module.js';
//import TWEEN from 'three/addons/libs/tween.module.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//import * as THREE from './jsm/three.module.js';			
//import WEBGL from './jsm/WebGL.js'; 
//import { TWEEN } from './jsm/tween.module.min.js'; 
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';

const idleTO = 120, florY = -100, ceilY = 140;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3, grup4, grup1, grup2; 
//let grup1, grup2, grup3; 
let grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer; 
let ui = {}, win = {}, x = {}; 

//let cntnt, cntnt2, cntnt3; 

//console.log(x);
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

    ui.kontainer.style.backgroundColor = '#0x000000';		

	win.cr = []; 	

	/*
	//win.ej = 2800; 
	win.ej = []; 
	win.ej[0] = -1600; 	//edge 1600 or -1600
	win.ej[1] = -1; 	//forward or back 1 or -1
	win.ej[2] = 800; 	//reset -800 or 800
	
	win.ej[3] = 0; 		//Math.PI or 0
	win.ej[4] = 150;	//950 or 150
	win.ej[5] = 350; 	//1150 or 350
	*/

	win.ej = []; 	
	//win.ej[0] = 1150;		//950 or 150 - char pos z
	//win.ej[1] = 1350;		//1150 or 350 - cam pos z
	//win.ej[2] = 150; 		//150 or 950 - char pos z
	//win.ej[3] = -1; 		//back or front -1 or 1
	//win.ej[4] = Math.PI;	//Math.PI or 0		
	
	win.ej[0] = 1000; 		//1000 or 0 - grups 0 pos z
//	win.ej[1] = 1; 			//back or front 1 or -1
	win.ej[1] = 0; 			//back or front 1 or -1
//	win.ej[2] = Math.PI;	//Math.PI or 0	
	win.ej[2] = 0;			//Math.PI or 0	
	win.ej[3] = 0;			//0	or 1000
	
	win.ej[4] = 0;			//0	or .0116
	win.ej[5] = 70;			//70 or 35
	
	//const fogCol = 0x2e3032; 
	const fogCol = 0x000000; 
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	//renderer.setClearColor(0x777777, 1.0); 
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	renderer.outputColorSpace = THREE.SRGBColorSpace; 
	//renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
	renderer.sortObjects = false;	
	ui.kontainer.appendChild(renderer.domElement); 
	
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.0015);	
	scene.fog = new THREE.FogExp2(fogCol, 0.001);	
	//scene.fog = new THREE.FogExp2(0x2e3032, 0.001);	
	//scene.fog.density = 0.0037;
	
	camera = new THREE.PerspectiveCamera( 50, win.width / win.height, 1, 10000 );
	//camera.position.set(9, -25, 1144);
	//camera.position.set(0, -25, 1700);
	//camera.position.set(0, -25, 2300);
//	camera.position.set(0, -35, 2350); 
//	camera.position.set(0, -35, 1150); 
//	camera.position.set(0, -35, win.ej[5]); 
//	camera.position.set(0, -35, win.ej[1]); 
//	camera.position.set(0, -35, 1350); 
	camera.position.set(0, -win.ej[5], 1350); 
	//camera.position.set(0, -35, 2400);
	//camera.lookAt( 0, 0, 0 );

    scene.add(camera);	
	
	//let aLight = new THREE.AmbientLight( 0x777777 ); 
	//scene.add( aLight );		
	scene.add( new THREE.AmbientLight( 0x202020 ) );		

	x.spotLight = []; 
	
	//x.spotLight = new THREE.SpotLight( 0xffffff, 10, 0, Math.PI/2, 0 );
//	x.spotLight = new THREE.SpotLight( 0xffffff, 3, 420, Math.PI/4, 1 );
//	x.spotLight = new THREE.SpotLight( 0xffffff, 680000, 450, Math.PI/4, 1 );
//	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 2000000, 4000, Math.PI/8, 1 );
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 3500000, 5000, Math.PI/8, 1 );
	//x.spotLight = new THREE.SpotLight( 0xffffff, 30, 2000, Math.PI/4, 1 );
	//x.spotLight.position.set( 0, 400+florY, 1060 );
//	x.spotLight.position.set( 0, 400+florY, 1600 );
	//x.spotLight.position.set( 0, ceilY+1, 1600 );
//	x.spotLight.position.set( 0, ceilY+35, 2200 );
//	x.spotLight[0].position.set( 0, ceilY+56, 0 );
//	x.spotLight[0].position.set( 0, 1000, 1000 );
//	x.spotLight[0].position.set( -1000, 160, 1000 );
	x.spotLight[0].position.set( -1500, 160, 1000 );
	//x.spotLight.position.set( 0, 1000+florY, -100 );
//	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width = 1024;
	x.spotLight[0].shadow.mapSize.height = 1024;
//	x.spotLight[0].shadow.camera.near = 10;
//	x.spotLight[0].shadow.camera.far = 500;
//	x.spotLight[0].shadow.camera.fov = 30;
	//x.spotLight.shadow.focus = 1; 
	//x.spotLight.shadowDarkness = 1.; 
	scene.add( x.spotLight[0] );	
	
	x.spotLight[1] = new THREE.SpotLight( 0xffffff, 100000, 470, Math.PI/2.5, 1 ); 
	x.spotLight[1].position.set( 0, ceilY+56, 0 ); 
	//x.spotLight[].castShadow = true; 
	//x.spotLight[].shadow.camera.near = 10; 
	//x.spotLight[].shadow.camera.far = 500; 
	//x.spotLight[].shadow.camera.fov = 30; 	
	
	x.spotLight[2] = new THREE.SpotLight( 0xffffff, 100000, 470, Math.PI/2.5, 1 ); 
	x.spotLight[2].position.set( 0, ceilY+56, 0 ); 
	x.spotLight[0].castShadow = x.spotLight[1].castShadow = x.spotLight[2].castShadow = true; 
	x.spotLight[0].shadow.camera.near = x.spotLight[1].shadow.camera.near = x.spotLight[2].shadow.camera.near = 10; 
	x.spotLight[0].shadow.camera.far = x.spotLight[1].shadow.camera.far = x.spotLight[2].shadow.camera.far = 5000; 
	x.spotLight[0].shadow.camera.fov = x.spotLight[1].shadow.camera.fov = x.spotLight[2].shadow.camera.fov = 50; 	
	
	//x.spotLight.power = 1000;
	
	//x.spotLight.position.set( 0, 400+florY, 1060 );
	//x.spotLight.target = x.char1;		
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	
	//const light = new THREE.SpotLight( 0xffffff );
	//const light = new THREE.PointLight( 0xffffff, 30000, 450 );
	//const light = new THREE.DirectionalLight( 0xffffff, 10 );
	//light.position.set( 0, ceilY-2, 2200 );
	//light.castShadow = true; 
	//scene.add( light );	
	
	//cntnt = document.getElementById("content"); 
	//cntnt2 = document.getElementById("content2"); 
	//cntnt3 = document.getElementById("content3"); 
	
	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 
	
/*	//TEMP!!
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = .5;	
    controls.autoRotate = false;    	
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 4000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = .5;
    controls.panSpeed = .1;
	//controls.update();		
*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grup1 = new THREE.Group(); 
	//grup2 = new THREE.Group(); 	
	//grup3 = new THREE.Group(); 	
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	grups[0] = new THREE.Group(); 
//	grups[1] = new THREE.Group(); 
//	grups[2] = new THREE.Group(); 
	
	//grups[0].add( x.spotLight[0] );	
	//grups[1].add( x.spotLight[1] );	
	//grups[2].add( x.spotLight[2] );	
	
	//scene.add( x.spotLight[0] );	
	
	addFloor();
	addWormhole();
	//addCeiling();
	//addWalls();
	//addTrees(); 
	//addFog(); 
	animFBX(); 
	
	//addAud(); 

	win.mouse = new THREE.Vector2(); 	
	win.entro = true; 
	win.idleTimer = 0; 
	win.fokus = true; 
	
	//win.raycaster = new THREE.Raycaster();
	win.pointer = new THREE.Vector2();

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
	
//	entro(); 
	
	//fadeScene(); 	
}

/*
function entro() {
	ui.tempDiv = document.createElement("div");                 
	ui.tempDiv.setAttribute("id", "noAud");
	//ui.tempDiv.id = "noAud"; 
	ui.tempDiv.innerHTML = "ENTER";  
	ui.tempDiv.style.display = "block"; 
	ui.tempDiv.style.position = "absolute";
	ui.tempDiv.style.margin = "auto";					
	ui.tempDiv.style.top = "40%"; 
	ui.tempDiv.style.bottom = ui.tempDiv.style.left = ui.tempDiv.style.right = "0"; 
	//ui.tempDiv.style.width = "160px";
	ui.tempDiv.style.width = "160px";
	ui.tempDiv.style.height = "48px";
	//ui.tempDiv.style.lineHeight = "44px";
	ui.tempDiv.style.lineHeight = "48px";
	ui.tempDiv.style.fontFamily = "sans-serif"; 
	ui.tempDiv.style.fontSize = "24px"; 
	ui.tempDiv.style.textAlign = "center"; 
	ui.tempDiv.style.color = "rgba(255, 255, 255, 0.5)";
	ui.tempDiv.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
	ui.tempDiv.style.border = "2px solid rgba(255, 255, 255, 0.5)";
	ui.tempDiv.style.cursor = "pointer"; 
    
	//kontainer.addEventListener( 'click', kontainerClck, false ); 
	ui.kontainer.appendChild(ui.tempDiv); 				
	
//	if (!isMobil) document.addEventListener( 'keyup', clickTap, false ); 
	//document.addEventListener("keyup", function(event) {
		//if (event.key === 'Enter') clickTap(); 
	//});	
}
*/

function theOptions() {
	ui.swtchKam = document.getElementById('swtchKam'); 
	ui.onAud = document.getElementById('onAud'); 
	ui.offAud = document.getElementById('offAud'); 
	
	ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		ui.swtchKam.addEventListener( 'touchstart', swtchKamClick2, false );
		ui.onAud.addEventListener( 'touchstart', audClick, false );
		ui.offAud.addEventListener( 'touchstart', audClick, false );

	} else {
		ui.swtchKam.addEventListener('click', swtchKamClick2, false);  
		ui.onAud.addEventListener('click', audClick, false);  
		ui.offAud.addEventListener('click', audClick, false);  
	}		
}

/*
function swtchKamClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();

//	clickTap(); 

	if (win.ej[0] == 1150) {
		win.ej[0] = 150;		//950 or 150
		win.ej[1] = 350;		//1150 or 350
		win.ej[2] = 1150; 		//150 or 950
		win.ej[3] = 1; 			//back or front -1 or 1
		win.ej[4] = 0;			//Math.PI or 0			
	} else {
		win.ej[0] = 1150;		//950 or 150
		win.ej[1] = 1350;		//1150 or 350
		win.ej[2] = 150; 		//150 or 950
		win.ej[3] = -1; 		//back or front -1 or 1
		win.ej[4] = Math.PI;	//Math.PI or 0	
	}
	
	x.char1.rotation.y = win.ej[4]; 
	
	win.idleTimer = 0; 
}
*/

function swtchKamClick2(event) {
    if (event) event.preventDefault(); 
//    event.preventDefault(); 
	//event.stopPropagation();

//	clickTap(); 
	//win.ej[0] = 1000; 		//1000 or -1000 - grups 0 pos z
	//win.ej[1] = 1; 			//back or front 1 or -1
	//win.ej[2] = Math.PI;	//Math.PI or 0	

//	if (win.ej[0] == 1000) {
	if (win.ej[2] != 0) {
		win.ej[0] = 0; 			//1000 or 0 - grups 0 pos z
		win.ej[1] = -1; 		//back or front 1 or -1
		win.ej[2] = 0;			//Math.PI or 0	
		win.ej[3] = 1000;		//0	or 1000
	} else {
		win.ej[0] = 1000; 		//1000 or -1000 - grups 0 pos z
		win.ej[1] = 1; 			//back or front 1 or -1
		win.ej[2] = Math.PI;	//Math.PI or 0	
		win.ej[3] = 0;			//0	or 1000	
	}
	
	x.char1.rotation.y = win.ej[2]; 
	
	win.idleTimer = 0; 
}

function audClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();

//	clickTap(); 
	
	if (x.sound) {
		//x.sound.isPlaying ? x.sound.pause() : x.sound.play(); 
		if (x.sound.isPlaying) {
			ui.offAud.classList.add('noneIt2'); 						
			ui.onAud.classList.remove('noneIt2'); 

			x.sound.pause(); 
			//console.log('pause');
		} else {
			ui.onAud.classList.add('noneIt2'); 
			ui.offAud.classList.remove('noneIt2'); 

			x.sound.play(); 
			//console.log('play');
		}
	} else {
		//console.log('aud');
		addAud(); 
	}

	win.idleTimer = 0; 
}


/*
function optionsUI() {
	ui.options = document.createElement("div");                 
	ui.options.setAttribute("id", "options");
	//ui.options.id = "options"; 
	//ui.options.innerHTML = "ENTER";  
	ui.options.style.display = "block"; 
	ui.options.style.position = "absolute";
	ui.options.style.margin = "auto";					
	ui.options.style.right = "1%"; 
	ui.options.style.bottom = ui.options.style.left = ui.options.style.top = "0"; 
	ui.options.style.width = "auto";
	ui.options.style.height = "auto";
	ui.options.style.textAlign = "right"; 
	ui.options.style.background = "transparent";
	ui.options.style.border = "0";
	//ui.options.style.cursor = "pointer"; 
    
	//kontainer.addEventListener( 'click', kontainerClck, false ); 
	ui.kontainer.appendChild(ui.options); 				
	
}
*/
	
function addFloor() {
	x.floor = []; 
	
	//let width = 1200, 
	let width = 1000, 
		//height = 602, 
		height = 1001,  
		posX = 0, 
		rez = 96,  
		intrvl = 400, 
		kolor = 0xcdcdcd; 
		
	let geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	//let geometry = new THREE.PlaneGeometry( width, height );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .3, metalness: 0.1 } );
	//material.flatShading = true; 
	//material.wireframe = true; 
	
	for ( let i = 0; i < 3; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
		let pozZ = -(height-1) + (height-1)*i; 
	
		x.floor[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);
		x.floor[i].position.set(0, florY, pozZ);
		//x.floor[i].position.set(0, florY, 0);
		x.floor[i].rotation.x = Math.PI*-.5;
		x.floor[i].castShadow = true; 
		x.floor[i].receiveShadow = true; 
		
		/*if (i == 1) {
			grup1.add( x.floor[i] );
		} else {
			grup2.add( x.floor[i] );
		}*/		

		/*if (i == 2) {
			grups[2].add( x.floor[i] ); 
		} else {
			grups[i].add( x.floor[i] ); 
		}*/
		
		grups[0].add( x.floor[i] ); 
	//	grups[i].add( x.floor[i] ); 
	//	grups[i].position.z = pozZ; 
		
		//x.spotLight[i].target = x.floor[i];	
	}

	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	loader.load( 'img/spacew/terr1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx.repeat.set(4, 4);    
		
		for ( let j = 0; j < 3; j++ ) {	
			x.floor[j].material.map = tx; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx2; 
			//x.floor[j].material.roughnessMap = tx; 
			x.floor[j].material.displacementScale = 60; 
			x.floor[j].material.displacementBias = -5; 
			x.floor[j].material.displacementMap = tx;			
			x.floor[j].material.needsUpdate = true;
			//x.floor[j].visible = true; 
		}
	});  		

	loader2.load( 'img/spacew/terr1r.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(2, 2);    
		
		for ( let k = 0; k < 3; k++ ) {	
			x.floor[k].material.roughnessMap = tx2; 
			x.floor[k].material.needsUpdate = true;
			//x.floor[k].visible = true; 
		}
	});  		

	loader3.load( 'img/spacew/terr1b.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(2, 2);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 3; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			x.floor[l].material.bumpScale = 25.; 
			x.floor[l].material.bumpMap = tx3; 
			//x.floor[l].material.displacementScale = 10; 
			//x.floor[l].material.displacementBias = -5; 
			//x.floor[l].material.displacementMap = tx3; 
			//x.floor[l].material.roughnessMap = tx3; 
			x.floor[l].material.needsUpdate = true;
		}
	});	

/*	
	loader4.load( 'img/spacew/test1.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx4.repeat.set(4, 4);    
		
		for ( let m = 0; m < 3; m++ ) {	
			x.floor[m].material.displacementScale = 60; 
			x.floor[m].material.displacementBias = -5; 
			x.floor[m].material.displacementMap = tx4;
			x.floor[m].material.needsUpdate = true;
			//x.floor[m].visible = true; 
		}
	});  	
*/
	
	scene.add(grups[0]); 	

}

function addWormhole() {
	//let meshCount = 0; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/spacew/wh1.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeBoundingBox();		
				
			//	child.castShadow = true; 
			//	child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		x.wormhole = object; 
		x.wormhole.position.set(0, 400, 0); 
		x.wormhole.rotation.set(Math.PI/3, 0, 0); 
		x.wormhole.scale.set(550, 550, 550); 
		
		const material = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		//const material = new THREE.MeshPhongMaterial( { color: 0xffffff, transparent: true, fog: false } );	
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive = 0xffffff; 
		x.wormhole.children[0].material = material; 
		//console.log(x.wormhole.children[0].material); 
		
		x.wormhole.visible = false; 
		
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();  
			//load3 = new THREE.TextureLoader(); 
			
		load1.load( 'obj/spacew/mat/wormholec.jpg', function(tx) { 
			x.wormhole.children[0].material.map = tx; 
			//x.wormhole.children[0].material.emissiveIntensity = 10; 
			//x.wormhole.children[0].material.emissiveMap = tx; 
			x.wormhole.children[0].material.lightMap = tx; 
				
			x.wormhole.children[0].material.needsUpdate = true; 
			
			x.wormhole.visible = true; 
		}); 		

		load2.load( 'obj/spacew/mat/wormholea.png', function(tx2) { 
			x.wormhole.children[0].material.alphaMap = tx2; 
				
			x.wormhole.children[0].material.needsUpdate = true; 
		}); 		
		
		scene.add(x.wormhole); 
	}); 
	
	addStars(); 
}

function addStars() {
	const geometry = new THREE.BufferGeometry();
	const vertices = [];

	for ( let i = 0; i < 800; i ++ ) {

		const x = 11000 * Math.random() - 5500;
		const y = 3750 * Math.random() - 450;
		const z = -1500 * Math.random() - 1500;
		//const z = i;

		vertices.push( x, y, z );

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	var material = new THREE.PointsMaterial( { color: 0xffffff, size: 20, sizeAttenuation: true, transparent: true, depthWrite: false, depthTest: true, fog: false } );
	//material.color.setHSL( 1.0, .4, .9 );
	//material.opacity = .6;
	
	x.bitwin = new THREE.Points( geometry, material );
	//mesh.bitwin.position.set(0, 0, 300); 	
	scene.add( x.bitwin );	
	
	var	loader = new THREE.TextureLoader(); 
	loader.load( 'img/spacew/bitwin1.png', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    
		
		x.bitwin.material.map = tx; 
		x.bitwin.material.needsUpdate = true;
		//mesh.bitwin.visible = true; 
	});  			
}

/*
const randomizeMatrix = function () {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();

	return function ( matrix ) {
		let posx = (Math.random() * 1140 - 570); 
		
	//	if ((posx > -30) && (posx < 30)) {
		if ((posx > -33) && (posx < 33)) {
			let rnd = Math.random() < 0.5 ? -1 : 1;
			//posx = 34 * rnd; 
			posx = 35 * rnd; 
			//console.log(posx);
		}
		
		position.x = posx;
	//	position.y = (Math.random() * 20 - 15);
		position.y = (Math.random() * 15 - 15);
		position.z = (Math.random() * 580 - 290);

		rotation.x = Math.PI/-2; 
		//rotation.x = Math.random() * 2 * Math.PI;
		//rotation.y = Math.random() * 2 * Math.PI;
	//	rotation.y = (Math.random() * .04 - .02) * Math.PI;
		rotation.y = (Math.random() * .02 - .01) * Math.PI;
		rotation.z = Math.random() * 2 * Math.PI;

		quaternion.setFromEuler( rotation );

		//scale.x = scale.y = scale.z = 2500 - Math.random() * 400;
	//	scale.x = scale.y = scale.z = 14 - Math.random() * 4;
		scale.x = scale.y = scale.z = 42 - Math.random() * 7;

		matrix.compose( position, quaternion, scale );
	};
}(); 
*/

function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
        let val = parseFloat(ui.kontainer.style.opacity); 
        if (!((val += .1) > 1.0)) {
            ui.kontainer.style.opacity = val; 
			//console.log(ui.kontainer.style.opacity); 			
            
			requestAnimationFrame(fadeIn); 
        } else {
            ui.kontainer.style.opacity = 1.0; 
			
			onWindowResize(); 			
			
		//	entro(); 
			
			if (isMobil) {
				//ui.kontainer.addEventListener( 'touchstart', onMouseMove2, false );
				//ui.kontainer.addEventListener( 'touchmove', onMouseMove2, false );		
				
				//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
				ui.kontainer.addEventListener( 'touchstart', onDocumentTouchStart, false );
				ui.kontainer.addEventListener( 'touchmove', onDocumentTouchMove, false );
				
				//ui.kontainer.addEventListener('touchend', onDocumentTouchEnd, false);  
			} else {
				ui.kontainer.addEventListener('mousemove', onMouseMove, false);
				
				ui.kontainer.addEventListener('click', kontainerClick, false);  
				//ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
			}				
			
			ui.kontainer.addEventListener('pointermove', onMouseMove, false);
			
			//ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
			ui.kontainer.addEventListener("wheel", wheelE, false);			
			
			animate();  
			
			theIntro(); 
			
		//	animWalk(); 
			//animWalk2(); 
			
			theOptions(); 
        }
    })();	
}	


function animWalk() {
 //   (function walkIn() {
		let z0 = grups[0].position.z,   
			z1 = x.wormhole.rotation.y; 
			//z1 = grups[1].position.z, 
			//z2 = grups[2].position.z; 
			//console.log(z1);
			
		//if (z0 == 1000) {
		if (z0 == win.ej[0]) {
			//grups[0].position.z = 0; 
			grups[0].position.z = win.ej[3]; 
		} else {
			//grups[0].position.z = z0 + 1; 		
			
			grups[0].position.z = z0 + win.ej[1]; 
		}
		
		x.wormhole.rotation.y = (z1 < 6.28) ? (z1 + .004) : 0;  
		
	/*	
		if (z1 == win.ej[0]) {
			grups[1].position.z = win.ej[2]; 
		} else {
			grups[1].position.z = z1 + win.ej[1]; 
		}
		
		if (z2 == win.ej[0]) {
			grups[2].position.z = win.ej[2]; 
		} else {
			grups[2].position.z = z2 + win.ej[1]; 
		}
	*/	
			
		//if (z1 < win.ej[]) {
			//grups[1].position.z = z1 + win.ej[1]; 
		//} else {
			//grups[1].position.z = win.ej[2]; 
		//}					

		//if (z2 < win.ej[]) {
			//grups[2].position.z = z2 + win.ej[1]; 
		//} else {
			//grups[2].position.z = win.ej[2]; 
		//}					
		
//		requestAnimationFrame(walkIn);					
//    })();	
}

/*
function animWalk2() {
    (function walkIn2() {
		let z0 = x.char1.position.z, 
			z1 = camera.position.z; 
			
		if (z0 == win.ej[2]) {
			x.char1.position.z = win.ej[0]; 
			camera.position.z = win.ej[1]; 
		} else {
			x.char1.position.z = z0 + win.ej[3]; 
			camera.position.z = z1 + win.ej[3]; 
		}
		
		requestAnimationFrame(walkIn2);					
    })();	
}
*/
	
/*	
function clickTap() {
	if (ui.tempDiv) {
		//console.log(ui.tempDiv); 
			
		ui.tempDiv.parentNode.removeChild(noAud);	
		ui.tempDiv = undefined; 
		
		addAud(); 
	
		if (!isMobil) document.removeEventListener( 'keyup', clickTap, false );  	
		
		//win.navbars.visible = true; 
	}
	
	//container.removeEventListener( 'click', containerClick, false ); 
	
}
*/
	
function onMouseMove( event ) {
    if (event) event.preventDefault();

	//win.mXr = mouseX; 
	
	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointer.x = ( event.clientX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	mouseY -= 50; 	
	
	win.idleTimer = 0; 
}

function onMouseWheel( event ) {
    event.preventDefault();
    //event.stopPropagation();                

    win.idleTimer = 0;
}	

function wheelE( event ) {
    event.preventDefault();
    //event.stopPropagation(); 

	//console.log(camera.position.z);
    
	//let camZ = camera.position.z; 
	//console.log(camZ);
	
/*	
	x.prevCamZ = camera.position.z; 
	//x.prevCharZ = x.char1.position.z; 
	camera.position.z += event.deltaY * .1; 	
	
	//console.log(x.prevCamZ);
	//console.log(x.prevCharZ);
	
	//if ((camera.position.z < 1120) || (camera.position.z > 1240)) camera.position.z = x.prevCamZ; 
	//if ((camera.position.z < 1720) || (camera.position.z > 1840)) camera.position.z = x.prevCamZ; 
	if ((camera.position.z < 2320) || (camera.position.z > 2440)) camera.position.z = x.prevCamZ; 
*/
	
	/*if ((camZ >= 1095) && (camZ <= 1280)) {
		x.prevCamZ = camera.position.z; 
		camera.position.z += event.deltaY * .1; 
	} else {
		camera.position.z = x.prevCamZ; 
	}*/
	
	win.idleTimer = 0;
}	

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
	//	event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH; 
		
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;			
		
	//	clickTap(); 
		
		win.idleTimer = 0; 
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
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;		
	
	//	clickTap(); 
	
		//document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		//document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
		ui.kontainer.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		ui.kontainer.removeEventListener( 'touchend', onDocumentTouchEnd, false );
	
		win.idleTimer = 0; 	
	}
}

function kontainerClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();

//	clickTap(); 
	
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
	
	if (isMobil) {
		win.cr[1] = -.0006; 
		win.cr[0] = .0004; 
	} else {
	//	win.cr[1] = -.0004; 
		win.cr[1] = -.00024; 
		win.cr[0] = .00048; 		
	}
	
	if (win.width > win.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((win.width+win.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((win.width+win.height)/2)*0.028+'px';
	}		
	
	win.idleTimer = 0; 
}


function animate() { 
    requestAnimationFrame(animate);

	if (win.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.004;
	
	//	const delta = clock.getDelta() * .7;
	//	const delta = clock.getDelta() * .7;
		
		//console.log(timer); 
		
		//if ( mixer ) mixer.update( delta );	
	//	if ( mixer ) mixer.update( .0116 );	
	//	if (win.inCtr > 200) mixer.update( .0116 );	
		mixer.update( win.ej[4] );	
		
		/*
				// Get the time elapsed since the last frame

				const mixerUpdateDelta = clock.getDelta();

				// Update all the animation frames

				for ( let i = 0; i < mixers.length; ++ i ) {

					mixers[ i ].update( mixerUpdateDelta *.4);
					//console.log(mixers.length);

				}
		*/		
		
		animWalk(); 
		
		//camera.position.x = Math.cos(win.idleTimer*5) * 3.5; 
		//camera.position.y = Math.sin(win.idleTimer*10) * 5 - 35; 
		camera.position.x = (Math.cos(timer*1) * 3.5) * win.ej[1]; 
		camera.position.y = (Math.sin(timer*2) * 5) * win.ej[1] - win.ej[5]; 
	//	camera.position.y = (Math.sin(timer*2) * 5) * win.ej[1] - 35; 
		//camera.position.z = Math.sin(timer) * 20 + 1350; 		
		
		win.idleTimer += 0.01; 
		
		render();
	} else {
		if (clock.running) clock.stop(); 
		
		if (x.sound) {
			if (x.sound.isPlaying) x.sound.pause(); 
		}
	}
	
	if (document.hasFocus()) {
		if (!win.fokus) {
			win.idleTimer = 0; 
			win.fokus = true; 
			
			if (x.sound) {
				if (!x.sound.isPlaying) x.sound.play(); 
			}
		}
	} else {
		win.idleTimer = idleTO; 	
		win.fokus = false; 
		
		if (x.sound) {
			if (x.sound.isPlaying) x.sound.pause(); 
		}
	}	
	
//	TWEEN.update();	
}

function render() {
	//camera.lookAt(scene.position); 	
	//camera.lookAt(0, 10000, 0); 	
	
//	controls.update(); 
	
	//x.spotLight.target = camera;		
	//x.spotLightHelper.update();
	
	//camera.rotation.y = ( mouseX - camera.position.x ) * -.0006;
	camera.rotation.y = ( mouseX - camera.position.x ) * win.cr[1];
	camera.rotation.x = ( -mouseY - camera.position.y ) * win.cr[0];	
	
	//camera.position.x = mouseX * .05;
	//camera.position.y = (mouseY * .1) - (mouseY * .05);
	
	renderer.render( scene, camera );	
}

function animFBX() {
	let url = 'spacew/astro1';  
	//let url = 'haztez/haztez';  
	
	url += '.fbx'; 
	
	let meshCount = 0; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry.name);
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
				//if (meshCount == 17) child.add(camera);	
				
			//	meshCount += 1; 
			}
		} );	
		
		//console.log(object.children[0].material); 
		//console.log(meshCount); 
		
		x.char1 = object; 
		
		let matr = [];  
			//url2 = 'obj/teenb1/mat/', 
		const url2 = 'obj/spacew/mat/', 
			  frm = 'jpg', 
			  kolors = [0xffffff, 0xffffff, 0xbbbbbb, 0xbbbbbb, 0x999999, 0xa1a1a1, 0xa1a1a1, 0xfff8ea, 0xaaaabb, 0x333333, 
				    	0xccbb77, 0xccbb77, 0x333333, 0x333333, 0xccbb77, 0xccbb77, 0x333333, 0xdddddd, 0xaaaabb]; 	
		
		for ( let i = 0; i < 2; i++ ) {	
		//for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
		//	matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: .1 } );
			
			//if (i!=17) {
			if (i==0) {
				//matr[i] = new THREE.MeshPhongMaterial( { color: kolors[i], shininess: 100, specular: 0xffffff } );
				matr[i] = new THREE.MeshStandardMaterial( { color: kolors[i], roughness: 0, metalness: .65 } );
			} else {
				//matr[i] = new THREE.MeshMatcapMaterial( { color: 0x888888, transparent: true, opacity: .55 } );
				matr[i] = new THREE.MeshStandardMaterial( { color: kolors[i], roughness: .4, metalness: .2 } );
			}
			
		//	x.char1.children[i].material = matr[i]; 
			//x.char1.children[0].material[i] = matr[i]; 
			
			//matr[i].dithering = true; 
		
			
		}

	//	x.char1.children[0].material = matr; 
		x.char1.children[0].material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, metalness: .2 } ); 
		
		//console.log(x.char1.children);
	
		//x.char1.frustumCulled = false;
		
		
		//let xxx = 7; 
		//x.char1.children[xxx].material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .6, metalness: .1 } ); 
		
		//x.char1 = new THREE.Mesh( object.children[0].geometry, matr ); 
		
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(); 
			
			
		load1.load( url2 + 'astrod.' + frm, function(tx) { 	
			//for ( let j = 0; j < meshCount; j++ ) {	
		//	for ( let j = 0; j < 2; j++ ) {	
			//	matr[j].map = tx; 
				x.char1.children[0].material.map = tx; 
				//x.char1.children[0].material.roughnessMap = tx; 
				//matr[j].bumpScale = 1; 
				//matr[j].bumpMap = tx; 
				//matr[j].metalMap = tx; 
				//material.normalScale.set(-1, -1); 
				//material.normalMap = tx2; 
				//matr[j].roughnessMap = tx; 
				x.char1.children[0].material.needsUpdate = true;
			//	matr[j].needsUpdate = true;
		//	}
		});  			

		load2.load( url2 + 'astror.' + frm, function(tx2) { 	
			x.char1.children[0].material.roughnessMap = tx2; 
			x.char1.children[0].material.needsUpdate = true;
		});  			
	
		x.char1.scale.set(35, 35, 35); 
	//	x.char1.scale.set(3.5, 3.5, 3.5); 
		//x.char1.scale.set(.44, .44, .44); 
		x.char1.position.set(0, florY+0, 1150); 
		//x.char1.position.set(0, florY, 1150); 
	//	x.char1.rotation.set(0, win.ej[2], 0);	
		x.char1.rotation.set(0, Math.PI, 0);	
		
		scene.add( x.char1 ); 
		
	
		x.spotLight[0].target = x.char1;
		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	//let url = 'spacew/sit1'; 	//mono
	//let url = 'spacew/getup1'; 	//mono
	let url = 'spacew/jog1'; 	//mono
	//let url = 'haztez/walking'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
	//	x.actions[0].play(); 
		
		//x.actions[0].setLoop(THREE.LoopOnce);
		//x.actions[0].setLoop(THREE.LoopRepeat);
		//x.actions[0].setLoop(THREE.LoopPingPong);
		
		//mixer.update( 1 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		anim8B(); 
		
	//	fadeScene(); 	
	} );

}

function anim8B() {
	//x.actions = []; 
	
	//let url = 'teenb1/walkswag'; 	//mono
	//let url = 'haztez/nervouslook'; 	//mono
	let url = 'spacew/getup1'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	loader.load( 'obj/' + url, function ( object ) {	

		//mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[1] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[1].play(); 
		
		x.actions[1].setLoop(THREE.LoopOnce);
		
	//	mixer.update( 0 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}

function theIntro() {
	win.inCtr = 0; 

    (function introIn() {
        let val = parseInt(win.inCtr); 
		
        if (!((val += 1) > 470)) {

			//win.ej[5] -= .0875;  
			win.ej[5] -= .0854;  
			
			if (val == 200) win.ej[4] = .0116; 
			
			if (val == 400) x.actions[0].play(); 
			
			if (val == 410) {
				swtchKamClick2(); 
				ui.swtchKam.style.visibility = "visible"; 
				
				win.ej[5] = 35; 
			}
							
			if (val == 460) x.actions[1].stop(); 
		
			win.inCtr = val; 
			//console.log(win.inCtr); 			
            
			requestAnimationFrame(introIn); 
        }
		// else {

        //}
    })();	
}	

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'bragernesasen-18874'; 	
		//let url = 'bird-voices-7716'; 	
		//let url = 'believe-in-miracle-by-prabajithk-121041'; 	
		//let url = 'calm-and-peaceful-115481'; 	
		//let url = 'cancion-triste-1502'; 	
		//let url = 'step_soundwav-14903'; 
		//let url = 'factory-fluorescent-light-buzz-6871'; 
		//let url = 'embrace-of-the-mist-192897'; 
		//let url = 'analog-dreams-synthwave-9497';
		//let url = 'frst1'; 	
		//let url = 'tbckrms2'; 	
		//let url = 'cosmic-glow-6703'; 	
		//let url = 'meditative-background-music-space-travel-153309'; 	
		let url = 'csmcglw'; 	
		url += '.mp3'; 	
		
		// create an AudioListener and add it to the camera
		const listener = new THREE.AudioListener();
		camera.add( listener );
		
		// create a global audio source
		//const sound = new THREE.Audio( listener );
		x.sound = new THREE.Audio( listener );
		
		// load a sound and set it as the Audio object's buffer
		const audioLoader = new THREE.AudioLoader();
		
		audioLoader.load( 'aud/' + url, function( buffer ) {
		
			x.sound.setBuffer( buffer );
			x.sound.setLoop( true );
			//x.sound.setVolume( 0.4 );
			x.sound.setVolume( 0.8 ); 
			x.sound.play(); 
			//console.log('music'); 
			
			ui.onAud.classList.add('noneIt2'); 
			ui.offAud.classList.remove('noneIt2'); 			
		}); 
	
	}
	
}




	