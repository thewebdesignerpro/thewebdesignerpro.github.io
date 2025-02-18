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
import { Water } from 'three/addons/objects/Water.js';
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
	kontainer.style.background = "url('img/bedrooml.jpg') center top no-repeat"; 
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
	_.ej[5] = 20;			//70 or 35	
	
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
	camera.position.set(0, _.ej[5], 400); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0xeeeeee ) );	

	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xfffaf5, 5000000, 1500, Math.PI/8, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 800, 500, 50 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width =  1536;
	x.spotLight[0].shadow.mapSize.height = 1536; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 1500;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .5;
	
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
    controls.autoRotateSpeed = .5;	
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
//	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	x.target0.position.set(0, _.ej[5] - 10, 50); 
	scene.add(x.target0);
	
	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
//	controls.target = x.target0.position; 	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	

	x.rotCam = false; 
	
	addSkybox(); 
	//addClouds(); 
	//addStarfields(); 

	addBg(); 
	//addRoom(); 
	addTables(); 

	addSea(); 
	
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
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		//tx.mapping = THREE.CubeRefractionMapping;	
		
		x.skybox = tx; 

	//	scene.backgroundRotation.set(0, Math.PI/2, 0); 
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		//scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addRoom(); 
		addBull(); 
		addBear(); 
		addPlants(); 
		
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

function addBg() {
	const geometry = new THREE.SphereGeometry( 470, 8, 4, 0, Math.PI/1.5, Math.PI/4, Math.PI/2); 
	const BgMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: 1 } ); 
	const Bg = new THREE.Mesh( geometry, BgMaterial ); 
	Bg.position.set(300, 30, 10); 
	Bg.rotation.y = Math.PI/1.3; 
	scene.add( Bg );
	
	const loader = new THREE.TextureLoader();   

	loader.load( 'img/skybox/15/bg.jpg', function(tx) { 	
		//tx.repeat.set(-1, 1);    		
		//tx.center.set(.5, .5); 
	
		BgMaterial.map = tx; 
		BgMaterial.needsUpdate = true; 
	});  	
}

