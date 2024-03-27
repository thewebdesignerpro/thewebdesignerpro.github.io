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


//import * as THREE from './jsm/three.module.js';			
//import WEBGL from './jsm/WebGL.js'; 
//import { TWEEN } from './jsm/tween.module.min.js'; 
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';

//const idleTO = 120, florY = -100, ceilY = 140;  
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

    //ui.kontainer.style.backgroundColor = '#ff2975';		
    //ui.kontainer.style.backgroundColor = '#9f0c29';		
    //ui.kontainer.style.backgroundColor = '#f10649';		
    ui.kontainer.style.backgroundColor = '#d6053f';		

	win.cr = []; 	// cam rot
	
	//win.tr = []; 	// tire rot

	win.ej = []; 	
	
	win.ej[0] = false	// cam mode false or true
	win.ej[1] = .1		// cam pos mousex .1 or .2	
	
	//const fogCol = 0xff2975; 
	//const fogCol = 0x900b1f; 
	//const fogCol = 0xa41627; 
	//const fogCol = 0x9f0c29; 
	//const fogCol = 0xf10649; 
	const fogCol = 0xd6053f; 
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	renderer.setClearColor(fogCol, 1.0); 
//	renderer.shadowMap.enabled = true;
	renderer.shadowMap.enabled = false; 
//	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.toneMapping = THREE.AgXToneMapping;	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	renderer.outputColorSpace = THREE.SRGBColorSpace; 
	//renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
//	renderer.sortObjects = false;	
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
	scene.fog = new THREE.FogExp2(fogCol, 0.002);	
	//scene.fog.density = 0.0037;
	
	camera = new THREE.PerspectiveCamera( 50, win.width / win.height, 1, 100000 );
	//camera.position.set(0, -35, win.ej[1]); 
//	camera.position.set(0, 30, 240); 
	camera.position.set(0, 30, 150); 
	//camera.lookAt( 0, 0, 0 );

//    scene.add(camera);	
	
//	scene.add( new THREE.AmbientLight( 0x202020 ) );		
/*
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 100000, 3000, Math.PI/4, 1 );
	//x.spotLight[0].position.set( 0, 175, -2000 );
	x.spotLight[0].position.set( 0, 0, 0 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight.shadow.mapSize.width = 1024;
	//x.spotLight.shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 10;
	x.spotLight[0].shadow.camera.far = 3000;
	x.spotLight[0].shadow.camera.fov = 60;
	//x.spotLight.shadow.focus = 1; 
	//x.spotLight.shadowDarkness = 1.; 
//	scene.add( x.spotLight[0] );	
*/	
	
/*	x.spotLight[1] = new THREE.SpotLight( 0xffffff, 100000, 470, Math.PI/2.5, 1 ); 
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
*/	
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
	
	//grup1 = new THREE.Group(); 
	//grup2 = new THREE.Group(); 	
	//grup3 = new THREE.Group(); 	
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
	grups[2] = new THREE.Group(); 
	
//	grups[0].add( x.spotLight[0] );	
	//grups[1].add( x.spotLight[1] );	
	//grups[2].add( x.spotLight[2] );	
	
	addSky(); 
	addCar(); 
	
	//addFloor();
	//addCeiling();
	//addWalls();
	//addTrees(); 
	//addFog(); 
	//animFBX(); 
	
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

	if (win.ej[0]) {
		camera.position.set(0, 30, 150); 
		grups[2].rotation.y = 0; 

		win.ej[0] = false	// cam mode false or true
	} else {

		win.ej[0] = true	
	}

	
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
	
