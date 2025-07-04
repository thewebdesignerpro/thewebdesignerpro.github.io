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
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'; 
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
	kontainer.style.background = "url('img/bambooforestl.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#d8dadc';		

	const fogCol = 0xd8dadc; 

	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 1850; 			//2000 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 100;			//70 or 35	
	
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
	scene.fog = new THREE.FogExp2(fogCol, 0.0005);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	//grups[0] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 10000 );
	//camera.position.set(0, _.ej[5], -100); 
	camera.position.set(0, _.ej[5], _.ej[3]); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	//x.camTarget = new THREE.Object3D(); 
	//x.camTarget.position.set(0, 0, 0); 
	//x.camGrup.add(x.camTarget);	
	
	scene.add( new THREE.AmbientLight( 0xd8d8d8 ) );		

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
	//x.camGrup.position.set(0, 0, 2000);  
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	const dLSize = 4000,  
		  dLSize2 = 3000; 
	
	x.directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
	//const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
	x.directionalLight.castShadow = true; 
	x.directionalLight.shadow.mapSize.width = 1024; 
	x.directionalLight.shadow.mapSize.height = 1024; 
	//x.directionalLight.shadow.camera.near = 1; 
	x.directionalLight.shadow.camera.far = 5000;	
	x.directionalLight.shadow.camera.left = -dLSize; 
	x.directionalLight.shadow.camera.bottom = -dLSize2; 
	x.directionalLight.shadow.camera.right = dLSize; 
	x.directionalLight.shadow.camera.top = dLSize2; 
//	x.directionalLight.position.set( 0, 2000, -2000 );
	//x.directionalLight.position.set( 750, 600, -1600 );
	x.directionalLight.position.set( 375, 750, -2000 );
	x.directionalLight.shadow.intensity = .9; 
	scene.add( x.directionalLight );

	
	//const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	//scene.add( helper );	
	//
	//const helper2 = new THREE.CameraHelper( directionalLight.shadow.camera );
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
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    //controls.maxPolarAngle = Math.PI/1.97;    
    controls.rotateSpeed = .1;
    controls.zoomSpeed = 1;
   // controls.enablePan = false;
    controls.panSpeed = 2;
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
	x.target0.position.set(0, _.ej[5], 0); 
	//x.target0.position.set(0, _.ej[5], _.ej[3] - 415); 
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
	
	addGround();  
	addTrees();  	
	addTreesD();  	
	//addGrass();  	
	
	//addFog(); 
	

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

