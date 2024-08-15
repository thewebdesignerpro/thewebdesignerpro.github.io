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
	
	kontainer.style.background = "url('img/thewebdesignerprol.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#909496';		

	//const fogCol = 0x606873; 
	const fogCol = 0x909496; 

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
	scene.fog = new THREE.FogExp2(fogCol, 0.012);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 10000 );
	//camera.position.set(0, 0, 500); 
//	camera.position.set(0, _.ej[5], -100); 
	camera.position.set(0, _.ej[5], 10); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x5e5e5e ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 30000000, 7000, Math.PI/32, 1 );
	x.spotLight[0].position.set( 0, 3000, 1500 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width = 1024;
	x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 10;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = 1.77;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	
//	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, 0, 0); 
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 30000, 450 );
	
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
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .8;
    controls.zoomSpeed = 5;
    controls.panSpeed = 3;
	//controls.update();		
	controls.enabled = false; 
*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
//	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
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
//	x.targetO.position.set(0, 0, x.camGrup.position.z - 500); 
	x.targetO.position.set(0, 0, x.camGrup.position.z - 100); 
	scene.add(x.targetO);
	
//	x.spotLight[0].target = x.targetO; 
	
//	controls.target = x.targetO.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	//addSkybox(); 
	addClouds(); 
	addCourtyard(); 
	addGround(); 
	addTrees(); 
	addLamps(); 
	addBenches(); 
	//addFog(); 
	
	//animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	const f = '.png'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/3/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
	], function ( tx ) {
		//tx.flipY = true; 
		//tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		scene.background = x.skybox; 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
	
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

function randMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 3000 - 1500; 
		
//	if ((posx > -175) && (posx < 175)) {
//		let rnd = Math.random() < 0.5 ? -1 : 1;

//		posx = 182 * rnd; 
		//console.log(posx);
//	}
		
	position.x = posx;
//	position.y = Math.random() * -500 + florY;
	position.y = Math.random() * 50 + florY;
	position.z = Math.random() * 3000 - 1500;

	rotation.x = Math.random() * (Math.PI/4);
	if (position.y < 0) rotation.x *= -1; 
	
	//rotation.y = (Math.random() * .2 - .1) * Math.PI;
	rotation.y = Math.random() * (Math.PI/4);
	if (position.x > 0) rotation.y *= -1; 
	
	if (position.z > 0) rotation.y *= -1; 
	
	rotation.z = Math.random() * 2 * Math.PI;	

	quaternion.setFromEuler( rotation );

	const scl = Math.random() * .3 + 1; 
	scale.x = scale.y = scl; 
		
	return matrix.compose( position, quaternion, scale );
}

/*function addFog() {
	//x.fog = []; 
	let matrix = []; 
	
	const geometry = new THREE.PlaneGeometry( 200, 200 ); 
	//x.material[1] = new THREE.MeshBasicMaterial( { color: 0xd0d8e3, transparent: true } );
	x.material[1] = new THREE.MeshBasicMaterial( { color: 0xd4d8da, transparent: true } );
	x.material[1].depthWrite = false; 
	x.material[1].opacity = .8; 
	x.material[1].side = THREE.DoubleSide; 
	//console.log(geometry.attributes.position.array.length);
	
	for ( let i = 2; i < 4; i++ ) {	
		const lngth = geometry.attributes.position.array.length; 
		//const lngth = 12; 
		
		x.batchedMesh[i] = new THREE.BatchedMesh( 3000, lngth, lngth * 2, x.material[1] );
		x.batchedMesh[i].frustumCulled = true;
		//x.batchedMesh[i].castShadow = true;
		//x.batchedMesh[i].receiveShadow = true;
		
		const geometryId = x.batchedMesh[i].addGeometry( geometry );
		
		matrix[i-2] = new THREE.Matrix4(); 
		
		for ( let j = 0; j < 3000; j ++ ) {
			const instancedId = x.batchedMesh[i].addInstance( geometryId );
		
			x.batchedMesh[i].setMatrixAt( instancedId, randMatrix( matrix[i-2] ) ); 
		}
		
		grups[i-2].add(x.batchedMesh[i]); 
	}			
	
	let	loader = new THREE.TextureLoader();   
		//loader2 = new THREE.TextureLoader(); 
	
	loader.load( 'img/ulap5.png', function(tx) { 	
		x.material[1].map = tx; 
		x.material[1].alphaMap = tx; 
		x.material[1].needsUpdate = true;
		//x.fog[k].visible = true; 
	}); 
	
	fadeScene(); 
}
*/
	
