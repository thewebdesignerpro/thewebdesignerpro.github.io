/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import WEBGL from 'three/addons/WebGL.js'; 
import WEBGL from 'three/addons/capabilities/WebGL.js'; 
//import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { TWEEN } from 'three/addons/tween.module.min.js'; 
//import TWEEN from 'three/addons/tween.module.js';
import TWEEN from 'three/addons/libs/tween.module.js';
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
	win.ej[0] = 950;		//950 or 150
	win.ej[1] = 1150;		//1150 or 350
	win.ej[2] = 150; 		//150 or 950
	win.ej[3] = -1; 		//back or front -1 or 1
	win.ej[4] = Math.PI;	//Math.PI or 0	
	
	
	
	//const fogCol = 0x2e3032; 
	const fogCol = 0x000000; 
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	//renderer.setClearColor(0x777777, 1.0); 
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.outputEncoding = THREE.sRGBEncoding; 
//	renderer.outputColorSpace = THREE.SRGBColorSpace; 
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
	//scene.fog = new THREE.FogExp2(0x2e3032, 0.0037);	
	scene.fog = new THREE.FogExp2(fogCol, 0.001);	
	//scene.fog = new THREE.FogExp2(0x2e3032, 0.001);	
	//scene.fog.density = 0.0037;
	
	camera = new THREE.PerspectiveCamera( 45, win.width / win.height, 1, 10000 );
	//camera.position.set(9, -25, 1144);
	//camera.position.set(0, -25, 1700);
	//camera.position.set(0, -25, 2300);
//	camera.position.set(0, -35, 2350); 
//	camera.position.set(0, -35, 1150); 
//	camera.position.set(0, -35, win.ej[5]); 
	camera.position.set(0, -35, win.ej[1]); 
	//camera.position.set(0, -35, 2400);
	//camera.lookAt( 0, 0, 0 );

    scene.add(camera);	
	
	//let aLight = new THREE.AmbientLight( 0x777777 ); 
	//scene.add( aLight );		
	scene.add( new THREE.AmbientLight( 0x303030 ) );		

	x.spotLight = []; 
	
	//x.spotLight = new THREE.SpotLight( 0xffffff, 10, 0, Math.PI/2, 0 );
//	x.spotLight = new THREE.SpotLight( 0xffffff, 3, 420, Math.PI/4, 1 );
//	x.spotLight = new THREE.SpotLight( 0xffffff, 680000, 450, Math.PI/4, 1 );
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 100000, 470, Math.PI/2.5, 1 );
	//x.spotLight = new THREE.SpotLight( 0xffffff, 30, 2000, Math.PI/4, 1 );
	//x.spotLight.position.set( 0, 400+florY, 1060 );
//	x.spotLight.position.set( 0, 400+florY, 1600 );
	//x.spotLight.position.set( 0, ceilY+1, 1600 );
//	x.spotLight.position.set( 0, ceilY+35, 2200 );
	x.spotLight[0].position.set( 0, ceilY+56, 0 );
	//x.spotLight.position.set( 0, 1000+florY, -100 );
//	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight.shadow.mapSize.width = 1024;
	//x.spotLight.shadow.mapSize.height = 1024;
//	x.spotLight[0].shadow.camera.near = 10;
//	x.spotLight[0].shadow.camera.far = 500;
//	x.spotLight[0].shadow.camera.fov = 30;
	//x.spotLight.shadow.focus = 1; 
	//x.spotLight.shadowDarkness = 1.; 
	//scene.add( x.spotLight );	
	
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
	x.spotLight[0].shadow.camera.far = x.spotLight[1].shadow.camera.far = x.spotLight[2].shadow.camera.far = 500; 
	x.spotLight[0].shadow.camera.fov = x.spotLight[1].shadow.camera.fov = x.spotLight[2].shadow.camera.fov = 30; 	
	
	//x.spotLight.power = 1000;
	
	//x.spotLight.position.set( 0, 400+florY, 1060 );
	//x.spotLight.target = x.char1;		
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight );
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
	grups[1] = new THREE.Group(); 
	grups[2] = new THREE.Group(); 
	
	grups[0].add( x.spotLight[0] );	
	grups[1].add( x.spotLight[1] );	
	grups[2].add( x.spotLight[2] );	
	
	addFloor();
	addCeiling();
	addWalls();
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

