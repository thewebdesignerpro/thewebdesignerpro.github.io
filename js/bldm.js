/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, arw, x = y = z = pis = 0, pif = 1, ntro = true;	
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container = document.getElementById('container');
container.style.opacity = 0;
var canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, "#0b0b0b");
gradient.addColorStop(0.5, "#221a1c");
gradient.addColorStop(1, "#221a1c");
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);
container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
container.style.backgroundSize = '32px 100%';

var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/sand1.jpg" );
var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade1b.jpg", undefined, mF );
var glw = THREE.ImageUtils.loadTexture('imj/arw2.png');
var bwn = THREE.ImageUtils.loadTexture('imj/munr.jpg', undefined, bwan);
var pyr = THREE.ImageUtils.loadTexture('imj/shade/brick1.jpg', undefined, pyRa);
diffMap.wrapS = diffMap.wrapT = pyr.wrapS = pyr.wrapT = THREE.RepeatWrapping;
diffMap.repeat.set( 16, 16);
pyr.repeat.set( 24, 24 );

var camera = new THREE.PerspectiveCamera( 35, ww/wh,  0.1, 3000 );
camera.position.set( 0, 2, 32 );
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x21191b, 0.03 );
camera.lookAt( scene.position );

var alight = new THREE.AmbientLight( 0x777777 );
scene.add( alight );
var light = new THREE.PointLight( 0xffaa55, 6, 35 );
light.position.set( 0, 5.5, -25 );
scene.add( light );
var spotL = new THREE.SpotLight( 0xffaa66, 5, 60, Math.PI/3 );
spotL.position.set( 0, 5.5, -25 );
spotL.onlyShadow = true;
spotL.castShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.5;
spotL.shadowCameraNear = 5;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 120;
scene.add( spotL );

function mF() {
	mater = new THREE.MeshPhongMaterial({ map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -3.7, displacementBias: 0 });
	geom = new THREE.PlaneGeometry( 64, 64, 64, 64 );
	var mesh = new THREE.Mesh(geom, mater);
	mesh.position.set(0, 0, -7);
	mesh.rotation.x -= Math.PI/2;
	mesh.rotation.z -= Math.PI/4;
	mesh.material.side = THREE.FrontSide;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
}

function bwan() {
	var mater = new THREE.MeshLambertMaterial({ map: bwn, color: 0x902010, emissive: 0x201010, side: THREE.FrontSide, overdraw: 0.5, fog: false });
	var mun = new THREE.Mesh( new THREE.SphereGeometry( 5, 24, 24 ), mater );
	mun.position.set(0, 5.5, -40);
	mun.rotation.y -= 1.2;
	scene.add( mun );	
	mater = new THREE.MeshLambertMaterial({ map: glw, color: 0xff3311, emissive: 0xff5533, side: THREE.FrontSide, opacity: 0.65, transparent: true, fog: false });
	arw = new THREE.Mesh( new THREE.PlaneGeometry( 25, 25 ), mater );
	arw.position.set(0, 5.5, -40);
	arw.castShadow = false;
	arw.receiveShadow = false;
	scene.add( arw );		
}

function pyRa() {
	var mater = new THREE.MeshLambertMaterial({ color: 0x777370, map: pyr, side: THREE.FrontSide, overdraw: 0.5, fog: true });
	var pyram = new THREE.Mesh( new THREE.CylinderGeometry( 0.06, 5, 3.0902, 4 ), mater );
	pyram.position.set(0, -1, -9);
	pyram.castShadow = true;
	pyram.receiveShadow = true;	
	scene.add( pyram );	
	var pyram2 = pyram.clone();
	pyram2.position.set(-14, -0.75, -9);
	scene.add( pyram2 );		
	var pyram3 = pyram.clone();
	pyram3.position.set(14, -1, -9);
	scene.add( pyram3 );	
}

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild( renderer.domElement );			

function animate() {
	requestAnimationFrame( animate );
	if (ntro) {
		if (pif>0) {
			pif -= 0.01;
			pis += 0.01;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
			container.style.opacity = pis;
		} else {
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			container.style.opacity = 1;
			ntro = false;
		}
	} else {
		camera.position.x = mouseX*0.03;
		camera.position.y = -mouseY*0.01+(wh*0.004);
	}	
	render();
}

function render() {
	camera.lookAt(scene.position);
	arw.lookAt(camera.position);
	renderer.render(scene, camera);	
}

