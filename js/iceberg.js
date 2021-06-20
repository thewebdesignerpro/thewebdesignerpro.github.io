/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
//(function(){

const floorposY = -40, rnd1 = Math.random(Math.PI); 

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = false, geometry, material, vertices, starS, starGeom, starMater, 
	lupa, dagat, dagatb, bwan, bwanC, spotLight2, backg, bwanGo = bwancGo = dagatGo = backgGo = false;

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
	camera.position.set(0, 5, 300);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x15181b, 0.0004);
	camera.lookAt(scene.position);	
	
	var aLight = new THREE.AmbientLight(0x202020);
	scene.add(aLight);
	var spotLight = new THREE.SpotLight(0xffffff, 22, 1500, Math.PI/3, 0.8);
	spotLight.position.set(0, 140, -1100);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 20;
	spotLight.shadow.camera.far = 1000;
	spotLight.shadow.camera.fov = 50;
	scene.add(spotLight);	
	
	spotLight2 = new THREE.SpotLight(0xe5f2ff, 3.6, 1000, Math.PI/5);
	spotLight2.position.set(0, 140, -400);
	
	lupaMesh();
	dagatD();
	dagatMesh();
	bwan();	
	skyBG();
	starS();	
	
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
    //controls.autoRotateSpeed = .1;
    //controls.autoRotate = true;	
	controls.minDistance = 6;
	controls.maxDistance = 600;	
	controls.minPolarAngle = Math.PI/3;	
	controls.maxPolarAngle = Math.PI/1.9;	
	
	animate();
}	

