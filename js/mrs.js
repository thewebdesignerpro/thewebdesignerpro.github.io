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
	kontainer.style.background = "url('img/marsl.jpg') center top no-repeat"; 
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
//	const fogCol = 0x707476; 

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
	_.ej[5] = 0;			//70 or 35
	
	x.xx = 160; 

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
//	scene.fog = new THREE.FogExp2(fogCol, 0.01);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 12000 );
	//camera.position.set(0, 0, 500); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 0, 2000); 
	//camera.position.set(0, 0, 1670); 
	//camera.position.set(0, 0, 1420); 
	//camera.position.set(0, 0, 780); 
	camera.position.set(0, 0, 1280); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x777777 ) );		

//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 155000000, 10000, Math.PI/3.5, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffffff, 90000, 250, Math.PI/10, 1 );
	//x.spotLight[0].position.set( -3000, 0, 0 );
	x.spotLight[0].position.set( -5000, 0, 0 );
	//x.spotLight[0].position.set( 0, 100, 80 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
//	x.spotLight[0].shadow.mapSize.width = 1024;
//	x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 10000;
	x.spotLight[0].shadow.camera.fov = 50;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .7;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

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
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    controls.autoRotate = false;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 9000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .3;
    controls.zoomSpeed = 1;
    controls.panSpeed = 8;
	//controls.update();		
	//controls.enabled = false; 
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
	
	x.targetO = new THREE.Object3D(); 
//	x.targetO.position.set(0, florY+160, x.camGrup.position.z - 300); 
	x.targetO.position.set(0, 0, x.camGrup.position.z + 20); 
	scene.add(x.targetO);
	
	x.spotLight[0].target = x.targetO; 
	
	x.target1 = new THREE.Object3D(); 
//	x.target1.position.set(0, 0, x.camGrup.position.z - 1); 
	x.target1.position.set(0, 0, x.camGrup.position.z); 
	scene.add(x.target1);
	
//	x.spotLight[1].target = x.target1; 
	
//	controls.target = x.targetO.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[1] );
	//scene.add( x.spotLightHelper );	
	
	addSkybox(); 
	addAsteroids(); 
//	addClouds(); 
	//addFog(); 	
	//addBusStop(); 
//	addGround(); 
//	addWall(); 
//	addSidewalk(); 
//	addTrash(); 
//	addHydrant(); 
//	addDrain(); 
//	addManhole(); 
//	addNaut(); 
	//addTrees(); 
	//addLamps(); 
	
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
	//loader.setPath( 'img/skybox/0/' );
	loader.setPath( 'img/skybox/5/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
		//'3'+f, '1'+f,
		//'5'+f, '4'+f,
		//'6'+f, '2'+f
	], function ( tx ) {
		//tx.flipY = true; 
		//tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		//addFog(); 
		
		addMars(); 
		
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
	
function addMars() {
	//const geometry = new THREE.SphereGeometry( 500, 56, 28 ); 
	const geometry = new THREE.SphereGeometry( 400, 56, 28 ); 
	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .6 } ); 
	//material.transparent = true; 
	
	x.Mars = new THREE.Mesh( geometry, material ); 
	//x.Mars.position.set(500, 0, 0); 
	//x.Mars.position.set(500, 0, -750); 
	//x.Mars.position.set(400, 0, -500); 
	x.Mars.position.set(400, 0, 0); 
	//x.Mars.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	
	//x.Mars.castShadow = x.Mars.receiveShadow = true; 
	
	//scene.add( x.Mars );
	grups[0].add( x.Mars );
	
	scene.add(grups[0]); 
	
	//const geometry2 = new THREE.CircleGeometry( 700, 48 ); 
	const geometry2 = new THREE.CircleGeometry( 560, 48 ); 
	const material2 = new THREE.MeshBasicMaterial( { color: 0xee9988, transparent: true, opacity: .9 } ); 
	material2.depthWrite = false; 
	x.mGlow = new THREE.Mesh( geometry2, material2 ); 
	//x.mGlow.position.set(400, 0, -750); 
	//x.mGlow.position.set(320, 0, -500); 
	x.mGlow.position.set(320, 0, 0); 
	grups[0].add( x.mGlow );
	
	//console.log(geometry2); 
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(), 
		load3 = new THREE.TextureLoader(); 
		
	let kolorUrl = 'mars4kb'; 
	if (isMobil) kolorUrl = 'mars3k';
		
	//console.log(kolorUrl);
		
	//load1.load( 'img/mars/color1.jpg', function(tx) { 
	//load1.load( 'img/mars/mars4kb.jpg', function(tx) { 
	load1.load( 'img/mars/' + kolorUrl + '.jpg', function(tx) { 
		x.Mars.material.map = tx; 
		x.Mars.material.needsUpdate = true; 
		
		//addPhobos(); 
		animFBX(); 
	}); 	

	//load2.load( 'img/mars/normal1.jpg', function(tx2) { 
	load2.load( 'img/mars/bump1.jpg', function(tx2) { 
		//x.Mars.material.normalScale.set(20, 20); 
		//x.Mars.material.normalMap = tx2; 
		x.Mars.material.bumpScale = 7; 
		x.Mars.material.bumpMap = tx2; 
		x.Mars.material.needsUpdate = true; 
	}); 	
	
	load3.load( 'img/spotL1.jpg', function(tx3) { 
		x.mGlow.material.alphaMap = tx3; 
		x.mGlow.material.needsUpdate = true; 
	}); 	
}