function addSky() {
	const loader = new THREE.CubeTextureLoader();
	//loader.setPath( 'img/outrun/map/test8/' );
	loader.setPath( 'img/outrun/map/' );

	x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	scene.background = x.skybox; 
	
	/*
	let width = 8000, 
		height = 2800,   
		kolor = 0xffffff; 
		
	let geometry = new THREE.PlaneGeometry( width, height ); 
	let material = new THREE.MeshBasicMaterial( { color: kolor, fog: false } ); 
	
	x.skybg = new THREE.Mesh( geometry, material ); 

	x.skybg.position.set(0, florY, -1000);
	//x.skybg.rotation.x = Math.PI*-.5;
		
	let	loader2 = new THREE.TextureLoader(); 
	
	loader2.load( 'img/outrun/map/skygrd1.png', function(tx2) { 	
		//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		//tx2.repeat.set(1, 1);    
		
		x.skybg.material.map = tx2; 
		x.skybg.material.needsUpdate = true;
		//x.floor[j].visible = true; 
		
		//scene.add(x.skybg); 
	//	grups[0].add(x.skybg); 
		
		//x.spotLight[0].target = x.skybg; 
		
		//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
		//scene.add( x.spotLightHelper );		
	});  	
	
//	addSun(); 
	*/
	
	addFloor(); 
	
	fadeScene(); 
}

/*	
function addSun() {
	x.sun = []; 
	
	const loader = new THREE.TextureLoader(); 

	loader.load( 'img/outrun/map/sun1.png', function(tx) { 	
		const material = new THREE.SpriteMaterial( { map: tx, fog: false } );
		const material2 = new THREE.SpriteMaterial( { map: tx, fog: false } );
		material.depthWrite = material2.depthWrite = false; 
		
		x.sun[0] = new THREE.Sprite( material );
		x.sun[1] = new THREE.Sprite( material2 );
		x.sun[0].position.set(0, florY+175, -900); 
		x.sun[1].position.set(0, florY-175, -900); 
		
		x.sun[0].scale.set(500, 500, 1); 
		x.sun[1].scale.set(500, 500, 1); 
		
		x.sun[1].material.rotation = Math.PI; 
		
		grups[0].add(x.sun[0]); 
		grups[0].add(x.sun[1]); 
	}); 
	
}
*/
	
function addFloor() {
	x.floor = []; 
	
	let width = 20000, 
		height = 20000,  
		posX = 0, 
		//intrvl = 10000, 
		kolor = 0xaabbcc; 
		
	let geometry = new THREE.PlaneGeometry( width, height );

	//let material = new THREE.MeshStandardMaterial( { emissive: kolor, roughness: .75, metalness: 0, transparent: true, opacity: .75 } );
	let material = new THREE.MeshBasicMaterial( { color: kolor, transparent: true, opacity: .75 } );
	//material.depthWrite = false; 
	//material.side = THREE.DoubleSide; 
	
	for ( let i = 0; i < 3; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
		let pozZ = height - height*i; 
		//let pozZ = 0; 
	
		x.floor[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);
		x.floor[i].position.set(0, florY, pozZ);
		//x.floor[i].position.set(0, florY, 0);
		x.floor[i].rotation.x = Math.PI*-.5;
		//x.floor[i].castShadow = true; 
	//	x.floor[i].receiveShadow = true; 
		
		//scene.add( x.floor[i] ); 
		grups[1].add( x.floor[i] ); 
		//grups[1].position.z = pozZ; 
		
		//x.spotLight[i].target = x.floor[i];	
	}
	
	grups[1].position.z = 0; 

	var	loader = new THREE.TextureLoader(), 
		//loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader();  
		//loader4 = new THREE.TextureLoader();

	loader.load( 'img/outrun/grid4.png', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(1600, 1600);    
		tx.repeat.set(300, 300);    
		
		for ( let j = 0; j < 3; j++ ) {	
			x.floor[j].material.map = tx; 
			//x.floor[j].material.emissiveMap = tx; 
			//x.floor[j].material.envMap = x.skybox; 
			//x.floor[j].material.envMapIntensity = 1; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx2; 
			//x.floor[j].material.roughnessMap = tx; 
			x.floor[j].material.needsUpdate = true;
			//x.floor[j].visible = true; 
		}
	});  		

/*	loader3.load( 'img/outrun/smudge1.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(400, 400);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			//x.floor[l].material.bumpScale = 25.; 
			//x.floor[l].material.bumpMap = tx3; 
			//x.floor[l].material.displacementScale = 10; 
			//x.floor[l].material.displacementBias = -5; 
			//x.floor[l].material.displacementMap = tx3; 
			x.floor[l].material.roughnessMap = tx3; 
			x.floor[l].material.needsUpdate = true;
		}
	});		*/
	
	//grup1.position.z = intrvl*3; 
	//grups[0].position.z = intrvl; 
	//grups[1].position.z = intrvl*3; 
	//grups[2].position.z = intrvl*5; 

	//scene.add(grup1); 
	//scene.add(grup2); 	
	
	grups[2].add(camera); 
	grups[2].position.z = 10000; 
	
	//if (win.width > win.height) {
		//grups[2].position.z = 10150; 
	//} else {
		//grups[2].position.z = 10180; 
	//}
	
