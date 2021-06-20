/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     
For	Resilient Solutions 21
	http://www.resilientsolutions21.com/   
*/

(function(){

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true, renderer, camera, scene, spotL, controls, stats, 
	kon = kos = false, mergedMesh, terrain, raycaster, mouse = new THREE.Vector2(), INTERSECTED = null, threshold = 0.1;

// Shortcuts for the ID's	
var	container = document.getElementById('container'), roads = document.getElementById("roads"), terrainM = document.getElementById("terrainM"), 
	categ1 = document.getElementById("categ1"), categ3 = document.getElementById("categ3"), categ4 = document.getElementById("categ4"), categ7 = document.getElementById("categ7"), 
	categ9 = document.getElementById("categ9"), categ10 = document.getElementById("categ10"), categ11 = document.getElementById("categ11"), categ12 = document.getElementById("categ12"), 
	categ15 = document.getElementById("categ15"), categ16 = document.getElementById("categ16"), categ17 = document.getElementById("categ17"), 
	subcateg1 = document.getElementById("subcateg1"), subcateg3 = document.getElementById("subcateg3"), subcateg4 = document.getElementById("subcateg4"), 
	subcateg7 = document.getElementById("subcateg7"), subcateg9 = document.getElementById("subcateg9"), subcateg10 = document.getElementById("subcateg10"), 
	subcateg11 = document.getElementById("subcateg11"), subcateg12 = document.getElementById("subcateg12"), subcateg15 = document.getElementById("subcateg15"), 
	subcateg16 = document.getElementById("subcateg16"), subcateg17 = document.getElementById("subcateg17"), 
	count1 = document.getElementById("count1"), count2 = document.getElementById("count2"), count3 = document.getElementById("count3"), count4 = document.getElementById("count4"), 
	count5 = document.getElementById("count5"), count6 = document.getElementById("count6"), count7 = document.getElementById("count7"), count8 = document.getElementById("count8"), 
	count9 = document.getElementById("count9"), count10 = document.getElementById("count10"), count11 = document.getElementById("count11"), count12 = document.getElementById("count12"), 
	count13 = document.getElementById("count13"), count14 = document.getElementById("count14"), count15 = document.getElementById("count15"), count16 = document.getElementById("count16"), 
	count17 = document.getElementById("count17"), count18 = document.getElementById("count18"), count19 = document.getElementById("count19"), count20 = document.getElementById("count20"), 
	count21 = document.getElementById("count21"), count22 = document.getElementById("count22"), count23 = document.getElementById("count23"), count47 = document.getElementById("count47"), 
	count48 = document.getElementById("count48"), count49 = document.getElementById("count49"), count50 = document.getElementById("count50"), count51 = document.getElementById("count51"), 
	count52 = document.getElementById("count52"), count53 = document.getElementById("count53"), count54 = document.getElementById("count54"), count55 = document.getElementById("count55"), 
	count56 = document.getElementById("count56"), count57 = document.getElementById("count57"), count58 = document.getElementById("count58"), count59 = document.getElementById("count59"), 
	count60 = document.getElementById("count60"), count61 = document.getElementById("count61"), count62 = document.getElementById("count62"), count63 = document.getElementById("count63"), 
	count64 = document.getElementById("count64"), count65 = document.getElementById("count65"), count66 = document.getElementById("count66"), count67 = document.getElementById("count67"), 
	count68 = document.getElementById("count68"), count69 = document.getElementById("count69"), count70 = document.getElementById("count70"), count71 = document.getElementById("count71"), 
	count90 = document.getElementById("count90"), count91 = document.getElementById("count91"), count92 = document.getElementById("count92"), count93 = document.getElementById("count93"), 
	count94 = document.getElementById("count94"), count95 = document.getElementById("count95"), count96 = document.getElementById("count96"), count97 = document.getElementById("count97"), 
	count98 = document.getElementById("count98"), count99 = document.getElementById("count99"), count100 = document.getElementById("count100"), count101 = document.getElementById("count101"), 
	count102 = document.getElementById("count102"), count103 = document.getElementById("count103"), count104 = document.getElementById("count104"), count105 = document.getElementById("count105"), 
	count106 = document.getElementById("count106"), count107 = document.getElementById("count107"), count108 = document.getElementById("count108"), count109 = document.getElementById("count109"), 
	count110 = document.getElementById("count110"), count111 = document.getElementById("count111"), count112 = document.getElementById("count112"), count113 = document.getElementById("count113"), 
	count114 = document.getElementById("count114"), count115 = document.getElementById("count115"), count116 = document.getElementById("count116"), count117 = document.getElementById("count117"), 
	count118 = document.getElementById("count118"), count119 = document.getElementById("count119"), count120 = document.getElementById("count120"), count121 = document.getElementById("count121"), 
	count122 = document.getElementById("count122"), count123 = document.getElementById("count123"), count124 = document.getElementById("count124"), count125 = document.getElementById("count125"), 
	count126 = document.getElementById("count126"), count127 = document.getElementById("count127"), count128 = document.getElementById("count128"), count129 = document.getElementById("count129"), 
	count130 = document.getElementById("count130"), count131 = document.getElementById("count131"), count132 = document.getElementById("count132"), count133 = document.getElementById("count133"), 
	count134 = document.getElementById("count134"), count135 = document.getElementById("count135"), count136 = document.getElementById("count136"), count147 = document.getElementById("count147"), 
	count148 = document.getElementById("count148"), count149 = document.getElementById("count149"), count150 = document.getElementById("count150"), count151 = document.getElementById("count151"), 
	count152 = document.getElementById("count152"), count153 = document.getElementById("count153"), count154 = document.getElementById("count154"), count155 = document.getElementById("count155"), 
	count156 = document.getElementById("count156"), count157 = document.getElementById("count157"), count158 = document.getElementById("count158"), count159 = document.getElementById("count159"), 
	count160 = document.getElementById("count160"), count161 = document.getElementById("count161"), count162 = document.getElementById("count162"), count163 = document.getElementById("count163"), 
	count164 = document.getElementById("count164"), count165 = document.getElementById("count165"), count166 = document.getElementById("count166"), count167 = document.getElementById("count167"), 
	count168 = document.getElementById("count168"), count169 = document.getElementById("count169"), count170 = document.getElementById("count170"), count171 = document.getElementById("count171"), 
	count172 = document.getElementById("count172"), count173 = document.getElementById("count173"), count174 = document.getElementById("count174"), count175 = document.getElementById("count175"), 
	count176 = document.getElementById("count176");
	
// Counters for the demographic values	
var cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = cnt10 = cnt11 = cnt12 = cnt13 = cnt14 = cnt15 = cnt16 = cnt17 = cnt18 = cnt19 = cnt20 = cnt21 = cnt22 = cnt23 = cnt24 = 0;
	
// Constants
const 	floorposY = -1.5, 
		dataLength = ElPasoData.features.length,
		roadLength = roadData.features.length, 
		oneUnit = .26,	// width and length of a unit of bar
		oneUnitY = .02,	// height of a unit of bar
		spacing = 0.8;	// spacing of the 17 stacked bars of a point

var ageLoaded = incomeLoaded = rentalLoaded = insuranceLoaded = commutingMethodLoaded = commutingTimeLoaded = foodStampsDisabilityLoaded = languageLoaded = educationLoaded = 
	familyStructureLoaded = raceLoaded = false;
		
var loader = new THREE.TextureLoader();		
var clock = new THREE.Clock();

var categories = [], categoryMesh = [];
var roadsGroup = new THREE.Group();	
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
var	ageColor 					= [0xfeff32, 0xfeff1c, 0xfeff05, 0xedee00, 0xd7d700, 0xc0c000, 0xa9aa00, 0x939300, 0x7c7c00, 0x656600],
//	ageFemaleColor 				= [0xfffd32, 0xfffd1c, 0xfffd05, 0xeeec00, 0xd7d500, 0xc0bf00, 0xaaa800, 0x939200, 0x7c7b00, 0x666500], 
	incomeColor 				= [0xfef630, 0xfef514, 0xf5ec00, 0xd9d100, 0xbdb600, 0xa09b00, 0x847f00, 0x686400], 
	rentalColor 				= [0xfcee34, 0xfcec1b, 0xfbe902, 0xe2d202, 0xc9bb02, 0xb0a402, 0x978c01, 0x7e7501, 0x665e01], 
//	insuranceYoungColor 		= [0xfadd1d, 0xc7ae04, 0x7d6d02], 
//	insuranceYoungAdultColor 	= [0xf7cb1f, 0xc59e06, 0x7c6304], 
	insuranceColor 				= [0xf5b722, 0xc38c08, 0x7a5805], 	
//	insuranceElderColor 		= [0xf2a125, 0xc0780b, 0x794c07], 
	commutingMethodColor 		= [0xf1963f, 0xef8928, 0xed7d11, 0xd5700f, 0xbe640d, 0xa6570c, 0x8f4b0a, 0x773f08, 0x603206], 
	commutingTimeColor 			= [0xed813f, 0xea6d21, 0xd85d13, 0xbb5010, 0x9d440e, 0x7f370b, 0x612a08], 
	foodStampsDisabilityColor 	= [0xe96437, 0xd24516, 0x9e3410, 0x6b230b], 
	languageColor	 			= [0xe7553e, 0xde341a, 0xb62b15, 0x8d2111, 0x65170c], 	
//	languageAdultColor 			= [0xe54341, 0xdb201d, 0xb31a18, 0x8b1412, 0x630e0d], 	
//	languageElderColor 			= [0xec3a48, 0xe31525, 0xba111e, 0x910d18, 0x670911], 
	educationColor 				= [0xf63a53, 0xf5223e, 0xf30b29, 0xdb0925, 0xc30821, 0xab071d, 0x920619, 0x7a0515, 0x620410], 
	familyStructureColor 		= [0xfd2349, 0xe60229, 0xae011f, 0x750115], 
	raceColor 					= [0xff0532, 0x93001a];
	
// These will be the merged geometries to improve rendering speed	
for (var i = 0; i < 17; i++) {
	categories[i] = new THREE.Geometry();
}
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;

//SimpleScrollbar.initAll();
SimpleScrollbar.initEl(document.querySelector("#kontrols"));

subcateg1.className = "";

// If browser does not support WebGL, display a message.
if (!Detector.webgl) Detector.addGetWebGLMessage();

// The usual initialization routine, which includes setting up renderer, scene, camera, controls, and lights.
function init() {
	camera = new THREE.OrthographicCamera(wwh / -2, wwh / 2, whh / 2, whh / -2, -500, 1000);
	camera.position.set(0, 0.5, 1);
	
	scene = new THREE.Scene();
	
	var aLight = new THREE.AmbientLight(0x333333);
	//scene.add(aLight);
	
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
	
	loadTexture();

	theRoads();
	
	age();
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	//controls.enableZoom = false;
	controls.minDistance = 2;
	controls.maxDistance = 1000;	
	controls.target.set(-3, 0, 1);

	animate();
}	

// Convert Latitude & Longitude to x & z coordinates
function LatLonToPixelXY(latitude, longitude) {
    var pi_180 = Math.PI / 180.0,
		lat = latitude * pi_180;
		lon = longitude * pi_180;
	
	var magnitude = 6000; // Spread the points apart from each other
	var pixelX = (460/180.0) * (90 + lon) * magnitude - 1351498.77336492;
	var pixelZ = (460/180.0) * (90 - lat) * magnitude * 1.17 - 1604736.96986;
    var pixel = {x: pixelX, z: -pixelZ};

    return pixel;
}

function loadTexture() {
	loader.load('img/texture/d.jpg', 
		function (texture) { terrainMesh(texture); },
		function ( xhr ) {	console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function ( xhr ) {	console.log('Error loading texture'); }
	);	
}

function terrainMesh(tex) {
	loader.load('img/map/elpaso_disp_2.jpg',
		function (texture) {
			var geometry = new THREE.PlaneBufferGeometry(267.5, 312.975, 96, 96);
			var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 14.0, transparent: false, opacity: 0.4});
			terrain = new THREE.Mesh(geometry, material);
			terrain.rotation.set(-Math.PI/2, 0, 0);
			terrain.position.y = floorposY;
			terrain.material.wireframe = true;
			scene.add(terrain);
		},
		function ( xhr ) {	console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function ( xhr ) {	console.log('Error loading texture'); }
	);	
}

// Draw the road lines
function theRoads() {
	var material = new THREE.LineBasicMaterial({color: 0x339993});
	
	for (var i = 0; i < roadLength; i++) {
		var geometry = new THREE.Geometry();			
		
		for (var j = 0; j < roadData.features[i].geometry.coordinates.length; j++) {
			var xyPos = LatLonToPixelXY(roadData.features[i].geometry.coordinates[j][1], roadData.features[i].geometry.coordinates[j][0]);	
			
			geometry.vertices.push(new THREE.Vector3(xyPos.x, 1, -xyPos.z));
		}
		var road = new THREE.Line(geometry, material);
		roadsGroup.add(road);			
	}
	
	scene.add(roadsGroup);
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

function ageBars(index, posX, posZ) {
	var properties = ElPasoData.features[index].properties,
		barHeight = prevOffsetY = 0;
	
	if (properties.Age_M0t4 > 0) {
		barHeight = oneUnitY * properties.Age_M0t4;
		prevOffsetY += barHeight;	// Y offset for the next bar's position
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_M0t4;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[0]));
		
		categories[0].merge(geometry, matrix);		// merge to it's category mesh
		
		cnt1 += properties.Age_M0t4;
	}
	
	if (properties.Age_F0t4 > 0) {
		barHeight = oneUnitY * properties.Age_F0t4;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F0t4;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[0]));
		
		categories[0].merge(geometry, matrix);		

		cnt1 += properties.Age_F0t4;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[0]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt2 += properties.Age_M5t9;
	}		
	
	if (properties.Age_F5t9 > 0) {
		barHeight = oneUnitY * properties.Age_F5t9;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F5t9;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[0]));
		
		categories[0].merge(geometry, matrix);		

		cnt2 += properties.Age_F5t9;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[1]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt3 += properties.Age_M10t14;
	}		
	
	if (properties.Age_F10t14 > 0) {
		barHeight = oneUnitY * properties.Age_F10t14;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F10t14;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[1]));
		
		categories[0].merge(geometry, matrix);		

		cnt3 += properties.Age_F10t14;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[1]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt4 += properties.Age_M15t17;
	}		
	
	if (properties.Age_F15t17 > 0) {
		barHeight = oneUnitY * properties.Age_F15t17;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F15t17;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[1]));
		
		categories[0].merge(geometry, matrix);		

		cnt4 += properties.Age_F15t17;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt5 += properties.Age_M18t19;
	}		
	
	if (properties.Age_F18t19 > 0) {
		barHeight = oneUnitY * properties.Age_F18t19;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F18t19;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		

		cnt5 += properties.Age_F18t19;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt6 += properties.Age_M20;
	}		
	
	if (properties.Age_F20 > 0) {
		barHeight = oneUnitY * properties.Age_F20;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F20;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		

		cnt6 += properties.Age_F20;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt7 += properties.Age_M21;
	}		
	
	if (properties.Age_F21 > 0) {
		barHeight = oneUnitY * properties.Age_F21;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F21;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		

		cnt7 += properties.Age_F21;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt8 += properties.Age_M22t24;
	}		
	
	if (properties.Age_F22t24 > 0) {
		barHeight = oneUnitY * properties.Age_F22t24;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F22t24;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[2]));
		
		categories[0].merge(geometry, matrix);		

		cnt8 += properties.Age_F22t24;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[3]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt9 += properties.Age_M25t29;
	}		
	
	if (properties.Age_F25t29 > 0) {
		barHeight = oneUnitY * properties.Age_F25t29;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F25t29;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[3]));
		
		categories[0].merge(geometry, matrix);		

		cnt9 += properties.Age_F25t29;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[3]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt10 += properties.Age_M30t34;
	}		
	
	if (properties.Age_F30t34 > 0) {
		barHeight = oneUnitY * properties.Age_F30t34;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F30t34;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[3]));
		
		categories[0].merge(geometry, matrix);		

		cnt10 += properties.Age_F30t34;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[4]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt11 += properties.Age_M35t39;
	}		
	
	if (properties.Age_F35t39 > 0) {
		barHeight = oneUnitY * properties.Age_F35t39;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F35t39;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[4]));
		
		categories[0].merge(geometry, matrix);		

		cnt11 += properties.Age_F35t39;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[4]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt12 += properties.Age_M40t44;
	}	
	
	if (properties.Age_F40t44 > 0) {
		barHeight = oneUnitY * properties.Age_F40t44;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F40t44;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[4]));
		
		categories[0].merge(geometry, matrix);		

		cnt12 += properties.Age_F40t44;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[5]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt13 += properties.Age_M45t49;
	}		
	
	if (properties.Age_F45t49 > 0) {
		barHeight = oneUnitY * properties.Age_F45t49;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F45t49;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[5]));
		
		categories[0].merge(geometry, matrix);		

		cnt13 += properties.Age_F45t49;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[5]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt14 += properties.Age_M50t54;
	}		
	
	if (properties.Age_F50t54 > 0) {
		barHeight = oneUnitY * properties.Age_F50t54;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F50t54;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[5]));
		
		categories[0].merge(geometry, matrix);		

		cnt14 += properties.Age_F50t54;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[6]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt15 += properties.Age_M55t59;
	}		
	
	if (properties.Age_F55t59 > 0) {
		barHeight = oneUnitY * properties.Age_F55t59;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F55t59;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[6]));
		
		categories[0].merge(geometry, matrix);		

		cnt15 += properties.Age_F55t59;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[6]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt16 += properties.Age_M60t61;
	}		
	
	if (properties.Age_F60t61 > 0) {
		barHeight = oneUnitY * properties.Age_F60t61;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F60t61;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[6]));
		
		categories[0].merge(geometry, matrix);		

		cnt16 += properties.Age_F60t61;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[6]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt17 += properties.Age_M62t64;
	}		
	
	if (properties.Age_F62t64 > 0) {
		barHeight = oneUnitY * properties.Age_F62t64;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F62t64;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[6]));
		
		categories[0].merge(geometry, matrix);		

		cnt17 += properties.Age_F62t64;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[7]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt18 += properties.Age_M65t66;
	}		
	
	if (properties.Age_F65t66 > 0) {
		barHeight = oneUnitY * properties.Age_F65t66;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F65t66;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[7]));
		
		categories[0].merge(geometry, matrix);		

		cnt18 += properties.Age_F65t66;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[7]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt19 += properties.Age_M67t69;
	}		
	
	if (properties.Age_F67t69 > 0) {
		barHeight = oneUnitY * properties.Age_F67t69;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F67t69;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[7]));
		
		categories[0].merge(geometry, matrix);		

		cnt19 += properties.Age_F67t69;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[7]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt20 += properties.Age_M70t74;
	}		
	
	if (properties.Age_F70t74 > 0) {
		barHeight = oneUnitY * properties.Age_F70t74;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F70t74;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[7]));
		
		categories[0].merge(geometry, matrix);		

		cnt20 += properties.Age_F70t74;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[8]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt21 += properties.Age_M75t79;
	}		
	
	if (properties.Age_F75t79 > 0) {
		barHeight = oneUnitY * properties.Age_F75t79;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F75t79;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[8]));
		
		categories[0].merge(geometry, matrix);		

		cnt21 += properties.Age_F75t79;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[8]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt22 += properties.Age_M80t84;
	}		
	
	if (properties.Age_F80t84 > 0) {
		barHeight = oneUnitY * properties.Age_F80t84;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F80t84;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[8]));
		
		categories[0].merge(geometry, matrix);		

		cnt22 += properties.Age_F80t84;
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
		
		applyVertexColors(geometry, color.setHex(ageColor[9]));
		
		categories[0].merge(geometry, matrix);		
		
		cnt23 += properties.Age_M85;
	}

	if (properties.Age_F85 > 0) {
		barHeight = oneUnitY * properties.Age_F85;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Age_F85;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(ageColor[9]));
		
		categories[0].merge(geometry, matrix);		

		cnt23 += properties.Age_F85;
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
		
		
		cnt1 += properties.Inc_0t10;
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
		
		
		cnt2 += properties.Inc_10t15;
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
		
		
		cnt3 += properties.Inc_15t20;
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
		
		
		cnt4 += properties.Inc_20t25;
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
		
		
		cnt5 += properties.Inc_25t30;
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
		
		
		cnt6 += properties.Inc_30t35;
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
		
		
		cnt7 += properties.Inc_35t40;
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
		
		
		cnt8 += properties.Inc_40t45;
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
		
		
		cnt9 += properties.Inc_45t50;
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
		
		
		cnt10 += properties.Inc_50t60;
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
		
		
		cnt11 += properties.Inc_60t75;
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
		
		
		cnt12 += properties.Inc_75t100;
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
		
		
		cnt13 += properties.Inc_100t125;
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
		
		
		cnt14 += properties.Inc_125t150;
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
		
		
		cnt15 += properties.Inc_150t200;
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
		
		
		cnt16 += properties.Inc_200;
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
		
		
		cnt1 += properties.Ren_10perc;
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
		
		
		cnt2 += properties.Ren_15perc;
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
		
		
		cnt3 += properties.Ren_20perc;
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
		
		
		cnt4 += properties.Ren_25perc;
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
		
		
		cnt5 += properties.Ren_30perc;
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
		
		
		cnt6 += properties.Ren_35perc;
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
		
		
		cnt7 += properties.Ren_40perc;
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
		
		
		cnt8 += properties.Ren_50perc;
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
		
		
		cnt9 += properties.Ren_55perc;
	}	
}

