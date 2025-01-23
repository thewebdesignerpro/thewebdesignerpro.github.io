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
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';

const idleTO = 120, florY = -10, ceilY = 140;  

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
//let controls; 


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
	kontainer.style.background = "url('img/spacesiml.jpg') center top no-repeat"; 
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
	
//	ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
//	ui.swtchKam.style.visibility = "hidden"; 
	
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
	_.ej[3] = 7233; 		//1200 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 0;			//70 or 35	
	
	x.xx = 400; 

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 20000 ); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], -100); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x5e5e5e ) );	

	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 22000000, 7000, Math.PI/32, 1 );
//	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 100000000, 10000, Math.PI/8, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	//x.spotLight[0].position.set( 0, 5000, 7400 );
	x.spotLight[0].position.set( 0, 3000, 7133 );
	//x.spotLight[0].position.set( 5000, 2000, 2500 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width = 256;
	x.spotLight[0].shadow.mapSize.height = 256;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 50;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .8;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

/*
	x.spotLight[1] = new THREE.SpotLight( 0xffeecc, 1500, 28, Math.PI/5.8, 1 );
//	x.spotLight[1].position.set( 0, 10.65, -1 );
	x.spotLight[1].position.set( 0, 10.65, 0 );
	x.spotLight[1].castShadow = true;
	x.spotLight[1].shadow.mapSize.width = 64;
	x.spotLight[1].shadow.mapSize.height = 64;
	x.spotLight[1].shadow.camera.near = 1;
	x.spotLight[1].shadow.camera.far = 28;
	x.spotLight[1].shadow.camera.fov = 40;
	x.spotLight[1].shadow.intensity = .5;
	
//	scene.add( x.spotLight[1] );	
*/

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
//	scene.add( directionalLight );


	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	
	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, 0, 0); 
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
//	const dirLight = new THREE.DirectionalLight( 0xffffff, 2 );
//	dirLight.position.set( 0, 3000, -1000 );
	//dirLight.castShadow = true; 
	//dirLight.shadow.camera.near = 10; 
	//dirLight.shadow.camera.far = 5000; 	
//	scene.add( dirLight );	
	
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
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    //controls.autoRotate = true;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 10000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .3;
    controls.zoomSpeed = 2;
    controls.panSpeed = 8;
	//controls.update();		
controls.enabled = false; 
*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
//	grups[0] = new THREE.Group(); 
	//grups[1] = new THREE.Group(); 
	//grups[2] = new THREE.Group(); 
	
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
	x.target0.position.set(0, _.ej[5] / 2, x.camGrup.position.z - 300); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
//	x.target1 = new THREE.Object3D(); 
//	x.target1.position.set(0, 0, x.camGrup.position.z - 1); 
//	x.target1.position.set(0, 50, x.camGrup.position.z); 
//	x.target1.position.set(0, 0, x.camGrup.position.z); 
//	scene.add(x.target1);
	
	//camera.position.y = 80; 
	//camera.lookAt(x.target1.position);
	
//	x.spotLight[1].target = x.target1; 
	
