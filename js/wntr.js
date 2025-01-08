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
	kontainer.style.background = "url('img/winterl.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#d4dbe0';		

	//const fogCol = 0x000000; 
//	const fogCol = 0xd0d4d6; 
	//const fogCol = 0xe7f9ff; 
	const fogCol = 0xd4dbe0; 

	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 1200; 		//1200 or 0 - camGrup pos z
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
	scene.fog = new THREE.FogExp2(fogCol, 0.002);	
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
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x787878 ) );	

	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 100000000, 10000, Math.PI/8, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 0, 5000, 0 );
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
	
	//x.spotLight[0].shadow.intensity = .7;
	
//	scene.add( x.spotLight[0] );	
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

	const dLSize = 700,  
		  dLSize2 = 1200; 
	
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
	//const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
	directionalLight.castShadow = true; 
	//directionalLight.shadow.mapSize.width = 1024; 
	//directionalLight.shadow.mapSize.height = 1024; 
	//directionalLight.shadow.camera.near = 1; 
	directionalLight.shadow.camera.far = 500;	
	directionalLight.shadow.camera.left = -dLSize; 
	directionalLight.shadow.camera.bottom = -dLSize2; 
	directionalLight.shadow.camera.right = dLSize; 
	directionalLight.shadow.camera.top = dLSize2; 
	directionalLight.position.set( 0, 300, 0 );
	directionalLight.shadow.intensity = .7; 
	scene.add( directionalLight );


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
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    //controls.autoRotate = true;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 9000;    
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
	x.target0.position.set(0, _.ej[5] / 2, x.camGrup.position.z - 200); 
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
	
	x.snowIt = []; 
	x.snowIt[0] = 0; 
	x.snowIt[1] = 2; 
	
//	addSkybox(); 
	addClouds(); 
	//addFloor(); 
	//addFog(); 	
	addGround(); 
	addTrees(); 	
//	addWall(); 
//	addNaut(); 
	
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

		fadeScene(); 
		
		//scene.backgroundRotation.set(0, 3.8, 0); 
	//	scene.backgroundRotation.set(0, (Math.PI/-2) + .64, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = 3; 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		//addFog(); 
		
		//addSea(); 
		//addTree(); 
		
		addEarth(); 
		addMoon(); 
		addSun(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
*/

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

function addGround() {
	x.ground = []; 
	
	let width = 1400, 
		//height = 602, 
		height = 1202,  
		posX = 0, 
		posZ = (height-2)/2, 
		rez = 100,  
		intrvl = 400, 
		kolor = 0xeeeeee; 
		
	let geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	//let geometry = new THREE.PlaneGeometry( width, height );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .9, metalness: 0 } );
	//material.flatShading = true; 
	//material.wireframe = true; 
	
	for ( let i = 0; i < 2; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
	
		x.ground[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);
		//x.ground[i].position.set(0, florY, posZ);
		x.ground[i].position.set(0, florY, 0);
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
		grups[i].add( x.ground[i] ); 
	//	grups[i].position.z = pozZ; 
		
		//x.spotLight[i].target = x.ground[i];	
	}

	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	loader.load( 'img/ground/snow/color1.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx.repeat.set(4, 4);    
		
		for ( let j = 0; j < 2; j++ ) {	
			x.ground[j].material.map = tx; 
			x.ground[j].material.needsUpdate = true;
			//x.ground[j].visible = true; 
		}
	});  		

	//loader2.load( 'img/spacew/terr1.jpg', function(tx2) { 	
	loader2.load( 'img/snowground.jpg', function(tx2) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx.repeat.set(4, 4);    
		
		for ( let j = 0; j < 2; j++ ) {	
			//x.ground[j].material.map = tx; 
			//x.ground[j].material.aoMap = tx; 			
			//x.ground[j].material.bumpMap = tx; 
			//x.ground[j].material.normalScale.set(-.8, -.8); 
			//x.ground[j].material.normalMap = tx2; 
			//x.ground[j].material.roughnessMap = tx; 
			x.ground[j].material.displacementScale = 40; 
			x.ground[j].material.displacementBias = -5; 
			x.ground[j].material.displacementMap = tx2;			
			x.ground[j].material.needsUpdate = true;
			//x.ground[j].visible = true; 
		}
	});  		

	loader3.load( 'img/ground/snow/normal1.jpg', function(tx3) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx.repeat.set(4, 4);    
		
		for ( let j = 0; j < 2; j++ ) {	
			x.ground[j].material.normalScale.set(1.5, 1.5); 
			x.ground[j].material.normalMap = tx3; 
			x.ground[j].material.needsUpdate = true;
			//x.ground[j].visible = true; 
		}
	});  		

	loader4.load( 'img/ground/snow/rough1.jpg', function(tx4) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx.repeat.set(4, 4);    
		
		for ( let j = 0; j < 2; j++ ) {	
			x.ground[j].material.roughnessMap = tx4; 
			x.ground[j].material.needsUpdate = true;
			//x.ground[j].visible = true; 
		}
	});  		


	grups[0].position.z = 600; 
	grups[1].position.z = -600; 
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 	

	addSnow(); 
}

