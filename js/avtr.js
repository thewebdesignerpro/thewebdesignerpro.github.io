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
	
	kontainer.style.background = "url('img/avatarl.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#909496';		

	//const fogCol = 0xc0c8d3; 
	const fogCol = 0x909496; 

	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -2; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z
	
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 0;			//70 or 35
	
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
	scene.fog = new THREE.FogExp2(fogCol, 0.001);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 10000 );
	//camera.position.set(0, 0, 500); 
	camera.position.set(0, _.ej[5], -100); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	
	
	scene.add( new THREE.AmbientLight( 0x404040 ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 25000000, 7000, Math.PI/4, 1 );
	//x.spotLight[0].position.set( 0, 1500, 0 );
	x.spotLight[0].position.set( 0, 3000, 1000 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width = 128;
	x.spotLight[0].shadow.mapSize.height = 128;
	x.spotLight[0].shadow.camera.near = 10;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .75;
	
	//scene.add( x.spotLight[0] );	
	x.camGrup.add( x.spotLight[0] );	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );
	//x.camGrup.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	
	x.camGrup.position.set(0, 0, _.ej[3]); 
	scene.add(x.camGrup); 
	
	//const light = new THREE.PointLight( 0xffffff, 30000, 450 );
	
//	const dirLight = new THREE.DirectionalLight( 0xffffff, 2 );
//	dirLight.position.set( 0, 3000, -1000 );
	//dirLight.castShadow = true; 
	//dirLight.shadow.camera.near = 10; 
	//dirLight.shadow.camera.far = 5000; 	
//	scene.add( dirLight );	
	
	//const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
	//scene.add( helper );	
	
	//const helper = new THREE.CameraHelper( dirLight.shadow.camera );
	//scene.add( helper );	
	
	//window.removeEventListener("load", init, false);
	//window.addEventListener('resize', onWindowResize, false); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    //controls.autoRotateSpeed = 1.6;	
    //controls.autoRotate = true;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = 5;
    controls.panSpeed = 1;
	//controls.update();		
	controls.enabled = false; 
*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 
//	grups[2] = new THREE.Group(); 
	
	//grups[0].add( x.spotLight[0] );	
	
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
	x.targetO.position.set(0, 0, x.camGrup.position.z - 500); 
	scene.add(x.targetO);
	
	x.spotLight[0].target = x.targetO; 
	
//	controls.target = x.targetO.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	//addSkybox(); 
	addClouds(); 
	addMountain1(); 
	//addMountain2(); 
	//addMountain3(); 
	//addMountain4(); 
	addFog(); 
	
	animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

/*function addSkybox() {
	const f = '.png'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/3/' );

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
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
*/
	
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

function randMatrix( matrix ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 3000 - 1500; 
		
//	if ((posx > -175) && (posx < 175)) {
//		let rnd = Math.random() < 0.5 ? -1 : 1;

//		posx = 182 * rnd; 
		//console.log(posx);
//	}
		
	position.x = posx;
	position.y = Math.random() * -500 + florY;
	position.z = Math.random() * 3000 - 1500;

	rotation.x = Math.random() * (Math.PI/4);
	if (position.y < 0) rotation.x *= -1; 
	
	//rotation.y = (Math.random() * .2 - .1) * Math.PI;
	rotation.y = Math.random() * (Math.PI/4);
	if (position.x > 0) rotation.y *= -1; 
	
	rotation.z = Math.random() * 2 * Math.PI;	

	quaternion.setFromEuler( rotation );

	const scl = Math.random() * .3 + 1; 
	scale.x = scale.y = scl; 
		
	return matrix.compose( position, quaternion, scale );
}

function addFog() {
	//x.fog = []; 
	let matrix = []; 
	
	const geometry = new THREE.PlaneGeometry( 200, 200 ); 
	//x.material[1] = new THREE.MeshBasicMaterial( { color: 0xd0d8e3, transparent: true } );
	x.material[1] = new THREE.MeshBasicMaterial( { color: 0xd4d8da, transparent: true } );
	x.material[1].depthWrite = false; 
	x.material[1].opacity = .8; 
	//x.material[1].side = THREE.DoubleSide; 
	//console.log(geometry.attributes.position.array.length);
	
	for ( let i = 2; i < 4; i++ ) {	
		const lngth = geometry.attributes.position.array.length; 
		//const lngth = 12; 
		
		x.batchedMesh[i] = new THREE.BatchedMesh( 2600, lngth, lngth * 2, x.material[1] );
		x.batchedMesh[i].frustumCulled = true;
		//x.batchedMesh[i].castShadow = true;
		//x.batchedMesh[i].receiveShadow = true;
		
		const geometryId = x.batchedMesh[i].addGeometry( geometry );
		
		matrix[i-2] = new THREE.Matrix4(); 
		
		for ( let j = 0; j < 2600; j ++ ) {
			const instancedId = x.batchedMesh[i].addInstance( geometryId );
		
			x.batchedMesh[i].setMatrixAt( instancedId, randMatrix( matrix[i-2] ) ); 
		}
		
		grups[i-2].add(x.batchedMesh[i]); 
	}			
	
	let	loader = new THREE.TextureLoader();   
		//loader2 = new THREE.TextureLoader(); 
	
	loader.load( 'img/ulap5.png', function(tx) { 	
		x.material[1].map = tx; 
		x.material[1].alphaMap = tx; 
		x.material[1].needsUpdate = true;
		//x.fog[k].visible = true; 
	}); 
	
}
	
function randomizeMatrix( matrix, scl ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	let posx = Math.random() * 3000 - 1500; 
		
	if ((posx > -220) && (posx < 220)) {
		let rnd = Math.random() < 0.5 ? -1 : 1;

		posx = 230 * rnd; 
		//console.log(posx);
	}
		
	position.x = posx;
	//position.y = (Math.random() * 100) - 100 + florY;
	position.y = Math.random() * -230;
	position.z = Math.random() * 2900 - 1450;

	//rotation.x = Math.random() * 2 * Math.PI;
	rotation.y = Math.random() * 2 * Math.PI;
	//rotation.z = Math.random() * 2 * Math.PI;

	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = scl + ( Math.random() * 2 );

	return matrix.compose( position, quaternion, scale );

}
	
function addMountain1() {
	//let meshCount = 0; 
	//x.mountain = []; 
	x.batchedMesh = []; 
	x.material = []; 
	let matrix = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mountain/1/a.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		//const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		x.material[0] = new THREE.MeshStandardMaterial( { color: 0xaaaaaa, roughness: .7, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.mountain.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			/*x.mountain[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.mountain[i].castShadow = true; 
			x.mountain[i].receiveShadow = true; 			
			
			x.mountain[i].position.set(0, florY+0, 0); 
			//x.mountain[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI); 
			x.mountain[i].scale.set(10, 10, 10); 
		
			grups[0].add( x.mountain[i] );		*/
			
			const lngth = object.children[0].geometry.attributes.position.array.length; 
			
			x.batchedMesh[i] = new THREE.BatchedMesh( 15, lngth, lngth * 2, x.material[0] );
			x.batchedMesh[i].frustumCulled = true;
			x.batchedMesh[i].castShadow = true;
			x.batchedMesh[i].receiveShadow = true;
			
			const geometryId = x.batchedMesh[i].addGeometry( object.children[0].geometry );
			
			matrix[i] = new THREE.Matrix4(); 
			
			for ( let j = 0; j < 15; j ++ ) {
				
				const instancedId = x.batchedMesh[i].addInstance( geometryId );
			
				//randomizeMatrix( matrix[i] );
				x.batchedMesh[i].setMatrixAt( instancedId, randomizeMatrix( matrix[i], 19 ) ); 
			
			}
			
			grups[i].add(x.batchedMesh[i]); 
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/mountain/1/mat/14color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.material[0].map = tx; 
			x.material[0].needsUpdate = true; 

			//x.mountain.visible = true; 
			
			//fadeScene(); 
		}); 			

		load2.load( 'obj/mountain/1/mat/arough1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.material[0].roughnessMap = tx2; 
			x.material[0].needsUpdate = true; 

			//x.mountain.visible = true; 
		}); 			

		load3.load( 'obj/mountain/1/mat/anormal1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			//x.material[0].normalScale.set(2, 2); 
			x.material[0].normalMap = tx3; 
			x.material[0].needsUpdate = true; 

			//x.mountain.visible = true; 
		}); 			

	}); 

	grups[0].position.z = 1500;
	grups[1].position.z = -1500;
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 	
}

