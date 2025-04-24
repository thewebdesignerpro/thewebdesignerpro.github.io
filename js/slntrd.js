/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
import { Water } from 'three/addons/objects/Water.js'; 
//import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


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
	kontainer.style.background = "url('img/silentroadl.jpg') center top no-repeat"; 
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
	
	ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	ui.swtchKam.style.visibility = "hidden"; 
	
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
	_.ej[1] = -2; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
//	_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 5;			//70 or 35
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true; 
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 1.5;		
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.012);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 

	x.zz = 32; 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 5000 );
	camera.position.set(0, _.ej[5], x.zz); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	x.camTarget = new THREE.Object3D(); 
	x.camTarget.position.set(0, 0, 0); 
	x.camGrup.add(x.camTarget);	
	
	scene.add( new THREE.AmbientLight( 0xa8a8a8 ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 2800, 80, Math.PI/8, 1 );
	x.spotLight[0].position.set( 0, 35, 0 );
//	x.spotLight[0].castShadow = true; 
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width = 1024;
	//x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 80;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = 1.;
	
	scene.add( x.spotLight[0] );	
	//grups[0].add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	
//	x.camGrup.position.set(0, 0, _.ej[3]); 
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
	
	//const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
	//scene.add( helper );	
	
	//const helper = new THREE.CameraHelper( dirLight.shadow.camera );
	//const helper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helper );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
/*	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1;	
    //controls.autoRotate = true;    
    controls.minDistance = 1;
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = 1;
    controls.zoomSpeed = 1;
    controls.panSpeed = 2; 
	//controls.update();		
	controls.enabled = false; 
*/
	
	x.rotCam = false; 	
	
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
	//x.target0.position.set(0, 0, 0); 
	x.target0.position.set(0, -4, 0); 
	scene.add(x.target0);
	//grups[0].add(x.target0);
	
	x.spotLight[0].target = x.target0; 
	
	//x.target1 = new THREE.Object3D(); 
	//x.target1.position.set(0, 12, 0); 
	//scene.add(x.target1);	
	//
	//x.spotLight[1].target = x.target1; 
	//x.spotLight[2].target = x.target1; 
	
//	controls.target = x.target0.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	//x.spotLightHelper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( x.spotLightHelper );		
	
	addSkybox(); 
	//addClouds(); 
	//addMountain(); 
	
	//addFog(); 
	
	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	const f = '.png'; 
	//const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/5/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
		//'left'+f, 'right'+f,
		//'top'+f, 'bottom'+f,
		//'back'+f, 'front'+f		
	], function ( tx ) {
		//tx.flipY = true; 
	//	tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		//scene.backgroundRotation.set(0, Math.PI/4, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 		
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addStreet(); 
		addCar(); 
		addPhone(); 
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

function addStreet() {
	let meshCount = 0; 
	x.street = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/stage/3/street.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0) child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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
		//console.log(object.children[0].geometry); 

		//x.street = object; 
		
		const matr = [], 
			  url2 = 'obj/stage/3/mat/', 
			  //url2 = 'obj/stage/3/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, metalness: .9 } );
			matr[i].wireframe = true; 
			//matr[i].shadowSide = 2; 
			
			//matr[i].envMapIntensity = .3; 
			//matr[i].envMap = x.skybox; 			
			
			x.street[i] = new THREE.Mesh( object.children[i].geometry, matr[i] ); 
			x.street[i].scale.set(1.1, 1.1, 1.1); 
			x.street[i].position.set(0, -5.5, 0);
			//x.street[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI*2);			
			//x.street[i].rotation.set(Math.PI/-2, 0, 0);			
			
			if (i==0) {
				matr[i].alphaTest = .5; 
				//x.street[i].receiveShadow = true; 
			} else {
				matr[i].emissive.setHex(0xffffff); 
				//x.street[i].castShadow = true; 
				matr[i].transparent = true; 
				//matr[i].alphaTest = .5; 
				//matr[i].depthWrite = false; 				
			}

			x.street[i].castShadow = true; 
			x.street[i].receiveShadow = true; 
				
			//x.street.children[i].material = matr[i]; 
			
			grups[0].add(x.street[i]); 			 
		}
		
		
		const loader0 = new THREE.TextureLoader(),   
			  loader1 = new THREE.TextureLoader(),   
			  loader2 = new THREE.TextureLoader(),   
			  loader3 = new THREE.TextureLoader(),   
			  loader4 = new THREE.TextureLoader(),   
			  loader5 = new THREE.TextureLoader(),    
			  loader6 = new THREE.TextureLoader(),    
			  loader7 = new THREE.TextureLoader(),    
			  loader8 = new THREE.TextureLoader(),    
			  loader9 = new THREE.TextureLoader(),     
			  loader10 = new THREE.TextureLoader(),     
			  loader11 = new THREE.TextureLoader();    
    
		loader0.load( url2 + 'color0.jpg', function(tx0) { 	
			matr[1].map = tx0; 
			matr[1].needsUpdate = true; 
			    
			matr[1].wireframe = false; 	
			
			addSea(); 
			//fadeScene(); 
		});  
		
		loader1.load( url2 + 'normal0.jpg', function(tx1) { 	
			matr[1].normalMap = tx1; 
			matr[1].needsUpdate = true; 
		});  
		
		loader2.load( url2 + 'rough0.jpg', function(tx2) { 	
			matr[1].roughnessMap = tx2; 
			matr[1].needsUpdate = true; 
		});  
		
		loader3.load( url2 + 'metal0b.jpg', function(tx3) { 	
			matr[1].metalnessMap = tx3; 
			matr[1].needsUpdate = true; 
		});  
    
		loader4.load( url2 + 'emissive0.jpg', function(tx4) { 	
			matr[1].emissiveMap = tx4; 
			matr[1].needsUpdate = true; 
		});  
		
		loader5.load( url2 + 'color1.jpg', function(tx5) { 	
			matr[0].map = tx5; 
			matr[0].needsUpdate = true; 
			    
			matr[0].wireframe = false; 	
		});  
		
		loader6.load( url2 + 'normal1.jpg', function(tx6) { 	
			matr[0].normalMap = tx6; 
			matr[0].needsUpdate = true; 
		});  
		
		loader7.load( url2 + 'rough1.jpg', function(tx7) { 	
			matr[0].roughnessMap = tx7; 
			matr[0].needsUpdate = true; 
		});  
		
		loader8.load( url2 + 'metal1.jpg', function(tx8) { 	
			matr[0].metalnessMap = tx8; 
			matr[0].needsUpdate = true; 
		});  
    
		loader9.load( url2 + 'alfa1.jpg', function(tx9) { 	
			matr[0].alphaMap = tx9; 
			matr[0].needsUpdate = true; 
		});  
		
		loader11.load( url2 + 'alfa0.jpg', function(tx11) { 	
			matr[1].alphaMap = tx11; 
			matr[1].needsUpdate = true; 
		});  
		
		x.spotLight[1] = new THREE.SpotLight( 0xfffae5, 2000, 30, Math.PI/3.5, 1 );
		x.spotLight[1].position.set( 4.97, 9.5, -1.75 );
		x.spotLight[1].castShadow = true; 
		//x.spotLight[1].shadow.mapSize.width = 1024;
		//x.spotLight[1].shadow.mapSize.height = 1024;
		x.spotLight[1].shadow.camera.near = 1;
		x.spotLight[1].shadow.camera.far = 30;
		x.spotLight[1].shadow.camera.fov = 40;
		//x.spotLight[1].shadow.intensity = 1.5;
		
		grups[0].add( x.spotLight[1] );	
	
		x.target1 = new THREE.Object3D(); 
		x.target1.position.set(4.97, -10, -1.75); 
		grups[0].add(x.target1);	
		
		x.spotLight[1].target = x.target1; 		
		
		//x.spotLightHelper1 = new THREE.SpotLightHelper( x.spotLight[1] );
		//scene.add( x.spotLightHelper1 );			
		
		const spotLgeom = new THREE.PlaneGeometry( 17.8, 14 );		
		
		const spotLmater = new THREE.MeshBasicMaterial( {color: 0xfffae5, transparent: true, opacity: .4, side: 2 } );
		spotLmater.depthWrite = false; 
		//spotLmater.fog = false; 		
		
		const rotY = [0, Math.PI/2, Math.PI/4, Math.PI/-4, Math.PI/6, Math.PI/-6, Math.PI/8, Math.PI/-8, ]; 
		
		for ( let j = 0; j < 1; j++ ) {	
			x.spotLcone[j] = new THREE.Mesh( spotLgeom, spotLmater );
			
			x.spotLcone[j].position.set( 5, 2.2, -1.77 );
			x.spotLcone[j].rotateY(rotY[j]);
			//x.spotLcone[j].scale.set( 2, 2, 1 );
			x.spotLcone[j].visible = false;			
			
			scene.add( x.spotLcone[j] );	
	    }
		
		//loader10.load( url2 + 'cone0b.jpg', function(tx10) { 	
		loader10.load( 'img/spotLconeA.png', function(tx10) { 	
			spotLmater.alphaMap = tx10; 
			spotLmater.needsUpdate = true; 
			
			for ( let k = 0; k < 1; k++ ) {
				x.spotLcone[k].visible = true; 
			}
		}); 		
		
		scene.add(grups[0]); 
		
		x.target2 = new THREE.Object3D(); 
		x.target2.position.set(camera.position.x, 2.2, camera.position.z); 
		scene.add(x.target2);			
		
		//x.spotLcone[0].target = x.target2; 	
		
		//animFBX(); 
		//fadeScene(); 
		
	}); 
	
}	

