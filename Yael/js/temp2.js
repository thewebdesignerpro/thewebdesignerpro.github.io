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
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
import { Water } from 'three/addons/objects/Water.js';
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
	kontainer.style.background = "url('img/tfo.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#dddddd';		

	const fogCol = 0xdddddd; 

	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 0; 			//2000 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 1000;			//70 or 35	
	
	//x.xx = 400; 
//	x.zz = 350; 
	x.zz = 8000; 
	
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true; 
	renderer.shadowMap.type = THREE.PCFShadowMap; 
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 1.5;		
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
//	renderer.sortObjects = false;	
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
	scene.fog = new THREE.FogExp2(fogCol, 0.0001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
	grups[2] = new THREE.Group(); 


	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 20000 );
	camera.position.set(0, _.ej[5], x.zz); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	//x.camTarget = new THREE.Object3D(); 
	//x.camTarget.position.set(0, 0, 0); 
	//x.camGrup.add(x.camTarget);	
	
	//scene.add( new THREE.AmbientLight( 0xcdcdcd ) );		
	scene.add( new THREE.AmbientLight( 0xffffff, .67 ) );	

	//x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 10, 0, Math.PI/4, 1, 0 );
	x.spotLight[0].position.set( -100, 1000, -310);
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
	
//	scene.add( x.spotLight[0] );	
	//grups[0].add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

//	x.spotTarget = new THREE.Object3D(); 
//	x.spotTarget.position.set(0, 0, 0); 
//	//x.spotTarget.position.set(21.5, 81.8, -2);
//	scene.add(x.spotTarget);
//	
//	x.spotLight[0].target = x.spotTarget; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	////scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );
    //
	//x.spotLight[0].target = camera; 

	//console.log(x.spotLight[1].intensity); 
	
	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, 0, 2000);  
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	const dLSize = 8000,  
		  dLSize2 = 8000; 
	
	x.directionalLight = new THREE.DirectionalLight( 0xfffcf2, 2.5 );
	//x.directionalLight = new THREE.DirectionalLight( 0xffffff, 2.2 );
	x.directionalLight.castShadow = true; 
	x.directionalLight.shadow.mapSize.width = 1024; 
	x.directionalLight.shadow.mapSize.height = 1024; 
	x.directionalLight.shadow.camera.near = 1; 
	x.directionalLight.shadow.camera.far = 2000; 
	x.directionalLight.shadow.camera.left = -dLSize; 
	x.directionalLight.shadow.camera.bottom = -dLSize2; 
	x.directionalLight.shadow.camera.right = dLSize; 
	x.directionalLight.shadow.camera.top = dLSize2; 
	x.directionalLight.position.set( 0, 1000, -600 );
//	x.directionalLight.shadow.intensity = .9; 
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
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .1;
    controls.autoRotateSpeed = 1.5;	
   // controls.autoRotate = true;    
    controls.minDistance = 0;
    controls.maxDistance = 5500;    
    controls.minPolarAngle = Math.PI/2.8;    
    controls.maxPolarAngle = Math.PI/2.1;   
    controls.rotateSpeed = .5;
    controls.zoomSpeed = 3;
   // controls.enablePan = false;
    controls.panSpeed = 2;
	//controls.update();		
