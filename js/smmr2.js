/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import * as THREE from 'three2';
import WebGL from 'three/addons/capabilities/WebGL.js';
//import WebGPU from 'three/addons/capabilities/WebGPU.js';

//import { vec3, Fn, time, texture3D, screenUV, uniform, screenCoordinate, pass } from 'three/tsl'; 	// volume lite
import { reflector, uv, texture, color } from 'three/tsl'; 	// mirror

//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
//import { bayer16 } from 'three/addons/tsl/math/Bayer.js';
//import { gaussianBlur } from 'three/addons/tsl/display/GaussianBlurNode.js';
			
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import TWEEN from 'three/addons/libs/tween.module.js';

//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
//import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
//import { WaterMesh } from 'three/addons/objects/WaterMesh.js';	// gpu
//import { SkyMesh } from 'three/addons/objects/SkyMesh.js';	// gpu
//import { LensflareMesh, LensflareElement } from 'three/addons/objects/LensflareMesh.js';	// gpu
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


const idleTO = 120, florY = -50, ceilY = 140;  

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

let postProcessing, volumetricMesh, pointLight; 

//let domeClouds; 

// temp
//let controls; 

let isAvailable = ( typeof navigator !== 'undefined' && navigator.gpu !== undefined ); 

if ( ( WebGL.isWebGL2Available() ) && isAvailable ) {
//if ( WebGPU.isAvailable() ) { 
//if () {
	//console.log(isAvailable);
	
	//import * as THREE from 'three'; 
	//init();
	
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
} else {		
	//import * as THREE from 'three2'; 
	
	/*if ( WebGL.isWebGL2Available() ) {
		if (window.addEventListener) {
			window.addEventListener("load", initGL, false);
		} else if (window.attachEvent) {
			window.attachEvent("onload", initGL);
		} else {
			window.onload = initGL;
		}				
	} else {	*/
		//const warning = WebGL.getWebGL2ErrorMessage();
		//const warning = WebGPU.getErrorMessage();
		
		const warning = 'Your browser does not support <a href="https://gpuweb.github.io/gpuweb/" style="color:blue">WebGPU</a> yet';
				
		kontainer.appendChild(warning);	
		
		//kontainer.style.background = "url('img/thewebdesignerprol.jpg') center top no-repeat"; 
		kontainer.style.background = "url('img/summerl.jpg') center top no-repeat"; 
		kontainer.style.backgroundSize = "cover"; 
		
		fader.style.opacity = 0;
		fader.style.display = "none";
		fader.parentNode.removeChild(fader);	
		
		cL(loadr, 0, "paus");
		loadr.style.display = "none";	
		loadr.parentNode.removeChild(loadr);		
	//}
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
	//console.log('init');

	function $(id) {
		return document.getElementById(id);
	}	
		
	ui.kontainer = $('kontainer'); 
	
	//ui.colPick = $('colPick'); 
	//ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.colPick.style.visibility = "hidden"; 
	//ui.swtchKam.style.visibility = "hidden"; 
	
//	ui.fcp = $('fcp'); 	// colorpicker
	
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
    ui.kontainer.style.backgroundColor = '#404755';		

	const fogCol = 0x404755; 


	_.ej = []; 	
	
	_.ej[0] = 1500; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
//	_.ej[1] = -5; 			//front or back -1 or 1	
	_.ej[1] = 3; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = -1500; 			//2000 or 0 - camGrup pos z
	//_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 70;			//70 or 35	
	
	//x.xx = 400; 
	x.zz = 300; 


/*	
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
*/	
	
    scene = new THREE.Scene();
//	scene.fog = new THREE.FogExp2(fogCol, 0.0006);	
	//scene.fog = new THREE.FogExp2(0x535f37, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
	//grups[2] = new THREE.Group(); 

	scene.add(grups[0]); 
	scene.add(grups[1]); 
	//scene.add(grups[2]); 
	
	//grups[2].position.set(0, 0, 0); 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 12000 ); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], x.zz); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		

	//x.camGrup.position.set(0, 0, _.ej[3]); 
//	x.camGrup.position.set(0, 0, 2000); 
	scene.add(x.camGrup); 
	
	scene.add( new THREE.AmbientLight( 0xdadada ) );	

    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		

	_.mouse = new THREE.Vector2(); 	
	_.entro = true; 
	_.idleTimer = 0; 
	_.fokus = true; 
	
	//_.raycaster = new THREE.Raycaster();
	_.pointer = new THREE.Vector2();

	_.ptrDown = false; 

	
	renderer = new THREE.WebGPURenderer({ antialias: true });
	//renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	//renderer.toneMapping = THREE.NeutralToneMapping;
	//renderer.toneMappingExposure = 2;	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.shadowMap.type = THREE.VSMShadowMap; 	
	//renderer.outputEncoding = THREE.sRGBEncoding; 
	//renderer.outputColorSpace = THREE.SRGBColorSpace; 
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
	renderer.sortObjects = false;	
//	renderer.setAnimationLoop( animate ); 	
	ui.kontainer.appendChild(renderer.domElement); 
	
	
//	x.spotLcone = []; 
/*	
	x.spotLight = []; 

	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 10000000, 4000, Math.PI/4, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( 0, 1500, 0 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width =  1536;
	//x.spotLight[0].shadow.mapSize.height = 1536; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 4000;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = .7;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	
*/

	const dLSize = 4000,  
		  dLSize2 = 1000; 
	
//	x.directionalLight = new THREE.DirectionalLight( 0xffffff, 2.2 );
	x.directionalLight = new THREE.DirectionalLight( 0xfff2d8, 2.6 );
	x.directionalLight.castShadow = true; 
	x.directionalLight.shadow.mapSize.width = 1536; 
	x.directionalLight.shadow.mapSize.height = 1536; 
	//x.directionalLight.shadow.camera.near = 1; 
	x.directionalLight.shadow.camera.far = 3000; 
	x.directionalLight.shadow.camera.left = -dLSize; 
	x.directionalLight.shadow.camera.bottom = -dLSize2; 
	x.directionalLight.shadow.camera.right = dLSize; 
	x.directionalLight.shadow.camera.top = dLSize2; 
//	x.directionalLight.position.set( 0, 1000, -1000 );
	x.directionalLight.position.set( 0, 320, -1100 );
	x.directionalLight.shadow.intensity = .75; 
	scene.add( x.directionalLight );


	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	

	//const light = new THREE.PointLight( 0xffffff, 100, 50 );
	//scene.add( light );
	
	//const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
	//scene.add( helper );	
	
	//const helperS = new THREE.CameraHelper( directionalLight.shadow.camera );
	//const helperS = new THREE.CameraHelper( x.spotLight[0].shadow.camera );
	//scene.add( helperS );	
	
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
    controls.zoomSpeed = 2;
   // controls.enablePan = false;
    controls.panSpeed = 2;
	//controls.update();		
controls.enabled = false; 
*/
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	//grups[0].add( x.spotLight[0] );	
//	grups[0].add(camera);	
	
	
	x.currGrup = 0; 
	
	x.target0 = new THREE.Object3D(); 
//	x.target0.position.set(0, _.ej[5] - 10, x.camGrup.position.z); 
	x.target0.position.set(0, _.ej[5], 0); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
//	controls.target = x.target0.position; 	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	

	x.rotCam = false; 
	x.inCar = true; 
	
	// Post-Processing
	//postProcessing = new THREE.PostProcessing( renderer );
	
	//addWetGround(); 

	addSkybox(); 
	//addSkybox2(); 
	
	addSidewalk(); 
	addRailings();	
	addLamps();
	
	//addRoads(); 
	
	//addClouds(); 

	addGround();  
	addTrees();  
	
	//addSun(); 
	
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
	loader.setPath( 'img/skybox/11/' );
	//loader.setPath( 'img/skybox/21/' ); 

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		//'negz'+f, 'posz'+f
		'posz'+f, 'negz'+f
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
		//scene.backgroundRotation.set(0, Math.random() * Math.PI, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 
		
		//scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addWetGround(); 
		
		addBg(); 
		
		addCar2(); 
		
		//addRoads(); 
				
		//fadeScene(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

function addBg() {
	const geometry = new THREE.PlaneGeometry( 7000, 3500 ); 

	const skyMater = new THREE.MeshBasicMaterial( { color: 0xffffff, fog: false } ); 
	
	const skyBg2 = new THREE.Mesh( geometry, skyMater ); 

	skyBg2.position.y = 1650; 
	skyBg2.position.z = -1100; 
	//skyBg2.rotation.x = Math.PI/-2; 
	
//	scene.add( skyBg2 );
	x.camGrup.add( skyBg2 );
	
	const load1 = new THREE.TextureLoader(); 
		
	//load1.load( 'img/bg/architecture-1868667_1920.jpg', function(tx) { 
	//load1.load( 'img/bg/city1.jpg', function(tx) { 
	//load1.load( 'img/skybox/11/cyber3b.jpg', function(tx) { 
	load1.load( 'img/skybox/21/sunset2.jpg', function(tx) { 
		tx.wrapS = THREE.RepeatWrapping;    
		tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.offset.set(0, -.05);    	
	//	tx.repeat.set(3, 1.66);    	
		//tx.flipY = true; 
		//tx.colorSpace = THREE.SRGBColorSpace;	
	
		skyMater.map = tx; 
		skyMater.needsUpdate = true; 
		
		//addWetGround(); 
		
		//addSea(); 
	}); 	
	
	//fadeScene(); 
}	

function addRoads(tx0, tx1) {
	x.road = []; 
	
	const width = 1000, 
		  height = 3000,  
		  kolor = 0xffffff;  
		  //posZ = [500, -500, 500, -500],
		  //posX = [-1500, 1500]; 
		  //roadMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height );

	//roadMater[i] = new THREE.MeshBasicMaterial( { color: kolor } );

	const roadMater = new THREE.MeshStandardMaterial( { color: kolor, roughness: .9, metalness: .2 } ); 	
	roadMater.transparent = true; 
	roadMater.opacity = .88; 
	roadMater.wireframe = true; 	
	
	for ( let i = 0; i < 2; i++ ) {	
		//roadMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//roadMater[i].flatShading = true; 
		//roadMater[i].transparent = true; 
		//roadMater[i].opacity = .9; 
		//roadMater[i].wireframe = true; 	
	
		x.road[i] = new THREE.Mesh( geometry, roadMater ); 
		
		//x.road[i].position.set(posX[i], florY + 5, 0);
		x.road[i].position.set(0, florY + .2, 0);
		x.road[i].rotateX( - Math.PI / 2 ); 
		x.road[i].rotateZ( - Math.PI / 2 ); 
		//x.road[i].castShadow = true; 
		x.road[i].receiveShadow = true; 
		
		grups[i].add( x.road[i] ); 
		//scene.add( x.road[i] ); 
	}

	roadMater.normalScale.set(.93, .93); 
	roadMater.normalMap = tx0;
	roadMater.map = tx1; 
	
	const loader2 = new THREE.TextureLoader(), 
		  loader3 = new THREE.TextureLoader(), 
		  url = 'img/road/0/mat/';  
		  
	loader2.load( url + 'rough012c.jpg', function(tx2) { 	
		//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping; 
		//tx2.repeat.set(1, 2); 
		
		roadMater.roughnessMap = tx2; 
		roadMater.needsUpdate = true; 
	});	
	
	loader3.load( url + 'alfa012c.jpg', function(tx3) { 	
		//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping; 
		//tx3.repeat.set(1, 2); 
		
		roadMater.alphaMap = tx3; 
		roadMater.needsUpdate = true; 
		//roadMater.wireframe = x.skyMater[0].wireframe = x.skyMater[1].wireframe = false; 
		roadMater.wireframe = false; 
		
		//fadeScene(); 
		//addLights(); 
	});	
}

function addWetGround() {
	const loader = new THREE.TextureLoader(), 
		  url = 'img/road/0/mat/';  
	
	loader.load( url + 'normal012c.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping; 
		//tx.repeat.set(1, 2); 
		
		addWetGround2(tx); 
	});  
}	