function addCar() {
	let meshCount = 0; 
	//x.car = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/car/3/car.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0)	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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

		x.car = object; 
		//x.car.castShadow = true; 
		//x.car.receiveShadow = true; 
		
		const matr = [], 
			  url2 = 'obj/car/3/mat/', 
			  //url2 = 'obj/car/3/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, metalness: .9 } );
			//matr[i].emissive.setHex(0xffffff); 
			matr[i].wireframe = true; 
			
			//if (i==0) {
			//	matr[i].metalness = .15; 
			//} else {
			//	matr[i].alphaTest = .5; 
			//}
			
			matr[i].envMapIntensity = 1; 
			matr[i].envMap = x.skybox; 
			
			x.car.children[i].material = matr[i]; 
		}
		

		x.car.scale.set(1.3, 1.3, 1.3); 
		x.car.position.set(-3, -5.54, 0);
		x.car.rotation.set(0, Math.PI/-2, 0);
		
		grups[0].add(x.car); 
		
	
		const loader0 = new THREE.TextureLoader(),   
			  loader1 = new THREE.TextureLoader(),   
			  loader2 = new THREE.TextureLoader(),   
			  loader3 = new THREE.TextureLoader();    

		loader0.load( url2 + 'color0.jpg', function(tx0) { 	
			matr[0].map = tx0; 
			matr[0].needsUpdate = true; 
			     
			matr[0].wireframe = false; 	
			
			//animAlien(); 
			//fadeScene(); 
		});  
		
		loader1.load( url2 + 'normal0.jpg', function(tx1) { 	
			matr[0].normalMap = tx1; 
			matr[0].needsUpdate = true; 
		});  
		
		loader2.load( url2 + 'rough0.jpg', function(tx2) { 	
			matr[0].roughnessMap = tx2; 
			matr[0].needsUpdate = true; 
		});  
		
		loader3.load( url2 + 'metal0.jpg', function(tx3) { 	
			matr[0].metalnessMap = tx3; 
			matr[0].needsUpdate = true; 
		});  

	}); 
	
}	

