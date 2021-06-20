/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, controls, entro = true,
	container = document.getElementById('container'), 
	renderer, camera, scene, spotL, controls, stats, geom, mater, mater2, tex=[], gridH, curNum=0;

var clock = new THREE.Clock();
var	mouseVector = new THREE.Vector3();
var geometry = new THREE.BufferGeometry();
var group = new THREE.Group();	
//var geom = new THREE.Geometry();
var loader = new THREE.TextureLoader();
	
// Constants
var floorposY = -5, 
	dataLength = ElPasoData.features.length,
	oneUnit = .2,	// width and length of a unit of bar
	oneUnitY = .05,	// height of a unit of bar
	spacing = 0.8;	// spacing of the 17 stacked bars of a point

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
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;

// If browser does not support WebGL, display a message.
if (!Detector.webgl) Detector.addGetWebGLMessage();

/**
	The usual initialization routine, which includes setting up renderer, scene, camera, controls, and lights.
**/
function init() {
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	//renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	
	
	camera = new THREE.PerspectiveCamera(60, ww/wh,  0.1, 10000);
	camera.position.set(0, 15, 200);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x000000, 0.0005);
	camera.lookAt(scene.position);	
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.24;
	//controls.enableZoom = false;
	controls.minDistance = 5;
	controls.maxDistance = 4000;	
	//controls.maxPolarAngle = Math.PI/1.05;	
	//controls.center.set(0, 0, 20);
	//camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 10));
	
	var aLight = new THREE.AmbientLight(0x333333);
	scene.add(aLight);
	
	//var light = new THREE.PointLight(0xffffff, 1, 1000);
	//light.position.set(0, 0, 0);
	//scene.add(light);

	var spotLight = new THREE.SpotLight(0xffffff, 5, 500, Math.PI/4);
	spotLight.position.set(0, 400, 0);
	spotLight.castShadow = true;
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
		
	var axisHelper = new THREE.AxisHelper(5);
	scene.add(axisHelper);
	
	statS();
	
	loadTexture();
	//terrainMesh();

	stackedBars();
//	fbPlaces();
	
	animate();
}	

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
			//texture.repeat.set(1, 1);
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
			var geometry = new THREE.PlaneBufferGeometry(440, 440, 96, 96);
			var material = new THREE.MeshPhongMaterial({color: 0x4c4640, shininess: 7, map: tex, displacementMap: texture, displacementScale: 40.0});
			var terrain = new THREE.Mesh(geometry, material);
			terrain.rotation.set(-Math.PI/2, 0, 0);
			terrain.position.y = floorposY;
			//terrain.castShadow = true;
			terrain.receiveShadow = true;
			//terrain.material.wireframe = true;
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
	var rad = deg * Math.PI/180;
	return rad;
}

function LatLonToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0,
		lat = latitude * pi_180;
		lon = longitude * pi_180;
	
    //var pi_4 = Math.PI * 4;
    //var sinLatitude = Math.sin(latitude * pi_180);
	var magnitude = 50000; // Spread the points apart from each other
    //var pixelZ = (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (pi_4)) * magnitude -104;
	//var pixelX = ((longitude + 180) / 360) * magnitude -52;
	//var pixelX = Math.cos(latitude) * Math.cos(longitude) * magnitude - magnitude/1.2;
	var pixelX = Math.cos(lat) * Math.cos(lon) * magnitude + 11950;
	//var pixelZ = Math.cos(latitude) * Math.sin(longitude) * magnitude - magnitude/2.2;
	var pixelZ = Math.cos(lat) * Math.sin(lon) * magnitude + 40820;
    var pixel = {x: pixelX, z: pixelZ};

    return pixel;
}

function ageMaleBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
	// Age, Male, 0 to 4
	barHeight = oneUnitY * properties.Age_M0t4;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: ageMaleColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);	
	
	// Age, Male, 5 to 9
	barHeight = oneUnitY * properties.Age_M5t9;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}
	
	// Age, Male, 10 to 14
	barHeight = oneUnitY * properties.Age_M10t14;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	
	
	// Age, Male, 15 to 17
	barHeight = oneUnitY * properties.Age_M15t17;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 18 to 19
	barHeight = oneUnitY * properties.Age_M18t19;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 20
	barHeight = oneUnitY * properties.Age_M20;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 21
	barHeight = oneUnitY * properties.Age_M21;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 22 to 24
	barHeight = oneUnitY * properties.Age_M22t24;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	
	
	// Age, Male, 25 to 29
	barHeight = oneUnitY * properties.Age_M25t29;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[3]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 30 to 34
	barHeight = oneUnitY * properties.Age_M30t34;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	
	
	// Age, Male, 35 to 39
	barHeight = oneUnitY * properties.Age_M35t39;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[4]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 40 to 44
	barHeight = oneUnitY * properties.Age_M40t44;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}		
	
	// Age, Male, 45 to 49
	barHeight = oneUnitY * properties.Age_M45t49;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[5]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Age, Male, 50 to 54
	barHeight = oneUnitY * properties.Age_M50t54;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}			
	
	// Age, Male, 55 to 59
	barHeight = oneUnitY * properties.Age_M55t59;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[6]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}

	// Age, Male, 60 to 61
	barHeight = oneUnitY * properties.Age_M60t61;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}

	// Age, Male, 62 to 64
	barHeight = oneUnitY * properties.Age_M62t64;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}

	// Age, Male, 65 to 66
	barHeight = oneUnitY * properties.Age_M65t66;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[7]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}

	// Age, Male, 67 to 69
	barHeight = oneUnitY * properties.Age_M67t69;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}

	// Age, Male, 70 to 74
	barHeight = oneUnitY * properties.Age_M70t74;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}
	
	// Age, Male, 75 to 79
	barHeight = oneUnitY * properties.Age_M75t79;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[8]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}

	// Age, Male, 80 to 84
	barHeight = oneUnitY * properties.Age_M70t74;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}
	
	// Age, Male, 85
	barHeight = oneUnitY * properties.Age_M85;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: ageMaleColor[9]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ);
	}
}

function ageFemaleBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
	// Age, Female, 0 to 4
	barHeight = oneUnitY * properties.Age_F0t4;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);	
	
	// Age, Female, 5 to 9
	barHeight = oneUnitY * properties.Age_F5t9;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
	
	// Age, Female, 10 to 14
	barHeight = oneUnitY * properties.Age_F10t14;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	
	
	// Age, Female, 15 to 17
	barHeight = oneUnitY * properties.Age_F15t17;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 18 to 19
	barHeight = oneUnitY * properties.Age_F18t19;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 20
	barHeight = oneUnitY * properties.Age_F20;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 21
	barHeight = oneUnitY * properties.Age_F21;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 22 to 24
	barHeight = oneUnitY * properties.Age_F22t24;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	
	
	// Age, Female, 25 to 29
	barHeight = oneUnitY * properties.Age_F25t29;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[3]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 30 to 34
	barHeight = oneUnitY * properties.Age_F30t34;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	
	
	// Age, Female, 35 to 39
	barHeight = oneUnitY * properties.Age_F35t39;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[4]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 40 to 44
	barHeight = oneUnitY * properties.Age_F40t44;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
	
	// Age, Female, 45 to 49
	barHeight = oneUnitY * properties.Age_F45t49;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[5]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Age, Female, 50 to 54
	barHeight = oneUnitY * properties.Age_F50t54;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}			
	
	// Age, Female, 55 to 59
	barHeight = oneUnitY * properties.Age_F55t59;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[6]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Age, Female, 60 to 61
	barHeight = oneUnitY * properties.Age_F60t61;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Age, Female, 62 to 64
	barHeight = oneUnitY * properties.Age_F62t64;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Age, Female, 65 to 66
	barHeight = oneUnitY * properties.Age_F65t66;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[7]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Age, Female, 67 to 69
	barHeight = oneUnitY * properties.Age_F67t69;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Age, Female, 70 to 74
	barHeight = oneUnitY * properties.Age_F70t74;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
	
	// Age, Female, 75 to 79
	barHeight = oneUnitY * properties.Age_F75t79;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[8]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Age, Female, 80 to 84
	barHeight = oneUnitY * properties.Age_F70t74;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
	
	// Age, Female, 85
	barHeight = oneUnitY * properties.Age_F85;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: ageFemaleColor[9]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
	
	//console.log(xyPos);
}

function incomeBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
	// Income, 0 to 10
	barHeight = oneUnitY * properties.Inc_0t10;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: incomeColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);	
	
	// Income, 10 to 15
	barHeight = oneUnitY * properties.Inc_10t15;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
	
	// Income, 15 to 20
	barHeight = oneUnitY * properties.Inc_15t20;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	
	
	// Income, 20 to 25
	barHeight = oneUnitY * properties.Inc_20t25;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 25 to 30
	barHeight = oneUnitY * properties.Inc_25t30;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 30 to 35
	barHeight = oneUnitY * properties.Inc_30t35;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 35 to 40
	barHeight = oneUnitY * properties.Inc_35t40;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[3]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 40 to 45
	barHeight = oneUnitY * properties.Inc_40t45;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	
	
	// Income, 45 to 50
	barHeight = oneUnitY * properties.Inc_45t50;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[4]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 50 to 60
	barHeight = oneUnitY * properties.Inc_50t60;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	
	
	// Income, 60 to 75
	barHeight = oneUnitY * properties.Inc_60t75;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[5]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 75 to 100
	barHeight = oneUnitY * properties.Inc_75t100;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[6]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
	
	// Income, 100 to 125
	barHeight = oneUnitY * properties.Inc_100t125;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Income, 125 to 150
	barHeight = oneUnitY * properties.Inc_125t150;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: incomeColor[7]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}			
	
	// Income, 150 to 200
	barHeight = oneUnitY * properties.Inc_150t200;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}

	// Income, 200
	barHeight = oneUnitY * properties.Inc_200;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
}

function rentalBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	// Rental, 10 percent
	barHeight = oneUnitY * properties.Ren_10perc;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: rentalColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);	
	
	// Rental, 15 percent
	barHeight = oneUnitY * properties.Ren_15perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}
	
	// Rental, 20 percent
	barHeight = oneUnitY * properties.Ren_20perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: rentalColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	
	
	// Rental, 25 percent
	barHeight = oneUnitY * properties.Ren_25perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Rental, 30 percent
	barHeight = oneUnitY * properties.Ren_30perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: rentalColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Rental, 35 percent
	barHeight = oneUnitY * properties.Ren_35perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Rental, 40 percent
	barHeight = oneUnitY * properties.Ren_40perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: rentalColor[3]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Rental, 50 percent
	barHeight = oneUnitY * properties.Ren_50perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	
	
	// Rental, 55 percent
	barHeight = oneUnitY * properties.Ren_55perc;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: rentalColor[4]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	
}

function insuranceYoungBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	// Insurance, Young, Direct
	barHeight = oneUnitY * properties.Ins_Youth_Direct;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: insuranceYoungColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);	
	
	// Insurance, Young, Employer
	barHeight = oneUnitY * properties.Ins_Youth_Employer;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}
	
	// Insurance, Young, MultWMedicaid
	barHeight = oneUnitY * properties.Ins_Youth_MultWMedicaid;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: insuranceYoungColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	
	
	// Insurance, Young, MultWMedicare
	barHeight = oneUnitY * properties.Ins_Youth_MultWMedicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young, VA
	barHeight = oneUnitY * properties.Ins_Youth_VA;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young, Mil
	barHeight = oneUnitY * properties.Ins_Youth_Mil;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young, Medicaid
	barHeight = oneUnitY * properties.Ins_Youth_Medicaid;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young, Medicare
	barHeight = oneUnitY * properties.Ins_Youth_Medicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	
	
	// Insurance, Young, None
	barHeight = oneUnitY * properties.Ins_Youth_None;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: insuranceYoungColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX - spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	
}

function insuranceYoungAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	// Insurance, Young Adult, Direct
	barHeight = oneUnitY * properties.Ins_YAdult_Direct;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: insuranceYoungAdultColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);	
	
	// Insurance, Young Adult, Employer
	barHeight = oneUnitY * properties.Ins_YAdult_Employer;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}
	
	// Insurance, Young Adult, MultWMedicaid
	barHeight = oneUnitY * properties.Ins_YAdult_MultWMedicaid;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: insuranceYoungAdultColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	
	
	// Insurance, Young Adult, MultWMedicare
	barHeight = oneUnitY * properties.Ins_YAdult_MultWMedicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young Adult, VA
	barHeight = oneUnitY * properties.Ins_YAdult_VA;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young Adult, Mil
	barHeight = oneUnitY * properties.Ins_YAdult_Mil;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young Adult, Medicaid
	barHeight = oneUnitY * properties.Ins_YAdult_Medicaid;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Young Adult, Medicare
	barHeight = oneUnitY * properties.Ins_YAdult_Medicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	
	
	// Insurance, Young Adult, None
	barHeight = oneUnitY * properties.Ins_YAdult_None;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: insuranceYoungAdultColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}		
}

function insuranceAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;

	// Insurance, Adult, Direct
	barHeight = oneUnitY * properties.Ins_Adult_Direct;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: insuranceAdultColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);	
	
	// Insurance, Adult, Employer
	barHeight = oneUnitY * properties.Ins_Adult_Employer;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}
	
	// Insurance, Adult, MultWMedicaid
	barHeight = oneUnitY * properties.Ins_Adult_MultWMedicaid;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: insuranceAdultColor[1]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	
	
	// Insurance, Adult, MultWMedicare
	barHeight = oneUnitY * properties.Ins_Adult_MultWMedicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}		
	
	// Insurance, Adult, MultWMedicareB
	barHeight = oneUnitY * properties.Ins_Adult_MultWMedicareB;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Adult, VA
	barHeight = oneUnitY * properties.Ins_Adult_VA;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Adult, Mil
	barHeight = oneUnitY * properties.Ins_Adult_Mil;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Adult, Medicaid
	barHeight = oneUnitY * properties.Ins_Adult_Medicaid;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}	

	// Insurance, Adult, Medicare
	barHeight = oneUnitY * properties.Ins_Adult_Medicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}		
	
	// Insurance, Adult, None
	barHeight = oneUnitY * properties.Ins_Adult_None;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: insuranceAdultColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ + spacing);
	}		
}

function insuranceElderBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
	// Insurance, Elder, Direct
	barHeight = oneUnitY * properties.Ins_Elder_Direct;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: insuranceElderColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);	
	
	// Insurance, Elder, Employer
	barHeight = oneUnitY * properties.Ins_Elder_Employer;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);
	}
	
	// Insurance, Elder, MultWMedicare
	barHeight = oneUnitY * properties.Ins_Elder_MultWMedicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: insuranceElderColor[1]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);
	}		
	
	// Insurance, Elder, VA
	barHeight = oneUnitY * properties.Ins_Elder_VA;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Insurance, Elder, Mil
	barHeight = oneUnitY * properties.Ins_Elder_Mil;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);
	}	

	// Insurance, Elder, Medicare
	barHeight = oneUnitY * properties.Ins_Elder_Medicare;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);
	}		
	
	// Insurance, Elder, None
	barHeight = oneUnitY * properties.Ins_Elder_None;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: insuranceElderColor[2]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ);
	}		
}		

function commutingMethodBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
	// Commuting Method, None
	barHeight = oneUnitY * properties.Com_None;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);	
	
	// Commuting Method, Other
	barHeight = oneUnitY * properties.Com_Other;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[1]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}
	
	// Commuting Method, Walk
	barHeight = oneUnitY * properties.Com_Walk;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[2]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
	
	// Commuting Method, Bike
	barHeight = oneUnitY * properties.Com_Bike;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[3]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Commuting Method, Motorcycle
	barHeight = oneUnitY * properties.Com_Motorcycle;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[4]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}	

	// Commuting Method, Taxi
	barHeight = oneUnitY * properties.Com_Taxi;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[5]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
	
	// Commuting Method, Public
	barHeight = oneUnitY * properties.Com_Public;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[6]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
	
	// Commuting Method, Carpool
	barHeight = oneUnitY * properties.Com_Carpool;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[7]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
	
	// Commuting Method, Car
	barHeight = oneUnitY * properties.Com_Car;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: commutingMethodColor[8]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - spacing);
	}		
}

function commutingTimeBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
	// Commuting Time, 0 to 5
	barHeight = oneUnitY * properties.ComT_0t5;
	var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
	var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[0]});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);
	prevOffsetY = barHeight;	// Y offset for the next bar's position
	cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));	
	
	// Commuting Time, 5 to 10
	barHeight = oneUnitY * properties.ComT_5t10;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}
	
	// Commuting Time, 10 to 15
	barHeight = oneUnitY * properties.ComT_10t15;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[1]});		
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		
	
	// Commuting Time, 15 to 20
	barHeight = oneUnitY * properties.ComT_15t20;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}	

	// Commuting Time, 20 to 25
	barHeight = oneUnitY * properties.ComT_20t25;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[2]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}	

	// Commuting Time, 25 to 30
	barHeight = oneUnitY * properties.ComT_25t30;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		
	
	// Commuting Time, 30 to 35
	barHeight = oneUnitY * properties.ComT_30t35;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[3]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		
	
	// Commuting Time, 35 to 40
	barHeight = oneUnitY * properties.ComT_35t40;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		

	// Commuting Time, 40 to 45
	barHeight = oneUnitY * properties.ComT_40t45;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[4]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		

	// Commuting Time, 45 to 60
	barHeight = oneUnitY * properties.ComT_45t60;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		

	// Commuting Time, 60 to 90
	barHeight = oneUnitY * properties.ComT_60t90;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1, true);
		var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[5]});				
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		
	
	// Commuting Time, 90
	barHeight = oneUnitY * properties.ComT_90;	
	if (barHeight>0) { 
		var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, barHeight, 4, 1);
		var material = new THREE.MeshBasicMaterial({color: commutingTimeColor[6]});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		prevOffsetY += barHeight;
		cube.position.set(posX + spacing, prevOffsetY - (barHeight / 2), -posZ - (spacing * 2));
	}		
}

		
/*
function Bars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
		
}
*/

function stackedBars() {
	//for (var i=0; i<dataLength; i++) {
	for (var i=0; i<100; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		ageMaleBars(i, xyPos.x, xyPos.z);
		ageFemaleBars(i, xyPos.x, xyPos.z);
		incomeBars(i, xyPos.x, xyPos.z);
		rentalBars(i, xyPos.x, xyPos.z);
		insuranceYoungBars(i, xyPos.x, xyPos.z);
		insuranceYoungAdultBars(i, xyPos.x, xyPos.z);
		insuranceAdultBars(i, xyPos.x, xyPos.z);
		insuranceElderBars(i, xyPos.x, xyPos.z);
		commutingMethodBars(i, xyPos.x, xyPos.z);
		commutingTimeBars(i, xyPos.x, xyPos.z);
		//Bars(i, xyPos.x, xyPos.z);
		

	}
}
	
	//console.log(dataLength);	
	//console.log(material.color);
	//console.log(ElPasoData.features[0].properties);
	//console.log(ElPasoData.features[0].geometry.coordinates[0]);
	//console.log(ElPasoData.features[0]);
	
	
	
function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
	renderer.setSize(ww, wh);
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	
	document.body.style.width = container.style.width = ww+'px';
	document.body.style.height = container.style.height = wh+'px';	
}
window.addEventListener('resize', onWindowResize, false);		

function animate() {
	requestAnimationFrame(animate);
	//var time = Date.now()*.001;
	//var timer = new Date().getTime();	
	
	controls.update();
	stats.update();	
	render();
	//render( clock.getDelta() );
}

//function render(dt) {
function render() {
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}

// Execute init function after resources have loaded.
if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}
