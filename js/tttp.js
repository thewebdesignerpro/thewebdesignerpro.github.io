/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, arw, x = y = z = pis = 0, pif = 1, ntro = true;	
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

if (!Detector.webgl) Detector.addGetWebGLMessage();

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

//var nebu = THREE.ImageUtils.loadTexture( 'imj/shade/grd1.png' );

var container = document.getElementById('container');
//container.style.opacity = 0;
var canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
//gradient.addColorStop(0, "#3f4255");
gradient.addColorStop(0, "#393c4f");
gradient.addColorStop(0.5, "#515763");
gradient.addColorStop(1, "#515763");
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);
container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
//container.style.background = 'url(imj/shade/grd1.png)';
container.style.backgroundSize = '32px 100%';


var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.gammaInput = true;
//renderer.gammaOutput = true;
container.appendChild(renderer.domElement);


//var nebu = THREE.ImageUtils.loadTexture( 'imj/shade/grd1.png', undefined, neB );
//var nebu = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/2.jpg", undefined, neB );
//var nebu = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/2b.jpg", undefined, neB );
//var clfMap = THREE.ImageUtils.loadTexture( "imj/shade/sand1.jpg" );
//var clfMap = THREE.ImageUtils.loadTexture( "imj/shade/dia1.png", undefined, clF );
var clfMap = THREE.ImageUtils.loadTexture( "imj/shade/dia1.png", undefined, hoL );
//var clfMap = THREE.ImageUtils.loadTexture( "imj/shade/dirt3.jpg", undefined, clF );
var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/sand2.jpg" );
//var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/4.jpg" );
//var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/4b.jpg" );
//var diffMap = THREE.ImageUtils.loadTexture( "imj/shade/noise2.jpg" );
//var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade1.jpg", undefined, mF );
//var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/transition1.png", undefined, mF );
//var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade5.jpg", undefined, mF );
//var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade6.jpg", undefined, mF );
var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade8.jpg", undefined, mF );
//var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade9.jpg", undefined, mF );
//var dispMap = THREE.ImageUtils.loadTexture( "imj/shade/shade7.jpg", undefined, mF );
//var glw = THREE.ImageUtils.loadTexture('imj/arw2.png');
var bwn = THREE.ImageUtils.loadTexture('imj/munr.jpg', undefined, bwan);
//var bwn = THREE.ImageUtils.loadTexture('imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/5.jpg', undefined, bwan);
//var bwn = THREE.ImageUtils.loadTexture('imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/5b.jpg', undefined, bwan);
var pyr = THREE.ImageUtils.loadTexture('imj/shade/brick1.jpg', undefined, pyRa);
//var pyr = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/3.jpg", undefined, pyRa );
//var pyr = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/3b.jpg", undefined, pyRa );
//var tttT = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/5.jpg", undefined, pyRa );
//var tttT = THREE.ImageUtils.loadTexture( "imj/shade/tmp/tropical_abstract_patterns___1_by_webtreatsetc/5b.jpg", undefined, pyRa );

//nebu.wrapS = nebu.wrapT = diffMap.wrapS = diffMap.wrapT = pyr.wrapS = pyr.wrapT = THREE.RepeatWrapping;
//clfMap.wrapS = clfMap.wrapT = tttT.wrapS = tttT.wrapT =  THREE.RepeatWrapping;
clfMap.wrapS = clfMap.wrapT = THREE.RepeatWrapping;
//nebu.wrapS = nebu.wrapT = THREE.MirroredRepeatWrapping;
diffMap.wrapS = diffMap.wrapT = pyr.wrapS = pyr.wrapT = THREE.RepeatWrapping;
//clfMap.repeat.set(3,3);
//clfMap.repeat.set(8,8);
//clfMap.repeat.set(16,16);
//clfMap.repeat.set(16,8);
clfMap.repeat.set(32,16);
//tttT.repeat.set(1,1);
//nebu.repeat.set(4,4);
//nebu.repeat.set(8,8);
diffMap.repeat.set( 2, 2);
//diffMap.repeat.set( 4, 4);
diffMap.repeat.set( 8, 8);
diffMap.repeat.set( 16, 16);
//diffMap.repeat.set( 32, 32);
//diffMap.repeat.set( 48, 48);
pyr.repeat.set( 24, 24 );
//pyr.repeat.set( 4, 1 );