function lupaMesh() {
	loader.load(
		'imj/shade/iceb.jpg',
		function (texture) {
			var geometry = new THREE.PlaneBufferGeometry(1600, 1600, 128, 128);			
			var material = new THREE.MeshPhongMaterial({shininess: 25, color: 0x9faab0, map: texture, displacementMap: texture, displacementScale: 66.0, specularMap: texture, shading: THREE.FlatShading});
			lupa = new THREE.Mesh(geometry, material);
			lupa.rotation.set(-Math.PI/2, 0, rnd1);
			lupa.position.y = floorposY;
			lupa.castShadow = true;
			lupa.receiveShadow = true;
			//lupa.material.wireframe = true;
			scene.add(lupa);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function dagatD() {
	loader.load(
		'imj/shade/dagatD1.jpg',
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
			//texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(4, 4);			
			var geometry = new THREE.PlaneGeometry(1600, 1600);			
			var material = new THREE.MeshLambertMaterial({emissive: 0x050505, map: texture});
			//var material = new THREE.MeshLambertMaterial({map: texture});
			//var material = new THREE.MeshBasicMaterial({map: texture});
			dagatb = new THREE.Mesh(geometry, material);
			dagatb.rotation.set(-Math.PI/2, 0, rnd1);
			//dagatb.position.y = floorposY*.95;
			dagatb.position.y = floorposY*1.05;
			//dagat.material.wireframe = true;
			scene.add(dagatb);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function dagatMesh() {
	loader.load(
		'imj/shade/dagatN1.jpg',
		function (texture) {
			geometry = new THREE.PlaneGeometry(1600, 1600, 128, 128);			
			var material = new THREE.MeshPhongMaterial({shininess: 90, color: 0x131619, normalMap: texture, displacementMap: texture, displacementScale: 15.0, specularMap: texture, shading: THREE.FlatShading, transparent: true, opacity: .5});
			dagat = new THREE.Mesh(geometry, material);
			dagat.rotation.set(-Math.PI/2, 0, 0);
			//dagat.position.y = floorposY*1;
			dagat.position.y = floorposY*.95;
			//dagat.castShadow = true;
			dagat.receiveShadow = true;
			//dagat.material.wireframe = true;
			scene.add(dagat);
			dagatGo = true;
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function bwan() {
	loader.load(
		'imj/shade/bwan3.jpg',
		function (texture) {
			var geometry = new THREE.TetrahedronGeometry(260, 3);
			var material = new THREE.MeshPhongMaterial({displacementMap: texture, displacementScale: 60.0, specularMap: texture, fog: false, shading: THREE.FlatShading});					
			var geometry2 = new THREE.TetrahedronGeometry(330, 3);
			var material2 = new THREE.MeshPhongMaterial({map: texture, specularMap: texture, fog: false, shading: THREE.FlatShading, transparent: true, opacity: .5});		
			bwan = new THREE.Mesh(geometry, material);
			bwan.rotation.set(rnd1, rnd1, -rnd1);
			bwan.position.set(0, 140, -1300);
			scene.add(bwan);		
			bwanGo = true;			
			bwanC = new THREE.Mesh(geometry2, material2);
			//bwanC.rotation.set(-rnd1, rnd1, rnd1);
			bwanC.position.set(0, 140, -1300);
			scene.add(bwanC);		
			bwancGo = true;
			//spotLight2.lookAt(bwan.position);
			scene.add(spotLight2);
			spotLight2.target = bwan;
			scene.add(spotLight2.target);			
		},	function (xhr) {}, function (xhr) {}
	);
}

function skyBG() {
	loader.load(
		'imj/shade/spc/nebtex5.jpg',
		function (bgTex) {	
			var skyg = new THREE.IcosahedronGeometry(1800, 0);
			backg = new THREE.Mesh(skyg, new THREE.MeshBasicMaterial({map:bgTex, side:THREE.BackSide, depthWrite: false, transparent: true, opacity: .2, fog: false}));
			scene.add(backg);
			backgGo = true;
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
	var positions = new Float32Array(2000 * 3);

	loader.load(
		'imj/shade/spc/star1.png',
		function (texture) {	
			for ( var i = 0; i < 6000; i += 3 ) {
				var vertex = new THREE.Vector3();
				do {
					vertex.x = Math.random() * 3000 - 1500;
					vertex.y = Math.random() * 3000 - 1500;
					vertex.z = Math.random() * 3000 - 1500;		
				} while (vertex.length() < 1500);
					
				positions[i] = vertex.x;
				positions[i + 1] = vertex.y;
				positions[i + 2] = vertex.z;			
			}
	
			starGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
			//geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			starGeom.computeBoundingBox();
					
			starMater = new THREE.PointsMaterial({size: 40, color: 0xffffff, map: texture, transparent: true, opacity: .7, sizeAttenuation: true, fog: true, depthWrite: false});
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

function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now()*.02;
	
	if (entro) {
		po1 -= .002;
		po2 += .004;
		if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			entro = false;
			document.getElementById('aud').play();
		}		
		if (po2 < 1.0) {
			cntnr.style.opacity = po2;
		} else {
			cntnr.style.opacity = 1.0;
		}
	}
					
	if (dagatGo) {
		vertices = dagat.geometry.vertices;
		for ( var i = 0, l = vertices.length; i < l; i ++ ) {
			vertices[i].x += .02 * Math.sin( i / 6 + ( timer + i ) / 8 );
			vertices[i].y += .02 * Math.cos( i / 6 + ( timer + i ) / 8 );
			vertices[i].z += .08 * Math.sin( i / 6 + ( timer + i ) / 8 );
		}			
		dagat.geometry.verticesNeedUpdate = true;
		dagat.rotation.z = Math.sin(timer*.003);
	}

	if (bwanGo) {
		bwan.rotation.y += .0005;
		bwanC.rotation.y -= .00075;
	}	
	
	if (backgGo) {
		backg.rotation.x = Math.sin(timer*.0007);
		backg.rotation.y = Math.cos(timer*.0009);
		backg.rotation.z = Math.cos(timer*.0008);
	}
	
	camera.position.x += Math.cos(timer*.06) * .1;
	camera.position.y += Math.cos(timer*.07) * .1;
	camera.position.z += Math.sin(timer*.1) * .1;	
	
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