//	controls.enabled = false; 

	
	x.rotCam = false; 	
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	//grups[0] = new THREE.Group(); 
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
	x.target0.position.set(0, 30, 0); 
	//x.target0.position.set(0, _.ej[5], _.ej[3] - 415); 
	scene.add(x.target0);
	//grups[0].add(x.target0);
	//x.camGrup.add(x.target0);
	
	x.spotLight[0].target = x.target0; 
	
	
	controls.target = x.target0.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	//x.spotLightHelper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( x.spotLightHelper );		
	
	addSkybox(); 
	//addClouds(); 
	//addFog(); 
	
	//addSea(); 
	//animCat1(); 
	//addMoon(); 
	
	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	//const f = '.png'; 
	const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/7/' );
	//loader.setPath( 'img/skybox/22/66/' ); 
	//loader.setPath( 'img/skybox/22/67/' ); 

	loader.load( [
		'posx2'+f, 'negx2'+f,
		'posy'+f, 'negy'+f,
		'posz2'+f, 'negz2'+f	
		//'posx'+f, 'negx'+f,
		//'posy'+f, 'negy'+f,
		//'negz'+f, 'posz'+f
		//'posz'+f, 'negz'+f
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
		scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
	//	scene.backgroundRotation.y = 1.35; 
		scene.backgroundBlurriness = .01; 
		//scene.backgroundIntensity = .75; 
		
		scene.background = tx; 
	//	scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addSea(); 
		//addSea2(); 
		//addMountain();
		addWaterfall();
		
		addFog(); 
		
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
	
function addClouds() {
	//const geometry = new THREE.SphereGeometry( 3500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	//const geometry = new THREE.SphereGeometry( 2200, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const geometry = new THREE.SphereGeometry( 1500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	//material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
	domeClouds.position.y = -20; 
//	domeClouds.rotation.y = Math.PI - .5; 
	//domeClouds.rotation.y = Math.random() * (Math.PI*2); 
	domeClouds.rotation.y = Math.PI/-2; 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	//domeClouds.position.z = -50; 
	
	//console.log(domeClouds.rotation.y); 
	
	//scene.add( domeClouds );
	x.camGrup.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	//load1.load( 'img/skybox/0/mway3.jpg', function(tx) { 
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
	//addMountains(); 
	addSea(); 
}

function addWaterfall() {
	let meshCount = 0; 
	let url = 'waterfall/terrjoin';  
	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry);
				//console.log(child.geometry.name);
				
			//	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				//child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (180 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//if (meshCount == 1) {
					//child.castShadow = true; 
					//child.receiveShadow = true; 
				//}
				
				//if (meshCount != 2) {
				//	//child.geometry.scale.set(.1, .1, .1); 
				//}
				
				meshCount += 1; 
				
				//child.frustumCulled = false;				
			}
		} );	
		
		//console.log(meshCount); 
		//console.log(object);
		
		x.terrain = object; 
		//x.ufo.receiveShadow = true; 
		
		//console.log(x.ufo.children[0]);
		
		
		const matr1 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//matr1.transparent = true; 
		//matr1.opacity = .84; 
		//matr1.side = 2; 
			
		matr1.wireframe = true; 
		//matr1.envMapIntensity = 2.3; 
		//matr1.envMap = x.skybox; 			
		
		x.terrain.children[0].material = matr1;
		
		x.terrain.scale.set(1.7, 1.7, 1.7); 
		x.terrain.position.set(0, -400, 0);
		//x.terrain.rotation.set(Math.PI/-2, 0, 0);
		//x.terrain.rotation.y = Math.PI/2 + .5; 
		
		grups[1].add(x.terrain); 
		//grups[1].position.set(-80, -50, 700);  
		
		scene.add(grups[1]); 

		const loader0 = new THREE.TextureLoader(),     
			  loader1 = new THREE.TextureLoader(),     
			  loader2 = new THREE.TextureLoader(), 
			  url2 = 'img/Ground068/', 
			  frm = 'jpg'; 
	//		  loader3 = new THREE.TextureLoader();    
    
		loader0.load( url2 + 'Ground068_1K-JPG_Color.' + frm, function(tx0) { 	
			//tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
			//tx0.repeat.set(2, 2);    				
		
			matr1.map = tx0; 
			matr1.needsUpdate = true; 
			
			for ( let j = 0; j < 1; j++ ) {				
				matr1.wireframe = false; 	
			}
			
			//tx0.minFilter = THREE.LinearFilter;
			//tx0.magFilter = THREE.LinearFilter;
			//tx0.generateMipmaps = false;
			//tx0.colorSpace = THREE.SRGBColorSpace;			
			//
			//x.spotLight[0].map = tx0; 
			
			//fadeScene(); 
		});  
		
		loader1.load( url2 + 'Ground068_1K-JPG_NormalGL.' + frm, function(tx1) { 	
			//tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
			////tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
			//tx1.repeat.set(20, 20);    			
			
			//tx1.colorSpace = THREE.SRGBColorSpace;	
		
			matr1.normalScale.set(1.5, 1.5); 
			matr1.normalMap = tx1; 
			matr1.needsUpdate = true; 
		
			//fadeScene(); 
		});  
		
		loader2.load( url2 + 'Ground068_1K-JPG_Roughness.' + frm, function(tx2) { 	
			//tx2.colorSpace = THREE.SRGBColorSpace;	
		
			matr1.roughnessMap = tx2; 
			matr1.needsUpdate = true; 
		}); 
		
		
		//fadeScene(); 	
		
		//x.terrain.visible = false; 
	} );
	
	addWaterfol(); 
}

