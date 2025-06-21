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
	kontainer.style.background = "url('img/mooncatl.jpg') center top no-repeat"; 
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
	_.ej[5] = 30;			//70 or 35	
	
	//x.xx = 400; 
	x.zz = 350; 
	
	
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.0004);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 


	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 10000 );
	camera.position.set(0, _.ej[5], x.zz); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	//x.camTarget = new THREE.Object3D(); 
	//x.camTarget.position.set(0, 0, 0); 
	//x.camGrup.add(x.camTarget);	
	
	scene.add( new THREE.AmbientLight( 0xcdcdcd ) );		

	//x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xfffae9, 3, 260, Math.PI/7, 1, 0 );
	//x.spotLight[0].position.set( -100, 140, -310);
	x.spotLight[0].position.set( -150 + 21.5, -80 + 81.8, -2);
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
	
	scene.add( x.spotLight[0] );	
	//grups[0].add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

	x.spotLight[1] = new THREE.SpotLight( 0xfffae9, 3, 260, Math.PI/7, 1, 0 );
	x.spotLight[1].position.set( 123 + 21.5, 107 + 81.8, -2 );
	scene.add( x.spotLight[1] );	

	x.spotLight[2] = new THREE.SpotLight( 0xfffae9, 3, 220, Math.PI/7, 1, 0 );
	x.spotLight[2].position.set( 136.5 + 21.5, -130 + 81.8, -2 );
	scene.add( x.spotLight[2] );	

	x.spotTarget = new THREE.Object3D(); 
	//x.spotTarget.position.set(0, 40, 0); 
	x.spotTarget.position.set(21.5, 81.8, -2);
	scene.add(x.spotTarget);
	
	x.spotLight[0].target = x.spotTarget; 	
	x.spotLight[1].target = x.spotTarget; 	
	x.spotLight[2].target = x.spotTarget; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	////scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );
    //
	//x.spotLightHelper1 = new THREE.SpotLightHelper( x.spotLight[1] );
	////scene.add( x.spotLightHelper1 );
	//x.camGrup.add( x.spotLightHelper1 );

	//x.spotLightHelper2 = new THREE.SpotLightHelper( x.spotLight[2] );
	////scene.add( x.spotLightHelper2 );
	//x.camGrup.add( x.spotLightHelper2 );

	//x.spotLight[0].target = camera; 

	//console.log(x.spotLight[1].intensity); 
	
	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, 0, 2000);  
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	const dLSize = 3000,  
		  dLSize2 = 3000; 
	
//	x.directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
//	//const directionalLight = new THREE.DirectionalLight( 0xffffff, 4 );
//	x.directionalLight.castShadow = true; 
//	//directionalLight.shadow.mapSize.width = 1024; 
//	//directionalLight.shadow.mapSize.height = 1024; 
//	//directionalLight.shadow.camera.near = 1; 
//	x.directionalLight.shadow.camera.far = 3000;	
//	x.directionalLight.shadow.camera.left = -dLSize; 
//	x.directionalLight.shadow.camera.bottom = -dLSize2; 
//	x.directionalLight.shadow.camera.right = dLSize; 
//	x.directionalLight.shadow.camera.top = dLSize2; 
//	x.directionalLight.position.set( 0, 200, 200 );
//	x.directionalLight.shadow.intensity = .9; 
//	scene.add( x.directionalLight );

	
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
    controls.autoRotateSpeed = 1.5;	
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
//	controls.enabled = false; 
*/
	
	x.rotCam = false; 	
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	grups[0] = new THREE.Group(); 
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
	
	x.target0 = new THREE.Object3D(); 
	x.target0.position.set(0, 30, 0); 
	//x.target0.position.set(0, _.ej[5], _.ej[3] - 415); 
	scene.add(x.target0);
	//grups[0].add(x.target0);
	//x.camGrup.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
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
	//addFog(); 
	
	//addSea(); 
	//animCat1(); 
	addMoon(); 
	
	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

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
	
