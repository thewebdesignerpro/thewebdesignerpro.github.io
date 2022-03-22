/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
 
import * as THREE from './jsm/three.module.js';
import WEBGL from './jsm/WebGL.js'; 
import { TWEEN } from './jsm/tween.module.min.js'; 
import { FBXLoader } from './jsm/loaders/FBXLoader.js';

import { OrbitControls } from './jsm/controls/OrbitControls.js';

const idleTO = 120; 

let camera, scene, renderer; 

let isMobil = false; 
let mouseX = 0, mouseY = 0, clock; 
let mixer; 
let ui = {}, win = {}, x = {}; 

// temp
//let controls; 



if ( WEBGL.isWebGLAvailable() === false ) {	
    var warning = WEBGL.getWebGLErrorMessage();
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

	var dummy = document.createElement("div");
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
	
	camera = new THREE.PerspectiveCamera( 50, win.width / win.height, 1, 97000 );
	camera.position.set( 4000, 10000, 15000 );
	
	//camera.position.set( 1000, 24000, -10000 );	//about
	//camera.position.set( 4000, 15000, -17000 );	//portfolio
	//camera.position.set( 33000, 8000, 2000 );	//xctualyfe
	//camera.position.set( -2000, 14500, 16000 );	//contact
	
	//camera.lookAt( 0, 0, 0 );

	//console.log(camera);
	
    scene = new THREE.Scene();
    scene.add(camera);	

	//temp 
	const fogkolor = 0xcc77cc; 
	
	//scene.fog = new THREE.Fog(0x000000, 40, 56);
	//scene.fog = new THREE.FogExp2(0x777777, 0.00008);	
	scene.fog = new THREE.FogExp2(fogkolor, 0.00008);	
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	//renderer.setClearColor(0x777777, 1.0); 
	renderer.setClearColor(fogkolor, 1.0); 
	renderer.shadowMap.enabled = false;
	//renderer.sortObjects = false;
	ui.kontainer.appendChild(renderer.domElement); 
	
	theLights(); 

	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false); 
	
	win.mouse = new THREE.Vector2(); 
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	win.entro = true; 
	win.idleTimer = 0; 
	win.fokus = true; 
	
	win.raycaster = new THREE.Raycaster();
	win.pointer = new THREE.Vector2();

	loadSet(); 
	
	niteSky(); 
	addStars(); 
	
	xctualyfe(); 
	entro(); 
	
	addMenu(); 
	
	fadeScene(); 	
	

	
	
	//temp
	/*controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 10000, 0 );
	controls.update();	*/
	
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
	ui.tempDiv.style.lineHeight = "44px";
	ui.tempDiv.style.fontFamily = "sans-serif"; 
	ui.tempDiv.style.fontSize = "24px"; 
	ui.tempDiv.style.textAlign = "center"; 
	ui.tempDiv.style.color = "rgba(255, 255, 255, 0.5)";
	ui.tempDiv.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
	ui.tempDiv.style.border = "2px solid rgba(255, 255, 255, 0.5)";
	ui.tempDiv.style.cursor = "pointer"; 
    
	//kontainer.addEventListener( 'click', kontainerClck, false ); 
	kontainer.appendChild(ui.tempDiv); 				
}
	
