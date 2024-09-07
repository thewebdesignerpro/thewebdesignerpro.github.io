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
	
	//kontainer.style.background = "url('img/thewebdesignerprol.jpg') center top no-repeat"; 
	kontainer.style.background = "url('img/busstopl.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#707476';		

	const fogCol = 0x707476; 
//	const fogCol = 0x909496; 

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
	
	x.xx = 20; 

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
	scene.fog = new THREE.FogExp2(fogCol, 0.01);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 10000 );
	//camera.position.set(0, 0, 500); 
//	camera.position.set(0, _.ej[5], -100); 
	camera.position.set(0, _.ej[5], 50); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x777777 ) );		

//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 100000, 250, Math.PI/10, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffffff, 90000, 250, Math.PI/10, 1 );
	x.spotLight[0].position.set( 0, 100, 100 );
	//x.spotLight[0].position.set( 0, 100, 80 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
//	x.spotLight[0].shadow.mapSize.width = 1024;
//	x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 250;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .7;
	
	scene.add( x.spotLight[0] );	
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
	
	scene.add( x.spotLight[1] );	


	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[1] );
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
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    controls.autoRotate = false;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .8;
    controls.zoomSpeed = 5;
    controls.panSpeed = 4;
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
	x.targetO.position.set(0, 0, x.camGrup.position.z + 20); 
	scene.add(x.targetO);
	
	x.spotLight[0].target = x.targetO; 
	
	x.target1 = new THREE.Object3D(); 
//	x.target1.position.set(0, 0, x.camGrup.position.z - 1); 
	x.target1.position.set(0, 0, x.camGrup.position.z); 
	scene.add(x.target1);
	
	x.spotLight[1].target = x.target1; 
	
