/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import * as THREE from 'three2';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import WebGPU from 'three/addons/capabilities/WebGPU.js';

//import { vec3, Fn, time, texture3D, screenUV, uniform, screenCoordinate, pass } from 'three/tsl'; 	// volume lite
import { uv, texture, color } from 'three/tsl'; 	// mirror
//import { reflector, uv, texture, color } from 'three/tsl'; 	// mirror
//import { Fn, reflector, uv, texture, color, mx_worley_noise_float, time } from 'three/tsl'; 	// mirror

//import { Fn, color, mx_worley_noise_float, time } from 'three/tsl';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
//import { bayer16 } from 'three/addons/tsl/math/Bayer.js';
//import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
			
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';

//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
import { WaterMesh } from 'three/addons/objects/WaterMesh.js';	// gpu
//import { SkyMesh } from 'three/addons/objects/SkyMesh.js';	// gpu
//import { LensflareMesh, LensflareElement } from 'three/addons/objects/LensflareMesh.js';	// gpu
//import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
//import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


const idleTO = 120, florY = -50, ceilY = 140;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer, mixer2; 
const ui = {}, _ = {}, x = {}; 

let water, sun, sky; 

//let cntnt, cntnt2, cntnt3; 

//let cubeCamera, cubeRenderTarget;

//let postProcessing, volumetricMesh, pointLight; 

//let domeClouds; 

let sampler;
const count = 80;
const dummyL = new THREE.Object3D();
const _position = new THREE.Vector3();
const _normal = new THREE.Vector3();
const _scale = new THREE.Vector3();

// temp
let controls; 

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
		kontainer.style.background = "url('img/tfo.jpg') center top no-repeat"; 
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
	//ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.colPick.style.visibility = "hidden"; 
	//ui.swtchKam.style.visibility = "hidden"; 
	
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
    ui.kontainer.style.backgroundColor = '#e1e1e1';		

	const fogCol = 0xe1e1e1; 


	_.ej = []; 	
	
	_.ej[0] = 1500; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
//	_.ej[1] = -5; 			//front or back -1 or 1	
	_.ej[1] = 1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = -1500; 			//2000 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 1000;			//70 or 35	
	
	x.xx = 160; 
	x.zz = 4800; 


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
	scene.fog = new THREE.FogExp2(fogCol, 0.00006);	
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
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 20000 ); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], x.zz); 
	camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		

	//x.camGrup.position.set(0, 0, _.ej[3]); 
//	x.camGrup.position.set(0, 0, 2000); 
	scene.add(x.camGrup); 
	
	scene.add( new THREE.AmbientLight( 0xffffff, .5 ) );	

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
	renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 2;	
	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 	
	//renderer.shadowMap.autoUpdate = false; 
	//renderer.shadowMap.needsUpdate = true; 
	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
//	renderer.sortObjects = false;	
//	renderer.setAnimationLoop( animate ); 	
	
	ui.kontainer.appendChild(renderer.domElement); 
	
	
//	x.spotLcone = []; 
	
