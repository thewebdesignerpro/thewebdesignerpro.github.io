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

var light = new THREE.PointLight( 0xffffff, 3.5, 500 );
light.position.set( 0, 6, -26 );
scene.add( light );

var spotL = new THREE.SpotLight( 0xffffff, 1, 1000 );
spotL.position.set( 0, 6, -26 );
spotL.castShadow = true;
spotL.onlyShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.5;
spotL.shadowCameraNear = 50;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 90;
scene.add( spotL );

var geometry = new THREE.Geometry();
for ( var i = 0; i < 400; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = 800 * Math.random() - 400;
    vertex.y = 300 * Math.random() - 100;
    vertex.z = 400 * Math.random() - 800;
    geometry.vertices.push( vertex );
}
geometry.computeBoundingSphere();
mater = new THREE.PointCloudMaterial();
var stars = new THREE.PointCloud( geometry, mater );
scene.add( stars );

geom = new THREE.PlaneGeometry( 84, 50, 32, 16 );

var loada = new THREE.TextureLoader();
loada.load(
	'imj/wvesb.jpg',
	function ( tex ) {
		mater = new THREE.MeshPhongMaterial( { map: tex, color: 0x333333, specular: 0x040812, shininess: 5, side: THREE.FrontSide, wrapAround: true, overdraw: 0.5 } );
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
	'imj/mun.jpg',
	function ( tex2 ) {
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xffffff, side: THREE.FrontSide, wrapAround: true, overdraw: 0.5 } );
		mater.wrapRGB.set( 0.23, 0.23, 0.23 );
		var mun = new THREE.Mesh( new THREE.SphereGeometry( 10, 24, 24 ), mater );
		mun.position.set(0, 6, -43.9);
		mun.castShadow = false;
		mun.receiveShadow = true;
		scene.add( mun );	
	}, function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/arw2.png',
	function ( tex2 ) {
		var geom2 = new THREE.PlaneGeometry( 40, 40 );
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xf4f4f4, side: THREE.FrontSide, opacity: 0.25, transparent: true } );
		var arw = new THREE.Mesh( geom2, mater );
		arw.position.set(0, 6, -44);
		arw.castShadow = false;
		arw.receiveShadow = false;
		scene.add( arw );				
		geom2 = new THREE.PlaneGeometry( 80, 80 );
		mater = new THREE.MeshLambertMaterial( { map: tex2, color: 0xf8f8f8, side: THREE.FrontSide, opacity: 0.25, transparent: true } );
		var arw2 = new THREE.Mesh( geom2, mater );
		arw2.position.set(0, 6, -44.5);
		arw2.castShadow = false;
		arw2.receiveShadow = false;
		scene.add( arw2 );		
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