//	controls.target = x.targetO.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[1] );
	//scene.add( x.spotLightHelper );	
	
	addSkybox(); 
	addClouds(); 
	//addFog(); 	
	//addBusStop(); 
	addGround(); 
	addWall(); 
	addSidewalk(); 
	addTrash(); 
	addHydrant(); 
	addDrain(); 
	addManhole(); 
	//addTrees(); 
	//addLamps(); 
	
	//animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	const f = '.png'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/2/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
	], function ( tx ) {
		//tx.flipY = true; 
		//tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		//scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addFog(); 
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
	
function addClouds() {
	const geometry = new THREE.SphereGeometry( 4900, 24, 12, 0, Math.PI ); 
	const material = new THREE.MeshBasicMaterial( { color: 0xe0e4e6, side: THREE.BackSide, fog: false } ); 
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

function randMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 400 - 200; 
		
//	if ((posx > -175) && (posx < 175)) {
//		let rnd = Math.random() < 0.5 ? -1 : 1;

//		posx = 182 * rnd; 
		//console.log(posx);
//	}
		
	position.x = posx;
	//position.y = Math.random() * -500 + florY;
	position.y = Math.random() * 4 + 13;
	//position.y = 13;
	//position.z = Math.random() * 2000 - 1000;
	position.z = Math.random() * - 30 + 25;
	//position.z = 15;

/*	rotation.x = Math.random() * (Math.PI/4);
	if (position.y < 0) rotation.x *= -1; 
	
	//rotation.y = (Math.random() * .2 - .1) * Math.PI;
	rotation.y = Math.random() * (Math.PI/4);
	if (position.x > 0) rotation.y *= -1; 
	
	if (position.z > 0) rotation.y *= -1; 
*/	
	rotation.z = Math.random() * 2 * Math.PI;	

	quaternion.setFromEuler( rotation );

	const scl = Math.random() * .1 + 1; 
	//const scl = 1; 
	scale.x = scale.y = scl; 
		
	return matrix.compose( position, quaternion, scale );
}

function addFog() {
	//x.fog = []; 
	let matrix = []; 
	x.batchedMesh = []; 	
	x.material = []; 	
	let geometry = []; 
	
	geometry[0] = new THREE.PlaneGeometry( 40, 40 ); 
	geometry[1] = new THREE.PlaneGeometry( 40, 40 ); 
	//const geometry = new THREE.PlaneGeometry( 40, 40 ); 
	//x.material[0] = new THREE.MeshBasicMaterial( { color: 0x909496, transparent: true } );
	x.material[0] = new THREE.MeshBasicMaterial( { color: 0x909496, transparent: true, fog: true } );
	x.material[1] = new THREE.MeshBasicMaterial( { color: 0x808486, transparent: true, fog: true } );
	x.material[0].depthWrite = x.material[1].depthWrite = false; 
	x.material[0].opacity = x.material[1].opacity = .9; 
	//x.material[0].side = THREE.DoubleSide; 
	//console.log(geometry.attributes.position.array.length);
	
	for ( let i = 0; i < 2; i++ ) {	
		const lngth = geometry[i].attributes.position.array.length; 
		//const lngth = 12; 
		
		x.batchedMesh[i] = new THREE.BatchedMesh( 150, lngth, lngth * 2, x.material[i] );
		x.batchedMesh[i].frustumCulled = true;
		//x.batchedMesh[i].castShadow = true;
		//x.batchedMesh[i].receiveShadow = true;
		
		const geometryId = x.batchedMesh[i].addGeometry( geometry[i] );
		
		//matrix[i-2] = new THREE.Matrix4(); 
		matrix[i] = new THREE.Matrix4(); 
		
		for ( let j = 0; j < 150; j ++ ) {
			const instancedId = x.batchedMesh[i].addInstance( geometryId );
		
			//x.batchedMesh[i].setMatrixAt( instancedId, randMatrix( matrix[i-2] ) ); 
			x.batchedMesh[i].setMatrixAt( instancedId, randMatrix( matrix[i] ) ); 
		}
		
		x.batchedMesh[i].position.x = 200; 
		
		//grups[i-2].add(x.batchedMesh[i]); 
		grups[0].add(x.batchedMesh[i]); 
	}			
	
	let	loader = new THREE.TextureLoader();   
		//loader2 = new THREE.TextureLoader(); 
	
	loader.load( 'img/ulap5.png', function(tx) { 	
		x.material[0].map = x.material[1].map = tx; 
		x.material[0].alphaMap = x.material[1].alphaMap = tx; 
		x.material[0].needsUpdate = x.material[1].needsUpdate = true;
		//x.fog[k].visible = true; 
		
		addBusStop(); 
	}); 
	
	//fadeScene(); 
}

function addBusStop() {
	let meshCount = 0; 
	x.busstop = [];
	//x.batchedMesh = []; 	
	//x.material = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/busstop/1/busstop.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.busstop.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: .7 } );
			material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			material[i].envMap = x.skybox; 			
			material[i].envMapIntensity = .5; 	
			
			x.busstop[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.busstop[i].castShadow = true; 
			x.busstop[i].receiveShadow = true; 			
			
		//	x.busstop[i].position.set(0, florY+10.12, 0); 
			x.busstop[i].position.set(-1.79, florY+11.5, 0); 
			//x.busstop[i].position.set(0, 0, 1.5); 
			x.busstop[i].rotation.set(Math.PI/-2.12, 0, 0); 
			x.busstop[i].scale.set(4, 2.4, 1); 
		
			grups[0].add( x.busstop[i] );		
		}		

		const geom = new THREE.PlaneGeometry( 9.3, 16.5 );
		const mater = new THREE.MeshStandardMaterial( { color: 0xe5e5e5, roughness: .15, metalness: .1, transparent: true, opacity: .7 } );
		mater.envMap = x.skybox; 			
		mater.envMapIntensity = .88;  
		const Pane = new THREE.Mesh( geom, mater ); 
		Pane.position.set(-16.3, 1.885, -1.7); 
		Pane.rotation.y = Math.PI/-2; 
		Pane.receiveShadow = true; 	
		grups[0].add( Pane ); 
	
		const geom2 = new THREE.PlaneGeometry( 32.4, 16.5 );
		const Pane2 = new THREE.Mesh( geom2, mater ); 
		Pane2.position.set(.06, 1.885, -6.75); 
		Pane2.rotation.y = Math.PI; 
		grups[0].add( Pane2 ); 
	
		const geom3 = new THREE.PlaneGeometry( 6, 6 ); 
		const mater2 = new THREE.MeshBasicMaterial( { color: 0xfff4d4, transparent: true, fog: false, depthWrite: false } );
		x.spot = new THREE.Mesh( geom3, mater2 ); 
	//	x.spot.position.set(0, 10.7, -1); 
		x.spot.position.set(0, 10.7, 0); 
		x.spot.rotation.x = Math.PI/2; 
		grups[0].add( x.spot ); 
	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(),  
			load7 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/busstop/1/mat/color2.jpg', function(tx) { 
		//load1.load( 'obj/busstop/1/mat/temp.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.busstop[0].material.map = tx; 
				x.busstop[0].material.needsUpdate = true; 
			//}
			//x.busstop.visible = true; 
		}); 			

		load2.load( 'obj/busstop/1/mat/rough4.jpg', function(tx2) { 
		//load2.load( 'obj/busstop/1/mat/temp2.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.busstop[0].material.roughnessMap = tx2; 
				x.busstop[0].material.needsUpdate = true; 
			//}
			//x.busstop.visible = true; 
		}); 			

		load3.load( 'obj/busstop/1/mat/normal2.jpg', function(tx3) { 
		//load3.load( 'obj/busstop/1/mat/temp4.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				//x.busstop[0].material.normalScale.set(2, 2); 
				x.busstop[0].material.normalMap = tx3; 
				x.busstop[0].material.needsUpdate = true; 
			//}
			//x.busstop.visible = true; 
		}); 			
	
		load4.load( 'obj/busstop/1/mat/metal3.jpg', function(tx4) { 
		//load4.load( 'obj/busstop/1/mat/temp3.jpg', function(tx4) { 
			x.busstop[0].material.metalnessMap = tx4; 
			x.busstop[0].material.needsUpdate = true; 
		}); 			

		load5.load( 'obj/busstop/1/mat/alpha3.jpg', function(tx5) { 
			x.busstop[0].material.alphaMap = tx5; 
			x.busstop[0].material.needsUpdate = true; 
		}); 			

		load6.load( 'obj/busstop/1/mat/light1.jpg', function(tx6) { 
			x.busstop[0].material.lightMapIntensity = 1; 
			x.busstop[0].material.lightMap = tx6; 
			x.busstop[0].material.needsUpdate = true; 
		}); 			

		load7.load( 'img/spotL1.jpg', function(tx7) { 
			x.spot.material.map = x.spot.material.alphaMap = tx7; 
			x.spot.material.needsUpdate = true; 
		}); 			

		addTrees(); 
		//fadeScene(); 
	}); 

	//grups[0].position.set(0, 0, 0);
	
	scene.add(grups[0]); 	
	
	//fadeScene(); 
}
	