var camera = new THREE.PerspectiveCamera( 50, ww/wh,  0.1, 10000 );
camera.position.set( 0, 10, 40 );
camera.position.set( 0, 10, 44 );
camera.position.set( 0, 4, 44 );
var scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2( 0x515763, 0.03 );
scene.fog = new THREE.FogExp2( 0x515763, 0.018 );
//scene.fog = new THREE.FogExp2( 0x565656, 0.015 );
//camera.lookAt( scene.position );

//var alight = new THREE.AmbientLight( 0x777777 );
var alight = new THREE.AmbientLight( 0x222222 );
scene.add( alight );
var light = new THREE.PointLight( 0xffffff, 6, 70 );
//var light = new THREE.PointLight( 0xffffff, 6, 200 );
light.position.set( 0, 5.5, -25 );
//light.position.set( 0, 9, -28 );
scene.add( light );
var spotL = new THREE.SpotLight( 0xffffff, 5, 60, Math.PI/3 );
spotL.position.set( 0, 5.5, -25 );
//spotL.position.set( 0, 9, -28 );
spotL.onlyShadow = true;
spotL.castShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.35;
spotL.shadowCameraNear = 5;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 150;
scene.add( spotL );

/*var neb;
function neB() {
	//var geometry = new THREE.SphereGeometry( 800, 32, 32 );
	//var geometry = new THREE.SphereGeometry( 160, 32, 32 );
	//var geometry = new THREE.SphereGeometry( 160, 16, 16 );
	var geometry = new THREE.SphereGeometry( 160, 16, 16, 0, Math.PI*2, 0, Math.PI/1.6 );
	//var material = new THREE.MeshLambertMaterial( {map: tex, overdraw: 0.5, side: THREE.BackSide } );
	//var material = new THREE.MeshLambertMaterial( { map: nebu, overdraw: 0.5, side: THREE.BackSide, transparent: true, opacity: 0.93, wireframe: false, fog: false } );
	//var material = new THREE.MeshLambertMaterial( { emissive: 0x202020, map: nebu, overdraw: 0.5, side: THREE.BackSide, wireframe: false, fog: false } );
	var material = new THREE.MeshLambertMaterial( { map: nebu, overdraw: 0.5, side: THREE.BackSide, wireframe: false, fog: false, transparent: true, opacity: 0.8 } );
	neb = new THREE.Mesh( geometry, material );
	neb.receiveShadow = false;
	neb.position.set(0, 0, 0);
	scene.add( neb );
}*/


geom = new THREE.Geometry();
for ( var i = 0; i < 2500; i ++ ) {
    var vertex = new THREE.Vector3();
    do {
        vertex.x = 720 * Math.random() - 360;
        vertex.y = 720 * Math.random() - 360;
        vertex.z = 720 * Math.random() - 360;
    } while ( vertex.length() > 360 || vertex.length() < 180 );
    geom.vertices.push( vertex );
}
geom.computeBoundingSphere();
mater = new THREE.PointsMaterial( { size: 1.5, sizeAttenuation: true } );
var particle = new THREE.Points( geom, mater );
scene.add( particle );



