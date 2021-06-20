/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	container = document.getElementById('container'), gear = document.getElementById("gear"), kontrols = document.getElementById("kontrols"), 
	klose = document.getElementById("klose"), kamera = document.getElementById("kamera"), kamView = document.getElementById("view"), kategory = document.getElementById("kategory"), 
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh;

// Constants
const 	floorposY = -3.5, 
		dataLength = ElPasoData.features.length,
		oneUnit = .2,	// width and length of a unit of bar
		oneUnitY = .02,	// height of a unit of bar
		spacing = 0.8;	// spacing of the 17 stacked bars of a point

var ageMaleLoaded = ageFemaleLoaded = incomeLoaded = rentalLoaded = insuranceYoungLoaded = insuranceYoungAdultLoaded = 
	insuranceAdultLoaded = insuranceElderLoaded = commutingMethodLoaded = commutingTimeLoaded = foodStampsDisabilityLoaded = 
	languageYoungLoaded = languageAdultLoaded = languageElderLoaded = educationLoaded = familyStructureLoaded = raceLoaded = false;
		
var loader = new THREE.TextureLoader();		
var clock = new THREE.Clock();
//var	mouseVector = new THREE.Vector3();
//var geometry = new THREE.BufferGeometry();
var categories = [], categoryMesh = [];
//var geometry = new THREE.BoxGeometry(oneUnit, oneUnitY, oneUnit);
var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, oneUnitY, 4, 1, true);
var geom = new THREE.Geometry(); // for merging
var material = new THREE.MeshBasicMaterial({transparent: true, opacity: 1.0, shading: THREE.FlatShading, vertexColors: THREE.VertexColors});
var color = new THREE.Color();
var matrix = new THREE.Matrix4();
var quaternion = new THREE.Quaternion();
var rotation = new THREE.Euler();
rotation.x = 0;
rotation.y = 0;
rotation.z = 0;
quaternion.setFromEuler(rotation, false);
	
// Bar Colors
var	ageMaleColor = [0xfeff32, 0xfeff1c, 0xfeff05, 0xedee00, 0xd7d700, 0xc0c000, 0xa9aa00, 0x939300, 0x7c7c00, 0x656600],
	ageFemaleColor = [0xfffd32, 0xfffd1c, 0xfffd05, 0xeeec00, 0xd7d500, 0xc0bf00, 0xaaa800, 0x939200, 0x7c7b00, 0x666500], 
	incomeColor = [0xfef630, 0xfef514, 0xf5ec00, 0xd9d100, 0xbdb600, 0xa09b00, 0x847f00, 0x686400], 
	rentalColor = [0xfcee34, 0xfcec1b, 0xfbe902, 0xe2d202, 0xc9bb02, 0xb0a402, 0x978c01, 0x7e7501, 0x665e01], 
	insuranceYoungColor = [0xfadd1d, 0xc7ae04, 0x7d6d02], 
	insuranceYoungAdultColor = [0xf7cb1f, 0xc59e06, 0x7c6304], 
	insuranceAdultColor = [0xf5b722, 0xc38c08, 0x7a5805], 	
	insuranceElderColor = [0xf2a125, 0xc0780b, 0x794c07], 
	commutingMethodColor = [0xf1963f, 0xef8928, 0xed7d11, 0xd5700f, 0xbe640d, 0xa6570c, 0x8f4b0a, 0x773f08, 0x603206], 
	commutingTimeColor = [0xed813f, 0xea6d21, 0xd85d13, 0xbb5010, 0x9d440e, 0x7f370b, 0x612a08], 
	foodStampsDisabilityColor = [0xe96437, 0xd24516, 0x9e3410, 0x6b230b], 
	languageYoungColor = [0xe7553e, 0xde341a, 0xb62b15, 0x8d2111, 0x65170c], 	
	languageAdultColor = [0xe54341, 0xdb201d, 0xb31a18, 0x8b1412, 0x630e0d], 	
	languageElderColor = [0xec3a48, 0xe31525, 0xba111e, 0x910d18, 0x670911], 
	educationColor = [0xf63a53, 0xf5223e, 0xf30b29, 0xdb0925, 0xc30821, 0xab071d, 0x920619, 0x7a0515, 0x620410], 
	familyStructureColor = [0xfd2349, 0xe60229, 0xae011f, 0x750115], 
	raceColor = [0xff0532, 0x93001a];
	
for (i = 0; i < 17; i++) {
	categories[i] = new THREE.Geometry();
	//categories[i] = new THREE.Group();	
	//console.log(categories[i]);
}
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
kontrols.style.right = -320;
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;

// If browser does not support WebGL, display a message.
if (!Detector.webgl) Detector.addGetWebGLMessage();

