/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
//(function(){

const floorposY = 0; 

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = false, geometry, material, vertices, starS, starGeom, starMater, 
	jupiter, jupGo = junoGo = false;

var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0', 
	pinfo = document.getElementById('pinfo2'), po1 = 1.0, po2 = 0;	
	
var	junoG = new THREE.Group(); 	
var loader = new THREE.TextureLoader();		
var clock = new THREE.Clock();
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
cntnr.style.opacity = 0;

if (!Detector.webgl) Detector.addGetWebGLMessage();

function init() {
	camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	camera.position.set(-80, 0, 200);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.0005);
	camera.lookAt(scene.position);	
	
	var aLight = new THREE.AmbientLight(0x010101);
	scene.add(aLight);
	var spotLight = new THREE.SpotLight(0xffffff, 3, 800, Math.PI/4, 0.8);
	spotLight.position.set(0, 0, -500);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 20;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.camera.fov = 50;
	scene.add(spotLight);	
	
	skyBG();
	starS();
	loadSpex();
	loadTex0();
	loadJtex1();
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
    controls.autoRotateSpeed = .025;
    controls.autoRotate = true;	
	controls.minDistance = 100;
	controls.maxDistance = 500;	
	
	animate();
}	

function skyBG() {
	loader.load(
		'imj/shade/spc/nebtex5.jpg',
		function (bgTex) {	
			var skyg = new THREE.IcosahedronGeometry(2000, 2);
			var backg = new THREE.Mesh(skyg, new THREE.MeshBasicMaterial({map:bgTex, side:THREE.BackSide, depthWrite: false, transparent: true, opacity: .4, fog: false}));
			scene.add(backg);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);				
}

function starS() {
	starGeom = new THREE.BufferGeometry();
	var positions = new Float32Array(1000 * 3);

	loader.load(
		'imj/shade/spc/star1.png',
		function (texture) {	
			for ( var i = 0; i < 3000; i += 3 ) {
				var vertex = new THREE.Vector3();
				do {
					vertex.x = Math.random() * 2000 - 1000;
					vertex.y = Math.random() * 2000 - 1000;
					vertex.z = Math.random() * 2000 - 1000;		
				} while (vertex.length() < 600);
					
				positions[i] = vertex.x;
				positions[i + 1] = vertex.y;
				positions[i + 2] = vertex.z;			
			}
	
			starGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
			//geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			starGeom.computeBoundingBox();
					
			starMater = new THREE.PointsMaterial({size: 40, color: 0xffffff, map: texture, transparent: true, opacity: .9, sizeAttenuation: true, fog: true, depthWrite: false});
			starS = new THREE.Points(starGeom, starMater);	
			scene.add(starS);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);			
}

function loadTex0() {
	loader.load(
		'imj/shade/spc/sun3.jpg',
		function (tex) {
			loadTex2(tex);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function loadTex2(tex0) {
	loader.load(
		'imj/spacer.png',
		function (tex) {
			loadTex3(tex0, tex);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function loadTex3(tex0, tex2) {
	loader.load(
		'imj/shade/lens2.png',
		function (tex) {
			flareS1(tex0, tex2, tex);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function flareS1(txFlare0, txFlare2, txFlare3) {
	adLight(0.08, 0.8, 0.5, 0, 0, -500);
	function adLight(h, s, l, x, y, z) {
		var light = new THREE.PointLight(0xffffff, 0, 0);
		light.color.setHSL(h, s, l);
		light.position.set(x, y, z);
		//scene.add( light );
		var flareCol = new THREE.Color(0xffffff);
		flareCol.setHSL(h, s, l + 0.5);
		var lensFlare = new THREE.LensFlare(txFlare0, 260, 0.0, THREE.AdditiveBlending, flareCol);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare2, 512, 0.0, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 40, 0.2, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 50, 0.25, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 80, 0.31, THREE.AdditiveBlending);
		lensFlare.add(txFlare3, 60, 0.38, THREE.AdditiveBlending);	
		lensFlare.add(txFlare3, 90, 0.44, THREE.AdditiveBlending);	
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
		//object.lensFlares[2].y += 0.025;
		object.lensFlares[3].rotation = object.positionScreen.x*0.5+THREE.Math.degToRad(45);
	}
}

function loadSpex() {
	loader.load(
		'imj/shade/spc/jupspec.jpg',
		function (tex) {
			jupiter(tex);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function jupiter(spex) {
	loader.load(
		'imj/shade/spc/jup2.jpg',
		function (tex) {
			var geometry = new THREE.IcosahedronGeometry(60, 4);
			var material = new THREE.MeshPhongMaterial({map: tex, specularMap: spex, specular: 0x222222, shininess: 15});		
			jupiter = new THREE.Mesh(geometry, material);
			jupiter.castShadow = true;
			jupiter.receiveShadow = true;
			scene.add(jupiter);		
			vertices = jupiter.geometry.vertices;
			jupGo = true;
		},	function (xhr) {}, function (xhr) {}
	);
	
	var geometry = new THREE.IcosahedronGeometry(59, 4);
	var material = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0, transparent: true});
	var jGlow = new THREE.Mesh(geometry, material);
	jGlow.position.set(0, 0, -1.2);
	scene.add(jGlow);	
	var glowM1 = new THREEx.GeometricGlowMesh(jGlow, 2.0, 0.3, 3.0);
	jGlow.add(glowM1.object3d);
	var ouni = glowM1.outsideMesh.material.uniforms;
	ouni.glowColor.value.set('#ffffff');	
}

function loadJtex1() {
	loader.load(
		'imj/shade/tile1.jpg',
		function (tex) {
			loadJtex2(tex);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function loadJtex2(tex) {
	loader.load(
		'imj/shade/tile2.jpg',
		function (tex2) {
			loadJtex3(tex, tex2);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function loadJtex3(tex, tex2) {
	loader.load(
		'imj/shade/tile3.jpg',
		function (tex3) {
			loadJtex4(tex, tex2, tex3);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function loadJtex4(tex, tex2, tex3) {
	loader.load(
		'imj/shade/junotip.png',
		function (tex4) {
			junoModel(tex, tex2, tex3, tex4);
		},	function (xhr) {}, function (xhr) {}
	);		
}

function junoModel(tex1, tex2, tex3, tex4) {
	var geometry = new THREE.CylinderBufferGeometry(3, 3, 3, 6);
	var material = new THREE.MeshPhongMaterial({color: 0x444444, map: tex2});
	var cyl = new THREE.Mesh(geometry, material);
	junoG.add(cyl);

	var geometry = new THREE.CylinderBufferGeometry(.2, 2.6, 1, 16);
	var material = new THREE.MeshPhongMaterial({color: 0xaaaaaa, map: tex2});
	var dish = new THREE.Mesh(geometry, material);
	junoG.add(dish);
	dish.position.y = 3.6;
	var dish2 = dish.clone();
	junoG.add(dish2);
	dish2.position.y = 2.6;
	dish2.rotation.x = Math.PI;
	var geometry = new THREE.BoxBufferGeometry(1.6, 1, 1.6);
	var material = new THREE.MeshPhongMaterial({emissive: 0x010101, map: tex3, shininess: 50});
	var dishB = new THREE.Mesh(geometry, material);
	junoG.add(dishB);
	dishB.position.y = 2;
	
	var geometry = new THREE.CylinderBufferGeometry(.9, 1, .6, 16, 1, true);
	var material = new THREE.MeshPhongMaterial({color: 0x695c3a, side: THREE.DoubleSide});
	var booster = new THREE.Mesh(geometry, material);
	junoG.add(booster);
	booster.position.y = -1.56;	

	var geometry = new THREE.BoxBufferGeometry(1.3, .1, 1.5);
	var material = new THREE.MeshPhongMaterial({color: 0x776044, map: tex3, shininess: 50});
	var cel1 = new THREE.Mesh(geometry, material);
	junoG.add(cel1);
	cel1.position.set(1.1, -.8, 2.4);
	cel1.rotation.x = Math.PI/2;
	cel1.rotation.z = -Math.PI/6;
	
	var cel2 = cel1.clone();
	junoG.add(cel2);
	cel2.position.set(1, .8, 2.48);		
	
	var cel3 = cel1.clone();
	junoG.add(cel3);
	cel3.position.set(2, .8, 1.9);	
	cel3.scale.set(.5, 1, .5);
	
	var geometry = new THREE.BoxBufferGeometry(4, .3, 4);
	var material = new THREE.MeshPhongMaterial({map: tex1, shininess: 50});
	var pane = new THREE.Mesh(geometry, material);
	junoG.add(pane);
	var pane2 = pane.clone();
	junoG.add(pane2);	
	var pane3 = pane.clone();
	junoG.add(pane3);	
	var pane4 = pane.clone();
	junoG.add(pane4);
	var pane5 = pane.clone();
	junoG.add(pane5);
	var pane6 = pane.clone();
	junoG.add(pane6);
	var pane7 = pane.clone();
	junoG.add(pane7);
	var pane8 = pane.clone();
	junoG.add(pane8);
	var pane9 = pane.clone();
	junoG.add(pane9);
	var pane10 = pane.clone();
	junoG.add(pane10);
	var pane11 = pane.clone();
	junoG.add(pane11);
	pane.position.x = 4.6;
	pane2.position.x = 8.74;
	pane3.position.x = 12.88;
	pane4.position.x = -2.37;
	pane4.position.z = -4.04;
	pane5.position.x = -4.44;
	pane5.position.z = -7.6;
	pane6.position.x = -6.51;
	pane6.position.z = -11.2;
	pane7.position.x = -8.58;
	pane7.position.z = -14.8;
	pane4.rotation.y = pane5.rotation.y = pane6.rotation.y = pane7.rotation.y = Math.PI/6;
	pane8.position.x = -2.37;
	pane8.position.z = 4.04;
	pane9.position.x = -4.44;
	pane9.position.z = 7.6;
	pane10.position.x = -6.51;
	pane10.position.z = 11.2;
	pane11.position.x = -8.58;
	pane11.position.z = 14.8;
	pane8.rotation.y = pane9.rotation.y = pane10.rotation.y = pane11.rotation.y = -Math.PI/6;
	
	var geometry = new THREE.PlaneBufferGeometry(4, 4);
	var material = new THREE.MeshPhongMaterial({map: tex4, transparent: true, opacity: .9, shininess: 40});
	var jTip = new THREE.Mesh(geometry, material);
	junoG.add(jTip);	
	jTip.position.x = 18.6;
	jTip.position.y = .1;
	jTip.rotation.x = -Math.PI/2;
	jTip.rotation.z = -Math.PI/2;
	jTip.scale.y = 1.8;
	var jTip2 = jTip.clone();
	junoG.add(jTip2);	
	jTip.position.y = -.1;
	jTip.rotation.x = Math.PI/2;
	
	cyl.castShadow = dish.castShadow = dish2.castShadow = dishB.castShadow = booster.castShadow = cel1.castShadow = cel2.castShadow = cel3.castShadow = pane.castShadow = pane2.castShadow = pane3.castShadow = pane4.castShadow = pane5.castShadow = pane6.castShadow = pane7.castShadow = pane8.castShadow = pane9.castShadow = pane10.castShadow = pane11.castShadow = jTip.castShadow = jTip2.castShadow = true;
	cyl.receiveShadow = dish.receiveShadow = dish2.receiveShadow = dishB.receiveShadow = booster.receiveShadow = cel1.receiveShadow = cel2.receiveShadow = cel3.receiveShadow = pane.receiveShadow = pane2.receiveShadow = pane3.receiveShadow = pane4.receiveShadow = pane5.receiveShadow = pane6.receiveShadow = pane7.receiveShadow = pane8.receiveShadow = pane9.receiveShadow = pane10.receiveShadow = pane11.receiveShadow = jTip.receiveShadow = jTip2.receiveShadow = true;
	
	scene.add(junoG);
	junoGo = true;
}



function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now()*.025;
	
	if (entro) {
		po1 -= .002;
		po2 += .005;
		if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			entro = false;
		}		
		if (po2 < 1.0) {
			cntnr.style.opacity = po2;
		} else {
			cntnr.style.opacity = 1.0;
		}
	}
					
	if (jupGo) {
		for ( var i = 0, l = vertices.length; i < l; i ++ ) {
			vertices[i].x += .006 * Math.sin(i/6 + (timer + i)/8);
			vertices[i].y += .005 * Math.cos(i/6 + (timer + i)/8);
			vertices[i].z += .006 * Math.sin(i/6 + (timer + i)/8);
		}			
		jupiter.geometry.verticesNeedUpdate = true;
		jupiter.rotation.y += .0005;
	}

	if (junoGo) {
		junoG.position.set(Math.cos(timer*.006)*120, 0, Math.sin(timer*.006)*120);
		junoG.rotation.set(Math.sin(timer*.005), Math.cos(timer*.006), Math.sin(timer*.007));
	}
	
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

//}());





