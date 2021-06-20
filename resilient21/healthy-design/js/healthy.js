/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	container = document.getElementById('container'), gear = document.getElementById("gear"), kontrols = document.getElementById("kontrols"), 
	klose = document.getElementById("klose"), kamera = document.getElementById("kamera"), kamView = document.getElementById("view"), kategory = document.getElementById("kategory"), 
	renderer, camera, scene, spotL, controls, stats, lookAtScene = kon = kos = orthographicMode = false, zoom = 1.0, mergedMesh, icon1, icon2, icon3, icon4, icon5;

// Constants
const 	floorposY = -3.5, 
		dataLength = HealthyDesignData.features.length,
		oneUnit = .2,	// width and length of a unit of bar
		oneUnitY = .02,	// height of a unit of bar
		spacing = 0.8;	// spacing of the 17 stacked bars of a point

var ageMaleLoaded = ageFemaleLoaded = incomeLoaded = rentalLoaded = insuranceYoungLoaded = insuranceYoungAdultLoaded = 
	insuranceAdultLoaded = insuranceElderLoaded = commutingMethodLoaded = commutingTimeLoaded = foodStampsDisabilityLoaded = 
	languageYoungLoaded = languageAdultLoaded = languageElderLoaded = educationLoaded = familyStructureLoaded = raceLoaded = false;
		
var loader = new THREE.TextureLoader();		
var clock = new THREE.Clock();
//var	mouseVector = new THREE.Vector3();
//var geometry = new THREE.BufferGeometry();
var categories = [], categoryMesh = [];
//var geometry = new THREE.BoxGeometry(oneUnit, oneUnitY, oneUnit);
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
var	ageMaleColor = [0xfeff32, 0xfeff1c, 0xfeff05, 0xedee00, 0xd7d700, 0xc0c000, 0xa9aa00, 0x939300, 0x7c7c00, 0x656600],
	ageFemaleColor = [0xfffd32, 0xfffd1c, 0xfffd05, 0xeeec00, 0xd7d500, 0xc0bf00, 0xaaa800, 0x939200, 0x7c7b00, 0x666500], 
	incomeColor = [0xfef630, 0xfef514, 0xf5ec00, 0xd9d100, 0xbdb600, 0xa09b00, 0x847f00, 0x686400], 
	rentalColor = [0xfcee34, 0xfcec1b, 0xfbe902, 0xe2d202, 0xc9bb02, 0xb0a402, 0x978c01, 0x7e7501, 0x665e01], 
	insuranceYoungColor = [0xfadd1d, 0xc7ae04, 0x7d6d02], 
	insuranceYoungAdultColor = [0xf7cb1f, 0xc59e06, 0x7c6304], 
	insuranceAdultColor = [0xf5b722, 0xc38c08, 0x7a5805], 	
	insuranceElderColor = [0xf2a125, 0xc0780b, 0x794c07], 
	commutingMethodColor = [0xf1963f, 0xef8928, 0xed7d11, 0xd5700f, 0xbe640d, 0xa6570c, 0x8f4b0a, 0x773f08, 0x603206], 
	commutingTimeColor = [0xed813f, 0xea6d21, 0xd85d13, 0xbb5010, 0x9d440e, 0x7f370b, 0x612a08], 
	foodStampsDisabilityColor = [0xe96437, 0xd24516, 0x9e3410, 0x6b230b], 
	languageYoungColor = [0xe7553e, 0xde341a, 0xb62b15, 0x8d2111, 0x65170c], 	
	languageAdultColor = [0xe54341, 0xdb201d, 0xb31a18, 0x8b1412, 0x630e0d], 	
	languageElderColor = [0xec3a48, 0xe31525, 0xba111e, 0x910d18, 0x670911], 
	educationColor = [0xf63a53, 0xf5223e, 0xf30b29, 0xdb0925, 0xc30821, 0xab071d, 0x920619, 0x7a0515, 0x620410], 
	familyStructureColor = [0xfd2349, 0xe60229, 0xae011f, 0x750115], 
	raceColor = [0xff0532, 0x93001a];
	
for (i = 0; i < 17; i++) {
	categories[i] = new THREE.Geometry();
	//categories[i] = new THREE.Group();	
	//console.log(categories[i]);
}
	
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
	camera = new THREE.PerspectiveCamera(60, ww/wh,  1, 10000);
	//camera = new THREE.CombinedCamera(ww / 2, wh / 2, 40, 1, 1000, -500, 1000);
	//camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, -500, 1000);
	camera.position.set(0, 20, 200);
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

	loadIcons();
	//thePolice();
	//theSchools();

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
		'img/map/la-disp.jpg',
		function (texture) {
			var geometry = new THREE.PlaneBufferGeometry(460, 460, 96, 96);
			//var material = new THREE.MeshPhongMaterial({color: 0x4c4640, shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 0.6});
			var material = new THREE.MeshPhongMaterial({shininess: 3, map: tex, displacementMap: texture, displacementScale: 35.0, transparent: true, opacity: 1.0});
			var terrain = new THREE.Mesh(geometry, material);
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
	var pixelZ = Math.cos(lat) * Math.sin(lon) * magnitude + 40770;
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
	

function loadIcons() {
	loader.load(
		'img/badge.png',
		function (texture) {
			icon1 = texture;
			thePolice();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}	
	
function thePolice() {
	loader.load(
		'img/toga.png',
		function (texture) {
			icon2 = texture;
			theSchools();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}	

function theSchools() {
	loader.load(
		'img/child.png',
		function (texture) {
			icon3 = texture;
			theClinic();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}	

function theClinic() {
	loader.load(
		'img/pill.png',
		function (texture) {
			icon4 = texture;
			theHousing();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}	

function theHousing() {
	loader.load(
		'img/house.png',
		function (texture) {
			icon5 = texture;
			theHospital();
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}	

function theHospital() {
	loader.load(
		'img/cross.png',
		function (texture) {
			for ( var i = 0; i < dataLength; i++ ) {
				var material = new THREE.SpriteMaterial({map: icon1, fog: true, depthWrite: false, depthTest: false});
				var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);				
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Police Station")) {
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					//sprite.position.set((latlong.x-52.5), 0, latlong.z-101.5);
					//sprite.position.normalize();
					//sprite.position.multiplyScalar( 80 );
					//sprite.position.y = 2 * Math.random() + 4;
					scene.add(sprite);
				}
				
				material = new THREE.SpriteMaterial({map: icon2, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "School")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					scene.add(sprite);
				}	
				
				material = new THREE.SpriteMaterial({map: icon3, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Head Start")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					scene.add(sprite);
				}					
				
				material = new THREE.SpriteMaterial({map: icon4, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Clinic")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					scene.add(sprite);
				}		

				material = new THREE.SpriteMaterial({map: icon5, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Public Housing")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					scene.add(sprite);
				}								

				material = new THREE.SpriteMaterial({map: texture, fog: true, depthWrite: false, depthTest: false});
				
				if ((HealthyDesignData.features[i].geometry.type == 'Point') && (HealthyDesignData.features[i].properties.Type == "Hospital")) {
					//var xyPos = LatLonToPixelXY(HealthyDesignData.features[i].geometry.coordinates[1], HealthyDesignData.features[i].geometry.coordinates[0]);
					var sprite = new THREE.Sprite(material);
					sprite.position.set(xyPos.x, 0, xyPos.z);
					scene.add(sprite);
				}				
				
				if (HealthyDesignData.features[i].geometry.type == 'Point') {
//					console.log(HealthyDesignData.features[i].properties.Type);
				}
			}
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
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
	
function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
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
	if (lookAtScene) camera.lookAt(scene.position);

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
