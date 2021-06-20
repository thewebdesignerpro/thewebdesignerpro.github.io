/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, arw, neb, x = y = z = 0;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

/*function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);*/
	
var camera = new THREE.PerspectiveCamera( 60, ww / wh,  0.1, 3000 );
camera.position.set( -100, 0, 0 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var group = new THREE.Group();
var group2 = new THREE.Group();
var newHor = new THREE.Group();

var dirLight = new THREE.DirectionalLight( 0xffffff, 4 );
dirLight.position.set( -200, 0, -50 );
group2.add( dirLight );

var spotL = new THREE.SpotLight( 0xffffff, 1, 2600 );
spotL.position.set( -200, 0, -50 );
spotL.castShadow = true;
spotL.onlyShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.5;
spotL.shadowCameraNear = 50;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 50;
group2.add( spotL );

var geometry = new THREE.Geometry();
for ( var i = 0; i < 3000; i ++ ) {
    var vertex = new THREE.Vector3();
    do {
        vertex.x = 1600 * Math.random() - 800;
        vertex.y = 1600 * Math.random() - 800;
        vertex.z = 1600 * Math.random() - 800;
    } while ( vertex.length() < 220 );
    geometry.vertices.push( vertex );
}
geometry.computeBoundingSphere();
mater = new THREE.PointCloudMaterial( { size: 1.5 } );
var stars = new THREE.PointCloud( geometry, mater );
group2.add( stars );


var loada = new THREE.TextureLoader();
loada.load(
	'imj/pluto4.jpg',
	function ( tex ) {
		geom = new THREE.IcosahedronGeometry( 20, 4 );
		mater = new THREE.MeshPhongMaterial( { map: tex, color: 0x302112, specular: 0x222222, shininess: 3, wrapAround: true, overdraw: 0.5 } );
		mater.wrapRGB.set( 0.4, 0.4, 0.4 );
		var pluto = new THREE.Mesh( geom, mater );
		pluto.position.set(-32, 0, 0);
		pluto.castShadow = true;
		pluto.receiveShadow = true;				
		pluto.rotation.z += Math.PI/6;
		group.add( pluto );			
	}, function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/charon.jpg',
	function ( tex2 ) {
		geom = new THREE.IcosahedronGeometry( 10, 4 );
		mater = new THREE.MeshPhongMaterial( { map: tex2, color: 0x1e1712, specular: 0x111111, shininess: 3, wrapAround: true, overdraw: 0.5 } );
		mater.wrapRGB.set( 0.5, 0.5, 0.5 );
		charon = new THREE.Mesh( geom, mater );
		charon.position.set(35, 0, 0);
		charon.castShadow = true;
		charon.receiveShadow = true;				
		charon.rotation.z += Math.PI/6;
		group.add( charon );
	}, function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/nebu.jpg',
	function ( tex3 ) {
		var geometry = new THREE.SphereGeometry(880, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {map: tex3, color: 0x303030, overdraw: 0.5, side: THREE.BackSide } );
		neb = new THREE.Mesh( geometry, material );
		neb.position.set(0, 0, 0);
		neb.receiveShadow = false;		
		scene.add( neb );
	},	function ( xhr ) {}, function ( xhr ) {}
);
loada.load(
	'imj/arw2.png',
	function ( tex4 ) {
		geom = new THREE.PlaneGeometry( 60, 60 );
		mater = new THREE.MeshLambertMaterial( { map: tex4, color: 0xffdd55, emissive: 0xffdd55, opacity: 0.65, transparent: true } );
		arw = new THREE.Mesh( geom, mater );
		arw.position.set( -202, 0, -50 );
		arw.castShadow = false;
		arw.receiveShadow = false;
		group2.add( arw );			
	}, function ( xhr ) {}, function ( xhr ) {}
);

geom = new THREE.CircleGeometry( 2.5, 16 );
mater = new THREE.MeshBasicMaterial( { color: 0xeecc50 } );
var sun = new THREE.Mesh( geom, mater );
sun.position.set( -201, 0, -50 );
sun.castShadow = false;
sun.receiveShadow = false;
group2.add( sun );

mater = new THREE.MeshLambertMaterial( { color: 0xdda70a, emissive: 0xbb8707 } );
var nhbox = new THREE.Mesh( new THREE.BoxGeometry( 8, 4, 4 ), mater );
nhbox.castShadow = true;
nhbox.receiveShadow = true;
var nhcap = new THREE.Mesh( new THREE.CylinderGeometry( 0.5, 2.9, 2.5, 4, 1 ), mater );
nhcap.position.set( 1.9, 3.25, 0 );
nhcap.rotation.y += Math.PI/4;
nhcap.castShadow = true;
nhcap.receiveShadow = true;
var nhcap2 = nhcap.clone();
nhcap2.position.set( -1.9, 3.25, 0 );
var nhoct = new THREE.Mesh( new THREE.CylinderGeometry( 2.6, 1, 2.2, 8, 1 ), mater );
nhoct.position.set( 0, 3.4, 0 );
nhoct.castShadow = true;
nhoct.receiveShadow = true;
mater = new THREE.MeshLambertMaterial( { color: 0x111111, emissive: 0x121212, side: THREE.DoubleSide } );
var nhgun = new THREE.Mesh( new THREE.CylinderGeometry( 1, 1, 6 ), mater );
nhgun.position.set( 0, 7.5, 0 );
nhgun.castShadow = true;
nhgun.receiveShadow = true;
var nhsol = new THREE.Mesh( new THREE.PlaneGeometry( 3.5, 6 ), mater );
nhsol.position.set( 0, 7.5, 0 );
nhsol.castShadow = true;
nhsol.receiveShadow = true;
var nhsol2 = nhsol.clone();
nhsol2.rotation.y += Math.PI/4;
var nhsol3 = nhsol.clone();
nhsol3.rotation.y -= Math.PI/4;
mater = new THREE.MeshLambertMaterial( { color: 0x777777, emissive: 0x444444 } );
var nhcam = new THREE.Mesh( new THREE.CylinderGeometry( 1, 1, 1, 16 ), mater );
nhcam.position.set( 4.5, 0, 0 );
nhcam.rotation.z += Math.PI/2;
nhcam.castShadow = true;
nhcam.receiveShadow = true;
var nhcam2 = new THREE.Mesh( new THREE.CylinderGeometry( 0.5, 0.5, 1.6, 16 ), mater );
nhcam2.position.set( -4.5, 0, 1 );
nhcam2.rotation.z += Math.PI/2;
nhcam2.castShadow = true;
nhcam2.receiveShadow = true;
var plate = new THREE.Mesh( new THREE.BoxGeometry( 1.4, 0.8, 0.1 ), mater );
plate.position.set( 1.5, -1.2, -2 );
plate.castShadow = true;
plate.receiveShadow = true;
var plate2 = plate.clone();
plate2.position.set( 3, -0.9, -2 );
plate2.rotation.z += Math.PI/2;
var plate3 = plate.clone();
plate3.position.set( 0, -0.5, -2 );
plate3.rotation.z += Math.PI/2;
var plate4 = plate.clone();
plate4.position.set( -2.5, -0.2, -2 );
var plate5 = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 1, 1 ), mater );
plate5.position.set( 3.25, 3, 0 );
plate5.rotation.z += Math.PI/5;
plate5.castShadow = true;
plate5.receiveShadow = true;				
mater = new THREE.MeshLambertMaterial( { color: 0x534741, emissive: 0x111111 } );
var nhcam3 = new THREE.Mesh( new THREE.CylinderGeometry( 0.7, 0.7, 1, 16 ), mater );
nhcam3.position.set( -1.2, -2, -0.7 );
nhcam3.castShadow = true;
nhcam3.receiveShadow = true;
var nhcam3c = new THREE.Mesh( new THREE.CylinderGeometry( 0.72, 0.72, 0.2, 16 ), mater );
nhcam3c.position.set( -2.6, -2.4, -0.7 );
nhcam3c.castShadow = true;
nhcam3c.receiveShadow = true;
var nhcam4 = new THREE.Mesh( new THREE.BoxGeometry( 2.8, 0.1, 1.2 ), mater );
nhcam4.position.set( 1.9, -2, -0.7 );
nhcam4.castShadow = true;
nhcam4.receiveShadow = true;
var nhcam4a = new THREE.Mesh( new THREE.CylinderGeometry( 0.4, 0.4, 1.5, 16 ), mater );
nhcam4a.position.set( 2.6, -2, -0.7 );
nhcam4a.rotation.z += Math.PI/4;
nhcam4a.castShadow = true;
nhcam4a.receiveShadow = true;				
var nhcam4b = nhcam4a.clone();
nhcam4b.position.set( 1.2, -2, -0.7 );
nhcam4b.rotation.z += Math.PI/2;
mater = new THREE.MeshLambertMaterial( { color: 0x999999, emissive: 0x707070 } );
var nhdish = new THREE.Mesh( new THREE.CylinderGeometry( 2, 2, 0.3, 24 ), mater );
nhdish.position.set( 0, 2, -2.2 );
nhdish.rotation.x += Math.PI/2;
nhdish.castShadow = true;
nhdish.receiveShadow = true;
var nhdishb = new THREE.Mesh( new THREE.CylinderGeometry( 3.2, 0.8, 0.9, 24 ), mater );
nhdishb.position.set( 0, 1.6, 2.4 );
nhdishb.rotation.x += Math.PI/2;
nhdishb.castShadow = true;
nhdishb.receiveShadow = true;
var nhdishm = new THREE.Mesh( new THREE.CylinderGeometry( 0.8, 0.2, 0.3, 24 ), mater );
nhdishm.position.set( 0, 1.6, 4.5 );
nhdishm.rotation.x += Math.PI/2;
nhdishm.castShadow = true;
nhdishm.receiveShadow = true;
var nhdisht = new THREE.Mesh( new THREE.CylinderGeometry( 0.3, 0.2, 4, 16 ), mater );
nhdisht.position.set( 0, 1.6, 1.8 );
nhdisht.rotation.x += Math.PI/2;
nhdisht.castShadow = true;
nhdisht.receiveShadow = true;
mater = new THREE.MeshLambertMaterial( { color: 0x777777, emissive: 0x333333, wireframe: true } );
var nhdishw = new THREE.Mesh( new THREE.CylinderGeometry( 0.1, 1.9, 3.5, 3 ), mater );
nhdishw.position.set( 0, 1.6, 4.5 );
nhdishw.rotation.x += Math.PI/2;
nhdishw.castShadow = true;
nhdishw.receiveShadow = true;

