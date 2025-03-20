/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import * as THREE from 'three2';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import WebGPU from 'three/addons/capabilities/WebGPU.js';

import { vec3, Fn, time, texture3D, screenUV, uniform, screenCoordinate, pass } from 'three/tsl';

//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import { bayer16 } from 'three/addons/tsl/math/Bayer.js';
import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
			
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';

//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
import { WaterMesh } from 'three/addons/objects/WaterMesh.js';
//import { SkyMesh } from 'three/addons/objects/SkyMesh.js';
//import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


const idleTO = 120, florY = -1, ceilY = 140;  

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

//console.log(x);
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
		kontainer.style.background = "url('img/lighthousel.jpg') center top no-repeat"; 
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

//function initGPU() {
	
//}
	
//function initGL() {
	
//}
	
function init() { 
	//console.log('init');

	function $(id) {
		return document.getElementById(id);
	}	
		
	ui.kontainer = $('kontainer'); 
	
	//ui.colPick = $('colPick'); 
//	ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.colPick.style.visibility = "hidden"; 
//	ui.swtchKam.style.visibility = "hidden"; 
	
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
    ui.kontainer.style.backgroundColor = '#222222';		

	const fogCol = 0x222222; 


	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 0; 			//1200 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 5;			//70 or 35	
	
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.001);	
	//scene.fog = new THREE.FogExp2(0x535f37, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	//grups[1] = new THREE.Group(); 
	//grups[2] = new THREE.Group(); 

	scene.add(grups[0]); 
	//scene.add(grups[1]); 
	//scene.add(grups[2]); 
	
	//grups[2].position.set(0, 0, 0); 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 10000 ); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], 200); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		

	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, 0, 0); 
	scene.add(x.camGrup); 
	
	scene.add( new THREE.AmbientLight( 0x999999 ) );	

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

	
	renderer = new THREE.WebGPURenderer();
	//renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 1.5;	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
	renderer.sortObjects = false;	
	renderer.setAnimationLoop( animate ); 	
	ui.kontainer.appendChild(renderer.domElement); 
	
	
//	x.spotLcone = []; 
	
	x.spotLight = []; 

	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 10000000, 2800, Math.PI/6, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 0, 1500, 100 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width =  1536;
	x.spotLight[0].shadow.mapSize.height = 1536; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 2800;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = .7;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

/*
	const dLSize = 7500,  
		  dLSize2 = 7500; 
	
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
	//const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
	directionalLight.castShadow = true; 
	//directionalLight.shadow.mapSize.width = 1024; 
	//directionalLight.shadow.mapSize.height = 1024; 
	//directionalLight.shadow.camera.near = 1; 
	directionalLight.shadow.camera.far = 7500;	
	directionalLight.shadow.camera.left = -dLSize; 
	directionalLight.shadow.camera.bottom = -dLSize2; 
	directionalLight.shadow.camera.right = dLSize; 
	directionalLight.shadow.camera.top = dLSize2; 
	directionalLight.position.set( 0, 1000, 0 );
	directionalLight.shadow.intensity = .9; 
	scene.add( directionalLight );
*/

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	

	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	//const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	//scene.add( helper );	
	
//	const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
	//const helper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
//	scene.add( helper );	
	
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
    controls.maxDistance = 1500;    
    //controls.minPolarAngle = Math.PI/3;    
    //controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = .1;
    controls.zoomSpeed = .5;
   // controls.enablePan = false;
    controls.panSpeed = 15;
	//controls.update();		
controls.enabled = false; 
*/
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	//grups[0].add( x.spotLight[0] );	
//	grups[0].add(camera);	
	
	
	//x.currGrup = 0; 
	
	x.target0 = new THREE.Object3D(); 
//	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	x.target0.position.set(0, _.ej[5], 0); 
	scene.add(x.target0);
	
	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
//	controls.target = x.target0.position; 	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	

	x.rotCam = false; 
	
	// Post-Processing
	//postProcessing = new THREE.PostProcessing( renderer );
	
	
	//addSkybox(); 
	//addSkybox2(); 
	addClouds(); 

	//addSea2();  
	
	//animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	

	
	//fadeScene(); 	
}

/*
function addSkybox() {
	const f = '.png'; 
	//const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/0/' );

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
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx.mapping = THREE.CubeRefractionMapping;	
		
		x.skybox = tx; 

	//	scene.backgroundRotation.set(0, Math.PI/2, 0); 
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addSea2(); 
		
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
*/