var mesh;
function mF() {
	//mater = new THREE.MeshPhongMaterial({ map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -3.7, displacementBias: 0 });
	//mater = new THREE.MeshPhongMaterial({ color: 0xb6695e, map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -5.0, displacementBias: 0 });
	//mater = new THREE.MeshPhongMaterial({ color: 0xd59268, map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -7.0, displacementBias: 0 });
	//mater = new THREE.MeshPhongMaterial({ color: 0x644020, map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -10.0, displacementBias: 0 });
	mater = new THREE.MeshPhongMaterial({ color: 0x914e3e, map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -20.0, displacementBias: 0 });
	//mater = new THREE.MeshPhongMaterial({ color: 0x914e3e, map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: 20.0, displacementBias: 0 });
	//mater = new THREE.MeshPhongMaterial({ color: 0x7f6f5f, map: diffMap, shininess: 1, aoMap: dispMap, aoMapIntensity: 1, displacementMap: dispMap, displacementScale: -10.0, displacementBias: 0 });
	//geom = new THREE.PlaneGeometry( 64, 64, 64, 64 );
	//geom = new THREE.PlaneGeometry( 160, 160, 64, 64 );
	geom = new THREE.PlaneGeometry( 168, 168, 64, 64 );
	//geom = new THREE.PlaneGeometry( 160, 160, 96, 96 );
	//geom = new THREE.CircleGeometry( 160, 32 );
	mesh = new THREE.Mesh(geom, mater);
	mesh.position.set(0, -2, -7);
	mesh.position.set(0, -0.75, -7);
	mesh.position.set(0, -0.75, 0);
	mesh.position.set(0, 3.6, 0);
//	mesh.position.set(0, -16, 0);
	mesh.rotation.x += Math.PI/2;
	mesh.rotation.y -= Math.PI;
	//mesh.rotation.z += Math.PI/2;
	mesh.material.side = THREE.FrontSide;
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	//mesh.material.wireframe = true;
	//mesh.material.fog = false;
	scene.add(mesh);
}

var mun;
function bwan() {
	var mater = new THREE.MeshLambertMaterial({ map: bwn, color: 0x902010, emissive: 0x201010, side: THREE.FrontSide, overdraw: 0.5, fog: false });
	//var mater = new THREE.MeshLambertMaterial({ map: bwn, color: 0x5090a0, emissive: 0x102b30, side: THREE.FrontSide, overdraw: 0.5, fog: false, combine: THREE.AddOperation });
	var mater = new THREE.MeshLambertMaterial({ map: bwn, color: 0x0066aa, emissive: 0x002030, side: THREE.FrontSide, overdraw: 0.5, fog: false });
	var mater = new THREE.MeshLambertMaterial({ map: bwn, color: 0x336690, emissive: 0x566b76, side: THREE.FrontSide, overdraw: 0.5, fog: false });
	//var mater = new THREE.MeshLambertMaterial({ map: bwn, color: 0x666666, emissive: 0x444444, side: THREE.FrontSide, overdraw: 0.5, fog: false });
	mun = new THREE.Mesh( new THREE.SphereGeometry( 9, 24, 24 ), mater );
	//mun = new THREE.Mesh( new THREE.SphereGeometry( 9, 16, 16 ), mater );
	mun.position.set(0, 12, -50);
	mun.rotation.x += .3;
	mun.rotation.y -= 1.2;
	scene.add( mun );	
/*	mater = new THREE.MeshLambertMaterial({ map: glw, color: 0xff3311, emissive: 0xff5533, side: THREE.FrontSide, opacity: 0.65, transparent: true, fog: false });
	mater = new THREE.MeshLambertMaterial({ map: glw, color: 0x0099cc, emissive: 0x004a70, side: THREE.FrontSide, opacity: 0.5, transparent: true, fog: false });
	mater = new THREE.MeshLambertMaterial({ map: glw, color: 0x336690, emissive: 0x224460, side: THREE.FrontSide, opacity: 0.5, transparent: true, fog: false });
	//arw = new THREE.Mesh( new THREE.PlaneGeometry( 25, 25 ), mater );
	arw = new THREE.Mesh( new THREE.PlaneGeometry( 60, 60 ), mater );
	arw.position.set(0, 10, -50);
	arw.castShadow = false;
	arw.receiveShadow = false;
	scene.add( arw );		*/
	
	var geometry = new THREE.IcosahedronGeometry(8.9, 4);
	var material = new THREE.MeshBasicMaterial( { color	: 0x000000, opacity: 0, transparent: true } );
	var eglow = new THREE.Mesh( geometry, material );
	eglow.position.set(0, 12, -50);
	scene.add( eglow );	
	var glowM1 = new THREEx.GeometricGlowMesh(eglow, 2.6, 0.05, 4.0);
	//var glowM1 = new THREEx.GeometricGlowMesh(eglow, 9.0, 0.1, 3.6);
	eglow.add(glowM1.object3d);
	var ouni = glowM1.outsideMesh.material.uniforms;
	ouni.glowColor.value.set('#88afc8');	
	//ouni.glowColor.value.set('#aaccee');	
}