newHor.add( nhbox );
newHor.add( nhcap );
newHor.add( nhcap2 );
newHor.add( nhoct );
newHor.add( nhgun );
newHor.add( nhsol );
newHor.add( nhsol2 );
newHor.add( nhsol3 );
newHor.add( nhcam );
newHor.add( nhcam2 );
newHor.add( nhcam3 );
newHor.add( nhcam3c );
newHor.add( nhcam4 );
newHor.add( nhcam4a );
newHor.add( nhcam4b );
newHor.add( plate );
newHor.add( plate2 );
newHor.add( plate3 );
newHor.add( plate4 );
newHor.add( plate5 );
newHor.add( nhdish );
newHor.add( nhdishb );
newHor.add( nhdishm );
newHor.add( nhdisht );
newHor.add( nhdishw );
newHor.position.set( 70, 0, 0 ); 
 
scene.add(group);
scene.add(group2);
scene.add(newHor);

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMapEnabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame( animate );
	group.rotation.x = (1/6)*Math.PI;
    group.rotation.z = Date.now()*-0.0008;
	group2.rotation.y += 0.0008;
	neb.rotation.y += 0.0005;			
	//camera.position.x = -mouseX*0.15;
	//camera.position.y = -mouseY*0.15;			
	render();
}

function render() {
	x += 0.005; y += 0.005; z += 0.005; 
	newHor.rotation.set(x,y,z);	
	var timer = -0.0001 * Date.now();
	newHor.position.y = Math.cos( timer ) * 30;
	newHor.position.x = Math.cos( timer ) * 70;
	newHor.position.z = Math.sin( timer ) * -60;			
	camera.lookAt( scene.position );
	sun.lookAt( camera.position );
	arw.lookAt( camera.position );
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