// The usual initialization routine, which includes setting up renderer, scene, camera, controls, and lights.
function init() {
	//camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	camera = new THREE.CombinedCamera(ww / 2, wh / 2, 40, 1, 1000, -500, 1000);
	//camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, -500, 1000);
	camera.position.set(0, 20, 200);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x000000, 0.001);
	//camera.lookAt(scene.position);	
	//camera.toOrthographic();
	
	var aLight = new THREE.AmbientLight(0x333333);
	//scene.add(aLight);
	
	//var light = new THREE.PointLight(0xffffff, 1, 1000);
	//light.position.set(0, 0, 0);
	//scene.add(light);

	var spotLight = new THREE.SpotLight(0xffffff, 5, 500, Math.PI/4);
	spotLight.position.set(0, 400, 0);
	spotLight.castShadow = false;
	spotLight.shadowMapWidth = 1024;
	spotLight.shadowMapHeight = 1024;
	spotLight.shadowDarkness = 0.5;
	spotLight.shadowCameraNear = 20;
	spotLight.shadowCameraFar = 1000;
	spotLight.shadowCameraFov = 50;
	scene.add(spotLight);	
	//var spotLightHelper = new THREE.SpotLightHelper(spotLight);
	//scene.add(spotLightHelper);	
	//var spotLightCH = new THREE.CameraHelper(spotLight.shadow);
	//scene.add(spotLightCH);	
		
	//var axisHelper = new THREE.AxisHelper(5);
	//scene.add(axisHelper);
	
	//statS();
	
	loadTexture();
	//terrainMesh();

	//stackedBars();
	ageMale();
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	//renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;		
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	/*controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	//controls.enableZoom = false;
	controls.minDistance = 5;
	controls.maxDistance = 1000;	
	//controls.maxPolarAngle = Math.PI/1.05;	
	//controls.center.set(0, 0, 20);
	//camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 10));*/
	controls = new THREE.FlyControls(camera, renderer.domElement);
	controls.movementSpeed = 40;
	controls.domElement = container;
	//controls.domElement = renderer.domElement;
	controls.rollSpeed = Math.PI / 12;
	controls.autoForward = false;
	controls.dragToLook = true;	
	
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
	loader.load(
		'img/texture/soil2.jpg',
		function (texture) {
			//texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
			//texture.repeat.set(4, 4);
			terrainMesh(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function terrainMesh(tex) {
	loader.load(
		'img/map/elpaso_disp.jpg',
		function (texture) {
			var geometry = new THREE.PlaneBufferGeometry(460, 460, 96, 96);
			//var material = new THREE.MeshPhongMaterial({color: 0x4c4640, shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 0.6});
			var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 0.4});
			var terrain = new THREE.Mesh(geometry, material);
			terrain.rotation.set(-Math.PI/2, 0, 0);
			terrain.position.y = floorposY;
			//terrain.castShadow = true;
			//terrain.receiveShadow = true;
			terrain.material.wireframe = true;
			scene.add(terrain);
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

function LatLonToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0,
		lat = latitude * pi_180;
		lon = longitude * pi_180;
	
	var magnitude = 50000; // Spread the points apart from each other
	var pixelX = Math.cos(lat) * Math.cos(lon) * magnitude + 11950;
	var pixelZ = Math.cos(lat) * Math.sin(lon) * magnitude + 40770;
    var pixel = {x: pixelX, z: pixelZ};

    return pixel;
}

// Color the bar
function applyVertexColors(g, c) {
	g.faces.forEach(function(f) {
		var n = (f instanceof THREE.Face3) ? 3 : 4;
		
		for(var j = 0; j < n; j++) {
			f.vertexColors[j] = c;
		}
	});
}

function ageMaleBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
	
	if (properties.Age_M0t4 > 0) {
		//totalHeight += properties.Age_M0t4;
		
		barHeight = oneUnitY * properties.Age_M0t4;
		prevOffsetY += barHeight;	// Y offset for the next bar's position
		//var cube = new THREE.Mesh(geometry, material);
		//categories.add(cube);
		//cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);			
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M0t4;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[0]));
		
		categories[0].merge(geometry, matrix);		// merge to it's category mesh
		geom.merge(geometry, matrix);	// merge to super mesh
	}
	
	if (properties.Age_M5t9 > 0) {
		barHeight = oneUnitY * properties.Age_M5t9;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M5t9;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[0]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M10t14 > 0) {
		barHeight = oneUnitY * properties.Age_M10t14;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M10t14;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[1]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M15t17 > 0) {
		barHeight = oneUnitY * properties.Age_M15t17;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M15t17;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[1]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M18t19 > 0) {
		barHeight = oneUnitY * properties.Age_M18t19;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M18t19;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[2]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M20 > 0) {
		barHeight = oneUnitY * properties.Age_M20;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M20;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[2]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M21 > 0) {
		barHeight = oneUnitY * properties.Age_M21;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M21;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[2]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M22t24 > 0) {
		barHeight = oneUnitY * properties.Age_M22t24;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M22t24;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[2]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M25t29 > 0) {
		barHeight = oneUnitY * properties.Age_M25t29;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M25t29;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[3]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M30t34 > 0) {
		barHeight = oneUnitY * properties.Age_M30t34;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M30t34;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[3]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M35t39 > 0) {
		barHeight = oneUnitY * properties.Age_M35t39;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M35t39;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[4]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M40t44 > 0) {
		barHeight = oneUnitY * properties.Age_M40t44;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M40t44;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[4]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Age_M45t49 > 0) {
		barHeight = oneUnitY * properties.Age_M45t49;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M45t49;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[5]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M50t54 > 0) {
		barHeight = oneUnitY * properties.Age_M50t54;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M50t54;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[5]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M55t59 > 0) {
		barHeight = oneUnitY * properties.Age_M55t59;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M55t59;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[6]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M60t61 > 0) {
		barHeight = oneUnitY * properties.Age_M60t61;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M60t61;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[6]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M62t64 > 0) {
		barHeight = oneUnitY * properties.Age_M62t64;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M62t64;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[6]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M65t66 > 0) {
		barHeight = oneUnitY * properties.Age_M65t66;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M65t66;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[7]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M67t69 > 0) {
		barHeight = oneUnitY * properties.Age_M67t69;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M67t69;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[7]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M70t74 > 0) {
		barHeight = oneUnitY * properties.Age_M70t74;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M70t74;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[7]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M75t79 > 0) {
		barHeight = oneUnitY * properties.Age_M75t79;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M75t79;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[8]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M80t84 > 0) {
		barHeight = oneUnitY * properties.Age_M80t84;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M80t84;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[8]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_M85 > 0) {
		barHeight = oneUnitY * properties.Age_M85;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M85;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageMaleColor[9]));
		
		categories[0].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
		
	//if (barHeight > 0) {
		//mergedMesh = new THREE.Mesh(geom, material);
		//scene.add(mergedMesh);
		//console.log(mergedMesh);
	//}
}

function ageFemaleBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Age_F0t4 > 0) {
		barHeight = oneUnitY * properties.Age_F0t4;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F0t4;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[0]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Age_F5t9 > 0) {
		barHeight = oneUnitY * properties.Age_F5t9;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F5t9;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[0]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Age_F10t14 > 0) {
		barHeight = oneUnitY * properties.Age_F10t14;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F10t14;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[1]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}
	
	if (properties.Age_F15t17 > 0) {
		barHeight = oneUnitY * properties.Age_F15t17;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F15t17;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[1]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F18t19 > 0) {
		barHeight = oneUnitY * properties.Age_F18t19;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F18t19;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[2]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F20 > 0) {
		barHeight = oneUnitY * properties.Age_F20;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F20;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[2]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F21 > 0) {
		barHeight = oneUnitY * properties.Age_F21;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F21;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[2]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F22t24 > 0) {
		barHeight = oneUnitY * properties.Age_F22t24;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F22t24;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[2]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F25t29 > 0) {
		barHeight = oneUnitY * properties.Age_F25t29;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F25t29;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[3]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F30t34 > 0) {
		barHeight = oneUnitY * properties.Age_F30t34;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F30t34;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[3]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F35t39 > 0) {
		barHeight = oneUnitY * properties.Age_F35t39;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F35t39;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[4]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F40t44 > 0) {
		barHeight = oneUnitY * properties.Age_F40t44;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F40t44;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[4]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F45t49 > 0) {
		barHeight = oneUnitY * properties.Age_F45t49;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F45t49;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[5]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F50t54 > 0) {
		barHeight = oneUnitY * properties.Age_F50t54;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F50t54;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[5]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F55t59 > 0) {
		barHeight = oneUnitY * properties.Age_F55t59;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F55t59;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[6]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Age_F60t61 > 0) {
		barHeight = oneUnitY * properties.Age_F60t61;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F60t61;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[6]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F62t64 > 0) {
		barHeight = oneUnitY * properties.Age_F62t64;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F62t64;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[6]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F65t66 > 0) {
		barHeight = oneUnitY * properties.Age_F65t66;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F65t66;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[7]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F67t69 > 0) {
		barHeight = oneUnitY * properties.Age_F67t69;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F67t69;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[7]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F70t74 > 0) {
		barHeight = oneUnitY * properties.Age_F70t74;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F70t74;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[7]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F75t79 > 0) {
		barHeight = oneUnitY * properties.Age_F75t79;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F75t79;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[8]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F80t84 > 0) {
		barHeight = oneUnitY * properties.Age_F80t84;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F80t84;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[8]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Age_F85 > 0) {
		barHeight = oneUnitY * properties.Age_F85;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F85;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageFemaleColor[9]));
		
		categories[1].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
}

function incomeBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Inc_0t10 > 0) {
		barHeight = oneUnitY * properties.Inc_0t10;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_0t10;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[0]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_10t15 > 0) {
		barHeight = oneUnitY * properties.Inc_10t15;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_10t15;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[0]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_15t20 > 0) {
		barHeight = oneUnitY * properties.Inc_15t20;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_15t20;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[1]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_20t25 > 0) {
		barHeight = oneUnitY * properties.Inc_20t25;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_20t25;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[1]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_25t30 > 0) {
		barHeight = oneUnitY * properties.Inc_25t30;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_25t30;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[2]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_30t35 > 0) {
		barHeight = oneUnitY * properties.Inc_30t35;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_30t35;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[2]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_35t40 > 0) {
		barHeight = oneUnitY * properties.Inc_35t40;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_35t40;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[3]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_40t45 > 0) {
		barHeight = oneUnitY * properties.Inc_40t45;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_40t45;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[3]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_45t50 > 0) {
		barHeight = oneUnitY * properties.Inc_45t50;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_45t50;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[4]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_50t60 > 0) {
		barHeight = oneUnitY * properties.Inc_50t60;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_50t60;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[4]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_60t75 > 0) {
		barHeight = oneUnitY * properties.Inc_60t75;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_60t75;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[5]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_75t100 > 0) {
		barHeight = oneUnitY * properties.Inc_75t100;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_75t100;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[6]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_100t125 > 0) {
		barHeight = oneUnitY * properties.Inc_100t125;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_100t125;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[6]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_125t150 > 0) {
		barHeight = oneUnitY * properties.Inc_125t150;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_125t150;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[7]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_150t200 > 0) {
		barHeight = oneUnitY * properties.Inc_150t200;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_150t200;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[7]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Inc_200 > 0) {
		barHeight = oneUnitY * properties.Inc_200;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Inc_200;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(incomeColor[7]));
		
		categories[2].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function rentalBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Ren_10perc > 0) {
		barHeight = oneUnitY * properties.Ren_10perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_10perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[0]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_15perc > 0) {
		barHeight = oneUnitY * properties.Ren_15perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_15perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[1]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_20perc > 0) {
		barHeight = oneUnitY * properties.Ren_20perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_20perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[2]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_25perc > 0) {
		barHeight = oneUnitY * properties.Ren_25perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_25perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[3]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_30perc > 0) {
		barHeight = oneUnitY * properties.Ren_30perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_30perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[4]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_35perc > 0) {
		barHeight = oneUnitY * properties.Ren_35perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_35perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[5]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_40perc > 0) {
		barHeight = oneUnitY * properties.Ren_40perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_40perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[6]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_50perc > 0) {
		barHeight = oneUnitY * properties.Ren_50perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_50perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[7]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ren_55perc > 0) {
		barHeight = oneUnitY * properties.Ren_55perc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ren_55perc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(rentalColor[8]));
		
		categories[3].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function insuranceYoungBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Ins_Youth_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[0]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[0]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_MultWMedicaid > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_MultWMedicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_MultWMedicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[1]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[1]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_VA > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[1]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[1]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_Medicaid > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Medicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Medicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[1]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[1]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Youth_None > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungColor[2]));
		
		categories[4].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function insuranceYoungAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Ins_YAdult_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[0]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[0]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_MultWMedicaid > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_MultWMedicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_MultWMedicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[1]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[1]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_VA > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[1]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[1]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_Medicaid > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Medicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Medicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[1]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[1]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_YAdult_None > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceYoungAdultColor[2]));
		
		categories[5].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function insuranceAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Ins_Adult_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[0]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}

	if (properties.Ins_Adult_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[0]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_MultWMedicaid > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_MultWMedicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_MultWMedicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_MultWMedicareB > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_MultWMedicareB;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_MultWMedicareB;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_VA > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_Medicaid > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_Medicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_Medicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[1]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Adult_None > 0) {
		barHeight = oneUnitY * properties.Ins_Adult_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Adult_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceAdultColor[2]));
		
		categories[6].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function insuranceElderBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Ins_Elder_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[0]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Elder_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[0]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Elder_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[1]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Elder_VA > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[1]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Elder_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[1]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Elder_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[1]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Ins_Elder_None > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceElderColor[2]));
		
		categories[7].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}		

function commutingMethodBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Com_None > 0) {
		barHeight = oneUnitY * properties.Com_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[0]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Other > 0) {
		barHeight = oneUnitY * properties.Com_Other;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Other;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[1]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Walk > 0) {
		barHeight = oneUnitY * properties.Com_Walk;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Walk;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[2]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Bike > 0) {
		barHeight = oneUnitY * properties.Com_Bike;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Bike;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[3]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Motorcycle > 0) {
		barHeight = oneUnitY * properties.Com_Motorcycle;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Motorcycle;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[4]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Taxi > 0) {
		barHeight = oneUnitY * properties.Com_Taxi;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Taxi;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[5]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Public > 0) {
		barHeight = oneUnitY * properties.Com_Public;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Public;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[6]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Carpool > 0) {
		barHeight = oneUnitY * properties.Com_Carpool;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Carpool;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[7]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Com_Car > 0) {
		barHeight = oneUnitY * properties.Com_Car;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Com_Car;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingMethodColor[8]));
		
		categories[8].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function commutingTimeBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.ComT_0t5 > 0) {
		barHeight = oneUnitY * properties.ComT_0t5;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_0t5;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[0]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_5t10 > 0) {
		barHeight = oneUnitY * properties.ComT_5t10;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_5t10;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[0]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_10t15 > 0) {
		barHeight = oneUnitY * properties.ComT_10t15;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_10t15;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[1]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_15t20 > 0) {
		barHeight = oneUnitY * properties.ComT_15t20;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_15t20;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[1]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_20t25 > 0) {
		barHeight = oneUnitY * properties.ComT_20t25;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_20t25;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[2]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_25t30 > 0) {
		barHeight = oneUnitY * properties.ComT_25t30;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_25t30;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[2]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_30t35 > 0) {
		barHeight = oneUnitY * properties.ComT_30t35;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_30t35;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[3]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_35t40 > 0) {
		barHeight = oneUnitY * properties.ComT_35t40;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_35t40;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[3]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_40t45 > 0) {
		barHeight = oneUnitY * properties.ComT_40t45;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_40t45;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[4]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_45t60 > 0) {
		barHeight = oneUnitY * properties.ComT_45t60;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_45t60;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[4]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_60t90 > 0) {
		barHeight = oneUnitY * properties.ComT_60t90;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_60t90;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[5]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.ComT_90 > 0) {
		barHeight = oneUnitY * properties.ComT_90;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.ComT_90;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(commutingTimeColor[6]));
		
		categories[9].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function foodStampsDisabilityBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Fst_DnrNDis > 0) {
		barHeight = oneUnitY * properties.Fst_DnrNDis;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fst_DnrNDis;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(foodStampsDisabilityColor[0]));
		
		categories[10].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Fst_DnrDis > 0) {
		barHeight = oneUnitY * properties.Fst_DnrDis;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fst_DnrDis;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(foodStampsDisabilityColor[1]));
		
		categories[10].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Fst_RecNDis > 0) {
		barHeight = oneUnitY * properties.Fst_RecNDis;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fst_RecNDis;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(foodStampsDisabilityColor[2]));
		
		categories[10].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Fst_RecWDis > 0) {
		barHeight = oneUnitY * properties.Fst_RecWDis;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fst_RecWDis;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(foodStampsDisabilityColor[3]));
		
		categories[10].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}
}

function languageYoungBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Lan_Youth_Eng > 0) {
		barHeight = oneUnitY * properties.Lan_Youth_Eng;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Youth_Eng;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageYoungColor[0]));
		
		categories[11].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Youth_VW > 0) {
		barHeight = oneUnitY * properties.Lan_Youth_VW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Youth_VW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageYoungColor[1]));
		
		categories[11].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Youth_W > 0) {
		barHeight = oneUnitY * properties.Lan_Youth_W;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Youth_W;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageYoungColor[2]));
		
		categories[11].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Youth_NW > 0) {
		barHeight = oneUnitY * properties.Lan_Youth_NW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Youth_NW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageYoungColor[3]));
		
		categories[11].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Youth_N > 0) {
		barHeight = oneUnitY * properties.Lan_Youth_N;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Youth_N;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageYoungColor[4]));
		
		categories[11].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}
}

function languageAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Lan_Adult_Eng > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_Eng;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_Eng;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageAdultColor[0]));
		
		categories[12].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Adult_VW > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_VW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_VW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageAdultColor[1]));
		
		categories[12].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Adult_W > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_W;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_W;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageAdultColor[2]));
		
		categories[12].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Adult_NW > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_NW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_NW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageAdultColor[3]));
		
		categories[12].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Adult_N > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_N;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_N;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageAdultColor[4]));
		
		categories[12].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}
}

function languageElderBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Lan_Elder_Eng > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_Eng;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_Eng;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageElderColor[0]));
		
		categories[13].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Elder_VW > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_VW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_VW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageElderColor[1]));
		
		categories[13].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Elder_W > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_W;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_W;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageElderColor[2]));
		
		categories[13].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Elder_NW > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_NW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_NW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageElderColor[3]));
		
		categories[13].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Lan_Elder_N > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_N;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_N;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageElderColor[4]));
		
		categories[13].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}
}

function educationBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Edu_none > 0) {
		barHeight = oneUnitY * properties.Edu_none;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_none;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Edu_Nursery > 0) {
		barHeight = oneUnitY * properties.Edu_Nursery;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Nursery;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Edu_Kinder > 0) {
		barHeight = oneUnitY * properties.Edu_Kinder;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Kinder;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_1 > 0) {
		barHeight = oneUnitY * properties.Edu_1;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_1;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_2 > 0) {
		barHeight = oneUnitY * properties.Edu_2;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_2;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_3 > 0) {
		barHeight = oneUnitY * properties.Edu_3;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_3;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_4 > 0) {
		barHeight = oneUnitY * properties.Edu_4;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_4;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[0]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Edu_5 > 0) {
		barHeight = oneUnitY * properties.Edu_5;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_5;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[1]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Edu_6 > 0) {
		barHeight = oneUnitY * properties.Edu_6;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_6;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[1]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}		
	
	if (properties.Edu_7 > 0) {
		barHeight = oneUnitY * properties.Edu_7;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_7;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[1]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Edu_8 > 0) {
		barHeight = oneUnitY * properties.Edu_8;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_8;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[2]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Edu_9 > 0) {
		barHeight = oneUnitY * properties.Edu_9;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_9;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[2]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_10 > 0) {
		barHeight = oneUnitY * properties.Edu_10;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_10;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[2]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_11 > 0) {
		barHeight = oneUnitY * properties.Edu_11;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_11;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[2]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_12 > 0) {
		barHeight = oneUnitY * properties.Edu_12;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_12;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[2]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Edu_HSDiploma > 0) {
		barHeight = oneUnitY * properties.Edu_HSDiploma;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_HSDiploma;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[3]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_GED > 0) {
		barHeight = oneUnitY * properties.Edu_GED;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_GED;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[3]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_Col1 > 0) {
		barHeight = oneUnitY * properties.Edu_Col1;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Col1;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[3]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	

	if (properties.Edu_ColMult > 0) {
		barHeight = oneUnitY * properties.Edu_ColMult;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_ColMult;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[3]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Edu_Assoc > 0) {
		barHeight = oneUnitY * properties.Edu_Assoc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Assoc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[4]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Edu_Batch > 0) {
		barHeight = oneUnitY * properties.Edu_Batch;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Batch;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[5]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}
	
	if (properties.Edu_Master > 0) {
		barHeight = oneUnitY * properties.Edu_Master;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Master;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[6]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}

	if (properties.Edu_Pro > 0) {
		barHeight = oneUnitY * properties.Edu_Pro;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Pro;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[7]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}

	if (properties.Edu_Doc > 0) {
		barHeight = oneUnitY * properties.Edu_Doc;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Edu_Doc;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(educationColor[8]));
		
		categories[14].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function familyStructureBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Fam_FamMarried > 0) {
		barHeight = oneUnitY * properties.Fam_FamMarried;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fam_FamMarried;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(familyStructureColor[0]));
		
		categories[15].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Fam_FamOther > 0) {
		barHeight = oneUnitY * properties.Fam_FamOther;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fam_FamOther;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(familyStructureColor[1]));
		
		categories[15].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Fam_NFamSingle > 0) {
		barHeight = oneUnitY * properties.Fam_NFamSingle;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fam_NFamSingle;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(familyStructureColor[2]));
		
		categories[15].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Fam_NFamMulti > 0) {
		barHeight = oneUnitY * properties.Fam_NFamMulti;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Fam_NFamMulti;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(familyStructureColor[3]));
		
		categories[15].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

function raceBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	if (properties.Rac_Hisp > 0) {
		barHeight = oneUnitY * properties.Rac_Hisp;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Rac_Hisp;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(raceColor[0]));
		
		categories[16].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
	
	if (properties.Rac_NotHisp > 0) {
		barHeight = oneUnitY * properties.Rac_NotHisp;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - (spacing * 2);
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Rac_NotHisp;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(raceColor[1]));
		
		categories[16].merge(geometry, matrix);		
		geom.merge(geometry, matrix);
	}	
}

// Create the stacked bar charts for Age, Male category
function ageMale() {
	for (var i=0; i<dataLength; i++) {
	//for (var i=0; i<300; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		ageMaleBars(i, xyPos.x, xyPos.z);
/*		ageFemaleBars(i, xyPos.x, xyPos.z);
		incomeBars(i, xyPos.x, xyPos.z);
		rentalBars(i, xyPos.x, xyPos.z);
		insuranceYoungBars(i, xyPos.x, xyPos.z);
		insuranceYoungAdultBars(i, xyPos.x, xyPos.z);
		insuranceAdultBars(i, xyPos.x, xyPos.z);
		insuranceElderBars(i, xyPos.x, xyPos.z);
		commutingMethodBars(i, xyPos.x, xyPos.z);
		commutingTimeBars(i, xyPos.x, xyPos.z);
		foodStampsDisabilityBars(i, xyPos.x, xyPos.z);
		languageYoungBars(i, xyPos.x, xyPos.z);
		languageAdultBars(i, xyPos.x, xyPos.z);
		languageElderBars(i, xyPos.x, xyPos.z);
		educationBars(i, xyPos.x, xyPos.z);
		familyStructureBars(i, xyPos.x, xyPos.z);
		raceBars(i, xyPos.x, xyPos.z);*/
	}
	//mergedMesh = new THREE.Mesh(geom, material);
	//scene.add(mergedMesh);
	
	//for (var i=0; i<1; i++) {
	categoryMesh[0] = new THREE.Mesh(categories[0], material);
	scene.add(categoryMesh[0]);
	//}
	ageMaleLoaded = true;
}

// Create the stacked bar charts for Age, Female category
function ageFemale() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		ageFemaleBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[1] = new THREE.Mesh(categories[1], material);
	scene.add(categoryMesh[1]);
	
	ageFemaleLoaded = true;
}
	
// Create the stacked bar charts for Income category
function income() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		incomeBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[2] = new THREE.Mesh(categories[2], material);
	scene.add(categoryMesh[2]);
	
	incomeLoaded = true;
}

// Create the stacked bar charts for Rental category
function rental() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		rentalBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[3] = new THREE.Mesh(categories[3], material);
	scene.add(categoryMesh[3]);
	
	rentalLoaded = true;
}

// Create the stacked bar charts for Insurance, Young category
function insuranceYoung() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		insuranceYoungBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[4] = new THREE.Mesh(categories[4], material);
	scene.add(categoryMesh[4]);
	
	insuranceYoungLoaded = true;
}

// Create the stacked bar charts for Insurance, Young Adult category
function insuranceYoungAdult() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		insuranceYoungAdultBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[5] = new THREE.Mesh(categories[5], material);
	scene.add(categoryMesh[5]);
	
	insuranceYoungAdultLoaded = true;
}

// Create the stacked bar charts for Insurance, Adult category
function insuranceAdult() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		insuranceAdultBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[6] = new THREE.Mesh(categories[6], material);
	scene.add(categoryMesh[6]);
	
	insuranceAdultLoaded = true;
}

// Create the stacked bar charts for Insurance, Elder category
function insuranceElder() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		insuranceElderBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[7] = new THREE.Mesh(categories[7], material);
	scene.add(categoryMesh[7]);
	
	insuranceElderLoaded = true;
}

// Create the stacked bar charts for Commuting Method category
function commutingMethod() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		commutingMethodBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[8] = new THREE.Mesh(categories[8], material);
	scene.add(categoryMesh[8]);
	
	commutingMethodLoaded = true;
}

// Create the stacked bar charts for Commuting Time category
function commutingTime() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		commutingTimeBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[9] = new THREE.Mesh(categories[9], material);
	scene.add(categoryMesh[9]);
	
	commutingTimeLoaded = true;
}

