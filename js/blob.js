/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, delta, time, startT = Date.now(), oldT = 0, frame, x=y=z=0;

document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
	
var camera = new THREE.PerspectiveCamera( 40, ww / wh,  0.1, 1000 );
camera.position.set( 0, 0, 20 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var light = new THREE.PointLight( 0xffffff, 10, 0 );
light.position.set( 0, 0, 0 );
scene.add( light );

if (Audio != undefined) {
	var au = new Audio();
	var ext = "ogg";
	if (au.canPlayType("audio/mp3")) ext = "mp3";
	var mus = new Audio("aud/bigbang."+ext);
	mus.volume = 0.5;
	mus.load();
	mus.addEventListener("loadeddata", function() {
		startT = Date.now();
		this.play();
	}, false);
} else {
	startT = Date.now();
}	
			
function genMorphT(geom) {
	var vertices = [], scale;
	for (var i = 0; i < geom.vertices.length; i++) {
		vertices.push( geom.vertices[ i ].clone() );
		scale = 1 + Math.random() * 0.35;
		vertices[ vertices.length - 1 ].x *= scale;
		vertices[ vertices.length - 1 ].y *= scale;
		vertices[ vertices.length - 1 ].z *= scale;
	}
	geom.morphTargets.push( { name: "t1", vertices: vertices } );
}

geom = new THREE.IcosahedronGeometry( 3.5, 3 );
mater = new THREE.MeshNormalMaterial( { morphTargets: true } );	
genMorphT( geom );
var blob = new THREE.Mesh( geom, mater );
scene.add( blob );		

var geoms = new THREE.IcosahedronGeometry( 50, 0 );
mater = new THREE.MeshNormalMaterial( { side: THREE.BackSide, opacity: 0.25, transparent: true } );		
scene.add( new THREE.Mesh( geoms, mater ) );

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMapEnabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame( animate );
	time = new Date().getTime();
	var musT = mus.currentTime;
	if (musT == 0) {
		musT = (time-startT)/1000;
	}				
	if (frame<1172) {
		frame = Math.round(musT * 5.635);
	} else {
		frame = 1171;
	}
	if ((blob.morphTargetInfluences ) && (frame<1171)) {
		blob.morphTargetInfluences[0] = (1 + aud[frame] + Math.sin( 0.015 * time ))/2;
	}
	x += 0.01, 	y -= 0.01, 	z -= 0.01; 
	blob.rotation.set(x,y,z);	
	render();
}

function render() {
	camera.lookAt( scene.position );
	renderer.render(scene, camera);	
}
