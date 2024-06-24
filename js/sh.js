/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import WEBGL from 'three/addons/WebGL.js'; 
import WEBGL from 'three/addons/capabilities/WebGL.js'; 
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'; 
//import { TWEEN } from 'three/addons/tween.module.min.js'; 
//import TWEEN from 'three/addons/tween.module.js';
//import TWEEN from 'three/addons/libs/tween.module.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

//import * as THREE from './jsm/three.module.js';			
//import WEBGL from './jsm/WebGL.js'; 
//import { TWEEN } from './jsm/tween.module.min.js'; 
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';

const idleTO = 120, florY = -100, ceilY = 140;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer; 
const ui = {}, _ = {}, x = {}; 

//let cntnt, cntnt2, cntnt3; 

let cubeCamera, cubeRenderTarget;

//console.log(x);
// temp
//let controls; 


if ( WEBGL.isWebGLAvailable() === false ) {	
    let warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);	
} else {	
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
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
    }
	
	dummy.parentNode.removeChild(dummy);		
	
	_.width = window.innerWidth; 
	_.height = window.innerHeight; 

    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    

    //ui.kontainer.style.opacity = 0;		
    //ui.kontainer.style.backgroundColor = '#000';		
   // ui.kontainer.style.backgroundColor = '#8f929e';		
    ui.kontainer.style.backgroundColor = '#808486';		

	_.cr = []; 	

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
	_.ej[5] = 100;			//70 or 35
	
	//const fogCol = 0x000000; 
	//const fogCol = 0x8f929e; 
	const fogCol = 0x808486; 
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	//renderer.setClearColor(0x777777, 1.0); 
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
	scene.fog = new THREE.FogExp2(fogCol, 0.0006);	
	//scene.fog.density = 0.0037;
	
	x.camGrup = new THREE.Group(); 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .1, 10000 );
	camera.position.set(0, _.ej[5], -100); 
	//camera.lookAt( 0, 0, 0 );

	//camera.position.x = 1000;
	//camera.position.z = 1000;
	
    //scene.add(camera);	
    x.camGrup.add(camera);	
	
	scene.add( new THREE.AmbientLight( 0x303030 ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	//x.spotLight[0] = new THREE.SpotLight( 0xffffff, 5000000, 6000, Math.PI/3.4, 1 );
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 20000000, 7000, Math.PI/3.4, 1 );
	//x.spotLight[0] = new THREE.SpotLight( 0xffffff, 35000000, 0, Math.PI/2, 1 );
	//x.spotLight[0].position.set( 0, 800, -200 );
//	x.spotLight[0].position.set( 0, 800, -1000 );
//	x.spotLight[0].position.set( 0, 2600, 0 );
//	x.spotLight[0].position.set( 0, 3000, 0 );
	x.spotLight[0].position.set( 0, 3000, 1000 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width = 1024;
	//x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 10;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	//scene.add( x.spotLight[0] );	
	
	x.camGrup.add( x.spotLight[0] );	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );

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
/*   controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = .8;	
    controls.autoRotate = false;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = .5;
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

	/*
	new RGBELoader()
		.setPath( 'img/hdrs/' )
		.load( 'quarry_01_1k.hdr', function ( texture ) {

			texture.mapping = THREE.EquirectangularReflectionMapping;

			scene.background = texture;
			//scene.environment = texture;

		} );
				
	
	cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
	//cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
	cubeRenderTarget.texture.type = THREE.HalfFloatType;

	cubeCamera = new THREE.CubeCamera( 1, 9000, cubeRenderTarget );	
	*/
	
	x.currGrup = 0; 
	
	x.targetO = new THREE.Object3D(); 
	x.targetO.position.set(0, florY+160, x.camGrup.position.z - 300); 
	scene.add(x.targetO);
	
	addLamps(); 
	addReflect();	
	addFloor();	
	addSidewalk();	
	addBldgs();	
	addTrees();	
	addTrash(); 
	//addCar1();	
	//addCar2();	
	addClouds();
	addFog(); 	
		
	//animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addReflect() {
	let width = 1000, 
		height = 3003,  
		kolor = 0x909090;
		
	_.reflect = []; 	

	let geometry = new THREE.PlaneGeometry( width, height );
	
	for ( let i = 0; i < 1; i++ ) {
		_.reflect[i] = new Reflector( geometry, {
			clipBias: 0.003,
			textureWidth: _.width * window.devicePixelRatio,
			textureHeight: _.height * window.devicePixelRatio,
			color: kolor
		} );
		_.reflect[i].position.y = florY-4;
		//_.reflect[i].position.z = 1500;
		_.reflect[i].position.z = -1500;
		_.reflect[i].rotateX( - Math.PI / 2 );
		
		//grups[i].add( _.reflect[i] );		
		//scene.add( _.reflect[i] );		
		x.camGrup.add( _.reflect[i] );		
	}
	
	
	let geometry2 = new THREE.PlaneGeometry( width, 1000 );
	let material = new THREE.MeshBasicMaterial( { color: 0x808486, transparent: true, fog: false } );
	material.depthWrite = false; 
	//material.side = THREE.DoubleSide; 
	
	_.bw = new THREE.Mesh( geometry2, material ); 
	_.bw.visible = false; 
	//_.bw.position.set(0, florY-1, 500); 
	_.bw.position.set(0, florY-1, -2500); 
	_.bw.rotateX( - Math.PI / 2 );
	//grups[0].add(bw);
	//scene.add(_.bw);
	x.camGrup.add(_.bw);
	
	let geometry3 = new THREE.PlaneGeometry( width, height );
	let material2 = new THREE.MeshBasicMaterial( { color: 0x808486, fog: false } );
	//material2.side = THREE.DoubleSide; 
	
	_.bw2 = new THREE.Mesh( geometry3, material2 ); 
	//_.bw2.visible = false; 
	//_.bw2.position.set(0, florY-1, height/-2); 
	_.bw2.position.set(0, florY-1, -4500); 
	_.bw2.rotateX( - Math.PI / 2 );
	//grups[0].add(bw2);
	//scene.add(_.bw2);
	x.camGrup.add(_.bw2);
	
	var	loader = new THREE.TextureLoader();
	loader.load( 'img/bw1.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(2, 2);    
		
		_.bw.material.alphaMap = tx; 
		_.bw.material.needsUpdate = true;
		_.bw.visible = true; 
	});	

}
	
