/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, geometry, material, vertices, starS, starGeom, starMater, 
	raycaster, mouse = new THREE.Vector2(), INTERSECTED = null, textHeight = 0, threshold = 0.1, tTip;

// Shorthands
var theNodes = data.features[0].children,    // Note: theNodes is data.features[0].children, 
	theTargets = data.features[1].children,  //       theTargets is data.features[1].children, 
	theLinks = data.features[2].children,    //       theLinks is data.features[2].children, 
	theStreams = data.features[3].children;  //       theStreams is data.features[3].children in the array

// Arrays
var nodesOrbs = [], airplanes = [], targetOrbs = [], linksLines = [], firefly = [], theFireflies = [], fireflyTexture = [], 
	fireflyCount = [], tweenFireflies = [], tweenSet = [], ii = [], iii = [], stopProc = [], initX1 = [], initY1 = [], initZ1 = [], tpwl = [], currNode = [], 
	thePathway = [], thePathwayLength = [], pathLines = [], streamGroup = [], streamLength = [], globalTime = [0.0, 0.100];
	
// Data arrays lengths
var dataNodesLength = theNodes.length, 
	dataTargetsLength = theTargets.length, 
	dataLinksLength = theLinks.length, 
	dataStreamsLength = theStreams.length;

fireflyCount[0] = streamLength[0] = theStreams[0].pathways.length; 
fireflyCount[1] = streamLength[1] = theStreams[1].pathways.length; 
fireflyCount[2] = streamLength[2] = theStreams[2].pathways.length; 
fireflyCount[3] = streamLength[3] = theStreams[3].pathways.length;

// Constants	
const initFireflySize = 10; 	

// Quantities, values. Use fireflySpeed to affect the overall speed of the fireflies.
var currStream = 0, 
	speedStep = 100, // Affects the duration of each tweens. The higher the amount, the slower the fireflies.
	fireflySpeed = 1,	// the overall speed of the fireflies. 1 is the default speed. The higher the value, the faster the fireflies move, e.g. a value of 2 is twice as fast as the default of 1, while 0.5 is half as fast. To pause, set to 0. 
	currentResources = 1;	// Value from 0 to 1. Affects which Nodes, Links, Fireflies are active.
	
var readyToGo = 0;	// Used to keep track of when all essentials objects are loaded and ready
	
var tarmacMesh, terminalsMesh, airplaneMesh, thePath, linkLines;   

// Booleans
var tweeningOn = false, showUI = true;

// Offset amount from data array's x, y, z coordinates to align them properly relative to the center of the 3D scene (0, 0, 0), which is where the command tower is.
var offset_x = 77.5, offset_y = 2, offset_z = 415;

// Stream groupings
streamGroup[0] = new THREE.Group(); 
streamGroup[1] = new THREE.Group(); 	
streamGroup[2] = new THREE.Group(); 	
streamGroup[3] = new THREE.Group();
	
var textureloader = new THREE.TextureLoader();		
var objLoader = new THREE.OBJLoader();	
var	intersectGroup = new THREE.Group(); 	
var clock = new THREE.Clock();

var	cntnr = document.getElementById('container');		
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
	camera.position.set(-140, 50, -10);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x102236, 0.0003);
	//camera.lookAt(scene.position);	
	
	var spotLight = new THREE.SpotLight(0xffffff, 2, 960);
	spotLight.position.set(0, 400, -120);
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 2048;
	spotLight.shadow.mapSize.height = 2048;
	spotLight.shadow.camera.near = 50;
	spotLight.shadow.camera.far = 5000;
	spotLight.shadow.camera.fov = 60;
	scene.add(spotLight);	
	
	statS();

	loadFireflyTexture();
	
	//loadPlaneModel();

	drawLinksLines();
	
	loadTarmac();
	loadTerminals();	
	
	commandTower();	
	
	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = threshold;
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.minDistance = 5;
	controls.maxDistance = 1000;	

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

