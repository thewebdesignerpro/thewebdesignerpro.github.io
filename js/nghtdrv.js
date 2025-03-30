/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import * as THREE from 'three2';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import WebGPU from 'three/addons/capabilities/WebGPU.js';

//import { vec3, Fn, time, texture3D, screenUV, uniform, screenCoordinate, pass } from 'three/tsl'; 	// volume lite
import { reflector, uv, texture, color } from 'three/tsl'; 	// mirror

//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
//import { bayer16 } from 'three/addons/tsl/math/Bayer.js';
//import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
			
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';

//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
//import { WaterMesh } from 'three/addons/objects/WaterMesh.js';	// gpu
//import { SkyMesh } from 'three/addons/objects/SkyMesh.js';	// gpu
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


const idleTO = 120, florY = 0, ceilY = 140;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer; 
const ui = {}, _ = {}, x = {}; 

//let cntnt, cntnt2, cntnt3; 

//let cubeCamera, cubeRenderTarget;

let postProcessing, volumetricMesh, pointLight; 

//let domeClouds; 

// temp
//let controls; 

let isAvailable = ( typeof navigator !== 'undefined' && navigator.gpu !== undefined ); 

if ( ( WebGL.isWebGL2Available() ) && isAvailable ) {
//if ( WebGPU.isAvailable() ) { 
//if () {
	//console.log(isAvailable);
	
	//import * as THREE from 'three'; 
	//init();
	
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
} else {		
	//import * as THREE from 'three2'; 
	
	/*if ( WebGL.isWebGL2Available() ) {
		if (window.addEventListener) {
			window.addEventListener("load", initGL, false);
		} else if (window.attachEvent) {
			window.attachEvent("onload", initGL);
		} else {
			window.onload = initGL;
		}				
	} else {	*/
		//const warning = WebGL.getWebGL2ErrorMessage();
		//const warning = WebGPU.getErrorMessage();
		
		const warning = 'Your browser does not support <a href="https://gpuweb.github.io/gpuweb/" style="color:blue">WebGPU</a> yet';
				
		kontainer.appendChild(warning);	
		
		//kontainer.style.background = "url('img/thewebdesignerprol.jpg') center top no-repeat"; 
		kontainer.style.background = "url('img/nightdrivel.jpg') center top no-repeat"; 
		kontainer.style.backgroundSize = "cover"; 
		
		fader.style.opacity = 0;
		fader.style.display = "none";
		fader.parentNode.removeChild(fader);	
		
		cL(loadr, 0, "paus");
		loadr.style.display = "none";	
		loadr.parentNode.removeChild(loadr);		
	//}
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
	//console.log('init');

	function $(id) {
		return document.getElementById(id);
	}	
		
	ui.kontainer = $('kontainer'); 
	
	//ui.colPick = $('colPick'); 
	ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.colPick.style.visibility = "hidden"; 
	ui.swtchKam.style.visibility = "hidden"; 
	
//	ui.fcp = $('fcp'); 	// colorpicker
	
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

		_.prevW = _.prevH = 0; 	
	}
	
	dummy.parentNode.removeChild(dummy);		
	
	_.width = window.innerWidth; 
	_.height = window.innerHeight; 
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    

    //ui.kontainer.style.opacity = 0;		
    ui.kontainer.style.backgroundColor = '#000000';		

	const fogCol = 0x000000; 


	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -5; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 2000; 			//2000 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 127;			//70 or 35	
	
	//x.xx = 400; 
	x.zz = 450; 


/*	
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
*/	
	
    scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(fogCol, 0.0006);	
	//scene.fog = new THREE.FogExp2(0x535f37, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
	//grups[2] = new THREE.Group(); 

	scene.add(grups[0]); 
	scene.add(grups[1]); 
	//scene.add(grups[2]); 
	
	//grups[2].position.set(0, 0, 0); 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 10000 ); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(100, _.ej[5], -20); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		

	//x.camGrup.position.set(0, 0, _.ej[3]); 
	x.camGrup.position.set(0, 0, 2000); 
	scene.add(x.camGrup); 
	
	scene.add( new THREE.AmbientLight( 0xaaaaaa ) );	

    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		

	_.mouse = new THREE.Vector2(); 	
	_.entro = true; 
	_.idleTimer = 0; 
	_.fokus = true; 
	
	//_.raycaster = new THREE.Raycaster();
	_.pointer = new THREE.Vector2();

	_.ptrDown = false; 

	
	renderer = new THREE.WebGPURenderer({ antialias: true });
	//renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 2;	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
	renderer.sortObjects = false;	
//	renderer.setAnimationLoop( animate ); 	
	ui.kontainer.appendChild(renderer.domElement); 
	
	
//	x.spotLcone = []; 
/*	
	x.spotLight = []; 

	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 10000000, 4000, Math.PI/4, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 0, 1500, 0 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width =  1536;
	//x.spotLight[0].shadow.mapSize.height = 1536; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 4000;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = .7;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	
*/

	const dLSize = 1400,  
		  dLSize2 = 1400; 
	
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.6 );
	directionalLight.castShadow = true; 
	//directionalLight.shadow.mapSize.width = 1024; 
	//directionalLight.shadow.mapSize.height = 1024; 
	//directionalLight.shadow.camera.near = 1; 
	directionalLight.shadow.camera.far = 3200;	
	directionalLight.shadow.camera.left = -dLSize; 
	directionalLight.shadow.camera.bottom = -dLSize2; 
	directionalLight.shadow.camera.right = dLSize; 
	directionalLight.shadow.camera.top = dLSize2; 
	directionalLight.position.set( 0, 1000, -1000 );
	directionalLight.shadow.intensity = .8; 
	scene.add( directionalLight );


	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	

	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	//const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	//scene.add( helper );	
	
	//const helperS = new THREE.CameraHelper( directionalLight.shadow.camera );
	//const helperS = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helperS );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
/*	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .1;
    controls.autoRotateSpeed = 1.5;	
   // controls.autoRotate = true;    
    controls.minDistance = 0;
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    //controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = .1;
    controls.zoomSpeed = 2;
   // controls.enablePan = false;
    controls.panSpeed = 2;
	//controls.update();		
controls.enabled = false; 
*/
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	//grups[0].add( x.spotLight[0] );	
//	grups[0].add(camera);	
	
	
	x.currGrup = 0; 
	
	x.target0 = new THREE.Object3D(); 
