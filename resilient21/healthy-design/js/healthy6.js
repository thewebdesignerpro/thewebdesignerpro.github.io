/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
(function(){
var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	container = document.getElementById('container'), gear = document.getElementById("gear"), kontrols = document.getElementById("kontrols"), 
	//klose = document.getElementById("klose"), kamera = document.getElementById("kamera"), kamView = document.getElementById("view"), klose = document.getElementById("klose"), kategory = document.getElementById("kategory"), 
	property1 = document.getElementById("property1"), property2 = document.getElementById("property2"), property3 = document.getElementById("property3"), 
	property4 = document.getElementById("property4"), property5 = document.getElementById("property5"), property6 = document.getElementById("property6"), 
	property7 = document.getElementById("property7"), property8 = document.getElementById("property8"), property9 = document.getElementById("property9"), 
	polygons = document.getElementById("polygons"), multipolygons = document.getElementById("multipolygons"), tooltip = document.getElementById("tooltip"), 
	roads = document.getElementById("roads"), terrainM = document.getElementById("terrainM"), 
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, terrain, 
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, iconsObj = [], scale = 0.01, raycaster, mouse = new THREE.Vector2(), INTERSECTED = null, textHeight = 0, 
	pointclouds, threshold = 0.1, tTip;

// Constants
const 	floorposY = -1.5, 
		dataLength = HealthyDesignData.features.length,
		roadLength = roadData.features.length, 
		oneUnit = .2,	// width and length of a unit of bar
		oneUnitY = .02,	// height of a unit of bar
		spacing = 0.8;	// spacing of the 17 stacked bars of a point

var policeStations, schools, headStarts, clinics, publicHousings, publicRecs, libraries, museums, hospitals;
var policeStationLoaded = schoolLoaded = headStartLoaded = clinicLoaded = publicHousingLoaded = publicRecLoaded = libraryLoaded = museumLoaded = hospitalLoaded = false;
		
var	roadsGroup = new THREE.Group(), 	
	polyGroup = new THREE.Group(), 
	multipolyGroup = new THREE.Group(), 
	iconsGroup = new THREE.Group();	
	
/*var policeStations = [];
	schools = [];
	headStarts = [];
	clinics = [];
	publicHousings = [];
	publicRecs = [];
	libraries = [];
	museums = [];
	hospitals = [];
	
var policeStations = new THREE.Group(), 
	schools = new THREE.Group(), 
	headStarts = new THREE.Group(), 
	clinics = new THREE.Group(), 
	publicHousings = new THREE.Group(), 
	publicRecs = new THREE.Group(), 
	libraries = new THREE.Group(), 
	museums = new THREE.Group(),
	hospitals = new THREE.Group();
*/
		
var loader = new THREE.TextureLoader();		
var clock = new THREE.Clock();
//var	mouseVector = new THREE.Vector3();
//var geometry = new THREE.BufferGeometry();
var categories = [], categoryMesh = [];
//var geometry = new THREE.BoxGeometry(oneUnit, oneUnitY, oneUnit);
var geometry = new THREE.CylinderGeometry(oneUnit, oneUnit, oneUnitY, 4, 1, true);
//var geom = new THREE.Geometry(); // for merging
var material = new THREE.MeshBasicMaterial({transparent: true, opacity: 1.0, shading: THREE.FlatShading, vertexColors: THREE.VertexColors});
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
//kontrols.style.right = -320;
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;
SimpleScrollbar.initEl(document.querySelector("#kontrols"));

// If browser does not support WebGL, display a message.
if (!Detector.webgl) Detector.addGetWebGLMessage();

// The usual initialization routine, which includes setting up renderer, scene, camera, controls, and lights.
function init() {
	//camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	//camera = new THREE.CombinedCamera(ww / 2, wh / 2, 40, 1, 1000, -500, 1000);
	//camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, -500, 1000);
	camera = new THREE.OrthographicCamera(wwh / -2, wwh / 2, whh / 2, whh / -2, -500, 1000);
	camera.position.set(0, 20, 60);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x000000, 0.001);
	//camera.lookAt(scene.position);	
	//camera.toOrthographic();
	
	var aLight = new THREE.AmbientLight(0x333333);
	scene.add(aLight);
	
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

	theRoads();
	
	thePolygons();
	theMultipolygons();
	
	loadPoliceIcon();
	//loadSchoolIcon();
	//loadHeadStartIcon();

	//terrainMesh();
	
	raycaster = new THREE.Raycaster();
	//raycaster.params.Points.threshold = threshold;
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	//renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	//controls.enableZoom = false;
	controls.minDistance = 5;
	controls.maxDistance = 1000;	
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
	loader.load(
		'img/texture/d.jpg',
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			//texture.repeat.set(8, 8);
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
		'img/map/elpaso_disp_2.jpg',
		function (texture) {
			//var geometry = new THREE.PlaneBufferGeometry(460, 460, 96, 96);
			var geometry = new THREE.PlaneBufferGeometry(267.5, 312.975, 96, 96);
			//var material = new THREE.MeshPhongMaterial({color: 0x4c4640, shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 0.6});
			//var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 1.0});
			var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 14.0, transparent: true, opacity: 1.0});
			terrain = new THREE.Mesh(geometry, material);
			terrain.rotation.set(-Math.PI/2, 0, 0);
			terrain.position.y = floorposY;
			//terrain.castShadow = true;
			//terrain.receiveShadow = true;
			//terrain.material.wireframe = true;
			scene.add(terrain);
			//console.log(terrain.geometry);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

// Draw the road lines
function theRoads() {
	var material = new THREE.LineBasicMaterial({color: 0x339993});
	//var material = new THREE.LineDashedMaterial({color: 0x339993, scale: 2, dashSize: 4, gapSize: 2});
	
	for (var i = 0; i < roadLength; i++) {
		var geometry = new THREE.Geometry();
		
		for (var j = 0; j < roadData.features[i].geometry.coordinates.length; j++) {
			var xyPos = LatLonToPixelXY(roadData.features[i].geometry.coordinates[j][1], roadData.features[i].geometry.coordinates[j][0]);	
			//console.log(roadData.features[i].geometry.coordinates.length);

			geometry.vertices.push(new THREE.Vector3(xyPos.x, 1, xyPos.z));
		}
		var road = new THREE.Line(geometry, material);
		roadsGroup.add(road);		
	}
	
	scene.add(roadsGroup);
}

// Draw the Polygons types
function thePolygons() {
	var material = new THREE.LineBasicMaterial({color: 0xaaff00});
	//var material = new THREE.LineDashedMaterial({color: 0x339993, scale: 2, dashSize: 4, gapSize: 2});
	
	for (var i = 0; i < dataLength; i++) {
		var geometry = new THREE.Geometry();
		
		if (HealthyDesignData.features[i].geometry.type == 'Polygon') {
			for (var j = 0; j < HealthyDesignData.features[i].geometry.coordinates[0].length; j++) {
				var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[0][j][1], HealthyDesignData.features[i].geometry.coordinates[0][j][0]);	
				//console.log(HealthyDesignData.features[i].geometry.coordinates.length);
				//console.log(j);
	
				geometry.vertices.push(new THREE.Vector3(xyPos.x, 1.6, xyPos.z));
			}
		}
		if (geometry.vertices.length > 0) {
			var poly = new THREE.Line(geometry, material);
			polyGroup.add(poly);		
		}
	}
	
	scene.add(polyGroup);
}

// Draw the Multi Polygons types
function theMultipolygons() {
	var material = new THREE.LineBasicMaterial({color: 0x8822ee});
	//var material = new THREE.LineDashedMaterial({color: 0x339993, scale: 2, dashSize: 4, gapSize: 2});
	
	for (var i = 0; i < dataLength; i++) {
		var geometry = new THREE.Geometry();
		
		// Draw MultiPolygon types
		if (HealthyDesignData.features[i].geometry.type == 'MultiPolygon') {
			for (var j = 0; j < HealthyDesignData.features[i].geometry.coordinates[0][0].length; j++) {
				var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[0][0][j][1], HealthyDesignData.features[i].geometry.coordinates[0][0][j][0]);	
	
				geometry.vertices.push(new THREE.Vector3(xyPos.x, 1.5, xyPos.z));
			}
		}		

		if (geometry.vertices.length > 0) {
			var multipoly = new THREE.Line(geometry, material);
			multipolyGroup.add(multipoly);		
		}
	}

	scene.add(multipolyGroup);
}