//	x.spotLight = []; 
//
//	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 600000, 400, Math.PI/8, 1 );
//	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
//	x.spotLight[0].position.set( 0, 300, 0 );
//	x.spotLight[0].castShadow = true;
//	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
//	x.spotLight[0].shadow.mapSize.width =  1024;
//	x.spotLight[0].shadow.mapSize.height = 1024; 
//	x.spotLight[0].shadow.camera.near = 1;
//	x.spotLight[0].shadow.camera.far = 400;
//	x.spotLight[0].shadow.camera.fov = 50;
////	x.spotLight[0].shadow.bias = -.00000015; 
//	//x.spotLight[0].shadow.focus = 1; 
//	//x.spotLight[0].shadowDarkness = 1.; 
//	//x.spotLight[0].power = 10000000;
//	
//	x.spotLight[0].shadow.intensity = .5;
//	
//	scene.add( x.spotLight[0] );	
//	//x.camGrup.add( x.spotLight[0] );	


	const dLSize = 1000,  
		  dLSize2 = 1000; 
	
	x.directionalLight = new THREE.DirectionalLight( 0xfffcf2, 2.8 );
	//x.directionalLight = new THREE.DirectionalLight( 0xffffff, 2.2 );
	x.directionalLight.castShadow = true; 
	x.directionalLight.shadow.mapSize.width = 1024; 
	x.directionalLight.shadow.mapSize.height = 1024; 
	x.directionalLight.shadow.camera.near = 1; 
	x.directionalLight.shadow.camera.far = 2000; 
	x.directionalLight.shadow.camera.left = -dLSize; 
	x.directionalLight.shadow.camera.bottom = -dLSize2; 
	x.directionalLight.shadow.camera.right = dLSize; 
	x.directionalLight.shadow.camera.top = dLSize2; 
	x.directionalLight.position.set( -600, 800, -600 );
//	x.directionalLight.shadow.intensity = .9; 
	scene.add( x.directionalLight );


	//const directionalLight = new THREE.DirectionalLight( 0xfffcf2, 3.2 );
	////const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
	//directionalLight.position.set( -1, 0, .4 ); 
	//directionalLight.castShadow = true; 
	//directionalLight.shadow.mapSize.width = 1024; 
	//directionalLight.shadow.mapSize.height = 1024;	
	//scene.add( directionalLight );
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	

	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	//const helper = new THREE.DirectionalLightHelper( x.directionalLight, 5 );
	////const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	//scene.add( helper );	
	//
	//const helperS = new THREE.CameraHelper( x.directionalLight.shadow.camera );
	////const helperS = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helperS );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .1;
    controls.autoRotateSpeed = -1;	
    //controls.autoRotate = true;    
    controls.minDistance = 0;
    controls.maxDistance = 6000;    
    controls.minPolarAngle = Math.PI/4;    
    controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = 1;
    controls.zoomSpeed = 2;
   // controls.enablePan = false;
    controls.panSpeed = 2;
	//controls.update();		
	//controls.enabled = false; 

	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	//grups[0].add( x.spotLight[0] );	
//	grups[0].add(camera);	
	
	
	x.currGrup = 0; 
	
	x.target0 = new THREE.Object3D(); 