/*function addPhobos() {
//	const geom = new THREE.SphereGeometry( 1.63, 32, 16 ); 
	//const geom = new THREE.SphereGeometry( 60, 32, 16 ); 
//	const mater = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .6 } ); 
	//mater.transparent = true; 
	
//	x.Phobos2 = new THREE.Mesh( geom, mater ); 
//	x.Phobos2.position.set(0, 0, 1600); 
	//x.Phobos2.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	//scene.add( x.Phobos2 );
//	grups[0].add( x.Phobos2 );	
		
	let meshCount = 0; 
	x.Phobos = [];

	const loader = new OBJLoader();
	
	loader.load( 'obj/mars/phobos/phobos.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.Phobos.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 1 } );
			//material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			//material[i].envMap = x.skybox; 			
			//material[i].envMapIntensity = .7; 	
			
			x.Phobos[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.Phobos[i].castShadow = true; 
			x.Phobos[i].receiveShadow = true; 			
			
		//	x.Phobos[i].position.set(0, florY+10.12, 0); 
			//x.Phobos[i].position.set(0, 0, 1600); 
			//x.Phobos[i].rotation.set(0, .9, 0); 
			x.Phobos[i].scale.set(1.4, 1.4, 1.4); 
		
			grups[0].add( x.Phobos[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/mars/phobos/mat/color1.jpg', function(tx) { 
		//load1.load( 'obj/phobos/1/mat/c0.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.Phobos[0].material.map = tx; 
				x.Phobos[0].material.needsUpdate = true; 
			//}
			//x.phobos.visible = true; 
		}); 			

		load2.load( 'obj/mars/phobos/mat/rough1.jpg', function(tx2) { 
		//load2.load( 'obj/phobos/1/mat/c1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.Phobos[0].material.roughnessMap = tx2; 
				x.Phobos[0].material.needsUpdate = true; 
			//}
			//x.phobos.visible = true; 
		}); 			

		load3.load( 'obj/mars/phobos/mat/normal1.jpg', function(tx3) { 
		//load3.load( 'obj/phobos/1/mat/c2.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				//x.phobos[0].material.normalScale.set(2, 2); 
				x.Phobos[0].material.normalMap = tx3; 
				x.Phobos[0].material.needsUpdate = true; 
			//}
			//x.phobos.visible = true; 
		}); 			
	
		load4.load( 'obj/mars/phobos/mat/metal1.jpg', function(tx4) { 
			x.Phobos[0].material.metalnessMap = tx4; 
			x.Phobos[0].material.needsUpdate = true; 
		}); 			

	}); 	
	
	
	//animFBX(); 
}


function addNaut() {
	let meshCount = 0; 
	x.naut = [];

	const loader = new OBJLoader();
	
	//loader.load( 'obj/naut/1/naut.obj', function ( object ) {
	loader.load( 'obj/naut/2/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		console.log(meshCount); 
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.naut.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
		//	material[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: .8 } );
			if ( i < 3 ) {
				material[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: .2 } );
			} else {
				material[i] = new THREE.MeshStandardMaterial( { color: 0xbbbbbb, roughness: 0, metalness: .5 } );		
			}
			//material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			material[i].envMap = x.skybox; 			
			material[i].envMapIntensity = 1.5; 	
			
			x.naut[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.naut[i].castShadow = true; 
			x.naut[i].receiveShadow = true; 			
			
		//	x.naut[i].position.set(0, florY+10.12, 0); 
		//	x.naut[i].position.set(-10, 0, 1600); 
			x.naut[i].position.set(-10, 0, 1200); 
			x.naut[i].rotation.set(Math.PI/-2, 0, 0); 
		//	x.naut[i].scale.set(2, 2, 2); 
		
			grups[1].add( x.naut[i] );		
			scene.add( grups[1] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load1b = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load2b = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load3b = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(); 
		
		//load1.load( 'obj/naut/1/mat/color.jpg', function(tx) { 
		load1.load( 'obj/naut/2/mat/RGB_f331b2ec967042d588b2702f1358803b_A7L-Spacesuit_Top_BaseColor.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.naut[2].material.map = tx; 
				x.naut[2].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 			

		load1b.load( 'obj/naut/2/mat/N_3c92a0f990d844598aea16ae336c8217_A7L-Spacesuit_Top_Normal.jpeg', function(tx1b) { 
			//for ( let l = 0; l < 1; l++ ) {	
				//x.naut[0].material.normalScale.set(-1, -1); 
				x.naut[2].material.normalMap = tx1b; 
				x.naut[2].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 		
	
		load2.load( 'obj/naut/2/mat/RGB_1c2ba64a3f2b424d8d812858b6dc4438_A7L-Spacesuit_Bottom_BaseColor.jpg', function(tx2) { 
			//for ( let k = 0; k < 1; k++ ) {	
				x.naut[1].material.map = tx2; 
				x.naut[1].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 			

		load2b.load( 'obj/naut/2/mat/N_ab106b2c31194b05a2bed1e5298f741c_A7L-Spacesuit_Bottom_Normal.jpeg', function(tx2b) { 
			//for ( let l = 0; l < 1; l++ ) {	
				//x.naut[0].material.normalScale.set(-1, -1); 
				x.naut[1].material.normalMap = tx2b; 
				x.naut[1].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 		
	
		load3.load( 'obj/naut/2/mat/RGB_b35f7dabbaa14d2e90aafb862abea7bb_A7L-Spacesuit_Back-Pack_BaseColor.jpg', function(tx3) { 
			//for ( let k = 0; k < 1; k++ ) {	
				x.naut[0].material.map = tx3; 
				x.naut[0].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 			

		load3b.load( 'obj/naut/2/mat/N_fc75be1e57824f52b86564916e781282_A7L-Spacesuit_Back-Pack_Normal.jpeg', function(tx3b) { 
			//for ( let l = 0; l < 1; l++ ) {	
				//x.naut[0].material.normalScale.set(-1, -1); 
				x.naut[0].material.normalMap = tx3b; 
				x.naut[0].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 		
		
		load2.load( 'obj/naut/1/mat/rough.jpg', function(tx2) { 
		//load2.load( 'obj/naut/1/mat/c1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.naut[0].material.roughnessMap = tx2; 
				x.naut[0].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 			

		load3.load( 'obj/naut/1/mat/normal.jpg', function(tx3) { 
		//load3.load( 'obj/naut/1/mat/c2.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				//x.naut[0].material.normalScale.set(-1, -1); 
				x.naut[0].material.normalMap = tx3; 
				x.naut[0].material.needsUpdate = true; 
			//}
			//x.naut.visible = true; 
		}); 			
	
		load4.load( 'obj/naut/1/mat/metal.jpg', function(tx4) { 
			x.naut[0].material.metalnessMap = tx4; 
			x.naut[0].material.needsUpdate = true; 
		}); 			

		load5.load( 'obj/naut/1/mat/alpha3.jpg', function(tx5) { 
			x.naut[0].material.alphaMap = tx5; 
			x.naut[0].material.needsUpdate = true; 
		}); 			

		load6.load( 'obj/naut/1/mat/light1.jpg', function(tx6) { 
			x.naut[0].material.lightMapIntensity = 1; 
			x.naut[0].material.lightMap = tx6; 
			x.naut[0].material.needsUpdate = true; 
		}); 			

	}); 

}
*/

