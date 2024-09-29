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
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { Reflector } from 'three/addons/objects/Reflector.js';

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
    ui.kontainer.style.backgroundColor = '#15191b';		

	//const fogCol = 0x808486; 
	const fogCol = 0x15191b; 
	
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
	scene.fog = new THREE.FogExp2(fogCol, 0.0002);	
	//scene.fog = new THREE.FogExp2(0x00ff00, 0.0002);	
	//scene.fog.density = 0.0037;
	
	//x.camGrup = new THREE.Group(); 
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 10000 );
	camera.position.set(0, 400, 600); 
	//camera.lookAt( 0, 0, 0 );

    scene.add(camera);	
    //x.camGrup.add(camera);	
	
	scene.add( new THREE.AmbientLight( 0x303030 ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 20000000, 5000, Math.PI/6, 1 );
	x.spotLight[0].position.set( 0, 1500, 0 );
	x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	x.spotLight[0].shadow.mapSize.width = 128;
	x.spotLight[0].shadow.mapSize.height = 128;
	x.spotLight[0].shadow.camera.near = 10;
	x.spotLight[0].shadow.camera.far = 5000;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	scene.add( x.spotLight[0] );	
	
	//x.camGrup.add( x.spotLight[0] );	

	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );

	//x.spotLight[0].target = camera; 
	
	//x.camGrup.position.set(0, 0, _.ej[3]); 
	//scene.add(x.camGrup); 
	
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
    controls.zoomSpeed = 1.6;
    controls.panSpeed = 1;
	//controls.update();		
//	controls.enabled = false; 
*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	//grups[0] = grups[1] = grups[2] = new THREE.Group(); 
	grups[0] = new THREE.Group(); 
//	grups[1] = new THREE.Group(); 
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
	x.targetO.position.set(0, florY+140, -300); 
	scene.add(x.targetO);
	
	x.spotLight[0].target = x.targetO; 
	
//	controls.target = x.targetO.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	addSkybox(); 
	addFloor();	
	addWall();	
	//addTable(); 
	addPC(); 
	//addMonitor(); 
	addKeyboard(); 
	addMouse(); 
	addSpeakers(); 
	addHeadphones(); 
	addMic(); 
	addModem();
	//addGlasses(); 
	//addPhone(); 
	//addCup(); 
	//addChair(); 
	
	//animFBX(); 
	
	//addAud(); 

	onWindowResize(); 
	
	//entro(); 
	//fadeScene(); 	
}

function addSkybox() {
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/2/' );

	loader.load( [
		'posx.jpg', 'negx.jpg',
		'posy.jpg', 'negy.jpg',
		'posz.jpg', 'negz.jpg'
	], function ( tx ) {
		//tx.flipY = true; 
		tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	
		//addWall();	
		addTable(); 
		//addPC(); 
		addMonitor(); 
		//addKeyboard(); 
		//addMouse(); 
		//addSpeakers(); 
		//addHeadphones(); 
		//addMic(); 
		//addModem();
		addGlasses(); 
		addPhone(); 
		addCup(); 
		addChair(); 		
		
	} );
	
	//x.skybox = loader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
	//x.skybox = loader.load( [ 'posx.png', 'negx.png', 'posy.png', 'negy.png', 'posz.png', 'negz.png' ] );
	
	//scene.background = x.skybox; 
	//scene.environment = x.skybox; 
	//scene.environmentIntensity = 2; 
	
}
	