/*
function addSkybox() {
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
	domeClouds.rotation.y = 1.2; 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
//	domeClouds.position.z = -100; 
	
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
	addSun(); 	
}

/*
function addRoads() {
	x.road = []; 
	
	const width = 1000, 
		  //height = 1000,  
		  height = 6000,  
		  kolor = 0xffffff, 
		  //posZ = [500, -500, 500, -500],
		  posZ = [1000, -1000],
		  roadMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//roadMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );
	
	//for ( let i = 0; i < 4; i++ ) {	
	for ( let i = 0; i < 1; i++ ) {	
		roadMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//roadMater[i].flatShading = true; 
		roadMater[i].transparent = true; 
		//roadMater[i].opacity = .9; 
		roadMater[i].wireframe = true; 	
	
		x.road[i] = new THREE.Mesh( geometry, roadMater[i] ); 
		
	//	x.road[i].position.set(0, florY, posZ[i]);
		x.road[i].position.set(0, florY, 0);
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
		  loader0b = new THREE.TextureLoader(), 
		  loader0c = new THREE.TextureLoader(), 
		  loader0d = new THREE.TextureLoader(), 
		  //loader1 = new THREE.TextureLoader(), 
		  //loader1b = new THREE.TextureLoader(), 
		  //loader1c = new THREE.TextureLoader(), 		  
		  //loader2 = new THREE.TextureLoader(),   
		  //loader2b = new THREE.TextureLoader(), 
		  //loader2c = new THREE.TextureLoader(), 		  
		  //loader3 = new THREE.TextureLoader(), 
		  //loader3b = new THREE.TextureLoader(), 
		  //loader3c = new THREE.TextureLoader(), 		  
		  url = 'img/road/0/mat/',  
		  url2 = 'img/ground/3/'; 

	loader0.load( url2 + 'color1.jpg', function(tx0) { 	
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(1.5, 4.5);    
		
		x.road[0].material.map = tx0; 
		x.road[0].material.needsUpdate = true;
		
		x.road[0].material.wireframe = false; 
	});  		

	loader0b.load( url2 + 'rough1.jpg', function(tx0b) { 	
		tx0b.wrapS = tx0b.wrapT = THREE.RepeatWrapping;    
		tx0b.repeat.set(1.5, 4.5);  
		
		x.road[0].material.roughnessMap = tx0b; 
		x.road[0].material.needsUpdate = true;
	});  		

	loader0c.load( url2 + 'normal1b.jpg', function(tx0c) { 	
		tx0c.wrapS = tx0c.wrapT = THREE.RepeatWrapping;    
		tx0c.repeat.set(1.5, 4.5);  
		
		x.road[0].material.normalScale.set(.5, .5); 
		x.road[0].material.normalMap = tx0c; 
		x.road[0].material.needsUpdate = true; 
		
		//addWetGround(); 
		animFBX(); 
	});  		

	loader0d.load( url + 'alfa012.jpg', function(tx0d) { 	
		tx0d.wrapS = tx0d.wrapT = THREE.RepeatWrapping;    
		tx0d.repeat.set(2, 2);  
		
		x.road[0].material.alphaMap = tx0d; 
		x.road[0].material.needsUpdate = true;
	});  		

	grups[0].position.z = 1500; 
	grups[1].position.z = -1500; 
	
	grups[2].position.y = 200; 
	grups[3].position.y = 200; 
	grups[2].position.z = 1500; 
	grups[3].position.z = -1500; 
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 		
	scene.add(grups[2]); 	
	scene.add(grups[3]); 		
}

function addSea() {
	//x.sea = []; 
	
	const waterGeometry = new THREE.PlaneGeometry( 1000, 6000 );
	//const waterGeometry = new THREE.PlaneGeometry( 1000, 3000 );

	x.sea = new Water(
		waterGeometry,
		{
			textureWidth: 1024,
			textureHeight: 1024,
			//textureHeight: 3072,
			//waterNormals: new THREE.TextureLoader().load( 'img/water/soft.jpg', function ( texture ) {
		//	waterNormals: new THREE.TextureLoader().load( 'img/road/0/mat/normal012b.jpg', function ( texture ) {
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
			//	texture.repeat.set(1, 3); 
				//texture.repeat.set(1, 2); 
				//texture.colorSpace = THREE.SRGBColorSpace; 
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x667788, 
			distortionScale: 2,
			//size: .1,
			fog: scene.fog !== undefined
		}
	);

	//x.sea[1] = new Water(
	//	waterGeometry,
	//	{
	//		textureWidth: 1024,
	//		textureHeight: 1024,
	//		waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
	//			texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	//		}),
	//		sunDirection: new THREE.Vector3(),
	//		sunColor: 0xffffff,
	//		waterColor: 0x667788, 
	//		distortionScale: 2,
	//		fog: scene.fog !== undefined
	//	}
	//);

	x.sea.position.set(0, -.5, 0);
	x.sea.rotation.x = - Math.PI / 2;

	//x.sea[1].position.set(0, -.5, 0);
	//x.sea[1].rotation.x = - Math.PI / 2;
    //
	
	scene.add( x.sea );	
	//grups[0].add( x.sea[0] );	
	//grups[1].add( x.sea[1] );	
	
	const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .005; 
	waterUniforms['size'].value = .1; 
	
	//const waterUniforms1 = x.sea[1].material.uniforms;
	//waterUniforms1['size'].value = .02; 
	
	//fadeScene(); 	
	//animFBX(); 
	
	addSun(); 
}
*/

