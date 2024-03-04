/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from 'three';
//import WEBGL from 'three/addons/WebGL.js'; 
import WEBGL from 'three/addons/capabilities/WebGL.js'; 
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
//import { TWEEN } from 'three/addons/tween.module.min.js'; 
//import TWEEN from 'three/addons/tween.module.js';
import TWEEN from 'three/addons/libs/tween.module.js';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


//import * as THREE from './jsm/three.module.js';			
//import WEBGL from './jsm/WebGL.js'; 
//import { TWEEN } from './jsm/tween.module.min.js'; 
//import { FBXLoader } from './jsm/loaders/FBXLoader.js';
//import { OrbitControls } from './jsm/controls/OrbitControls.js';

const idleTO = 120, florY = -100;  

let camera, scene, renderer, clock; 
//let grup1, grup2, grup3, grup4, grup5, grup6; 
let grup5, grup6; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  
//let mouseX = mouseY = 0;
let mixer; 
let ui = {}, win = {}, x = {}; 

//let cntnt, cntnt2, cntnt3; 

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

function init() {
	ui.kontainer = document.getElementById('kontainer'); 

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
	
	win.width = window.innerWidth; 
	win.height = window.innerHeight; 

    document.body.style.width = win.width + 'px';
    document.body.style.height = win.height + 'px';    
    ui.kontainer.style.width = win.width + 'px';    
    ui.kontainer.style.height = win.height + 'px';
    ui.kontainer.style.opacity = 0;		

    ui.kontainer.style.backgroundColor = '#2e3032';		

	const fogCol = 0x2e3032; 
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	//renderer.setClearColor(0x777777, 1.0); 
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.outputEncoding = THREE.sRGBEncoding; 
//	renderer.outputColorSpace = THREE.SRGBColorSpace; 
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
	//scene.fog = new THREE.FogExp2(0x2e3032, 0.0037);	
	scene.fog = new THREE.FogExp2(fogCol, 0.0037);	
	//scene.fog = new THREE.FogExp2(0x2e3032, 0.001);	
	//scene.fog.density = 0.0037;
	
	camera = new THREE.PerspectiveCamera( 45, win.width / win.height, 1, 10000 );
	camera.position.set(9, -25, 1144);
	//camera.lookAt( 0, 0, 0 );

    scene.add(camera);	
	
	//let aLight = new THREE.AmbientLight( 0x0a0a0a ); 
	//scene.add( aLight );		
	scene.add( new THREE.AmbientLight( 0x0a0a0a ) );		

	//x.spotLight = new THREE.SpotLight( 0xffffff, 10, 0, Math.PI/2, 0 );
//	x.spotLight = new THREE.SpotLight( 0xffffff, 3, 420, Math.PI/4, 1 );
	x.spotLight = new THREE.SpotLight( 0xffffff, 680000, 450, Math.PI/4, 1 );
	//x.spotLight = new THREE.SpotLight( 0xffffff, 30, 2000, Math.PI/4, 1 );
//	x.spotLight.position.set( 0, 400+florY, 1060 );
	x.spotLight.position.set( 0, 400+florY, 1060 );
	//x.spotLight.position.set( 0, 1000+florY, -100 );
	x.spotLight.castShadow = true;
	//x.spotLight.shadow = new THREE.SpotLightShadow(camera);	
	//x.spotLight.shadow.mapSize.width = 1024;
	//x.spotLight.shadow.mapSize.height = 1024;
	x.spotLight.shadow.camera.near = 100;
	x.spotLight.shadow.camera.far = 500;
	x.spotLight.shadow.camera.fov = 30;
	//x.spotLight.shadow.focus = .8; 
	//x.spotLight.shadowDarkness = .7; 
	scene.add( x.spotLight );	
	
	//x.spotLight.power = 1000;
	
	//x.spotLight.position.set( 0, 400+florY, 1060 );
	//x.spotLight.target = x.char1;		
	
	//x.spotLightHelper = new THREE.SpotLightHelper( x.spotLight );
	//scene.add( x.spotLightHelper );
	
	//const light = new THREE.SpotLight( 0xffffff );
	//const light = new THREE.PointLight( 0xffffff, 10, 0 );
	//const light = new THREE.DirectionalLight( 0xffffff, 10 );
	//light.position.set( 0, 400, 1000);
	//scene.add( light );	
	
	//cntnt = document.getElementById("content"); 
	//cntnt2 = document.getElementById("content2"); 
	//cntnt3 = document.getElementById("content3"); 
	
	onWindowResize(); 
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 
	
	//TEMP!!
    /*controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = .1;	
    controls.autoRotate = false;    	
    controls.minDistance = 1;
    controls.maxDistance = 2000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = .8;
    controls.panSpeed = .1;
	//controls.update();		*/
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	grup5 = new THREE.Group(); 
	grup6 = new THREE.Group(); 	
	
	addGround();
	addTrees(); 
	addFog(); 
	animFBX(); 
	
	//addAud(); 

	win.mouse = new THREE.Vector2(); 	
	win.entro = true; 
	win.idleTimer = 0; 
	win.fokus = true; 
	
	//win.raycaster = new THREE.Raycaster();
	win.pointer = new THREE.Vector2();

	/*
	if (isMobil) {
		//ui.kontainer.addEventListener( 'touchstart', onMouseMove2, false );
		//ui.kontainer.addEventListener( 'touchmove', onMouseMove2, false );		
		
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		
		//ui.kontainer.addEventListener('touchend', kontainerClick, false);  
	} else {
		ui.kontainer.addEventListener('mousemove', onMouseMove, false);
		
		ui.kontainer.addEventListener('click', kontainerClick, false);  
		ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
	}
	
	ui.kontainer.addEventListener("wheel", wheelE, false);	*/
	
	entro(); 
	
	//fadeScene(); 	
}