function addFloor() {
	x.floor = []; 
	
	let width = 1000, 
		height = 3003,  
		//posX = 0, 
		rez = 1,  
		//intrvl = 400, 
		kolor = 0xcccccc; 
		
	let geometry = new THREE.PlaneGeometry( width, height, rez, rez );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: .95, metalness: .1 } );
	//let material = new THREE.MeshStandardMaterial( { envMap: cubeRenderTarget.texture, color: kolor, roughness: 1, metalness: 1 } );
	material.transparent = true; 
	material.depthWrite = false; 
	//material.opacity = 1; 
	//material.flatShading = true; 
	//material.wireframe = true; 
	//material.envMap = cubeRenderTarget.texture; 
	
	for ( let i = 0; i < 2; i++ ) {	
		//let pozZ = -((height/2)-1) + (height-1)*i; 
	//	let pozZ = -((height/2)-.5) + (height-1)*i; 
		
		let pozZ = 0; 
	
		//if (i == 1) pozZ = -1; 
	
		x.floor[i] = new THREE.Mesh( geometry, material ); 

		x.floor[i].position.set(0, florY, pozZ);
		//x.floor[i].position.set(0, florY, 0);
		x.floor[i].rotation.x = Math.PI/-2;
		//x.floor[i].rotation.z = Math.PI/2;
		//x.floor[i].castShadow = true; 
		x.floor[i].receiveShadow = true; 
		
		grups[i].add( x.floor[i] ); 
		
		//x.spotLight[i].target = x.floor[i];	
	}
	
	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	//loader.load( 'img/asphalt/9/diffuse.jpg', function(tx) { 	
	//loader.load( 'img/asphalt/3/1K-asphalt_11_Diffuse.jpg', function(tx) { 	
	loader.load( 'img/asphalt/color2.jpg', function(tx) { 	
	//loader.load( 'img/asphalt/3/1K-asphalt_11_Displacement.jpg', function(tx) { 	
	//loader.load( 'img/asphalt/4/decals_0006_color_1k.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(2, 6);    
		
		for ( let j = 0; j < 2; j++ ) {	
			x.floor[j].material.map = tx; 
			//x.floor[j].material.aoMapIntensity = 1; 
			//x.floor[j].material.aoMap = tx; 			
			//x.floor[j].material.bumpMap = tx; 
			//x.floor[j].material.normalScale.set(-.8, -.8); 
			//x.floor[j].material.normalMap = tx2; 
			//x.floor[j].material.roughnessMap = tx; 
			//x.floor[j].material.displacementScale = 60; 
			//x.floor[j].material.displacementBias = -5; 
			//x.floor[j].material.displacementMap = tx;			
			x.floor[j].material.needsUpdate = true;
			//x.floor[j].visible = true; 
		}
	});  		

	//loader2.load( 'img/asphalt/3/1K-asphalt_11_Displacement.jpg', function(tx2) { 	
	//loader2.load( 'img/asphalt/9/rough2.jpg', function(tx2) { 	
	//loader2.load( 'img/asphalt/4/decals_0006_height_1k.png', function(tx2) { 	
//	loader2.load( 'img/asphalt/4/decals_0006_roughness_1k.jpg', function(tx2) { 	
	loader2.load( 'img/asphalt/rough1.jpg', function(tx2) { 	
	//loader2.load( 'img/asphalt/9/bump.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(1, 3);    
		
		for ( let k = 0; k < 2; k++ ) {	
			x.floor[k].material.bumpScale = 1; 
			x.floor[k].material.bumpMap = tx2; 
			x.floor[k].material.needsUpdate = true;
			//x.floor[k].visible = true; 
		}
	});  		

	//loader3.load( 'img/asphalt/3/1K-asphalt_11_Reflect.jpg', function(tx3) { 	
//	loader3.load( 'img/asphalt/4/decals_0006_roughness_1k.jpg', function(tx3) { 	
	loader3.load( 'img/asphalt/rough1.jpg', function(tx3) { 	
	//loader3.load( 'img/asphalt/9/rough.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(1, 3);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 2; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			x.floor[l].material.metalnessMap = tx3; 	// TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			x.floor[l].material.roughnessMap = tx3; 
			x.floor[l].material.needsUpdate = true;
		}
	});	

	//loader4.load( 'img/asphalt/alpha1.jpg', function(tx4) { 	
	loader4.load( 'img/asphalt/alpha2.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(1, 3);    
		
		for ( let m = 0; m < 2; m++ ) {	
			x.floor[m].material.alphaMap = tx4; 
			x.floor[m].material.needsUpdate = true;
			//x.floor[m].visible = true; 
		}
	});  	

	grups[0].position.z = 1500;
	grups[1].position.z = -1500;
	
	scene.add(grups[0]); 	
	scene.add(grups[1]); 	
}