function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//let posx = Math.random() * 1.3 + -.3,  
	let posx = Math.random() * 2 - 1,  
		posy = Math.random() * .4 - .2,  
		//posz = Math.random() * -1.3 + .3; 
		posz = Math.random() * -1; 
		
	const fifty = Math.random(); 
	
	if ((posx > 0) && (fifty < .5)) posx *= -1; 
	
	position.x = posx;
	position.y = posy;
	position.z = posz;

	rotation.x = Math.random() * (2 * Math.PI);
	rotation.y = Math.random() * (2 * Math.PI);
	rotation.z = Math.random() * (2 * Math.PI);
	
	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = Math.random() * 17 + 2;

	position.normalize(); 
	//position.multiplyScalar(Math.random() * 400 +  1500); 
	position.multiplyScalar(Math.random() * 700 +  1000); 
	
	if (position.x < 0) {
		position.z += position.x * .62; 	
		position.x *= 3; 
	} else {
		position.x *= 1.6; 
	}
	
	//position.x += 400; 
	//position.z -= 500; 
	
	return matrix.compose( position, quaternion, scale );

}
	
function addAsteroids() {
	let meshCount = 0; 
	x.asteroids = []; 
	x.materials2 = []; 
	//const matrix; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/rock/1/asteroid.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeVertexNormals();	
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
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		x.materials2[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: .1 } );		
		//x.materials2[0].depthWrite = false; 
		//material.depthWrite = false; 
		//x.materials2[0].side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth1 = object.children[0].geometry.attributes.position.array.length,  
				  qty = 200; 			
		
			x.asteroids = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, x.materials2[0] );
			x.asteroids.frustumCulled = true;
			//x.asteroids.castShadow = true;
			//x.asteroids.receiveShadow = true;
			
			const geometryId1 = x.asteroids.addGeometry( object.children[0].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId1 = x.asteroids.addInstance( geometryId1 );
			
				//randomizeMatrix( matrix[i] );
				//x.asteroids.setMatrixAt( instancedId, randomizeMatrix( matrix[i], 19 ) ); 
				
				//matrix = randomizeMatrix( matrix, 1, j ); 
				matrix = randomizeMatrix( matrix ); 
				
				x.asteroids.setMatrixAt( instancedId1, matrix ); 
			}
			
			//grups[0].add(x.asteroids); 
			scene.add(x.asteroids); 
		//}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();    
		
		load1.load( 'obj/rock/1/mat/color2.jpg', function(tx) { 
			x.materials2[0].map = x.materials2[0].roughnessMap = tx; 
			x.materials2[0].needsUpdate = true; 
		}); 			

		load2.load( 'obj/rock/1/mat/normal2.jpg', function(tx2) { 
			x.materials2[0].normalMap = tx2; 
			//x.materials2[0].normalScale = 2; 
			x.materials2[0].needsUpdate = true; 		
		}); 			

	}); 

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

	x.xx = 160; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		if (isMobil) x.xx = 300; 
	}		
	
	
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
			z1 = x.targetO.position.z, 
			ej1 = 0; 
		
		//if (_.ej[1] > 0)
		ej1 = (_.ej[1] > 0) ? 1 : 0; 	
		
		//console.log(z0);
			
		if (z0 == _.ej[0]) {
			//if (x.currGrup == 0) {
			
			x.camGrup.position.z = _.ej[3]; 
			
			x.targetO.position.z = _.ej[3] - 500; 
			
			grups[0].position.z *= -1; 
			grups[1].position.z *= -1; 
			
			x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		} else {
			x.camGrup.position.z = z0 + _.ej[1]; 
			x.targetO.position.z = z1 + _.ej[1]; 
		}
		
	