function theOptions() {
	ui.swtchKam = document.getElementById('swtchKam'); 
	ui.onAud = document.getElementById('onAud'); 
	ui.offAud = document.getElementById('offAud'); 
	
	if (isMobil) {
		ui.swtchKam.addEventListener( 'touchstart', swtchKamClick, false );
		ui.onAud.addEventListener( 'touchstart', audClick, false );
		ui.offAud.addEventListener( 'touchstart', audClick, false );

	} else {
		ui.swtchKam.addEventListener('click', swtchKamClick, false);  
		ui.onAud.addEventListener('click', audClick, false);  
		ui.offAud.addEventListener('click', audClick, false);  
	}		
}

function swtchKamClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();

//	clickTap(); 

	if (win.ej[0] == 950) {
		win.ej[0] = 150;		//950 or 150
		win.ej[1] = 350;		//1150 or 350
		win.ej[2] = 950; 		//150 or 950
		win.ej[3] = 1; 			//back or front -1 or 1
		win.ej[4] = 0;			//Math.PI or 0			
	} else {
		win.ej[0] = 950;		//950 or 150
		win.ej[1] = 1150;		//1150 or 350
		win.ej[2] = 150; 		//150 or 950
		win.ej[3] = -1; 		//back or front -1 or 1
		win.ej[4] = Math.PI;	//Math.PI or 0	
	}
	
	x.char1.rotation.y = win.ej[4]; 
	
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
	let width = 800, 
		//height = 602, 
		height = 801,  
		posX = 0, 
		//intrvl = 300; 
		intrvl = 400, 
		kolor = 0xfdddcd; 
		
//	let geometry = new THREE.PlaneGeometry( width, height, 32, 32 );
	let geometry = new THREE.PlaneGeometry( width, height );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .5, metalness: 0 } );
	
	for ( let i = 0; i < 3; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
		let pozZ = -(height-1) + (height-1)*i; 
	
		x.floor[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);
		//x.floor[i].position.set(0, florY, pozZ);
		x.floor[i].position.set(0, florY, 0);
		x.floor[i].rotation.x = Math.PI*-.5;
		//x.floor[i].castShadow = true; 
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
		
		grups[i].add( x.floor[i] ); 
		grups[i].position.z = pozZ; 
		
		x.spotLight[i].target = x.floor[i];	
	}

	var	loader = new THREE.TextureLoader(), 
		//loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader();  
		//loader4 = new THREE.TextureLoader();

	loader.load( 'img/bakrum/carpetc.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 2);    
		//tx.repeat.set(10, 5);    
		tx.repeat.set(20, 20);    
		
		for ( let j = 0; j < 3; j++ ) {	
			x.floor[j].material.map = tx; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx2; 
			//x.floor[j].material.roughnessMap = tx; 
			x.floor[j].material.needsUpdate = true;
			//x.floor[j].visible = true; 
		}
	});  		

	loader3.load( 'img/bakrum/carpetd.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		//tx3.repeat.set(4, 2);    
		tx3.repeat.set(20, 20);    
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
	
	//grup1.position.z = intrvl*3; 
	//grups[0].position.z = intrvl; 
	//grups[1].position.z = intrvl*3; 
	//grups[2].position.z = intrvl*5; 

	//scene.add(grup1); 
	//scene.add(grup2); 	
	
	//scene.add(grups[0]); 	
	//scene.add(grups[1]); 	
	//scene.add(grups[2]); 	
	
	//x.spotLight.target = x.floor[0];	
	
	/*
	const fogCol = 0x2e3032; 
	
//	scene.fog.color.set(0x7a8288); 
	scene.fog.color.set(fogCol); 
//	scene.fog.density = 0.003; 
	scene.fog.density = 0.0037; 
	
	x.spotLight.intensity = 93; 	
	x.spotLight.angle = Math.PI/4; 	
	//x.spotLight.angle = Math.PI/2; 	
	x.spotLight.penumbra = 1; 	
//	x.spotLight.position.z = 1000; 
	x.spotLight.position.z = 1060; 
//	camera.position.set(0, -40, 1240);
	camera.position.set(9, -25, 1144);
	
//	renderer.setClearColor(0x7a8288, 1.0); 
	renderer.setClearColor(fogCol, 1.0); 	
	*/
}