function addWetGround2(tx0) {
	const loader = new THREE.TextureLoader(), 
		  url = 'img/road/0/mat/';  
	
	loader.load( url + 'color012c.jpg', function(tx1) { 	
		//tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping; 
		//tx1.repeat.set(1, 2); 
		
		//const mirror01 = reflector(); 
		
		const normalScale = .04, 
			  uvMul = uv().mul( 1 );
			  
		const uvOffset = texture( tx0, uvMul ).xy.mul( 2 ).sub( 1 ).mul( normalScale ); 
		
		const mirror01 = reflector( { resolution: 0.5 } ); // 0.5 is half of the rendering view
		mirror01.target.position.y = florY + .21; 
		mirror01.target.rotateX( - Math.PI / 2 );
		mirror01.uvNode = mirror01.uvNode.add( uvOffset );
		grups[0].add( mirror01.target );		
		
		const floorMaterial = new THREE.MeshPhongNodeMaterial();
		floorMaterial.colorNode = texture( tx1, uvMul ).add( mirror01 );
		//floorMaterial.colorNode = texture( tx1, uvMul ).mul( 1. ).add( mirror01 );

		const geom = new THREE.PlaneGeometry( 1000, 3000 ); 
		
	//	const floor = new THREE.Mesh( new THREE.BoxGeometry( 50, .001, 50 ), floorMaterial );
		x.mirror01 = new THREE.Mesh( geom, floorMaterial );
		x.mirror01.receiveShadow = true;
    
		x.mirror01.position.set( 0, florY, 0 );
		x.mirror01.rotateX( - Math.PI / 2 );
		x.mirror01.rotateZ( - Math.PI / 2 );
		grups[0].add( x.mirror01 );		
		
		const mirror23 = reflector( { resolution: 0.5 } ); // 0.5 is half of the rendering view
		mirror23.target.position.y = florY + .21; 
		mirror23.target.rotateX( - Math.PI / 2 );
		mirror23.uvNode = mirror23.uvNode.add( uvOffset );
		grups[1].add( mirror23.target );
		
		const geom2 = new THREE.PlaneGeometry( 1000, 3000 ); 
		
		x.mirror23 = new THREE.Mesh( geom2, floorMaterial );
		x.mirror23.receiveShadow = true;
    
		x.mirror23.position.set( 0, florY, 0 );
		x.mirror23.rotateX( - Math.PI / 2 );
		x.mirror23.rotateZ( - Math.PI / 2 );
		grups[1].add( x.mirror23 );	
		
		grups[0].position.set(-1500, 50, 0); 
		grups[1].position.set(1500, 50, 0); 
		
		addRoads(tx0, tx1); 
	
	});  
}	

