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
	kontainer.style.background = "url('img/nightcityl.jpg') center top no-repeat"; 
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
	_.ej[5] = 12;			//70 or 35
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true; 
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	renderer.toneMapping = THREE.NeutralToneMapping;
	renderer.toneMappingExposure = 1.5;		
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

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 5000 );
	camera.position.set(0, _.ej[5], 100); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	x.camTarget = new THREE.Object3D(); 
	x.camTarget.position.set(0, 0, 0); 
	x.camGrup.add(x.camTarget);	
	
	scene.add( new THREE.AmbientLight( 0x888888 ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 3000, 400, Math.PI/7, 1 );
	x.spotLight[0].position.set( -20, 300, -50 );
//	x.spotLight[0].castShadow = true; 
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width = 1024;
	//x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 400;
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
	
	x.ptlight = []; 
	
	x.ptlight[0] = new THREE.PointLight( 0x88eeff, 200, 50 ); 
	x.ptlight[0].position.set(0, 0, 60); 
	grups[0].add( x.ptlight[0] ); 
	
	x.ptlight[1] = new THREE.PointLight( 0xee2293, 200, 50 ); 
	x.ptlight[1].position.set(0, 0, -60); 
	grups[0].add( x.ptlight[1] ); 
	
	scene.add( grups[0] ); 
	
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
    controls.autoRotate = true;    
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
	//x.target0.position.set(0, -4, 0); 
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
	//const f = '.png'; 
	const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/11/' );

	loader.load( [
		'posx'+f, 'negx'+f,
	//	'posy'+f, 'negy'+f,
		'negy'+f, 'posy'+f,
		'posz'+f, 'negz'+f
		//'left'+f, 'right'+f,
		//'top'+f, 'bottom'+f,
		//'back'+f, 'front'+f		
	], function ( tx ) {
		tx.flipY = true; 
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		//scene.backgroundRotation.set(0, Math.PI/4, 0); 
		scene.backgroundBlurriness = .4; 
		//scene.backgroundIntensity = .75; 		
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addCity(); 
		
		//fadeScene(); 
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

function addCity() {
	let meshCount = 0; 
	x.city = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/city/0/city2.obj', function ( object ) {
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

		//x.city = object; 
		
		const matr = [], 
			  url2 = 'obj/city/0/mat/', 
			  //url2 = 'obj/city/0/', 
			  frm = 'jpg'; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .15, metalness: .35 } );
			matr[i].wireframe = true; 
			//matr[i].shadowSide = 2; 
			//matr[i].transparent = true; 
			
			matr[i].envMapIntensity = 2; 
			matr[i].envMap = x.skybox; 
			
			x.city[i] = new THREE.Mesh( object.children[i].geometry, matr[i] ); 
			//x.city[i].scale.set(3, 3, 3); 
			//x.city[i].position.set(0, -50, 0);
			//x.city[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI*2);			
			//x.city[i].rotation.set(Math.PI/-2, 0, 0);			
			
			//if (i==0) {
			//	matr[i].metalness = .15; 
			//	x.city[i].receiveShadow = true; 
			//} else {
			//	matr[i].alphaTest = .5; 
			//	x.city[i].castShadow = true; 
			//}
			
			//x.city.children[i].material = matr[i]; 
			
			scene.add(x.city[i]); 			 
		}
		
		
		const loader0 = new THREE.TextureLoader(),   
			  loader1 = new THREE.TextureLoader(),   
			  loader2 = new THREE.TextureLoader(),   
			  loader3 = new THREE.TextureLoader();    
			  //loader4 = new THREE.TextureLoader();    

		//loader0.load( 'obj/city/0/RGB_63904501221e47598f255c84b9a94a71_Block_base_lightmap-emission.png', function(tx0) { 	
		loader0.load( url2 + 'coloremissive.jpg', function(tx0) { 	
			matr[0].map = matr[0].emissiveMap = tx0; 
			matr[0].emissive.setHex(0xf7eeff); 
			matr[0].needsUpdate = true; 
			     
			matr[0].wireframe = false; 	
			
			//addUFO(); 
			fadeScene(); 
		});  
		
		loader1.load( url2 + 'normal0.jpg', function(tx1) { 	
			matr[0].normalScale.set(.5, .5); 
			matr[0].normalMap = tx1; 
			matr[0].needsUpdate = true; 
		});  
		
		loader2.load( url2 + 'rough0.jpg', function(tx2) { 	
			matr[0].roughnessMap = tx2; 
			matr[0].needsUpdate = true; 
		});  
		
		loader3.load( url2 + 'light0.jpg', function(tx3) { 	
			matr[0].lightMapIntensity = .5; 
			matr[0].lightMap = tx3; 
			matr[0].needsUpdate = true; 
		});  

		//loader4.load( 'img/opac2t.jpg', function(tx4) { 	
		//	matr[0].alphaMap = tx4; 
		//	matr[0].needsUpdate = true; 
		//});  


		
	}); 
	
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
	//	camera.rotation.set(0, Math.PI/20, 0); 
		camera.rotation.set(0, Math.PI/12, 0); 
	}
	
	camera.position.set(0, _.ej[5], 100); 
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
		
