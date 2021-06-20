/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
//(function(){

const floorposY = -3, rnd1 = Math.random(Math.PI); 

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = false, geometry, material, vertices, starS, starGeom, starMater, 
	lupa, dagat, dagatb, bwan, bwanC, spotLight, backg, bwanGo = bwancGo = dagatGo = backgGo = mirrorGo = false, verticalMirror, groundMirror, rBlock, backSky;

var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0', 
	pinfo = document.getElementById('pinfo2'), po1 = 1.0, po2 = 0;	
	
var	junoG = new THREE.Group(); 	
var	sofaG = new THREE.Group(); 	
var	sopaG1 = new THREE.Group(); 	
var	sopaG2 = new THREE.Group(); 	
var	halamanG1 = new THREE.Group(); 	
var	halamanG2 = new THREE.Group(); 	
var	mesaG = new THREE.Group(); 	
var	ilawG1 = new THREE.Group(); 	
var	ilawG2 = new THREE.Group(); 	
var	ilawG3 = new THREE.Group(); 	
var loader = new THREE.TextureLoader();		
var loadO = new THREE.OBJLoader();
var clock = new THREE.Clock();
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
cntnr.style.opacity = 0;

if (!Detector.webgl) Detector.addGetWebGLMessage();

function init() {
	camera = new THREE.PerspectiveCamera(50, ww/wh,  1, 5000);
	camera.position.set(0, 1, 10);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x15181b, 0.0004);
	camera.lookAt(scene.position);	
	
	var aLight = new THREE.AmbientLight(0x909090);
	scene.add(aLight);
	spotLight = new THREE.SpotLight(0xffffff, 1.5, 90, Math.PI/7, 1.0);
	spotLight.position.set(-10, 100, 200);	
	spotLight.position.set(30, 5.5, 19.5);	
	spotLight.position.set(30, 5.5, 18.5);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 2048;
	spotLight.shadow.mapSize.height = 2048;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 100;
	spotLight.shadow.camera.fov = 40;
	scene.add(spotLight);	
	//var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	//scene.add(spotLightHelper);

	loadtex1();
	loadtex2();
	loadtex4();
	loadtex5();
	loadtex6();
	pader1A();
	bubongS();
	pasoS();
	ashT();
	halamanS();
	potS();
	loadIlaw();
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;		
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
    //controls.autoRotateSpeed = .5;
    //controls.autoRotate = true;	
	controls.minDistance = 1;
	controls.maxDistance = 60;	
	//controls.minPolarAngle = Math.PI/3;	
	//controls.maxPolarAngle = Math.PI/1;	

	loadtex3();
	
	animate();
}	