//	scene.add(grups[0]); 	
//	scene.add(grups[1]); 	
//	scene.add(grups[2]); 	
	//scene.add(grups[2]); 	
	
	//x.spotLight.target = x.floor[0];	
	
}

function addCar() {
	let meshCount = 0, 
		matr = [], 
		kolors = [0x202020]; 
	
	let testMatr = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/outrun/lowpolycar.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeBoundingBox();		
				
			//	child.castShadow = true; 
			//	child.receiveShadow = true; 
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
				//if (meshCount == 17) child.add(camera);	
				
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		//x.car = object; 
		//x.car2 = object; 
		
		//for ( let i = 0; i < meshCount; i++ ) {	
			//matr[i] = new THREE.MeshStandardMaterial( { color: kolors[i], roughness: .1, metalness: .3 } );
				
		//	x.car.children[i].material = matr[i]; 		
		//}
		
	//	x.car.children[0].material.envMap = x.skybox; 
		
		testMatr[0] = new THREE.MeshStandardMaterial( { color: 0x111111, roughness: 0, metalness: .25, envMap: x.skybox } );	// main frame
		testMatr[1] = new THREE.MeshBasicMaterial( { color: 0x303030, envMap: x.skybox } );	// side trim
		testMatr[2] = new THREE.MeshStandardMaterial( { color: 0x881199, roughness: .2, metalness: .4, envMap: x.skybox } );	// inner frame
		testMatr[3] = new THREE.MeshBasicMaterial( { color: 0xbcbcbc, transparent:true, opacity: .9, envMap: x.skybox } );	// windows
		testMatr[4] = new THREE.MeshBasicMaterial( { color: 0xff77cc } );	// headlights
		testMatr[5] = new THREE.MeshBasicMaterial( { color: 0xff77cc } );	// rear & side bottom lights
		
		//let tempmat = new THREE.MeshBasicMaterial( { color: 0x888888, transparent:true, opacity: .07, wireframe: true } );	
		
		//x.car.children[0].material = testMatr; 
		//x.car2.children[0].material = testMatr; 
		//console.log(x.car.children[0].material[0]); 
		
		x.car = new THREE.Mesh( object.children[0].geometry, testMatr ); 
		//x.car3 = new THREE.Mesh( object.children[0].geometry, tempmat ); 
		
		x.car2 = new THREE.Mesh( object.children[0].geometry, testMatr ); 
		
		x.car.scale.set(10, 10, 10); 
		//x.car3.scale.set(10.02, 10.02, 10.02); 
		
		x.car2.scale.set(10, 10, 10); 
		
		//x.car.position.set(0, florY+13, 50); 
		//x.car2.position.set(0, florY-13, 50); 
		//x.car2.rotation.set(0, 0, Math.PI); 
		
	//	x.car.position.set(0, florY+13, 50); 
	//	x.car2.position.set(0, florY-13, 50); 
	
		x.car.position.set(0, florY+13, 0); 
		//x.car3.position.set(0, florY+13, 0); 
		
		x.car2.position.set(0, florY-13, 0); 
		x.car2.rotation.set(0, 0, Math.PI); 
		
	//	x.car.castShadow = true; 
	//	x.car2.receiveShadow = true; 		
		
		grups[0].add( x.car );		
		//grups[0].add( x.car3 );		
		
		grups[0].add( x.car2 );			
		//x.car2.clone(x.car); 
		
		//grups[0].position.z = 19850; 
		grups[0].position.z = 10000; 

		//x.spotLight[0].target = x.car; 
		
		//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
		//scene.add( x.spotLightHelper );
		
		//x.car.rotation.y = Math.PI; 
	}); 
	
	addCarLights(); 
	
	addTires(); 
}
	
