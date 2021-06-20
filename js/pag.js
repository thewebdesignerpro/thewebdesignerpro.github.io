/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, x = y = z = pis = 0, pif = 1, ntro = true, startT = Date.now(), oldT = 0, vdr, edges, edges2, edges3;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
//document.getElementById( 'optn' ).style.opacity = 0;

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var container = document.getElementById('container');
container.style.background = '#0c0c0c';

var camera = new THREE.PerspectiveCamera(50, ww/wh,  0.1, 100000);
camera.position.set(0, 3, 20);
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x0c0c0c, 0.02 );
camera.lookAt(scene.position);

var ambL = new THREE.AmbientLight( 0x444444 );
scene.add(ambL);
var spotL = new THREE.SpotLight( 0xffffff, 10, 100, Math.PI/4 );
spotL.position.set( 0, 60, 0 );
spotL.castShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.3;
spotL.shadowCameraNear = 20;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 45;
scene.add(spotL);
spotL.lookAt(scene.position);

var pointL = new THREE.PointLight( 0xffffff, 2, 4.2 );
pointL.position.set( 0, -3, 8 );
scene.add( pointL );

var vder = new THREE.Group();
 
var cubeMap = new THREE.CubeTexture( [] );
cubeMap.format = THREE.RGBFormat;
cubeMap.mapping = THREE.CubeReflectionMapping;
cubeMap.flipY = false;
var loada = new THREE.ImageLoader();
loada.load('imj/map/cube/skybox17lp3.jpg', function(tex) {
	var getSide = function (x, y) {
		var size = 128;
		var canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		var context = canvas.getContext('2d');
		context.drawImage(tex, -x*size, -y*size);
		return canvas;
	};
	cubeMap.images[0] = getSide(2, 1);
	cubeMap.images[1] = getSide(0, 1);
	cubeMap.images[2] = getSide(1, 0);
	cubeMap.images[3] = getSide(1, 2);
	cubeMap.images[4] = getSide(1, 1);
	cubeMap.images[5] = getSide(3, 1);
	cubeMap.needsUpdate = true;
});

bB();
function bB() {				
	var loader = new THREE.JSONLoader();
	loader.load('obj/pug3.json', function (geometry, materials) {
		geometry.computeVertexNormals();
		geometry.computeFaceNormals();
		mater = new THREE.MeshPhongMaterial({color: 0x362514, shininess: 1});
		vdr = new THREE.Mesh(geometry, mater);	  
		var scale = 1.06;
		vdr.position.set(0.33, -1.74, 4.10);
		vdr.scale.set(scale, scale, scale);
		vdr.castShadow = true;
		vdr.receiveShadow = true;
		vder.add(vdr);
		mater = new THREE.MeshPhongMaterial({color: 0x0e0a06, shininess: 2, transparent: true, opacity: 0.6});
		vdrb = new THREE.Mesh(geometry, mater);	  		
		var scale = 1.06;
		vdrb.position.set(0.33, -1.74, 4.54);
		vdrb.scale.set(scale*.97, scale, scale*1.1);
		vder.add(vdrb);
		edges = new THREE.VertexNormalsHelper( vdr, .07, 0x221100, 1 ); scene.add( edges );		
		edges2 = new THREE.FaceNormalsHelper( vdr, .05, 0x322110, 1 ); scene.add( edges2 );		
		edges3 = new THREE.FaceNormalsHelper( vdrb, .02, 0x120b06, 1 ); scene.add( edges3 );		
		//0x1e1311		
	});
	geom = new THREE.SphereGeometry( .52, 16, 12 );
	var matar = new THREE.MeshPhongMaterial({color: 0x161311, emissive: 0x070707, envMap: cubeMap, overdraw: 0.5, shininess: 80, reflectivity: .8});
	var mata = new THREE.Mesh( geom, matar );
	vder.add(mata);	
	var mata2 = mata.clone();
	vder.add(mata2);	
	mata.position.set(-1.65,-.7,2.9);
	mata2.position.set(1.65,-.7,2.9);
	bBb();
}	
function bBb() {				
	var loader = new THREE.JSONLoader();
	loader.load('obj/vader2.json', function (geometry, materials) {
		geometry.computeVertexNormals();
		geometry.computeFaceNormals();
		mater = new THREE.MeshPhongMaterial({color: 0x565656, envMap: cubeMap, overdraw: 0.5, side: THREE.DoubleSide, shading: THREE.SmoothShading, shininess: 50, metal: true, reflectivity: .6});
		vdr = new THREE.Mesh(geometry, mater);	  
		var scale = 1;
		vdr.position.set(0, 0, 0);
		vdr.scale.set(scale, scale, scale);
		vdr.castShadow = true;
		vdr.receiveShadow = true;
		vder.add(vdr);
	});
	
}
scene.add(vder);
	
var geomf = new THREE.PlaneBufferGeometry( 3000, 3000 );
var materf = new THREE.MeshPhongMaterial( { color: 0x0c0c0c, specular: 0x0c0c0c, shininess: 1, wireframe: false } );
var ground = new THREE.Mesh( geomf, materf );
ground.position.set( 0, -16, 0 );
ground.rotation.x = -Math.PI/2;
scene.add( ground );

if (!Detector.webgl) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);			

function animate() {
	requestAnimationFrame(animate);
	var timer = new Date().getTime();	
	if (ntro) {
		if (pif>0) {
			pif -= 0.005;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
		} else {
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			ntro = false;
		}
	}	
	y -= Math.cos(timer*0.001)*0.002;	z -= Math.sin(timer*0.001)*0.001;
	vder.rotation.set(0,y,z);		
	camera.position.x = -mouseX*0.04;
	camera.position.y = -mouseY*0.03+(wh*0.01);		
	edges.update();
	edges2.update();
	edges3.update();
	render();
}

function render() {
	camera.lookAt(scene.position);
	spotL.lookAt(scene.position);
	renderer.render(scene, camera);	
}

