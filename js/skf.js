/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     
   Twitter: @armychiu						*/

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	camera, scene, renderer, geom, mater, x = y = z = pis = 0, pif = 1, ntro = true, startT = Date.now(), oldT = 0, kys, arwS, uniforms, lobosA=[], planeo, planeo2, planeo3;
	
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

var loboT = THREE.ImageUtils.loadTexture('imj/rainb1.jpg', undefined, lobO);
loboT.wrapS = loboT.wrapT = THREE.RepeatWrapping;
loboT.repeat.set(3, 1);

var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
container.appendChild(renderer.domElement);

function init() {
	camera = new THREE.PerspectiveCamera(80, ww/wh, 1, 1000000);
	camera.position.set(-240, 60, 1000);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x121212, 0.00002);
	camera.lookAt(scene.position);
	var aLight = new THREE.AmbientLight(0x0c0c0c);
	scene.add( aLight );
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

function flareS1() {
	var dLight = new THREE.DirectionalLight(0xffffff, 1);
	dLight.position.set(0, 1500, -20000).normalize();
	dLight.castShadow = true;
	scene.add(dLight);
	dLight.color.setHSL(0.1, 0.7, 0.5);
	var txFlare0 = THREE.ImageUtils.loadTexture("imj/arw2.png");
	var txFlare2 = THREE.ImageUtils.loadTexture("imj/spacer.png");
	var txFlare3 = THREE.ImageUtils.loadTexture("imj/shade/lensf.png");
	adLight(0.08, 0.8, 0.5, 0, 1500, -20000);
	function adLight(h, s, l, x, y, z) {
		var light = new THREE.PointLight( 0xffffff, 5, 0 );
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
		lensFlare.add(txFlare3, 85, 0.44, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 140, 0.5, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 110, 0.56, THREE.AdditiveBlending);	
		lensFlare.add(txFlare3, 160, 0.64, THREE.AdditiveBlending);	
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

var loader = new THREE.OBJLoader();
loader.load(
	'obj/ulap.obj',
	function (object, materials) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.material.transparent = true;
				child.material.opacity = 0.98;				
				child.material.shininess = 0;
				child.receiveShadow = true;
			}
		});
		var ulapa = [];
		ulapa[0] = object.clone();
		ulapa[0].position.set(-400, 60, 60);
		ulapa[0].rotation.y = Math.random() * Math.PI;
		ulapa[0].scale.set(60, 60, 60);
		scene.add(ulapa[0]);		
		ulapa[1] = object.clone();
		ulapa[1].position.set(600, -120, -80);
		ulapa[1].rotation.y = Math.random()*Math.PI;
		ulapa[1].scale.set(70, 70, 70);
		scene.add(ulapa[1]);					
		for (var i = 2; i < 76; i++) {
			ulapa[i] = object.clone();
			ulapa[i].position.x = 20000*(2.0*Math.random()-1.0);
			ulapa[i].position.y = 4000*(1.1*Math.random()-1.0);
			ulapa[i].position.z = 18000*(1.3*Math.random()-1.0);
			ulapa[i].rotation.y = Math.random()*Math.PI;
			var scale = Math.random()*50+50;
			ulapa[i].scale.set(scale, scale, scale);
			scene.add( ulapa[i] );
		}
	}
);