function addSidewalk() {
	const sidewalk = []; 
	
	const width = 3000, 
		  //height = 60,  
		  height = 100,  
		  kolor = 0xc5c5c5;  
		  //posX = [220, -220, 214.5, -214.5];   
		  //sidewalkMater = []; 
		
	//const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const geometry = new THREE.PlaneGeometry( width, height ); 
	const sidewalkMater = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
	
	for ( let i = 0; i < 2; i++ ) {	
		sidewalkMater[i] = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } ); 
		//sidewalkMater[i].flatShading = true; 
	//	sidewalkMater[i].transparent = true; 
		//sidewalkMater[i].opacity = .9; 
	//	sidewalkMater[i].alphaTest = .5; 	
	//	sidewalkMater[i].wireframe = true; 	
	
		sidewalk[i] = new THREE.Mesh( geometry, sidewalkMater ); 
		
		sidewalk[i].position.set(0, florY+16, -520);
		//sidewalk[i].position.set(0, florY+8, -500);
		
		const rotX = Math.PI/-2; 
		sidewalk[i].rotation.x = rotX;
		
		//sidewalk[i].castShadow = true; 
		sidewalk[i].receiveShadow = true; 
		
		grups[i].add( sidewalk[i] ); 
	}

	const geometry2 = new THREE.PlaneGeometry( width, 16 ); 
	//const geometry2 = new THREE.PlaneGeometry( width, 8 ); 
	
	for ( let j = 2; j < 4; j++ ) {	
		sidewalk[j] = new THREE.Mesh( geometry2, sidewalkMater ); 
		
		sidewalk[j].position.set(0, florY+8, -470);
		//sidewalk[j].position.set(0, florY+4, -470);
		
		//sidewalk[j].castShadow = true; 
		sidewalk[j].receiveShadow = true; 
		
		grups[j-2].add( sidewalk[j] ); 
	}

	
	const loader0 = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  //tU = 5, 	
		  tU = 3, 	
		  tV = .1, 	
		  url2 = 'img/ground/7/';   

	loader0.load( url2 + 'color1.jpg', function(tx0) { 	
		tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
		////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
		tx0.repeat.set(tU, tV);    
		
		sidewalkMater.map = tx0; 
		sidewalkMater.needsUpdate = true;
		sidewalkMater.wireframe = false; 
	});  		

	loader1.load( url2 + 'rough1.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(tU, tV);  

		sidewalkMater.roughnessMap = tx1; 
		sidewalkMater.needsUpdate = true; 
	});  		
    
	loader2.load( url2 + 'normal1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(tU, tV);  

		sidewalkMater.normalScale.set(5, 5); 
		sidewalkMater.normalMap = tx2; 
		sidewalkMater.needsUpdate = true; 
	});  		
 
}

function randomizeMatrix3( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//let posX = [2100, -1800, -1500, -1200, -900, -600, -300]; 	
		
	position.x = -2925 + (j * 150);
	position.y = 40;
	//position.z = -475; 
	position.z = -550; 
	
	//rotation.x = Math.PI/-2; 
	//rotation.y = rotY[j % 4]; 
	//rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
	scale.x = 150; 
	scale.y = 20; 
	scale.z = 20; 

	return matrix.compose( position, quaternion, scale );
}

function addRailings() {
	//let meshCount = 0; 
	const mater = [],  
		  railings = []; 
	//let matrix = []; 	

	const loader = new OBJLoader();
	
	loader.load( 'obj/street/2/railing.obj', function ( object ) {
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

		mater[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .25, metalness: .1 } );		
		//mater[0].emissive.set(0x454545); 
		//mater[0].side = 2; 
		//mater[0].shadowSide = THREE.BackSide; 
		
		for ( let i = 0; i < 1; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  qty = 40; 		
		
			railings[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, mater[0] );
			railings[i].frustumCulled = true;
			railings[i].castShadow = true;
			railings[i].receiveShadow = true;
			
			const geometryId0 = railings[i].addGeometry( object.children[0].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = railings[i].addInstance( geometryId0 );
			
				matrix = randomizeMatrix3( matrix, j ); 

				railings[i].setMatrixAt( instancedId0, matrix ); 
			}
			
			//if (i==0) {
				scene.add(railings[i]); 
				//grups[0].add(railings[i]); 
			//} else {
				//grups[1].add(railings[i]); 
			//}			
			
			railings[i].visible = false; 
		}			

	
		const loader = new THREE.TextureLoader(), 
			  url2 = 'obj/street/2/mat/'; 

		loader.load( url2 + 'color1.jpg', function(tx) { 	
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
			tx.repeat.set(6, 6);  		
			
			mater[0].map = tx; 
			mater[0].needsUpdate = true;
			
			railings[0].visible = true; 
		});  
		
	}); 

}

function randomizeMatrix2( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	const posX = [-2250, -1500, -750, 0, 750, 1500, 2250];
	//let posX = (j % 2 == 0) ? -700 : 700; 
	//let posZ = [3000, 3000, 2000, 2000, 1000, 1000, 0, 0]; 	
		
	position.x = posX[j]; 
//	position.y = florY+318;
	position.y = florY+304;
//	position.z = -467; 
	position.z = -475;  

	//const rotY = (j % 2 == 0) ? Math.PI/2 : Math.PI/-2; 
	//const rotY = (j < 8) ? Math.PI/2 : Math.PI/-2; 
	
	//rotation.x = Math.PI/-2; 
	rotation.y = Math.PI/-2; 
//	if (j < 8) rotation.y = Math.PI; 
	//rotation.z = Math.random() * 2 * Math.PI; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
//	scale.x = scale.y = scale.z = .9;
	scale.x = scale.y = scale.z = .82;

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

		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .2, metalness: .8 } );		
		const material2 = new THREE.MeshBasicMaterial( { color: 0xe5e3db } );
		
		//material.shadowSide = THREE.DoubleSide; 
		
		for ( let i = 0; i < 1; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  qty = 7; 		
		
			x.lamps[i] = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material );
			x.lamps[i].frustumCulled = true;
			x.lamps[i].castShadow = true; 
			//x.lamps[i].receiveShadow = true;
			
			x.bulbs[i] = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material2 );
			x.bulbs[i].frustumCulled = true;
			//x.bulbs[i].castShadow = true; 
			//x.lamps[i].receiveShadow = true;
			
			const geometryId0 = x.lamps[i].addGeometry( object.children[0].geometry ), 
				  geometryId1 = x.bulbs[i].addGeometry( object.children[1].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.lamps[i].addInstance( geometryId0 ), 
					  instancedId1 = x.bulbs[i].addInstance( geometryId1 );
			
				matrix = randomizeMatrix2( matrix, j ); 

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

		//addLights();
		
		//fadeScene(); 
	}); 

}