/*function addMountain2() {
	//let meshCount = 0; 
	let matrix = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mountain/1/0.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		x.material[1] = new THREE.MeshStandardMaterial( { color: 0xcccccc, roughness: .84, metalness: .1 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		for ( let i = 2; i < 4; i++ ) {	
			const lngth = object.children[0].geometry.attributes.position.array.length; 
			
			x.batchedMesh[i] = new THREE.BatchedMesh( 15, lngth, lngth * 2, x.material[1] );
			x.batchedMesh[i].frustumCulled = true;
			x.batchedMesh[i].castShadow = true;
			x.batchedMesh[i].receiveShadow = true;
			
			const geometryId = x.batchedMesh[i].addGeometry( object.children[0].geometry );
			
			matrix[i-2] = new THREE.Matrix4(); 
			
			for ( let j = 0; j < 15; j ++ ) {
				
				const instancedId = x.batchedMesh[i].addInstance( geometryId );
			
				//randomizeMatrix( matrix[i] );
				x.batchedMesh[i].setMatrixAt( instancedId, randomizeMatrix( matrix[i-2], 2 ) ); 
			
			}
			
			grups[i-2].add(x.batchedMesh[i]); 
		}		

		let load1 = new THREE.TextureLoader();    
			//load2 = new THREE.TextureLoader(),    
			//load3 = new THREE.TextureLoader();    
		
		load1.load( 'obj/mountain/1/mat/0color1.jpg', function(tx) { 
			//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.material[1].map = tx; 
			x.material[1].bumpScale = 1.2; 
			x.material[1].bumpMap = tx; 			
			x.material[1].roughnessMap = tx; 			
			x.material[1].needsUpdate = true; 
		}); 			
		
	}); 

}

function addMountain3() {
	//let meshCount = 0; 
	let matrix = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mountain/1/14.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//child.geometry.computeVertexNormals();	
				child.geometry.computeBoundingBox();		
				
				child.castShadow = true; 
				child.receiveShadow = true; 
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		x.material[2] = new THREE.MeshStandardMaterial( { color: 0xcccccc, roughness: .65, metalness: .1 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		for ( let i = 4; i < 6; i++ ) {	
			const lngth = object.children[0].geometry.attributes.position.array.length; 
			
			x.batchedMesh[i] = new THREE.BatchedMesh( 15, lngth, lngth * 2, x.material[2] );
			x.batchedMesh[i].frustumCulled = true;
			x.batchedMesh[i].castShadow = true;
			x.batchedMesh[i].receiveShadow = true;
			
			const geometryId = x.batchedMesh[i].addGeometry( object.children[0].geometry );
			
			matrix[i-4] = new THREE.Matrix4(); 
			
			for ( let j = 0; j < 15; j ++ ) {
				
				const instancedId = x.batchedMesh[i].addInstance( geometryId );
			
				//randomizeMatrix( matrix[i] );
				x.batchedMesh[i].setMatrixAt( instancedId, randomizeMatrix( matrix[i-4], 2 ) ); 
			
			}
			
			grups[i-4].add(x.batchedMesh[i]); 
		}		

		let load1 = new THREE.TextureLoader();    
			//load2 = new THREE.TextureLoader(),    
			//load3 = new THREE.TextureLoader();    
		
		load1.load( 'obj/mountain/1/mat/14color1.jpg', function(tx) { 
			x.material[2].map = tx; 
			x.material[2].bumpScale = 2; 
			x.material[2].bumpMap = tx; 			
			x.material[2].roughnessMap = tx; 			
			x.material[2].needsUpdate = true; 
		}); 			
		
	}); 

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
	
/*	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	//_.ej[0] = 3000; 		//4500 or -1500 - grups 0 & 1 pos z
	//_.ej[1] = 0; 			//back or front 1 or -1
	_.ej[1] = 0; 			//front or back -1 or 1
	_.ej[1] = -2; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	//_.ej[2] = 0;			//Math.PI or 0	
	_.ej[3] = 3000; 		//3000 or 0 - camGrup pos z
	//_.ej[3] = 0;			//-1500 or 4500 - grups 0 & 1 pos z	
*/

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

