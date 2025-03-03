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
//import { FlyControls } from 'three/addons/controls/FlyControls.js'; 
//import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
import { Water } from 'three/addons/objects/Water.js';
//import { Sky } from 'three/addons/objects/Sky.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'; 

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
	kontainer.style.background = "url('img/mountainsl.jpg') center top no-repeat"; 
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
	renderer.toneMapping = THREE.ACESFilmicToneMapping;	
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
//	scene.fog = new THREE.FogExp2(fogCol, 0.0002);	
	//scene.fog = new THREE.FogExp2(0x535f37, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 20000 ); 
	//camera.position.set(0, 50, 1000); 
	camera.position.set(0, _.ej[5], 220); 
	//camera.position.set(220, _.ej[5], 0); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
	//grups[0].add(camera);		
    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0xcdcdcd ) );	

	
//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xfff7dd, 5000000, 7000, Math.PI/8, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	//x.spotLight[0].position.set( -1500, 500, 1500 );
	x.spotLight[0].position.set( -3200, 2000, 2900 );
//	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
//	x.spotLight[0].shadow.mapSize.width =  1536;
//	x.spotLight[0].shadow.mapSize.height = 1536; 
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 50;
//	x.spotLight[0].shadow.bias = -.00000015; 
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
//	x.spotLight[0].shadow.intensity = .5;
	
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
	
//	x.camGrup.position.set(0, 0, _.ej[3]); 
	//x.camGrup.position.set(0, _.ej[5], 220); 
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
    controls.autoRotateSpeed = 1.;
   // controls.autoRotate = true;    
    controls.minDistance = 1;
    controls.maxDistance = 10000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .3;
    controls.zoomSpeed = 2;
    controls.panSpeed = 8;
	//controls.update();		
controls.enabled = false; 
*/