var pyrG = new THREE.Group();		
var pyrG2 = new THREE.Group();		

function pyRa() {
	var mater = new THREE.MeshLambertMaterial({ color: 0x777370, map: pyr, side: THREE.FrontSide, overdraw: 0.5, fog: true });
	var mater = new THREE.MeshLambertMaterial({ color: 0x805e55, map: pyr, side: THREE.FrontSide, overdraw: 0.5, fog: true });
	//var mater = new THREE.MeshLambertMaterial({ color: 0xbd6269, map: pyr, side: THREE.FrontSide, overdraw: 0.5, fog: true });
	//var pyram = new THREE.Mesh( new THREE.CylinderGeometry( 0.06, 5, 3.0902, 4 ), mater );
	//var pyram = new THREE.Mesh( new THREE.CylinderGeometry( 0.09, 7.5, 4.6353, 4, 1, true ), mater );
	var pyram = new THREE.Mesh( new THREE.CylinderGeometry( 0.12, 10, 6.1804, 4, 1, true ), mater );
	pyram.position.set(0, -5.1, -6);
	pyram.rotation.y += Math.PI/4;
	pyram.castShadow = true;
	pyram.receiveShadow = true;	
	pyrG.add( pyram );	
	var pyram2 = pyram.clone();
	pyram2.position.set(0, -5.1, -20);
	pyrG.add( pyram2 );		
	var pyram3 = pyram.clone();
	pyram3.position.set(14, -5.1, -6);
	pyrG.add( pyram3 );		
	
	var pyram4 = pyram.clone();
	pyrG2.add( pyram4 );	
	pyram4.position.set(0, -5.1, -6);
	var pyram5 = pyram.clone();
	pyram5.position.set(0, -5.1, -20);
	pyrG2.add( pyram5 );		
	var pyram6 = pyram.clone();
	pyram6.position.set(-14, -5.1, -6);
	pyrG2.add( pyram6 );	


	pyrG2.add( pyram4 );	
	pyrG2.add( pyram5 );		
	pyrG2.add( pyram6 );	
	
	pyrG.position.x = -16;
	pyrG.position.z = -3;
	pyrG.rotation.y += Math.PI/4;
	//var pyrG2 = pyrG.clone();
	pyrG2.position.x = 16;
	pyrG2.position.z = -3;
	pyrG2.rotation.y -= Math.PI/4;
}
scene.add(pyrG);
scene.add(pyrG2);

