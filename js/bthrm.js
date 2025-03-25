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
import { Reflector } from 'three/addons/objects/Reflector.js';
//import { radixSort } from 'three/addons/utils/SortUtils.js'; 
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'; 


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
	kontainer.style.background = "url('img/bathrooml.jpg') center top no-repeat"; 
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

	//const fogCol = 0x606873; 
	const fogCol = 0x909496; 

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
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = false;
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

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, 1, 1000 );
	//camera.position.set(0, 0, 500); 
//	camera.position.set(0, _.ej[5], -100); 
	camera.position.set(0, _.ej[5], 4); 
	//camera.lookAt( 0, 0, 0 );

    //scene.add(camera);	
    x.camGrup.add(camera);	

	//grups[0].add(camera);		
	
	scene.add( new THREE.AmbientLight( 0x999999 ) );		

	x.spotLcone = []; 
	
	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 4000, 50, Math.PI/12, 1 );
	x.spotLight[0].position.set( 0, 14, -26 );
	//x.spotLight[0].castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight[0].shadow.mapSize.width = 1024;
	//x.spotLight[0].shadow.mapSize.height = 1024;
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 50;
	x.spotLight[0].shadow.camera.fov = 40;
	//x.spotLight[0].shadow.focus = 1; 
	//x.spotLight[0].shadowDarkness = 1.; 
	//x.spotLight[0].power = 10000000;
	
	//x.spotLight[0].shadow.intensity = 1.;
	
	scene.add( x.spotLight[0] );	
	//x.camGrup.add( x.spotLight[0] );	

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
	