function addClouds() {
	//const geometry = new THREE.SphereGeometry( 3500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	//const geometry = new THREE.SphereGeometry( 2200, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const geometry = new THREE.SphereGeometry( 1500, 32, 16, 0, Math.PI*2, 0, Math.PI/2 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, fog: false } ); 
	//material.transparent = true; 
	
	const domeClouds = new THREE.Mesh( geometry, material ); 
	domeClouds.position.y = -20; 
	domeClouds.rotation.y = Math.PI - .5; 
	//domeClouds.rotation.y = Math.random() * (Math.PI*2); 
	//domeClouds.rotation.y = 1.55; 
	//domeClouds.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	//domeClouds.position.z = -50; 
	
	//console.log(domeClouds.rotation.y); 
	
	//scene.add( domeClouds );
	x.camGrup.add( domeClouds );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	load1.load( 'img/skybox/0/mway3.jpg', function(tx) { 
	//load1.load( 'img/skybox/14/dome2.jpg', function(tx) { 
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
	addMountains(); 
	addSea(); 
}

function addMountains() {
	const geometry = new THREE.CylinderGeometry( 1480, 1480, 200, 32, 1, true, Math.PI/2 - .25, Math.PI + .5  ); 
	const material = new THREE.MeshBasicMaterial( {color: 0x222222, side: 1, alphaTest: .5} ); 
	const mountains = new THREE.Mesh( geometry, material ); 
	mountains.position.set(0, 70, 0); 
	scene.add( mountains ); 
	
	let load1 = new THREE.TextureLoader(); 
		
	load1.load( 'img/mountainsil.jpg', function(tx) { 
		tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping; 
		tx.repeat.set(5, 1); 	
	
		material.alphaMap = tx; 
		material.needsUpdate = true; 
	}); 		
}	

function addSea() {
	//x.sea = []; 
	
	const waterGeometry = new THREE.PlaneGeometry( 3000, 3000 );
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
			waterColor: 0x112230, 
			distortionScale: 8,
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

	x.sea.position.set(0, -20, 0);
	x.sea.rotation.x = - Math.PI / 2;

	//x.sea[1].position.set(0, -.5, 0);
	//x.sea[1].rotation.x = - Math.PI / 2;
    //
	
	scene.add( x.sea );	
	//grups[0].add( x.sea[0] );	
	//grups[1].add( x.sea[1] );	
	
	const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .005; 
	waterUniforms['size'].value = .02; 
	
	//const waterUniforms1 = x.sea[1].material.uniforms;
	//waterUniforms1['size'].value = .02; 
	
	//fadeScene(); 	
	//animFBX(); 
	
	//addSun(); 
}

function addMoon() {
	let meshCount = 0; 
	//x.moon = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/moon/0/moon.obj', function ( object ) {
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
				
				//child.castShadow = true; 
				//child.receiveShadow = true; 
					
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 

		x.moon = object; 
		//x.moon.castShadow = true; 
		//x.moon.receiveShadow = true; 
		
		const matr = [], 
			  url2 = 'obj/moon/0/mat/', 
			  //url2 = 'obj/moon/0/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshBasicMaterial( { color: 0xfffae9 } );
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xfffae9, roughness: 0 } );
			matr[i].emissive.setHex(0xfffae9); 
			matr[i].emissiveIntensity = .5; 
			//matr[i].wireframe = true; 
			//matr[i].transparent = true; 
			
			//if (i==0) {
			//	matr[i].metalness = .15; 
			//} else {
			//	matr[i].alphaTest = .5; 
			//}
			
			//matr[i].envMapIntensity = 2; 
			//matr[i].envMap = x.skybox; 
			
			x.moon.children[i].material = matr[i]; 
		}
		
		x.moon.scale.set(70, 70, 70); 
		//x.moon.scale.set(6.5, 6.5, 6.5); 
		//x.moon.position.set(13, 75, -2);
		x.moon.position.set(21.5, 81.8, -2);
		//x.moon.rotation.set(0, Math.PI/-2, 0);
		x.moon.rotation.set(0, -Math.PI, -.4);
		
		grups[0].add(x.moon); 
		//scene.add(x.moon); 
		
		//grups[0].position.set(0, 15, 0); 
		
		scene.add(grups[0]); 
		
		//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[1] );
		//grups[0].add( x.spotLightHelper );	
		

		const geom = new THREE.PlaneGeometry( 209, 209 ); 
		const mater = new THREE.MeshBasicMaterial( { color: 0xfffae9, depthWrite: false, side: 2 } ); 
		mater.transparent = true; 
		mater.opacity = .67;  
		mater.wireframe = true; 
		
		x.moonGlow = new THREE.Mesh( geom, mater ); 
		x.moonGlow.position.set(15.3, 85.1, -2); 
		//x.moonGlow.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
		scene.add( x.moonGlow );
				
		
		const loader0 = new THREE.TextureLoader();    
	//		  loader1 = new THREE.TextureLoader(),   
	//		  loader2 = new THREE.TextureLoader(),   
	//		  loader3 = new THREE.TextureLoader(),   
	//		  loader4 = new THREE.TextureLoader(),   
	//		  loader5 = new THREE.TextureLoader();    
    
		loader0.load( url2 + 'alfa.jpg', function(tx0) { 	
			mater.alphaMap = tx0; 
			mater.needsUpdate = true; 
			    
			mater.wireframe = false; 	
			
			animCat1(); 
			//fadeScene(); 
		});  
		
	//	loader1.load( url2 + 'normal0.jpg', function(tx1) { 	
	//		matr[0].normalMap = tx1; 
	//		matr[0].needsUpdate = true; 
	//	});  
	//	
	//	loader2.load( url2 + 'rough0.jpg', function(tx2) { 	
	//		matr[0].roughnessMap = tx2; 
	//		matr[0].needsUpdate = true; 
	//	});  
	//	
	//	loader3.load( url2 + 'metal0.jpg', function(tx3) { 	
	//		matr[0].metalnessMap = tx3; 
	//		matr[0].needsUpdate = true; 
	//	});  
    //
	//	loader4.load( url2 + 'emissive0.jpg', function(tx4) { 	
	//		matr[0].emissiveMap = tx4; 
	//		matr[0].needsUpdate = true; 
	//	});  
		

	}); 
	
}	

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
		
		lensflare.position.set(0, 650, -2500); 
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
	
		x.zz = 350; 
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		x.zz = 450; 
	}		
	
	camera.position.z = x.zz; 
	
	_.idleTimer = 0; 
}