function addGround() {
	x.ground = []; 
	
	let width = 8000, 
		//height = 602, 
		height = 4000,  
		posX = 0, 
		posZ = (height-2)/2, 
		rez = 160,  
		intrvl = 400, 
		kolor = 0xdee5de; 
		//kolor = 0xffffff; 
		
	//let geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	let geometry = new THREE.PlaneGeometry( width, height, rez * 2, rez );
	//let geometry = new THREE.PlaneGeometry( width, height );

	//console.log(geometry.attributes.position); 
	
	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	//material.flatShading = true; 
	material.wireframe = true; 
	
	for ( let i = 0; i < 1; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
	
		x.ground[i] = new THREE.Mesh( geometry, material ); 
		
		
		//console.log(pozZ);
		//x.ground[i].position.set(0, florY, posZ);
		//x.ground[i].position.set(0, -48, 0);
		//x.ground[i].position.set(2000, -32, 0);
		x.ground[i].position.set(0, -32, 0);
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
		//grups[i].add( x.ground[i] ); 
		scene.add( x.ground[i] ); 
		
	//	grups[i].position.z = pozZ; 
		
		//x.spotLight[i].target = x.ground[i];	
	}

	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader(), 
		url = 'img/ground/11/', 
		//txU = 4, txV = 4; 
		txU = 20, txV = 10; 

	loader.load( url + 'color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.map = tx; 
			x.ground[j].material.needsUpdate = true;
			
			x.ground[j].material.wireframe = false; 
		}
	});  		

	//loader2.load( 'img/spacew/terr1.jpg', function(tx2) { 	
	loader2.load( 'img/snowground3.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		//tx2.repeat.set(1, 2);    
		tx2.repeat.set(2, 1);    
		tx2.offset.set(0, .2);    		
		
		for ( let j = 0; j < 1; j++ ) {	
			//x.ground[j].material.bumpMap = tx; 
		//	x.ground[j].material.displacementScale = 80; 
			x.ground[j].material.displacementScale = 80; 
			//x.ground[j].material.displacementBias = 15; 
			x.ground[j].material.displacementMap = tx2;			
			x.ground[j].material.needsUpdate = true; 
			
			//console.log(x.ground[j].geometry.attributes.position); 
			//console.log(x.ground[j]); 
		}
	});  		

	loader3.load( url + 'normal1.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			//x.ground[j].material.normalScale.set(.5, .5); 
			x.ground[j].material.normalMap = tx3; 
			x.ground[j].material.needsUpdate = true;
		}
	});  		

	loader4.load( url + 'rough1.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.roughnessMap = tx4; 
			x.ground[j].material.needsUpdate = true;
		}
	});  		

}
	
function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//position.y = florY;
	position.y = -5;
	position.x = (Math.random() * 3900 - 1950);
	
	//let posz = Math.random() * 3800 - 1900; 
	//let posz = Math.random() * 2400 - 500; 
//	let posz = Math.random() * 1820 + 80; 
	let posz = Math.random() * 1900 + 0; 
		
	//if ((posz > -400) && (posz < 400)) {
	if ((posz > 700) && (posz < 900)) {
		//let rnd = Math.random() < 0.5 ? -1 : 1;
		//posx = 532 * rnd; 
	
		//position.y -= Math.abs(posz*2.2); 
		position.y -= 50; 
	
		//if (posz < 0) { 
		if (posz < 800) { 
			//posx = -532; 
			posz = (Math.random() * -20) + 700;   
		} else {
			//posx = 532; 
			posz = (Math.random() * 20) + 900; 
		}
		//console.log(position.y);
	}
		
	position.z = posz;	

	rotation.x = Math.random() * .2 - .1; 
	rotation.y = Math.random() * 2 * Math.PI; 
	rotation.z = Math.random() * .2 - .1; 	
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 1.2 + Math.random() * .3;
	scale.x = scale.y = scale.z = 15 + Math.random() * 5;

	return matrix.compose( position, quaternion, scale );
}