function addGround() {
	x.floor = []; 
	x.floorShadow = []; 
	
	const width = 350, 
		height = 175,  
		width2 = 350, 
		height2 = 175,  
		posX = 0, 
		//intrvl = 10000, 
		kolor = 0xc0c0c0; 
		
	const geometry = new THREE.PlaneGeometry( width, height );
	const geometry2 = new THREE.PlaneGeometry( width2, height2 );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .82, metalness: .5, transparent: true } );
	//let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	//let material = new THREE.MeshLambertMaterial( { color: kolor, transparent: true, opacity: .44 } );
	let material2 = new THREE.ShadowMaterial( { color: 0x000000, transparent: true, opacity: .75 } );
	//material.depthWrite = false; 
	//material.side = THREE.DoubleSide; 
	//material.wireframe = true; 
	
	for ( let i = 0; i < 1; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
	//	let pozZ = height - height*i; 
		//let pozZ = 103.5; 
		let pozZ = 99.8; 
	
		x.floor[i] = new THREE.Mesh( geometry, material ); 
		x.floorShadow[i] = new THREE.Mesh( geometry2, material2 ); 
		
		//console.log(pozZ);
		x.floor[i].position.set(0, florY, pozZ);
		x.floorShadow[i].position.set(0, florY+.1, pozZ);
		//x.floor[i].position.set(0, florY, 0);
		x.floor[i].rotation.x = Math.PI*-.5;
		x.floor[i].rotation.z = Math.PI;
		x.floorShadow[i].rotation.x = Math.PI*-.5;
		//x.floor[i].castShadow = true; 
	//	x.floor[i].receiveShadow = true; 
		x.floorShadow[i].receiveShadow = true; 
		
		//scene.add( x.floor[i] ); 
		//scene.add( x.floor[i] ); 
		//scene.add( x.floorShadow[i] ); 		
		grups[0].add( x.floor[i] ); 
		grups[0].add( x.floorShadow[i] ); 
		//grups[1].position.z = pozZ; 
		
		//x.spotLight[i].target = x.floor[i];	
	}
	
	//grups[1].position.z = 0; 

	const txU = 8, txV = 4; 
	
	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader(), 
		loader5 = new THREE.TextureLoader();

	//loader.load( 'img/asphalt/1/1K-asphalt_13_basecolor.png', function(tx) { 	
	loader.load( 'img/asphalt/1/color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(1600, 1600);    
		tx.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.floor[j].material.map = tx; 
			//x.floorShadow[j].material.map = tx; 
			//x.floor[j].material.emissiveMap = tx; 
			//x.floor[j].material.envMap = x.skybox; 
			//x.floor[j].material.envMapIntensity = 1; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx; 
			//x.floor[j].material.roughnessMap = tx; 
			x.floor[j].material.needsUpdate = true;
			//x.floorShadow[j].material.needsUpdate = true;
			//x.floor[j].visible = true; 
		}
	});  		

	//loader2.load( 'img/asphalt/1/1K-asphalt_13_roughness.png', function(tx2) { 	
	loader2.load( 'img/asphalt/1/rough1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(txU, txV);    
		
		x.floor[0].material.roughnessMap = tx2; 
		x.floor[0].material.needsUpdate = true;
	});		
	
	//loader3.load( 'img/asphalt/1/1K-asphalt_13_normal.png', function(tx3) { 	
	loader3.load( 'img/asphalt/1/normal1.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			//x.floor[l].material.bumpScale = 25.; 
			//x.floor[l].material.bumpMap = tx3; 
			//x.floor[l].material.displacementScale = 10; 
			//x.floor[l].material.displacementBias = -5; 
			//x.floor[l].material.displacementMap = tx3; 
			//x.floor[l].material.roughnessMap = tx3; 
			//x.floor[l].material.normalScale.set(1.3, 1.3); 
			x.floor[l].material.normalMap = tx3; 			
			x.floor[l].material.needsUpdate = true;
		}
	});		
	
	loader4.load( 'img/asphalt/1/metal1.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(txU, txV);    
		
		//x.floor[0].material.aoMapIntensity = 10; 
		x.floor[0].material.metalnessMap = tx4; 
		x.floor[0].material.needsUpdate = true;
	});	
	
	loader5.load( 'img/opactop.png', function(tx5) { 	
		//tx5.wrapS = tx5.wrapT = THREE.RepeatWrapping;    
		tx5.wrapS = tx5.wrapT = THREE.MirroredRepeatWrapping;    
		tx5.repeat.set(1, 2);    
		tx5.flipY = false; 
		
		x.floor[0].material.alphaMap = tx5;		
		x.floor[0].material.needsUpdate = true;
	});	
	
}

function addWall() {
	x.wall = []; 
	x.wallShadow = []; 
	
	const width = 350, 
		height = 28,  
		width2 = 350, 
		height2 = 28,  
		posX = 0, 
		//intrvl = 10000, 
		kolor = 0xe2e2e2; 
		
	const geometry = new THREE.PlaneGeometry( width, height );
	const geometryb = new THREE.PlaneGeometry( width, 4 );
	const geometry2 = new THREE.PlaneGeometry( width2, height2 );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .75, metalness: 0, transparent: true } );
	let materialb = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: .2 } );
	//let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	//let material = new THREE.MeshLambertMaterial( { color: kolor, transparent: true, opacity: .44 } );
	let material2 = new THREE.ShadowMaterial( { color: 0x000000, transparent: true, opacity: .75 } );
	//material.depthWrite = false; 
	//material.side = THREE.DoubleSide; 
	//material.wireframe = true; 
	
	for ( let i = 0; i < 1; i++ ) {	
		//let pozZ = height*.5; 
	//	let pozZ = height*i + intrvl - (i*1); 
	//	let pozZ = -(height-1) + (height-1)*i; 
	//	let pozZ = height - height*i; 
		let pozZ = -21; 
	
		x.wall[i] = new THREE.Mesh( geometry, material ); 
		x.wallShadow[i] = new THREE.Mesh( geometry2, material2 ); 
		
		//console.log(pozZ);
		x.wall[i].position.set(0, florY+(height/2)+1.4, pozZ);
		x.wallShadow[i].position.set(0, florY+(height/2)+1.4, pozZ+.1);
		//x.wall[i].position.set(0, florY, 0);
		//x.wall[i].rotation.x = Math.PI*-.5;
		//x.wallShadow[i].rotation.x = Math.PI*-.5;
		//x.wall[i].castShadow = true; 
	//	x.wall[i].receiveShadow = true; 
		x.wallShadow[i].receiveShadow = true; 
		
		//scene.add( x.wall[i] ); 
		//scene.add( x.wall[i] ); 
		//scene.add( x.wallShadow[i] ); 		
		grups[0].add( x.wall[i] ); 
		grups[0].add( x.wallShadow[i] ); 
		//grups[1].position.z = pozZ; 
		
		//x.spotLight[i].target = x.wall[i];	
	}
	
	x.wall[1] = new THREE.Mesh( geometryb, materialb ); 
	x.wall[1].position.set(0, florY+(height)+.5, -23);
	x.wall[1].rotation.x = Math.PI*-.5;
	grups[0].add( x.wall[1] ); 
	
	//grups[1].position.z = 0; 

	const txU = 11.67, txV = 1; 
	
	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	//loader.load( 'img/wall/1/Bricks043_1K-JPG_Color.jpg', function(tx) { 	
	loader.load( 'img/wall/1/color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(1600, 1600);    
		tx.repeat.set(txU, txV);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.wall[j].material.map = tx; 
			//x.wallShadow[j].material.map = tx; 
			//x.wall[j].material.emissiveMap = tx; 
			//x.wall[j].material.envMap = x.skybox; 
			//x.wall[j].material.envMapIntensity = 1; 
			//x.wall[j].material.aoMap = tx; 			
			//x.wall[j].material.bumpMap = tx; 
			//x.wall[j].material.normalScale.set(-.8, -.8); 
			//x.wall[j].material.normalMap = tx; 
			//x.wall[j].material.roughnessMap = tx; 
			x.wall[j].material.needsUpdate = true;
			//x.wallShadow[j].material.needsUpdate = true;
			//x.wall[j].visible = true; 
		}
	});  		

	//loader2.load( 'img/wall/1/Bricks043_1K-JPG_Roughness.jpg', function(tx2) { 	
	loader2.load( 'img/wall/1/rough1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(txU, txV);    
		
		x.wall[0].material.roughnessMap = tx2; 
		x.wall[0].material.needsUpdate = true;
	});		
	
	//loader3.load( 'img/wall/1/Bricks043_1K-JPG_NormalGL.jpg', function(tx3) { 	
	loader3.load( 'img/wall/1/normal1.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.wall[l].material.aoMapIntensity = 1; 
			//x.wall[l].material.aoMap = tx3; 
			//x.wall[l].material.bumpScale = 25.; 
			//x.wall[l].material.bumpMap = tx3; 
			//x.wall[l].material.displacementScale = 10; 
			//x.wall[l].material.displacementBias = -5; 
			//x.wall[l].material.displacementMap = tx3; 
			//x.wall[l].material.roughnessMap = tx3; 
			x.wall[l].material.normalScale.set(5, 5); 
			x.wall[l].material.normalMap = tx3; 			
			x.wall[l].material.needsUpdate = true;
		}
	});		
	
	loader4.load( 'img/opactop.png', function(tx4) { 	
		//tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(txU/3.7, .96);    
		
		x.wall[0].material.alphaMap = tx4;		
		x.wall[0].material.needsUpdate = true;
	});	
	
}