/*function animWalk() {
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
	
}*/

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
		
			if (isMobil) {
				camera.position.x = Math.sin(timer*.7) * 240; 
				camera.position.y = Math.cos(timer*.5) * 60 + 45;  
				//camera.position.z = 40 - Math.abs(Math.sin(mSin5) * 15); 
				//x.camGrup.rotation.y = Math.sin(timer/3) * Math.PI; 				
			} else {
				//const ptY = _.pointer.y * Math.PI/-3.5, 
				//	  ptX = _.pointer.x * Math.PI;  
				
				camera.position.x = _.pointer.x * 240; 
				camera.position.y = _.pointer.y * 60 + 45; 
				//camera.position.z = 40 - Math.abs(_.pointer.y * 15); 
				//x.camGrup.rotateY( (_.pointer.x * .005) % Math.PI ); 
			}
	
		
		//grups[0].rotation.set(Math.sin(mSin5) * .1, Math.sin(timer) * Math.PI*3, Math.cos(mSin5) * .1);


		//scene.backgroundRotation.y = Math.sin(timer*.2) * Math.PI; 
		//x.stage[1].material.needsUpdate = true; 
		
		x.sea.material.uniforms[ 'time' ].value -= .0015;	
	
		//animWalk(); 
		
		//camera.position.x = (Math.cos(timer*5) * 2); 
		//camera.position.y = (Math.sin(timer*10) * 3) + _.ej[5]; 
        //
		//if (isMobil) {
		//	camera.position.x += Math.cos(timer) * 35; 
		//	camera.position.y += Math.sin(timer*.7) * 30; 
		//} else {
		//	camera.position.x += _.pointer.x * 35; 
		//	camera.position.y += _.pointer.y * 30; 
		//}			
	
		
		if (x.sound) {
			if (x.sound.isPlaying) {
				const data = x.analyser.getAverageFrequency();  
				//console.log(data); 
				
				let data3 = (data/35); 
				
				//if (data3<.2) console.log(data3); 
				//console.log(data3); 
				
				if (data3 > 0) { 
					x.moon.children[0].material.emissiveIntensity = data3 / 1.65; 
					x.moonGlow.material.opacity = data3 * .8; 
					x.spotLight[0].intensity = x.spotLight[1].intensity = x.spotLight[2].intensity = data3 * 3.55; 

					//if (data3 < .4) {
					//	data3 *= .7; 
					//} else if (data3 > .6) {
					//	data3 *= 1.4; 
					//}
					
					delta *= data3 * 1.5; 
				} else {
					x.moon.children[0].material.emissiveIntensity = x.moonGlow.material.opacity = 0; 
					x.spotLight[0].intensity = x.spotLight[1].intensity = x.spotLight[2].intensity = 0; 
					
					delta = 0; 
				}
				
				//if ((data3 > .4) && (data3 < .6)) console.log(data3); 				
				//if (data3 > .6) console.log(data3); 				
			} else {
				x.moon.children[0].material.emissiveIntensity = .5; 
				x.moonGlow.material.opacity = .67; 
				x.spotLight[0].intensity = x.spotLight[1].intensity = x.spotLight[2].intensity = 3; 
				
				//delta = clock.getDelta() * .3; 
	
			}
		}
		
		mixer.update( delta );		

		
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


