/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
   
var clock = new THREE.Clock();
const floorPosY = -20, rnd1 = Math.random(Math.PI); 
var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, pis=0, pif=pif2=1, ntro = true, 
	renderer, camera, scene, controls, stats;
var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0', 
	po1 = 1.0, po2 = 0;	
//	pinfo = document.getElementById('pinfo2'), po1 = 1.0, po2 = 0;	
//var grupo = new THREE.Group();	
var mouse = new THREE.Vector2();
var analyser1;
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

var gaf=0, sphere1, sphere2, ambientLight;

if (!Detector.webgl) {
    var warning = Detector.getWebGLErrorMessage();
    //document.getElementById('container').appendChild(warning);	
    cntnr.appendChild(warning);	
	cntnr.style.backgroundColor = 'transparent';
	document.body.style.backgroundImage = "url('imj/shade/hom1/hombg.jpg')";
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';
} else {
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}		
	cntnr.style.opacity = 0;
}

function init() {
	camera = new THREE.PerspectiveCamera(60, ww/wh, 1, 5000);
	camera.position.set(0, 0, 260);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0xc3c6c9, 0.002);
	camera.lookAt(scene.position);	
	ambientLight = new THREE.AmbientLight(0xaaaaaa); 
	scene.add(ambientLight);
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 1);
	renderer.shadowMap.enabled = false;
	//renderer.shadowMapSoft = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;			
	renderer.sortObjects = false;
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
	viz();
	oDio();
	animate();
}		

function oDio() {
	var listener = new THREE.AudioListener();
	camera.add( listener );
	var sound = new THREE.Audio( listener );
	var audioLoader = new THREE.AudioLoader();
	var au = new Audio();
	var ext = "ogg";
	if (au.canPlayType("audio/mp3")) ext = "mp3";
	//var url = 'aud/tmp/berlin-after-hours.'+ext;
	var url = 'aud/bah.'+ext;
	audioLoader.load(url, function(buffer) {
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.7);
		sound.play();
	});	
	analyser1 = new THREE.AudioAnalyser(sound, 32);
}

function viz() {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/b5.jpg', function (tex) {
		//tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		//tex.repeat.set(3, 3);		
		//tex.offset.set(.5, .5);		
		var geometry = new THREE.SphereGeometry(60, 24, 24);	
		var material = new THREE.MeshPhongMaterial({map: tex, alphaMap: tex, transparent: true});
		sphere1 = new THREE.Mesh(geometry, material);
		scene.add(sphere1);
		var geometry = new THREE.SphereGeometry(280, 32, 32);	
		var material = new THREE.MeshPhongMaterial({shininess: 60, map: tex, specular: 0x333333, specularMap: tex, alphaMap: tex, transparent: true, side: THREE.BackSide});
		material.opacity = .7;
		sphere2 = new THREE.Mesh(geometry, material);
		scene.add(sphere2);
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(e) {
	mouse.x = (e.clientX/ww)*2-1;
	mouse.y = -(e.clientY/wh)*2+1;	
	//mouse.y = (e.clientY/wh)-.15;	
}

function animate() {
	var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		//po1 -= .2;
		po2 += .4;
		/*if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			ntro = false;
			//document.getElementById('aud').volume = .6;
			//document.getElementById('aud').play();
		}*/		
		if (po2 < 1.0) {
			cntnr.style.opacity = po2;
		} else {
			cntnr.style.opacity = 1.0;
			ntro = false;
		}
	}
	scene.rotation.x = mouse.y*.5;
	scene.rotation.y = mouse.x;
	if (analyser1) gaf = analyser1.getAverageFrequency() / 250;
	camera.position.z = 300-gaf*50;
	if (sphere1) {
		sphere1.rotation.y = sphere2.rotation.y = gaf*1;
		ambientLight.intensity = .5+Math.sin(timer)+gaf*2;
	}
	render();
	requestAnimationFrame(animate);	
}

function render(dt) {
	renderer.render(scene, camera);	
}

/*if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	*/


