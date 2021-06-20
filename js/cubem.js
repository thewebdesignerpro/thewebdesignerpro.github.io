/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = 0, mouseY = -90, mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, x = y = z = 0, camera, scene, cubeCam, sceneCube, cubeMesh, sphereMesh;
			
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

init();
function init() {
	camera = new THREE.PerspectiveCamera( 70, ww / wh, .1, 10000 );
	camera.position.set( -1100, 0, 150 );
	cubeCam = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, .1, 10000 );
	scene = new THREE.Scene();
	sceneCube = new THREE.Scene();
	var alight = new THREE.AmbientLight( 0xffffff );
	scene.add( alight );
	var r = "imj/map/cube/Skansen/";
	var urls = [ r + "posx.jpg", r + "negx.jpg", r + "posy.jpg", r + "negy.jpg", r + "posz.jpg", r + "negz.jpg" ];
	var cubeTex = THREE.ImageUtils.loadTextureCube( urls );
	cubeTex.format = THREE.RGBFormat;
	cubeTex.mapping = THREE.CubeReflectionMapping;
	var cubeShader = THREE.ShaderLib[ "cube" ];
	var cubeMater = new THREE.ShaderMaterial( {	fragmentShader: cubeShader.fragmentShader, vertexShader: cubeShader.vertexShader, uniforms: cubeShader.uniforms, depthWrite: false, side: THREE.BackSide } );
	cubeMater.uniforms[ "tCube" ].value = cubeTex;
	cubeMesh = new THREE.Mesh( new THREE.BoxGeometry( 640, 640, 640 ), cubeMater );
	sceneCube.add( cubeMesh );
	var geometry = new THREE.TorusKnotGeometry( 200, 90, 96, 16, 2, 1, 4 );  
	var sphereMater = new THREE.MeshLambertMaterial( { envMap: cubeTex } );
	sphereMesh = new THREE.Mesh( geometry, sphereMater );
	scene.add( sphereMesh );	
}

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;
//renderer.shadowMapEnabled = true;
renderer.setFaceCulling( THREE.CullFaceNone );
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			
				
function animate() {
	requestAnimationFrame(animate);
	render();
	controls.update();
}

function render() {
	var timer = Date.now();
	y -= Math.cos(timer*0.001)*0.005; x -= 0.005; z -= 0.005;
	sphereMesh.rotation.set(x,y,z);
	camera.lookAt(scene.position);
	cubeCam.rotation.copy(camera.rotation);
	renderer.render(sceneCube, cubeCam);
	renderer.render(scene, camera);	
}