// Load our tarmac model
function loadTarmac() {
	objLoader.load(
		'model/tarmac1.obj',
		function (object) {
			material = new THREE.MeshPhongMaterial({color: 0x10263b, shininess: 16, fog: true});	
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.geometry.computeVertexNormals();
					child.geometry.computeFaceNormals();							
					child.receiveShadow = true;				
					child.material = material;	
				}
			});			
			
			tarmacMesh = object;
			tarmacMesh.rotation.y = -1.56;
			tarmacMesh.position.set(18, -1.5, 20);
			scene.add(tarmacMesh);
		}
	);
}

// Load our airport terminals model
function loadTerminals() {
	objLoader.load(
		'model/terminals1.obj',
		function (object) {
			material = new THREE.MeshPhongMaterial({color: 0x293540, shininess: 20, fog: true});	
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.geometry.computeVertexNormals();
					child.geometry.computeFaceNormals();							
					child.castShadow = true;
					child.receiveShadow = true;				
					child.material = material;	
				}
			});			
			
			terminalsMesh = object;
			terminalsMesh.rotation.y = -1.56;
			terminalsMesh.position.set(18, -1.5, 20);
			scene.add(terminalsMesh);
		}
	);
}

// Load texture for use with the Nodes and Targets
function loadTextureCircle() {
	textureloader.load(
		'img/texture/orb.png',
		function (texture) {
			createOrbsNodes(texture);
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
function createOrbsNodes(tex) {
	// Note: theNodes is data.features[0].children

	var scale = 0.6;
	
	for (var i = 0; i < dataNodesLength; i++) {
		var x = theNodes[i].y - offset_x, 
			y = theNodes[i].z + offset_y, 
			z = theNodes[i].x - offset_z;
			
		if (theNodes[i].type != 'Path Node') {	
			var material = new THREE.SpriteMaterial({map: tex, depthWrite: false, depthTest: false});	

			nodesOrbs[i] = new THREE.Sprite(material);						
			nodesOrbs[i].scale.set(scale, scale, scale);
			nodesOrbs[i].position.set(x, y, z);
			nodesOrbs[i].name = theNodes[i].type;
			nodesOrbs[i].material.color.setRGB(0.5, 0.5, 0.7);
		
			intersectGroup.add(nodesOrbs[i]);
		} else { 
			nodesOrbs[i] = ' ';
		}
	}
	
	readyToGo += 1;
	
	createOrbsTargets(tex);	
}

// Load our airplane model
function loadPlaneModel() {
	objLoader.load(
		'model/plane.obj',
		function (object) {	
			var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa, side: THREE.BackSide, fog: true});	
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
			
			for (var i = 0; i < dataTargetsLength; i++) {			
				var x = theTargets[i].y - offset_x, 
					y = theTargets[i].z, 
					z = theTargets[i].x - offset_z;
					
				airplanes[i] = airplaneMesh.clone();
				airplanes[i].rotation.y = Math.random()*Math.PI;		
				airplanes[i].position.set(x, y - 1.2, z);			
				
				scene.add(airplanes[i]);
			}
		}
	);
}

// Add the airplanes and orbs
function createOrbsTargets(tex) {
	// Note: theTargets is data.features[1].children

	var scale = 1.5;	
	
	for (var i = 0; i < dataTargetsLength; i++) {
		var x = theTargets[i].y - offset_x, 
			y = theTargets[i].z, 
			z = theTargets[i].x - offset_z;
			
		var name = theTargets[i].name, 
			targetType = name.split(' ');
		
			var material = new THREE.SpriteMaterial({map: tex, depthWrite: false, depthTest: false});

			targetOrbs[i] = new THREE.Sprite(material);			
			targetOrbs[i].scale.set(scale, scale, scale);
			targetOrbs[i].position.set(x, y + offset_y, z);
			targetOrbs[i].name = theTargets[i].name;

			targetOrbs[i].material.color.setRGB(0, 0.62, 0.93);			
			
			intersectGroup.add(targetOrbs[i]);
	}
	
	readyToGo += 1;
	
	streamFireflies(0);	// Prepare the Streams for tweening, Stream id = 0
	streamFireflies(1); // Stream id = 1
	streamFireflies(2); // Stream id = 2
	streamFireflies(3);	// Stream id = 3	
}

// Draw the lines between Nodes using Links endpoints
function drawLinksLines() {
	// Note: theLinks is data.features[2].children
	// 	     theNodes is data.features[0].children
	
	var material = new THREE.LineBasicMaterial({color: 0xeeeeee, transparent: true, opacity: 0.1, depthWrite: false, depthTest: false});

	var verticesLength = 0, indicesArray = [];

	for (var i = 0; i < dataLinksLength; i++) {
		var endpointsLength = theLinks[i].endpoints.length;

		if (endpointsLength == 2) {
			for (var j = 0; j < endpointsLength; j++) {
				var k = theLinks[i].endpoints[j];
				
				if (k < dataNodesLength) {
					verticesLength += 1;				
				}
			}
		} 
	}

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
					var vertex = new THREE.Vector3();
					vertex.x = theNodes[k].y - offset_x;
					vertex.y = theNodes[k].z + offset_y;
					vertex.z = theNodes[k].x - offset_z;		

					positions[3 * verticesLength] = vertex.x;
					positions[3 * verticesLength + 1] = vertex.y;
					positions[3 * verticesLength + 2] = vertex.z;						
					
					verticesLength += 1;				
					goodPair += 1;
				}
			}

			if (goodPair % 2 == 0) indicesArray.push(verticesLength - 2, verticesLength - 1);			
		} 
	}
	
	lineGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
	lineGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indicesArray), 1));
	lineGeometry.computeBoundingSphere();
	
	linkLines = new THREE.LineSegments(lineGeometry, material);
	scene.add(linkLines);	
}