function addMenu() {
	win.navbars = new THREE.Group(); 
	x.navbars = []; 
	
	const geometry = new THREE.PlaneGeometry( 320, 80 );
	
	for ( var i = 0; i < 4; i++ ) {	
		const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.FrontSide, transparent: true, opacity: .5 } );
		x.navbars[i] = new THREE.Mesh( geometry, material );
		
		if (isMobil) { 
			if (win.width > win.height) {
				x.navbars[i].position.set(160, i*-100+140, -1100); 
				//x.navbars[i].position.set(40, i*-100+140, -1100); 
			} else {
				x.navbars[i].position.set(120, i*-100+140, -1100); 
				//x.navbars[i].position.set(0, i*-100+140, -1100); 
			}
		} else {
			//x.navbars[i].position.set(250, i*-100+140, -1100); 	
			x.navbars[i].position.set(250, i*-100+140, -1100); 	
		}
				
		x.navbars[i].rotation.y = -.75; 
		
		x.navbars[i].name = 'nav' + i; 
		
		win.navbars.add( x.navbars[i] );
	}
	
	camera.add(win.navbars); 
	
	win.navbars.visible = false; 
	
	const loader1 = new THREE.TextureLoader();
	loader1.load('img/nav1.jpg',
		function ( tx1 ) {
			x.navbars[0].material.map = tx1; 
			x.navbars[0].material.needsUpdate = true; 
		},
		undefined,
		function ( err ) {	console.error( 'An error happened.' );	}
	);	

	const loader2 = new THREE.TextureLoader();
	loader2.load('img/nav2.jpg',
		function ( tx2 ) {
			x.navbars[1].material.map = tx2; 
			x.navbars[1].material.needsUpdate = true; 
		},
		undefined,
		function ( err ) {	console.error( 'An error happened.' );	}
	);	

	const loader3 = new THREE.TextureLoader();
	loader3.load('img/nav3.jpg',
		function ( tx3 ) {
			x.navbars[2].material.map = tx3; 
			x.navbars[2].material.needsUpdate = true; 
		},
		undefined,
		function ( err ) {	console.error( 'An error happened.' );	}
	);	
	
	const loader4 = new THREE.TextureLoader();
	loader4.load('img/nav4.jpg',
		function ( tx4 ) {
			x.navbars[3].material.map = tx4; 
			x.navbars[3].material.needsUpdate = true; 
		},
		undefined,
		function ( err ) {	console.error( 'An error happened.' );	}
	);		
}
	
function theLights() {
	const light = new THREE.AmbientLight( 0xffffff ); // soft white light
	//scene.add( light );	
}

function niteSky() {
	const geometry = new THREE.SphereBufferGeometry( 44000, 24, 16, 0, Math.PI*2, 0, Math.PI/2 );
	let material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: .35, fog: false, side: THREE.BackSide  } );
	const skyDome = new THREE.Mesh( geometry, material );
	scene.add( skyDome );	
	
	const loader = new THREE.TextureLoader();
	loader.load('img/sky.jpg',
		function ( texture ) {
			skyDome.material.alphaMap = texture; 
			skyDome.material.needsUpdate = true; 
		},
		undefined,
		function ( err ) {
			console.error( 'An error happened.' );
		}
	);	
}

function addStars() {
	const geometry = new THREE.BufferGeometry();
	const vertices = [];

	for ( let i = 0; i < 2000; i ++ ) {
		//const x = 90000 * Math.random() - 45000;
		//const y = 90000 * Math.random() - 45000;
		//const z = 90000 * Math.random() - 45000;

		var vct = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct.normalize();
		vct.multiplyScalar(THREE.Math.randFloat(25000, 45000));		
		
	//	vertices.push( x, y, z );
		vertices.push( vct.x, vct.y, vct.z  );

	}

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	var material = new THREE.PointsMaterial( { color: 0xffffff, size: 700, sizeAttenuation: true, transparent: true, depthWrite: false, depthTest: true, fog: false } );
	//material.color.setHSL( 1.0, .4, .9 );
	//material.opacity = .6;
	
	let bitwin = new THREE.Points( geometry, material );
	scene.add( bitwin );	
	
	var	loader = new THREE.TextureLoader(); 
	loader.load( 'img/star1.png', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    
		
		bitwin.material.map = tx; 
		bitwin.material.needsUpdate = true;
	});  		
	
}
	
