/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import * as THREE from 'three2';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import WebGPU from 'three/addons/capabilities/WebGPU.js';

//import { vec3, Fn, time, texture3D, screenUV, uniform, screenCoordinate, pass } from 'three/tsl'; 	// volume lite
//import { reflector, uv, texture, color } from 'three/tsl'; 	// mirror
//import { Fn, reflector, uv, texture, color, mx_worley_noise_float, time } from 'three/tsl'; 	// mirror

import { Fn, color, mx_worley_noise_float, time } from 'three/tsl';

//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
//import { bayer16 } from 'three/addons/tsl/math/Bayer.js';
//import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
			
//import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';

//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
//import { WaterMesh } from 'three/addons/objects/WaterMesh.js';	// gpu
//import { SkyMesh } from 'three/addons/objects/SkyMesh.js';	// gpu
//import { LensflareMesh, LensflareElement } from 'three/addons/objects/LensflareMesh.js';	// gpu
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


const idleTO = 120, florY = -50, ceilY = 140;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer, mixer2; 
const ui = {}, _ = {}, x = {}; 

//let cntnt, cntnt2, cntnt3; 

//let cubeCamera, cubeRenderTarget;

let postProcessing, volumetricMesh, pointLight; 

//let domeClouds; 

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
		kontainer.style.background = "url('img/spacewhalel.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#404755';		

	const fogCol = 0x404755; 


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
	_.ej[5] = 50;			//70 or 35	
	
	//x.xx = 400; 
	x.zz = 800; 


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
//	scene.fog = new THREE.FogExp2(fogCol, 0.0006);	
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
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 12000 ); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], x.zz); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		

	//x.camGrup.position.set(0, 0, _.ej[3]); 
//	x.camGrup.position.set(0, 0, 2000); 
	scene.add(x.camGrup); 
	
	scene.add( new THREE.AmbientLight( 0xcacaca ) );	

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
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
	renderer.sortObjects = false;	
//	renderer.setAnimationLoop( animate ); 	
	ui.kontainer.appendChild(renderer.domElement); 
	
	
//	x.spotLcone = []; 
	
	x.spotLight = []; 

	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 30000, 300, Math.PI/12, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 11, 200, 700 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width =  1024;
	x.spotLight[0].shadow.mapSize.height = 1024; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 300;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = .7;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	


/*	const dLSize = 1000,  
		  dLSize2 = 1000; 
	
	//x.directionalLight = new THREE.DirectionalLight( 0xfff2d8, 2.2 );
	x.directionalLight = new THREE.DirectionalLight( 0xffffff, 2.2 );
	x.directionalLight.castShadow = true; 
//	x.directionalLight.shadow.mapSize.width = 1536; 
//	x.directionalLight.shadow.mapSize.height = 1536; 
	//x.directionalLight.shadow.camera.near = 1; 
	x.directionalLight.shadow.camera.far = 3000; 
	x.directionalLight.shadow.camera.left = -dLSize; 
	x.directionalLight.shadow.camera.bottom = -dLSize2; 
	x.directionalLight.shadow.camera.right = dLSize; 
	x.directionalLight.shadow.camera.top = dLSize2; 
	x.directionalLight.position.set( 0, 2000, 0 );
	x.directionalLight.shadow.intensity = .75; 
	scene.add( x.directionalLight );
*/

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	

	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	//const helper = new THREE.DirectionalLightHelper( x.directionalLight, 5 );
	//scene.add( helper );	
	//
	//const helperS = new THREE.CameraHelper( x.directionalLight.shadow.camera );
	//const helperS = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helperS );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .1;
    controls.autoRotateSpeed = 1.5;	
  //  controls.autoRotate = true;    
    controls.minDistance = 0;
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    //controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = 1;
    controls.zoomSpeed = .5;
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
	x.target0.position.set(0, 0, 740); 
	scene.add(x.target0);
	
	x.spotLight[0].target = x.target0; 
