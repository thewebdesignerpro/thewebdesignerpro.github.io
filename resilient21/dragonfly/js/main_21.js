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

// Data arrays lengths
var dataNodesLength = theNodes.length, 
	dataTargetsLength = theTargets.length, 
	dataLinksLength = theLinks.length, 
	dataStreamsLength = theStreams.length, 
	streamLength1 = theStreams[0].pathways.length, 
	streamLength2 = theStreams[1].pathways.length, 
	streamLength3 = theStreams[2].pathways.length, 
	streamLength4 = theStreams[3].pathways.length;

// Constants	
const initFireflySize = 8; 	

// Quantities, values	
var fireflyCount = 0, currStream = 0, speedStep = 150;

var readyToGo = 0;	// Used to keep track of when all essentials objects are loaded and ready
	
// Arrays
var nodesOrbs = [], airplanes = [], targetOrbs = [], linksLines = [], theFireflies = [], tweenFireflies = [], tweenSet = [], 
	ii = [], setR = [], setG = [], initX1 = [], initY1 = [], initZ1 = [], tpwl = [], currNode = [], thePathway = [], thePathwayLength = [],
	globalTime = [0.0, 0.100];

var tarmacMesh, terminalsMesh, airplaneMesh, firefly, thePath, pathLines, linkLines,  
	fireflyTexture1, fireflyTexture2, fireflyTexture3, fireflyTexture4; 

// Booleans
var tweeningOn = false, firstPass = showUI = true;

// Offset amount from data array's x, y, z coordinates to align them properly relative to the center of the 3D scene (0, 0, 0), which is where the command tower is.
var offset_x = 77.5, offset_y = 2, offset_z = 415;

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
	camera.lookAt(scene.position);	
	
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
	
	loadTextureCircle();	
	//loadPlaneModel();

	createFirefly();
	
	loadFireflyTexture1();
	loadFireflyTexture2();
	loadFireflyTexture3();
	loadFireflyTexture4();
		
	drawLinksLines();
	
	//loadTarmacTexture();
	loadTarmac();
	loadTerminals();	
	
	commandTower();	
	//starS();
	//skyBG();
	
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

// Load texture for tarmac
function loadTarmacTexture() {
	textureloader.load(
		'img/texture/noise1.jpg',
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(24, 24);
			//loadTarmac(texture);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log('Error loading texture');
		}
	);	
}

