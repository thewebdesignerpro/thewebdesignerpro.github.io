/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
	
var camera = new THREE.PerspectiveCamera( 40, ww / wh,  0.1, 3000 );
camera.position.set( 0, 4, 29 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var light = new THREE.PointLight( 0xfaef55, 8.4, 500 );
light.position.set( 0, 9, -38 );
scene.add( light );

var spotL = new THREE.SpotLight( 0xffffff, 1, 1000 );
spotL.position.set( 0, 9, -38 );
spotL.castShadow = true;
spotL.onlyShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.5;
spotL.shadowCameraNear = 50;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 90;
scene.add( spotL );

geom = new THREE.PlaneGeometry( 84, 50, 32, 16 );

var loada = new THREE.TextureLoader();
loada.load(
	'imj/wves.jpg',
	function ( tex ) {
		mater = new THREE.MeshPhongMaterial( { map: tex, color: 0xee2205, specular: 0x010101, shininess: 4, side: THREE.FrontSide, wrapAround: true, overdraw: 0.5 } );
		mater.wrapRGB.set( 0.5, 0.5, 0.5 );
		var plane = new THREE.Mesh( geom, mater );
		plane.position.set(0, 0, 0);
		plane.rotation.x = -90 * Math.PI/180;
		plane.castShadow = true;
		plane.receiveShadow = true;
		scene.add( plane );		
	}, function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/sset.jpg',
	function ( tex2 ) {
		mater = new THREE.MeshBasicMaterial( { map: tex2, side: THREE.FrontSide } );
		var sun = new THREE.Mesh( new THREE.CircleGeometry( 6, 32 ), mater );
		sun.position.set(0, 2, -43.9);
		sun.castShadow = false;
		sun.receiveShadow = false;
		scene.add( sun );	
	}, function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/arw2.png',
	function ( tex2 ) {
		var geom2 = new THREE.PlaneGeometry( 40, 40 );
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xf8ee10, side: THREE.FrontSide, opacity: 0.99, transparent: true } );
		var arw = new THREE.Mesh( geom2, mater );
		arw.position.set(0, 2, -44);
		arw.castShadow = false;
		arw.receiveShadow = false;
		scene.add( arw );				
		geom2 = new THREE.PlaneGeometry( 80, 80 );
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xf05500, side: THREE.FrontSide, opacity: 0.99, transparent: true } );
		var arw2 = new THREE.Mesh( geom2, mater );
		arw2.position.set(0, 2, -44.5);
		arw2.castShadow = false;
		arw2.receiveShadow = false;
		scene.add( arw2 );		
		geom2 = new THREE.PlaneGeometry( 100, 100 );
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xf04400, side: THREE.FrontSide, opacity: 0.99, transparent: true } );
		var arw3 = new THREE.Mesh( geom2, mater );
		arw3.position.set(0, 2, -45);
		arw3.castShadow = false;
		arw3.receiveShadow = false;
		scene.add( arw3 );				
	}, function ( xhr ) {}, function ( xhr ) {}
);

var gvl	= geom.vertices.length;
var origV = new Array(gvl)
for (var i = 0; i < gvl; i++) {
	origV[i] = geom.vertices[i].clone();
}
geom._origV	= origV;

function wavY() {
	var timer = 0.005 * Date.now();
	for(var i = 0; i < geom.vertices.length; i++) {
		var orig = geom._origV[i];
		var posi = geom.vertices[i];	
		var angle = timer+posi.y*4;
		var angle2 = timer+posi.z*5;
		var angle3	= timer+posi.x*3;		
		posi.z = orig.z+Math.sin(timer+i)* 0.1;
		posi.x = orig.x+Math.sin(timer)* 0.05;
		posi.y = orig.y+Math.cos(timer)* 0.05;
	}
	geom.verticesNeedUpdate = true;	
}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMapEnabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame( animate );
	wavY();
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