/*	//TEMP!!
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    //controls.autoRotate = true;    
    controls.minDistance = 1;
    //controls.maxDistance = 2000;    
    controls.maxDistance = 5000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .8;
    controls.zoomSpeed = 1;
    controls.panSpeed = 3;
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
//	x.target0.position.set(0, florY+160, x.camGrup.position.z - 300); 
//	x.target0.position.set(0, 0, x.camGrup.position.z - 500); 
	//x.target0.position.set(0, 0, x.camGrup.position.z - 100); 
	scene.add(x.target0);
	
//	x.spotLight[0].target = x.target0; 
	
//	controls.target = x.target0.position; 	
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight[0] );
	//scene.add( x.spotLightHelper );	
	
	addSkybox(); 
	//addClouds(); 
	//addBathroom(); 
	//addBg(); 
	//addCourtyard(); 
	//addGround(); 
	//addTrees(); 
	//addLamps(); 
	//addBenches(); 
	//addFog(); 
	
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
	loader.setPath( 'img/skybox/2/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
		//'left'+f, 'right'+f,
		//'top'+f, 'bottom'+f,
		//'back'+f, 'front'+f		
	], function ( tx ) {
		//tx.flipY = true; 
	//	tx.colorSpace = THREE.LinearSRGBColorSpace;	
		
		x.skybox = tx; 

		//addFloor();	

		//fadeScene(); 
		
		//scene.backgroundRotation.set(0, Math.PI/4, 0); 
		//scene.backgroundBlurriness = .2; 
		//scene.backgroundIntensity = .75; 		
		
	//	scene.background = x.skybox; 
		//scene.environment = x.skybox; 
		//scene.environmentIntensity = 5; 
		
		addBathroom(); 
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

function addBg() {
	const geometry = new THREE.SphereGeometry( 10, 8, 4, 0, Math.PI/1.5, Math.PI/4, Math.PI/2); 
	//const geometry = new THREE.SphereGeometry( 10, 8, 4, 0, Math.PI/1.5, Math.PI/3.8, Math.PI/2.2); 
	const BgMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: 1 } ); 
	const Bg = new THREE.Mesh( geometry, BgMaterial ); 
	Bg.position.set(0, 0, -3); 
	//Bg.rotation.y = Math.PI/1.3; 
	Bg.rotation.y = Math.PI/-1.2; 
	scene.add( Bg );
	
	const loader = new THREE.TextureLoader();   

	loader.load( 'img/bg/bg1.jpg', function(tx) { 	
		//tx.repeat.set(-1, 1);    		
		//tx.center.set(.5, .5); 
	
		BgMaterial.map = tx; 
		BgMaterial.needsUpdate = true; 
	});  	
}

function addBathroom() {
	let meshCount = 0; 
	x.bathroom = [];
	//x.batchedMesh = []; 	
	x.material = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/bathroom/1/bathroom1.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				if ((meshCount == 6) || (meshCount == 8)) 
					child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 				
				
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
		
		//x.bathroom.visible = false; 
		
		//const kolor = []; 
		//kolor[0] = kolor[2] = 0xffffff; 
		//kolor[1] = 0xbbbbbb; 
		const rflek = [.1, .3, .2, .8, .1, .3, .25, .25, .25, .5, .5, .2, .1]; 
		
		//for ( let i = 7; i < 8; i++ ) {	
		for ( let i = 0; i < meshCount; i++ ) {	
			material[i] = new THREE.MeshBasicMaterial( { color: 0xffffff } );
			//material[i] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .5, metalness: 0 } );
			//material[i].side = THREE.DoubleSide; 
			if ((i!=1) && (i!=5)) {
				material[i].wireframe = true; 
			} else {
				material[i].transparent = true; 
				material[i].opacity = .5; 
				if (i==1) {
					material[i].color.setHex(0xbebebe); 
				} else {
					material[i].color.setHex(0x888888); 
				}
			}
			
			if ((i!=0) && (i!=12)) {
				material[i].reflectivity = rflek[i];	
				material[i].envMapRotation.set(0, 1.35, 0); 
				material[i].envMap = x.skybox; 
			}
			
			x.bathroom[i] = new THREE.Mesh( object.children[i].geometry, material[i] ); 
			
			//x.bathroom[i].castShadow = true; 
			//x.bathroom[i].receiveShadow = true; 			
			
			//x.bathroom[i].position.set(0, florY+0, 0); 
			x.bathroom[i].position.set(.5, 0, 1.5); 
			x.bathroom[i].rotation.set(Math.PI/-2, 0, 0); 
			//x.bathroom[i].scale.set(1, 1, 1); 
		
			//if (i==0) material[i].color.setHex(0xff0000); 
		
			grups[0].add( x.bathroom[i] );		
		}		

		// 0 - carpet 1 - window 2 - soap 3 - roll 4 - structure 5 - glass 6 - tub 7 - sink 
		// 8 - bowl 9 - shower chromes 10 - sconces 11 - sink soaps 12 - mat  
	
		const load0 = new THREE.TextureLoader(),   
			  load1 = new THREE.TextureLoader(),   
			  load2 = new THREE.TextureLoader(),   
			  load3 = new THREE.TextureLoader(),  
			  load3r = new THREE.TextureLoader(),  
			  load4 = new THREE.TextureLoader(), 
			  load4r = new THREE.TextureLoader(), 
			  load5 = new THREE.TextureLoader(), 
			  load6 = new THREE.TextureLoader(), 
			  load6r = new THREE.TextureLoader(), 
			  load7 = new THREE.TextureLoader(), 
			  load8 = new THREE.TextureLoader(), 
			  load9 = new THREE.TextureLoader(), 
			  load10 = new THREE.TextureLoader(), 
			  load11 = new THREE.TextureLoader(), 
			  load12 = new THREE.TextureLoader(), 
			  url = 'obj/bathroom/1/mat/'; 

		load0.load( url + 'color0.jpg', function(tx0) { 
			x.bathroom[0].material.map = tx0; 
			x.bathroom[0].material.needsUpdate = true; 

			x.bathroom[0].material.wireframe = false; 
		}); 	
		
		//load1.load( url + '.jpg', function(tx1) { 
		//	x.bathroom[1].material.map = tx1; 
		//	x.bathroom[1].material.needsUpdate = true; 
        //               
		//	x.bathroom[1].material.wireframe = false; 
		//}); 			

		load2.load( url + 'color2.jpg', function(tx2) { 
			x.bathroom[2].material.map = tx2; 
			x.bathroom[2].material.needsUpdate = true; 
                       
			x.bathroom[2].material.wireframe = false; 
		}); 			

		load3.load( url + 'color3b.jpg', function(tx3) { 
			x.bathroom[3].material.map = tx3; 
			x.bathroom[3].material.needsUpdate = true; 
                       
			x.bathroom[3].material.wireframe = false; 
		}); 			
	
		load3r.load( url + 'rough3b.jpg', function(tx3r) { 
			x.bathroom[3].material.specularMap = tx3r; 
			x.bathroom[3].material.needsUpdate = true; 
		}); 			
	
		load4.load( url + 'color4b.jpg', function(tx4) { 
			x.bathroom[4].material.map = tx4; 
			x.bathroom[4].material.needsUpdate = true; 
                       
			x.bathroom[4].material.wireframe = false; 			
			
			//grups[0].position.set(0, 0, 0);
	
			scene.add(grups[0]); 			
			
			addBg(); 
		}); 			

		load4r.load( url + 'rough4.jpg', function(tx4r) { 
			x.bathroom[4].material.specularMap = tx4r; 
			x.bathroom[4].material.needsUpdate = true; 
		}); 			

		//load5.load( url + '.jpg', function(tx5) { 
		//	x.bathroom[5].material.map = tx5; 
		//	x.bathroom[5].material.needsUpdate = true; 
        //               
		//	x.bathroom[5].material.wireframe = false; 			
		//}); 			

		load6.load( url + 'color6b.jpg', function(tx6) { 
			x.bathroom[6].material.map = tx6; 
			x.bathroom[6].material.needsUpdate = true; 
                       
			x.bathroom[6].material.wireframe = false; 			
		}); 			

		load6r.load( url + 'rough6.jpg', function(tx6r) { 
			x.bathroom[6].material.specularMap = tx6r; 
			x.bathroom[6].material.needsUpdate = true; 
		}); 			

		load7.load( url + 'color7.jpg', function(tx7) { 
			x.bathroom[7].material.map = x.bathroom[7].material.specularMap = tx7; 
			x.bathroom[7].material.needsUpdate = true; 
                       
			x.bathroom[7].material.wireframe = false; 			
		}); 			

		load8.load( url + 'color8.jpg', function(tx8) { 
			x.bathroom[8].material.map = tx8; 
			x.bathroom[8].material.needsUpdate = true; 
                       
			x.bathroom[8].material.wireframe = false; 			
		}); 			

		load9.load( url + 'color9.jpg', function(tx9) { 
			x.bathroom[9].material.map = tx9; 
			x.bathroom[9].material.needsUpdate = true; 
                       
			x.bathroom[9].material.wireframe = false; 			
		}); 			

		load10.load( url + 'color10.jpg', function(tx10) { 
			x.bathroom[10].material.map = tx10; 
			x.bathroom[10].material.needsUpdate = true; 
                       
			x.bathroom[10].material.wireframe = false; 			
		}); 			

		load11.load( url + 'color11.jpg', function(tx11) { 
			x.bathroom[11].material.map = tx11; 
			x.bathroom[11].material.needsUpdate = true; 
                      
			x.bathroom[11].material.wireframe = false; 			
		}); 			

		load12.load( url + 'color12.jpg', function(tx12) { 
			x.bathroom[12].material.map = tx12; 
			x.bathroom[12].material.needsUpdate = true; 
                       
			x.bathroom[12].material.wireframe = false; 			
		}); 			

		
		const wallGeom = new THREE.PlaneGeometry( 5, 6.2 );
		const wallMater = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide} );
		wallMater.reflectivity = .02; 	
		wallMater.envMapRotation.set(0, 1.35, 0); 
		wallMater.envMap = x.skybox; 		
		
		const wall = new THREE.Mesh( wallGeom, wallMater );
		wall.position.set(1.62, .3, 9.435); 
		scene.add( wall );
		
		const wallGeom2 = new THREE.PlaneGeometry( 3.2, 6.2 );
		const wallMater2 = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide} );
		wallMater2.wireframe = true; 
		wallMater2.reflectivity = .25;	
		wallMater2.envMapRotation.set(0, 1.35, 0); 
		wallMater2.envMap = x.skybox; 		
		
		const wall2 = new THREE.Mesh( wallGeom2, wallMater2 );
		wall2.position.set(-2.48, .3, 9.435); 
		scene.add( wall2 );
		
		const load14 = new THREE.TextureLoader(),  
			  load15 = new THREE.TextureLoader(); 

		load14.load( url + 'wall1.jpg', function(tx14) { 
			wallMater.map = tx14; 
			wallMater.needsUpdate = true; 
        
			wallMater.wireframe = false; 
		}); 		
		
		load15.load( url + 'showerwall.jpg', function(tx15) { 
			wallMater2.map = tx15; 
			wallMater2.needsUpdate = true; 

			wallMater2.wireframe = false; 
		}); 		
		
		//addReflect(); 
			
		addPlants(); 
		addSwitches(); 
		addFan(); 
		addLamps(); 
		
		addMirror(); 
	}); 
	
	addDoor(); 

	//fadeScene(); 
}
	
function addDoor() {
	let meshCount = 0; 
	x.door = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/door/0/door.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0)	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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

		//x.door[0] = object; 
		//x.door[1] = object; 
		//x.door[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/door/0/mat/', 
			  frm = 'jpg', 
			  posX = [2.5]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .35, metalness: 0 } );
		
		matr.emissive.setHex(0x222222); 
		//matr.side = 2; 
		//matr.shadowSide = 1; 
		
		//matr.alphaTest = .5; 
		matr.reflectivity = .23; 
		matr.envMapRotation.set(0, 1.35, 0); 
		matr.envMap = x.skybox; 
		
		for ( let i = 0; i < 1; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xf2f2f2, roughness: .5, metalness: .1 } );
			
			x.door[i] = new THREE.Mesh( geom, matr );
			
			//x.door[i].children[0].material = matr; 
			
			x.door[i].scale.set(2.1, 2.1, 2.1); 
			//console.log(posX[i]);
			x.door[i].position.set(2.4, -.123, 9.5); 
			x.door[i].rotation.y = Math.PI/-2; 
			
			//x.door[i].castShadow = true; 
			//x.door[i].receiveShadow = true; 
			
			grups[0].add(x.door[i]); 
		}
		
		const loader1 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
		});  
		
		//addPlants(); 
		//fadeScene(); 
	}); 
}		
	
function addPlants() {
	let meshCount = 0; 
	x.plant = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/plants/0/plants.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				if (meshCount == 0)	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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

		//x.plant[0] = object; 
		//x.plant[1] = object; 
		//x.plant[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/plants/0/mat/', 
			  frm = 'jpg', 
			  posX = [3.37, -3.37]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .57, metalness: 0 } );
		
		//matr.emissive.setHex(0x222222); 
		matr.side = 2; 
		matr.shadowSide = 1; 
		
		matr.alphaTest = .6; 
		//matr.envMap = x.skybox; 
		
		for ( let i = 0; i < 2; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xf2f2f2, roughness: .5, metalness: .1 } );
			
			x.plant[i] = new THREE.Mesh( geom, matr );
			
			//x.plant[i].children[0].material = matr; 
			
			x.plant[i].scale.set(1.1, 1.1, 1.1); 
			//console.log(posX[i]);
			x.plant[i].position.set(posX[i], -1.4, -6.75); 
			
			//if (i==0) { 
			x.plant[i].rotation.y = Math.PI/-4; 
			//} else {
				//x.plant[i].rotation.y = Math.PI/4; 
			//}
			
			//x.plant[i].castShadow = true; 
			//x.plant[i].receiveShadow = true; 
			
			grups[0].add(x.plant[i]); 
		}
		
		const loader1 = new THREE.TextureLoader(),     
			  loader2 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color3.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
		});  
		
		loader2.load( url2 + 'alfa2.jpg', function(tx2) { 	
			matr.alphaMap = tx2; 
			matr.needsUpdate = true; 
		});  

		//addReflect(); 
		fadeScene(); 
	}); 
}	

function addSwitches() {
	let meshCount = 0; 
	x.switch = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/socket/0/switch.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0)	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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

		//x.switch[0] = object; 
		//x.switch[1] = object; 
		//x.switch[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/socket/0/mat/', 
			  frm = 'jpg', 
			  scl = [.62, .52], 
			  sclZ = [.62, .47], 			  
			  posX = [.8, 4],  
			  posY = [.65, .65],  
			  posZ = [9.4, .147];   
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .1, metalness: 0 } );
		
		//matr.emissive.setHex(0x222222); 
		//matr.side = 2; 
		//matr.shadowSide = 1; 
		
		//matr.alphaTest = .5; 
		matr.envMap = x.skybox; 
		
		matr.wireframe = true; 
		//console.log(x.switch[0]);
		
		//x.switch[0].material = matr; 
		//x.switch[0].scale.set(.62, .62, .62); 
		//x.switch[0].position.set(.8, .65, 9.4); 
		//x.switch[0].rotation.y = Math.PI/-2; 
		//	
		//grups[0].add(x.switch[0]); 
		
		for ( let i = 0; i < 2; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xf2f2f2, roughness: .5, metalness: .1 } );
			
			x.switch[i] = new THREE.Mesh( geom, matr );
			
			x.switch[i].material = matr; 
			
			x.switch[i].scale.set(scl[i], scl[i], sclZ[i]); 
			x.switch[i].position.set(posX[i], posY[i], posZ[i]); 
			if (i==0) x.switch[i].rotation.y = Math.PI/-2; 
			
			//x.switch[i].castShadow = true; 
			//x.switch[i].receiveShadow = true; 
			
			grups[0].add(x.switch[i]); 			
		}
	
	
		const loader1 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false; 
		});  
		
		//addPlants(); 
		//fadeScene(); 
	}); 
}	

function addFan() {
	let meshCount = 0; 
	x.fan = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/fan/0/fan.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0)	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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

		//x.fan[0] = object; 
		//x.fan[1] = object; 
		//x.fan[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/fan/0/mat/', 
			  frm = 'jpg', 
			  posZ = [4.165, -2.425]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 1, metalness: 0 } );
		
		matr.emissive.setHex(0xffffff); 
		//matr.side = 2; 
		//matr.shadowSide = 1; 
		
		//matr.alphaTest = .5; 
		matr.envMap = x.skybox; 
		
		matr.wireframe = true; 
		
		for ( let i = 0; i < 2; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xf2f2f2, roughness: .5, metalness: .1 } );
			
			x.fan[i] = new THREE.Mesh( geom, matr );
			
			//x.fan[i].children[0].material = matr; 
			
			x.fan[i].scale.set(.1, .1, .1); 
			//console.log(posX[i]);
			//x.fan[i].position.set(1.5, 3.35, 7.4); 
			x.fan[i].position.set(-2.4, 3.35, posZ[i]); 
			x.fan[i].rotation.y = Math.PI; 
			
			//x.fan[i].castShadow = true; 
			//x.fan[i].receiveShadow = true; 
			
			grups[0].add(x.fan[i]); 
		}
		
		const loader1 = new THREE.TextureLoader(),      
			  loader2 = new THREE.TextureLoader(),      
			  loader3 = new THREE.TextureLoader(),      
			  loader4 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false; 
		});  
		
		loader2.load( url2 + 'emissive1b.jpg', function(tx2) { 	
			matr.emissiveMap = tx2; 
			matr.needsUpdate = true; 
		});  
		
		loader3.load( url2 + 'rough1.jpg', function(tx3) { 	
			matr.roughnessMap = tx3; 
			matr.needsUpdate = true; 
		});  
		
		loader4.load( url2 + 'normal1.jpg', function(tx4) { 	
			matr.normalScale.set(5, 5, 5); 
			matr.normalMap = tx4; 
			matr.needsUpdate = true; 
		});  
		
		//addPlants(); 
		//fadeScene(); 
	}); 
}	

function addLamps() {
	let meshCount = 0; 
	x.lamp = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/lamp/3/lamp.obj', function ( object ) {
		//console.log(object);
		
		object.traverse( function ( child ) {
			if ( child.isMesh ) {
				//console.log(child);
				//console.log(child.geometry.attributes.position.array.length);
				//console.log(child.geometry.name);
				//console.log(child.material.length);
				
				//if (meshCount == 0)	child.geometry = BufferGeometryUtils.toCreasedNormals(child.geometry, (40 / 180) * Math.PI); 
				
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

		//x.lamp[0] = object; 
		//x.lamp[1] = object; 
		//x.lamp[2] = object; 
		
		
		//const matr = [], 
		const url2 = 'obj/lamp/3/mat/', 
			  frm = 'jpg', 
			  posX = [-2.4, -2.4, -2.4, 2.37, 2.37],  
			  //posX = [-3.7, -3.7, -3.95, 3.7, 3.92],  
			  posZ = [7.46, .87, -5.72, 7.46, -5.72]; 
			  //posZ = [2, 1, 0]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .3, metalness: 0 } );
		
		matr.emissive.setHex(0xaeaeae); 
		//matr.side = 2; 
		//matr.shadowSide = 1; 
		
		//matr.alphaTest = .5; 
		//matr.envMap = x.skybox; 
		
		matr.wireframe = true; 
		
		for ( let i = 0; i < 5; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			//geom.computeBoundingBox(); 
			
			//matr[i] = new THREE.MeshStandardMaterial( { color: 0xf2f2f2, roughness: .5, metalness: .1 } );
			
			x.lamp[i] = new THREE.Mesh( geom, matr );
			
			//x.lamp[i].children[0].material = matr; 
			
			x.lamp[i].scale.set(1.4, 1.4, 1.4); 
			//console.log(posX[i]);
			x.lamp[i].position.set(posX[i], 3.38, posZ[i]); 
			//x.lamp[i].position.set(-3.88, -.6, .87); 
			x.lamp[i].rotation.x = Math.PI/-2; 
			
			//x.lamp[i].castShadow = true; 
			//x.lamp[i].receiveShadow = true; 
			
			grups[0].add(x.lamp[i]); 
		}
		
		const loader1 = new THREE.TextureLoader(),      
			  loader2 = new THREE.TextureLoader();     

		loader1.load( url2 + 'color1.jpg', function(tx1) { 	
			matr.map = tx1; 
			matr.needsUpdate = true; 
			
			matr.wireframe = false; 
		});  
		
		loader2.load( url2 + 'emissive1b.jpg', function(tx2) { 	
			matr.emissiveMap = tx2; 
			matr.needsUpdate = true; 
		});  
		
		//fadeScene(); 
	}); 
}	

function addMirror() {
	const geometry = new THREE.PlaneGeometry( 2.4, 4.32 ); 
	
	x.mirror = new Reflector( geometry, {
		clipBias: 0.003,
		textureWidth: _.width * window.devicePixelRatio,
		textureHeight: _.height * window.devicePixelRatio,
		color: 0xb1b3b3
		//color: 0xc1cbcb
	} );
	
	x.mirror.position.set(3.97, 1.215, 1.86);
	x.mirror.rotation.y = Math.PI/-2;
	
	grups[0].add( x.mirror );	
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
	
	x.rotCam = !x.rotCam;  
	
	camera.rotation.x = x.camGrup.rotation.y = 0; 
	x.target0.position.set(0, 0, 0); 
	camera.position.set(0, 0, 4); 
	camera.lookAt(x.target0.position); 
	
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
		
	if (x.mirror) {
		x.mirror.getRenderTarget().setSize(
			_.width * window.devicePixelRatio,
			_.height * window.devicePixelRatio
		);	
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
		const timer = Date.now() * 0.0001; 
		//console.log(timer); 
		
		const delta = clock.getDelta() * .3;
	//	if ( mixer ) mixer.update( delta );	
		
		//x.actions[0].weight = Math.cos(timer);
		

		if (!x.rotCam) {
			if (isMobil) {
				camera.rotation.x = Math.cos(timer*2) * (Math.PI/24); 
				x.camGrup.rotation.y = Math.sin(timer) * Math.PI; 
			} else {
				camera.rotation.x = _.pointer.y * (Math.PI/24); 
				x.camGrup.rotation.y = _.pointer.x * -Math.PI; 
			}
		} else {	
			const mSin5 = timer*2;  
			//x.target0.position.set(Math.sin(mSin5) * 5, Math.sin(mSin5*.8) * 1.2, Math.cos(mSin5) * 9); 
			x.target0.position.set(Math.cos(mSin5 + .1) * 2.5, Math.sin(mSin5*.8) * .05, Math.sin(mSin5 + .1) * 4.8); 
			camera.position.set(Math.cos(mSin5) * 2.5, 0, Math.sin(mSin5) * 4.8); 
			//camera.position.x = x.target0.position.x * -.6; 
			//camera.position.z = x.target0.position.z * -.2; 
		}
	
		//console.log(mSin5); 
	
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
	if (x.rotCam) camera.lookAt(x.target0.position); 
	//camera.lookAt(x.wall[0].position);

	//for ( let j = 1; j < 5; j++ ) {	
		//x.spotLcone[j].lookAt(camera.position); 
		//x.spotLcone[j].rotation.x = x.spotLcone[j].rotation.z = 0; 
	//}

	//cubeCamera.update( renderer, scene ); 
	
//	controls.update(); 
	
	//x.spotLightHelper.update();
	
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
		//let url = 'sh'; 	
		//let url = 'fly01'; 	
		//let url = 'acy'; 	
		//let url = 'bdrm'; 
		let url = 'bthrm'; 
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
	
	