//	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	x.target0.position.set(100, _.ej[5], 1880); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
//	controls.target = x.target0.position; 	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	

	x.rotCam = false; 
	x.inCar = true; 
	
	// Post-Processing
	//postProcessing = new THREE.PostProcessing( renderer );
	
	
	addSkybox(); 
	//addSkybox2(); 
	
	//addRoads(); 
	
	addClouds(); 

	addGround();  
	addTrees();  
	
	//animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	const f = '.png'; 
	//const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/2/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'negz'+f, 'posz'+f
		//'left'+f, 'right'+f,
		//'top'+f, 'bottom'+f,
		//'back'+f, 'front'+f
		//'3'+f, '1'+f,
		//'5'+f, '4'+f,
		//'6'+f, '2'+f
	], function ( tx ) {
		//tx.flipY = true; 
	//	tx.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx.mapping = THREE.CubeRefractionMapping;	
		
		x.skybox = tx; 

	//	scene.backgroundRotation.set(0, Math.PI/2, 0); 
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		//scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addRoads(); 
		
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

function addClouds() {
	const geometry = new THREE.SphereGeometry( 3500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	//material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
	domeClouds.position.y = -1; 
	domeClouds.rotation.y = Math.PI - .5; 
	//domeClouds.rotation.y = Math.random() * (Math.PI*2); 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	
	//scene.add( domeClouds );
	x.camGrup.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	load1.load( 'img/skybox/0/mway3b.jpg', function(tx) { 
		domeClouds.material.map = tx; 
		domeClouds.material.needsUpdate = true; 
	}); 	

	//load2.load( 'img/skybox/0/alpha3.jpg', function(tx2) { 
	//	domeClouds.material.alphaMap = tx2; 
	//	domeClouds.material.needsUpdate = true; 
	//}); 
	
	//fadeScene(); 
}

function addRoads() {
	x.road = []; 
	
	const width = 1000, 
		  //height = 1000,  
		  height = 2000,  
		  kolor = 0xffffff, 
		  //posZ = [500, -500, 500, -500],
		  posZ = [1000, -1000],
		  roadMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//roadMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	
	//for ( let i = 0; i < 4; i++ ) {	
	for ( let i = 0; i < 2; i++ ) {	
		roadMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//roadMater[i].flatShading = true; 
		roadMater[i].transparent = true; 
		roadMater[i].opacity = .9; 
		roadMater[i].wireframe = true; 	
	
		x.road[i] = new THREE.Mesh( geometry, roadMater[i] ); 
		
		x.road[i].position.set(0, florY, posZ[i]);
		//x.road[i].position.set(0, florY, 0);
		x.road[i].rotation.x = Math.PI/-2;
		//x.road[i].castShadow = true; 
		x.road[i].receiveShadow = true; 
		
		//if (i < 2) {
		//	grups[0].add( x.road[i] ); 
		//} else {
		//	grups[1].add( x.road[i] ); 
		//}
		
		scene.add( x.road[i] ); 
	}

	const loader0 = new THREE.TextureLoader(), 
		  loader0b = new THREE.TextureLoader(), 
		  loader0c = new THREE.TextureLoader(), 
		  //loader1 = new THREE.TextureLoader(), 
		  //loader1b = new THREE.TextureLoader(), 
		  //loader1c = new THREE.TextureLoader(), 		  
		  //loader2 = new THREE.TextureLoader(),   
		  //loader2b = new THREE.TextureLoader(), 
		  //loader2c = new THREE.TextureLoader(), 		  
		  //loader3 = new THREE.TextureLoader(), 
		  //loader3b = new THREE.TextureLoader(), 
		  //loader3c = new THREE.TextureLoader(), 		  
		  url = 'img/road/0/'; 

	//loader0.load( url + 'color0123.jpg', function(tx0) { 	
	loader0.load( url + 'color0123.jpg', function(tx0) { 	
		//tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		//tx0.repeat.set(1, 2);    
		
		x.road[0].material.map = x.road[1].material.map = tx0; 
		x.road[0].material.needsUpdate = x.road[1].material.needsUpdate = true;
		
		x.road[0].material.wireframe = x.road[1].material.wireframe = false; 
	});  		

	//loader0b.load( url + 'rough0123test.jpg', function(tx0b) { 	
	loader0b.load( url + 'rough0123.jpg', function(tx0b) { 	
		//tx0b.wrapS = tx0b.wrapT = THREE.RepeatWrapping;    
		//tx0b.repeat.set(1, 2);  
		
		x.road[0].material.roughnessMap = x.road[0].material.alphaMap = x.road[1].material.roughnessMap = x.road[1].material.alphaMap = tx0b; 
		x.road[0].material.needsUpdate = x.road[1].material.needsUpdate = true;
	});  		

	//loader0c.load( url + 'normal0123.jpg', function(tx0c) { 	
	loader0c.load( url + 'normal0123.jpg', function(tx0c) { 	
		//tx0c.wrapS = tx0c.wrapT = THREE.RepeatWrapping;    
		//tx0c.repeat.set(1, 2);  
		
		x.road[0].material.normalScale.set(4, 4); 
		x.road[1].material.normalScale.set(4, 4); 
		x.road[0].material.normalMap = x.road[1].material.normalMap = tx0c; 
		x.road[0].material.needsUpdate = x.road[1].material.needsUpdate = true; 
		
		//addMirror01(); 
		addWetGround(); 
	});  		
/*
	loader1.load( url + 'color1b.jpg', function(tx1) { 	
		x.road[1].material.map = x.road[3].material.map = tx1; 
		x.road[1].material.needsUpdate = x.road[3].material.needsUpdate = true;
		       
		x.road[1].material.wireframe = x.road[3].material.wireframe = false; 
	});  		

	loader1b.load( url + 'rough1b.jpg', function(tx1b) { 	
		x.road[1].material.roughnessMap = x.road[1].material.alphaMap = x.road[3].material.roughnessMap = x.road[3].material.alphaMap = tx1b; 
		x.road[1].material.needsUpdate = x.road[3].material.needsUpdate = true;
	});  		

	loader1c.load( url + 'normal1b.jpg', function(tx1c) { 	
		//x.road[1].material.normalScale.set(1, 1, 1); 
		x.road[1].material.normalMap = x.road[3].material.normalMap = tx1c; 
		x.road[1].material.needsUpdate = x.road[3].material.needsUpdate = true; 
		
		//addMirror23(); 	
		addWetGround(); 	
	});  		

	loader2.load( url + 'color0b.jpg', function(tx2) { 	
		x.road[2].material.map = tx2; 
		x.road[2].material.needsUpdate = true;
		       
		x.road[2].material.wireframe = false; 
	});  		

	loader2b.load( url + 'rough0b.jpg', function(tx2b) { 	
		x.road[2].material.roughnessMap = x.road[2].material.alphaMap = tx2b; 
		x.road[2].material.needsUpdate = true;
	});  		

	loader2c.load( url + 'normal0b.jpg', function(tx2c) { 	
		//x.road[2].material.normalScale.set(1, 1, 1); 
		x.road[2].material.normalMap = tx2c; 
		x.road[2].material.needsUpdate = true; 
		
		addMirror23(); 		
	});  		

	loader3.load( url + 'color1b.jpg', function(tx3) { 	
		x.road[3].material.map = tx3; 
		x.road[3].material.needsUpdate = true;
		       
		x.road[3].material.wireframe = false; 
	});  		

	loader3b.load( url + 'rough1b.jpg', function(tx3b) { 	
		x.road[3].material.roughnessMap = x.road[3].material.alphaMap = tx3b; 
		x.road[3].material.needsUpdate = true;
	});  		

	loader3c.load( url + 'normal1b.jpg', function(tx3c) { 	
		//x.road[3].material.normalScale.set(1, 1, 1); 
		x.road[3].material.normalMap = tx3c; 
		x.road[3].material.needsUpdate = true;
	});  		
*/
	grups[0].position.z = 1000; 
	grups[1].position.z = -1000; 
	
	//scene.add(grups[0]); 	
	//scene.add(grups[1]); 		
}

function addWetGround() {
	const loader = new THREE.TextureLoader(), 
		  url = 'img/road/0/';  
	
	loader.load( url + 'normal0123b.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping; 
		//tx.repeat.set(1, 2); 
		
		const mirror01 = reflector(); 
		
		const normalScale = .1; 
		const uvOffset = texture( tx, uv().mul( 1 ) ).xy.mul( 2 ).sub( 1 ).mul( normalScale ); 
		
		mirror01.uvNode = mirror01.uvNode.add( uvOffset ); 
		
		const mirror01Node = color( 0xffffff ).mul( .04 ).add( mirror01 ); 
		
		const geom = new THREE.PlaneGeometry( 1000, 2000 ); 
		//const geom = new THREE.PlaneGeometry( 1000, 4000 ); 
		
		x.mirror01 = new THREE.Mesh( geom, new THREE.MeshPhongNodeMaterial( { colorNode: mirror01Node } ) );
		//x.mirror01.position.set(0, -.1, 0); 
		x.mirror01.position.set(0, -.1, 1000); 
		x.mirror01.rotation.x = Math.PI/-2; 
		x.mirror01.add( mirror01.target ); 
		
		//grups[0].add( x.mirror01 ); 
		scene.add( x.mirror01 ); 
		
		const mirror23 = reflector(); 
		
		mirror23.uvNode = mirror23.uvNode.add( uvOffset ); 
		
		const mirror23Node = color( 0xffffff ).mul( .04 ).add( mirror23 ); 
		
		const geom2 = new THREE.PlaneGeometry( 1000, 2000 ); 
		
		x.mirror23 = new THREE.Mesh( geom2, new THREE.MeshPhongNodeMaterial( { colorNode: mirror23Node } ) );
		//x.mirror23.position.set(0, -.1, 0); 
		x.mirror23.position.set(0, -.1, -1000); 
		x.mirror23.rotation.x = Math.PI/-2; 
		x.mirror23.add( mirror23.target ); 
		
		//grups[1].add( x.mirror23 ); 
		scene.add( x.mirror23 ); 
		
		//animFBX(); 		
		addCar(); 
	});  
}	

function addGround() {
	x.ground = []; 
	
	let width = 4000, 
		//height = 602, 
		height = 4000,  
		posX = 0, 
		posZ = (height-2)/2, 
		rez = 160,  
		intrvl = 400, 
		kolor = 0xd4d4d4; 
		
	let geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	//let geometry = new THREE.PlaneGeometry( width, height, rez*2, rez );
	//let geometry = new THREE.PlaneGeometry( width, height );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	//material.flatShading = true; 
	material.wireframe = true; 
	
	for ( let i = 0; i < 1; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
	
		x.ground[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);
		//x.ground[i].position.set(0, florY, posZ);
		x.ground[i].position.set(0, -48, 0);
		x.ground[i].rotation.x = Math.PI*-.5;
		//x.ground[i].castShadow = true; 
		x.ground[i].receiveShadow = true; 
		
		/*if (i == 1) {
			grup1.add( x.ground[i] );
		} else {
			grup2.add( x.ground[i] );
		}*/		

		/*if (i == 2) {
			grups[2].add( x.ground[i] ); 
		} else {
			grups[i].add( x.ground[i] ); 
		}*/
		
		//grups[0].add( x.ground[i] ); 
		//grups[i].add( x.ground[i] ); 
		scene.add( x.ground[i] ); 
		
	//	grups[i].position.z = pozZ; 
		
		//x.spotLight[i].target = x.ground[i];	
	}

	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader(), 
		url = 'img/ground/3/', 
		//txU = 4, txV = 2; 
		txU = 4, txV = 4; 

	loader.load( url + 'color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.map = tx; 
			x.ground[j].material.needsUpdate = true;
			
			x.ground[j].material.wireframe = false; 
		}
	});  		

	//loader2.load( 'img/spacew/terr1.jpg', function(tx2) { 	
	loader2.load( 'img/snowground2.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(1, 2);    
		
		for ( let j = 0; j < 1; j++ ) {	
			//x.ground[j].material.bumpMap = tx; 
			x.ground[j].material.displacementScale = 120; 
			//x.ground[j].material.displacementBias = 15; 
			x.ground[j].material.displacementMap = tx2;			
			x.ground[j].material.needsUpdate = true;
		}
	});  		

	loader3.load( url + 'normal1b.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.normalScale.set(.5, .5); 
			x.ground[j].material.normalMap = tx3; 
			x.ground[j].material.needsUpdate = true;
		}
	});  		

	loader4.load( url + 'rough1.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.roughnessMap = tx4; 
			x.ground[j].material.needsUpdate = true;
		}
	});  		

}
	
