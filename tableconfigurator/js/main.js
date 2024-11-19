/**
 * author Armstrong Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const idleTO = 120, florY = 0;  

let camera, scene, renderer, clock; 
let isMobil = false; 
const ui = {}, _ = {}, x = {}; 
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
	
	kontainer.style.backgroundSize = "cover"; 
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
	
	let loadr = document.createElement("div");
	loadr.setAttribute("id", "loadr");
	document.body.appendChild(loadr);
	
	let fader = document.createElement("div");
	fader.setAttribute("id", "fader");
	document.body.appendChild(fader);	
	
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
	
	ui.ashwood = $('ashwood'); 
	ui.cedar = $('cedar'); 
	ui.plasticBlack = $('plasticBlack'); 
	ui.plasticWhite = $('plasticWhite'); 
	ui.walnut = $('walnut'); 
	
	ui.tableWidthVal = $('tableWidthVal'); 
	ui.tableWidth = $('tableWidth'); 
	
	ui.tableDepthVal = $('tableDepthVal'); 
	ui.tableDepth = $('tableDepth'); 
	
	ui.legHeightVal = $('legHeightVal'); 
	ui.legHeight = $('legHeight'); 
	
	ui.variant1 = $('variant1'); 
	ui.variant2 = $('variant2'); 
	
	_.width = window.innerWidth; 
	_.height = window.innerHeight; 
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    document.body.style.height = ui.kontainer.style.height = _.height + 'px';    

    ui.kontainer.style.backgroundColor = '#fff';		

	const fogCol = 0xffffff; 

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
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
	scene.fog = new THREE.FogExp2(fogCol, 0.00023);	
	
	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .5, 20000 );
	camera.position.set(0, 250, 1200); 
    scene.add(camera);	

	scene.add( new THREE.AmbientLight( 0x888888 ) );	

	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 15000000, 4000, Math.PI/5, 1 );
	x.spotLight[0].position.set( 0, 1500, 1500 );
	x.spotLight[0].castShadow = true;
	x.spotLight[0].shadow.mapSize.width = 1536;
	x.spotLight[0].shadow.mapSize.height = 1536;
	x.spotLight[0].shadow.camera.near = 40;
	x.spotLight[0].shadow.camera.far = 4000;
	x.spotLight[0].shadow.camera.fov = 56;
	x.spotLight[0].shadow.intensity = .5;
	
	scene.add( x.spotLight[0] );	

	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	
	controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = 1.6;	
    controls.autoRotate = false;    
    controls.minDistance = 1;
    controls.maxDistance = 3000;    
    controls.rotateSpeed = .3;
    controls.zoomSpeed = 1; 
    controls.panSpeed = 4;
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	_.mouse = new THREE.Vector2(); 	
	_.idleTimer = 0; 
	_.fokus = true; 
	
	//_.raycaster = new THREE.Raycaster();
	_.pointer = new THREE.Vector2();

	_.ptrDown = false; 

	x.target0 = new THREE.Object3D(); 
	x.target0.position.set(0, 250, 0); 
	scene.add(x.target0);
	
	controls.target = x.target0.position; 	
	
	addSkybox();
	
	onWindowResize(); 
}

function addSkybox() {
	const f = '.png'; 
	const loader = new THREE.CubeTextureLoader();
	loader.setPath( 'images/skybox/2/' );

	loader.load( [
		'posx'+f, 'negx'+f,
		'posy'+f, 'negy'+f,
		'posz'+f, 'negz'+f
	], function ( tx ) {
		x.skybox = tx; 
		
		addFloor(); 	
		loadLegs(); 
	} );
	
}

function addFloor() {
	let width = 20000, 
		height = 20000,  
		rez = 1,  
		kolor = 0xffffff; 
		
	const geometry = new THREE.PlaneGeometry( width, height, rez, rez );
	const material = new THREE.MeshStandardMaterial( { color: kolor, roughness: 1, metalness: 0 } );
	
	x.floor = new THREE.Mesh( geometry, material ); 

	x.floor.position.set(0, florY, 0);
	x.floor.rotation.x = Math.PI/-2;
	x.floor.receiveShadow = true; 
	
	scene.add( x.floor ); 
		
	let	loader1 = new THREE.TextureLoader(), 
		loader2 = new THREE.TextureLoader(), 
		loader3 = new THREE.TextureLoader(), 
		url = 'images/floor/', 
		rep = 8; 

	loader1.load( url + 'color.jpg', function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(rep, rep);    
		
		x.floor.material.map = tx1; 
		x.floor.material.needsUpdate = true;
	});  		

	loader2.load( url + 'normal.jpg', function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(rep, rep);    
		
		x.floor.material.normalScale.set(1, 1); 
		x.floor.material.normalMap = tx2; 
		x.floor.material.needsUpdate = true;
	});  		

	loader3.load( url + 'rough.jpg', function(tx3) { 	
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		tx3.repeat.set(rep, rep);    
		
		x.floor.material.roughnessMap = tx3; 
		x.floor.material.needsUpdate = true;
	});	

}

function loadLegs() {
	x.legs = []; 
	x.screws = []; 
	let material = []; 
	
	_.legsScale = 500; 

	const loader = new OBJLoader();
	
	loader.load( 'objects/leg/leg.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child.isMesh ) child.geometry.computeBoundingBox();		
		});	
		
		material[0] = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: .85, metalness: .5 } );
		material[1] = new THREE.MeshStandardMaterial( { color: 0xc9c9c9, roughness: .5, metalness: 1 } );
		material[0].envMapIntensity = material[1].envMapIntensity = .5; 
		material[0].envMap = material[1].envMap = x.skybox; 
		
		let posX = 582,  
			posX2 = 582, 
			rotY2 = Math.PI/2; 
		
		for ( let h = 0; h < 2; h++ ) {	
			x.legs[h] = new THREE.Mesh( object.children[0].geometry, material[0] ); 
			
			x.legs[h].castShadow = x.legs[h].receiveShadow = true; 			
			
			if (h==1) posX *= -1; 
			
			x.legs[h].position.set(posX, florY, 0); 
			x.legs[h].rotation.y = Math.PI/2; 
			x.legs[h].scale.set(_.legsScale, _.legsScale, _.legsScale); 
		
			scene.add( x.legs[h] );		
		}		

		for ( let i = 0; i < 2; i++ ) {	
			x.screws[i] = new THREE.Mesh( object.children[1].geometry, material[1] ); 
			
			x.screws[i].receiveShadow = true; 			
			
			if (i==1) {
				posX2 *= -1; 
				rotY2 *= -1; 
			}
			
			x.screws[i].position.set(posX2, florY, 0); 
			x.screws[i].rotation.y = rotY2; 
			x.screws[i].scale.set(_.legsScale, _.legsScale, _.legsScale); 
		
			scene.add( x.screws[i] );		
		}		

		let load1 = new THREE.TextureLoader(),   
			load2 = new THREE.TextureLoader(),   
			load3 = new THREE.TextureLoader(),  
			load4 = new THREE.TextureLoader(), 
			url = 'objects/leg/'; 
		
		load1.load( url + 'color.jpg', function(tx1) { 
			for ( let j = 0; j < 2; j++ ) {
				x.legs[j].material.map = tx1; 
				x.legs[j].material.needsUpdate = true; 
			}
		}); 			

		load2.load( url + 'normal.jpg', function(tx2) { 
			for ( let k = 0; k < 2; k++ ) {
				x.legs[k].material.normalScale.set(1, -1); 
				x.legs[k].material.normalMap = tx2; 
				x.legs[k].material.needsUpdate = true; 
			}
			
			loadProp1(); 
		}); 			
	
		load3.load( url + 'rough.jpg', function(tx3) { 
			for ( let l = 0; l < 2; l++ ) {
				x.legs[l].material.roughnessMap = x.legs[l].material.metalnessMap = tx3; 
				x.legs[l].material.needsUpdate = true; 
			}
		}); 			

	}); 
	
}

function loadProp1() {
	x.prop1 = []; 
	
	const loader = new OBJLoader();
	
	loader.load( 'objects/prop1/prop01.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child.isMesh ) child.geometry.computeBoundingBox();		
		});	
		
		const material = new THREE.MeshPhongMaterial( { color: 0x999999 } );

		let posX = 582,  
			posX2 = 582, 
			posZ = 125; 
		
		for ( let h = 0; h < 4; h++ ) {	
			x.prop1[h] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.prop1[h].castShadow = x.prop1[h].receiveShadow = true; 			
			
			if ((h%2)!=0) posX *= -1; 
			if ((h%2)==0) posZ *= -1; 
			
			x.prop1[h].position.set(posX, florY, posZ); 
			x.prop1[h].scale.set(_.legsScale, _.legsScale, _.legsScale); 
		
			scene.add( x.prop1[h] );		
		}		

		loadProp2(); 
	}); 
	
}

function loadProp2() {
	x.prop2 = []; 

	const loader = new OBJLoader();
	
	loader.load( 'objects/prop2/prop02.obj', function ( object ) {
		object.traverse( function ( child ) {
			if ( child.isMesh ) child.geometry.computeBoundingBox();		
		});	
		
		const material = new THREE.MeshPhongMaterial( { color: 0x999999 } );

		let posX = 582,  
			posX2 = 582, 
			posZ = 125; 
		
		for ( let h = 0; h < 4; h++ ) {	
			x.prop2[h] = new THREE.Mesh( object.children[0].geometry, material ); 
			
			x.prop2[h].castShadow = x.prop2[h].receiveShadow = true; 			
			
			if ((h%2)!=0) posX *= -1; 
			if ((h%2)==0) posZ *= -1; 
			
			x.prop2[h].position.set(posX, florY, posZ); 
			x.prop2[h].scale.set(_.legsScale, _.legsScale, _.legsScale); 
		}		

		tableTop(); 
	}); 
	
}

function tableTop() {
	x.ttColor = [0xc7b299, 0xcd7f32, 0x1c1c1c, 0xf0f0f0, 0x773f1a]; 
	x.ttRoughness = [1, 1, .3, .3, 1]; 
	x.ttRoughMap = []; 
	x.ttNormalMap = []; 
	
	const geometry = new THREE.BoxGeometry( 1, 1, 30 ); 
	const material = new THREE.MeshStandardMaterial( { color: x.ttColor[0], roughness: x.ttRoughness[0], metalness: 0 } );  
	x.tableTop = new THREE.Mesh( geometry, material ); 
	x.tableTop.position.y = _.legsScale; 
	x.tableTop.rotation.x = Math.PI/2; 
	x.tableTop.scale.set(1200, 300, 1); 
	x.tableTop.castShadow = true; 
	scene.add( x.tableTop ); 
	
	let load1 = new THREE.TextureLoader(),   
		load2 = new THREE.TextureLoader(),  
		load3 = new THREE.TextureLoader(),  
		load4 = new THREE.TextureLoader(),  
		load5 = new THREE.TextureLoader(),  
		load6 = new THREE.TextureLoader(),  
		load7 = new THREE.TextureLoader(),  
		load8 = new THREE.TextureLoader(),  
		url = 'images/tabletop/'; 
	
	load1.load( url + 'ashwood/' + 'normal.jpg', function(tx1) { 
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		tx1.repeat.set(4, 1);  
		
		x.ttNormalMap[0] = tx1; 
		
		x.tableTop.material.normalScale.set(2, -2); 
		x.tableTop.material.normalMap = tx1; 
		x.tableTop.material.needsUpdate = true; 

	}); 			
	
	load2.load( url + 'ashwood/' + 'rough.jpg', function(tx2) { 
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		tx2.repeat.set(4, 1);  
		
		x.ttRoughMap[0] = tx2; 
		
		x.tableTop.material.roughnessMap = x.tableTop.material.metalnessMap = tx2; 
		x.tableTop.material.needsUpdate = true; 
		
		fadeScene(); 
	}); 	
		
	load3.load( url + 'cedar/' + 'normal.jpg', function(tx3) { 
		tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		tx3.repeat.set(4, 1);  
		
		x.ttNormalMap[1] = tx3; 
	}); 			
	
	load4.load( url + 'cedar/' + 'rough.jpg', function(tx4) { 
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		tx4.repeat.set(4, 1);  
		
		x.ttRoughMap[1] = tx4; 
	}); 	
	
	load5.load( url + 'plasticblack/' + 'normal.jpg', function(tx5) { 
		tx5.wrapS = tx5.wrapT = THREE.RepeatWrapping;    
		tx5.repeat.set(4, 1);  
		
		x.ttNormalMap[2] = tx5; 
	}); 			
	
	load6.load( url + 'plasticwhite/' + 'normal.jpg', function(tx6) { 
		tx6.wrapS = tx6.wrapT = THREE.RepeatWrapping;    
		tx6.repeat.set(4, 1);  
		
		x.ttNormalMap[3] = tx6; 
	}); 			
	
	load7.load( url + 'walnut/' + 'normal.jpg', function(tx7) { 
		tx7.wrapS = tx7.wrapT = THREE.RepeatWrapping;    
		tx7.repeat.set(4, 1);  
		
		x.ttNormalMap[4] = tx7; 
	}); 			
	
	load8.load( url + 'walnut/' + 'rough.jpg', function(tx8) { 
		tx8.wrapS = tx8.wrapT = THREE.RepeatWrapping;    
		tx8.repeat.set(4, 1);  
		
		x.ttRoughMap[4] = tx8; 
	}); 	
		
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
			
			animate();  
			
			thePanel(); 
			
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
        }
    })();	
}	

function thePanel() {
	let acc = document.getElementsByClassName("accordion");
	
	for (let i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			this.classList.toggle("active");
		
			let panel = this.nextElementSibling;
			
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
			} 
		});
	} 	
	
	eL(ui.ashwood, 0, 'click', onAshwoodClick); 
	eL(ui.cedar, 0, 'click', onCedarClick); 
	eL(ui.plasticBlack, 0, 'click', onPlasticBlackClick); 
	eL(ui.plasticWhite, 0, 'click', onPlasticWhiteClick); 
	eL(ui.walnut, 0, 'click', onWalnutClick); 
	
	eL(ui.tableWidth, 0, 'input', ontableWidthSlide); 
	eL(ui.tableDepth, 0, 'input', ontableDepthSlide); 
	eL(ui.legHeight, 0, 'input', onlegHeightSlide); 
	
	eL(ui.variant1, 0, 'click', onVariant1Click); 
	eL(ui.variant2, 0, 'click', onVariant2Click); 
}

function tableTopMaterial(color, idx) {
	x.tableTop.material.color.set(color); 
	x.tableTop.material.roughness = x.ttRoughness[idx]; 
	
	x.tableTop.material.normalMap = x.ttNormalMap[idx]; 	
	x.tableTop.material.roughnessMap = x.tableTop.material.metalnessMap = x.ttRoughMap[idx]; 
	
	x.tableTop.material.needsUpdate = true; 	
}

function onAshwoodClick( event ) {
	if (event) event.preventDefault();
	
	tableTopMaterial(x.ttColor[0], 0); 
}

function onCedarClick( event ) {
	if (event) event.preventDefault();
	
	tableTopMaterial(x.ttColor[1], 1); 
}

function onPlasticBlackClick( event ) {
	if (event) event.preventDefault();
	
	tableTopMaterial(x.ttColor[2], 2); 
}

function onPlasticWhiteClick( event ) {
	if (event) event.preventDefault();
	
	tableTopMaterial(x.ttColor[3], 3); 
}

function onWalnutClick( event ) {
	if (event) event.preventDefault();
	
	tableTopMaterial(x.ttColor[4], 4); 
}

function ontableWidthSlide( event ) {
	if (event) event.preventDefault(); 
	
	let slideVal = Math.round(this.value); 
	
	ui.tableWidthVal.innerHTML = slideVal;
	
	x.tableTop.scale.x = slideVal; 
}	

function ontableDepthSlide( event ) {
	if (event) event.preventDefault(); 
	
	let slideVal = Math.round(this.value); 
	
	ui.tableDepthVal.innerHTML = slideVal;
	
	x.tableTop.scale.y = slideVal; 
}	

function onlegHeightSlide( event ) {
	if (event) event.preventDefault(); 
	
	let slideVal = Math.round(this.value); 
	
	ui.legHeightVal.innerHTML = slideVal;
	
	for ( let i = 0; i < 2; i++ ) {	
		x.legs[i].scale.y = slideVal; 
		x.legs[i].position.y = (slideVal - 500) * -.02; 
		
		x.screws[i].position.y = (slideVal - 500) * .93; 
	}
	
	_.legsScale = slideVal; 
	x.tableTop.position.y = (slideVal - 500) * .95 + 500;   
}	

function onVariant1Click( event ) {
	if (event) event.preventDefault(); 
	
	cL(ui.variant1, 0, "selected");
	cL(ui.variant2, 1, "selected");
	
	for ( let i = 0; i < 4; i++ ) {	
		scene.remove(x.prop2[i]); 
		scene.add(x.prop1[i]); 
	}
}

function onVariant2Click( event ) {
	if (event) event.preventDefault(); 
	
	cL(ui.variant1, 1, "selected");
	cL(ui.variant2, 0, "selected");	
	
	for ( let i = 0; i < 4; i++ ) {	
		scene.remove(x.prop1[i]); 
		scene.add(x.prop2[i]); 
	}	
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
    //event.stopPropagation(); 

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

	_.idleTimer = 0; 
}

function animate() { 
    requestAnimationFrame(animate);

	if (_.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.00005; 

		_.idleTimer += 0.01; 
		
		render();
	} else {
		if (clock.running) clock.stop(); 
	}
	
	if (document.hasFocus()) {
		if (!_.fokus) {
			_.idleTimer = 0; 
			_.fokus = true; 
		}
	} else {
		_.idleTimer = idleTO; 	
		_.fokus = false; 
	}	

}

function render() {
	camera.lookAt(x.target0.position);
	
	controls.update(); 
	
	renderer.render( scene, camera );	
}


	
	