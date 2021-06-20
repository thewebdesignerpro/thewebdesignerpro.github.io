/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, arw, neb, x = y = z = 0;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - wwh );
	mouseY = ( event.clientY - whh );	
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
var camera = new THREE.PerspectiveCamera( 50, ww / wh,  0.01, 3000 );
camera.position.set( 0, 80, 800 );
var scene = new THREE.Scene();
scene.fog	= new THREE.FogExp2( 0x1f252a, 0.00028 );
camera.lookAt( scene.position );

var hLight = new THREE.HemisphereLight( 0xf9fdff, 0x101520, 0.4 );
hLight.position.set( -0.5, -1.25, 0.75 );
scene.add( hLight );

var geometry = new THREE.Geometry();
for ( var i = 0; i < 3000; i ++ ) {
    var vertex = new THREE.Vector3();
    do {
        vertex.x = 2600 * Math.random() - 1300;
        vertex.y = 2600 * Math.random() - 1300;
        vertex.z = 2600 * Math.random() - 1300;
    } while ( vertex.length() < 1000 );
    geometry.vertices.push( vertex );
}
geometry.computeBoundingSphere();
mater = new THREE.PointCloudMaterial( { size: 1.5 } );
var stars = new THREE.PointCloud( geometry, mater );
scene.add( stars );

var city = new THREEx.ProceduralCity();
scene.add(city);

var loada = new THREE.TextureLoader();
loada.load(
	'imj/mun2.jpg',
	function ( tex ) {
		geom = new THREE.IcosahedronGeometry( 50, 4 );
		mater = new THREE.MeshPhongMaterial( { map: tex, specular: 0x555555, shininess: 8, emissive: 0x303336, wrapAround: true, overdraw: 0.5 } );
		mater.wrapRGB.set( 0.5, 0.5, 0.5 );
		moon = new THREE.Mesh( geom, mater );
		moon.position.set(-10, 250, -900);
		moon.receiveShadow = true;				
		moon.rotation.y += Math.PI;
		scene.add( moon );
	}, function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/arw2.png',
	function ( tex2 ) {
		geom = new THREE.PlaneGeometry( 480, 480 );
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xfbfdff, emissive: 0xfbfdff, opacity: 0.25, transparent: true } );
		arw = new THREE.Mesh( geom, mater );
		arw.position.set( -10, 250, -930 );
		arw.castShadow = false;
		arw.receiveShadow = false;
		scene.add( arw );			
	}, function ( xhr ) {}, function ( xhr ) {}
);

geom = new THREE.BoxGeometry( 1600, 1.5, 1600 );
mater = new THREE.MeshBasicMaterial( { color: 0x090909 } );
var floor = new THREE.Mesh( geom, mater );
floor.position.set( 0, -1, 0 );
floor.castShadow = false;
floor.receiveShadow = false;
scene.add( floor );

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMapEnabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame( animate );
	arw.lookAt( camera.position );	
	camera.position.x = mouseX * 0.6;
	camera.position.y = mouseY * 0.3 + 150;
	render();
}

function render() {
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