function addTrees() {
	//let meshCount = 0; 
	//x.materials2 = []; 
	const material = []; 
	x.trees = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/6/tree2.obj', function ( object ) {
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

	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, alphaTest: .5 } );		
		material[2] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5 } );		
		material[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5 } );		
		material[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, alphaTest: .5 } );		
	//	material.wireframe = true; 
		//material.side = 2; 
		material[0].wireframe = material[1].wireframe = material[2].wireframe = true; 
		material[0].side = 2; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  lngth2 = object.children[2].geometry.attributes.position.array.length,  
				  qty = 200; 	
		
			x.trees[0] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
			x.trees[0].frustumCulled = true;
			x.trees[0].castShadow = true; 
			x.trees[0].receiveShadow = true;
			
			x.trees[1] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material[1] );
			x.trees[1].frustumCulled = true;
			x.trees[1].castShadow = true; 
			x.trees[1].receiveShadow = true;
			
			x.trees[2] = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, material[2] );
			x.trees[2].frustumCulled = true;
			x.trees[2].castShadow = true; 
			x.trees[2].receiveShadow = true;
			
			x.trees[3] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
			x.trees[3].frustumCulled = true;
			x.trees[3].castShadow = true; 
			x.trees[3].receiveShadow = true;
			
			x.trees[4] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material[1] );
			x.trees[4].frustumCulled = true;
			x.trees[4].castShadow = true; 
			x.trees[4].receiveShadow = true;
			
			x.trees[5] = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, material[2] );
			x.trees[5].frustumCulled = true;
			x.trees[5].castShadow = true; 
			x.trees[5].receiveShadow = true;

			//x.trees[6] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
			//x.trees[6].frustumCulled = true;
			//x.trees[6].castShadow = true; 
			//x.trees[6].receiveShadow = true;
			//
			//x.trees[7] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material[1] );
			//x.trees[7].frustumCulled = true;
			//x.trees[7].castShadow = true; 
			//x.trees[7].receiveShadow = true;
			//
			//x.trees[8] = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, material[2] );
			//x.trees[8].frustumCulled = true;
			//x.trees[8].castShadow = true; 
			//x.trees[8].receiveShadow = true;

			
			const geometryId0 = x.trees[0].addGeometry( object.children[0].geometry ), 
				  geometryId1 = x.trees[1].addGeometry( object.children[1].geometry ),
				  geometryId2 = x.trees[2].addGeometry( object.children[2].geometry ),
				  geometryId3 = x.trees[3].addGeometry( object.children[0].geometry ),
				  geometryId4 = x.trees[4].addGeometry( object.children[1].geometry ),
				  geometryId5 = x.trees[5].addGeometry( object.children[2].geometry ); 
				  //geometryId6 = x.trees[6].addGeometry( object.children[0].geometry ),
				  //geometryId7 = x.trees[7].addGeometry( object.children[1].geometry ),
				  //geometryId8 = x.trees[8].addGeometry( object.children[2].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.trees[0].addInstance( geometryId0 ), 
					  instancedId1 = x.trees[1].addInstance( geometryId1 ),
					  instancedId2 = x.trees[2].addInstance( geometryId2 ),
					  instancedId3 = x.trees[3].addInstance( geometryId3 ),
					  instancedId4 = x.trees[4].addInstance( geometryId4 ),
					  instancedId5 = x.trees[5].addInstance( geometryId5 ); 
					  //instancedId6 = x.trees[6].addInstance( geometryId6 ),
					  //instancedId7 = x.trees[7].addInstance( geometryId7 ),
					  //instancedId8 = x.trees[8].addInstance( geometryId8 );
			
				matrix = randomizeMatrix( matrix ); 

				x.trees[0].setMatrixAt( instancedId0, matrix ); 				
				x.trees[1].setMatrixAt( instancedId1, matrix ); 				
				x.trees[2].setMatrixAt( instancedId2, matrix ); 				
				x.trees[3].setMatrixAt( instancedId3, matrix ); 				
				x.trees[4].setMatrixAt( instancedId4, matrix ); 				
				x.trees[5].setMatrixAt( instancedId5, matrix ); 				
				//x.trees[6].setMatrixAt( instancedId6, matrix ); 				
				//x.trees[7].setMatrixAt( instancedId7, matrix ); 				
				//x.trees[8].setMatrixAt( instancedId8, matrix ); 				
			}
			
			//if (i==0) {
				grups[0].add(x.trees[0]); 
				grups[0].add(x.trees[1]); 
				grups[0].add(x.trees[2]); 
			//} else {
				grups[1].add(x.trees[3]); 
				grups[1].add(x.trees[4]); 
				grups[1].add(x.trees[5]); 
			//}			
				//grups[2].add(x.trees[6]); 
				//grups[2].add(x.trees[7]); 
				//grups[2].add(x.trees[8]); 
			//}			
			
				//grups[2].add(x.trees[2]); 
				//grups[3].add(x.trees[3]); 
			
			
			//x.trees[i].visible = false; 
			//x.trees[i].material.opacity = .1; 
		//}		

	
		const loader0 = new THREE.TextureLoader(), 
			  loader0n = new THREE.TextureLoader(), 
			  loader1 = new THREE.TextureLoader(), 
			  loader1n = new THREE.TextureLoader(), 
			  loader2 = new THREE.TextureLoader(), 
			  loader3 = new THREE.TextureLoader(), 
			  loader3r = new THREE.TextureLoader(), 
			  url2 = 'obj/trees/6/mat/'; 

		//loader0.load( 'obj/trees/6/RGB_82430cde34444552afd46ff9086fe5a8_bambooBranches_basecolor-tga.png', function(tx0) { 	
		loader0.load( url2 + 'color1.jpg', function(tx0) { 	
			material[1].map = tx0; 
			material[1].needsUpdate = true;
			         
			material[1].wireframe = false; 
		});  
		
		//loader1.load( 'obj/trees/6/RGB_095b378353534c5abbe925f2a4def1c1_bamboo_basecolor-tga.png', function(tx1) { 	
		loader1.load( url2 + 'color2.jpg', function(tx1) { 	
			material[2].map = tx1; 
			material[2].needsUpdate = true;
			         
			material[2].wireframe = false; 
		});  

		//loader1n.load( 'obj/trees/6/N_09a75a3f4b3b486ea064639ee770c29e_bamboo_normal-tga.jpeg', function(tx1n) { 	
		loader1n.load( url2 + 'normal2.jpg', function(tx1n) { 	
			material[2].normalScale.set(.6, .6); 
			material[2].normalMap = tx1n; 
			material[2].needsUpdate = true;
		});  
		
		//loader2.load( 'obj/trees/6/RGB_4cd23176846445469422c71e11ffb109_bambooalpha_basecolor-tga.png', function(tx2) { 	
		loader2.load( url2 + 'color0.jpg', function(tx2) { 	
			material[0].map = tx2; 
			material[0].needsUpdate = true;
		});  
		
		//loader1.load( 'obj/trees/6/RGB_3f5936232aa8435da3521fd07fcdab7a_bamboo_basecolor-tga.png', function(tx1) { 	
		//	material[2].map = tx1; 
		//	material[2].needsUpdate = true;
		//	         
		//	material[2].wireframe = false; 
		//});  
		
		//loader3.load( 'obj/trees/6/A_195e26fee4cf4e44be74d4bc235ffd66_bambooalpha_opacity-tga.png', function(tx3) { 	
		loader3.load( url2 + 'alfa0.jpg', function(tx3) { 	
			material[0].alphaMap = tx3; 
			material[0].needsUpdate = true;
			material[0].wireframe = false; 
			
			animFBX(); 
		});  

		loader3r.load( url2 + 'rough0.jpg', function(tx3r) { 	
			material[0].roughnessMap = tx3r; 
			material[0].needsUpdate = true;
		});  

		loader0n.load( url2 + 'normal0.jpg', function(tx0n) { 	
			material[0].normalScale.set(.8, .8); 
			material[0].normalMap = tx0n; 
			material[0].needsUpdate = true;
		}); 		
		
		//fadeScene(); 
	}); 
	
	grups[0].position.x = -2000; 
	grups[1].position.x = 2000; 
	//grups[2].position.x = 3000; 
	
	//grups[2].position.y = 200; 
	//grups[3].position.y = 200; 
	//grups[2].position.z = 1500; 
	//grups[3].position.z = -1500; 
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 		
	//scene.add(grups[2]); 	
	//scene.add(grups[3]); 	

}