function loadtex1() {
	loader.load(
		'imj/shade/tex/sofa1.jpg',
		function (texture) {
			loadSopa(texture);
			loadPilo(texture);
			tvF(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadtex2() {
	loader.load(
		'imj/shade/tex/wood5.jpg',
		function (texture) {
			loadtex2b(texture)
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadtex2b(tex) {
	loader.load(
		'imj/shade/tex/painting2.jpg',
		function (texture) {
			loadRblock(tex, texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadtex3() {
	loader.load(
		'imj/shade/tex/noise2.jpg',
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(8, 8);
			sahig(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadtex4() {
	loader.load(
		'imj/map/sky1.jpg',
		function (texture) {
			langit(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadtex5() {
	loader.load(
		'imj/shade/metal2.jpg',
		function (texture) {
			bintana(texture);
			pinto(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadtex6() {
	loader.load(
		'imj/shade/tex/shad.png',
		function (texture) {
			paderS(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadSopa(tex) {
loadO.load(
	'obj/interior/sblock2.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x777777, map: tex, shininess: 20});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		
		var sopa1 = object.children[0].clone();
		sopa1.scale.set(5.1, 2.3, 2.6);
		sopa1.rotation.y = Math.PI/2;
		sopa1.position.set(-3.93, -2.58, 0);

		var sopa2 = object.children[0].clone();
		sopa2.scale.set(2.55, 2.16, 1.6);
		sopa2.rotation.set(Math.PI/2, 0.15, -Math.PI/2);
		sopa2.position.set(-4.58, -1.84, 1);
		
		var sopa3 = sopa2.clone();
		sopa3.position.z = -1;

		var sopa4 = object.children[0].clone();
		sopa4.scale.set(2.39, 2.7, 1.7);
		sopa4.rotation.set(Math.PI/2, 0, 0);
		sopa4.position.set(-3.98, -2.35, 2.24);
		
		var sopa5 = sopa4.clone();
		sopa5.rotation.x = -Math.PI/2;
		sopa5.position.z = -2.24;
		
		var geometry = new THREE.CylinderBufferGeometry(.15, .15, .128, 4);
		var material = new THREE.MeshLambertMaterial({color: 0x262320});
		var sopaSt = new THREE.Mesh(geometry, material);
		sopaSt.rotation.y = Math.PI/4;
		sopaSt.position.set(-3.35, -2.975, 2.22);
		sopaSt.castShadow = true;
		sopaSt.receiveShadow = true;
				
		var sopaSt2 = sopaSt.clone();
		sopaSt2.position.z = -2.22;
		var sopaSt3 = sopaSt.clone();
		sopaSt3.position.x = -4.56;
		var sopaSt4 = sopaSt3.clone();
		sopaSt4.position.z = -2.22;		
		
		sopaG1.add(sopa1);
		sopaG1.add(sopa2);
		sopaG1.add(sopa3);
		sopaG1.add(sopa4);
		sopaG1.add(sopa5);
		sopaG1.add(sopaSt);
		sopaG1.add(sopaSt2);
		sopaG1.add(sopaSt3);
		sopaG1.add(sopaSt4);
		
		scene.add(sopaG1);
		sopaG2 = sopaG1.clone();
		sopaG2.rotation.y = Math.PI;
		scene.add(sopaG2);
	});
}

function loadPilo(tex) {
loadO.load(
	'obj/interior/pillow4.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x667788, map: tex, shininess: 10});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		
		object.children[0].scale.set(3, 3, 3);
		var pilo = object.children[0].clone();
		pilo.rotation.set(.2, 0, -1.3);
		pilo.position.set(-4.1, -1.92, 1.44);

		var pilo2 = pilo.clone();
		pilo2.rotation.set(.0, -.5, -1.3);
		pilo2.position.set(-4.1, -1.88, -1.44);
		
		sopaG1.add(pilo);
		sopaG1.add(pilo2);
	});
}

function loadRblock(tex, tex2) {
loadO.load(
	'obj/interior/rblock3.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x837771, map: tex, shininess: 25});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var mesa = object.children[0].clone();
		mesa.scale.set(2, 1.8, 2);
		mesa.position.set(0, 0, 0);
		var mesaS = object.children[0].clone();		
		mesaS.scale.set(.2, 2, .35);
		mesaS.position.set(-1.38, -.28, .72);		
		var mesaS2 = mesaS.clone();		
		mesaS2.position.set(1.38, -.28, .72);				
		var mesaS3 = mesaS.clone();		
		mesaS3.position.set(-1.38, -.28, -.72);				
		var mesaS4 = mesaS.clone();		
		mesaS4.position.set(1.38, -.28, -.72);		
		
		var tvS = object.children[0].clone();
		tvS.scale.set(3.8, 1.5, 1);
		tvS.position.set(0, -2.4, -9.3);		
		
		mesaG.add(mesa);
		mesaG.add(mesaS);
		mesaG.add(mesaS2);
		mesaG.add(mesaS3);
		mesaG.add(mesaS4);
		mesaG.position.y = floorposY+.43;
		scene.add(mesaG);
		scene.add(tvS);
		
		var kabinet = object.children[0].clone();
		var mater2 = new THREE.MeshPhongMaterial({color: 0x604630, map: tex, shininess: 20});	
		kabinet.material = mater2;
		kabinet.scale.set(1, 11, 3.5);
		kabinet.position.set(-9.15, -2, 1.575);
		var kabinet2 = kabinet.clone();
		kabinet2.position.set(-9.15, -2, -1.575);
		scene.add(kabinet);
		scene.add(kabinet2);
		
		var geom2 = new THREE.CylinderBufferGeometry(.084, .06, .175);
		var kabS = new THREE.Mesh(geom2, mater2);
		kabS.position.set(-8.52, -2.9067, 2.9);		
		var kabS2 = kabS.clone();
		kabS2.position.x = -9.77;
		var kabS3 = kabS.clone();
		kabS3.position.z = -2.9;	
		var kabS4 = kabS2.clone();
		kabS4.position.z = -2.9;
		
		scene.add(kabS);
		scene.add(kabS2);
		scene.add(kabS3);
		scene.add(kabS4);

		var painting = object.children[0].clone();
		var materp = new THREE.MeshLambertMaterial({color: 0x807055});	
		painting.material = materp;
		painting.scale.set(2.6, .6, 2.8);
		painting.rotation.set(Math.PI/2, 0, Math.PI/-2);
		painting.position.set(-9.9, 2, 0);
		
		var geom3 = new THREE.PlaneBufferGeometry(4.024, 2.468);
		var mater3 = new THREE.MeshLambertMaterial({map: tex2});	
		var plane = new THREE.Mesh(geom3, mater3);		
		plane.rotation.set(0, Math.PI/2, 0);
		plane.position.set(-9.85, 2, -.008);
		plane.receiveShadow = true;
		
		scene.add(painting);
		scene.add(plane);
	});
}

function tvF(tex) {
loadO.load(
	'obj/interior/tabletop.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x090909, shininess: 50});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var tvF = object.children[0].clone();
		tvF.scale.set(3.2, 2.4, 4.8);
		tvF.rotation.x = Math.PI/1.971;
		tvF.position.set(0, 1, -9.922);
		scene.add(tvF);
		
		var mater2 = new THREE.MeshPhongMaterial({color: 0x777777, map: tex, shininess: 20});	
		
		var rBlock1 = object.children[0].clone();
		rBlock1.scale.set(2.64, 2.2, 3.04);
		rBlock1.rotation.y = Math.PI/2;
		rBlock1.position.set(-3.92, -3.15, 0);
		rBlock1.material = mater2;

		var rBlock2 = rBlock1.clone();
		rBlock2.scale.z = 2;
		rBlock2.rotation.set(Math.PI/2, 0, Math.PI/2);
		rBlock2.position.set(-4.55, -2.346, 0);

		sopaG1.add(rBlock1);		
		sopaG1.add(rBlock2);		
	});
}

function pasoS() {
loadO.load(
	'obj/interior/vase5.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x111111, shininess: 40});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var paso1 = object.children[0].clone();
		paso1.scale.set(.56, .56, .56);
		paso1.position.set(-1, -1.7, -9.3);
		var paso2 = object.children[0].clone();
		paso2.scale.set(.4, .4, .4);
		paso2.rotation.y = -2.4;
		paso2.position.set(-1.7, -1.88, -9.3);		
		scene.add(paso1);
		scene.add(paso2);

	});
}

function ashT() {
loadO.load(
	'obj/interior/ashtray1.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0xeeeeee, shininess: 40, transparent: true, opacity: .4});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var ashtray1 = object.children[0].clone();
		ashtray1.scale.set(.2, .36, .2);
		ashtray1.position.set(0, -2.56, 0);		
		var ashtray2 = object.children[0].clone();
		ashtray2.scale.set(.15, .27, .15);
		ashtray2.position.set(.6, -2.54, 0);
		scene.add(ashtray1);
		scene.add(ashtray2);
	});
}

function halamanS() {
loadO.load(
	'obj/interior/plant1.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x205000});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var halaman = object.children[0].clone();
		halaman.scale.set(.2, .3, .2);
		halaman.position.set(-6, -3.2, -9.3);		
		var halaman2 = halaman.clone();
		halaman2.position.x = 6;
		halaman.rotation.y = 2.8;
		halamanG1.add(halaman);
		halamanG2.add(halaman2);
		scene.add(halamanG1);
		scene.add(halamanG2);
	});
}

function potS() {
loadO.load(
	'obj/interior/pot1.obj',
	function (object, materials) {
		var mater = new THREE.MeshLambertMaterial({color: 0x422b1a});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var pot1 = object.children[0].clone();
		pot1.scale.set(.146, .17, .146);
		pot1.position.set(-6, -3.2, -9.3);		
		var pot2 = pot1.clone();
		pot2.position.x = 6;

		halamanG1.add(pot1);
		halamanG2.add(pot2);
		scene.add(halamanG1);
		scene.add(halamanG2);
	});
}

function paderS(tex) {
	var geometry = new THREE.PlaneBufferGeometry(20, 9);
	var material = new THREE.MeshLambertMaterial({color: 0xaca8a4});
	var paderS1 = new THREE.Mesh(geometry, material);
	paderS1.position.set(0, 1.5, -10);
	paderS1.castShadow = true;
	paderS1.receiveShadow = true;
	var paderS2 = paderS1.clone();
	paderS2.rotation.y = Math.PI/2;
	paderS2.position.set(-10, 1.5, 0);
	var paderS3 = paderS1.clone();
	paderS3.rotation.y = Math.PI;	
	paderS3.position.z = 10;	
	
	var paderS4 = paderS2.clone();
	paderS4.scale.x = .05;
	paderS4.rotation.y = -Math.PI/2;	
	paderS4.position.set(10, 1.5, -9.5);		

	var paderS4b = paderS2.clone();
	paderS4b.scale.x = .9;
	paderS4b.scale.y = .07;
	paderS4b.rotation.y = -Math.PI/2;	
	paderS4b.position.set(10, -2.73, 0);		
	
	var paderS4c = paderS4b.clone();
	paderS4c.position.set(10, 5.685, 0);
	
	var paderS5 = paderS4.clone();
	paderS5.position.set(10, 1.5, 9.5);		
	
	var paderS6 = paderS4.clone();
	paderS6.scale.x = .02;
	paderS6.scale.y = .875;
	paderS6.rotation.y += Math.PI/2;
	paderS6.position.set(10.2, 1.5, -9);			

	var paderS7 = paderS6.clone();
	paderS7.rotation.y -= Math.PI;
	paderS7.position.z = 9;			
	
	var paderS8 = paderS2.clone();
	paderS8.scale.x = .9;
	paderS8.scale.y = .046;
	paderS8.rotation.set(-Math.PI/2, 0, Math.PI/2);	
	paderS8.position.set(10.2, -2.44, 0);		
	
	var paderS9 = paderS8.clone();
	paderS9.rotation.x = Math.PI/2;	
	paderS9.position.y = 5.37;	
	
	var geom2 = new THREE.PlaneBufferGeometry(.4, 10);
	var mater2 = new THREE.MeshBasicMaterial({map: tex, transparent: true, opacity: .28});	
	var shad1 = new THREE.Mesh(geom2, mater2);
	shad1.position.set(-3.3, 1, -9.99);

	scene.add(shad1);
	scene.add(paderS1);
	scene.add(paderS2);
	scene.add(paderS3);
	scene.add(paderS4);
	scene.add(paderS4b);
	scene.add(paderS4c);
	scene.add(paderS5);
	scene.add(paderS6);		
	scene.add(paderS7);		
	scene.add(paderS8);		
	scene.add(paderS9);		
}

function pader1A() {
	var geometry = new THREE.PlaneBufferGeometry(6.4, 9);
	var material = new THREE.MeshPhongMaterial({color: 0x888888});
	var pader1A = new THREE.Mesh(geometry, material);
	pader1A.position.set(0, 1.5, -9.7);
	pader1A.receiveShadow = true;
	
	var geometry2 = new THREE.PlaneBufferGeometry(.3, 9);
	var pader2A = new THREE.Mesh(geometry2, material);
	pader2A.rotation.y = -Math.PI/2;
	pader2A.position.set(-3.2, 1.5, -9.85);
	pader2A.receiveShadow = true;	
	
	var pader3A = pader2A.clone();
	pader3A.rotation.y = Math.PI/2;
	pader3A.position.x = 3.2;
	
	scene.add(pader1A);
	scene.add(pader2A);
	scene.add(pader3A);
}

function pinto(tex) {
	var geom = new THREE.BoxBufferGeometry(3, 6, .08);
	var mater = new THREE.MeshLambertMaterial({color: 0x9c9995});
	var pintoF = new THREE.Mesh(geom, mater);
	pintoF.position.set(0, 0, 10);
	pintoF.receiveShadow = true;
	
	var geomS = new THREE.PlaneBufferGeometry(2.782, 5.9);
	var materS = new THREE.MeshLambertMaterial({color: 0x636363});
	var pintoS = new THREE.Mesh(geomS, materS);
	pintoS.position.set(0, -.08, 9.95);
	pintoS.rotation.y = Math.PI;
		
	var geom2 = new THREE.BoxBufferGeometry(2.75, 5.82, .08);
	var pinto = new THREE.Mesh(geom2, mater);
	pinto.position.set(0, -.055, 9.985);
	pinto.receiveShadow = true;	
	
	var geom3 = new THREE.CylinderBufferGeometry(.13, 0, .05, 16, 1, true);
	var mater3 = new THREE.MeshLambertMaterial({color: 0xd9d6d3, map: tex});
	var knob1 = new THREE.Mesh(geom3, mater3);
	knob1.rotation.x = Math.PI/2;
	knob1.position.set(-1.1, 0, 9.9);
	knob1.receiveShadow = true;		
	
	var geom4 = new THREE.SphereBufferGeometry(.1);
	var knob2 = new THREE.Mesh(geom4, mater3);
	knob2.position.set(-1.1, 0, 9.8);
	knob2.receiveShadow = true;	

	var geom5 = new THREE.CylinderBufferGeometry(.025, .025, .3);
	var hinge = new THREE.Mesh(geom5, materS);
	hinge.position.set(1.375, 0, 9.96);
	hinge.receiveShadow = true;	
	
	var hinge2 = hinge.clone();
	var hinge3 = hinge.clone();
	hinge2.position.y = 2.3;
	hinge3.position.y = -2.3;
	
	scene.add(pintoF);
	scene.add(pintoS);
	scene.add(pinto);
	scene.add(knob1);
	scene.add(knob2);		
	scene.add(hinge);		
	scene.add(hinge2);		
	scene.add(hinge3);		
}

function bintana(tex) {
	var geometry = new THREE.BoxBufferGeometry(18, 8, .075);
	var material2 = new THREE.MeshBasicMaterial({map: tex, transparent: true, opacity: .25, side: THREE.DoubleSide});
	var bintana = new THREE.Mesh(geometry, material2);	
	bintana.rotation.y = Math.PI/-2;
	bintana.position.set(10.2, 1.5, 0);
	
	scene.add(bintana);		
}

function bubongS() {
	var geometry = new THREE.PlaneBufferGeometry(20, 20);
	var material = new THREE.MeshLambertMaterial({color: 0x939699});
	var bubongS1 = new THREE.Mesh(geometry, material);
	bubongS1.rotation.x = Math.PI/2;
	bubongS1.position.set(0, 6, 0);
	bubongS1.receiveShadow = true;

	var geometry2 = new THREE.PlaneBufferGeometry(7.8, 20);
	var material2 = new THREE.MeshPhongMaterial({color: 0xbbbbbb});
	var bubongS2 = new THREE.Mesh(geometry2, material2);
	bubongS2.rotation.x = Math.PI/2;
	bubongS2.position.set(0, 5.8, 0);
	bubongS2.receiveShadow = true;	

	var geometry3 = new THREE.PlaneBufferGeometry(20, .22);
	var bubongS3 = new THREE.Mesh(geometry3, material2);
	bubongS3.rotation.y = -Math.PI/2;
	bubongS3.position.set(-3.9, 5.9, 0);
	bubongS3.receiveShadow = true;	
	
	var bubongS4 = bubongS3.clone();
	bubongS3.rotation.y = Math.PI/2;
	bubongS3.position.x = 3.9;
	
	scene.add(bubongS1);
	scene.add(bubongS2);
	scene.add(bubongS3);
	scene.add(bubongS4);
}

function kabinet(tex) {
	var geometry = new THREE.BoxBufferGeometry(2, 2, 6);
	var material = new THREE.MeshPhongMaterial({color: 0x5d4030, map: tex});	
	var kabinet = new THREE.Mesh(geometry, material);
	kabinet.position.set(-9, -2, 0);
	kabinet.castShadow = true;
	kabinet.receiveShadow = true;	
	
	scene.add(kabinet);
}

function loadIlaw() {
loadO.load(
	'obj/interior/cone1.obj',
	function (object, materials) {
		var mater = new THREE.MeshPhongMaterial({color: 0x202020, side: THREE.DoubleSide});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var cone1 = object.children[0].clone();
		cone1.scale.set(.3, .3, .3);
		cone1.rotation.x = Math.PI;
		cone1.position.set(0, 3.5, 0);		

		var geom2 = new THREE.CylinderBufferGeometry(.02, .02, 2.2);
		var ilawW = new THREE.Mesh(geom2, mater);
		ilawW.castShadow = true;
		ilawW.receiveShadow = true;
		ilawW.position.y = 4.8;		
		
		var geom3 = new THREE.RingBufferGeometry(.02, .1);
		var ilawR = new THREE.Mesh(geom3, mater);		
		ilawR.rotation.x = Math.PI/2;
		ilawR.position.y = 5.79;	
		
		var geom4 = new THREE.SphereBufferGeometry(.15, 8, 6, 0, Math.PI*2, Math.PI/2, Math.PI/2);
		var mater2 = new THREE.MeshPhongMaterial({color: 0x999388, shininess: 15});
		var bulb = new THREE.Mesh(geom4, mater2);
		bulb.position.y = 3.33;

		ilawG1.add(ilawR);
		ilawG1.add(ilawW);
		ilawG1.add(cone1);
		ilawG1.add(bulb);
		
		ilawG2 = ilawG1.clone();
		ilawG3 = ilawG1.clone();
		ilawG2.position.x = -1.5;
		ilawG3.position.x = 1.5;
		
		scene.add(ilawG1);
		scene.add(ilawG2);
		scene.add(ilawG3);
	});
}

function langit(tex) {
	var geometry3 = new THREE.SphereBufferGeometry(20, 20, 12, Math.PI, Math.PI, Math.PI/3.6, Math.PI/2.4);
	var material3 = new THREE.MeshBasicMaterial({map: tex, side: THREE.BackSide});
	var backSky = new THREE.Mesh(geometry3, material3);
	backSky.rotation.y = Math.PI/-2;
	backSky.scale.z = .55;
	backSky.position.set(6.4, -1, 0);	
	
	scene.add(backSky);			
}

function sahig(tex) {
	var planeGeo = new THREE.PlaneBufferGeometry(20, 20);
	groundMirror = new THREE.Mirror(renderer, camera, {clipBias: 0.003, textureWidth: ww, textureHeight: wh, color: 0x535659});
	var mirrorMesh = new THREE.Mesh(planeGeo, groundMirror.material);
	mirrorMesh.add(groundMirror);
	mirrorMesh.rotateX(-Math.PI/2);
	mirrorMesh.position.y = floorposY;
	scene.add(mirrorMesh);
	verticalMirror = new THREE.Mirror( renderer, camera, {clipBias: 0.003, textureWidth: 1, textureHeight: 1, color:0x777777});
	var verticalMirrorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(0, 0), verticalMirror.material);
	verticalMirrorMesh.add(verticalMirror);
	verticalMirrorMesh.position.y = 10;
	verticalMirrorMesh.position.z = -10;
	scene.add(verticalMirrorMesh);
	
	var geometry = new THREE.PlaneBufferGeometry(20, 20);
	var material = new THREE.MeshPhongMaterial({color: 0x56595c, map: tex, transparent: true, opacity: .7});
	var sahig = new THREE.Mesh(geometry, material);
	sahig.rotateX(-Math.PI/2);
	sahig.position.y = floorposY+.01;
	sahig.receiveShadow = true;	
	scene.add(sahig);	
	
	mirrorGo = true;
}

function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now()*.02;

	if (entro) {
		po1 -= .01;
		po2 += .02;
		if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			entro = false;
			document.getElementById('aud').volume = 0.6;
			document.getElementById('aud').play();
		}		
		if (po2 < 1.0) {
			cntnr.style.opacity = po2;
		} else {
			cntnr.style.opacity = 1.0;
		}
	}
					
	render();
}

function render() {
	if (mirrorGo) {
		groundMirror.renderWithMirror(verticalMirror);
		verticalMirror.renderWithMirror(groundMirror);	
	}
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

//}());





