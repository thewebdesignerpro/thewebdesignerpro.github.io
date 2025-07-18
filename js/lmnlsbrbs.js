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
//import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'; 
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
	kontainer.style.background = "url('img/liminalsuburbsl.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#d7d9db';		

	//const fogCol = 0xd8dadc; 
	const fogCol = 0xd7d9db; 

	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = -100; 			//2000 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 75;			//70 or 35	
	
	//x.xx = 400; 
	x.zz = 450; 
	
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true; 
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 1;		
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
	scene.fog = new THREE.FogExp2(fogCol, 0.00048);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	//grups[0] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 20000 );
	//camera.position.set(0, _.ej[5], -100); 
	camera.position.set(0, _.ej[5], _.ej[3]); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	//x.camTarget = new THREE.Object3D(); 
	//x.camTarget.position.set(0, 0, 0); 
	//x.camGrup.add(x.camTarget);	
	
	scene.add( new THREE.AmbientLight( 0xe1e1e1 ) );		

	//x.spotLcone = []; 
/*	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xeeeeee, 93000, 125, Math.PI/7, 1 );
	//x.spotLight[0].position.set( -100, 140, -310);
	x.spotLight[0].position.set( -100, 140, -225);
	//x.spotLight[0].castShadow = true; 
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width = 1024;
	//x.spotLight[0].shadow.mapSize.height = 1024;
//	x.spotLight[0].shadow.camera.near = 1;
//	x.spotLight[0].shadow.camera.far = 120;
//	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = 3.;
	
	//scene.add( x.spotLight[0] );	
	//grups[0].add( x.spotLight[0] );	
	x.camGrup.add( x.spotLight[0] );	

	x.spotLight[1] = new THREE.SpotLight( 0xeeeeee, 93000, 125, Math.PI/7, 1 );
	x.spotLight[1].position.set( 100, 140, -225 );
	x.camGrup.add( x.spotLight[1] );	

	x.spotTarget = new THREE.Object3D(); 
	x.spotTarget.position.set(0, 84, -215); 
	x.camGrup.add(x.spotTarget);
	
	x.spotLight[0].target = x.spotTarget; 	
	x.spotLight[1].target = x.spotTarget; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	////scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );
    //
	//x.spotLightHelper1 = new THREE.SpotLightHelper( x.spotLight[1] );
	////scene.add( x.spotLightHelper1 );
	//x.camGrup.add( x.spotLightHelper1 );

	//x.spotLight[0].target = camera; 
*/
	
	//x.camGrup.position.set(0, 0, _.ej[3]); 
	x.camGrup.position.set(0, 0, 4000);  
	//x.camGrup.position.set(5000, 200, 5000);  
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	const dLSize = 3000,  
		  dLSize2 = 4000; 
	
	x.directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
	//const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
	x.directionalLight.castShadow = true; 
	x.directionalLight.shadow.mapSize.width = 1024; 
	x.directionalLight.shadow.mapSize.height = 1024; 
	//x.directionalLight.shadow.camera.near = 1; 
	x.directionalLight.shadow.camera.far = 8000;	
	x.directionalLight.shadow.camera.left = -dLSize; 
	x.directionalLight.shadow.camera.bottom = -dLSize2; 
	x.directionalLight.shadow.camera.right = dLSize; 
	x.directionalLight.shadow.camera.top = dLSize2; 
//	x.directionalLight.position.set( 0, 2000, -2000 );
	x.directionalLight.position.set( 0, 750, 4000 );
	//x.directionalLight.position.set( 375, 750, -2000 );
	x.directionalLight.shadow.intensity = .9; 
	scene.add( x.directionalLight );

	
	//const helper = new THREE.DirectionalLightHelper( x.directionalLight, 5 );
	//scene.add( helper );	
	//
	//const helper2 = new THREE.CameraHelper( x.directionalLight.shadow.camera );
	////const helper2 = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helper2 );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .1;
    controls.autoRotateSpeed = .3;	
   // controls.autoRotate = true;    
    controls.minDistance = 0;
    controls.maxDistance = 10000;    
    //controls.minPolarAngle = Math.PI/3;    
    //controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = 1;
    controls.zoomSpeed = 4;
   // controls.enablePan = false;
    controls.panSpeed = 3;
	//controls.update();		
	controls.enabled = false; 
*/
	
	x.rotCam = false; 	
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
	//grups[2] = new THREE.Group(); 
	//grups[3] = new THREE.Group(); 
	
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
	//x.target0.position.set(0, _.ej[5], 0); 
	x.target0.position.set(0, _.ej[5], _.ej[3] - 500); 
	//scene.add(x.target0);
	//grups[0].add(x.target0);
	x.camGrup.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	//x.directionalLight.target = x.target0; 
	
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
	
	//addSkybox(); 
	addClouds(); 
	//addStage(); 
	
	addRoads();  
	addHouses();  
	addPavements();  
	addCurb(); 
	addCurbS(); 
	//addSidewalk();  
	//addGround();  
	addTrees();  	
	//addTreesD();  	
	addGrass();  	
	addLamps(); 
	
	//addFog(); 
	

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

