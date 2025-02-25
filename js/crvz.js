/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
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

//console.log(x);
// temp
let controls; 


if ( WebGL.isWebGL2Available() ) {
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
} else {		
	const warning = WebGL.getWebGL2ErrorMessage();
    kontainer.appendChild(warning);	
	
	//kontainer.style.background = "url('img/thewebdesignerprol.jpg') center top no-repeat"; 
	kontainer.style.background = "url('img/carvizl.jpg') center top no-repeat"; 
	kontainer.style.backgroundSize = "cover"; 
	
 	fader.style.opacity = 0;
    fader.style.display = "none";
	fader.parentNode.removeChild(fader);	
	
	cL(loadr, 0, "paus");
	loadr.style.display = "none";	
	loadr.parentNode.removeChild(loadr);		
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
	function $(id) {
		return document.getElementById(id);
	}	
		
	ui.kontainer = $('kontainer'); 
	
	ui.colPick = $('colPick'); 
//	ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	ui.colPick.style.visibility = "hidden"; 
//	ui.swtchKam.style.visibility = "hidden"; 
	
	ui.fcp = $('fcp'); 
	
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
    ui.kontainer.style.backgroundColor = '#eaeff2';		

	const fogCol = 0xeaeff2; 
//	const fogCol = 0xd0d4d6; 
	//const fogCol = 0xe7f9ff; 
	//const fogCol = 0xd4dbe0; 

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
	_.ej[5] = 10;			//70 or 35	
	
	//x.xx = 400; 
	x.zz = 450; 

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.0002);	
	//scene.fog = new THREE.FogExp2(0x535f37, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 10000 ); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], 37); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0xeeeeee ) );	

	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 5000000, 1500, Math.PI/8, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 700, 700, 400 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width =  2048;
	x.spotLight[0].shadow.mapSize.height = 2048; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 1500;
	x.spotLight[0].shadow.camera.fov = 50;
	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .7;
	
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
	
	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, 0, 0); 
	scene.add(x.camGrup); 
	
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
	
	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .1;
    controls.autoRotateSpeed = 1.5;	
    controls.autoRotate = true;    
    controls.minDistance = 30;
    controls.maxDistance = 80;    
    controls.minPolarAngle = Math.PI/3;    
    controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = 1;
    controls.enablePan = false;
    controls.panSpeed = 8;
	//controls.update();		
//controls.enabled = false; 

	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	//grups[0].add( x.spotLight[0] );	
//	grups[0].add(camera);	
	
	_.mouse = new THREE.Vector2(); 	
	_.entro = true; 
	_.idleTimer = 0; 
	_.fokus = true; 
	
	//_.raycaster = new THREE.Raycaster();
	_.pointer = new THREE.Vector2();

	_.ptrDown = false; 

	
	x.currGrup = 0; 
	
	x.target0 = new THREE.Object3D(); 
//	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	x.target0.position.set(0, _.ej[5] - 5, 0); 
	scene.add(x.target0);
	
	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
	controls.target = x.target0.position; 	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	

	x.rotCam = false; 
	
	addSkybox(); 
	addSkybox2(); 
	//addClouds(); 

	//addSea(); 
	
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
		'posz'+f, 'negz'+f
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
		
	//	scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addCar(); 
		addStage(); 
		
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

function addSkybox2() {
	const f = '.png'; 
	//const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/3/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
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
		
	//	x.skybox = tx; 

		scene.backgroundRotation.set(0, Math.PI/2, 0); 
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		scene.background = tx; 
		//scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
	} );

}

/*
function addClouds() {
	const geometry = new THREE.SphereGeometry( 4900, 24, 12, 0, Math.PI ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
	domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	scene.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	load1.load( 'img/clouds1.jpg', function(tx) { 
		domeClouds.material.map = tx; 
		domeClouds.material.needsUpdate = true; 
	}); 	

	load2.load( 'img/opac1.jpg', function(tx2) { 
		domeClouds.material.alphaMap = tx2; 
		domeClouds.material.needsUpdate = true; 
	}); 	
}
*/