function addCeiling() {
	x.ceiling = []; 
	
	//let width = 1200, 
	let width = 800, 
		//height = 601,  
		height = 801,  
		posX = 0, 
		//intrvl = 300; 
		intrvl = 400; 
		
	let geometry = new THREE.PlaneGeometry( width, height );

	//let material = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0xffffff, roughness: .25, metalness: .15 } );
	let material = new THREE.MeshStandardMaterial( { color: 0x777777, roughness: .3, metalness: .15, side: THREE.BackSide } );
	
	for ( let i = 0; i < 3; i++ ) {	
	//	let pozZ = height*i + intrvl - (i*1); 
		let pozZ = -(height-1) + (height-1)*i; 
	
		x.ceiling[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);

		x.ceiling[i].position.set(0, ceilY, 0);
		x.ceiling[i].rotation.x = Math.PI*-.5;
		//x.floor[i].castShadow = true; 
		x.ceiling[i].receiveShadow = true; 
		
		grups[i].add( x.ceiling[i] ); 
		grups[i].position.z = pozZ; 
	}

	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(); 
		//loader4 = new THREE.TextureLoader();

	loader.load( 'img/bakrum/ceilingc2.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.offset.set(1, 1);    
		//tx.repeat.set(2, 1);    
		//tx.repeat.set(1, 1);    
		//tx.repeat.set(.854, .427);    
		//tx.flipY = true;
		
		for ( let j = 0; j < 3; j++ ) {	
			x.ceiling[j].material.map = tx; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx2; 
			//x.floor[j].material.roughnessMap = tx; 
			x.ceiling[j].material.needsUpdate = true;
			//x.ceiling[j].visible = true; 
		}
	});  		
	
	loader2.load( 'img/bakrum/ceilinge2.jpg', function(tx2) { 	
		//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		//tx2.offset.set(1, 1);    
		//tx2.repeat.set(1, 1);  
		//tx2.repeat.set(1.858, .929);  
		//tx2.repeat.set(.854, .427);  
		//tx2.flipY = true;
		
		for ( let k = 0; k < 3; k++ ) {	
			//x.floor[k].material.aoMapIntensity = 1; 
			//x.floor[k].material.aoMap = tx2; 			
			//x.ceiling[k].material.emissive.set(0x333333); 
			//x.ceiling[k].material.emissive.set(0xffffff); 
			//x.ceiling[k].material.emissiveIntensity = 1.5; 
			//x.ceiling[k].material.emissiveIntensity = 1.; 
			//x.ceiling[k].material.emissiveMap = tx2; 
			x.ceiling[k].material.lightMapIntensity = 14; 
			x.ceiling[k].material.lightMap = tx2; 
			//x.ceiling[k].material.bumpScale = 15.; 
			//x.ceiling[k].material.bumpMap = tx2; 
			//x.floor[k].material.displacementScale = 10; 
			//x.floor[k].material.displacementBias = -5; 
			//x.floor[k].material.displacementMap = tx2; 
			//x.floor[k].material.roughnessMap = tx2; 
			x.ceiling[k].material.needsUpdate = true;
		}
	});		

	loader3.load( 'img/bakrum/ceilingd.jpg', function(tx3) { 	
		//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		//tx3.offset.set(1, 1);    
		//tx3.repeat.set(1, 1);    
		//tx3.repeat.set(.854, .427);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 3; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			x.ceiling[l].material.bumpScale = -17.; 
			x.ceiling[l].material.bumpMap = tx3; 
			//x.floor[l].material.displacementScale = 10; 
			//x.floor[l].material.displacementBias = -5; 
			//x.floor[l].material.displacementMap = tx3; 
			//x.floor[l].material.roughnessMap = tx3; 
			x.ceiling[l].material.needsUpdate = true;
		}
	});	
	
	/*
	loader4.load( 'img/bakrum/OfficeCeiling002_2K-JPG_AmbientOcclusion.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		//tx3.offset.set(1, 1);    
		tx4.repeat.set(1, 1);    
		//tx3.repeat.set(.854, .427);    
		//tx3.flipY = true;
		
		for ( let m = 0; m < 3; m++ ) {	
			x.ceiling[m].material.aoMapIntensity = 100; 
			x.ceiling[m].material.aoMap = tx4; 
			//x.ceiling[m].material.bumpScale = 10.; 
			//x.ceiling[m].material.bumpMap = tx4; 
			//x.floor[m].material.displacementScale = 10; 
			//x.floor[m].material.displacementBias = -5; 
			//x.floor[m].material.displacementMap = tx3; 
			//x.floor[m].material.roughnessMap = tx3; 
			x.ceiling[m].material.needsUpdate = true;
		}
	});	
	*/
	
	//scene.add(grups[0]); 	
	//scene.add(grups[1]); 	
	//scene.add(grups[2]); 	
	
	//x.spotLight.target = x.floor[0];	
	
}