//	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	x.target0.position.set(0, 0, 0); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	x.directionalLight.target = x.target0; 
	
	
	x.camTarget = new THREE.Object3D(); 
	//x.camTarget.position.set(0, _.ej[5], 0); 
	x.camTarget.position.set(0, 0, 0); 
	scene.add(x.camTarget);	
	
	camera.lookAt(x.camTarget.position);
	
	controls.target = x.target0.position; 	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	//
	//const helperS = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helperS );		

	x.rotCam = false; 
	//x.inCar = true; 
	
	// Post-Processing
	//postProcessing = new THREE.PostProcessing( renderer );
	
	//addWetGround(); 

	addSkybox(); 
	//addSkybox2(); 
	
	//addClouds(); 


	
	//addSun(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	//const f = '.png'; 
	const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/7/' );
	//loader.setPath( 'img/skybox/22/66/' ); 
	//loader.setPath( 'img/skybox/22/67/' ); 

	loader.load( [
		'posx2'+f, 'negx2'+f,
		'posy'+f, 'negy'+f,
		'posz2'+f, 'negz2'+f	
		//'posx'+f, 'negx'+f,
		//'posy'+f, 'negy'+f,
		//'negz'+f, 'posz'+f
		//'posz'+f, 'negz'+f
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
		scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
	//	scene.backgroundRotation.y = 1.35; 
		scene.backgroundBlurriness = .01; 
		//scene.backgroundIntensity = .75; 
		
		scene.background = tx; 
	//	scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		//addSea(); 
		//addSea2(); 
		addMountain();
		
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

/*function addClouds() {
	//const geometry = new THREE.SphereGeometry( 3500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	//const geometry = new THREE.SphereGeometry( 2200, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
//	const geometry = new THREE.SphereGeometry( 1500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const geometry = new THREE.SphereGeometry( 3000, 32, 16 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	//material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
	domeClouds.position.y = -20; 
	domeClouds.rotation.y = Math.PI - .5; 
	//domeClouds.rotation.y = Math.random() * (Math.PI*2); 
	//domeClouds.rotation.y = 1.55; 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	//domeClouds.position.z = -50; 
	
	//console.log(domeClouds.rotation.y); 
	
	scene.add( domeClouds );
	//x.camGrup.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	//load1.load( 'img/skybox/0/mway3.jpg', function(tx) { 
	load1.load( 'img/skybox/0/mway1.jpg', function(tx) { 
		//tx.colorSpace = THREE.SRGBColorSpace; 
		//tx.colorSpace = THREE.LinearSRGBColorSpace; 	
	
		domeClouds.material.map = tx; 
		domeClouds.material.needsUpdate = true; 
	}); 	

	//load2.load( 'img/skybox/0/alpha3.jpg', function(tx2) { 
	//	domeClouds.material.alphaMap = tx2; 
	//	domeClouds.material.needsUpdate = true; 
	//}); 
	
}
*/

function addMountain() {
	
	//const geometry = new THREE.BoxGeometry( 100, 100, 100 );
	//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	//const mesh = new THREE.Mesh( geometry, material );
	//scene.add( mesh );	
	
	let meshCount = 0; 
	x.mountain = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/VOLCANO_02_OBJ/volcano 02_subdiv_01.obj', function ( object ) {
		
		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
	
				child.geometry.computeBoundingBox();		
					
				meshCount += 1; 
			}
			
		});	
		
		//console.log(object.children[0].geometry);
		
		const url2 = 'img/ground/0/', 
		//const url2 = 'obj/mountain/0/mat/', 
			  frm = 'jpg', 
			  posX = [-110, 0, 110]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xe1e1e1 } );
		
		//matr.transparent = true; 
		matr.wireframe = true; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
		
			x.mountain[i] = new THREE.Mesh( geom, matr );
			
			x.mountain[i].scale.set(.02, .025, .02); 
			x.mountain[i].position.set(0, florY-700, 0);
			x.mountain[i].rotation.set(0, Math.PI/-2, 0);
		
			x.mountain[i].castShadow = true; 
			x.mountain[i].receiveShadow = true; 
		
			grups[0].add(x.mountain[i]); 
			
		}
		
		scene.add(grups[0]); 
		//scene.add(x.mountain[i]); 
		
		const loader0 = new THREE.TextureLoader(),    
			  loader1 = new THREE.TextureLoader(),      
			  loader2 = new THREE.TextureLoader();     

		loader0.load( url2 + 'color0.jpg', function(tx0) { 	
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			//tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
			tx0.repeat.set(10, 10);    		
		
			matr.map = tx0; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false; 
			
		});  

		loader1.load( url2 + 'rough0.jpg', function(tx1) { 	
			tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
			//tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
			tx1.repeat.set(10, 10);  		
		
			matr.roughnessMap = tx1; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false; 
			
		});  

		loader2.load( url2 + 'normal0.jpg', function(tx2) { 	
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
			//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
			tx2.repeat.set(10, 10);  		
		
			matr.normalScale.set(2, 2);  
			matr.normalMap = tx2; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false;
		});  


		addClouds(); 
		//addSea2(); 
		//fadeScene(); 
	}); 
	
}	