function addStage() {
	let meshCount = 0; 
	//x.stage = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/stage/0/stage.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.name);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//if (meshCount != 10) 
				//child.castShadow = true; 
				//child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.stage = object; 
		
	//	x.stage.position.set(0, -100, 0); 
		x.stage.rotation.set(Math.PI/-2, 0, 0); 
	//	x.stage.scale.set(20, 20, 20); 
		
		const matr = [], 
			  url2 = 'obj/stage/0/mat/', 
			  frm = 'jpg',   
			  kolor = [0xffffff], 
			  raf = [1, 1];   
			  //bakal = [0, 0, 0, 0, 0, 0];
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 

			/*if (i==1) {
				matr[i] = new THREE.MeshPhongMaterial( { color: kolor[0], emissive: 0x5e676f } ); 
				//matr[i].side = 2; 
				matr[i].transparent = true; 
				matr[i].opacity = .88; 
				//matr[i].roughness = 0;
				matr[i].reflectivity = .8;
				matr[i].envMap = x.skybox; 
			} else {		*/
				matr[i] = new THREE.MeshBasicMaterial( { color: kolor[0] } );
				//matr[i] = new THREE.MeshStandardMaterial( { color: kolor[0], roughness: raf[0], metalness: 0 } );
				matr[i].wireframe = true; 
				//matr[i].alphaTest = .5; 
				//matr[i].shadowSide = 1; 
			//}
			
			//if (i==3) matr[i].shadowSide = 2; 
			//if (i==5) matr[i].shadowSide = 2; 
			
			//if (i==1) {
			//	matr[i].transparent = true; 
			//	matr[i].opacity = 0; 
			//}
			
			x.stage.children[i].material = matr[i]; 
		}
		
		//grups[0].position.set(0, -100, 0); 
		//grups[0].rotation.set(Math.PI/-2, 0, Math.PI/-2); 
		grups[0].add(x.stage); 
		
		scene.add(grups[0]); 

		//x.spotLight[0].target = x.stage; 
		
	
		const loader0 = new THREE.TextureLoader(),  
			  loader1 = new THREE.TextureLoader(),    
			  loader2 = new THREE.TextureLoader();   

		loader0.load( url2 + 'color2b.jpg', function(tx0) { 	
			matr[0].map = tx0; 
			matr[0].needsUpdate = true; 
			
			matr[0].wireframe = false; 
			
			fadeScene(); 
		});  
		
		loader1.load( url2 + 'color1b.jpg', function(tx1) { 	
			matr[1].map = tx1; 
			matr[1].needsUpdate = true; 
			
			matr[1].wireframe = false; 
		});  
		
		loader2.load( url2 + 'color0b.jpg', function(tx2) { 	
			matr[2].map = tx2; 
			matr[2].needsUpdate = true; 
			
			matr[2].wireframe = false; 
		});  
		
		const pGeom = new THREE.PlaneGeometry( 35, 50 );
		const pMatr = new THREE.ShadowMaterial();
		//pMatr.transparent = false; 
		pMatr.opacity = .7; 
		
		const Pane = new THREE.Mesh( pGeom, pMatr );
		Pane.position.set(-6, .05, -2.5); 
		Pane.rotation.set(Math.PI/-2, 0, 0); 
		Pane.receiveShadow = true; 
		
		scene.add( Pane );
		
		//fadeScene(); 
	}); 
	
}	