function addWaterfol() {
	let meshCount = 0; 
	let url = 'waterfall/waterfol';  
	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry);
				//console.log(child.geometry.name);
				
			//	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				//child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (180 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//if (meshCount == 1) {
					//child.castShadow = true; 
					//child.receiveShadow = true; 
				//}
				
				//if (meshCount != 2) {
				//	//child.geometry.scale.set(.1, .1, .1); 
				//}
				
				meshCount += 1; 
				
				//child.frustumCulled = false;				
			}
		} );	
		
		//console.log(meshCount); 
		//console.log(object);
		
		x.waterfol = object; 
		//x.ufo.receiveShadow = true; 
		
		//console.log(x.ufo.children[0]);
		
		
		//const matr1 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .7, metalness: .4 } );
		const matr1 = new THREE.MeshStandardMaterial( { color: 0x223344, roughness: .25, metalness: .15 } );		
		//matr1.transparent = true; 
		//matr1.opacity = .84; 
		//matr1.side = 2; 
			
		matr1.wireframe = true; 
		//matr1.envMapIntensity = 3; 
		matr1.envMap = x.skybox; 			
		
		x.waterfol.children[0].material = matr1;
		
		x.waterfol.scale.set(1.7, 1.7, 1.7); 
		x.waterfol.position.set(0, -400, 0);
		//x.waterfol.rotation.set(Math.PI/-2, 0, 0);
		//x.waterfol.rotation.y = Math.PI/2 + .5; 
		
		grups[1].add(x.waterfol); 
		//grups[1].position.set(-80, -50, 700);  
		
		//scene.add(grups[1]); 

		const loader0 = new THREE.TextureLoader(),     
			  loader1 = new THREE.TextureLoader(),     
			  loader2 = new THREE.TextureLoader(), 
			  url2 = 'obj/waterfall/', 
			  frm = 'jpeg'; 
	//		  loader3 = new THREE.TextureLoader();    
    
		loader0.load( url2 + 'wftex.' + frm, function(tx0) { 	
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
			tx0.repeat.set(3, 3);    				
		
			matr1.normalScale.set(.25, .25); 
			matr1.normalMap = matr1.roughnessMap = tx0; 
			//matr1.roughnessMap = tx0; 
			matr1.needsUpdate = true; 
			
			for ( let j = 0; j < 1; j++ ) {				
				matr1.wireframe = false; 	
			}
			
			//tx0.minFilter = THREE.LinearFilter;
			//tx0.magFilter = THREE.LinearFilter;
			//tx0.generateMipmaps = false;
			//tx0.colorSpace = THREE.SRGBColorSpace;			
			//
			//x.spotLight[0].map = tx0; 
			
			//fadeScene(); 
		});  
		
		//loader1.load( url2 + 'wftex.' + frm, function(tx1) { 	
		//	//tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		//	////tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
		//	//tx1.repeat.set(20, 20);    			
		//	
		//	//tx1.colorSpace = THREE.SRGBColorSpace;	
		//
		//	matr1.normalScale.set(1.5, 1.5); 
		//	matr1.normalMap = tx1; 
		//	matr1.needsUpdate = true; 
		//
		//	//fadeScene(); 
		//});  
		//
		//loader2.load( url2 + 'Ground068_1K-JPG_Roughness.' + frm, function(tx2) { 	
		//	//tx2.colorSpace = THREE.SRGBColorSpace;	
		//
		//	matr1.roughnessMap = tx2; 
		//	matr1.needsUpdate = true; 
		//}); 
		
		
		//fadeScene(); 	
		
		//x.terrain.visible = false; 
	} );
	
	addWaterfol2(); 
}