/*function addSkybox() {
	const f = '.png'; 
	//const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/14/' );

	loader.load( [
		//'posx'+f, 'negx'+f,
		//'posy'+f, 'negy'+f,
		//'posz'+f, 'negz'+f
		'left'+f, 'right'+f,
		'top'+f, 'bottom'+f,
		'back'+f, 'front'+f		
	], function ( tx ) {
		//tx.flipY = true; 
		//tx.colorSpace = THREE.SRGBColorSpace;	
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		scene.backgroundRotation.set(0, 1.55, 0); 
	//	scene.backgroundRotation.set(0, Math.PI/2, 0); 
	//	scene.backgroundBlurriness = .03; 
	//	scene.backgroundIntensity = .8; 		
		
		//scene.background = tx; 
		//scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addRoads(); 
		addSea(); 
	} );
	
}
*/	
	
function addClouds() {
	//const geometry = new THREE.SphereGeometry( 3500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	//const geometry = new THREE.SphereGeometry( 2200, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const geometry = new THREE.SphereGeometry( 2000, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	//material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
//	domeClouds.position.y = -1; 
//	domeClouds.rotation.y = Math.PI - .5; 
	//domeClouds.rotation.y = Math.random() * (Math.PI*2); 
//	domeClouds.rotation.y = 1.55; 
	domeClouds.rotation.y = -1.2; 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	domeClouds.position.z = -2000; 
	
	//console.log(domeClouds.rotation.y); 
	
	//scene.add( domeClouds );
	x.camGrup.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	//load1.load( 'img/skybox/0/mway3b.jpg', function(tx) { 
	load1.load( 'img/skybox/14/dome2.jpg', function(tx) { 
		//tx.colorSpace = THREE.SRGBColorSpace; 
		//tx.colorSpace = THREE.LinearSRGBColorSpace; 	
	
		domeClouds.material.map = tx; 
		domeClouds.material.needsUpdate = true; 
	}); 	

	//load2.load( 'img/skybox/0/alpha3.jpg', function(tx2) { 
	//	domeClouds.material.alphaMap = tx2; 
	//	domeClouds.material.needsUpdate = true; 
	//}); 
	
	//addRoads(); 
	//addSea(); 
	//addSun(); 	
}

function addRoads() {
	x.road = []; 
	
	const width = 400, 
		  //height = 1000,  
		  height = 8000,  
		  kolor = 0xffffff, 
		  //posZ = [500, -500, 500, -500],
		  posZ = [2000, -2000],
		  roadMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//roadMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	
	//for ( let i = 0; i < 4; i++ ) {	
	for ( let i = 0; i < 1; i++ ) {	
		roadMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 1 } ); 
		//roadMater[i].flatShading = true; 
	//	roadMater[i].transparent = true; 
		//roadMater[i].opacity = .9; 
		roadMater[i].wireframe = true; 	
	
		x.road[i] = new THREE.Mesh( geometry, roadMater[i] ); 
		
	//	x.road[i].position.set(0, florY, posZ[i]);
		x.road[i].position.set(0, florY-10, 0);
		//x.road[i].position.set(0, florY, 0);
		x.road[i].rotation.x = Math.PI/-2;
		//x.road[i].castShadow = true; 
		x.road[i].receiveShadow = true; 
		
		//if (i < 2) {
		//	grups[0].add( x.road[i] ); 
		//} else {
		//	grups[1].add( x.road[i] ); 
		//}
		
		scene.add( x.road[i] ); 
	}

	const loader0 = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(),   
		  loader3 = new THREE.TextureLoader(),   
		  tU = 1.5, 
		  tV = 30, 
		  url2 = 'img/road/1/';   
		  //url2 = 'img/concrete/3/'; 

	loader0.load( url2 + 'color1b.jpg', function(tx0) { 	
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		//tx0.repeat.set(1.5, 4.5);    
		tx0.repeat.set(tU, tV);    
		
		//tx0.colorSpace = THREE.NoColorSpace;	
		//tx0.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx0.colorSpace = THREE.SRGBColorSpace;	
		
		x.road[0].material.map = tx0; 
		x.road[0].material.needsUpdate = true;
		
		x.road[0].material.wireframe = false; 
	});  		

	loader1.load( url2 + 'rough1.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(tU, tV);  
		
		x.road[0].material.roughnessMap = tx1; 
		x.road[0].material.needsUpdate = true;
	});  		
    
	loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(tU, tV);  
		
		//x.road[0].material.normalScale.set(5, 5); 
		x.road[0].material.normalMap = tx2; 
		x.road[0].material.needsUpdate = true; 
		
		//animFBX(); 
	});  		
    
	loader3.load( 'img/metaltmp.jpg', function(tx3) { 	
		//tx0d.wrapS = tx0d.wrapT = THREE.RepeatWrapping;    
		//tx0d.repeat.set(1, 1);  
		
		x.road[0].material.metalnessMap = tx3; 
		x.road[0].material.needsUpdate = true;
	});  		

	grups[0].position.z = 2000; 
	grups[1].position.z = -2000; 
	
	//grups[2].position.y = 200; 
	//grups[3].position.y = 200; 
	//grups[2].position.z = 1500; 
	//grups[3].position.z = -1500; 
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 		
	//scene.add(grups[2]); 	
	//scene.add(grups[3]); 		
	
	//fadeScene(); 
}