//	controls.target = x.target1.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	//const helper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helper );
	
	addSkybox(); 
	//addClouds(); 
	//addStarfields(); 
	
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
	loader.setPath( 'img/skybox/5/' );
	//loader.setPath( 'img/skybox/11/' );

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
		//tx.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx.mapping = THREE.CubeRefractionMapping;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		//scene.backgroundRotation.set(0, 3.8, 0); 
	//	scene.backgroundRotation.set(0, (Math.PI/-2) + .64, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = 3; 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		//addFog(); 
		
		addStarfields(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

function addStarfields() {
	const geometry = []; 
	x.starField = []; 
	x.starMater = []; 
	const count = 2; 
	//const posZ = [5000, 0, -5000, 5000, 0, -5000]; 
	//const scale = [1, 1, 1, 5, 5, 5]; 
	//const scale = [1, 5]; 
	const rotY = [0, Math.PI/4]; 
	
	geometry[0] = new THREE.CylinderGeometry( 10, 500, 15000, 24, 1, true ); 
	geometry[1] = new THREE.CylinderGeometry( 30, 1500, 15000, 24, 1, true ); 

	for ( let i = 0; i < count; i++ ) {		
		x.starMater[i] = new THREE.MeshBasicMaterial( {color: 0xffffff, side: 1} ); 
		x.starMater[i].transparent = true; 
		x.starMater[i].alphaTest = .5; 
		//x.starMater.wireframe = true; 
	
		//x.starMater[1] = new THREE.MeshBasicMaterial( {color: 0xffffff, side: 1} ); 	
	
		x.starField[i] = new THREE.Mesh( geometry[i], x.starMater[i] ); 
		//x.starField[i].position.z = posZ[i]; 
		x.starField[i].rotation.set(-Math.PI/2, rotY[i], 0); 
		
		//x.starField[i].scale.set(scale[i], 1, scale[i] ); 
		
		scene.add( x.starField[i] );
	}

	const load0 = new THREE.TextureLoader(),  
		  load1 = new THREE.TextureLoader(); 
	
	load0.load( 'img/starz.jpg', function(tx0) { 
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		//tx0.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(8, 2);   
		
		x.starMater[0].map = x.starMater[0].alphaMap = tx0; 
		x.starMater[0].needsUpdate = true; 
		
		//fadeScene(); 
	}); 
	
	load1.load( 'img/starz.jpg', function(tx1) { 
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(16, 4);   
		
		x.starMater[1].map = x.starMater[1].alphaMap = tx1; 
		x.starMater[1].needsUpdate = true; 
	}); 

	addCockpit(); 	
}

function addCockpit() {
	let meshCount = 0; 
	//x.cockpit = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/ship/0/cckpt.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				if ((meshCount == 0) || (meshCount == 2) || (meshCount == 6) || (meshCount == 8)) {
					child.castShadow = true; 
					child.receiveShadow = true; 
				}
				
				if (meshCount == 6) child.position.set(0, -40, 55); 
				if (meshCount == 3) child.position.set(0, -90, 77.7); 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.cockpit = object; 
		
		// 0 = right bar; 1 = left glass; 2 = left bar; 3 = screen 1; 4 = right glass; 5 = screen 2; 
		// 6 = steering; 7 = windshield; 8 = frame; 9 = screen 3; 
		
		const matr = [], 
			  url2 = 'obj/ship/0/mat/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			if ((i == 3) || (i == 5) || (i == 9)) {
				matr[i] = new THREE.MeshBasicMaterial( { color: 0xffffff } );
			} else {
				matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, metalness: 0 } );
			}
			
			x.cockpit.children[i].material = matr[i]; 
			
			if ((i == 0) || (i == 2) || (i == 6) || (i == 8)) {
				matr[i].metalness = 1; 
				matr[i].emissive.set(0xffffff); 
			}
			
			if ((i == 1) || (i == 4) || (i == 7)) {
				matr[i].transparent = true; 			
				matr[i].opacity = .5;
				matr[i].side = 2;
				matr[i].metalness = 1; 
				
				//matr[i].envMapIntensity = 10; 
				matr[i].envMap = x.skybox; 
			}
			
			if ((i == 3) || (i == 5) || (i == 9)) {
				matr[i].transparent = true; 
				//matr[i].depthWrite = false; 
			}
			
		}
		
	//	grups[0].position.set(0, 0, 7367); 
		grups[0].position.set(0, -50, 7100); 
		grups[0].rotation.set(Math.PI/-2, 0, Math.PI); 
		//grups[0].rotation.set(0, 0, 0); 
		grups[0].add(x.cockpit); 
		
		scene.add(grups[0]); 

		x.spotLight[0].target = x.cockpit; 
		
		const loader3a = new THREE.TextureLoader(),  
			  loader3b = new THREE.TextureLoader(),  
			  loader3c = new THREE.TextureLoader(),	
			  loader7a = new THREE.TextureLoader(), 
			  loader7b = new THREE.TextureLoader(), 
			  loader7c = new THREE.TextureLoader(), 
			  loader8a = new THREE.TextureLoader(), 
			  loader8b = new THREE.TextureLoader(), 
			  loader8c = new THREE.TextureLoader(), 
			  loader8d = new THREE.TextureLoader(), 
			  loader8e = new THREE.TextureLoader(); 
  

		loader7a.load( url2 + 'color2.jpg', function(tx7a) { 	
			const idx7a = [1, 4, 7]; 
			
			for ( let f = 0; f < 3; f++ ) {	
				x.cockpit.children[idx7a[f]].material.map = tx7a; 
				x.cockpit.children[idx7a[f]].material.needsUpdate = true;
			}
		});  
		
		loader7b.load( url2 + 'rough2.jpg', function(tx7b) { 	
			const idx7b = [1, 4, 7];  
			
			for ( let g = 0; g < 3; g++ ) {	
				x.cockpit.children[idx7b[g]].material.roughnessMap = tx7b; 
				x.cockpit.children[idx7b[g]].material.needsUpdate = true;
			}		
		});  
		
		loader7c.load( url2 + 'metal2.jpg', function(tx7c) { 	
			const idx7c = [1, 4, 7];  
			
			for ( let h = 0; h < 3; h++ ) {	
				x.cockpit.children[idx7c[h]].material.metalnessMap = tx7c; 
				x.cockpit.children[idx7c[h]].material.needsUpdate = true;
			}		
		});  
			
			
		loader8a.load( url2 + 'color1.jpg', function(tx8a) { 	
			const idxA = [0, 2, 6, 8]; 
			
			for ( let j = 0; j < 4; j++ ) {	
				x.cockpit.children[idxA[j]].material.map = tx8a; 
				x.cockpit.children[idxA[j]].material.needsUpdate = true;
				
				//	x.trunk[l].visible = true; 
			}
		});  
		
		loader8b.load( url2 + 'normal1.jpg', function(tx8b) { 	
			const idxB = [0, 2, 6, 8]; 
			
			for ( let k = 0; k < 4; k++ ) {	
				x.cockpit.children[idxB[k]].material.normalMap = tx8b; 
				x.cockpit.children[idxB[k]].material.needsUpdate = true;
			}		
		});  
		
		loader8c.load( url2 + 'rough1.jpg', function(tx8c) { 	
			const idxC = [0, 2, 6, 8]; 
			
			for ( let l = 0; l < 4; l++ ) {	
				x.cockpit.children[idxC[l]].material.roughnessMap = tx8c; 
				x.cockpit.children[idxC[l]].material.needsUpdate = true;
			}		
		});  
		
		loader8d.load( url2 + 'metal1.jpg', function(tx8d) { 	
			const idxD = [0, 2, 6, 8]; 
			
			for ( let m = 0; m < 4; m++ ) {	
				x.cockpit.children[idxD[m]].material.metalnessMap = tx8d; 
				x.cockpit.children[idxD[m]].material.needsUpdate = true;
			}		
		});  
		
		loader8e.load( url2 + 'emissive1.jpg', function(tx8e) { 	
			const idxE = [0, 2, 6, 8]; 
			
			for ( let n = 0; n < 4; n++ ) {	
				x.cockpit.children[idxE[n]].material.emissiveMap = tx8e; 
				x.cockpit.children[idxE[n]].material.needsUpdate = true;
			}		
		});  
		
		loader3a.load( url2 + 'screen1a.jpg', function(tx3a) { 	
			x.cockpit.children[3].material.map = tx3a; 
			x.cockpit.children[3].material.needsUpdate = true;
		});  
		
		loader3b.load( url2 + 'screen2a.jpg', function(tx3b) { 	
			x.cockpit.children[5].material.map = tx3b; 
			x.cockpit.children[5].material.needsUpdate = true;
		});  
		
		loader3c.load( url2 + 'screen3a.jpg', function(tx3c) { 	
			x.cockpit.children[9].material.map = tx3c; 
			x.cockpit.children[9].material.needsUpdate = true;
		});  
		


		fadeScene(); 
	}); 
	
	
	//fadeScene(); 
}	



	
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
			//eL(ui.kontainer, 0, "wheel", wheelE); 
			
			x.camV3 = new THREE.Vector3(); 			
			
			animate();  
			
			theOptions(); 
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			x.fogIdx = 0; 
			x.fogInc = 1; 
        }
    })();	
}	