// Load our tarmac model
//function loadTarmac(dirtTexture) {
function loadTarmac() {
	objLoader.load(
		'model/tarmac1.obj',
		function (object) {
			//material = new THREE.MeshPhongMaterial({color: 0x262a2e, shininess: 16, fog: true, map: dirtTexture, specularMap: dirtTexture});	
			//material = new THREE.MeshPhongMaterial({color: 0x152b40, shininess: 16, fog: true});	
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
			nodesOrbs[i].material.color.setRGB(0.3, 0.3, 0.3);
		
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

//			targetOrbs[i].material.color.setRGB(0.53, 0.8, 0.2);			
			targetOrbs[i].material.color.setRGB(0.93, 0, 0.53);			
			
			targetOrbs[i].visible = false;
			
			intersectGroup.add(targetOrbs[i]);
	}
	
	readyToGo += 1;
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
function loadFireflyTexture1() {
	textureloader.load(
		'img/texture/passenger.png',
		function (texture) {
			fireflyTexture1 = texture;
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

// Load texture for firefly (stream id = 1)
function loadFireflyTexture2() {
	textureloader.load(
		'img/texture/star.png',
		function (texture) {
			fireflyTexture2 = texture;
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

// Load texture for firefly (stream id = 2)
function loadFireflyTexture3() {
	textureloader.load(
		'img/texture/cargo.png',
		function (texture) {
			fireflyTexture3 = texture;
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

// Load texture for firefly (stream id = 3)
function loadFireflyTexture4() {
	textureloader.load(
		'img/texture/bag.png',
		function (texture) {
			fireflyTexture4 = texture;
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
function createFirefly() {
    var material = new THREE.SpriteMaterial({fog: true, transparent: true, depthWrite: false, depthTest: false});
    firefly = new THREE.Sprite(material);
    firefly.scale.set(initFireflySize, initFireflySize, initFireflySize);
}

// Reset everything and get current stream ready
function resetAssets() {
	tweeningOn = false;
	firstPass = true;

	for (var n = 0; n < dataTargetsLength; n++) {
		for (var s = 0; s < theTargets[n].streams.length; s++) {
			if (theTargets[n].streams[s] == currStream) {
				targetOrbs[n].visible = false;
			} 
		}	
	}			
	
	scene.remove(pathLines);
	pathLines = '';
	
	for (var i = 0; i < tweenSet.length; i++) {	
		for (var j = 0; j < tweenSet[i].length; j++) {	
			tweenSet[i][j].stop();
			tweenSet[i][j] = '';
		}	
		
		tweenSet[i] = '';
		tweenSet[i].length = 0;
		tweenSet.length = 0;
	}
	
	for (var i = 0; i < theFireflies.length; i++) {	
		scene.remove(theFireflies[i]);	
		theFireflies[i] = '';
	}
	
	theFireflies.length = 0;
}

function streamFireflies(currS) {
	//if (!showUI) resetAssets();	
	resetAssets();	

	currStream = currS;
			
	switch(currS) {
		case 0:
			fireflyCount = streamLength1;
			firefly.material.map = fireflyTexture1;
			break;
		case 1:
			fireflyCount = streamLength2;
			firefly.material.map = fireflyTexture2;
			break;
		case 2:
			fireflyCount = streamLength3;
			firefly.material.map = fireflyTexture3;
			break;
		case 3:
			fireflyCount = streamLength4;
			firefly.material.map = fireflyTexture4;
			break;			
		default:

	}

	firefly.material.needUpdate = true;
	
	for (var i = 0; i < fireflyCount; i++) {	
		theFireflies[i] = firefly.clone();
		scene.add(theFireflies[i]);
	
		animateFireflies(currStream, i, function() {
			var tweenLength = tweenSet[i].length;

			for (var j = 0; j < tweenLength; j++) {	
				if (tweenSet[i][j + 1])	{
					tweenSet[i][j].chain(tweenSet[i][j + 1]);	
				} else {
					tweenSet[i][tweenLength - 1].chain(tweenSet[i][0]);	
				}
			}

			tweenSet[i][0].start();
			tweeningOn = true;
			
			if (i == fireflyCount - 1) firstPass = false;
		});
	}	
	
	/*for (var n = 0; n < dataNodesLength; n++) {
		if (theNodes[n].type != 'Path Node') {	
			for (var s = 0; s < theNodes[n].streams.length; s++) {
				if (theNodes[n].streams[s].stream == currStream) {
					nodesOrbs[n].material.opacity = 1;
				}
			}	
		}
	}*/	
	
	for (var n = 0; n < dataTargetsLength; n++) {
		for (var s = 0; s < theTargets[n].streams.length; s++) {
			if (theTargets[n].streams[s] == currStream) {
				//targetOrbs[n].material.opacity = 1;
				targetOrbs[n].visible = true;
			} 
		}	
	}		
}

// theStreams are the Fireflies
function animateFireflies(row, ffly, callback) {
	// Note: theNodes is data.features[0].children	
	//       theStreams is data.features[3].children
	
	var lineGeom = new THREE.Geometry();	
	var lineMater = new THREE.LineBasicMaterial({color: 0xcccccc, transparent: true, opacity: 0.4, depthWrite: false, depthTest: false});	
	
	var indx = ffly;
	
	if (indx > (theStreams[row].pathways.length - 1)) indx = 0;
	
	thePath = theStreams[row].pathways[indx];
	thePathway[ffly] = thePath.split(',');
	thePathwayLength[ffly] = thePathway[ffly].length;
	
	var prevX = [], prevY = [], prevZ = [];
	prevX[0] = prevY[0] = prevZ[0] = x1 = y1 = z1 = x2 = y2 = z2 = 0;
	var prevIndx = pXYZ = 0;
	
	var node1 = parseInt(thePathway[ffly][0]);
	
	theFireflies[ffly].position.x = x1 = initX1[ffly] = theNodes[node1].y - offset_x, 
	theFireflies[ffly].position.y = y1 = initY1[ffly] = theNodes[node1].z + offset_y, 
	theFireflies[ffly].position.z = z1 = initZ1[ffly] = theNodes[node1].x - offset_z;
	
	ii[ffly] = 0, setR[ffly] = 0.9, setG[ffly] = 0.1, tpwl[ffly] = 0;
	
	tweenSet[ffly] = [];
	
	for (var i = 0; i < thePathwayLength[ffly]; i++) {	
		if (thePathway[ffly][i + 1]) {
			var node2 = parseInt(thePathway[ffly][i + 1]);	
		} else {
			var node2 = parseInt(thePathway[ffly][i]);	
		}
		
		tpwl[ffly] += 1;
	}
	
	for (var i = 0; i < thePathwayLength[ffly]; i++) {	
		if (thePathway[i + 1]) {
			var node2 = parseInt(thePathway[ffly][i + 1]);	
		} else {
			var node2 = parseInt(thePathway[ffly][i]);	
		}
				
		if (node2 < dataNodesLength) {
			x2 = theNodes[node2].y - offset_x, 
			y2 = theNodes[node2].z + offset_y, 
			z2 = theNodes[node2].x - offset_z;		
		} else if (i == thePathwayLength[ffly] - 1) {		// This is tha last stop (a Target) of the firefly
			theTargets.filter(function(d) {
				if (d.id == node2) {
					x2 = d.y - offset_x, 
					y2 = d.z + offset_y, 
					z2 = d.x - offset_z;
				}
			});
		}

			if (i == thePathwayLength[ffly]) {
				x2 = initX1[ffly];
				y2 = initY1[ffly];
				z2 = initZ1[ffly];
			}
			
			var startXY = {x: x1, y: y1, z: z1}, 
				endXY = {x: x2, y: y2, z: z2}, 
				distance = (Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1)) / 3, 
				duration = speedStep * distance;

			tweenFireflies[i] = new TWEEN.Tween(theFireflies[ffly].position)
				.to(endXY, duration)
				//.delay(200)
				/*.onStart(function() {

				})*/
				.onUpdate(function() {
					//var timer = Date.now();
					
				})
				//.onComplete(komplete);
				.onComplete(function() {
					currNode[ffly] = parseInt(thePathway[ffly][ii[ffly]]);
						
					if (currNode[ffly] < dataNodesLength) {
						if (theNodes[currNode[ffly]].type != "Path Node") {	
							if (tweenFireflies[ii[ffly] + 1]) tweenFireflies[ii[ffly] + 1].delay(Math.random() * 800 + 100);
						
							setR[ffly] -= 0.05;
							setG[ffly] += 0.05;
							if (setR[ffly] < 0) setR[ffly] = 0;
							if (setG[ffly] > 1.0) setG[ffly] = 1.0;
							
							var secVal = 0;
							
							if (theNodes[currNode[ffly]].streams[currStream]) {
								var gtLength = Math.abs((globalTime[1] - globalTime[0]) * theNodes[currNode[ffly]].streams[currStream].sec.length) + 1;
								
								for (var t = 0; t < gtLength; t++) {	
									secVal += theNodes[currNode[ffly]].streams[currStream].sec[t];
								}
								
								secVal /= gtLength;
							} 
							
							
							var scale = secVal * theFireflies[ffly].scale.x * 0.001;	// Shrink the firefly based on "sec" value of chosen stream and index
							
							if ((theFireflies[ffly].scale.x - scale) > 0) {
								theFireflies[ffly].scale.x -= scale;
								theFireflies[ffly].scale.y -= scale;
								theFireflies[ffly].scale.z -= scale;
							} else {
								theFireflies[ffly].scale.x = 0.01;
								theFireflies[ffly].scale.y = 0.01;
								theFireflies[ffly].scale.z = 0.01;							
							}
						
							// Calculate speed of a Firefly on a certain stream
							if (theNodes[currNode[ffly]].streams[currStream]) {
								duration -= theNodes[currNode[ffly]].streams[currStream].vel[ffly];
							}
							
							// Calculate color of Nodes when Fireflies pass them
							//var nodeR = 0.75 - secVal * 0.005,
								//nodeB = 0.25 + secVal * 0.005;							
							//var nodeR = (100 - secVal) * 0.01,
							var nodeB = secVal * 0.01, 
								nodeR = 1 - nodeB;
							//console.log(secVal + ' ' + nodeR + ' ' + nodeB);
							
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
							}
							
							nodesOrbs[currNode[ffly]].material.color.r = nodeR;
							nodesOrbs[currNode[ffly]].material.color.g = 0.2;
							nodesOrbs[currNode[ffly]].material.color.b = nodeB;
						}
					}
					
					ii[ffly] += 1;			
					
					// Calculate color of Targets when Fireflies pass them
					if (ii[ffly] == tpwl[ffly]) {
						var nodeR2 = theFireflies[ffly].scale.x / initFireflySize,
							nodeB2 = 1 - nodeR2;
								
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
							
						if (currNode[ffly] >= dataNodesLength) {
							targetOrbs[currNode[ffly] - dataNodesLength].material.color.r = nodeR2;
							targetOrbs[currNode[ffly] - dataNodesLength].material.color.g = nodeB2;						
							targetOrbs[currNode[ffly] - dataNodesLength].material.color.b = 0.25;							
						}
						
						theFireflies[ffly].position.set(initX1[ffly], initY1[ffly], initZ1[ffly]);
						theFireflies[ffly].scale.set(initFireflySize, initFireflySize, initFireflySize);		
				
						ii[ffly] = 0, setR[ffly] = 0.9, setG[ffly] = 0.1;		
					}		
	
				});	
			//.start();	
			
			tweenSet[ffly].push(tweenFireflies[i]);		
			//tweenSet[ffly][i] = tweenFireflies[i];		

			x1 = x2;
			y1 = y2;
			z1 = z2;				
		
		if (firstPass) lineGeom.vertices.push(new THREE.Vector3(x1, y1, z1));			
	}

	if (firstPass) {
		pathLines = new THREE.Line(lineGeom, lineMater);
		scene.add(pathLines);	
	}	
	
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
		'img/texture/star3.png',
		function (texture) {	
			for ( var i = 0; i < 1200; i += 3 ) {
				var vertex = new THREE.Vector3();
				do {
					vertex.x = Math.random() * 4000 - 2000;
					vertex.y = Math.random() * 4000 - 2000;
					vertex.z = Math.random() * 4000 - 2000;		
				} while (vertex.length() > 4000 || vertex.length() < 2000 || vertex.y < 10);
					
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

function animate() {
	requestAnimationFrame(animate);
	
	var timer = Date.now();

	// Ready to stream
	if ((readyToGo == 6) && (showUI)) {
		tempUI.style.display = "block";
	
		showUI = false;
	}

	if (tweeningOn) {
		TWEEN.update();
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