// Load texture for firefly (stream id = 0)
function loadFireflyTexture() {
	textureloader.load(
		'img/texture/fireflynew.png',
		function (texture) {
			fireflyTexture[0] = texture;
			createFirefly(0);
			createFirefly(1);
			createFirefly(2);
			createFirefly(3);
			readyToGo += 1;
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

// Create the firefly sprite
function createFirefly(currS) {
    var material = new THREE.SpriteMaterial({color: 0xf50090, map: fireflyTexture[0], fog: true, transparent: true, depthWrite: false, depthTest: false});
    firefly[currS] = new THREE.Sprite(material);
    firefly[currS].scale.set(initFireflySize, initFireflySize, initFireflySize);
	
	if (currS == 3) loadTextureCircle();	// Load Nodes and Targets orb texture
}

// Color the Nodes based on Node stream "sec" value range, average, globalTime
function colorNodes() {
	for (var n = 0; n < streamLength[currStream]; n++) {	
		var thePath = theStreams[currStream].pathways[n], 
			thePathway = thePath.split(','), 
			thePathwayLength = thePathway.length;
	
		for (var i = 0; i < thePathwayLength; i++) { 
			var nodeC = parseInt(thePathway[i]);	
			
			if (nodeC < dataNodesLength) {
				//if (theNodes[nodeC].type != "Path Node") {		
				if ((theNodes[nodeC].type != "Path Node") && (parseFloat(theNodes[nodeC].resources[0]) < currentResources)) {
					var secVal = 0;

					if (theNodes[nodeC].streams[currStream]) {
						var gtLength = Math.abs((globalTime[1] - globalTime[0]) * theNodes[nodeC].streams[currStream].sec.length) + 1;
							
						for (var t = 0; t < gtLength; t++) {	
							secVal += theNodes[nodeC].streams[currStream].sec[t];
						}
					
						secVal /= gtLength;
					} 
							
					var nodeB = secVal * 0.01, 
					nodeG = nodeB * 0.75, 
					nodeR = 1 - nodeB;
							
					if (nodeR < 0) {
						nodeR = 0;
					} else if (nodeR > 1) {
						nodeR = 1;
					}							
							
					if (nodeB < 0) {
						nodeB = 0;
					} else if (nodeB > 1) {
						nodeB = 1;
					}
							
					if (secVal == 0) {
						nodeR = nodeB = 0.5;
						nodeG = nodeB * 0.75;
					}
					
					nodesOrbs[nodeC].material.color.r = nodeR;
					nodesOrbs[nodeC].material.color.g = 0.2;
					nodesOrbs[nodeC].material.color.b = nodeB;					
				}
			} else {
				targetOrbs[nodeC - dataNodesLength].material.color.setRGB(0, 0.62, 0.93);				
				targetOrbs[nodeC - dataNodesLength].visible = true;
			}
		}
	}
}	

// Execute when currentResources value is updated
function currResourceUpdated() {
	// Reset Nodes orbs color
	var nodesOrbsLength = nodesOrbs.length;
	
	for (var n = 0; n < nodesOrbsLength; n++) {
		if (nodesOrbs[n] != ' ') nodesOrbs[n].material.color.setRGB(0.5, 0.5, 0.7);
	}
	
	colorNodes();	// Recolor Nodes orbs
	
	// Hide/unhide Links (Pathway) lines and Fireflies based on currentResources value
	for (var n = 0; n < streamLength[currStream]; n++) {
		if (parseFloat(theStreams[currStream].security[n]) < currentResources) {
			theFireflies[currStream][n].visible = pathLines[currStream][n].visible = true;		
		} else {
			theFireflies[currStream][n].visible = pathLines[currStream][n].visible = false;	
		}
	}
}
	
// Stop current stream
function stopStream(callback) {
	for (var i = 0; i < tweenSet[currStream].length; i++) {	
		for (var j = 0; j < tweenSet[currStream][i].length; j++) {	
			tweenSet[currStream][i][j].stop();
			//tweenSet[currStream][i][0].stop();
		}	
	}

	tweeningOn = false;
	
	scene.remove(streamGroup[currStream]);

	// Reset Fireflies' positions
	for (var i = 0; i < streamLength[currStream]; i++) {	
		var thePathS = theStreams[currStream].pathways[i];
		var thePathwayS = thePathS.split(',');
		var nodeS = parseInt(thePathwayS[0]);
		
		//theFireflies[currStream][i].position.set(theNodes[nodeS].y - offset_x + (Math.random() * 300), theNodes[nodeS].z + offset_y, theNodes[nodeS].x - offset_z);
		theFireflies[currStream][i].position.set(theNodes[nodeS].y - offset_x, theNodes[nodeS].z + offset_y, theNodes[nodeS].x - offset_z);
		theFireflies[currStream][i].material.color.setRGB(0.96, 0, 0.56);
		//theFireflies[currStream][i].visible = false;
		theFireflies[currStream][i].scale.set(initFireflySize, initFireflySize, initFireflySize);			
	}
	
	for (var n = 0; n < nodesOrbs.length; n++) {
		if (nodesOrbs[n] != ' ') nodesOrbs[n].material.color.setRGB(0.5, 0.5, 0.7);
		//nodesOrbs[n].material.needUpdate = true;
	}	
	
	for (var n = 0; n < targetOrbs.length; n++) {
		targetOrbs[n].visible = false;
	}		
	
	if (callback) {
		return callback();
	}	
}

function streamFireflies(currS) {
	currStream = currS;
			
	theFireflies[currStream] = [];
	tweenSet[currStream] = [];
	pathLines[currStream] = [];
	
	for (var i = 0; i < fireflyCount[currStream]; i++) {	
		var material = new THREE.SpriteMaterial({map: fireflyTexture[0], fog: true, transparent: true, depthWrite: false, depthTest: false});
		theFireflies[currStream][i] = new THREE.Sprite(material);
		theFireflies[currStream][i].material.color.setRGB(0.96, 0, 0.56);
		theFireflies[currStream][i].scale.set(initFireflySize, initFireflySize, initFireflySize);
		
		streamGroup[currStream].add(theFireflies[currStream][i]);
	
		animateFireflies(i, function() {
			var tweenLength = tweenSet[currStream][i].length;
	
			for (var j = 0; j < tweenLength; j++) {	
				if (tweenSet[currStream][i][j + 1])	{
					tweenSet[currStream][i][j].chain(tweenSet[currStream][i][j + 1]);	
				} else {
					tweenSet[currStream][i][j].chain(tweenSet[currStream][i][0]);	
				}
			}
		});
	}	
}

// Change fireflies' color when passing Nodes
function remapFireflyColor(start, end, current, sec) {
    var range = end - start,
		raw = (current - start) / range,
		edit = raw + ((1-raw) * (sec/300)), 
		remap = (edit * range) + start;
	
	return remap;
}
 
// theStreams are the Fireflies
function animateFireflies(ffly, callback) {
	// Note: theNodes is data.features[0].children	
	//       theStreams is data.features[3].children
	
	var lineGeom = new THREE.Geometry();	
	var lineMater = new THREE.LineBasicMaterial({color: 0xcccccc, transparent: true, opacity: 0.4, depthWrite: false, depthTest: false});	
	
	var indx = ffly;
	
	if (indx > (theStreams[currStream].pathways.length - 1)) indx = 0;

	initX1[currStream] = [], initY1[currStream] = [], initZ1[currStream] = [], ii[currStream] = [], tpwl[currStream] = [], 
	thePathway[currStream] = [], thePathwayLength[currStream] = [], currNode[currStream] = [];
	
	thePath = theStreams[currStream].pathways[indx];
	thePathway[currStream][ffly] = thePath.split(',');
	thePathwayLength[currStream][ffly] = thePathway[currStream][ffly].length;
	
	var x1 = y1 = z1 = x2 = y2 = z2 = nodeR = nodeG = nodeB = 0;
	
	var node1 = parseInt(thePathway[currStream][ffly][0]);

	theFireflies[currStream][ffly].position.x = x1 = initX1[currStream][ffly] = theNodes[node1].y - offset_x, 
	theFireflies[currStream][ffly].position.y = y1 = initY1[currStream][ffly] = theNodes[node1].z + offset_y, 
	theFireflies[currStream][ffly].position.z = z1 = initZ1[currStream][ffly] = theNodes[node1].x - offset_z;
	
	nodeR = theFireflies[currStream][ffly].material.color.r;
	nodeG = theFireflies[currStream][ffly].material.color.g;
	nodeB = theFireflies[currStream][ffly].material.color.b;
	
	ii[currStream][ffly] = [], tpwl[currStream][ffly] = 0;
	
	tweenSet[currStream][ffly] = [];
	
	for (var i = 0; i < thePathwayLength[currStream][ffly] + 1; i++) {	
		if (thePathway[currStream][ffly][i + 1]) {
			var node2 = parseInt(thePathway[currStream][ffly][i + 1]);	
		} else {
			var node2 = parseInt(thePathway[currStream][ffly][i]);	
		}
				
		if (node2 < dataNodesLength) {
			x2 = theNodes[node2].y - offset_x, 
			y2 = theNodes[node2].z + offset_y, 
			z2 = theNodes[node2].x - offset_z;		
		} else if (i == thePathwayLength[currStream][ffly] - 1) {		// This is the last stop (a Target) of the firefly
			theTargets.filter(function(d) {
				if (d.id == node2) {
					x2 = d.y - offset_x, 
					y2 = d.z + offset_y, 
					z2 = d.x - offset_z;
				}
			});
		}

		if (i == thePathwayLength[currStream][ffly]) {
			x1 = x2 = initX1[currStream][ffly];
			y1 = y2 = initY1[currStream][ffly];
			z1 = z2 = initZ1[currStream][ffly];
		}

		var startXYZ = {x: x1, y: y1, z: z1}, 
			endXYZ = {x: x2, y: y2, z: z2}, 		
			distance = (Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1)) / 3, 
			duration = speedStep * distance;

		if (i == thePathwayLength[currStream][ffly]) {
			duration = 0;
		}		
		
		if (i == 0) {
			duration += Math.random() * (streamLength[currStream] * 20);
		}
							
		tweenSet[currStream][ffly][i] = new TWEEN.Tween(theFireflies[currStream][ffly].position)
			.to(endXYZ, duration)
			.onStart(function() {

			})			
			.onUpdate(function() {

			})
			.onComplete(function() {
				var thePathway2 = [], thePathwayLength2 = [];
				thePathway2[currStream] = [], thePathwayLength2[currStream] = [];
				
				var thePath2 = theStreams[currStream].pathways[ffly];
				thePathway2[currStream][ffly] = thePath2.split(',');
				thePathwayLength2[currStream][ffly] = thePathway2[currStream][ffly].length;
	
				var streamI = parseInt(thePathway2[currStream][ffly][iii[ffly]]);

				if (streamI >= dataNodesLength) {
					// Calculate color of Targets when Fireflies pass them
					var nodeR2 = nodeG2 = nodeB2 = 0;
					nodeR2 = theFireflies[currStream][ffly].scale.x * 0.06;
					nodeB2 = 1 / theFireflies[currStream][ffly].scale.x + 0.2;					
					//var nodeB2 = 1 - theFireflies[currStream][ffly].scale.x, 
						//nodeR2 = 1 - nodeB2;
						
					if (nodeR2 < 0) {
						nodeR2 = 0;
					} else if (nodeR2 > 1) {
						nodeR2 = 1;
					}							
							
					if (nodeB2 < 0) {
						nodeB2 = 0;
					} else if (nodeB2 > 1) {
						nodeB2 = 1;
					}
							
					if ((nodeR2 >= 0) && (nodeB2 >= 0)) targetOrbs[streamI - dataNodesLength].material.color.setRGB(nodeR2, nodeB2 * 0.73, nodeB2);	
				}
				
				if (!stopProc[ffly]) {
					iii[ffly] += 1;
				
					var thePathway2 = [], thePathwayLength2 = [];
					thePathway2[currStream] = [], thePathwayLength2[currStream] = [];
				
					var thePath2 = theStreams[currStream].pathways[ffly];
					thePathway2[currStream][ffly] = thePath2.split(',');
					thePathwayLength2[currStream][ffly] = thePathway2[currStream][ffly].length;
	
					var streamI = parseInt(thePathway2[currStream][ffly][iii[ffly]]);

					if ((streamI < dataNodesLength) && (streamI >= 0)) {
						if (theNodes[streamI].type != "Path Node") {		
							var secVal = 0;

							// Calculate Node "sec" value range average based on globalTime 2 indices
							if (theNodes[streamI].streams[currStream]) {
								var gtLength = Math.abs((globalTime[1] - globalTime[0]) * theNodes[streamI].streams[currStream].sec.length) + 1;
							
								for (var t = 0; t < gtLength; t++) {	
									secVal += theNodes[streamI].streams[currStream].sec[t];
								}
					
								secVal /= gtLength;
								Math.abs(secVal);
							} 
				
							var nodeR = nodeG = nodeB = 0;
							nodeR = theFireflies[currStream][ffly].material.color.r;
							nodeG = theFireflies[currStream][ffly].material.color.g; 
							nodeB = theFireflies[currStream][ffly].material.color.b;
			
							/*nodeB += secVal * 0.00065;
							nodeG = nodeB * 0.73;
							nodeR -= secVal * 0.001;*/
						
							nodeB = remapFireflyColor(0.56, 0.93, nodeB, secVal);
							nodeG = remapFireflyColor(0, 0.65, nodeG, secVal);
							nodeR = remapFireflyColor(0.96, 0, nodeR, secVal);						
				
							if (nodeR < 0) {
								nodeR = 0;
							} else if (nodeR > 1) {
								nodeR = 1;
							}							
							
							if (nodeG < 0) {
								nodeG = 0;
							} else if (nodeG > 1) {
								nodeG = 1;
							}						
						
							if (nodeB < 0) {
								nodeB = 0;
							} else if (nodeB > 1) {
								nodeB = 1;
							}
							
							if ((nodeR >= 0) && (nodeG >= 0) && (nodeB >= 0)) theFireflies[currStream][ffly].material.color.setRGB(nodeR, nodeG, nodeB);

							// Shrink the firefly based on "sec" value of chosen stream and index
							var scale = secVal * theFireflies[currStream][ffly].scale.x * 0.001;	
							
							if ((theFireflies[currStream][ffly].scale.x - scale) > 0) {
								theFireflies[currStream][ffly].scale.x -= scale;
								theFireflies[currStream][ffly].scale.y -= scale;
								theFireflies[currStream][ffly].scale.z -= scale;
							} else {
								theFireflies[currStream][ffly].scale.x = 0.01;
								theFireflies[currStream][ffly].scale.y = 0.01;
								theFireflies[currStream][ffly].scale.z = 0.01;							
							}
						}
					} 
				}
			
				if (iii[ffly] == thePathway2[currStream][ffly].length) {
					iii[ffly] = 0;
					stopProc[ffly] = true;
					
					theFireflies[currStream][ffly].material.color.setRGB(0.96, 0, 0.56);
					theFireflies[currStream][ffly].scale.set(initFireflySize, initFireflySize, initFireflySize);				
				} else {
					stopProc[ffly] = false;
				}
			});		// end of onComplete
		//.start();	
			
		x1 = x2;
		y1 = y2;
		z1 = z2;		
		
		if (i < thePathwayLength[currStream][ffly]) {
			lineGeom.vertices.push(new THREE.Vector3(x1, y1, z1));			
		}
	}

	pathLines[currStream][ffly] = new THREE.Line(lineGeom, lineMater);
	streamGroup[currStream].add(pathLines[currStream][ffly]);	
	//console.log(pathLines[currStream][ffly]);
	
	if (callback) {
		return callback();
	}
}


// Add command tower, located at the center of the scene
function commandTower() {
	var geometry = new THREE.CylinderBufferGeometry(0.8, 1.6, 6, 8);
	var material = new THREE.MeshBasicMaterial({color: 0xaabbcc, transparent: true, opacity: 0.4});
	
	var commandTowerMesh = new THREE.Mesh(geometry, material);
	commandTowerMesh.position.y = 2;
	scene.add(commandTowerMesh);
}

// Show tooltips on Nodes and Targets hover
function toolTip(message, opts) {
	var parameters = opts || {};
	var fontface = parameters.fontface || 'Verdana';
	var fontsize = parameters.fontsize || 15;
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = fontsize + "px " + fontface;
	
	var metrics = context.measureText(message);
	var textWidth = metrics.width;
		//textHeight = metrics.width;

	context.fillStyle = 'rgba(220, 220, 220, 1.0)';
	context.fillText(message, 0, fontsize);
	//context.fillText(message, 0, 80);
	
	//context.fillRect(0, 0, metrics.width, 100);

	var texture = new THREE.Texture(canvas)
	texture.minFilter = THREE.LinearFilter;
	texture.needsUpdate = true;

	//var spriteMaterial = new THREE.SpriteMaterial({map: texture, useScreenCoordinates: false});
	var spriteMaterial = new THREE.SpriteMaterial({map: texture});
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(40, 20, 1.0);
	return sprite;
}


function onDocumentMouseMove(event) {
	event.preventDefault();

	mouse.x = (event.clientX / ww) * 2 - 1;
	mouse.y = -(event.clientY / wh) * 2 + 1;
	//mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	
	renderer.setSize(ww, wh);
	
	document.body.style.width = cntnr.style.width = ww+'px';
	document.body.style.height = cntnr.style.height = wh+'px';	
}
window.addEventListener('resize', onWindowResize, false);	

function animate(time) {
	requestAnimationFrame(animate);
	
	var timer = Date.now();

	// Ready to stream
	if ((readyToGo == 3) && (showUI)) {
		tempUI.style.display = "block";	// Replace this with the actual UI
		
		showUI = false;		
	}
	
	if (tweeningOn) {
		TWEEN.update(time * fireflySpeed);	// fireflySpeed affects the overall speed of all tweens. The higher the value, the faster. A value of 0 is like pausing. 
	}
	
	stats.update();	
	render();
}

function render() {
	controls.update();
	renderer.render(scene, camera);	

	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(intersectGroup.children);	// Raycast Nodes and Targets to display tooltips

	if (intersects.length > 0) {
		if (INTERSECTED != intersects[0]) {
			if (INTERSECTED) scene.remove(tTip);
			
			INTERSECTED = intersects[0];
			tTip = toolTip(INTERSECTED.object.name);
			tTip.position.copy(INTERSECTED.point);
			scene.add(tTip);						
		}
	} else {
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