//var tttG = new THREE.Group();	
var ttt, ttt2;
var tttG = new THREE.Geometry();
function ttt3() {
	//color:ccb1aa
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshPhongMaterial( {emissive: 0x66514a, color: 0xccb1aa} );
	//var material = new THREE.MeshPhongMaterial( {map: tttT, emissive: 0x444444} );
	var cube = new THREE.Mesh( geometry, material );
	cube.scale.set(15, 1.6, 3.9);
	var cube2 = new THREE.Mesh( geometry, material );
	cube2.scale.set(1.6, 16, 3.9);	
	var cube3 = new THREE.Mesh( geometry, material );
	cube3.scale.set(1.6, 16, 3.9);
	cube3.position.set(-4.4, 0, 0);	
	var cube4 = new THREE.Mesh( geometry, material );
	cube4.scale.set(1.6, 16, 3.9);
	cube4.position.set(4.4, 0, 0);	
	
	var cube5 = new THREE.Mesh( geometry, material );
	cube5.scale.set(4.4, 1.2, 3.9);
	cube5.position.set(-4.4, 4.4, 0);	
	var cube6 = new THREE.Mesh( geometry, material );
	cube6.scale.set(4.4, 1.2, 3.9);
	cube6.position.set(4.4, 4.4, 0);	
	var cube7 = new THREE.Mesh( geometry, material );
	cube7.scale.set(4.4, 1.2, 3.9);
	cube7.position.set(0, 6, 0);
	
	var cube8 = new THREE.Mesh( geometry, material );
	cube8.scale.set(4.4, 1.2, 3.9);
	cube8.position.set(-4.4, -4.4, 0);	
	var cube9 = new THREE.Mesh( geometry, material );
	cube9.scale.set(4.4, 1.2, 3.9);
	cube9.position.set(4.4, -4.4, 0);	
	var cube10 = new THREE.Mesh( geometry, material );
	cube10.scale.set(4.4, 1.2, 3.9);
	cube10.position.set(0, -6, 0);	
	
	//THREE.GeometryUtils.merge( g, object );
	cube.updateMatrixWorld();
	tttG.merge( cube.geometry, cube.matrixWorld );		
	cube2.updateMatrixWorld();
	tttG.merge( cube2.geometry, cube2.matrixWorld );		
	cube3.updateMatrixWorld();
	tttG.merge( cube3.geometry, cube3.matrixWorld );		
	cube4.updateMatrixWorld();
	tttG.merge( cube4.geometry, cube4.matrixWorld );		
	cube5.updateMatrixWorld();
	tttG.merge( cube5.geometry, cube5.matrixWorld );		
	cube6.updateMatrixWorld();
	tttG.merge( cube6.geometry, cube6.matrixWorld );		
	cube7.updateMatrixWorld();
	tttG.merge( cube7.geometry, cube7.matrixWorld );		
	cube8.updateMatrixWorld();
	tttG.merge( cube8.geometry, cube8.matrixWorld );		
	cube9.updateMatrixWorld();
	tttG.merge( cube9.geometry, cube9.matrixWorld );		
	cube10.updateMatrixWorld();
	tttG.merge( cube10.geometry, cube10.matrixWorld );	

/*	cube.castShadow = true;
	cube.receiveShadow = true;	
	cube2.castShadow = true;
	cube2.receiveShadow = true;	
	cube3.castShadow = true;
	cube3.receiveShadow = true;	
	cube4.castShadow = true;
	cube4.receiveShadow = true;	
	cube5.castShadow = true;
	cube5.receiveShadow = true;	
	cube6.castShadow = true;
	cube6.receiveShadow = true;	
	cube7.castShadow = true;
	cube7.receiveShadow = true;	
	cube8.castShadow = true;
	cube8.receiveShadow = true;	
	cube9.castShadow = true;
	cube9.receiveShadow = true;	
	cube10.castShadow = true;
	cube10.receiveShadow = true;	
	
	tttG.add( cube );
	tttG.add( cube2 );
	tttG.add( cube3 );
	tttG.add( cube4 );
	tttG.add( cube5 );
	tttG.add( cube6 );
	tttG.add( cube7 );	
	tttG.add( cube8 );
	tttG.add( cube9 );
	tttG.add( cube10 );*/
/*	
			tttG.center();
			//var tessellateModifier = new THREE.TessellateModifier( 2 );
			var tessellateModifier = new THREE.TessellateModifier( 1 );
			for ( var i = 0; i < 20; i ++ ) {
				tessellateModifier.modify( tttG );
			}
			var explodeModifier = new THREE.ExplodeModifier();
			explodeModifier.modify( tttG );
			var numFaces = tttG.faces.length;
			tttG = new THREE.BufferGeometry().fromGeometry( tttG );
			var colors = new Float32Array( numFaces * 3 * 3 );
			var displacement = new Float32Array( numFaces * 3 * 3 );
			var color = new THREE.Color();
			for ( var f = 0; f < numFaces; f ++ ) {
				var index = 9 * f;
				//var h = 0.6 * Math.random();
				//var s = 0.5 + 0.5 * Math.random();
				//var l = 0.5 + 0.5 * Math.random();
//				var h = .9;
				//var s = .5;
				//var l = .89;
				var h = .99;
				var s = .1;
				var l = .35;
				color.setHSL( h, s, l );
				var d = 50 * ( 0.5 - Math.random() );
				for ( var i = 0; i < 3; i ++ ) {
					colors[ index + ( 3 * i )     ] = color.r;
					colors[ index + ( 3 * i ) + 1 ] = color.g;
					colors[ index + ( 3 * i ) + 2 ] = color.b;
					displacement[ index + ( 3 * i )     ] = d;
					displacement[ index + ( 3 * i ) + 1 ] = d;
					displacement[ index + ( 3 * i ) + 2 ] = d;
				}
			}
			tttG.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
			tttG.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) );
			uniforms = {
				amplitude: { type: "f", value: 0.0 }
			};
			var shaderMaterial = new THREE.ShaderMaterial( {
				uniforms:       uniforms,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent
			});
			ttt = new THREE.Mesh( tttG, shaderMaterial );
*/	
	ttt2 = new THREE.Mesh( tttG, material );	
	//ttt.castShadow = true;
	//tttG.castShadow = true;
	//ttt.receiveShadow = true;		
	ttt2.castShadow = true;		
//	ttt.scale.set(0.5,0.5,0.5);
	ttt2.scale.set(0.7,0.7,0.7);	
//	scene.add( ttt );
//	ttt2.visible = false;
	scene.add( ttt2 );
//	ttt.position.set(0,10,18);
//	ttt2.position.set(0,10,18);	
//	ttt.position.set(0,10,2);
	ttt2.position.set(0,-13,-7.2);
}
ttt3();

