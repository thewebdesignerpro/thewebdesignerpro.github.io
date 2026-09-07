/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { Water } from 'three/addons/objects/Water.js';
//import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'; 

//import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

//import { gsap } from "gsap";
//import { ScrollTrigger } from "gsap/ScrollTrigger";
//// ScrollSmoother requires ScrollTrigger
//import { ScrollSmoother } from "gsap/ScrollSmoother";

//import Lenis from 'lenis'; 

const idleTO = 120, florY = -1, ceilY = 140;  

let camera, scene, renderer, clock; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = 0;  

const ui = {}, _ = {}, x = {}; 

let brainTex; 

const uniforms = {
	u_time: {type: 'f', value: 0.0},
	u_frequency: {type: 'f', value: 0.0},
	uTexture: { value: brainTex } // Pass texture as a uniform
}


// TEMP START
let stats;

stats = new Stats();
ui.stats = document.getElementById('stats'); 
ui.stats.appendChild( stats.dom );
//document.body.appendChild( stats.dom );

// TEMP END


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
	
	kontainer.style.background = "url('img/spheretecl.jpg') center top no-repeat"; 
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

	//window.scrollY = window.pageYOffset = document.documentElement.scrollTop = document.body.scrollTop = 0; 
	//ui.content.scrollTop = 0; 
	//window.scrollTo(0, 0); 
	//ui.content.scrollTo(0, 0); 	
	
	_.checkPt = []; 
	_.flyIn = true; 
	_.scrollTop = _.prevScrollTop = 0; 
	
	
	/* Lenis start */
	
	const lenis = new Lenis({ autoRaf: true, autoToggle: true, anchors: true, allowNestedScroll: true, naiveDimensions: true, stopInertiaOnNavigate: true }); 

	//const lenis = new Lenis({
	//	autoRaf: true,
	//}); 
	
	//const lenis = new Lenis(); 
	
	// Listen for the scroll event and log the event data
	lenis.on('scroll', (e) => {
		//console.log(e.direction);
		
		_.flyIn = (e.direction == 1) ? true : false; 
		_.scrollTop = e.scroll; 
		
	});	


	/* Lenis end */	
	
		
	ui.kontainer = $('kontainer'); 
//	ui.content = $('content'); 
	ui.content = $('smooth-content'); 
	
	//ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.swtchKam.style.visibility = "hidden"; 
	
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
    //document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
    ui.kontainer.style.height = _.height + 'px';    

    //ui.kontainer.style.opacity = 0;		
    ui.kontainer.style.backgroundColor = '#000000';		

	const fogCol = 0x000000; 

	
	_.camPosZ = 20; 
	

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = false;
//	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
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
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .1, 10000 ); 
	camera.position.set(0, 0, _.camPosZ); 

    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0xcdcdcd ) );	

	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 20000, 100, Math.PI/8, 1 );
	x.spotLight[0].position.set( -30, 30, 40 );
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 100;
	x.spotLight[0].shadow.camera.fov = 50;
	
	scene.add( x.spotLight[0] );	
	
	scene.add(x.camGrup); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	eL(window, 0, "mousemove", onMouseMove); 
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	_.mouse = new THREE.Vector2(); 	
	_.entro = true; 
	_.idleTimer = 0; 
	_.fokus = true; 
	
	_.pointer = new THREE.Vector2();
	_.ptrDown = false; 

	x.target0 = new THREE.Object3D(); 
	x.target0.position.set(0, 0, 0); 
	scene.add(x.target0);
	
	//x.target1 = new THREE.Object3D(); 
	//x.target1.position.set(0, 0, 500); 
	//scene.add(x.target1);
	
	//x.spotLight[0].target = x.target1; 

	//x.rotCam = false; 
	

	
	initBloom(); 
	
	

	//fadeScene(); 
	
	onWindowResize(); 
	
}

function initBloom() {
	const renderScene = new RenderPass(scene, camera);
	
	//const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(_.width, _.height));
	bloomPass.threshold = .45; 
	bloomPass.strength = 3.;
	bloomPass.radius = 1.;
	
	_.bloomComposer = new EffectComposer(renderer);
	_.bloomComposer.addPass(renderScene);
	_.bloomComposer.addPass(bloomPass);
	
	const outputPass = new OutputPass();
	_.bloomComposer.addPass(outputPass);	
	
	addStars(); 
	
}