function theOptions() {
	//ui.swtchKam = document.getElementById('swtchKam'); 
	//ui.onAud = document.getElementById('onAud'); 
	//ui.offAud = document.getElementById('offAud'); 

//	ui.swtchKam.style.visibility = "visible"; 	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
	//	eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
	//	eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);		
	}	 
	
}

/*
function swtchKamClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
//	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//back or front 1 or -1
//	_.ej[1] = 0; 			//front or back -1 or 1
//	_.ej[1] = -2; 			//front or back -1 or 1	
//	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
//	_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z	
//

	if (_.ej[2] == 0) {
		_.ej[0] = 0; 		//0 or 3000 - camGrup pos z	
		_.ej[1] = -2; 		//front or back -1 or 1	
		_.ej[2] = Math.PI;	//Math.PI or 0	
		_.ej[3] = 3000;		//3000 or 0 - camGrup pos z
		
		//x.currGrup = 0; 
	} else {
		_.ej[0] = 3000; 	//0 or 3000 - camGrup pos z	
		_.ej[1] = 2; 		//front or back -1 or 1	
		_.ej[2] = 0;		//Math.PI or 0	
		_.ej[3] = 0;		//3000 or 0 - camGrup pos z	
		
		//x.currGrup = 1; 
	}
	
	x.char1.rotation.y = _.ej[2]; 
	
	//eL(ui.swtchKam, 0, 'pointerup', swtchKamClick2); 
	
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
	}
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	

	x.xx = 400; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
		if (isMobil) x.xx = 800;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		if (isMobil) x.xx = 1100; 
	}		
	
	
	_.idleTimer = 0; 
}


function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		//const delta = clock.getDelta() * 1;
		//if ( mixer ) mixer.update( delta );			
		
		//console.log(delta);
		
		//x.actions[0].weight = Math.abs(Math.sin(timer*5));
		//mixer.update( 0 );	
		
		//x.actions[0].weight = Math.cos(timer);
		

/*		//camera.position.x = Math.cos(timer*2) * 1; 
		//camera.position.y = Math.sin(timer*4) * 1; 

		if (isMobil) {
			//camera.position.x += Math.cos(timer*.5) * 15; 
			//camera.position.y += Math.sin(timer*.25) * 15 + 10; 	

			const t25 = Math.sin(timer); 
			camera.position.x = t25 * x.xx; 
			//camera.position.y = Math.sin(timer*.25) * 35 + 5; 
			const camY = t25 * 700; 
			camera.position.y = camY; 
		//	camera.position.y = camY > -6 ? camY : -6; 
			//camera.position.z = camera.position.y * 1.75 + 10;
		//	camera.rotation.x = t25 * -.3; 
			
			x.camGrup.rotation.y = Math.cos(timer) * .6; 			
		} else {
			//camera.position.x += _.pointer.x * 15; 
			camera.position.x = _.pointer.x * x.xx; 
		//	camera.position.y += (_.pointer.y * 500) + 400;
			//camera.position.y += (_.pointer.y * 25) + 13;
			//camera.position.z = (_.pointer.y * 50);
			const pY = _.pointer.y * 700; 
			camera.position.y = pY;
		//	camera.position.y = pY > -6 ? pY : -6;
			//camera.position.z = camera.position.y * 1.75 + 10;
		//	camera.rotation.x = _.pointer.y * -.3; 
			
			x.camGrup.rotation.y = Math.cos(timer) * .6; 			
		}
	
		//console.log(x.camGrup.rotation.y); 
*/		

	//	camera.position.x = (Math.cos(timer*5) * 2); 
	//	camera.position.y = (Math.sin(timer*10) * 3) + _.ej[5]; 

		//camera.position.x += _.pointer.x * -200 * (_.ej[1]/2); 
		
		if (isMobil) {
			//camera.position.x += Math.cos(timer*.5) * 50; 
			//camera.position.y += Math.sin(timer*.5) * 20; 
			camera.position.x = Math.sin(timer*.15) * 120; 
			camera.position.y = Math.sin(timer*.3) * 70 + 30; 
		} else {
			//camera.position.x += _.pointer.x * 1; 
			//camera.position.y += (_.pointer.y * 1);
			camera.position.x = _.pointer.x * 300; 
			camera.position.y = (_.pointer.y * 300);
		}

		//camera.position.y = 50; 
		//camera.rotation.x = _.pointer.y * 1.2; 
		//camera.rotation.y = _.pointer.x * -1.2; 

		let y0 = x.starMater[0].map.offset.y + .001;   
			//y1 = x.starMater[1].map.offset.y + .0015; 
		//const y1 = x.starMater[0].alphaMap.offset.y + .002; 
		//var y = mesh.starBox.material.displacementMap.offset.y - .00001; 
		//y += y * .002; 
		
		if (y0 >= 1) y0 = 0; 
		//if (y1 >= 1) y1 = 0; 
		
		x.starMater[0].map.offset.y = y0; 		
		x.starMater[1].map.offset.y = y0; 		
		//x.starMater[0].alphaMap.offset.y = y1; 		
		
		x.cockpit.rotation.y = Math.cos(timer*6) * .005; 
		x.cockpit.children[6].rotation.y = Math.sin(timer*10) * .01; 
		
		if ((camera.position.y > 150) || (camera.position.y < -50) || (camera.position.x > 100) || (camera.position.x < -100)) {
			x.cockpit.children[3].material.transparent = x.cockpit.children[5].material.transparent = x.cockpit.children[9].material.transparent = false; 
		} else {
			x.cockpit.children[3].material.transparent = x.cockpit.children[5].material.transparent = x.cockpit.children[9].material.transparent = true; 
			x.cockpit.children[3].material.opacity = Math.random() * .5 + .5; 
			x.cockpit.children[5].material.opacity = Math.random() * .5 + .5; 
			x.cockpit.children[9].material.opacity = Math.random() * .5 + .5; 
			//x.cockpit.children[9].material.needsUpdate = true; 			
		}
		
		//console.log( Math.sin(timer)); 
		
		//animWalk(); 
		
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
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
}

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
		//let url = 'winter-storm-wind-lashing-snow-distilery-190212-58901'; 	
		//let url = 'somewhere-on-earth-by-prabajithk-120411'; 	
		//let url = 'harmonyx27s-embrace-232971'; 	
		//let url = 'autumn-memory-orchestral-strings-folk-nostalgia-165948'; 	
		//let url = 'progress-in-space-11756'; 	
		//let url = 'creepy-space-198471'; 	
		//let url = 'meditative-background-music-space-travel-153309'; 	
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'sinister-mystery-174823'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'gloomy-reverie-190650'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bsstp'; 	
		//let url = 'mrs'; 	
		//let url = 'atmn'; 	
		//let url = 'wntr'; 	
		//let url = 'rth'; 	
		let url = 'cckpt'; 	
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
	
	