function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	
	let posx = (Math.random() * 9200 - 4600),
		posy = (Math.random() * 1600 + 400),  	
		posz = (Math.random() * 9200 - 4600); 	
		
	if ((posx > -2000) && (posx < 2000) && (posz > -2000) && (posz < 2000)) {
		//let rndX = Math.random() < 0.5 ? -1 : 1, 
			//rndZ = Math.random() < 0.5 ? -1 : 1;
			
		posx *= 2.3; 
		posz *= 2.3; 
		
		//posx = 404 * rndX; 
		//posz = 384 * rndZ; 
		//posz = (Math.random() * -800 - 400);  
		//console.log(posx);
	}
		
	position.x = posx;
	position.y = posy;
	position.z = posz;
	
	rotation.x = posy * -.0004; 
	
	if (posz<0) rotation.x *= -1; 

	//rotation.y = Math.random() * 2 * Math.PI; 
	rotation.y = posx * .0004; 
	
	if (posz<0) rotation.y *= -1; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 2.6 + Math.random();
	scale.x = scale.y = scale.z = 1 + Math.random();

	return matrix.compose( position, quaternion, scale );
}

function addClouds() {
	x.clouds = []; 
	
	const geometry = new THREE.PlaneGeometry( 1200, 600 );
	const material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );
	
	//material.alphaTest = .5; 
	material.depthWrite = false; 
	material.transparent = true; 
	material.opacity = .15; 
	
	//const plane = new THREE.Mesh( geometry, material );
	//scene.add( plane );	
	
	for ( let i = 0; i < 2; i++ ) {	
		//const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		const lngth0 = geometry.attributes.position.array.length,   
			  qty = 500; 		
		
		//console.log(lngth0); 
	
		x.clouds[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
		//x.clouds[i].frustumCulled = true;
		//x.clouds[i].castShadow = true; 
		//x.clouds[i].receiveShadow = true;


		
		const geometryId0 = x.clouds[i].addGeometry( geometry );
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId0 = x.clouds[i].addInstance( geometryId0 );
		
			matrix = randomizeMatrix( matrix ); 

			x.clouds[i].setMatrixAt( instancedId0, matrix ); 				
		}
		
		//if (i==0) {
			grups[1].add(x.clouds[i]); 
		//} else {
			//grups[1].add(x.leaves[i]); 
			//grups[1].add(x.trunk[i]); 
		//}			
		
		x.clouds[i].visible = false; 
	}		
	
	const loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  url2 = 'img/temp/'; 

	loader1.load( url2 + '41.png', function(tx1) { 	
		material.map = material.alphaMap = tx1; 
		material.needsUpdate = true;
		
		for ( let l = 0; l < 2; l++ ) {	
			x.clouds[l].visible = true; 
		}
	});  
		
	addSea2(); 
	//fadeScene(); 
}

function addSea2() {
	const waterGeometry = new THREE.PlaneGeometry( 30000, 30000 );
	const loader = new THREE.TextureLoader();
	const waterNormals = loader.load( 'img/water/waternormals.jpg' );
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

	water = new WaterMesh(
		waterGeometry,
		{
			waterNormals: waterNormals,
			sunDirection: new THREE.Vector3(0, 1, 1),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 3.7
		}
	);

	water.position.y = florY-280;
	water.rotation.x = - Math.PI / 2;

	scene.add( water );	
	
	//water.sunDirection.value.copy( sun ).normalize();
	
	fadeScene(); 
}

	
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
	//	ui.swtchKam.style.visibility = "visible"; 	
