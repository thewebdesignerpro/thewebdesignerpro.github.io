/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geometry, material, radialWave, x = y = z = 0;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
	
var camera = new THREE.PerspectiveCamera( 40, ww / wh,  0.1, 3000 );
camera.position.set( -11, -50, -50 );
var scene = new THREE.Scene();
camera.lookAt( scene.position );

var alight = new THREE.AmbientLight( 0x50555a );
scene.add( alight );

var light = new THREE.PointLight( 0xfbfdff, 1.2, 400 );
light.position.set( 0, 60, 30 );
scene.add( light );

var spotL = new THREE.SpotLight( 0xfbfdff, 0.7, 200 );
spotL.position.set( 0, 80, 30 );
spotL.castShadow = true;
spotL.onlyShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.3;
spotL.shadowCameraNear = 50;
spotL.shadowCameraFar = 300;
spotL.shadowCameraFov = 40;
scene.add( spotL );

var isle = new THREE.Group();
var ulap = new THREE.Group();
		
radialWave = function (u, v) {
	var r = 10, x, y, z, xz, xn, zn;
	x = Math.cos(v * 2 * Math.PI)*Math.sin(u *1* Math.PI) *r;
	z = Math.sin(v * 2 * Math.PI)*Math.sin(u *1* Math.PI) *r;
    y = (Math.sin(u * 3 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 0.8;

	if (x<9) x += 1.5 * Math.random() - 0.742;
	if (z>9) z -= 1.5 * Math.random() - 0.742;
	if (z<9) z += 1.5 * Math.random() - 0.742;
			
	return new THREE.Vector3(x, y, z);
};

function createMesh(geom) {
	geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    var meshMaterial = new THREE.MeshLambertMaterial({ color: 0x22aa44, shading: THREE.FlatShading });
	var plane = new THREE.Mesh( geom, meshMaterial );
	return plane;
}

var sahig = createMesh(new THREE.ParametricGeometry(radialWave, 12, 12, true));
sahig.receiveShadow = true;
sahig.position.set( 0, 2.3, 0 );
sahig.rotation.z -= 0.1;
isle.add(sahig);
		
geometry = new THREE.CircleGeometry( 9.5, 10 );
material = new THREE.MeshLambertMaterial( { color: 0x22aa44, shading: THREE.FlatShading, side: THREE.DoubleSide } );
var sahig2 = new THREE.Mesh( geometry, material );
sahig2.position.set( 0, 1.8, 0 );
sahig2.rotation.x -= Math.PI/2;
isle.add(sahig2);

geometry = new THREE.TetrahedronGeometry( 8.5, 0 );
material = new THREE.MeshLambertMaterial( { color: 0x885e40 } );
var	cyl = new THREE.Mesh( geometry, material );
cyl.position.set( 0, -1, 0 );
cyl.castShadow = true;
cyl.receiveShadow = true;
cyl.rotation.x += 0.6;
cyl.rotation.z += 0.8;
isle.add(cyl);

geometry = new THREE.TetrahedronGeometry( 6.5, 0 );
var	cyl2 = new THREE.Mesh( geometry, material );
cyl2.position.set( -3, -0.5, 1 );
cyl2.castShadow = true;
cyl2.receiveShadow = true;
cyl2.rotation.x += 0.6;
cyl2.rotation.y -= 0.2;
cyl2.rotation.z += 0.9;
isle.add(cyl2);

geometry = new THREE.TetrahedronGeometry( 6, 0 );
var	cyl3 = new THREE.Mesh( geometry, material );
cyl3.position.set( 3.5, -0.5, 1 );
cyl3.castShadow = true;
cyl3.receiveShadow = true;
cyl3.rotation.x -= 0.6;
cyl3.rotation.y -= 0.7;
cyl3.rotation.z -= 1.1;
isle.add(cyl3);

geometry = new THREE.TetrahedronGeometry( 6.2, 0 );
var	cyl4 = new THREE.Mesh( geometry, material );
cyl4.position.set( -1, -0.1, -3 );
cyl4.castShadow = true;
cyl4.receiveShadow = true;
cyl4.rotation.x -= 0.7;
cyl4.rotation.y += 0.4;
cyl4.rotation.z -= 0.45;
isle.add(cyl4);

geometry = new THREE.TetrahedronGeometry( 5, 0 );
var	cyl5 = new THREE.Mesh( geometry, material );
cyl5.position.set( 3, 0.2, 3.5 );
cyl5.castShadow = true;
cyl5.receiveShadow = true;
cyl5.rotation.x -= 0.8;
cyl5.rotation.y -= 0.6;
cyl5.rotation.z -= 1.4;
isle.add(cyl5);

geometry = new THREE.TetrahedronGeometry( 3.8, 0 );
var	cyl6 = new THREE.Mesh( geometry, material );
cyl6.position.set( 5.5, 0.5, 1.5 );
cyl6.castShadow = true;
cyl6.receiveShadow = true;
cyl6.rotation.x += 1.7;
cyl6.rotation.y += 0.9;
cyl6.rotation.z -= 1.0;
isle.add(cyl6);

geometry = new THREE.TetrahedronGeometry( 3.8, 0 );
var	cyl7 = new THREE.Mesh( geometry, material );
cyl7.position.set( -5, 0.4, 1.5 );
cyl7.castShadow = true;
cyl7.receiveShadow = true;
cyl7.rotation.x += 0.8;
cyl7.rotation.y += 0.5;
cyl7.rotation.z += 0.3;
isle.add(cyl7);

geometry = new THREE.TetrahedronGeometry( 5.2, 0 );
var	cyl8 = new THREE.Mesh( geometry, material );
cyl8.position.set( 2, 0, -4 );
cyl8.castShadow = true;
cyl8.receiveShadow = true;
cyl8.rotation.x -= 0.7;
cyl8.rotation.y -= 0.4;
cyl8.rotation.z -= 1.1;
isle.add(cyl8);

geometry = new THREE.DodecahedronGeometry( 1, 0 );
material = new THREE.MeshLambertMaterial( { color: 0x908880 } );
var	stone = new THREE.Mesh( geometry, material );
stone.position.set( -1.2, -1.5, 3.5 );
stone.castShadow = true;
stone.receiveShadow = true;
stone.rotation.z -= 0.5;
isle.add(stone);

var stone2 = stone.clone();
stone2.position.set( -3, -0.6, -5 );
stone2.rotation.y += 0.8;
isle.add(stone2);

var stone3 = stone.clone();
stone3.position.set( 3.8, -1, -4.1 );
stone3.rotation.y += 0.3;
isle.add(stone3);

var stone4 = stone.clone();
stone4.position.set( 5.2, 0.6, 3 );
stone4.rotation.y += 0.5;
isle.add(stone4);

geometry = new THREE.DodecahedronGeometry( 1.7, 0 );
material = new THREE.MeshLambertMaterial( { color: 0x706660 } );
var	rock = new THREE.Mesh( geometry, material );
rock.position.set( 7.1, 2.8, 0 );
rock.castShadow = true;
rock.receiveShadow = true;
rock.rotation.x -= 0.8;
isle.add(rock);

geometry = new THREE.DodecahedronGeometry( 1.2, 0 );
var	rock2 = new THREE.Mesh( geometry, material );
rock2.position.set( 9.45, 2, 0 );
rock2.castShadow = true;
rock2.receiveShadow = true;
rock2.rotation.z -= 0.3;
isle.add(rock2);

geometry = new THREE.DodecahedronGeometry( 0.5, 0 );
var	rock3 = new THREE.Mesh( geometry, material );
rock3.position.set( -4.73, 2.5, 7.1 );
rock3.castShadow = true;
rock3.receiveShadow = true;
isle.add(rock3);

geometry = new THREE.DodecahedronGeometry( 0.3, 0 );
var	rock4 = new THREE.Mesh( geometry, material );
rock4.position.set( -5.3, 2.3, 6.7 );
rock4.castShadow = true;
rock4.receiveShadow = true;
isle.add(rock4);

var rock5 = rock3.clone();
rock5.position.set( -6.7, 3, 0 );
isle.add(rock5);

var rock6 = rock4.clone();
rock6.position.set( -6.9, 2.9, 1 );
isle.add(rock6);

geometry = new THREE.CylinderGeometry( 0.4, 3, 8, 5, 5 );
material = new THREE.MeshLambertMaterial( {color: 0x655e57, shading: THREE.FlatShading } );
var mountain = new THREE.Mesh( geometry, material );
mountain.position.set( 0, 6.5, -0.5 );
mountain.castShadow = true;
mountain.receiveShadow = true;
mountain.rotation.y -= 0.3;
isle.add(mountain);

geometry = new THREE.CylinderGeometry( 0.3, 2.6, 6.5, 5, 6 );
var mountain2 = new THREE.Mesh( geometry, material );
mountain2.position.set( 2, 5.5, 1.2 );
mountain2.castShadow = true;
mountain2.receiveShadow = true;
mountain2.rotation.y += 0.3;
isle.add(mountain2);

geometry = new THREE.CylinderGeometry( 0.25, 2.6, 5, 5, 6 );
var mountain3 = new THREE.Mesh( geometry, material );
mountain3.position.set( -3.5, 5, -0.5 );
mountain3.castShadow = true;
mountain3.receiveShadow = true;
isle.add(mountain3);

geometry = new THREE.CylinderGeometry( 0.2, 2.4, 6, 5, 6 );
material = new THREE.MeshLambertMaterial( {color: 0x554e47, shading: THREE.FlatShading } );
var mountain4 = new THREE.Mesh( geometry, material );
mountain4.position.set( -2.2, 5.5, -0.25 );
mountain4.castShadow = true;
mountain4.receiveShadow = true;
mountain4.rotation.y += 0.7;
isle.add(mountain4);

geometry = new THREE.CylinderGeometry( 0.3, 2.6, 4, 5, 6 );
var mountain5 = new THREE.Mesh( geometry, material );
mountain5.position.set( 2.2, 5, -0.3 );
mountain5.castShadow = true;
mountain5.receiveShadow = true;
mountain5.rotation.y -= 0.2;
isle.add(mountain5);

geometry = new THREE.CylinderGeometry( 0.25, 0.4, 2.2, 5, 5 );
material = new THREE.MeshLambertMaterial( {color: 0x776550, shading: THREE.FlatShading } );
var trunk = new THREE.Mesh( geometry, material );
trunk.position.set( 4.8, 3.8, 5 );
trunk.castShadow = true;
trunk.receiveShadow = true;
trunk.rotation.y -= 0.3;
isle.add(trunk);

geometry = new THREE.CylinderGeometry( 0.1, 0.2, 1.2, 5, 5 );
var trunk2 = new THREE.Mesh( geometry, material );
trunk2.position.set( 5.3, 4.4, 5 );
trunk2.castShadow = true;
trunk2.receiveShadow = true;
trunk2.rotation.z -= 0.9;
isle.add(trunk2);

var trunk3 = trunk2.clone();
trunk3.position.set( 4.3, 4.2, 4.7 );
trunk3.rotation.y -= 0.6;
trunk3.rotation.z += 1.8;
isle.add(trunk3);

var trunk4 = trunk2.clone();
trunk4.position.set( 4.7, 4.3, 5.3 );
trunk4.rotation.y += 1.2;
trunk4.rotation.z += 1.8;
isle.add(trunk4);

geometry = new THREE.IcosahedronGeometry( 1.2, 0 );
material = new THREE.MeshLambertMaterial( { color: 0x22aa33 } );
var	tree = new THREE.Mesh( geometry, material );
tree.position.set( 4.8, 5.8, 5 );
tree.castShadow = true;
tree.receiveShadow = true;
tree.rotation.y -= 0.3;
isle.add(tree);

geometry = new THREE.IcosahedronGeometry( 0.8, 0 );
var	tree2 = new THREE.Mesh( geometry, material );
tree2.position.set( 6.2, 5, 5 );
tree2.castShadow = true;
tree2.receiveShadow = true;
tree2.rotation.y -= 0.3;
isle.add(tree2);

var tree3 = tree2.clone();
tree3.position.set( 3.9, 4.8, 4.2 );
tree3.rotation.y += 0.3;
isle.add(tree3);

geometry = new THREE.IcosahedronGeometry( 0.6, 0 );
var	tree4 = new THREE.Mesh( geometry, material );
tree4.position.set( 4.4, 4.9, 5.9 );
tree4.castShadow = true;
tree4.receiveShadow = true;
tree4.rotation.y -= 0.8;
isle.add(tree4);

var trunkb = trunk.clone();
trunkb.position.set( -4, 3.2, 7.3 );
trunkb.rotation.x += 0.2;
trunkb.rotation.y -= 0.3;
trunkb.rotation.z += 0.1;
isle.add(trunkb);

var trunkb2 = trunk2.clone();
trunkb2.position.set( -3.7, 3.6, 7.7 );
trunkb2.rotation.y -= 0.8;
isle.add(trunkb2);

var trunkb3 = trunk2.clone();
trunkb3.position.set( -4.5, 3.8, 7.3 );
trunkb3.rotation.y -= 0.1;
trunkb3.rotation.z += 1.8;
isle.add(trunkb3);

var treeb = tree.clone();
treeb.position.set( -4, 5.1, 7.5 );
treeb.rotation.x += 0.3;
isle.add(treeb);

var treeb2 = tree2.clone();
treeb2.position.set( -3.1, 4.35, 8.2 );
isle.add(treeb2);

var treeb3 = tree2.clone();
treeb3.position.set( -5.2, 4.6, 7.4 );
isle.add(treeb3);

geometry = new THREE.CylinderGeometry( 0.17, 0.22, 1.5, 5, 5 );
material = new THREE.MeshLambertMaterial( {color: 0x77604a, shading: THREE.FlatShading } );
var ptrunk = new THREE.Mesh( geometry, material );
ptrunk.position.set( 0, 3.5, -6 );
ptrunk.castShadow = true;
ptrunk.receiveShadow = true;
ptrunk.rotation.y -= 0.3;
isle.add(ptrunk);

var ptrunk2 = ptrunk.clone();
ptrunk2.position.set( -2.5, 3.3, -5 );
isle.add(ptrunk2);

var ptrunk3 = ptrunk.clone();
ptrunk3.position.set( -5, 3.1, -5.5 );
isle.add(ptrunk3);

var ptrunk4 = ptrunk.clone();
ptrunk4.position.set( 3, 3.6, -4.8 );
isle.add(ptrunk4);

geometry = new THREE.CylinderGeometry( 0.1, 1, 1.2, 6, 6 );
material = new THREE.MeshLambertMaterial( {color: 0x005610, shading: THREE.FlatShading } );
var ptree1 = new THREE.Mesh( geometry, material );
ptree1.position.set( 0, 4.5, -6 );
ptree1.castShadow = true;
ptree1.receiveShadow = true;
isle.add(ptree1);

geometry = new THREE.CylinderGeometry( 0.08, 0.75, 1, 6, 6 );
var ptree2 = new THREE.Mesh( geometry, material );
ptree2.position.set( 0, 5.1, -6 );
ptree2.castShadow = true;
ptree2.receiveShadow = true;
ptree2.rotation.y -= 0.4;
isle.add(ptree2);

geometry = new THREE.CylinderGeometry( 0.04, 0.5, 0.8, 6, 6 );
var ptree3 = new THREE.Mesh( geometry, material );
ptree3.position.set( 0, 5.7, -6 );
ptree3.castShadow = true;
ptree3.receiveShadow = true;
ptree3.rotation.y -= 0.8;
isle.add(ptree3);

var ptree4 = ptree1.clone();
ptree4.position.set( -2.5, 4.3, -5 );
ptree4.rotation.y -= 0.4;
isle.add(ptree4);

var ptree5 = ptree2.clone();
ptree5.position.set( -2.5, 4.9, -5 );
ptree5.rotation.y -= 0.8;
isle.add(ptree5);

var ptree6 = ptree3.clone();
ptree6.position.set( -2.5, 5.5, -5 );
ptree6.rotation.y -= 1.2;
isle.add(ptree6);

var ptree7 = ptree1.clone();
ptree7.position.set( -5, 4.3, -5.5 );
isle.add(ptree7);

var ptree8 = ptree2.clone();
ptree8.position.set( -5, 4.9, -5.5 );
isle.add(ptree8);

var ptree9 = ptree3.clone();
ptree9.position.set( -5, 5.5, -5.5 );
isle.add(ptree9);

var ptree10 = ptree1.clone();
ptree10.position.set( 3, 4.8, -4.8 );
isle.add(ptree10);

var ptree11 = ptree2.clone();
ptree11.position.set( 3, 5.4, -4.8 );
isle.add(ptree11);

var ptree12 = ptree3.clone();
ptree12.position.set( 3, 6, -4.8 );
isle.add(ptree12);

geometry = new THREE.DodecahedronGeometry( 0.6, 0 );
material = new THREE.MeshLambertMaterial( { color: 0x117020 } );
var	bush = new THREE.Mesh( geometry, material );
bush.position.set( -0.9, 3, 2.6 );
bush.castShadow = true;
bush.receiveShadow = true;
bush.rotation.y += 0.5;
isle.add(bush);

geometry = new THREE.DodecahedronGeometry( 0.4, 0 );
var	bush2 = new THREE.Mesh( geometry, material );
bush2.position.set( -1.7, 2.8, 2.6 );
bush2.castShadow = true;
bush2.receiveShadow = true;
bush2.rotation.y -= 0.5;
isle.add(bush2);

var bush3 = bush2.clone();
bush3.position.set( -0.15, 2.8, 2.8 );
bush3.rotation.y -= 0.9;
isle.add(bush3);

var bush4 = bush.clone();
bush4.position.set( 4.6, 3.5, -0.3 );
isle.add(bush4);

var bush5 = bush2.clone();
bush5.position.set( 4.6, 3.5, 0.45 );
isle.add(bush5);

var bush6 = bush2.clone();
bush6.position.set( 5.35, 3.5, -0.4 );
isle.add(bush6);

geometry = new THREE.IcosahedronGeometry( 1.5, 0 );
material = new THREE.MeshLambertMaterial( { color: 0xcccccc } );
var	cloud = new THREE.Mesh( geometry, material );
cloud.position.set( -5.1, 12.8, 3.5 );
cloud.castShadow = true;
cloud.receiveShadow = true;
cloud.rotation.z -= 0.4;
ulap.add(cloud);

geometry = new THREE.IcosahedronGeometry( 1, 0 );
var	cloud2 = new THREE.Mesh( geometry, material );
cloud2.position.set( -6.6, 12.7, 2.4 );
cloud2.castShadow = true;
cloud2.receiveShadow = true;
cloud2.rotation.y += 0.7;
ulap.add(cloud2);

var cloud3 = cloud2.clone();
cloud3.position.set( -3.9, 12.7, 4.6 );
cloud3.rotation.x -= 0.9;
ulap.add(cloud3);

var cloud4 = cloud.clone();
cloud4.position.set( 3.9, 10.6, 3.8 );
ulap.add(cloud4);

var cloud5 = cloud2.clone();
cloud5.position.set( 2.2, 10.6, 4.6 );
ulap.add(cloud5);

var cloud6 = cloud2.clone();
cloud6.position.set( 5.4, 10.6, 3 );
ulap.add(cloud6);

var cloud7 = cloud.clone();
cloud7.position.set( 2.5, 13.3, -3.8 );
ulap.add(cloud7);

var cloud8 = cloud2.clone();
cloud8.position.set( 1, 13.3, -4.9 );
ulap.add(cloud8);

var cloud9 = cloud2.clone();
cloud9.position.set( 4.2, 13.3, -2.9 );
ulap.add(cloud9);

geometry = new THREE.RingGeometry( 5.4, 5.8, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0xee0000, emissive: 0xee0000, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow = new THREE.Mesh( geometry, material );
rainbow.position.set( -0.6, 12, 3.7 );
rainbow.rotation.y -= 0.02;
ulap.add(rainbow);

geometry = new THREE.RingGeometry( 5.1, 5.5, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0xee4400, emissive: 0xee4400, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow2 = new THREE.Mesh( geometry, material );
rainbow2.position.set( -0.6, 11.9, 3.7 );
rainbow2.rotation.y -= 0.02;
ulap.add(rainbow2);

geometry = new THREE.RingGeometry( 4.8, 5.2, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0xeeaa00, emissive: 0xeeaa00, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow3 = new THREE.Mesh( geometry, material );
rainbow3.position.set( -0.6, 11.8, 3.7 );
rainbow3.rotation.y -= 0.02;
ulap.add(rainbow3);

geometry = new THREE.RingGeometry( 4.5, 4.9, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0x00dd00, emissive: 0x00dd00, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow4 = new THREE.Mesh( geometry, material );
rainbow4.position.set( -0.6, 11.7, 3.7 );
rainbow4.rotation.y -= 0.02;
ulap.add(rainbow4);

geometry = new THREE.RingGeometry( 4.2, 4.6, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0x0000dd, emissive: 0x0000dd, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow5 = new THREE.Mesh( geometry, material );
rainbow5.position.set( -0.6, 11.6, 3.7 );
rainbow5.rotation.y -= 0.02;
ulap.add(rainbow5);

geometry = new THREE.RingGeometry( 3.9, 4.3, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0x490085, emissive: 0x490085, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow6 = new THREE.Mesh( geometry, material );
rainbow6.position.set( -0.6, 11.5, 3.7 );
rainbow6.rotation.y -= 0.02;
ulap.add(rainbow6);

geometry = new THREE.RingGeometry( 3.6, 4, 6, 6, -0.23, Math.PI );
material = new THREE.MeshLambertMaterial( {color: 0x440e62, emissive: 0x440e62, shading: THREE.FlatShading, side: THREE.DoubleSide} );
var rainbow7 = new THREE.Mesh( geometry, material );
rainbow7.position.set( -0.6, 11.4, 3.7 );
rainbow7.rotation.y -= 0.02;
ulap.add(rainbow7);

var loada = new THREE.TextureLoader();
loada.load(
	'imj/well.jpg',
	function ( tex ) {
		geometry = new THREE.CylinderGeometry( 0.8, 0.8, 1.4, 8, 8, true );
		material = new THREE.MeshLambertMaterial( {map: tex, shading: THREE.FlatShading } );
		var well = new THREE.Mesh( geometry, material );
		well.position.set( 1.2, 3, 6.5 );
		well.castShadow = true;
		well.receiveShadow = true;
		isle.add(well);
	},	function ( xhr ) {}, function ( xhr ) {}
);

geometry = new THREE.CylinderGeometry( 0.75, 0.75, 1.4, 8, 8, true );
material = new THREE.MeshLambertMaterial( {color: 0x414243, shading: THREE.FlatShading, side: THREE.BackSide } );
var well2 = new THREE.Mesh( geometry, material );
well2.position.set( 1.2, 3, 6.5 );
well2.castShadow = true;
well2.receiveShadow = true;
isle.add(well2);

geometry = new THREE.TorusGeometry( 0.8, 0.08, 8, 8 );
material = new THREE.MeshLambertMaterial( { color: 0x515253, shading: THREE.FlatShading } );
var wellt = new THREE.Mesh( geometry, material );
wellt.position.set( 1.2, 3.75, 6.5 );
wellt.castShadow = true;
wellt.receiveShadow = true;
wellt.rotation.x -= Math.PI/2;
isle.add(wellt);

geometry = new THREE.CircleGeometry( 0.8, 8 );
material = new THREE.MeshLambertMaterial( { color: 0x000d1a, shading: THREE.FlatShading } );
var wellb = new THREE.Mesh( geometry, material );
wellb.position.set( 1.2, 3.15, 6.5 );
wellb.receiveShadow = true;
wellb.rotation.x -= Math.PI/2;
isle.add(wellb);

geometry = new THREE.CylinderGeometry( 0.07, 0.07, 1, 6, 6 );
material = new THREE.MeshLambertMaterial( {color: 0x654525, shading: THREE.FlatShading } );
var wellw = new THREE.Mesh( geometry, material );
wellw.position.set( 1.89, 4.2, 6.76 );
wellw.castShadow = true;
wellw.receiveShadow = true;
isle.add(wellw);

var wellw2 = wellw.clone();
wellw2.position.set( 0.52, 4.2, 6.22 );
isle.add(wellw2);

geometry = new THREE.CylinderGeometry( 0.03, 0.03, 1.85, 6, 6 );
var wellw3 = new THREE.Mesh( geometry, material );
wellw3.position.set( 1.3, 4.3, 6.53 );
wellw3.castShadow = true;
wellw3.receiveShadow = true;
wellw3.rotation.y -= 0.38;
wellw3.rotation.z -= Math.PI/2;
isle.add(wellw3);

geometry = new THREE.CylinderGeometry( 0.03, 0.03, 0.3, 6, 6 );
var wellw4 = new THREE.Mesh( geometry, material );
wellw4.position.set( 2.13, 4.15, 6.87 );
wellw4.castShadow = true;
wellw4.receiveShadow = true;
isle.add(wellw4);

var wellw5 = wellw4.clone();
wellw5.position.set( 2.25, 4.02, 6.915 );
wellw5.rotation.y -= 0.38;
wellw5.rotation.z -= Math.PI/2;
isle.add(wellw5);

geometry = new THREE.CylinderGeometry( 0.01, 0.01, 0.25, 5, 5 );
material = new THREE.MeshLambertMaterial( {color: 0x655e55, shading: THREE.FlatShading } );
var welll = new THREE.Mesh( geometry, material );
welll.position.set( 1.2, 4.17, 6.53 );
welll.castShadow = true;
welll.receiveShadow = true;
isle.add(welll);

geometry = new THREE.CylinderGeometry( 0.04, 0.04, 0.1, 6, 6 );
var welll2 = new THREE.Mesh( geometry, material );
welll2.position.set( 1.22, 4.3, 6.5 );
welll2.castShadow = true;
welll2.receiveShadow = true;
welll2.rotation.y -= 0.38;
welll2.rotation.z -= Math.PI/2;
isle.add(welll2);

geometry = new THREE.TorusGeometry( 0.17, 0.01, 8, 8, Math.PI*1.2 );
material = new THREE.MeshLambertMaterial( { color: 0x858687, shading: THREE.FlatShading, side: THREE.DoubleSide } );
var welln = new THREE.Mesh( geometry, material );
welln.position.set( 1.2, 3.91, 6.51 );
welln.castShadow = true;
welln.receiveShadow = true;
welln.rotation.z -= 0.3;
isle.add(welln);

geometry = new THREE.CylinderGeometry( 0.17, 0.17, 0.3, 8, 8, true );
var welln2 = new THREE.Mesh( geometry, material );
welln2.position.set( 1.2, 3.79, 6.51 );
welln2.castShadow = true;
welln2.receiveShadow = true;
isle.add(welln2);

geometry = new THREE.CircleGeometry( 0.145, 8 );
material = new THREE.MeshLambertMaterial( { color: 0x334450, shading: THREE.FlatShading } );
var welln3 = new THREE.Mesh( geometry, material );
welln3.position.set( 1.2, 3.9, 6.51 );
welln3.receiveShadow = true;
welln3.rotation.x -= Math.PI/2;
isle.add(welln3);

geometry = new THREE.CylinderGeometry( 0.05, 1, 0.7, 8, 8 );
material = new THREE.MeshLambertMaterial( {color: 0x553311, shading: THREE.FlatShading } );
var wellc = new THREE.Mesh( geometry, material );
wellc.position.set( 1.2, 5, 6.5 );
wellc.castShadow = true;
wellc.receiveShadow = true;
isle.add(wellc);

scene.add(isle);
scene.add(ulap);
isle.position.y=-2;
ulap.position.y-=2;

geometry = new THREE.IcosahedronGeometry( 100, 2 );
material = new THREE.MeshLambertMaterial( {color: 0xd1eaf4, shading: THREE.FlatShading, side: THREE.BackSide} );
var sky = new THREE.Mesh( geometry, material );
scene.add( sky );
sky.rotation.z += 0.75;

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.setClearColor(0xd1eaf4, 0);
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
		if ((camera.position.x<-0.2) || (camera.position.y<12) && (camera.position.z<50)) {
			camera.position.x += 0.034;
			camera.position.y += 0.2;
			camera.position.z += 0.32;
		} else {
			entro = false;
		}
	}

	x += 0.0015; y += 0.0015; z += 0.0015; 	
	cloud.rotation.set(-x,-y,-z);
	cloud2.rotation.set(x,y,z);
	cloud3.rotation.set(-x,y,-z);
	cloud4.rotation.set(-x,-y,-z);
	cloud5.rotation.set(x,y,z);
	cloud6.rotation.set(x,-y,z);
	cloud7.rotation.set(-x,-y,-z);
	cloud8.rotation.set(x,y,z);
	cloud9.rotation.set(-x,y,-z);
	
	isle.rotation.y += 0.001;

	camera.lookAt( scene.position );
	renderer.render(scene, camera);	
}