function addCourtyard() {
	//let meshCount = 0; 
	x.courtyard = [];
	x.batchedMesh = []; 	
	x.material = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/courtyard/1/cyard.obj', function ( object ) {
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
				
				//meshCount += 1; 
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
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.courtyard.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		for ( let i = 0; i < 3; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: .8, metalness: .1 } );
			//material[i].side = THREE.DoubleSide; 
			x.courtyard[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.courtyard[i].castShadow = true; 
			x.courtyard[i].receiveShadow = true; 			
			
			//x.courtyard[i].position.set(0, florY+0, 0); 
			x.courtyard[i].rotation.set(0, Math.PI/2, 0); 
			x.courtyard[i].scale.set(100, 100, 100); 
		
			grups[0].add( x.courtyard[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		//load1.load( 'obj/courtyard/1/mat/9b36a8f3.jpg', function(tx) { 
		load1.load( 'obj/courtyard/1/mat/c0.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.courtyard[0].material.map = tx; 
				x.courtyard[0].material.needsUpdate = true; 
			//}
			//x.courtyard.visible = true; 
		}); 			

		//load2.load( 'obj/courtyard/1/mat/f6712ed1.jpg', function(tx2) { 
		load2.load( 'obj/courtyard/1/mat/c1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.courtyard[1].material.map = tx2; 
				x.courtyard[1].material.bumpMap = tx2; 
				x.courtyard[1].material.bumpScale = 15; 				
				x.courtyard[1].material.needsUpdate = true; 
			//}
			//x.courtyard.visible = true; 
		}); 			

		//load3.load( 'obj/courtyard/1/mat/05affd98.jpg', function(tx3) { 
		load3.load( 'obj/courtyard/1/mat/c2.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.courtyard[2].material.map = tx3; 
				x.courtyard[2].material.bumpMap = tx3; 
				x.courtyard[2].material.bumpScale = 5; 
				x.courtyard[2].material.needsUpdate = true; 
			//}
			//x.courtyard.visible = true; 
		}); 			

	}); 

	//grups[0].position.set(0, 0, 0);
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 	
	
	fadeScene(); 
}