function xctualyfe() {
	const video = document.getElementById( 'video' );
	//video.play();
	const texture = new THREE.VideoTexture( video );
	
	//const geometry = new THREE.PlaneBufferGeometry( 12000, 8000, 160, 110 );
	const geometry = new THREE.SphereBufferGeometry( 6000, 24, 16, Math.PI+.2, Math.PI-.4, Math.PI/4, Math.PI/2 );
	const material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.BackSide, fog: false} );
	x.bidyo = new THREE.Mesh( geometry, material );
	scene.add( x.bidyo );
	
	//x.bidyo.position.set(0, 10000, -20000); 
	//x.bidyo.position.set(20000, 8000, 2000); 
	x.bidyo.position.set(20000, 8000, 0); 
	x.bidyo.rotation.y = Math.PI/2;
	
	x.bidyo.material.map = texture; 
	x.bidyo.material.needsUpdate = true; 
	
	x.bidyo.scale.set(1, 1, .34); 
	
	/*
	var	loader = new THREE.TextureLoader(); 
	loader.load( 'img/tv.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(4, 4);    

		//bidyo.material.displacementBias = 100; 
		x.bidyo.material.displacementScale = 500; 
		x.bidyo.material.displacementMap = tx; 
		x.bidyo.material.needsUpdate = true;
	});  		
	*/
}
	
function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
        var val = parseFloat(ui.kontainer.style.opacity);
        if (!((val += .05) > 1.0)) {
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
				ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
			}				
			
			ui.kontainer.addEventListener('pointermove', onMouseMove, false);
			
			animate();  
			
        }
    })();	
}	

function loadSet() {
	const loader = new FBXLoader();
	loader.load( 'obj/spire2.fbx', function ( object ) {
		
		const material = new THREE.MeshBasicMaterial( {color: 0x080808, side: THREE.FrontSide } );
		
		x.theSet = object; 		

		mixer = new THREE.AnimationMixer( x.theSet );

		//const action = mixer.clipAction( x.theSet.animations[ 0 ] );
		//action.play();

		x.theSet.traverse( function ( child ) {

			if ( child.isMesh ) {
				
				child.material = material; 

				child.castShadow = false;
				child.receiveShadow = false;

			}

		} );

		x.theSet.position.y = -3000; 
		
		scene.add( x.theSet ); 
		
		console.log(x.theSet);
	} );	
	

}

	//camera.position.set( 4000, 10000, 15000 );
	
	//camera.position.set( 1000, 24000, -10000 );	//about
	//camera.position.set( 4000, 15000, -17000 );	//portfolio
	//camera.position.set( 33000, 8000, 2000 );	//xctualyfe
	//camera.position.set( -2000, 14500, 16000 );	//contact
	
function flyTo( num ) {
	win.flying = true; 
	
	switch (num) {
		case 0: 
			let tween0 = new TWEEN.Tween( camera.position )
				.to({ x: 4000, y: 10000, z: 15000 }, 1000)
				.delay(0)	
				.onStart(function() {
					win.navbars.visible = false; 
				})				
				.onUpdate(function() {
					
				})
				.onComplete(function() {
					win.flying = false; 	
					win.navbars.visible = true; 
					
					video.pause(); 
					win.vidPlay = false; 
					x.bidyo.material.fog = true; 
					x.bidyo.material.needsUpdate = true; 
				})
				.start();	
			
			break; 
		case 1: 
			let tween1 = new TWEEN.Tween( camera.position )
				.to({ x: 1000, y: 24000, z: -10000 }, 1000)
				.delay(0)	
				.onStart(function() {
					win.navbars.visible = false; 
				})				
				.onUpdate(function() {
					
				})
				.onComplete(function() {
					win.flying = false; 	
					win.navbars.visible = true; 
					
					video.pause(); 
					win.vidPlay = false; 
					x.bidyo.material.fog = true; 
					x.bidyo.material.needsUpdate = true; 
				})
				.start();				
			
			break; 
		case 2: 
			let tween2 = new TWEEN.Tween( camera.position )
				.to({ x: 4000, y: 15000, z: -17000 }, 1000)
				.delay(0)	
				.onStart(function() {
					win.navbars.visible = false; 
				})				
				.onUpdate(function() {
					
				})
				.onComplete(function() {
					win.flying = false; 	
					win.navbars.visible = true; 
					
					video.pause(); 
					win.vidPlay = false; 
					x.bidyo.material.fog = true; 
					x.bidyo.material.needsUpdate = true; 
				})
				.start();				
			
			break; 
		case 3: 
			let tween3 = new TWEEN.Tween( camera.position )
				.to({ x: 32000, y: 7000, z: 0 }, 1000)
				.delay(0)	
				.onStart(function() {
					win.navbars.visible = false; 
				})				
				.onUpdate(function() {
					
				})
				.onComplete(function() {
					win.flying = false; 	
					win.navbars.visible = true; 
					
					x.bidyo.material.fog = false; 
					x.bidyo.material.needsUpdate = true; 
					
					if (win.vidPlay) {
						video.pause(); 
						win.vidPlay = false; 						
					} else {
						video.play(); 
						win.vidPlay = true; 
					}
				})
				.start();				
			
			break; 
		default: 
			
	}
	
	 
}
	