function addSidewalk() {
	x.sidewalk = []; 
	x.sidewalkShadow = []; 
	let geometry = []; 
	let geometry2 = []; 
	let material = []; 
	let material2 = []; 
	//let height = [12, .3, 1.23, 30]; 
	let height = [12, .3, 2.46, 30]; 
	let height2 = []; 
	
	const width = 350, 
		//height = 350,  
		width2 = 350, 
		//height2 = 350,  
		posX = 0, 
		//intrvl = 10000, 
		kolor = [0xa0a0a0, 0x999999, 0xa0a0a0, 0x959595]; 
		
	//height[0] = 12
	//height2[0] = 12;
	
	//height[1] = .3;
	//height2[1] = .3;
	
	//height[2] = 1.23;
	//height2[2] = 1.23;
	
	let rotX = [Math.PI*-.5, Math.PI*-.25, 0, Math.PI*-.5]; 
	//let pozX = [0, 0, 0]; 
	//let pozY = [-8.6, -8.67, -9.35, -8.62]; 
	let pozY = [-8.6, -8.67, -10, -8.62]; 
	let pozZ = [10, 16.08, 16.19, -11]; 
	
	let rof = [.6, .58, .6, .77]; 
	
	for ( let i = 0; i < 4; i++ ) {	
		geometry[i] = new THREE.PlaneGeometry( width, height[i] );
		geometry2[i] = new THREE.PlaneGeometry( width2, height[i] );		
		
		material[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: rof[i], metalness: 0 } );
		material2[i] = new THREE.ShadowMaterial( { color: 0x000000, transparent: true, opacity: .75 } );
	
		x.sidewalk[i] = new THREE.Mesh( geometry[i], material[i] ); 
		x.sidewalkShadow[i] = new THREE.Mesh( geometry2[i], material2[i] ); 
		
		x.sidewalk[i].position.set(0, pozY[i]-.1, pozZ[i]+.1);
		x.sidewalkShadow[i].position.set(0, pozY[i], pozZ[i]+.1);
		x.sidewalk[i].rotation.x = rotX[i];
		x.sidewalkShadow[i].rotation.x = rotX[i];
		if (i==0) x.sidewalk[i].castShadow = true; 
	//	x.sidewalk[i].receiveShadow = true; 
		x.sidewalkShadow[i].receiveShadow = true; 
		
		if (i==0) x.sidewalk[i].rotation.z = Math.PI; 
		
		grups[0].add( x.sidewalk[i] ); 
		grups[0].add( x.sidewalkShadow[i] ); 
	}
	
	//grups[1].position.z = 0; 

	const txU = 6, txV = 6; 
	
	var	loader = new THREE.TextureLoader(), 
		loaderb = new THREE.TextureLoader(), 
		loaderc = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader2b = new THREE.TextureLoader(),   
		loader2c = new THREE.TextureLoader();

	//loader.load( 'img/asphalt/2/1K-asphalt_yellow_paint-diffuse.jpg', function(tx) { 	
	loader.load( 'img/asphalt/2/color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(1600, 1600);    
		tx.repeat.set(29.17, 1);    
		
		//for ( let j = 0; j < 1; j++ ) {	
			x.sidewalk[0].material.map = x.sidewalk[3].material.map = tx; 
			//x.sidewalkShadow[j].material.map = tx; 
			//x.sidewalk[j].material.emissiveMap = tx; 
			//x.sidewalk[j].material.envMap = x.skybox; 
			//x.sidewalk[j].material.envMapIntensity = 1; 
			//x.sidewalk[j].material.aoMap = tx; 			
			//x.sidewalk[j].material.bumpMap = tx; 
			//x.sidewalk[j].material.normalScale.set(-.8, -.8); 
			//x.sidewalk[j].material.normalMap = tx; 
			//x.sidewalk[j].material.roughnessMap = tx; 
			x.sidewalk[0].material.needsUpdate = x.sidewalk[3].material.needsUpdate = true;
			//x.sidewalkShadow[j].material.needsUpdate = true;
			//x.sidewalk[j].visible = true; 
		//}
	});  		
	
	//loaderb.load( 'img/asphalt/2/1K-asphalt_yellow_paint-specular.jpg', function(txb) { 	
	loaderb.load( 'img/asphalt/2/rough0.jpg', function(txb) { 	
		txb.wrapS = txb.wrapT = THREE.RepeatWrapping;    
		txb.repeat.set(29.17, 1);    
		
		x.sidewalk[0].material.roughnessMap = x.sidewalk[3].material.roughnessMap = txb; 
		x.sidewalk[0].material.needsUpdate = x.sidewalk[3].material.needsUpdate = true;
	});  		

	loaderc.load( 'img/asphalt/2/normal1.jpg', function(txc) { 	
		txc.wrapS = txc.wrapT = THREE.RepeatWrapping;    
		txc.repeat.set(29.17, 1);    
		
		//x.sidewalk[0].material.normalScale.set(1.3, 1.3); 
		//x.sidewalk[3].material.normalScale.set(1.3, 1.3); 
		x.sidewalk[0].material.normalMap = x.sidewalk[3].material.normalMap = txc; 
		x.sidewalk[0].material.needsUpdate = x.sidewalk[3].material.needsUpdate = true;
	});  		

	loader2.load( 'img/asphalt/2/yellow1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.repeat.set(28.5, 1);    
		tx2.repeat.set(14.25, 1);    
		
		x.sidewalk[1].material.map = x.sidewalk[2].material.map = tx2; 
		x.sidewalk[1].material.needsUpdate = x.sidewalk[2].material.needsUpdate = true;
	});		
	
	loader2b.load( 'img/asphalt/2/rough12.jpg', function(tx2b) { 	
		tx2b.wrapS = tx2b.wrapT = THREE.RepeatWrapping;    
		//tx2b.repeat.set(28.5, 1);    
		tx2b.repeat.set(14.25, 1);    
		
		x.sidewalk[1].material.roughnessMap = x.sidewalk[2].material.roughnessMap = tx2b; 
		x.sidewalk[1].material.needsUpdate = x.sidewalk[2].material.needsUpdate = true;
	});  		

	loader2c.load( 'img/asphalt/2/normal12.jpg', function(tx2c) { 	
		tx2c.wrapS = tx2c.wrapT = THREE.RepeatWrapping;    
		//tx2c.repeat.set(28.5, 1);    
		tx2c.repeat.set(14.25, 1);    
		
		//x.sidewalk[2].material.normalScale.set(1.3, 1.3); 
		x.sidewalk[1].material.normalMap = x.sidewalk[2].material.normalMap = tx2c; 
		x.sidewalk[1].material.needsUpdate = x.sidewalk[2].material.needsUpdate = true;
	});  		
	