function addPavements() {
	x.pavement = []; 
	
	const width = 600, 
		  //height = 1000,  
		  height = 8000,  
		  kolor = 0xffffff, 
		  posX = [540, -540]; 
		  //pavementMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//pavementMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	const pavementMater = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
	
	for ( let i = 0; i < 2; i++ ) {	
		//pavementMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//pavementMater[i].flatShading = true; 
	//	pavementMater[i].transparent = true; 
		//pavementMater[i].opacity = .9; 
		//pavementMater[i].wireframe = true; 	
		pavementMater.wireframe = true; 	
	
		x.pavement[i] = new THREE.Mesh( geometry, pavementMater ); 
		
		x.pavement[i].position.set(posX[i], florY, 0);
		x.pavement[i].rotation.x = Math.PI/-2;
		//x.pavement[i].castShadow = true; 
		x.pavement[i].receiveShadow = true; 
		
		//if (i < 2) {
		//	grups[0].add( x.pavement[i] ); 
		//} else {
		//	grups[1].add( x.pavement[i] ); 
		//}
		
		scene.add( x.pavement[i] ); 
	}

	
	const loader0 = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(),   
		  url2 = 'img/ground/6/';   

	loader0.load( url2 + 'color1b.jpg', function(tx0) { 	
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(3, 40);    
		
		pavementMater.map = tx0; 
		pavementMater.needsUpdate = true;
		
		pavementMater.wireframe = false; 
	});  		

	loader1.load( url2 + 'rough1.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(3, 40);  
		
		pavementMater.roughnessMap = tx1; 
		pavementMater.needsUpdate = true;
	});  		
    
	loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(3, 40);  
		
		pavementMater.normalScale.set(-3, -3); 
		pavementMater.normalMap = tx2; 
		pavementMater.needsUpdate = true; 
	});  		
 
}

function addGrass() {
	x.grass = []; 
	
	const width = 400, 
		  //height = 1000,  
		  height = 8000,  
		  kolor = 0xffffff, 
		  posX = [440, -440],  
		  grassMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//grassMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	//const grassMater = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
	
	for ( let i = 0; i < 2; i++ ) {	
		grassMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//grassMater[i].flatShading = true; 
	//	grassMater[i].transparent = true; 
		//grassMater[i].opacity = .9; 
		//grassMater[i].wireframe = true; 	
		grassMater[i].alphaTest = .5; 	
		grassMater[i].wireframe = true; 	
	
		x.grass[i] = new THREE.Mesh( geometry, grassMater[i] ); 
		
		x.grass[i].position.set(posX[i], florY+.2, 0);
		
		let rotX = Math.PI/-2; 
		
		//if (i==1) {
		//	grassMater[i].side = 1; 
		//	rotX *= -1; 
		//}
		
		x.grass[i].rotation.x = rotX;
		
		//x.grass[i].castShadow = true; 
		x.grass[i].receiveShadow = true; 
		
		//if (i < 2) {
		//	grups[0].add( x.grass[i] ); 
		//} else {
		//	grups[1].add( x.grass[i] ); 
		//}
		
		scene.add( x.grass[i] ); 
	}

	
	const loader0 = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  loader3 = new THREE.TextureLoader(), 
		  loader4 = new THREE.TextureLoader(), 
		  tU = 3, 	
		  tV = 60, 	
		  url2 = 'img/ground/10/';   

	loader0.load( url2 + 'color1.jpg', function(tx0) { 	
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(tU, tV);    
		
		grassMater[0].map = grassMater[1].map = tx0; 
		grassMater[0].needsUpdate = grassMater[1].needsUpdate = true;
		grassMater[0].wireframe = grassMater[1].wireframe = false; 
	});  		

	loader1.load( url2 + 'rough1.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(tU, tV);  
		          
		grassMater[0].roughnessMap = grassMater[1].roughnessMap = tx1; 
		grassMater[0].needsUpdate = grassMater[1].needsUpdate = true;
	});  		
    
	loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(tU, tV);  
		
		//grassMater[0].normalScale.set(2, 2); 
		//grassMater[1].normalScale.set(2, 2); 
		grassMater[0].normalMap = grassMater[1].normalMap = tx2; 
		grassMater[0].needsUpdate = grassMater[1].needsUpdate = true; 
	});  		
 	
	loader3.load( 'img/opacLiminal.jpg', function(tx3) { 	
		tx3.wrapS = THREE.MirroredRepeatWrapping;    
		tx3.wrapT = THREE.RepeatWrapping;    
		tx3.repeat.set(2, 8);  
		          
		grassMater[0].alphaMap = tx3; 
		grassMater[0].needsUpdate = true; 
	});  		
 
	loader4.load( 'img/opacLiminal.jpg', function(tx4) { 	
		tx4.wrapS = THREE.MirroredRepeatWrapping;    
		tx4.wrapT = THREE.RepeatWrapping;    
		tx4.repeat.set(2, 8);  
		tx4.offset.set(0, -.173);  
		          
		grassMater[1].alphaMap = tx4; 
		grassMater[1].needsUpdate = true; 
	});  		
 
}