function addFloor() {
	x.floor = []; 
	
	let width = 2000, 
		height = 1000,  
		//posX = 0, 
		rez = 1,  
		//intrvl = 400, 
		kolor = 0x565656; 
		
	const geometry = new THREE.PlaneGeometry( width, height, rez, rez );

	let material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	material.transparent = true; 
	//material.depthWrite = false; 
	//material.opacity = 1; 
	//material.flatShading = true; 
	//material.wireframe = true; 
	//material.envMap = cubeRenderTarget.texture; 
	
	for ( let i = 0; i < 1; i++ ) {	
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
		//x.floor[i].receiveShadow = true; 
		
		grups[0].add( x.floor[i] ); 
		
		//x.spotLight[i].target = x.floor[i];	
	}
	
	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	loader.load( 'img/concrete/1/color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(2, 1);    
		
		for ( let j = 0; j < 1; j++ ) {	
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

	loader2.load( 'img/concrete/1/normal1.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(2, 1);    
		
		for ( let k = 0; k < 1; k++ ) {	
			x.floor[k].material.normalScale.set(-1, -1); 
			x.floor[k].material.normalMap = tx2; 
			x.floor[k].material.needsUpdate = true;
			//x.floor[k].visible = true; 
		}
	});  		

	loader3.load( 'img/concrete/1/rough2.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(2, 1);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.floor[l].material.aoMapIntensity = 1; 
			//x.floor[l].material.aoMap = tx3; 
			x.floor[l].material.roughnessMap = tx3; 
			x.floor[l].material.needsUpdate = true;
		}
	});	

	/*loader4.load( 'img/concrete/1/1K-concrete_white-displacement.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(2, 1);    
		
		for ( let m = 0; m < 2; m++ ) {	
			x.floor[m].material.bumpScale = 2; 
			x.floor[m].material.bumpMap = tx4; 
			x.floor[m].material.needsUpdate = true;
			//x.floor[m].visible = true; 
		}
	});  */	

	const geometry2 = new THREE.PlaneGeometry( width, height );	
	geometry2.rotateX( - Math.PI / 2 );
	
	const material2 = new THREE.ShadowMaterial();
	material2.opacity = 0.67;
	
	const plane = new THREE.Mesh( geometry2, material2 );
	plane.position.set(0, florY+1, 0);
	//plane.rotation.x = Math.PI/-2;	
	plane.receiveShadow = true;
	grups[0].add( plane );	
	
	grups[0].position.z = 0;
	//grups[1].position.z = -1500;
	
	scene.add(grups[0]); 	
	//scene.add(grups[1]); 	
}