function insuranceBars(index, posX, posZ) {
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt1 += properties.Ins_Adult_Direct;
	}
	
	if (properties.Ins_Youth_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt1 += properties.Ins_Youth_Direct;
	}

	if (properties.Ins_YAdult_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt1 += properties.Ins_YAdult_Direct;
	}

	if (properties.Ins_Elder_Direct > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Direct;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Direct;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt1 += properties.Ins_Elder_Direct;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt2 += properties.Ins_Adult_Employer;
	}	
	
	if (properties.Ins_Youth_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt2 += properties.Ins_Youth_Employer;
	}

	if (properties.Ins_YAdult_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt2 += properties.Ins_YAdult_Employer;
	}

	if (properties.Ins_Elder_Employer > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Employer;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Employer;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[0]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt2 += properties.Ins_Elder_Employer;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt3 += properties.Ins_Adult_MultWMedicaid;
	}	
	
	if (properties.Ins_Youth_MultWMedicaid > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_MultWMedicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_MultWMedicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt3 += properties.Ins_Youth_MultWMedicaid;
	}

	if (properties.Ins_YAdult_MultWMedicaid > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_MultWMedicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_MultWMedicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt3 += properties.Ins_YAdult_MultWMedicaid;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt4 += properties.Ins_Adult_MultWMedicare;
	}	
	
	if (properties.Ins_Youth_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt4 += properties.Ins_Youth_MultWMedicare;
	}

	if (properties.Ins_YAdult_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt4 += properties.Ins_YAdult_MultWMedicare;
	}

	if (properties.Ins_Elder_MultWMedicare > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_MultWMedicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_MultWMedicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt4 += properties.Ins_Elder_MultWMedicare;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt5 += properties.Ins_Adult_MultWMedicareB;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt6 += properties.Ins_Adult_VA;
	}	
	
	if (properties.Ins_Youth_VA > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt6 += properties.Ins_Youth_VA;
	}

	if (properties.Ins_YAdult_VA > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt6 += properties.Ins_YAdult_VA;
	}

	if (properties.Ins_Elder_VA > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_VA;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_VA;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt6 += properties.Ins_Elder_VA;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt7 += properties.Ins_Adult_Mil;
	}	
	
	if (properties.Ins_Youth_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt7 += properties.Ins_Youth_Mil;
	}

	if (properties.Ins_YAdult_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt7 += properties.Ins_YAdult_Mil;
	}

	if (properties.Ins_Elder_Mil > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Mil;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Mil;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt7 += properties.Ins_Elder_Mil;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt8 += properties.Ins_Adult_Medicaid;
	}	
	
	if (properties.Ins_Youth_Medicaid > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Medicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Medicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt8 += properties.Ins_Youth_Medicaid;
	}

	if (properties.Ins_YAdult_Medicaid > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Medicaid;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Medicaid;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt8 += properties.Ins_YAdult_Medicaid;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt9 += properties.Ins_Adult_Medicare;
	}	
	
	if (properties.Ins_Youth_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt9 += properties.Ins_Youth_Medicare;
	}

	if (properties.Ins_YAdult_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt9 += properties.Ins_YAdult_Medicare;
	}

	if (properties.Ins_Elder_Medicare > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_Medicare;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_Medicare;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[1]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt9 += properties.Ins_Elder_Medicare;
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
		
		applyVertexColors(geometry, color.setHex(insuranceColor[2]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt10 += properties.Ins_Adult_None;
	}

	if (properties.Ins_Youth_None > 0) {
		barHeight = oneUnitY * properties.Ins_Youth_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Youth_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[2]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt10 += properties.Ins_Youth_None;
	}	
	
	if (properties.Ins_YAdult_None > 0) {
		barHeight = oneUnitY * properties.Ins_YAdult_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_YAdult_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[2]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt10 += properties.Ins_YAdult_None;
	}	
	
	if (properties.Ins_Elder_None > 0) {
		barHeight = oneUnitY * properties.Ins_Elder_None;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX + spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ + spacing;		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Ins_Elder_None;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(insuranceColor[2]));
		
		categories[6].merge(geometry, matrix);		
		
		cnt10 += properties.Ins_Elder_None;
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
		
		
		cnt1 += properties.Com_None;
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
		
		
		cnt2 += properties.Com_Other;
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
		
		
		cnt3 += properties.Com_Walk;
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
		
		
		cnt4 += properties.Com_Bike;
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
		
		
		cnt5 += properties.Com_Motorcycle;
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
		
		
		cnt6 += properties.Com_Taxi;
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
		
		
		cnt7 += properties.Com_Public;
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
		
		
		cnt8 += properties.Com_Carpool;
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
		
		
		cnt9 += properties.Com_Car;
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
		
		
		cnt1 += properties.ComT_0t5;
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
		
		
		cnt2 += properties.ComT_5t10;
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
		
		
		cnt3 += properties.ComT_10t15;
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
		
		
		cnt4 += properties.ComT_15t20;
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
		
		
		cnt5 += properties.ComT_20t25;
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
		
		
		cnt6 += properties.ComT_25t30;
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
		
		
		cnt7 += properties.ComT_30t35;
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
		
		
		cnt8 += properties.ComT_35t40;
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
		
		
		cnt9 += properties.ComT_40t45;
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
		
		
		cnt10 += properties.ComT_45t60;
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
		
		
		cnt11 += properties.ComT_60t90;
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
		
		
		cnt12 += properties.ComT_90;
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
		
		
		cnt1 += properties.Fst_DnrNDis;
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
		
		
		cnt2 += properties.Fst_DnrDis;
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
		
		
		cnt3 += properties.Fst_RecNDis;
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
		
		
		cnt4 += properties.Fst_RecWDis;
	}
}