function addLights() {
	x.spotLight = []; 	
	x.spotLcone = []; 	
	x.target = []; 	
	const posX = [-750, 0, 750]; 
	
	for ( let i = 0; i < 3; i++ ) {
		x.spotLight[i] = new THREE.SpotLight( 0xfffdf5, 2400000, 450, Math.PI/4, 1 );
	//	x.spotLight[i] = new THREE.SpotLight( 0xfffdf5, 2000000, 450, Math.PI/5, 1 );
		//x.spotLight[i] = new THREE.SpotLight( 0xff0000, 3000000, 450, Math.PI/5.6, 1 );
	//	x.spotLight[i].position.set( posX[i], 361, -394 );
		x.spotLight[i].position.set( posX[i], 347, -402 );
		x.spotLight[i].castShadow = true; 
		//x.spotLight[i].shadow.mapSize.width = 1024;
		//x.spotLight[i].shadow.mapSize.height = 1024;
		x.spotLight[i].shadow.camera.near = 1;
		x.spotLight[i].shadow.camera.far = 450;
		x.spotLight[i].shadow.camera.fov = 40;
		//x.spotLight[i].shadow.intensity = 1.5;
		
		scene.add( x.spotLight[i] );	
		
		x.target[i] = new THREE.Object3D(); 
	//	x.target[i].position.set(posX[i], florY, -394); 
		x.target[i].position.set(posX[i], florY-14, -402); 
		scene.add(x.target[i]);	
		
		x.spotLight[i].target = x.target[i]; 		
		
		//x.spotLightHelper0 = new THREE.SpotLightHelper( x.spotLight[i] );
		//scene.add( x.spotLightHelper0 );			
	}
	
	//const spotLgeom = new THREE.PlaneGeometry( 260, 260 );		
	const spotLgeom = new THREE.PlaneGeometry( 312, 260 );		
	
	//const spotLmater = new THREE.MeshBasicMaterial( {color: 0xfffdf5, transparent: true, opacity: .5, side: 2 } );
	const spotLmater = new THREE.MeshBasicMaterial( {color: 0xfffdf5, transparent: true, opacity: .75, side: 2 } );
	spotLmater.depthWrite = false; 
	//spotLmater.fog = false; 		
	
	const rotY = [0, Math.PI/2, Math.PI/4, Math.PI/-4, Math.PI/6, Math.PI/-6, Math.PI/8, Math.PI/-8, ]; 
	
	for ( let j = 0; j < 3; j++ ) {	
		x.spotLcone[j] = new THREE.Mesh( spotLgeom, spotLmater );
		
	//	x.spotLcone[j].position.set( posX[j], 235, -394 );
		x.spotLcone[j].position.set( posX[j], 221, -402 );
		x.spotLcone[j].rotateY(rotY[j]);
		//x.spotLcone[j].scale.set( 2, 2, 1 );
		x.spotLcone[j].visible = false;			
		
		scene.add( x.spotLcone[j] );	
	}

	x.targetCam = new THREE.Object3D(); 
//	x.targetCam.position.set(camera.position.x, 235, camera.position.z); 
	x.targetCam.position.set(camera.position.x, 221, camera.position.z); 
	scene.add(x.targetCam);		
	
	const loader1 = new THREE.TextureLoader(); 
	
	//loader1.load( url2 + 'cone0b.jpg', function(tx1) { 	
	loader1.load( 'img/spotLconeA.png', function(tx1) { 	
		spotLmater.alphaMap = tx1; 
		spotLmater.needsUpdate = true; 
		
		for ( let k = 0; k < 3; k++ ) {
			x.spotLcone[k].visible = true; 
		}
		
		//fadeScene(); 
		//addCar(); 
		//addCarLights(); 
		//addTires(); 
		
		fadeScene(); 
	}); 		
	
}

function addGround() {
	x.ground = []; 
	
	let width = 6000, 
		height = 200,  
		posX = 0, 
		posZ = (height-2)/2, 
		rez = 4,  
		intrvl = 400, 
		kolor = 0xbababa; 
		
	//let geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	let geometry = new THREE.PlaneGeometry( width, height, rez * 30, rez );
	//let geometry = new THREE.PlaneGeometry( width, height );

	//console.log(geometry.attributes.position); 
	
	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	//material.flatShading = true; 
	material.wireframe = true; 
	
	for ( let i = 0; i < 1; i++ ) {	
		x.ground[i] = new THREE.Mesh( geometry, material ); 
		
		//console.log(pozZ);
		//x.ground[i].position.set(0, florY, posZ);
		x.ground[i].position.set(0, florY+42, -670);
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
		txU = 30, txV = 1; 

	loader.load( url + 'colorlr.jpg', function(tx) { 	
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
	loader2.load( 'img/snowground4.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		//tx2.repeat.set(1, 2);    
		tx2.repeat.set(2, 1);    
		//tx2.offset.set(0, .2);    		
		
		for ( let j = 0; j < 1; j++ ) {	
			//x.ground[j].material.bumpMap = tx; 
		//	x.ground[j].material.displacementScale = 80; 
			x.ground[j].material.displacementScale = 30; 
			//x.ground[j].material.displacementBias = 15; 
			x.ground[j].material.displacementMap = tx2;			
			x.ground[j].material.needsUpdate = true; 
			
			//let posXYZ = x.ground[j].geometry.getAttribute('position');
			//posXYZ.needsUpdate = true; 
			//x.ground[j].geometry.computeBoundingBox(); 
			////x.ground[j].geometry.needsUpdate = true; 
			//console.log(x.ground[j].geometry.attributes.position); 
			////console.log(x.ground[j]); 
		}
	});  		

	loader3.load( url + 'normallr.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.normalScale.set(3, 3); 
			x.ground[j].material.normalMap = tx3; 
			x.ground[j].material.needsUpdate = true;
		}
	});  		

	loader4.load( url + 'roughlr.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.ground[j].material.roughnessMap = tx4; 
			x.ground[j].material.needsUpdate = true;
		}
	});  		

}

function randomizeMatrix( matrix, j ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	const posX = [-1875, -1125, -375, 375, 1125, 1875, 2625];
	//const posX = [-2250, -1500, -750, 0, 750, 1500, 2250];
	//let posX = (j % 2 == 0) ? -700 : 700; 
	//let posZ = [3000, 3000, 2000, 2000, 1000, 1000, 0, 0]; 	
	const rotZ = [Math.PI/-4, Math.PI/-2, Math.PI/4, 0, Math.PI/-4, Math.PI/-2, Math.PI/4]; 	
		
	position.x = posX[j]; 
//	position.y = florY+318;
	position.y = florY+65;
//	position.z = -467; 
	position.z = -650;  

	//const rotY = (j % 2 == 0) ? Math.PI/2 : Math.PI/-2; 
	//const rotY = (j < 8) ? Math.PI/2 : Math.PI/-2; 
	
	rotation.x = Math.PI/-2; 
	//rotation.y = Math.PI/-2; 
//	if (j < 8) rotation.y = Math.PI; 
	//rotation.z = Math.random() * 2 * Math.PI; 
	rotation.z = rotZ[j]; 
	
	quaternion.setFromEuler( rotation );

	//scale.x = scale.y = scale.z = 3 + Math.random() * .1;
//	scale.x = scale.y = scale.z = .9;
	scale.x = scale.y = scale.z = 2.6;

	return matrix.compose( position, quaternion, scale );
}

