/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
(function(){
var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	container = document.getElementById('container'), gear = document.getElementById("gear"), kontrols = document.getElementById("kontrols"), 
	//klose = document.getElementById("klose"), kamera = document.getElementById("kamera"), kamView = document.getElementById("view"), klose = document.getElementById("klose"), kategory = document.getElementById("kategory"), 
	access1 = document.getElementById("access1"), access2 = document.getElementById("access2"), access3 = document.getElementById("access3"), 
	polygons = document.getElementById("polygons"), multipolygons = document.getElementById("multipolygons"), 
	roads = document.getElementById("roads"), terrainM = document.getElementById("terrainM"), 
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, terrain,  
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, scale = 0.01, walkingTexture, bikingTexture, drivingTexture, material;

// Constants
const 	floorposY = -1.5, 
		//dataLength = HealthyDesignData.features.length,
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
	
	//thePolygons();
	//theMultipolygons();
	
	//loadPoliceIcon();
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
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;		
	//renderer.sortObjects = false;
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
	
	/*var xy = LatLonToPixelXY(32.1401987968, -106.731830296);
	var geo = new THREE.BoxGeometry(1, 1, 600);
	var mat = new THREE.MeshBasicMaterial( {color: 0x00ff66} );
	var c = new THREE.Mesh( geo, mat );
	c.position.set(xy.x, 0, -xy.z);
	console.log(xy);
	c.rotation.x = Math.PI/2;
	scene.add( c );
	var xy = LatLonToPixelXY(31.4791386055, -106.072610608);
	var geo = new THREE.BoxGeometry(1, 1, 600);
	var mat = new THREE.MeshBasicMaterial( {color: 0xff0000} );
	var d = new THREE.Mesh( geo, mat );
	d.position.set(xy.x, 0, -xy.z);
	console.log(xy);
	d.rotation.x = Math.PI/2;
	scene.add( d );		*/
	
	
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
		'img/map/walking_disp.jpg',
		function (texture) {
			//texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			//texture.repeat.set(8, 8);
			walkingTexture = texture;
			loadTexture2();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function loadTexture2() {
	loader.load(
		'img/map/biking_disp.jpg',
		function (texture) {
			bikingTexture = texture;
			terrainMesh();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

function terrainMesh() {
	loader.load(
		'img/map/driving_disp.jpg',
		function (texture) {
			drivingTexture = texture;
			var geometry = new THREE.PlaneBufferGeometry(294, 346, 96, 96);
			//var material = new THREE.MeshPhongMaterial({color: 0x4c4640, shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 0.6});
			//var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 1.0});
			//var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 20.0, transparent: true, opacity: 1.0});
			material = new THREE.MeshPhongMaterial({color: 0x99ff00, shininess: 3, map: texture, displacementMap: texture, displacementScale: 20.0, transparent: true, opacity: 1.0});
			terrain = new THREE.Mesh(geometry, material);
			terrain.rotation.set(-Math.PI/2, 0, 0);
			terrain.position.y = floorposY;
			//terrain.castShadow = true;
			//terrain.receiveShadow = true;
			//terrain.material.wireframe = true;
			scene.add(terrain);
			
			animate();
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
			
			geometry.vertices.push(new THREE.Vector3(xyPos.x, 12, -xyPos.z));
		}
		var road = new THREE.Line(geometry, material);
		roadsGroup.add(road);		
	}
	
	//scene.add(roadsGroup);
}

/*
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
*/

function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function LatLonToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0,
		lat = latitude * pi_180;
		lon = longitude * pi_180;
	
	var magnitude = 10000; // Spread the points apart from each other
	//var pixelX = Math.cos(lat) * Math.cos(lon) * magnitude + 11950;
	//var pixelZ = Math.cos(lat) * Math.sin(lon) * magnitude + 40770;
	var pixelX = (460/180.0) * (90 + lon) * magnitude - 2252541.568;
	var pixelZ = (460/180.0) * (90 - lat) * magnitude * 1.17 - 2674400.015;	
    var pixel = {x: pixelX, z: -pixelZ};

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
	
function removeSel() {
	access1.className = "";
	access2.className = "";
	access3.className = "";
}

access1.addEventListener("click", function(e) {
	removeSel();
	
	if (access1.className != "selected") {
		access1.className = "selected";
	
		//scene.remove(terrain);
		
		material.map = walkingTexture;
		material.displacementMap = walkingTexture;
		//material.displacementMap.needsUpdate = true;
		material.needsUpdate = true;
		
		/*terrain.geometry.computeVertexNormals();
		terrain.geometry.computeFaceNormals();
		terrain.geometry.verticesNeedUpdate = true;
		terrain.geometry.normalsNeedUpdate = true;*/
		
		//scene.add(terrain);
	}	
	
	e.preventDefault();
}, false);	

access2.addEventListener("click", function(e) {
	removeSel();

	if (access2.className != "selected") {
		access2.className = "selected";
		
		material.map = bikingTexture;
		material.displacementMap = bikingTexture;
		material.needsUpdate = true;
	}		
	
	e.preventDefault();
}, false);	

access3.addEventListener("click", function(e) {
	removeSel();

	if (access3.className != "selected") {
		access3.className = "selected";
		
		material.map = drivingTexture;
		material.displacementMap = drivingTexture;
		material.needsUpdate = true;
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