function addCurb() {
	x.curb = []; 
	
	const width = 10, 
		  height = 8000,  
		  kolor = 0xeeeeee, 
		  posX = [195, -195, 189, -189, 188, -188],  
		  curbMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//curbMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	//const curbMater = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
	
	for ( let i = 0; i < 2; i++ ) {	
		curbMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: .5, metalness: 0 } ); 
		//curbMater[i].flatShading = true; 
	//	curbMater[i].transparent = true; 
		//curbMater[i].opacity = .9; 
		curbMater[i].alphaTest = .5; 	
		curbMater[i].wireframe = true; 	
	
		x.curb[i] = new THREE.Mesh( geometry, curbMater[i] ); 
		
		x.curb[i].position.set(posX[i], florY+.9, 0);
		
		const rotX = Math.PI/-2; 
		
		//if (i==1) {
		//	curbMater[i].side = 1; 
		//	rotX *= -1; 
		//}
		
		x.curb[i].rotation.x = rotX;
		
		//x.curb[i].castShadow = true; 
		x.curb[i].receiveShadow = true; 
		
		//if (i < 2) {
		//	grups[0].add( x.curb[i] ); 
		//} else {
		//	grups[1].add( x.curb[i] ); 
		//}
		
		scene.add( x.curb[i] ); 
	}

	const geometry2 = new THREE.PlaneGeometry( 3, height );
	
 	for ( let j = 2; j < 4; j++ ) {	
		x.curb[j] = new THREE.Mesh( geometry2, curbMater[j-2] ); 
		
		x.curb[j].position.set(posX[j], florY-.1, 0);
		
		const rotX2 = Math.PI/-2,  
			  rotY2 = Math.PI/4; 
		
		x.curb[j].rotation.x = rotX2;
		x.curb[j].rotation.y = (j == 2) ? rotY2 * -1 : rotY2;
		
		//x.curb[j].castShadow = true; 
		x.curb[j].receiveShadow = true; 
		
		scene.add( x.curb[j] ); 
	}

	for ( let k = 4; k < 6; k++ ) {	
		x.curb[k] = new THREE.Mesh( geometry, curbMater[k-4] ); 
		
		x.curb[k].position.set(posX[k], florY-5.95, 0);
		
		const rotX3 = Math.PI/-2,  
			  rotY3 = Math.PI/2; 
		
		x.curb[k].rotation.x = rotX3;
		x.curb[k].rotation.y = (k == 4) ? rotY3 * -1 : rotY3;
		
		//x.curb[k].castShadow = true; 
		x.curb[k].receiveShadow = true; 
		
		scene.add( x.curb[k] ); 
	}

 
	addSidewalk();
}

function randomizeMatrix2( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	position.x = 214;
	position.y = florY-4;
	//position.z = posZ[j]; 
	position.z = 3000 - ((j % 8) * 1000); 

	//const rotY = (j % 2 == 0) ? Math.PI/2 : Math.PI/-2; 
	//const rotY = (j < 8) ? Math.PI/2 : Math.PI/-2; 
	
	//rotation.x = Math.PI/-2; 
	//rotation.y = rotY; 
	//rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
	scale.x = scale.y = scale.z = 1;

	return matrix.compose( position, quaternion, scale );
}

function randomizeMatrix3( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	position.x = -214;
	position.y = florY-4;
	position.z = 3000 - ((j % 8) * 1000) + 497; 

	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = 1;

	return matrix.compose( position, quaternion, scale );
}

function addCurbS() {
	x.curbS = []; 
	//let matrix = []; 	

	const width = 52, 
		  height = 10,  
		  kolor = 0x8e8e8e; 
		  //material = []; 
		
	const geometry = new THREE.PlaneGeometry( width, height ),  
		  material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .5, metalness: 0, alphaTest: .5 } ); 
		  material.wireframe = true; 
		
	for ( let i = 0; i < 2; i++ ) {	
		const lngth0 = geometry.attributes.position.array.length,  
			  qty = 8; 			
	
		x.curbS[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
		//x.curbS[i].frustumCulled = true;
		//x.curbS[i].castShadow = true; 
		x.curbS[i].receiveShadow = true;
		
		const geometryId0 = x.curbS[i].addGeometry( geometry );
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId0 = x.curbS[i].addInstance( geometryId0 );
		
			if (i==0) {
				matrix = randomizeMatrix2( matrix, j ); 
			} else {
				matrix = randomizeMatrix3( matrix, j ); 
			}
			
			x.curbS[i].setMatrixAt( instancedId0, matrix ); 				
		}
		
		//if (i==0) {
			scene.add(x.curbS[i]); 
			//grups[0].add(x.curbS[0]); 
		//} else {
			//grups[1].add(x.curbS[1]); 
		//}			
		
		//x.curbS[i].visible = false; 
		//x.curbS[i].material.opacity = .1; 
	}		

	
	let	loader0 = new THREE.TextureLoader(), 
		loader1 = new THREE.TextureLoader(), 
		url2 = 'img/'; 
    
	loader0.load( 'img/curb2C.jpg', function(tx0) { 	
		//tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(4, 1);  	
	
		material.map = tx0; 
		material.needsUpdate = true;
		
		material.wireframe = false; 
	});  
	
	loader1.load( 'img/opacCurb2.jpg', function(tx1) { 	
		material.alphaMap = tx1; 
		material.needsUpdate = true;
	});  

}

