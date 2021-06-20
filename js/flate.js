/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	yb = 0, pif = 1, ntro = true;
var params = {width: 6,	height: 6, widthSegments: 250, heightSegments: 250, depth: 150, param: 4, filterparam: 1};
	
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
	
var camera = new THREE.PerspectiveCamera( 60, ww / wh,  0.1, 10000 );
camera.position.set( 0, 1, 0.1 );
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xa3a8ab, 0.08 );
camera.lookAt( scene.position );

var alight = new THREE.AmbientLight( 0xdddddd ); 
scene.add( alight );
var spotL = new THREE.SpotLight( 0xffffff, 2, 16, Math.PI/5 );
spotL.position.set( 3, 7, -6 );
scene.add( spotL );

var group = new THREE.Group();
var texf = THREE.ImageUtils.loadTexture( "imj/shade/fearth.jpg" );
var watnorm = new THREE.ImageUtils.loadTexture( 'imj/shade/watnorm4.jpg' );
var shader = THREE.NormalDisplacementShader;
var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
var loada = new THREE.TextureLoader();
loada.load(
	'imj/shade/earthd.jpg',
	function ( tex ) {
		uniforms[ "enableAO" ].value = 1;
		uniforms[ "enableDiffuse" ].value = 1;
		uniforms[ "enableDisplacement" ].value = 1;
		uniforms[ "tNormal" ].value = tex;
		uniforms[ "tAO" ].value = texf;
		uniforms[ "tDisplacement" ].value = tex;
		uniforms[ "uDisplacementScale" ].value = 0.5;		
		uniforms[ "uNormalScale" ].value.y = 0.5;
		uniforms[ "tDiffuse" ].value = texf;
		var param = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };
		var mater = new THREE.ShaderMaterial( param );		
		var geom = new THREE.PlaneGeometry( 10, 6, 128, 96 );
		geom.computeTangents();
		var mesh = new THREE.Mesh(geom, mater);
		mesh.position.set(0, -0.22, 0);
		mesh.rotation.x -= Math.PI/2;
		group.add(mesh);
	}, function ( xhr ) {}, function ( xhr ) {}
);

loada.load(
	'imj/cloud2.jpg',
	function ( tex2 ) {
		var geom = new THREE.SphereGeometry(100, 32, 32 );
		var mater = new THREE.MeshLambertMaterial({map: tex2, wrapAround: true, overdraw: 0.5, side: THREE.BackSide, fog:false});
		mater.wrapRGB.set( 0.1, 0.1, 0.1 );
		var sky = new THREE.Mesh( geom, mater );
		sky.rotation.y += 1.2;
		sky.position.set(0, 0, 0);
		scene.add( sky );
	},	function ( xhr ) {}, function ( xhr ) {}
);

if (! Detector.webgl) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.shadowMapEnabled = true;
var container = document.getElementById('container');
container.appendChild(renderer.domElement);			

watnorm.wrapS = watnorm.wrapT = THREE.RepeatWrapping; 
var wata = new THREE.Water(renderer, camera, scene, {textureWidth: 256, textureHeight: 256,	waterNormals: watnorm, alpha: .8, sunDirection: spotL.position.clone().normalize(), sunColor: 0xffffff, waterColor: 0x004488, distortionScale: 40.0});
var salamin = new THREE.Mesh(new THREE.PlaneBufferGeometry(params.width*1.665, params.height*0.95), wata.material);
salamin.add( wata );
salamin.rotation.x -= Math.PI/2;
salamin.position.set(0,0,0);
group.add( salamin );

scene.add(group);				
				
function animate() {
	requestAnimationFrame( animate );
	var timer = Date.now();
	if (ntro) {
		if (camera.position.z<5) {
			camera.position.y += 0.0075;
			camera.position.z += 0.025;
			pif -= 0.004;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
		} else {
			camera.position.y = 2.5;
			camera.position.z = 5;
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			ntro = false;
		}
	} else {
		camera.position.x = mouseX * 0.008;
		camera.position.y = mouseY * 0.01 + 5;	
		group.position.y += Math.sin(timer*0.001)*0.004;
		group.rotation.y += 0.001;
	}	
	render();
}

function render() {
	wata.material.uniforms.time.value += .0021;
	wata.render();
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