function addClouds() {
	const geometry = new THREE.SphereGeometry( 650, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	scene.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	load1.load( 'img/skybox/0/mway3.jpg', function(tx) { 
		domeClouds.material.map = tx; 
		domeClouds.material.needsUpdate = true; 
	}); 	

	/*load2.load( 'img/opac1.jpg', function(tx2) { 
		domeClouds.material.alphaMap = tx2; 
		domeClouds.material.needsUpdate = true; 
	}); 	*/
	
	addSea2(); 
}

function addSea2() {
	const waterGeometry = new THREE.PlaneGeometry( 1300, 1300 );

	x.sea = new WaterMesh(
		waterGeometry,
		{
			//textureWidth: 1280,
			//textureHeight: 1280,						
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x1d3e2f,
			//waterColor: 0x001e0f,
			distortionScale: 3.2
			//,
			//size: .1,
			//fog: scene.fog !== undefined
		}
	);

	x.sea.rotation.x = - Math.PI / 2;

	scene.add( x.sea );
	
	//const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .05; 	
	
	addFog3D(); 
	//addLiteHaus(); 
	
	//fadeScene(); 
}

function addLiteHaus() {
	let meshCount = 0; 
	x.litehaus = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/lighthouse/0/litehaus.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
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

		//x.litehaus = object; 

		
		//const matr = [], 
		const url2 = 'obj/lighthouse/0/mat/', 
			  frm = 'jpg', 
			  kolor = [0xaaaaaa, 0x888888, 0xffffff, 0xcccccc]; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			const geom = object.children[i].geometry,  
				//matr = new THREE.MeshBasicMaterial( { color: 0xffffff } );
				matr = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: .5, metalness: 0 } );
			
			//matr.transparent = true; 
			matr.wireframe = true; 
			//matr.opacity = 1; 
			//matr.side = 2; 
			//matr.alphaTest = .5; 
			//matr.envMap = x.skybox; 
			//matr.emissiveIntensity = 10;		
		
			x.litehaus[i] = new THREE.Mesh( geom, matr );
			
			//x.litehaus[i].scale.set(14, 14, 14); 
			//x.litehaus[i].position.set(0, 0, -100); 
			x.litehaus[i].rotation.set(Math.PI/-2, 0, 0);
			
			if (i==1) {
				matr.side = 2; 
				matr.shadowSide = THREE.BackSide; 
			}
			
			if (i!=2) {
				x.litehaus[i].castShadow = true; 
				x.litehaus[i].receiveShadow = true; 
			}
			
			//grups[0].add(x.litehaus[i]); 
			scene.add(x.litehaus[i]); 
		}
		
		//scene.add(grups[0]); 
		
		const loader0 = new THREE.TextureLoader(),    
			  loader1 = new THREE.TextureLoader(),     
			  loader2 = new THREE.TextureLoader(),     
			  loader3 = new THREE.TextureLoader();     

		loader0.load( url2 + 'color2.jpg', function(tx0) { 	
			x.litehaus[3].material.map = tx0; 
			x.litehaus[3].material.wireframe = false; 
			x.litehaus[3].material.needsUpdate = true; 
		});  

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			x.litehaus[1].material.map = tx1; 
			x.litehaus[1].material.wireframe = false; 
			x.litehaus[1].material.needsUpdate = true; 
		});  

		loader2.load( url2 + 'alfa0b.jpg', function(tx2) { 	
			x.litehaus[2].material.transparent = true; 
			x.litehaus[2].material.alphaMap = tx2; 
			x.litehaus[2].material.wireframe = false; 
			x.litehaus[2].material.depthWrite = false; 
			x.litehaus[2].material.needsUpdate = true; 
		});  

		loader3.load( url2 + 'color3.jpg', function(tx3) { 	
			x.litehaus[0].material.map = tx3; 
			x.litehaus[0].material.wireframe = false; 
			x.litehaus[0].material.needsUpdate = true; 
		});  

		const sunGeom = new THREE.PlaneGeometry( 100, 100 ); 
		const sunMater = new THREE.MeshBasicMaterial( { color: 0xfffaee, depthWrite: false, side: 2 } ); 
		sunMater.transparent = true; 
		sunMater.opacity = .7;  
		sunMater.wireframe = true; 
		
		x.Sun = new THREE.Mesh( sunGeom, sunMater ); 
		x.Sun.position.set(0, 67, -7); 
		//x.Sun.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
		scene.add( x.Sun );
		
		const load0 = new THREE.TextureLoader(); 		
		
		load0.load( 'img/sun/alfa2.jpg', function(tx0) { 
			sunMater.alphaMap = tx0; 
			sunMater.needsUpdate = true; 
			
			sunMater.wireframe = false; 
		}); 	
		
	//	const beamGeom = new THREE.PlaneGeometry( 340, 220 ); 
	//	const beamGeom = new THREE.PlaneGeometry( 680, 220 ); 
		const beamGeom = new THREE.BoxGeometry( 220, .0001, 680 ); 
		const beamMater = new THREE.MeshBasicMaterial( { color: 0xfffaee, depthWrite: false, side: 1 } ); 
		beamMater.transparent = true; 
		beamMater.opacity = .1;  
		beamMater.wireframe = true; 
		
		x.beam = new THREE.Mesh( beamGeom, beamMater ); 
	//	x.beam.position.set(-173, 65, -7); 
		x.beam.position.set(0, 65, -7); 
		//x.beam.position.set(0, 65, 0); 
	//	x.beam.rotation.set(Math.PI/2, 0, Math.PI); 
		x.beam.rotation.set(Math.PI/2, 0, 0); 
		scene.add( x.beam );		
		//grups[1].add( x.beam );		
		//grups[1].position.z = -7; 
		//scene.add(grups[1]);
		
	//	x.beam2 = new THREE.Mesh( beamGeom, beamMater ); 
	//	x.beam2.position.set(173, 65, -7); 
	//	x.beam2.rotation.set(Math.PI/2, 0, 0); 
	//	scene.add( x.beam2 );		
		//grups[2].add( x.beam2 );		
		
		const load1 = new THREE.TextureLoader(); 		
		
		load1.load( 'img/spotLcone2.jpg', function(tx1) { 
			tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
			//tx1.repeat.set(-2, 1);    
			tx1.repeat.set(1, 2);    
			//tx1.offset.set(1, 0);    
		//	tx1.offset.set(0, 1);    
			
			beamMater.alphaMap = tx1; 
			beamMater.needsUpdate = true; 
			
			beamMater.wireframe = false; 
		}); 	
			
		addBuoy(); 
		//addBoat(); 
		
		//fadeScene(); 
	}); 
}	