function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 2400 - 1200; 
		
	if ((posx > -550) && (posx < 550)) {
		//let rnd = Math.random() < 0.5 ? -1 : 1;
		//posx = 532 * rnd; 
		
		if (posx < 0) { 
			//posx = -532; 
			posx = (Math.random() * -130) - 550;   
		} else {
			//posx = 532; 
			posx = (Math.random() * 130) + 550; 
		}
		//console.log(posx);
	}
		
	position.x = posx;
	position.y = florY;
	position.z = (Math.random() * 1990 - 995);

	rotation.x = Math.PI/-2; 
	rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = .3 + Math.random() * .1;

	return matrix.compose( position, quaternion, scale );
}

function addTrees() {
	//let meshCount = 0; 
	//x.materials2 = []; 
	x.trees = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/2/tree1.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//child.castShadow = true; 
				//child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, alphaTest: .5 } );		
		material.wireframe = true; 
		//material.side = 2; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  qty = 25; 			
		
			x.trees[0] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
			x.trees[0].frustumCulled = true;
			x.trees[0].castShadow = true; 
			x.trees[0].receiveShadow = true;
			
			x.trees[1] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
			x.trees[1].frustumCulled = true;
			x.trees[1].castShadow = true; 
			x.trees[1].receiveShadow = true;
			
			const geometryId0 = x.trees[0].addGeometry( object.children[0].geometry ), 
				  geometryId1 = x.trees[1].addGeometry( object.children[0].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.trees[0].addInstance( geometryId0 ), 
					  instancedId1 = x.trees[1].addInstance( geometryId1 );
			
				matrix = randomizeMatrix( matrix ); 

				x.trees[0].setMatrixAt( instancedId0, matrix ); 				
				x.trees[1].setMatrixAt( instancedId1, matrix ); 				
			}
			
			//if (i==0) {
				grups[0].add(x.trees[0]); 
			//} else {
				grups[1].add(x.trees[1]); 
			//}			
			
			//x.trees[i].visible = false; 
			//x.trees[i].material.opacity = .1; 
		//}		

	
		let	loader = new THREE.TextureLoader(), 
			loader2 = new THREE.TextureLoader(); 

		loader.load( 'obj/trees/2/mat/color1.png', function(tx) { 	
		//loader.load( 'obj/trees/evergreend.jpg', function(tx) { 	
			material.map = tx; 
			material.needsUpdate = true;
			
			material.wireframe = false; 
		});  
		
		loader2.load( 'obj/trees/2/mat/alpha1.png', function(tx2) { 	
			material.alphaMap = tx2; 
			material.needsUpdate = true;
		});  

		//fadeScene(); 
	}); 

}

