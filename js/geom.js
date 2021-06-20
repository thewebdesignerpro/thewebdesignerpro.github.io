/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, edges, x = y = z = 0;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
	
var camera = new THREE.PerspectiveCamera( 40, ww / wh,  0.1, 3000 );
camera.position.set( 0, 50, 400 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var alight = new THREE.AmbientLight( 0x565656 );
scene.add( alight );

var light = new THREE.PointLight( 0xffffff, 2, 1000 );
light.position.set( 0, 80, 80 );
scene.add( light );

var spotL = new THREE.SpotLight( 0xffffff, 1, 200 );
spotL.position.set( 0, 80, 80 );
spotL.castShadow = true;
spotL.onlyShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.4;
spotL.shadowCameraNear = 50;
spotL.shadowCameraFar = 300;
spotL.shadowCameraFov = 40;
scene.add( spotL );

var group = new THREE.Group();

var gridH = new THREE.GridHelper( 40, 4 );		
gridH.position.set(0, -20, 0);
gridH.rotation.y = -45 * Math.PI/180;
gridH.setColors(0x2b2b2b, 0x2b2b2b);
scene.add( gridH );

var gridH2 = gridH.clone();
gridH2.position.set(-28.3, 20, -28.3);
gridH2.rotation.y = -45 * Math.PI/180;
gridH2.rotation.z = 90 * Math.PI/180;
scene.add( gridH2 );

var gridH3 = gridH.clone();
gridH3.position.set(28.3, 20, -28.3);
gridH3.rotation.y = 45 * Math.PI/180;
gridH3.rotation.z = 90 * Math.PI/180;
scene.add( gridH3 );

geom = new THREE.PlaneGeometry( 80, 80, 4, 4 );
mater = new THREE.MeshLambertMaterial( { color: 0x090909 } );
var plane = new THREE.Mesh( geom, mater );
plane.position.set(0, -20.05, 0);
plane.rotation.x = -90 * Math.PI/180;
plane.rotation.z = 45 * Math.PI/180;
plane.receiveShadow = true;
scene.add( plane );

var plane2 = plane.clone();
plane2.position.set(-28.35, 20, -28.35);
plane2.rotation.x = 0;
plane2.rotation.y = 45 * Math.PI/180;
plane2.rotation.z = 0;
plane2.receiveShadow = true;
scene.add( plane2 );

var plane3 = plane.clone();
plane3.position.set(28.35, 20, -28.35);
plane3.rotation.x = 0;
plane3.rotation.y = -45 * Math.PI/180;
plane3.rotation.z = 0;
plane3.receiveShadow = true;
scene.add( plane3 );

geom = new THREE.BoxGeometry( 10, 10, 10, 2, 2, 2 );
mater = new THREE.MeshLambertMaterial( { color: 0x202020, shading: THREE.FlatShading } );
var shapeb = new THREE.Mesh( geom, mater );
edges = new THREE.WireframeHelper( shapeb, 0xffffff );
shapeb.position.set(0, 0, -30);
shapeb.castShadow = true;
shapeb.receiveShadow = true;
group.add( shapeb );
group.add( edges );

geom = new THREE.OctahedronGeometry( 8, 1 );
var shape8 = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shape8, 0xffffff );
shape8.position.set(0, 0, 0);
shape8.castShadow = true;
shape8.receiveShadow = true;
group.add( shape8 );
group.add( edges );

geom = new THREE.DodecahedronGeometry( 8, 0 );
var shapedo = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapedo, 0xffffff );
shapedo.position.set(0, 0, 30);
shapedo.castShadow = true;
shapedo.receiveShadow = true;
group.add( shapedo );
group.add( edges );

geom = new THREE.CylinderGeometry( 0, 10, 14, 4, 5 );
var shapepy = new THREE.Mesh( geom, mater );
edges = new THREE.WireframeHelper( shapepy, 0xffffff );
shapepy.position.set(-15, 0, -15);
shapepy.castShadow = true;
shapepy.receiveShadow = true;
group.add( shapepy );
group.add( edges );

geom = new THREE.CylinderGeometry( 0, 8, 14, 10, 10 );
var shapecy = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapecy, 0xffffff );
shapecy.position.set(-30, 0, 0);
shapecy.castShadow = true;
shapecy.receiveShadow = true;
group.add( shapecy );
group.add( edges );

geom = new THREE.SphereGeometry( 8, 10, 10 );
var shape = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shape, 0xffffff );
shape.position.set(15, 0, -15);
shape.castShadow = true;
shape.receiveShadow = true;
group.add( shape );
group.add( edges );