function addStars() {
	
	//const geometry = new THREE.PlaneGeometry( 35500, 17750 );
	//const geometry = new THREE.PlaneGeometry( 350, 175 );
	const geometry = new THREE.PlaneGeometry( 400, 200 );
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	
	x.stars = new THREE.Mesh( geometry, material );
	//x.stars.position.z = -5000;
	x.stars.position.z = -60;

	grups[1].add( x.stars );
	//scene.add( grups[1] );

	const geometry2 = new THREE.PlaneGeometry( 350, 175 );
	const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	
	const dummyP = new THREE.Mesh( geometry2, material2 );
	dummyP.position.z = 60;
	dummyP.visible = false; 
	
	grups[1].add( dummyP );
	scene.add( grups[1] );

	
	const loader = new THREE.TextureLoader(), 
		  url2 = 'img/', 
		  fileName = 'milkyway2k', 
		  frmt = '.jpg'; 
		  
	//let fileName = 'milkyway2k'; 
	//	  
	//switch (true) {
	//	case (_.width > 1440):
	//		fileName = 'milkyway2k'; 
	//		console.log('2k');
	//		break;
	//	case (_.width > 1024): 
	//		fileName = 'milkyway1k'; 
	//		console.log('1k');
	//		break;
	//	default:
	//		
	//}
	
	loader.load( url2 + fileName + frmt, function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		////tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(2, 2);    
	
		x.stars.material.map = tx; 
		x.stars.material.needsUpdate = true; 
		
		x.stars.material.wireframe = false; 
	});  	
	
	//addRocks(); 
	addSphere(); 
}

function addRocks() {
	
	let meshCount = 0; 
	x.rocks = []; 

	const loader = new OBJLoader();
	
	loader.load( 'models/rock.obj', function ( object ) {
		
		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
	
				child.geometry.computeBoundingBox();		
					
				meshCount += 1; 
			}
			
		});	
		
		//console.log(meshCount); 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0x777777 } ), 
			  posX = [-1, 1],  
			  //posZ = [],  
			  rotY = [Math.PI/2, Math.PI/-2];
		
		//matr.transparent = true; 
		//matr.wireframe = true; 
		
		for ( let i = 0; i < 2; i++ ) {	
		
			x.rocks[i] = new THREE.Mesh( geom, matr );
			
			x.rocks[i].scale.set(.16, .12, .16); 
			x.rocks[i].position.set(posX[i], 3.8, 0);
		//	x.rocks[i].position.set(posX[i], 0, 10);
			x.rocks[i].rotation.set(0, rotY[i], 0);
			
			grups[0].add(x.rocks[i]); 
			
		}
		

		
		addSphere();

	}); 
	
}	

