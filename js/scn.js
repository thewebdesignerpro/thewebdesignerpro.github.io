/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     
   Twitter: @armychiu						*/

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	camera, scene, renderer, geom, mater, x = y = z = pis = 0, pif = 1, ntro = true, startT = Date.now(), oldT = 0, kys, arwS, uniforms, lobosA=[], 
	planeo, planeo2, planeo3, yy = 1.4, tire, rnot, dahon, dahon2, wfan = [], wfanp = [];
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
//document.getElementById( 'optn' ).style.opacity = 0;

if (!Detector.webgl) Detector.addGetWebGLMessage();

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var container = document.getElementById('container');
container.style.opacity = pis;
//container.style.background = '#0a0e12';

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
container.appendChild(renderer.domElement);

var loboT = THREE.ImageUtils.loadTexture('imj/rainb1.jpg', undefined, lobO);
loboT.wrapS = loboT.wrapT = THREE.RepeatWrapping;
loboT.repeat.set(3, 1);
var dispMap = THREE.ImageUtils.loadTexture('imj/shade/shade1b.jpg');			
var diffMap = THREE.ImageUtils.loadTexture('imj/shade/gras/gt1.jpg', undefined, mF);
var specMap = THREE.ImageUtils.loadTexture('imj/shade/tx/ps1509s-spec.jpg');	
var norMap = THREE.ImageUtils.loadTexture('imj/shade/watnorm3.jpg');
var aoMap = THREE.ImageUtils.loadTexture('imj/shade/tx/ps1509s-ao.jpg');
dispMap.wrapS = dispMap.wrapT = norMap.wrapS = norMap.wrapT = diffMap.wrapS = diffMap.wrapT = specMap.wrapS = specMap.wrapT = aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;
dispMap.repeat.set(4, 4);
diffMap.repeat.set(64, 64);
specMap.repeat.set(32, 32);
norMap.repeat.set(1, 1);
aoMap.repeat.set(32, 32);
function mF() {
	mater = new THREE.MeshPhongMaterial({ color: 0xffdd88, specular: 0xffffff, specularMap: specMap, shininess: 18, map: diffMap, normalMap: norMap, normalScale: new THREE.Vector2(0.3, -0.3), aoMap: aoMap, aoMapIntensity: 0.3, displacementMap: dispMap, displacementScale: 9, displacementBias: 0 });
	geom = new THREE.PlaneGeometry( 120, 120, 128, 128 );
	var mesh = new THREE.Mesh(geom, mater);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.position.set(0, -15000, 0);
	mesh.rotation.x -= Math.PI/2;
	mesh.scale.set( 2400, 2400, 2400 );
	scene.add(mesh);
}

function init() {
	camera = new THREE.PerspectiveCamera(80, ww/wh, .1, 1000000);
	camera.position.set(0, 200, 2000);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x2e2c2a, 0.00002);
	camera.lookAt(scene.position);
	var aLight = new THREE.AmbientLight(0x0c0c0c);
	scene.add(aLight);
	initKys();
}

