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
	pinfo = document.getElementById('pinfo2'), po1 = 1.0, po2 = 0;	
var grupo = new THREE.Group();	
var mouse = new THREE.Vector2();
var emitter, emitter2, particleGroup;
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

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
	camera.position.set(0, 25, 260);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xc3c6c9, 0.002);
	camera.lookAt(scene.position);	
	var ambientLight = new THREE.AmbientLight(0x333333); 
	//scene.add(ambientLight);
	var spotLight = new THREE.SpotLight(0xffffff, 6, 700, Math.PI/4, .75);
	spotLight.position.set(0, 600, -150);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.camera.fov = 90;
	//spotLight.power = Math.PI*1;
	//grupo.add(spotLight);	
	//scene.add(spotLight);	
	//var helper = new THREE.CameraHelper( spotLight.shadow.camera );
	//scene.add( helper );
	var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
	scene.add(hemiLight);
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0xc3c6c9, 1);
	renderer.shadowMap.enabled = false;
	//renderer.shadowMapSoft = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;			
	renderer.sortObjects = false;
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
	initParticles();
	bundok();
	animate();
}		

function bundok() {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/iceb.jpg', function (tex) {
		//tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		//tex.repeat.set(10, 10);		
		//tex.offset.set(.5, .5);		
		var geometry = new THREE.PlaneBufferGeometry(1300, 1300, 64, 64);	
		var material = new THREE.MeshPhongMaterial({shininess: 10, color: 0x303936, displacementMap: tex, displacementScale: 220.0, specularMap: tex, shading: THREE.FlatShading});
		var bundok = new THREE.Mesh(geometry, material);
		bundok.position.set(0, floorPosY, 0);
		bundok.rotation.set(-Math.PI/2, 0, rnd1);
		//bundok.castShadow = true;		
		//bundok.receiveShadow = true;		
		scene.add(bundok);
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}

function initParticles() {
	var loader = new THREE.TextureLoader();
    particleGroup = new SPE.Group({
        texture: {
			value: loader.load("imj/shade/mist5.png")
        },
        //blending: THREE.SubstractiveBlending,
        blending: THREE.AdditiveBlending,
        //blending: THREE.NormalBlending,
		depthWrite: false, 
		//depthTest: false, 
        fog: true
    });
	emitter = new SPE.Emitter({
        particleCount: 800,
        maxAge: {
            value: 20
        },
		position: {
			value: new THREE.Vector3(0, floorPosY*.1, 0),
            spread: new THREE.Vector3(1000, 4, 1000)
        },
		velocity: {
			value: new THREE.Vector3(0, 0, 4)
        },
        wiggle: {
			value: Math.random() * 50, 
			spread: 50
        },
        size: {
			value: 200,
			spread: 10
		},
        opacity: {
			value: [0, .75, 0]
		},
        color: {
			value: new THREE.Color(.1, .1, .1),
			spread: new THREE.Color(0.1, 0.1, 0.1)
		},
        angle: {
			value: [0, rnd1]
		}
	});	
	emitter2 = new SPE.Emitter({
        particleCount: 700,
        maxAge: {
            value: 20
        },
		position: {
			value: new THREE.Vector3(40, 200, 0),
            spread: new THREE.Vector3(1000, 100, 1000)
        },
		velocity: {
			value: new THREE.Vector3(-2, -9, 1)
        },
        wiggle: {
			value: Math.random() * 100, 
			spread: 50
        },
        size: {
			value: 15,
			spread: 5
		},
        opacity: {
			value: [0, .9, 0]
		},
        color: {
			value: new THREE.Color(.5, .5, .5),
			spread: new THREE.Color(0.1, 0.1, 0.1)
		}
	});
	particleGroup.addEmitter(emitter).addEmitter(emitter2);
    scene.add(particleGroup.mesh);
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(e) {
	mouse.x = (e.clientX/ww)*2-1;
	//mouse.y = -(e.clientY/wh)*2+1;	
	mouse.y = (e.clientY/wh)-.15;	
}

function animate() {
	var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		po1 -= .002;
		po2 += .004;
		if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			ntro = false;
			document.getElementById('aud').volume = .6;
			document.getElementById('aud').play();
		}		
		if (po2 < 1.0) {
			cntnr.style.opacity = po2;
		} else {
			cntnr.style.opacity = 1.0;
		}
	}
	if (camera) {
		scene.rotation.x = mouse.y;
		scene.rotation.y = mouse.x*2.4;
	}
	render(delta);
	requestAnimationFrame(animate);	
}

function render(dt) {
	particleGroup.tick(dt);
	renderer.render(scene, camera);	
}

/*if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	*/