function addSidewalk() {
	//let meshCount = 0; 
	x.sidewalk = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/sh/sidewalk/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
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
		
	//	x.sidewalk = object; 
	//	x.sidewalk.position.set(-662, florY-2, 0); 
	//	x.sidewalk.rotation.set(0, Math.PI/2, 0); 
	//	x.sidewalk.scale.set(1.5, 1.5, 1.5); 
		
		//const material = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0xcccccc, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive = 0xffffff; 
	//	x.sidewalk.children[0].material = material; 
		//console.log(x.sidewalk.children[0].material); 
		
		//x.sidewalk.visible = false; 
		
		//for ( let i = 0; i < 3; i++ ) {	
		for ( let i = 0; i < 2; i++ ) {	
			x.sidewalk[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.sidewalk[i].castShadow = false; 
			x.sidewalk[i].receiveShadow = true; 			
			
			let sx = -645; 
			if (i==1) sx = 645; 
			
			//x.sidewalk[i].position.set(-645, florY-4.5, (-1000 + 1000*i)); 
		//	x.sidewalk[i].position.set(-645, florY-4.5, 0); 
			x.sidewalk[i].position.set(sx, florY-4.5, 0); 
			x.sidewalk[i].rotation.set(0, Math.PI/2, 0); 
			//x.sidewalk[i].scale.set(1.25, 2.2, 1.5); 
		//	x.sidewalk[i].scale.set(7.5, 2.2, 1.5); 
			x.sidewalk[i].scale.set(3.754, 2.2, 1.5); 
		
			grups[0].add( x.sidewalk[i] );		
		}		

		for ( let j = 2; j < 4; j++ ) {	
			x.sidewalk[j] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.sidewalk[j].castShadow = false; 
			x.sidewalk[j].receiveShadow = true; 			
			
			let sx2 = -645; 
			if (j==3) sx2 = 645;
			
			//x.sidewalk[j+1].position.set(645, florY-4.5, (-1000 + 1000*j)); 
		//	x.sidewalk[j].position.set(645, florY-4.5, 0); 
			x.sidewalk[j].position.set(sx2, florY-4.5, 0); 
			x.sidewalk[j].rotation.set(0, Math.PI/-2, 0); 
		//	x.sidewalk[j].scale.set(7.5, 2.2, 1.5); 
			x.sidewalk[j].scale.set(3.754, 2.2, 1.5); 
		
			grups[1].add( x.sidewalk[j] );		
		}		
		
		const planez = []; 
		
//		const geometry2 = new THREE.PlaneGeometry( 6000, 600 );
		const geometry2 = new THREE.PlaneGeometry( 3003, 600 );
		const material2 = new THREE.MeshStandardMaterial( { color: 0xbbbbbb, roughness: 1, metalness: 0 } );

		for ( let g = 0; g < 2; g++ ) {	
			planez[g] = new THREE.Mesh( geometry2, material2 );
//			planez[g].position.set(-1010, florY+8, 0); 

			let sx3 = -1090; 
			if (g==1) sx3 = 1090; 
			
			planez[g].position.set(sx3, florY+8, 0); 
			planez[g].rotation.set(Math.PI/-2, 0, Math.PI/-2); 
			planez[g].castShadow = false; 
			planez[g].receiveShadow = true; 
			
			grups[0].add( planez[g] );
		}	
		
		for ( let h = 2; h < 4; h++ ) {	
			planez[h] = new THREE.Mesh( geometry2, material2 );
			
			let sx4 = -1090; 
			if (h==3) sx4 = 1090; 
			
			planez[h].position.set(sx4, florY+8, 0); 
			planez[h].rotation.set(Math.PI/-2, 0, Math.PI/-2); 
			planez[h].castShadow = false; 
			planez[h].receiveShadow = true; 	
			
			grups[1].add( planez[h] );
		}
		
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),  
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/sh/sidewalk/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			tx.repeat.set(3, 1);		
			
			for ( let k = 0; k < 4; k++ ) {	
				x.sidewalk[k].material.map = tx; 
				x.sidewalk[k].material.needsUpdate = true; 
			}
			//x.sidewalk.visible = true; 
		}); 		

		load2.load( 'obj/sh/sidewalk/mat/rough1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
			tx2.repeat.set(3, 1);		
			
			for ( let l = 0; l < 4; l++ ) {
				x.sidewalk[l].material.roughnessMap = planez[l].material.roughnessMap = tx2; 
				x.sidewalk[l].material.needsUpdate = planez[l].material.needsUpdate = true; 
			}
		}); 		

		//load3.load( 'obj/sh/sidewalk/mat/N_7d2e270a335b4dcb8bccbb050b7e9251_footpath_nrm.tga.jpeg', function(tx3) { 
		load3.load( 'obj/sh/sidewalk/mat/normal1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
			tx3.repeat.set(3, 1);		
			
			for ( let m = 0; m < 4; m++ ) {
				x.sidewalk[m].material.normalScale.set(12, 12);  
				x.sidewalk[m].material.normalMap = tx3; 
				x.sidewalk[m].material.needsUpdate = true; 
			}
		}); 		
		
		load4.load( 'obj/sh/sidewalk/mat/cement.jpg', function(tx4) { 
			tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
			tx4.repeat.set(3, 1);		
			
			for ( let n = 0; n < 4; n++ ) {	
				planez[n].material.map = planez[n].material.bumpMap = tx4; 
				planez[n].material.bumpScale = 6; 

				planez[n].material.needsUpdate = true; 
			}
			
			//x.sidewalk.visible = true; 
		}); 		
		
		
		//grups[0].add(x.sidewalk); 
	}); 
	
}

