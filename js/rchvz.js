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
	kontainer.style.background = "url('img/archvizl.jpg') center top no-repeat"; 
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
	_.ej[5] = 50;			//70 or 35	
	
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.0002);	
	//scene.fog = new THREE.FogExp2(0x535f37, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	//grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 20000 ); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], 450); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x9e9e9e ) );	

	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xfffaf1, 80000000, 5500, Math.PI/8, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( -500, 4000, 1000 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width =  1024;
	x.spotLight[0].shadow.mapSize.height = 1024; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 5500;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .8;
	
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
	
/*	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = .2;	
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
	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
//	controls.target = x.target0.position; 	
	

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
	//const f = '.png'; 
	const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/13/' );

	loader.load( [
		//'posx'+f, 'negx'+f,
		//'posy'+f, 'negy'+f,
		//'posz'+f, 'negz'+f
		'left'+f, 'right'+f,
		'top'+f, 'bottom'+f,
		'back'+f, 'front'+f
		//'3'+f, '1'+f,
		//'5'+f, '4'+f,
		//'6'+f, '2'+f
	], function ( tx ) {
		//tx.flipY = true; 
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx.mapping = THREE.CubeRefractionMapping;	
		
		x.skybox = tx; 

		scene.backgroundRotation.set(0, Math.PI/2, 0); 
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addGrass(); 
		
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
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

function addGrass() {
	const geometry = new THREE.PlaneGeometry( 4000, 4000 );
	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } ); 
	material.transparent = true; 
	//material.alphaTest = .5; 
	
	x.grass = new THREE.Mesh( geometry, material );
	x.grass.position.set(0, -.2, 0);
	x.grass.rotation.x = Math.PI/-2; 
	x.grass.receiveShadow = true; 
	
	scene.add( x.grass );
	
	const url2 = 'img/ground/10/', 
		  txU = 12, txV = 12; 
	
	const loader0 = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  loader3 = new THREE.TextureLoader(), 
		  loader4 = new THREE.TextureLoader(), 
		  loader4b = new THREE.TextureLoader(), 
		  loader4c = new THREE.TextureLoader(), 
		  loader4d = new THREE.TextureLoader(); 
	
	loader0.load( 'img/opac2.jpg', function(tx0) { 
		x.grass.material.alphaMap = tx0; 
		x.grass.material.needsUpdate = true; 
	});  

	loader1.load( url2 + 'color1.jpg', function(tx1) { 
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(txU, txV);    
		
		x.grass.material.map = tx1; 
		x.grass.material.needsUpdate = true; 
		
		//fadeScene(); 
	});  

	loader2.load( url2 + 'rough1.jpg', function(tx2) { 
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(txU, txV);    
		
		x.grass.material.roughnessMap = tx2; 
		x.grass.material.needsUpdate = true; 

	});  

	loader3.load( url2 + 'normal1.jpg', function(tx3) { 
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		
		x.grass.material.normalScale.set(4, 4);  
		x.grass.material.normalMap = tx3; 
		x.grass.material.needsUpdate = true; 

	});  
		
	const url3 = 'img/concrete/0/', 
		  txU2 = 7.5, txV2 = 5; 
	
	const geometry2 = new THREE.PlaneGeometry( 600, 400 );
	const material2 = new THREE.MeshStandardMaterial( {color: 0xfffaf5, roughness: 1, transparent: true, opacity: 1} );
	//material.alphaTest = .5; 
	//material.depthWrite = false; 
	//material.envMap = x.skybox; 
	
	x.concrete = new THREE.Mesh( geometry2, material2 );
	x.concrete.rotation.set(Math.PI/-2, 0, Math.PI); 
	//x.concrete.position.set(0, 0, 0); 
	x.concrete.receiveShadow = true; 
	grups[0].add( x.concrete );	
		
	loader4.load( url3 + 'color1.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		tx4.repeat.set(txU2, txV2);  		
		
		x.concrete.material.map = tx4; 
		x.concrete.material.needsUpdate = true; 
	});  
	
	loader4b.load( url3 + 'rough1.jpg', function(tx4b) { 
		tx4b.wrapS = tx4b.wrapT = THREE.RepeatWrapping;    
		tx4b.repeat.set(txU2, txV2);  
	
		x.concrete.material.roughnessMap = tx4b; 
		x.concrete.material.needsUpdate = true;
	});  
	
	loader4c.load( url3 + 'normal1.jpg', function(tx4c) { 	
		tx4c.wrapS = tx4c.wrapT = THREE.RepeatWrapping;    
		tx4c.repeat.set(txU2, txV2); 		
	
		x.concrete.material.normalMap = tx4c; 
		x.concrete.material.needsUpdate = true;
	});  		
	
	loader4d.load( url3 + 'edge2.jpg', function(tx4d) { 	
		x.concrete.material.alphaMap = tx4d; 
		x.concrete.material.needsUpdate = true;
	});  		
		
	addHouse(); 
}

function addHouse() {
	let meshCount = 0; 
	//x.house = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/bldg/1/bldg.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				if ((meshCount == 0) || (meshCount == 2) || (meshCount == 5)) child.castShadow = true; 
				child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.house = object; 
		
		x.house.position.set(0, -.2, 0); 
		x.house.rotation.set(0, Math.PI, 0); 
		x.house.scale.set(20, 20, 20); 
		
		const matr = [], 
			  url2 = 'obj/bldg/1/mat/', 
			  frm = 'jpg',   
			  kolor = [0xffffff, 0xf1f3f5, 0xbebebe, 0xaea8ac, 0xaea8ac, 0xffffff], 
			  bakal = [0, .25, 0, 0, 0, 0];
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 

			if (i==1) {
				matr[i] = new THREE.MeshPhongMaterial( { color: kolor[i], emissive: 0x5e676f } ); 
				//matr[i].side = 2; 
				matr[i].transparent = true; 
				matr[i].opacity = .88; 
				//matr[i].roughness = 0;
				matr[i].reflectivity = .8;
				matr[i].envMap = x.skybox; 
			} else {			
				matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: 1, metalness: bakal[i] } );
				//matr[i].alphaTest = .5; 
				//matr[i].shadowSide = 1; 
			}
			
			if ((i==2) || (i==5)) {
				matr[i].roughness = .7; 
				matr[i].side = 2; 
				matr[i].shadowSide = 1; 
			}
			
			//if (i==5) matr[i].visible = false; 
			
			x.house.children[i].material = matr[i]; 
		}
		
		//grups[0].position.set(0, -.1, 0); 
		//grups[0].rotation.set(Math.PI/-2, 0, Math.PI/-2); 
		grups[0].add(x.house); 
		
		const geometry = new THREE.PlaneGeometry( 80, 200 );
		const material = new THREE.MeshPhongMaterial( {color: 0xcacccd, transparent: true, opacity: .9} );
		//material.alphaTest = .5; 
		//material.depthWrite = false; 
		material.reflectivity = .8; 
		material.envMap = x.skybox; 
		
		const Glass3 = new THREE.Mesh( geometry, material );
		Glass3.rotation.set(Math.PI/-2, 0, Math.PI); 
		Glass3.position.set(-150, 155, -30); 
		Glass3.receiveShadow = true; 
		grups[0].add( Glass3 );			
		
		const geometry2 = new THREE.PlaneGeometry( 90, 170 );
		
		const Glass4 = new THREE.Mesh( geometry2, material );
		Glass4.rotation.set(Math.PI/-2, 0, Math.PI); 
		Glass4.position.set(-60, 177, -20); 
		Glass4.receiveShadow = true; 
		grups[0].add( Glass4 );			
		
		scene.add(grups[0]); 

		x.spotLight[0].target = x.house; 
		
		// 0 = wood; 1 = glass; 2 = wall2; 3 = door1; 4 = door2; 5 = wall1;
		
		const loader1 = new THREE.TextureLoader(),  
			  loader1b = new THREE.TextureLoader(),  
			  loader1c = new THREE.TextureLoader();   

		loader1.load( 'img/wood/0/color1.jpg', function(tx1) { 	
			tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
			tx1.repeat.set(2, 2);  		
			
			x.house.children[0].material.map = tx1; 
			x.house.children[0].material.needsUpdate = true; 
			
			//fadeScene(); 
		});  
		
		loader1b.load( 'img/wood/0/rough1.jpg', function(tx1b) { 
			tx1b.wrapS = tx1b.wrapT = THREE.RepeatWrapping;    
			tx1b.repeat.set(2, 2);  
		
			x.house.children[0].material.roughnessMap = tx1b; 
			x.house.children[0].material.needsUpdate = true;
		});  
		
		loader1c.load( 'img/wood/0/normal1.jpg', function(tx1c) { 	
			tx1c.wrapS = tx1c.wrapT = THREE.RepeatWrapping;    
			tx1c.repeat.set(2, 2); 		
		
			x.house.children[0].material.normalMap = tx1c; 
			x.house.children[0].material.needsUpdate = true;
		});  

		addTrees(); 
		//fadeScene(); 
	}); 
	
}	

function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	
	let posx = (Math.random() * 2500 - 1250),
		posz = (Math.random() * 2500 - 1250); 	
		
	if ((posx > -400) && (posx < 400) && (posz > -400) && (posz < 400)) {
		//let rndX = Math.random() < 0.5 ? -1 : 1, 
			//rndZ = Math.random() < 0.5 ? -1 : 1;
			
		//posx = 404 * rndX; 
		//posz = 384 * rndZ; 
		posz = (Math.random() * -800 - 400);  
		//console.log(posx);
	}
		
	position.x = posx;
	position.y = -19;
	position.z = posz;

	rotation.y = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = 2.6 + Math.random();

	return matrix.compose( position, quaternion, scale );
}

function addTrees() {
	let meshCount = 0; 
	x.materials2 = []; 
	x.leaves = []; 
	x.trunk = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/11/tree.obj', function ( object ) {
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
				
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.materials2[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, alphaTest: .5 } );		
		x.materials2[0].side = 2; 
		x.materials2[0].shadowSide = THREE.BackSide; 
		
		x.materials2[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1 } );	
		//x.materials2[1].shadowSide = THREE.FrontSide; 
		
		for ( let i = 0; i < 1; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  qty = 320; 		
		
			x.leaves[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, x.materials2[0] );
			x.leaves[i].frustumCulled = true;
			x.leaves[i].castShadow = true; 
			//x.leaves[i].receiveShadow = true;

			x.trunk[i] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, x.materials2[1] );
			x.trunk[i].frustumCulled = true;
			x.trunk[i].castShadow = x.trunk[i].receiveShadow = true;
			
			const geometryId0 = x.leaves[i].addGeometry( object.children[0].geometry ), 
				  geometryId1 = x.trunk[i].addGeometry( object.children[1].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.leaves[i].addInstance( geometryId0 ), 
					  instancedId1 = x.trunk[i].addInstance( geometryId1 );
			
				matrix = randomizeMatrix( matrix ); 

				x.leaves[i].setMatrixAt( instancedId0, matrix ); 				
				x.trunk[i].setMatrixAt( instancedId1, matrix ); 
			}
			
			//if (i==0) {
				grups[0].add(x.leaves[i]); 
				grups[0].add(x.trunk[i]); 
			//} else {
				//grups[1].add(x.leaves[i]); 
				//grups[1].add(x.trunk[i]); 
			//}			
			
			x.leaves[i].visible = x.trunk[i].visible = false; 
		}		

	
		const loader1 = new THREE.TextureLoader(), 
			  loader2 = new THREE.TextureLoader(), 
			  loader3 = new THREE.TextureLoader(), 
			  loader4 = new THREE.TextureLoader(), 
			  loader5 = new THREE.TextureLoader(), 
			  loader6 = new THREE.TextureLoader(), 
			  url2 = 'obj/trees/11/mat/'; 

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			x.materials2[0].map = tx1; 
			x.materials2[0].needsUpdate = true;
			
			for ( let l = 0; l < 1; l++ ) {	
				x.trunk[l].visible = true; 
			}
		});  
		
		loader2.load( url2 + 'alfa1.jpg', function(tx2) { 	
			x.materials2[0].alphaMap = tx2; 
			x.materials2[0].needsUpdate = true;

			for ( let m = 0; m < 1; m++ ) {				 
				x.leaves[m].visible = true; 
			}
		});  

		loader3.load( url2 + 'normal1.jpg', function(tx3) { 	
			x.materials2[0].normalMap = tx3; 
			x.materials2[0].needsUpdate = true;

			for ( let n = 0; n < 1; n++ ) {				 
				x.leaves[n].visible = true; 
			}
		});  

		loader4.load( url2 + 'color2.jpg', function(tx4) { 	
			x.materials2[1].map = tx4; 
			x.materials2[1].needsUpdate = true;
			
			for ( let o = 0; o < 1; o++ ) {	
				x.trunk[o].visible = true; 
			}
		});  
		
		loader5.load( url2 + 'rough2.jpg', function(tx5) { 	
			x.materials2[1].roughnessMap = tx5; 
			x.materials2[1].needsUpdate = true;

			for ( let p = 0; p < 1; p++ ) {				 
				x.leaves[p].visible = true; 
			}
		});  

		loader6.load( url2 + 'normal2.jpg', function(tx6) { 	
			x.materials2[0].normalMap = tx6; 
			x.materials2[0].needsUpdate = true;

			for ( let q = 0; q < 1; q++ ) {				 
				x.leaves[q].visible = true; 
			}
		});  

		addCar(); 
		//animFBX(); 
	}); 

}

function addCar() {
	let meshCount = 0; 
	//x.car = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/car/4/car.obj', function ( object ) {
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

		x.car = object; 
		
		
		const matr = [], 
			  url2 = 'obj/car/4/mat/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .25, metalness: .25 } );
			
			x.car.children[i].material = matr[i]; 
		}
		
		x.car.scale.set(30, 30, 30); 
		x.car.position.set(140, 0, 20);
		x.car.rotation.set(Math.PI/-2, 0, Math.PI);
		grups[0].add(x.car); 
		
		const loader1 = new THREE.TextureLoader();   

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			x.car.children[0].material.map = x.car.children[0].material.metalnessMap = tx1; 
			x.car.children[0].material.needsUpdate = true; 
		});  
		
		fadeScene(); 
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
	
		camera.position.z = 450; 
	
		if (isMobil) x.xx = 800;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		camera.position.z = 600; 
		
		if (isMobil) x.xx = 1100; 
	}		
	
	
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
		
		x.camGrup.rotation.y = Math.sin(timer*.1) * Math.PI/3; 

		if (isMobil) {
			//camera.position.x += Math.cos(timer*.5) * 50; 
			//camera.position.y += Math.sin(timer*.5) * 20; 
			camera.position.x = Math.sin(timer*.1) * 150; 
			camera.position.y = Math.sin(timer*.15) * 160 + 175; 
		} else {
			//camera.position.x += _.pointer.x * 1; 
			//camera.position.y += (_.pointer.y * 1);
			camera.position.x = _.pointer.x * 150; 
			camera.position.y = (_.pointer.y * 160) + 175;
		}

		
		//x.leaves[0].rotation.y = Math.cos(timer) * .005; 
		
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
		//let url = 'sexy-lounge-music-131701'; 	
		let url = 'rchvz'; 	
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
	
	