function addWalls() {
	x.walls = []; 
	
	const width = 700, 
		  height = ceilY - florY,  
		  posY = ceilY - (height/2), 
		  intrvl = 350, 
		  hallW = 240, 
		  hallW2 = 280, 
		  width2 = hallW2, 
		  //height2 = height, 		
		  kolor = 0xeee9b0; 
		
	let geometry = new THREE.PlaneGeometry( width, height );
	let geometry2 = new THREE.PlaneGeometry( width2, height );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .2, metalness: 0 } );
	
	for ( let i = 0; i < 12; i+=4 ) {	
		//let pozZ = height*i + intrvl - (i*1); 
		
		x.walls[i] = new THREE.Mesh( geometry, material ); 
		x.walls[i+1] = new THREE.Mesh( geometry, material ); 
		x.walls[i+2] = new THREE.Mesh( geometry2, material ); 
		x.walls[i+3] = new THREE.Mesh( geometry2, material ); 
		
		//console.log(pozZ);
		x.walls[i].position.set(-hallW/2, posY, 0);
		x.walls[i+1].position.set(hallW/2, posY, 0);
		x.walls[i+2].position.set(-hallW/2 - hallW2/2, posY, intrvl);
		x.walls[i+3].position.set(hallW/2 + hallW2/2, posY, intrvl);
		x.walls[i].rotation.y = Math.PI*.5;
		x.walls[i+1].rotation.y = Math.PI*-.5;
		//x.walls[i+2].rotation.y = Math.PI*-.5;
		//x.walls[i+3].rotation.y = Math.PI*-.5;
		//x.walls[i].castShadow = x.walls[i+1].castShadow = x.walls[i+2].castShadow = x.walls[i+3].castShadow = true; 
		//x.walls[i+1].castShadow = true; 
		x.walls[i].receiveShadow = x.walls[i+1].receiveShadow = x.walls[i+2].receiveShadow = x.walls[i+3].receiveShadow = true; 
		//x.walls[i+1].receiveShadow = true; 
		
		grups[i/4].add( x.walls[i] ); 
		grups[i/4].add( x.walls[i+1] ); 
		grups[i/4].add( x.walls[i+2] ); 
		grups[i/4].add( x.walls[i+3] ); 
		//grups[i/2].position.z = pozZ; 
	}

	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader();  
		//loader4 = new THREE.TextureLoader();

	loader.load( 'img/bakrum/wallpaperc2.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 2);    
		//tx.repeat.set(10, 5);    
		tx.repeat.set(5.1, 1.7);    
		
		for ( let j = 0; j < 12; j++ ) {	
			x.walls[j].material.map = tx; 
			//x.walls[j].material.aoMap = tx; 			
			//x.walls[j].material.bumpMap = tx; 
			//x.walls[j].material.normalScale.set(-.8, -.8); 
			//x.walls[j].material.normalMap = tx2; 
			//x.walls[j].material.roughnessMap = tx; 
			x.walls[j].material.needsUpdate = true;
			//x.walls[j].visible = true; 
		}
	});  	
	/*
	loader2.load( 'img/bakrum/wallpaperr.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 2);    
		//tx.repeat.set(10, 5);    
		tx2.repeat.set(5.1, 1.7);    
		
		for ( let k = 0; k < 12; k++ ) {	
			//x.walls[j].material.map = tx; 
			//x.walls[j].material.aoMap = tx; 			
			//x.walls[j].material.bumpMap = tx; 
			//x.walls[j].material.normalScale.set(-.8, -.8); 
			//x.walls[j].material.normalMap = tx2; 
			x.walls[k].material.roughnessMap = tx2; 
			x.walls[k].material.needsUpdate = true;
			//x.walls[j].visible = true; 
		}
	});  		*/

	loader3.load( 'img/bakrum/wallpaperr.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		//tx3.repeat.set(4, 2);    
		tx3.repeat.set(5.1, 1.7);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 12; l++ ) {	
			//x.walls[l].material.aoMapIntensity = 1; 
			//x.walls[l].material.aoMap = tx3; 
			x.walls[l].material.bumpScale = 1; 
			x.walls[l].material.bumpMap = tx3; 
			//x.walls[l].material.displacementScale = 10; 
			//x.walls[l].material.displacementBias = -5; 
			//x.walls[l].material.displacementMap = tx3; 
			//x.walls[l].material.roughnessMap = tx3; 
			x.walls[l].material.needsUpdate = true;
		}
	});	
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 	
	scene.add(grups[2]); 	

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
			
			//animWalk(); 
			animWalk2(); 
			
			theOptions(); 
        }
    })();	
}	