function addSphere() {
	//const geometry = new THREE.IcosahedronGeometry(5, 30 );
	const geometry = new THREE.SphereGeometry(5, 320, 160, 0, Math.PI*2, Math.PI*.028, Math.PI-(Math.PI*.056));

	const material = new THREE.MeshStandardMaterial({ color: 0x0055dd, wireframe: true }); 
	material.transparent = true; 
	//material.opacity = .5; 
	
	x.sphere = new THREE.Mesh(geometry, material);
	grups[0].add(x.sphere);
	scene.add( grups[0] );

	//x.sphere.position.z = 14.8;
	//x.sphere.position.z = 5.;
	
	//console.log(x.sphere.geometry.attributes.position);	
	
	//const geometry2 = new THREE.IcosahedronGeometry(4.8, 25 ); 
	const geometry2 = new THREE.SphereGeometry(4.8, 240, 120, 0, Math.PI*2, Math.PI*.028, Math.PI-(Math.PI*.056));
	const material2 = new THREE.MeshLambertMaterial({ color: 0x000000, wireframe: true }); 
	//const material2 = new THREE.MeshLambertMaterial({ color: 0x7090c0, wireframe: true }); 
	//material2.side = 1; 
	
	x.sphere2 = new THREE.Mesh(geometry2, material2);
	grups[0].add(x.sphere2);
	//scene.add( grups[0] );

	//x.sphere.position.z = 14.8;
	//x.sphere.position.z = 5.;
	
	//console.log(x.sphere2.geometry.attributes.position);	
	//scene.remove( grups[0] );
	//scene.remove( grups[1] );
	
	
	const loader = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  loader3 = new THREE.TextureLoader(), 
		  loader4 = new THREE.TextureLoader(), 
		  loader5 = new THREE.TextureLoader(), 
		  url2 = 'img/test/', 
		  fileName = 'test1', 
		  fileName1 = 'test1_rough', 
		  fileName2 = 'test1_alpha', 
		  fileName3 = 'test1_glow', 
		  fileName4 = 'test1_disp', 
		  fileName5 = 'test1_metal', 
		  frmt = '.jpg'; 
	
	loader.load( url2 + fileName + frmt, function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(8, 4);    	
	
		x.sphere.material.map = tx; 
		x.sphere.material.color.set(0xffffff); 
		x.sphere.material.needsUpdate = true; 
		
		x.sphere.material.wireframe = x.sphere2.material.wireframe = false; 
		
		//x.rocks[0].material.map = x.rocks[1].material.map = tx; 
		//x.rocks[0].material.color.set(0xffffff); 
		//x.rocks[1].material.color.set(0xffffff); 
		
		//fadeScene(); 
		addCone(); 
	});
	
	loader1.load( url2 + fileName1 + frmt, function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		//tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
		tx1.repeat.set(8, 4);    	
	
		x.sphere.material.roughnessMap = tx1; 
		x.sphere.material.needsUpdate = true; 
	});
	
	loader2.load( url2 + fileName2 + frmt, function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(8, 4);    	
	
		x.sphere.material.alphaMap = tx2; 
		x.sphere.material.needsUpdate = true; 
	});
	
	//loader2.load( url2 + fileName2 + frmt, function(tx2) { 	
	//	tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
	//	//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx2.repeat.set(8, 4);    	
	//
	//	x.sphere.material.normalScale.set(1.5, 1.5); 
	//	x.sphere.material.normalMap = tx2; 
	//	x.sphere.material.needsUpdate = true; 
	//});
	
	//loader2.load( url2 + fileName2 + frmt, function(tx2) { 	
	//	tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
	//	//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx2.repeat.set(8, 4);    	
	//
	//	x.sphere.material.bumpScale = 30; 
	//	x.sphere.material.bumpMap = tx2; 
	//	x.sphere.material.needsUpdate = true; 
	//});
	
	//loader3.load( url2 + fileName3 + frmt, function(tx3) { 	
	//	tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
	//	//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx3.repeat.set(8, 4);    	
	//
	//	x.sphere.material.aoMapIntensity = 1; 
	//	x.sphere.material.aoMap = tx3; 
	//	x.sphere.material.needsUpdate = true; 
	//});
	
	loader3.load( url2 + fileName3 + frmt, function(tx3) { 	
		//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(2, 1);    	
		
		tx3.colorSpace = THREE.SRGBColorSpace;
	
		x.sphere2.material.emissive.set(0x7090c0); 
		x.sphere2.material.emissiveMap = tx3; 
		x.sphere2.material.needsUpdate = true; 
	});
	
	loader4.load( url2 + fileName4 + frmt, function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(8, 4);    	
	
		x.sphere.material.bumpScale = 13; 
		x.sphere.material.bumpMap = tx4; 
		
		//x.sphere.material.displacementScale = 2.5; 
		x.sphere.material.displacementMap = tx4; 
		x.sphere.material.needsUpdate = true; 		
		
		x.sphere2.material.displacementScale = .9; 
		x.sphere2.material.displacementMap = tx4; 
		x.sphere2.material.needsUpdate = true; 
	});
	
	loader5.load( url2 + fileName5 + frmt, function(tx5) { 	
		tx5.wrapS = tx5.wrapT = THREE.RepeatWrapping;    
		//tx5.wrapS = tx5.wrapT = THREE.MirroredRepeatWrapping;    
		tx5.repeat.set(8, 4);    	
	
		x.sphere.material.metalness = 1; 
		x.sphere.material.metalnessMap = tx5; 
		x.sphere.material.needsUpdate = true; 
	});
	
	//addCone(); 
}