// Create the stacked bar charts for Food Stamps & Disability category
function foodStampsDisability() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		foodStampsDisabilityBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[10] = new THREE.Mesh(categories[10], material);
	scene.add(categoryMesh[10]);
	
	foodStampsDisabilityLoaded = true;
}

// Create the stacked bar charts for Llanguage, Young category
function languageYoung() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		languageYoungBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[11] = new THREE.Mesh(categories[11], material);
	scene.add(categoryMesh[11]);
	
	languageYoungLoaded = true;
}

// Create the stacked bar charts for Language, Adult category
function languageAdult() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		languageAdultBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[12] = new THREE.Mesh(categories[12], material);
	scene.add(categoryMesh[12]);
	
	languageAdultLoaded = true;
}

// Create the stacked bar charts for Language, Elder category
function languageElder() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		languageElderBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[13] = new THREE.Mesh(categories[13], material);
	scene.add(categoryMesh[13]);
	
	languageElderLoaded = true;
}

// Create the stacked bar charts for Education category
function education() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		educationBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[14] = new THREE.Mesh(categories[14], material);
	scene.add(categoryMesh[14]);
	
	educationLoaded = true;
}

// Create the stacked bar charts for Family Structure category
function familyStructure() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		familyStructureBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[15] = new THREE.Mesh(categories[15], material);
	scene.add(categoryMesh[15]);
	
	familyStructureLoaded = true;
}

