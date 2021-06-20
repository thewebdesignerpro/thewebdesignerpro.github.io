/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, mun, arw, neb, x = y = z = pis = 0, pif = 1, shtex, ntro = true, bebe, anima0, anima1, anima2, anima3;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
document.getElementById( 'optn' ).style.opacity = 0;

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var container = document.getElementById('container');
container.style.background = '#a4b0b6';

var skin = THREE.ImageUtils.loadTexture('imj/skin/babe0.jpg', undefined, bB);

var camera = new THREE.PerspectiveCamera( 35, ww / wh,  0.1, 3000 );
camera.position.set(-6, 3.5, -5);
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xa4b0b6, 0.1 );
camera.lookAt( scene.position );

var alight = new THREE.AmbientLight( 0x777777 );
scene.add( alight );
var spotL = new THREE.SpotLight( 0xffffff, 10, 150, Math.PI/9 );
spotL.position.set( -10, 100, -20 );
spotL.castShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.5;
spotL.shadowCameraNear = 10;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 20;
scene.add( spotL );
spotL.lookAt( scene.position );

var geomf = new THREE.PlaneBufferGeometry( 3000, 3000 );
var materf = new THREE.MeshLambertMaterial( { emissive: 0x344046, wireframe: false } );
var ground = new THREE.Mesh( geomf, materf );
ground.position.set( 0, 0, 0 );
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = true;
scene.add( ground );

var clock = new THREE.Clock();
function bB() {				
	var loader = new THREE.JSONLoader();
	var man;
	loader.load('obj/babe0.json', function (geometry, materials) {
		mater = new THREE.MeshLambertMaterial({map: skin, overdraw: 0.5, side: THREE.FrontSide, skinning: true});
		bebe = new THREE.SkinnedMesh(geometry, mater);	  
		var scale = 4;
		bebe.position.set(0, -0.025, 0);
		bebe.scale.set(scale, scale, scale);
		bebe.castShadow = true;
		bebe.receiveShadow = true;
		scene.add(bebe);
		anima0 = new THREE.Animation( bebe, geometry.animations[0] );
		anima1 = new THREE.Animation( bebe, geometry.animations[1] );
		anima2 = new THREE.Animation( bebe, geometry.animations[2] );
		anima3 = new THREE.Animation( bebe, geometry.animations[3] );
		anima0.timeScale = 1;	  
		anima1.timeScale = 1;	  
		anima2.timeScale = 0.6;	  
		anima3.timeScale = 1;	  
		anima1.play();	
	});
}	

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
container.appendChild( renderer.domElement );			

function animate() {
	requestAnimationFrame( animate );
	if (ntro) {
		if (pif>0) {
			pif -= 0.0025;
			pis += 0.0025;
			document.getElementById( 'pinfo' ).style.opacity = pif;
			document.getElementById( 'optn' ).style.opacity = pis;			
		} else {
			document.getElementById( 'pinfo' ).style.opacity = 0;
			document.getElementById( 'optn' ).style.opacity = 1;
			ntro = false;
		}
	} else {	
		camera.position.x = mouseX*0.025;
		camera.position.y = -mouseY*0.025;		
	}
	render();
}

function render() {
	var delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}

optn1.addEventListener('click', function(e) {
	if (anima0.isPlaying==false) {
		anima1.stop();
		anima2.stop();
		anima3.stop();
		anima0.play();	
		optn2.classList.remove("sel");
		optn3.classList.remove("sel");
		optn4.classList.remove("sel");
		optn1.classList.add("sel");	
	}	
	e.preventDefault();	
});
optn2.addEventListener('click', function(e) {
	if (anima1.isPlaying==false) {
		anima0.stop();
		anima2.stop();
		anima3.stop();
		anima1.play();	
		optn1.classList.remove("sel");
		optn3.classList.remove("sel");
		optn4.classList.remove("sel");
		optn2.classList.add("sel");		
	}
	e.preventDefault();
});
optn3.addEventListener('click', function(e) {
	if (anima2.isPlaying==false) {
		anima0.stop();
		anima1.stop();
		anima3.stop();
		anima2.play();	
		optn1.classList.remove("sel");
		optn2.classList.remove("sel");
		optn4.classList.remove("sel");
		optn3.classList.add("sel");		
	}
	e.preventDefault();	
});
optn4.addEventListener('click', function(e) {
	if (anima3.isPlaying==false) {
		anima0.stop();
		anima1.stop();
		anima2.stop();
		anima3.play();	
		optn1.classList.remove("sel");
		optn2.classList.remove("sel");
		optn3.classList.remove("sel");
		optn4.classList.add("sel");		
	}
	e.preventDefault();	
});
optn5.addEventListener('click', function(e) {
	anima0.timeScale = 0.5;	  
	anima1.timeScale = 0.5;	  
	anima2.timeScale = 0.3;	  
	anima3.timeScale = 0.5;	  	
	optn6.classList.remove("sel");
	optn7.classList.remove("sel");
	optn5.classList.add("sel");
	e.preventDefault();
});
optn6.addEventListener('click', function(e) {
	anima0.timeScale = 1;	  
	anima1.timeScale = 1;	  
	anima2.timeScale = 0.6;	  
	anima3.timeScale = 1;	  	
	optn5.classList.remove("sel");
	optn7.classList.remove("sel");
	optn6.classList.add("sel");
	e.preventDefault();
});
optn7.addEventListener('click', function(e) {
	anima0.timeScale = 2;	  
	anima1.timeScale = 2;	  
	anima2.timeScale = 1.2;	  
	anima3.timeScale = 2;	  	
	optn5.classList.remove("sel");
	optn6.classList.remove("sel");
	optn7.classList.add("sel");
	e.preventDefault();
});
optn8.addEventListener('click', function(e) {
	mater.wireframe = !(mater.wireframe);
	optn8.classList.toggle("sel");
	e.preventDefault();
});