function addCar() {
	let meshCount = 0; 
	//x.car = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/car/7/car.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.name);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.normalizeNormals(); 
				
			//	child.geometry.deleteAttribute( 'normal' );
			//	child.geometry = BufferGeometryUtils.mergeVertices( child.geometry );

			//	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (50 / 180) * Math.PI); 
//				if ((meshCount == 4) || (meshCount == 7)) 
//					child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
			//	child.geometry.computeVertexNormals(); 
				//child.geometry.computeTangents(); 
				//child.geometry.verticesNeedUpdate = true; 
				//child.geometry.computeBoundingBox();		
				
				//child.frustumCulled = false;				
				
				//if (meshCount == 6) child.geometry.computeVertexNormals();	
//				child.geometry.computeBoundingBox();		
				
				if ((meshCount != 0) && (meshCount != 5)) child.castShadow = true; 
				child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.car = object; 
		
		x.car.position.set(0, .1, 0); 
//		x.car.rotation.set(Math.PI/-2, 0, 0); 
		x.car.scale.set(.1, .1, .1); 
		//x.car.castShadow = true; 
		//x.car.receiveShadow = true; 

		const matr = [], 
			  url2 = 'obj/car/7/mat/', 
			  frm = 'jpg',   
			//  kolor = [0xffffff, 0x888888, 0xeeeeee, 0xffffff, 0xbbbbbb, 0xeeeeee, 0x999999, 0xbbbbbb, 0x707070], 
			  kolor = [0xffffff, 0x888888, 0xeeeeee, 0xbbbbbb, 0xbbbbbb, 0xeeeeee, 0x999999, 0xbbbbbb, 0x707070], 
			  raf =   [ 0, .6, .8, .8,  0,  0, .8,  0, 1],  
			  bakal = [.9, .1, .4, .4, .4, .9, .8, .4, 0]; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 

			/*if (i==1) {
				matr[i] = new THREE.MeshPhongMaterial( { color: kolor[0], emissive: 0x5e676f } ); 
				//matr[i].side = 2; 
				matr[i].transparent = true; 
				matr[i].opacity = .88; 
				//matr[i].roughness = 0;
				matr[i].reflectivity = .8;
				matr[i].envMap = x.skybox; 
			} else {		*/
				matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: raf[i], metalness: bakal[i] } );
				matr[i].wireframe = true; 
				//matr[i].alphaTest = .5; 
				//matr[i].shadowSide = 1; 
			//}
			
			if (i==0) {
				matr[i].transparent = true; 
				matr[i].opacity = .6; 
				//matr[i].side = 2; 
			//	matr[i].reflectivity = 9; 
			//	matr[i].envMapIntensity = 9; 
				matr[i].envMap = x.skybox; 
				matr[i].wireframe = false; 
			}			

			if (i==1) matr[i].wireframe = false; 
			
			//if (i==2) {
			//	//matr[i].reflectivity = 9; 
			//	matr[i].envMap = x.skybox; 			
			//}
			
			if (i==3) {
				//matr[i].reflectivity = 9; 
				matr[i].envMap = x.skybox; 			
			}
			
			if ((i==4) || (i==7)) {
				//matr[i].reflectivity = 1; 
				matr[i].envMap = x.skybox; 
				matr[i].wireframe = false; 
			}				
			
			if (i==5) {
				matr[i].transparent = true; 
				matr[i].opacity = .7; 
				//matr[i].side = 1; 
			//	matr[i].reflectivity = 9; 
				matr[i].envMap = x.skybox; 
				matr[i].wireframe = false; 
			}			
			
			//if (i==5) matr[i].shadowSide = 2; 
			