function addSidewalk() {
	x.sidewalk = []; 
	
	const width = 40, 
		  height = 8000,  
		  kolor = 0xffffff, 
		  posX = [220, -220, 214.5, -214.5],  
		  sidewalkMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height ); 

	//sidewalkMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	//const sidewalkMater = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
	
	for ( let i = 0; i < 2; i++ ) {	
		sidewalkMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//sidewalkMater[i].flatShading = true; 
	//	sidewalkMater[i].transparent = true; 
		//sidewalkMater[i].opacity = .9; 
		sidewalkMater[i].alphaTest = .5; 	
		sidewalkMater[i].wireframe = true; 	
	
		x.sidewalk[i] = new THREE.Mesh( geometry, sidewalkMater[i] ); 
		
		x.sidewalk[i].position.set(posX[i], florY+.8, 0);
		
		const rotX = Math.PI/-2; 
		
		//if (i==1) {
		//	sidewalkMater[i].side = 1; 
		//	rotX *= -1; 
		//}
		
		x.sidewalk[i].rotation.x = rotX;
		
		//x.sidewalk[i].castShadow = true; 
		x.sidewalk[i].receiveShadow = true; 
		
		//if (i < 2) {
		//	grups[0].add( x.sidewalk[i] ); 
		//} else {
		//	grups[1].add( x.sidewalk[i] ); 
		//}
		
		scene.add( x.sidewalk[i] ); 
	}

	const geometry2 = new THREE.PlaneGeometry( width + 15, height ); 
	
	for ( let j = 2; j < 4; j++ ) {	
		sidewalkMater[j] = new THREE.MeshStandardMaterial( { color: 0xd2d2d2, roughness: 1, metalness: 0 } ); 
		sidewalkMater[j].alphaTest = .5; 
		
		x.sidewalk[j] = new THREE.Mesh( geometry2, sidewalkMater[j] ); 
		
		x.sidewalk[j].position.set(posX[j], florY-4.4, 0);
		
		const rotX = Math.PI/-2,  
			  rotY = Math.PI/18; 
		
		x.sidewalk[j].rotation.x = rotX;
		x.sidewalk[j].rotation.y = (j == 2) ? rotY * -1 : rotY;
		
		//x.sidewalk[j].castShadow = true; 
		x.sidewalk[j].receiveShadow = true; 
		
		scene.add( x.sidewalk[j] ); 
	}

	
	const loader0 = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  loader3 = new THREE.TextureLoader(), 
		  loader4 = new THREE.TextureLoader(), 
		  loader5 = new THREE.TextureLoader(), 
		  loader6 = new THREE.TextureLoader(), 
		  tU = .1, 	
		  tV = 40, 	
		  url2 = 'img/ground/7/';   

	loader0.load( url2 + 'color1.jpg', function(tx0) { 	
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(tU, tV);    
		
		for ( let k = 0; k < 4; k++ ) {	
			sidewalkMater[k].map = tx0; 
			sidewalkMater[k].needsUpdate = true;
			sidewalkMater[k].wireframe = false; 
		}
		
		x.curb[0].material.map = x.curb[1].material.map = tx0; 
		x.curb[0].material.needsUpdate = x.curb[1].material.needsUpdate = true;
		x.curb[0].material.wireframe = x.curb[1].material.wireframe = false; 
	});  		

	loader1.load( url2 + 'rough1.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(tU, tV);  
		        
		for ( let l = 0; l < 4; l++ ) {	
			sidewalkMater[l].roughnessMap = tx1; 
			sidewalkMater[l].needsUpdate = true; 
		}
		
		x.curb[0].material.roughnessMap = x.curb[1].material.roughnessMap = tx1; 
		x.curb[0].material.needsUpdate = x.curb[1].material.needsUpdate = true;		
	});  		
    
	loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(tU, tV);  
		
		for ( let m = 0; m < 4; m++ ) {	
			//sidewalkMater[m].normalScale.set(2, 2); 
			sidewalkMater[m].normalMap = tx2; 
			sidewalkMater[m].needsUpdate = true; 
		}
		
		x.curb[0].material.normalMap = x.curb[1].material.normalMap = tx2; 
		x.curb[0].material.needsUpdate = x.curb[1].material.needsUpdate = true;		
	});  		
 	
	loader3.load( 'img/opacSidewalk.jpg', function(tx3) { 	
		tx3.wrapS = THREE.MirroredRepeatWrapping;    
		tx3.wrapT = THREE.RepeatWrapping;    
		tx3.repeat.set(1, 8);  
		          
		sidewalkMater[0].alphaMap = tx3; 
		sidewalkMater[0].needsUpdate = true; 
		
		x.curb[0].material.alphaMap = tx3; 
		x.curb[0].material.needsUpdate = true;		
	});  		
 
	loader4.load( 'img/opacSidewalk.jpg', function(tx4) { 	
		tx4.wrapS = THREE.MirroredRepeatWrapping;    
		tx4.wrapT = THREE.RepeatWrapping;    
		tx4.repeat.set(1, 8);  
		tx4.offset.set(0, .497);  
		          
		sidewalkMater[1].alphaMap = tx4; 
		sidewalkMater[1].needsUpdate = true; 
		
		x.curb[1].material.alphaMap = tx4; 
		x.curb[1].material.needsUpdate = true;		
	});  		
 
	loader5.load( 'img/opacSidewalk2.jpg', function(tx5) { 	
		tx5.wrapS = THREE.MirroredRepeatWrapping;    
		tx5.wrapT = THREE.RepeatWrapping;    
		tx5.repeat.set(1, 8);  
		          
		sidewalkMater[2].alphaMap = tx5; 
		sidewalkMater[2].needsUpdate = true; 	
		
	});  		
 
	loader6.load( 'img/opacSidewalk2.jpg', function(tx6) { 	
		tx6.wrapS = THREE.MirroredRepeatWrapping;    
		tx6.wrapT = THREE.RepeatWrapping;    
		tx6.repeat.set(1, 8);  
		tx6.offset.set(0, .497);  
		          
		sidewalkMater[3].alphaMap = tx6; 
		sidewalkMater[3].needsUpdate = true; 

	});  		
 
}