function addBldgs() {
	//let meshCount = 0; 
	x.bldg = []; 
	const planes = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/sh/facade/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
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
		
		const scale = [.7, .84, .7, .84], 
			  posX1 = [1, -.982, 1, -1.15], 
		//    posZ1 = [3020, -850, -100, 3240], 
			  posZ1 = [1520, -2350, -1600, 1740], 
		//	  posZ2 = [-1895, 850, -1810, -3245], 
			  posZ2 = [-395, 2350, -310, -1745], 
			  rot1 = [0, Math.PI, 0, Math.PI], 
			  rot2 = [Math.PI, 0, Math.PI, 0];

		const planesW = [800, 800, 800, 800], 
			  planesH = [1350, 2300, 1450, 2080], 
			  planesX1 = [1700, -1727, 1774, -1874],
			  planesY1 = [590, 1060, 640, 952],
			  planesZ1 = [1480, 1470, -430, 40], 
			  planesX2 = [-1700, 1727, -1774, 1874],
			  planesY2 = [590, 1060, 640, 952],
			  planesZ2 = [1480, -83, -430, 1440];

		const planeMater = new THREE.MeshStandardMaterial( { color: 0x777777 } );	
			  
		for ( let i = 0; i < 4; i++ ) {	
			//const material = new THREE.MeshStandardMaterial( { envMap: cubeRenderTarget.texture, color: 0xffffff, roughness: .5, metalness: 0 } );
			//const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
			const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, metalness: .4 } );
		
			x.bldg[i] = new THREE.Mesh( object.children[i].geometry, material ); 
			
			x.bldg[i].castShadow = true; 
			x.bldg[i].receiveShadow = true; 			
			
			//x.bldg[i].position.set(-950, florY+12, -150); 
			x.bldg[i].position.set(1300 * posX1[i], florY+12, posZ1[i]); 
			
			//if (i == 3) x.bldg[i].position.set(-1030, florY+12, -120); 
			
			x.bldg[i].rotation.set(0, rot1[i], 0); 
			//x.bldg[i].scale.set(.35, .35, .35); 
			x.bldg[i].scale.set(scale[i], scale[i], scale[i]); 
		
			grups[0].add( x.bldg[i] );		
			
			const planeGeom = new THREE.PlaneGeometry( planesW[i], planesH[i] );
			planes[i] = new THREE.Mesh( planeGeom, planeMater );
			planes[i].position.set(planesX1[i], planesY1[i], planesZ1[i]); 
			grups[0].add(planes[i]);
		}		

		for ( let j = 0; j < 4; j++ ) {	
			//const material = new THREE.MeshStandardMaterial( { envMap: cubeRenderTarget.texture, color: 0xffffff, roughness: .5, metalness: 0 } );
			//const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
			const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, metalness: .4 } );
		
			x.bldg[j+4] = new THREE.Mesh( object.children[j].geometry, material ); 
			
			x.bldg[j+4].castShadow = true; 
			x.bldg[j+4].receiveShadow = true; 			
			
			x.bldg[j+4].position.set(1300 * posX1[j] * -1, florY+12, posZ2[j]); 
			
			//if (j == 3) x.bldg[j+4].position.set(1030, florY+12, 120); 
			
			x.bldg[j+4].rotation.set(0, rot2[j], 0); 
			x.bldg[j+4].scale.set(scale[j], scale[j], scale[j]); 
		
			grups[1].add( x.bldg[j+4] );		
			
			const planeGeom = new THREE.PlaneGeometry( planesW[j], planesH[j] );
			planes[j+4] = new THREE.Mesh( planeGeom, planeMater );
			planes[j+4].position.set(planesX2[j], planesY2[j], planesZ2[j]); 
			grups[1].add(planes[j+4]);			
		}		
		
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),  
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(),  
			load5 = new THREE.TextureLoader(), 
			load6 = new THREE.TextureLoader(), 
			load7 = new THREE.TextureLoader(), 
			load8 = new THREE.TextureLoader(), 
			load9 = new THREE.TextureLoader(), 
			load10 = new THREE.TextureLoader(), 
			load11 = new THREE.TextureLoader(), 
			load12 = new THREE.TextureLoader(); 
			//load13 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/sh/facade/mat/color2b.jpg', function(tx) { 
			x.bldg[0].material.map = x.bldg[4].material.map = tx; 
			x.bldg[0].material.needsUpdate = x.bldg[4].material.needsUpdate = true; 
		}); 	
		
		load2.load( 'obj/sh/facade/mat/color1b.jpg', function(tx2) { 		
			x.bldg[1].material.map = x.bldg[5].material.map = tx2; 
			x.bldg[1].material.needsUpdate = x.bldg[5].material.needsUpdate = true; 
		}); 	
		
		load3.load( 'obj/sh/facade/mat/color3b.jpg', function(tx3) { 		
			x.bldg[2].material.map = x.bldg[6].material.map = tx3; 
			x.bldg[2].material.needsUpdate = x.bldg[6].material.needsUpdate = true; 
		}); 	
		
		load4.load( 'obj/sh/facade/mat/color4b.jpg', function(tx4) { 		
			x.bldg[3].material.map = x.bldg[7].material.map = tx4; 
			x.bldg[3].material.needsUpdate = x.bldg[7].material.needsUpdate = true; 
		}); 	
		
		load5.load( 'obj/sh/facade/mat/metal2.jpg', function(tx5) { 		
			x.bldg[0].material.metalnessMap = x.bldg[4].material.metalnessMap = tx5; 
			x.bldg[0].material.needsUpdate = x.bldg[4].material.needsUpdate = true; 
		}); 	
		
		load6.load( 'obj/sh/facade/mat/metal1.jpg', function(tx6) { 		
			x.bldg[1].material.metalnessMap = x.bldg[5].material.metalnessMap = tx6; 
			x.bldg[1].material.needsUpdate = x.bldg[5].material.needsUpdate = true; 
		}); 	
		
		load7.load( 'obj/sh/facade/mat/metal3.jpg', function(tx7) { 		
			x.bldg[2].material.metalnessMap = x.bldg[6].material.metalnessMap = tx7; 
			x.bldg[2].material.needsUpdate = x.bldg[6].material.needsUpdate = true; 
		}); 	

		load8.load( 'obj/sh/facade/mat/metal4.jpg', function(tx8) { 		
			x.bldg[3].material.metalnessMap = x.bldg[7].material.metalnessMap = tx8; 
			x.bldg[3].material.needsUpdate = x.bldg[7].material.needsUpdate = true; 
		}); 	
	
		load9.load( 'obj/sh/facade/mat/rough2.jpg', function(tx9) { 
			x.bldg[0].material.roughnessMap = x.bldg[4].material.roughnessMap = tx9; 
			x.bldg[0].material.needsUpdate = x.bldg[4].material.needsUpdate = true; 
		}); 	

		load10.load( 'obj/sh/facade/mat/rough1.jpg', function(tx10) { 
			x.bldg[1].material.roughnessMap = x.bldg[5].material.roughnessMap = tx10; 
			x.bldg[1].material.needsUpdate = x.bldg[5].material.needsUpdate = true; 
		}); 	

		load11.load( 'obj/sh/facade/mat/rough3.jpg', function(tx11) { 
			x.bldg[2].material.roughnessMap = x.bldg[6].material.roughnessMap = tx11; 
			x.bldg[2].material.needsUpdate = x.bldg[6].material.needsUpdate = true; 
		}); 	
		
		load12.load( 'obj/sh/facade/mat/rough4.jpg', function(tx12) { 
			x.bldg[3].material.roughnessMap = x.bldg[7].material.roughnessMap = tx12; 
			x.bldg[3].material.needsUpdate = x.bldg[7].material.needsUpdate = true; 
		}); 	

	/*	
		load13.load( 'obj/sh/facade/mat/Metal022_1K-JPG_NormalGL.jpg', function(tx13) { 
			x.bldg[3].material.normalScale.set(.5, .5); 
			x.bldg[7].material.normalScale.set(.5, .5); 
			x.bldg[3].material.normalMap = x.bldg[7].material.normalMap = tx13; 
			x.bldg[3].material.needsUpdate = x.bldg[7].material.needsUpdate = true; 
		}); 	
	*/
		
		//x.spotLight[0].target = x.bldg[2];		
	
	}); 
	
}

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
	