function addGround() {
	x.floor = []; 
	x.floorShadow = []; 
	
	const width = 350, 
		height = 350,  
		width2 = 350, 
		height2 = 350,  
		posX = 0, 
		//intrvl = 10000, 
		kolor = 0xb0b0b0; 
		
	const geometry = new THREE.PlaneGeometry( width, height );
	const geometry2 = new THREE.PlaneGeometry( width2, height2 );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .6, metalness: 0 } );
	//let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	//let material = new THREE.MeshLambertMaterial( { color: kolor, transparent: true, opacity: .44 } );
	let material2 = new THREE.ShadowMaterial( { color: 0x000000, transparent: true, opacity: .9 } );
	//material.depthWrite = false; 
	//material.side = THREE.DoubleSide; 
	//material.wireframe = true; 
	
	for ( let i = 0; i < 1; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
	//	let pozZ = height - height*i; 
		let pozZ = 0; 
	
		x.floor[i] = new THREE.Mesh( geometry, material ); 
		x.floorShadow[i] = new THREE.Mesh( geometry2, material2 ); 
		
		//console.log(pozZ);
		x.floor[i].position.set(0, florY-.1, pozZ);
		x.floorShadow[i].position.set(0, florY, pozZ);
		//x.floor[i].position.set(0, florY, 0);
		x.floor[i].rotation.x = Math.PI*-.5;
		x.floorShadow[i].rotation.x = Math.PI*-.5;
		//x.floor[i].castShadow = true; 
	//	x.floor[i].receiveShadow = true; 
		x.floorShadow[i].receiveShadow = true; 
		
		//scene.add( x.floor[i] ); 
		//scene.add( x.floor[i] ); 
		//scene.add( x.floorShadow[i] ); 		
		grups[0].add( x.floor[i] ); 
		grups[0].add( x.floorShadow[i] ); 
		//grups[1].position.z = pozZ; 
		
		//x.spotLight[i].target = x.floor[i];	
	}
	
	//grups[1].position.z = 0; 

	const txU = 7, txV = 7; 
	
	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	//loader.load( 'img/ground/6/pavement_9_basecolor-2K.png', function(tx) { 	
	loader.load( 'img/ground/1/color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(1600, 1600);    
		tx.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.floor[j].material.map = tx; 
			//x.floorShadow[j].material.map = tx; 
			//x.floor[j].material.emissiveMap = tx; 
			//x.floor[j].material.envMap = x.skybox; 
			//x.floor[j].material.envMapIntensity = 1; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx; 
			//x.floor[j].material.roughnessMap = tx; 
			x.floor[j].material.needsUpdate = true;
			//x.floorShadow[j].material.needsUpdate = true;
			//x.floor[j].visible = true; 
		}
	});  		

	//loader2.load( 'img/ground/6/pavement_9_roughness-2K.png', function(tx2) { 	
	loader2.load( 'img/ground/1/rough1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(txU, txV);    
		
		x.floor[0].material.roughnessMap = tx2; 
		x.floor[0].material.needsUpdate = true;
	});		
	
	//loader3.load( 'img/ground/6/pavement_9_normal-2K.png', function(tx3) { 	
	loader3.load( 'img/ground/1/normal2.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			//x.floor[l].material.bumpScale = 25.; 
			//x.floor[l].material.bumpMap = tx3; 
			//x.floor[l].material.displacementScale = 10; 
			//x.floor[l].material.displacementBias = -5; 
			//x.floor[l].material.displacementMap = tx3; 
			//x.floor[l].material.roughnessMap = tx3; 
			x.floor[l].material.normalScale.set(1.3, 1.3); 
			x.floor[l].material.normalMap = tx3; 			
			x.floor[l].material.needsUpdate = true;
		}
	});		
	
	/*loader4.load( 'img/ground/1/2K-ground_cracked-displacement.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(5, 5);    
		
		x.floor[0].material.bumpScale = 10; 
		//x.floor[0].material.bumpMap = tx4; 
		x.floor[0].material.needsUpdate = true;
	});	*/
	
}

function randomizeMatrix( matrix, scl ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 240 - 120,  
		posz = Math.random() * 240 - 120; 
		
	if ((posz > -73) && (posz < 73) && (posx > -55) && (posx < 55)) {
		//let rnd = Math.random() < 0.5 ? -1 : 1;
		let rnd = posx < 0 ? -1 : 1;

		posx = (Math.random() * 30 + 55) * rnd; 
		
		//posx = 55 * rnd; 
		//console.log(posx);
	}
		
	//position.x = 55;
	position.x = posx;
	//position.y = (Math.random() * 100) - 100 + florY;
	position.y = florY;
	//position.z = Math.random() * 300 - 150;
	position.z = posz;

	rotation.x = Math.PI/-2;
	rotation.y = 0;
	rotation.z = Math.random() * 2 * Math.PI;
	
	//x.trees[i].position.set(-50, florY+0, -30); 
	//x.trees[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI ); 	

	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = scl + ( Math.random() * .25 );

	return matrix.compose( position, quaternion, scale );

}
	