function addCone() {
	const geometry = new THREE.ConeGeometry( .95, 4, 10, 1, true );
	const material = new THREE.MeshBasicMaterial( { color: 0xaad0f4, transparent: true, opacity: 0, side: 2 } );
	
	x.cone = new THREE.Mesh(geometry, material );
	x.cone.position.y = 5.5; 
	x.cone.rotation.x = Math.PI; 
	
	grups[0].add( x.cone );	
	
	const loader = new THREE.TextureLoader(), 
		  url2 = 'img/test/', 
		  fileName = 'cone_alpha', 
		  frmt = '.png'; 
		  
	loader.load( url2 + fileName + frmt, function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(2, 1);  
	
		x.cone.material.alphaMap = tx; 
		x.cone.material.needsUpdate = true; 
		
		fadeScene(); 
	});	  
}

	
function fadeScene() {
	
	onWindowResize(); 	
	
    (function fadeIn() {
		
		let val = parseFloat(ui.fader.style.opacity); 
		
		if (!((val -= .05) < 0)) {
 			ui.fader.style.opacity = val;
            
			requestAnimationFrame(fadeIn); 
			
        } else {
			
 			ui.fader.style.opacity = 0;
            ui.fader.style.display = "none";
			ui.fader.parentNode.removeChild(ui.fader);	
			
			onWindowResize(); 			
			
			eL(ui.kontainer, 0, 'pointerdown', onPointerDown); 
			eL(ui.kontainer, 0, "pointermove", onPointerMove); 
			
			//x.camV3 = new THREE.Vector3(); 			

			
			animate();  
			
			theOptions(); 
			
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			
        }
		
    })();	
	
}	

function theOptions() {
	
	//ui.swtchKam.style.visibility = "visible"; 	
	
	if (isMobil) {
		
		//eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
		
	} else {
		
		//eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);	
		
	}	 
	
}

//function swtchKamClick(event) {	
//
//    if (event) event.preventDefault(); 
//	
//	x.rotCam = !x.rotCam;  
//	
//	x.camGrup.rotation.set(0, 0, 0);  
//	camera.position.x = 0; 
//	
//	_.idleTimer = 0; 
//	
//}

function audClick(event) {
	
    if (event) event.preventDefault(); 

	if (x.sound) {
		
		if (x.sound.isPlaying) {
			
			cL(ui.offAud, 0, "noneIt2");
			cL(ui.onAud, 1, "noneIt2");

			x.sound.pause(); 

		} else {
			
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");			

			x.sound.play(); 

		}
		
	} else {
		
		addAud(); 

	}

	_.idleTimer = 0; 
	
}

function onMouseMove( event ) {
	
   // if (event) event.preventDefault();

	let mouse = {}; 
	
	if (event.clientX) {
		
		mouse.x = ( event.clientX - _.widthH ) / 60;   
		mouse.y = ( event.clientY - _.heightH ) / 60; 	
		
	} else {
		
		mouse.x = ( event.x - _.widthH ) / 60; 
		mouse.y = ( event.y - _.heightH ) / 60; 
		
	}
	
	mouseX = mouse.x;
	mouseY = mouse.y; 	
	
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

	_.idleTimer = 0;
	
}	

function onWindowResize() {
	
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    
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
    //document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
    ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	
	
	_.bloomComposer.setSize(_.width, _.height); 

	//_.camPosZ = 20; 
	
	if (_.width > _.height) {

		x.stars.rotation.z = 0; 
	
		_.camPosZ = 20;
		//_.camPosZ = (_.width / _.height) * 10;
		
		_.grups0Rot = 44 / _.camPosZ; 
		
	} else {

		x.stars.rotation.z = Math.PI/-2; 
	
		_.camPosZ = 30; 
		//_.camPosZ = (_.height / _.width) * 15;
		
		_.grups0Rot = 58 / _.camPosZ; 
	}		
	
	_.scrollPtr = Math.round(ui.content.offsetHeight / _.camPosZ); 
	
	//console.log(ui.content.offsetHeight); 
	
	_.checkPt[0] = Math.round(ui.content.offsetHeight * .25); 
	_.checkPt[1] = Math.round(ui.content.offsetHeight * .4); 
	_.checkPt[2] = Math.round(ui.content.offsetHeight * .55); 
	_.checkPt[3] = Math.round(ui.content.offsetHeight * .85); 
	_.checkPt[4] = Math.round(ui.content.offsetHeight * .5); 
	_.checkPt[5] = Math.round(ui.content.offsetHeight * .6); 
	
	//console.log(_.height);
	
	_.idleTimer = 0; 
	
}