function addLamps() {
	//let meshCount = 0; 
	x.lamps = []; 
	x.bulbs = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/lamp/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
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
		
	//	x.lamps = object; 
	//	x.lamps.position.set(-662, florY-2, 0); 
	//	x.lamps.rotation.set(0, Math.PI/2, 0); 
	//	x.lamps.scale.set(1.5, 1.5, 1.5); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .4, metalness: .3 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
	//	x.lamps.children[0].material = material; 
		//console.log(x.lamps.children[0].material); 
		
		const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .5, emissive: 0xfff5dd } );
		//material2.emissive = 0xfff0b9; 
		
		//x.lamps.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.lamps[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.lamps[i].castShadow = true; 
			x.lamps[i].receiveShadow = true; 			
			
			let sx = -570; 
			if (i==1) {
				sx = 570; 
				x.lamps[i].rotation.set(0, Math.PI, 0); 
			}

			x.lamps[i].position.set(sx, florY+734, -150); 
			x.lamps[i].scale.set(2.5, 2.5, 2.5); 
		
			grups[0].add( x.lamps[i] );		
		}		

		for ( let j = 2; j < 4; j++ ) {	
			x.lamps[j] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.lamps[j].castShadow = true; 
			x.lamps[j].receiveShadow = true; 			
			
			let sx2 = -570; 
			if (j==3) {
				sx2 = 570;
				x.lamps[j].rotation.set(0, Math.PI, 0); 
			}
			
			x.lamps[j].position.set(sx2, florY+734, -150); 
			x.lamps[j].scale.set(2.5, 2.5, 2.5); 
		
			grups[1].add( x.lamps[j] );		
		}		
		
		for ( let m = 0; m < 2; m++ ) {	
			x.bulbs[m] = new THREE.Mesh( object.children[1].geometry, material2 ); 
			
			let sx3 = -570; 
			if (m==1) {
				sx3 = 570; 
				x.bulbs[m].rotation.set(0, Math.PI, 0); 
			}

			x.bulbs[m].position.set(sx3, florY+734, -150); 
			x.bulbs[m].scale.set(2.5, 2.5, 2.5); 
		
			grups[0].add( x.bulbs[m] );		
		}				
		
		for ( let n = 2; n < 4; n++ ) {	
			x.bulbs[n] = new THREE.Mesh( object.children[1].geometry, material2 ); 
			
			let sx4 = -570; 
			if (n==3) {
				sx4 = 570; 
				x.bulbs[n].rotation.set(0, Math.PI, 0); 
			}

			x.bulbs[n].position.set(sx4, florY+734, -150); 
			x.bulbs[n].scale.set(2.5, 2.5, 2.5); 
		
			grups[1].add( x.bulbs[n] );		
		}				
		
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();  
			//load3 = new THREE.TextureLoader(),  
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/lamp/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			for ( let k = 0; k < 4; k++ ) {	
				x.lamps[k].material.map = tx; 
				x.lamps[k].material.needsUpdate = true; 
			}
			//x.lamps.visible = true; 
		}); 			

		load2.load( 'obj/lamp/mat/normal1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			for ( let l = 0; l < 4; l++ ) {	
				x.lamps[l].material.normalScale.set(2, 2); 
				x.lamps[l].material.normalMap = tx2; 
				x.lamps[l].material.needsUpdate = true; 
			}
			//x.lamps.visible = true; 
		}); 			

	}); 
	
	let targetObj = []; 
	let spotLightHelper = []; 
	
	for ( let o = 1; o < 3; o++ ) {	
		x.spotLight[o] = new THREE.SpotLight( 0xfff5dd, 10000000, 1200, Math.PI/8, 1 );
		
		let sx5 = -375; 
		if (o==2) sx5 = 375; 
	
		x.spotLight[o].position.set( sx5, 890, -150 );
		x.spotLight[o].castShadow = true;
		x.spotLight[o].shadow.camera.near = 10;
		x.spotLight[o].shadow.camera.far = 500;
		x.spotLight[o].shadow.camera.fov = 30;
		grups[0].add( x.spotLight[o] );	
	
		targetObj[o] = new THREE.Object3D(); 
		targetObj[o].position.set(sx5, florY, -150); 
		grups[0].add(targetObj[o]);
		
		x.spotLight[o].target = targetObj[o];
		
		//spotLightHelper[o] = new THREE.SpotLightHelper( x.spotLight[o] );
		//scene.add( spotLightHelper[o] );
	}
	
	for ( let p = 3; p < 5; p++ ) {	
		x.spotLight[p] = new THREE.SpotLight( 0xfff5dd, 10000000, 1200, Math.PI/8, 1 );
		
		let sx6 = -375; 
		if (p==4) sx6 = 375; 
	
		x.spotLight[p].position.set( sx6, 890, -150 );
		x.spotLight[p].castShadow = true;
		x.spotLight[p].shadow.camera.near = 10;
		x.spotLight[p].shadow.camera.far = 500;
		x.spotLight[p].shadow.camera.fov = 30;
		grups[1].add( x.spotLight[p] );	
	
		targetObj[p] = new THREE.Object3D(); 
		targetObj[p].position.set(sx6, florY, -150); 
		grups[1].add(targetObj[p]);
		
		x.spotLight[p].target = targetObj[p];
		
		//spotLightHelper[p] = new THREE.SpotLightHelper( x.spotLight[p] );
		//scene.add( spotLightHelper[p] );
	}
	
	const geometry = new THREE.PlaneGeometry( 160, 200 );		
	
	//const material3 = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
	const material3 = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: .6, side: THREE.DoubleSide } );
	material3.depthWrite = false; 
	//material3.fog = false; 
	
	for ( let q = 1; q < 3; q++ ) {	
		x.spotLcone[q] = new THREE.Mesh( geometry, material3 );
		
		let sx7 = -375; 
		if (q==2) sx7 = 375; 
		
		x.spotLcone[q].position.set( sx7, 215, -150 );
		x.spotLcone[q].scale.set( 7, 7, 1 );
		x.spotLcone[q].visible = false;			
		
		grups[0].add( x.spotLcone[q] );	
	}
	
	for ( let r = 3; r < 5; r++ ) {	
		x.spotLcone[r] = new THREE.Mesh( geometry, material3 );
		
		let sx8 = -375; 
		if (r==4) sx8 = 375; 
		
		x.spotLcone[r].position.set( sx8, 215, -150 );
		x.spotLcone[r].scale.set( 7, 7, 1 );
		x.spotLcone[r].visible = false;			
		
		grups[1].add( x.spotLcone[r] );	
	}
	
	let load3 = new THREE.TextureLoader();  
	
	load3.load( 'img/spotLconeA.png', function(tx3) { 
		//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
	//	tx3.repeat.set(6, 1);		
		
		for ( let s = 1; s < 5; s++ ) {	
			//x.spotLcone[s].material.emissiveIntensity = 10; 
			x.spotLcone[s].material.map = x.spotLcone[s].material.alphaMap = tx3; 
			x.spotLcone[s].material.needsUpdate = true; 
			x.spotLcone[s].visible = true; 
		}
		
		//fadeScene(); 
	}); 	
	
	addCar1();	
	
}