function initKys() {
	kys = new THREE.Sky();
	scene.add(kys.mesh);
	arwS = new THREE.Mesh(new THREE.SphereBufferGeometry(12000, 16, 8), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.4}));
	arwS.position.y = -700000;
	arwS.visible = false;
	scene.add( arwS );
	uniforms = kys.uniforms;
	uniforms.turbidity.value = 10;
	uniforms.reileigh.value = 2;
	uniforms.mieCoefficient.value = 0.005;
	uniforms.mieDirectionalG.value = 0.8;
	uniforms.luminance.value = 1;	
	var phi = 2*Math.PI*-0.25;
	var theta = Math.PI*-0.01;
	arwS.position.x = 400000*Math.cos(phi);
	arwS.position.y = 400000*Math.sin(phi)*Math.sin(theta);
	arwS.position.z = 400000*Math.sin(phi)*Math.cos(theta);
	kys.uniforms.sunPosition.value.copy(arwS.position);
	renderer.render(scene, camera);
	flareS1();
}
var dLight;
function flareS1() {
	dLight = new THREE.DirectionalLight(0xffffff, 1);
	//dLight.position.set(0, 1500, -20000).normalize();
	dLight.position.set(0, 1500, -20000);
	scene.add(dLight);
	dLight.color.setHSL(0.1, 0.7, 0.5);
	var spotLight = new THREE.SpotLight(0xffffff, 1, Math.PI/2);	
	spotLight.position.set(0, 1500, -20000);	
	spotLight.castShadow = true;
	spotLight.onlyShadow = true;
	spotLight.shadowDarkness = 0.75;
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.shadowCameraNear = 500;
	spotLight.shadowCameraFar = 30000;
	spotLight.shadowCameraFov = 70;
	scene.add(spotLight);
	var txFlare0 = THREE.ImageUtils.loadTexture("imj/arw2.png");
	var txFlare2 = THREE.ImageUtils.loadTexture("imj/spacer.png");
	var txFlare3 = THREE.ImageUtils.loadTexture("imj/shade/lensf.png");
	adLight(0.08, 0.8, 0.6, 0, 1500, -20000);
	function adLight(h, s, l, x, y, z) {
		var light = new THREE.PointLight( 0xffffff, 1, 0 );
		light.color.setHSL(h, s, l);
		light.position.set(x, y, z);
		//scene.add( light );
		var flareCol = new THREE.Color(0xffffff);
		flareCol.setHSL(h, s, l + 0.5);
		var lensFlare = new THREE.LensFlare(txFlare0, 300, 0.0, THREE.AdditiveBlending, flareCol);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 65, 0.4, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 85, 0.48, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 140, 0.6, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 110, 0.7, THREE.AdditiveBlending);	
		lensFlare.add(txFlare3, 160, 0.8, THREE.AdditiveBlending);	
		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position.copy(light.position);
		scene.add(lensFlare);
	}
	function lensFlareUpdateCallback(object) {
		var f, fl = object.lensFlares.length, flare, vecX = -object.positionScreen.x*2, vecY = -object.positionScreen.y*2;
		for(f = 0; f < fl; f++) {
			flare = object.lensFlares[f];
			flare.x = object.positionScreen.x+vecX*flare.distance;
			flare.y = object.positionScreen.y+vecY*flare.distance;
			flare.rotation = 0;
		}
		object.lensFlares[2].y += 0.025;
		object.lensFlares[3].rotation = object.positionScreen.x*0.5+THREE.Math.degToRad(45);
	}
}