/*
function animWalk() {
    (function walkIn() {
		let z0 = grups[0].position.z, 
			z1 = grups[1].position.z, 
			z2 = grups[2].position.z; 
			//console.log(z1);
			
		//if (z0 < 1200) {
		//if (z0 < 2100) {
		if (z0 == win.ej[0]) {
			//grups[0].position.z = 0; 
			//grups[0].position.z = 300; 
		//	grups[0].position.z = 400; 
		//	grups[0].position.z = -800; 
			
			grups[0].position.z = win.ej[2]; 
		} else {
			//grups[0].position.z = z0 + 1; 		
			
			grups[0].position.z = z0 + win.ej[1]; 
		}
		
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
		
		requestAnimationFrame(walkIn);					
    })();	
}
*/

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
		win.cr[1] = -.0004; 
		win.cr[0] = .0006; 		
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
		//const timer = Date.now() * 0.0001;
	
	//	const delta = clock.getDelta() * .7;
		const delta = clock.getDelta() * .7;
		if ( mixer ) mixer.update( delta );	
		
		/*
				// Get the time elapsed since the last frame

				const mixerUpdateDelta = clock.getDelta();

				// Update all the animation frames

				for ( let i = 0; i < mixers.length; ++ i ) {

					mixers[ i ].update( mixerUpdateDelta *.4);
					//console.log(mixers.length);

				}
		*/		
		
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
	
	TWEEN.update();	
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

