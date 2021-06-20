/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, geom2, mater2, geom3, mater3, mesh, wall, wall2, well, arw, neb, x = y = z = xb = yb = zb = 0, pif = 1, ntro = true;
	
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

var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-diff.jpg" );
var specMap = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-spec.jpg" );		
var aoMap = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-ao.jpg" );
var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-disp.jpg" );
var norMap = THREE.ImageUtils.loadTexture('imj/shade/tx/ps1509-norm.jpg', undefined, gF);
var diffMap2 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-diff.jpg" );
var specMap2 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-spec.jpg" );		
var aoMap2 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-ao.jpg" );
var dispMap2 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-disp.jpg" );
var norMap2 = THREE.ImageUtils.loadTexture('imj/shade/tx/ps0174-norm.jpg', undefined, wF);
var diffMap3 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-diff.jpg" );
var specMap3 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-spec.jpg" );		
var aoMap3 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-ao.jpg" );
var dispMap3 = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-disp.jpg" );
var norMap3 = THREE.ImageUtils.loadTexture('imj/shade/tx/ps0246s-norm.jpg', undefined, tF);
var tex2 = THREE.ImageUtils.loadTexture('imj/cloud2.jpg', undefined, cF);
	
var camera = new THREE.PerspectiveCamera( 35, ww / wh,  0.1, 3000 );
camera.position.set( 4, 1, 5 );
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xa3a8ab, 0.05 );
camera.lookAt( scene.position );

var alight = new THREE.AmbientLight( 0x939393 ); 
scene.add( alight );
var spotL = new THREE.SpotLight( 0xffffff, 1, 300, Math.PI/16 );
spotL.position.set( -5, 20, 6 );
spotL.castShadow = true;
spotL.shadowMapWidth = 512;
spotL.shadowMapHeight = 512;
spotL.shadowDarkness = 0.6;
spotL.shadowCameraNear = 10;
spotL.shadowCameraFar = 300;
spotL.shadowCameraFov = 20;
scene.add( spotL );

var group = new THREE.Group();
function gF() {
	mater = new THREE.MeshPhongMaterial({ color: 0x3c3c3c, specular: 0xffffff, specularMap: specMap, shininess: 7, map: diffMap, normalMap: norMap, normalScale: new THREE.Vector2(.3, -.3), aoMap: aoMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: 0.3, displacementBias: 0 });
	geom = new THREE.PlaneGeometry( 4, 4, 64, 64 );
	geom.faceVertexUvs[1] = geom.faceVertexUvs[0];
	mesh = new THREE.Mesh(geom, mater);
	mesh.position.set(0, -1.3, 0);
	mesh.rotation.x -= Math.PI/2;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	group.add(mesh);
}
function wF() {
	mater2 = new THREE.MeshPhongMaterial({ color: 0x565656, specular: 0xffffff, specularMap: specMap2, shininess: 7, map: diffMap2, normalMap: norMap2, normalScale: new THREE.Vector2(.2, -.2), aoMap: aoMap2, aoMapIntensity: 1, displacementMap: dispMap2, displacementScale: 0.2, displacementBias: 0 });
	geom2 = new THREE.PlaneGeometry( 4, 4, 64, 64 );
	geom2.faceVertexUvs[1] = geom2.faceVertexUvs[0];
	wall = new THREE.Mesh(geom2, mater2);
	wall.position.set(0, 0.81, -2.02);
	wall.castShadow = true;
	wall.receiveShadow = true;
	group.add(wall);
	wall2 = wall.clone();
	group.add(wall2);
	wall2.rotation.y += Math.PI/2;
	wall2.position.set(-2.02, 0.81, 0);	
}
function tF() {
	mater3 = new THREE.MeshPhongMaterial({ color: 0x404040, specular: 0xffffff, specularMap: specMap3, shininess: 7, map: diffMap3, normalMap: norMap3, normalScale: new THREE.Vector2(.2, -.2), aoMap: aoMap3, aoMapIntensity: 1, displacementMap: dispMap3, displacementScale: 0.2, displacementBias: 0 });
	geom3 = new THREE.SphereGeometry(0.5, 32, 32 );
	geom3.faceVertexUvs[1] = geom3.faceVertexUvs[0];
	well = new THREE.Mesh(geom3, mater3);
	well.position.set(0,0,0);
	well.material.side = THREE.DoubleSide;
	well.castShadow = true;
	well.receiveShadow = true;
	group.add(well);	
}
function cF() {
		var geometry = new THREE.SphereGeometry(100, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {map: tex2, overdraw: 0.5, side: THREE.BackSide, fog: false } );
		sky = new THREE.Mesh( geometry, material );
		sky.rotation.y += 0.4;
		sky.position.set(0, 0, 0);
		scene.add( sky );
}
group.position.set(0,0,-30);
group.rotation.set(0,-Math.PI/4,0);
scene.add(group);

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
	if (ntro) {
		if (group.position.z<0) {
			group.position.z += 0.3;
			pif -= 0.008;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
		} else {
			group.position.z = 0;
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			ntro = false;
		}
	}	
    mater3.displacementScale = 0.15+(Math.sin(time*0.001)*0.1);
	x += 0.0015; y += 0.002; z -= 0.001; 
	x += Math.tan(time*0.001)*0.0015; y += Math.tan(time*0.0005)*0.00225; z -= Math.tan(time*0.0015)*0.00075;
	well.rotation.set(x,y,z);	
	well.position.y += Math.sin(time*0.001)*0.004;
	xb -= Math.cos(time*0.001)*0.001;	yb -= Math.cos(time*0.001)*0.002;	zb -= Math.cos(time*0.001)*0.001;
	group.rotation.set(xb, yb, zb);		
	camera.position.x = mouseX * 0.009 + 4;
	camera.position.y = mouseY * 0.008;	
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