function addTrees() {
	//let meshCount = 0; 
	//x.trunks = []; 
	//x.leaves = []; 
	x.materials = []; 
	//const matrix; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/4/tree.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		x.materials[0] = new THREE.MeshStandardMaterial( { color: 0xffddee, roughness: .8, metalness: 0, transparent: true } );		
		x.materials[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );		
		x.materials[0].depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth1 = object.children[0].geometry.attributes.position.array.length,  
				  lngth2 = object.children[1].geometry.attributes.position.array.length, 
				  qty = 40; 			
		
			x.leaves = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, x.materials[0] );
			x.leaves.frustumCulled = true;
			x.leaves.castShadow = true;
			
			x.trunks = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, x.materials[1] );
			x.trunks.frustumCulled = true;
			x.trunks.castShadow = x.trunks.receiveShadow = true;
			
			const geometryId1 = x.leaves.addGeometry( object.children[0].geometry ), 
				  geometryId2 = x.trunks.addGeometry( object.children[1].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId1 = x.leaves.addInstance( geometryId1 ), 
					  instancedId2 = x.trunks.addInstance( geometryId2 );
			
				//randomizeMatrix( matrix[i] );
				//x.leaves.setMatrixAt( instancedId, randomizeMatrix( matrix[i], 19 ) ); 
				
				matrix = randomizeMatrix( matrix, .75 ); 
				
				x.leaves.setMatrixAt( instancedId1, matrix ); 
				x.trunks.setMatrixAt( instancedId2, matrix ); 
			
			}
			
			grups[0].add(x.leaves); 
			grups[0].add(x.trunks); 
		//}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/trees/4/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.materials[0].map = tx; 
			x.materials[0].needsUpdate = true; 
		}); 			

		//load2.load( 'obj/trees/4/mat/RGB_42683024644d4324b76d8662cb48e373_Bark001_2K_JPG.png', function(tx2) { 
		load2.load( 'obj/trees/4/mat/bark1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.materials[1].map = x.materials[0].bumpMap = tx2; 
			x.materials[1].bumpScale = 3; 
			x.materials[1].needsUpdate = true; 		
		}); 			

		//load3.load( 'obj/trees/4/mat/A_af725e1eafd34d1e9cc6c4f8ff38a112_Sakura_Opacity.png', function(tx3) { 
		load3.load( 'obj/trees/4/mat/alpha1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			x.materials[0].alphaMap = tx3; 
			x.materials[0].needsUpdate = true; 				
		}); 			

	}); 

}

function randomizeMatrix2( matrix, scl, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	/*let posx = Math.random() * 240 - 120,  
		posz = Math.random() * 240 - 120; 
		
	if ((posz > -73) && (posz < 73) && (posx > -55) && (posx < 55)) {
		//let rnd = Math.random() < 0.5 ? -1 : 1;
		let rnd = posx < 0 ? -1 : 1;

	//	posx = (Math.random() * 30 + 55) * rnd; 
		
		//posx = 55 * rnd; 
		//console.log(posx);
	}*/
	
	const posXZ = [{x: -15, z: -14}, {x: 11.3, z: -14}, {x: -15, z: 33}, {x: 11.3, z: 33}, {x: -19, z: 9}, {x: 15.3, z: 9}]; 
		
	//position.x = 55;
	position.x = posXZ[j].x;
	//position.y = (Math.random() * 100) - 100 + florY;
	//position.y = florY + scl - .07;
	position.y = florY + (scl * 1.22);
	//position.z = Math.random() * 300 - 150;
	position.z = posXZ[j].z;

	rotation.x = 0;
	//rotation.y = Math.random() * 2 * Math.PI;
	rotation.y = 0;
	rotation.z = 0;
	
	//x.trees[i].position.set(-50, florY+0, -30); 
	//x.trees[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI ); 	

	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = scl + ( Math.random() * .25 );
	scale.x = scale.y = scale.z = scl;

	return matrix.compose( position, quaternion, scale );

}

function addLamps() {
	//let meshCount = 0; 
	x.material = []; 
	//const matrix; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/lamp/2/lamp.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		x.material[0] = new THREE.MeshStandardMaterial( { color: 0xb2b2b2, roughness: .9, metalness: .1 } );
		//x.material[1] = new THREE.MeshStandardMaterial( { color: 0xffddee, roughness: .8, metalness: 0, transparent: true } );
		//x.material[0].depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		const lngth1 = object.children[0].geometry.attributes.position.array.length,  
			  //lngth2 = object.children[1].geometry.attributes.position.array.length, 
			  qty = 6; 			
		
		x.lamps = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, x.material[0] );
		x.lamps.frustumCulled = true;
		x.lamps.castShadow = x.lamps.receiveShadow = true;
		
		const geometryId1 = x.lamps.addGeometry( object.children[0].geometry ); 
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId1 = x.lamps.addInstance( geometryId1 );
		
			matrix = randomizeMatrix2( matrix, 3, j ); 
			
			x.lamps.setMatrixAt( instancedId1, matrix ); 
		}
		
		grups[0].add(x.lamps); 

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/lamp/2/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.material[0].map = tx; 
			x.material[0].needsUpdate = true; 
		}); 			

		load2.load( 'obj/lamp/2/mat/rough1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.material[0].roughnessMap = tx2; 
			x.material[0].needsUpdate = true; 		
		}); 			

		load3.load( 'obj/lamp/2/mat/normal1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			x.material[0].normalScale.set(.25, .25);   
			x.material[0].normalMap = tx3; 
			x.material[0].needsUpdate = true; 				
		}); 			

	}); 

}

