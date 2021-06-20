/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
(function(){
var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	container = document.getElementById('container'), gear = document.getElementById("gear"), kontrols = document.getElementById("kontrols"), 
	//klose = document.getElementById("klose"), kamera = document.getElementById("kamera"), kamView = document.getElementById("view"), 
	klose = document.getElementById("klose"), polygons = document.getElementById("polygons"), multipolygons = document.getElementById("multipolygons"), 
	kategory = document.getElementById("kategory"), roads = document.getElementById("roads"), terrainM = document.getElementById("terrainM"), 
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, terrain, 
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, scale = 0.01;

// Constants
const 	floorposY = -1.5, 
		dataLength = HealthyDesignData.features.length,
		roadLength = roadData.features.length, 
		oneUnit = .2,	// width and length of a unit of bar
		oneUnitY = .02,	// height of a unit of bar
		spacing = 0.8;	// spacing of the 17 stacked bars of a point

var policeStationLoaded = schoolLoaded = headStartLoaded = clinicLoaded = publicHousingLoaded = publicRecLoaded = libraryLoaded = museumLoaded = hospitalLoaded = false;
		
/*var policeStations = [];
	schools = [];
	headStarts = [];
	clinics = [];
	publicHousings = [];
	publicRecs = [];
	libraries = [];
	museums = [];
	hospitals = [];
*/	
var policeStations = new THREE.Group(), 
	schools = new THREE.Group(), 
	headStarts = new THREE.Group(), 
	clinics = new THREE.Group(), 
	publicHousings = new THREE.Group(), 
	publicRecs = new THREE.Group(), 
	libraries = new THREE.Group(), 
	museums = new THREE.Group(),
	hospitals = new THREE.Group(), 
	roadsGroup = new THREE.Group(), 	
	polyGroup = new THREE.Group(), 
	multipolyGroup = new THREE.Group();	
		
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
kontrols.style.right = -320;
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;

// If browser does not support WebGL, display a message.
if (!Detector.webgl) Detector.addGetWebGLMessage();

// The usual initialization routine, which includes setting up renderer, scene, camera, controls, and lights.
function init() {
	//camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	//camera = new THREE.CombinedCamera(ww / 2, wh / 2, 40, 1, 1000, -500, 1000);
	camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, -500, 1000);
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
	//stackedBars();
	//ageMale();
	
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
	console.log(HealthyDesignData.features[0]);
	

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
			for ( var i = 0; i < dataLength; i++ ) {
				var material = new THREE.SpriteMaterial({color: 0x286891, map: icon1, fog: true, depthWrite: false, depthTest: false});
				var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);				
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Police Station")) {
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					//sprite.position.set((latlong.x-52.5), 0, latlong.z-101.5);
					//sprite.position.normalize();
					//sprite.position.multiplyScalar( 80 );
					//sprite.position.y = 2 * Math.random() + 4;
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//policeStations.push(sprite);
					policeStations.add(sprite);
					policeStationLoaded = true;
				}
				
				material = new THREE.SpriteMaterial({color: 0x020202, map: icon2, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "School")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 1, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//schools.push(sprite);
					schools.add(sprite);
					schoolLoaded = true;
				}	
				
				material = new THREE.SpriteMaterial({color: 0xc71414, map: icon3, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Head Start")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 2, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//headStarts.push(sprite);
					headStarts.add(sprite);
					headStartLoaded = true;
				}					
				
				material = new THREE.SpriteMaterial({color: 0x00ff00, map: icon4, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Clinic")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 3, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//clinics.push(sprite);
					clinics.add(sprite);
					clinicLoaded = true;
				}		

				material = new THREE.SpriteMaterial({color: 0x449933, map: icon5, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Public Housing")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 4, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//publicHousings.push(sprite);
					publicHousings.add(sprite);
					publicHousingLoaded = true;
				}						

				material = new THREE.SpriteMaterial({color: 0x444444, map: icon6, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Public Rec")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 5, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//publicRecs.push(sprite);
					publicRecs.add(sprite);
					publicRecLoaded = true;
				}		

				material = new THREE.SpriteMaterial({color: 0x676767, map: icon7, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Library")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 6, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//libraries.push(sprite);
					libraries.add(sprite);
					libraryLoaded = true;
				}		

				material = new THREE.SpriteMaterial({color: 0xc7b299, map: icon8, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Museum")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 7, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//museums.push(sprite);
					museums.add(sprite);
					museumLoaded = true;
				}						

				material = new THREE.SpriteMaterial({color: 0x0e5a74, map: texture, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Hospital")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 8, xyPos.z);
					sprite.scale.set(3, 3, 3);
					//scene.add(sprite);
					//hospitals.push(sprite);
					hospitals.add(sprite);
					hospitalLoaded = true;
				}				
				
				if (HealthyDesignData.features[i].geometry.type == 'Point') {
					//console.log(HealthyDesignData.features[i].properties.Type);
				}
				
			}
			
			// Add the house icons to the scene
			//for (i = 0; i < policeStations.length; i++) {
				scene.add(policeStations);
				scene.add(schools);
				scene.add(headStarts);
				scene.add(clinics);
				scene.add(publicHousings);
				scene.add(publicRecs);
				scene.add(libraries);
				scene.add(museums);
				scene.add(publicHousings);
				//publicHousings.scale.set(0.1, 0.1, 0.1);
			//}			
			
			//var i = 0.1;
			//do {
				//for (j = 0; j < publicHousings.length; j++) {
					//publicHousings[j].scale.set(i, i, i);
					//publicHousings.scale.set(i, i, i);
					//i += 0.01;
				//}
			//}
			//while (i < 3.0);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);
}	
	
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

/*
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
*/
/*
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
*/

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

	camera.left = ww / - 2;
	camera.right = ww / 2;
	camera.top = wh / 2;
	camera.bottom = wh / - 2;
	
	//camera.setSize(ww, wh);
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
	
//	controls.update();
	//stats.update();	
	render();
	//render( clock.getDelta() );
}

//function render(dt) {
function render() {
	//if (lookAtScene) camera.lookAt(scene.position);

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

}());
