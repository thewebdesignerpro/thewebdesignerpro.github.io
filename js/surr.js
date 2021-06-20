/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, tun, bol, x = y = z = 0;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
	
var camera = new THREE.PerspectiveCamera( 40, ww / wh,  0.1, 3000 );
camera.position.set( 0, 0, 50 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var light = new THREE.PointLight( 0xffffff, 6, 80 );
light.position.set( 10, 0, -20 );
scene.add( light );

var spotL = new THREE.SpotLight( 0xffffff, 1, 500 );
spotL.position.set( 10, 0, -20 );
spotL.castShadow = true;
spotL.onlyShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.3;
spotL.shadowCameraNear = 50;
spotL.shadowCameraFar = 300;
spotL.shadowCameraFov = 40;
scene.add( spotL );

var group = new THREE.Group();

var loada = new THREE.TextureLoader();
loada.load(
	'imj/rainb1.jpg',
	function ( tex ) {
		geom = new THREE.TorusGeometry( 72, 24, 64, 64 );
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set( 1, 1 );
		mater = new THREE.MeshLambertMaterial( { map: tex, color: 0x404040, side: THREE.BackSide } );
		tun = new THREE.Mesh( geom, mater );
		tun.position.set(62, 0, 0);
		tun.castShadow = true;
		tun.receiveShadow = true;
		tun.rotation.x = Math.PI/2;
		group.add( tun );
		
		geom = new THREE.TorusGeometry( 5, 3, 32, 32 );
		mater = new THREE.MeshLambertMaterial( { map: tex, wrapAround: true, overdraw: 0.5 } );
		mater.wrapRGB.set( 0.5, 0.5, 0.5 );
		bol = new THREE.Mesh( geom, mater );
		bol.position.set(0, 0, -10);
		bol.castShadow = true;
		bol.receiveShadow = true;
		scene.add( bol );		
	}, function ( xhr ) {}, function ( xhr ) {}
);

geom = new THREE.TorusGeometry( 72, 24, 12, 12 );
mater = new THREE.MeshLambertMaterial( { color: 0x000000, shading: THREE.FlatShading, side: THREE.BackSide, opacity: 0, transparent: true } );
var tun2 = new THREE.Mesh( geom, mater );
tun2.position.set(-62, 0, 0);
tun2.castShadow = false;
tun2.receiveShadow = false;
tun2.rotation.x = Math.PI/2;
group.add( tun2 );

scene.add(group);

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.setClearColor(0x000000, 0);
renderer.shadowMapEnabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	x += 0.01; 	y -= 0.005; 	z -= 0.005; 
	bol.rotation.set(x,y,z);
	tun.rotation.z += 0.006;
	group.rotation.z -= 0.004;
	
	camera.lookAt( scene.position );
	renderer.render(scene, camera);	
}

function playA() {
	document.getElementById('aud').play();
}

if (window.addEventListener) {
	window.addEventListener("load", playA, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", playA);
} else {
	window.onload = playA;
}