function entro() {
	ui.tempDiv = document.createElement("div");                 
	ui.tempDiv.setAttribute("id", "noAud");
	//ui.tempDiv.id = "noAud"; 
	ui.tempDiv.innerHTML = "ENTER";  
	ui.tempDiv.style.display = "block"; 
	ui.tempDiv.style.position = "absolute";
	ui.tempDiv.style.margin = "auto";					
	ui.tempDiv.style.top = "40%"; 
	ui.tempDiv.style.bottom = ui.tempDiv.style.left = ui.tempDiv.style.right = "0"; 
	ui.tempDiv.style.width = "160px";
	ui.tempDiv.style.height = "48px";
	//ui.tempDiv.style.lineHeight = "44px";
	ui.tempDiv.style.lineHeight = "48px";
	ui.tempDiv.style.fontFamily = "sans-serif"; 
	ui.tempDiv.style.fontSize = "24px"; 
	ui.tempDiv.style.textAlign = "center"; 
	ui.tempDiv.style.color = "rgba(255, 255, 255, 0.5)";
	ui.tempDiv.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
	ui.tempDiv.style.border = "2px solid rgba(255, 255, 255, 0.5)";
	ui.tempDiv.style.cursor = "pointer"; 
    
	//kontainer.addEventListener( 'click', kontainerClck, false ); 
	ui.kontainer.appendChild(ui.tempDiv); 				
}
	