//	x.directionalLight.target = x.target0; 
	
	
	x.camTarget = new THREE.Object3D(); 
	x.camTarget.position.set(0, _.ej[5], 0); 
	scene.add(x.camTarget);	
	
	camera.lookAt(x.camTarget.position);
	
//	controls.target = x.target0.position; 	

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

	//animWhale(); 
	
	addCliff(); 
	
	addProjector(); 
	
	//addMoon(); 
	//addSun(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	const f = '.png'; 
	//const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/5/' );
	//loader.setPath( 'img/skybox/21/' ); 

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		//'negz'+f, 'posz'+f
		'posz'+f, 'negz'+f
		//'left'+f, 'right'+f,
		//'top'+f, 'bottom'+f,
		//'back'+f, 'front'+f
		//'3'+f, '1'+f,
		//'5'+f, '4'+f,
		//'6'+f, '2'+f
	], function ( tx ) {
		//tx.flipY = true; 
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx.mapping = THREE.CubeRefractionMapping;	
		
		x.skybox = tx; 

	//	scene.backgroundRotation.set(0, Math.PI/2, 0); 
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		scene.backgroundRotation.y = 1.35; 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		animWhale(); 
	
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
	

}*/

function addCliff() {
	let meshCount = 0; 
	//x.materials2 = []; 
	//x.trunk = []; 
	//let matrix = []; 	

	const loader = new FBXLoader();
	
	loader.load( 'obj/rock/2/rock.fbx', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (100 / 180) * Math.PI); 
				
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

		//x.cliff = object; 
		
		//console.log(object.children[0].geometry); 
		
		const matr = []; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xb4b4b4, roughness: .9, metalness: 0 } );
			//matr[i].emissive.setHex(0xffffff); 
			matr[i].wireframe = true; 

			x.cliff = new THREE.Mesh( object.children[i].geometry, matr[i] ); 
			
			//if (i==0) {
			//	matr[i].metalness = .15; 
			//} else {
			//	matr[i].alphaTest = .5; 
			//}
			
			//matr[i].envMapIntensity = 2; 
			//matr[i].envMap = x.skybox; 
			
			//x.cliff.children[i].material = matr[i]; 
		}
		
		x.cliff.scale.set(40, 40, 40); 
		//x.cliff.scale.set(6.5, 6.5, 6.5); 
		//x.cliff.position.set(7, -15, 760);
		x.cliff.position.set(7, -14, 760);
		x.cliff.rotation.set(-.4, 0, 0);
		//x.cliff.castShadow = true; 
		x.cliff.receiveShadow = true; 
		
		scene.add(x.cliff); 

	
		const load0 = new THREE.TextureLoader(), 
			  load1 = new THREE.TextureLoader(), 
			  load2 = new THREE.TextureLoader(), 
			  //url2 = 'obj/rock/2/mat/'; 
			  url2 = 'img/ground/0/'; 
			
		load0.load( url2 + 'color0.jpg', function(tx0) { 
		//load0.load( url2 + 'Ground058_1K-JPG_Color.jpg', function(tx0) { 
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			//tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
			tx0.repeat.set(2, 2);    		
		
			x.cliff.material.map = tx0; 
			x.cliff.material.needsUpdate = true; 
			x.cliff.material.wireframe = false; 
		}); 				

		load1.load( url2 + 'rough0.jpg', function(tx1) { 
			tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
			//tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
			tx1.repeat.set(2, 2);    		
		
			x.cliff.material.roughnessMap = tx1; 
			x.cliff.material.needsUpdate = true; 
		}); 				

		load2.load( url2 + 'normal0.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
			//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
			tx2.repeat.set(2, 2);    		
		
			x.cliff.material.normalMap = tx2; 
			x.cliff.material.needsUpdate = true; 
		}); 				


		//fadeScene(); 
	}); 

}