/*
function addSun() {
	//const geometry = new THREE.PlaneGeometry( 12000, 12000 ); 
	//const sunMater = new THREE.MeshBasicMaterial( { color: 0xffffff } ); 
	//sunMater.transparent = true; 
	//sunMater.wireframe = true; 
	//
	//x.Sun = new THREE.Mesh( geometry, sunMater ); 
	//x.Sun.position.set(-9600, 6000, 8700); 
	////x.Sun.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	//scene.add( x.Sun );
	
	let load1 = new THREE.TextureLoader(),  
		//load2 = new THREE.TextureLoader(), 
		loadF = new THREE.TextureLoader(); 

	const flare3 = loadF.load( 'img/sun/flare3.jpg', function(tx3) { 
 
	}); 
	
	//const flare0 = 
	//load1.load( 'img/sun/color1.jpg', function(tx1) { 
	load1.load( 'img/sun/alfa2.jpg', function(tx1) { 
		//sunMater.map = tx1; 
		//sunMater.needsUpdate = true; 
		//console.log(tx1); 
		
		const lensflare = new Lensflare();
		lensflare.addElement( new LensflareElement( tx1, 700, 0, x.directionalLight.color ) );
		lensflare.addElement( new LensflareElement( flare3, 50, .4 ) ); 
		lensflare.addElement( new LensflareElement( flare3, 80, .5 ) );
		lensflare.addElement( new LensflareElement( flare3, 120, .6 ) );
		lensflare.addElement( new LensflareElement( flare3, 70, .7 ) );	
		
		//x.directionalLight.add( lensflare ); 		
		
		lensflare.position.set(750, 600, -1600); 
	//	lensflare.position.set(0, 600, -1700); 
		x.camGrup.add( lensflare ); 		
	}); 	

	//load2.load( 'img/sun/alfa1.jpg', function(tx2) { 
		//sunMater.alphaMap = tx2; 
		//sunMater.needsUpdate = true; 
		//
		//sunMater.wireframe = false; 
	//}); 	
	
	//const lensflare = new Lensflare();
	//lensflare.addElement( new LensflareElement( flare0, 700, 0, x.spotLight[0].color ) );
	//lensflare.addElement( new LensflareElement( flare3, 60, .4 ) ); 
	//lensflare.addElement( new LensflareElement( flare3, 90, .5 ) );
	//lensflare.addElement( new LensflareElement( flare3, 140, .6 ) );
	//lensflare.addElement( new LensflareElement( flare3, 90, .7 ) );	
	//
	//x.spotLight[0].add( lensflare ); 
}
*/

function randomizeMatrix( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	const posX = (j < 8) ? -800 : 800; 
	//let posX = (j % 2 == 0) ? -700 : 700; 
	//let posZ = [3000, 3000, 2000, 2000, 1000, 1000, 0, 0]; 	
		
	position.x = posX;
	position.y = 0;
	//position.z = posZ[j]; 
	position.z = 3000 - ((j % 8) * 1000) + 435; 

	//const rotY = (j % 2 == 0) ? Math.PI/2 : Math.PI/-2; 
	const rotY = (j < 8) ? Math.PI/2 : Math.PI/-2; 
	
	//rotation.x = Math.PI/-2; 
	rotation.y = rotY; 
	//rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
	scale.x = scale.y = scale.z = 35;

	return matrix.compose( position, quaternion, scale );
}

function addHouses() {
	//let meshCount = 0; 
	//x.materials2 = []; 
	x.houses = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/house/2/house.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1 } );		
		material.wireframe = true; 
		//material.side = 2; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  qty = 16; 			
		
			x.houses[0] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
			x.houses[0].frustumCulled = true;
			x.houses[0].castShadow = true; 
			x.houses[0].receiveShadow = true;
			
			const geometryId0 = x.houses[0].addGeometry( object.children[0].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.houses[0].addInstance( geometryId0 );
			
				matrix = randomizeMatrix( matrix, j ); 

				x.houses[0].setMatrixAt( instancedId0, matrix ); 				
			}
			
			//if (i==0) {
				scene.add(x.houses[0]); 
				//grups[0].add(x.houses[0]); 
			//} else {
				//grups[1].add(x.houses[1]); 
			//}			
			
			//x.houses[i].visible = false; 
			//x.houses[i].material.opacity = .1; 
		//}		

	
		let	loader0 = new THREE.TextureLoader(), 
			loader1 = new THREE.TextureLoader(), 
			loader2 = new THREE.TextureLoader(), 
			loader3 = new THREE.TextureLoader(),
			url2 = 'obj/house/2/mat/'; 

		loader0.load( url2 + 'color1.jpg', function(tx0) { 	
			material.map = tx0; 
			material.needsUpdate = true;
			
			material.wireframe = false; 
		});  
		
		loader1.load( url2 + 'rough0.jpg', function(tx1) { 	
			material.roughnessMap = tx1; 
			material.needsUpdate = true;
		});  
		
		loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
			material.normalMap = tx2; 
			material.needsUpdate = true;
		});  
		
		//loader2.load( url2 + 'alpha0.png', function(tx2) { 	
		//	material.alphaMap = tx2; 
		//	material.needsUpdate = true;
		//});  

		//fadeScene(); 
	}); 

}