//			if ((i==0) || (i==5)) {
//				matr[i].transparent = true; 
//				matr[i].opacity = 0; 
//				//matr[i].color.setHex(0x00ff00); 
//			}

			//if (i!=2) {
			//	matr[i].transparent = true; 
			//	matr[i].opacity = 0; 
			//}
			
			x.car.children[i].material = matr[i]; 
		}
		
		//grups[0].position.set(0, -100, 0); 
		//grups[0].rotation.set(Math.PI/-2, 0, Math.PI/-2); 
		grups[0].add(x.car); 
		
		// 0 - glass 1 - trims 2 - misc1 3 - rims 4 - frame 5 - lights 6 - grills 7 - doors 8 - wheels Int   
	
		const loader2 = new THREE.TextureLoader(),    
			  loader2b = new THREE.TextureLoader(), 
			  loader2c = new THREE.TextureLoader(),
			  loader2d = new THREE.TextureLoader(),			  
			  loader3 = new THREE.TextureLoader(),
			  loader3b = new THREE.TextureLoader(),
			  loader3c = new THREE.TextureLoader(),
			  loader3d = new THREE.TextureLoader(),    
			  loader6 = new THREE.TextureLoader(),   			  
			  loader7 = new THREE.TextureLoader();   

		loader2.load( url2 + 'kz1oemcolor2.jpg', function(tx2) { 	
		//loader2.load( url2 + 'temp.jpg', function(tx2) { 	
		//loader2.load( 'img/uv_grid_opengl.jpg', function(tx2) { 	
			matr[2].map = tx2; 
			matr[2].needsUpdate = true; 
			     
			matr[2].wireframe = false; 
		});  
		
		loader2b.load( url2 + 'kz1oemmetal.jpg', function(tx2b) { 	
			//matr[2].metalness = .3; 
			matr[2].metalnessMap = matr[6].metalnessMap = tx2b; 
			matr[2].needsUpdate = matr[6].needsUpdate = true; 
		});  
		
		loader2c.load( url2 + 'kz1oemnormal.jpg', function(tx2c) { 	
			matr[2].normalScale.set(.5, .5); 
			matr[6].normalScale.set(.5, .5); 
			matr[2].normalMap = matr[6].normalMap = tx2c; 
			matr[2].needsUpdate = matr[6].needsUpdate = true; 
		});  
		
		loader2d.load( url2 + 'kz1oemrough.jpg', function(tx2d) { 	
			matr[2].roughnessMap = matr[6].roughnessMap = tx2d; 
			matr[2].needsUpdate = matr[6].needsUpdate = true; 
		});  	

		loader3.load( url2 + 'wheelcolor2.jpg', function(tx3) { 	
			matr[3].map = matr[8].map = tx3; 
			matr[3].needsUpdate = matr[8].needsUpdate = true; 
			     
			matr[3].wireframe = matr[8].wireframe = false; 
		});  
		
		loader3b.load( url2 + 'wheelmetal.jpg', function(tx3b) { 	
			//matr[3].metalness = .3; 
			matr[3].metalnessMap = tx3b; 
			matr[3].needsUpdate = true; 
		});  
		
		loader3c.load( url2 + 'wheelnormal.jpg', function(tx3c) { 	
			matr[3].normalScale.set(.5, .5); 
			matr[3].normalMap = tx3c; 
			matr[3].needsUpdate = true; 
		});  
		
		loader3d.load( url2 + 'wheelrough.jpg', function(tx3d) { 	
			matr[3].roughnessMap = tx3d; 
			matr[3].needsUpdate = true; 
		});  	

		loader6.load( url2 + 'kz1oemcolorb.jpg', function(tx6) { 	
		//loader6.load( url2 + 'temp.jpg', function(tx6) { 	
			matr[6].alphaTest = .5; 
			matr[6].map = matr[6].alphaMap = tx6; 
			matr[6].needsUpdate = true; 
			     
			matr[6].wireframe = false; 
		});  
		
		//loader7.load( url2 + 'kz1c1normal.jpg', function(tx7) { 	
		//	//matr[7].normalScale.set(.5, .5); 
		//	//matr[7].normalMap = tx7; 
		//	matr[7].needsUpdate = true; 
		//	     7
		//	matr[7].wireframe = false; 
		//}); 		

		
		const light = [], 
			  lightMater = [];
			  
		const lightGeom0 = new THREE.PlaneGeometry( .77, .77, 8, 8 );
		lightMater[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, transparent: true, opacity: .8 } );
		lightMater[0].wireframe = true; 
		
		light[0] = new THREE.Mesh( lightGeom0, lightMater[0] );
		light[0].position.set(-5.2, 3.37, 20.28); 
		
		grups[0].add( light[0] );
		
		const lightGeom2 = new THREE.PlaneGeometry( .87, .87, 6, 6 );
		lightMater[2] = new THREE.MeshStandardMaterial( { color: 0xffffff, transparent: true, opacity: .9 } );
		lightMater[2].wireframe = true; 
		lightMater[2].side = 1; 
		
		light[2] = new THREE.Mesh( lightGeom2, lightMater[2] );
		light[2].position.set(-6.84, 8.15, -19.2); 
		
		grups[0].add( light[2] );
		
		const lightGeom3 = new THREE.PlaneGeometry( .89, .89, 6, 6 );
		lightMater[3] = new THREE.MeshStandardMaterial( { color: 0xffffff, transparent: true, opacity: .9 } );
		lightMater[3].wireframe = true; 
		lightMater[3].side = 1; 
		
		light[3] = new THREE.Mesh( lightGeom3, lightMater[3] );
		light[3].position.set(-5.28, 8.31, -19.68); 
		
		grups[0].add( light[3] );
		
		const lightGeom4 = new THREE.PlaneGeometry( 2.2, .6, 6, 2 );
		lightMater[4] = new THREE.MeshStandardMaterial( { color: 0xffffff, transparent: true, opacity: .95 } );
		//lightMater[4] = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: .9 } );
		lightMater[4].wireframe = true; 
		lightMater[4].side = 1; 
		
		light[4] = new THREE.Mesh( lightGeom4, lightMater[4] );
	//	light[4].position.set(-7.02, 2.76, -18.95); 
		light[4].position.set(-6.97, 2.757, -18.95); 
		light[4].rotation.set(0, .55, .02); 
		
		grups[0].add( light[4] );
		
		const lightGeom5 = new THREE.PlaneGeometry( .86, .83 );
		lightMater[5] = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true } );
		lightMater[5].wireframe = true; 
		lightMater[5].side = 1; 
		
		light[5] = new THREE.Mesh( lightGeom5, lightMater[5] );
		light[5].position.set(-5., 3.44, -20.25); 
		//light[5].rotation.set(0, .555, .02); 
		
		grups[0].add( light[5] );
		
		// side mirror
		
		const lightGeom6 = new THREE.PlaneGeometry( 1.5, 1 );
		lightMater[6] = new THREE.MeshStandardMaterial( { color: 0xeeeeee, roughness: 0, metalness: .7, alphaTest: .5 } );
		lightMater[6].wireframe = true; 
		
		light[6] = new THREE.Mesh( lightGeom6, lightMater[6] );
		light[6].position.set(10.161, 9.179, 3.964); 
		light[6].rotation.set(0, Math.PI/180 * -142.8, 0); 
		//light[6].rotation.set(0, -2.4923, 0); 
		
		grups[0].add( light[6] );
	
		//const lightGeom6 = new THREE.PlaneGeometry( 1.5, 1 );
		lightMater[7] = new THREE.MeshStandardMaterial( { color: 0xeeeeee, roughness: 0, metalness: .7, alphaTest: .5 } );
		lightMater[7].wireframe = true; 
		lightMater[7].side = 1; 
		
		light[7] = new THREE.Mesh( lightGeom6, lightMater[7] );
		light[7].position.set(-10.161, 9.179, 3.964); 
	//	light[7].rotation.set(0, Math.PI/180 * -37.2, 0); 
		light[7].rotation.set(0, -.649, 0); 
		
		grups[0].add( light[7] );
		
		
		const loadLight1 = new THREE.TextureLoader(),  
		      loadLight3 = new THREE.TextureLoader(),  
		      loadLight4 = new THREE.TextureLoader(),  
		      loadLight5 = new THREE.TextureLoader(),  
		      loadLight5a = new THREE.TextureLoader(),  
		      loadLight6 = new THREE.TextureLoader(),  
		      loadLightd = new THREE.TextureLoader(); 
			   
		
		loadLight1.load( url2 + 'light1.jpg', function(txl1) { 	
			lightMater[0].map = lightMater[0].alphaMap = txl1; 
			lightMater[0].needsUpdate = true; 
			           
			lightMater[0].wireframe = false; 
		});  		
		
		loadLight3.load( url2 + 'light3.jpg', function(txl3) { 	
			lightMater[2].map = lightMater[2].alphaMap = lightMater[3].alphaMap = txl3; 
			lightMater[2].needsUpdate = lightMater[3].needsUpdate = true; 
			           
			lightMater[2].wireframe = false; 
		});  		
		
		loadLight4.load( url2 + 'light4.jpg', function(txl4) { 	
			lightMater[3].map = txl4; 
			lightMater[3].needsUpdate = true; 
			           
			lightMater[3].wireframe = false; 
		});  		
		
		loadLight5.load( url2 + 'light5.jpg', function(txl5) { 	
			lightMater[4].map = txl5; 
			lightMater[4].needsUpdate = true; 
			           
			lightMater[4].wireframe = false; 
		});  		
		
		loadLight5a.load( url2 + 'light5a.jpg', function(txl5a) { 	
			lightMater[4].alphaMap = txl5a; 
			lightMater[4].needsUpdate = true; 
		});  		
		
		loadLight6.load( url2 + 'sidemirror.jpg', function(txl6) { 	
			lightMater[6].alphaMap = lightMater[7].alphaMap = txl6; 
			lightMater[6].envMap = lightMater[7].envMap = x.skybox; 
			lightMater[6].needsUpdate = lightMater[7].needsUpdate = true; 
			           
			lightMater[6].wireframe = lightMater[7].wireframe = false; 
		});  		
		
		loadLightd.load( 'img/opac2t.jpg', function(txld) { 	
			lightMater[0].displacementScale = .1; 
			lightMater[2].displacementScale = lightMater[3].displacementScale = -.08; 
			lightMater[4].displacementScale = -.1; 			
			
			for (let i=0; i<5; i++) {
				if (i!=1) {
					lightMater[i].displacementMap = txld; 
					lightMater[i].needsUpdate = true; 
				}
			}
			
			lightMater[5].alphaMap = txld; 
			lightMater[5].wireframe = false; 
			lightMater[5].needsUpdate = true; 
		});  		
		
		//fadeScene(); 
	}); 
	
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
		if (!((val -= .05) < 0)) {
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
			
			animate();  
			
			theOptions(); 
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			x.fogIdx = 0; 
			x.fogInc = 1; 
			
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
        }
    })();	
}	