function addBuoy() {
	let meshCount = 0; 
	//x.buoy = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/buoy/0/buoy4.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.buoy = object; 
		//x.buoy.castShadow = true; 
		//x.buoy.receiveShadow = true; 
		
		const matr = [], 
			  url2 = 'obj/buoy/0/mat/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: .2 } );
			matr[i].wireframe = true; 
			
			x.buoy.children[i].material = matr[i]; 
		}
		
		x.buoy.scale.set(.2, .2, .2); 
		x.buoy.position.set(7, -.5, 155);
		x.buoy.rotation.set(0, Math.PI/2, 0);
		scene.add(x.buoy); 
		
		
		const loader1 = new THREE.TextureLoader();   

		loader1.load( url2 + 'color4.jpg', function(tx1) { 	
			x.buoy.children[0].material.map = tx1; 
			x.buoy.children[0].material.needsUpdate = true; 
			
			x.buoy.children[0].material.wireframe = false; 	
			//fadeScene(); 
		});  
		
		addBoat(); 
		//fadeScene(); 
	}); 
	
}	

function addBoat() {
	let meshCount = 0; 
	//x.boat = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/boat/0/boat.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.boat = object; 
		//x.boat.castShadow = true; 
		//x.boat.receiveShadow = true; 
		
		const matr = [], 
			  url2 = 'obj/boat/0/mat/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
			matr[i].wireframe = true; 
			
			x.boat.children[i].material = matr[i]; 
		}
		
		x.boat.scale.set(4.4, 4.4, 4.4); 
		//x.boat.position.set(30, 1, 0);
		x.boat.rotation.set(0, Math.PI/2, 0);
		grups[0].add(x.boat); 
		
		grups[0].position.set(-3.8, .9, 182);
		
		//scene.add(grups[0]); 
		
		const loader1 = new THREE.TextureLoader(),  
			  loader2 = new THREE.TextureLoader(),  
			  loader3 = new THREE.TextureLoader();   

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			x.boat.children[0].material.map = tx1; 
			x.boat.children[0].material.needsUpdate = true; 

			x.boat.children[0].material.wireframe = false; 			
			//fadeScene(); 
		});  
		
		loader2.load( url2 + 'rough1.jpg', function(tx2) { 	
			x.boat.children[0].material.roughnessMap = tx2; 
			x.boat.children[0].material.needsUpdate = true;
		});  
		
		loader3.load( url2 + 'normal1.jpg', function(tx3) { 	
			x.boat.children[0].material.normalMap = tx3; 
			x.boat.children[0].material.needsUpdate = true;
		});  
			
		animFBX(); 
		//fadeScene(); 
	}); 
	
}	