//	} else {
//		ui.swtchKam.style.display = "none"; 
//	}
	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		//eL(ui.colPick, 0, 'touchstart', colPickClick); 
		//eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
		//eL(ui.colPick, 0, 'click', colPickClick); 
		//eL(ui.swtchKam, 0, 'click', swtchKamClick); 
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
	//	_.ej[1] = -5; 
		_.ej[1] = -10; 
	} else {
		spotLz = -42; 
		camera.position.y = x.target0.position.y = 70; 
	//	_.ej[1] = -1; 
		_.ej[1] = -5; 
	}
		
	for ( let i = 0; i < 2; i++ ) {	
		x.spotLight[i].position.z = spotLz; 
	}
	
	x.rotCam = !x.rotCam;  
	
	_.idleTimer = 0; 
}
*/

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


	//x.zz = 100; 
	
	if (_.width > _.height) {
	//	cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
		//camera.position.z = 37; 
		//console.log(camera.position.z); 
		
		//if (isMobil) x.xx = 800;
	//	x.zz = ((_.height / _.width) < .44) ? 200 : 300; 
		x.zz = 5000;
		
		//x.edge = (_.width / _.height) * 650; 
		
		//if (x.tree) x.tree.scale.set(.59, .59, .68); 
		
		x.xx = 160; 
	} else {
	//	cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		//camera.position.z = 51; 
		
		//if (isMobil) x.xx = 100; 
	//	x.zz = ((_.width / _.height) < .5) ? 550 : 400; 
		x.zz = 5200; 
		
		//x.edge = (_.width / _.height) * 900; 
		
		//if (x.tree) x.tree.scale.set(.4, .4, .48);  \
		
		x.xx = 190; 
	}		
	
	//camera.position.x = x.xx; 
	camera.position.z = x.zz; 
	
	grups[0].position.x = x.xx; 
	//grups[0].position.z = x.zz; 
	
	//x.edge = Math.abs(x.edge); 
	
	_.idleTimer = 0; 
}


function animWalk() {
	let x0 = x.camGrup.position.x, 
		x1 = x.target0.position.x; 
	
	//console.log(z0);
		
	switch (x0) {
		case -1497: 
			x.spotLight[1].position.x = x.spotLcone[1].position.x = x.target[1].position.x = 0;		
		
			break; 
		case -750: 
			x.spotLight[2].position.x = x.spotLcone[2].position.x = x.target[2].position.x = 750;		
		
			break; 
		case 0: 
			x.spotLight[0].position.x = x.spotLcone[0].position.x = x.target[0].position.x = 1500;		
		
			break; 
		case 750: 
			x.spotLight[1].position.x = x.spotLcone[1].position.x = x.target[1].position.x = 2250;		
		
			break; 
		case 1500: 
			x.spotLight[2].position.x = x.spotLcone[2].position.x = x.target[2].position.x = -1500;		
			x.spotLight[0].position.x = x.spotLcone[0].position.x = x.target[0].position.x = -750;		
		
			break; 
		default: 
	
	}		
		
		
	//if (z0 == _.ej[0]) {
	if (x0 < _.ej[0]) {
		x.camGrup.position.x = x0 + _.ej[1]; 
		x.target0.position.x = x1 + _.ej[1]; 
		//console.log(x.camGrup.position.x);
	} else {
		x.camGrup.position.x = _.ej[3]; 
		
		x.target0.position.x = _.ej[3]; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
		x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
	}
	
	//let posX = 0; 
	//
	//for ( let i = 0; i < 3; i++ ) {
	//	x.spotLight[i].position.x = ;
	//	x.spotLcone[i].position.x = ;
	//	x.target[i].position.x = ;
	//}
	
	
	
}