/*	loader3.load( 'img/asphalt/2/1K-asphalt_13_normal.jpg', function(tx3) { 	
	//loader3.load( 'img/ground/1/normal2.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(txU, txV);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.sidewalk[l].material.aoMapIntensity = 1; 
			//x.sidewalk[l].material.aoMap = tx3; 
			//x.sidewalk[l].material.bumpScale = 25.; 
			//x.sidewalk[l].material.bumpMap = tx3; 
			//x.sidewalk[l].material.displacementScale = 10; 
			//x.sidewalk[l].material.displacementBias = -5; 
			//x.sidewalk[l].material.displacementMap = tx3; 
			//x.sidewalk[l].material.roughnessMap = tx3; 
			//x.sidewalk[l].material.normalScale.set(1.3, 1.3); 
			x.sidewalk[l].material.normalMap = tx3; 			
			x.sidewalk[l].material.needsUpdate = true;
		}
	});		
*/	
	/*loader4.load( 'img/asphalt/2/2K-ground_cracked-displacement.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(5, 5);    
		
		x.sidewalk[0].material.bumpScale = 10; 
		//x.sidewalk[0].material.bumpMap = tx4; 
		x.sidewalk[0].material.needsUpdate = true;
	});	*/
	
}

function addTrash() {
	let meshCount = 0; 
	x.trash = [];

	const loader = new OBJLoader();
	
	loader.load( 'obj/trash/2/trash.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.trash.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: 0xcccccc, roughness: .8, metalness: .65 } );
			//material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			material[i].envMap = x.skybox; 			
			material[i].envMapIntensity = 1; 	
			
			x.trash[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.trash[i].castShadow = true; 
			x.trash[i].receiveShadow = true; 			
			
			x.trash[i].position.set(-28, florY+1.5, -1); 
			//x.trash[i].rotation.set(0, -1.5, 0); 
			x.trash[i].scale.set(.25, .25, .25); 
		
			grups[0].add( x.trash[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/trash/2/mat/color2.jpg', function(tx) { 
		//load1.load( 'obj/trash/2/mat/temp.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.trash[0].material.map = tx; 
				x.trash[0].material.needsUpdate = true; 
			//}
			//x.trash.visible = true; 
		}); 			

		load2.load( 'obj/trash/2/mat/rough2.jpg', function(tx2) { 
		//load2.load( 'obj/trash/2/mat/temp2.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.trash[0].material.roughnessMap = tx2; 
				x.trash[0].material.needsUpdate = true; 
			//}
			//x.trash.visible = true; 
		}); 			

		load3.load( 'obj/trash/2/mat/normal2.jpg', function(tx3) { 
		//load3.load( 'obj/trash/2/mat/temp4.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.trash[0].material.normalScale.set(2, 2); 
				x.trash[0].material.normalMap = tx3; 
				x.trash[0].material.needsUpdate = true; 
			//}
			//x.trash.visible = true; 
		}); 			
	
		load4.load( 'obj/trash/2/mat/metal2.jpg', function(tx4) { 
		//load4.load( 'obj/trash/2/mat/temp3.jpg', function(tx4) { 
			x.trash[0].material.metalnessMap = tx4; 
			x.trash[0].material.needsUpdate = true; 
		}); 			

/*		load5.load( 'obj/trash/2/mat/alpha3.jpg', function(tx5) { 
			x.trash[0].material.alphaMap = tx5; 
			x.trash[0].material.needsUpdate = true; 
		}); 			

		load6.load( 'obj/trash/2/mat/light1.jpg', function(tx6) { 
			x.trash[0].material.lightMapIntensity = 1; 
			x.trash[0].material.lightMap = tx6; 
			x.trash[0].material.needsUpdate = true; 
		}); 			
*/
	}); 

}

