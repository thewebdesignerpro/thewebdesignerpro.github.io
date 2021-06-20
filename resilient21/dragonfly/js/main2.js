/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
//(function(){

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, terrain, 
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, iconsObj = [], scale = 0.01, raycaster, mouse = new THREE.Vector2(), INTERSECTED = null, textHeight = 0, 
	pointclouds, threshold = 0.1, tTip, geometry, material, vertices, starS, starGeom, starMater, starS2, starGeom2, starMater2, arw2, wireframe;

var airportMesh, airplaneMesh, dataTargetsLength, dataNodesLength, nodesOrbs = [], airplanes = [], airplaneOrbs = [];

var airportObjLoaded = false;
	
var	cntnr = document.getElementById('container');	
	
const 	floorposY = 0; 

var	group = new THREE.Group(); 	

	
var textureloader = new THREE.TextureLoader();		
var objLoader = new THREE.OBJLoader();
var clock = new THREE.Clock();
//var	mouseVector = new THREE.Vector3();
//var geometry = new THREE.BufferGeometry();
var categories = [], categoryMesh = [];
//var geometry = new THREE.BoxGeometry(oneUnit, oneUnitY, oneUnit);
//var geom = new THREE.Geometry(); // for merging
var mater = new THREE.MeshBasicMaterial({transparent: true, opacity: 1.0, shading: THREE.FlatShading, vertexColors: THREE.VertexColors});
var color = new THREE.Color();
var matrix = new THREE.Matrix4();
var quaternion = new THREE.Quaternion();
var rotation = new THREE.Euler();
rotation.x = 0;
rotation.y = 0;
rotation.z = 0;
quaternion.setFromEuler(rotation, false);
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;


// If browser does not support WebGL, display a message.
if (!Detector.webgl) Detector.addGetWebGLMessage();

// The usual initialization routine, which includes setting up renderer, scene, camera, controls, and lights.
function init() {
	camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	camera.position.set(0, 50, 300);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x102236, 0.0003);
	camera.lookAt(scene.position);	
	
	var aLight = new THREE.AmbientLight(0x333333);
	scene.add(aLight);
	
	//var light = new THREE.PointLight(0xffffff, 1, 1000);
	//light.position.set(0, 0, 0);
	//scene.add(light);

	//var spotLight = new THREE.SpotLight(0xffffff, 5, 800, Math.PI/4);
	var spotLight = new THREE.SpotLight(0xffffff, 3, 800);
	spotLight.position.set(0, 440, -200);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	//spotLight.shadowDarkness = 0.75;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 5000;
	spotLight.shadow.camera.fov = 60;
	scene.add(spotLight);	
	//var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	//scene.add(spotLightHelper);	
	//var spotLightCH = new THREE.CameraHelper(spotLight.shadow);
	//scene.add(spotLightCH);	
		
	//var axisHelper = new THREE.AxisHelper(50);
	//scene.add(axisHelper);
	
	statS();
	
	//loadTexture();
	loadAirport();
	
	starS();
	skyBG();

	createOrbsNodes();
	
	loadPlane();
	commandTower();
	
	//raycaster = new THREE.Raycaster();
	//raycaster.params.Points.threshold = threshold;
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	//renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	//controls.enableZoom = false;
	controls.minDistance = 5;
	controls.maxDistance = 1000;	
	//controls.target.set(-15, 0, -100);
	//controls.center.set(0, 0, 30);
	//controls.maxPolarAngle = Math.PI/1.05;	
	//controls.center.set(0, 0, 20);
	//camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 10));
	/*controls = new THREE.FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 40;
	controls.domElement = container;
	//controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 12;
	controls.autoForward = false;
	controls.dragToLook = true;	*/
	
	animate();
}	

// For showing frames per second (FPS)
function statS() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.left = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);
}

function loadTexture() {
	textureloader.load(
		'img/texture/noise1.jpg',
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			//texture.repeat.set(48, 48);
			//texture.repeat.set(16, 16);
			texture.repeat.set(24, 24);
			//loadAirport(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

// Load our airport obj model
//function loadAirport(dirtTexture) {
function loadAirport() {
	objLoader.load(
		//'model/airport1.obj',
		'model/airport2.obj',
		// Function when resource is loaded
		function (object) {
			//var material = new THREE.MeshPhongMaterial({shininess: 15, color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true, side: THREE.DoubleSide});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true});	
			material = new THREE.MeshLambertMaterial({color: 0x0a1016, fog: true, transparent: true});	
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.geometry.computeVertexNormals();
					child.geometry.computeFaceNormals();							
					child.castShadow = true;
					child.receiveShadow = true;				
					child.material = material;	
					//child.material.wireframe = true;
				}
			});			
			
			//material.wireframe = true;
			airportMesh = object;
			//airportMesh.scale.y = 0.1;
			airportMesh.rotation.y = -1.56;
			//airportMesh.position.set(-2.7, -5.2, 16);
			airportMesh.position.set(-2.7, -1, 16);
			scene.add(airportMesh);
			
			airportObjLoaded = true;
		}
	);
}

