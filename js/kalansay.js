/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
   
var clock = new THREE.Clock();
const floorPosY = -4, rnd1 = Math.random(Math.PI); 
var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, pis=0, pif=1, ntro = true, 
	renderer, camera, scene, controls, stats;
var catwalkModel, catwalkTexture, animAction, animMix, anims=[];
var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0', 
	animSpeed = document.getElementById("animSpeed"), audVol = document.getElementById("audVol"), optn1 = document.getElementById("optn1"), 
	optn2 = document.getElementById("optn2"), optn3 = document.getElementById("optn3"), animP = 0, startT = Date.now();
animSpeed.value = 1.0;
audVol.value = .8;
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
document.getElementById('optn').style.opacity = document.getElementById('controlz').style.opacity = 0;

if (Audio != undefined) {
	var au = new Audio();
	var ext = "ogg";
	if (au.canPlayType("audio/mp3")) ext = "mp3";
	var mus = new Audio("aud/sidewayz."+ext);
	mus.volume = .8;
	mus.loop = true;
	mus.load();
	mus.addEventListener("loadeddata", function() {
		startT = Date.now();
		this.play();
	}, false);
} else {
	startT = Date.now();
}
	
function init() {
	camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 5000);
	camera.position.set(0, 1, 15);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.003);
	camera.lookAt(scene.position);	
	var ambientLight = new THREE.AmbientLight(0x242424); 
	scene.add(ambientLight);
	
	var spotLight = new THREE.SpotLight(0xffffff, 1.5, 100, Math.PI/6, .7);
	spotLight.position.set(0, 10, 10);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 5;
	spotLight.shadow.camera.far = 200;
	spotLight.shadow.camera.fov = 40;
	scene.add(spotLight);	
	
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
	controls.maxDistance = 100;	
	
	sahig();	
	loadModelCatwalk();
}		

function sahig() {
	var geometry = new THREE.PlaneBufferGeometry(300, 300);
	var material = new THREE.MeshStandardMaterial({color: 0x444444, roughness: .6, metalness: .3, transparent: true, opacity: .8});
	var sahig = new THREE.Mesh(geometry, material);
	sahig.rotateX(Math.PI/-2);
	sahig.position.y = floorPosY;
	sahig.receiveShadow = true;	
	scene.add(sahig);	
	var material2 = new THREE.MeshStandardMaterial({color: 0x444444, roughness: .6, metalness: .3});
	var sahig2 = new THREE.Mesh(geometry, material2);
	sahig2.rotateX(Math.PI/-2);
	sahig2.position.y = floorPosY-.1;
	scene.add(sahig2);	
}

function loadModelCatwalk() {
	var material = new THREE.MeshStandardMaterial({color: 0xe3dac9, roughness: .63, metalness: .1, skinning: true, fog: false});	
	var loader = new THREE.JSONLoader();
	animMix = new THREE.AnimationMixer(scene);

	loader.load(
		'obj/skel40.json', 
		function (geometry, materials) {
			catwalkModel = new THREE.SkinnedMesh(geometry, material);
			var scale = 1;
			catwalkModel.scale.set(scale, scale, scale);
			catwalkModel.position.y = floorPosY;
			catwalkModel.castShadow = catwalkModel.receiveShadow = true;
			catwalkModel.matrixAutoUpdate = false;
			catwalkModel.updateMatrix();
			scene.add(catwalkModel);
			anims[0] = geometry.animations[0];
			anims[1] = geometry.animations[1];
			anims[2] = geometry.animations[2];
			animMix.clipAction(anims[0], catwalkModel).play();
			animMix.timeScale = .1;
			animMix.loop = false;
			animP = 0;
			animate();
		}
	);
}
	
function animate() {
	requestAnimationFrame(animate);
	var delta = clock.getDelta();

	if (ntro) {
		if (pif>0) {
			pif -= 0.0025;
			document.getElementById('pinfo2').style.opacity = pif;
			if (pif<=0.5) {
				pis += 0.0025;
				document.getElementById('optn').style.opacity = pis;			
				document.getElementById('controlz').style.opacity = pis;			
			}	
		} else {
			document.getElementById('pinfo2').style.opacity = 0;
			document.getElementById('optn').style.opacity = .5;
			document.getElementById('controlz').style.opacity = .5;
			ntro = false;
			animMix.timeScale = animSpeed.value;
		}
	}	
	
	animMix.update(delta);	
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
	
animSpeed.addEventListener('input', function(e) {
	animMix.timeScale = this.value;
}, false);

audVol.addEventListener('input', function(e) {
	mus.volume = this.value;
}, false);

function stopAnim(callback) {
	switch(animP) {
		case 0:
			animMix.clipAction(anims[0], catwalkModel).stop();
			break;		
		case 1:
			animMix.clipAction(anims[1], catwalkModel).stop();
			break;			
		case 2:
			animMix.clipAction(anims[2], catwalkModel).stop();
			break;
		default:

	}		
	if (callback) return callback();
}

optn1.addEventListener('click', function(e) {
	stopAnim(function(mesh) {
		animMix.clipAction(anims[0], catwalkModel).play();	
		animP = 0;
	});		
	optn2.classList.remove("sel");
	optn3.classList.remove("sel");
	optn1.classList.add("sel");
	e.preventDefault();
});

optn2.addEventListener('click', function(e) {
	stopAnim(function(mesh) {
		animMix.clipAction(anims[1], catwalkModel).play();	
		animP = 1;
	});	
	optn1.classList.remove("sel");
	optn3.classList.remove("sel");
	optn2.classList.add("sel");
	e.preventDefault();
});

optn3.addEventListener('click', function(e) {
	stopAnim(function(mesh) {
		animMix.clipAction(anims[2], catwalkModel).play();	
		animP = 2;
	});	
	optn1.classList.remove("sel");
	optn2.classList.remove("sel");
	optn3.classList.add("sel");
	e.preventDefault();
});