function addRoom() {
	let meshCount = 0; 
	//x.room = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/room/0/room.obj', function ( object ) {
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
				
				if (meshCount != 10) child.castShadow = true; 
				child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.room = object; 
		
		x.room.position.set(0, -100, 0); 
		x.room.rotation.set(0, Math.PI/2, 0); 
	//	x.room.scale.set(20, 20, 20); 
		
		// 0 - bedframe   1 - ceiling  2 - carpet     3 - walls/ceiling  4 - mattress  5 - marble 6 - pillows/blanket
		// 7 - background 8 - ceiling2 9 - bedstands 10 - floor         11 - blinds   12 - blinds2
		
		const matr = [], 
			  url2 = 'obj/room/0/mat/', 
			  url6 = 'img/fabric/0/', 
			  //url10 = 'img/wood/1/', 
			  url10 = 'img/marble/0/', 
			  frm = 'jpg',   
			  kolor = [0xb8b5b2, 0xffffff, 0xc1c4cc, 0xbbbbbb, 0xffffff, 0xcdd4db, 0xdddddd, 0xb2b2b2, 0xffffff, 
					   0xaaaaaa, 0xdddddd, 0xaaaaaa, 0xffffff], 
			  raf = [1, 1, .7, 1, 1, .15, 1, 1, 1, 1, .9, .1, .1];   
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
				matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: raf[i], metalness: 0 } );
				//matr[i].alphaTest = .5; 
				//matr[i].shadowSide = 1; 
			//}
			
		/*	if ((i==2) || (i==5)) {
				matr[i].roughness = .7; 
				matr[i].side = 2; 
				matr[i].shadowSide = 1; 
			}
			
			//if (i==5) matr[i].visible = false; 
		*/

			//if (i==3) matr[i].shadowSide = 2; 
			//if (i==5) matr[i].shadowSide = 2; 
			
			if (i==10) {
				matr[i].transparent = true; 
				matr[i].opacity = .75; 
			}
			
			if (i==11) matr[i].metalness = .25; 
		
			if (i==12) matr[i].emissive.setHex(0x3a3a3a); 
		
			if ((i==5) || (i==11) || (i==12)) { 
				//matr[i].reflectivity = .8;
				matr[i].envMap = x.skybox; 
			}
			
			x.room.children[i].material = matr[i]; 
		}
		
		//grups[0].position.set(0, -100, 0); 
		//grups[0].rotation.set(Math.PI/-2, 0, Math.PI/-2); 
		grups[0].add(x.room); 
		
		scene.add(grups[0]); 

		//x.spotLight[0].target = x.room; 
		
		// 0 - bedframe   1 - ceiling  2 - carpet     3 - walls/ceiling  4 - mattress  5 - marble 6 - pillows/blanket
		// 7 - background 8 - ceiling2 9 - bedstands 10 - floor         11 - blinds   12 - blinds2
		
		const loader0 = new THREE.TextureLoader(),  
			  //loader1 = new THREE.TextureLoader(),  
			  loader2 = new THREE.TextureLoader(),   
			  loader2b = new THREE.TextureLoader(),   
			  //loader3 = new THREE.TextureLoader(),   
			  //loader4 = new THREE.TextureLoader(),   
			  loader5 = new THREE.TextureLoader(),   
			  loader6 = new THREE.TextureLoader(),   
			  loader6b = new THREE.TextureLoader(),   
			  loader6c = new THREE.TextureLoader(),   
			  loader7 = new THREE.TextureLoader(),   
			  loader8 = new THREE.TextureLoader(),   
			  //loader9 = new THREE.TextureLoader(),   
			  loader10 = new THREE.TextureLoader(),   
			  loader10b = new THREE.TextureLoader(),   
			  //loader10c = new THREE.TextureLoader(),   
			  //loader11 = new THREE.TextureLoader(),    
			  loader12 = new THREE.TextureLoader();   

	//	loader0.load( url2 + 'bedframe.jpg', function(tx0) { 	
	//		x.room.children[0].material.map = tx0; 
	//		x.room.children[0].material.needsUpdate = true; 
	//		
	//		//fadeScene(); 
	//	});  
		
		loader0.load( url6 + 'normal1.jpg', function(tx0) { 	
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			tx0.repeat.set(7, 7);    		
		//	tx0.center.set(0.5, 0.5); 
		//	tx0.rotation = Math.PI/4; 
			
			x.room.children[0].material.normalScale.set(.35, .35); 
			x.room.children[0].material.normalMap = tx0; 
			x.room.children[0].material.needsUpdate = true; 
		});  


		loader2.load( 'img/bakrum/carpetc.jpg', function(tx2) { 	
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
			tx2.repeat.set(1.4, 1.4);    
		
			x.room.children[2].material.map = tx2; 
			x.room.children[2].material.needsUpdate = true; 
		});  
		
		loader2b.load( 'img/bakrum/carpetd.jpg', function(tx2b) { 	
			tx2b.wrapS = tx2b.wrapT = THREE.RepeatWrapping;    
			tx2b.repeat.set(1.4, 1.4);    
		
			x.room.children[2].material.bumpScale = 16; 
			x.room.children[2].material.bumpMap = tx2b; 
			x.room.children[2].material.needsUpdate = true; 
		});  
		

		loader5.load( url2 + 'marble.jpg', function(tx5) { 	
			x.room.children[5].material.map = tx5; 
			x.room.children[5].material.needsUpdate = true; 
		});  
		
		loader6.load( url6 + 'color1.jpg', function(tx6) { 	
			tx6.wrapS = tx6.wrapT = THREE.RepeatWrapping;    
			tx6.repeat.set(5.8, 5.8);    		
		
			x.room.children[6].material.map = tx6; 
			x.room.children[6].material.needsUpdate = true; 
		});  
		
		loader6b.load( url6 + 'rough1.jpg', function(tx6b) { 	
			tx6b.wrapS = tx6b.wrapT = THREE.RepeatWrapping;    
			tx6b.repeat.set(5.8, 5.8);    		
		
			x.room.children[6].material.roughnessMap = tx6b; 
			x.room.children[6].material.needsUpdate = true; 
		});  
		
		loader6c.load( url6 + 'normal1.jpg', function(tx6c) { 	
			tx6c.wrapS = tx6c.wrapT = THREE.RepeatWrapping;    
			tx6c.repeat.set(5.8, 5.8);    		
		
			x.room.children[4].material.normalScale.set(.3, .3); 
			x.room.children[6].material.normalScale.set(.75, .75); 
			x.room.children[4].material.normalMap = x.room.children[6].material.normalMap = tx6c; 
			x.room.children[4].material.needsUpdate = x.room.children[6].material.needsUpdate = true; 
		});  
		

		loader7.load( url6 + 'normal1.jpg', function(tx7) { 	
			tx7.wrapS = tx7.wrapT = THREE.RepeatWrapping;    
			tx7.repeat.set(3, 3);    		
			tx7.center.set(0.5, 0.5); 
			tx7.rotation = Math.PI/4; 
			
			x.room.children[7].material.normalScale.set(-.35, -.35); 
			x.room.children[7].material.normalMap = tx7; 
			x.room.children[7].material.needsUpdate = true; 
		});  
		
		
	//	loader9.load( url2 + 'foot.jpg', function(tx9) { 	
	//		x.room.children[9].material.map = tx9; 
	//		x.room.children[9].material.needsUpdate = true; 
	//	});  
		
		
		loader10.load( url10 + 'color1.jpg', function(tx10) { 	
			tx10.wrapS = tx10.wrapT = THREE.RepeatWrapping;    
			tx10.repeat.set(4.2, 3);  		
		
			x.room.children[10].material.map = tx10; 
			x.room.children[10].material.needsUpdate = true; 
		});  
		
		loader10b.load( url10 + 'rough1.jpg', function(tx10b) { 	
			tx10b.wrapS = tx10b.wrapT = THREE.RepeatWrapping;    
			tx10b.repeat.set(4.2, 3);  
			
			x.room.children[10].material.roughnessMap = tx10b; 
			x.room.children[10].material.needsUpdate = true; 
		});  
		
	//	loader10c.load( url10 + 'normal1.jpg', function(tx10c) { 	
	//		tx10c.wrapS = tx10c.wrapT = THREE.RepeatWrapping;    
	//		tx10c.repeat.set(4.2, 3);  
	//		
	//		x.room.children[10].material.normalMap = tx10c; 
	//		x.room.children[10].material.needsUpdate = true; 
	//	});  
		
		loader12.load( url2 + 'deck.jpg', function(tx12) { 	
			x.room.children[12].material.map = tx12; 
			x.room.children[12].material.needsUpdate = true; 
		});  
		
		const pGeom = new THREE.PlaneGeometry( 240, 195 );
		const pMatr = new THREE.MeshBasicMaterial( { color: 0xeeeeee, transparent: true, opacity: .2 } );
		pMatr.depthWrite = false; 
		pMatr.reflectivity = .8;
		pMatr.envMap = x.skybox; 
		
		const Pane = new THREE.Mesh( pGeom, pMatr );
		Pane.position.set(333, 52, 52); 
		Pane.rotation.set(0, Math.PI/-2, 0); 
		
		scene.add( Pane );
		
		const pGeom2 = new THREE.PlaneGeometry( 544, 164 );
		const pMatr2 = new THREE.MeshBasicMaterial( { color: 0xffd4c4, transparent: true, opacity: .8 } );
		
		const Glow = new THREE.Mesh( pGeom2, pMatr2 );
		Glow.position.set(0, 103, -138.1); 
		//Glow.rotation.set(Math.PI/-2, 0, 0); 
		
		scene.add( Glow );
		

		const loadGlow = new THREE.TextureLoader(); 
		
		loadGlow.load( url2 + 'glow1.png', function(txGlow) { 	
			pMatr2.map = pMatr2.alphaMap = txGlow; 
			pMatr2.needsUpdate = true; 
		});
		
		addRays(); 
		
		addLamps(); 
		//addSea(); 

		fadeScene(); 
	}); 
	
}	