function addHydrant() {
	let meshCount = 0; 
	x.hydrant = [];

	const loader = new OBJLoader();
	
	loader.load( 'obj/hydrant/1/hydrant.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.hydrant.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: 0xd4d4d4, roughness: .8, metalness: .2 } );
			//material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			material[i].envMap = x.skybox; 			
			material[i].envMapIntensity = 1; 	
			
			x.hydrant[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.hydrant[i].castShadow = true; 
			x.hydrant[i].receiveShadow = true; 			
			
		//	x.hydrant[i].position.set(0, florY+10.12, 0); 
			x.hydrant[i].position.set(28, florY+4.56, -.64); 
			x.hydrant[i].rotation.set(0, Math.PI/-2, 0); 
			x.hydrant[i].scale.set(2.64, 2.64, 2.64); 
		
			grups[0].add( x.hydrant[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/hydrant/1/mat/color2.jpg', function(tx) { 
		//load1.load( 'obj/hydrant/1/mat/c0.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.hydrant[0].material.map = tx; 
				x.hydrant[0].material.needsUpdate = true; 
			//}
			//x.hydrant.visible = true; 
		}); 			

		load2.load( 'obj/hydrant/1/mat/rough1.jpg', function(tx2) { 
		//load2.load( 'obj/hydrant/1/mat/c1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.hydrant[0].material.roughnessMap = tx2; 
				x.hydrant[0].material.needsUpdate = true; 
			//}
			//x.hydrant.visible = true; 
		}); 			

		load3.load( 'obj/hydrant/1/mat/normal1.jpg', function(tx3) { 
		//load3.load( 'obj/hydrant/1/mat/c2.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.hydrant[0].material.normalScale.set(1.4, 1.4); 
				x.hydrant[0].material.normalMap = tx3; 
				x.hydrant[0].material.needsUpdate = true; 
			//}
			//x.hydrant.visible = true; 
		}); 			
	
		load4.load( 'obj/hydrant/1/mat/metal1.jpg', function(tx4) { 
			x.hydrant[0].material.metalnessMap = tx4; 
			x.hydrant[0].material.needsUpdate = true; 
		}); 			

/*		load5.load( 'obj/hydrant/1/mat/alpha3.jpg', function(tx5) { 
			x.hydrant[0].material.alphaMap = tx5; 
			x.hydrant[0].material.needsUpdate = true; 
		}); 			

		load6.load( 'obj/hydrant/1/mat/light1.jpg', function(tx6) { 
			x.hydrant[0].material.lightMapIntensity = 1; 
			x.hydrant[0].material.lightMap = tx6; 
			x.hydrant[0].material.needsUpdate = true; 
		}); 			
*/
	}); 

}

function addDrain() {
	let meshCount = 0; 
	x.drain = [];

	const loader = new OBJLoader();
	
	loader.load( 'obj/drain/1/drain.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.drain.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: 0xcccccc, roughness: 1, metalness: .6 } );
			//material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			material[i].envMap = x.skybox; 			
			material[i].envMapIntensity = .7; 	
			
			x.drain[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.drain[i].castShadow = true; 
			x.drain[i].receiveShadow = true; 			
			
		//	x.drain[i].position.set(0, florY+10.12, 0); 
			x.drain[i].position.set(13, florY+.08, 18.4); 
			x.drain[i].rotation.set(-.02, 0, 0); 
			x.drain[i].scale.set(.35, .35, .35); 
		
			grups[0].add( x.drain[i] );		
		}		

		const geom = new THREE.PlaneGeometry( 3.94, 3.08 );
		const mater = new THREE.MeshBasicMaterial( { color: 0x333333 } );
		const Temp = new THREE.Mesh( geom, mater ); 
		Temp.position.set(13, florY+.02, 18.4); 
		Temp.rotation.x = Math.PI/-2 - .02; 
		grups[0].add( Temp ); 	
	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/drain/1/mat/color2.jpg', function(tx) { 
		//load1.load( 'obj/drain/1/mat/c0.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.drain[0].material.map = tx; 
				x.drain[0].material.needsUpdate = true; 
			//}
			//x.drain.visible = true; 
		}); 			

		load2.load( 'obj/drain/1/mat/rough2.jpg', function(tx2) { 
		//load2.load( 'obj/drain/1/mat/c1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.drain[0].material.roughnessMap = tx2; 
				x.drain[0].material.needsUpdate = true; 
			//}
			//x.drain.visible = true; 
		}); 			

		load3.load( 'obj/drain/1/mat/normal2.jpg', function(tx3) { 
		//load3.load( 'obj/drain/1/mat/c2.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				//x.drain[0].material.normalScale.set(2, 2); 
				x.drain[0].material.normalMap = tx3; 
				x.drain[0].material.needsUpdate = true; 
			//}
			//x.drain.visible = true; 
		}); 			
	
		load4.load( 'obj/drain/1/mat/metal2.jpg', function(tx4) { 
			x.drain[0].material.metalnessMap = tx4; 
			x.drain[0].material.needsUpdate = true; 
		}); 			

/*		load5.load( 'obj/drain/1/mat/alpha3.jpg', function(tx5) { 
			x.drain[0].material.alphaMap = tx5; 
			x.drain[0].material.needsUpdate = true; 
		}); 			

		load6.load( 'obj/drain/1/mat/light1.jpg', function(tx6) { 
			x.drain[0].material.lightMapIntensity = 1; 
			x.drain[0].material.lightMap = tx6; 
			x.drain[0].material.needsUpdate = true; 
		}); 			
*/
	}); 

}