// Create the stacked bar charts for Race category
function race() {
	for (var i=0; i<dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		raceBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[16] = new THREE.Mesh(categories[16], material);
	scene.add(categoryMesh[16]);
	
	raceLoaded = true;
}
	
	//console.log(dataLength);	
	//console.log(material.color);
	//console.log(ElPasoData.features[0].properties);
	//console.log(ElPasoData.features[0].geometry.coordinates[0]);
	//console.log(ElPasoData.features[0]);
	
// UI clicked open
gear.addEventListener('click', function(e) {
	kr=0;
	gear.style.display='none';
	kontrols.style.display = 'block';
	kon = true;
	e.preventDefault();
}, false);

// UI clicked close
klose.addEventListener('click', function(e) {
	kos = true;
	kr = 1.0;
	e.preventDefault();
}, false);	

// Change camera mode
kamera.addEventListener("change", function(e) {
	if (orthographicMode) {
		camera.toPerspective();
		orthographicMode = false;
	} else {
		camera.toOrthographic();
		orthographicMode = true;
	}
	
	e.preventDefault();
}, false);	

// Change camera view
kamView.addEventListener("change", function(e) {
	switch (kamView.value) {
		case "1":
			camera.toFrontView();
			//lookAtScene = false;			
			break;
		case "2":
			camera.toBackView();
			//lookAtScene = false;			
			break;
		case "3":
			camera.toTopView();
			//lookAtScene = false;			
			break;
		case "4":
			camera.toBottomView();
			//lookAtScene = false;			
			break;			
		case "5":
			camera.toLeftView();
			//lookAtScene = false;			
			break;
		case "6":
			camera.toRightView();
			//lookAtScene = false;			
			break;
		default:
			//console.log('default'); 
	}	
	
	e.preventDefault();
}, false);	


// Select which categories to show/hide
kategory.addEventListener("change", function(e) {
	// Hide all categories
	if (ageMaleLoaded) {
		//categoryMesh[0].visible = false;
		scene.remove(categoryMesh[0]);
	}
	if (ageFemaleLoaded) {
		//categoryMesh[1].visible = false;
		scene.remove(categoryMesh[1]);
	}
	if (incomeLoaded) {
		//categoryMesh[2].visible = false;
		scene.remove(categoryMesh[2]);
	}	
	if (rentalLoaded) {
		//categoryMesh[3].visible = false;
		scene.remove(categoryMesh[3]);
	}	
	if (insuranceYoungLoaded) {
		//categoryMesh[4].visible = false;
		scene.remove(categoryMesh[4]);
	}	
	if (insuranceYoungAdultLoaded) {
		//categoryMesh[5].visible = false;
		scene.remove(categoryMesh[5]);
	}	
	if (insuranceAdultLoaded) {
		//categoryMesh[6].visible = false;
		scene.remove(categoryMesh[6]);
	}	
	if (insuranceElderLoaded) {
		//categoryMesh[7].visible = false;
		scene.remove(categoryMesh[7]);
	}	
	if (commutingMethodLoaded) {
		//categoryMesh[8].visible = false;
		scene.remove(categoryMesh[8]);
	}
	if (commutingTimeLoaded) {
		//categoryMesh[9].visible = false;
		scene.remove(categoryMesh[9]);
	}	
	if (foodStampsDisabilityLoaded) {
		//categoryMesh[10].visible = false;
		scene.remove(categoryMesh[10]);
	}	
	if (languageYoungLoaded) {
		//categoryMesh[11].visible = false;
		scene.remove(categoryMesh[11]);
	}	
	if (languageAdultLoaded) {
		//categoryMesh[12].visible = false;
		scene.remove(categoryMesh[12]);
	}	
	if (languageElderLoaded) {
		//categoryMesh[13].visible = false;
		scene.remove(categoryMesh[13]);
	}	
	if (educationLoaded) {
		//categoryMesh[14].visible = false;
		scene.remove(categoryMesh[14]);
	}
	if (familyStructureLoaded) {
		//categoryMesh[15].visible = false;
		scene.remove(categoryMesh[15]);
	}	
	if (raceLoaded) {
		//categoryMesh[16].visible = false;
		scene.remove(categoryMesh[16]);
	}	
			
	switch (kategory.value) {
		case "1":
			if (!ageMaleLoaded) {
				ageMale();
			} else {
				//categoryMesh[0].visible = true;
				scene.add(categoryMesh[0]);
			}
			break;
		case "2":
			if (!ageFemaleLoaded) {
				ageFemale();
			} else {
				//categoryMesh[1].visible = true;
				scene.add(categoryMesh[1]);
			}
			//mergedMesh.material.opacity = 0.01;
			//mergedMesh.visible = false;
			break;
		case "3":
			if (!incomeLoaded) {
				income();
			} else {
				//categoryMesh[2].visible = true;
				scene.add(categoryMesh[2]);
			}
			break;
		case "4":
			if (!rentalLoaded) {
				rental();
			} else {
				//categoryMesh[3].visible = true;
				scene.add(categoryMesh[3]);
			}
			break;			
		case "5":
			if (!insuranceYoungLoaded) {
				insuranceYoung();
			} else {
				//categoryMesh[4].visible = true;
				scene.add(categoryMesh[4]);
			}
			break;
		case "6":
			if (!insuranceYoungAdultLoaded) {
				insuranceYoungAdult();
			} else {
				//categoryMesh[5].visible = true;
				scene.add(categoryMesh[5]);
			}
			break;
		case "7":
			if (!insuranceAdultLoaded) {
				insuranceAdult();
			} else {
				//categoryMesh[6].visible = true;
				scene.add(categoryMesh[6]);
			}
			break;
		case "8":
			if (!insuranceElderLoaded) {
				insuranceElder();
			} else {
				//categoryMesh[7].visible = true;
				scene.add(categoryMesh[7]);
			}
			break;
		case "9":
			if (!commutingMethodLoaded) {
				commutingMethod();
			} else {
				//categoryMesh[8].visible = true;
				scene.add(categoryMesh[8]);
			}
			break;
		case "10":
			if (!commutingTimeLoaded) {
				commutingTime();
			} else {
				//categoryMesh[9].visible = true;
				scene.add(categoryMesh[9]);
			}
			break;
		case "11":
			if (!foodStampsDisabilityLoaded) {
				foodStampsDisability();
			} else {
				//categoryMesh[10].visible = true;
				scene.add(categoryMesh[10]);
			}
			break;
		case "12":
			if (!languageYoungLoaded) {
				languageYoung();
			} else {
				//categoryMesh[11].visible = true;
				scene.add(categoryMesh[11]);
			}
			break;
		case "13":
			if (!languageAdultLoaded) {
				languageAdult();
			} else {
				//categoryMesh[12].visible = true;
				scene.add(categoryMesh[12]);
			}
			break;
		case "14":
			if (!languageElderLoaded) {
				languageElder();
			} else {
				//categoryMesh[13].visible = true;
				scene.add(categoryMesh[13]);
			}
			break;
		case "15":
			if (!educationLoaded) {
				education();
			} else {
				//categoryMesh[14].visible = true;
				scene.add(categoryMesh[14]);
			}
			break;
		case "16":
			if (!familyStructureLoaded) {
				familyStructure();
			} else {
				//categoryMesh[15].visible = true;
				scene.add(categoryMesh[15]);
			}
			break;
		case "17":
			if (!raceLoaded) {
				race();
			} else {
				//categoryMesh[16].visible = true;
				scene.add(categoryMesh[16]);
			}
			break;			
		default:
			//console.log('default'); 
	}	
	
	e.preventDefault();
}, false);	

// Custom mousewheel zoom in/out
container.addEventListener('mousewheel', function(e) {
	e.preventDefault();
	e.stopPropagation();	
	
	var delta = 0;

	if (e.wheelDelta !== undefined) {
		// WebKit / Opera / Explorer 9
		delta = e.wheelDelta;
	} else if (e.detail !== undefined) {
		// Firefox
		delta = -e.detail;
	}

	if (delta > 0) {
		//if (zoom < .0) zoom += 0.1;
		zoom += 0.1;
	} else if (delta < 0) {
		if (zoom > 0.5) zoom -= 0.1;
	}
	camera.setZoom(zoom);		
}, false);	
	
function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
	camera.setSize(ww, wh);
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	
	renderer.setSize(ww, wh);
	
	document.body.style.width = container.style.width = ww+'px';
	document.body.style.height = container.style.height = wh+'px';	
}
window.addEventListener('resize', onWindowResize, false);		

function animate() {
	requestAnimationFrame(animate);
	//var time = Date.now()*.001;
	//var timer = new Date().getTime();	
	
	// Show UI
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
	}	
	
//	controls.update();
	//stats.update();	
	render();
	//render( clock.getDelta() );
}

//function render(dt) {
function render() {
	if (lookAtScene) camera.lookAt(scene.position);

	renderer.render(scene, camera);	

	var delta = clock.getDelta();
	controls.update(delta);
}

// Execute init function after resources have loaded.
if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}