function addWaterfol2() {
	let meshCount = 0; 
	let url = 'waterfall/waterfol2';  
	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry);
				//console.log(child.geometry.name);
				
			//	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				//child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (180 / 180) * Math.PI); 
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				//if (meshCount == 1) {
					//child.castShadow = true; 
					//child.receiveShadow = true; 
				//}
				
				//if (meshCount != 2) {
				//	//child.geometry.scale.set(.1, .1, .1); 
				//}
				
				meshCount += 1; 
				
				//child.frustumCulled = false;				
			}
		} );	
		
		//console.log(meshCount); 
		//console.log(object);
		
		x.waterfol2 = object; 
		//x.ufo.receiveShadow = true; 
		
		//console.log(x.ufo.children[0]);
		
		
		const matr1 = new THREE.MeshStandardMaterial( { color: 0x334455, roughness: .15, metalness: .25 } );
		//matr1.transparent = true; 
		//matr1.opacity = .84; 
		//matr1.side = 2; 
			
		matr1.wireframe = true; 
		//matr1.envMapIntensity = 2; 
		matr1.envMap = x.skybox; 			
		
		x.waterfol2.children[0].material = matr1;
		
		x.waterfol2.scale.set(1.7, 1.7, 1.7); 
		x.waterfol2.position.set(0, -380, 0);
		//x.waterfol2.position.set(0, -400, 0);
		//x.waterfol2.rotation.set(Math.PI/-2, 0, 0);
		//x.waterfol2.rotation.y = Math.PI/2 + .5; 
		
		grups[1].add(x.waterfol2); 
		//grups[1].position.set(-80, -50, 700);  
		
		//scene.add(grups[1]); 

		const loader0 = new THREE.TextureLoader(),     
			  loader1 = new THREE.TextureLoader(),     
			  loader2 = new THREE.TextureLoader(), 
			  url2 = 'obj/waterfall/', 
			  frm = 'jpeg'; 
	//		  loader3 = new THREE.TextureLoader();    
    
		loader0.load( url2 + 'wftex.' + frm, function(tx0) { 	
			tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
			////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
			tx0.repeat.set(1, 3);    				
		
			//matr1.map = matr1.normalMap = matr1.roughnessMap = tx0;

			matr1.normalScale.set(.1, .1);			
			matr1.normalMap = matr1.roughnessMap = tx0; 
			matr1.needsUpdate = true; 
			
			for ( let j = 0; j < 1; j++ ) {				
				matr1.wireframe = false; 	
			}
			
			//tx0.minFilter = THREE.LinearFilter;
			//tx0.magFilter = THREE.LinearFilter;
			//tx0.generateMipmaps = false;
			//tx0.colorSpace = THREE.SRGBColorSpace;			
			//
			//x.spotLight[0].map = tx0; 
			
			//fadeScene(); 
		});  
		
		//loader1.load( url2 + 'wftex.' + frm, function(tx1) { 	
		//	//tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		//	////tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
		//	//tx1.repeat.set(20, 20);    			
		//	
		//	//tx1.colorSpace = THREE.SRGBColorSpace;	
		//
		//	matr1.normalScale.set(1.5, 1.5); 
		//	matr1.normalMap = tx1; 
		//	matr1.needsUpdate = true; 
		//
		//	//fadeScene(); 
		//});  
		//
		//loader2.load( url2 + 'Ground068_1K-JPG_Roughness.' + frm, function(tx2) { 	
		//	//tx2.colorSpace = THREE.SRGBColorSpace;	
		//
		//	matr1.roughnessMap = tx2; 
		//	matr1.needsUpdate = true; 
		//}); 
		
		
		//fadeScene(); 	
		
		//x.terrain.visible = false; 
	} );
	
	//addWaterfol(); 
}


