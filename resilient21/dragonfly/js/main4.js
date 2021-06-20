/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
//(function(){

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, terrain, 
	icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, iconsObj = [], scale = 0.01, raycaster, mouse = new THREE.Vector2(), INTERSECTED = null, textHeight = 0, 
	pointclouds, threshold = 0.1, tTip, geometry, material, vertices, starS, starGeom, starMater, starS2, starGeom2, starMater2, arw2, wireframe;

// Shorthands. theStreams are the Fireflies
var theNodes = data.features[0].children, theTargets = data.features[1].children, theLinks = data.features[2].children, theStreams = data.features[3].children;

var airportMesh, airplaneMesh, dataTargetsLength, dataNodesLength, dataLinksLength, dataStreamsLength, firefly, thePath, thePathway, thePathwayLength;

// Arrays
var nodesOrbs = [], airplanes = [], airplaneOrbs = [], linksLines = [], thePassengers = [], tweenPassengers = [];

var airportObjLoaded = false;

// Offset amount from data array's x, y, z coordinates to align them properly relative to the center of the 3D scene (0, 0, 0), which is where the command tower is.
var offset_x = 77.5, offset_y = 2, offset_z = 415;
	
var	cntnr = document.getElementById('container');	
	
//const floorposY = 0; 

var	group = new THREE.Group(); 	
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
	camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	camera.position.set(0, 50, 200);
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

	createOrbsNodes();
	
	//loadPlaneModel();
	createOrbsTargets();
	
	drawLinksLines();
	
	loadTextureFirefly();
	
	commandTower();
	
	//raycaster = new THREE.Raycaster();
	//raycaster.params.Points.threshold = threshold;
	
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
		'model/airport2.obj',
		// Function when resource is loaded
		function (object) {
			//var material = new THREE.MeshPhongMaterial({shininess: 15, color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true, side: THREE.DoubleSide});	
			//material = new THREE.MeshLambertMaterial({color: 0x1d2832, map: dirtTexture, specularMap: dirtTexture, fog: true, transparent: true});	
			material = new THREE.MeshLambertMaterial({color: 0x1b2733, fog: true});	
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
			airportMesh.rotation.y = -1.56;
			//airportMesh.position.set(-2.7, -5.2, 16);
			airportMesh.position.set(-2.7, -1, 16);
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

// Add the Nodes orbs
function createOrbsNodes() {
	dataNodesLength = theNodes.length;  // Note: theNodes is data.features[0].children
	//console.log(dataLength);
	
	var geometry = new THREE.SphereBufferGeometry(0.25, 32, 32);

	for (var i = 0; i < dataNodesLength; i++) {
		var x = theNodes[i].y - offset_x, 
			y = theNodes[i].z + offset_y, 
			z = theNodes[i].x - offset_z;
			
		//var name = theNodes[i].name, 
			//targetType = name.split(' ');
		
		//if (targetType[0] != 'Cargo') {
			//console.log(theTargets[i].name);
			
		if (theNodes[i].type != "Path Node") {	
			if ((theNodes[i].streams < 2) || (theNodes[i].streams == '')) {
				var material = new THREE.MeshBasicMaterial({color: 0x8ec640});
			} else {
				var material = new THREE.MeshBasicMaterial({color: 0xec008c});
			}
			
			nodesOrbs[i] = new THREE.Mesh(geometry, material);			
			//nodesOrbs[i] = sphere.clone();
			nodesOrbs[i].position.set(x, y, z);
		
			scene.add(nodesOrbs[i]);
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
			var material = new THREE.MeshPhongMaterial({color: 0x555555, shininess: 20, side: THREE.DoubleSide, fog: true, transparent: true, opacity: 0.4});	
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
		
			createOrbsTargets();
		}
	);
}

// Add the airplanes and orbs
function createOrbsTargets() {
	dataTargetsLength = theTargets.length;  // Note: theTargets is data.features[1].children
	//console.log(dataLength);
	
	var geometry = new THREE.SphereBufferGeometry(0.6, 32, 32);

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
			airplanes[i].position.set(x, y, z);
			*/

			if ((theTargets[i].streams < 2) || (theTargets[i].streams == '')) {
				var material = new THREE.MeshBasicMaterial({color: 0x8cc63f});
			} else {
				var material = new THREE.MeshBasicMaterial({color: 0xeb038c});
			}
			
			airplaneOrbs[i] = new THREE.Mesh(geometry, material);			
			//airplaneOrbs[i] = sphere.clone();
			airplaneOrbs[i].position.set(x, y + offset_y, z);
		
			//airplaneOrbs[i].material.color = 0xff0044;
			
			//scene.add(airplanes[i]);
			scene.add(airplaneOrbs[i]);
		//}
	}
}

// Draw the lines between Nodes using Links endpoints
function drawLinksLines() {
	dataLinksLength = theLinks.length;  // Note: theLinks is data.features[2].children
	
	var material = new THREE.LineBasicMaterial({color: 0x00bbff, transparent: true, opacity: 0.45});

	for (var i = 0; i < dataLinksLength; i++) {
		var endpointsLength = theLinks[i].endpoints.length;
		var geometry = new THREE.Geometry();		
		
		if (endpointsLength > 0) {
			for (var j = 0; j < endpointsLength; j++) {
				// Search x, y, z coordinates from Nodes using id==endpoint
				/*theNodes.filter(function(d) {
					if (d.id == theLinks[i].endpoints[j]) {
						geometry.vertices.push(new THREE.Vector3(d.y - offset_x, d.z, d.x - offset_z));	
				
					}
				});*/
			
				// Search x, y, z coordinates from Nodes using endpoint as index

				var k = theLinks[i].endpoints[j];
				
				if (k < dataNodesLength) {
					var	x = theNodes[k].y - offset_x, 
						y = theNodes[k].z + offset_y, 
						z = theNodes[k].x - offset_z;
				
					//console.log(theNodes[k].id);
					geometry.vertices.push(new THREE.Vector3(x, y, z));	
				}
			}
		
			linksLines[i] = new THREE.Line(geometry, material);
			scene.add(linksLines[i]);			
			//var lines = new THREE.Line(geometry, material);
			//scene.add(lines);		
		} 
		//else { console.log('er') }
	}
}