function addRays() {
	const rays = [], 
		  //posZ = [0, -13, -26, -39, -52, -65, -78, -91, -104, -117, -145, -169, -185], 
		  //posY = [], 
		  posZ = [0, -13, -26, -39, -52, -65, -78, -91, -104, -117, -103, -129, -150], 
		  qtr = Math.PI/-4; 
	      //rotX = [qtr - .15, qtr - .16, qtr - .17, qtr - .18, qtr - .19, qtr - .2, qtr - .21,  
		  //		  qtr - .22, qtr - .23, qtr - .24, qtr - .25, qtr - .26, qtr - .37]; 
				  
	const geom = new THREE.PlaneGeometry( 280, 400 );
	const geom2 = new THREE.PlaneGeometry( 280, 300 );
	const rMatr = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: .3 } );
	const rMatr2 = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: .45 } );
	rMatr.depthWrite = rMatr2.depthWrite = false; 
	rMatr.side = rMatr2.side = 2; 
	
	for ( let i = 0; i < 13; i++ ) {	
	    if (i<10) {
			rays[i] = new THREE.Mesh( geom, rMatr );
			
			rays[i].position.z = posZ[i]; 
		} else {
			rays[i] = new THREE.Mesh( geom2, rMatr2 );
			
			rays[i].position.y = -30; 
			rays[i].position.z = posZ[i]; 
		}
		

		//rays[i].rotation.set(Math.PI/-4, Math.PI/-4, Math.PI/-4); 
		rays[i].rotation.x = qtr - .15;  
		if (i==12) rays[i].rotation.x = qtr - .1; 
		
		//rays[i].rotation.x = Math.PI / 180 * -45; 
		//rays[i].rotation.y = Math.PI / 180 * -90; 
	
		grups[1].add( rays[i] );
	}
	
	//rays[12].material.color.setHex(0x00ff00); 
	
	grups[1].position.set(172, 23, 51); 
	grups[1].rotation.y = Math.PI/-2; 

	const loader = new THREE.TextureLoader(); 
	
	loader.load( 'img/rays2.png', function(tx) { 	
		//rMatr.map = 
		rMatr.alphaMap = rMatr2.alphaMap = tx; 
		rMatr.needsUpdate = rMatr2.needsUpdate = true; 
		
		scene.add(grups[1]); 
	});
		
}
	