function addTrees() {
	//let meshCount = 0; 
	x.trees = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/2/tree1.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .4, metalness: 0, transparent: true } );
		material.depthWrite = false; 
		material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
	//	const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .5, emissive: 0xfff5dd } );
		//material2.emissive = 0xfff0b9; 
		
		//x.trees.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.trees[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.trees[i].castShadow = true; 
			x.trees[i].receiveShadow = true; 			
			
			let sx = -650; 
			if (i==1) sx = 650; 

			x.trees[i].position.set(sx, florY+35, 1350); 
			x.trees[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI); 
			x.trees[i].scale.set(.56, .56, .56); 
		
			grups[0].add( x.trees[i] );		
		}		

		for ( let j = 2; j < 4; j++ ) {	
			x.trees[j] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.trees[j].castShadow = true; 
			x.trees[j].receiveShadow = true; 			
			
			let sx2 = -650; 
			if (j==3) sx2 = 650;
			
			x.trees[j].position.set(sx2, florY+35, 1350); 
			x.trees[j].rotation.set(Math.PI/-2, 0, Math.random() * -Math.PI); 
			x.trees[j].scale.set(.56, .56, .56); 
		
			grups[1].add( x.trees[j] );		
		}		
		
	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();  
			//load3 = new THREE.TextureLoader(),  
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/trees/2/mat/color1.png', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			for ( let k = 0; k < 4; k++ ) {	
				x.trees[k].material.map = tx; 
				x.trees[k].material.needsUpdate = true; 
			}
			//x.trees.visible = true; 
		}); 			

		load2.load( 'obj/trees/2/mat/alpha1.png', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			for ( let l = 0; l < 4; l++ ) {	
				x.trees[l].material.alphaMap = tx2; 
				x.trees[l].material.needsUpdate = true; 
			}
			//x.trees.visible = true; 
		}); 			

	}); 

	const cube = []; 

	const geometry2 = new THREE.BoxGeometry( 140, 20, 140 ); 
	//const material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
	const material2 = new THREE.MeshStandardMaterial( { color: 0xbbbbbb, roughness: .5 } );
		
	for ( let m = 0; m < 2; m++ ) {	
		cube[m] = new THREE.Mesh( geometry2, material2 ); 
		
		cube[m].castShadow = true; 
		cube[m].receiveShadow = true; 			
		
		let sx3 = -650; 
		if (m==1) sx3 = 650;

		cube[m].position.set(sx3, florY+20, 1350); 
		
		grups[0].add( cube[m] );
	}
	
	for ( let n = 2; n < 4; n++ ) {	
		cube[n] = new THREE.Mesh( geometry2, material2 ); 
		
		cube[n].castShadow = true; 
		cube[n].receiveShadow = true; 			
		
		let sx4 = -650; 
		if (n==3) sx4 = 650;

		cube[n].position.set(sx4, florY+20, 1350); 
		
		grups[1].add( cube[n] );
	}
	
	let load3 = new THREE.TextureLoader();
	
	load3.load( 'obj/trees/2/mat/cement2.jpg', function(tx3) { 
		//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.repeat.set(3, 1);		
		
		for ( let o = 0; o < 4; o++ ) {	
			cube[o].material.map = cube[o].material.bumpMap = tx3; 
			cube[o].material.bumpScale = 6; 

			cube[o].material.needsUpdate = true; 
		}	
	});
	
}

function addTrash() {
	//let meshCount = 0; 
	x.trash = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/trash/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
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
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, metalness: .1 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
	//	const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .5, emissive: 0xfff5dd } );
		//material2.emissive = 0xfff0b9; 
		
		//x.trash.visible = false; 

		for ( let i = 0; i < 2; i++ ) {		
			x.trash[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			        
			x.trash[i].castShadow = true; 
			x.trash[i].receiveShadow = true; 			
			
			let sx = -1080,  
				sz = 170, 
				rotY = Math.PI; 
				
			if (i==1) {
				sx = 1080; 
				sz = -1230; 
				rotY = 0; 
			}			
			        
			x.trash[i].position.set(sx, florY+107, sz); 
			x.trash[i].rotation.set(0, rotY, 0); 		
			x.trash[i].scale.set(98, 98, 98); 
			
			grups[i].add( x.trash[i] );		
		}
		
		/*x.trash[1] = new THREE.Mesh( object.children[0].geometry, material ); 
		
		x.trash[1].castShadow = true; 
		x.trash[1].receiveShadow = true; 			
		
		x.trash[1].position.set(1120, florY+107, -1230); 
		//x.trash[1].rotation.set(0, Math.PI, 0); 			
		x.trash[1].scale.set(80, 80, 80); 
		
		grups[1].add( x.trash[1] );		*/
	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),  
			load3 = new THREE.TextureLoader();   
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/trash/mat/color1.jpg', function(tx) { 
			//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			for ( let k = 0; k < 2; k++ ) {	
				x.trash[k].material.map = tx; 
				x.trash[k].material.needsUpdate = true; 
			}
			//x.trash.visible = true; 
		}); 			

		load2.load( 'obj/trash/mat/normal1.jpg', function(tx2) { 
			//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			for ( let l = 0; l < 2; l++ ) {	
				x.trash[l].material.normalMap = tx2; 
				x.trash[l].material.needsUpdate = true; 
			}
			//x.trash.visible = true; 
		}); 			

		load3.load( 'obj/trash/mat/rough1.jpg', function(tx3) { 
			//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			for ( let l = 0; l < 2; l++ ) {	
				x.trash[l].material.roughnessMap = tx3; 
				x.trash[l].material.needsUpdate = true; 
			}
			//x.trash.visible = true; 
		}); 			
		
	}); 
	
}