/*
var clif;
function clF() {				
	var loader = new THREE.JSONLoader();
	//loader.load('obj/clif3.json', function (geometry, materials) {
	loader.load('obj/whol3.json', function (geometry, materials) {
		//for (var k in materials) {
			//materials[k].skinning = true;
		//}
		geometry.mergeVertices();
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		//var material = new THREE.MeshPhongMaterial({color: 0x504844, emissive: 0x34302b, map: clfMap, side: THREE.FrontSide, skinning: false, shininess: 10 });
//var material = new THREE.MeshPhongMaterial({color: 0x222222, emissive: 0x222222, map: clfMap, side: THREE.DoubleSide, skinning: false, shininess: 5, shading: THREE.FlatShading });
//var material = new THREE.MeshPhongMaterial({color: 0x815e4e, emissive: 0x815e4e, side: THREE.DoubleSide, skinning: false, shininess: 5, shading: THREE.FlatShading });

var material = [new THREE.MeshPhongMaterial( { color: 0x413e2e, shading: THREE.FlatShading, shininess: 5, opacity: 0.19, transparent: true, map: clfMap } ), 
new THREE.MeshBasicMaterial( { color: 0x716e5e, wireframe: true, opacity: 0.9, transparent: true } )	];
		clif = THREE.SceneUtils.createMultiMaterialObject( geometry, material ); 
		
		//var clif = new THREE.SkinnedMesh(geometry, material);	  
		//clif = new THREE.Mesh(geometry, material);	  
		//clif = new THREE.SkinnedMesh(geometry, material);	  
		//clif = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));	  
		var scale = 2.6;
		var scale = 1.0;
		clif.position.set(4, -12, 28);
		clif.position.set(0, -8.34, 8.2);
		//clif.scale.set(scale, scale, scale*1.05);
		clif.scale.set(scale, scale*0.8, scale);
		clif.scale.set(scale, scale*0.6, scale);
		//clif.rotation.y += Math.PI/2;
		clif.rotation.x += Math.PI;
//		clif.material.wireframe = true;
		clif.castShadow = true;
		clif.receiveShadow = true;
		scene.add(clif);
	});
}	
//clF();
*/