function addCarLights() {
	let hLights1 = []; 
	let hLights2 = []; 
	
	const geometry = new THREE.PlaneGeometry( 33, 35 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xff70c0, transparent: true, opacity: .65, side: THREE.DoubleSide, depthWrite: false } );	

	hLights1[0] = new THREE.Mesh( geometry, material ); 
	hLights1[1] = new THREE.Mesh( geometry, material ); 
	hLights1[0].position.set(-20.6, 12.88, -45.1); 
	hLights1[1].position.set(20.6, 12.88, -45.1); 
	hLights1[0].rotation.x = 1.28; 
	hLights1[1].rotation.x = 1.28; 
	hLights1[0].rotation.y = .1; 
	hLights1[1].rotation.y = -.1; 
	
	hLights1[1].rotation.y += Math.PI;  
	
	//hLights1[0].rotation.z = -.07; 
	//hLights1[1].rotation.z = -.07; 
	
	grups[0].add( hLights1[0] );	
	grups[0].add( hLights1[1] );		
	
	const geometry2 = new THREE.PlaneGeometry( 28, 4.8 ); 
	const material2 = new THREE.MeshBasicMaterial( { color: 0xff70c0, transparent: true, opacity: .75, side: THREE.DoubleSide, depthWrite: false } );	
	
	hLights2[0] = new THREE.Mesh( geometry2, material2 ); 
	hLights2[1] = new THREE.Mesh( geometry2, material2 ); 
	hLights2[0].position.set(-18.7, 18.6, 47.75); 
	hLights2[1].position.set(18.7, 18.6, 47.75); 
	hLights2[0].rotation.y = -.17; 
	hLights2[1].rotation.y = .17; 
	
	grups[0].add( hLights2[0] );	
	grups[0].add( hLights2[1] );	

	let load1 = new THREE.TextureLoader(),   
		load2 = new THREE.TextureLoader(), 
		load3 = new THREE.TextureLoader(); 
		
	load1.load( 'img/outrun/glow2b.png', function(tx) { 
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    		
		
		for ( let i = 0; i < 2; i++ ) {	
			hLights1[i].material.map = tx; 
			hLights1[i].material.alphaMap = tx; 
			
			hLights1[i].material.needsUpdate = true; 
		}
	});  	
	
	load2.load( 'img/outrun/glow1.png', function(tx2) { 
		//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		//tx2.repeat.set(4, 4);    		
		
		for ( let j = 0; j < 2; j++ ) {	
			hLights2[j].material.map = tx2; 
			hLights2[j].material.alphaMap = tx2; 
			//x.char1.children[j].material.map = tx; 
			//material.bumpScale = .3; 
			//material.bumpMap = tx2; 
			//material.metalMap = tx2; 
			//material.normalScale.set(-1, -1); 
			//material.normalMap = tx2; 
			//material.roughnessMap = tx2; 
			//x.char1.children[j].material.needsUpdate = true;
			//material.needsUpdate = true;
			
			//x.car.material[0].roughnessMap = tx; 
			hLights2[j].material.needsUpdate = true; 
		}
	});  					
			
	const geometry3 = new THREE.ConeGeometry( 5.8, 50, 4, 1, true ); 
	const material3 = new THREE.MeshBasicMaterial( {color: 0xff70c0, transparent: true, opacity: .3, side: THREE.DoubleSide, depthWrite: false } );
	
	let lCones = []; 
	
	lCones[0] = new THREE.Mesh(geometry3, material3 ); 
	lCones[1] = new THREE.Mesh(geometry3, material3 ); 
	
	lCones[0].position.set(-18.6, 18.6, 71); 
	lCones[1].position.set(18.6, 18.6, 71); 
	lCones[0].rotation.x = Math.PI/2; 
	lCones[1].rotation.x = Math.PI/2; 
	lCones[1].rotation.y = Math.PI; 
	//lCones[0].rotation.y = Math.PI/4; 
	lCones[0].scale.z = .068; 
	lCones[1].scale.z = .068; 
	
	load3.load( 'img/outrun/tGlow2.png', function(tx3) { 
		for ( let k = 0; k < 2; k++ ) {	
			lCones[k].material.alphaMap = tx3; 
			
			lCones[k].material.needsUpdate = true; 
			
			grups[0].add( lCones[k] );		
		}
	});  	
		
}
	