function addAud() {
	
	if (!x.sound) {
		
		let url = 'mntn'; 			
		url += '.mp3'; 	

		const listener = new THREE.AudioListener();
		camera.add( listener );
		
		x.sound = new THREE.Audio( listener );
		
		const audioLoader = new THREE.AudioLoader();
		
		audioLoader.load( 'aud/' + url, function( buffer ) {
		
			x.sound.setBuffer( buffer );
			x.sound.setLoop( true );
			x.sound.setVolume( 1.0 );

			x.sound.play(); 
			
			x.analyser = new THREE.AudioAnalyser( x.sound, 32 );

			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
			
		}); 
	
	}
	
}

function animate() { 

	//requestAnimationFrame(animate); 

	if (_.idleTimer < idleTO) {
		
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		
		// Best approach for modern development
	//	const _.scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		//console.log(_.scrollTop); // Outputs the exact pixels scrolled from the top
	//	_.flyIn = (_.prevScrollTop > _.scrollTop) ? false : true; 
		

		grups[0].rotation.y = timer * .1;
		//x.sphere2.rotation.y = timer * .1;
		
	//	camera.position.x += (mouseX - camera.position.x) * .5;
	//	camera.position.y += (-mouseY - camera.position.y) * .5;
		
		camera.position.z = _.camPosZ - _.scrollTop / _.scrollPtr; 
		
		const grupsRotX = (_.scrollTop / ui.content.offsetHeight) * _.grups0Rot; 
		
		if (grupsRotX <= (Math.PI/2)) {
			grups[0].rotation.x = grupsRotX; 
			grups[1].rotation.x = grupsRotX / 3; 
		
			//console.log(grups[0].rotation.x); 
		}
	
		if (_.prevScrollTop != _.scrollTop) {
			
		//	if (_.scrollTop > _.checkPt[2]) {
		//		const dspScl = x.sphere.material.displacementScale + .03; 
		//		
		//		//dspScl = (_.flyIn) ? (dspScl + .03) : (dspScl - .03); 
		//		//console.log(dspScl);
		//		
		//		//if ((dspScl < 3.5) && (dspScl >= 1)) {
		//		if (dspScl < 3.5) {
		//			x.sphere.material.displacementScale = dspScl; 		
		//			//x.sphere2.material.displacementScale = dspScl - .3; 		
		//		}
		//	} else {
		//		const dspScl = x.sphere.material.displacementScale - .03; 
		//		
		//		//dspScl = (_.flyIn) ? (dspScl + .03) : (dspScl - .03); 
		//		//console.log(dspScl);
		//		
		//		if (dspScl >= 1) {
		//			x.sphere.material.displacementScale = dspScl; 		
		//			//x.sphere2.material.displacementScale = dspScl - .3; 		
		//		}				
		//	}
		//	
		//	if (_.scrollTop > _.checkPt[5]) {
		//		const opacSphr = x.sphere.material.opacity - .03; 
		//		
		//		//opacSphr = (_.flyIn) ? (opacSphr - .03) : (opacSphr + .03); 
		//		//console.log(opacSphr);
		//		
		//		if (opacSphr >= 0) {
		//			x.sphere.material.opacity = opacSphr; 
		//			x.sphere2.material.emissiveIntensity = opacSphr; 
		//		}
		//	} else {
		//		const opacSphr = x.sphere.material.opacity + .03; 
		//		
		//		//opacSphr = (_.flyIn) ? (opacSphr - .03) : (opacSphr + .03); 
		//		//console.log(opacSphr);
		//		
		//		if (opacSphr <= 1) {
		//			x.sphere.material.opacity = opacSphr; 
		//			x.sphere2.material.emissiveIntensity = opacSphr; 
		//		}				
		//	}
		
		}
		
		
		x.sphere2.material.emissiveMap.offset.x = Math.sin(timer*.5); 		
		x.sphere2.material.emissiveMap.offset.y = Math.cos(timer*.45); 		
		//x.sphere2.material.emissiveMap.offset.y = y0; 		
		//x.sphere2.material.alphaMap.offset.y = y1; 	
		
		const coneOpac = _.scrollTop / ui.content.offsetHeight * 1.7 - .3; 
		if ((coneOpac >= 0) && (coneOpac <= 1)) x.cone.material.opacity = coneOpac;

		//console.log(x.cone.material.opacity); 
		
		_.prevScrollTop = _.scrollTop;
		
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
	
	//lenis.raf(time); 
	
    requestAnimationFrame(animate); 	
	
}

function render() {
	//camera.lookAt(scene.position); 
	//renderer.render( scene, camera );	
	
	_.bloomComposer.render();
	
	stats.update(); 
}


	
	