function addGround() {
	x.ground = []; 
	
	let width = 1200, 
		height = 602, 
		posX = 0, 
		intrvl = 200; 
		
//	let geometry = new THREE.PlaneGeometry( width, height, 32, 32 );
	let geometry = new THREE.PlaneGeometry( width, height );

//	let material = new THREE.MeshStandardMaterial( { color: 0x555555, roughness: .3, metalness: .3 } );
	let material = new THREE.MeshStandardMaterial( { color: 0xa1a1a1, roughness: .35, metalness: .3 } );
	
	for ( let i = 0; i < 2; i++ ) {	
		let pozZ = height*.5; 
	
		x.ground[i] = new THREE.Mesh( geometry, material ); 
		
		x.ground[i].position.set(0, florY, pozZ);
		x.ground[i].rotation.x = Math.PI*-.5;
		//x.ground[i].castShadow = true; 
		x.ground[i].receiveShadow = true; 
		
		if (i == 1) {
			grup5.add( x.ground[i] );
		} else {
			grup6.add( x.ground[i] );
		}
	}

	var	loader = new THREE.TextureLoader(), 
		//loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader();  
		//loader4 = new THREE.TextureLoader();

	//loader.load( 'img/ground38c.jpg', function(tx) { 	
	//loader.load( 'img/forest_floor_albedo.png', function(tx) { 	
	loader.load( 'img/ground24c2.jpg', function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 2);    
		tx.repeat.set(6, 3);    
		
		for ( let j = 0; j < 2; j++ ) {	
			x.ground[j].material.map = tx; 
			//x.ground[j].material.aoMap = tx; 			
			//x.ground[j].material.bumpMap = tx; 
			//x.ground[j].material.normalScale.set(-.8, -.8); 
			//x.ground[j].material.normalMap = tx2; 
			//x.ground[j].material.roughnessMap = tx; 
			x.ground[j].material.needsUpdate = true;
			//x.ground[j].visible = true; 
		}
	});  		

	//loader3.load( 'img/ground38d.jpg', function(tx3) { 	
	//loader3.load( 'img/forest_floor_Height.png', function(tx3) { 	
	loader3.load( 'img/ground24b2.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		//tx3.repeat.set(4, 2);    
		tx3.repeat.set(6, 3);    
		//tx3.flipY = true;
		
		for ( let l = 0; l < 2; l++ ) {	
			//x.ground[l].material.aoMapIntensity = 1; 
			//x.ground[l].material.aoMap = tx3; 
			x.ground[l].material.bumpScale = 1.5; 
			x.ground[l].material.bumpMap = tx3; 
			//x.ground[l].material.displacementScale = 10; 
			//x.ground[l].material.displacementBias = -5; 
			//x.ground[l].material.displacementMap = tx3; 
			//x.ground[l].material.roughnessMap = tx3; 
			x.ground[l].material.needsUpdate = true;
		}
	});	
	
	grup5.position.z = intrvl*3; 

	scene.add(grup5); 
	scene.add(grup6); 	
	
	//x.spotLight.target = x.ground[0];	
	
	/*
	const fogCol = 0x2e3032; 
	
//	scene.fog.color.set(0x7a8288); 
	scene.fog.color.set(fogCol); 
//	scene.fog.density = 0.003; 
	scene.fog.density = 0.0037; 
	
	x.spotLight.intensity = 93; 	
	x.spotLight.angle = Math.PI/4; 	
	//x.spotLight.angle = Math.PI/2; 	
	x.spotLight.penumbra = 1; 	
//	x.spotLight.position.z = 1000; 
	x.spotLight.position.z = 1060; 
//	camera.position.set(0, -40, 1240);
	camera.position.set(9, -25, 1144);
	
//	renderer.setClearColor(0x7a8288, 1.0); 
	renderer.setClearColor(fogCol, 1.0); 	
	*/
}

const randomizeMatrix = function () {
	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();

	return function ( matrix ) {
		let posx = (Math.random() * 1140 - 570); 
		
	//	if ((posx > -30) && (posx < 30)) {
		if ((posx > -33) && (posx < 33)) {
			let rnd = Math.random() < 0.5 ? -1 : 1;
			//posx = 34 * rnd; 
			posx = 35 * rnd; 
			//console.log(posx);
		}
		
		position.x = posx;
	//	position.y = (Math.random() * 20 - 15);
		position.y = (Math.random() * 15 - 15);
		position.z = (Math.random() * 580 - 290);

		rotation.x = Math.PI/-2; 
		//rotation.x = Math.random() * 2 * Math.PI;
		//rotation.y = Math.random() * 2 * Math.PI;
	//	rotation.y = (Math.random() * .04 - .02) * Math.PI;
		rotation.y = (Math.random() * .02 - .01) * Math.PI;
		rotation.z = Math.random() * 2 * Math.PI;

		quaternion.setFromEuler( rotation );

		//scale.x = scale.y = scale.z = 2500 - Math.random() * 400;
	//	scale.x = scale.y = scale.z = 14 - Math.random() * 4;
		scale.x = scale.y = scale.z = 42 - Math.random() * 7;

		matrix.compose( position, quaternion, scale );
	};
}(); 