function addWall() {
	x.wall = []; 
	
	let width = 2000, 
		height = 1000,  
		//posX = 0, 
		rez1 = 20,  
		rez2 = 10,  
		//intrvl = 400, 
		kolor = 0x74787c; 
		
	let geometry = new THREE.PlaneGeometry( width, height, rez1, rez2 );

	let material = new THREE.MeshStandardMaterial( { color: kolor, emissive: 0x557788, roughness: 1, metalness: .2 } );
	material.transparent = true; 
	//material.depthWrite = false; 
	//material.opacity = 1; 
	material.flatShading = true; 
	//material.wireframe = true; 
	//material.envMap = cubeRenderTarget.texture; 
	
	for ( let i = 0; i < 1; i++ ) {	
		//let pozZ = -((height/2)-1) + (height-1)*i; 
	//	let pozZ = -((height/2)-.5) + (height-1)*i; 
		
		let pozZ = 0; 
	
		//if (i == 1) pozZ = -1; 
	
		x.wall[i] = new THREE.Mesh( geometry, material ); 

		x.wall[i].position.set(0, florY+(height/2), height/-2);
		//x.wall[i].position.set(0, florY, 0);
		//x.wall[i].rotation.x = Math.PI/-2;
		//x.wall[i].rotation.z = Math.PI/2;
		x.wall[i].castShadow = true; 
		//x.wall[i].receiveShadow = true; 
		
		grups[i].add( x.wall[i] ); 
	}
	
	const geometry2 = new THREE.PlaneGeometry( width, height, rez1, rez2 );	
	//geometry2.rotateX( - Math.PI / 2 );
	
	const material2 = new THREE.ShadowMaterial();
	material2.opacity = 0.67;
	material2.flatShading = true; 
	//material2.transparent = false; 
	
	x.wallS = new THREE.Mesh( geometry2, material2 );
	x.wallS.position.set(0, florY+(height/2), (height/-2) + 57);
	//x.wallS.rotation.x = Math.PI/-2;	
	x.wallS.receiveShadow = true;
	grups[0].add( x.wallS );		
	
		
	var	loader = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(),   
		loader4 = new THREE.TextureLoader();

	loader.load( 'img/metal/1/color1.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(4, 2);    
		
		for ( let j = 0; j < 1; j++ ) {	
			x.wall[j].material.map = tx; 
			//x.wall[j].material.aoMapIntensity = 1; 
			//x.wall[j].material.aoMap = tx; 			
			//x.wall[j].material.bumpMap = tx; 
			//x.wall[j].material.normalScale.set(-.8, -.8); 
			//x.wall[j].material.normalMap = tx2; 
			//x.wall[j].material.roughnessMap = tx; 
			//x.wall[j].material.displacementScale = 60; 
			//x.wall[j].material.displacementBias = -5; 
			//x.wall[j].material.displacementMap = tx;			
			x.wall[j].material.needsUpdate = true;
			//x.wall[j].visible = true; 
			
			fadeScene(); 
		}
	});  		

	loader2.load( 'img/grid2.png', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(20, 10);    
		
		for ( let k = 0; k < 1; k++ ) {	
			x.wall[k].material.emissiveIntensity = 1.75; 
			x.wall[k].material.emissiveMap = tx2; 
			x.wall[k].material.needsUpdate = true;
			//x.wall[k].visible = true; 
		}
	});  	

	loader3.load( 'img/metal/1/rough1.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(4, 2);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 1; l++ ) {	
			//x.wall[l].material.aoMapIntensity = 1; 
			//x.wall[l].material.aoMap = tx3; 
			x.wall[l].material.roughnessMap = tx3; 
			x.wall[l].material.bumpScale = .8; 
			x.wall[l].material.bumpMap = tx3; 
			x.wall[l].material.needsUpdate = true;
		}
	});	

	loader4.load( 'img/noise1.jpg', function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(2, 1);    
		
		for ( let m = 0; m < 1; m++ ) {	
			x.wall[m].material.displacementScale = x.wallS.material.displacementScale = 60; 
			x.wall[m].material.displacementMap = x.wallS.material.displacementMap = tx4; 
			x.wall[m].material.needsUpdate = x.wallS.material.needsUpdate = true;
			//x.wall[m].visible = true; 
		}
		
		//console.log(x.wall[0].geometry.getAttribute('position'));
		
		let geom = x.wall[0].geometry;
		let posXYZ = geom.getAttribute('position');

		let geom2 = x.wallS.geometry;
		let posXYZ2 = geom2.getAttribute('position');
		
		//console.log(posXYZ.count); 
		
		for (let h = 22; h < posXYZ.count - 21; h++) { 
			if (((h % 21) != 0) && ((h % 21) != 20)) {
				let x = posXYZ.getX(h) + (Math.random()*100-50);
				let y = posXYZ.getY(h) + (Math.random()*100-50);			
				let z = posXYZ.getZ(h) + (Math.random()*100-50);
				posXYZ.setXYZ(h, x, y, z);
				posXYZ2.setXYZ(h, x, y, z);
			}
		}
		
		posXYZ.needsUpdate = posXYZ2.needsUpdate = true;		
	});  	

	//grups[0].position.z = 0;
	//grups[1].position.z = -1500;
	
	//scene.add(grups[0]); 	
	//scene.add(grups[1]); 	
}

