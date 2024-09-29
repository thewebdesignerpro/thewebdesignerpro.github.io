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
	kontainer.style.background = "url('img/autumnl.jpg') center top no-repeat"; 
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
    ui.kontainer.style.backgroundColor = '#808895';		

	const fogCol = 0x808895; 
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
	
	x.xx = 160; 

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
	//camera.position.set(0, 0, 500); 
//	camera.position.set(0, _.ej[5], -100); 
	//camera.position.set(0, 0, 2000); 
	//camera.position.set(0, 0, 1670); 
	//camera.position.set(0, 0, 1420); 
	//camera.position.set(0, 0, 780); 
	camera.position.set(0, 60, 900); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x888888 ) );	

//	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffe5aa, 50000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( -3000, 200, 0 );
	//x.spotLight[0].position.set( 0, 100, 80 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
//	x.spotLight[0].shadow.mapSize.width = 1024;
//	x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 50;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	x.spotLight[0].shadow.intensity = .9;
	
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
	
//	scene.add( x.spotLight[1] );	

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
	
	//TEMP!!
/*	controls = new OrbitControls( camera, renderer.domElement );
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
//controls.enabled = false; 
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
//	x.target1.position.set(0, 0, x.camGrup.position.z - 1); 
//	x.target1.position.set(0, 50, x.camGrup.position.z); 
	x.target1.position.set(0, 80, x.camGrup.position.z); 
	scene.add(x.target1);
	
	//camera.position.y = 80; 
	//camera.lookAt(x.target1.position);
	
//	x.spotLight[1].target = x.target1; 
	
//	controls.target = x.target1.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[1] );
	//scene.add( x.spotLightHelper );	
	
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

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	//const f = '.png'; 
	const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	//loader.setPath( 'img/skybox/5/' );
	loader.setPath( 'img/skybox/6/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
		//'3'+f, '1'+f,
		//'5'+f, '4'+f,
		//'6'+f, '2'+f
	], function ( tx ) {
		//tx.flipY = true; 
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		//scene.backgroundRotation.set(0, 3.8, 0); 
		scene.backgroundRotation.set(0, (Math.PI/-2) + .64, 0); 
		//scene.backgroundBlurriness = .04; 
		//scene.backgroundIntensity = 1.5; 
		
		scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		//addFog(); 
		
		addSea(); 
		//addTree(); 
		
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}

function addSea() {
	//x.sea; 
	
	const waterGeometry = new THREE.PlaneGeometry( 12000, 12000 );

	x.sea = new Water(
		waterGeometry,
		{
			textureWidth: 1280,
			textureHeight: 1280,
			//waterNormals: new THREE.TextureLoader().load( 'img/water/temp.jpg', function ( texture ) {
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x003330, 
			distortionScale: 10,
			//size: .1,
			fog: scene.fog !== undefined
		}
	);

	x.sea.rotation.x = - Math.PI / 2;

	scene.add( x.sea );	
	
	const waterUniforms = x.sea.material.uniforms;
	waterUniforms['size'].value = .011; 
	
	addTree();
}

function randomizeMatrix( matrix, i ) {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();			

	//let posx = Math.random() * 400 - 200 + 140,  
	//let posx = Math.random() * 400 - 60,  
	let posx = Math.random() * 1700 + 700,  
		//posy = Math.random() * 50 + 350,  
		posy = .5,  
		posz = Math.random() * 200 - 120; 
		
	//const fifty = Math.random(); 
	//if ((posx > 0) && (fifty < .5)) posx *= -1; 
	
	position.x = x.dummy[i].position.x = posx;
	position.y = x.dummy[i].position.y = posy;
	position.z = x.dummy[i].position.z = posz;

	rotation.x = x.dummy[i].rotation.x = Math.random() * (2 * Math.PI);
	rotation.y = x.dummy[i].rotation.y = Math.random() * (2 * Math.PI);
	rotation.z = x.dummy[i].rotation.z = Math.random() * (2 * Math.PI);
	
	quaternion.setFromEuler( rotation );

	scale.x = scale.y = scale.z = 1;

	return matrix.compose( position, quaternion, scale );
}

function addLeaves() {
	//x.Leaf = []; 
	const count = 10, 
		  matrix = new THREE.Matrix4(); 
		  
	x.dummy = []; 
	//x.dummy = new THREE.Object3D(); 
	
	let load0 = new THREE.TextureLoader(),
		load1 = new THREE.TextureLoader(),  
		load2 = new THREE.TextureLoader(); 
	
	//const geom = new THREE.PlaneGeometry( 3, 5, 3, 5 );
	const geom = new THREE.PlaneGeometry( 6, 10, 3, 5 );
	x.mater = new THREE.MeshStandardMaterial( { color: 0xdddddd, emissive: 0x505050, transparent: true, side: THREE.DoubleSide } );
	x.mater.depthWrite = false; 
	//x.mater.wireframe = true; 
	
	//x.Leaf = new THREE.Mesh( geom, mater );
	//x.Leaf.position.set(0, 300, 50); 
	//x.Leaf.rotation.set(0, Math.PI/2, 0); 	
	
	//for ( let i = 0; i < count; i++ ) {
		//x.dummy[i] = new THREE.Object3D(); 
			
		x.Leaf = new THREE.InstancedMesh( geom, x.mater, count );
		x.Leaf.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); 
		
		//randomizeMatrix( matrix, i ); 
		//x.Leaf[i].setMatrixAt( i, matrix ); 

		grups[0].add( x.Leaf ); 
	//}
	
	for ( let i = 0; i < count; i++ ) {
		x.dummy[i] = new THREE.Object3D(); 
		
		randomizeMatrix( matrix, i ); 
		x.Leaf.setMatrixAt( i, matrix ); 		
	}
	
	load0.load( 'obj/trees/5/mat/leafc2.png', function(tx0) { 
		//for ( let j = 0; j < count; j++ ) {
			x.mater.map = tx0; 
			x.mater.needsUpdate = true; 
		//}
	}); 		
	
	load1.load( 'obj/trees/5/mat/leafa.png', function(tx1) { 
		//for ( let k = 0; k < count; k++ ) {
			x.mater.alphaMap = tx1; 
			x.mater.needsUpdate = true; 
		//}
	}); 		
	
	load2.load( 'obj/trees/5/mat/leafd.png', function(tx2) { 
		//for ( let l = 0; l < count; l++ ) {
			x.mater.displacementScale = 4; 
			x.mater.displacementMap = tx2; 
			x.mater.needsUpdate = true; 
		//}
	}); 		
}
		
function addTree() {
	let meshCount = 0; 
	x.tree = [];

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/5/tree2.obj', function ( object ) {
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
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		//material.combine = THREE.MixOperation;
		//material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		//material.envMap = x.skybox; 
		
		//x.tree.visible = false; 
		
		const kolor = []; 
		kolor[0] = 0xffeeee; 
		kolor[2] = 0xeeeeee; 
		kolor[1] = 0xbbbbbb; 
		
		const rof = []; 
		rof[0] = .5;
		rof[1] = .73;
		rof[2] = .83;
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshStandardMaterial( { color: kolor[i], roughness: rof[i], metalness: 0 } );
			if (i==0) {
				material[i].transparent = true;  
				material[i].depthWrite = false;  
			} 
			//else {
				//material[i].emissive.set(0x222222); 
				//material[i].dithering = true; 
			//}
			//material[i].side = THREE.DoubleSide; 
			//material[i].wireframe = true;		
			//material[i].reflectivity = .5;		
			//material[i].envMap = x.skybox; 			
			//material[i].envMapIntensity = .4; 	
			
			x.tree[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.tree[i].castShadow = true; 
			if (i>0) x.tree[i].receiveShadow = true; 			
			
		//	x.tree[i].position.set(0, florY+10.12, 0); 
			x.tree[i].position.set(0, -60, 0); 
			x.tree[i].rotation.set(0, Math.PI, 0); 
			//x.tree[i].rotation.set(0, Math.PI - .1, 0); 
			x.tree[i].scale.set(1, 1, 1); 
		
			grups[0].add( x.tree[i] );		
			
			x.tree[i].visible = false; 
		}		

		//grups[0].position.set(0, 0, 0); 
		scene.add(grups[0]); 
	
		let load0 = new THREE.TextureLoader(),   
			load0b = new THREE.TextureLoader(),   
			load0c = new THREE.TextureLoader(),   
			load1 = new THREE.TextureLoader(),   
			load1b = new THREE.TextureLoader(),   
			load1c = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load2b = new THREE.TextureLoader(),   
			load2c = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(); 
		
		load0.load( 'obj/trees/5/mat/color0e.jpg', function(tx0) { 
		//load0.load( 'obj/trees/5/mat/test2.jpg', function(tx0) { 
		//	tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			//for ( let k = 0; k < 1; k++ ) {	
				x.tree[0].material.map = tx0; 
				x.tree[0].material.needsUpdate = true; 
			//}
			
			x.tree[0].visible = true; 
			
			animFBX(); 
		}); 			

		load0b.load( 'obj/trees/5/mat/alpha0.jpg', function(tx0b) { 
		//load0b.load( 'obj/trees/5/mat/A_57d0ba30fbe64f6bba07a7ce5c6ebdbc_Jungle_tree_opacity.png', function(tx0b) { 
			x.tree[0].material.alphaMap = tx0b; 
			x.tree[0].material.needsUpdate = true; 
		}); 			

		load0c.load( 'obj/trees/5/mat/normal0.jpg', function(tx0c) { 
			//x.tree[0].material.normalScale.set(-1, -1); 
			x.tree[0].material.normalMap = tx0c; 
			x.tree[0].material.needsUpdate = true; 
		}); 			

		load1.load( 'obj/trees/5/mat/color1.jpg', function(tx1) { 
			x.tree[1].material.map = tx1; 
			x.tree[1].material.needsUpdate = true; 
			
			x.tree[1].visible = true; 
		}); 			

		load1b.load( 'obj/trees/5/mat/rough1.jpg', function(tx1b) { 
			x.tree[1].material.roughnessMap = tx1b; 
			x.tree[1].material.needsUpdate = true; 
		}); 			

		load1c.load( 'obj/trees/5/mat/normal1.jpg', function(tx1c) { 
			x.tree[1].material.normalScale.set(2, 2); 
			x.tree[1].material.normalMap = tx1c; 
			x.tree[1].material.needsUpdate = true; 
		}); 			

		load2.load( 'obj/trees/5/mat/color2.jpg', function(tx2) { 
			//tx2.magFilter = THREE.NearestFilter;    
			
			x.tree[2].material.map = tx2; 
			x.tree[2].material.needsUpdate = true; 
			
			x.tree[2].visible = true; 
		}); 			

		load2b.load( 'obj/trees/5/mat/rough2.jpg', function(tx2b) { 
			x.tree[2].material.roughnessMap = tx2b; 
			x.tree[2].material.needsUpdate = true; 
		}); 			

		load2c.load( 'obj/trees/5/mat/normal2.jpg', function(tx2c) { 
			//x.tree[2].material.normalScale.set(2, 2); 
			x.tree[2].material.normalMap = tx2c; 
			x.tree[2].material.needsUpdate = true; 
		}); 			

		addLeaves(); 
		
		const geom = new THREE.PlaneGeometry( 1000, 400 );
		const mater = new THREE.MeshBasicMaterial( { color: 0x111111, transparent: true, opacity: .3 } );
		mater.depthWrite = false; 
		x.treeShadow = new THREE.Mesh( geom, mater );
		x.treeShadow.position.set(563, 2, -35); 
		x.treeShadow.rotation.set(Math.PI/2, 0, 0); 
		grups[0].add( x.treeShadow );
		
		load3.load( 'obj/trees/5/mat/shadow.jpg', function(tx3) { 
			x.treeShadow.material.alphaMap = tx3; 
			x.treeShadow.material.needsUpdate = true; 
		}); 		
		
		
		//fadeScene(); 
		//animFBX(); 
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

	x.xx = 160; 
	
	if (_.width > _.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((_.width+_.height)/2)*0.028+'px';
	
		if (isMobil) x.xx = 300; 
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
		//const timer = Date.now() * 0.0001; 
		const timer = Date.now() * 0.00005; 
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
			const t25 = Math.sin(timer); 
			camera.position.x = t25 * x.xx; 
			const camY = Math.abs(t25) * 500; 
			//console.log(camY);
			
			camera.position.y = camY > 30 ? camY : 30; 
			//camera.position.z = camY > 500 ? camY : 500; 
		
			x.camGrup.rotation.y = Math.sin(timer) * 2.4; 			
		} else {
			//camera.position.x += _.pointer.x * 3; 
			//camera.position.x = _.pointer.x * x.xx; 
		//	camera.position.y += (_.pointer.y * 500) + 400;
			//camera.position.y += (_.pointer.y * 25) + 13;
			//camera.position.z = (_.pointer.y * 50);
			const pY = _.pointer.y * 600; 
			//camera.position.y = pY;
			camera.position.y = pY > 30 ? pY : 30;
			camera.position.z = 900 - (camera.position.y * .65); 
			//camera.position.z = camera.position.y + 500;
		//	camera.rotation.x = _.pointer.y * -.3; 
			
			x.camGrup.rotation.y = Math.sin(timer) * 2.6; 			
		}
		
//		camera.position.z = camera.position.y * 1.7 + 780; 
	
		//animFog(); 
		//animWalk(); 
	
		//grups[0].rotation.x = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.y = Math.sin(timer*.1) * .5; 
		//grups[0].rotation.z = Math.cos(timer*.1) * .5; 
		
		//camera.rotation.y = Math.cos(timer*.05) * 3; 
		//x.camGrup.rotation.y =  * 2.7; 
	//	x.camGrup.rotation.y = Math.cos(timer*3) * .6; 

		
		for ( let i = 0; i < 10; i++ ) {
			const lifRotX = x.dummy[i].rotation.x, 
				  lifRotY = x.dummy[i].rotation.y, 
				  lifRotZ = x.dummy[i].rotation.z;  
				  //lifX = x.dummy[i].position.x, 
				  //lifZ = x.dummy[i].position.z;  
				  
			let	lifX = x.dummy[i].position.x + .7,  
				lifY = x.dummy[i].position.y - 1, 
				lifZ = x.dummy[i].position.z; 				

			//lifX = (lifX < 800) ? (x.dummy[i].position.x + .7) : (Math.random() * 400 - 60); 
			lifY = (lifY > 0.3) ? (x.dummy[i].position.y - 1) : 0.3; 
			//if (lifY < 0) lifY = 0; 
			//console.log(lifY);

			if (lifX < 2400) {
				lifX = x.dummy[i].position.x + .7; 
			} else {
				lifX = Math.random() * 400 - 60; 
				lifY = Math.random() * 50 + 350; 
				lifZ = Math.random() * 200 - 120; 				
			}
			
			x.dummy[i].position.set(lifX, lifY, lifZ); 
			if (lifY > 0.3) {
				x.dummy[i].rotation.set(lifRotX + (Math.random()*.03), lifRotY + (Math.random()*.03), lifRotZ + (Math.random()*.03)); 
			} else {
				//x.dummy[i].rotation.set(Math.PI/2, 0, 0); 
				x.dummy[i].rotation.x = Math.PI/2; 
			}
			//x.dummy[i].rotation.set(lifRotX + Math.sin(timer*.01), lifRotY + Math.cos(timer*.01), lifRotZ + Math.sin(timer*.01)); 
			       
			x.dummy[i].updateMatrix();
			//console.log(x.dummy[i].position); 
			
			x.Leaf.setMatrixAt( i, x.dummy[i].matrix );			
			
			x.Leaf.instanceMatrix.needsUpdate = true;
			x.Leaf.computeBoundingSphere();			
		}	
		
		const treeRot = Math.sin(timer*10) * .01; 
		//const treeRot = Math.sin(timer*5) * .01; 
		x.tree[0].rotation.set(treeRot, treeRot + Math.PI, treeRot); 
		//console.log(x.tree[0].rotation.z); 
	
		//x.sea.material.uniforms[ 'time' ].value -= 1.0 / 60.0;	
		x.sea.material.uniforms[ 'time' ].value -= .002;	
		//x.sea.material.uniforms[ 'time' ].value = Math.sin(timer*10)*.5;	

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
		
		//const scl = 1.1; 
		const scl = 1; 
		
		x.char1.scale.set(scl, scl, scl); 
	//	x.char1.position.set(0, florY+1.48, 0); 
	//	x.char1.position.set(-50, 54, -13); 
	
		//x.char1.position.set(50, 104, -14); 
		x.char1.position.set(48.7, 100, -20); 
		//x.char1.position.set(40, 103, -19); 
		
		//x.char1.position.set(37, 88, -19); 
		//x.char1.position.set(37, 88, -19); 
		
		//x.char1.position.set(0, florY-0, _.ej[0] -300); 
		//x.char1.rotation.set(-.5, Math.PI/-2, 0);	
		//x.char1.rotation.x = -.5; 
		x.char1.rotation.y = Math.PI/-2; 
	//	x.char1.rotation.set(0, _.ej[2], 0);	
		
	//	x.camGrup.add( x.char1 ); 
		grups[1].add( x.char1 ); 
		//scene.add( x.char1 ); 
		
		//camera.lookAt(x.char1.position);
	//	x.spotLight[0].target = x.char1;
		
		//grup1.position.set( 0, florY+120, 11000 ); 
		//grup1.add( x.char1 ); 
				
		//grup1.visible = true; 
		scene.add( grups[1] ); 
		
		//grups[1].rotation.z = -.03; 

		//camera.position.set(0, florY+120+100, 150); 		
		
		anim8(); 
		
		//fadeScene(); 	
	} );
}

function anim8() {
	x.actions = []; 
	
	//let url = 'teenb1/SitRecline3'; 	//mono
	//let url = 'teenb1/SitRecline2'; 	//mono
	//let url = 'teenb1/SitRecline1'; 	//mono
	let url = 'teenb1/SitRecline'; 	//mono
	//let url = 'teenb1/Sitting'; 	//mono
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
		mixer.update( 0 );	
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}


function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
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
		let url = 'atmn'; 	
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
	
	