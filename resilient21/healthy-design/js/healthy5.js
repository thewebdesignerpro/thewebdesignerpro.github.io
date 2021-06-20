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
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, scale = 0.01, raycaster, mouse = new THREE.Vector2(), INTERSECTED, textHeight = 0;

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
	
	//raycaster = new THREE.Raycaster();
	
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
			console.log(terrain.geometry);
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
			for ( var i = 0; i < dataLength; i++ ) {
				var material = new THREE.SpriteMaterial({color: 0x226699, map: icon1, fog: true, depthWrite: false, depthTest: false});
				var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);				
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Police Station")) {
					var sprite = new THREE.Sprite(material);
					//sprite.position.set(xyPos.x, (Math.random() * 9) + 1, xyPos.z);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					//sprite.position.set((latlong.x-52.5), 0, latlong.z-101.5);
					//sprite.position.normalize();
					//sprite.position.multiplyScalar( 80 );
					//sprite.position.y = 2 * Math.random() + 4;
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//policeStations.push(sprite);
					//console.log(sprite.geometry);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					policeStations.add(tTip);
					//tTip.rotation.z = -Math.PI/4;
					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					//console.log(textHeight);
					policeStations.add(sprite);
					policeStationLoaded = true;
				}
				
				material = new THREE.SpriteMaterial({color: 0x1a1a1a, map: icon2, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "School")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//schools.push(sprite);
					
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					schools.add(tTip);
					sprite.name = HealthyDesignData.features[i].properties.Name;
					schools.add(sprite);
					schoolLoaded = true;
				}	
				
				material = new THREE.SpriteMaterial({color: 0xc71414, map: icon3, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Head Start")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//headStarts.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					headStarts.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					headStarts.add(sprite);
					headStartLoaded = true;
				}					
				
				material = new THREE.SpriteMaterial({color: 0x00ff00, map: icon4, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Clinic")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//clinics.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					clinics.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					clinics.add(sprite);
					clinicLoaded = true;
				}		

				material = new THREE.SpriteMaterial({color: 0x119922, map: icon5, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Public Housing")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//publicHousings.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					publicHousings.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					publicHousings.add(sprite);
					publicHousingLoaded = true;
				}						

				material = new THREE.SpriteMaterial({color: 0x444444, map: icon6, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Public Rec")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//publicRecs.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					publicRecs.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					publicRecs.add(sprite);
					publicRecLoaded = true;
				}		

				material = new THREE.SpriteMaterial({color: 0x555555, map: icon7, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Library")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//libraries.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					libraries.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					libraries.add(sprite);
					libraryLoaded = true;
				}		

				material = new THREE.SpriteMaterial({color: 0xc7b299, map: icon8, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Museum")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//museums.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					museums.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					museums.add(sprite);
					museumLoaded = true;
				}						

				material = new THREE.SpriteMaterial({color: 0xaa2620, map: texture, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Hospital")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(parseFloat(xyPos.x), (Math.random() * 9) + 1, parseFloat(xyPos.z));
					sprite.scale.set(4, 4, 4);
					//scene.add(sprite);
					//hospitals.push(sprite);
					var tTip = toolTip(HealthyDesignData.features[i].properties.Name);
					tTip.position.set(xyPos.x + 5, sprite.position.y + (textHeight * .06), xyPos.z);
					hospitals.add(tTip);					
					sprite.name = HealthyDesignData.features[i].properties.Name;
					hospitals.add(sprite);
					hospitalLoaded = true;
				}				
				
				if (HealthyDesignData.features[i].geometry.type == 'Point') {
					//console.log(HealthyDesignData.features[i].properties.Type);
				}
				
			}
			
			// Add the house icons to the scene
			//for (var i = 0; i < policeStations.length; i++) {
				scene.add(policeStations);
				/*scene.add(schools);
				scene.add(headStarts);
				scene.add(clinics);
				scene.add(publicHousings);
				scene.add(publicRecs);
				scene.add(libraries);
				scene.add(museums);
				scene.add(hospitals);*/
				//publicHousings.scale.set(0.1, 0.1, 0.1);
			//}			
			
			//var i = 0.1;
			//do {
				//for (var j = 0; j < publicHousings.length; j++) {
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

function toolTip(message, opts) {
	var parameters = opts || {};
	var fontface = parameters.fontface || 'Helvetica';
	var fontsize = parameters.fontsize || 10;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = fontsize + "px " + fontface;

	// get size data (height depends only on font size)
	var metrics = context.measureText(message);
	//var textWidth = metrics.width;
	var textWidth = metrics.height;
	textHeight = metrics.width;

	// text color
	context.fillStyle = 'rgba(220, 220, 220, 1.0)';
	context.fillText(message, 0, fontsize);
	//context.fillText(message, 0, 10);

	var texture = new THREE.Texture(canvas)
	texture.minFilter = THREE.LinearFilter;
	texture.needsUpdate = true;

	//var spriteMaterial = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false});
	var spriteMaterial = new THREE.SpriteMaterial({map: texture, rotation: -Math.PI/2});
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(40, 20, 1.0);
	return sprite;
}

property1.addEventListener("click", function(e) {
	if (property1.className == "selected") {
		scene.remove(policeStations);
		property1.className = "";
	} else {
		scene.add(policeStations);
		property1.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property2.addEventListener("click", function(e) {
	if (property2.className == "selected") {
		scene.remove(schools);
		property2.className = "";
	} else {
		scene.add(schools);
		property2.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property3.addEventListener("click", function(e) {
	if (property3.className == "selected") {
		scene.remove(headStarts);
		property3.className = "";
	} else {
		scene.add(headStarts);
		property3.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property4.addEventListener("click", function(e) {
	if (property4.className == "selected") {
		scene.remove(clinics);
		property4.className = "";
	} else {
		scene.add(clinics);
		property4.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property5.addEventListener("click", function(e) {
	if (property5.className == "selected") {
		scene.remove(publicHousings);
		property5.className = "";
	} else {
		scene.add(publicHousings);
		property5.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property6.addEventListener("click", function(e) {
	if (property6.className == "selected") {
		scene.remove(publicRecs);
		property6.className = "";
	} else {
		scene.add(publicRecs);
		property6.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property7.addEventListener("click", function(e) {
	if (property7.className == "selected") {
		scene.remove(libraries);
		property7.className = "";
	} else {
		scene.add(libraries);
		property7.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property8.addEventListener("click", function(e) {
	if (property8.className == "selected") {
		scene.remove(museums);
		property8.className = "";
	} else {
		scene.add(museums);
		property8.className = "selected";
	}	
	
	e.preventDefault();
}, false);	

property9.addEventListener("click", function(e) {
	if (property9.className == "selected") {
		scene.remove(hospitals);
		property9.className = "";
	} else {
		scene.add(hospitals);
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

/*
function onDocumentMouseMove(e) {
	e.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
document.addEventListener('mousemove', onDocumentMouseMove, false);
			
function onDocumentMouseDown(e) {
	//e.preventDefault();
	
	// find intersections
	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(scene.children, true);
	//var intersects = raycaster.intersectObjects(policeStations.children, schools.children);
	//var intersects = raycaster.intersectObjects(schools.children);

	if (intersects.length > 0) {
		//console.log(INTERSECTED);	
		if (INTERSECTED != intersects[0].object) {
			if (INTERSECTED) tooltip.innerHTML = '';

			INTERSECTED = intersects[0].object;
			tooltip.innerHTML = INTERSECTED.name;
		}
	} else {
		if (INTERSECTED) tooltip.innerHTML = '';
		INTERSECTED = null;
	}
	//console.log('click');	
}
document.addEventListener('click', onDocumentMouseDown, false);
*/
			
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