function addTable() {
	//let meshCount = 0; 
	x.table = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/table/1/mesa.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0xbbbbbb, roughness: 1, metalness: .5 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		material.combine = THREE.MixOperation;
		material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		material.envMap = x.skybox; 
		
		//x.table.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.table[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.table[i].castShadow = true; 
			x.table[i].receiveShadow = true; 			
			
			x.table[i].position.set(0, florY+257, -220); 
			//x.table[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI); 
			x.table[i].scale.set(3, 3, 3); 
		
			grups[0].add( x.table[i] );		
		}		

		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/table/1/mat/color2.jpg', function(tx) { 
			x.table[0].material.map = tx; 
			x.table[0].material.needsUpdate = true; 

			//x.table.visible = true; 
		}); 			

		load2.load( 'obj/table/1/mat/rough1.jpg', function(tx2) { 
			x.table[0].material.roughnessMap = tx2; 
			x.table[0].material.needsUpdate = true; 
			//x.table.visible = true; 
		}); 			

		load3.load( 'obj/table/1/mat/metal1.jpg', function(tx3) { 
			x.table[0].material.metalnessMap = tx3; 
			x.table[0].material.needsUpdate = true; 
			//x.table.visible = true; 
		}); 	

		load4.load( 'obj/table/1/mat/normal1.jpg', function(tx4) { 
			x.table[0].material.normalScale.set(1, 1); 
			x.table[0].material.normalMap = tx4; 
			x.table[0].material.needsUpdate = true; 
			//x.table.visible = true; 
		}); 	

	}); 
	
}

function addPC() {
	//let meshCount = 0; 
	x.pc = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/pc/1/case1.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		const material = []; 
		
		material[0] = new THREE.MeshBasicMaterial( { color: 0x303335 } );	
		material[1] = new THREE.MeshStandardMaterial( { color: 0x5e5e5e, roughness: .25, metalness: .1 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		material[1].combine = THREE.MixOperation;
		material[1].reflectivity = .4;		
		//material[1].envMapIntensity = 1; 
		material[1].envMap = x.skybox; 		
		
		//x.pc.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.pc[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.pc[i].position.set(158, florY+74, -205); 
			//x.pc[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI); 
			x.pc[i].scale.set(90, 90, 90); 
		
			grups[0].add( x.pc[i] );		
		}		

		x.pc[1].castShadow = x.pc[1].receiveShadow = true; 

	}); 
	
}

function addMonitor() {
	//let meshCount = 0; 
	x.monitor = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/monitor/1/monitor1.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .25, metalness: .2 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//x.monitor.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.monitor[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.monitor[i].castShadow = true; 
			x.monitor[i].receiveShadow = true; 			
			
			x.monitor[i].position.set(0, florY+258, -265); 
			x.monitor[i].rotation.set(0, Math.PI/-2, 0); 
			x.monitor[i].scale.set(450, 450, 450); 
		
			grups[0].add( x.monitor[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();   
			//load3 = new THREE.TextureLoader(),   
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/monitor/1/mat/color1.jpg', function(tx) { 
			x.monitor[0].material.map = tx; 
			x.monitor[0].material.needsUpdate = true; 
			//x.monitor.visible = true; 
		}); 			

		load2.load( 'obj/monitor/1/mat/rough1.jpg', function(tx2) { 
			x.monitor[0].material.roughnessMap = tx2; 
			x.monitor[0].material.needsUpdate = true; 
		}); 			

	}); 
	
	let load3 = new THREE.TextureLoader(); 
	
	const geom = new THREE.PlaneGeometry( 274, 154 );
	const mater = new THREE.MeshBasicMaterial( {color: 0xffffff} );
	//mater.transparent = true; 
	//mater.opacity = .6; 
	mater.combine = THREE.MixOperation;
	mater.reflectivity = .2;		
	//mater.envMapIntensity = 1; 
	mater.envMap = x.skybox; 	
	
	x.scr = new THREE.Mesh( geom, mater ); 
	x.scr.position.set(0, florY+395, -265); 
	grups[0].add( x.scr );

	load3.load( 'obj/monitor/1/mat/imakscr.jpg', function(tx3) { 
		x.scr.material.map = tx3; 
		x.scr.material.needsUpdate = true; 
	}); 		

}