function addTires() {
	let meshCount = 0, 
		testMatr = []; 
		
	x.fTire = []; 
	x.rTire = []; 

	//testMatr[0] = new THREE.MeshStandardMaterial( { color: 0x442255, roughness: .2, metalness: 0 } );	// rubber
//	testMatr[0] = new THREE.MeshBasicMaterial( { color: 0x0c0c0c } );	// rubber
//	testMatr[1] = new THREE.MeshStandardMaterial( { color: 0x551166, roughness: .1, metalness: .35, envMap: x.skybox } );	// rim
//	testMatr[2] = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: x.skybox } );	// led
	//testMatr[2] = new THREE.MeshBasicMaterial( { color: 0xdd5599 } );	// led
		
	testMatr[0] = new THREE.MeshStandardMaterial( { color: 0x551166, roughness: .1, metalness: .35, envMap: x.skybox } );	// rim
	testMatr[1] = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: x.skybox } );	// led		
	testMatr[2] = new THREE.MeshBasicMaterial( { color: 0x0c0c0c } );	// rubber
		
	const loader = new OBJLoader(), 
		  loader2 = new OBJLoader();
	
	loader.load( 'obj/outrun/wheelfront2.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeBoundingBox();		
				
			//	child.castShadow = true; 
			//	child.receiveShadow = true; 
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
			//	meshCount += 1; 
			}
		});	
		
		for ( let i = 0; i < 4; i++ ) {	
			x.fTire[i] = new THREE.Mesh( object.children[0].geometry, testMatr ); 
			
			x.fTire[i].scale.set(10, 10, 10); 
			
		//	x.fTire[i].castShadow = true; 
		//	x.fTire[i].receiveShadow = true; 		
			
			grups[0].add( x.fTire[i] );		
	
		}
		
		//x.fTire[0].position.set(0, florY+13, 50); 
		//x.fTire[1].position.set(0, florY-13, 50); 
		//x.fTire[2].position.set(0, florY-1.6, 50); 
		//x.fTire[3].position.set(0, florY+1.6, 50); 
		
		//x.fTire[1].rotation.set(0, 0, Math.PI); 
		//x.fTire[3].rotation.set(0, 0, Math.PI); 		
		
	//	x.fTire[0].position.set(24.4, florY+7.35, 21.1); 
	//	x.fTire[1].position.set(24.4, florY-7.35, 21.1); 
	//	x.fTire[2].position.set(-24.4, florY+7.35, 21.1); 
	//	x.fTire[3].position.set(-24.4, florY-7.35, 21.1); 
		x.fTire[0].position.set(24.4, florY+7.35, -28.9); 
		x.fTire[1].position.set(24.4, florY-7.35, -28.9); 
		x.fTire[2].position.set(-24.4, florY+7.35, -28.9); 
		x.fTire[3].position.set(-24.4, florY-7.35, -28.9); 
		
		x.fTire[2].rotation.set(0, Math.PI, 0); 
		x.fTire[3].rotation.set(0, Math.PI, 0); 		

	}); 	
	
	loader2.load( 'obj/outrun/wheelback2.obj', function ( object2 ) {
		//console.log(object2);
		
		object2.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeBoundingBox();		
				
			//	child.castShadow = true; 
			//	child.receiveShadow = true; 
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
			//	meshCount += 1; 
			}
		});	
		
		for ( let j = 0; j < 4; j++ ) {	
			x.rTire[j] = new THREE.Mesh( object2.children[0].geometry, testMatr ); 
			
			x.rTire[j].scale.set(10, 10, 10); 
			
		//	x.rTire[j].castShadow = true; 
		//	x.rTire[j].receiveShadow = true; 		
			
			grups[0].add( x.rTire[j] );		
	
		}
		
	//	x.rTire[0].position.set(23.08, florY+9.23, 81.23); 
	//	x.rTire[1].position.set(23.08, florY-9.23, 81.23); 
	//	x.rTire[2].position.set(-23.08, florY+9.23, 81.23); 
	//	x.rTire[3].position.set(-23.08, florY-9.23, 81.23); 
		x.rTire[0].position.set(23.08, florY+9.23, 31.23); 
		x.rTire[1].position.set(23.08, florY-9.23, 31.23); 
		x.rTire[2].position.set(-23.08, florY+9.23, 31.23); 
		x.rTire[3].position.set(-23.08, florY-9.23, 31.23); 
		
		x.rTire[2].rotation.set(0, Math.PI, 0); 
		x.rTire[3].rotation.set(0, Math.PI, 0); 		

		//x.rTire[0].position.set(0, florY+13, 50); 
		//x.rTire[1].position.set(0, florY-13, 50); 
		//x.rTire[2].position.set(0, florY-5.4, 50); 
		//x.rTire[3].position.set(0, florY+5.4, 50); 
		
		//x.rTire[1].rotation.set(0, 0, Math.PI); 
		//x.rTire[3].rotation.set(0, 0, Math.PI); 		

		//grups[0].rotation.y = Math.PI/-2; 
	}); 	