var lobos = new THREE.Group();
function lobO() {
	geom = new THREE.SphereGeometry(12, 16, 16, 0, Math.PI*2, 0, 2.2);
	mater = new THREE.MeshPhongMaterial({color: 0xffffff, map: loboT, shininess: 40, side: THREE.DoubleSide, shading: THREE.FlatShading, fog: true});	
	var sphir = new THREE.Mesh(geom, mater);
	sphir.castShadow = true;
	sphir.receiveShadow = true;
	lobos.add(sphir);	
	geom = new THREE.CylinderGeometry(9.78, 3, 8, 16, 1, true);
	var cyli = new THREE.Mesh(geom, mater);
	cyli.position.y = -10.9;
	cyli.rotation.y = .5;
	lobos.add(cyli);
	geom = new THREE.BoxGeometry(5.2, 3.2, 4);
	mater = new THREE.MeshPhongMaterial({color: 0x050505, fog: true});	
	var bax = new THREE.Mesh(geom, mater);
	bax.position.y = -19.5;
	bax.castShadow = true;
	bax.receiveShadow = true;
	lobos.add(bax);	
	geom = new THREE.BoxGeometry(5.2, 3.5, 4);
	mater = new THREE.MeshBasicMaterial({color: 0x0a0a0a, wireframe: true, fog: true});	
	var tali = new THREE.Mesh(geom, mater);
	tali.position.y = -16.5;
	lobos.add(tali);
	lobos.castShadow = true;
	lobos.receiveShadow = true;
	for (var i = 0; i < 9; i++) {
		lobosA[i] = lobos.clone();
		lobosA[i].position.x = 10000*(2.0*Math.random()-1.0);
		lobosA[i].position.y = 3000*(1.3*Math.random()-1.0)+4000;
		lobosA[i].position.z = 10000*(1.05*Math.random()-1.0);
		lobosA[i].rotation.y = Math.random()*Math.PI;
		var scale = Math.random()*6+12;
		lobosA[i].scale.set(scale, scale, scale);
		scene.add(lobosA[i]);
	}	
}
var loader = new THREE.OBJLoader();
loader.load(
	'obj/ulap.obj',
	function (object, materials) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.material.shading = THREE.SmoothShading;
				child.material.transparent = true;
				child.material.opacity = 0.98;				
				child.material.shininess = 0;
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		var ulapa = [];
		for (var i = 0; i < 50; i++) {
			ulapa[i] = object.clone();
			ulapa[i].position.x = 20000*(2.0*Math.random()-1.0);
			ulapa[i].position.y = 10000*(2*Math.random()-1.0)+12000;
			ulapa[i].position.z = 18000*(1.3*Math.random()-1.0);
			ulapa[i].rotation.y = Math.random()*Math.PI;
			var scale = Math.random()*120+110;
			ulapa[i].scale.set(scale, scale, scale);
			scene.add( ulapa[i] );
		}
	}
);
function planeOs() {
loader.load(
	'obj/planeo.obj',
	function (object, materials) {	
		var materl = new THREE.MeshPhongMaterial({color: 0xdddddd, shininess: 40, side: THREE.DoubleSide, fog: true});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;				
				child.material = materl;	
			}
		});	
		planeo = planeo2 = planeo3 = object.clone();
		planeo.position.x = -32000;
		planeo.position.y = 2000*(1.1*Math.random()-1.0)+2500;
		planeo.position.z = 15000*(.8*Math.random()-1.0);
		var scale = 10;
		planeo.scale.set(scale, scale, scale);
		scene.add(planeo);
		planeo2 = object.clone();
		planeo2.position.x = -35000;
		planeo2.position.y = 3000*(1.1*Math.random()-1.0)+3500;
		planeo2.position.z = 16000*(.8*Math.random()-1.0);
		scale = 11;
		planeo2.scale.set(scale, scale, scale);
		scene.add(planeo2);
		planeo3 = object.clone();
		planeo3.position.x = 32000;
		planeo3.position.y = 2500*(1.1*Math.random()-1.0)+3000;
		planeo3.position.z = 17000*(.8*Math.random()-1.0);
		planeo.rotation.x = planeo.rotation.z = planeo2.rotation.x = planeo2.rotation.z = planeo3.rotation.x = Math.PI/-2;		
		planeo3.rotation.z = Math.PI/2;
		scale = 9;
		planeo3.scale.set(scale, scale, scale);
		scene.add(planeo3);		
	});
}