geom = new THREE.TetrahedronGeometry( 8, 1 );
var shapet1 = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapet1, 0xffffff );
shapet1.position.set(-15, 0, 15);
shapet1.castShadow = true;
shapet1.receiveShadow = true;
group.add( shapet1 );
group.add( edges );

geom = new THREE.TorusKnotGeometry( 4.5, 1.5, 32, 8 );
var shapetk = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapetk, 0xffffff );
shapetk.position.set(30, 0, 0);
shapetk.castShadow = true;
shapetk.receiveShadow = true;
group.add( shapetk );
group.add( edges );

var pts = [];
for ( var i = 0; i < 10; i ++ ) { pts.push( new THREE.Vector3( Math.sin( i * 0.25 ) * 8, 0, ( i - 5 ) * 1.4 ) ); }
geom = new THREE.LatheGeometry( pts );
mater = new THREE.MeshLambertMaterial( { color: 0x202020, shading: THREE.FlatShading, side: THREE.DoubleSide } );
var shapel = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapel, 0xffffff );
shapel.position.set(15, 0, 15);
shapel.castShadow = true;
shapel.receiveShadow = true;
group.add( shapel );
group.add( edges );

geom = new THREE.IcosahedronGeometry( 8, 0 );
var shapei = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapei, 0xffffff );
shapei.position.set(0, 20, -30);
shapei.castShadow = true;
shapei.receiveShadow = true;
group.add( shapei );
group.add( edges );

geom = new THREE.SphereGeometry( 8, 2, 2 );
var shapet2 = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapet2, 0xffffff );
shapet2.position.set(0, 20, 0);
shapet2.castShadow = true;
shapet2.receiveShadow = true;
group.add( shapet2 );
group.add( edges );

geom = new THREE.TorusGeometry( 6, 2, 8, 12 );
var shapeto = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapeto, 0xffffff );
shapeto.position.set(15, 20, -15);
shapeto.castShadow = true;
shapeto.receiveShadow = true;
group.add( shapeto );
group.add( edges );

klein = function (u, v) {
	u *= Math.PI;
	v *= 2 * Math.PI;
	u = u * 2;
	var x, y, z;
	if (u < Math.PI) {
		x = 4.5 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
		z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
	} else {
		x = 4.5 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
		z = -8 * Math.sin(u);
	}
	y = -3 * (1 - Math.cos(u) / 2) * Math.sin(v);
	return new THREE.Vector3(x, y, z);
};
function createM(geom2) {
	geom2.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var mater2 = new THREE.MeshLambertMaterial({ color: 0x202020, shading: THREE.FlatShading, side: THREE.DoubleSide });
	var mesh = new THREE.Mesh( geom2, mater2 );
	return mesh;
}
var hdry = createM(new THREE.ParametricGeometry(klein, 12, 8, true));
edges = new THREE.EdgesHelper( hdry, 0xffffff );
hdry.position.set(-15, 20, -15);
hdry.castShadow = true;
hdry.receiveShadow = true;
group.add( hdry );
group.add( edges );

geom = new THREE.TetrahedronGeometry( 8, 0 );
var shapet = new THREE.Mesh( geom, mater );
edges = new THREE.EdgesHelper( shapet, 0xffffff );
shapet.position.set(0, 40, -30);
shapet.castShadow = true;
shapet.receiveShadow = true;
group.add( shapet );
group.add( edges );

scene.add(group);

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.setClearColor(0x000000, 0);
renderer.shadowMapEnabled = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame( animate );
	render();
	controls.update();
}

function render() {
	if (entro) {
		if (camera.position.z>120) {
			camera.position.z -= 2;
		} else {
			entro = false;
		}
	}

	x += 0.005; y += 0.005; z += 0.005; 
	shapeb.rotation.set(x,y,z);
	shape8.rotation.set(-x,-y,-z);
	shapedo.rotation.set(x,-y,z);
	shapepy.rotation.set(x,y,-z);
	shapecy.rotation.set(x,-y,-z);
	shape.rotation.set(-x,y,z);
	shapet1.rotation.set(-x,-y,z);
	shapetk.rotation.set(-x,y,-z);
	shapel.rotation.set(x,y,z);
	shapei.rotation.set(-x,-y,-z);
	shapet2.rotation.set(x,-y,z);
	shapeto.rotation.set(x,y,-z);
	hdry.rotation.set(x,y,-z);
	shapet.rotation.set(x,-y,-z);
	
	camera.lookAt( scene.position );
	renderer.render(scene, camera);	
}