function addKeyboard() {
	//let meshCount = 0; 
	x.keyboard = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/keyboard/1/keyboard.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: .4, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		material.emissive.set(0xeeee88); 
		
		//x.keyboard.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.keyboard[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.keyboard[i].castShadow = true; 
			x.keyboard[i].receiveShadow = true; 			
			
			x.keyboard[i].position.set(-20, florY+255, -150); 
			x.keyboard[i].rotation.set(.03, 0, 0); 
			x.keyboard[i].scale.set(20, 20, 20); 
		
			grups[0].add( x.keyboard[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/keyboard/1/mat/color1.jpg', function(tx) { 
			x.keyboard[0].material.map = tx; 
			x.keyboard[0].material.needsUpdate = true; 
			//x.keyboard.visible = true; 
		}); 			

		load2.load( 'obj/keyboard/1/mat/emissive1.jpg', function(tx2) { 
			x.keyboard[0].material.emissiveIntensity = 1; 
			x.keyboard[0].material.emissiveMap = tx2; 
			x.keyboard[0].material.needsUpdate = true; 
			//x.keyboard.visible = true; 
		}); 			

	}); 

}

function addMouse() {
	//let meshCount = 0; 
	x.mouse = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mouse/1/mouse.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		material[0] = new THREE.MeshStandardMaterial( { color: 0x333333, roughness: 1, metalness: 0 } );
		material[1] = new THREE.MeshStandardMaterial( { color: 0xc3c3c3, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//x.mouse.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.mouse[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.mouse[i].castShadow = true; 
			x.mouse[i].receiveShadow = true; 			
			
			x.mouse[i].position.set(93, florY+257.5, -145); 
			//x.mouse[i].rotation.set(Math.PI/-2, 0, Math.random() * Math.PI); 
			x.mouse[i].scale.set(3, 3, 3); 
		
			grups[0].add( x.mouse[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(),  
			load5 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/mouse/1/mat/color1.jpg', function(tx) { 
			x.mouse[1].material.map = tx; 
			x.mouse[1].material.needsUpdate = true; 
		}); 			

		load2.load( 'obj/mouse/1/mat/rough1.jpg', function(tx2) { 
			x.mouse[1].material.roughnessMap = tx2; 
			x.mouse[1].material.needsUpdate = true; 
		}); 			

		load3.load( 'obj/mouse/1/mat/normal1.jpg', function(tx3) { 
			x.mouse[1].material.normalMap = tx3; 
			x.mouse[1].material.needsUpdate = true; 
		}); 			

		load4.load( 'obj/mouse/1/mat/rough2.jpg', function(tx4) { 
			x.mouse[0].material.roughnessMap = tx4; 
			x.mouse[0].material.needsUpdate = true; 
		}); 			

		load5.load( 'obj/mouse/1/mat/normal2.jpg', function(tx5) { 
			x.mouse[0].material.normalMap = tx5; 
			x.mouse[0].material.needsUpdate = true; 
		}); 			

	}); 

}

function addSpeakers() {
	//let meshCount = 0; 
	x.speaker = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/speakers/2/speaker.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0x6d6d6d, roughness: .2, metalness: .3 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		material.combine = THREE.MixOperation;
		material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		material.envMap = x.skybox; 		
		
		//x.speaker.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.speaker[i] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.speaker[i].castShadow = true; 
			x.speaker[i].receiveShadow = true; 			
			
			let posX = -200; 
			if (i==1) posX = 200; 
			
			x.speaker[i].position.set(posX, florY+256, -285); 
			//x.speaker[i].rotation.set(0, Math.PI/2, 0); 
			x.speaker[i].scale.set(400, 400, 400); 
		
			grups[0].add( x.speaker[i] );		
		}		

	
		/*let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/speakers/1/mat/color1.jpg', function(tx) { 
			for ( let k = 0; k < 2; k++ ) {	
				x.speaker[k].material.map = x.speaker[k].material.roughnessMap = tx; 
				x.speaker[k].material.needsUpdate = true; 
			}
			//x.speaker.visible = true; 
		}); 			
		*/
	}); 

}

