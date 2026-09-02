/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Water } from 'three/addons/objects/Water.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'; 

const idleTO = 120, florY = -1, ceilY = 140;  

let camera, scene, renderer, clock; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = -50;  

const ui = {}, _ = {}, x = {}; 


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

	_.ej = []; 	
	
	_.ej[0] = 0; 			//0 or 3000 - camGrup pos z	
	_.ej[1] = -1; 			//front or back -1 or 1	
	_.ej[2] = Math.PI;		//Math.PI or 0	
	_.ej[3] = 0; 			//1200 or 0 - camGrup pos z
	_.ej[4] = 0;			//0	or .0116
	_.ej[5] = 100;			//70 or 35	
	
	x.zz = 450; 

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	renderer.toneMapping = THREE.ACESFilmicToneMapping;	
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
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 20000 ); 
	camera.position.set(0, _.ej[5], 220); 

    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0xcdcdcd ) );	

	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xfff7dd, 5000000, 7000, Math.PI/8, 1 );
	x.spotLight[0].position.set( -3200, 2000, 2900 );
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 7000;
	x.spotLight[0].shadow.camera.fov = 50;
	
	scene.add( x.spotLight[0] );	
	scene.add(x.camGrup); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	_.mouse = new THREE.Vector2(); 	
	_.entro = true; 
	_.idleTimer = 0; 
	_.fokus = true; 
	
	_.pointer = new THREE.Vector2();
	_.ptrDown = false; 

	x.target0 = new THREE.Object3D(); 
	x.target0.position.set(0, _.ej[5], 0); 
	scene.add(x.target0);
	
	x.target1 = new THREE.Object3D(); 
	x.target1.position.set(0, 0, 500); 
	scene.add(x.target1);
	
	x.spotLight[0].target = x.target1; 

	x.rotCam = false; 
	
	addSkybox(); 
	addSun(); 

	onWindowResize(); 
	
}

function addSkybox() {
	
	const f = '.jpg'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'img/skybox/7/' );

	loader.load( [
		'posx2'+f, 'negx2'+f,
		'posy'+f, 'negy'+f,
		'posz2'+f, 'negz2'+f
	], function ( tx ) {
	
		scene.background = x.skybox = tx;  
		
		addMountain(); 
 
	} );
	
}

function addSun() {

	let load1 = new THREE.TextureLoader(),  
		loadF = new THREE.TextureLoader(); 

	const flare3 = loadF.load( 'img/sun/flare3.jpg', function(tx3) {  
	}); 
	
	load1.load( 'img/sun/color1.jpg', function(tx1) { 
		
		const lensflare = new Lensflare();
		lensflare.addElement( new LensflareElement( tx1, 700, 0, x.spotLight[0].color ) );
		lensflare.addElement( new LensflareElement( flare3, 60, .4 ) ); 
		lensflare.addElement( new LensflareElement( flare3, 90, .5 ) );
		lensflare.addElement( new LensflareElement( flare3, 140, .6 ) );
		lensflare.addElement( new LensflareElement( flare3, 90, .7 ) );	
		
		x.spotLight[0].add( lensflare ); 		
	}); 	

}