loader.load(
	'obj/tree/punotr.obj',
	function (object, materials) {
		var materl = new THREE.MeshPhongMaterial({color: 0x331100, shininess: 10, fog: true});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.material.shading = THREE.SmoothShading;
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = materl;
			}
		});
		var puno = [];
		puno[0] = object.clone();
		puno[0].position.set(600, -600, 200);
		puno[0].rotation.y = yy;
		puno[0].scale.set(120, 120, 120);
		scene.add(puno[0]);		
	}
);
loader.load(
	'obj/tree/punole.obj',
	function (object, materials) {
		var materl = new THREE.MeshPhongMaterial({color: 0x116611, shininess: 10, fog: true});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = materl;
			}
		});
		dahon = object.clone();
		dahon.position.set(600, -600, 200);
		dahon.rotation.y = yy;
		dahon.scale.set(120, 120, 120);
		scene.add(dahon);		
		dahon2 = object.clone();
		dahon2.position.set(500, -900, 360);
		dahon2.scale.set(30, 25, 30);
		scene.add(dahon2);				
	}
);
loader.load(
	'obj/tree/aster1.obj',
	function (object, materials) {
		var materl = new THREE.MeshPhongMaterial({color: 0x333333, shininess: 2, fog: true});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = materl;
			}
		});
		var bato = [];
		bato[0] = object.clone();
		bato[0].position.set(500, -440, 660);
		bato[0].rotation.y = 0.5;
		bato[0].scale.set(18, 18, 18);
		scene.add(bato[0]);		
		bato[1] = object.clone();
		bato[1].position.set(240, -450, 500);
		bato[1].rotation.z = .5;
		bato[1].scale.set(12, 12, 12);
		scene.add(bato[1]);			
		bato[2] = object.clone();
		bato[2].position.set(680, -480, 500);
		bato[2].rotation.z = .9;
		bato[2].scale.set(10, 10, 10);
		scene.add(bato[2]);		
	}
);
loader.load(
	'obj/tire.obj',
	function (object, materials) {
		var materl = new THREE.MeshPhongMaterial({color: 0x303030, shininess: 10, side: THREE.DoubleSide, fog: true});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = materl;
			}
		});
		tire = object.clone();
		tire.position.set(900, 50, 600);
		tire.rotation.x = Math.PI/2;
		tire.scale.set(22, 22, 22);
		scene.add(tire);		
		geom = new THREE.CylinderGeometry( 6, 6, 750, 10, 12 );
		mater = new THREE.MeshLambertMaterial( {color: 0x050505, wireframe: true} );
		var rope = new THREE.Mesh( geom, mater );
		rope.position.set(900, 660, 600);
		scene.add(rope);
		geom = new THREE.TorusGeometry( 60, 6, 10, 16 );
		rnot = new THREE.Mesh( geom, mater );
		rnot.position.set(900, 218, 600);
		rnot.rotation.y = Math.PI/2;
		rnot.scale.y = 1.1;
		scene.add( rnot );
		geom = new THREE.TorusGeometry( 50, 5, 10, 16 );
		var rnot2 = new THREE.Mesh( geom, mater );
		rnot2.position.set(900, 1055, 600);
		rnot2.rotation.y += 1.2;
		rnot2.scale.y = 1.1;
		scene.add( rnot2 );		
		geom = new THREE.SphereGeometry( 15, 8, 8 );
		var rnot3 = new THREE.Mesh( geom, mater );
		scene.add( rnot3 );		
		var rnot4 = new THREE.Mesh( geom, mater );
		scene.add( rnot4 );		
		rnot3.scale.y = rnot4.scale.y = 1.4;		
		rnot3.position.set(900, 1010, 600);		
		rnot4.position.set(900, 285, 600);		
	}
);

