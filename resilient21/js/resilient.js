/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	ready1 = 0, ready2 = 0, controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	renderer, camera, scene, spotL, controls, stats, geom, mater, mater2, tex=[], gridH, domey, domeF, domeB, pCases, deskT, curNum=0;

	//if (!tex[0]) {
		//console.log(tex[0]);
	//}

var sphere, emitter, particleGroup;
var clock = new THREE.Clock();
var	mouseVector = new THREE.Vector3();
var particles, spid=.1;
var geometry = new THREE.BufferGeometry();
var domeG = new THREE.Group();	
var pCase = new THREE.Geometry();
var loader = new THREE.TextureLoader();
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;

if (! Detector.webgl) Detector.addGetWebGLMessage();

function getDeg(deg) {
	var rad = deg * Math.PI/180;
	return rad;
}

function init() {
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	
	
	camera = new THREE.PerspectiveCamera(60, ww/wh,  0.1, 10000);
	camera.position.set(0, 10, 50);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.004);
	camera.lookAt(scene.position);	
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.23;
	//controls.enableZoom = false;
	controls.minDistance = 5;
	controls.maxDistance = 4000;	
	//controls.maxPolarAngle = Math.PI/1.05;	
	//controls.center.set(0, 0, 20);
	//camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 10));
	
	var aLight = new THREE.AmbientLight(0x555555);
	scene.add(aLight);
	
	//var light = new THREE.PointLight(0xffffff, 1, 1000);
	//light.position.set(0, 0, 0);
	//scene.add(light);

	var spotL0 = new THREE.SpotLight(0xffffff, 3, 300, Math.PI/4);
	spotL0.position.set(0, 150, 0);
	spotL0.castShadow = true;
	spotL0.shadowMapWidth = 1024;
	spotL0.shadowMapHeight = 1024;
	spotL0.shadowDarkness = 0.5;
	spotL0.shadowCameraNear = 20;
	spotL0.shadowCameraFar = 1000;
	spotL0.shadowCameraFov = 50;
	//scene.add(spotL0);	
	//var spotL0Helper = new THREE.SpotLightHelper(spotL0);
	//scene.add(spotL0Helper);	
	//var spotL0CH = new THREE.CameraHelper(spotL0.shadow);
	//scene.add(spotL0CH);	
		
	var axisHelper = new THREE.AxisHelper(5);
	scene.add(axisHelper);
	
	
	statS();
	PointS();
	theTwits();
	fbPlaces();
	
	animate();
}	

function statS() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.right = '0px';
	stats.domElement.style.zIndex = 100;
	cntnr.appendChild(stats.domElement);
}