var lathe;
var hol0, hol1, hol2, hol3, hol4, hol5, wHol;
var holE = new THREE.Geometry();
function hoL() {	
	var mmaterial = [new THREE.MeshPhongMaterial( { color: 0x413e2e, shading: THREE.FlatShading, shininess: 5, opacity: 0.5, transparent: true, map: clfMap, side: THREE.BackSide } ), 
					new THREE.MeshBasicMaterial( { color: 0x716e5e, wireframe: true, opacity: 0.5, transparent: true } ) ];
/*	var geometry = new THREE.CylinderGeometry( 13, 11.5, .5, 24, 1, true );
	hol0 = new THREE.Mesh( geometry, material );			
	hol0.position.y = 1.25;
	var material = new THREE.MeshBasicMaterial( {color: 0x413e2e, shading: THREE.FlatShading, opacity: 0.9, transparent: true, side: THREE.BackSide, wireframe: true} );
	var material2 = new THREE.MeshPhongMaterial( {color: 0x413e2e, shading: THREE.FlatShading, shininess: 5, opacity: 0.9, transparent: true, map: dispMap, side: THREE.BackSide} );
	//hol1 = THREE.SceneUtils.createMultiMaterialObject( geometry, material ); 
	var geometry = new THREE.CylinderGeometry( 11.5, 9, 2, 24, 1, true );	
	hol1 = new THREE.Mesh( geometry, material );		
	var geometry = new THREE.CylinderGeometry( 9, 7.2, 2, 24, 1, true );	
	hol2 = new THREE.Mesh( geometry, material );		
	hol2.position.y = -2;
	var geometry = new THREE.CylinderGeometry( 7.2, 5.8, 2, 24, 1, true );	
	hol3 = new THREE.Mesh( geometry, material );		
	hol3.position.y = -4;
	var geometry = new THREE.CylinderGeometry( 5.8, 4.7, 2, 24, 1, true );	
	hol4 = new THREE.Mesh( geometry, material );		
	hol4.position.y = -6;
	var geometry = new THREE.CylinderGeometry( 4.7, 4, 2, 24, 1, true );	
	hol5 = new THREE.Mesh( geometry, material );		
	hol5.position.y = -8;	
	
	hol0.updateMatrixWorld();
	holE.merge( hol0.geometry, hol0.matrixWorld );						
	hol1.updateMatrixWorld();
	holE.merge( hol1.geometry, hol1.matrixWorld );					
	hol2.updateMatrixWorld();
	holE.merge( hol2.geometry, hol2.matrixWorld );				
	hol3.updateMatrixWorld();
	holE.merge( hol3.geometry, hol3.matrixWorld );					
	hol4.updateMatrixWorld();
	holE.merge( hol4.geometry, hol4.matrixWorld );					
	hol5.updateMatrixWorld();
	holE.merge( hol5.geometry, hol5.matrixWorld );						
	
	wHol = new THREE.Mesh( holE, material2 );	
	scene.add( wHol );	
	
	wHol.position.set(0, -8.9, 8);*/
	
	//console.log('t');
	
	var points = [];
	for ( var i = 0; i < 6; i ++ ) {
		points.push( new THREE.Vector3( i*1.9+(i*.1), 3.4, i*2 ) );
	}
	var geometry = new THREE.LatheGeometry( points, 24 );
	var material = new THREE.MeshPhongMaterial( { map: clfMap, side: THREE.BackSide } );
	//var lathe = new THREE.Mesh( geometry, material );
	lathe = THREE.SceneUtils.createMultiMaterialObject( geometry, mmaterial ); 
	scene.add( lathe );
	lathe.castShadow = true;
	lathe.receiveShadow = true;
	lathe.rotation.set(Math.PI*-.5,0,0);
	lathe.position.set(0, -17.95, 8);
	lathe.scale.set(1,1,1);	
}
//hoL();