function addMoon() {
	const geometry = new THREE.PlaneGeometry( 750, 750 );
	const material = new THREE.MeshBasicMaterial( { color: 0xd8eeff, transparent: true, opacity: .7 } );
	
	x.moon = new THREE.Mesh( geometry, material );
	
	x.moon.position.set(530, 500, -2400); 
	x.moon.visible = false; 
	
	scene.add( x.moon ); 
	
	const load0 = new THREE.TextureLoader(), 
		  load1 = new THREE.TextureLoader(), 
		  url2 = 'img/earth/moon/'; 
			
	load0.load( url2 + 'moon0.jpg', function(tx0) { 
		material.map = tx0; 
		material.needsUpdate = true; 
		x.moon.visible = true; 
		
		fadeScene(); 
	}); 			
	
	load1.load( url2 + 'alfa0.jpg', function(tx1) { 
		material.alphaMap = tx1; 
		material.needsUpdate = true; 
	}); 			
	
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

	//x.xx = 400; 
	x.zz = 800; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
		//camera.position.z = 37; 
		//console.log(camera.position.z); 
		
		//if (isMobil) x.xx = 800;
	//	x.zz = ((_.height / _.width) < .44) ? 200 : 300; 
		//x.zz = 300;
		
		x.edge = (_.width / _.height) * 650; 
		
		if (x.whale) x.whale.scale.set(.59, .59, .68); 
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		//camera.position.z = 51; 
		
		//if (isMobil) x.xx = 1100; 
	//	x.zz = ((_.width / _.height) < .5) ? 550 : 400; 
		//x.zz = 400; 
		
		x.edge = (_.width / _.height) * 900; 
		
		if (x.whale) x.whale.scale.set(.4, .4, .48);  
	}		
	
//	camera.position.z = x.zz; 
	
	x.edge = Math.abs(x.edge); 
	
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

function whaleMove() {
	let x0 = x.whale.position.x, 
		z0 = x.whale.position.z; 
		
	//console.log(z0);
		
	//if (z0 == _.ej[0]) {
//	if (x0 < _.ej[0]) {
	if (x0 > -x.edge) {
		x.whale.position.x = x0 - _.ej[1]; 
	//	x.whale.position.z = z0 - _.ej[1]; 
		//console.log(x.camGrup.position.x);
	} else {
	//	x.whale.position.x = _.ej[3]; 
		x.whale.position.x = x.edge; 
	//	x.whale.position.z = 300; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
		//x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
	}
	
	
}


function animate() { 
	//console.log('anim'); 
 //   requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		const delta = clock.getDelta(); 
		//console.log( Math.sin(delta) ); 
		
		//if ( mixer ) 
			mixer.update( delta  * .2 );		
			//mixer.update( delta  * -.7 );			
			mixer2.update( delta * .8 );			
			//mixer.update( (Math.sin(timer)) * delta * .4 );			
			//mixer.update( (Math.sin(timer) + 1.2) * delta * .2 );			

	//	animWalk(); 
		whaleMove(); 
	

		//const time = performance.now() / 3000; 
		
		
		if (isMobil) {
			camera.position.x = Math.sin(timer*.5) * 8; 
			camera.position.y = Math.cos(timer*.4) * 3 + _.ej[5];   
			//camera.position.z = x.zz - Math.abs(Math.sin(timer*.5) * 20); 
			//x.camGrup.rotation.y = Math.sin(timer/3) * Math.PI; 				
		} else {
			//const ptY = _.pointer.y * Math.PI/-3.5, 
			//	  ptX = _.pointer.x * Math.PI;  
			
			camera.position.x = _.pointer.x * 10; 
			camera.position.y = _.pointer.y * 3 + _.ej[5]; 
			//camera.position.z = x.zz - Math.abs(_.pointer.x * 40); 
			//x.camGrup.rotateY( (_.pointer.x * .005) % Math.PI ); 
			
			//x.target0.position.x = camera.position.x; 
		}		
		
		
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
	
	x.moon.lookAt(camera.position);
	
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
}


