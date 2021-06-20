/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	ready1 = 0, ready2 = 0, controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0';	
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
	
var camera = new THREE.PerspectiveCamera( 40, ww / wh,  0.1, 3000 );
camera.position.set( -40, 20, 40 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var geometry = new THREE.Geometry();
for ( var i = 0; i < 5000; i ++ ) {
    var vertex = new THREE.Vector3();
    do {
        vertex.x = 1200 * Math.random() - 600;
        vertex.y = 1200 * Math.random() - 600;
        vertex.z = 1200 * Math.random() - 600;
    } while ( vertex.length() > 600 || vertex.length() < 80 );
    geometry.vertices.push( vertex );
}
geometry.computeBoundingSphere();
var material = new THREE.PointsMaterial( { size: 1.0 } );
var particle = new THREE.Points( geometry, material );
scene.add( particle );

var earth, earthc, moon, neb, sun;			 

var loada = new THREE.TextureLoader();
loada.load(
	'imj/earthc.png',
	function ( tex ) {
		var geometry = new THREE.IcosahedronGeometry( 12.05, 4 );
		//var material = new THREE.MeshPhongMaterial( {map: tex, specular: 0x111111, shininess: 1, wrapAround: true, overdraw: 0.5, opacity: 0.8, transparent: true } );
		var material = new THREE.MeshPhongMaterial( {map: tex, specular: 0x111111, shininess: 1, overdraw: 0.5, opacity: 0.8, transparent: true } );
		//material.wrapRGB.set( 0.05, 0.05, 0.05 );
		earthc = new THREE.Mesh( geometry, material );
		earthc.castShadow = false;
		earthc.receiveShadow = true;
		earthc.position.set(0, 0, 23);
		scene.add( earthc );
	}, function ( xhr ) {}, function ( xhr ) {}
);

var smap = THREE.ImageUtils.loadTexture( "imj/earths.jpg" );
loada.load(
	'imj/earth.jpg',
	function ( tex ) {
		var geometry = new THREE.IcosahedronGeometry( 12, 4 );
		//var material = new THREE.MeshPhongMaterial( {map: tex, specular: 0x373737, specularMap: smap, shininess: 12, wrapAround: true, overdraw: 0.5 } );		
		var material = new THREE.MeshPhongMaterial( {map: tex, specular: 0x373737, specularMap: smap, shininess: 12, overdraw: 0.5 } );		
		//material.wrapRGB.set( 0.05, 0.05, 0.05 );
		earth = new THREE.Mesh( geometry, material );
		earth.castShadow = true;
		earth.receiveShadow = true;
		earth.position.set(0, 0, 23);
		scene.add( earth );		
		ready1 = 1;
	},	function ( xhr ) {}, function ( xhr ) {}
);

var geometry = new THREE.IcosahedronGeometry( 11.68, 4 );
var material = new THREE.MeshBasicMaterial( { color	: 0x000000, opacity: 0, transparent: true } );
var eglow = new THREE.Mesh( geometry, material );
eglow.position.set(0, 0, 22.7);
scene.add( eglow );	
var glowM1 = new THREEx.GeometricGlowMesh(eglow, 0.5, 0.21, 2.3);
eglow.add(glowM1.object3d);
var ouni = glowM1.outsideMesh.material.uniforms;
ouni.glowColor.value.set('#bbeeff');

loada.load(
	'imj/mun.jpg',
	function ( tex ) {
		var geometry = new THREE.SphereGeometry( 3.24, 32, 32 );
		//var material = new THREE.MeshLambertMaterial( {map: tex, color: 0xe5e5e5, wrapAround: true, overdraw: 0.5 } );
		var material = new THREE.MeshLambertMaterial( {map: tex, color: 0xe5e5e5, overdraw: 0.5 } );
		//material.wrapRGB.set( 0.05, 0.05, 0.05 );
		moon = new THREE.Mesh( geometry, material );
		moon.castShadow = true;
		moon.receiveShadow = true;
		moon.position.set(0, 0, 4.8);
		scene.add( moon );
	},	function ( xhr ) {}, function ( xhr ) {}
);

loada.load(
	'imj/nebu.jpg',
	function ( tex ) {
		var geometry = new THREE.SphereGeometry( 600, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {map: tex, overdraw: 0.5, side: THREE.BackSide } );
		neb = new THREE.Mesh( geometry, material );
		neb.receiveShadow = false;
		neb.position.set(0, 0, 0);
		scene.add( neb );
	},	function ( xhr ) {}, function ( xhr ) {}
);

var light = new THREE.PointLight( 0xffffff, 0.8, 2600 );
light.position.set( 0, 0, 0 );
scene.add( light );

var spotL = new THREE.SpotLight( 0xffffff, 3.7, 200 );
spotL.position.set( 0, 1, -20 );
spotL.castShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.85;
spotL.shadowCameraNear = 27.1;
spotL.shadowCameraFar = 600;
spotL.shadowCameraFov = 40;
scene.add( spotL );

/*loada.load(
	'imj/arw.png',
	function ( tex ) {
		var geometry = new THREE.CircleGeometry( 8, 32, 32 );
		//var material = new THREE.MeshBasicMaterial( {map: tex, specular: 0x111111, shininess: 1, overdraw: 0.5, opacity: 0.99, transparent: true } );
		var material = new THREE.MeshBasicMaterial( {map: tex, overdraw: 0.5, opacity: 0.99, transparent: true } );
		sun = new THREE.Mesh( geometry, material );
		sun.position.set( 0, 1, -20 );
		scene.add( sun );
	},	function ( xhr ) {},	function ( xhr ) {}
);*/

function flareS1() {
/*	var dLight = new THREE.DirectionalLight(0xffffff, 1);
	dLight.position.set(0, 1500, -20000).normalize();
	dLight.castShadow = true;
	scene.add(dLight);
	dLight.color.setHSL(0.1, 0.7, 0.5);*/
	var txFlare0 = THREE.ImageUtils.loadTexture("imj/arw.png");
	var txFlare2 = THREE.ImageUtils.loadTexture("imj/spacer.png");
	var txFlare3 = THREE.ImageUtils.loadTexture("imj/shade/lensf.png");
	adLight(0.08, 0.8, 0.5, 0, 1, -20);
	function adLight(h, s, l, x, y, z) {
		var light = new THREE.PointLight( 0xffffff, 1, 0 );
		light.color.setHSL(h, s, l);
		light.position.set(x, y, z);
		//scene.add( light );
		var flareCol = new THREE.Color(0xffffff);
		flareCol.setHSL(h, s, l + 0.5);
		var lensFlare = new THREE.LensFlare(txFlare0, 350, 0.0, THREE.AdditiveBlending, flareCol);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 50, 0.3, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 60, 0.36, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 90, 0.42, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 70, 0.48, THREE.AdditiveBlending);	
		lensFlare.add(txFlare3, 100, 0.54, THREE.AdditiveBlending);	
		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position.copy(light.position);
		scene.add(lensFlare);
	}
	function lensFlareUpdateCallback(object) {
		var f, fl = object.lensFlares.length, flare, vecX = -object.positionScreen.x*2, vecY = -object.positionScreen.y*2;
		for(f = 0; f < fl; f++) {
			flare = object.lensFlares[f];
			flare.x = object.positionScreen.x+vecX*flare.distance;
			flare.y = object.positionScreen.y+vecY*flare.distance;
			flare.rotation = 0;
		}
		object.lensFlares[2].y += 0.025;
		object.lensFlares[3].rotation = object.positionScreen.x*0.5+THREE.Math.degToRad(45);
	}
}
flareS1();

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);
				
function animate() {
	requestAnimationFrame( animate );
	earth.rotation.y += 0.01;
	earthc.rotation.y += 0.0068;		
	var timer = Date.now();
	camera.position.set( Math.cos( timer*0.00007 )*60, Math.cos( timer*0.00007 )*30, Math.sin( timer*0.00007 )*60 );
	camera.position.x += -mouseX*((ww+wh)*0.00002);
	camera.position.y += mouseY*((ww+wh)*0.00002);			
	moon.position.set( Math.cos( timer*0.0000174 )*-18.6, 0, (Math.sin( timer*0.0000174 )*18.6)+23 );
	render();
}

function render() {
	moon.lookAt( earth.position );	
	//sun.lookAt( camera.position );
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