loader.load(
	'obj/wmilf2.obj',
	function (object, materials) {
		var materl = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 40, fog: true});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = materl;
			}
		});
		for (var i=0; i<9; i++) {		
			wfan[i] = object.clone();
			wfan[i].scale.set(200, 200, 200);
			scene.add(wfan[i]);
			geom = new THREE.CylinderGeometry( 60, 120, 4600, 5 );
			mater = new THREE.MeshPhongMaterial( {color: 0xffffff, shininess: 40, fog: true} );
			wfanp[i] = new THREE.Mesh( geom, mater );
			wfanp[i].castShadow = true;
			wfanp[i].receiveShadow = true;						
			scene.add(wfanp[i]);
		}	
		wfan[0].position.set(-17770, -1600, -26000);
		wfanp[0].position.set(-18000, -4000, -26000);
		wfan[1].position.set(-23770, -700, -24000);
		wfanp[1].position.set(-24000, -3100, -24000);		
		wfan[2].position.set(-29770, -100, -22000);
		wfanp[2].position.set(-30000, -2500, -22000);
		wfan[3].position.set(-35770, 400, -20000);
		wfanp[3].position.set(-36000, -2000, -20000);
		wfan[4].position.set(-41770, 1000, -18000);
		wfanp[4].position.set(-42000, -1400, -18000);
		wfan[5].position.set(35770, 300, -28000);
		wfanp[5].position.set(36000, -2100, -28000);		
		wfan[6].position.set(41770, 700, -26000);
		wfanp[6].position.set(42000, -1700, -26000);
		wfan[7].position.set(47770, 900, -24000);
		wfanp[7].position.set(48000, -1500, -24000);		
		wfan[8].position.set(53770, 800, -22000);
		wfanp[8].position.set(54000, -1600, -22000);
	}
);

init();
planeOs();
			
function animate() {
	requestAnimationFrame(animate);
	var timer = new Date().getTime();	
	if (ntro) {
		if (pif>0) {
			pif -= 0.01;
			if (pis<1) {
				pis += 0.02;
			} else {
				pis = 1;
			}
			document.getElementById('pinfo').style.opacity = pif;
			container.style.opacity = pis;
		} else {
			document.getElementById('pinfo').style.opacity = 0;
			container.style.opacity = 1;
			ntro = false;
		}
	} else {	
		camera.position.x += (mouseX-camera.position.x)*0.03;
		camera.position.y += (-mouseY-camera.position.y)*0.03+(wh*0.0033);
		uniforms.turbidity.value = Math.sin(timer*0.002)*6+12;
		uniforms.reileigh.value = Math.sin(timer*0.0003)*0.5+2.5;
		uniforms.luminance.value = Math.cos(timer*0.0001)*0.3+0.7;
		uniforms.mieCoefficient.value = Math.sin(timer*0.0001)*0.005+0.012;
		uniforms.mieDirectionalG.value = Math.cos(timer*0.0001)*0.1+0.8;
		for (var i=0; i<5; i++) {
			lobosA[i].position.x += Math.sin(timer*0.0001)*5;
			lobosA[i].position.y += Math.cos(timer*0.0001);
		}		
		for (var i=5; i<9; i++) {
			lobosA[i].position.x += Math.cos(timer*0.0001)*5;
			lobosA[i].position.y += Math.sin(timer*0.0001);
		}
		
		if (planeo.position.x<32000) {
			planeo.position.x += 35;
		} else {
			planeo.position.x = -32000;
			planeo.position.y = 2000*(1.1*Math.random()-1.0)+2500;
			planeo.position.z = 15000*(.8*Math.random()-1.0);
		}
		if (planeo2.position.x<35000) {
			planeo2.position.x += 30;
		} else {
			planeo2.position.x = -35000;
			planeo2.position.y = 3000*(1.1*Math.random()-1.0)+3500;
			planeo.position.z = 16000*(.8*Math.random()-1.0);
		}
		if (planeo3.position.x>-32000) {
			planeo3.position.x -= 30;
		} else {
			planeo3.position.x = 32000;
			planeo3.position.y = 2500*(1.1*Math.random()-1.0)+3000;
			planeo.position.z = 17000*(.8*Math.random()-1.0);
		}		
		x += Math.sin(timer*0.001)*0.0002;  yy -= Math.cos(timer*0.001)*0.0002;	z -= Math.sin(timer*0.001)*0.0002;
		dahon.rotation.set(x,yy,z);		
		dahon2.rotation.set(x*2,0,z*2);		
		tire.rotation.z += z*.3;
		rnot.rotation.y -= z*.3;
		for (var i=0; i<9; i++) {
			wfan[i].rotation.x -= yy*.01;
		}
	}
	render();
}

function render() {
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}
