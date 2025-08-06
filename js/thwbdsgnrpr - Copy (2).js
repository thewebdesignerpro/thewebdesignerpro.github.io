/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
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
	
	kontainer.style.background = "url('img/thewebdesignerprol.jpg') center top no-repeat"; 
	//kontainer.style.background = "url('img/earthl.jpg') center top no-repeat"; 
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
//	ui.onAud = $('onAud'); 
//	ui.offAud = $('offAud'); 
	
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
	
//    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
//    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    

    //ui.kontainer.style.opacity = 0;		
    ui.kontainer.style.backgroundColor = '#000000';		

	const fogCol = 0x000000; 
//	const fogCol = 0x707476; 

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
//	scene.fog = new THREE.FogExp2(fogCol, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 20000 );
//	camera.position.set(0, _.ej[5], -100); 
	camera.position.set(0, 0, 1280); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x333333 ) );	

/*	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 100000000, 10000, Math.PI/3.5, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	//x.spotLight[0].position.set( -3000, 200, 0 );
	x.spotLight[0].position.set( -5000, 0, 0 );
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

	const directionalLight = new THREE.DirectionalLight( 0xfffcf2, 4 );
	//const directionalLight = new THREE.DirectionalLight( 0xffffff, 5 );
	directionalLight.position.set( -1, 0, 0 );
	scene.add( directionalLight );

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	
//	x.camGrup.position.set(0, 0, _.ej[3]); 
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
	
	//const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
	//scene.add( helper );	
	
	//const helper = new THREE.CameraHelper( dirLight.shadow.camera );
	//const helper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helper );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
/*	
	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    controls.autoRotate = false;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 9000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .3;
    controls.zoomSpeed = 5;
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
	
	x.targetO = new THREE.Object3D(); 
//	x.targetO.position.set(0, florY+160, x.camGrup.position.z - 300); 
//	x.targetO.position.set(0, 0, x.camGrup.position.z + 20); 
//	scene.add(x.targetO);
	
//	x.spotLight[0].target = x.targetO; 
	
	x.target1 = new THREE.Object3D(); 
//	x.target1.position.set(0, 50, x.camGrup.position.z); 
//	x.target1.position.set(0, 0, x.camGrup.position.z); 
	x.target1.position.set(-200, 0, x.camGrup.position.z); 
	scene.add(x.target1);
	
	//camera.position.y = 80; 
	//camera.lookAt(x.target1.position);
	
//	x.spotLight[1].target = x.target1; 
	
//	controls.target = x.target1.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	//const helper = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helper );
	
	addSkybox(); 
//	addAsteroids(); 
//	addClouds(); 
	//addFog(); 	
	//addBusStop(); 
//	addGround(); 
//	addWall(); 
//	addSidewalk(); 
//	addTrash(); 
//	addHydrant(); 
//	addDrain(); 
//	addManhole(); 
//	addNaut(); 
	//addTrees(); 
	//addLamps(); 
	
	//animFBX(); 
	
	//addAud(); 

//	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

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

		//fadeScene(); 
		
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
		//addSun(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

function addEarth() {
	//const geometry = new THREE.SphereGeometry( 400, 56, 28 ); 
	const geometry = new THREE.SphereGeometry( 400, 80, 40 ); 
	//const geometry = new THREE.SphereGeometry( 400, 2000, 1000 ); 
	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0xbebebe, roughness: .6 } ); 
	//material.transparent = true; 
	//material.wireframe = true; 
	//material.envMapIntensity = 1; 
	//material.envMap = x.skybox; 	
	
	x.Earth = new THREE.Mesh( geometry, material ); 
	x.Earth.position.set(300, 0, 0); 
	//x.Earth.rotation.set(Math.PI/-2, 0, Math.PI/-2); 
	
	//x.Earth.castShadow = x.Earth.receiveShadow = true; 
	//x.Earth.receiveShadow = true; 
	
	//scene.add( x.Earth );
	grups[0].add( x.Earth );
	
	scene.add(grups[0]); 
	
	//const geometry2 = new THREE.CircleGeometry( 440, 48 ); 
	const geometry2 = new THREE.PlaneGeometry( 950, 950 ); 
	const material2 = new THREE.MeshBasicMaterial( { color: 0xaad5ff, transparent: true, opacity: 0 } ); 
	material2.depthWrite = false; 
	//material2.blending = THREE.AdditiveBlending; 
	x.mGlow = new THREE.Mesh( geometry2, material2 ); 
	x.mGlow.position.set(250, 0, 0); 
	grups[0].add( x.mGlow );
	
	const geometry3 = new THREE.SphereGeometry( 402.8, 80, 40 ); 
	const material3 = new THREE.MeshStandardMaterial( { color: 0xffffff, transparent: true, opacity: 0 } ); 
	material3.depthWrite = false; 
	x.Clouds = new THREE.Mesh( geometry3, material3 ); 
	x.Clouds.position.set(300, 0, 0); 
	//x.Clouds.castShadow = true; 
	grups[0].add( x.Clouds );
	
	//console.log(geometry2); 
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(), 
		load3 = new THREE.TextureLoader(), 
		load4 = new THREE.TextureLoader(), 
		load5 = new THREE.TextureLoader(); 
		
	//let kolorUrl = 'mars4kb'; 
	//if (isMobil) kolorUrl = 'mars3k';

	let cloudsUrl = 'clouds3k'; 
	if (isMobil) cloudsUrl = 'clouds2k';
		
	//console.log(kolorUrl);
		
	load1.load( 'img/earth/color4.jpg', function(tx) { 
	//load1.load( 'img/mars/mars4kb.jpg', function(tx) { 
	//load1.load( 'img/mars/' + kolorUrl + '.jpg', function(tx) { 
		x.Earth.material.map = tx; 
		x.Earth.material.needsUpdate = true; 
		
		addSun(); 
		
		//animFBX(); 
	}); 	

	load2.load( 'img/earth/emissive1.jpg', function(tx2) { 
		x.Earth.material.emissiveMap = tx2; 
		x.Earth.material.needsUpdate = true; 
	}); 	
	
	load3.load( 'img/earth/rough1.jpg', function(tx3) { 
	//load3.load( 'img/earth/rough2tmp.jpg', function(tx3) { 
		//x.Earth.material.displacementScale = 12; 
		//x.Earth.material.displacementMap = tx3; 
		x.Earth.material.roughnessMap = tx3; 
		x.Earth.material.needsUpdate = true; 
	}); 	
	
	load4.load( 'img/spotL3.jpg', function(tx4) { 
	//load4.load( 'img/pGlow3.png', function(tx4) { 
		x.mGlow.material.alphaMap = tx4; 
		x.mGlow.material.opacity = .73; 
		x.mGlow.material.needsUpdate = true; 
	}); 

	//load5.load( 'img/earth/clouds1.jpg', function(tx5) { 
	load5.load( 'img/earth/' + cloudsUrl + '.jpg', function(tx5) { 
		x.Clouds.material.alphaMap = tx5; 
		x.Clouds.material.opacity = 1; 
		x.Clouds.material.needsUpdate = true; 
	}); 	
	
}

function addMoon() {
	//const geometry = new THREE.SphereGeometry( 109, 44, 22 ); 
	const geometry = new THREE.SphereGeometry( 109, 38, 19 ); 
	//const geometry = new THREE.SphereGeometry( 400, 2000, 1000 ); 
	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5 } ); 
	//material.transparent = true; 
	//material.wireframe = true; 
	
	x.Moon = new THREE.Mesh( geometry, material ); 
	x.Moon.position.set(-500, 0, -400); 
	//x.Moon.position.set(-11656, 0, 0); 
	x.Moon.rotation.set(0, Math.PI/-4, 0); 
	
	//x.Moon.castShadow = x.Moon.receiveShadow = true; 
	
	grups[0].add( x.Moon );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	let kolorUrl = 'color2k'; 
	//let kolorUrl = 'color3k'; 
	//if (isMobil) kolorUrl = 'color2k';
		
	//load1.load( 'img/earth/color2.jpg', function(tx) { 
	load1.load( 'img/earth/moon/' + kolorUrl + '.jpg', function(tx) { 
		x.Moon.material.map = tx; 
		x.Moon.material.needsUpdate = true; 
		
	}); 	

	load2.load( 'img/earth/moon/bump1.jpg', function(tx2) { 
		x.Moon.material.bumpScale = 1; 
		x.Moon.material.bumpMap = tx2; 
		//x.Moon.material.roughnessMap = tx2; 
		x.Moon.material.needsUpdate = true; 
	}); 	
	
}

function addSun() {
	const geometry = new THREE.PlaneGeometry( 3000, 3000 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 1 } ); 
	material.depthWrite = false; 
	//material.blending = THREE.AdditiveBlending; 
	x.Sun = new THREE.Mesh( geometry, material ); 
	x.Sun.position.set(-3000, 0, 0); 
	x.Sun.rotation.set(0, Math.PI/2, 0); 
	grups[0].add( x.Sun );
	
	const geometry2 = new THREE.PlaneGeometry( 10000, 10000 ); 
	const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: .4 } ); 
	material2.depthWrite = false; 
	//material2.blending = THREE.AdditiveBlending; 
	x.SunBg = new THREE.Mesh( geometry2, material2 ); 
	x.SunBg.position.set(-3000.1, 0, -100); 
	x.SunBg.rotation.set(0, Math.PI/2, 0); 
	grups[0].add( x.SunBg );
	
	let load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
		
	let sunUrl = 'color1'; 
	let sunUrl2 = 'alfa1'; 
	//if (isMobil) sunUrl = 'clouds2k';
		
	//console.log(kolorUrl);
		
	//load1.load( 'img/sun/color4.jpg', function(tx) { 
	load1.load( 'img/sun/' + sunUrl + '.jpg', function(tx) { 
		x.Sun.material.map = x.SunBg.material.map = tx; 
		x.Sun.material.needsUpdate = x.SunBg.material.needsUpdate = true; 
	}); 	

	load2.load( 'img/sun/' + sunUrl2 + '.jpg', function(tx2) { 
		x.Sun.material.alphaMap = x.SunBg.material.alphaMap = tx2; 
		x.Sun.material.needsUpdate = x.SunBg.material.needsUpdate = true; 
		
		fadeScene(); 
	}); 	
	
}

	
	
function fadeScene() {
//	onWindowResize(); 	
	
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
			//eL(window, 0, "wheel", wheelE); 
			
			x.camV3 = new THREE.Vector3(); 			
			
			animate();  
			
		//	theOptions(); 
		
			imgSRCs(); 
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
        }
    })();	
}	

function imgSRCs() {
	const aImgs = document.getElementsByClassName('lzy'), 
		  url = 'imj/folio082025/'; 
	
	for ( let i = 0; i < aImgs.length; i++ ) {	
	//	aImgs[i].attributes.src.value = url + (i+12) + '.jpg'; 
	
		aImgs[i].children[0].attributes.src.value = url + (i+12) + '.jpg'; 
	
		//console.log(aImgs[i].attributes.alt.value); 
	}
	
	console.log(aImgs[0].children[0].attributes.src.value); 
}

/*
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
*/

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

	//console.log(event); 
	
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
	