function addHeadphones() {
	//let meshCount = 0; 
	x.headphones = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/headphones/1/headphones.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		material[0] = new THREE.MeshStandardMaterial( { color: 0x505050, roughness: .7, metalness: 0 } );
		material[1] = new THREE.MeshStandardMaterial( { color: 0x707780, roughness: .2, metalness: .15 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//x.headphones.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.headphones[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.headphones[i].castShadow = true; 
			x.headphones[i].receiveShadow = true; 			
			
			x.headphones[i].position.set(-144, florY+267.5, -155); 
			x.headphones[i].rotation.set(-.22, .28, 0); 
			x.headphones[i].scale.set(3.3, 3.3, 3.3); 
		
			grups[0].add( x.headphones[i] );		
		}		

	}); 
	
}

function addMic() {
	//let meshCount = 0; 
	x.mic = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mic/1/mic.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		material[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .8, metalness: 0 } );
		material[1] = new THREE.MeshStandardMaterial( { color: 0x707780, roughness: .25, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//x.mic.visible = false; 
		
		let scl = 160, 
			mx = -149, 
			mz = -184.5; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.mic[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.mic[i].castShadow = true; 
			x.mic[i].receiveShadow = true; 			
			
			if (i==1) {
				scl = 100; 
				mx = -154; 
				mz = -183;
			}	
			
			x.mic[i].position.set(mx, florY+275, mz); 
			x.mic[i].rotation.set(Math.PI/-1.05, -.48, .2); 
			x.mic[i].scale.set(scl, scl, scl); 
		
			grups[0].add( x.mic[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();    
			//load3 = new THREE.TextureLoader(),  
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/mic/1/mat/color1.jpg', function(tx) { 
			x.mic[0].material.map = tx; 
			x.mic[0].material.needsUpdate = true; 
			//x.mic.visible = true; 
		}); 			

		load2.load( 'obj/mic/1/mat/normal1.jpg', function(tx2) { 
			x.mic[0].material.normalMap = tx2; 
			x.mic[0].material.needsUpdate = true; 
			//x.mic.visible = true; 
		}); 			

	}); 

}

function addModem() {
	//let meshCount = 0; 
	x.modem = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/modem/1/modem.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: .1 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0x33eeff); 
		
		//x.modem.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.modem[i] = new THREE.Mesh( object.children[i].geometry, material ); 
			
			x.modem[i].castShadow = true; 
			x.modem[i].receiveShadow = true; 			
			
			x.modem[i].position.set(200, florY+257, -200); 
			x.modem[i].rotation.set(Math.PI/-2, 0, 0); 
			x.modem[i].scale.set(300, 300, 300); 
		
			grups[0].add( x.modem[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader();   
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/modem/1/mat/color1.jpg', function(tx) { 
			x.modem[0].material.map = tx; 
			x.modem[0].material.needsUpdate = true; 
			//x.modem.visible = true; 
		}); 			

		load2.load( 'obj/modem/1/mat/rough1.jpg', function(tx2) { 
			x.modem[0].material.roughnessMap = tx2; 
			x.modem[0].material.needsUpdate = true; 
			//x.modem.visible = true; 
		}); 			

		load3.load( 'obj/modem/1/mat/normal1.jpg', function(tx3) { 
			x.modem[0].material.normalMap = tx3; 
			x.modem[0].material.needsUpdate = true; 
			//x.modem.visible = true; 
		}); 			

		/*load4.load( 'obj/modem/1/mat/emissive1.jpg', function(tx4) { 
			x.modem[0].material.emissiveMap = tx4; 
			x.modem[0].material.needsUpdate = true; 
			//x.modem.visible = true; 
		}); */

	}); 

}