//		requestAnimationFrame(walkIn);					
//    })();	
}
*/

function animFog() { 
	const fogX0 = x.batchedMesh[0].position.x,  
		  fogX1 = x.batchedMesh[1].position.x; 
	
	if (fogX0 > -300) {
		x.batchedMesh[0].position.x -= .1; 
	} else {
		x.batchedMesh[0].position.x = 300;
	}

	if (fogX1 > -300) {
		x.batchedMesh[1].position.x -= .15; 
	} else {
		x.batchedMesh[1].position.x = 300;
	}
	
}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		//const timer = Date.now() * 0.00008;
		//const timer = Date.now() * 0.00024;
		const timer = Date.now() * 0.0002; 
		//console.log(Math.cos(timer)); 
		
		const delta = clock.getDelta() * .3;
	//	if ( mixer ) 
		mixer.update( delta );	

		//x.actions[0].weight = Math.abs(Math.sin(timer*10));
		//mixer.update( .02 );	
		
		//x.actions[0].weight = Math.cos(timer);
		
		
		//camera.position.x = Math.cos(timer*2) * 1; 
		//camera.position.y = Math.sin(timer*4) * 1; 

		if (isMobil) {
			//camera.position.x += Math.cos(timer*.5) * 15; 
			//camera.position.y += Math.sin(timer*.25) * 15 + 10; 	

			const t25 = Math.sin(timer); 
			camera.position.x = t25 * x.xx; 
			//camera.position.y = Math.sin(timer*.25) * 35 + 5; 
			const camY = t25 * 400; 
			camera.position.y = camY; 
		//	camera.position.y = camY > -6 ? camY : -6; 
			//camera.position.z = camera.position.y * 1.75 + 10;
		//	camera.rotation.x = t25 * -.3; 
			
			x.camGrup.rotation.y = Math.cos(timer) * .3; 			
		} else {
			//camera.position.x += _.pointer.x * 15; 
			camera.position.x = _.pointer.x * x.xx; 
		//	camera.position.y += (_.pointer.y * 500) + 400;
			//camera.position.y += (_.pointer.y * 25) + 13;
			//camera.position.z = (_.pointer.y * 50);
			const pY = _.pointer.y * 500; 
			camera.position.y = pY;
		//	camera.position.y = pY > -6 ? pY : -6;
			//camera.position.z = camera.position.y * 1.75 + 10;
		//	camera.rotation.x = _.pointer.y * -.3; 
			
			x.camGrup.rotation.y = Math.cos(timer) * .3; 			
		}
		