var torus, torus2;
function holT() {
	var geometry = new THREE.TorusGeometry( 8.6, 1.4, 3, 20 );
	var mmaterial = [new THREE.MeshPhongMaterial( { color: 0x413e2e, shading: THREE.FlatShading, shininess: 5, opacity: 0.5, transparent: true, map: clfMap, side: THREE.DoubleSide } ), 
				new THREE.MeshBasicMaterial( { color: 0x716e5e, wireframe: true, opacity: 0.5, transparent: true } ) ];
	//var torus = new THREE.Mesh( geometry, mmaterial );
	torus = THREE.SceneUtils.createMultiMaterialObject( geometry, mmaterial ); 
	scene.add( torus );	
	torus.rotation.set(Math.PI*-.5,0,0);
	torus.position.set(0, 16, 8);	
	var geometry = new THREE.TorusGeometry( 6.4, 2, 4, 16 );
	//torus2 = torus.clone();
	torus2 = THREE.SceneUtils.createMultiMaterialObject( geometry, mmaterial ); 
	torus2.scale.set(.5,.5,.5);	
	torus2.rotation.set(Math.PI*-.5,0,0);
	torus2.position.set(0, 16, 8);	
	scene.add( torus2 );	
}
holT();

var uav=1.0;
function animate() {
	requestAnimationFrame(animate);
/*	if (ntro) {
		if (pif>0) {
			pif -= 0.01;
			pis += 0.01;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
			container.style.opacity = pis;
		} else {
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			container.style.opacity = 1;
			ntro = false;
		}
	} else {	*/
		//camera.position.x = mouseX*0.03;
	//}	
	
	var timer = new Date().getTime();

	//uniforms.amplitude.value = 1.0 + Math.sin( time * 0.5 );	

	//	mun.rotation.y += .01;
//	neb.rotation.y += .002;
//	neb.material.opacity = .7 + Math.sin( timer * 0.005 )*.3;	
	//camera.position.z = 30 + Math.sin( timer * 0.004 )*1;	
	
/*	if (uav>0) {
		//uav-=0.01;
		uav-=0.05;
	} else {
		uav = 0;
		ttt2.visible = true;
		scene.remove(ttt);
		ttt2.castShadow = true;
		//ttt.receiveShadow = true;				
	}	*/
//	if (ttt.position.y >4) {
	if (ttt2.position.y < -7.7) {
		//ttt.position.y -= 0.02;
		//ttt2.position.y -= 0.02;		
		//ttt.position.y -= 0.15;
		ttt2.position.y += 0.1;
		//camera.position.y -= 0.023;
		//camera.position.y -= 0.2;
	} else {
	//	ttt.position.y = 4;
		ttt2.position.y = -7.7;

	//	ttt2.rotation.x += .005;
	//	ttt2.rotation.y += .005;
	//	ttt2.rotation.y += Math.tan( timer * 0.0003 )*.01;
	//	ttt2.rotation.z += .005;		
		
	//	mesh.rotation.z -= .001;		
	
//		clif.rotation.y += .008;	
		lathe.rotation.z -= .01;	
		torus.rotation.z -= .01;	
		torus2.rotation.x -= Math.sin( timer * 0.001 )*.01;
		torus2.rotation.y += Math.cos( timer * 0.001 )*.01;
		torus2.rotation.z += .02;	
	
		//camera.position.y = 3;
		camera.position.x = mouseX*0.03;
		camera.position.y = -mouseY*0.01+(wh*0.001);
		//camera.position.x += (mouseX-camera.position.x)*0.0003;
		//camera.position.y += (-mouseY-camera.position.y)*0.05;
		// camera.position.y += (-mouseY-camera.position.y)*0.0003+(wh*0.0033);
		camera.lookAt(scene.position);
	}
	
	//	uniforms.amplitude.value = uav;	
	
	render();
}

function render() {
	
	//arw.lookAt(camera.position);
	renderer.render(scene, camera);	
}