function addGlasses() {
	//let meshCount = 0; 
	x.glasses = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/glasses/1/glasses.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0x676767, roughness: .3, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		material.combine = THREE.MixOperation;
		material.reflectivity = .5;		
		//material.envMapIntensity = 1; 
		material.envMap = x.skybox; 
		
		//x.glasses.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.glasses[i] = new THREE.Mesh( object.children[i].geometry, material ); 
			
			x.glasses[i].castShadow = true; 
			x.glasses[i].receiveShadow = true; 			
			
			x.glasses[i].position.set(0, florY+258.4, -225); 
			x.glasses[i].rotation.set((Math.PI/-2)-.14, .11, Math.PI*-.2); 
			x.glasses[i].scale.set(9, 9, 9); 
		
			grups[0].add( x.glasses[i] );		
		}		

	}); 

}

function addPhone() {
	//let meshCount = 0; 
	x.phone = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/phone/1/phone.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0x555555, roughness: .35, metalness: .1 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//x.phone.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.phone[i] = new THREE.Mesh( object.children[i].geometry, material ); 
			
			x.phone[i].castShadow = true; 
			x.phone[i].receiveShadow = false; 			
			
			x.phone[i].position.set(-208, florY+259.3, -200); 
			x.phone[i].rotation.set(Math.PI, Math.PI*-.6, 0); 
			x.phone[i].scale.set(40, 40, 40); 
		
			grups[0].add( x.phone[i] );		
		}		

	
		let load1 = new THREE.TextureLoader();    
			//load2 = new THREE.TextureLoader(),   
			//load3 = new THREE.TextureLoader(),  
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/phone/1/mat/ifon.jpg', function(tx) { 
			var geom = new THREE.PlaneGeometry(22.4, 43);
			var mater = new THREE.MeshBasicMaterial({map: tx, transparent: true, opacity: 1});
			mater.combine = THREE.MixOperation;
			mater.reflectivity = .5;
			//mater.envMap = tex;  
			//mater.envMapIntensity = .5; 
			mater.envMap = x.skybox; 
		
			x.ifscr = new THREE.Mesh(geom, mater);
			x.ifscr.rotation.set(Math.PI/-2, 0, .314);
			x.ifscr.position.set(-208.06, florY+259.4, -200);
			//ifscr.receiveShadow = true;
			grups[0].add(x.ifscr);
		
		}); 			

	}); 

}

function addCup() {
	//let meshCount = 0; 
	x.cup = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/cup/1/cup.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		const material = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		
		//x.cup.visible = false; 
		
		for ( let i = 0; i < 1; i++ ) {	
			x.cup[i] = new THREE.Mesh( object.children[i].geometry, material ); 
			
			x.cup[i].castShadow = true; 
			x.cup[i].receiveShadow = true; 			
			
			x.cup[i].position.set(147, florY+257.5, -140); 
			x.cup[i].rotation.set(Math.PI/-2, 0, 0); 
			x.cup[i].scale.set(14, 14, 14); 
		
			grups[0].add( x.cup[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader();    
			//load3 = new THREE.TextureLoader(),  
			//load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/cup/1/mat/color1.jpg', function(tx) { 
			x.cup[0].material.map = tx; 
			x.cup[0].material.needsUpdate = true; 
			//x.cup.visible = true; 
		}); 			

		load2.load( 'obj/cup/1/mat/rough1.jpg', function(tx2) { 
			x.cup[0].material.roughnessMap = tx2; 
			x.cup[0].material.needsUpdate = true; 
		}); 	

		/*load3.load( 'obj/cup/1/mat/normal1.jpg', function(tx3) { 
			x.cup[0].material.normalMap = tx3; 
			x.cup[0].material.needsUpdate = true; 
		}); 	*/

		let geom = new THREE.CircleGeometry(9.35, 24);
		let mater = new THREE.MeshPhongMaterial({color: 0x807010, transparent: true, opacity: .7});
		mater.combine = THREE.MixOperation;
		mater.reflectivity = .6;
		mater.envMap = x.skybox; 
		
		let kape = new THREE.Mesh(geom, mater);
		kape.rotation.x = Math.PI/-2;
		kape.position.set(147, florY+280, -140);
		//kape.receiveShadow = true;
		grups[0].add(kape);		
		
	}); 

}