function addTrees() {
	//let meshCount = 0; 
	//x.materials2 = []; 
	//x.trunk = []; 
	//x.leaves = []; 
	//x.cones = []; 
	//let matrix = []; 	

	const loader = new FBXLoader();
	
	loader.load( 'obj/palmtree/tree1.fbx', function ( object ) {
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

		const material0 = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0x333333, roughness: .5 } ), 
			  material1 = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0x444444, roughness: .2, alphaTest: .5, side: THREE.DoubleSide } ), 
			  material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, emissive: 0x333333, roughness: .5 } );		
		
		material0.wireframe = material1.wireframe = material2.wireframe = true; 
		//material.side = 2; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth0 = object.children[0].geometry.attributes.position.array.length,  
				  lngth1 = object.children[1].geometry.attributes.position.array.length,  
				  lngth2 = object.children[2].geometry.attributes.position.array.length,  
				  qty = 7; 			

			x.cones = new THREE.BatchedMesh( qty, lngth0, lngth0 * 2, material0 );
			x.cones.frustumCulled = true;
			//x.cones.castShadow = true; 
			//x.cones.receiveShadow = true;
			
			x.leaves = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, material1 );
			x.leaves.frustumCulled = true;
			x.leaves.castShadow = true; 
			//x.leaves.receiveShadow = true;
			
			x.trunk = new THREE.BatchedMesh( qty, lngth2, lngth2 * 2, material2 );
			x.trunk.frustumCulled = true;
			x.trunk.castShadow = true; 
			//x.trunk.receiveShadow = true;
			
			const geometryId0 = x.cones.addGeometry( object.children[0].geometry ), 
				  geometryId1 = x.leaves.addGeometry( object.children[1].geometry ), 
				  geometryId2 = x.trunk.addGeometry( object.children[2].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId0 = x.trunk.addInstance( geometryId0 ), 
					  instancedId1 = x.leaves.addInstance( geometryId1 ), 
					  instancedId2 = x.cones.addInstance( geometryId2 );
			
				matrix = randomizeMatrix( matrix, j ); 

				x.cones.setMatrixAt( instancedId0, matrix ); 				
				x.leaves.setMatrixAt( instancedId1, matrix ); 				
				x.trunk.setMatrixAt( instancedId2, matrix ); 				
			}
			
			scene.add(x.cones); 
			scene.add(x.leaves); 
			scene.add(x.trunk); 			
		//}		

	
		const load1 = new THREE.TextureLoader(),  
			  load2 = new THREE.TextureLoader(), 
			  load3 = new THREE.TextureLoader(),  
			  load4 = new THREE.TextureLoader(),  
			  load5 = new THREE.TextureLoader(), 
			  load6 = new THREE.TextureLoader(), 
			  url = 'obj/palmtree/mat/'; 
			
		load1.load( url + 'barkd1.jpg', function(tx) { 
			for ( let j = 0; j < 3; j++ ) {	
				x.trunk.material.map = tx; 
				x.trunk.material.needsUpdate = true; 
				x.trunk.material.wireframe = false; 
			}
		}); 				

		load2.load( url + 'leafd1.jpg', function(tx2) { 
			for ( let k = 0; k < 3; k++ ) {	
				x.leaves.material.map = tx2; 
				x.leaves.material.needsUpdate = true; 
				x.leaves.material.wireframe = false; 
			}
		}); 				

		load3.load( url + 'branchd1.jpg', function(tx3) { 
			for ( let l = 0; l < 3; l++ ) {	
				x.cones.material.map = tx3; 
				x.cones.material.needsUpdate = true; 
				x.cones.material.wireframe = false; 
			}
		}); 		
		
		load4.load( url + 'leafo1.jpg', function(tx4) { 
			for ( let m = 0; m < 3; m++ ) {	
				x.leaves.material.alphaMap = tx4; 
				x.leaves.material.needsUpdate = true; 
			}
		}); 
		
		load5.load( url + 'leafn1.jpg', function(tx5) { 
			for ( let n = 0; n < 3; n++ ) {	
				x.leaves.material.normalMap = tx5; 
				x.leaves.material.needsUpdate = true; 
			}
		}); 

		load6.load( url + 'barkn1.jpg', function(tx6) { 
			for ( let o = 0; o < 3; o++ ) {	
				x.trunk.material.normalMap = tx6; 
				x.trunk.material.needsUpdate = true; 
			}
		});  

		//fadeScene(); 
	}); 

}

function addCar2() {
	let meshCount = 0, 
		matr = []; 
	
	let testMatr = []; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/car/12/bare2.fbx', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				if ((meshCount == 1) || (meshCount == 2) || (meshCount == 4)) 
				//if (meshCount == 4)  
					child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
				child.geometry.computeBoundingBox();		
				
				if ((meshCount == 1) || (meshCount == 2)) {
					child.castShadow = true; 
					child.receiveShadow = true; 
				}
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
				//if (meshCount == 17) child.add(camera);	
				
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		x.car = object; 
		
		//console.log(object); 
		
		_.envMrotY = 0; 
		
		// 0 - grill  1 - glass  2 - frame  3 - tires  4 - lights 
		
		testMatr[0] = new THREE.MeshBasicMaterial( { color: 0x3e3e3e } );	
		testMatr[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .67, envMap: x.skybox } );	
		testMatr[2] = new THREE.MeshStandardMaterial( { color: 0x939393, roughness: .1, metalness: .2, envMap: x.skybox } );	
		testMatr[3] = new THREE.MeshBasicMaterial( { color: 0x202020 } );	
		testMatr[4] = new THREE.MeshStandardMaterial( { color: 0xb2b2b2, roughness: 0, metalness: .55, envMap: x.skybox } );	

		//testMatr[0].envMapIntensity = 5; 
		testMatr[1].envMapIntensity = 2.2; 
		testMatr[2].envMapIntensity = 1.5; 
		testMatr[4].envMapIntensity = 6.5; 
		//testMatr[4].reflectivity = 3; 
		
		//x.car = new THREE.Mesh( object.children[2].geometry, testMatr ); 

		for ( let i = 0; i < meshCount; i++ ) {	
			//testMatr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .6, metalness: 0 } );
			x.car.children[i].material = testMatr[i]; 
			
			//matr[i].emissive.set(0x333333); 
		}
		
		x.car.scale.set(1.25, 1.25, 1.25); 
		x.car.position.set(0, florY+100, -200); 
	//	x.car.castShadow = true; 
	//	x.car.receiveShadow = true; 		
		
		x.camGrup.add( x.car );		
		
		//console.log(x.car.material[0].envMapRotation.y); 
		
		//x.car.rotation.x = Math.PI/-2; 
		
		//const load1 = new THREE.TextureLoader(); 
		//	
		//load1.load( 'img/opactop.jpg', function(tx1) { 
		//	//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//	//tx.repeat.set(4, 4);    		
		//	
		//	testMatr[4].emissive.setHex(0xd2d2d2); 			
		//	//testMatr[4].emissiveIntensity = 1; 
		//	testMatr[4].emissiveMap = tx1; 
		//	testMatr[4].needsUpdate = true; 
		//});  			
		
		addTires(); 
	}); 
	
	//addCarLights(); 
	//addTires(); 
}