function addTrees() {
	x.treez = []; 
	x.branchez = []; 
	let matrix = []; 
	
//	const loader = new FBXLoader();
	const loader = new OBJLoader();
	
	loader.load( 'obj/trees/1trunk1branch.obj', function ( object ) {
		for ( let i = 0; i < 2; i ++ ) {
		//	const material = new THREE.MeshStandardMaterial( {color: 0xa1a1a1, roughness: .75, metalness: .0, side: THREE.FrontSide } );
			const material = new THREE.MeshStandardMaterial( {color: 0xaaaaaa, roughness: .75, metalness: .0, side: THREE.FrontSide } );
			const material2 = new THREE.MeshStandardMaterial( {color: 0xaaaaaa, roughness: .8, metalness: .0, side: THREE.DoubleSide, transparent: true, depthWrite: false } );
			
			object.children[0].geometry.computeVertexNormals();
	//		object.children[0].geometry.scale( 1.68, 1.68, 1.68 );
			object.children[0].geometry.rotateX(Math.PI * .5); 
			
			object.children[1].geometry.computeVertexNormals();
			object.children[1].geometry.rotateX(Math.PI * .5); 
			
			matrix[i] = new THREE.Matrix4(); 
			
			x.treez[i] = new THREE.InstancedMesh( object.children[0].geometry, material, 50 );
			x.branchez[i] = new THREE.InstancedMesh( object.children[1].geometry, material2, 50 );
			//console.log(object.children[0].geometry.attributes); 
			
			for ( let j = 0; j < 50; j ++ ) {
				randomizeMatrix( matrix[i] );
				x.treez[i].setMatrixAt( j, matrix[i] );
				x.branchez[i].setMatrixAt( j, matrix[i] );
			}			
			
			//x.treez[i].scale.set(.8, .8, .8); 
			x.treez[i].position.set(0, florY+2, 300); 
			//x.treez[i].rotation.x = Math.PI/2; 
			
			x.branchez[i].position.set(0, florY+2, 300); 
			
			x.treez[i].castShadow = true;
			x.treez[i].receiveShadow = true;
			
		//	x.branchez[i].castShadow = true;
			x.branchez[i].receiveShadow = true;
			//child.receiveShadow = true;		
		
			if (i == 1) {
				grup5.add( x.treez[i] );
				grup5.add( x.branchez[i] );
			} else {
				grup6.add( x.treez[i] );
				grup6.add( x.branchez[i] );
			}			
		}			

		var	loader = new THREE.TextureLoader(), 
			loader2 = new THREE.TextureLoader(), 
			loader3 = new THREE.TextureLoader(),  
			loader4 = new THREE.TextureLoader();  
		
		//loader.load( 'obj/trees/RGB_5deb779987eb4608a00ac02205e94b99_treewastelandevergreen03_low_tree_03_Diffu.png', function(tx) { 	
		loader.load( 'obj/trees/evergreend.jpg', function(tx) { 	
		//	tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
			//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//	tx.repeat.set(2, 2);    
			
			for ( let k = 0; k < 2; k++ ) {	
				x.treez[k].material.map = tx; 
			//	x.treez[k].material.bumpScale = .15; 
			//	x.treez[k].material.bumpScale = 1.75; 
			//	x.treez[k].material.bumpMap = tx; 
			//	x.treez[k].material.roughnessMap = tx; 
				x.treez[k].material.needsUpdate = true;
				//x.treez[k].visible = true; 
			}
		});  			
		
		//loader2.load( 'obj/trees/R_6385e0629d9d4343bf4cad7f5749533c_treewastelandevergreen03_low_tree_03_Gloss.jpeg', function(tx2) { 	
		//loader2.load( 'obj/trees/N_a73997bd70fc48bb82ae98ac47bed1ff_treewastelandevergreen03_low_tree_03_Norma.jpeg', function(tx2) { 	
		loader2.load( 'obj/trees/evergreenn.jpg', function(tx2) { 	
		//	tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
			//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
			
			for ( let l = 0; l < 2; l++ ) {	
			//	x.treez[l].material.bumpScale = 1.; 
			//	x.treez[l].material.bumpMap = tx2; 
				//x.treez[l].material.normalScale.set(-1, -1); 
				x.treez[l].material.normalScale.set(-.17, -.17); 
				x.treez[l].material.normalMap = tx2; 
				//x.treez[l].material.roughnessMap = tx2; 
				x.treez[l].material.needsUpdate = true;
				//x.treez[l].visible = true; 
			}
		});  	
	
		//loader3.load( 'obj/trees/A_aeb7fa60bb3a4d7bbd003339ad90651d_branch_low_branch_Diffuse.png', function(tx3) { 	
		loader3.load( 'obj/trees/brancha.jpg', function(tx3) { 	
			//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;   
			
			for ( let m = 0; m < 2; m++ ) {				
				x.branchez[m].material.alphaMap = tx3; 
				x.branchez[m].material.needsUpdate = true;
				//x.branchez[m].visible = true; 
			}
		});  

		//loader4.load( 'obj/trees/RGB_2ca84c26959347bd8c1dd6b10e6cba14_branch_low_branch_Diffuse.png', function(tx4) { 	
		loader4.load( 'obj/trees/branchd.jpg', function(tx4) { 	
			//tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;   
			
			for ( let n = 0; n < 2; n++ ) {				
				x.branchez[n].material.map = tx4; 
			//	x.branchez[n].material.bumpScale = .5; 
				x.branchez[n].material.bumpScale = 4.; 
				x.branchez[n].material.bumpMap = tx4; 
				x.branchez[n].material.needsUpdate = true;
				//x.branchez[n].visible = true; 
			}
		});  
		
	//	fadeScene(); 
		
	} );	

}