function createTexture3D() {
	let i = 0;

	const size = 128;
	const data = new Uint8Array( size * size * size );

	const scale = 10;
	const perlin = new ImprovedNoise();

	const repeatFactor = 5.0;

	for ( let z = 0; z < size; z ++ ) {
		for ( let y = 0; y < size; y ++ ) {
			for ( let x = 0; x < size; x ++ ) {
				const nx = ( x / size ) * repeatFactor;
				const ny = ( y / size ) * repeatFactor;
				const nz = ( z / size ) * repeatFactor;

				const noiseValue = perlin.noise( nx * scale, ny * scale, nz * scale );

				data[ i ] = ( 128 + 128 * noiseValue );

				i ++;
			}
		}
	}

	const texture = new THREE.Data3DTexture( data, size, size, size );
	texture.format = THREE.RedFormat;
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.unpackAlignment = 1;
	texture.needsUpdate = true;

	return texture;
}
			
function addFog3D() {
	//volumetricMesh; 	
	
	const LAYER_VOLUMETRIC_LIGHTING = 10;
					
	// Volumetric Fog Area

	const noiseTexture3D = createTexture3D();

	const smokeAmount = uniform( 1.5 );		// 2

	const volumetricMaterial = new THREE.VolumeNodeMaterial();
	volumetricMaterial.steps = 12;
	volumetricMaterial.offsetNode = bayer16( screenCoordinate ); // Add dithering to reduce banding
	volumetricMaterial.scatteringNode = Fn( ( { positionRay } ) => {
		// Return the amount of fog based on the noise texture
		const timeScaled = vec3( time, 0, time.mul( .3 ) );

		const sampleGrain = ( scale, timeScale = 1 ) => texture3D( noiseTexture3D, positionRay.add( timeScaled.mul( timeScale ) ).mul( scale ).mod( 1 ), 0 ).r.add( .5 );

		let density = sampleGrain( .1 );
		density = density.mul( sampleGrain( .05, 1 ) );
		density = density.mul( sampleGrain( .02, 2 ) );

		return smokeAmount.mix( 1, density );

	} );

	volumetricMesh = new THREE.Mesh( new THREE.BoxGeometry( 1300, 500, 1300 ), volumetricMaterial );
	//volumetricMesh = new THREE.Mesh( new THREE.TorusGeometry( 5, 3, 4, 4 ), volumetricMaterial );
	volumetricMesh.receiveShadow = true;
	volumetricMesh.position.y = 252;
	volumetricMesh.layers.disableAll();
	volumetricMesh.layers.enable( LAYER_VOLUMETRIC_LIGHTING );
	scene.add( volumetricMesh );		

	// Lights

	//pointLight = new THREE.PointLight( 0xfffaee, 200, 100 );
	pointLight = new THREE.PointLight( 0xfffaee, 1100, 650 ); 
	pointLight.castShadow = true;
	//pointLight.position.set( 0, 160, -300 );
	pointLight.position.set( 0, 65, -7 );
	pointLight.layers.enable( LAYER_VOLUMETRIC_LIGHTING );
	//lightBase.add( new THREE.Mesh( new THREE.SphereGeometry( 0.1, 16, 16 ), new THREE.MeshBasicMaterial( { color: 0xf9bb50 } ) ) );
	scene.add( pointLight );
	
/*	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 50000, 2800, Math.PI/6, 1 );
	x.spotLight[0].position.set( 0, 1500, 100 );
	x.spotLight[0].castShadow = true;
//	x.spotLight[0].shadow.mapSize.width =  2048;
//	x.spotLight[0].shadow.mapSize.height = 2048; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 2800;
	x.spotLight[0].shadow.camera.fov = 50;
	x.spotLight[0].shadow.bias = -.003; 
	//x.spotLight[0].shadow.intensity = .7;
	x.spotLight[0].layers.enable( LAYER_VOLUMETRIC_LIGHTING ); 
	scene.add( x.spotLight[0] );		
				
	x.target0 = new THREE.Object3D(); 
	x.target0.position.set(0, 10, 0); 
	scene.add(x.target0);
	
	x.spotLight[0].target = x.target0; 				
*/
				
	x.spotLight[1] = new THREE.SpotLight( 0xfffaee, 12000, 550, Math.PI/9.5, 1 );
	x.spotLight[1].position.set( 0, 67, -7 );
	x.spotLight[1].castShadow = true;
//	x.spotLight[1].shadow.mapSize.width =  2048;
//	x.spotLight[1].shadow.mapSize.height = 2048; 
	x.spotLight[1].shadow.camera.near = 1;
	x.spotLight[1].shadow.camera.far = 500;
	x.spotLight[1].shadow.camera.fov = 50;
	x.spotLight[1].shadow.bias = -.003; 
	//x.spotLight[1].shadow.intensity = .7;
	x.spotLight[1].layers.enable( LAYER_VOLUMETRIC_LIGHTING );
	scene.add( x.spotLight[1] );			
	//grups[1].add( x.spotLight[1] );			

	x.target1 = new THREE.Object3D(); 
	x.target1.position.set(-100, 67, -7); 
	scene.add(x.target1);
	//grups[1].add(x.target1);
	
	x.spotLight[1].target = x.target1; 
				
	x.spotLight[2] = new THREE.SpotLight( 0xfffaee, 12000, 550, Math.PI/9.5, 1 );
	x.spotLight[2].position.set( 0, 67, -7 );
	x.spotLight[2].castShadow = true;
//	x.spotLight[2].shadow.mapSize.width =  2048;
//	x.spotLight[2].shadow.mapSize.height = 2048; 
	x.spotLight[2].shadow.camera.near = 1;
	x.spotLight[2].shadow.camera.far = 500;
	x.spotLight[2].shadow.camera.fov = 50;
	x.spotLight[2].shadow.bias = -.003; 
	//x.spotLight[2].shadow.intensity = .7;
	x.spotLight[2].layers.enable( LAYER_VOLUMETRIC_LIGHTING );
	scene.add( x.spotLight[2] );			
	//grups[1].add( x.spotLight[2] );			

	x.target2 = new THREE.Object3D(); 
	x.target2.position.set(100, 67, -7); 
	scene.add(x.target2);
	//grups[1].add(x.target2);
	
	x.spotLight[2].target = x.target2; 
				
				
	// Post-Processing

	postProcessing = new THREE.PostProcessing( renderer );			

	
	// Layers

	const volumetricLightingIntensity = uniform( 1 ); 	// fog intensity 1

	const volumetricLayer = new THREE.Layers();
	volumetricLayer.disableAll();
	volumetricLayer.enable( LAYER_VOLUMETRIC_LIGHTING );

	// Scene Pass

	const scenePass = pass( scene, camera );
	const sceneLinearDepth = scenePass.getTextureNode( 'depth' );

	// Material - Apply occlusion depth of volumetric lighting based on the scene depth

	volumetricMaterial.depthNode = sceneLinearDepth.sample( screenUV );

	// Volumetric Lighting Pass

	const volumetricPass = pass( scene, camera, { depthBuffer: false } );
	volumetricPass.setLayers( volumetricLayer );
	volumetricPass.setResolution( .17 );	// .25

	// Compose and Denoise

	const denoiseStrength = uniform( .56 );	// .6

	const blurredVolumetricPass = gaussianBlur( volumetricPass, denoiseStrength );

	const scenePassColor = scenePass.add( blurredVolumetricPass.mul( volumetricLightingIntensity ) );

	postProcessing.outputNode = scenePassColor;	
	
	addLiteHaus(); 
	//fadeScene(); 		
}
			
			
/*function addReflect() {
	cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
	cubeRenderTarget.texture.type = THREE.HalfFloatType;

	cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget ); 
	cubeCamera.position.z = 150; 
	
	x.room.children[10].material.envMap = cubeRenderTarget.texture; 
	x.room.children[10].material.needsUpdate = true; 
	
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
 
			x.fogIdx = 0; 
			x.fogInc = 1; 
			
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
        }
    })();	
}	

function theOptions() {
	//ui.swtchKam = document.getElementById('swtchKam'); 
	//ui.onAud = document.getElementById('onAud'); 
	//ui.offAud = document.getElementById('offAud'); 
	
	//ui.colPick.style.visibility = "visible";
	
//	if (!isMobil) {
//		ui.swtchKam.style.visibility = "visible"; 	
//	} else {
//		ui.swtchKam.style.display = "none"; 
//	}
	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		//eL(ui.colPick, 0, 'touchstart', colPickClick); 
	//	eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
		//eL(ui.colPick, 0, 'click', colPickClick); 
	//	eL(ui.swtchKam, 0, 'click', swtchKamClick); 
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
/*
function swtchKamClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
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

		x.rotCam = true; 
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

/*
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
		
		x.target0.position.z = _.ej[3] - 200; 
		
		grups[0].position.z *= -1; 
		grups[1].position.z *= -1; 
		
		x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
		x.fogIdx += x.fogInc; 
		if ((x.fogIdx == 0)	|| (x.fogIdx == 8)) x.fogInc *= -1; 	
		
		const fogCol = [0xd4dbe0, 0xc4cbd0, 0xb4bbc0, 0xa4abb0, 0x949ba0, 0x848b90, 0x747b80, 0x646b70, 0x545b60]; 
		
		scene.fog.color.setHex(fogCol[x.fogIdx]); 
		//scene.fog.color.setRGB(1, 1, 1); 
		renderer.setClearColor(fogCol[x.fogIdx], 1.0);		
		
		//console.log('pass'); 		
	}
	
}
*/