function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function LatLonToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0,
		lat = latitude * pi_180;
		lon = longitude * pi_180;
	
	var magnitude = 6000; // Spread the points apart from each other
	//var magnitude = 50000; // Spread the points apart from each other
	//var pixelX = Math.cos(lat) * Math.cos(lon) * magnitude + 11950;
	//var pixelZ = Math.cos(lat) * Math.sin(lon) * magnitude + 40770;
	var pixelX = (460/180.0) * (90 + lon) * magnitude - 1351498.77336492;
	var pixelZ = (460/180.0) * (90 - lat) * magnitude * 1.17 - 1604736.96986;	
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

	//console.log(dataLength);	
	//console.log(material.color);
	//console.log(HealthyDesignData.features[0].properties);
	//console.log(HealthyDesignData.features[0].geometry.coordinates[0]);
	//console.log(HealthyDesignData.features[0]);
	
function loadPoliceIcon() {
	loader.load(
		'img/badge.png',
		function (texture) {
			icon1 = texture;
			loadSchoolIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	
	
function loadSchoolIcon() {
	loader.load(
		'img/toga.png',
		function (texture) {
			icon2 = texture;
			loadHeadStartIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	

function loadHeadStartIcon() {
	loader.load(
		'img/child.png',
		function (texture) {
			icon3 = texture;
			loadClinicIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	

function loadClinicIcon() {
	loader.load(
		'img/pill.png',
		function (texture) {
			icon4 = texture;
			loadHousingIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	

function loadHousingIcon() {
	loader.load(
		'img/house.png',
		function (texture) {
			icon5 = texture;
			loadPublicRecIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	

function loadPublicRecIcon() {
	loader.load(
		'img/stadium.png',
		function (texture) {
			icon6 = texture;
			loadLibraryIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}

function loadLibraryIcon() {
	loader.load(
		'img/books.png',
		function (texture) {
			icon7 = texture;
			loadMuseumIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}

function loadMuseumIcon() {
	loader.load(
		'img/columns.png',
		function (texture) {
			icon8 = texture;
			loadHospitalIcon();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}

// Load hospital icon, then add the sprites to the scene
function loadHospitalIcon() {
	loader.load(
		'img/cross.png',
		function (texture) {
			icon9 = texture;
			addIcons();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	

// Create the icons
function addIcons() {
	var numPos1 = numPos2 = numPos3 = numPos4 = numPos5 = numPos6 = numPos7 = numPos8 = numPos9 = 0;
	
	for ( var i = 0; i < dataLength; i++ ) {
		if (HealthyDesignData.features[i].geometry.type == 'Point') {
			switch(HealthyDesignData.features[i].properties.Type) {
				case "Police Station":
					numPos1 += 1;
					break;
				case "School":
					numPos2 += 1;
					break;
				case "Head Start":
					numPos3 += 1;
					break;
				case "Clinic":
					numPos4 += 1;
					break;
				case "Public Housing":
					numPos5 += 1;
					break;
				case "Public Rec":
					numPos6 += 1;
					break;
				case "Library":
					numPos7 += 1;
					break;
				case "Museum":
					numPos8 += 1;
					break;
				case "Hospital":
					numPos9 += 1;
					break;					
				default:

			}
		}
	}

	var geometry1 = new THREE.BufferGeometry();
	var positions1 = new Float32Array(numPos1 * 3);
	var names1 = new Array(numPos1);
	var geometry2 = new THREE.BufferGeometry();
	var positions2 = new Float32Array(numPos2 * 3);	
	var names2 = new Array(numPos2);	
	var geometry3 = new THREE.BufferGeometry();
	var positions3 = new Float32Array(numPos3 * 3);	
	var names3 = new Array(numPos3);	
	var geometry4 = new THREE.BufferGeometry();
	var positions4 = new Float32Array(numPos4 * 3);	
	var names4 = new Array(numPos4);
	var geometry5 = new THREE.BufferGeometry();
	var positions5 = new Float32Array(numPos5 * 3);	
	var names5 = new Array(numPos5);
	var geometry6 = new THREE.BufferGeometry();
	var positions6 = new Float32Array(numPos6 * 3);	
	var names6 = new Array(numPos6);
	var geometry7 = new THREE.BufferGeometry();
	var positions7 = new Float32Array(numPos7 * 3);	
	var names7 = new Array(numPos7);
	var geometry8 = new THREE.BufferGeometry();
	var positions8 = new Float32Array(numPos8 * 3);	
	var names8 = new Array(numPos8);
	var geometry9 = new THREE.BufferGeometry();
	var positions9 = new Float32Array(numPos9 * 3);		
	var names9 = new Array(numPos8);
	//var colors = new Float32Array();
	//var color = new THREE.Color();
	var j1 = j2 = j3 = j4 = j5 = j6 = j7 = j8 = j9 = 0;
	//console.log(geometry1);				
	
	for ( var i = 0; i < dataLength; i++ ) {
		//var material = new THREE.SpriteMaterial({color: 0x226699, map: icon1, fog: true, depthWrite: false, depthTest: false});
		var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);	
	
		if (HealthyDesignData.features[i].geometry.type == 'Point') {
			switch(HealthyDesignData.features[i].properties.Type) {
				case "Police Station":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions1[3 * j1] = vertex.x;
						positions1[3 * j1 + 1] = vertex.y;
						positions1[3 * j1 + 2] = vertex.z;							
				
						names1[j1] = HealthyDesignData.features[i].properties.Name;
						
						j1 += 1;							
						
						//positions1.name = HealthyDesignData.features[i].properties.Name;
						/*var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
						tTip.position.set(0, 10, 0);
						policeStations.add(tTip);*/
					break;
				case "School":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions2[3 * j2] = vertex.x;
						positions2[3 * j2 + 1] = vertex.y;
						positions2[3 * j2 + 2] = vertex.z;							

						names2[j2] = HealthyDesignData.features[i].properties.Name;
						
						j2 += 1;	
					break;
				case "Head Start":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions3[3 * j3] = vertex.x;
						positions3[3 * j3 + 1] = vertex.y;
						positions3[3 * j3 + 2] = vertex.z;							

						names3[j3] = HealthyDesignData.features[i].properties.Name;
						
						j3 += 1;	
					break;
				case "Clinic":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions4[3 * j4] = vertex.x;
						positions4[3 * j4 + 1] = vertex.y;
						positions4[3 * j4 + 2] = vertex.z;							

						names4[j4] = HealthyDesignData.features[i].properties.Name;
						
						j4 += 1;	
					break;
				case "Public Housing":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions5[3 * j5] = vertex.x;
						positions5[3 * j5 + 1] = vertex.y;
						positions5[3 * j5 + 2] = vertex.z;							

						names5[j5] = HealthyDesignData.features[i].properties.Name;
						
						j5 += 1;	
					break;
				case "Public Rec":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions6[3 * j6] = vertex.x;
						positions6[3 * j6 + 1] = vertex.y;
						positions6[3 * j6 + 2] = vertex.z;							

						names6[j6] = HealthyDesignData.features[i].properties.Name;
						
						j6 += 1;	
					break;
				case "Library":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions7[3 * j7] = vertex.x;
						positions7[3 * j7 + 1] = vertex.y;
						positions7[3 * j7 + 2] = vertex.z;							

						names7[j7] = HealthyDesignData.features[i].properties.Name;
						
						j7 += 1;	
					break;
				case "Museum":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions8[3 * j8] = vertex.x;
						positions8[3 * j8 + 1] = vertex.y;
						positions8[3 * j8 + 2] = vertex.z;							

						names8[j8] = HealthyDesignData.features[i].properties.Name;
						
						j8 += 1;	
					break;
				case "Hospital":
						var vertex = new THREE.Vector3();
						vertex.x = parseFloat(xyPos.x);
						vertex.y = (Math.random() * 9) + 2;
						vertex.z = parseFloat(xyPos.z);		

						positions9[3 * j9] = vertex.x;
						positions9[3 * j9 + 1] = vertex.y;
						positions9[3 * j9 + 2] = vertex.z;							

						names9[j9] = HealthyDesignData.features[i].properties.Name;
						
						j9 += 1;	
					break;					
				default:

			}
		}	
	}

	geometry1.addAttribute('position', new THREE.BufferAttribute(positions1, 3));
	//geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
	geometry1.addAttribute('name', new THREE.BufferAttribute(names1, 1));
	geometry1.computeBoundingBox();
	//console.log(geometry1);
					
	var material = new THREE.PointsMaterial({size: 24, color: 0x004499, map: icon1, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	policeStations = new THREE.Points(geometry1, material);
	//scene.add(policeStations);	
	policeStationLoaded = true;
	
	geometry2.addAttribute('position', new THREE.BufferAttribute(positions2, 3));
	geometry2.addAttribute('name', new THREE.BufferAttribute(names2, 1));
	geometry2.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0x1a1a1a, map: icon2, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	schools = new THREE.Points(geometry2, material);
	//scene.add(schools);	
	schoolLoaded = true;	
	
	geometry3.addAttribute('position', new THREE.BufferAttribute(positions3, 3));
	geometry3.addAttribute('name', new THREE.BufferAttribute(names3, 1));
	geometry3.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0xbb0000, map: icon3, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	headStarts = new THREE.Points(geometry3, material);
	//scene.add(headStarts);	
	headStartLoaded = true;	

	geometry4.addAttribute('position', new THREE.BufferAttribute(positions4, 3));
	geometry4.addAttribute('name', new THREE.BufferAttribute(names4, 1));
	geometry4.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0x00ff00, map: icon4, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	clinics = new THREE.Points(geometry4, material);
	//scene.add(clinics);	
	clinicLoaded = true;	

	geometry5.addAttribute('position', new THREE.BufferAttribute(positions5, 3));
	geometry5.addAttribute('name', new THREE.BufferAttribute(names5, 1));
	geometry5.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0x119922, map: icon5, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	publicHousings = new THREE.Points(geometry5, material);
	//scene.add(publicHousings);	
	publicHousingLoaded = true;	

	geometry6.addAttribute('position', new THREE.BufferAttribute(positions6, 3));
	geometry6.addAttribute('name', new THREE.BufferAttribute(names6, 1));
	geometry6.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0x444444, map: icon6, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	publicRecs = new THREE.Points(geometry6, material);
	//scene.add(publicRecs);	
	publicRecLoaded = true;	

	geometry7.addAttribute('position', new THREE.BufferAttribute(positions7, 3));
	geometry7.addAttribute('name', new THREE.BufferAttribute(names7, 1));
	geometry7.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0x555555, map: icon7, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	libraries = new THREE.Points(geometry7, material);
	//scene.add(libraries);	
	libraryLoaded = true;	

	geometry8.addAttribute('position', new THREE.BufferAttribute(positions8, 3));
	geometry8.addAttribute('name', new THREE.BufferAttribute(names8, 1));
	geometry8.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0xc7b299, map: icon8, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	museums = new THREE.Points(geometry8, material);
	//scene.add(museums);	
	museumLoaded = true;	

	geometry9.addAttribute('position', new THREE.BufferAttribute(positions9, 3));
	geometry9.addAttribute('name', new THREE.BufferAttribute(names9, 1));
	geometry9.computeBoundingBox();
					
	var material = new THREE.PointsMaterial({size: 24, color: 0xaa2620, map: icon9, transparent: true, opacity: .9, sizeAttenuation: false, depthWrite: false, depthTest: false});
	hospitals = new THREE.Points(geometry9, material);
	//scene.add(hospitals);	
	hospitalLoaded = true;		
	
	//iconsObj = [policeStations, schools, headStarts, clinics, publicHousings, publicRecs, libraries, museums, hospitals];
	iconsObj = [policeStations];
	//iconsObj.push = policeStations;
	//console.log(iconsObj);
	iconsGroup.add(policeStations);
	/*iconsGroup.add(schools);
	iconsGroup.add(headStarts);
	iconsGroup.add(clinics);
	iconsGroup.add(publicHousings);
	iconsGroup.add(publicRecs);
	iconsGroup.add(libraries);
	iconsGroup.add(museums);
	iconsGroup.add(hospitals);*/
	
	scene.add(iconsGroup);
}

function toolTip(message, opts) {
	var parameters = opts || {};
	var fontface = parameters.fontface || 'Helvetica';
	var fontsize = parameters.fontsize || 15;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = fontsize + "px " + fontface;
	
	// get size data (height depends only on font size)
	var metrics = context.measureText(message);
	//var textWidth = metrics.width;
	var textWidth = metrics.width;
		//textHeight = metrics.width;

	//canvas.width = metrics.width;
	//canvas.height = 64;
	
	// text color
	context.fillStyle = 'rgba(220, 220, 220, 1.0)';
	context.fillText(message, 0, fontsize);
	//context.fillText(message, 0, 80);
	
	//context.fillStyle = 'rgba(220, 0, 0, 1.0)';
	//context.fillRect(0, 0, metrics.width, 5);

	var texture = new THREE.Texture(canvas)
	texture.minFilter = THREE.LinearFilter;
	texture.needsUpdate = true;

	//var spriteMaterial = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false});
	//var spriteMaterial = new THREE.SpriteMaterial({map: texture, rotation: -Math.PI/2});
	var spriteMaterial = new THREE.SpriteMaterial({map: texture});
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(40, 20, 1.0);
	return sprite;
}

property1.addEventListener("click", function(e) {
	if (property1.className == "selected") {
		iconsGroup.remove(policeStations);
		//scene.remove(policeStations);
		//policeStations.position.y = -1000;
		property1.className = "";
	} else {
		//policeStations.position.y = 0;
		//scene.add(policeStations);
		iconsGroup.add(policeStations);
		property1.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property2.addEventListener("click", function(e) {
	if (property2.className == "selected") {
		iconsGroup.remove(schools);
		property2.className = "";
	} else {
		iconsGroup.add(schools);
		property2.className = "selected";
		
		//iconsObj.push = schools;
	}	
	
	e.preventDefault();
}, false);	

property3.addEventListener("click", function(e) {
	if (property3.className == "selected") {
		iconsGroup.remove(headStarts);
		property3.className = "";
	} else {
		iconsGroup.add(headStarts);
		property3.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property4.addEventListener("click", function(e) {
	if (property4.className == "selected") {
		iconsGroup.remove(clinics);
		property4.className = "";
	} else {
		iconsGroup.add(clinics);
		property4.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property5.addEventListener("click", function(e) {
	if (property5.className == "selected") {
		iconsGroup.remove(publicHousings);
		property5.className = "";
	} else {
		iconsGroup.add(publicHousings);
		property5.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property6.addEventListener("click", function(e) {
	if (property6.className == "selected") {
		iconsGroup.remove(publicRecs);
		property6.className = "";
	} else {
		iconsGroup.add(publicRecs);
		property6.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property7.addEventListener("click", function(e) {
	if (property7.className == "selected") {
		iconsGroup.remove(libraries);
		property7.className = "";
	} else {
		iconsGroup.add(libraries);
		property7.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property8.addEventListener("click", function(e) {
	if (property8.className == "selected") {
		iconsGroup.remove(museums);
		property8.className = "";
	} else {
		iconsGroup.add(museums);
		property8.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property9.addEventListener("click", function(e) {
	if (property9.className == "selected") {
		iconsGroup.remove(hospitals);
		property9.className = "";
	} else {
		iconsGroup.add(hospitals);
		property9.className = "selected";
	}	
	
	e.preventDefault();
}, false);	
	
roads.addEventListener('click', function(e) {
	//e.preventDefault();
	e.stopPropagation();
	
	if (roads.checked) {
		roads.checked = true;
		scene.add(roadsGroup);
	} else {
		roads.checked = false;
		scene.remove(roadsGroup);
		//roadsGroup.visible = false;
	}
	//console.log(roads.checked);	
}, false);	

terrainM.addEventListener('click', function(e) {
	e.stopPropagation();
	
	if (terrainM.checked) {
		terrainM.checked = true;
		terrain.material.wireframe = true;
	} else {
		terrainM.checked = false;
		terrain.material.wireframe = false;
	}
}, false);	

polygons.addEventListener('click', function(e) {
	e.stopPropagation();
	
	if (polygons.checked) {
		polygons.checked = true;
		scene.add(polyGroup);
	} else {
		polygons.checked = false;
		scene.remove(polyGroup);
	}
}, false);	

multipolygons.addEventListener('click', function(e) {
	e.stopPropagation();
	
	if (multipolygons.checked) {
		multipolygons.checked = true;
		scene.add(multipolyGroup);
	} else {
		multipolygons.checked = false;
		scene.remove(multipolyGroup);
	}
}, false);	
	
function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	

	camera.left = wwh / - 2;
	camera.right = wwh / 2;
	camera.top = whh / 2;
	camera.bottom = whh / - 2;	
	
	/*camera.left = ww / - 2;
	camera.right = ww / 2;
	camera.top = wh / 2;
	camera.bottom = wh / - 2;*/
	
	//camera.setSize(ww, wh);
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	
	renderer.setSize(ww, wh);
	
	document.body.style.width = container.style.width = ww+'px';
	document.body.style.height = container.style.height = wh+'px';	
}
window.addEventListener('resize', onWindowResize, false);		

function onDocumentMouseMove(e) {
	e.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseClick(e) {
	//e.preventDefault();
	
	// find intersections
	raycaster.setFromCamera(mouse, camera);

	//var intersects = raycaster.intersectObjects(iconsObj);
	var intersects = raycaster.intersectObjects(iconsGroup.children);	
	//var intersects = raycaster.intersectObject(policeStations);
	//var intersects = raycaster.intersectObjects(policeStations.children, schools.children);
	//INTERSECTED = (intersects.length) > 0 ? intersects[0] : null;

	if (intersects.length > 0) {
		//if (INTERSECTED != intersects[0].object) {
		if (INTERSECTED != intersects[0]) {
			if (INTERSECTED) scene.remove(tTip);

			INTERSECTED = intersects[0];
			//tooltip.innerHTML = INTERSECTED.object.geometry.attributes.name.array[INTERSECTED.index];
			tTip = toolTip(INTERSECTED.object.geometry.attributes.name.array[INTERSECTED.index]);
			tTip.position.copy(INTERSECTED.point);
			//tTip.position.x += 10;
			scene.add(tTip);			
			
		}
		//console.log(INTERSECTED.object.geometry.attributes.name[INTERSECTED.index]);
		//console.log(INTERSECTED.object.geometry.attributes.name.array[INTERSECTED.index]);
	} else {
		//if (INTERSECTED) tooltip.innerHTML = '';
		if (INTERSECTED) scene.remove(tTip);
		INTERSECTED = null;
	}
	//console.log('click');	
}
document.addEventListener('click', onDocumentMouseClick, false);

function animate() {
	requestAnimationFrame(animate);
	//var time = Date.now()*.001;
	//var timer = new Date().getTime();	

/*	if (entro && publicHousingLoaded) {
		if (scale < 1.0) {
scale += 0.1;
publicHousings.scale.set(scale, scale, scale);
//console.log(publicHousings.scale.x);
		} else {
publicHousings.scale.set(1, 1, 1);
entro = false;
scale = 0.01;
//console.log(scale);
		}
	}
*/
	
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
	
//	var delta = clock.getDelta();
//	controls.update(delta);	

	//stats.update();	
	render();
	//render( clock.getDelta() );
}

//function render(dt) {
function render() {
	//if (lookAtScene) camera.lookAt(scene.position);
	
	//camera.lookAt(scene.position);
	//camera.updateMatrixWorld();
	
	controls.update();
	camera.updateMatrixWorld();	
	renderer.render(scene, camera);	

	//var delta = clock.getDelta();
	//controls.update(delta);
}

// Execute init function after resources have loaded.
if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}

}());