function addManhole() {
	let meshCount = 0; 
	x.manhole = [];

	const loader = new OBJLoader();
	
	loader.load( 'obj/manhole/1/manhole.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
	//	const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.manhole.visible = false; 
		
		const kolor = []; 
		kolor[0] = kolor[2] = 0xffffff; 
		kolor[1] = 0xbbbbbb; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: 0xaaaaaa, roughness: .6, metalness: .7 } );
			//material[i].transparent = true;  
			//material[i].side = THREE.DoubleSide; 
			//material[i].reflectivity = .5;		
			material[i].envMap = x.skybox; 			
			material[i].envMapIntensity = .7; 	
			
			x.manhole[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.manhole[i].castShadow = true; 
			x.manhole[i].receiveShadow = true; 			
			
		//	x.manhole[i].position.set(0, florY+10.12, 0); 
			x.manhole[i].position.set(-10, florY-.05, 32); 
			//x.manhole[i].rotation.set(Math.PI/-2.12, 0, 0); 
			x.manhole[i].scale.set(4, 4, 4); 
		
			grups[0].add( x.manhole[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/manhole/1/mat/color2.jpg', function(tx) { 
		//load1.load( 'obj/manhole/1/mat/c0.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.manhole[0].material.map = tx; 
				x.manhole[0].material.needsUpdate = true; 
			//}
			//x.manhole.visible = true; 
		}); 			

		load2.load( 'obj/manhole/1/mat/rough2.jpg', function(tx2) { 
		//load2.load( 'obj/manhole/1/mat/c1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				x.manhole[0].material.roughnessMap = tx2; 
				x.manhole[0].material.needsUpdate = true; 
			//}
			//x.manhole.visible = true; 
		}); 			

		load3.load( 'obj/manhole/1/mat/normal2.jpg', function(tx3) { 
		//load3.load( 'obj/manhole/1/mat/c2.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//for ( let l = 0; l < 1; l++ ) {	
				//x.manhole[0].material.normalScale.set(2, 2); 
				x.manhole[0].material.normalMap = tx3; 
				x.manhole[0].material.needsUpdate = true; 
			//}
			//x.manhole.visible = true; 
		}); 			
	
		load4.load( 'obj/manhole/1/mat/metal2.jpg', function(tx4) { 
			x.manhole[0].material.metalnessMap = tx4; 
			x.manhole[0].material.needsUpdate = true; 
		}); 			

/*		load5.load( 'obj/manhole/1/mat/alpha3.jpg', function(tx5) { 
			x.manhole[0].material.alphaMap = tx5; 
			x.manhole[0].material.needsUpdate = true; 
		}); 			

		load6.load( 'obj/manhole/1/mat/light1.jpg', function(tx6) { 
			x.manhole[0].material.lightMapIntensity = 1; 
			x.manhole[0].material.lightMap = tx6; 
			x.manhole[0].material.needsUpdate = true; 
		}); 			
*/
	}); 

}

function randomizeMatrix( matrix, scl, i ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//let posx = Math.random() * 240 - 120,  
	let posx = [-35, -105, -175, 35, 105, 175 ],  
		posz = Math.random() * -5 - 40; 
		
/*	if ((posz > -73) && (posz < 73) && (posx > -55) && (posx < 55)) {
		//let rnd = Math.random() < 0.5 ? -1 : 1;
		let rnd = posx < 0 ? -1 : 1;

		posx = (Math.random() * 30 + 55) * rnd; 
		
		//posx = 55 * rnd; 
		//console.log(posx);
	}
*/		
	//position.x = 55;
	//position.x = posx;
	position.x = posx[i];
	//position.y = (Math.random() * 100) - 100 + florY;
	position.y = florY + 2.5;
	//position.z = Math.random() * 300 - 150;
	position.z = posz;

	rotation.x = Math.PI/-2;
	rotation.y = 0;
	rotation.z = Math.random() * 2 * Math.PI;
	
	//x.trees[i].position.set(-50, florY+0, -30); 
	//x.trees[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI ); 	

	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = scl + ( Math.random() * .005 );

	return matrix.compose( position, quaternion, scale );

}
	
function addTrees() {
	//let meshCount = 0; 
	x.trees = []; 
	//x.trunks = []; 
	//x.trees = []; 
	x.materials2 = []; 
	//const matrix; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/2/tree1.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				child.geometry.computeVertexNormals();	
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
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		x.materials2[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: 0, transparent: true } );		
		x.materials2[0].depthWrite = false; 
		//material.depthWrite = false; 
		x.materials2[0].side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//for ( let i = 0; i < 2; i++ ) {	
			const lngth1 = object.children[0].geometry.attributes.position.array.length,  
				  qty = 6; 			
		
			x.trees = new THREE.BatchedMesh( qty, lngth1, lngth1 * 2, x.materials2[0] );
			x.trees.frustumCulled = true;
			//x.trees.castShadow = true;
			x.trees.receiveShadow = true;
			
			const geometryId1 = x.trees.addGeometry( object.children[0].geometry );
			
			let matrix = new THREE.Matrix4(); 
			
			for ( let j = 0; j < qty; j ++ ) {
				
				const instancedId1 = x.trees.addInstance( geometryId1 );
			
				//randomizeMatrix( matrix[i] );
				//x.trees.setMatrixAt( instancedId, randomizeMatrix( matrix[i], 19 ) ); 
				
				matrix = randomizeMatrix( matrix, .06, j ); 
				
				x.trees.setMatrixAt( instancedId1, matrix ); 
			}
			
			grups[0].add(x.trees); 
		//}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/trees/2/mat/color1.png', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.materials2[0].map = tx; 
			x.materials2[0].needsUpdate = true; 
		}); 			