function randomizeMatrix4( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	const posX = (j < 8) ? 280 : -280; 
	//let posX = (j % 2 == 0) ? -700 : 700; 
	//let posZ = [3000, 3000, 2000, 2000, 1000, 1000, 0, 0]; 	
		
	position.x = posX;
	position.y = 0;
	//position.z = posZ[j]; 
	position.z = 3000 - ((j % 8) * 1000) + 435; 

	//const rotY = (j % 2 == 0) ? Math.PI/2 : Math.PI/-2; 
//	const rotY = (j < 8) ? Math.PI/2 : Math.PI/-2; 
	const rotY = [0, Math.PI/2, Math.PI, Math.PI/4]; 
	const rotY2 = [Math.PI, Math.PI/-2, 0, Math.PI/-4]; 
	
	//rotation.x = Math.PI/-2; 
	//rotation.y = rotY[j % 4]; 
	
	if (j < 8) {
		rotation.y = rotY[j % 4]; 
	} else {
		rotation.y = rotY2[j % 4]; 
	}
	
	//rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
	scale.x = scale.y = scale.z = 2.6;

	return matrix.compose( position, quaternion, scale );
}

function addTrees() {
	//let meshCount = 0; 
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.materials2[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, alphaTest: .4 } );		
		x.materials2[0].side = 2; 
		x.materials2[0].shadowSide = THREE.BackSide; 
		
		x.materials2[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1 } );	
		//x.materials2[1].shadowSide = THREE.FrontSide; 
		
		for ( let i = 0; i < 1; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  qty = 16; 		
		
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
			
				matrix = randomizeMatrix4( matrix, j ); 

				x.leaves[i].setMatrixAt( instancedId0, matrix ); 				
				x.trunk[i].setMatrixAt( instancedId1, matrix ); 
			}
			
			//if (i==0) {
				scene.add(x.leaves[i]); 
				scene.add(x.trunk[i]); 
				//grups[0].add(x.leaves[i]); 
				//grups[0].add(x.trunk[i]); 
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
			
			//animFBX(); 
			fadeScene(); 
		});  

		//fadeScene(); 
	}); 

}

function randomizeMatrix5( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	const posX = (j < 8) ? 195 : -195; 
	//let posX = (j % 2 == 0) ? -700 : 700; 
	//let posZ = [3000, 3000, 2000, 2000, 1000, 1000, 0, 0]; 	
		
	position.x = posX;
	position.y = 174;
	//position.z = posZ[j]; 
	position.z = 3000 - ((j % 8) * 1000) + 937; 

	//const rotY = (j % 2 == 0) ? Math.PI/2 : Math.PI/-2; 
	//const rotY = (j < 8) ? Math.PI/2 : Math.PI/-2; 
	
	//rotation.x = Math.PI/-2; 
	//rotation.y = rotY; 
	if (j < 8) rotation.y = Math.PI; 
	//rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
	scale.x = scale.y = scale.z = .6;

	return matrix.compose( position, quaternion, scale );
}

function addLamps() {
	//let meshCount = 0; 
	x.lamps = []; 
	x.bulbs = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/lamp/model.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .4, metalness: .3 } );		
		const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .5 } );
		
		for ( let i = 0; i < 1; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  qty = 16; 		
		
			x.lamps[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
			x.lamps[i].frustumCulled = true;
			x.lamps[i].castShadow = x.lamps[i].receiveShadow = true;
			
			x.bulbs[i] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material2 );
			x.bulbs[i].frustumCulled = true;
			//x.bulbs[i].castShadow = x.lamps[i].receiveShadow = true;
			
			const geometryId0 = x.lamps[i].addGeometry( object.children[0].geometry ), 
				  geometryId1 = x.bulbs[i].addGeometry( object.children[1].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.lamps[i].addInstance( geometryId0 ), 
					  instancedId1 = x.bulbs[i].addInstance( geometryId1 );
			
				matrix = randomizeMatrix5( matrix, j ); 

				x.lamps[i].setMatrixAt( instancedId0, matrix ); 
				x.bulbs[i].setMatrixAt( instancedId1, matrix ); 
			}
			
			//if (i==0) {
				scene.add(x.lamps[i]); 
				scene.add(x.bulbs[i]); 
				//grups[0].add(x.leaves[i]); 
				//grups[0].add(x.lamps[i]); 
			//} else {
				//grups[1].add(x.leaves[i]); 
				//grups[1].add(x.lamps[i]); 
			//}			
			
			x.lamps[i].visible = x.bulbs[i].visible = false; 
		}			

	
		const loader1 = new THREE.TextureLoader(), 
			  loader2 = new THREE.TextureLoader(), 
			  url2 = 'obj/lamp/mat/'; 

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			material.map = tx1; 
			material.needsUpdate = true;
			
			for ( let l = 0; l < 1; l++ ) {	
				x.lamps[l].visible = x.bulbs[l].visible = true; 
			}
		});  
		
		loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
			material.normalMap = tx2; 
			material.needsUpdate = true;

			for ( let n = 0; n < 1; n++ ) {				 
				x.lamps[n].visible = x.bulbs[n].visible = true; 
			}
		});  

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
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	}		
	
	
	
	_.idleTimer = 0; 
}