function addPhone() {
	let meshCount = 0; 
	x.phone = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/street/1/phone2.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0) child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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
		//console.log(object.children[0].geometry); 

		//x.phone = object; 
		
		const matr = [], 
			  url2 = 'obj/street/1/mat/', 
			  //url2 = 'obj/street/1/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xaaaaaa, roughness: .7, metalness: .9 } );
			matr[i].wireframe = true; 
			//matr[i].shadowSide = 2; 
			
			matr[i].envMapIntensity = 1.3; 
			matr[i].envMap = x.skybox; 
			
			x.phone[i] = new THREE.Mesh( object.children[i].geometry, matr[i] ); 
			x.phone[i].scale.set(.351, .351, .351); 
			x.phone[i].position.set(-2, -5.06, -11);
			x.phone[i].rotation.set(0, .35, 0);			
			//x.phone[i].rotation.set(Math.PI/-2, 0, 0);			
			
			//if (i==0) {
			//	matr[i].metalness = .15; 
				x.phone[i].receiveShadow = true; 
			//} else {
			//	matr[i].alphaTest = .5; 
				x.phone[i].castShadow = true; 
			//}
			
			//x.phone.children[i].material = matr[i]; 
			
			grups[0].add(x.phone[i]); 			 
		}
		
		
		const loader0 = new THREE.TextureLoader(),   
			  loader1 = new THREE.TextureLoader(),   
			  loader2 = new THREE.TextureLoader(),   
			  loader3 = new THREE.TextureLoader();    
    
		loader0.load( url2 + 'color1.jpg', function(tx0) { 	
			matr[0].map = tx0; 
			matr[0].needsUpdate = true; 
			     
			matr[0].wireframe = false; 	
			
			//fadeScene(); 
		});  
		
		loader1.load( url2 + 'normal1.jpg', function(tx1) { 	
			matr[0].normalMap = tx1; 
			matr[0].needsUpdate = true; 
		});  
		
		loader2.load( url2 + 'rough1.jpg', function(tx2) { 	
			matr[0].roughnessMap = tx2; 
			matr[0].needsUpdate = true; 
		});  
		
		loader3.load( url2 + 'metal1.jpg', function(tx3) { 	
			matr[0].metalnessMap = tx3; 
			matr[0].needsUpdate = true; 
		});  
    
		
	}); 
	
}	