/*function addCar() {
	let meshCount = 0, 
		matr = [], 
		kolors = [0x202020]; 
	
	let testMatr = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/outrun/lowpolycar.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				if ((meshCount == 0) || (meshCount == 1) || (meshCount == 3)) 
					child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
				child.geometry.computeBoundingBox();		
				
			//	child.castShadow = true; 
			//	child.receiveShadow = true; 
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
				//if (meshCount == 17) child.add(camera);	
				
				meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		_.envMrotY = 0; 
		
		testMatr[0] = new THREE.MeshStandardMaterial( { color: 0x000000, roughness: 0, metalness: .2, envMap: x.skybox, side : 2 } );	// main frame
		testMatr[1] = new THREE.MeshStandardMaterial( { color: 0x000000, roughness: 0, metalness: .22, envMap: x.skybox, side : 0 } );	// side trim
		testMatr[2] = new THREE.MeshBasicMaterial( { color: 0x474747 } );	// inner frame
		testMatr[3] = new THREE.MeshBasicMaterial( { color: 0xaaeeff, transparent:true, opacity: .9, envMap: x.skybox } );	// windows
		testMatr[4] = new THREE.MeshBasicMaterial( { color: 0x9eddfd } );	// headlights
		testMatr[5] = new THREE.MeshBasicMaterial( { color: 0x9eddfd } );	// rear & side bottom lights

		testMatr[0].envMapIntensity = 5; 
		testMatr[1].envMapIntensity = 5; 
		testMatr[3].envMapIntensity = 10; 
		//testMatr[3].reflectivity = 3; 
		
		x.car = new THREE.Mesh( object.children[0].geometry, testMatr ); 

		x.car.scale.set(30, 30, 30); 
	//	x.car.position.set(0, florY+97, -200); 
		x.car.position.set(0, florY+90, -200); 
		x.car.castShadow = true; 
		x.car.receiveShadow = true; 		
		
		x.camGrup.add( x.car );		
		
		//console.log(x.car.material[0].envMapRotation.y); 
		
		x.car.rotation.y = Math.PI/-2; 
	}); 
	
	//addCarLights(); 
	//addTires(); 
}*/

/*function addCarLights() {
	x.hLights1 = []; 
//	x.hLights2 = []; 
	
	const geometry = new THREE.PlaneGeometry( 87, 107 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0x9dd5f5, transparent: true, opacity: .4, side: THREE.DoubleSide, depthWrite: false } );	

	x.hLights1[0] = new THREE.Mesh( geometry, material ); 
	x.hLights1[1] = new THREE.Mesh( geometry, material ); 
//	x.hLights1[0].position.set(135, 46, -137); 
//	x.hLights1[1].position.set(135, 46, -262); 
	x.hLights1[0].position.set(134, 39, -137); 
	x.hLights1[1].position.set(134, 39, -262); 
	x.hLights1[0].rotateX((Math.PI/-2) + .14); 
	x.hLights1[0].rotateY(.34); 
	x.hLights1[1].rotateX((Math.PI/2) - .14); 
	x.hLights1[1].rotateY(-.34); 

	x.camGrup.add( x.hLights1[0] );	
	x.camGrup.add( x.hLights1[1] );		
	
//	const geometry2 = new THREE.PlaneGeometry( 80, 16 ); 
//	const material2 = new THREE.MeshBasicMaterial( { color: 0x9dd5f5, transparent: true, opacity: .75, side: THREE.DoubleSide, depthWrite: false } );	
//	
//	x.hLights2[0] = new THREE.Mesh( geometry2, material2 ); 
//	x.hLights2[1] = new THREE.Mesh( geometry2, material2 ); 
//	x.hLights2[0].position.set(-144.2, 64, -147); 
//	x.hLights2[1].position.set(-144.2, 64, -252); 
//	x.hLights2[0].rotation.y = (Math.PI/2) + .185; 
//	x.hLights2[1].rotation.y = (Math.PI/2) - .185; 
//	
//	x.camGrup.add( x.hLights2[0] );	
//	x.camGrup.add( x.hLights2[1] );	

	let load1 = new THREE.TextureLoader(),   
		load2 = new THREE.TextureLoader(), 
		load3 = new THREE.TextureLoader(); 
		
	load1.load( 'img/outrun/glow3.png', function(tx) { 
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    		
		
		for ( let i = 0; i < 2; i++ ) {	
			//x.hLights1[i].material.map = tx; 
			x.hLights1[i].material.alphaMap = tx; 
			
			x.hLights1[i].material.needsUpdate = true; 
		}
	});  	
	
//	load2.load( 'img/outrun/glow1.png', function(tx2) { 
//		//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
//		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
//		//tx2.repeat.set(4, 4);    		
//		
//		for ( let j = 0; j < 2; j++ ) {	
//			x.hLights2[j].material.map = tx2; 
//			x.hLights2[j].material.alphaMap = tx2; 
//            
//			x.hLights2[j].material.needsUpdate = true; 
//		}
//	});  					
			
	//const geometry3 = new THREE.ConeGeometry( 110, 6, 4, 1, true ); 
	const geometry3 = new THREE.PlaneGeometry( 100, 72 ); 
	//const material3 = new THREE.MeshBasicMaterial( {color: 0x9dd5f5, transparent: true, opacity: .3, side: THREE.DoubleSide, depthWrite: false } );
	x.lConeMater = new THREE.MeshBasicMaterial( {color: 0x9dd5f5, transparent: true, opacity: .5, side: THREE.DoubleSide, depthWrite: false } );
	
	x.lCones = []; 
	
	x.lCones[0] = new THREE.Mesh(geometry3, x.lConeMater ); 
	x.lCones[1] = new THREE.Mesh(geometry3, x.lConeMater ); 
	
//	x.lCones[0].position.set(-191, 64, -147); 
//	x.lCones[1].position.set(-191, 64, -252); 
	x.lCones[0].position.set(-191, 57, -147); 
	x.lCones[1].position.set(-191, 57, -252); 
	x.lCones[0].rotateX(Math.PI/-2);  
	x.lCones[1].rotateX(Math.PI/-2);  

	//lCones[0].scale.z = .068; 
	//lCones[1].scale.z = .068; 
	
	load3.load( 'img/outrun/tGlow3.png', function(tx3) { 
		//for ( let k = 0; k < 2; k++ ) {	
			x.lConeMater.alphaMap = tx3; 
			
			x.lConeMater.needsUpdate = true; 
			
			x.camGrup.add( x.lCones[0] );		
			x.camGrup.add( x.lCones[1] );		
			
			addTires(); 
		//}
	});  	
		
}*/