//	if (isMobil) {
//		if (_.width == _.prevW) {
//			_.width = _.prevH; 
//			_.height = _.prevW; 
//		}
//		
//		_.prevW = _.width; 
//		_.prevH = _.height; 		
//	}
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
	//console.log(_.width + ' '); 
	//console.log(_.height); 
	
//    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
//    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	

	x.xx = 400; 
	
	if (_.width > _.height) {
		//cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
		if (isMobil) x.xx = 800; 
		
		x.target1.position.x = -200; 
	} else {
		//cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		if (isMobil) x.xx = 1100; 
		
		x.target1.position.x = 0; 
	}		
	
	
	_.idleTimer = 0; 
}





function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		//const timer = Date.now() * 0.00008;
		//const timer = Date.now() * 0.00024;
		const timer = Date.now() * 0.0002; 
		//console.log(Math.cos(timer)); 
		
	//	const delta = clock.getDelta() * .3;
	//	if ( mixer ) 
	//	mixer.update( delta );	
		//console.log(delta);
		
		//x.actions[0].weight = Math.abs(Math.sin(timer*5));
		//mixer.update( 0 );	
		
		//x.actions[0].weight = Math.cos(timer);
		

		//camera.position.x = Math.cos(timer*2) * 1; 
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
		
		x.SunBg.material.opacity = x.camGrup.rotation.y; 
		
		//let rthRot = x.Earth.rotation.y + .0015; 
		let rthRot = x.Earth.rotation.y + .003; 
		if (rthRot >= (Math.PI*2)) rthRot %= Math.PI*2; 
		x.Earth.rotation.y = rthRot; 		

		let cldsRot = x.Clouds.rotation.y + .0045; 
		if (cldsRot >= (Math.PI*2)) cldsRot %= Math.PI*2; 		
		x.Clouds.rotation.y = cldsRot; 		


		//console.log(window.scrollTop); 
		
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
	//camera.lookAt(x.targetO.position);
	camera.lookAt(x.target1.position);
	//camera.lookAt(x.wall[0].position);
	
	//x.mGlow.lookAt(camera.position); 	
	
	x.mGlow.lookAt(camera.getWorldPosition(x.camV3)); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	renderer.render( scene, camera );	
}

/*
function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
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
		let url = 'rth'; 	
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
			x.sound.setVolume( 1.0 );
			//x.sound.setVolume( 0.7 );
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
	}
	
}
*/
	
	