// Draw sky background
function skyBG() {
	var canva = document.createElement('canvas');
	canva.width = 16;
	canva.height = 1024;
	var context = canva.getContext('2d');
	var gradient = context.createLinearGradient(0, 0, 0, 1024);
	gradient.addColorStop(0, "#000000");
	gradient.addColorStop(0.25, "#080c10");
	gradient.addColorStop(0.5, "#101316");
	gradient.addColorStop(0.75, "#102236");
	gradient.addColorStop(1, "#10172e");
	context.fillStyle = gradient;
	context.fillRect(0, 0, canva.width, canva.height);
	var bgTex = new THREE.Texture(canva);
	bgTex.needsUpdate = true;

	var skyg = new THREE.IcosahedronGeometry(4000, 2);
	var back = new THREE.Mesh(skyg, new THREE.MeshBasicMaterial({map:bgTex, side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false}));
	scene.add( back );
}

// Add some stars to the background
function starS() {
	starGeom = new THREE.BufferGeometry();
	var positions = new Float32Array(600 * 3);

	textureloader.load(
		'img/texture/star.png',
		function (texture) {	
			for ( var i = 0; i < 1800; i += 3 ) {
				var vertex = new THREE.Vector3();
				do {
					vertex.x = Math.random() * 4000 - 2000;
					vertex.y = Math.random() * 4000 - 2000;
					vertex.z = Math.random() * 4000 - 2000;		
				} while ( vertex.length() > 4000 || vertex.length() < 2000 || vertex.y < 10 );
					
				//if ((vertex.x==0)&&(vertex.y==0)&&(vertex.z==0)) console.log('0');	
				positions[i] = vertex.x;
				positions[i + 1] = vertex.y;
				positions[i + 2] = vertex.z;			
			}
	
			starGeom.addAttribute('position', new THREE.BufferAttribute(positions, 3));
			//geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			starGeom.computeBoundingBox();
					
			//var material = new THREE.PointsMaterial({size: 16, color: 0xffffff, map: texture, transparent: true, opacity: .8, sizeAttenuation: true, depthWrite: false, depthTest: false});
			starMater = new THREE.PointsMaterial({size: 16, color: 0xffffff, map: texture, transparent: true, opacity: .99, sizeAttenuation: true, fog: true});
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

// Add the Nodes orbs
function createOrbsNodes() {
	dataNodesLength = data.features[0].children.length;
	//console.log(dataLength);
	
	var geometry = new THREE.SphereBufferGeometry(0.2, 32, 32);

	for (var i = 0; i < dataNodesLength; i++) {
		var x = data.features[0].children[i].y - 96, 
			y = data.features[0].children[i].z, 
			z = data.features[0].children[i].x - 420;
			
		//var name = data.features[0].children[i].name, 
			//targetType = name.split(' ');
		
		//if (targetType[0] != 'Cargo') {
			//console.log(data.features[1].children[i].name);
			
			if ((data.features[0].children[i].streams < 2) || (data.features[0].children[i].streams == '')) {
				var material = new THREE.MeshBasicMaterial({color: 0x00ee11});
			} else {
				var material = new THREE.MeshBasicMaterial({color: 0xff0033});
			}
			
			nodesOrbs[i] = new THREE.Mesh(geometry, material);			
			//nodesOrbs[i] = sphere.clone();
			nodesOrbs[i].position.set(x, 2, z);
		
			scene.add(nodesOrbs[i]);
		//}
	}
}

// Load our airplane model
function loadPlane() {
	objLoader.load(
		'model/plane.obj',
		function (object) {	
			//var material = new THREE.MeshPhongMaterial({color: 0x555555, shininess: 20, side: THREE.DoubleSide, fog: true});	
			var material = new THREE.MeshPhongMaterial({color: 0x555555, shininess: 20, side: THREE.DoubleSide, fog: true, transparent: true, opacity: 0.4});	
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.geometry.computeVertexNormals();
					child.geometry.computeFaceNormals();					
					child.castShadow = true;
					child.receiveShadow = true;				
					child.material = material;	
				}
			});	
		
			airplaneMesh = object;
			var scale = 0.1;
			airplaneMesh.scale.set(scale, scale, scale);
		
			createOrbsPlanes();
		}
	);
}