function randomizeMatrix3( matrix, scl, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	const posXZ = [{x: -19, z: 0}, {x: -19, z: 18}, {x: 15.3, z: 0}, {x: 15.3, z: 18}]; 
		
	position.x = posXZ[j].x;
	position.y = florY + (scl * .46);
	position.z = posXZ[j].z;

	rotation.x = 0;
	rotation.y = 0;
	rotation.z = 0;
	
	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = scl;

	return matrix.compose( position, quaternion, scale );
}

function addBenches() {
	//let meshCount = 0; 
	x.material2 = []; 
	//const matrix; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/bench/1/bench.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		x.material2[0] = new THREE.MeshStandardMaterial( { color: 0x999999, roughness: .9, metalness: .1 } );
		//x.material[1] = new THREE.MeshStandardMaterial( { color: 0xffddee, roughness: .8, metalness: 0, transparent: true } );
		//x.material[0].depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		const lngth1 = object.children[0].geometry.attributes.position.array.length,  
			  //lngth2 = object.children[1].geometry.attributes.position.array.length, 
			  qty = 4; 			
		
		x.benches = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, x.material2[0] );
		x.benches.frustumCulled = true;
		x.benches.castShadow = x.benches.receiveShadow = true;
		
		const geometryId1 = x.benches.addGeometry( object.children[0].geometry ); 
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId1 = x.benches.addInstance( geometryId1 );
		
			matrix = randomizeMatrix3( matrix, 2.8, j ); 
			
			x.benches.setMatrixAt( instancedId1, matrix ); 
		}
		
		grups[0].add(x.benches); 

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/bench/1/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.material2[0].map = tx; 
			x.material2[0].needsUpdate = true; 
		}); 			

		load2.load( 'obj/bench/1/mat/rough1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.material2[0].roughnessMap = tx2; 
			x.material2[0].needsUpdate = true; 		
		}); 			

		load3.load( 'obj/bench/1/mat/normal1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//x.material2[0].normalScale.set(.25, .25);   
			x.material2[0].normalMap = tx3; 
			x.material2[0].needsUpdate = true; 				
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
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
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

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		const timer = Date.now() * 0.00008;
		//console.log(timer); 
		
		const delta = clock.getDelta() * .3;
	//	if ( mixer ) mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
		
	//	camera.position.x = Math.cos(timer) * .5; 
	//	camera.position.y = Math.sin(timer*2) * .5; 

		if (isMobil) {
			//camera.position.x += Math.cos(timer*.5) * 15; 
			//camera.position.y += Math.sin(timer*.25) * 15 + 10; 	

			const t25 = Math.sin(timer*2); 
			camera.position.x = t25 * 15; 
			//camera.position.y = Math.sin(timer*.25) * 35 + 5; 
			const camY = t25 * 35; 
			camera.position.y = camY > -5 ? camY : -5; 
			//camera.position.z = camera.position.y * 1.75 + 10;
			camera.rotation.x = t25 * -.7; 
		} else {
			//camera.position.x += _.pointer.x * 15; 
			camera.position.x = _.pointer.x * 15; 
		//	camera.position.y += (_.pointer.y * 500) + 400;
			//camera.position.y += (_.pointer.y * 25) + 13;
			//camera.position.z = (_.pointer.y * 50);
			const pY = _.pointer.y * 35; 
			camera.position.y = pY > -5 ? pY : -5;
			//camera.position.z = camera.position.y * 1.75 + 10;
			camera.rotation.x = _.pointer.y * -.7; 
		}
		
		camera.position.z = camera.position.y * 1.75 + 10; 
	
	//	animWalk(); 
	
		//grups[0].rotation.x = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.y = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.z = Math.cos(timer*.1) * .5; 
		
		//camera.rotation.y = Math.cos(timer*.05) * 3; 
		x.camGrup.rotation.y = Math.cos(timer) * 2.7; 
	
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
//	camera.lookAt(x.targetO.position);
	//camera.lookAt(x.wall[0].position);

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
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'sinister-mystery-174823'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'gloomy-reverie-190650'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		let url = 'acy'; 	
		url += '.mp3'; 	
		
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
			x.sound.setVolume( 0.75 );
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
	
	