function animWhale() {
	let meshCount = 0; 
	//let url = 'whale/0/uploads_files_2454895_Whale';  
	//let url = 'whale/1/uploads_files_2799064_lowpoly_whale_cgtrader';  
	let url = 'whale/1/whale';  
	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry.name);
				
			//	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				//child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (180 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//if (meshCount == 1) {
					//child.castShadow = true; 
					//child.receiveShadow = true; 
				//}
				
				meshCount += 1; 
				
				//child.frustumCulled = false;				
			}
		} );	
		
		//console.log(meshCount); 
		//console.log(object);
		
		x.whale = object; 
		//x.whale.receiveShadow = true; 
		
		const matr = [], 
			  url2 = 'obj/whale/1/mat/', 
			  frm = 'jpg', 
			  kolor = [0xffffff], 
			  raf = [0.1];  
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.whale.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: raf[i], metalness: 0 } );
			//matr[i] = new THREE.MeshLambertMaterial( { color: kolor[i] } );
			//matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: 1, metalness: 0 } );
			matr[i].wireframe = true; 

			//if (i==0) {
			//	matr[i].wireframe = false; 
			//	
			//	matr[i].envMapIntensity = 6; 
			//	//matr[i].envMap = x.skybox; 				
			//	matr[i].envMap = scene.background; 				
			//}
			
			//if ((i==0) || (i==6)) {
			//	matr[i].wireframe = true; 
			//}
			
			x.whale.children[i].material = matr[i]; 
		}
		
	//	x.whale.scale.set(.5, .5, .57); 
		x.whale.scale.set(.59, .59, .68); 
		x.whale.position.set(0, 0, 0);
		//x.whale.rotation.set(Math.PI/-2, 0, 0);
		x.whale.rotation.y = Math.PI/2 + .5; 
		scene.add(x.whale); 

		
		mixer2 = new THREE.AnimationMixer( x.whale );
		//console.log( object );
		
		x.actions = []; 
		
		x.actions[0] = mixer2.clipAction( x.whale.animations[ 0 ] );
	//	x.actions[0] = mixer2.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//x.actions[0].weight = 1;
		mixer2.update( 0 );			

		
		const loader0 = new THREE.TextureLoader(),     
			  loader1 = new THREE.TextureLoader();    

		//loader0.load( url2 + 'Whale_Base_Color.jpg', function(tx0) { 	
		loader0.load( url2 + 'color0.jpg', function(tx0) { 	
			matr[0].map = tx0; 
			matr[0].needsUpdate = true; 
			     
			matr[0].wireframe = false; 	
			
			//tx0.minFilter = THREE.LinearFilter;
			//tx0.magFilter = THREE.LinearFilter;
			//tx0.generateMipmaps = false;
			//tx0.colorSpace = THREE.SRGBColorSpace;			
			//
			//x.spotLight[0].map = tx0; 
			
			//fadeScene(); 
		});  
		
		//loader1.load( url2 + 'Whale_Normal_Color.jpg', function(tx1) { 	
		loader1.load( url2 + 'normal0.jpg', function(tx1) { 	
			matr[0].normalScale.set(6, 6); 
			matr[0].normalMap = tx1; 
			matr[0].needsUpdate = true; 
		
			//fadeScene(); 
		});  
		
		//animFBX(); 
		animNaut(); 
		//anim8(); 
		
		//fadeScene(); 	
		
		//x.whale.visible = false; 
	} );
}