function addCar() {
	let meshCount = 0; 
	x.car = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/car/9/car.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				if ((meshCount == 0) || (meshCount == 1) || (meshCount == 2) || (meshCount == 4)) 	
					child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//child.castShadow = true; 
				//child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.car[0] = object; 
		
		const matr = [], 
			  url2 = 'obj/car/9/mat/', 
			  frm = 'jpg'; 
		
		//const geom = object.children[0].geometry,  
		//	  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .3, metalness: 0 } );
		
		//matr.emissive.setHex(0xaeaeae); 
		//matr.side = 2; 
		//matr.shadowSide = 1; 
		
		//matr.alphaTest = .5; 
		//matr.envMap = x.skybox; 
		
		//matr.wireframe = true; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshBasicMaterial( { color: 0xffffff } );
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .82, metalness: .1 } );
			
			matr[i].wireframe = true; 
			
		//	x.car[i] = new THREE.Mesh( geom, matr );
			
			x.car[0].children[i].material = matr[i]; 
			
		//	x.car[i].scale.set(1.4, 1.4, 1.4); 
			//console.log(posX[i]);
		//	x.car[i].position.set(posX[i], 3.38, posZ[i]); 
			//x.car[i].position.set(-3.88, -.6, .87); 
		//	x.car[i].rotation.x = Math.PI/-2; 
			
			//x.car[i].castShadow = true; 
			//x.car[i].receiveShadow = true; 
			
		//	grups[0].add(x.car[i]); 
		
			if ((i==0) || (i==1) || (i==2)) {
				matr[i].roughness = 0; 
				//matr[i].reflectivity = .01; 
				matr[i].envMapIntensity = .55; 
				matr[i].envMapRotation.set(0, .5, 0); 
				
				matr[i].envMap = x.skybox;
			}
		}
		
		x.car[0].scale.set(100, 100, 100); 
		x.car[0].position.set(132.5, 75, -50); 
		x.car[0].rotateY(Math.PI/-2); 
		
		x.camGrup.add(x.car[0]); 
		
		// 0 - breaks 1 - frame 2 - meters 3 - trims 4 - dashboard 5 - seat 6 - floor 7 - dash
		
		const loader0 = new THREE.TextureLoader(),      
			  loader1 = new THREE.TextureLoader(),      
			  loader2 = new THREE.TextureLoader(),      
			  loader3 = new THREE.TextureLoader(),      
			  loader4 = new THREE.TextureLoader(),      
			  loader5 = new THREE.TextureLoader(),      
			  loader6 = new THREE.TextureLoader(), 
			  loader7 = new THREE.TextureLoader();     

		loader0.load( url2 + 'color2.jpg', function(tx0) { 	
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			//tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
			tx0.repeat.set(20, 20);  		
		
			for ( let j = 0; j < 8; j++ ) {	
				if (j!=1) {
					matr[j].map = tx0; 
					matr[j].needsUpdate = true; 
					matr[j].wireframe = false; 		
				}
			}
		});  
		
		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr[1].map = tx1; 
			matr[1].needsUpdate = true; 
			matr[1].wireframe = false; 
		});  
		
		
		x.meter = []; 
		const posX = [92.3, 107.5, 97.9, 101.9],  
			  posY = [101.7, 101.7, 106.7, 106.7],  
			  posZ = [-86, -86, -87.2, -87.2], 
			  meterMater = []; 

		const meterGeom = new THREE.PlaneGeometry( 10, 10 ), 
			  meterGeom2 = new THREE.PlaneGeometry( 3, 3), 
			  scrGeom = new THREE.PlaneGeometry( 14, 6.6);
			
		for ( let j = 0; j < 2; j++ ) {	
			meterMater[j] = new THREE.MeshBasicMaterial( { color: 0xffffff, alphaTest: .5 } ); 
			meterMater[j].wireframe = true; 
		
			x.meter[j] = new THREE.Mesh( meterGeom, meterMater[j] );
			x.meter[j].position.set(posX[j], posY[j], posZ[j]); 
			x.meter[j].rotateX(-.36); 
			
			x.camGrup.add( x.meter[j] );
		}

		for ( let k = 2; k < 4; k++ ) {	
			meterMater[k] = new THREE.MeshBasicMaterial( { color: 0xffffff, alphaTest: .5 } ); 
			meterMater[k].wireframe = true; 
		
			x.meter[k] = new THREE.Mesh( meterGeom2, meterMater[k] );
			x.meter[k].position.set(posX[k], posY[k], posZ[k]); 
			x.meter[k].rotateX(-.36); 
			
			x.camGrup.add( x.meter[k] ); 
		}
		
		const scrMater = new THREE.MeshBasicMaterial( { color: 0xeeeeee, transparent: true } );
		scrMater.wireframe = true; 
		
		x.radioScr = new THREE.Mesh( scrGeom, scrMater ); 
		x.radioScr.position.set(130, 90.8, -79.8); 
		x.radioScr.rotateX(-.27); 
		x.radioScr.rotateZ(-.065); 
		
		x.camGrup.add( x.radioScr ); 

		loader2.load( url2 + 'alfa0.jpg', function(tx2) { 	
			for ( let l = 0; l < 2; l++ ) {
				meterMater[l].alphaMap = tx2; 
				meterMater[l].needsUpdate = true; 
			}
		});  		
		
		loader3.load( url2 + 'meter0.jpg', function(tx3) { 	
			meterMater[0].map = tx3; 
			meterMater[0].needsUpdate = true; 
			meterMater[0].wireframe = false; 	
		});  		
		
		loader4.load( url2 + 'meter1.jpg', function(tx4) { 	
			meterMater[1].map = tx4; 
			meterMater[1].needsUpdate = true; 
			meterMater[1].wireframe = false; 	
		});  		
		
		loader5.load( url2 + 'meter2.jpg', function(tx5) { 	
			meterMater[2].map = tx5; 
			meterMater[2].needsUpdate = true; 
			meterMater[2].wireframe = false; 	
		});  		
		
		loader6.load( url2 + 'meter3.jpg', function(tx6) { 	
			meterMater[3].map = tx6; 
			meterMater[3].needsUpdate = true; 
			meterMater[3].wireframe = false; 	
		});  		
		
		loader7.load( url2 + 'radioscr.jpg', function(tx7) { 	
			scrMater.map = tx7; 
			scrMater.needsUpdate = true; 
			scrMater.wireframe = false; 	
		});  		
		
		
		addMirrors(); 
		
		//fadeScene(); 
	}); 
}	