function onWindowResize(event) {
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
	
	if ((isMobil) && (event)) {
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
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	}		
		
	_.idleTimer = 0; 
}

function animWalk() {
 //   (function walkIn() {
	/*	let z0 = grups[0].position.z,   
			//z1 = x.wormhole.rotation.y; 
			z1 = grups[1].position.z;  
			//z2 = grups[2].position.z; 
	*/
	
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

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001;
		//console.log(timer); 
		
		const delta = clock.getDelta() * .3;
		if ( mixer ) mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
		
		camera.position.x = Math.cos(timer) * 10; 
		camera.position.y = Math.sin(timer*2) * 10; 

		if (isMobil) {
			camera.position.x += Math.cos(timer*.5) * 150; 
		//	camera.position.y += Math.sin(timer*.25) * 200 + 400; 
			camera.position.y += Math.sin(timer*.25) * 150; 
		} else {
			camera.position.x += _.pointer.x * 150; 
		//	camera.position.y += (_.pointer.y * 500) + 400;
			camera.position.y += (_.pointer.y * 150);
		}
	
		animWalk(); 
	
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
	camera.lookAt(x.targetO.position);
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
		
	//	x.char1.scale.set(1.48, 1.48, 1.48); 
		//x.char1.position.set(0, 0, 0); 
	//	x.char1.position.set(0, florY-0, -300); 
		x.char1.position.set(0, florY-38, -300); 
		//x.char1.position.set(0, florY-0, _.ej[0] -300); 
		//x.char1.position.set(-1180, florY-0, -300); 
		//x.char1.rotation.set(-.2, Math.PI, 0);	
		x.char1.rotation.set(0, _.ej[2], 0);	
		
		x.camGrup.add( x.char1 ); 
		
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
	
//	let url = 'teenb1/walkswag'; 	//mono
	let url = 'teenb1/flying2'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//x.actions[0].weight = .5;
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
		let url = 'fly01'; 	
		url += '.mp3'; 	
		
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
			x.sound.setVolume( 0.8 );
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
	
	