function animWalk() {
	let z0 = x.camGrup.position.z;  
	//	x1 = x.target0.position.x; 
	
	//console.log(z0);
		
	//if (z0 == _.ej[0]) {
	if (z0 > 0) {
		x.camGrup.position.z = z0 - 1; 
		//x.target0.position.x = x1 + 1; 
	} else {               
		x.camGrup.position.z = 4000; 
		                   
		//x.target0.position.x = _.ej[3] - 415; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
	//	x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
		//console.log('1');
	}
	
}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		const timer = Date.now() * 0.001; 
		//console.log(timer); 
		
	//	const delta = clock.getDelta() * .8; 
	//	//if ( mixer ) 
	//	mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
		
		//let delta = clock.getDelta() * .3; 
		 
		//const mSin5 = timer; 
		
	//	if (!x.rotCam) {
//			if (isMobil) {
//				camera.position.x = Math.sin(timer) * 35; 
//				camera.position.y = Math.cos(timer*.7) * 30 + 100;  
//				//camera.position.z = 40 - Math.abs(Math.sin(mSin5) * 15); 
//				//x.camGrup.rotation.y = Math.sin(timer/3) * Math.PI; 				
//			} else {
//				//const ptY = _.pointer.y * Math.PI/-3.5, 
//				//	  ptX = _.pointer.x * Math.PI;  
//				
//				camera.position.x = _.pointer.x * 35; 
//				camera.position.y = _.pointer.y * 30 + 100; 
//				//camera.position.z = 40 - Math.abs(_.pointer.y * 15); 
//				//x.camGrup.rotateY( (_.pointer.x * .005) % Math.PI ); 
//			}
	//	} else {	
	//		camera.position.y = Math.sin(timer) * 22 - 10; 
	//		camera.position.z = 40 - Math.abs(Math.sin(timer) * 11); 
	//		x.camGrup.rotateY( -.01 % Math.PI ); 			
	//	}
	
		
		//grups[0].rotation.set(Math.sin(mSin5) * .1, Math.sin(timer) * Math.PI*3, Math.cos(mSin5) * .1);


		//scene.backgroundRotation.y = Math.sin(timer*.2) * Math.PI; 
		//x.stage[1].material.needsUpdate = true; 
		
		//x.sea.material.uniforms[ 'time' ].value += .005;	
	
		//mixer.update( delta );	

		animWalk(); 
		
		camera.position.x = (Math.cos(timer*4) * 2); 
		camera.position.y = (Math.sin(timer*8) * 3) + _.ej[5]; 
    //
	//	if (isMobil) {
	//		camera.position.x += Math.cos(timer) * 35; 
	//		camera.position.y += Math.sin(timer*.7) * 30; 
	//	} else {
	//		camera.position.x += _.pointer.x * 35; 
	//		camera.position.y += _.pointer.y * 30; 
	//	}			
	
		
		//x.trees[0].position.y = Math.cos(timer*10) * .1; 
		//x.trees[0].rotation.x = Math.sin(timer*7) * .002; 
		//x.trees[0].rotation.y = Math.sin(timer*5) * .001; 
		//x.trees[0].rotation.z = Math.cos(timer*5) * .002; 

		if (isMobil) {
			camera.rotation.y = Math.sin(timer*.8) * .2;  
			camera.rotation.x = Math.cos(timer*.5) * .2; 
		} else {
			camera.rotation.y = _.pointer.x * -.22; 
			camera.rotation.x = _.pointer.y * .2; 
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
//	if (!x.rotCam) camera.lookAt(x.camTarget.position); 	
	//camera.lookAt(0, 10000, 0); 	
	//if (x.rotCam) 
//		camera.lookAt(x.target0.position); 
	//camera.lookAt(x.wall[0].position);

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[0].lookAt(camera.position); 
		//x.spotLcone[0].rotation.x = x.spotLcone[0].rotation.z = 0; 
		//x.spotLcone[0].rotation.y = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	//x.spotLightHelper1.update();
	
	renderer.render( scene, camera );	
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
		
		const scl = .55; 
		
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
		//x.char1.position.set(0, -1.2, -300); 
	//	x.char1.position.set(0, -15, 20); 
	//	x.char1.position.set(-130, -25, 800); 
		x.char1.position.set(0, -10, -70); 
		//x.char1.position.set(0, -1.2, -215); 
		//x.char1.rotation.set(0, Math.PI, 0);	
		x.char1.rotation.set(0, Math.PI, 0);	
		
		x.camGrup.add( x.char1 ); 
		//grups[0].add( x.char1 ); 
		//scene.add( x.char1 ); 
		
		//camera.lookAt(x.char1.position);
		//x.spotLight[0].target = x.char1;
		//x.spotLight[1].target = x.char1;
		
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
*/

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
		//let url = 'Promise'; 	
		//let url = 'RainofBrassPetals'; 	
		//let url = 'MendumStayWithMe'; 	
		//let url = 'berlin-after-hours'; 	
		//let url = 'electric-dreams-214467'; 	
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'sinister-mystery-174823'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'gloomy-reverie-190650'; 	
		//let url = 'birds39-forest-20772'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bdrm'; 
		//let url = 'ufo'; 
		//let url = 'nghtcty'; 		
		//let url = 'bah2'; 		
		//let url = 'wndrr'; 		
		//let url = 'bmbfrst'; 			
		let url = 'lmnlsbrbs'; 			
		url += '.mp3'; 	
		//url += '.mp4'; 	
		//url += '.3gp'; 	
		//url += '.webm'; 	
		
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
			x.sound.setVolume( 0.8 ); 
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
		// create an AudioAnalyser, passing in the sound and desired fftSize
	//	x.analyser = new THREE.AudioAnalyser( x.sound, 64 );		
	
	}
	
}
	
	
	//892
	//322
	//282
	