var lobos = new THREE.Group();
function lobO() {
	geom = new THREE.SphereGeometry(12, 16, 16, 0, Math.PI*2, 0, 2.2);
	mater = new THREE.MeshPhongMaterial({map: loboT, shininess: 40, side: THREE.DoubleSide, shading: THREE.FlatShading, fog: true});	
	var sphir = new THREE.Mesh(geom, mater);
	lobos.add(sphir);	
	geom = new THREE.CylinderGeometry(9.8, 3, 8, 16, 1, true);
	var cyli = new THREE.Mesh(geom, mater);
	cyli.position.y = -10.9;
	cyli.rotation.y = .505;
	lobos.add(cyli);
	geom = new THREE.BoxGeometry(5.2, 3.2, 4);
	mater = new THREE.MeshBasicMaterial({color: 0x050505, fog: true});	
	var bax = new THREE.Mesh(geom, mater);
	bax.position.y = -19.5;
	lobos.add(bax);	
	geom = new THREE.BoxGeometry(5.2, 3.5, 4);
	mater = new THREE.MeshBasicMaterial({color: 0x121212, wireframe: true, fog: true});	
	var tali = new THREE.Mesh(geom, mater);
	tali.position.y = -16.5;
	lobos.add(tali);
	lobos.castShadow = true;
	lobos.receiveShadow = true;
	for ( var i = 0; i < 9; i ++ ) {
		lobosA[i] = lobos.clone();
		lobosA[i].position.x = 10000*(2.0*Math.random()-1.0);
		lobosA[i].position.y = 2000*(1.1*Math.random()-1.0);
		lobosA[i].position.z = 10000*(1.05*Math.random()-1.0);
		lobosA[i].rotation.y = Math.random()*Math.PI;
		var scale = Math.random()*4+8;
		lobosA[i].scale.set(scale, scale, scale);
		scene.add(lobosA[i]);
	}	
}

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
		planeo.position.y = 2000*(1.1*Math.random()-1.0);
		planeo.position.z = 15000*(.8*Math.random()-1.0);
		var scale = 10;
		planeo.scale.set(scale, scale, scale);
		scene.add(planeo);
		planeo2 = object.clone();
		planeo2.position.x = -35000;
		planeo2.position.y = 3000*(1.1*Math.random()-1.0);
		planeo2.position.z = 16000*(.8*Math.random()-1.0);
		scale = 11;
		planeo2.scale.set(scale, scale, scale);
		scene.add(planeo2);
		planeo3 = object.clone();
		planeo3.position.x = 32000;
		planeo3.position.y = 2500*(1.1*Math.random()-1.0);
		planeo3.position.z = 17000*(.8*Math.random()-1.0);
		planeo.rotation.x = planeo.rotation.z = planeo2.rotation.x = planeo2.rotation.z = planeo3.rotation.x = Math.PI/-2;		
		planeo3.rotation.z = Math.PI/2;
		scale = 9;
		planeo3.scale.set(scale, scale, scale);
		scene.add(planeo3);		
	});
}

init();
planeOs();
			
function animate() {
	requestAnimationFrame(animate);
	var timer = new Date().getTime();	
	if (ntro) {
		if (pif>0) {
			pif -= 0.0025;
			if (pis<1) {
				pis += 0.005;
			} else {
				pis = 1;
			}
			//document.getElementById('pinfo').style.opacity = pif;
			container.style.opacity = pis;
		} else {
			//document.getElementById('pinfo').style.opacity = 0;
			container.style.opacity = 1;
			ntro = false;
		}
	} else {	
		camera.position.set( Math.cos(timer*0.0002)*-1000, Math.sin(timer*0.00015)*800, Math.sin(timer*0.00005)*200+800);		
		camera.position.x += -mouseX*((ww+wh)*0.0005);
		camera.position.y += mouseY*((ww+wh)*0.0005);		
		uniforms.turbidity.value = Math.sin(timer*0.002)*6+12;
		uniforms.reileigh.value = Math.sin(timer*0.0003)*0.5+2.5;
		uniforms.luminance.value = Math.cos(timer*0.0001)*0.3+0.7;
		uniforms.mieCoefficient.value = Math.sin(timer*0.0001)*0.005+0.012;
		uniforms.mieDirectionalG.value = Math.cos(timer*0.0001)*0.1+0.8;
		for (var i=0; i<5; i++) {
			lobosA[i].position.x += Math.sin(timer*0.0001)*5;
			lobosA[i].position.y += Math.cos(timer*0.0001)*2;
		}		
		for (var i=5; i<9; i++) {
			lobosA[i].position.x += Math.cos(timer*0.0001)*5;
			lobosA[i].position.y += Math.sin(timer*0.0001)*2;
		}
		
		if (planeo.position.x<32000) {
			planeo.position.x += 35;
		} else {
			planeo.position.x = -32000;
			planeo.position.y = 2000*(1.1*Math.random()-1.0);
			planeo.position.z = 15000*(.8*Math.random()-1.0);
		}
		if (planeo2.position.x<35000) {
			planeo2.position.x += 30;
		} else {
			planeo2.position.x = -35000;
			planeo2.position.y = 3000*(1.1*Math.random()-1.0);
			planeo.position.z = 16000*(.8*Math.random()-1.0);
		}
		if (planeo3.position.x>-32000) {
			planeo3.position.x -= 30;
		} else {
			planeo3.position.x = 32000;
			planeo3.position.y = 2500*(1.1*Math.random()-1.0);
			planeo.position.z = 17000*(.8*Math.random()-1.0);
		}		
	}
	render();
}

function render() {
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}