function randomizeMatrix2( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//position.y = florY;
	position.y = -5;
	position.x = (Math.random() * 3900 - 1950);
	
//	let posz = Math.random() * -690 - 80; 
	let posz = Math.random() * -750 - 20; 
		
	//if ((posz > -80) && (posz < 80)) {
	//	//let rnd = Math.random() < 0.5 ? -1 : 1;
	//	//posx = 532 * rnd; 
	//
	//	position.y -= Math.abs(posz*2.2); 
	//
	//	if (posz < 0) { 
	//		//posx = -532; 
	//		posz = (Math.random() * -20) - 80;   
	//	} else {
	//		//posx = 532; 
	//		posz = (Math.random() * 20) + 80; 
	//	}
	//	//console.log(position.y);
	//}
		
	position.z = posz;	

	rotation.x = Math.random() * .2 - .1; 
	rotation.y = Math.random() * 2 * Math.PI; 
	rotation.z = Math.random() * .2 - .1; 	
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 1.2 + Math.random() * .3;
	scale.x = scale.y = scale.z = 12 + Math.random() * 4;

	return matrix.compose( position, quaternion, scale );
}

function addTreesD() {
	//let meshCount = 0; 
	//x.materials2 = []; 
	const material = []; 
	x.treesD = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/6/tree2dec.obj', function ( object ) {
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

		material[2] = new THREE.MeshStandardMaterial( { color: 0x7c8b54, roughness: .8 } );		
		material[1] = new THREE.MeshStandardMaterial( { color: 0x689806, roughness: .8, alphaTest: .5} );		
		material[0] = new THREE.MeshStandardMaterial( { color: 0x849850, roughness: .8 } );		
		//material[0].wireframe = material[1].wireframe = material[2].wireframe = true; 
		material[1].wireframe = true; 
		material[1].side = 2; 
		
		const lngth0 = object.children[0].geometry.attributes.position.array.length,  
			  lngth1 = object.children[1].geometry.attributes.position.array.length,  
			  lngth2 = object.children[2].geometry.attributes.position.array.length,  
			  qty = 100; 	
		
		x.treesD[0] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
		x.treesD[0].frustumCulled = true;
		x.treesD[0].castShadow = true; 
		//x.treesD[0].receiveShadow = true;
		
		x.treesD[1] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material[1] );
		x.treesD[1].frustumCulled = true;
		x.treesD[1].castShadow = true; 
		//x.treesD[1].receiveShadow = true;
		
		x.treesD[2] = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, material[2] );
		x.treesD[2].frustumCulled = true;
		//x.treesD[2].castShadow = true; 
		//x.treesD[2].receiveShadow = true;
		
		x.treesD[3] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
		x.treesD[3].frustumCulled = true;
		x.treesD[3].castShadow = true; 
		//x.treesD[3].receiveShadow = true;
		
		x.treesD[4] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material[1] );
		x.treesD[4].frustumCulled = true;
		x.treesD[4].castShadow = true; 
		//x.treesD[4].receiveShadow = true;
		
		x.treesD[5] = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, material[2] );
		x.treesD[5].frustumCulled = true;
		//x.treesD[5].castShadow = true; 
		//x.treesD[5].receiveShadow = true;

		
		const geometryId0 = x.treesD[0].addGeometry( object.children[0].geometry ), 
			  geometryId1 = x.treesD[1].addGeometry( object.children[1].geometry ),
			  geometryId2 = x.treesD[2].addGeometry( object.children[2].geometry ),
			  geometryId3 = x.treesD[3].addGeometry( object.children[0].geometry ),
			  geometryId4 = x.treesD[4].addGeometry( object.children[1].geometry ),
			  geometryId5 = x.treesD[5].addGeometry( object.children[2].geometry ); 
			  //geometryId6 = x.treesD[6].addGeometry( object.children[0].geometry ),
			  //geometryId7 = x.treesD[7].addGeometry( object.children[1].geometry ),
			  //geometryId8 = x.treesD[8].addGeometry( object.children[2].geometry );
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId0 = x.treesD[0].addInstance( geometryId0 ), 
				  instancedId1 = x.treesD[1].addInstance( geometryId1 ),
				  instancedId2 = x.treesD[2].addInstance( geometryId2 ),
				  instancedId3 = x.treesD[3].addInstance( geometryId3 ),
				  instancedId4 = x.treesD[4].addInstance( geometryId4 ),
				  instancedId5 = x.treesD[5].addInstance( geometryId5 ); 
				  //instancedId6 = x.treesD[6].addInstance( geometryId6 ),
				  //instancedId7 = x.treesD[7].addInstance( geometryId7 ),
				  //instancedId8 = x.treesD[8].addInstance( geometryId8 );
		
			matrix = randomizeMatrix2( matrix ); 

			x.treesD[0].setMatrixAt( instancedId0, matrix ); 				
			x.treesD[1].setMatrixAt( instancedId1, matrix ); 				
			x.treesD[2].setMatrixAt( instancedId2, matrix ); 				
			x.treesD[3].setMatrixAt( instancedId3, matrix ); 				
			x.treesD[4].setMatrixAt( instancedId4, matrix ); 				
			x.treesD[5].setMatrixAt( instancedId5, matrix ); 				
		}
		
		grups[0].add(x.treesD[0]); 
		grups[0].add(x.treesD[1]); 
		grups[0].add(x.treesD[2]); 
                            
		grups[1].add(x.treesD[3]); 
		grups[1].add(x.treesD[4]); 
		grups[1].add(x.treesD[5]); 	
	
	
		//let	loader0 = new THREE.TextureLoader(), 
		//	loader1 = new THREE.TextureLoader(), 
		//	loader2 = new THREE.TextureLoader(), 
		const loader3 = new THREE.TextureLoader(); 

		//loader0.load( 'obj/trees/6/RGB_82430cde34444552afd46ff9086fe5a8_bambooBranches_basecolor-tga.png', function(tx0) { 	
		//	material[2].map = tx0; 
		//	material[2].needsUpdate = true;
		//	         
		//	material[2].wireframe = false; 
		//});  
		//
		//loader1.load( 'obj/trees/6/RGB_095b378353534c5abbe925f2a4def1c1_bamboo_basecolor-tga.png', function(tx1) { 	
		//	material[0].map = tx1; 
		//	material[0].needsUpdate = true;
		//	         
		//	material[0].wireframe = false; 
		//});  
		//
		//loader2.load( 'obj/trees/6/RGB_4cd23176846445469422c71e11ffb109_bambooalpha_basecolor-tga.png', function(tx2) { 	
		//	material[1].map = tx2; 
		//	material[1].needsUpdate = true;
		//	         
		//	material[1].wireframe = false; 
		//});  
		
		//loader3.load( 'obj/trees/6/A_195e26fee4cf4e44be74d4bc235ffd66_bambooalpha_opacity-tga.png', function(tx3) { 	
		loader3.load( 'obj/trees/6/mat/alfa0.jpg', function(tx3) { 	
			material[1].alphaMap = tx3; 
			material[1].needsUpdate = true; 
			material[1].wireframe = false; 
		});  

	}); 
	
}