function PointS() {
	//var geometry = new THREE.Geometry();
	//var geometry = new THREE.BufferGeometry();
	var positions = new Float32Array(anmv.length);
	var colors = new Float32Array(anmv.length);
	var color = new THREE.Color();
	var n = 50, n2 = n / 2; 	
	
	//console.log(anmv.length);
	//for ( var i = 0; i < anmv.length; i ++ ) {
	for ( var i = 0; i < anmv.length; i+=3 ) {
	//for ( var i = 0; i < twits2.length; i+=5 ) {
		var vertex = new THREE.Vector3();
		//vertex.x = anmv[i][0];
		//vertex.y = anmv[i][1];
		//vertex.z = anmv[i][2];
		vertex.x = anmv[i];
		vertex.y = anmv[i+1];
		vertex.z = anmv[i+2];				
		//vertex.x = twits2[i+3];
		//vertex.y = twits2[i+2];
		//vertex.z = twits2[i+3];		
		/*vertex.x = 4000 * Math.random() - 2000;
		vertex.y = 4000 * Math.random() - 2000;
		vertex.z = 4000 * Math.random() - 2000;		*/

		positions[ i ]     = vertex.x;
		positions[ i + 1 ] = vertex.y;
		positions[ i + 2 ] = vertex.z;		

		//var vx = ( vertex.x / anmv[i] ) + 0.5;
		//var vy = ( vertex.y / anmv[i] ) + 0.5;
		//var vz = ( vertex.z / anmv[i] ) + 0.5;					
		var vx = ( vertex.x / n ) + 0.5;
		var vy = ( vertex.y / n ) + 0.5;
		var vz = ( vertex.z / n ) + 0.5;

		color.setRGB( vx, vy, vz );

		colors[ i ]     = color.r;
		colors[ i + 1 ] = color.g;
		colors[ i + 2 ] = color.b;		
		
		//geometry.vertices.push(vertex);
	}
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );	
	
	geometry.computeBoundingSphere();
	
				
	//for ( i = 0; i < parameters.length; i ++ ) {
	//mater = new THREE.PointCloudMaterial( { size: 1.5, sizeAttenuation: true } );
	//mater = new THREE.PointsMaterial({size: 3.0, vertexColors: THREE.VertexColors});
	//mater = new THREE.PointsMaterial({size: 1.0, blending: THREE.AdditiveBlending, depthTest: false, transparent: true, opacity: .5});
	//mater = new THREE.PointsMaterial({size: .05, transparent: true, opacity: .5});
	mater = new THREE.PointsMaterial({size: .1, transparent: true, opacity: .8, vertexColors: THREE.VertexColors});
	
	particles = new THREE.Points(geometry, mater);
	particles.rotation.y = Math.PI/2;
	//particles.rotation.x = Math.PI/-2;
	//particles.rotation.z = Math.PI/-2;
	particles.position.y = -15;
	scene.add(particles);	
	//particles.sortParticles = true;	
	
}

function LatLongToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0;
    var pi_4 = Math.PI * 4;
    var sinLatitude = Math.sin(latitude * pi_180);
    var pixelZ = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * 256;
	var pixelX = ((longitude + 180) / 360) * 256;
    var pixel = { x: pixelX, z: pixelZ };

    return pixel;
}

function theTwits() {
	loader.load(
		'img/twit2.png',
		function (tex) {
			var material = new THREE.SpriteMaterial( { map: tex, color: 0x2288cc, fog: true, depthWrite: false, depthTest: false } );
			
			for ( var i = 0; i < twits2.length; i+=5 ) {
				//var vertex = new THREE.Vector3();
				var latlong = LatLongToPixelXY(twits2[i+2],twits2[i+3]);				
				var sprite = new THREE.Sprite( material );
				sprite.position.set(latlong.x*25-1300, Math.random()*3+7, latlong.z*22-2220);
				//sprite.position.set((latlong.x-52.5), 0, latlong.z-101.5);
				//sprite.position.normalize();
				//sprite.position.multiplyScalar( 80 );
				sprite.position.y = 2 * Math.random() + 4;
				scene.add( sprite );
				
				//console.log(latlong.x);
			}
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}

function fbPlaces() {
	loader.load(
		'img/fb3.png',
		function (tex) {
			var material = new THREE.SpriteMaterial( { map: tex, color: 0x2255aa, fog: true, depthWrite: false, depthTest: false } );
			
			for ( var i = 0; i < fb2.length; i+=2 ) {
				var latlong = LatLongToPixelXY(fb2[i],fb2[i+1]);				
				var sprite = new THREE.Sprite( material );
				sprite.position.set(latlong.x*480-25040, Math.random()*3+3, latlong.z*600-60770);
				scene.add( sprite );
				//console.log(latlong.x);
			}
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);

}
		
function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
	renderer.setSize(ww, wh);
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	
	document.body.style.width = cntnr.style.width = ww+'px';
	document.body.style.height = cntnr.style.height = wh+'px';	

}
window.addEventListener('resize', onWindowResize, false);		

function animate() {
	requestAnimationFrame(animate);
	//var timer = Date.now()*.001;
	var timer = new Date().getTime();	
	var time = Date.now() * 0.00005;
	
	controls.update();
	stats.update();	
	render();
	//render( clock.getDelta() );
}

//function render(dt) {
function render() {
	
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}

if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}