/*	for (let t=0; t<32; t++) {
		win.tr[t] = t / 10; 
		//console.log (win.tr[t]); 
	}	

	win.trI = 0; */
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 	
	scene.add(grups[2]); 	
}
	

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
		//	animWalk2(); 
		//	animWalk3(); 
			
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

function animWalk2() {
    (function walkIn2() {
		let z0 = grups[0].position.z;  
			//z1 = camera.position.z; 
			
		if (z0 == 0) {
			grups[0].position.z = 48800; 
		} else {
			grups[0].position.z = z0 + -5; 
		}
		
		
	//	if (z0 == win.ej[2]) {
		//	x.char1.position.z = win.ej[0]; 
	//	//	camera.position.z = win.ej[1]; 
	//	} else {
		//	x.char1.position.z = z0 + win.ej[3]; 
		//	camera.position.z = z1 + win.ej[3]; 
	//	}
		

		let fT0 = x.fTire[0].rotation.x,  	
			rT0 = x.rTire[0].rotation.x; 	
		
		//x.fTire[0].rotation.x = (fT0 - .02) % 3.1416; 
		x.fTire[0].rotation.x = (fT0 > -3.14) ? (fT0 - .02) : 0; 
		x.fTire[2].rotation.x = x.rTire[0].rotation.x = x.rTire[2].rotation.x = x.fTire[0].rotation.x; 
		x.fTire[1].rotation.x = x.fTire[3].rotation.x = x.rTire[1].rotation.x = x.rTire[3].rotation.x = x.fTire[0].rotation.x * -1; 
		
		//console.log(x.fTire[0].rotation.x); 
		
	//	x.fTire[0].rotation.x = x.fTire[2].rotation.x = x.rTire[0].rotation.x = x.rTire[2].rotation.x = win.tr[win.trI] * -1; 
	//	x.fTire[1].rotation.x = x.fTire[3].rotation.x = x.rTire[1].rotation.x = x.rTire[3].rotation.x = win.tr[win.trI]; 
		
		//win.trI += 1; 
	//	win.trI = (win.trI == 31) ? 0 : win.trI + 1; 
		
		//console.log(win.trI); 
		//console.log(x.fTire[2].rotation.x); 
	//
	
		requestAnimationFrame(walkIn2);					
    })();	
}
*/