function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//let posx = (Math.random() * 900 - 450); 
	let posx = (Math.random() * 1200 - 600); 
		
	if ((posx > -40) && (posx < 40)) {
		let rnd = Math.random() < 0.5 ? -1 : 1;
		posx = 42 * rnd; 
		//console.log(posx);
	}
		
	position.x = posx;
	position.y = florY;
	position.z = (Math.random() * 1100 - 550);

	rotation.y = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = 4 + Math.random() * 2;

	return matrix.compose( position, quaternion, scale );
}

function addTrees() {
	//let meshCount = 0; 
	x.materials2 = []; 
	x.leaves = []; 
	x.trunk = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/8/pine.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				//child.geometry.computeBoundingBox();		
				
				//child.castShadow = true; 
				//child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.materials2[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .7, alphaTest: .5 } );		
		x.materials2[0].shadowSide = THREE.FrontSide; 
		
		x.materials2[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8 } );		
		
		for ( let i = 0; i < 2; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  qty = 70; 			
		
			x.leaves[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, x.materials2[0] );
			x.leaves[i].frustumCulled = true;
			x.leaves[i].castShadow = x.leaves[i].receiveShadow = true;

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
			
			if (i==0) {
				grups[0].add(x.leaves[i]); 
				grups[0].add(x.trunk[i]); 
			} else {
				grups[1].add(x.leaves[i]); 
				grups[1].add(x.trunk[i]); 
			}			
			
			x.leaves[i].visible = x.trunk[i].visible = false; 
		}		

	
		let	loader = new THREE.TextureLoader(), 
			loader2 = new THREE.TextureLoader(); 

		loader.load( 'obj/trees/8/color1.jpg', function(tx) { 	
		//loader.load( 'obj/trees/evergreend.jpg', function(tx) { 	
			x.materials2[0].map = x.materials2[1].map = tx; 
			x.materials2[0].needsUpdate = x.materials2[1].needsUpdate = true;
			
			for ( let l = 0; l < 2; l++ ) {	
				x.trunk[l].visible = true; 
			}
		});  
		
		loader2.load( 'obj/trees/8/alfa1.jpg', function(tx2) { 	
			x.materials2[0].alphaMap = tx2; 
			x.materials2[0].needsUpdate = true;

			for ( let m = 0; m < 2; m++ ) {				 
				x.leaves[m].visible = true; 
			}
		});  

		//fadeScene(); 
		//animFBX(); 
	}); 

}

function randMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 900 - 450; 
		
//	if ((posx > -175) && (posx < 175)) {
//		let rnd = Math.random() < 0.5 ? -1 : 1;

//		posx = 182 * rnd; 
		//console.log(posx);
//	}
		
	position.x = posx;
	//position.y = Math.random() * -500 + florY;
	position.y = Math.random() * 500 - 250;
	//position.y = 13;
	//position.z = Math.random() * 2000 - 1000;
	position.z = Math.random() * 1200 - 600; 
	//position.z = 15;

/*	rotation.x = Math.random() * (Math.PI/4);
	if (position.y < 0) rotation.x *= -1; 
	
	//rotation.y = (Math.random() * .2 - .1) * Math.PI;
	rotation.y = Math.random() * (Math.PI/4);
	if (position.x > 0) rotation.y *= -1; 
	
	if (position.z > 0) rotation.y *= -1; 
*/	

//	rotation.z = Math.random() * 2 * Math.PI;	

	quaternion.setFromEuler( rotation );

	const scl = Math.random() * .1 + 1; 
	//const scl = 1; 
	scale.x = scale.y = scl; 
		
	return matrix.compose( position, quaternion, scale );
}

