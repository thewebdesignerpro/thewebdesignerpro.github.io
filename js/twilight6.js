/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

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
var gaf=0, vertices, vertices2, plane1, plane2, light, ambientLight, oras=0, analyser1, sound;

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
	camera = new THREE.PerspectiveCamera(60, ww/wh, .1, 6000);
	camera.position.set(0, -140, 30);
	camera.position.set(0, 50, 140);
	camera.position.set(0, 50, 180);
	camera.position.set(0, 53, -180);
	camera.position.set(180, 53, 0);
	camera.position.set(-180, 53, 0);
	camera.position.set(0, 50, 160);
	camera.position.set(0, 30, 150);
	camera.position.set(150, 20, -14.4);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x4d4a44, 0.002);
	camera.lookAt(scene.position);	
	ambientLight = new THREE.AmbientLight(0x0a0a0a); 
	//scene.add(ambientLight);
//	var spotLight = new THREE.SpotLight(0xffffff, 2, 200, Math.PI/4, 1.0);
//	var spotLight = new THREE.SpotLight(0xffeeaa, 1, 400, Math.PI/4, 1.0);
	var spotLight = new THREE.SpotLight(0x443322, 3, 400, Math.PI/4, 1.0);
	spotLight.position.set(0, 60, 100);	
	spotLight.position.set(0, 100, -100);	
	spotLight.position.set(0, 130, -40);	
	//spotLight.position.set(-60, 5, 6);	
	spotLight.position.set(-220, 4, 21.4);	
	spotLight.castShadow = false;
	/*spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.camera.fov = 60;*/
	scene.add(spotLight);	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 1);
	renderer.shadowMap.enabled = false;
	renderer.sortObjects = false;
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
/*	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
    //controls.autoRotateSpeed = .2;
    //controls.autoRotate = true;	
	controls.minDistance = 5;
	controls.maxDistance = 1000;	
	//controls.minPolarAngle = Math.PI/3;	
	//controls.maxPolarAngle = Math.PI/1.9;	
*/
	
	backDrop(function(tex) {
		//loadTex(tex);
		//loadTex1(tex);
		viz(tex);
	});	
	oDio();
	//animate();
}		

function backDrop(callback) {
	var sky = new THREE.CubeTextureLoader()
	//.setPath( 'imj/map/cube/Stairs/' )
	//.setPath( 'imj/map/cube/Teide/' )
	//.setPath( 'imj/map/cube/daytime/' )
	//.setPath( 'imj/map/cube/sunset/' )
	//.setPath( 'imj/map/cube/Maskonaive/' )
	//.setPath( 'imj/map/cube/NissiBeach/' )
	//.setPath( 'imj/map/cube/hdr008/' )
	//.setPath( 'imj/map/cube/hdr009/' )
	.setPath( 'imj/map/cube/hdr014/' )
//	.setPath( 'imj/map/cube/tntlndn6b/' )	
	/*.load([
		'posx.jpg',
		'negx.jpg',
		'posy.jpg',
		'negy.jpg',
		'posz.jpg',
		'negz.jpg'
	]);	
	.load([
		'posx.png',
		'negx.png',
		'posy.png',
		'negy.png',
		'posz.png',
		'negz.png'
	]);	*/
	.load([
		'face-r.jpg',
		'face-l.jpg',
		'face-t.jpg',
		'face-d.jpg',
		'face-f.jpg',
		'face-b.jpg'
	]);		
	sky.format = THREE.RGBFormat;
	sky.mapping = THREE.CubeReflectionMapping;	
	//sky.mapping = THREE.CubeRefractionMapping;	
	scene.background = sky;
	if (callback) return callback(sky);	
}