function addFog() {
	x.kloud = []; 
	
	for ( let i = 0; i < 2; i ++ ) {
		const geometry = new THREE.BufferGeometry();
		const vertices = [];
		
		for ( let j = 0; j < 100; j ++ ) {
			const x = 1200 * Math.random() - 600; 
			const y = 40 * Math.random() + florY+200; 		
			//const y = 0; 
			const z = 600 * Math.random() - 300;  
		
			vertices.push( x, y, z );
		}
		
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		geometry.computeBoundingSphere();
			
		let material = new THREE.PointsMaterial( { color: 0x3e4042, size: 400, sizeAttenuation: false, transparent: true, depthWrite: false, depthTest: true, fog: true} );
		//material.color.setHSL( 1.0, .4, .9 );
		material.opacity = .8;
		/*material.fogColor = fog.color;
		material.fogNear = fog.near; 
		material.fogFar = fog.far; */
			
		x.kloud[i] = new THREE.Points( geometry, material );

		x.kloud[i].position.set(0, 1, 300); 	
		
		if (i == 1) {
			grup5.add( x.kloud[i] );	
		} else {
			grup6.add( x.kloud[i] );	
		}
		
		//scene.add( x.kloud1 );	
		
		//material.blending = THREE.AdditiveBlending; 
		
		let	loader = new THREE.TextureLoader(); 
		loader.load( 'img/fog.png', function(tx) { 	
			//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
			//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
			//tx.repeat.set(4, 4);    
			
		//	x.kloud1.material.map = x.kloud2.material.map = x.kloud3.material.map = tx; 
		//	x.kloud1.material.needsUpdate = x.kloud2.material.needsUpdate = x.kloud3.material.needsUpdate = true;
			x.kloud[i].material.map = tx; 
			x.kloud[i].material.needsUpdate = true;
			//x.kloud1.visible = true; 
		});  		
	}
}
	