function addLamps() {
	let meshCount = 0; 
	x.lamp = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/lamp/1/lamp.obj', function ( object ) {
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

		//x.lamp[0] = object; 
		//x.lamp[1] = object; 
		//x.lamp[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/lamp/1/mat/', 
			  frm = 'jpg', 
			  posX = [-110, 0, 110]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0xffffff, roughness: .7, metalness: .3 } );
		
		matr.envMap = x.skybox; 
		//matr.emissiveIntensity = 10;
		
		for ( let i = 0; i < 3; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .25, metalness: .25 } );
			
			x.lamp[i] = new THREE.Mesh( geom, matr );
			
			//x.lamp[i].children[0].material = matr; 
			
			x.lamp[i].scale.set(11, 15, 11); 
			//console.log(posX[i]);
			x.lamp[i].position.set(posX[i], 78, -20); 
			
			x.lamp[i].castShadow = true; 
			x.lamp[i].receiveShadow = true; 
			
			grups[0].add(x.lamp[i]); 
		}
		
		//x.lamp[].scale.set(30, 30, 30); 
		//x.lamp[].position.set(140, 0, 20);
		//x.lamp[].rotation.set(Math.PI/-2, 0, Math.PI);
		//grups[0].add(x.lamp[]); 
		
		const loader1 = new THREE.TextureLoader(),    
			  loader2 = new THREE.TextureLoader(),    
			  //loader3 = new THREE.TextureLoader(),    
			  loader4 = new THREE.TextureLoader(),    
			  loader5 = new THREE.TextureLoader(),    
			  loader6 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
		});  

		loader1.load( url2 + 'emissive1.jpg', function(tx2) { 	
			matr.emissiveMap = tx2; 
			matr.needsUpdate = true; 
		});  
		
		//loader3.load( url2 + 'alfa1.jpg', function(tx3) { 	
		//	matr.alphaMap = tx3; 
		//	matr.needsUpdate = true; 
		//});  

		loader4.load( url2 + 'rough2.jpg', function(tx4) { 	
			matr.roughnessMap = tx4; 
			matr.needsUpdate = true; 
		});  

		loader5.load( url2 + 'metal1.jpg', function(tx5) { 	
			matr.metalnessMap = tx5; 
			matr.needsUpdate = true; 
		});  

		loader6.load( url2 + 'normal1.jpg', function(tx6) { 	
			matr.normalMap = tx6; 
			matr.needsUpdate = true; 
		});  		
		
	}); 
}	

function addTables() {
	const tables = [], 
		  posX = [-144, 144]; 
	
	const geometry = new THREE.BoxGeometry( 70, 6.2, 55 );
	const tableMatr = new THREE.MeshStandardMaterial( { color: 0xd8d8d8, roughness: .9, metalness: 0 } ); 
	
	for ( let i = 0; i < 2; i++ ) {	
		tables[i] = new THREE.Mesh( geometry, tableMatr );
		tables[i].position.set(posX[i], -55, -105);
		//tables[i].rotation.x = Math.PI/-2; 
		tables[i].castShadow = true; 
		tables[i].receiveShadow = true; 
	
		scene.add( tables[i] );
	}
	
	const url2 = 'img/wood/0/', 
		  txU = 1, txV = 1; 
	
	const loader0 = new THREE.TextureLoader(); 
	
	loader0.load( url2 + 'rough1.jpg', function(tx0) { 
		tableMatr.map = tableMatr.roughnessMap = tx0; 
		tableMatr.needsUpdate = true; 
	});  

}