function addCar1() {
	//let meshCount = 0; 
	x.car = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/car/1/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
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
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, metalness: .7 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .5, emissive: 0xfff5dd } );
		//material2.emissive = 0xfff0b9; 
		
		//x.car.visible = false; 
		

		x.car[0] = new THREE.Mesh( object.children[0].geometry, material ); 
		
		x.car[0].castShadow = true; 
		x.car[0].receiveShadow = true; 			
		

		//x.car[0].position.set(350, florY-.7, -300); 
		x.car[0].position.set(300, florY-1.5, -300); 
		x.car[0].rotation.set(0, Math.PI, 0); 		
		//x.car[0].scale.set(2.5, 2.5, 2.5); 
		x.car[0].scale.set(3.1, 3.1, 3.1); 
		
		grups[0].add( x.car[0] );		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),  
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/car/1/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.car[0].material.map = tx; 
			x.car[0].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			

		load2.load( 'obj/car/1/mat/normal1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.car[0].material.normalScale.set(-.5, -.5); 
			x.car[0].material.normalMap = tx2; 
			x.car[0].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			

		load3.load( 'obj/car/1/mat/rough1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			x.car[0].material.roughnessMap = tx3; 
			x.car[0].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			
		
		load4.load( 'obj/car/1/mat/metal1.jpg', function(tx4) { 
			tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//	tx4.repeat.set(6, 1);		
			
			x.car[0].material.metalnessMap = tx4; 
			x.car[0].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			

		addCar2();	
	}); 
	
}

function addCar2() {
	//let meshCount = 0; 
	//x.car = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'obj/car/2/model.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
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
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .9, metalness: .7 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//const material2 = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: .5, emissive: 0xfff5dd } );
		//material2.emissive = 0xfff0b9; 
		
		//x.car.visible = false; 
		

		x.car[1] = new THREE.Mesh( object.children[0].geometry, material ); 
		      
		x.car[1].castShadow = true; 
		x.car[1].receiveShadow = true; 			
		      
              
		x.car[1].position.set(-300, florY+95, -300); 
		//x.car[1].position.set(-300, florY+95, 400); 
		x.car[1].rotation.set(0, Math.PI/-2, 0); 		
	//	x.car[1].scale.set(3.5, 3.5, 3.5); 
		x.car[1].scale.set(4.3, 4.3, 4.3); 
		
		grups[1].add( x.car[1] );		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),  
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/car/2/mat/color1.jpg', function(tx) { 
			tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//	tx.repeat.set(6, 1);		
			
			x.car[1].material.map = tx; 
			x.car[1].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			

		load2.load( 'obj/car/2/mat/normal1.jpg', function(tx2) { 
			tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//	tx2.repeat.set(6, 1);		
			
			x.car[1].material.normalScale.set(1, 1); 
			x.car[1].material.normalMap = tx2; 
			x.car[1].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			

		load3.load( 'obj/car/2/mat/rough1.jpg', function(tx3) { 
			tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//	tx3.repeat.set(6, 1);		
			
			x.car[1].material.roughnessMap = tx3; 
			x.car[1].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			
		
		load4.load( 'obj/car/2/mat/metal1.jpg', function(tx4) { 
			tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//	tx4.repeat.set(6, 1);		
			
			x.car[1].material.metalnessMap = tx4; 
			x.car[1].material.needsUpdate = true; 

			//x.car.visible = true; 
		}); 			

		animFBX(); 		
	}); 
	
}

const randomizeMatrix = function () {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();

	return function ( matrix ) {
		position.x = (Math.random() * 1900) - 950; 
		//position.y = (Math.random() * 300) + florY + 25; 
		position.y = (Math.random() * 500) + 15; 
		//position.y = 500; 
		position.z = (Math.random() * 3000) - 1500;

		//rotation.x = (Math.random() * .2 - .1) * Math.PI;
		rotation.x = Math.random() * (Math.PI/2.5);
		if (position.y < 100) rotation.x *= -1; 
		
		//rotation.y = (Math.random() * .2 - .1) * Math.PI;
		rotation.y = Math.random() * (Math.PI/2.5);
		if (position.x > 0) rotation.y *= -1; 
		
		rotation.z = Math.random() * 2 * Math.PI;

		quaternion.setFromEuler( rotation );

		//scale.x = scale.y = scale.z = 42 - Math.random() * 7;
		scale.x = Math.random() * .3 + 1; 
		scale.y = Math.random() * .3 + 1; 

		matrix.compose( position, quaternion, scale );
	};
}(); 

function addFog() {
	x.fog = []; 
	let matrix = []; 
	
	const geometry = new THREE.PlaneGeometry( 200, 200 ); 
	const material = new THREE.MeshBasicMaterial( { color: 0x909496, transparent: true } );
	material.depthWrite = false; 
	//material.opacity = .9; 
	
	for ( let i = 0; i < 2; i ++ ) {
		matrix[i] = new THREE.Matrix4(); 
			
		x.fog[i] = new THREE.InstancedMesh( geometry, material, 300 );
			
		for ( let j = 0; j < 300; j ++ ) {
			randomizeMatrix( matrix[i] );
			x.fog[i].setMatrixAt( j, matrix[i] );
		}			
			
		x.fog[i].visible = false; 
		
		grups[i].add(x.fog[i]); 
	}
	
	let	loader = new THREE.TextureLoader();   
		//loader2 = new THREE.TextureLoader(); 
	
	loader.load( 'img/ulap5.png', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    
		
		for ( let k = 0; k < 2; k ++ ) {
			x.fog[k].material.map = tx; 
			x.fog[k].material.alphaMap = tx; 
			x.fog[k].material.needsUpdate = true;
			x.fog[k].visible = true; 
		}
	}); 
	
	/*loader2.load( 'img/ulapa.jpg', function(tx2) { 	
		//tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		//tx2.repeat.set(4, 4);    
		
		for ( let l = 0; l < 2; l ++ ) {
			x.fog[l].material.alphaMap = tx2; 
			x.fog[l].material.needsUpdate = true;
			x.fog[l].visible = true; 
		}
	}); */
	
}
	
/*function addFog2() {
	x.kloud = []; 
	
	for ( let i = 0; i < 2; i ++ ) {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];
		
		for ( let j = 0; j < 200; j ++ ) {
			const x = 2000 * Math.random() - 1000; 
			const y = 300 * Math.random() + florY+220; 		
			//const y = 500; 		
			const z = 3000 * Math.random() - 1500;  
		
			vertices.push( x, y, z );
		}
		
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		geometry.computeBoundingSphere();
			
		let material = new THREE.PointsMaterial( { color: 0x808486, size: 400, sizeAttenuation: false, transparent: true, depthWrite: false, depthTest: true, fog: true} );
		//material.color.setHSL( 1.0, .4, .9 );
		material.opacity = .9;
		//material.fogColor = fog.color;
		//material.fogNear = fog.near; 
		//material.fogFar = fog.far; 
			
		x.kloud[i] = new THREE.Points( geometry, material );

	//	x.kloud[i].position.set(0, 1, 300); 	
		
		grups[i].add( x.kloud[i] );	
		
		//scene.add( x.kloud1 );	
		
		//material.blending = THREE.AdditiveBlending; 
	}
	
	let	loader = new THREE.TextureLoader(); 
	
	loader.load( 'img/ulap5.png', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    
		
		for ( let j = 0; j < 2; j ++ ) {
			x.kloud[j].material.map = tx; 
			x.kloud[j].material.needsUpdate = true;
			//x.kloud[j].visible = true; 
		}
	}); 	
}*/
	
function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
        //let val = parseFloat(ui.kontainer.style.opacity); 
		let val = parseFloat(ui.fader.style.opacity); 
		
        //if (!((val += .02) > 1.0)) {
		if (!((val -= .05) < 0)) {
            //ui.kontainer.style.opacity = val; 
			ui.fader.style.opacity = val;
			//console.log(ui.fader.style.opacity); 			
            
			requestAnimationFrame(fadeIn); 
        } else {
            //ui.kontainer.style.opacity = 1.0; 
			ui.fader.style.opacity = 0;
            ui.fader.style.display = "none";
			ui.fader.parentNode.removeChild(ui.fader);	
			
			onWindowResize(); 			
			
			//ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
			
			eL(ui.kontainer, 0, 'pointerdown', onPointerDown); 
			eL(ui.kontainer, 0, "pointermove", onPointerMove); 
			//eL(ui.kontainer, 0, "wheel", wheelE); 
			
			animate();  
			
		//	theIntro(); 
			
		//	animWalk(); 
			//animWalk2(); 
			
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

/*function swtchKamClick2(event) {	
    if (event) event.preventDefault(); 
	//console.log('e');
	
	eL(ui.swtchKam, 1, 'pointerup', swtchKamClick2); 
	
	_.idleTimer = 0; 
}*/

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
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	
	
	/*
	_.reflect.getRenderTarget().setSize(
		_.width * window.devicePixelRatio,
		_.height * window.devicePixelRatio
	);
	*/
	
	if (isMobil) {
		_.cr[1] = -.0006; 
		_.cr[0] = .0004; 
	} else {
	//	_.cr[1] = -.0004; 
		_.cr[1] = -.00024; 
		_.cr[0] = .00048; 		
	}
	
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
			if (x.currGrup == ej1) {
				x.car[0].position.x *= -1; 
				x.car[0].position.z = (Math.random() * 2000) - 1000; 
				
				x.car[0].rotation.y = (x.car[0].rotation.y == 0) ? Math.PI : 0; 
				
				//x.currGrup = 1; 
			} else {
				x.car[1].position.x *= -1; 
				x.car[1].position.z = (Math.random() * 2000) - 1000; 

				x.car[1].rotation.y *= -1; 				
				
				//x.currGrup = 0; 
			}
			
			x.camGrup.position.z = _.ej[3]; 
			
			x.targetO.position.z = _.ej[3] - 300; 
			
			grups[0].position.z *= -1; 
			grups[1].position.z *= -1; 
			
			x.currGrup = (x.currGrup == 0) ? 1 : 0; 
		} else {
			x.camGrup.position.z = z0 + _.ej[1]; 
			x.targetO.position.z = z1 + _.ej[1]; 
		}
		
	/*	if (z0 == 1200) {
			grups[0].remove(x.spotLight[1]);
			grups[0].remove(x.spotLight[2]);
		}
		
		if (z0 == 1600) {	
			grups[1].add(x.spotLight[3]);
			grups[1].add(x.spotLight[4]);
		}
	*/	
/*		if (z0 == _.ej[0]) {
			grups[0].position.z = _.ej[3]; 
		} else {
			grups[0].position.z = z0 + _.ej[1]; 
		}
		
		if (z1 == _.ej[0]) {
			grups[1].position.z = _.ej[3]; 
		} else {
			grups[1].position.z = z1 + _.ej[1]; 
		}
*/
		
//		requestAnimationFrame(walkIn);					
//    })();	
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
			
		//	matr[i] = new THREE.MeshStandardMaterial( { color: 0xd4d4d4, roughness: .75, metalness: 0 } );
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .73, metalness: 0 } );
			x.char1.children[i].material = matr[i]; 
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
			matr[2].normalScale = new THREE.Vector2( -1, -1 ); 
			//matr[2].normalScale.set( -1, -1 ); 
			matr[2].normalMap = txn2; 
			matr[2].needsUpdate = true;
		});  	

		load3n.load( url2 + 'bodyn.' + frm, function(txn3) { 	
			matr[3].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[3].normalMap = txn3; 
			matr[3].needsUpdate = true;
		});  	
			
		load4n.load( url2 + 'hatn.' + frm, function(txn4) { 	
			matr[4].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[4].normalMap = txn4; 
			matr[4].needsUpdate = true;
		});  	
		
		load5n.load( url2 + 'shoesn.' + frm, function(txn5) { 	
			matr[5].roughness = .5; 
			matr[5].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[5].normalMap = txn5; 
			matr[5].needsUpdate = true;
		});  	
		
		load6n.load( url2 + 'topn.' + frm, function(txn6) { 	
			matr[6].normalScale = new THREE.Vector2( -.8, -.8 ); 
			matr[6].normalMap = txn6; 
			matr[6].needsUpdate = true;
		});  		

		
		//x.char1.rotation.x = 0;		
		//x.char1.position.set(0, -100, 1060); 
		//x.char1.rotation.y = Math.PI; 	
		
		x.char1.scale.set(1.48, 1.48, 1.48); 
		//x.char1.position.set(0, -100, 1090); 
		x.char1.position.set(0, florY-0, -300); 
		//x.char1.position.set(0, florY-0, _.ej[0] -300); 
		//x.char1.position.set(-1180, florY-0, -300); 
		//x.char1.rotation.set(-.2, Math.PI, 0);	
		x.char1.rotation.set(0, _.ej[2], 0);	
		
		x.camGrup.add( x.char1 ); 
		
		//camera.lookAt(x.char1.position);
		x.spotLight[0].target = x.char1;
		
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
	
	let url = 'teenb1/walkswag'; 	//mono
	url += '.fbx'; 
	
	const loader = new FBXLoader();
	
	loader.load( 'obj/' + url, function ( object ) {	

		mixer = new THREE.AnimationMixer( x.char1 );
		//console.log( object );
		
	//	x.char1.animations[ 0 ] = object;
		
		//const action = mixer.clipAction( x.char1.animations[ 0 ] );
		x.actions[0] = mixer.clipAction( object.animations[ 0 ] );
		x.actions[0].play(); 
		
		//console.log(x.char1.animations[ 0 ]);
		
		//anim8B(); 
		
		fadeScene(); 	
	} );

}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.003;
	
	//	const delta = clock.getDelta() * .7;
		
		//console.log(timer); 
		
		//if ( mixer ) mixer.update( delta );	
	//	if ( mixer ) mixer.update( .0116 );	
	//	if (_.inCtr > 200) mixer.update( .0116 );	