function addMountain() {
	
	let meshCount = 0; 
	x.mountain = []; 

	const loader = new OBJLoader();
	
	loader.load( 'obj/mountain/0/deci40.obj', function ( object ) {
		
		object.traverse( function ( child ) {
			
			if ( child.isMesh ) {
	
				child.geometry.computeBoundingBox();		
					
				meshCount += 1; 
			}
			
		});	
		
		const url2 = 'obj/mountain/0/mat/', 
			  frm = 'jpg', 
			  posX = [-110, 0, 110]; 
		
		const geom = object.children[0].geometry,  
			  matr = new THREE.MeshBasicMaterial( { color: 0xffffff } );
		
		matr.transparent = true; 
		matr.wireframe = true; 
		
		for ( let i = 0; i < meshCount; i++ ) {	
		
			x.mountain[i] = new THREE.Mesh( geom, matr );
			
			x.mountain[i].scale.set(14, 14, 14); 
			x.mountain[i].rotation.set(Math.PI/-2, 0, 0);
			
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

		lakeMater.alphaTest = .5; 
		lakeMater.wireframe = true; 
		
		const lakeMask = new THREE.Mesh( lakeGeom, lakeMater ); 
		lakeMask.position.set(222, 15.5, -196.7); 
		lakeMask.rotation.set(Math.PI/-2, 0, 0); 

		grups[0].add( lakeMask );
		
		const loadLM = new THREE.TextureLoader(); 
	
		loadLM.load( url2 + 'alfa3b.jpg', function(txLM) { 
		
			lakeMater.alphaMap = txLM; 
			lakeMater.needsUpdate = true; 
			
			lakeMater.wireframe = false; 
			
		}); 
		
		addSea(); 

	}); 
	
}	



function addSea() {
	
	const waterGeometry = new THREE.PlaneGeometry( 800, 1067 );

	x.sea = new Water(
		waterGeometry,
		{
			textureWidth: 600,
			textureHeight: 800,
			waterNormals: new THREE.TextureLoader().load( 'img/water/waternormals.jpg', function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}),
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x000000, 
			distortionScale: 13,
			fog: scene.fog !== undefined
		}
	);

	x.sea.position.set(220, 15, -210);
	x.sea.rotation.x = - Math.PI / 2;
	x.sea.rotation.z = - .08;

	scene.add( x.sea );	
	
	const waterUniforms = x.sea.material.uniforms;
	waterUniforms['size'].value = .04; 
	
	addPath(); 
 	
}

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
	curve.closed = true;
	
	x.points = curve.getPoints( 2000 );
	
	x.camFlight = 0; 
	x.ptsLength = x.points.length; 
	
	fadeScene(); 
	
}


function fadeScene() {
	
	onWindowResize(); 	
	
    (function fadeIn() {
		
		let val = parseFloat(ui.fader.style.opacity); 
		
		if (!((val -= .05) < 0)) {
 			ui.fader.style.opacity = val;
            
			requestAnimationFrame(fadeIn); 
			
        } else {
			
 			ui.fader.style.opacity = 0;
            ui.fader.style.display = "none";
			ui.fader.parentNode.removeChild(ui.fader);	
			
			onWindowResize(); 			
			
			eL(ui.kontainer, 0, 'pointerdown', onPointerDown); 
			eL(ui.kontainer, 0, "pointermove", onPointerMove); 
			
			x.camV3 = new THREE.Vector3(); 			
			
			animate();  
			
			theOptions(); 
			
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			x.fogIdx = 0; 
			x.fogInc = 1; 
			
        }
		
    })();	
	
}	

function theOptions() {
	
	ui.swtchKam.style.visibility = "visible"; 	
	
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
	
	x.rotCam = !x.rotCam;  
	
	x.camGrup.rotation.set(0, 0, 0);  
	camera.position.x = 0; 
	
	_.idleTimer = 0; 
	
}

function audClick(event) {
	
    if (event) event.preventDefault(); 

	if (x.sound) {
		
		if (x.sound.isPlaying) {
			
			cL(ui.offAud, 0, "noneIt2");
			cL(ui.onAud, 1, "noneIt2");

			x.sound.pause(); 

		} else {
			
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");			

			x.sound.play(); 

		}
		
	} else {
		
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

	_.idleTimer = 0;
	
}	

function onWindowResize() {
	
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    
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

	x.zz = 450; 
	
	if (_.width > _.height) {

		x.zz = 450;
		
	} else {

		x.zz = 600; 
		
	}		
	
	_.idleTimer = 0; 
	
}

function addAud() {
	
	if (!x.sound) {
		
		let url = 'mntn'; 			
		url += '.mp3'; 	

		const listener = new THREE.AudioListener();
		camera.add( listener );
		
		x.sound = new THREE.Audio( listener );
		
		const audioLoader = new THREE.AudioLoader();
		
		audioLoader.load( 'aud/' + url, function( buffer ) {
		
			x.sound.setBuffer( buffer );
			x.sound.setLoop( true );
			x.sound.setVolume( 1.0 );

			x.sound.play(); 

			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
			
		}); 
	
	}
	
}

function animate() { 

    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 

		if (x.rotCam) {
			
			if (x.camFlight >= 0) {
				
				if ((x.camFlight % 1) == 0) {
					
					const xcF = Math.round(x.camFlight); 
					
					camera.position.set(x.points[xcF].x, x.points[xcF].y, x.points[xcF].z); 
					
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
	
}

function render() {
	
	renderer.render( scene, camera );	
	
}


	
	