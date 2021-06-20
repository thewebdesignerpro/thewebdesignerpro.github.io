/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
   
var clock = new THREE.Clock();
//var delta = clock.getDelta();
const floorPosY = -20, rnd1 = Math.random(Math.PI); 
var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, pis=0, pif=pif2=1, ntro = true, 
	renderer, camera, scene, controls, stats;
var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0', 
	pinfo = document.getElementById('pinfo2'), po1 = 1.0, po2 = 0;
var grupo = new THREE.Group();	
var mouse = new THREE.Vector2();
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
var gaf=0, vertices, plane1, plane2, light, ambientLight, oras=0, analyser1;

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
	camera = new THREE.PerspectiveCamera(60, ww/wh, .1, 2000);
	camera.position.set(0, -140, 30);
	scene = new THREE.Scene();
	camera.lookAt(scene.position);	
	ambientLight = new THREE.AmbientLight(0x0a0a0a); 
	scene.add(ambientLight);
	var spotLight = new THREE.SpotLight(0xffffff, 2, 200, Math.PI/4, .6);
	spotLight.position.set(0, 60, 100);	
	spotLight.castShadow = false;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.camera.fov = 60;
	scene.add(spotLight);	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 1);
	renderer.shadowMap.enabled = false;
	renderer.sortObjects = false;
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
	viz();
	oDio();
	animate();
}		

function oDio() {
	var listener = new THREE.AudioListener();
	camera.add(listener);
	var sound = new THREE.Audio(listener);
	var audioLoader = new THREE.AudioLoader();
	var au = new Audio();
	var ext = "mp3";
	if (au.canPlayType("audio/ogg")) ext = "ogg";
	var url = 'aud/headd.'+ext;
	audioLoader.load(url, function(buffer) {
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.6);
		sound.play();
	});	
	analyser1 = new THREE.AudioAnalyser(sound, 512);
}

function viz() {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/b3.jpg', function (tex) {
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(3, 3);		
		var geometry = new THREE.RingGeometry(.1, 150, 18, 12);
		var material = new THREE.MeshStandardMaterial({map: tex, bumpMap: tex, bumpScale: .4, metalness: .15, roughness: .25});		
		plane1 = new THREE.Mesh(geometry, material);
		scene.add(plane1);
		vertices = plane1.geometry.vertices;
		var geometry = new THREE.SphereBufferGeometry(300, 8);
		var material = new THREE.MeshBasicMaterial({color: 0x111111, map: tex, transparent: true, opacity: .125, side: THREE.BackSide});
		var bg = new THREE.Mesh(geometry, material);
		bg.rotation.x = Math.PI/2;
		scene.add(bg);
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(e) {
	mouse.x = (e.clientX/ww)*2-1;
	//mouse.y = -(e.clientY/wh)*2+1;	
	mouse.y = (e.clientY/wh)-.15;	
	if (scene) {
		scene.rotation.x = mouse.y;
		scene.rotation.y = mouse.x;
	}
}

function animate() {
	//var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		//po1 -= .2;
		po2 += .002;
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
	if (plane1) {
		if (analyser1) {
			analyser1.getFrequencyData();
			for (var i=0; i<19; i++) {
				var geomV = vertices[i];
				geomV.z = analyser1.data[18]*.06;
			}
			for (var i=19; i<234; i++) {
				var geomV = vertices[i];
				geomV.z = analyser1.data[i]*.07;
			}			
			plane1.geometry.verticesNeedUpdate = true;
		}
	}
	render();
	requestAnimationFrame(animate);	
}

function render() {
	renderer.render(scene, camera);	
}

/*if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	*/