function addMirrors() {
	let meshCount = 0; 
	x.mirrors = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/car/9/mirrors.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				if (meshCount == 0) child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				meshCount += 1; 
			}
		});	
		
		//console.log(meshCount); 

	//	const mirrors3 = new THREE.Mesh( object.children[0].geometry, new THREE.MeshPhongMaterial( { color: 0xb0b0b0 } ) ); 
		x.mirrors3 = new THREE.Mesh( object.children[0].geometry, new THREE.MeshPhongMaterial( { color: 0xb0b0b0 } ) ); 
		x.mirrors3.scale.set(100, 100, 100); 
		x.mirrors3.position.set(132.5, 75, -50); 
		x.mirrors3.rotateY(Math.PI/-2); 	
		
		x.camGrup.add( x.mirrors3 ); 		
		
		const mirrors0 = reflector(),  
			  mirrors1 = reflector(),  
			  mirrors2 = reflector(); 
		
		//const normalScale = .1; 
		//const uvOffset = texture( tx, uv().mul( 1 ) ).xy.mul( 2 ).sub( 1 ).mul( normalScale ); 
		
		//mirrors.uvNode = mirrors.uvNode.add( uvOffset ); 
		
		const mirrorsNode0 = color( 0xffffff ).mul( .5 ).add( mirrors0 ),  
			  mirrorsNode1 = color( 0xffffff ).mul( .4 ).add( mirrors1 ),  
			  mirrorsNode2 = color( 0xffffff ).mul( .4 ).add( mirrors2 ); 
		
		//const geom = new THREE.PlaneGeometry( 200, 200 ); 
		//const geom = object.children[0].geometry; 

		const trackShape = new THREE.Shape()
		.moveTo( 40, 40 )
		.lineTo( 40, 160 )
		.absarc( 60, 160, 20, Math.PI, 0, true )
		.lineTo( 80, 40 )
		.absarc( 60, 40, 20, 2 * Math.PI, Math.PI, true ); 
		
		const geom = new THREE.ShapeGeometry( trackShape ); 
		
		//x.mirrors[0] = new THREE.Mesh( geom, new THREE.MeshBasicMaterial( { side: THREE.DoubleSide } ) );
		
		x.mirrors[0] = new THREE.Mesh( geom, new THREE.MeshPhongNodeMaterial( { colorNode: mirrorsNode0 } ) );
		x.mirrors[0].scale.set(.1, .106, .1); 
		x.mirrors[0].position.set(141.9, 123.5, -71.5); 
		x.mirrors[0].rotateY(-.275); 	
		x.mirrors[0].rotateZ(Math.PI/2); 	
	//	x.mirrors[0].scale.set(100, 100, 100); 
	//	x.mirrors[0].position.set(132.5, 75, -50); 
	//	x.mirrors[0].rotateY(Math.PI/-2); 	
		x.mirrors[0].add( mirrors0.target ); 
		
		//scene.add( x.mirrors[0] ); 
		x.camGrup.add( x.mirrors[0] ); 
		
		const roundedRectShape = new THREE.Shape();

		( function roundedRect( ctx, x, y, width, height, radius ) {

			ctx.moveTo( x, y + radius );
			ctx.lineTo( x, y + height - radius );
			ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
			ctx.lineTo( x + width - radius, y + height );
			ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
			ctx.lineTo( x + width, y + radius );
			ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
			ctx.lineTo( x + radius, y );
			ctx.quadraticCurveTo( x, y, x, y + radius );

		} )( roundedRectShape, 0, 0, 78, 45, 20 ); 
		
		const geom2 = new THREE.ShapeGeometry( roundedRectShape ); 		

		x.mirrors[1] = new THREE.Mesh( geom2, new THREE.MeshPhongNodeMaterial( { colorNode: mirrorsNode1 } ) );
		x.mirrors[1].scale.set(.2, .2, .2); 
		x.mirrors[1].position.set(47.5, 109.5, -73.5); 
		x.mirrors[1].rotateY(.28); 	
		x.mirrors[1].rotateX(-.1); 	
		x.mirrors[1].add( mirrors1.target ); 
		
		x.camGrup.add( x.mirrors[1] ); 
				
		x.mirrors[2] = new THREE.Mesh( geom2, new THREE.MeshPhongNodeMaterial( { colorNode: mirrorsNode2 } ) );
		x.mirrors[2].scale.set(.2, .2, .2); 
		x.mirrors[2].position.set(202, 109.5, -77.7); 
		x.mirrors[2].rotateY(-.29); 	
		x.mirrors[2].rotateX(-.1); 	
		x.mirrors[2].add( mirrors2.target ); 
		
		x.camGrup.add( x.mirrors[2] ); 
				
		
		addWheel(); 
		
		//fadeScene(); 

		//const geom = object.children[0].geometry; 
		//const mater = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .3 } );
		//mater.envMap = x.skybox; 
		////mater.reflectivity = 3;  
		////mater.envMapIntensity = 10; 
		//
		//x.mirrors[0] = new THREE.Mesh( geom, mater );
		//x.mirrors[0].scale.set(100, 100, 100); 
		//x.mirrors[0].position.set(133.3, 75, -120); 
		//x.mirrors[0].rotateY(Math.PI/-2); 	
		//
		//x.camGrup.add( x.mirrors[0] ); 
		//
		////addReflect(); 
		//fadeScene(); 
	}); 
}	