function addSea() {
	//x.sea = []; 
	
	const waterGeometry = new THREE.PlaneGeometry( 15000, 15000 );

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
			waterColor: 0x112230, 
			distortionScale: 10,
			//size: .1,
			fog: scene.fog !== undefined
		}
	);


	x.sea.position.set(0, -20, 0);
	x.sea.rotation.x = - Math.PI / 2;

	//x.sea[1].position.set(0, -.5, 0);
	//x.sea[1].rotation.x = - Math.PI / 2;
    //

	grups[2].add( x.sea );		
	scene.add( grups[2] );	

	grups[2].rotation.y = Math.PI / -2;
	
	const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .005; 
	waterUniforms['size'].value = .1; 
	
	//const waterUniforms1 = x.sea[1].material.uniforms;
	//waterUniforms1['size'].value = .02; 
	
	fadeScene(); 	
	//animFBX(); 
	
	//addSun(); 
}

function randomizeMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	
	let posx = (Math.random() * 9200 - 4600),
		//posy = (Math.random() * 1600 + 400),  	
		posy = (Math.random() * 1000 + 1000),  	
		posz = (Math.random() * 9200 - 4600); 	
		
//	if ((posx > -2000) && (posx < 2000) && (posz > -2000) && (posz < 2000)) {
//		//let rndX = Math.random() < 0.5 ? -1 : 1, 
//			//rndZ = Math.random() < 0.5 ? -1 : 1;
//			
//		posx *= 2.3; 
//		posz *= 2.3; 
//		
//		//posx = 404 * rndX; 
//		//posz = 384 * rndZ; 
//		//posz = (Math.random() * -800 - 400);  
//		//console.log(posx);
//	}
		
	position.x = posx;
	position.y = posy;
	position.z = posz;
	
	rotation.x = posy * -.0004; 
	
	if (posz<0) rotation.x *= -1; 

	//rotation.y = Math.random() * 2 * Math.PI; 
	rotation.y = posx * .0004; 
	
	if (posz<0) rotation.y *= -1; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 2.6 + Math.random();
	scale.x = scale.y = scale.z = 1 + Math.random();

	return matrix.compose( position, quaternion, scale );
}