/*
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
				//child.receiveShadow = true; 
				
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
		const scl = .1; 
		
		x.char1.scale.set(scl, scl, scl); 
		
		//x.char1.position.set(0, florY-0, _.ej[0] -300); 

		x.char1.position.set(5, 32.8, 760); 
		x.char1.rotation.set(0, Math.PI + .5, 0);	
		//x.char1.rotation.set(0, .5, 0);	
		
		//x.char1.castShadow = true; 
		//x.char1.receiveShadow = true; 
		
		//x.camGrup.add( x.char1 ); 
		//grups[0].add( x.char1 ); 
		scene.add( x.char1 ); 
		
		//camera.lookAt(x.char1.position);
	//	x.spotLight[0].target = x.char1;
		
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
	//let url = 'teenb1/Sitting'; 		//mono
	//let url = 'teenb1/Sitting Idle'; 	//mono
	//let url = 'teenb1/breathidle'; 	//mono
	//let url = 'teenb1/idle'; 		//mono
	//let url = 'teenb1/walkhurry'; 	//mono
	//let url = 'teenb1/walkcareful'; 	//mono
	//let url = 'teenb1/walkstandard'; 	//mono
	//let url = 'teenb1/walkstrut'; 	//mono
	//let url = 'teenb1/walkhappy2'; 	//mono
	//let url = 'teenb1/walkhappy'; 	//mono
	//let url = 'teenb1/walkswag2'; 	//mono
	//let url = 'teenb1/walkswag'; 	//mono
	//let url = 'teenb1/flying'; 	//mono
	//let url = 'teenb1/lookbacklr'; 	//mono
	//let url = 'teenb1/lookingaround'; 	//mono
	let url = 'teenb1/lookingaround1a'; 	//mono
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
*/

