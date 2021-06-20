/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
   
var clock = new THREE.Clock();
const floorPosY = -5, rnd1 = Math.random(Math.PI); 
var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, pis=0, pif=pif2=1, ntro = true, 
	renderer, camera, scene, controls, stats;
var catwalkModel, catwalkTexture, animAction, animMix, anims=[];
var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0';
var manikins = new THREE.Group();	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

function init() {
	camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 5000);
	camera.position.set(0, 0, 33);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.03);
	camera.lookAt(scene.position);	
	var ambientLight = new THREE.AmbientLight(0x121212); 
	scene.add(ambientLight);
	var spotLight = new THREE.SpotLight(0xffffff, 1, 260, Math.PI/6, .6);
	spotLight.position.set(0, 30, 50);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 2048;
	spotLight.shadow.mapSize.height = 2048;
	spotLight.shadow.camera.near = 20;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.camera.fov = 50;
	manikins.add(spotLight);	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.sortObjects = false;
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
	controls.minDistance = 2;
	controls.maxDistance = 50;	
	sahig();	
	loadMani("obj/manikin/mani0.obj", 5, floorPosY-.09, 9, .099, Math.PI/-1.3, 0);
	loadMani("obj/manikin/mani1.obj", -3, floorPosY-.77, 2, 0, Math.PI/4, 0);
	loadMani("obj/manikin/mani3.obj", -7, floorPosY-1, 10, 0, -Math.PI/4, 0);
	loadMani("obj/manikin/mani4.obj", -12, floorPosY-.2, 16, 0, Math.PI/1.2, 0);
	loadMani("obj/manikin/mani2.obj", 18, floorPosY-.2, 2, 0, 0, 0);
	loadMani("obj/manikin/mani5.obj", 13, floorPosY-.36, 9, 0, Math.PI, 0);
	scene.add(manikins);
	animate();
}		

function sahig() {
	var length = 400, width = 100;
	var shape = new THREE.Shape();
	shape.moveTo(0,0);
	shape.lineTo(0,width);
	shape.lineTo(length,width);
	shape.lineTo(length,0);
	shape.lineTo(0,0);
	var extrudeSettings = {
		steps: 1,
		amount: 100,
		bevelEnabled: true,
		bevelThickness: .25,
		bevelSize: .25,
		bevelSegments: 8
	};
	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	var material = new THREE.MeshStandardMaterial({color: 0xc3c6c9, roughness: .55, metalness: .1, side: THREE.BackSide});
	var mesh = new THREE.Mesh( geometry, material ) ;
	mesh.position.set(length/-2,floorPosY,-7);
	mesh.receiveShadow = true;	
	manikins.add(mesh);
}

function loadMani(url, x, y, z, rotX, rotY, rotZ) {
	var mater = new THREE.MeshPhongMaterial({color: 0xccbcaf, shininess: 45, fog: false});
	var loader = new THREE.OBJLoader();
	loader.load(url, function (obj) {
		obj.children[0].material = mater;
		obj.children[0].castShadow = obj.children[0].receiveShadow = true;		
		obj.position.set(x,y,z);		
		obj.rotation.set(rotX,rotY,rotZ);
		obj.children[0].scale.set(7,7,7);
        manikins.add(obj);
	});
}

function animate() {
	requestAnimationFrame(animate);
	var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		if (pif>0) {
			pif -= 0.001;
			pif2 -= 0.0015;
			document.getElementById('pinfo').style.opacity = pif;
			document.getElementById('pinfo2').style.opacity = pif2;
			if (pif<=0.5) {
				pis += 0.0025;
			}	
		} else {
			document.getElementById('pinfo').style.opacity = 0;
			document.getElementById('pinfo2').style.opacity = 0;
			document.getElementById('aud').volume = .6;
			document.getElementById('aud').play();
			ntro = false;
		}
	}	
	if (manikins) {
		manikins.rotation.x = Math.sin(timer*.005) * Math.PI;
		manikins.rotation.y = Math.sin(timer*.06) * Math.PI;
		manikins.rotation.z = Math.cos(timer*.006) * Math.PI;
	}
	camera.position.z = Math.cos(timer*.1) * 10 + 20;
	render();
}

function render() {
	camera.lookAt(scene.position);
	controls.update();	
	renderer.render(scene, camera);	
}

if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	