function oDio() {
	var listener = new THREE.AudioListener();
	camera.add(listener);
	sound = new THREE.Audio(listener);
	var audioLoader = new THREE.AudioLoader();
	var au = new Audio();
	var ext = "mp3";
	if (au.canPlayType("audio/ogg")) ext = "ogg";
//	var url = 'aud/128/ctwi.'+ext;
	//var url = 'aud/128/klsk/cncrtnFmnr.'+ext;	
	//var url = 'aud/tmp/Hotel California.'+ext;	
	//var url = 'aud/tmp/berlin-after-hours.'+ext;
	//var url = 'aud/tmp/wikistep.'+ext;
	//var url = 'aud/tmp/big-bang.'+ext;
	var url = 'aud/128/toactwi.'+ext;
	audioLoader.load(url, function(buffer) {
		sound.setBuffer(buffer);
		sound.setLoop(true);
		//sound.setVolume(1.0);
		sound.setVolume(.75);
		//sound.play();
		
		analyser1 = new THREE.AudioAnalyser(sound, 256);		
		//console.log( 'An error happened' );
		
		var tempDiv = document.createElement("div");                 
		tempDiv.id = "noAud"; 
		tempDiv.innerHTML = "START";  
		tempDiv.style.display = "block"; 
		tempDiv.style.position = "absolute";
		tempDiv.style.margin = "auto";					
		tempDiv.style.top = "40%"; 
		tempDiv.style.bottom = tempDiv.style.left = tempDiv.style.right = "0"; 
		tempDiv.style.width = "160px";
		tempDiv.style.height = "48px";
		tempDiv.style.lineHeight = "44px";
		tempDiv.style.fontSize = "24px"; 
		tempDiv.style.textAlign = "center"; 
		tempDiv.style.color = "rgba(255, 255, 255, 0.7)";
		tempDiv.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
		tempDiv.style.border = "2px solid rgba(255, 255, 255, 0.7)";
		tempDiv.style.cursor = "pointer"; 

		container.addEventListener( 'click', containerClick, false ); 
		container.appendChild(tempDiv); 			
	});	
//	analyser1 = new THREE.AudioAnalyser(sound, 256);
}

function loadTex(tx) {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/alfa1.png', function (tex) {	
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		//tex.repeat.set(1, 1);		
		viz(tx, tex);		
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}	

function loadTex1(tx) {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/tx/ps0246-ao.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps0252-ao.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps0504-ao.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps0763-ao.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps1509-ao.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps2305-ao.jpg', function (tex) {	
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(4, 4);		
		//viz(tx, tex);		
		loadTex2(tx, tex)
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}	

function loadTex2(tx, tx1) {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/tx/ps0246-spec.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps0252-spec.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps0504-spec.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps0763-spec.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps1509-spec.jpg', function (tex) {	
	//loader.load('imj/shade/tx/ps2305-spec.jpg', function (tex) {	
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(4, 4);		
		viz(tx, tx1, tex);		
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}	