function animNaut() {
	let url = 'naut/2/naut';  
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
				
				meshCount += 1; 
			}
		} );	
		
		//console.log(object.children[0].material); 
		//console.log(meshCount); 
		
		x.char1 = object; 
		
		let matr = [];  
			//url2 = 'obj/teenb1/mat/', 
		const url2 = 'obj/naut/2/mat/', 
			  frm = '.jpg', 
			  frm2 = '.jpeg', 
			  kolors = [0xeeeeee, 0xffffff, 0xffffff, 0x777777, 0x999999];
			  
		let	envI = 1; 
		
		//for ( let i = 0; i < 2; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			if (i<3) {
				matr[i] = new THREE.MeshStandardMaterial( { color: kolors[i], roughness: .62, metalness: .2 } );
			} else {
				//matr[i] = new THREE.MeshMatcapMaterial( { color: 0x888888, transparent: true, opacity: .55 } );
				//matr[i] = new THREE.MeshPhongMaterial( { color: kolors[i], shininess: 30, specular: 0xffffff } );
				if (i==3) {
					matr[i] = new THREE.MeshBasicMaterial( { color: kolors[i] } );
				} else {
					matr[i] = new THREE.MeshStandardMaterial( { color: kolors[i], roughness: 0, metalness: .7 } );
					//envI = 5; 
					envI = 3; 
				}
			}
			
			if (i==4)  {
				matr[i].envMap = x.skybox; 			
				matr[i].envMapIntensity = envI; 
				//matr[i].reflectivity = 10; 
			}
			
			x.char1.children[i].material = matr[i]; 
			//x.char1.children[0].material[i] = matr[i]; 
			
			//matr[i].dithering = true; 
		}
		
		//x.char1.castShadow = true; 
		//x.char1.receiveShadow = true; 

		//x.char1.children[0].material = matr; 
		//x.char1.children[0].material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, metalness: .2 } ); 
		
		//console.log(x.char1.children);
	
		//x.char1.frustumCulled = false;
		
		//x.char1 = new THREE.Mesh( object.children[0].geometry, matr ); 
		
		let load0 = new THREE.TextureLoader(),   
			load0b = new THREE.TextureLoader(),   
			load0c = new THREE.TextureLoader(),   
			load1 = new THREE.TextureLoader(),   
			load1b = new THREE.TextureLoader(),   
			load1c = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load2b = new THREE.TextureLoader(),   
			load2c = new THREE.TextureLoader();   
		
			
		load0.load( url2 + 'color0' + frm, function(tx0) { 	
			//for ( let j = 0; j < meshCount; j++ ) {	
		//	for ( let j = 0; j < 2; j++ ) {	
			//	matr[j].map = tx; 
				x.char1.children[0].material.map = tx0; 
				//x.char1.children[0].material.roughnessMap = tx0; 
				//matr[j].bumpScale = 1; 
				//matr[j].bumpMap = tx; 
				//matr[j].metalMap = tx; 
				//material.normalScale.set(-1, -1); 
				//material.normalMap = tx2; 
				x.char1.children[0].material.needsUpdate = true;
		//	}
		});  			

		load1.load( url2 + 'color1' + frm, function(tx1) { 	
			x.char1.children[1].material.map = tx1; 
			x.char1.children[1].material.needsUpdate = true;
		});  			
	
		load2.load( url2 + 'color2' + frm, function(tx2) { 	
			x.char1.children[2].material.map = tx2; 
			x.char1.children[2].material.needsUpdate = true;
		});  			
	
		load0b.load( url2 + 'normal0' + frm, function(tx0b) { 	
			x.char1.children[0].material.normalScale.set(2, 2); 
			x.char1.children[0].material.normalMap = tx0b; 
			x.char1.children[0].material.needsUpdate = true;
		});  			
	
		load1b.load( url2 + 'normal1' + frm, function(tx1b) { 	
			x.char1.children[1].material.normalScale.set(1.5, 1.5); 
			x.char1.children[1].material.normalMap = tx1b; 
			x.char1.children[1].material.needsUpdate = true;
		});  			
	
		load2b.load( url2 + 'normal2' + frm, function(tx2b) { 	
			x.char1.children[2].material.normalScale.set(1.5, 1.5); 
			x.char1.children[2].material.normalMap = tx2b; 
			x.char1.children[2].material.needsUpdate = true;
		});  			
	
		load0c.load( url2 + 'rough0' + frm, function(tx0c) { 	
			x.char1.children[0].material.roughnessMap = tx0c; 
			x.char1.children[0].material.needsUpdate = true;
		});  			
	
		load1c.load( url2 + 'rough1' + frm, function(tx1c) { 	
			x.char1.children[1].material.roughnessMap = tx1c; 
			x.char1.children[1].material.needsUpdate = true;
		});  			
	
		load2c.load( url2 + 'rough2' + frm, function(tx2c) { 	
			x.char1.children[2].material.roughnessMap = tx2c; 
			x.char1.children[2].material.needsUpdate = true;
		});  			
	
		x.char1.scale.set(.08, .08, .08); 
	//	x.char1.scale.set(.5, .5, .5); 
	//	x.char1.position.set(9.5, 34, 765); 
		x.char1.position.set(5, 31, 760); 
		//x.char1.position.set(0, 0, -300); 
	//	x.char1.position.set(0, 0, 1390); 
		//x.char1.position.set(0, florY, 1150); 
	//	x.char1.rotation.set(0, win.ej[2], 0);	
		x.char1.rotation.set(0, Math.PI + .2, 0);	
		
		scene.add( x.char1 ); 
		//camera.add( x.char1 ); 
		//x.camGrup.add( x.char1 ); 
		
		//x.spotLight[0].target = x.char1;
		
		anim8n(); 
		
		//fadeScene(); 	
	} );
}

function anim8n() {
	x.actions = []; 
	
	//let url = 'naut/2/falling'; 	//mono
	//let url = 'naut/2/threading'; 	//mono
	//let url = 'naut/2/moonwalk'; 	//mono
	let url = 'naut/2/HipHopDancing'; 	//mono
	//let url = 'naut/2/HipHopDancing2'; 	//mono

	url += '.fbx'; 
	
	const loader = new FBXLoader();
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//x.actions[0].setLoop(THREE.LoopOnce);
		//x.actions[0].setLoop(THREE.LoopRepeat);
		//x.actions[0].setLoop(THREE.LoopPingPong);
		
		mixer.update( 0 );	
		//mixer.update( 1 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		addMoon(); 
		//fadeScene(); 	
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
		//let url = 'nghtdrv'; 	
		//let url = 'otrnstfe'; 		
		//let url = 'cybrpnk'; 		
		//let url = 'smmr'; 		
		//let url = 'sfx/electronic-whales-35156'; 		
		let url = 'spcwhl'; 		
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