function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
        let val = parseFloat(ui.kontainer.style.opacity);
        if (!((val += .1) > 1.0)) {
            ui.kontainer.style.opacity = val;
			
            requestAnimationFrame(fadeIn);
        } else {
            ui.kontainer.style.opacity = 1.0;
			
			onWindowResize(); 			
			
			//entro(); 
			
			if (isMobil) {
				//ui.kontainer.addEventListener( 'touchstart', onMouseMove2, false );
				//ui.kontainer.addEventListener( 'touchmove', onMouseMove2, false );		
				
				//document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				//document.addEventListener( 'touchmove', onDocumentTouchMove, false );
				ui.kontainer.addEventListener( 'touchstart', onDocumentTouchStart, false );
				ui.kontainer.addEventListener( 'touchmove', onDocumentTouchMove, false );
				
				//ui.kontainer.addEventListener('touchend', onDocumentTouchEnd, false);  
			} else {
				ui.kontainer.addEventListener('mousemove', onMouseMove, false);
				
				ui.kontainer.addEventListener('click', kontainerClick, false);  
				//ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
			}				
			
			ui.kontainer.addEventListener('pointermove', onMouseMove, false);
			
			//ui.kontainer.addEventListener("wheel", wheelE, { passive: false });			
			ui.kontainer.addEventListener("wheel", wheelE, false);			
			
			animate();  
			
			animWalk(); 
        }
    })();	
}	

function animWalk() {
    (function walkIn() {
		let z5 = grup5.position.z, 
			z6 = grup6.position.z;
			//console.log(z1);
			
		if (z5 < 1200) {
			grup5.position.z = z5 + 1; 
		} else {
			grup5.position.z = 0; 
		}
			
		if (z6 < 1200) {
			grup6.position.z = z6 + 1; 
		} else {
			grup6.position.z = 0; 
		}					
					
		requestAnimationFrame(walkIn);					
    })();	
}
	
function clickTap() {
	if (ui.tempDiv) {
		ui.tempDiv.parentNode.removeChild(noAud);	
		ui.tempDiv = undefined; 
		
		//win.navbars.visible = true; 
	}
	//container.removeEventListener( 'click', containerClick, false ); 
	addAud(); 
}
	
function onMouseMove( event ) {
    if (event) event.preventDefault();

	//win.mXr = mouseX; 
	
	mouseX = event.clientX - win.widthH;
	mouseY = event.clientY - win.heightH;
	
	if (isMobil) {
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;	
	} else {
		win.pointer.x = ( event.clientX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.clientY / win.height ) * 2 + 1;	
	}
	
	mouseY -= 50; 	
	
	win.idleTimer = 0; 
}

function onMouseWheel( event ) {
    event.preventDefault();
    //event.stopPropagation();                

    win.idleTimer = 0;
}	

function wheelE( event ) {
    event.preventDefault();
    //event.stopPropagation(); 

	//console.log(camera.position.z);
    
	//let camZ = camera.position.z; 
	//console.log(camZ);
	
	x.prevCamZ = camera.position.z; 
	camera.position.z += event.deltaY * .1; 	
	
	if ((camera.position.z < 1120) || (camera.position.z > 1240)) camera.position.z = x.prevCamZ; 
	
	/*if ((camZ >= 1095) && (camZ <= 1280)) {
		x.prevCamZ = camera.position.z; 
		camera.position.z += event.deltaY * .1; 
	} else {
		camera.position.z = x.prevCamZ; 
	}*/
	
	win.idleTimer = 0;
}	