/*
function animFBX2() {
	const loader = new FBXLoader();
	
	loader.load( 'obj/ybot.fbx', function ( object ) {
	//	const material = new THREE.MeshStandardMaterial( {color: 0xffffff, skinning: true, roughness: .0, metalness: .7 } );
		const material = new THREE.MeshStandardMaterial( {color: 0xffffff, roughness: .0, metalness: .65 } );
		//const material = new THREE.MeshPhysicalMaterial( {color: 0xffffff, skinning: true } );

		x.char1 = object; 
	
		mixer = new THREE.AnimationMixer( x.char1 );
		//mixer = new THREE.AnimationMixer( object );

		const action = mixer.clipAction( x.char1.animations[ 0 ] );
		//const action = mixer.clipAction( object.animations[ 0 ] ); 
		
		action.play();

		x.char1.traverse( function ( child ) {
		//object.traverse( function ( child ) {

			if ( child.isMesh ) {
			//if ( child.isSkinnedMesh ) {
				child.material = material; 
				
				child.castShadow = true;
				child.receiveShadow = true;
				
				//console.log('skin'); 
			}

		} );
		
		x.char1.scale.set(.5, .5, .5); 
		x.char1.position.set(0, -100, 1090); 
		x.char1.rotation.y = Math.PI; 		
		//object.scale.set(.5, .5, .5); 
		//object.position.set(0, -100, 1090); 
		//object.rotation.y = Math.PI; 

		scene.add( x.char1 );
		//scene.add( object );
		
		//const targetObject = new THREE.Object3D();

		x.spotLight.target = x.char1;							
		
		//console.log(x.spotLight.target);
		//const spotLightHelper = new THREE.SpotLightHelper( x.spotLight );
		//scene.add( spotLightHelper );					
		
		let loader2 = new THREE.TextureLoader();

		loader2.load( 'img/chip001c.jpg', function(tx) { 	
			tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//	tx.repeat.set(2, 2);    
			
			material.map = tx; 
		//	material.bumpScale = .06; 
			material.bumpScale = 1.6; 
			material.bumpMap = tx; 
			//material.metalMap = tx; 
			//material.normalScale.set(-1, -1); 
			//material.normalMap = tx; 
			//material.roughnessMap = tx; 
			material.needsUpdate = true;

		});  		

		fadeScene(); 	
	} );

}
*/
	