function addBull() {
	let meshCount = 0; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/decor/1/bull.obj', function ( object ) {
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

		//const url2 = 'obj/lamp/1/mat/', 
		//	  frm = 'jpg'; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xeeeeee, roughness: .1, metalness: .7 } );
		
		matr.envMap = x.skybox; 
		
		const bull = new THREE.Mesh( geom, matr );
		
		bull.scale.set(.25, .25, .25); 
		bull.position.set(143, -52, -99); 
		bull.rotation.set(Math.PI/-2, 0, Math.PI/-1.2); 
		
		bull.castShadow = true; 
		bull.receiveShadow = true; 
		
		grups[0].add(bull); 
		
	}); 
}	

function addBear() {
	let meshCount = 0; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/decor/2/bear.obj', function ( object ) {
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

		//const url2 = 'obj/lamp/1/mat/', 
		//	  frm = 'jpg'; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xeeeeee, roughness: .2, metalness: .6 } );
		
		matr.envMap = x.skybox; 
		
		const bear = new THREE.Mesh( geom, matr );
		
		bear.scale.set(.27, .27, .27); 
		bear.position.set(-138, -52, -99); 
		bear.rotation.set(Math.PI/-2, 0, Math.PI/3.4); 
		
		bear.castShadow = true; 
		bear.receiveShadow = true; 
		
		grups[0].add(bear); 
		
	}); 
}	

function addPlants() {
	let meshCount = 0; 
	x.plant = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/plants/0/plants.obj', function ( object ) {
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

		//x.plant[0] = object; 
		//x.plant[1] = object; 
		//x.plant[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/plants/0/mat/', 
			  frm = 'jpg', 
			  posX = [-220, 220]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: 0 } );
		
		matr.alphaTest = .5; 
		//matr.envMap = x.skybox; 
		
		for ( let i = 0; i < 2; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xf2f2f2, roughness: .5, metalness: .1 } );
			
			x.plant[i] = new THREE.Mesh( geom, matr );
			
			//x.plant[i].children[0].material = matr; 
			
			x.plant[i].scale.set(40, 40, 40); 
			//console.log(posX[i]);
			x.plant[i].position.set(posX[i], -50, -99); 
			if (i==0) x.plant[i].rotation.y = Math.PI/-4; 
			
			x.plant[i].castShadow = true; 
			x.plant[i].receiveShadow = true; 
			
			grups[0].add(x.plant[i]); 
		}
		
		const loader1 = new THREE.TextureLoader(),     
			  loader2 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color2.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
		});  
		
		loader2.load( url2 + 'alfa2.jpg', function(tx2) { 	
			matr.alphaMap = tx2; 
			matr.needsUpdate = true; 
		});  

	}); 
}	

function addSea() {
	//x.sea; 
	
	const waterGeometry = new THREE.PlaneGeometry( 550, 778 );

	x.sea = new Water(
		waterGeometry,
		{
			textureWidth: 640,
			textureHeight: 640,
			//waterNormals: new THREE.TextureLoader().load( 'img/water/soft.jpg', function ( texture ) {
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x222222, 
			distortionScale: 2,
			//size: .1,
			fog: scene.fog !== undefined
		}
	);

	x.sea.position.set(0, -100, 250);
	x.sea.rotation.x = - Math.PI / 2;

	scene.add( x.sea );	
	
	const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .011; 
	waterUniforms['size'].value = .1; 
	
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

	if (!isMobil) {
		ui.swtchKam.style.visibility = "visible"; 	
	} else {
		ui.swtchKam.style.display = "none"; 
	}
	
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
	
		//camera.position.z = 450; 
	
		//if (isMobil) x.xx = 800;
		x.zz = 450;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		//camera.position.z = 600; 
		
		//if (isMobil) x.xx = 1100; 
		x.zz = 600; 
	}		
	
	camera.position.z = x.zz; 
	
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
		
	//	x.camGrup.rotation.y = Math.sin(timer*.5) * Math.PI/4.5; 

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
	
//	controls.update(); 
	
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
		let url = 'bdrm'; 			
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
	
	