// Load texture for fireflies
function loadTextureFirefly() {
	textureloader.load(
		'img/texture/star.png',
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
    var material = new THREE.SpriteMaterial({map: tex, color: 0xff00bb, fog: true, transparent: true});
    firefly = new THREE.Sprite(material);
    firefly.scale.set(10, 10, 10);
	//scene.add(firefly);	
	
	streamPassengers();
}

function streamPassengers() {
	thePassengers[0] = firefly.clone();
	scene.add(thePassengers[0]);

	animatePassengers();
}

function animatePassengers() {
	// theStreams is data.features[3].children
	
	var indx = Math.round(Math.random() * (theStreams[0].pathways.length - 1));
	thePath = theStreams[0].pathways[indx];
	thePathway = thePath.split(',');
	thePathwayLength = thePathway.length;
	//console.log(thePathway[1]);	
	// thePathway[0]
	
	var node1 = parseInt(thePathway[0]);
	var	x1 = theNodes[node1].y - offset_x, 
		y1 = theNodes[node1].z + offset_y, 
		z1 = theNodes[node1].x - offset_z;
	
	for (var i = 0; i < thePathwayLength - 1; i++) {	

	var node2 = parseInt(thePathway[i + 1]);	
				
	if (node2 < dataNodesLength) {

	//console.log(node2);
	var	x2 = theNodes[node2].y - offset_x, 
		y2 = theNodes[node2].z + offset_y, 
		z2 = theNodes[node2].x - offset_z;		
/*	var node2 = parseInt(thePathway[1]);
	var	x2 = theNodes[node2].y - offset_x, 
		y2 = theNodes[node2].z + offset_y, 
		z2 = theNodes[node2].x - offset_z;	*/
	
	//console.log(x1 + ' ' + y1 + ' ' + z1 + ' ' + x2 + ' ' + y2 + ' ' + z2); 
	var startXY = {x: x1, y: y1, z: z1}, 
		endXY = { x: x2, y: y2, z: z2 };
	
	//tweenPassengers[0] = new TWEEN.Tween(startXY)
	tweenPassengers[i] = new TWEEN.Tween(startXY)
		.to(endXY, 1000)
		.onUpdate(function() {
			//console.log(this.x, this.y);
			thePassengers[0].position.set(this.x, this.y, this.z);
		})
		.onComplete(function() {
			//x1 = x2;
			//y1 = y2;
			//z1 = z2;		
		});
		//.start();	
	
		x1 = x2;
		y1 = y2;
		z1 = z2;		
		}
	}

/*	var	x1 = theNodes[thePathway[1]].y - offset_x, 
		y1 = theNodes[thePathway[1]].z + offset_y, 
		z1 = theNodes[thePathway[1]].x - offset_z;
	var	x2 = theNodes[thePathway[9]].y - offset_x, 
		y2 = theNodes[thePathway[9]].z + offset_y, 
		z2 = theNodes[thePathway[9]].x - offset_z;	
	
	var startXY = {x: x1, y: y1, z: z1}, 
		endXY = { x: x2, y: y2, z: z2 };
	tweenPassengers[1] = new TWEEN.Tween(startXY)
		.to(endXY, 4000)
		.onUpdate(function() {
			thePassengers[0].position.set(this.x, this.y, this.z);
		})
		.onComplete(function() {
			//x1 = x2;
			//y1 = y2;
			//z1 = z2;		
		});		
*/		
		
	for (var i = 0; i < thePathwayLength; i++) {	
		if (tweenPassengers[i + 1])	tweenPassengers[i].chain(tweenPassengers[i + 1]);	
	}
	
	//tweenPassengers[0].chain(tweenPassengers[1]);	
	//tweenPassengers[1].chain(tweenPassengers[0]);	
	
	tweenPassengers[0].start();
}


// Add command tower, located at the center of the scene
function commandTower() {
	var geometry = new THREE.CylinderBufferGeometry(0.8, 1.6, 6, 8);
	var material = new THREE.MeshBasicMaterial({color: 0xaabbcc, transparent: true, opacity: 0.5});
	
	var commandTowerMesh = new THREE.Mesh(geometry, material);
	commandTowerMesh.position.y = 1;
	scene.add(commandTowerMesh);
}


function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function onDocumentMouseMove(event) {
	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	//mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

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
//document.addEventListener('mousemove', onDocumentMouseMove, false);

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
	var delta = clock.getDelta(),
	time = clock.getElapsedTime() * 10;
					
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
	
	//thePassengers[0].material.opacity = Math.sin(timer * 0.006);
	thePassengers[0].scale.x += Math.sin(timer * 0.005);
	thePassengers[0].scale.y += Math.sin(timer * 0.005);
	thePassengers[0].scale.z += Math.sin(timer * 0.005);	
	
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