function viz(tx) {
//function viz(tx, alf) {
//function viz(tx, tx1) {
//function viz(tx, tx1, tx2) {
	var loader = new THREE.TextureLoader();
	//loader.load('imj/shade/wat/poolt2.jpg', function (tex) {
	//loader.load('imj/shade/wat/sand.jpg', function (tex) {	
//	loader.load('imj/shade/tx/ps0246-diff.jpg', function (tex) {
	//loader.load('imj/shade/tx/ps0252-diff.jpg', function (tex) {
	//loader.load('imj/shade/tx/ps0504-diff.jpg', function (tex) {
	//loader.load('imj/shade/tx/ps0763-diff.jpg', function (tex) {
	//loader.load('imj/shade/tx/ps1509-diff.jpg', function (tex) {
	//loader.load('imj/shade/tx/ps2305-diff.jpg', function (tex) {
	//loader.load('imj/shade/wat/rstones.jpg', function (tex) {
	loader.load('imj/shade/alfa1.png', function (tex) {			
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		//tex.wrapS = tex.wrapT = THREE.MirroredRepeatWrapping;
//		tex.repeat.set(4, 4);		
//		var geometry = new THREE.RingGeometry(.1, 150, 40, 51);
		var geometry = new THREE.RingGeometry(.1, 180, 40, 51);
//		var material = new THREE.MeshPhongMaterial({map: tex, specular: 0x404040, shininess: 40, envMap: tx, reflectivity: .9, transparent: true, opacity: .8});		
//		var material = new THREE.MeshPhongMaterial({map: tex, specular: 0x404040, shininess: 40, envMap: tx, reflectivity: .15, transparent: true, opacity: .9, alphaMap: alf});		
//		var material = new THREE.MeshPhongMaterial({map: tex, specular: 0x222222, shininess: 50, envMap: tx, reflectivity: .125, transparent: true, opacity: .9});		
//		var material = new THREE.MeshPhysicalMaterial({map: tex, aoMap: tex, aoMapIntensity: .5, envMap: tx, envMapIntensity: 1, metalness: .75, reflectivity: .75, clearCoat: .5});		
//		var material = new THREE.MeshPhysicalMaterial({color: 0x999999, envMap: tx, envMapIntensity: 1, metalness: .75, reflectivity: .75, clearCoat: .7, transparent: true, opacity: .55});		
//		var material = new THREE.MeshPhysicalMaterial({color: 0x999999, envMap: tx, envMapIntensity: 1, metalness: .5, reflectivity: .75, clearCoat: .8, transparent: true, opacity: .8});		
		var material = new THREE.MeshPhysicalMaterial({color: 0xcccccc, envMap: tx, envMapIntensity: 1, metalness: .5, reflectivity: .75, clearCoat: .8, transparent: true, opacity: .9});		
		//material.combine = THREE.MixOperation;
		//material.needsUpdate = true;
		//material.wireframe = true;
		plane1 = new THREE.Mesh(geometry, material);
		plane1.position.y = 9;
		plane1.rotation.x = -Math.PI/2;
		scene.add(plane1);
		vertices = plane1.geometry.vertices;
		
		//var geometry2 = new THREE.PlaneBufferGeometry(2000, 2000);
		//var geometry2 = new THREE.RingGeometry(150, 1200, 40, 1);
//		var geometry2 = new THREE.RingGeometry(.1, 180, 40);
		//var material2 = new THREE.MeshStandardMaterial({map: tex, aoMap: tx1, aoMapIntensity: .75, metalness: .25, depthWrite: false, depthTest: false});		
		//var material2 = new THREE.MeshStandardMaterial({map: tex, aoMap: tx1, aoMapIntensity: .75, metalness: .75});		
/*		var material2 = new THREE.MeshPhongMaterial({map: tex, aoMap: tx1, aoMapIntensity: .75, specular: 0x222222, specularMap: tx2, shininess: 20});			
		plane2 = new THREE.Mesh(geometry, material2);
		plane2.position.y = -20;
		plane2.rotation.x = -Math.PI/2;	*/
		//scene.add(plane2);
		//vertices2 = plane2.geometry.vertices;
		
		var geometry3 = new THREE.RingGeometry(180, 2000, 40, 1);
		var material3 = new THREE.MeshPhysicalMaterial({color: 0xcccccc, envMap: tx, envMapIntensity: 1, metalness: .5, reflectivity: .75, clearCoat: .8, transparent: true, opacity: .9, alphaMap: tex});				
		var plane3 = new THREE.Mesh(geometry3, material3);
		plane3.position.y = 9;
		plane3.rotation.x = -Math.PI/2;
		scene.add(plane3);				
		
/*		var geometry4 = new THREE.RingGeometry(180, 2200, 40, 1);
		//var geometry4 = new THREE.RingGeometry(180, 2000, 40, 1);
		var plane4 = new THREE.Mesh(geometry4, material2);
		plane4.position.y = -20;
		plane4.rotation.x = -Math.PI/2;	*/
		//scene.add(plane4);		

		//scene.rotation.y = -1;		
		//console.log(vertices.length);
		
		animate();
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(e) {
	mouse.x = (e.clientX/ww)*2-1;
	//mouse.y = -(e.clientY/wh)*2+1;	
	mouse.y = (e.clientY/wh)-.135;	
	mouseX = (e.clientX-wwh);
	mouseY = (e.clientY-whh);		
	if (scene) {
		//console.log(mouseY);
//		scene.rotation.x = mouse.y;
		//scene.rotation.y = mouse.x;		
//		camera.position.x = mouseX*.1;
		//camera.position.y = Math.abs(mouseY*.15)+(mouseY*.2);
		if (-mouseY>(whh/4)) camera.position.y = mouseY*-.15;
		camera.position.z = -mouseX*.1 - 14.4;
		//if ((camera.position.x>20) && (camera.position.x>-20)) 
		//camera.position.z += (mouseX-camera.position.z)*0.01;
		//camera.position.x += (mouseX-camera.position.x)*0.01;
		//camera.position.y += (-mouseY-camera.position.y)*0.01;
	}
}

function animate() {
	//var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		po1 -= .001;
		po2 += .001;
		if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			ntro = false;
			//document.getElementById('aud').volume = .6;
			//document.getElementById('aud').play();
		}		
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
			for (var i=0; i<40; i++) {
				var geomV = vertices[i];
				//var geomV2 = vertices2[i];
				geomV.z = analyser1.data[0]*-.02;
				//geomV2.z = analyser1.data[0]*.02;
			}
			/*for (var i=40; i<2040; i+=40) {
				var imod = Math.round(i/40);
				for (var j=0; j<40; j++) {
					var ij = i+j;
					var geomV = vertices[ij];
					//var geomV2 = vertices[ij];
					geomV.z = analyser1.data[imod]*-.02;
					//geomV2.z = analyser1.data[imod]*.02;
				}
			}*/			
			for (var i=40; i<1640; i+=40) {
				var imod = Math.round(i/40);
				for (var j=0; j<40; j++) {
					var ij = i+j;
					var geomV = vertices[ij];
					//var geomV2 = vertices[ij];
//					geomV.z = analyser1.data[imod]*-.02;
					geomV.z = analyser1.data[imod]*-.018;
					//geomV2.z = analyser1.data[imod]*.02;
				}
			}				
			for (var i=1640; i<1840; i+=40) {
				var imod = Math.round(i/40);
				for (var j=0; j<40; j++) {
					var ij = i+j;
					var geomV = vertices[ij];
					geomV.z = analyser1.data[imod]*-.013;
				}
			}						
			for (var i=1840; i<2040; i+=40) {
				var imod = Math.round(i/40);
				for (var j=0; j<40; j++) {
					var ij = i+j;
					var geomV = vertices[ij];
					geomV.z = analyser1.data[imod]*-.005;
				}
			}						
			plane1.geometry.verticesNeedUpdate = true;
			plane1.geometry.computeVertexNormals();
			//plane1.material.normalScale.set(Math.random()*.6-.3,Math.random()*.6-.3);
			plane1.geometry.computeFaceNormals();
			//plane1.material.needsUpdate = true;
			/*
			plane2.geometry.verticesNeedUpdate = true;
			plane2.geometry.computeVertexNormals();
			plane2.geometry.computeFaceNormals();			
			*/
		}
	}
	//camera.position.x += (mouseX-camera.position.x)*0.002;
	//camera.position.y += (-mouseY-camera.position.y)*0.002+(wh*0.003);
	
	//scene.rotation.set(0, -1.5, 0);		
	render();
	requestAnimationFrame(animate);	
}

function render() {
	//controls.update();
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}

function containerClick(e) {
	e.preventDefault();
	
	//document.getElementById('aud').play();	
	sound.play();
	noAud.parentNode.removeChild(noAud);	
	container.removeEventListener( 'click', containerClick, false ); 
}