//		camera.position.z = camera.position.y * 1.7 + 780; 
	
		//animFog(); 
		//animWalk(); 
	
		//grups[0].rotation.x = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.y = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.z = Math.cos(timer*.1) * .5; 
		
		//camera.rotation.y = Math.cos(timer*.05) * 3; 
		//x.camGrup.rotation.y = Math.cos(timer) * 2.7; 
	//	x.camGrup.rotation.y = Math.cos(timer*3) * .6; 

	
		//x.Mars.rotation.y = Math.PI*2; 
	//	let mrsRot = x.Mars.rotation.y + .002; 
		let mrsRot = x.Mars.rotation.y + .0015; 
		//let mrsRot = x.Mars.rotation.y + .005; 
		if (mrsRot >= (Math.PI*2)) mrsRot %= Math.PI*2; 
		x.Mars.rotation.y = mrsRot; 
		
/*		//let pbRot = x.Phobos[0].rotation.y + .000025; 
		//let pbRot = x.Phobos[0].rotation.y + .0000125; 
		let pbRot = x.Phobos[0].rotation.y + .00001875; 
		if (pbRot >= (Math.PI*2)) pbRot %= Math.PI*2; 
		x.Phobos[0].rotation.y = pbRot; 
		
		//const orbt = timer*.75;
		const orbt = timer*1.125; 
		
	//	x.Phobos[0].position.set(Math.sin(timer*1.5) * 1383 + 500, 0, Math.cos(timer*1.5) * 1383); 
		x.Phobos[0].position.set(Math.sin(orbt) * 1383 + 500, 0, Math.cos(orbt) * 1383); 
		//x.Phobos.position.set(Math.sin(timer*3.8) * 530 + 500, 0, Math.cos(timer*3.8) * 530); 
*/
		
		x.char1.rotation.set(mrsRot, mrsRot, mrsRot);
	//	x.char1.rotation.set(mrsRot, -mrsRot, mrsRot);
	//	x.naut[0].rotation.set(mrsRot, -mrsRot, mrsRot);
	//	grups[1].rotation.set(0,0,-mrsRot);

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
	//camera.lookAt(x.targetO.position);
	camera.lookAt(x.target1.position);
	//camera.lookAt(x.wall[0].position);
	
	x.mGlow.lookAt(camera.position); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
}

function animFBX() {
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
					envI = 5; 
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
	
	//	x.char1.scale.set(.1, .1, .1); 
	//	x.char1.scale.set(.5, .5, .5); 
	//	x.char1.position.set(0, 0, 750); 
		x.char1.position.set(0, 0, -300); 
	//	x.char1.position.set(0, 0, 1390); 
		//x.char1.position.set(0, florY, 1150); 
	//	x.char1.rotation.set(0, win.ej[2], 0);	
	//	x.char1.rotation.set(0, Math.PI, 0);	
		
		//scene.add( x.char1 ); 
		camera.add( x.char1 ); 
		//x.camGrup.add( x.char1 ); 
		
		//x.spotLight[0].target = x.char1;
		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	let url = 'naut/2/falling'; 	//mono
	//let url = 'naut/2/threading'; 	//mono

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
		
		//mixer.update( 1 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
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
		let url = 'mrs'; 	
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
			x.sound.setVolume( 1.0 );
			//x.sound.setVolume( 0.8 );
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
	}
	
}
	
	