function addSnow() {
	//x.snow = []; 
	let matrix = []; 
	x.snowMesh = []; 	
	x.material = []; 	
	let geometry = []; 
	
	geometry[0] = new THREE.PlaneGeometry( 2, 2 ); 
//	geometry[1] = new THREE.PlaneGeometry( 2, 2 ); 
	x.material[0] = new THREE.MeshBasicMaterial( { color: 0xeaf1f6, transparent: true } );
//	x.material[1] = new THREE.MeshBasicMaterial( { color: 0xe8eff4, transparent: true } );
	x.material[0].depthWrite = false; 
//	x.material[0].depthWrite = x.material[1].depthWrite = false; 
//	x.material[0].opacity = x.material[1].opacity = 1; 
	//x.material[0].side = THREE.DoubleSide; 
	//console.log(geometry.attributes.position.array.length);
	
	for ( let i = 0; i < 4; i++ ) {	
		const lngth = geometry[0].attributes.position.array.length; 
		//const lngth = 12; 
		
		x.snowMesh[i] = new THREE.BatchedMesh( 1700, lngth, lngth * 2, x.material[0] );
		x.snowMesh[i].frustumCulled = true;
		//x.snowMesh[i].castShadow = true;
		//x.snowMesh[i].receiveShadow = true;
		
		const geometryId = x.snowMesh[i].addGeometry( geometry[0] );
		
		//matrix[i-2] = new THREE.Matrix4(); 
		matrix[i] = new THREE.Matrix4(); 
		
		for ( let j = 0; j < 1700; j ++ ) {
			const instancedId = x.snowMesh[i].addInstance( geometryId );
		
			//x.snowMesh[i].setMatrixAt( instancedId, randMatrix( matrix[i-2] ) ); 
			x.snowMesh[i].setMatrixAt( instancedId, randMatrix( matrix[i] ) ); 
		}
		
		x.snowMesh[i].position.y = 350; 
		
		//grups[i-2].add(x.snowMesh[i]); 
		if (i<2) {
			grups[0].add(x.snowMesh[i]); 
		} else {
			grups[1].add(x.snowMesh[i]); 
		}
	}			
	
	let	loader = new THREE.TextureLoader(),    
		loader2 = new THREE.TextureLoader(); 
	
/*	loader.load( 'img/snow1.jpg', function(tx) { 	
		x.material[0].map = x.material[1].map = tx; 
		x.material[0].needsUpdate = x.material[1].needsUpdate = true;
	}); 
*/

	loader2.load( 'img/spotL2.jpg', function(tx2) { 	
		//x.material[0].map = x.material[1].map = tx2; 
		//x.material[0].alphaMap = x.material[1].alphaMap = tx2; 
		x.material[0].alphaMap = tx2; 
		x.material[0].needsUpdate = true;
		//x.material[0].needsUpdate = x.material[1].needsUpdate = true;
		//x.snow[k].visible = true; 
		
		animFBX(); 
		//fadeScene(); 
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
	
		if (isMobil) x.xx = 800;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		if (isMobil) x.xx = 1100; 
	}		
	
	
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
	
	if (x.camGrup.position.z == 600) {
		x.snowIt[0] = Math.abs(x.snowIt[0] - 2); 
		x.snowIt[1] = Math.abs(x.snowIt[1] - 2);  
		//x.snowIt[2] = ; 
		//x.snowIt[3] = ; 
	}	
}


function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		//const timer = Date.now() * 0.00008;
		//const timer = Date.now() * 0.00024;
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		const delta = clock.getDelta() * .85;
		//const delta = clock.getDelta() * 1.7;
		if ( mixer ) mixer.update( delta );			
		
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

		camera.position.x = (Math.cos(timer*5) * 2); 
		camera.position.y = (Math.sin(timer*10) * 3) + _.ej[5]; 

		//camera.position.x += _.pointer.x * -200 * (_.ej[1]/2); 
		
		if (isMobil) {
			camera.position.x += Math.cos(timer*.5) * 50; 
			camera.position.y += Math.sin(timer*.5) * 20; 
		} else {
			camera.position.x += _.pointer.x * 50; 
			camera.position.y += (_.pointer.y * 20);
		}

		//x.leaves[0].rotation.x = Math.cos(timer*3) * .002; 
		//x.leaves[0].rotation.y = Math.cos(timer*3) * .002; 
		//x.leaves[0].rotation.z = Math.cos(timer*3) * .002; 

		
		//if (x.snowMesh[0].position.y > -250) x.snowMesh[0].position.y -= .1; 
		//if (x.snowMesh[1].position.y > -250) x.snowMesh[1].position.y -= .2; 
		
		x.snowMesh[x.snowIt[0]].position.y = (x.snowMesh[x.snowIt[0]].position.y > -250) ? (x.snowMesh[x.snowIt[0]].position.y -= .5) : 350; 
		x.snowMesh[x.snowIt[0]+1].position.y = (x.snowMesh[x.snowIt[0]+1].position.y > -250) ? (x.snowMesh[x.snowIt[0]+1].position.y -= .3) : 350; 
		
		x.snowMesh[x.snowIt[0]].rotation.y = Math.cos(timer*1.3) * .05; 
		x.snowMesh[x.snowIt[0]+1].rotation.y = Math.sin(timer*.8) * .04; 
		
		if (x.camGrup.position.z < 600) {
			x.snowMesh[x.snowIt[1]].position.y = (x.snowMesh[x.snowIt[1]].position.y > -250) ? (x.snowMesh[x.snowIt[1]].position.y -= .5) : 350; 
			x.snowMesh[x.snowIt[1]+1].position.y = (x.snowMesh[x.snowIt[1]+1].position.y > -250) ? (x.snowMesh[x.snowIt[1]+1].position.y -= .3) : 350; 
				
			x.snowMesh[x.snowIt[1]].rotation.y = Math.cos(timer*1.3) * .05; 
			x.snowMesh[x.snowIt[1]+1].rotation.y = Math.sin(timer*.8) * .04; 
		}
		
		
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
	//camera.lookAt(x.target0.position);
	camera.lookAt(x.target0.position);
	//camera.lookAt(x.wall[0].position);
	
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
		const scl = .38; 
		
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
		x.char1.position.set(0, -12, -150); 
		x.char1.rotation.set(0, Math.PI, 0);	
		
		x.camGrup.add( x.char1 ); 
	//	grups[1].add( x.char1 ); 
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
		let url = 'wntr'; 	
		//let url = 'rth'; 	
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
	
	