function clickTap() {
	if (ui.tempDiv) {
		ui.tempDiv.parentNode.removeChild(noAud);	
		ui.tempDiv = undefined; 
		
		win.navbars.visible = true; 
	}
	//container.removeEventListener( 'click', containerClick, false ); 
	
	if (win.navName == 'nav0') flyTo(0); 
	if (win.navName == 'nav1') flyTo(1); 
	if (win.navName == 'nav2') flyTo(2); 
	if (win.navName == 'nav3') flyTo(3); 	
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
	
	//mouseY -= 50; 	
	
	win.idleTimer = 0; 
}

function onMouseWheel( event ) {
    event.preventDefault();
    //event.stopPropagation();                

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
        var winWH = document.documentElement.getBoundingClientRect();
        var winWHx = document.documentElement.clientWidth, 
            winWHy = document.documentElement.clientHeight;
        if (winWH) {
            win.width = winWH.width;
            win.height = winWH.height;
        } else if (winWHx) {
            win.width = winWHx;
            win.height = winWHy;            
        } else {
            var tmpWW = win.width;
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
	
	for ( var i = 0; i < 4; i++ ) {	
		if (isMobil) { 
			if (win.width > win.height) {
				x.navbars[i].position.set(160, i*-100+140, -1100); 
			} else {
				x.navbars[i].position.set(120, i*-100+140, -1100); 
			}
		} else {
			x.navbars[i].position.set(250, i*-100+140, -1100); 	
		}
	}
	
	win.idleTimer = 0; 
}


function animate() { 
    requestAnimationFrame(animate);

	if (win.idleTimer < idleTO) {
	
		//const timer = Date.now() * 0.0001;
	
		
		win.idleTimer += 0.01; 
		
		render();
	} else {
 
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
	camera.lookAt(0, 10000, 0); 	
	
	//controls.update(); 
	
	for ( let j = 0; j < 4; j ++ ) {
		x.navbars[j].scale.set(1, 1, 1); 
	}
	
	if (document.documentElement.style.cursor != "default") {
		document.documentElement.style.cursor = "default"; 
		
		win.navName = ''; 
	}
	
	if (!win.flying) {
		win.raycaster.setFromCamera( win.pointer, camera );

		const intersects = win.raycaster.intersectObjects( win.navbars.children );
		
		for ( let i = 0; i < intersects.length; i ++ ) {
			//intersects[ i ].object.material.color.set( 0xff0000 );
			intersects[ i ].object.scale.set(1.06, 1.06, 1); 
			
			document.documentElement.style.cursor = "pointer";
			
			win.navName = intersects[ i ].object.name; 
			//console.log(intersects[ i ].object.name); 
		}	
	}

	renderer.render( scene, camera );	
}



	