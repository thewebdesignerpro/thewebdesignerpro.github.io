/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, cld1, cld2, mun, arw, pif = 1, copa = 0, ntro = true;
	
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
var tex = THREE.ImageUtils.loadTexture('imj/ulap.png', undefined, xX);
var tex2 = THREE.ImageUtils.loadTexture('imj/arw2.png');
var tex3 = THREE.ImageUtils.loadTexture('imj/moon.jpg', undefined, bwan);
tex.magFilter = THREE.LinearMipMapLinearFilter;

var container = document.getElementById('container');
container.style.opacity = 0;
var canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, "#000000");
gradient.addColorStop(0.5, "#122a44");
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);
container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
container.style.backgroundSize = '32px 100%';

var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(26, ww / wh, 1, 5000);
camera.position.z = 6000;
var fog = new THREE.Fog(0x162e48, -10, 2800);
var light = new THREE.SpotLight(0x8090a0, 5);
light.castShadow = false;
light.position.set(100, 300, 4400);
scene.add( light );

geom = new THREE.Geometry();
function xX() {
	mater = new THREE.ShaderMaterial({
		uniforms: {
			"map":{type:"t",value:tex},
			"fogColor":{type:"c",value:fog.color},
			"fogNear":{type:"f",value:fog.near},
			"fogFar":{type:"f",value:fog.far},
		},
		vertexShader:document.getElementById('xv').textContent,
		fragmentShader:document.getElementById('xf').textContent,
		depthWrite:false,
		depthTest:false,
		transparent:true
	});
	var cld = new THREE.Mesh(new THREE.PlaneGeometry(80, 80));
	for (var i=0; i<6000; i++) {
		cld.position.x = Math.random()*1500-750;
		cld.position.y = -Math.random()*190+20;
		cld.position.z = i;	
		cld.rotation.z = Math.random()*Math.PI;
		cld.scale.x = cld.scale.y = Math.random()*Math.random()*1.6+0.4;
		cld.updateMatrix();
		geom.merge(cld.geometry, cld.matrix);		
	}
	var buffGeom = new THREE.BufferGeometry().fromGeometry(geom);
	cld1 = new THREE.Mesh(buffGeom, mater);
	cld1.position.z = 0;
	scene.add(cld1);
	cld2 = cld1.clone();
	cld2.position.z = -6000;
	scene.add(cld2);
}
function bwan() {
	var mater2 = new THREE.MeshLambertMaterial({ map: tex3, emissive: 0x0e2640, side: THREE.FrontSide, wrapAround: true, overdraw: 0.5, fog: false });
	mater2.wrapRGB.set( 0.35, 0.35, 0.35 );
	mun = new THREE.Mesh( new THREE.SphereGeometry( 120, 24, 24 ), mater2 );
	mun.position.set(100, 150, 4000);
	mun.rotation.y -= 1.2;
	scene.add( mun );	
	mater2 = new THREE.MeshLambertMaterial({ map: tex2, color: 0xccddee, emissive: 0xccddee, side: THREE.FrontSide, opacity: 0.75, transparent: true, fog: false });
	arw = new THREE.Mesh( new THREE.PlaneGeometry( 620, 600 ), mater2 );
	arw.position.set(100, 190, 4000);
	arw.castShadow = false;
	arw.receiveShadow = false;
	scene.add( arw );		
	light.lookAt(mun.position);
}
var particles = 4000;
var geoms = new THREE.BufferGeometry();
var poss = new Float32Array(particles*3);
var colors = new Float32Array(particles*3);
var color = new THREE.Color();
for (var i=0; i<poss.length; i+=3) {
	var x = Math.random()*3800-1900;
	var y = Math.random()*2800-1200;
	var z = -Math.random()*6000+3000;
	poss[i]   = x;
	poss[i+1] = y;
	poss[i+2] = z;
	var vx = (x/1900)+0.5;
	var vy = (y/1600)+0.5;
	var vz = (z/3000)+0.5;
	color.setRGB(vx, vy, vz);
	colors[i]   = color.r;
	colors[i+1] = color.g;
	colors[i+2] = color.b;
}
geoms.addAttribute( 'position', new THREE.BufferAttribute( poss, 3 ) );
geoms.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
geoms.computeBoundingSphere();
var maters = new THREE.PointCloudMaterial({ size:8, vertexColors:THREE.VertexColors });
var btwn = new THREE.PointCloud(geoms, maters);
scene.add(btwn);

var renderer = new THREE.WebGLRenderer({antialias:false, alpha:true});
renderer.setSize(ww, wh);
container.appendChild(renderer.domElement);

function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now();
	if (ntro) {
		if (pif>0) {
			pif -= 0.003;
			copa += 0.003;		
			document.getElementById( 'pinfo' ).style.opacity = pif;
			container.style.opacity = copa;
		} else {
			document.getElementById( 'pinfo' ).style.opacity = 0;
			container.style.opacity = 1;
			ntro = false;
		}
	}	
	if (mouseY==0) {
		camera.position.y += Math.sin(timer*0.0005)*4;
	}	
	if (cld1.position.z<6000) {
		cld1.position.z += 7;
	} else {
		cld1.position.z = 0;
	}	
	if (cld2.position.z<0) {
		cld2.position.z += 7;
	} else {
		cld2.position.z = -6000;
	}	
	camera.position.x = mouseX*0.1;
	camera.position.y = -mouseY*0.15;	
	render();
}
function render() {
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