function addTires() {
	let meshCount = 0, 
		testMatr = []; 
		
	x.fTire = []; 
	x.rTire = []; 

//	testMatr[0] = new THREE.MeshStandardMaterial( { color: 0xaabbcc, roughness: .1, metalness: .25, envMap: x.skybox } );	// rim
	testMatr[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .1, metalness: .7, envMap: x.skybox } );	// rim
	testMatr[1] = new THREE.MeshBasicMaterial( { color: 0x555555 } );	// led		
	testMatr[2] = new THREE.MeshStandardMaterial( { color: 0x888888 } );	// rubber
		
	//const mater = new THREE.MeshStandardMaterial( { color: 0x0c0c0c } );
		
	const loader = new OBJLoader(), 
		  loader2 = new OBJLoader();
	
	loader.load( 'obj/outrun/wheelfront2.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeBoundingBox();		
				
			//	child.castShadow = true; 
			//	child.receiveShadow = true; 
				
				//if ((child.geometry.name == 'Hatsmesh') || (child.geometry.name == 'Shoesmesh')) child.frustumCulled = false;				
				
				//meshCount += 1; 
			}
		});	
		
		for ( let i = 0; i < 2; i++ ) {	
			x.fTire[i] = new THREE.Mesh( object.children[0].geometry, testMatr ); 
			//x.fTire[i] = new THREE.Mesh( object.children[0].geometry, mater ); 
			
			//x.fTire[i].scale.set(28, 28, 28); 
			x.fTire[i].scale.set(35, 35, 35); 
			
			if (i==1) x.fTire[i].castShadow = true; 
			if (i==0) x.fTire[i].receiveShadow = true; 		
			
			x.camGrup.add( x.fTire[i] );		
		}
		
		for ( let j = 2; j < 4; j++ ) {	
			x.fTire[j] = new THREE.Mesh( object.children[0].geometry, testMatr ); 
			//x.fTire[j] = new THREE.Mesh( object.children[0].geometry, mater ); 
			
			//x.fTire[j].scale.set(36.2, 36.2, 36.2); 
			x.fTire[j].scale.set(35, 35, 35); 
			
			if (j==3) x.fTire[j].castShadow = true; 
			if (j==2) x.fTire[j].receiveShadow = true; 		
			
			x.camGrup.add( x.fTire[j] );		
	
		}
		
		x.fTire[0].position.set(90, florY+75.75, -152); 
		x.fTire[1].position.set(90, florY+75.75, -247); 
		x.fTire[2].position.set(-95, florY+75.75, -152); 
		x.fTire[3].position.set(-95, florY+75.75, -247); 
		
		x.fTire[0].rotateY(Math.PI/-2); 
		x.fTire[1].rotateY(Math.PI/2); 
		x.fTire[2].rotateY(Math.PI/-2); 
		x.fTire[3].rotateY(Math.PI/2); 

		//addSeaMirror(); 
		
		addLights(); 
		//fadeScene(); 
	}); 	

}

/*function addSun() {
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
		//tx3.colorSpace = THREE.SRGBColorSpace;
	}); 
	
	//const flare0 = 
	//load1.load( 'img/sun/color1.jpg', function(tx1) { 
	load1.load( 'img/sun/alfa2.jpg', function(tx1) { 
		//sunMater.map = tx1; 
		//sunMater.needsUpdate = true; 
		//console.log(tx1); 
		
		//tx1.colorSpace = THREE.SRGBColorSpace; 
		
		const lensflare = new LensflareMesh();
		
		lensflare.addElement( new LensflareElement( tx1, 700, 0, x.directionalLight.color ) );
		lensflare.addElement( new LensflareElement( flare3, 50, .4 ) ); 
		lensflare.addElement( new LensflareElement( flare3, 80, .5 ) );
		lensflare.addElement( new LensflareElement( flare3, 120, .6 ) );
		lensflare.addElement( new LensflareElement( flare3, 70, .7 ) );	
		
		//x.directionalLight.add( lensflare ); 		
		
		lensflare.position.set(0, 320, -1100); 
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
	
function addSeaMirror() {
	const loader = new THREE.TextureLoader(), 
		  url = 'img/water/';  
	
	loader.load( url + 'waternormals.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping; 
		tx1.repeat.set(12, 1); 
		
		const normalScale = .04, 
			  uvMul = uv().mul( 1 );
			  
		const uvOffset = texture( tx1, uvMul ).xy.mul( 2 ).sub( 1 ).mul( normalScale ); 
		
		const seaMirror01 = reflector( { resolution: 0.5 } ); // 0.5 is half of the rendering view
		seaMirror01.target.position.y = florY+53; 
		seaMirror01.target.position.z = -840; 
		seaMirror01.target.rotateX( - Math.PI / 2 );
		seaMirror01.uvNode = seaMirror01.uvNode.add( uvOffset );
		scene.add( seaMirror01.target );		
		
		const floorMaterial = new THREE.MeshPhongNodeMaterial();
	//	floorMaterial.colorNode = texture( tx1, uvMul ).add( seaMirror01 );
		//floorMaterial.colorNode = texture( tx1, uvMul ).mul( 1. ).add( seaMirror01 );

		floorMaterial.colorNode = color( 0xffffff ).mul( .01 ).add( seaMirror01 ); 
		
		const geom = new THREE.PlaneGeometry( 6000, 500 ); 
		
		x.seaMirror01 = new THREE.Mesh( geom, floorMaterial );
		//x.seaMirror01.receiveShadow = true;
    
		x.seaMirror01.position.set( 0, florY+53, -840 );
		x.seaMirror01.rotateX( - Math.PI / 2 );
		//x.seaMirror01.rotateZ( - Math.PI / 2 );
		scene.add( x.seaMirror01 );		
		
		fadeScene(); 
	});  
}	
*/	


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
			eL(ui.kontainer, 0, "click", kontainerClick); 
			eL(ui.kontainer, 0, "wheel", wheelE); 
			
			x.camV3 = new THREE.Vector3(); 			
			
		//	animate();  
			
			theOptions(); 
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			//x.fogIdx = 0; 
			//x.fogInc = 1; 
			
			/*
			ColorPicker(
                document.getElementById('fcpSlide'),
                document.getElementById('fcpPick'),
				
                function(hex, hsv, rgb) {
					const colR = rgb.r/255, 
						  colG = rgb.g/255,
						  colB = rgb.b/255; 
					
                    x.car.children[3].material.color.setRGB(colR, colG, colB); 
                    x.car.children[4].material.color.setRGB(colR, colG, colB);  
                    x.car.children[7].material.color.setRGB(colR, colG, colB); 
					//console.log(rgb.r, rgb.g, rgb.b);
				}
			);
			*/
			
			renderer.setAnimationLoop( animate ); 
        }
    })();	
}	

function theOptions() {
	//ui.swtchKam = document.getElementById('swtchKam'); 
	//ui.onAud = document.getElementById('onAud'); 
	//ui.offAud = document.getElementById('offAud'); 
	
	//ui.colPick.style.visibility = "visible";
	
//	if (!isMobil) {
	//	ui.swtchKam.style.visibility = "visible"; 	
//	} else {
//		ui.swtchKam.style.display = "none"; 
//	}
	
	//ui.swtchKam.style.visibility = "hidden"; 
	//ui.swtchKam.style.display = "none"; 
	
	if (isMobil) {
		//eL(ui.colPick, 0, 'touchstart', colPickClick); 
		//eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
	} else {
		//eL(ui.colPick, 0, 'click', colPickClick); 
		//eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);		
	}	 
	
}