function onDocumentTouchStart( event ) {
	if ( event.touches.length === 1 ) {
	//	event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH; 
		
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;			
		
		clickTap(); 
		
		win.idleTimer = 0; 
	}
}

function onDocumentTouchMove( event ) {
	if ( event.touches.length === 1 ) {
	//	event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - win.widthH;
		mouseY = event.touches[ 0 ].pageY - win.heightH;
	}
}

function onDocumentTouchEnd( event ) {
	if ( event.touches.length === 1 ) {	
		win.pointer.x = ( event.touches[ 0 ].pageX / win.width ) * 2 - 1;
		win.pointer.y = - ( event.touches[ 0 ].pageY / win.height ) * 2 + 1;		
	
		clickTap(); 
	
		//document.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		//document.removeEventListener( 'touchend', onDocumentTouchEnd, false );
		ui.kontainer.removeEventListener( 'touchmove', onDocumentTouchMove, false );
		ui.kontainer.removeEventListener( 'touchend', onDocumentTouchEnd, false );
	
		win.idleTimer = 0; 	
	}
}

function kontainerClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();

	clickTap(); 
	
	win.idleTimer = 0; 
}
	
function onWindowResize() {
    win.width = window.innerWidth;
    win.height = window.innerHeight;
    
	if (isMobil) {
        let winWH = document.documentElement.getBoundingClientRect();
        let winWHx = document.documentElement.clientWidth, 
            winWHy = document.documentElement.clientHeight;
        if (winWH) {
            win.width = winWH.width;
            win.height = winWH.height;
        } else if (winWHx) {
            win.width = winWHx;
            win.height = winWHy;            
        } else {
            let tmpWW = win.width;
            win.width = win.height; 
            win.height = tmpWW;
        }
    }
        
    win.widthH = win.width / 2;
    win.heightH = win.height / 2;        	
	
    document.body.style.width = ui.kontainer.style.width = win.width + 'px';
    document.body.style.height = ui.kontainer.style.height = win.height + 'px';    
	
	camera.aspect = win.width / win.height;
	camera.updateProjectionMatrix();

	renderer.setSize(win.width, win.height);	
	
	if (win.width > win.height) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((win.width+win.height)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((win.width+win.height)/2)*0.028+'px';
	}	
	
	win.idleTimer = 0; 
}


function animate() { 
    requestAnimationFrame(animate);

	if (win.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		//const timer = Date.now() * 0.0001;
	
	//	const delta = clock.getDelta() * .7;
		const delta = clock.getDelta() * .7;
		if ( mixer ) mixer.update( delta );	
		
		win.idleTimer += 0.01; 
		
		render();
	} else {
		if (clock.running) clock.stop(); 
	}
	
	if (document.hasFocus()) {
		if (!win.fokus) {
			win.idleTimer = 0; 
			win.fokus = true; 
		}
	} else {
		win.idleTimer = idleTO; 	
		win.fokus = false; 
	}	
	
	TWEEN.update();	
}

function render() {
	//camera.lookAt(scene.position); 	
	//camera.lookAt(0, 10000, 0); 	
	
	//controls.update(); 
	
	//x.spotLight.target = camera;		
	//x.spotLightHelper.update();
	
	camera.rotation.y = ( mouseX - camera.position.x ) * -.0006;
	camera.rotation.x = ( -mouseY - camera.position.y ) * .0006;	
	
	//camera.position.x = mouseX * .05;
	//camera.position.y = (mouseY * .1) - (mouseY * .05);
	
	renderer.render( scene, camera );	
}