/*	controls = new FlyControls( camera, renderer.domElement );
	controls.movementSpeed = 1000;
	controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = false;
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
	x.target0.position.set(0, _.ej[5], 0); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
	//camera.lookAt(x.target0.position);
	
//	controls.target = x.target0.position; 	

	x.target1 = new THREE.Object3D(); 
	x.target1.position.set(0, 0, 500); 
	scene.add(x.target1);
	
	x.spotLight[0].target = x.target1; 

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	x.rotCam = false; 
	
	addSkybox(); 
	//addClouds(); 
	addSun(); 

//	addSea(); 
	
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
	loader.setPath( 'img/skybox/7/' );

	loader.load( [
		'posx2'+f, 'negx2'+f,
		'posy'+f, 'negy'+f,
		'posz2'+f, 'negz2'+f
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
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addMountain(); 
		//addSea(); 
		
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
	load1.load( 'img/sun/color1.jpg', function(tx1) { 
		//sunMater.map = tx1; 
		//sunMater.needsUpdate = true; 
		//console.log(tx1); 
		
		const lensflare = new Lensflare();
		lensflare.addElement( new LensflareElement( tx1, 700, 0, x.spotLight[0].color ) );
		lensflare.addElement( new LensflareElement( flare3, 60, .4 ) ); 
		lensflare.addElement( new LensflareElement( flare3, 90, .5 ) );
		lensflare.addElement( new LensflareElement( flare3, 140, .6 ) );
		lensflare.addElement( new LensflareElement( flare3, 90, .7 ) );	
		
		x.spotLight[0].add( lensflare ); 		
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

function addMountain() {
	let meshCount = 0; 
	x.mountain = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mountain/0/deci40.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry);
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

		//x.mountain = object; 

		
		//const matr = [], 
		const url2 = 'obj/mountain/0/mat/', 
			  frm = 'jpg', 
			  posX = [-110, 0, 110]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshBasicMaterial( { color: 0xffffff } );
			  //matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		
		matr.transparent = true; 
		matr.wireframe = true; 
		//matr.opacity = 1; 
		//matr.side = 2; 
		//matr.alphaTest = .5; 
		//matr.envMap = x.skybox; 
		//matr.emissiveIntensity = 10;
		
		for ( let i = 0; i < meshCount; i++ ) {	
			x.mountain[i] = new THREE.Mesh( geom, matr );
			
			x.mountain[i].scale.set(14, 14, 14); 
			//x.mountain[i].position.set(posX[i], 78, -20); 
			x.mountain[i].rotation.set(Math.PI/-2, 0, 0);
			
			//x.mountain[i].castShadow = true; 
			//x.mountain[i].receiveShadow = true; 
			
			grups[0].add(x.mountain[i]); 
		}
		
		scene.add(grups[0]); 
		
		const loader1 = new THREE.TextureLoader(),    
			  loader2 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false; 
		});  

		loader2.load( url2 + 'alfa2.jpg', function(tx2) { 	
			matr.alphaMap = tx2; 
			matr.needsUpdate = true; 
		});  

		
		const lakeGeom= new THREE.PlaneGeometry( 1720, 1720 ); 
		const lakeMater = new THREE.MeshBasicMaterial( { color: 0xa8c0e0 } ); 
		//const lakeMater = new THREE.MeshBasicMaterial( { color: 0x8b9a97 } ); 
		//lakeMater.transparent = true; 
		lakeMater.alphaTest = .5; 
		lakeMater.wireframe = true; 
		
		const lakeMask = new THREE.Mesh( lakeGeom, lakeMater ); 
		lakeMask.position.set(222, 15.5, -196.7); 
		//lakeMask.position.set(222, 16.8, -196.7); 
		lakeMask.rotation.set(Math.PI/-2, 0, 0); 
		grups[0].add( lakeMask );
		
		//const loadLC = new THREE.TextureLoader(),  
		const loadLM = new THREE.TextureLoader(); 
	
		//loadLC.load( url2 + 'test.jpg', function(txLC) { 
		//	lakeMater.map = txLC; 
		//	lakeMater.needsUpdate = true; 
		//	
		//	lakeMater.wireframe = false; 
		//}); 
	
		loadLM.load( url2 + 'alfa3b.jpg', function(txLM) { 
			lakeMater.alphaMap = txLM; 
			lakeMater.needsUpdate = true; 
			
			lakeMater.wireframe = false; 
		}); 
		
		addSea(); 
		//fadeScene(); 
	}); 
}	



function addSea() {
	//x.sea; 
	
	const waterGeometry = new THREE.PlaneGeometry( 800, 1067 );

	x.sea = new Water(
		waterGeometry,
		{
			textureWidth: 600,
			textureHeight: 800,
			//waterNormals: new THREE.TextureLoader().load( 'img/water/soft.jpg', function ( texture ) {
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x000000, 
			distortionScale: 13,
			//size: .1,
			fog: scene.fog !== undefined
		}
	);

	x.sea.position.set(220, 15, -210);
	//x.sea.position.set(220, 27, -210);
	x.sea.rotation.x = - Math.PI / 2;
	x.sea.rotation.z = - .08;

	scene.add( x.sea );	
	
	const waterUniforms = x.sea.material.uniforms;
	//waterUniforms['size'].value = .011; 
	waterUniforms['size'].value = .04; 
	
	addPath(); 
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

function addPath() {
	const curve = new THREE.CatmullRomCurve3( [
		new THREE.Vector3(-316.5808140702278, 256.4744522790937, -324.91650768606974),
		new THREE.Vector3(67.45237648150055, 471.1285811278058, -1129.5967237462055),
		new THREE.Vector3(862.1581789974574, 585.9987960223925, -291.33382028178585),
		new THREE.Vector3(1073.5003155909974, 616.1989419474692, 1204.873524919489),
		new THREE.Vector3(-423.4966040412753, 459.3841182725514, 1337.1044679724512),
		new THREE.Vector3(-1340.4623153573584, 667.9456156944927, 890.1854662853599)
	] ); 
	
	curve.curveType = 'centripetal';
	//curve.curveType = 'chordal';
	//curve.curveType = 'catmullrom';
	curve.closed = true;
	
	x.points = curve.getPoints( 2000 );
	
	//const line = new THREE.LineLoop(
	//	new THREE.BufferGeometry().setFromPoints( x.points ),
	//	new THREE.LineBasicMaterial( { color: 0x00ff00 } )
	//);
    //
	//scene.add( line );

	x.camFlight = 0; 
	x.ptsLength = x.points.length; 
	
	//console.log(x.points);
	
	fadeScene(); 
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

//	if (!isMobil) {
		ui.swtchKam.style.visibility = "visible"; 	
//	} else {
	//	ui.swtchKam.style.display = "none"; 
//	}
	
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
	
	x.camGrup.rotation.set(0, 0, 0);  
	camera.position.x = 0; 
	
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
	
//	camera.position.z = x.zz; 
	
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
		
		//x.camGrup.rotation.y = Math.sin(timer*.5) * Math.PI; 
		//x.camGrup.rotation.x = Math.sin(_.pointer.y/4) * Math.PI; 
		//camera.position.y = (_.pointer.y * 400) + 470; 
		//camera.position.z = Math.abs(camera.position.y) * 5; 
		

		if (x.rotCam) {
			if (x.camFlight >= 0) {
				if ((x.camFlight % 1) == 0) {
					const xcF = Math.round(x.camFlight); 
					
					camera.position.set(x.points[xcF].x, x.points[xcF].y, x.points[xcF].z); 
					
					//if ((x.camFlight+1) < x.ptsLength) camera.lookAt(x.points[x.camFlight+1]); 
					if ((xcF-1) >= 0) camera.lookAt(x.points[xcF-1]); 
				}
				
				x.camFlight -= .5; 
				
			} else {
				x.camFlight = x.ptsLength-1; 
			}
		} else {
			if (isMobil) {
				x.camGrup.rotation.y = Math.sin(timer*.08) * Math.PI; 
				camera.position.y = (Math.cos(timer*.1) + .88) * 500 + 100; 
				camera.position.z = (Math.cos(timer*.1) + 1) * 830 + 220; 
			} else {
				x.camGrup.rotation.y = Math.sin(_.pointer.x) * Math.PI; 
				camera.position.y = (_.pointer.y + 1) * 500 + 40; 
				camera.position.z = (_.pointer.y + 1) * 830 + 220; 
			}
			
			camera.lookAt(x.target0.position); 
		}

		//const camRotY = camera.rotation.y; 
		//camera.rotation.x = Math.sin(timer*.1) * Math.PI/4; 
		//camera.rotation.y = Math.sin(timer*.1) * Math.PI; 
		//camera.rotation.z = Math.sin(timer*.1) * Math.PI/4; 
		//camera.rotation.y = camRotY + _.pointer.x * 1; 
		
		
		x.sea.material.uniforms[ 'time' ].value -= .001; 
		
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
	//x.Sun.lookAt(camera.getWorldPosition(x.camV3));

//	camera.lookAt(x.target0.position);
	
	
	//x.mGlow.lookAt(camera.position); 	
	
	//x.mGlow.lookAt(camera.getWorldPosition(x.camV3)); 	

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//const delta = clock.getDelta();
	//controls.movementSpeed = 100;
	//controls.update(delta); 
	
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
		//let url = 'bdrm'; 			
		let url = 'mntns'; 			
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
	
	