/*function colPickClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
	cL(ui.fcp, 0, "scale1"); 
	
	_.idleTimer = 0; 
}


function swtchKamClick(event) {	
    if (event) event.preventDefault(); 
	//event.stopPropagation();
	//event.stopImmediatePropagation(); 
	
	x.inCar = (x.inCar) ? false : true; 
	x.car[0].visible = x.wheel[0].visible = x.mirrors3.visible = x.mirrors[0].visible = x.mirrors[1].visible = x.mirrors[2].visible = x.inCar; 
	x.meter[0].visible = x.meter[1].visible = x.meter[2].visible = x.meter[3].visible = x.radioScr.visible = x.inCar; 	
	
	let spotLz = -250; 
	
	if (x.inCar) {
		//spotLz = -250; 
		camera.position.y = x.target0.position.y = 127; 
	//	_.ej[1] = -5; 
		_.ej[1] = -10; 
	} else {
		spotLz = -42; 
		camera.position.y = x.target0.position.y = 70; 
	//	_.ej[1] = -1; 
		_.ej[1] = -5; 
	}
		
	for ( let i = 0; i < 2; i++ ) {	
		x.spotLight[i].position.z = spotLz; 
	}
	
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

function kontainerClick( event ) {
    if (event) event.preventDefault();
    //event.stopPropagation(); 
	
//	cL(ui.fcp, 1, "scale1"); 	// colorpicker

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

	//x.xx = 400; 
	x.zz = 300; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	
		//camera.position.z = 37; 
		//console.log(camera.position.z); 
		
		//if (isMobil) x.xx = 800;
		x.zz = ((_.height / _.width) < .44) ? 200 : 300; 
		//x.zz = 300;
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		//camera.position.z = 51; 
		
		//if (isMobil) x.xx = 1100; 
		x.zz = ((_.width / _.height) < .5) ? 550 : 400; 
		//x.zz = 400; 
	}		
	
	camera.position.z = x.zz; 
	
	_.idleTimer = 0; 
}


function animWalk() {
	let x0 = x.camGrup.position.x, 
		x1 = x.target0.position.x; 
	
	//console.log(z0);
		
	switch (x0) {
		case -1497: 
			x.spotLight[1].position.x = x.spotLcone[1].position.x = x.target[1].position.x = 0;		
		
			break; 
		case -750: 
			x.spotLight[2].position.x = x.spotLcone[2].position.x = x.target[2].position.x = 750;		
		
			break; 
		case 0: 
			x.spotLight[0].position.x = x.spotLcone[0].position.x = x.target[0].position.x = 1500;		
		
			break; 
		case 750: 
			x.spotLight[1].position.x = x.spotLcone[1].position.x = x.target[1].position.x = 2250;		
		
			break; 
		case 1500: 
			x.spotLight[2].position.x = x.spotLcone[2].position.x = x.target[2].position.x = -1500;		
			x.spotLight[0].position.x = x.spotLcone[0].position.x = x.target[0].position.x = -750;		
		
			break; 
		default: 
	
	}		
		
		
	//if (z0 == _.ej[0]) {
	if (x0 < _.ej[0]) {
		x.camGrup.position.x = x0 + _.ej[1]; 
		x.target0.position.x = x1 + _.ej[1]; 
		//console.log(x.camGrup.position.x);
	} else {
		x.camGrup.position.x = _.ej[3]; 
		
		x.target0.position.x = _.ej[3]; 
		
		//grups[0].position.z *= -1; 
		//grups[1].position.z *= -1; 
		
		x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		
	}
	
	//let posX = 0; 
	//
	//for ( let i = 0; i < 3; i++ ) {
	//	x.spotLight[i].position.x = ;
	//	x.spotLcone[i].position.x = ;
	//	x.target[i].position.x = ;
	//}
	
	
	
}


function animate() { 
	//console.log('anim'); 
 //   requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		//console.log(Math.cos(timer)); 
		
		//const delta = clock.getDelta()  * .5; 
		//if ( mixer ) mixer.update( delta );			

		animWalk(); 
	
		//x.skyBg.position.x = Math.sin(timer*10) * 5; 
		//x.skyBg.position.z = Math.sin(timer*10) * 7 - 1490;  
	//	x.skyBg.position.z = Math.sin(timer*10) * 7 - 1090;  
		//x.skyBg.rotation.y = Math.sin(timer*3) * .05; 

	//	let x0 = x.skyMater[0].map.offset.x + .0005;   
	//	
	//	if (x0 >= 1) x0 = 0; 
	//	
	//	x.skyMater[0].map.offset.x = x0; 		
	//	x.skyMater[1].map.offset.x = x0; 		
	//	//x.skyMater[0].alphaMap.offset.y = y1; 
		
		_.envMrotY -= .005;  
		x.car.children[1].material.envMapRotation.y = x.car.children[2].material.envMapRotation.y =  
		x.car.children[4].material.envMapRotation.y = _.envMrotY; 
		
		//if (x.lConeMater) 
	//	x.lConeMater.opacity = Math.sin(timer*5) * .25 + .5; 
		
		x.fTire[0].rotateX(-.005); 
		x.fTire[2].rotateX(-.005); 
		
		//console.log(x.fTire[0].rotation.z); 
		
		//const tireRoX = (x.fTire[0].rotation.z - .02) % Math.PI; 
		//x.fTire[0].rotation.z = x.fTire[2].rotation.z = tireRoX; 
		
		const bumpy = Math.sin(timer*5) * .04; 
		
		x.car.position.y += bumpy; 
	//	
	//	for ( let i = 0; i < 2; i++ ) {	
	//		x.hLights1[i].position.y += bumpy; 
	//	//	x.hLights2[i].position.y += bumpy; 
	//		x.lCones[i].position.y += bumpy; 
	//	}
		
		//x.sea.material.uniforms[ 'time' ].value -= .0015;	
		
		
		if (isMobil) {
			camera.position.x = Math.sin(timer*.5) * 40; 
			camera.position.y = Math.cos(timer*.4) * 30 + _.ej[5] + 10;   
			camera.position.z = x.zz - Math.abs(Math.sin(timer*.5) * 20); 
			//x.camGrup.rotation.y = Math.sin(timer/3) * Math.PI; 				
		} else {
			//const ptY = _.pointer.y * Math.PI/-3.5, 
			//	  ptX = _.pointer.x * Math.PI;  
			
			camera.position.x = _.pointer.x * 60; 
			camera.position.y = _.pointer.y * 40 + _.ej[5] + 10; 
			camera.position.z = x.zz - Math.abs(_.pointer.x * 40); 
			//x.camGrup.rotateY( (_.pointer.x * .005) % Math.PI ); 
			
			//x.target0.position.x = camera.position.x; 
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
	//if (x.Sun) x.Sun.lookAt(camera.position);
	//x.beam2.lookAt(camera.position);
	//x.beam2.rotateY = x.beam2.rotateZ = 0; 
	//x.beam2.rotation.y = x.beam2.rotation.z = 0; 
	
	//x.mGlow.lookAt(camera.position); 	
	
	//x.mGlow.lookAt(camera.getWorldPosition(x.camV3)); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
	camera.getWorldPosition(x.targetCam.position); 
	//console.log(x.targetCam.position); 
	
	//x.targetCam.position.set(camera.position.x, 235, camera.position.z); 
//	x.targetCam.position.y = 235; 
	x.targetCam.position.y = 221; 
	
	for ( let i = 0; i < 3; i++ ) {
		x.spotLcone[i].lookAt(x.targetCam.position); 		
	}
	
	renderer.render( scene, camera );	
	//renderer.renderAsync( scene, camera );	
	//postProcessing.render(); 
	
	//console.log(renderer.info); 
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
		//let url = 'bdrm'; 			
		//let url = 'crvz'; 			
		//let url = 'lghths'; 			
		//let url = 'nghtdrv'; 	
		//let url = 'otrnstfe'; 		
		//let url = 'cybrpnk'; 		
		let url = 'smmr'; 		
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
	
	