function animate() { 
	//console.log('anim'); 
 //   requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		const delta = clock.getDelta()  * .5; 
		if ( mixer ) mixer.update( delta );			
		
	//	x.camGrup.rotation.y = Math.sin(timer*.5) * Math.PI/4.5; 

		if (isMobil) {
		//if (x.rotCam) {
			//camera.position.x += Math.cos(timer*.5) * 50; 
			//camera.position.y += Math.sin(timer*.5) * 20; 
			camera.position.x = Math.sin(timer*.3) * 23; 
			camera.position.y = Math.sin(timer*.2) * 16 + 17; 
			//camera.position.z = x.zz - (Math.abs(camera.position.x) * .25); 
			//console.log(camera.position.z); 
		} else {
			//camera.position.x += _.pointer.x * 1; 
			//camera.position.y += (_.pointer.y * 1);
			camera.position.x = _.pointer.x * 23; 
			camera.position.y = (_.pointer.y * 16) + 17; 
			//camera.position.z = (Math.abs(_.pointer.y) * 200); 
		}
		
		camera.position.z = camera.position.y * 1.5 + 188 - (Math.abs(camera.position.x * .6)); 

/*	

*/
		
		const mSin8 = Math.sin(timer*.8); 
		
		if (x.char1) grups[0].rotation.set(mSin8 * .04, 0, Math.sin(timer) * .07); 
		
		if (x.buoy) {
			x.buoy.rotation.set(Math.cos(timer) * .2, 0, mSin8 * .2); 
			x.buoy.position.y = mSin8 * .3 - .7; 
		}
		
		if (x.target2) {
			const mSin5 = timer*.5;  
			
			x.target1.position.set(Math.sin(mSin5) * 100, 67, Math.cos(mSin5) * 100 -7); 
			//x.target1.position.set(mSin5 * -1, 67, mSin5 - 7); 
			x.target2.position.set(x.target1.position.x * -1, 67, x.target1.position.z * -1); 
			
			//if (x.beam) x.beam.rotation.z = Math.sin(Math.abs(mSin5)) * (Math.PI*2); 	
			if (x.beam) x.beam.lookAt(x.target1.position);  	
				//grups[1].rotation.y += Math.PI/2; 
				//x.beam.rotation.z = 0;
				//x.beam.rotation.x = 0;
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
	camera.lookAt(x.target0.position);
	if (x.Sun) x.Sun.lookAt(camera.position);
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
	
	//renderer.render( scene, camera );	
	//renderer.renderAsync( scene, camera );	
	postProcessing.render(); 
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
		const scl = .03; 
		
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
		x.char1.position.set(0, -1.2, 1.3); 
		x.char1.rotation.set(0, Math.PI, 0);	
		
		//x.camGrup.add( x.char1 ); 
		grups[0].add( x.char1 ); 
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
	let url = 'teenb1/Sitting'; 	//mono
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
	//let url = 'teenb1/walkswag'; 	//mono
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
		let url = 'lghths'; 			
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
	
	