/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
//(function(){

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, terrain, 
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, iconsObj = [], scale = 0.01, raycaster, mouse = new THREE.Vector2(), INTERSECTED = null, textHeight = 0, 
	pointclouds, threshold = 0.1, tTip, geometry, material, vertices, starS, starGeom, starMater, starS2, starGeom2, starMater2, arw2, wireframe, ii, setR, setG;

// Shorthands. theStreams are the Fireflies
var theNodes = data.features[0].children, theTargets = data.features[1].children, theLinks = data.features[2].children, theStreams = data.features[3].children;

var airportMesh, airplaneMesh, dataTargetsLength, dataNodesLength, dataLinksLength, dataStreamsLength, firefly, thePath, thePathway, thePathwayLength, pathLines, linkLines;

// Arrays
var nodesOrbs = [], airplanes = [], airplaneOrbs = [], linksLines = [], thePassengers = [], tweenPassengers = [], tweenSet = [];

var airportObjLoaded = false;

// Offset amount from data array's x, y, z coordinates to align them properly relative to the center of the 3D scene (0, 0, 0), which is where the command tower is.
var offset_x = 77.5, offset_y = 2, offset_z = 415;
	
var	cntnr = document.getElementById('container');	
	
const initFireflySize = 6; 

var	intersectGroup = new THREE.Group(); 	
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
	camera = new THREE.PerspectiveCamera(60, ww/wh, 1, 10000);
	//camera.position.set(0, 50, 200);
	camera.position.set(-140, 50, -10);
	//camera.position.set(0, 100, 10);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x102236, 0.0003);
	camera.lookAt(scene.position);	
	
	var aLight = new THREE.AmbientLight(0x333333);
	//scene.add(aLight);
	
	//var light = new THREE.PointLight(0xffffff, 1, 1000);
	//light.position.set(0, 0, 0);
	//scene.add(light);

	//var spotLight = new THREE.SpotLight(0xffffff, 5, 800, Math.PI/4);
	var spotLight = new THREE.SpotLight(0xffffff, 2.7, 960);
	spotLight.position.set(0, 400, -120);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	//spotLight.shadowDarkness = 0.75;
	spotLight.shadow.camera.near = 50;
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

	//drawCircle();
	loadTextureCircle();	
	//createOrbsNodes();
	
	//loadPlaneModel();
	//createOrbsTargets();
	
	drawLinksLines();
	
	loadTextureFirefly();
	
	commandTower();
	
	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = threshold;
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	//renderer.gammaInput = true;
	//renderer.gammaOutput = true;		
	renderer.sortObjects = false;
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
	//camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 10));

	scene.add(intersectGroup);	// intersectGroup contain the Nodes and Targets for raycasting
	
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
		//'model/airport2.obj',
		'model/airportnew.obj',
		// Function when resource is loaded
		function (object) {
			//var material = new THREE.MeshPhongMaterial({shininess: 15, color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true, side: THREE.DoubleSide});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1b2733, fog: true});	
			material = new THREE.MeshLambertMaterial({color: 0x16222d, fog: true});	
			material = new THREE.MeshPhongMaterial({color: 0x161a1e, shininess: 12, fog: true});	
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
			//airportMesh.rotation.y = -1.56;
			airportMesh.rotation.y = -1.56;
			//airportMesh.position.set(-2.7, -5.2, 16);
			//airportMesh.position.set(-2.7, -1, 16);
			//airportMesh.position.set(16, -1, 19.5);
			airportMesh.position.set(16, -1.3, 19.5);
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
	var positions = new Float32Array(400 * 3);

	textureloader.load(
		'img/texture/star.png',
		function (texture) {	
			for ( var i = 0; i < 1200; i += 3 ) {
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

// Load texture for use with the Nodes and Targets
function loadTextureCircle() {
	textureloader.load(
		'img/texture/orb.png',
		function (texture) {
			//createOrbsNodes(texture);
			//createOrbsTargets(texture);			
			createOrbsNodes(texture);
			createOrbsTargets(texture);
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
//function createOrbsNodes() {
function createOrbsNodes(tex) {
	dataNodesLength = theNodes.length;  // Note: theNodes is data.features[0].children
	//console.log(dataLength);
	var scale = 0.6;
	
	//var geometry = new THREE.SphereBufferGeometry(0.25, 32, 32);

	for (var i = 0; i < dataNodesLength; i++) {
		var x = theNodes[i].y - offset_x, 
			y = theNodes[i].z + offset_y, 
			z = theNodes[i].x - offset_z;
			
		//var name = theNodes[i].name, 
			//targetType = name.split(' ');
		
		//if (targetType[0] != 'Cargo') {
			//console.log(theTargets[i].name);
			
		if (theNodes[i].type != 'Path Node') {	
//			var geometry = new THREE.SphereBufferGeometry(0.28, 32, 32);
			
			//if ((theNodes[i].streams < 2) || (theNodes[i].streams == '')) {
//				var material = new THREE.MeshBasicMaterial({color: 0x8ec640});
			//} else {
				//var material = new THREE.MeshBasicMaterial({color: 0xec008c});
			//}
	
			var material = new THREE.SpriteMaterial({color: 0x8ec640, map: tex});	
			//var material = new THREE.SpriteMaterial({color: 0x8ec640});	
	
			//nodesOrbs[i] = new THREE.Mesh(geometry, material);			
			nodesOrbs[i] = new THREE.Sprite(material);						
			nodesOrbs[i].scale.set(scale, scale, scale);
			//nodesOrbs[i] = sphere.clone();
			nodesOrbs[i].position.set(x, y, z);
			nodesOrbs[i].name = theNodes[i].type;
		
			//scene.add(nodesOrbs[i]);
			intersectGroup.add(nodesOrbs[i]);
		}
		//else { console.log(theNodes[i].type) }
		
		//}
	}
}

// Load our airplane model
function loadPlaneModel() {
	objLoader.load(
		'model/plane.obj',
		function (object) {	
			//var material = new THREE.MeshPhongMaterial({color: 0x555555, shininess: 20, side: THREE.DoubleSide, fog: true});	
			var material = new THREE.MeshPhongMaterial({color: 0x999999, shininess: 20, side: THREE.DoubleSide, fog: true, transparent: true, opacity: 0.7});	
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
			//airplaneMesh.position.y = offset_y;
			
			//createOrbsTargets();
		}
	);
}

// Add the airplanes and orbs
//function createOrbsTargets() {
function createOrbsTargets(tex) {
	dataTargetsLength = theTargets.length;  // Note: theTargets is data.features[1].children
	//console.log(dataLength);
	var scale = 1.5;	
	
	//var geometry = new THREE.SphereBufferGeometry(1.6, 32, 32);

	//scene.add(sphere);

	for (var i = 0; i < dataTargetsLength; i++) {
		var x = theTargets[i].y - offset_x, 
			y = theTargets[i].z, 
			z = theTargets[i].x - offset_z;
			
		var name = theTargets[i].name, 
			targetType = name.split(' ');
		
		//if (targetType[0] != 'Cargo') {
			//console.log(theTargets[i].name);
			
			/*
			airplanes[i] = airplaneMesh.clone();
			airplanes[i].rotation.y = Math.random()*Math.PI;		
			airplanes[i].position.set(x, y - 0.8, z);
			*/

//			var geometry = new THREE.SphereBufferGeometry(0.75, 32, 32);		
			
			//if ((theTargets[i].streams < 2) || (theTargets[i].streams == '')) {
//				var material = new THREE.MeshBasicMaterial({color: 0x8cc63f});
			//} else {
				//var material = new THREE.MeshBasicMaterial({color: 0xeb038c});
			//}

			var material = new THREE.SpriteMaterial({color: 0x8cc63f, map: tex});
			//var material = new THREE.SpriteMaterial({color: 0x8cc63f});
			
//			airplaneOrbs[i] = new THREE.Mesh(geometry, material);			
			airplaneOrbs[i] = new THREE.Sprite(material);			
			airplaneOrbs[i].scale.set(scale, scale, scale);
			//airplaneOrbs[i] = sphere.clone();
			airplaneOrbs[i].position.set(x, y + offset_y, z);

			//airplaneOrbs[i].material.color = 0xff0044;
			airplaneOrbs[i].name = theTargets[i].name;
			
			//scene.add(airplanes[i]);
			//scene.add(airplaneOrbs[i]);
			intersectGroup.add(airplaneOrbs[i]);
		//}
	}
}

// Draw the lines between Nodes using Links endpoints
function drawLinksLines() {
	dataLinksLength = theLinks.length;  // Note: theLinks is data.features[2].children
	dataNodesLength = theNodes.length;  // Note: theNodes is data.features[0].children
	
	//var geometry = new THREE.Geometry();		
	var material = new THREE.LineBasicMaterial({color: 0x00c3ff, transparent: true, opacity: 0.12});
	//var material = new THREE.LineBasicMaterial({color: 0xff0000, transparent: false, opacity: 0.12});

	var verticesLength = 0, indicesArray = [];

	for (var i = 0; i < dataLinksLength; i++) {
		var endpointsLength = theLinks[i].endpoints.length;

		if (endpointsLength == 2) {
			for (var j = 0; j < endpointsLength; j++) {
				var k = theLinks[i].endpoints[j];
				
				if (k < dataNodesLength) {
					//indicesArray.push(verticesLength);
					verticesLength += 1;				
				}
			}
		} 
	}
	//console.log(verticesLength);

	var lineGeometry = new THREE.BufferGeometry();
	var positions = new Float32Array(verticesLength * 3);	
	
	verticesLength = 0;
	
	for (var i = 0; i < dataLinksLength; i++) {
		var endpointsLength = theLinks[i].endpoints.length;
		
		if (endpointsLength == 2) {
			var goodPair = 0;
			
			for (var j = 0; j < endpointsLength; j++) {

				var k = theLinks[i].endpoints[j];

				if (k < dataNodesLength) {
					//var	x = theNodes[k].y - offset_x, 
						//y = theNodes[k].z + offset_y, 
						//z = theNodes[k].x - offset_z;
				
					//geometry.vertices.push(new THREE.Vector3(x, y, z));	
					
					var vertex = new THREE.Vector3();
					vertex.x = theNodes[k].y - offset_x;
					vertex.y = theNodes[k].z + offset_y;
					vertex.z = theNodes[k].x - offset_z;		

					positions[3 * verticesLength] = vertex.x;
					positions[3 * verticesLength + 1] = vertex.y;
					positions[3 * verticesLength + 2] = vertex.z;						
					
					//if (j % 2 == 0)	indicesArray.push(verticesLength, verticesLength + 1);
					//indicesArray.push(verticesLength);
					//indicesArray.push(j + i);
					
					verticesLength += 1;				
					goodPair += 1;
					
					//indicesArray.push(verticesLength - 1, verticesLength);
					//console.log(verticesLength - 1);
				}
			}

			if (goodPair % 2 == 0) indicesArray.push(verticesLength - 2, verticesLength - 1);			
			//linksLines[i] = new THREE.LineSegments(geometry2, material);
			//scene.add(linksLines[i]);			
		} 
		//else { console.log('er') }
		
		//indicesArray.push(i + i * 1, i + i * 1 + 1);		
	}
	
	//console.log(indicesArray);
	
	lineGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	lineGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indicesArray), 1));
	//lineGeometry.computeBoundingBox();
	lineGeometry.computeBoundingSphere();
	
	linkLines = new THREE.LineSegments(lineGeometry, material);
	scene.add(linkLines);	
	
	//console.log(linkLines);	
			
	//linksLines[0] = new THREE.Line(geometry, material);
	//scene.add(linksLines[0]);						
	//var lines = new THREE.LineSegments(geometry, material);
	//lines.updateMatrix();
	//var lines = new THREE.Line(geometry, material, THREE.LineSegments);
	//var lines = new THREE.Line(geometry, material, linksLines[i]);
	//lines.position.y = 5;
	//scene.add(lines);			
	
}

// Load texture for fireflies
function loadTextureFirefly() {
	textureloader.load(
		'img/texture/star3.png',
		function (texture) {
			createFirefly(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

// Create the firefly sprite (glowing orb)
function createFirefly(tex) {
    //var material = new THREE.SpriteMaterial({map: tex, color: 0xaa22ee, fog: true, transparent: true});
    var material = new THREE.SpriteMaterial({map: tex, fog: true, transparent: true});
    firefly = new THREE.Sprite(material);
    firefly.scale.set(initFireflySize, initFireflySize, initFireflySize);
	firefly.material.color.setRGB(0.9, 0.1, 0.5);
	//scene.add(firefly);	
	
	streamPassengers();
}

function streamPassengers() {
	for (var i = 0; i < 30; i++) {	
		thePassengers[i] = firefly.clone();
		scene.add(thePassengers[i]);

		//animatePassengers(0, i);
	}
	
	//animateFireflies(3, 30);
	var randRow = Math.round(Math.random() * 3);
	if (randRow > 3) randRow = 3;
	//console.log(randRow);
	
	animateFireflies(randRow, 30, function() {
		//if (tweenPassengers[thePathwayLength - 1])	{
		var tweenLength = tweenPassengers.length - 1;
	
		tweenPassengers[tweenLength].onComplete(function() {
			//console.log(tweenPassengers.length);
			for (var j = 0; j < 30; j++) {										
				thePassengers[j].material.opacity = 0;
			}				
		});
		//}	

		//for (var i = 0; i < thePathwayLength; i++) {	
		for (var i = 0; i < tweenLength; i++) {	
			if (tweenPassengers[i + 1])	tweenPassengers[i].chain(tweenPassengers[i + 1]);	
			//if (tweenSet[ffly][i + 1])	tweenSet[ffly][i].chain(tweenSet[ffly][i + 1]);	
		}
	
		tweenPassengers[0].start();
		//tweenSet[ffly][0].start();	
	});
	
	//tweenPassengers[0].start();
	//tweenSet[0][0].start();
}

function animateFireflies(row, ffly, callback) {
//function animateFireflies(row, ffly) {
	// theStreams is data.features[3].children

	dataNodesLength = theNodes.length;  // Note: theNodes is data.features[0].children	
	
	var indx = Math.round(Math.random() * (theStreams[row].pathways.length - 1));
	
	if (indx > (theStreams[row].pathways.length - 1)) indx = 0;
	
	thePath = theStreams[row].pathways[indx];
	thePathway = thePath.split(',');
	thePathwayLength = thePathway.length;
	//console.log(thePathway[1]);	
	
	var prevX = [], prevY = [], prevZ = [];
	prevX[0] = prevY[0] = prevZ[0] = x1 = y1 = z1 = x2 = y2 = z2 = 0;
	var prevIndx = pXYZ = 0;
	
	var node1 = parseInt(thePathway[0]);
	
	x1 = theNodes[node1].y - offset_x, 
	y1 = theNodes[node1].z + offset_y, 
	z1 = theNodes[node1].x - offset_z;
	
	ii = 0, setR = 0.9, setG = 0.1;
	
	var lineGeom = new THREE.Geometry();	
	var lineMater = new THREE.LineBasicMaterial({color: 0x00c3ff, transparent: true, opacity: 0.83});
	
	for (var i = 0; i < thePathwayLength - 1; i++) {	
		var node2 = parseInt(thePathway[i + 1]);	
				
		if (node2 < dataNodesLength) {

			//console.log(node2);
			x2 = theNodes[node2].y - offset_x, 
			y2 = theNodes[node2].z + offset_y, 
			z2 = theNodes[node2].x - offset_z;		
			/*	var node2 = parseInt(thePathway[1]);
				var	x2 = theNodes[node2].y - offset_x, 
					y2 = theNodes[node2].z + offset_y, 
					z2 = theNodes[node2].x - offset_z;	*/
	
			//console.log(x1 + ' ' + y1 + ' ' + z1 + ' ' + x2 + ' ' + y2 + ' ' + z2); 
			var startXY = {x: x1, y: y1, z: z1}, 
				endXY = { x: x2, y: y2, z: z2 }, 
				distance = (Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1)) / 3, 
				duration = 1500 + distance * 50;

			tweenPassengers[i] = new TWEEN.Tween(startXY)
				.to(endXY, duration)
				//.delay(200)
				.onUpdate(function() {
					//console.log(this.x, this.y);
					var timer = Date.now();
					//var scale = Math.sin(timer * 0.005);

					thePassengers[0].position.set(this.x, this.y, this.z);
					thePassengers[0].material.opacity = 1 - Math.sin(timer * 0.005) * .5;
					
					for (var j = 0; j < ffly - 1; j++) {						
						if ((prevIndx - j * 3) >= 0) {
							pXYZ = prevIndx - j * 3;
						} else {
							pXYZ = 0;
						}
						
						thePassengers[j + 1].position.set(prevX[pXYZ], prevY[pXYZ], prevZ[pXYZ]);
						//thePassengers[j + 1].position.set(prevX[i - j], prevY[i - j], prevZ[i - j]);
						//thePassengers[j + 1].position.set(prevX[j], prevY[j], prevZ[j]);
						//thePassengers[j + 1].material.opacity = Math.sin(timer * 0.005) + .5;
						
						if (j % 2 == 0) {
							thePassengers[j + 1].material.opacity = 1 - Math.sin(timer * 0.006) * .5;
						} else {	
							thePassengers[j + 1].material.opacity = 1 - Math.cos(timer * 0.006) * .5;
						}
					
						//prevX[j + 1] = this.x;
						//prevY[j + 1] = this.y;
						//prevZ[j + 1] = this.z;
					}

					/*prevX[i + 1] = this.x;
					prevY[i + 1] = this.y;
					prevZ[i + 1] = this.z;	*/
					prevX[prevIndx + 1] = this.x;
					prevY[prevIndx + 1] = this.y;
					prevZ[prevIndx + 1] = this.z;					
					prevIndx += 1;

				})
				//.onComplete(komplete);
				.onComplete(function() {
					ii += 1;
					var currNode = parseInt(thePathway[ii]);
					
					if (theNodes[currNode].type != "Path Node") {	
						if (tweenPassengers[ii + 1]) tweenPassengers[ii + 1].delay(200);
						
						setR -= 0.05;
						setG += 0.05;
						if (setR < 0) setR = 0;
						if (setG > 1.0) setG = 1.0;
							
						for (var j = 0; j < ffly; j++) {	
							//var scale = (initFireflySize / i) * 1.1;
							var scale = (initFireflySize / (i - 10)) * 1.08;
							
							if ((thePassengers[j].scale.x - scale) > 0) {
								thePassengers[j].scale.x -= scale;
								thePassengers[j].scale.y -= scale;
								thePassengers[j].scale.z -= scale;
								//thePassengers[0].scale.set(scale, scale, scale);					
							} else {
								thePassengers[j].scale.x = 0.01;
								thePassengers[j].scale.y = 0.01;
								thePassengers[j].scale.z = 0.01;							
							}
						
							//thePassengers[j].material.color = 0xffffff * Math.random();
							//thePassengers[j].material.color.setHex(0xffffff * Math.random());

							thePassengers[j].material.color.r = setR;
							thePassengers[j].material.color.g = setG;
							//var rgbColor = , 
							//thePassengers[j].material.color.setRGB(rgbColor);
							
						}
						
						//console.log(setR);
						//console.log(setG);
						//console.log(thePassengers[0].material.color.r);
						//console.log(thePassengers[0].material.color.g);
						//console.log(thePassengers[5].scale.x);
						//console.log(ii);
						//console.log(theNodes[currNode].type);
						//console.log(scale + ' ' + i);
					}
				
				/*	if (ii >= thePathwayLength - 2) {
						//console.log('end');
						for (var j = 0; j < ffly; j++) {										
							thePassengers[j].material.opacity = 0;
						}
					}	*/
				});	
			//.start();	
	
			//tweenSet[ffly] = tweenPassengers[i];
	
			x1 = x2;
			y1 = y2;
			z1 = z2;		
		} 
		/*else {
			if (ii >= thePathwayLength - 2) {
				for (var j = 0; j < ffly; j++) {										
					thePassengers[j].material.opacity = 0;
				}			
			}
		}	*/
	
		//ii += 1;
		lineGeom.vertices.push(new THREE.Vector3(x1, y1, z1));			
	}

	var pathLines = new THREE.Line(lineGeom, lineMater);
	scene.add(pathLines);	
	
	if (callback) {
		return callback();
	}
}


// Add command tower, located at the center of the scene
function commandTower() {
	var geometry = new THREE.CylinderBufferGeometry(0.8, 1.6, 6, 8);
	var material = new THREE.MeshBasicMaterial({color: 0xaabbcc, transparent: true, opacity: 0.5});
	
	var commandTowerMesh = new THREE.Mesh(geometry, material);
	commandTowerMesh.position.y = 1;
	scene.add(commandTowerMesh);
}

function toolTip(message, opts) {
	var parameters = opts || {};
	//var fontface = parameters.fontface || 'Helvetica';
	var fontface = parameters.fontface || 'Verdana';
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


function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function onDocumentMouseMove(event) {
	event.preventDefault();

	mouse.x = (event.clientX / ww) * 2 - 1;
	mouse.y = -(event.clientY / wh) * 2 + 1;
	//mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

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

//function animate() {
function animate() {
	requestAnimationFrame(animate);
	
	var timer = Date.now();
	//var timer = new Date().getTime();	
	//var delta = clock.getDelta(),
	//time = clock.getElapsedTime() * 10;
					
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

	/*scene.remove( wireframe );
	wireframe = new THREE.WireframeHelper( terrain, 0xffffff );
	scene.add( wireframe );
			
	if (airportObjLoaded) {
		if (camera.position.y < 0) {
			material.opacity = 0.5;
		}
	}*/
	
	//TWEEN.update(time);
	TWEEN.update();
	
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
	
	raycaster.setFromCamera(mouse, camera);

	//var intersects = raycaster.intersectObjects(airplaneOrbs, nodesOrbs);
	//var intersects = raycaster.intersectObjects(nodesOrbs);
	var intersects = raycaster.intersectObjects(intersectGroup.children);

	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0]) {
			if (INTERSECTED) scene.remove(tTip);
			
			INTERSECTED = intersects[0];
			//tooltip.innerHTML = INTERSECTED.object.geometry.attributes.name.array[INTERSECTED.index];
			//console.log(INTERSECTED.object.geometry);
			//tTip = toolTip(INTERSECTED.object.geometry.name);
			tTip = toolTip(INTERSECTED.object.name);
			tTip.position.copy(INTERSECTED.point);
			scene.add(tTip);						
		}
	} else {
		//if (INTERSECTED) tooltip.innerHTML = '';
		if (INTERSECTED) scene.remove(tTip);
		INTERSECTED = null;
	}		
	
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
//})();