function addWheel() {
	let meshCount = 0; 
	x.wheel = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/car/9/wheel.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				if (meshCount == 0) child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				meshCount += 1; 
			}
		});	
		
		//console.log(meshCount); 

		const url2 = 'obj/car/9/mat/', 
			  frm = 'jpg'; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .2, metalness: 0 } );
		
		matr.wireframe = true; 
		//matr.reflectivity = .23; 
		//matr.envMapRotation.set(0, 1.35, 0); 
		//matr.envMap = x.skybox; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.wheel[i] = new THREE.Mesh( geom, matr );
			
			x.wheel[i].scale.set(100, 100, 100); 
			//x.wheel[i].position.set(132.5, 75, -50); 
			x.wheel[i].position.set(99.9, 99.7, -67); 
			x.wheel[i].rotateY(Math.PI/-2); 			
			x.wheel[i].rotateZ(.5); 			
			
			//x.wheel[i].castShadow = true; 
			//x.wheel[i].receiveShadow = true; 
			
			x.camGrup.add(x.wheel[i]); 
		}
		
		const loader0 = new THREE.TextureLoader();     

		loader0.load( url2 + 'color2.jpg', function(tx0) { 	
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			tx0.repeat.set(20, 20);  		
		
			matr.map = tx0; 
			matr.needsUpdate = true; 
			matr.wireframe = false; 
			
			addLights(); 
			//fadeScene(); 
		});  
		
	}); 
}	

function addLights() {
	x.spotLight = []; 
	x.target = []; 
	//x.spotLcone = []; 	
	
	const posX = [80, 185]; 
	//const posX = [57, 208]; 

	//const geometry = new THREE.PlaneGeometry( 160, 200 );		
	//const material = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: .5, side: THREE.BackSide } );
	//material.depthWrite = false; 
	////material3.fog = false; 
		
	for ( let i = 0; i < 2; i++ ) {	
		x.spotLight[i] = new THREE.SpotLight( 0xfff1d2, 8000000, 970, Math.PI/10, 1 );
		x.spotLight[i].position.set( posX[i], 70, -250 );
		//x.spotLight[i].position.set( posX[i], 70, -167 );
		
		x.camGrup.add( x.spotLight[i] );	
		
		x.target[i] = new THREE.Object3D(); 
		x.target[i].position.set(x.spotLight[i].position.x, x.spotLight[i].position.y, x.spotLight[i].position.z - 100); 
		x.camGrup.add(x.target[i]);
		
		x.spotLight[i].target = x.target[i]; 	
	
		//const spotLightHelper = new THREE.SpotLightHelper( x.spotLight[i] );
		//scene.add( spotLightHelper );

		//x.spotLcone[i] = new THREE.Mesh( geometry, material );
		//
		//x.spotLcone[i].position.set( x.spotLight[i].position.x, x.spotLight[i].position.y, x.spotLight[i].position.z - 392 );
		//x.spotLcone[i].rotateX(Math.PI/2); 
		//x.spotLcone[i].scale.set( 4, 4, 1 );
		//x.spotLcone[i].visible = false;			
		//
		//x.camGrup.add( x.spotLcone[i] );	
	}	
	
	//let load0 = new THREE.TextureLoader();  
	//
	//load0.load( 'img/spotLconeA.png', function(tx0) { 
	//	//material.emissiveIntensity = 10; 
	//	material.map = material.alphaMap = tx0; 
	//	material.needsUpdate = true; 
	//	
	//	x.spotLcone[0].visible = x.spotLcone[1].visible = true; 
	//	
	//	fadeScene(); 
	//}); 		
	
	fadeScene(); 
}
	
/*	
function addReflect() {
	cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } ); 
	//cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512 );
	//cubeRenderTarget.texture.type = THREE.HalfFloatType;

	cubeCamera = new THREE.CubeCamera( 1, 10000, cubeRenderTarget ); 
	//cubeCamera.position.z = 150; 
	scene.add( cubeCamera ); 
	
	//x.mirrors[0].material.reflectivity = 10;  
	//x.mirrors[0].material.envMapIntensity = 5; 
	x.mirrors[0].material.envMap = cubeRenderTarget.texture; 
	x.mirrors[0].material.needsUpdate = true; 
	
	fadeScene(); 
}
*/


function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
		let val = parseFloat(ui.fader.style.opacity); 
		
        //if (!((val += .02) > 1.0)) {
		if (!((val -= .1) < 0)) {
 			ui.fader.style.opacity = val;
			//console.log(ui.fader.style.opacity); 			
            
			requestAnimationFrame(fadeIn); 
        } else {
 			ui.fader.style.opacity = 0;
            ui.fader.style.display = "none";
			ui.fader.parentNode.removeChild(ui.fader);	
			
			onWindowResize(); 			
			
			//ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
			
			eL(ui.kontainer, 0, 'pointerdown', onPointerDown); 
			eL(ui.kontainer, 0, "pointermove", onPointerMove); 
			eL(ui.kontainer, 0, "click", kontainerClick); 
			eL(ui.kontainer, 0, "wheel", wheelE); 
			
			x.camV3 = new THREE.Vector3(); 			
			
		//	animate();  
			
			theOptions(); 
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			//x.fogIdx = 0; 
			//x.fogInc = 1; 
			
			/*
			ColorPicker(
                document.getElementById('fcpSlide'),
                document.getElementById('fcpPick'),
				
                function(hex, hsv, rgb) {
					const colR = rgb.r/255, 
						  colG = rgb.g/255,
						  colB = rgb.b/255; 
					
                    x.car.children[3].material.color.setRGB(colR, colG, colB); 
                    x.car.children[4].material.color.setRGB(colR, colG, colB);  
                    x.car.children[7].material.color.setRGB(colR, colG, colB); 
					//console.log(rgb.r, rgb.g, rgb.b);
				}
			);
			*/
			
			renderer.setAnimationLoop( animate ); 
        }
    })();	
}	

function theOptions() {
	//ui.swtchKam = document.getElementById('swtchKam'); 
	//ui.onAud = document.getElementById('onAud'); 
	//ui.offAud = document.getElementById('offAud'); 
	
	//ui.colPick.style.visibility = "visible";
	
//	if (!isMobil) {
		ui.swtchKam.style.visibility = "visible"; 	
//	} else {
//		ui.swtchKam.style.display = "none"; 
//	}
	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		//eL(ui.colPick, 0, 'touchstart', colPickClick); 
		eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
		//eL(ui.colPick, 0, 'click', colPickClick); 
		eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);		
	}	 
	
}

/*function colPickClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
	cL(ui.fcp, 0, "scale1"); 
	
	_.idleTimer = 0; 
}
*/

function swtchKamClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
	x.inCar = (x.inCar) ? false : true; 
	x.car[0].visible = x.wheel[0].visible = x.mirrors3.visible = x.mirrors[0].visible = x.mirrors[1].visible = x.mirrors[2].visible = x.inCar; 
	x.meter[0].visible = x.meter[1].visible = x.meter[2].visible = x.meter[3].visible = x.radioScr.visible = x.inCar; 	
	
	let spotLz = -250; 
	
	if (x.inCar) {
		//spotLz = -250; 
		camera.position.y = x.target0.position.y = 127; 
		_.ej[1] = -5; 
	} else {
		spotLz = -42; 
		camera.position.y = x.target0.position.y = 70; 
		_.ej[1] = -1; 
	}
		
	for ( let i = 0; i < 2; i++ ) {	
		x.spotLight[i].position.z = spotLz; 
	}
	
	x.rotCam = !x.rotCam;  
	
	_.idleTimer = 0; 
}


function audClick(event) {
    if (event) event.preventDefault(); 
	//event.stopPropagation();

//	clickTap(); 
	
	if (x.sound) {
		//x.sound.isPlaying ? x.sound.pause() : x.sound.play(); 
		if (x.sound.isPlaying) {
			//ui.offAud.classList.add('noneIt2'); 						
			//ui.onAud.classList.remove('noneIt2'); 
			cL(ui.offAud, 0, "noneIt2");
			cL(ui.onAud, 1, "noneIt2");

			x.sound.pause(); 
			//console.log('pause');
		} else {
			//ui.onAud.classList.add('noneIt2'); 
			//ui.offAud.classList.remove('noneIt2'); 
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");			

			x.sound.play(); 
			//console.log('play');
		}
	} else {
		//console.log('aud');
		addAud(); 
	}

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

	_.pointer.x = pointer.x;
	_.pointer.y = pointer.y; 	
		
	//eL(ui.kontainer, 0, 'pointerup', onPointerUp); 
	//eL(ui.kontainer, 0, 'pointerout', onPointerOut); 
	//eL(ui.kontainer, 0, 'pointercancel', onPointerCancel); 
	
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
	
	_.pointer.x = pointer.x;
	_.pointer.y = pointer.y; 	
	
	_.idleTimer = 0; 
}

function kontainerClick( event ) {
    if (event) event.preventDefault();
    //event.stopPropagation(); 
	
//	cL(ui.fcp, 1, "scale1"); 	// colorpicker

	_.idleTimer = 0;
}	

function wheelE( event ) {
    if (event) event.preventDefault();
    //event.stopPropagation(); 

	_.idleTimer = 0;
}	

function onWindowResize() {
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    
	/*
	if (isMobil) {
        let winWH = document.documentElement.getBoundingClientRect();
        let winWHx = document.documentElement.clientWidth, 
            winWHy = document.documentElement.clientHeight;
        if (winWH) {
            _.width = winWH.width;
            _.height = winWH.height;
        } else if (winWHx) {
            _.width = winWHx;
            _.height = winWHy;            
        } else {
            let tmpWW = _.width;
            _.width = _.height; 
            _.height = tmpWW;
        }
    }
    */
	
	if (isMobil) {
		if (_.width == _.prevW) {
			_.width = _.prevH; 
			_.height = _.prevW; 
		}
		
		_.prevW = _.width; 
		_.prevH = _.height; 	

		//x.rotCam = true; 
	}
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	

	//x.xx = 400; 
	x.zz = 450; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
		//camera.position.z = 37; 
		//console.log(camera.position.z); 
		
		//if (isMobil) x.xx = 800;
		x.zz = 450;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		//camera.position.z = 51; 
		
		//if (isMobil) x.xx = 1100; 
		x.zz = 600; 
	}		
	
//	camera.position.z = x.zz; 
	
	_.idleTimer = 0; 
}


function animWalk() {
	let z0 = x.camGrup.position.z, 
		z1 = x.target0.position.z; 
	
	//console.log(z0);
		
	//if (z0 == _.ej[0]) {
	if (z0 > _.ej[0]) {
		x.camGrup.position.z = z0 + _.ej[1]; 
		x.target0.position.z = z1 + _.ej[1]; 
	} else {
		x.camGrup.position.z = _.ej[3]; 
		
		x.target0.position.z = _.ej[3] - 120; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
		x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
	}
	
}


function animate() { 
	//console.log('anim'); 
 //   requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		//const delta = clock.getDelta()  * .5; 
		//if ( mixer ) mixer.update( delta );			

		camera.lookAt(x.target0.position);
		camera.rotation.z = Math.sin(timer*2) * .001; 
		camera.position.y += Math.sin(timer*3) * .02; 
	
		x.wheel[0].rotateX(Math.sin(timer*5) * .001); 
		
	//	x.camGrup.rotation.y = Math.sin(timer*.5) * Math.PI/4.5; 

		if (isMobil) {
		//if (x.rotCam) {
			//camera.position.x += Math.cos(timer*.5) * 50; 
			//camera.position.y += Math.sin(timer*.5) * 20; 
		//	camera.position.x = Math.sin(timer*.3) * 23; 
		//	camera.position.y = Math.sin(timer*.2) * 16 + 17; 
			//camera.position.z = x.zz - (Math.abs(camera.position.x) * .25); 
			//console.log(camera.position.z); 
			camera.rotation.x = Math.sin(timer*.3) * Math.PI/10; 
			camera.rotation.y = Math.cos(timer*.4) * Math.PI/7; 			
		} else {
			//camera.position.x += _.pointer.x * 1; 
			//camera.position.y += (_.pointer.y * 1);
		//	camera.position.x = _.pointer.x * 23; 
		//	camera.position.y = (_.pointer.y * 16) + 17; 
			//camera.position.z = (Math.abs(_.pointer.y) * 200); 
	//		camera.rotation.x = _.pointer.y * Math.PI/24; 
			camera.rotation.x = _.pointer.y * Math.PI/10; 
			camera.rotation.y = _.pointer.x * Math.PI/-7; 						
		}
		
		x.radioScr.material.opacity = Math.random() * .3 + .7; 
		
		//domeClouds.rotation.y = Math.sin(timer*.01) * Math.PI; 
		
	
		animWalk(); 
		
		_.idleTimer += 0.01; 
		
		render();
	} else {
		if (clock.running) clock.stop(); 
		
		if (x.sound) {
			if (x.sound.isPlaying) x.sound.pause(); 
		}
	}
	
	if (document.hasFocus()) {
		if (!_.fokus) {
			_.idleTimer = 0; 
			_.fokus = true; 
			
			if (x.sound) {
				if (!x.sound.isPlaying) x.sound.play(); 
			}
		}
	} else {
		_.idleTimer = idleTO; 	
		_.fokus = false; 
		
		if (x.sound) {
			if (x.sound.isPlaying) x.sound.pause(); 
		}
	}	
	