function theOptions() {
	//ui.swtchKam = document.getElementById('swtchKam'); 
	//ui.onAud = document.getElementById('onAud'); 
	//ui.offAud = document.getElementById('offAud'); 
	
	ui.colPick.style.visibility = "visible";
	
//	if (!isMobil) {
//		ui.swtchKam.style.visibility = "visible"; 	
//	} else {
//		ui.swtchKam.style.display = "none"; 
//	}
	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		eL(ui.colPick, 0, 'touchstart', colPickClick); 
	//	eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
		eL(ui.colPick, 0, 'click', colPickClick); 
	//	eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);		
	}	 
	
}

function colPickClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
	cL(ui.fcp, 0, "scale1"); 
	
	_.idleTimer = 0; 
}

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
	
	cL(ui.fcp, 1, "scale1"); 

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
	
		camera.position.z = 37; 
		//console.log(camera.position.z); 
		
		//if (isMobil) x.xx = 800;
		x.zz = 450;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		camera.position.z = 51; 
		
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
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
/*	//	x.camGrup.rotation.y = Math.sin(timer*.5) * Math.PI/4.5; 

	//	if (isMobil) {
		if (x.rotCam) {
			//camera.position.x += Math.cos(timer*.5) * 50; 
			//camera.position.y += Math.sin(timer*.5) * 20; 
			camera.position.x = Math.sin(timer*.35) * 220; 
			camera.position.y = Math.sin(timer*.2) * 120 + 30; 
			camera.position.z = x.zz - (Math.abs(camera.position.x) * .25); 
			//console.log(camera.position.z); 
		} else {
			//camera.position.x += _.pointer.x * 1; 
			//camera.position.y += (_.pointer.y * 1);
			camera.position.x = _.pointer.x * 220; 
			camera.position.y = (_.pointer.y * 120) + 30; 
			camera.position.z = x.zz - (Math.abs(_.pointer.x) * 50); 
		}

	
		if ((_.idleTimer % 5) == 0) {
			const colT = 0xffffff * Math.sin(timer); 
			//const colT = 0xffffff * .1; 
			//console.log(_.idleTimer); 
			
			x.car.children[3].material.color.setHex(colT); 
			x.car.children[4].material.color.setHex(colT); 
			x.car.children[7].material.color.setHex(colT); 
		}
*/
		
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
	
	//x.mGlow.lookAt(camera.position); 	
	
	//x.mGlow.lookAt(camera.getWorldPosition(x.camV3)); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
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
		let url = 'crvz'; 			
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
	
	