//		mixer.update( _.ej[4] );	
		
		const delta = clock.getDelta() * .6;
		if ( mixer ) mixer.update( delta );	
		
		animWalk(); 
		
		//camera.position.x = (Math.cos(timer*1) * 3.5) * _.ej[1]; 
	//	camera.position.x = (Math.cos(timer) * 2) * (_.ej[1]/2); 
		camera.position.x = (Math.cos(timer) * 2); 
		//camera.position.y = (Math.sin(timer*2) * 5) * _.ej[1] + _.ej[5]; 
		camera.position.y = (Math.sin(timer*2) * 2) + _.ej[5]; 

		//camera.position.x += _.pointer.x * -200 * (_.ej[1]/2); 
		
		if (isMobil) {
			camera.position.x += Math.cos(timer*.1) * 100; 
			camera.position.y += Math.sin(timer*.05) * 100; 
		} else {
			camera.position.x += _.pointer.x * 200; 
			camera.position.y += (_.pointer.y * 200);
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
	
	//TWEEN.update();	
}

function render() {
	//camera.lookAt(scene.position); 	
	//camera.lookAt(0, 10000, 0); 	
	camera.lookAt(x.targetO.position);

	for ( let j = 1; j < 5; j++ ) {	
		x.spotLcone[j].lookAt(camera.position); 
		x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	}
	
	//cubeCamera.update( renderer, scene ); 
	
	//controls.update(); 
	
	//x.spotLight.target = camera;		
	//x.spotLightHelper.update();
	
//	camera.rotation.y = ( mouseX - camera.position.x ) * _.cr[1];
//	camera.rotation.x = ( -mouseY - camera.position.y ) * _.cr[0];	
	
	renderer.render( scene, camera );	
}

function addAud() {
	
	//console.log(x.sound); 
	
	if (!x.sound) {
		//let url = 'PromiseReprise'; 	
		//let url = 'tense-horror-background-174809'; 	
		//let url = 'sinister-mystery-174823'; 	
		//let url = 'the-curtain-162718'; 	
		//let url = 'gloomy-reverie-190650'; 	
		let url = 'sh'; 	
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
			x.sound.setVolume( 0.9 );
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
	
	
	
