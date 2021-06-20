/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, arw, neb, x = y = z = pis = 0, pif = 1, shtex, ntro = true;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
document.getElementById( 'pinst' ).style.opacity = 0;

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/shade1.jpg", undefined, mF );
var tex2 = THREE.ImageUtils.loadTexture('imj/cloud2.jpg', undefined, cF);

var camera = new THREE.PerspectiveCamera( 35, ww / wh,  0.1, 3000 );
camera.position.set( -3, 1, 1.5 );
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xd8eaf4, 0.04 );
camera.lookAt( scene.position );

var light = new THREE.PointLight( 0xffffff, 1, 20 );
light.position.set( 0, -10, -30 );
scene.add( light );
var hLight = new THREE.HemisphereLight( 0xd8eaf4, 0x648077, 1.3 );
hLight.position.set( -1, 20, -10 );
scene.add( hLight );

function mF() {
	//mater = new THREE.MeshPhongMaterial({ color: 0x84a096, specular: 0xffffff, specularMap: specMap, shininess: 7, map: diffMap, normalMap: norMap, normalScale: new THREE.Vector2(.3, -.3), aoMap: aoMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: 0.3, displacementBias: 0 });
	mater = new THREE.MeshPhongMaterial({ color: 0x84a0aa, map: diffMap, displacementMap: diffMap, displacementScale: 1.0, displacementBias: 0 });
	geom = new THREE.PlaneGeometry( 15, 15, 96, 96 );
	mesh = new THREE.Mesh(geom, mater);
	mesh.position.set(0, 0, 0);
	mesh.rotation.x -= Math.PI/2+0.3;
	mesh.scale.set( 2, 2, 2 );
	mesh.material.side = THREE.FrontSide;
	//mesh.material.shading = THREE.FlatShading;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
}
function cF() {
	var geometry = new THREE.SphereGeometry(40, 64, 64 );
	var material = new THREE.MeshLambertMaterial( {map: tex2, overdraw: 0.5, side: THREE.BackSide, fog: false } );
	sky = new THREE.Mesh( geometry, material );
	sky.position.set(0, 0, 0);
	scene.add( sky );
}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			

function animate() {
	requestAnimationFrame( animate );
	var time = new Date().getTime();	
    mater.displacementScale = (Math.sin(time*0.0006)*0.7)-1.6;
	camera.position.x = Math.sin(time*0.00007) * 3;
	mesh.rotation.z += 0.0015;	
	sky.rotation.y += 0.001;	
	if (ntro) {
		if (pif>0) {
			pif -= 0.005;
			pis += 0.005;
			document.getElementById( 'pinfo' ).style.opacity = pif;
			document.getElementById( 'pinst' ).style.opacity = pis;			
		} else {
			document.getElementById( 'pinfo' ).style.opacity = 0;
			document.getElementById( 'pinst' ).style.opacity = 1;
			ntro = false;
		}
	} else {
		camera.position.x = mouseX*0.03;
		camera.position.y = -mouseY*0.008+(wh*0.001);
	}	
	render();
}

function render() {
	camera.lookAt( scene.position );
	renderer.render(scene, camera);	
}

pinsta.addEventListener('click', function(e) {
	mater.wireframe = !(mater.wireframe);
	e.preventDefault();
});

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