function addSea() {
	//x.sea; 
	
	const waterGeometry = new THREE.PlaneGeometry( 16, 14 );

	x.sea = new Water(
		waterGeometry,
		{
			textureWidth: 768,
			textureHeight: 768,
			//waterNormals: new THREE.TextureLoader().load( 'img/water/soft.jpg', function ( texture ) {
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x454545, 
			distortionScale: 5,
			//size: .1,
			fog: scene.fog !== undefined
		}
	);

	x.sea.position.set(1.9, -5.9, .4);
	x.sea.rotation.x = - Math.PI / 2;

	grups[0].add( x.sea );	
	
	const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .011; 
	waterUniforms['size'].value = .1; 
	
	animFBX();  	
}

/*
function addReflect() {
	cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } ); 
	//cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 ); 
	//cubeRenderTarget.texture.type = THREE.HalfFloatType;

	cubeCamera = new THREE.CubeCamera( 1, 1000, cubeRenderTarget ); 
	scene.add( cubeCamera ); 
	
	const posX = .5, 
		  posY = 2, 
		  posZ = 3.5;  
	
	//cubeCamera.position.set(posX, posY, posZ); 
	
	for(let i=0; i<13; i++) {
		if ((i==1) || (i==5)) {
			x.bathroom[i].material.reflectivity = 1; 
			x.bathroom[i].material.envMap = cubeRenderTarget.texture; 
			x.bathroom[i].material.needsUpdate = true; 
		}
	}
	
	// 0 - carpet 1 - window 2 - soap 3 - roll 4 - structure 5 - glass 6 - tub 7 - sink 
	// 8 - bowl 9 - shower chromes 10 - sconces 11 - sink soaps 12 - mat  	
	
	//fadeScene(); 
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
			//eL(ui.kontainer, 0, "wheel", wheelE); 
			
			animate();  
			
			theOptions(); 
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
        }
    })();	
}	

function theOptions() {
	//ui.swtchKam = document.getElementById('swtchKam'); 
	//ui.onAud = document.getElementById('onAud'); 
	//ui.offAud = document.getElementById('offAud'); 

	ui.swtchKam.style.visibility = "visible"; 	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
		eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);		
	}	 
	
}

function swtchKamClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
	if (x.rotCam) {
		//x.camTarget.position.set(0, 0, 0); 
		camera.rotation.set(0, 0, 0); 
	} else {
		//x.camTarget.position.set(-5, 0, 0); 
		camera.rotation.set(0, Math.PI/20, 0); 
	}
	
	camera.position.set(0, _.ej[5], 40); 
	x.camGrup.rotation.set(0, 0, 0); 
	
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
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px'; 
		
		x.zz = 32; 
		
		//console.log('w');
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		x.zz = 42; 
	}		
	
	camera.position.z = x.zz; 
	
	_.idleTimer = 0; 
}

/*
function animWalk() {
 //   (function walkIn() {
	//	let z0 = grups[0].position.z,   
			//z1 = x.wormhole.rotation.y; 
	//		z1 = grups[1].position.z;  
			//z2 = grups[2].position.z; 
	//
	
		let z0 = x.camGrup.position.z, 
			z1 = x.target0.position.z, 
			ej1 = 0; 
		
		//if (_.ej[1] > 0)
		ej1 = (_.ej[1] > 0) ? 1 : 0; 	
		
		//console.log(z0);
			
		if (z0 == _.ej[0]) {
			//if (x.currGrup == 0) {
			
			x.camGrup.position.z = _.ej[3]; 
			
			x.target0.position.z = _.ej[3] - 500; 
			
			grups[0].position.z *= -1; 
			grups[1].position.z *= -1; 
			
			x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		} else {
			x.camGrup.position.z = z0 + _.ej[1]; 
			x.target0.position.z = z1 + _.ej[1]; 
		}
		
	
//		requestAnimationFrame(walkIn);					
//    })();	
}
*/

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		const timer = Date.now() * 0.0003; 
		//console.log(timer); 
		
		const delta = clock.getDelta() * .3; 
		//if ( mixer ) 
		mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
		
		const mSin5 = timer/2; 
		
		if (!x.rotCam) {
			if (isMobil) {
				const rtY2 = Math.sin(timer/3) * Math.PI; 
					  
				camera.position.y = Math.sin(mSin5) * 12 + 7; 
				camera.position.z = x.zz - Math.abs(Math.sin(mSin5) * 5); 
				x.camGrup.rotation.y = rtY2;  
				//x.camGrup.rotation.y = x.spotLcone[0].rotation.y = rtY2;  
			} else {
				const ptY = _.pointer.y * Math.PI/-3.5, 
					  ptX = _.pointer.x * Math.PI, 
					  rtY = (_.pointer.x * .005) % Math.PI;  
				
				camera.position.y = _.pointer.y * 12 + 7; 
				camera.position.z = x.zz - Math.abs(_.pointer.y * 5); 
			//	x.spotLcone[0].rotateY( rtY ); 
				x.camGrup.rotateY( rtY ); 
			}
		} else {	
			const rtY3 = -.008 % Math.PI; 
		
			camera.position.y = Math.sin(timer) * 6 - 1; 
			camera.position.z = x.zz - Math.abs(Math.sin(timer) * 4); 
		//	x.spotLcone[0].rotateY( rtY3 ); 	
			x.camGrup.rotateY( rtY3 ); 			
		}
	
		
		//grups[0].rotation.set(Math.sin(mSin5) * .1, Math.sin(timer) * Math.PI*3, Math.cos(mSin5) * .1);

		
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
	if (!x.rotCam) camera.lookAt(x.camTarget.position); 	
	//camera.lookAt(0, 10000, 0); 	
	//if (x.rotCam) 
		//camera.lookAt(x.target0.position); 
	//camera.lookAt(x.wall[0].position);

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[0].lookAt(camera.position); 
		//x.spotLcone[0].rotation.x = x.spotLcone[0].rotation.z = 0; 
		//x.spotLcone[0].rotation.y = 0; 
	//}

	camera.getWorldPosition(x.target2.position); 
	//console.log(x.target2.position); 
	
	//x.target2.position.set(camera.position.x, 2.2, camera.position.z); 
	x.target2.position.y = 2.2; 
	x.spotLcone[0].lookAt(x.target2.position); 	
	
	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
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
		const scl = .03325; 
		
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
		//x.char1.position.set(4, -5., -11); 
		x.char1.position.set(7.7, -5.5, -2.2); 
		//x.char1.rotation.set(0, Math.PI, 0);	
		x.char1.rotation.set(0, .5, 0);	
		
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
	let url = 'teenb1/lookingaround'; 	//mono
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
		//let url = 'Promise'; 	
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'sinister-mystery-174823'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'gloomy-reverie-190650'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bdrm'; 
		//let url = 'ufo'; 
		let url = 'shintro'; 
		url += '.mp3'; 	
		//url += '.mp4'; 	
		//url += '.3gp'; 	
		
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
			x.sound.setVolume( 0.7 ); 
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
	}
	
}
	
	