/*		//load2.load( 'obj/trees/2/mat/RGB_42683024644d4324b76d8662cb48e373_Bark001_2K_JPG.png', function(tx2) { 
		load2.load( 'obj/trees/2/mat/bark1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.materials2[1].map = x.materials[0].bumpMap = tx2; 
			x.materials2[1].bumpScale = 3; 
			x.materials2[1].needsUpdate = true; 		
		}); 			
*/
		//load3.load( 'obj/trees/2/mat/A_af725e1eafd34d1e9cc6c4f8ff38a112_Sakura_Opacity.png', function(tx3) { 
		load3.load( 'obj/trees/2/mat/alpha1.png', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			x.materials2[0].alphaMap = tx3; 
			x.materials2[0].needsUpdate = true; 				
		}); 			

		//fadeScene(); 
		animFBX(); 
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
	}
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	

	x.xx = 20; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		if (isMobil) x.xx = 40; 
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
			z1 = x.targetO.position.z, 
			ej1 = 0; 
		
		//if (_.ej[1] > 0)
		ej1 = (_.ej[1] > 0) ? 1 : 0; 	
		
		//console.log(z0);
			
		if (z0 == _.ej[0]) {
			//if (x.currGrup == 0) {
			
			x.camGrup.position.z = _.ej[3]; 
			
			x.targetO.position.z = _.ej[3] - 500; 
			
			grups[0].position.z *= -1; 
			grups[1].position.z *= -1; 
			
			x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		} else {
			x.camGrup.position.z = z0 + _.ej[1]; 
			x.targetO.position.z = z1 + _.ej[1]; 
		}
		
	
//		requestAnimationFrame(walkIn);					
//    })();	
}
*/

function animFog() { 
	const fogX0 = x.batchedMesh[0].position.x,  
		  fogX1 = x.batchedMesh[1].position.x; 
	
	if (fogX0 > -300) {
		x.batchedMesh[0].position.x -= .1; 
	} else {
		x.batchedMesh[0].position.x = 300;
	}

	if (fogX1 > -300) {
		x.batchedMesh[1].position.x -= .15; 
	} else {
		x.batchedMesh[1].position.x = 300;
	}
	
}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.001;
		//const timer = Date.now() * 0.00008;
		const timer = Date.now() * 0.00024;
		//console.log(timer); 
		
		const delta = clock.getDelta() * .5;
	//	if ( mixer ) 
		mixer.update( delta );	

		//x.actions[0].weight = Math.abs(Math.sin(timer*10));
		//mixer.update( .02 );	
		
		//x.actions[0].weight = Math.cos(timer);
		
		//camera.position.x = Math.cos(timer*2) * 1; 
		//camera.position.y = Math.sin(timer*4) * 1; 

		if (isMobil) {
			//camera.position.x += Math.cos(timer*.5) * 15; 
			//camera.position.y += Math.sin(timer*.25) * 15 + 10; 	

			const t25 = Math.sin(timer); 
			camera.position.x = t25 * x.xx; 
			//camera.position.y = Math.sin(timer*.25) * 35 + 5; 
			const camY = t25 * 19; 
		//	camera.position.y = camY > -2 ? camY : -2; 
			camera.position.y = camY > -6 ? camY : -6; 
			//camera.position.z = camera.position.y * 1.75 + 10;
			camera.rotation.x = t25 * -.3; 
			
			x.camGrup.rotation.y = Math.cos(timer) * .3; 			
		} else {
			//camera.position.x += _.pointer.x * 15; 
			camera.position.x = _.pointer.x * x.xx; 
		//	camera.position.y += (_.pointer.y * 500) + 400;
			//camera.position.y += (_.pointer.y * 25) + 13;
			//camera.position.z = (_.pointer.y * 50);
			const pY = _.pointer.y * 19; 
			camera.position.y = pY > -6 ? pY : -6;
			//camera.position.z = camera.position.y * 1.75 + 10;
			camera.rotation.x = _.pointer.y * -.3; 
			
			x.camGrup.rotation.y = Math.cos(timer) * .2; 			
		}
		
		//camera.position.z = camera.position.y * 1.75 + 10; 
		camera.position.z = camera.position.y * 1.7 + 43; 
	
		//animFog(); 
		//animWalk(); 
	
		//grups[0].rotation.x = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.y = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.z = Math.cos(timer*.1) * .5; 
		
		//camera.rotation.y = Math.cos(timer*.05) * 3; 
		//x.camGrup.rotation.y = Math.cos(timer) * 2.7; 
	//	x.camGrup.rotation.y = Math.cos(timer*3) * .6; 
	
	
		animFog(); 

		//x.trees.rotation.x = Math.cos(timer*12) * .022; 	
		x.trees.rotation.y = Math.cos(timer*1.3) * .02; 	
		x.trees.rotation.z = Math.sin(timer) * .014; 	
	
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

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
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
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .75, metalness: 0 } );
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
		
		const scl = .1; 
		
		x.char1.scale.set(scl, scl, scl); 
	//	x.char1.position.set(0, florY+1.48, 0); 
		x.char1.position.set(0, florY+1.52, -.8); 
		//x.char1.position.set(0, florY-0, _.ej[0] -300); 
		//x.char1.rotation.set(-.2, Math.PI, 0);	
	//	x.char1.rotation.set(0, _.ej[2], 0);	
		
	//	x.camGrup.add( x.char1 ); 
		grups[0].add( x.char1 ); 
		
		//camera.lookAt(x.char1.position);
	//	x.spotLight[0].target = x.char1;
		
		//grup1.position.set( 0, florY+120, 11000 ); 
		//grup1.add( x.char1 ); 
				
		//grup1.visible = true; 
		//scene.add( grup1 ); 

		//camera.position.set(0, florY+120+100, 150); 		
		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	let url = 'teenb1/Sitting'; 	//mono
	//let url = 'teenb1/Sitting Idle'; 	//mono
	//let url = 'teenb1/breathidle'; 	//mono
	//let url = 'teenb1/idle'; 	//mono
	//let url = 'teenb1/walkswag'; 	//mono
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
		//mixer.update( 0 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'sinister-mystery-174823'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'gloomy-reverie-190650'; 	
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		let url = 'bsstp'; 	
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
			x.sound.setVolume( .9 ); 
			//x.sound.setVolume( 0.8 );
			x.sound.play(); 
			//console.log('music'); 
			
			//ui.onAud.classList.add('noneIt2'); 	
			//ui.offAud.classList.remove('noneIt2'); 	
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
		}); 
	
	}
	
}
	
	