/*
function randomizeMatrix3( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//position.y = florY;
	position.y = -10;
	position.x = (Math.random() * 3900 - 1950);
	
	let posz = Math.random() * 950 + 900; 
		
	//if ((posz > -80) && (posz < 80)) {
	//	//let rnd = Math.random() < 0.5 ? -1 : 1;
	//	//posx = 532 * rnd; 
	//
	//	position.y -= Math.abs(posz*2.2); 
	//
	//	if (posz < 0) { 
	//		//posx = -532; 
	//		posz = (Math.random() * -20) - 80;   
	//	} else {
	//		//posx = 532; 
	//		posz = (Math.random() * 20) + 80; 
	//	}
	//	//console.log(position.y);
	//}
		
	position.z = posz;	

	rotation.x = Math.PI/-2; 
	rotation.z = Math.random() * 2 * Math.PI; 
	//rotation.y = Math.random() * .2 - .1; 	
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 1.2 + Math.random() * .3;
	scale.x = scale.y = scale.z = 5 + Math.random() * 2;

	return matrix.compose( position, quaternion, scale );
}

function addGrass() {
	//let meshCount = 0; 
	//x.materials2 = []; 
	const material = []; 
	x.grass = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/grass/0/grass.obj', function ( object ) {
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

		material[0] = new THREE.MeshStandardMaterial( { color: 0x93be00, roughness: .8, alphaTest: .4} );		
		material[0].wireframe = true; 
		material[0].side = 2; 
		
		const lngth0 = object.children[0].geometry.attributes.position.array.length,   
			  qty = 100; 	
		
		x.grass[0] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
		x.grass[0].frustumCulled = true;
		x.grass[0].castShadow = true; 
		//x.grass[0].receiveShadow = true;
		
		x.grass[1] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material[0] );
		x.grass[1].frustumCulled = true;
		x.grass[1].castShadow = true; 
		//x.grass[1].receiveShadow = true;
		
		
		const geometryId0 = x.grass[0].addGeometry( object.children[0].geometry ), 
			  geometryId1 = x.grass[1].addGeometry( object.children[0].geometry );
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId0 = x.grass[0].addInstance( geometryId0 ), 
				  instancedId1 = x.grass[1].addInstance( geometryId1 );
		
			matrix = randomizeMatrix3( matrix ); 

			x.grass[0].setMatrixAt( instancedId0, matrix ); 				
			x.grass[1].setMatrixAt( instancedId1, matrix ); 				
		}
		
		grups[0].add(x.grass[0]); 
		grups[1].add(x.grass[1]); 	
	
	
		const loader0 = new THREE.TextureLoader(), 
			  loader1 = new THREE.TextureLoader(), 
			  url2 = 'obj/grass/0/';  
		//	loader2 = new THREE.TextureLoader(), 
		   // loader3 = new THREE.TextureLoader(); 

		//loader0.load( url2 + 'RGB_1af6cd7342fa4773bf71cff142686021_T_Grass_D-tga.png', function(tx0) { 	
		//	material[0].map = tx0; 
		//	material[0].needsUpdate = true;
		//	         
		//	//material[0].wireframe = false; 
		//});  
		
		loader1.load( url2 + 'A_536b4ccaeed84975aeb5a1b151607329_T_Grass_D-tga.png', function(tx1) { 	
			material[0].alphaMap = tx1; 
			material[0].needsUpdate = true; 
			material[0].wireframe = false; 
		});  

	}); 
	
}
*/

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
	let x0 = x.camGrup.position.x, 
		x1 = x.target0.position.x; 
	
	//console.log(z0);
		
	//if (z0 == _.ej[0]) {
	if (x0 < 2000) {
		x.camGrup.position.x = x0 + 1; 
		//x.target0.position.x = x1 + 1; 
	} else {               
		x.camGrup.position.x = -2000; 
		                   
		//x.target0.position.x = _.ej[3] - 415; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
		x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
		//console.log('1');
	}
	
}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		const timer = Date.now() * 0.0005; 
		//console.log(timer); 
		
		const delta = clock.getDelta() * .4; 
	//	//if ( mixer ) 
		mixer.update( delta );	
		
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
	//	
	//	camera.position.x = (Math.cos(timer*5) * 2); 
	//	camera.position.y = (Math.sin(timer*10) * 3) + _.ej[5]; 
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

		
		camera.rotation.y = _.pointer.x * -.25; 
		camera.rotation.x = _.pointer.y * .2; 
		
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
		
		const scl = 1.1; 
		//const scl = .8; 
		
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
		x.char1.position.set(-130, -25, 800); 
		//x.char1.position.set(0, -1.2, -215); 
		//x.char1.rotation.set(0, Math.PI, 0);	
		x.char1.rotation.set(0, Math.PI/2, 0);	
		
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
		let url = 'bmbfrst'; 			
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
			x.sound.setVolume( 0.9 ); 
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
	
	