function animCat1() {
	let meshCount = 0; 
	let url = 'cat/1/cat';  
	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {

		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
				//console.log(child.geometry.name);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				if (meshCount == 1) {
					child.castShadow = true; 
					//child.receiveShadow = true; 
				}
				
				meshCount += 1; 
				
				//child.frustumCulled = false;				
			}
		} );	
		
		//console.log(meshCount); 
		
		x.cat = object; 
		
		const matr = [], 
			  url2 = 'obj/cat/1/mat/', 
			  frm = 'jpg', 
			  kolor = [0xffffff, 0xffeef4, 0xae2255, 0xffffff, 0xffffff, 0xffffff, 0xaaaaaa, 0xffeef4, 0xeeccbb, 0xffffff], 
			  raf = [1, .5, 0, 0, 1, 1, 1, .5, 1, 0];  
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.cat.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: raf[i], metalness: 0 } );
			//matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: 1, metalness: 0 } );
			//matr[i].wireframe = true; 

			//if (i==0) {
			//	matr[i].wireframe = false; 
			//	
			//	matr[i].envMapIntensity = 6; 
			//	//matr[i].envMap = x.skybox; 				
			//	matr[i].envMap = scene.background; 				
			//}
			
			if ((i==0) || (i==6)) {
				matr[i].wireframe = true; 
			}
			
			x.cat.children[i].material = matr[i]; 
		}
		
		//x.cat.scale.set(5.5, 5.5, 5.5); 
		x.cat.position.set(0, 20, 0);
		//x.cat.rotation.set(Math.PI/-2, 0, 0);
		scene.add(x.cat); 

		// 0 - clothes  1 - body  2 - iris  3 - iris specular  4 -  5 - teeth  6 - brows  7 - head  8 - clothes2  9 - pupil
		
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
			  loader10 = new THREE.TextureLoader();    

		loader0.load( url2 + 'clothes.jpg', function(tx0) { 	
			matr[0].map = tx0; 
			matr[0].needsUpdate = true; 
			     
			matr[0].wireframe = false; 	
			
			//fadeScene(); 
		});  
		
		//loader1.load( url2 + 'body.jpg', function(tx1) { 	
		//	//matr[1].map = tx1; 
		//	matr[1].needsUpdate = true; 
		//	     
		//	matr[1].wireframe = false; 	
		//});  
		//
		//loader2.load( url2 + 'pupil2.jpg', function(tx2) { 	
		//	//matr[2].map = tx2; 
		//	matr[2].needsUpdate = true; 
		//	     
		//	matr[2].wireframe = false; 	
		//	//matr[9].transparent = true; 	
		//	//matr[9].opacity = 0; 			
		//	//matr[9].wireframe = false; 			
		//});  
		//
		//loader3.load( url2 + 'pupil.jpg', function(tx3) { 	
		//	//matr[3].map = tx3; 
		//	matr[3].needsUpdate = true; 
		//	matr[3].wireframe = false; 	
		//});  
		//
		//loader4.load( url2 + 'pupil.jpg', function(tx4) { 	
		//	//matr[4].map = tx4; 
		//	matr[4].needsUpdate = true; 
		//	matr[4].wireframe = false; 	
		//});  
		//
		//loader5.load( url2 + 'pupil.jpg', function(tx5) { 	
		//	//matr[5].map = tx5; 
		//	matr[5].needsUpdate = true; 
		//	matr[5].wireframe = false; 	
		//});  
		
		loader6.load( url2 + 'brow.jpg', function(tx6) { 	
			matr[6].map = tx6; 
			matr[6].needsUpdate = true; 
			matr[6].wireframe = false; 	
		});  
		
		//loader7.load( url2 + 'head.jpg', function(tx7) { 	
		//	//matr[7].map = tx7; 
		//	matr[7].needsUpdate = true; 
		//	matr[7].wireframe = false; 	
		//});  
		//
		//loader8.load( url2 + 'clothes2.jpg', function(tx8) { 	
		//	//matr[8].map = tx8; 
		//	matr[8].needsUpdate = true; 
		//	matr[8].wireframe = false; 	
		//});  
		//
		//loader9.load( url2 + 'pupil.jpg', function(tx9) { 	
		//	//matr[9].map = tx9; 
		//	matr[9].needsUpdate = true; 
		//	matr[9].wireframe = false; 	
		//});  
		
		loader1.load( url2 + 'clothesn.jpg', function(tx10) { 	
			matr[0].normalMap = tx10; 
			matr[0].needsUpdate = true; 
		});  		

	
		anim8(); 
		
		//fadeScene(); 	
		
		//x.cat.visible = false; 
	} );
}

function anim8() {
	x.actions = []; 
	
	//let url = 'alien/0/lookingaround'; 	
	//let url = 'alien/0/breathingidle'; 	
//	let url = 'alien/0/offensiveidle'; 	
	let url = 'cat/1/Sitting'; 	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.cat );
		//console.log( object );
		
	//	x.cat.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.cat.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//x.actions[0].weight = 1;
		mixer.update( 0 );	
		
		//console.log(x.cat.animations[ 0 ]);
		
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
		//let url = 'crescent-moon-173121'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bdrm'; 
		//let url = 'ufo'; 
		//let url = 'nghtcty'; 		
		//let url = 'bah2'; 		
		//let url = 'wndrr'; 		
		//let url = 'crscntmn'; 		
		let url = 'mnct'; 		
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
			x.sound.setVolume( 1.0 ); 
			//x.sound.setVolume( 0.9 ); 
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
	
	