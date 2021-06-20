/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, controls, entro = true,
	container = document.getElementById('container'), 
	renderer, camera, scene, spotL, controls, stats, geometry, material, tex=[], gridH, curNum=0;

var clock = new THREE.Clock();
//var	mouseVector = new THREE.Vector3();
//var geometry = new THREE.BufferGeometry();
var group = new THREE.Group();	
//var geom = new THREE.Geometry();
var loader = new THREE.TextureLoader();
	
// Constants
var floorposY = -5, 
	dataLength = ElPasoData.features.length,
	oneUnit = .2,	// width and length of a unit of bar
	//oneUnitY = .05,	// height of a unit of bar
	oneUnitY = .02,	// height of a unit of bar
	spacing = 0.8;	// spacing of the 17 stacked bars of a point

// Bar Colors
var	ageMaleColor = ['#feff32', '#feff1c', '#feff05', '#edee00', '#d7d700', '#c0c000', '#a9aa00', '#939300', '#7c7c00', '#656600'],
	ageFemaleColor = ['#fffd32', '#fffd1c', '#fffd05', '#eeec00', '#d7d500', '#c0bf00', '#aaa800', '#939200', '#7c7b00', '#666500'], 
	incomeColor = ['#fef630', '#fef514', '#f5ec00', '#d9d100', '#bdb600', '#a09b00', '#847f00', '#686400'], 
	rentalColor = ['#fcee34', '#fcec1b', '#fbe902', '#e2d202', '#c9bb02', '#b0a402', '#978c01', '#7e7501', '#665e01'], 
	insuranceYoungColor = ['#fadd1d', '#c7ae04', '#7d6d02'], 
	insuranceYoungAdultColor = ['#f7cb1f', '#c59e06', '#7c6304'], 
	insuranceAdultColor = ['#f5b722', '#c38c08', '#7a5805'], 	
	insuranceElderColor = ['#f2a125', '#c0780b', '#794c07'], 
	commutingMethodColor = ['#f1963f', '#ef8928', '#ed7d11', '#d5700f', '#be640d', '#a6570c', '#8f4b0a', '#773f08', '#603206'], 
	commutingTimeColor = ['#ed813f', '#ea6d21', '#d85d13', '#bb5010', '#9d440e', '#7f370b', '#612a08'], 
	foodStampsDisabilityColor = ['#e96437', '#d24516', '#9e3410', '#6b230b'], 
	languageYoungColor = ['#e7553e', '#de341a', '#b62b15', '#8d2111', '#65170c'], 	
	languageAdultColor = ['#e54341', '#db201d', '#b31a18', '#8b1412', '#630e0d'], 	
	languageElderColor = ['#ec3a48', '#e31525', '#ba111e', '#910d18', '#670911'], 
	educationColor = ['#f63a53', '#f5223e', '#f30b29', '#db0925', '#c30821', '#ab071d', '#920619', '#7a0515', '#620410'], 
	familyStructureColor = ['#fd2349', '#e60229', '#ae011f', '#750115'], 
	raceColor = ['#ff0532', '#93001a'];
	
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
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	
	
	camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	camera.position.set(0, 20, 150);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.001);
	camera.lookAt(scene.position);	
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
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
			var geometry = new THREE.PlaneBufferGeometry(460, 460, 96, 96);
			var material = new THREE.MeshPhongMaterial({color: 0x4c4640, shininess: 3, map: tex, displacementMap: texture, displacementScale: 40.0});
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
	var rad = deg * Math.PI / 180;
	return rad;
}

function LatLonToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0,
		lat = latitude * pi_180;
		lon = longitude * pi_180;
	
	var magnitude = 50000; // Spread the points apart from each other
	var pixelX = Math.cos(lat) * Math.cos(lon) * magnitude + 11950;
	var pixelZ = Math.cos(lat) * Math.sin(lon) * magnitude + 40820;
    var pixel = {x: pixelX, z: pixelZ};

    return pixel;
}

// Generate the color bands based on data
function generateTexture(height, heightSegments, colorSegments) {
	var canvas	= document.createElement('canvas');
	canvas.width = 1;
	canvas.height = 128;
	//canvas.height = height * oneUnitY;
	var context	= canvas.getContext('2d');
	context.imageSmoothingEnabled = false;
	//context.webkitImageSmoothingEnabled	= false;
	//context.mozImageSmoothingEnabled = false;
		
	var h = 0;
	
	//console.log(canvas.height);
	//for (var i=0; i<heightSegments.length; i++) {
	for (var i = (heightSegments.length - 1); i >= 0; i--) {
		context.fillStyle = colorSegments[i];
		
		//var j = heightSegments[i] * oneUnitY;
		var j = heightSegments[i] / height;
		
		/*if ((j * canvas.height) < canvas.height) {
			context.fillRect(0, h, 1, Math.round(h + (j * canvas.height)));
		} else {
			context.fillRect(0, h, 1, canvas.height);
		}*/
		context.fillRect(0, h, 1, Math.round(h + (j * canvas.height)));
		//context.fillRect(0, h, 1, h + (j * canvas.height));
		h += j * canvas.height;
		//console.log(heightSegments[i]);
		//if (colorSegments[i] == '#c9bb02') console.log(colorSegments[i]);
	}
	return canvas;
}

function ageMaleBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		//barHeight = prevOffsetY = totalHeight = 0, 
		totalHeight = 0, heightArray = [], colorArray = [];
		
	/** 
		Instead of creating a cube for each bar of a stacked bar, we only need to create one long bar, 
		whose height is the total of all non-zero values in the Age Male property. For the texture, we 
		create a segmented colored texture based on the included colors of this property.
	**/
	
	if (properties.Age_M0t4 > 0) {
		totalHeight += properties.Age_M0t4;
		heightArray.push(properties.Age_M0t4);
		colorArray.push(ageMaleColor[0]);
	}
	
	if (properties.Age_M5t9 > 0) {
		totalHeight += properties.Age_M5t9;
		heightArray.push(properties.Age_M5t9);
		colorArray.push(ageMaleColor[0]);
	}		
	
	if (properties.Age_M10t14 > 0) {
		totalHeight += properties.Age_M10t14;
		heightArray.push(properties.Age_M10t14);
		colorArray.push(ageMaleColor[1]);
	}		
	
	if (properties.Age_M15t17 > 0) {
		totalHeight += properties.Age_M15t17;
		heightArray.push(properties.Age_M15t17);
		colorArray.push(ageMaleColor[1]);
	}		
	
	if (properties.Age_M18t19 > 0) {
		totalHeight += properties.Age_M18t19;
		heightArray.push(properties.Age_M18t19);
		colorArray.push(ageMaleColor[2]);
	}		
	
	if (properties.Age_M20 > 0) {
		totalHeight += properties.Age_M20;
		heightArray.push(properties.Age_M20);
		colorArray.push(ageMaleColor[2]);
	}		
	
	if (properties.Age_M21 > 0) {
		totalHeight += properties.Age_M21;
		heightArray.push(properties.Age_M21);
		colorArray.push(ageMaleColor[2]);
	}		
	
	if (properties.Age_M22t24 > 0) {
		totalHeight += properties.Age_M22t24;
		heightArray.push(properties.Age_M22t24);
		colorArray.push(ageMaleColor[2]);
	}		
	
	if (properties.Age_M25t29 > 0) {
		totalHeight += properties.Age_M25t29;
		heightArray.push(properties.Age_M25t29);
		colorArray.push(ageMaleColor[3]);
	}		
	
	if (properties.Age_M30t34 > 0) {
		totalHeight += properties.Age_M30t34;
		heightArray.push(properties.Age_M30t34);
		colorArray.push(ageMaleColor[3]);
	}		
	
	if (properties.Age_M35t39 > 0) {
		totalHeight += properties.Age_M35t39;
		heightArray.push(properties.Age_M35t39);
		colorArray.push(ageMaleColor[4]);
	}		
	
	if (properties.Age_M40t44 > 0) {
		totalHeight += properties.Age_M40t44;
		heightArray.push(properties.Age_M40t44);
		colorArray.push(ageMaleColor[4]);
	}	
	
	if (properties.Age_M45t49 > 0) {
		totalHeight += properties.Age_M45t49;
		heightArray.push(properties.Age_M45t49);
		colorArray.push(ageMaleColor[5]);
	}		
	
	if (properties.Age_M50t54 > 0) {
		totalHeight += properties.Age_M50t54;
		heightArray.push(properties.Age_M50t54);
		colorArray.push(ageMaleColor[5]);
	}		
	
	if (properties.Age_M55t59 > 0) {
		totalHeight += properties.Age_M55t59;
		heightArray.push(properties.Age_M55t59);
		colorArray.push(ageMaleColor[6]);
	}		
	
	if (properties.Age_M60t61 > 0) {
		totalHeight += properties.Age_M60t61;
		heightArray.push(properties.Age_M60t61);
		colorArray.push(ageMaleColor[6]);
	}		
	
	if (properties.Age_M62t64 > 0) {
		totalHeight += properties.Age_M62t64;
		heightArray.push(properties.Age_M62t64);
		colorArray.push(ageMaleColor[6]);
	}		
	
	if (properties.Age_M65t66 > 0) {
		totalHeight += properties.Age_M65t66;
		heightArray.push(properties.Age_M65t66);
		colorArray.push(ageMaleColor[7]);
	}		
	
	if (properties.Age_M67t69 > 0) {
		totalHeight += properties.Age_M67t69;
		heightArray.push(properties.Age_M67t69);
		colorArray.push(ageMaleColor[7]);
	}		
	
	if (properties.Age_M70t74 > 0) {
		totalHeight += properties.Age_M70t74;
		heightArray.push(properties.Age_M70t74);
		colorArray.push(ageMaleColor[7]);
	}		
	
	if (properties.Age_M75t79 > 0) {
		totalHeight += properties.Age_M75t79;
		heightArray.push(properties.Age_M75t79);
		colorArray.push(ageMaleColor[8]);
	}		
	
	if (properties.Age_M80t84 > 0) {
		totalHeight += properties.Age_M80t84;
		heightArray.push(properties.Age_M80t84);
		colorArray.push(ageMaleColor[8]);
	}		
	
	if (properties.Age_M85 > 0) {
		totalHeight += properties.Age_M85;
		heightArray.push(properties.Age_M85);
		colorArray.push(ageMaleColor[9]);
	}	
		
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		//texture.anisotropy = renderer.getMaxAnisotropy();
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX, (totalHeight * oneUnitY) / 2, -posZ);	
	}
}

function ageFemaleBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Age_F0t4 > 0) {
		totalHeight += properties.Age_F0t4;
		heightArray.push(properties.Age_F0t4);
		colorArray.push(ageFemaleColor[0]);
	}	
	
	if (properties.Age_F5t9 > 0) {
		totalHeight += properties.Age_F5t9;
		heightArray.push(properties.Age_F5t9);
		colorArray.push(ageFemaleColor[0]);
	}	
	
	if (properties.Age_F10t14 > 0) {
		totalHeight += properties.Age_F10t14;
		heightArray.push(properties.Age_F10t14);
		colorArray.push(ageFemaleColor[1]);
	}
	
	if (properties.Age_F15t17 > 0) {
		totalHeight += properties.Age_F15t17;
		heightArray.push(properties.Age_F15t17);
		colorArray.push(ageFemaleColor[1]);
	}		
	
	if (properties.Age_F18t19 > 0) {
		totalHeight += properties.Age_F18t19;
		heightArray.push(properties.Age_F18t19);
		colorArray.push(ageFemaleColor[2]);
	}		
	
	if (properties.Age_F20 > 0) {
		totalHeight += properties.Age_F20;
		heightArray.push(properties.Age_F20);
		colorArray.push(ageFemaleColor[2]);
	}		
	
	if (properties.Age_F21 > 0) {
		totalHeight += properties.Age_F21;
		heightArray.push(properties.Age_F21);
		colorArray.push(ageFemaleColor[2]);
	}		
	
	if (properties.Age_F22t24 > 0) {
		totalHeight += properties.Age_F22t24;
		heightArray.push(properties.Age_F22t24);
		colorArray.push(ageFemaleColor[2]);
	}		
	
	if (properties.Age_F25t29 > 0) {
		totalHeight += properties.Age_F25t29;
		heightArray.push(properties.Age_F25t29);
		colorArray.push(ageFemaleColor[3]);
	}		
	
	if (properties.Age_F30t34 > 0) {
		totalHeight += properties.Age_F30t34;
		heightArray.push(properties.Age_F30t34);
		colorArray.push(ageFemaleColor[3]);
	}		
	
	if (properties.Age_F35t39 > 0) {
		totalHeight += properties.Age_F35t39;
		heightArray.push(properties.Age_F35t39);
		colorArray.push(ageFemaleColor[4]);
	}		
	
	if (properties.Age_F40t44 > 0) {
		totalHeight += properties.Age_F40t44;
		heightArray.push(properties.Age_F40t44);
		colorArray.push(ageFemaleColor[4]);
	}		
	
	if (properties.Age_F45t49 > 0) {
		totalHeight += properties.Age_F45t49;
		heightArray.push(properties.Age_F45t49);
		colorArray.push(ageFemaleColor[5]);
	}		
	
	if (properties.Age_F50t54 > 0) {
		totalHeight += properties.Age_F50t54;
		heightArray.push(properties.Age_F50t54);
		colorArray.push(ageFemaleColor[5]);
	}		
	
	if (properties.Age_F55t59 > 0) {
		totalHeight += properties.Age_F55t59;
		heightArray.push(properties.Age_F55t59);
		colorArray.push(ageFemaleColor[6]);
	}	

	if (properties.Age_F60t61 > 0) {
		totalHeight += properties.Age_F60t61;
		heightArray.push(properties.Age_F60t61);
		colorArray.push(ageFemaleColor[6]);
	}		
	
	if (properties.Age_F62t64 > 0) {
		totalHeight += properties.Age_F62t64;
		heightArray.push(properties.Age_F62t64);
		colorArray.push(ageFemaleColor[6]);
	}		
	
	if (properties.Age_F65t66 > 0) {
		totalHeight += properties.Age_F65t66;
		heightArray.push(properties.Age_F65t66);
		colorArray.push(ageFemaleColor[7]);
	}		
	
	if (properties.Age_F67t69 > 0) {
		totalHeight += properties.Age_F67t69;
		heightArray.push(properties.Age_F67t69);
		colorArray.push(ageFemaleColor[7]);
	}		
	
	if (properties.Age_F70t74 > 0) {
		totalHeight += properties.Age_F70t74;
		heightArray.push(properties.Age_F70t74);
		colorArray.push(ageFemaleColor[7]);
	}		
	
	if (properties.Age_F75t79 > 0) {
		totalHeight += properties.Age_F75t79;
		heightArray.push(properties.Age_F75t79);
		colorArray.push(ageFemaleColor[8]);
	}		
	
	if (properties.Age_F80t84 > 0) {
		totalHeight += properties.Age_F80t84;
		heightArray.push(properties.Age_F80t84);
		colorArray.push(ageFemaleColor[8]);
	}		
	
	if (properties.Age_F85 > 0) {
		totalHeight += properties.Age_F85;
		heightArray.push(properties.Age_F85);
		colorArray.push(ageFemaleColor[9]);
	}		
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		//texture.anisotropy = renderer.getMaxAnisotropy();
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX, (totalHeight * oneUnitY) / 2, -posZ - spacing);	
	}
}

function incomeBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Inc_0t10 > 0) {
		totalHeight += properties.Inc_0t10;
		heightArray.push(properties.Inc_0t10);
		colorArray.push(incomeColor[0]);
	}	
	
	if (properties.Inc_10t15 > 0) {
		totalHeight += properties.Inc_10t15;
		heightArray.push(properties.Inc_10t15);
		colorArray.push(incomeColor[0]);
	}	
	
	if (properties.Inc_15t20 > 0) {
		totalHeight += properties.Inc_15t20;
		heightArray.push(properties.Inc_15t20);
		colorArray.push(incomeColor[1]);
	}	
	
	if (properties.Inc_20t25 > 0) {
		totalHeight += properties.Inc_20t25;
		heightArray.push(properties.Inc_20t25);
		colorArray.push(incomeColor[1]);
	}	
	
	if (properties.Inc_25t30 > 0) {
		totalHeight += properties.Inc_25t30;
		heightArray.push(properties.Inc_25t30);
		colorArray.push(incomeColor[2]);
	}	
	
	if (properties.Inc_30t35 > 0) {
		totalHeight += properties.Inc_30t35;
		heightArray.push(properties.Inc_30t35);
		colorArray.push(incomeColor[2]);
	}	
	
	if (properties.Inc_35t40 > 0) {
		totalHeight += properties.Inc_35t40;
		heightArray.push(properties.Inc_35t40);
		colorArray.push(incomeColor[3]);
	}	
	
	if (properties.Inc_40t45 > 0) {
		totalHeight += properties.Inc_40t45;
		heightArray.push(properties.Inc_40t45);
		colorArray.push(incomeColor[3]);
	}	
	
	if (properties.Inc_45t50 > 0) {
		totalHeight += properties.Inc_45t50;
		heightArray.push(properties.Inc_45t50);
		colorArray.push(incomeColor[4]);
	}	
	
	if (properties.Inc_50t60 > 0) {
		totalHeight += properties.Inc_50t60;
		heightArray.push(properties.Inc_50t60);
		colorArray.push(incomeColor[4]);
	}	
	
	if (properties.Inc_60t75 > 0) {
		totalHeight += properties.Inc_60t75;
		heightArray.push(properties.Inc_60t75);
		colorArray.push(incomeColor[5]);
	}	
	
	if (properties.Inc_75t100 > 0) {
		totalHeight += properties.Inc_75t100;
		heightArray.push(properties.Inc_75t100);
		colorArray.push(incomeColor[6]);
	}	
	
	if (properties.Inc_100t125 > 0) {
		totalHeight += properties.Inc_100t125;
		heightArray.push(properties.Inc_100t125);
		colorArray.push(incomeColor[6]);
	}	
	
	if (properties.Inc_125t150 > 0) {
		totalHeight += properties.Inc_125t150;
		heightArray.push(properties.Inc_125t150);
		colorArray.push(incomeColor[7]);
	}	
	
	if (properties.Inc_150t200 > 0) {
		totalHeight += properties.Inc_150t200;
		heightArray.push(properties.Inc_150t200);
		colorArray.push(incomeColor[7]);
	}	
	
	if (properties.Inc_200 > 0) {
		totalHeight += properties.Inc_200;
		heightArray.push(properties.Inc_200);
		colorArray.push(incomeColor[7]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - spacing, (totalHeight * oneUnitY) / 2, -posZ - spacing);	
	}	
}

function rentalBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Ren_10perc > 0) {
		totalHeight += properties.Ren_10perc;
		heightArray.push(properties.Ren_10perc);
		colorArray.push(rentalColor[0]);
	}	
	
	if (properties.Ren_15perc > 0) {
		totalHeight += properties.Ren_15perc;
		heightArray.push(properties.Ren_15perc);
		colorArray.push(rentalColor[1]);
	}	
	
	if (properties.Ren_20perc > 0) {
		totalHeight += properties.Ren_20perc;
		heightArray.push(properties.Ren_20perc);
		colorArray.push(rentalColor[2]);
	}	
	
	if (properties.Ren_25perc > 0) {
		totalHeight += properties.Ren_25perc;
		heightArray.push(properties.Ren_25perc);
		colorArray.push(rentalColor[3]);
	}	
	
	if (properties.Ren_30perc > 0) {
		totalHeight += properties.Ren_30perc;
		heightArray.push(properties.Ren_30perc);
		colorArray.push(rentalColor[4]);
	}	
	
	if (properties.Ren_35perc > 0) {
		totalHeight += properties.Ren_35perc;
		heightArray.push(properties.Ren_35perc);
		colorArray.push(rentalColor[5]);
	}	
	
	if (properties.Ren_40perc > 0) {
		totalHeight += properties.Ren_40perc;
		heightArray.push(properties.Ren_40perc);
		colorArray.push(rentalColor[6]);
	}	
	
	if (properties.Ren_50perc > 0) {
		totalHeight += properties.Ren_50perc;
		heightArray.push(properties.Ren_50perc);
		colorArray.push(rentalColor[7]);
	}	
	
	if (properties.Ren_55perc > 0) {
		totalHeight += properties.Ren_55perc;
		heightArray.push(properties.Ren_55perc);
		colorArray.push(rentalColor[8]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - spacing, (totalHeight * oneUnitY) / 2, -posZ);	
	}		
}

function insuranceYoungBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Ins_Youth_Direct > 0) {
		totalHeight += properties.Ins_Youth_Direct;
		heightArray.push(properties.Ins_Youth_Direct);
		colorArray.push(insuranceYoungColor[0]);
	}	
	
	if (properties.Ins_Youth_Employer > 0) {
		totalHeight += properties.Ins_Youth_Employer;
		heightArray.push(properties.Ins_Youth_Employer);
		colorArray.push(insuranceYoungColor[0]);
	}	
	
	if (properties.Ins_Youth_MultWMedicaid > 0) {
		totalHeight += properties.Ins_Youth_MultWMedicaid;
		heightArray.push(properties.Ins_Youth_MultWMedicaid);
		colorArray.push(insuranceYoungColor[1]);
	}	
	
	if (properties.Ins_Youth_MultWMedicare > 0) {
		totalHeight += properties.Ins_Youth_MultWMedicare;
		heightArray.push(properties.Ins_Youth_MultWMedicare);
		colorArray.push(insuranceYoungColor[1]);
	}	
	
	if (properties.Ins_Youth_VA > 0) {
		totalHeight += properties.Ins_Youth_VA;
		heightArray.push(properties.Ins_Youth_VA);
		colorArray.push(insuranceYoungColor[1]);
	}	
	
	if (properties.Ins_Youth_Mil > 0) {
		totalHeight += properties.Ins_Youth_Mil;
		heightArray.push(properties.Ins_Youth_Mil);
		colorArray.push(insuranceYoungColor[1]);
	}	
	
	if (properties.Ins_Youth_Medicaid > 0) {
		totalHeight += properties.Ins_Youth_Medicaid;
		heightArray.push(properties.Ins_Youth_Medicaid);
		colorArray.push(insuranceYoungColor[1]);
	}	
	
	if (properties.Ins_Youth_Medicare > 0) {
		totalHeight += properties.Ins_Youth_Medicare;
		heightArray.push(properties.Ins_Youth_Medicare);
		colorArray.push(insuranceYoungColor[1]);
	}	
	
	if (properties.Ins_Youth_None > 0) {
		totalHeight += properties.Ins_Youth_None;
		heightArray.push(properties.Ins_Youth_None);
		colorArray.push(insuranceYoungColor[2]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - spacing, (totalHeight * oneUnitY) / 2, -posZ + spacing);	
	}			
}

function insuranceYoungAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Ins_YAdult_Direct > 0) {
		totalHeight += properties.Ins_YAdult_Direct;
		heightArray.push(properties.Ins_YAdult_Direct);
		colorArray.push(insuranceYoungAdultColor[0]);
	}	
	
	if (properties.Ins_YAdult_Employer > 0) {
		totalHeight += properties.Ins_YAdult_Employer;
		heightArray.push(properties.Ins_YAdult_Employer);
		colorArray.push(insuranceYoungAdultColor[0]);
	}	
	
	if (properties.Ins_YAdult_MultWMedicaid > 0) {
		totalHeight += properties.Ins_YAdult_MultWMedicaid;
		heightArray.push(properties.Ins_YAdult_MultWMedicaid);
		colorArray.push(insuranceYoungAdultColor[1]);
	}	
	
	if (properties.Ins_YAdult_MultWMedicare > 0) {
		totalHeight += properties.Ins_YAdult_MultWMedicare;
		heightArray.push(properties.Ins_YAdult_MultWMedicare);
		colorArray.push(insuranceYoungAdultColor[1]);
	}	
	
	if (properties.Ins_YAdult_VA > 0) {
		totalHeight += properties.Ins_YAdult_VA;
		heightArray.push(properties.Ins_YAdult_VA);
		colorArray.push(insuranceYoungAdultColor[1]);
	}	
	
	if (properties.Ins_YAdult_Mil > 0) {
		totalHeight += properties.Ins_YAdult_Mil;
		heightArray.push(properties.Ins_YAdult_Mil);
		colorArray.push(insuranceYoungAdultColor[1]);
	}	
	
	if (properties.Ins_YAdult_Medicaid > 0) {
		totalHeight += properties.Ins_YAdult_Medicaid;
		heightArray.push(properties.Ins_YAdult_Medicaid);
		colorArray.push(insuranceYoungAdultColor[1]);
	}	
	
	if (properties.Ins_YAdult_Medicare > 0) {
		totalHeight += properties.Ins_YAdult_Medicare;
		heightArray.push(properties.Ins_YAdult_Medicare);
		colorArray.push(insuranceYoungAdultColor[1]);
	}	
	
	if (properties.Ins_YAdult_None > 0) {
		totalHeight += properties.Ins_YAdult_None;
		heightArray.push(properties.Ins_YAdult_None);
		colorArray.push(insuranceYoungAdultColor[2]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX, (totalHeight * oneUnitY) / 2, -posZ + spacing);	
	}		
}

function insuranceAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Ins_Adult_Direct > 0) {
		totalHeight += properties.Ins_Adult_Direct;
		heightArray.push(properties.Ins_Adult_Direct);
		colorArray.push(insuranceAdultColor[0]);
	}

	if (properties.Ins_Adult_Employer > 0) {
		totalHeight += properties.Ins_Adult_Employer;
		heightArray.push(properties.Ins_Adult_Employer);
		colorArray.push(insuranceAdultColor[0]);
	}	
	
	if (properties.Ins_Adult_MultWMedicaid > 0) {
		totalHeight += properties.Ins_Adult_MultWMedicaid;
		heightArray.push(properties.Ins_Adult_MultWMedicaid);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_MultWMedicare > 0) {
		totalHeight += properties.Ins_Adult_MultWMedicare;
		heightArray.push(properties.Ins_Adult_MultWMedicare);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_MultWMedicareB > 0) {
		totalHeight += properties.Ins_Adult_MultWMedicareB;
		heightArray.push(properties.Ins_Adult_MultWMedicareB);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_VA > 0) {
		totalHeight += properties.Ins_Adult_VA;
		heightArray.push(properties.Ins_Adult_VA);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_Mil > 0) {
		totalHeight += properties.Ins_Adult_Mil;
		heightArray.push(properties.Ins_Adult_Mil);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_Medicaid > 0) {
		totalHeight += properties.Ins_Adult_Medicaid;
		heightArray.push(properties.Ins_Adult_Medicaid);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_Medicare > 0) {
		totalHeight += properties.Ins_Adult_Medicare;
		heightArray.push(properties.Ins_Adult_Medicare);
		colorArray.push(insuranceAdultColor[1]);
	}	
	
	if (properties.Ins_Adult_None > 0) {
		totalHeight += properties.Ins_Adult_None;
		heightArray.push(properties.Ins_Adult_None);
		colorArray.push(insuranceAdultColor[2]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX + spacing, (totalHeight * oneUnitY) / 2, -posZ + spacing);	
	}		
}

function insuranceElderBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Ins_Elder_Direct > 0) {
		totalHeight += properties.Ins_Elder_Direct;
		heightArray.push(properties.Ins_Elder_Direct);
		colorArray.push(insuranceElderColor[0]);
	}	
	
	if (properties.Ins_Elder_Employer > 0) {
		totalHeight += properties.Ins_Elder_Employer;
		heightArray.push(properties.Ins_Elder_Employer);
		colorArray.push(insuranceElderColor[0]);
	}	
	
	if (properties.Ins_Elder_MultWMedicare > 0) {
		totalHeight += properties.Ins_Elder_MultWMedicare;
		heightArray.push(properties.Ins_Elder_MultWMedicare);
		colorArray.push(insuranceElderColor[1]);
	}	
	
	if (properties.Ins_Elder_VA > 0) {
		totalHeight += properties.Ins_Elder_VA;
		heightArray.push(properties.Ins_Elder_VA);
		colorArray.push(insuranceElderColor[1]);
	}	
	
	if (properties.Ins_Elder_Mil > 0) {
		totalHeight += properties.Ins_Elder_Mil;
		heightArray.push(properties.Ins_Elder_Mil);
		colorArray.push(insuranceElderColor[1]);
	}	
	
	if (properties.Ins_Elder_Medicare > 0) {
		totalHeight += properties.Ins_Elder_Medicare;
		heightArray.push(properties.Ins_Elder_Medicare);
		colorArray.push(insuranceElderColor[1]);
	}	
	
	if (properties.Ins_Elder_None > 0) {
		totalHeight += properties.Ins_Elder_None;
		heightArray.push(properties.Ins_Elder_None);
		colorArray.push(insuranceElderColor[2]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX + spacing, (totalHeight * oneUnitY) / 2, -posZ);	
	}
}		

function commutingMethodBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Com_None > 0) {
		totalHeight += properties.Com_None;
		heightArray.push(properties.Com_None);
		colorArray.push(commutingMethodColor[0]);
	}	
	
	if (properties.Com_Other > 0) {
		totalHeight += properties.Com_Other;
		heightArray.push(properties.Com_Other);
		colorArray.push(commutingMethodColor[1]);
	}	
	
	if (properties.Com_Walk > 0) {
		totalHeight += properties.Com_Walk;
		heightArray.push(properties.Com_Walk);
		colorArray.push(commutingMethodColor[2]);
	}	
	
	if (properties.Com_Bike > 0) {
		totalHeight += properties.Com_Bike;
		heightArray.push(properties.Com_Bike);
		colorArray.push(commutingMethodColor[3]);
	}	
	
	if (properties.Com_Motorcycle > 0) {
		totalHeight += properties.Com_Motorcycle;
		heightArray.push(properties.Com_Motorcycle);
		colorArray.push(commutingMethodColor[4]);
	}	
	
	if (properties.Com_Taxi > 0) {
		totalHeight += properties.Com_Taxi;
		heightArray.push(properties.Com_Taxi);
		colorArray.push(commutingMethodColor[5]);
	}	
	
	if (properties.Com_Public > 0) {
		totalHeight += properties.Com_Public;
		heightArray.push(properties.Com_Public);
		colorArray.push(commutingMethodColor[6]);
	}	
	
	if (properties.Com_Carpool > 0) {
		totalHeight += properties.Com_Carpool;
		heightArray.push(properties.Com_Carpool);
		colorArray.push(commutingMethodColor[7]);
	}	
	
	if (properties.Com_Car > 0) {
		totalHeight += properties.Com_Car;
		heightArray.push(properties.Com_Car);
		colorArray.push(commutingMethodColor[8]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX + spacing, (totalHeight * oneUnitY) / 2, -posZ - spacing);	
	}	
}

function commutingTimeBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.ComT_0t5 > 0) {
		totalHeight += properties.ComT_0t5;
		heightArray.push(properties.ComT_0t5);
		colorArray.push(commutingTimeColor[0]);
	}	
	
	if (properties.ComT_5t10 > 0) {
		totalHeight += properties.ComT_5t10;
		heightArray.push(properties.ComT_5t10);
		colorArray.push(commutingTimeColor[0]);
	}	
	
	if (properties.ComT_10t15 > 0) {
		totalHeight += properties.ComT_10t15;
		heightArray.push(properties.ComT_10t15);
		colorArray.push(commutingTimeColor[1]);
	}	
	
	if (properties.ComT_15t20 > 0) {
		totalHeight += properties.ComT_15t20;
		heightArray.push(properties.ComT_15t20);
		colorArray.push(commutingTimeColor[1]);
	}	
	
	if (properties.ComT_20t25 > 0) {
		totalHeight += properties.ComT_20t25;
		heightArray.push(properties.ComT_20t25);
		colorArray.push(commutingTimeColor[2]);
	}	
	
	if (properties.ComT_25t30 > 0) {
		totalHeight += properties.ComT_25t30;
		heightArray.push(properties.ComT_25t30);
		colorArray.push(commutingTimeColor[2]);
	}	
	
	if (properties.ComT_30t35 > 0) {
		totalHeight += properties.ComT_30t35;
		heightArray.push(properties.ComT_30t35);
		colorArray.push(commutingTimeColor[3]);
	}	
	
	if (properties.ComT_35t40 > 0) {
		totalHeight += properties.ComT_35t40;
		heightArray.push(properties.ComT_35t40);
		colorArray.push(commutingTimeColor[3]);
	}	
	
	if (properties.ComT_40t45 > 0) {
		totalHeight += properties.ComT_40t45;
		heightArray.push(properties.ComT_40t45);
		colorArray.push(commutingTimeColor[4]);
	}	
	
	if (properties.ComT_45t60 > 0) {
		totalHeight += properties.ComT_45t60;
		heightArray.push(properties.ComT_45t60);
		colorArray.push(commutingTimeColor[4]);
	}	
	
	if (properties.ComT_60t90 > 0) {
		totalHeight += properties.ComT_60t90;
		heightArray.push(properties.ComT_60t90);
		colorArray.push(commutingTimeColor[5]);
	}	
	
	if (properties.ComT_90 > 0) {
		totalHeight += properties.ComT_90;
		heightArray.push(properties.ComT_90);
		colorArray.push(commutingTimeColor[6]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX + spacing, (totalHeight * oneUnitY) / 2, -posZ - (spacing * 2));	
	}		
}

function foodStampsDisabilityBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Fst_DnrNDis > 0) {
		totalHeight += properties.Fst_DnrNDis;
		heightArray.push(properties.Fst_DnrNDis);
		colorArray.push(foodStampsDisabilityColor[0]);
	}	
	
	if (properties.Fst_DnrDis > 0) {
		totalHeight += properties.Fst_DnrDis;
		heightArray.push(properties.Fst_DnrDis);
		colorArray.push(foodStampsDisabilityColor[1]);
	}	
	
	if (properties.Fst_RecNDis > 0) {
		totalHeight += properties.Fst_RecNDis;
		heightArray.push(properties.Fst_RecNDis);
		colorArray.push(foodStampsDisabilityColor[2]);
	}	
	
	if (properties.Fst_RecWDis > 0) {
		totalHeight += properties.Fst_RecWDis;
		heightArray.push(properties.Fst_RecWDis);
		colorArray.push(foodStampsDisabilityColor[3]);
	}
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX, (totalHeight * oneUnitY) / 2, -posZ - (spacing * 2));	
	}		
}

function languageYoungBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Lan_Youth_Eng > 0) {
		totalHeight += properties.Lan_Youth_Eng;
		heightArray.push(properties.Lan_Youth_Eng);
		colorArray.push(languageYoungColor[0]);
	}	
	
	if (properties.Lan_Youth_VW > 0) {
		totalHeight += properties.Lan_Youth_VW;
		heightArray.push(properties.Lan_Youth_VW);
		colorArray.push(languageYoungColor[1]);
	}	
	
	if (properties.Lan_Youth_W > 0) {
		totalHeight += properties.Lan_Youth_W;
		heightArray.push(properties.Lan_Youth_W);
		colorArray.push(languageYoungColor[2]);
	}	
	
	if (properties.Lan_Youth_NW > 0) {
		totalHeight += properties.Lan_Youth_NW;
		heightArray.push(properties.Lan_Youth_NW);
		colorArray.push(languageYoungColor[3]);
	}	
	
	if (properties.Lan_Youth_N > 0) {
		totalHeight += properties.Lan_Youth_N;
		heightArray.push(properties.Lan_Youth_N);
		colorArray.push(languageYoungColor[4]);
	}
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - spacing, (totalHeight * oneUnitY) / 2, -posZ - (spacing * 2));	
	}		
}

function languageAdultBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Lan_Adult_Eng > 0) {
		totalHeight += properties.Lan_Adult_Eng;
		heightArray.push(properties.Lan_Adult_Eng);
		colorArray.push(languageAdultColor[0]);
	}	
	
	if (properties.Lan_Adult_VW > 0) {
		totalHeight += properties.Lan_Adult_VW;
		heightArray.push(properties.Lan_Adult_VW);
		colorArray.push(languageAdultColor[1]);
	}	
	
	if (properties.Lan_Adult_W > 0) {
		totalHeight += properties.Lan_Adult_W;
		heightArray.push(properties.Lan_Adult_W);
		colorArray.push(languageAdultColor[2]);
	}	
	
	if (properties.Lan_Adult_NW > 0) {
		totalHeight += properties.Lan_Adult_NW;
		heightArray.push(properties.Lan_Adult_NW);
		colorArray.push(languageAdultColor[3]);
	}	
	
	if (properties.Lan_Adult_N > 0) {
		totalHeight += properties.Lan_Adult_N;
		heightArray.push(properties.Lan_Adult_N);
		colorArray.push(languageAdultColor[4]);
	}
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - (spacing * 2), (totalHeight * oneUnitY) / 2, -posZ - (spacing * 2));	
	}		
}

function languageElderBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Lan_Elder_Eng > 0) {
		totalHeight += properties.Lan_Elder_Eng;
		heightArray.push(properties.Lan_Elder_Eng);
		colorArray.push(languageElderColor[0]);
	}	
	
	if (properties.Lan_Elder_VW > 0) {
		totalHeight += properties.Lan_Elder_VW;
		heightArray.push(properties.Lan_Elder_VW);
		colorArray.push(languageElderColor[1]);
	}	
	
	if (properties.Lan_Elder_W > 0) {
		totalHeight += properties.Lan_Elder_W;
		heightArray.push(properties.Lan_Elder_W);
		colorArray.push(languageElderColor[2]);
	}	
	
	if (properties.Lan_Elder_NW > 0) {
		totalHeight += properties.Lan_Elder_NW;
		heightArray.push(properties.Lan_Elder_NW);
		colorArray.push(languageElderColor[3]);
	}	
	
	if (properties.Lan_Elder_N > 0) {
		totalHeight += properties.Lan_Elder_N;
		heightArray.push(properties.Lan_Elder_N);
		colorArray.push(languageElderColor[4]);
	}
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - (spacing * 2), (totalHeight * oneUnitY) / 2, -posZ - spacing);	
	}		
}

function educationBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Edu_none > 0) {
		totalHeight += properties.Edu_none;
		heightArray.push(properties.Edu_none);
		colorArray.push(educationColor[0]);
	}		
	
	if (properties.Edu_Nursery > 0) {
		totalHeight += properties.Edu_Nursery;
		heightArray.push(properties.Edu_Nursery);
		colorArray.push(educationColor[0]);
	}	
	
	if (properties.Edu_Kinder > 0) {
		totalHeight += properties.Edu_Kinder;
		heightArray.push(properties.Edu_Kinder);
		colorArray.push(educationColor[0]);
	}	

	if (properties.Edu_1 > 0) {
		totalHeight += properties.Edu_1;
		heightArray.push(properties.Edu_1);
		colorArray.push(educationColor[0]);
	}	

	if (properties.Edu_2 > 0) {
		totalHeight += properties.Edu_2;
		heightArray.push(properties.Edu_2);
		colorArray.push(educationColor[0]);
	}	

	if (properties.Edu_3 > 0) {
		totalHeight += properties.Edu_3;
		heightArray.push(properties.Edu_3);
		colorArray.push(educationColor[0]);
	}	

	if (properties.Edu_4 > 0) {
		totalHeight += properties.Edu_4;
		heightArray.push(properties.Edu_4);
		colorArray.push(educationColor[0]);
	}		
	
	if (properties.Edu_5 > 0) {
		totalHeight += properties.Edu_5;
		heightArray.push(properties.Edu_5);
		colorArray.push(educationColor[1]);
	}		
	
	if (properties.Edu_6 > 0) {
		totalHeight += properties.Edu_6;
		heightArray.push(properties.Edu_6);
		colorArray.push(educationColor[1]);
	}		
	
	if (properties.Edu_7 > 0) {
		totalHeight += properties.Edu_7;
		heightArray.push(properties.Edu_7);
		colorArray.push(educationColor[1]);
	}	
	
	if (properties.Edu_8 > 0) {
		totalHeight += properties.Edu_8;
		heightArray.push(properties.Edu_8);
		colorArray.push(educationColor[2]);
	}	
	
	if (properties.Edu_9 > 0) {
		totalHeight += properties.Edu_9;
		heightArray.push(properties.Edu_9);
		colorArray.push(educationColor[2]);
	}	

	if (properties.Edu_10 > 0) {
		totalHeight += properties.Edu_10;
		heightArray.push(properties.Edu_10);
		colorArray.push(educationColor[2]);
	}	

	if (properties.Edu_11 > 0) {
		totalHeight += properties.Edu_11;
		heightArray.push(properties.Edu_11);
		colorArray.push(educationColor[2]);
	}	

	if (properties.Edu_12 > 0) {
		totalHeight += properties.Edu_12;
		heightArray.push(properties.Edu_12);
		colorArray.push(educationColor[2]);
	}	
	
	if (properties.Edu_HSDiploma > 0) {
		totalHeight += properties.Edu_HSDiploma;
		heightArray.push(properties.Edu_HSDiploma);
		colorArray.push(educationColor[3]);
	}	

	if (properties.Edu_GED > 0) {
		totalHeight += properties.Edu_GED;
		heightArray.push(properties.Edu_GED);
		colorArray.push(educationColor[3]);
	}	

	if (properties.Edu_Col1 > 0) {
		totalHeight += properties.Edu_Col1;
		heightArray.push(properties.Edu_Col1);
		colorArray.push(educationColor[3]);
	}	

	if (properties.Edu_ColMult > 0) {
		totalHeight += properties.Edu_ColMult;
		heightArray.push(properties.Edu_ColMult);
		colorArray.push(educationColor[3]);
	}	
	
	if (properties.Edu_Assoc > 0) {
		totalHeight += properties.Edu_Assoc;
		heightArray.push(properties.Edu_Assoc);
		colorArray.push(educationColor[4]);
	}	
	
	if (properties.Edu_Batch > 0) {
		totalHeight += properties.Edu_Batch;
		heightArray.push(properties.Edu_Batch);
		colorArray.push(educationColor[5]);
	}
	
	if (properties.Edu_Master > 0) {
		totalHeight += properties.Edu_Master;
		heightArray.push(properties.Edu_Master);
		colorArray.push(educationColor[6]);
	}

	if (properties.Edu_Pro > 0) {
		totalHeight += properties.Edu_Pro;
		heightArray.push(properties.Edu_Pro);
		colorArray.push(educationColor[7]);
	}

	if (properties.Edu_Doc > 0) {
		totalHeight += properties.Edu_Doc;
		heightArray.push(properties.Edu_Doc);
		colorArray.push(educationColor[8]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - (spacing * 2), (totalHeight * oneUnitY) / 2, -posZ);	
	}		
}

function familyStructureBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Fam_FamMarried > 0) {
		totalHeight += properties.Fam_FamMarried;
		heightArray.push(properties.Fam_FamMarried);
		colorArray.push(familyStructureColor[0]);
	}	
	
	if (properties.Fam_FamOther > 0) {
		totalHeight += properties.Fam_FamOther;
		heightArray.push(properties.Fam_FamOther);
		colorArray.push(familyStructureColor[1]);
	}	
	
	if (properties.Fam_NFamSingle > 0) {
		totalHeight += properties.Fam_NFamSingle;
		heightArray.push(properties.Fam_NFamSingle);
		colorArray.push(familyStructureColor[2]);
	}	
	
	if (properties.Fam_NFamMulti > 0) {
		totalHeight += properties.Fam_NFamMulti;
		heightArray.push(properties.Fam_NFamMulti);
		colorArray.push(familyStructureColor[3]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - (spacing * 2), (totalHeight * oneUnitY) / 2, -posZ + spacing);	
	}		
}

function raceBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		totalHeight = 0, heightArray = [], colorArray = [];

	if (properties.Rac_Hisp > 0) {
		totalHeight += properties.Rac_Hisp;
		heightArray.push(properties.Rac_Hisp);
		colorArray.push(familyStructureColor[0]);
	}	
	
	if (properties.Rac_NotHisp > 0) {
		totalHeight += properties.Rac_NotHisp;
		heightArray.push(properties.Rac_NotHisp);
		colorArray.push(familyStructureColor[1]);
	}	
	
	if (totalHeight>0) {
		var texture	= new THREE.Texture(generateTexture(totalHeight, heightArray, colorArray));
		texture.needsUpdate	= true;	
	
		geometry = new THREE.BoxGeometry(oneUnit, totalHeight * oneUnitY, oneUnit);
		material = new THREE.MeshBasicMaterial({map: texture});
		var cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		cube.position.set(posX - (spacing * 2), (totalHeight * oneUnitY) / 2, -posZ + (spacing * 2));	
	}				
}

// Create the stacked bar charts
function stackedBars() {
	for (var i=0; i<dataLength; i++) {
	//for (var i=0; i<100; i++) {
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
		foodStampsDisabilityBars(i, xyPos.x, xyPos.z);
		languageYoungBars(i, xyPos.x, xyPos.z);
		languageAdultBars(i, xyPos.x, xyPos.z);
		languageElderBars(i, xyPos.x, xyPos.z);
		educationBars(i, xyPos.x, xyPos.z);
		familyStructureBars(i, xyPos.x, xyPos.z);
		raceBars(i, xyPos.x, xyPos.z);
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