function animWalk3() {
	//camera.position.z = -150; 
	
//    (function walkIn3() {
		let z1 = grups[1].position.z,   // floor
			z2 = grups[2].rotation.y; 	// cam
			
		if (z1 == 20000) {
			grups[1].position.z = 0; 
		} else {
			grups[1].position.z = z1 + 5; 
		}
		
		if (win.ej[0]) grups[2].rotation.y = (z2 < 6.28) ? (z2 + .005) : 0; 
		
		let fT0 = x.fTire[0].rotation.x,  	
			rT0 = x.rTire[0].rotation.x; 	
		
		//x.fTire[0].rotation.x = (fT0 - .02) % 3.1416; 
		x.fTire[0].rotation.x = (fT0 > -6.28) ? (fT0 - .02) : 0; 
		x.fTire[2].rotation.x = x.rTire[0].rotation.x = x.rTire[2].rotation.x = x.fTire[0].rotation.x; 
		x.fTire[1].rotation.x = x.fTire[3].rotation.x = x.rTire[1].rotation.x = x.rTire[3].rotation.x = x.fTire[0].rotation.x * -1; 
		
		//console.log(grups[2].rotation.y);
		
	//	requestAnimationFrame(walkIn3);					
//    })();	
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
	
	
	x.prevCamZ = camera.position.z; 
	//console.log(x.prevCamZ);

	camera.position.z += event.deltaY * .1; 	
	
	//if (camera.position.z < 110) 
		//console.log(camera.position.z);
	
	if ((camera.position.z < 110) || (camera.position.z > 200)) camera.position.z = x.prevCamZ; 

	
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
	//	cntnt.style.fontSize = cntnt2.style.fontSize = ((win.width+win.height)/2)*0.022+'px'; 
		
	//	camera.position.z = 150; 		
		//if (grups[2]) grups[2].position.z = 10150; 		
		
		win.ej[1] = .1		// cam pos mousex .1 or .2			
	} else {
	//	cntnt.style.fontSize = cntnt2.style.fontSize = ((win.width+win.height)/2)*0.028+'px'; 
		
	//	camera.position.z = 180; 		
		//if (grups[2]) grups[2].position.z = 10180; 		
		
		win.ej[1] = .2		// cam pos mousex .1 or .2					
	}		
	
	win.idleTimer = 0; 
}


function animate() { 
    requestAnimationFrame(animate);

	if (win.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.0005;
		//const timer = Date.now() * 0.00015;
	
		//const delta = clock.getDelta() * 1;
	//	if ( mixer ) mixer.update( delta );	
		
		/*
				// Get the time elapsed since the last frame

				const mixerUpdateDelta = clock.getDelta();

				// Update all the animation frames

				for ( let i = 0; i < mixers.length; ++ i ) {

					mixers[ i ].update( mixerUpdateDelta *.4);
					//console.log(mixers.length);

				}
		*/		
	
		//camera.position.x = Math.sin(timer) * 120; 		
		//camera.position.y = Math.sin(timer) * 70; 
		//camera.position.z = Math.cos(timer) * 120 + 50; 
		
		animWalk3(); 

		if (isMobil) {
			const timer = Date.now() * 0.00015; 
			
			if (!win.ej[0]) camera.position.x = Math.sin(timer*3) * 70; 
					
			camera.position.y = Math.cos(timer) * 20 + 24; 
			camera.position.z = Math.sin(timer) * 40 + 150; 
		
		} else {
			if (win.ej[0]) {
				const timer = Date.now() * 0.00015; 
				
				camera.position.y = Math.cos(timer) * 20 + 24; 
				camera.position.z = Math.sin(timer) * 40 + 150; 				
			} else {	
				camera.position.x = mouseX * win.ej[1]; 
				camera.position.y = (mouseY * -.04) + 25
			}
		}
	
		//if (camera.position.z < 110) console.log(camera.position.z); 
		// cam posz 110 to 200
		//console.log(); 
	
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
	
	//TWEEN.update();	
}

function render() {
	if (win.ej[0]) {
		camera.lookAt(grups[0].position); 
	} else {
		camera.lookAt(scene.position); 	
	}

	//controls.update(); 
	
	//x.spotLight.target = camera;		
	//x.spotLightHelper.update();
	
	//camera.rotation.y = ( mouseX - camera.position.x ) * -.0006;
//	camera.rotation.y = ( mouseX - camera.position.x ) * win.cr[1];
//	camera.rotation.x = ( -mouseY - camera.position.y ) * win.cr[0];	
	
//	camera.position.x = mouseX * .1;
	//camera.position.x = mouseX * .2;
//	camera.position.y = (mouseY * -.04) + 25
	
	//console.log(camera.position.z); 
	
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
		//let url = 'tbckrms2'; 	
		//let url = 'analog-dreams-synthwave-9497'; 	
		//let url = 'stranger-things-124008'; 	
		//let url = 'mezhdunami-fading-echoes-129291'; 	
		let url = 'otrnstfe'; 	
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
			x.sound.setVolume( 0.7 );
			//x.sound.setVolume( 0.8 );
			x.sound.play(); 
			//console.log('music'); 
			
			ui.onAud.classList.add('noneIt2'); 
			ui.offAud.classList.remove('noneIt2'); 			
		}); 
	
	}
	
}




	