function animFBX() {
	//let url = 'teenb1/char1';  
	let url = 'haztez/haztez';  
	
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
				
				meshCount += 1; 
			}
		} );	
		
		//console.log(meshCount); 
		
		x.char1 = object; 
		
		let matr = [];  
			//url2 = 'obj/teenb1/mat/', 
		const url2 = 'obj/haztez/mat/', 
			  frm = 'jpg', 
			  kolors = [0xbbbbbb, 0xffffff, 0xbbbbbb, 0xbbbbbb, 0x999999, 0xa1a1a1, 0xa1a1a1, 0xfff8ea, 0xaaaabb, 0x333333, 
				    	0xccbb77, 0xccbb77, 0x333333, 0x333333, 0xccbb77, 0xccbb77, 0x333333, 0xdddddd, 0xaaaabb]; 	
		
		//for ( let i = 0; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
		//	matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: .1 } );
			
			//if (i!=17) {
				matr[i] = new THREE.MeshStandardMaterial( { color: kolors[i], roughness: .3, metalness: .1 } );
			//} else {
				//matr[i] = new THREE.MeshMatcapMaterial( { color: 0x888888, transparent: true, opacity: .55 } );
			//}
			
			x.char1.children[i].material = matr[i]; 
			
			//matr[i].dithering = true; 
		
		}

		//console.log(x.char1.children);
	
		//x.char1.frustumCulled = false;
		
		
		//let xxx = 7; 
		//x.char1.children[xxx].material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .6, metalness: .1 } ); 
		
		let load1 = new THREE.TextureLoader();  
			//load2 = new THREE.TextureLoader(); 
			
			
		load1.load( url2 + 'hazc.' + frm, function(tx) { 	
			for ( let j = 0; j < meshCount; j++ ) {	
				matr[j].map = tx; 
				//x.char1.children[j].material.map = tx; 
				//material.bumpScale = .3; 
				//material.bumpMap = tx2; 
				//material.metalMap = tx2; 
				//material.normalScale.set(-1, -1); 
				//material.normalMap = tx2; 
				//material.roughnessMap = tx2; 
				//x.char1.children[j].material.needsUpdate = true;
				matr[j].needsUpdate = true;
			}
		});  			
	
	/*
		load2.load( url2 + 'matcap-porcelain-dark-hdri-45-deg-gamma1.' + frm, function(tx2) { 	
			//for ( let k = 0; k < meshCount; k++ ) {	
				matr[17].matcap = tx2; 
				//x.char1.children[j].material.map = tx; 
				//material.bumpScale = .3; 
				//material.bumpMap = tx2; 
				//material.metalMap = tx2; 
				//material.normalScale.set(-1, -1); 
				//material.normalMap = tx2; 
				//material.roughnessMap = tx2; 
				//x.char1.children[j].material.needsUpdate = true;
				matr[17].needsUpdate = true;
			//}
		});  			
		
		//matr[1].color.set(0xffffff);
		//matr[2].color.set(0xff0000);
		//matr[3].color.set(0x999999);
		matr[4].color.set(0x999999);
		matr[7].color.set(0xffeecc);
		matr[8].color.set(0x9999bb);
		matr[9].color.set(0x333333);
		
		matr[10].color.set(0xccbb55);
		matr[11].color.set(0xccbb55);
		matr[14].color.set(0xccbb55);
		matr[15].color.set(0xccbb55);
		

		//matr[15].color = '0xffffff';
		
		matr[12].color.set(0x333333);		
		matr[13].color.set(0x333333);
		matr[16].color.set(0x333333);
		matr[17].color.set(0xdddddd);
		matr[18].color.set(0x888888);
		*/
		matr[17].transparent = true; 
		matr[17].opacity = .55; 
		matr[17].roughness = 0; 
		
			/*load2.load( url2 + 'R_4770eef4d97c41759289f1463e7b01ee_hazmat_Normal.' + 'jpeg', function(tx2) { 	
				x.char1.children[xxx].material.normalScale.set(-.01, -.01);
				x.char1.children[xxx].material.normalMap = tx2; 			
				x.char1.children[xxx].material.needsUpdate = true;
			}); */
			
		// 0 = mouth. 1 = face. 2 = eye. 3 = eye. 4 = mask. 5 = hands. 6 = shoes. 7 = coverall. 8 = inner helmet. 
		// 9 = left top rings. 10 = left top tubes. 11 = right top tubes. 12 = right top rings. 13 = left bottom rings. 
		// 14 = left bottom tubes. 15 = right bottom tubes. 16 = right bottom rings. 
		// 17 = visor. 18 = mask tubes. 
				
		//child 0 = tube bottom left. 1 = tube bottom right. 2 = ring bottom right.
		// 3 = visor. 7 = coverall. 10 = hand. 11 = shoes. 12 = . 
		// 13 = coverall. 14 = . 15 = ring top left. 16 = tube top left. 
		// 17 = tube top right. 18 = ring top right. 19 = ring bottom left. 
	