/*
function animFBX2() {
	const loader = new FBXLoader();
	
	loader.load( 'obj/ybot.fbx', function ( object ) {
	//	const material = new THREE.MeshStandardMaterial( {color: 0xffffff, skinning: true, roughness: .0, metalness: .7 } );
		const material = new THREE.MeshStandardMaterial( {color: 0xffffff, roughness: .0, metalness: .65 } );
		//const material = new THREE.MeshPhysicalMaterial( {color: 0xffffff, skinning: true } );

		x.char1 = object; 
	
		mixer = new THREE.AnimationMixer( x.char1 );
		//mixer = new THREE.AnimationMixer( object );

		const action = mixer.clipAction( x.char1.animations[ 0 ] );
		//const action = mixer.clipAction( object.animations[ 0 ] ); 
		
		action.play();

		x.char1.traverse( function ( child ) {
		//object.traverse( function ( child ) {

			if ( child.isMesh ) {
			//if ( child.isSkinnedMesh ) {
				child.material = material; 
				
				child.castShadow = true;
				child.receiveShadow = true;
				
				//console.log('skin'); 
			}

		} );
		
		x.char1.scale.set(.5, .5, .5); 
		x.char1.position.set(0, -100, 1090); 
		x.char1.rotation.y = Math.PI; 		
		//object.scale.set(.5, .5, .5); 
		//object.position.set(0, -100, 1090); 
		//object.rotation.y = Math.PI; 

		scene.add( x.char1 );
		//scene.add( object );
		
		//const targetObject = new THREE.Object3D();

		x.spotLight.target = x.char1;							
		
		//console.log(x.spotLight.target);
		//const spotLightHelper = new THREE.SpotLightHelper( x.spotLight );
		//scene.add( spotLightHelper );					
		
		let loader2 = new THREE.TextureLoader();

		loader2.load( 'img/chip001c.jpg', function(tx) { 	
			tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//	tx.repeat.set(2, 2);    
			
			material.map = tx; 
		//	material.bumpScale = .06; 
			material.bumpScale = 1.6; 
			material.bumpMap = tx; 
			//material.metalMap = tx; 
			//material.normalScale.set(-1, -1); 
			//material.normalMap = tx; 
			//material.roughnessMap = tx; 
			material.needsUpdate = true;

		});  		

		fadeScene(); 	
	} );

}
*/
	
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
		
		for ( let i = 0; i < 8; i++ ) {	
			//x.char1.children[i].geometry.computeBoundingBox(); 
			
			matr[i] = new THREE.MeshStandardMaterial( { color: 0xd4d4d4, roughness: .75, metalness: 0 } );
			x.char1.children[i].material = matr[i]; 
			
		}

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
			matr[3].map = tx3; 
			matr[3].needsUpdate = true;
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
			matr[6].normalScale = new THREE.Vector2( -1, -1 ); 
			matr[6].normalMap = txn6; 
			matr[6].needsUpdate = true;
		});  		

		//x.char1.rotation.x = 0;		
		//x.char1.position.set(0, -100, 1060); 
		//x.char1.rotation.y = Math.PI; 	
		
		x.char1.scale.set(.52, .52, .52); 
		x.char1.position.set(0, -100, 1090); 
		x.char1.rotation.set(0, Math.PI, 0);	
		
		scene.add( x.char1 ); 
		
		x.spotLight.target = x.char1;
		
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

function addAud() {
	//let url = 'bragernesasen-18874'; 	
	//let url = 'bird-voices-7716'; 	
	//let url = 'believe-in-miracle-by-prabajithk-121041'; 	
	//let url = 'calm-and-peaceful-115481'; 	
	//let url = 'cancion-triste-1502'; 	
	let url = 'frst1'; 	
	url += '.mp3'; 	

	// create an AudioListener and add it to the camera
	const listener = new THREE.AudioListener();
	camera.add( listener );
	
	// create a global audio source
	const sound = new THREE.Audio( listener );
	
	// load a sound and set it as the Audio object's buffer
	const audioLoader = new THREE.AudioLoader();
	
	audioLoader.load( 'aud/' + url, function( buffer ) {

		sound.setBuffer( buffer );
		sound.setLoop( true );
		sound.setVolume( 0.4 );
		sound.play();
	});
	
}




	