//	TWEEN.update();	
}

function render() {
	//camera.lookAt(scene.position); 	
	//camera.lookAt(0, 10000, 0); 	
	//camera.lookAt(x.wall[0].position);
//	camera.lookAt(x.target0.position);
	//if (x.Sun) x.Sun.lookAt(camera.position);
	//x.beam2.lookAt(camera.position);
	//x.beam2.rotateY = x.beam2.rotateZ = 0; 
	//x.beam2.rotation.y = x.beam2.rotation.z = 0; 
	
	//x.mGlow.lookAt(camera.position); 	
	
	//x.mGlow.lookAt(camera.getWorldPosition(x.camV3)); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
	//renderer.renderAsync( scene, camera );	
	//postProcessing.render(); 
	
	//console.log(renderer.info); 
}


function animFBX() {
	let url = 'teenb1/char1';  
	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry.name);
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
				
				if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
			}
		} );	
		
		x.char1 = object; 
		
		let matr = [], 
			url2 = 'obj/teenb1/mat/', 
			frm = 'jpg'; 
		
		//matr[0] = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		//matr[1] = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		//matr[7] = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
		
		for ( let i = 0; i < 7; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .6, metalness: 0 } );
			x.char1.children[i].material = matr[i]; 
			
			//matr[i].emissive.set(0x333333); 
		}
		
	//	matr[0].color.set(0xaaaaaa); 	//TODO !!!!!!!!!!!!!!
		matr[1].transparent = true;
		matr[1].opacity = 0;

		//console.log(x.char1.children);
	
		//x.char1.frustumCulled = false;
	
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
			
		//let load3r = new THREE.TextureLoader(); 	

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
			//matr[0].map = matr[1].map = tx3; 
			//matr[0].needsUpdate = true;
			//matr[1].needsUpdate = true;
			//matr[7].needsUpdate = true;
			matr[0].map = matr[3].map = tx3; 
			matr[0].needsUpdate = matr[3].needsUpdate = true;
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
		//	matr[2].normalScale = new THREE.Vector2( -1, -1 ); 
			//matr[2].normalScale.set( -1, -1 ); 
			matr[2].normalMap = txn2; 
			matr[2].needsUpdate = true;
		});  	

		load3n.load( url2 + 'bodyn.' + frm, function(txn3) { 	
		//	matr[3].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[3].normalMap = txn3; 
			matr[3].needsUpdate = true;
		});  	
			
		load4n.load( url2 + 'hatn.' + frm, function(txn4) { 	
		//	matr[4].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[4].normalMap = txn4; 
			matr[4].needsUpdate = true;
		});  	
		
		load5n.load( url2 + 'shoesn.' + frm, function(txn5) { 	
			matr[5].roughness = .4; 
		//	matr[5].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[5].normalMap = txn5; 
			matr[5].needsUpdate = true;
		});  	
		
		load6n.load( url2 + 'topn.' + frm, function(txn6) { 	
		//	matr[6].normalScale = new THREE.Vector2( -.8, -.8 ); 
			matr[6].normalMap = txn6; 
			matr[6].needsUpdate = true;
		});  		

		
		//x.char1.rotation.x = 0;		
		//x.char1.position.set(0, -100, 1060); 
		//x.char1.rotation.y = Math.PI; 	
		
		//const scl = 1.1; 
		const scl = .8; 
		
		x.char1.scale.set(scl, scl, scl); 
	//	x.char1.position.set(0, florY+1.48, 0); 
	//	x.char1.position.set(-50, 54, -13); 
	
		//x.char1.position.set(50, 104, -14); 
	//	x.char1.position.set(48.7, 100, -20); 
		//x.char1.position.set(40, 103, -19); 
		
		//x.char1.position.set(37, 88, -19); 
		//x.char1.position.set(37, 88, -19); 
		
		//x.char1.position.set(0, florY-0, _.ej[0] -300); 
		//x.char1.rotation.set(-.5, Math.PI/-2, 0);	
		//x.char1.rotation.x = -.5; 
	//	x.char1.rotation.y = Math.PI/-2; 
	//	x.char1.rotation.set(0, _.ej[2], 0);	
	
		//x.char1.scale.set(.3, .3, .3); 
		x.char1.position.set(0, -1.2, -300); 
		x.char1.rotation.set(0, Math.PI, 0);	
		
		x.camGrup.add( x.char1 ); 
		//grups[0].add( x.char1 ); 
		//scene.add( x.char1 ); 
		
		//camera.lookAt(x.char1.position);
	//	x.spotLight[0].target = x.char1;
		
		//grup1.position.set( 0, florY+120, 11000 ); 
		//grup1.add( x.char1 ); 
				
		//grup1.visible = true; 
//		scene.add( grups[1] ); 
		
		//grups[1].rotation.z = -.03; 

		//camera.position.set(0, florY+120+100, 150); 		
		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	//let url = 'teenb1/SitRecline3'; 	//mono
	//let url = 'teenb1/SitRecline2'; 	//mono
	//let url = 'teenb1/SitRecline1'; 	//mono
	//let url = 'teenb1/SitRecline'; 	//mono
	//let url = 'teenb1/Sitting'; 	//mono
	//let url = 'teenb1/Sitting Idle'; 	//mono
	//let url = 'teenb1/breathidle'; 	//mono
	//let url = 'teenb1/idle'; 	//mono
	//let url = 'teenb1/walkhurry'; 	//mono
	//let url = 'teenb1/walkcareful'; 	//mono
	//let url = 'teenb1/walkstandard'; 	//mono
	//let url = 'teenb1/walkstrut'; 	//mono
	//let url = 'teenb1/walkhappy2'; 	//mono
	//let url = 'teenb1/walkhappy'; 	//mono
	//let url = 'teenb1/walkswag2'; 	//mono
	let url = 'teenb1/walkswag'; 	//mono
	//let url = 'teenb1/flying'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//x.actions[0].weight = 1;
		mixer.update( 0 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
		//let url = 'rchvz'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bsstp'; 	
		//let url = 'mrs'; 	
		//let url = 'atmn'; 	
		//let url = 'wntr'; 	
		//let url = 'rth'; 	
		//let url = 'cckpt'; 	
		//let url = 'slnd'; 	
		//let url = 'bdrm'; 			
		//let url = 'crvz'; 			
		//let url = 'lghths'; 			
		let url = 'nghtdrv'; 			
		url += '.mp3'; 	
		//url += '.mp4'; 	
		
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
			//x.sound.setVolume( 1.0 );
			x.sound.setVolume( 0.8 ); 
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
	}
	
}
	
	