/*	
		let load2 = new THREE.TextureLoader(), 
			load3 = new THREE.TextureLoader(), 
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(), 
			load7 = new THREE.TextureLoader(); 

		let load2n = new THREE.TextureLoader(), 
			load3n = new THREE.TextureLoader(), 
			load4n = new THREE.TextureLoader(), 
			load5n = new THREE.TextureLoader(), 
			load6n = new THREE.TextureLoader(), 
			load7n = new THREE.TextureLoader(); 

		load2.load( url2 + 'bottomd.' + frm, function(tx2) { 	
			matr[2].map = tx2; 
			//material.bumpScale = .3; 
			//material.bumpMap = tx2; 
			//material.metalMap = tx2; 
			//material.normalScale.set(-1, -1); 
			//material.normalMap = tx2; 
			//material.roughnessMap = tx2; 
			matr[2].needsUpdate = true;
		});  	
	
		load3.load( url2 + 'bodyd.' + frm, function(tx3) { 	
			matr[3].map = tx3; 
			matr[3].needsUpdate = true;
		});  	
	
		load4.load( url2 + 'hatd.' + frm, function(tx4) { 	
			matr[4].map = tx4; 
			matr[4].needsUpdate = true;
		});  	
	
		load5.load( url2 + 'shoesd.' + frm, function(tx5) { 	
			//matr[5].depthWrite = false; 
			matr[5].map = tx5; 
			matr[5].needsUpdate = true;
		});  	
	
		load6.load( url2 + 'topd.' + frm, function(tx6) { 	
			matr[6].map = tx6; 
			matr[6].needsUpdate = true;
		});  	
	
		load2n.load( url2 + 'bottomn.' + frm, function(txn2) { 	
			matr[2].normalScale = new THREE.Vector2( -1, -1 ); 
			//matr[2].normalScale.set( -1, -1 ); 
			matr[2].normalMap = txn2; 
			matr[2].needsUpdate = true;
		});  	

		load3n.load( url2 + 'bodyn.' + frm, function(txn3) { 	
			matr[3].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[3].normalMap = txn3; 
			matr[3].needsUpdate = true;
		});  	
			
		load4n.load( url2 + 'hatn.' + frm, function(txn4) { 	
			matr[4].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[4].normalMap = txn4; 
			matr[4].needsUpdate = true;
		});  	
		
		load5n.load( url2 + 'shoesn.' + frm, function(txn5) { 	
			matr[5].roughness = .5; 
			matr[5].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[5].normalMap = txn5; 
			matr[5].needsUpdate = true;
		});  	
		
		load6n.load( url2 + 'topn.' + frm, function(txn6) { 	
			matr[6].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[6].normalMap = txn6; 
			matr[6].needsUpdate = true;
		});  		
*/
		//x.char1.rotation.x = 0;		
		//x.char1.position.set(0, -100, 1060); 
		//x.char1.rotation.y = Math.PI; 	
		
		//x.char1.scale.set(.52, .52, .52); 
		x.char1.scale.set(.44, .44, .44); 
		//x.char1.position.set(0, -100, 1090); 
		//x.char1.position.set(0, -100, 1600); 
		//x.char1.position.set(0, florY, 2200); 
	//	x.char1.position.set(0, florY, 2150); 
	//	x.char1.position.set(0, florY, 950); 
	//	x.char1.position.set(0, florY, win.ej[4]); 
		x.char1.position.set(0, florY, win.ej[0]); 
		//x.char1.rotation.set(0, Math.PI, 0);	
		//x.char1.rotation.set(0, 0, 0);	
		x.char1.rotation.set(0, win.ej[4], 0);	
		
		scene.add( x.char1 ); 
		
		
		//scene.add(camera); 
		
		//camera.position.set(0, -35, win.ej[5]); 		
		
		
		//x.spotLight.target = x.char1;
		
		//grup1.position.set( 0, florY+120, 11000 ); 
		//grup1.add( x.char1 ); 
				
		//grup1.visible = true; 
		//scene.add( grup1 ); 

		//camera.position.set(0, florY+120+100, 150); 		
		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	//let url = 'teenb1/walkswag'; 	//mono
	let url = 'haztez/walking'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}

/*
function anim8B() {
	//x.actions = []; 
	
	//let url = 'teenb1/walkswag'; 	//mono
	let url = 'haztez/nervouslook'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	loader.load( 'obj/' + url, function ( object ) {	

		//mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[1] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[1].play(); 
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}
*/

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
		//let url = 'frst1'; 	
		let url = 'tbckrms2'; 	
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