// Add the airplanes and orbs
function createOrbsPlanes() {
	dataTargetsLength = data.features[1].children.length;
	//console.log(dataLength);
	
	var geometry = new THREE.SphereBufferGeometry(0.5, 32, 32);

	//scene.add(sphere);

	for (var i = 0; i < dataTargetsLength; i++) {
		var x = data.features[1].children[i].y - 96, 
			y = data.features[1].children[i].z, 
			z = data.features[1].children[i].x - 420;
			
		var name = data.features[1].children[i].name, 
			targetType = name.split(' ');
		
		//if (targetType[0] != 'Cargo') {
			//console.log(data.features[1].children[i].name);
			
			airplanes[i] = airplaneMesh.clone();
			airplanes[i].rotation.y = Math.random()*Math.PI;		
			airplanes[i].position.set(x, y, z);

			if ((data.features[1].children[i].streams < 2) || (data.features[1].children[i].streams == '')) {
				var material = new THREE.MeshBasicMaterial({color: 0x00ee11});
			} else {
				var material = new THREE.MeshBasicMaterial({color: 0xff0033});
			}
			
			airplaneOrbs[i] = new THREE.Mesh(geometry, material);			
			//airplaneOrbs[i] = sphere.clone();
			airplaneOrbs[i].position.set(x, 2, z);
		
			//airplaneOrbs[i].material.color = 0xff0044;
			
			scene.add(airplanes[i]);
			scene.add(airplaneOrbs[i]);
		//}
	}
}

// Add command tower, located at the center of the scene
function commandTower() {
	var geometry = new THREE.CylinderBufferGeometry(0.8, 1.6, 6, 8);
	var material = new THREE.MeshBasicMaterial({color: 0xaabbcc, transparent: true, opacity: 0.5});
	
	var commandTowerMesh = new THREE.Mesh(geometry, material);
	scene.add(commandTowerMesh);
}

function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}


	

function onDocumentMouseMove(event) {
	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	//mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

/*	
	raycaster.setFromCamera(mouse, camera);

	//var intersects = raycaster.intersectObjects(iconsObj);
	var intersects = raycaster.intersectObjects(iconsGroup.children);

	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0]) {
			INTERSECTED = intersects[0];
			tooltip.innerHTML = INTERSECTED.object.geometry.attributes.name.array[INTERSECTED.index];
		}
	} else {
		if (INTERSECTED) tooltip.innerHTML = '';
		INTERSECTED = null;
	}	
*/	
}
//document.addEventListener('mousemove', onDocumentMouseMove, false);

function onWindowResize( event ) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	
	renderer.setSize(ww, wh);
	
	document.body.style.width = cntnr.style.width = ww+'px';
	document.body.style.height = cntnr.style.height = wh+'px';	

/*	if (ww > wh) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((ww+wh)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((ww+wh)/2)*0.028+'px';
	}*/
}
window.addEventListener( 'resize', onWindowResize, false );	

function animate() {
	requestAnimationFrame(animate);
	
	var timer = Date.now()*.01;
	//var timer = new Date().getTime();	
	var delta = clock.getDelta(),
	time = clock.getElapsedTime() * 10;
					
/*	// Show UI
	if (kon) {
		kr += .025;
		kontrols.style.opacity = kr;
		if (kr>=1.0) kon=false;
	}
	
	// Hide UI
	if (kos) {
		kr -= .05;
		kontrols.style.opacity = kr;
		if (kr<=0) {
			kos=false;
			kontrols.style.display='none';
			gear.style.display='block';
		}
	}	*/
	
//	var delta = clock.getDelta();
//	controls.update(delta);	


	//terrain.geometry.computeVertexNormals();
	//terrain.geometry.computeFaceNormals();
	//terrain.geometry.verticesNeedUpdate = true;
	//terrain.geometry.normalsNeedUpdate = true;	

	//terrain.rotation.z -= .002;

	/*scene.remove( wireframe );
	wireframe = new THREE.WireframeHelper( terrain, 0xffffff );
	//wireframe.position.y = 10;
	scene.add( wireframe );*/
			
	if (airportObjLoaded) {
		if (camera.position.y < 0) {
			material.opacity = 0.5;
		}
	}
	
	stats.update();	
	render();
	//render( clock.getDelta() );
	
	//console.log(terrain);
}

//function render(dt) {
function render() {
	camera.lookAt(scene.position);
	
	//camera.updateMatrixWorld();

	controls.update();
	renderer.render(scene, camera);	

	//var delta = clock.getDelta();
	//controls.update(delta);
}

// Execute init() after resources have loaded.
if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}

//}());