function addChair() {
	//let meshCount = 0; 
	x.chair = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/chair/1/chair.obj', function ( object ) {
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
				
				//meshCount += 1; 
			}
			
			//if (child.isMaterial) {
				//console.log('mat'); 
			//}
		});	
		
		//console.log(meshCount); 
		
		const material = []; 
		
		//const material2 = new THREE.MeshBasicMaterial( { color: 0xccb7b4, transparent: true, fog: false } );	
		material[0] = new THREE.MeshStandardMaterial( { color: 0x888888, roughness: .6, metalness: 0 } );
		material[1] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .1, metalness: .5 } );
		//material.depthWrite = false; 
		//material.side = THREE.DoubleSide; 
		//material.opacity = .7; 
		//material.emissive.set(0xffffff); 
		material[1].combine = THREE.MixOperation;
		material[1].reflectivity = .5;		
		//material[1].envMapIntensity = 1; 
		material[1].envMap = x.skybox; 		
		
		//x.chair.visible = false; 
		
		for ( let i = 0; i < 2; i++ ) {	
			x.chair[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			x.chair[i].castShadow = true; 
			x.chair[i].receiveShadow = true; 			
			
			x.chair[i].position.set(-100, florY-.2, 50); 
			x.chair[i].rotation.set(Math.PI/-2, 0, Math.PI/4); 
			x.chair[i].scale.set(6.1, 6.1, 6.1); 
		
			grups[0].add( x.chair[i] );		
		}		

	
		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(); 
		
		load1.load( 'obj/chair/1/mat/color1.jpg', function(tx) { 
			x.chair[0].material.map = tx; 
			x.chair[0].material.needsUpdate = true; 
			//x.chair[0].visible = true; 
		}); 			

		load2.load( 'obj/chair/1/mat/normal1.jpg', function(tx2) { 
			x.chair[0].material.normalMap = tx2; 
			x.chair[0].material.needsUpdate = true; 
		}); 
		
		load3.load( 'obj/chair/1/mat/color2.jpg', function(tx3) { 
			x.chair[1].material.map = tx3; 
			x.chair[1].material.needsUpdate = true; 
			//x.chair[1].visible = true; 
		}); 			

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
			
			//if (!ui.loadr.classList.contains("paus")) ui.loadr.classList.add("paus"); 
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
        }
    })();	
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

function onWindowResize( event ) { 
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
	
	//console.log(_.width);
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	

	//console.log(_.width + ' ' + _.height); 
	
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


function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001;
	
	//	const delta = clock.getDelta() * .7;
		
		//console.log(timer); 
		

		camera.position.x = Math.cos(timer) * 10; 
		camera.position.y = Math.sin(timer*2) * 10; 

		if (isMobil) {
			camera.position.x += Math.cos(timer*.5) * 500; 
			camera.position.y += Math.sin(timer*.25) * 500 + 400; 
		} else {
			camera.position.x += _.pointer.x * 500; 
			camera.position.y += (_.pointer.y * 500) + 400;
		}
	
	
		_.idleTimer += 0.01; 
		
		render();
	} else {
		if (clock.running) clock.stop(); 
		
		//if (x.sound) {
			//if (x.sound.isPlaying) x.sound.pause(); 
		//}
	}
	
	if (document.hasFocus()) {
		if (!_.fokus) {
			_.idleTimer = 0; 
			_.fokus = true; 
			
			//if (x.sound) {
				//if (!x.sound.isPlaying) x.sound.play(); 
			//}
		}
	} else {
		_.idleTimer = idleTO; 	
		_.fokus = false; 
		
		//if (x.sound) {
			//if (x.sound.isPlaying) x.sound.pause(); 
		//}
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



	