function languageBars(index, posX, posZ) {
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
		
		applyVertexColors(geometry, color.setHex(languageColor[0]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt1 += properties.Lan_Youth_Eng;
	}	
	
	if (properties.Lan_Adult_Eng > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_Eng;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_Eng;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[0]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt1 += properties.Lan_Adult_Eng;
	}

	if (properties.Lan_Elder_Eng > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_Eng;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_Eng;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[0]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt1 += properties.Lan_Elder_Eng;
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
		
		applyVertexColors(geometry, color.setHex(languageColor[1]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt2 += properties.Lan_Youth_VW;
	}	
	
	if (properties.Lan_Adult_VW > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_VW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_VW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[1]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt2 += properties.Lan_Adult_VW;
	}

	if (properties.Lan_Elder_VW > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_VW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_VW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[1]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt2 += properties.Lan_Elder_VW;
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
		
		applyVertexColors(geometry, color.setHex(languageColor[2]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt3 += properties.Lan_Youth_W;
	}	
	
	if (properties.Lan_Adult_W > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_W;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_W;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[2]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt3 += properties.Lan_Adult_W;
	}

	if (properties.Lan_Elder_W > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_W;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_W;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[2]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt3 += properties.Lan_Elder_W;
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
		
		applyVertexColors(geometry, color.setHex(languageColor[3]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt4 += properties.Lan_Youth_NW;
	}	
	
	if (properties.Lan_Adult_NW > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_NW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_NW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[3]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt4 += properties.Lan_Adult_NW;
	}

	if (properties.Lan_Elder_NW > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_NW;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_NW;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[3]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt4 += properties.Lan_Elder_NW;
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
		
		applyVertexColors(geometry, color.setHex(languageColor[4]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt5 += properties.Lan_Youth_N;
	}
	
	if (properties.Lan_Adult_N > 0) {
		barHeight = oneUnitY * properties.Lan_Adult_N;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Adult_N;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[4]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt5 += properties.Lan_Adult_N;
	}
	
	if (properties.Lan_Elder_N > 0) {
		barHeight = oneUnitY * properties.Lan_Elder_N;
		prevOffsetY += barHeight;	
		
		var position = new THREE.Vector3();
		position.x = posX - spacing;
		position.y = prevOffsetY - (barHeight / 2);
		position.z = -posZ - (spacing * 2);		
		
		var scale = new THREE.Vector3();
		scale.x = 1;
		scale.y = properties.Lan_Elder_N;
		scale.z = 1;

		matrix.compose(position, quaternion, scale);
		
		applyVertexColors(geometry, color.setHex(languageColor[4]));
		
		categories[11].merge(geometry, matrix);		
		
		cnt5 += properties.Lan_Elder_N;
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
		
		
		cnt1 += properties.Edu_none;
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
		
		
		cnt2 += properties.Edu_Nursery;
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
		
		
		cnt3 += properties.Edu_Kinder;
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
		
		
		cnt4 += properties.Edu_1;
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
		
		
		cnt5 += properties.Edu_2;
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
		
		
		cnt6 += properties.Edu_3;
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
		
		
		cnt7 += properties.Edu_4;
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
		
		
		cnt8 += properties.Edu_5;
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
		
		
		cnt9 += properties.Edu_6;
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
		
		
		cnt10 += properties.Edu_7;
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
		
		
		cnt11 += properties.Edu_8;
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
		
		
		cnt12 += properties.Edu_9;
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
		
		
		cnt13 += properties.Edu_10;
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
		
		
		cnt14 += properties.Edu_11;
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
		
		
		cnt15 += properties.Edu_12;
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
		
		
		cnt16 += properties.Edu_HSDiploma;
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
		
		
		cnt17 += properties.Edu_GED;
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
		
		
		cnt18 += properties.Edu_Col1;
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
		
		
		cnt19 += properties.Edu_ColMult;
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
		
		
		cnt20 += properties.Edu_Assoc;
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
		
		
		cnt21 += properties.Edu_Batch;
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
		
		
		cnt22 += properties.Edu_Master;
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
		
		
		cnt23 += properties.Edu_Pro;
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
		
		
		cnt24 += properties.Edu_Doc;
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
		
		
		cnt1 += properties.Fam_FamMarried;
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
		
		
		cnt2 += properties.Fam_FamOther;
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
		
		
		cnt3 += properties.Fam_NFamSingle;
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
		
		
		cnt4 += properties.Fam_NFamMulti;
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
		
		
		cnt1 += properties.Rac_Hisp;
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
		
		cnt2 += properties.Rac_NotHisp;
	}	
}

// Create the stacked bar charts for Age category
function age() {
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		ageBars(i, xyPos.x, xyPos.z);
	}

	categoryMesh[0] = new THREE.Mesh(categories[0], material);
	scene.add(categoryMesh[0]);

	ageLoaded = true;
	
	count1.innerHTML = cnt1;
	count2.innerHTML = cnt2;
	count3.innerHTML = cnt3;
	count4.innerHTML = cnt4;
	count5.innerHTML = cnt5;
	count6.innerHTML = cnt6;
	count7.innerHTML = cnt7;
	count8.innerHTML = cnt8;
	count9.innerHTML = cnt9;
	count10.innerHTML = cnt10;
	count11.innerHTML = cnt11;
	count12.innerHTML = cnt12;
	count13.innerHTML = cnt13;
	count14.innerHTML = cnt14;
	count15.innerHTML = cnt15;
	count16.innerHTML = cnt16;
	count17.innerHTML = cnt17;
	count18.innerHTML = cnt18;
	count19.innerHTML = cnt19;
	count20.innerHTML = cnt20;
	count21.innerHTML = cnt21;
	count22.innerHTML = cnt22;
	count23.innerHTML = cnt23;
}

// Create the stacked bar charts for Income category
function income() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = cnt10 = cnt11 = cnt12 = cnt13 = cnt14 = cnt15 = cnt16 = 0;

	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		incomeBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[2] = new THREE.Mesh(categories[2], material);
	scene.add(categoryMesh[2]);
	
	incomeLoaded = true;
	
	count47.innerHTML = cnt1;
	count48.innerHTML = cnt2;
	count49.innerHTML = cnt3;
	count50.innerHTML = cnt4;
	count51.innerHTML = cnt5;
	count52.innerHTML = cnt6;
	count53.innerHTML = cnt7;
	count54.innerHTML = cnt8;
	count55.innerHTML = cnt9;
	count56.innerHTML = cnt10;
	count57.innerHTML = cnt11;
	count58.innerHTML = cnt12;
	count59.innerHTML = cnt13;
	count60.innerHTML = cnt14;
	count61.innerHTML = cnt15;
	count62.innerHTML = cnt16;	
}

// Create the stacked bar charts for Rental category
function rental() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		rentalBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[3] = new THREE.Mesh(categories[3], material);
	scene.add(categoryMesh[3]);
	
	rentalLoaded = true;
	
	count63.innerHTML = cnt1;
	count64.innerHTML = cnt2;
	count65.innerHTML = cnt3;
	count66.innerHTML = cnt4;
	count67.innerHTML = cnt5;
	count68.innerHTML = cnt6;
	count69.innerHTML = cnt7;
	count70.innerHTML = cnt8;
	count71.innerHTML = cnt9;	
}

// Create the stacked bar charts for Insurance category
function insurance() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = cnt10 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		insuranceBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[6] = new THREE.Mesh(categories[6], material);
	scene.add(categoryMesh[6]);
	
	insuranceLoaded = true;
	
	count90.innerHTML = cnt1;
	count91.innerHTML = cnt2;
	count92.innerHTML = cnt3;
	count93.innerHTML = cnt4;
	count94.innerHTML = cnt5;
	count95.innerHTML = cnt6;
	count96.innerHTML = cnt7;
	count97.innerHTML = cnt8;
	count98.innerHTML = cnt9;	
	count99.innerHTML = cnt10;	
}

// Create the stacked bar charts for Insurance, Elder category
function insuranceElder() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		insuranceElderBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[7] = new THREE.Mesh(categories[7], material);
	scene.add(categoryMesh[7]);
	
	insuranceElderLoaded = true;
	
	count100.innerHTML = cnt1;
	count101.innerHTML = cnt2;
	count102.innerHTML = cnt3;
	count103.innerHTML = cnt4;
	count104.innerHTML = cnt5;
	count105.innerHTML = cnt6;
	count106.innerHTML = cnt7;	
}

// Create the stacked bar charts for Commuting Method category
function commutingMethod() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		commutingMethodBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[8] = new THREE.Mesh(categories[8], material);
	scene.add(categoryMesh[8]);
	
	commutingMethodLoaded = true;
	
	count107.innerHTML = cnt1;
	count108.innerHTML = cnt2;
	count109.innerHTML = cnt3;
	count110.innerHTML = cnt4;
	count111.innerHTML = cnt5;
	count112.innerHTML = cnt6;
	count113.innerHTML = cnt7;		
	count114.innerHTML = cnt8;		
	count115.innerHTML = cnt9;		
}

// Create the stacked bar charts for Commuting Time category
function commutingTime() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = cnt10 = cnt11 = cnt12 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		commutingTimeBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[9] = new THREE.Mesh(categories[9], material);
	scene.add(categoryMesh[9]);
	
	commutingTimeLoaded = true;
	
	count116.innerHTML = cnt1;
	count117.innerHTML = cnt2;
	count118.innerHTML = cnt3;
	count119.innerHTML = cnt4;
	count120.innerHTML = cnt5;
	count121.innerHTML = cnt6;
	count122.innerHTML = cnt7;		
	count123.innerHTML = cnt8;		
	count124.innerHTML = cnt9;			
	count125.innerHTML = cnt10;			
	count126.innerHTML = cnt11;			
	count127.innerHTML = cnt12;			
}

// Create the stacked bar charts for Food Stamps & Disability category
function foodStampsDisability() {
	cnt1 = cnt2 = cnt3 = cnt4 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		foodStampsDisabilityBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[10] = new THREE.Mesh(categories[10], material);
	scene.add(categoryMesh[10]);
	
	foodStampsDisabilityLoaded = true;
	
	count128.innerHTML = cnt1;
	count129.innerHTML = cnt2;
	count130.innerHTML = cnt3;
	count131.innerHTML = cnt4;	
}

// Create the stacked bar charts for Language category
function language() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		languageBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[11] = new THREE.Mesh(categories[11], material);
	scene.add(categoryMesh[11]);
	
	languageLoaded = true;
	
	count132.innerHTML = cnt1;
	count133.innerHTML = cnt2;
	count134.innerHTML = cnt3;
	count135.innerHTML = cnt4;		
	count136.innerHTML = cnt5;		
}

// Create the stacked bar charts for Education category
function education() {
	cnt1 = cnt2 = cnt3 = cnt4 = cnt5 = cnt6 = cnt7 = cnt8 = cnt9 = cnt10 = cnt11 = cnt12 = cnt13 = cnt14 = cnt15 = cnt16 = cnt17 = cnt18 = cnt19 = cnt20 = cnt21 = cnt22 = cnt23 = cnt24 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		educationBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[14] = new THREE.Mesh(categories[14], material);
	scene.add(categoryMesh[14]);
	
	educationLoaded = true;
	
	count147.innerHTML = cnt1;
	count148.innerHTML = cnt2;
	count149.innerHTML = cnt3;
	count150.innerHTML = cnt4;		
	count151.innerHTML = cnt5;	
	count152.innerHTML = cnt6;
	count153.innerHTML = cnt7;
	count154.innerHTML = cnt8;
	count155.innerHTML = cnt9;		
	count156.innerHTML = cnt10;	
	count157.innerHTML = cnt11;
	count158.innerHTML = cnt12;
	count159.innerHTML = cnt13;
	count160.innerHTML = cnt14;		
	count161.innerHTML = cnt15;	
	count162.innerHTML = cnt16;
	count163.innerHTML = cnt17;
	count164.innerHTML = cnt18;
	count165.innerHTML = cnt19;		
	count166.innerHTML = cnt20;	
	count167.innerHTML = cnt21;
	count168.innerHTML = cnt22;
	count169.innerHTML = cnt23;
	count170.innerHTML = cnt24;		
}

// Create the stacked bar charts for Family Structure category
function familyStructure() {
	cnt1 = cnt2 = cnt3 = cnt4 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		familyStructureBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[15] = new THREE.Mesh(categories[15], material);
	scene.add(categoryMesh[15]);
	
	familyStructureLoaded = true;

	count171.innerHTML = cnt1;
	count172.innerHTML = cnt2;
	count173.innerHTML = cnt3;
	count174.innerHTML = cnt4;		
}

// Create the stacked bar charts for Race category
function race() {
	cnt1 = cnt2 = 0;
	
	for (var i = 0; i < dataLength; i++) {
		var xyPos = LatLonToPixelXY(ElPasoData.features[i].geometry.coordinates[1], ElPasoData.features[i].geometry.coordinates[0]);
		
		raceBars(i, xyPos.x, xyPos.z);
	}
	categoryMesh[16] = new THREE.Mesh(categories[16], material);
	scene.add(categoryMesh[16]);
	
	raceLoaded = true;
	
	count175.innerHTML = cnt1;
	count176.innerHTML = cnt2;
}

// Monitor menu clicks	
categ1.addEventListener("click", function(e) {
	if (subcateg1.className == "dn") {
		if (!ageLoaded) {
			age();
		} else {
			scene.add(categoryMesh[0]);
		}	

		categ1.className = "selected";
		subcateg1.className = "";
	} else {
		scene.remove(categoryMesh[0]);
		categ1.className = "";
		subcateg1.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ3.addEventListener("click", function(e) {
	if (subcateg3.className == "dn") {
		if (!incomeLoaded) {
			income();
		} else {
			scene.add(categoryMesh[2]);
		}	

		categ3.className = "selected";
		subcateg3.className = "";
	} else {
		scene.remove(categoryMesh[2]);
		categ3.className = "";
		subcateg3.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ4.addEventListener("click", function(e) {
	if (subcateg4.className == "dn") {
		if (!rentalLoaded) {
			rental();
		} else {
			scene.add(categoryMesh[3]);
		}	

		categ4.className = "selected";
		subcateg4.className = "";
	} else {
		scene.remove(categoryMesh[3]);
		categ4.className = "";
		subcateg4.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ7.addEventListener("click", function(e) {
	if (subcateg7.className == "dn") {
		if (!insuranceLoaded) {
			insurance();
		} else {
			scene.add(categoryMesh[6]);
		}	

		categ7.className = "selected";
		subcateg7.className = "";
	} else {
		scene.remove(categoryMesh[6]);
		categ7.className = "";
		subcateg7.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ9.addEventListener("click", function(e) {
	if (subcateg9.className == "dn") {
		if (!commutingMethodLoaded) {
			commutingMethod();
		} else {
			scene.add(categoryMesh[8]);
		}	

		categ9.className = "selected";
		subcateg9.className = "";
	} else {
		scene.remove(categoryMesh[8]);
		categ9.className = "";
		subcateg9.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ10.addEventListener("click", function(e) {
	if (subcateg10.className == "dn") {
		if (!commutingTimeLoaded) {
			commutingTime();
		} else {
			scene.add(categoryMesh[9]);
		}	

		categ10.className = "selected";
		subcateg10.className = "";
	} else {
		scene.remove(categoryMesh[9]);
		categ10.className = "";
		subcateg10.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ11.addEventListener("click", function(e) {
	if (subcateg11.className == "dn") {
		if (!foodStampsDisabilityLoaded) {
			foodStampsDisability();
		} else {
			scene.add(categoryMesh[10]);
		}	

		categ11.className = "selected";
		subcateg11.className = "";
	} else {
		scene.remove(categoryMesh[10]);
		categ11.className = "";
		subcateg11.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ12.addEventListener("click", function(e) {
	if (subcateg12.className == "dn") {
		if (!languageLoaded) {
			language();
		} else {
			scene.add(categoryMesh[11]);
		}	

		categ12.className = "selected";
		subcateg12.className = "";
	} else {
		scene.remove(categoryMesh[11]);
		categ12.className = "";
		subcateg12.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ15.addEventListener("click", function(e) {
	if (subcateg15.className == "dn") {
		if (!educationLoaded) {
			education();
		} else {
			scene.add(categoryMesh[14]);
		}	

		categ15.className = "selected";
		subcateg15.className = "";
	} else {
		scene.remove(categoryMesh[14]);
		categ15.className = "";
		subcateg15.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ16.addEventListener("click", function(e) {
	if (subcateg16.className == "dn") {
		if (!familyStructureLoaded) {
			familyStructure();
		} else {
			scene.add(categoryMesh[15]);
		}	

		categ16.className = "selected";
		subcateg16.className = "";
	} else {
		scene.remove(categoryMesh[15]);
		categ16.className = "";
		subcateg16.className = "dn";
	}
	
	e.preventDefault();
}, false);	

categ17.addEventListener("click", function(e) {
	if (subcateg17.className == "dn") {
		if (!raceLoaded) {
			race();
		} else {
			scene.add(categoryMesh[16]);
		}	

		categ17.className = "selected";
		subcateg17.className = "";
	} else {
		scene.remove(categoryMesh[16]);
		categ17.className = "";
		subcateg17.className = "dn";
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
	}
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
	//camera.updateMatrixWorld();

	render();
	//render( clock.getDelta() );
}

//function render(dt) {
function render() {
	//camera.lookAt(scene.position);

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