function animate() { 
	//console.log('anim'); 
 //   requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		const delta = clock.getDelta() * .4; 
		//console.log( Math.sin(delta) ); 
		

		x.clouds[0].rotation.y = Math.cos(timer*.13); 
		x.clouds[0].rotation.y = Math.cos(timer*.1); 
		
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
	camera.lookAt(x.camTarget.position);
	
	
	//if (x.Sun) x.Sun.lookAt(camera.position);
	//x.beam2.lookAt(camera.position);
	//x.beam2.rotateY = x.beam2.rotateZ = 0; 
	//x.beam2.rotation.y = x.beam2.rotation.z = 0; 
	
	//x.mGlow.lookAt(camera.position); 	
	
//	x.mGlow.lookAt(camera.getWorldPosition(x.camV3)); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
	controls.update(); 
	
	//x.spotLightHelper.update();
	
//	camera.getWorldPosition(x.targetCam.position); 
	//console.log(x.targetCam.position); 
	
	//x.targetCam.position.set(camera.position.x, 235, camera.position.z); 
//	x.targetCam.position.y = 235; 
//	x.targetCam.position.y = 221; 
	
//	for ( let i = 0; i < 3; i++ ) {
//		x.spotLcone[i].lookAt(x.targetCam.position); 		
//	}
	
	renderer.render( scene, camera );	
	//renderer.renderAsync( scene, camera );	
	//postProcessing.render(); 
	
	//console.log(renderer.info); 
	//console.log(renderer.info.render.calls); 
	//console.log(renderer.info.render.drawCalls); 
}




function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
		//let url = 'mntn';
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
		//let url = 'nghtdrv'; 	
		//let url = 'otrnstfe'; 		
		//let url = 'cybrpnk'; 		
		//let url = 'smmr'; 		
		//let url = 'sfx/electronic-whales-35156'; 		
		//let url = 'spcwhl'; 		
		//let url = 'tmntr'; 		
		let url = 'rns'; 		
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
			x.sound.setVolume( 0.9 ); 
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
	}
	
}
	
/*	
function addProjector() {
	// Lights

	const causticEffect = Fn( ( [ projectorUV ] ) => {

		//const waterLayer0 = mx_worley_noise_float( projectorUV.mul( 10 ).add( time ) );
		const waterLayer0 = mx_worley_noise_float( projectorUV.mul( 30 ).add( time ) );

		//const caustic = waterLayer0.mul( color( 0x5abcd8 ) ).mul( 2 );
		const caustic = waterLayer0.mul( color( 0x5abcd8 ) ).mul( 1 );

		return caustic;

	} );	
	
	const projectorLight = new THREE.ProjectorLight( 0xffffff, 33000000 );
	projectorLight.colorNode = causticEffect;
	projectorLight.position.set( 0, 1500, 0 );
	projectorLight.angle = Math.PI / 4;
	projectorLight.penumbra = 1;
	projectorLight.decay = 2;
	projectorLight.distance = 2500;

	projectorLight.castShadow = false;
	projectorLight.shadow.mapSize.width = 1024;
	projectorLight.shadow.mapSize.height = 1024;
	projectorLight.shadow.camera.near = 1;
	projectorLight.shadow.camera.far = 2500;
	projectorLight.shadow.focus = 1;
	//projectorLight.shadow.bias = - .003;
	
	scene.add( projectorLight );	
	
	const projTarget = new THREE.Object3D(); 
	projTarget.position.set(0, 0, -100); 
	scene.add(projTarget);
	
	projectorLight.target = projTarget; 	
	
	//const lightHelper = new THREE.SpotLightHelper( projectorLight );
	//scene.add( lightHelper );
	
	const geometry = new THREE.PlaneGeometry( 0, 0 );
	const material = new THREE.MeshLambertMaterial( { color: 0x000000 } );
    
	const mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 0, - 1000, 0 );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );				
	
	//const geometry2 = new THREE.PlaneGeometry( 1000, 1000 );
	//const material2 = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    //
	//const mesh2 = new THREE.Mesh( geometry2, material2 );
	//mesh2.position.set( 0, 50, 740 );
	//mesh2.rotation.x = - Math.PI / 2;
	//mesh2.receiveShadow = true;
	//scene.add( mesh2 );				
	
	//const geometry3 = new THREE.PlaneGeometry( 150, 150 );
	//const material3 = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    //
	//const mesh3 = new THREE.Mesh( geometry3, material3 );
	//mesh3.position.set( 0, 70, 740 );
	//mesh3.rotation.x = - Math.PI / 2;
	//mesh3.castShadow = true;
	//scene.add( mesh3 );				
	
}	
*/
