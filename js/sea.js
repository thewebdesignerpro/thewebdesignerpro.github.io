/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, ufs, pif = 1, copa = u1 = u2 = u3 = ufx = 0, ufy = 2005, ufz = 2005, ntro = true, light;
	
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

if (! Detector.webgl) Detector.addGetWebGLMessage();
var tex3 = THREE.ImageUtils.loadTexture('imj/arw2.png', undefined, uF);

var container = document.getElementById('container');
container.style.opacity = 0;
document.getElementById( 'pinfo2' ).style.opacity = 0;

var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(60, ww / wh, 0.1, 500000);
camera.position.set(0,50,-2000);
camera.lookAt( scene.position );
var fog = new THREE.Fog(0x44505a, -10, 2800);
var hlight = new THREE.HemisphereLight( 0xffffff, 0x111111, 1.2 );
hlight.position.set( -1, 10, -1 );
scene.add( hlight );
				
var cubeMap = new THREE.CubeTexture( [] );
cubeMap.format = THREE.RGBFormat;
cubeMap.flipY = false;
var loada = new THREE.ImageLoader();
loada.load('imj/map/cube/skybox1.jpg', function(tex) {
	var getSide = function (x, y) {
		var size = 1024;
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
var cubeShader = THREE.ShaderLib['cube'];
cubeShader.uniforms['tCube'].value = cubeMap;
var skyBoxMaterial = new THREE.ShaderMaterial({	fragmentShader: cubeShader.fragmentShader, vertexShader: cubeShader.vertexShader, uniforms: cubeShader.uniforms, depthWrite: false, side: THREE.BackSide});
var skyBox = new THREE.Mesh(new THREE.BoxGeometry( 100000, 100000, 100000 ), skyBoxMaterial);
scene.add( skyBox );
	
var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(ww, wh);
container.appendChild(renderer.domElement);

var params = {width: 2000,	height: 2000, widthSegments: 250, heightSegments: 250, depth: 1500, param: 4, filterparam: 1};
var watnorm = new THREE.ImageUtils.loadTexture( 'imj/shade/watnorm2.jpg' );
watnorm.wrapS = watnorm.wrapT = THREE.RepeatWrapping; 
var wata = new THREE.Water(renderer, camera, scene, {textureWidth: 512, textureHeight: 512, waterNormals: watnorm, alpha: 1, sunDirection: hlight.position.clone().normalize(), sunColor: 0xffffff, waterColor: 0x001020, distortionScale: 30.0});
var salamin = new THREE.Mesh(new THREE.PlaneBufferGeometry(params.width*50, params.height*50), wata.material);
salamin.add( wata );
salamin.rotation.x = -Math.PI/2;
salamin.position.set(0,0,0);
salamin.position.set(0,-500,0);
scene.add( salamin );

var utex = new THREE.Texture(generateTextureCanvas());
utex.needsUpdate = true;
function generateTextureCanvas() {
	var canvas	= document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 64;
	var context	= canvas.getContext('2d');
	context.fillStyle = '#333333';
	context.fillRect(0, 0, 64, 64);
	for(var y = 3; y < 64; y += 3) {
		for(var x = 2; x < 64; x += 2) {
			var value = Math.floor(Math.random()*255);
			context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
			context.fillRect(x, y, 1, 1);
		}
	}
	var canvas2	= document.createElement('canvas');
	canvas2.width = 512;
	canvas2.height = 512;
	var context	= canvas2.getContext('2d');
	context.imageSmoothingEnabled = false;
	context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
	return canvas2;
}
var ufo = new THREE.Group();	
function uF() {
	light = new THREE.PointLight( 0xf4faff, 8 );
	light.position.set( 0, 340, 0 );
	ufo.add( light );
	geom = new THREE.SphereGeometry( 600,32,6 );
	mater = new THREE.MeshPhongMaterial({map: utex, color: 0xaaaaaa, emissive: 0x111111, specular: 0xffffff, shininess: 100, metal: true, shading: THREE.FlatShading, envMap: cubeMap, reflectivity: 0.6, combine: THREE.MixOperation});
	ufom = new THREE.Mesh( geom, mater );
	ufom.scale.set(1,0.175,1);
	ufo.add(ufom);
	ufom.position.set(0,500,0);
	geom = new THREE.SphereGeometry( 220,32,3,0,Math.PI*2,0,Math.PI*.5 );
	dome = new THREE.Mesh( geom, mater );
	dome.scale.set(1,0.35,1);
	ufo.add(dome);
	dome.position.set(0,580,0);	
	shape = new THREE.PlaneGeometry( 1600, 1600 );
	mater = new THREE.MeshLambertMaterial( {map: tex3, side: THREE.BackSide, transparent: true, opacity: 0.4} );
	ufs = new THREE.Mesh( shape, mater );
	scene.add(ufs);
	ufs.position.set(0,-500,0);
	ufs.rotation.x = Math.PI/2;
	ufs.visible = false;
	ufo.position.set(ufx,ufy,ufz);
}				
scene.add(ufo);
				
function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now();
	if (ntro) {
		if (pif>0) {
			pif -= 0.003;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
		} else {
			document.getElementById( 'pinfo2' ).style.opacity = 0;
		}
		if (copa<1) {
			copa += 0.005;		
			container.style.opacity = copa;
		} else {
			container.style.opacity = 1;
		}		
		if (ufz>0) {
			ufy -= 5; ufz -= 5; 
			ufo.position.set(ufx,ufy,ufz);
		} else {
			ntro = false;
			ufy = 0; ufz = 0; 		
			ufs.visible = true;
		}
	} else {
		u1 -= Math.cos(timer*0.001)*0.0015;	u3 -= Math.cos(timer*0.001)*0.0015;
		ufo.rotation.x = u1;
		ufo.rotation.z = u3;
		ufo.position.y += Math.sin(timer*0.001)*1.5;	
		light.position.y += Math.sin(timer*0.001)*1.2;		
	}
	u2 += 0.015; 
	ufo.rotation.y = u2;
	wata.material.uniforms.time.value -= 1.0/50.0;
	wata.render();	
	camera.position.set( Math.cos( timer*0.00025 )*2000, Math.cos( timer*0.00015 )*1000+(wh*0.66), Math.sin( timer*0.0002 )*2000 );	
	camera.position.x = mouseX*7;
	camera.position.y = -mouseY*2.0+(wh*0.66);	
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
