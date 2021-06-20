/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, tunnel, lpx = lpy = lpz = 0, tme = 80000, pif = 1, ntro = true, parent, cameraSpl, pathExtr;
	
var norm = new THREE.Vector3();
var binorm = new THREE.Vector3();
		
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

var tex = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0252-diff.jpg" );
var spc = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0252-spec.jpg" );
var nrm = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0252-norm.jpg" );
var bmp = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0252-disp.jpg" );
var bmp = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0252-bump.jpg" );
tex.wrapS = tex.wrapT = spc.wrapS = spc.wrapT = nrm.wrapS = nrm.wrapT = bmp.wrapS = bmp.wrapT = THREE.RepeatWrapping;
tex.repeat.set( 48, 4);
spc.repeat.set( 48, 4);		
nrm.repeat.set( 48, 4);		
bmp.repeat.set( 48, 4);		

var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x141414, 0.0035 );

parent = new THREE.Object3D();
scene.add( parent );
cameraSpl = new THREE.PerspectiveCamera( 80, ww / wh, 0.1, 5000 );
parent.add( cameraSpl );

var alight = new THREE.AmbientLight( 0x111111 );
scene.add( alight );
var light = new THREE.PointLight( 0xffcc97, 1.35, 75 );
light.position.set( 0, 0, 5 );
scene.add( light );			

var CustomSinCurve = THREE.Curve.create(
    function ( scale ) { 
        this.scale = (scale === undefined) ? 1 : scale;
    },
	function(t) {
		t *= Math.PI*2;
		var tx = Math.sin(t)*60,
			ty = Math.cos(t)*(10+Math.cos(t)*50),
			tz = Math.sin(t)*(10+Math.cos(t)*50);
		return new THREE.Vector3(tx,ty,tz).multiplyScalar(this.scale);
	}	
);
pathExtr = new CustomSinCurve( 4 );
geom = new THREE.TubeGeometry( pathExtr, 56, 40, 14, true );
mater = new THREE.MeshPhongMaterial( { map: tex, color: 0x44474a, bumpMap: bmp, specular: 0xcccccc, specularMap: spc, shininess: 10, side: THREE.BackSide, opacity: 0.99, transparent: false, fog: true, wrapAround: true } );
mater.bumpScale = 1;
mater.wrapRGB.set( 0.5, 0.5, 0.5 );
tunnel = new THREE.Mesh( geom, mater );
parent.add( tunnel );	

if (! Detector.webgl) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.setClearColor( 0x000000 );
var container = document.getElementById('container');
container.appendChild(renderer.domElement);			

function animate() {
	requestAnimationFrame(animate);
	if (ntro) {
		if (pif>0) {
			pif -= 0.002;
			document.getElementById( 'pinfo' ).style.opacity = pif;
		} else {
			document.getElementById( 'pinfo' ).style.opacity = 0;
			ntro = false;
		}
	}
	var timer = Date.now();
	var t = (timer%tme)/tme;
	var pos = geom.parameters.path.getPointAt(t);
	pos.multiplyScalar(1);	
	var pos2 = geom.parameters.path.getPointAt(t+(80/geom.parameters.path.getLength()));
	pos2.multiplyScalar(1);
	var pos3 = geom.parameters.path.getPointAt(t);
	pos3.multiplyScalar(-1);
	var segments = geom.tangents.length;
	var pickt = t*segments;
	var pick = Math.floor(pickt);
	var pickNext = (pick+1) % segments;
	binorm.subVectors( geom.binormals[pickNext], geom.binormals[pick]);
	binorm.multiplyScalar(pickt-pick).add(geom.binormals[pick]);
	var dir = geom.parameters.path.getTangentAt(t);
	norm.copy( binorm ).cross( dir );
	pos.add( norm.clone().multiplyScalar(5) );
	pos2.add( norm.clone().multiplyScalar(5) );
	pos3.add( norm.clone().multiplyScalar(5) );
	if (mouseY<=0) {
		cameraSpl.position.copy( pos );
		light.position.copy( pos2 );
	} else {
		cameraSpl.position.copy( pos2 );
		light.position.copy( pos );	
	}
	light.position.x += Math.sin(timer*0.008)*5;	
	light.position.y += Math.sin(timer*0.008)*5;		
	light.position.z += Math.sin(timer*0.008)*5;		
	var lookAt = geom.parameters.path.getPointAt((t+30/geom.parameters.path.getLength())%1).multiplyScalar(1);
	cameraSpl.matrix.lookAt(cameraSpl.position, lookAt, norm);
	cameraSpl.rotation.setFromRotationMatrix(cameraSpl.matrix, cameraSpl.rotation.order);
	parent.rotation.y += (0-parent.rotation.y)*0.05;	
	cameraSpl.position.x += Math.sin(timer*0.004)*2;	
	cameraSpl.position.y += Math.sin(timer*0.004)*2;			
	cameraSpl.position.z += Math.sin(timer*0.004)*2;			
	render();
}

function render() {
	renderer.render(scene, cameraSpl);	
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