function addFog() {
	x.clouds = []; 
	
	const geometry = new THREE.PlaneGeometry( 1200, 600 );
	const material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, side: THREE.DoubleSide } );
	
	//material.alphaTest = .5; 
	material.depthWrite = false; 
	material.transparent = true; 
	material.opacity = .1; 
	
	//const plane = new THREE.Mesh( geometry, material );
	//scene.add( plane );	
	
	for ( let i = 0; i < 2; i++ ) {	
		//const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		const lngth0 = geometry.attributes.position.array.length,   
			  qty = 800; 		
		
		//console.log(lngth0); 
	
		x.clouds[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
		//x.clouds[i].frustumCulled = true;
		//x.clouds[i].castShadow = true; 
		//x.clouds[i].receiveShadow = true;


		
		const geometryId0 = x.clouds[i].addGeometry( geometry );
		
		let matrix = new THREE.Matrix4(); 
		
		for ( let j = 0; j < qty; j ++ ) {
			
			const instancedId0 = x.clouds[i].addInstance( geometryId0 );
		
			matrix = randomizeMatrix( matrix ); 

			x.clouds[i].setMatrixAt( instancedId0, matrix ); 				
		}
		
		//if (i==0) {
			grups[1].add(x.clouds[i]); 
		//} else {
			//grups[1].add(x.leaves[i]); 
			//grups[1].add(x.trunk[i]); 
		//}			
		
		x.clouds[i].visible = false; 
	}		
	
	const loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  url2 = 'img/temp/'; 

	loader1.load( url2 + '41.png', function(tx1) { 	
		material.map = material.alphaMap = tx1; 
		material.needsUpdate = true;
		
		for ( let l = 0; l < 2; l++ ) {	
			x.clouds[l].visible = true; 
		}
	});  
		
	//addSea2(); 
	//fadeScene(); 
}

	
function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
		let val = parseFloat(ui.fader.style.opacity); 
		
        //if (!((val += .02) > 1.0)) {
		if (!((val -= .1) < 0)) {
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
	//	cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
	//	x.zz = 350; 
		x.zz = 5000; 
	} else {
	//	cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		x.zz = 5000; 
	}		
	
	camera.position.z = x.zz; 
	//x.camGrup.position.z = x.zz; 
	
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
		
		x.target0.position.z = _.ej[3] - 415; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
		x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
	}
	
}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		const timer = Date.now() * 0.0005; 
		//console.log(timer); 
		
		let delta = clock.getDelta() * .3; 
	//	//if ( mixer ) 
	//	mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
		
		//let delta = clock.getDelta() * .3; 
		 
		//const mSin5 = timer; 
		
	//	if (!x.rotCam) {
//			if (isMobil) {
//				camera.position.x = Math.sin(timer*.7) * 240; 
//				camera.position.y = Math.cos(timer*.5) * 60 + 45;  
//				//camera.position.z = 40 - Math.abs(Math.sin(mSin5) * 15); 
//				//x.camGrup.rotation.y = Math.sin(timer/3) * Math.PI; 				
//			} else {
//				//const ptY = _.pointer.y * Math.PI/-3.5, 
//				//	  ptX = _.pointer.x * Math.PI;  
//				
//				camera.position.x = _.pointer.x * 240; 
//				camera.position.y = _.pointer.y * 60 + 45; 
//				//camera.position.z = 40 - Math.abs(_.pointer.y * 15); 
//				//x.camGrup.rotateY( (_.pointer.x * .005) % Math.PI ); 
//			}
	//	} else {	
	//		camera.position.y = Math.sin(timer) * 22 - 10; 
	//		camera.position.z = 40 - Math.abs(Math.sin(timer) * 11); 
	//		x.camGrup.rotateY( -.01 % Math.PI ); 			
	//	}
	
		
		x.sea.material.uniforms[ 'time' ].value -= .005;	
		
		let y0 = x.waterfol.children[0].material.normalMap.offset.y + .01;   
		if (y0 >= 1) y0 = 0; 		
		
		x.waterfol.children[0].material.normalMap.offset.y = y0; 
		x.waterfol2.children[0].material.normalMap.offset.y = -y0; 
		
		x.clouds[0].rotation.y = Math.cos(timer*.13); 
		x.clouds[1].rotation.y = Math.cos(timer*.1); 		
	
		//animWalk(); 
		

		
//		mixer.update( delta );		

		
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
		camera.lookAt(x.target0.position); 
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
		//let url = 'crescent-moon-173121'; 	
		let url = 'fish'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bdrm'; 
		//let url = 'ufo'; 
		//let url = 'nghtcty'; 		
		//let url = 'bah2'; 		
		//let url = 'wndrr'; 		
		//let url = 'crscntmn'; 		
	//	let url = 'mnrvr'; 		
		//url += '.mp3'; 	
		//url += '.mp4'; 	
		//url += '.3gp'; 	
		url += '.webm'; 	
		
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
		x.analyser = new THREE.AudioAnalyser( x.sound, 64 );		
	
	}
	
}
	
	