/*		const delta = clock.getDelta() * .5; 
		//if ( mixer ) 
		mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
*/
		
		const mSin5 = timer/2; 
		
		if (!x.rotCam) {
			if (isMobil) {
				camera.position.y = Math.abs(Math.sin(mSin5) * 2) * 10 + 7; 
				camera.position.z = 100 - Math.abs(Math.sin(mSin5) * 2) * 40; 
				x.camGrup.rotation.y = Math.sin(timer/3) * Math.PI; 				
			} else {
				//const ptY = _.pointer.y * Math.PI/-3.5, 
				//	  ptX = _.pointer.x * Math.PI;  
				
				camera.position.y = (_.pointer.y + 1) * 10 + 7; 
				camera.position.z = 100 - (_.pointer.y + 1) * 40; 
				x.camGrup.rotateY( (_.pointer.x * .005) % Math.PI ); 
			}
		} else {	
			camera.position.y = Math.abs(Math.sin(mSin5) * 2) * 4 + 6; 
			camera.position.z = 100 - Math.abs(Math.sin(mSin5)) * 50; 
			x.camGrup.rotateY( -.002 % Math.PI ); 			
		}
	

		//const mSin5 = timer/1; 
		
		//grups[0].rotation.set(0, Math.sin(timer) * Math.PI*2, 0);
		if ( Math.random() < .1 ) grups[0].rotation.set(0, Math.random() * Math.PI*2, 0);
		//console.log(_.idleTimer % 1); 
		
		
		if (x.sound) {
			if (x.sound.isPlaying) {
				const data = x.analyser.getAverageFrequency();  
				//console.log(data); 
				
				//x.city[0].material.emissiveIntensity = Math.random() + .01; 
				//x.city[0].material.emissiveIntensity = Math.abs(Math.sin(timer*2)); 
				
				let data3 = (data/88); 
				
				if (data3 < .4) {
					data3 *= .6; 
				} else if (data3 > .6) {
					data3 *= 1.4; 
				}
				
				if (data3 > 0) { 
					x.city[0].material.emissiveIntensity = data3; 
				} else {
					x.city[0].material.emissiveIntensity = 0; 
				}
				
				//if ((data3 > .4) && (data3 < .6)) console.log(data3); 				
				//if (data3 > .6) console.log(data3); 				
			} else {
				x.city[0].material.emissiveIntensity = 1; 
			}
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

	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
}

/*
function animAlien() {
	let meshCount = 0; 
	let url = 'alien/0/alien';  
	
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
		
		x.alien = object; 
		
		const matr = [], 
			  url2 = 'obj/alien/0/mat/', 
			  frm = 'jpg', 
			  kolor = [0x555555, 0xffffff], 
			  raf = [0, .5];  
		
		for ( let i = 0; i < meshCount; i++ ) {	
			//x.alien.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: raf[i], metalness: 0 } );
			matr[i].wireframe = true; 

			if (i==0) {
				matr[i].wireframe = false; 
				
				matr[i].envMapIntensity = 3; 
				matr[i].envMap = x.skybox; 				
			}
			
			x.alien.children[i].material = matr[i]; 
		}
		
		//x.alien.scale.set(5,5,5); 
		x.alien.position.set(.8, -5.33, 0);
		//x.alien.rotation.set(Math.PI/-2, 0, 0);
		scene.add(x.alien); 

		
		const loader0 = new THREE.TextureLoader(),   
			  loader1 = new THREE.TextureLoader(),   
			  loader2 = new THREE.TextureLoader(),   
			  loader3 = new THREE.TextureLoader(),   
			  loader4 = new THREE.TextureLoader(),   
			  loader5 = new THREE.TextureLoader(),    
			  loader6 = new THREE.TextureLoader();    

		loader0.load( url2 + 'color0.jpg', function(tx0) { 	
			matr[1].map = tx0; 
			matr[1].needsUpdate = true; 
			     
			matr[1].wireframe = false; 	
			
			//fadeScene(); 
		});  
		
		loader1.load( url2 + 'normal0.jpg', function(tx1) { 	
			matr[1].normalMap = tx1; 
			matr[1].needsUpdate = true; 
		});  		

		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	//let url = 'alien/0/lookingaround'; 	
	//let url = 'alien/0/breathingidle'; 	
	let url = 'alien/0/offensiveidle'; 	
	//let url = 'alien/0/wavehiphop'; 	
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.alien );
		//console.log( object );
		
	//	x.alien.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.alien.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//x.actions[0].weight = 1;
		mixer.update( 0 );	
		
		//console.log(x.alien.animations[ 0 ]);
		
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
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'test'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bdrm'; 
		//let url = 'ufo'; 
		let url = 'nghtcty'; 
	//	let url = '80x-deep-synthwave-203118'; 
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
	
	