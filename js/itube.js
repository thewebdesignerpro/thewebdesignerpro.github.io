/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, tunnel, yb = 0, pif = 1, ntro = true, parent, cameraSpl, pathExtr;
	
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
	
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x111111, 0.0035 );

parent = new THREE.Object3D();
scene.add( parent );
cameraSpl = new THREE.PerspectiveCamera( 80, ww / wh, 0.1, 5000 );
parent.add( cameraSpl );

var tex = THREE.ImageUtils.loadTexture( "imj/shade/glow2.png" );
tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set( 40, 1 );		

var light = new THREE.PointLight( 0xffffff, 1, 150 );
light.position.set( 0, 0, 5 );
scene.add( light );			

var sgeom = new THREE.Geometry();
for ( var i = 0; i < 7000; i ++ ) {
    var vertex = new THREE.Vector3();
    do {
        vertex.x = 2400 * Math.random() - 1200;
        vertex.y = 2400 * Math.random() - 1200;
        vertex.z = 2400 * Math.random() - 1200;
    } while ( vertex.length() < 480 );
    sgeom.vertices.push( vertex );
}
sgeom.computeBoundingSphere();
var smater = new THREE.PointCloudMaterial( { size: 3 } );
var stars = new THREE.PointCloud( sgeom, smater );
scene.add( stars );

var CustomSinCurve = THREE.Curve.create(
    function ( scale ) { 
        this.scale = (scale === undefined) ? 1 : scale;
    },
	function(t) {
		t *= Math.PI*2;
		var tx = Math.sin(t)*60,
			ty = Math.cos(t)*(20+Math.cos(t)*60),
			tz = Math.sin(t)*(20+Math.cos(t)*60);
		return new THREE.Vector3(tx,ty,tz).multiplyScalar(this.scale);
	}	
);
pathExtr = new CustomSinCurve( 4 );
geom = new THREE.TubeGeometry( pathExtr, 128, 15, 7, true );
mater = new THREE.MeshLambertMaterial( { map: tex, color: 0xbbddff, side: THREE.BackSide, opacity: 0.8, transparent: true, fog: true } );
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
	var t = (timer%30000)/30000;
	var pos = geom.parameters.path.getPointAt(t);
	pos.multiplyScalar(1);
	var segments = geom.tangents.length;
	var pickt = t*segments;
	var pick = Math.floor(pickt);
	var pickNext = (pick+1) % segments;
	binorm.subVectors( geom.binormals[pickNext], geom.binormals[pick]);
	binorm.multiplyScalar(pickt-pick).add(geom.binormals[pick]);
	var dir = geom.parameters.path.getTangentAt(t);
	norm.copy( binorm ).cross( dir );
	pos.add( norm.clone().multiplyScalar(5) );
	cameraSpl.position.copy( pos );
	light.position.copy( pos );
	var lookAt = geom.parameters.path.getPointAt((t+30/geom.parameters.path.getLength())%1).multiplyScalar(1);
	cameraSpl.matrix.lookAt(cameraSpl.position, lookAt, norm);
	cameraSpl.rotation.setFromRotationMatrix(cameraSpl.matrix, cameraSpl.rotation.order);
	parent.rotation.y += (0-parent.rotation.y)*0.05;	
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
