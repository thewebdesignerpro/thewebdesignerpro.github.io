/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
   
const floorPosY = -24, rnd1 = Math.random(Math.PI); 
var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, pis=0, pif=1, ntro = true, 
	renderer, camera, scene, controls, stats, mater;
var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0';
var cameraO, sceneRT, uniformsNoise, uniformsNormal, uniformsTerrain, heightMap, normalMap, quadTarget, directionalLight, pointLight, terrain, textureLoader;
var textureCounter=animDelta=lightVal=0, animDeltaDir=lightDir=1, emitter, particleGroup;
var mlib = {};
var clock = new THREE.Clock();
var	munG = new THREE.Group(); 	
		
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
document.getElementById('pinfo2').style.opacity = cntnr.style.opacity = 0;

if (! Detector.webgl) Detector.addGetWebGLMessage();

function init() {
	cameraO = new THREE.OrthographicCamera(ww/-2, ww/2, wh/2, wh/-2, -10000, 10000);
	cameraO.position.z = 100;
	sceneRT = new THREE.Scene();	
	sceneRT.add(cameraO);
	camera = new THREE.PerspectiveCamera(45, ww/wh, 1, 10000);
	camera.position.set(-1500, 300, 0);
	scene = new THREE.Scene();
	camera.lookAt(scene.position);	
	scene.fog = new THREE.Fog(0x202326, 2000, 4000);
	
	scene.add(new THREE.AmbientLight(0x151515));
	pointLight = new THREE.PointLight(0xffffff, 6, 2600);
	pointLight.position.set(1900, 800, 0);
	scene.add( pointLight );
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	//renderer.setClearColor(0x000000, 1);
	renderer.setClearColor(scene.fog.color);
	renderer.shadowMap.enabled = true;
	//renderer.shadowMapSoft = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.sortObjects = false;
	
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
	controls.minDistance = 200;
	controls.maxDistance = 2600;	
	//controls.minPolarAngle = Math.PI/3;	
	controls.maxPolarAngle = Math.PI/2;
	
	initTerr();
	initParticles();
	mun();
	animate();
}	

function initTerr() {
	var normalShader = THREE.NormalMapShader;
	var rx = 256, ry = 256;
	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
	heightMap  = new THREE.WebGLRenderTarget(rx, ry, pars);
	heightMap.texture.generateMipmaps = false;
	normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
	normalMap.texture.generateMipmaps = false;
	uniformsNoise = {
		time: { value: 1.0 },
		scale: { value: new THREE.Vector2(1.5, 1.5) },
		offset: { value: new THREE.Vector2(0, 0) }
	};
	uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms);
	uniformsNormal.height.value = 0.05;
	uniformsNormal.resolution.value.set(rx, ry);
	uniformsNormal.heightMap.value = heightMap.texture;
	var vertexShader = document.getElementById('vertexShader').textContent;
	var loadingManager = new THREE.LoadingManager( function(){ terrain.visible = true; });
	textureLoader = new THREE.TextureLoader(loadingManager);
	var specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
	specularMap.texture.generateMipmaps = false;
	var diffuseTexture1 = textureLoader.load("imj/shade/tubig.jpg");
	var detailTexture = textureLoader.load("imj/shade/tubigN.jpg");
	diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
	detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
	specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;
	var terrainShader = THREE.ShaderTerrain["terrain"];
	uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
	uniformsTerrain['tNormal'].value = normalMap.texture;
	uniformsTerrain['uNormalScale'].value = 2;
	uniformsTerrain['tDisplacement'].value = heightMap.texture;
	uniformsTerrain['tDiffuse1'].value = diffuseTexture1;
	uniformsTerrain['tSpecular'].value = specularMap.texture;
	uniformsTerrain['tDetail'].value = detailTexture;
	uniformsTerrain['enableDiffuse1'].value = true;
	uniformsTerrain['enableDiffuse2'].value = true;
	uniformsTerrain['enableSpecular'].value = true;
	uniformsTerrain['diffuse'].value.setHex(0xffffff);
	uniformsTerrain['specular'].value.setHex(0xffffff);
	uniformsTerrain['shininess'].value = 45;
	uniformsTerrain['uDisplacementScale'].value = 90;
	uniformsTerrain['uRepeatOverlay'].value.set(6, 6);
	var params = [
		['heightmap', document.getElementById('fragmentShader').textContent, vertexShader, uniformsNoise, false],
		['normal', normalShader.fragmentShader,  normalShader.vertexShader, uniformsNormal, false],
		['terrain', terrainShader.fragmentShader, terrainShader.vertexShader, uniformsTerrain, true]
	];
	for(var i = 0; i < params.length; i++) {
		material = new THREE.ShaderMaterial({
			uniforms: params[i][3],
			vertexShader: params[i][2],
			fragmentShader: params[i][1],
			lights:	params[i][4],
			fog: true
		});
		mlib[params[i][0]] = material;
	}
	var plane = new THREE.PlaneBufferGeometry(ww, wh);
	quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ color: 0x000000 }));
	quadTarget.position.z = -500;
	sceneRT.add(quadTarget);
	var geometryTerrain = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256);
	THREE.BufferGeometryUtils.computeTangents(geometryTerrain);
	terrain = new THREE.Mesh(geometryTerrain, mlib['terrain']);
	terrain.position.set(0, -120, 0);
	terrain.rotation.x = -Math.PI / 2;
	terrain.visible = false;
	scene.add(terrain);
}

function initParticles() {
    particleGroup = new SPE.Group({
        texture: {
			value: textureLoader.load("imj/shade/cloud10.png")
        },
        blending: THREE.NormalBlending,
		//depthWrite: false, 
		//depthTest: false, 
        fog: true
    });
	emitter = new SPE.Emitter({
        particleCount: 700,
        maxAge: {
            value: 60
        },
		position: {
			value: new THREE.Vector3(2000, 300, 0),
            spread: new THREE.Vector3(2000, 500, 4000)
        },
		velocity: {
			value: new THREE.Vector3(-60, 0, 0)
        },
        wiggle: {
			spread: 800
        },
        size: {
			value: 1700,
			spread: 500
		},
        opacity: {
			value: [0, .2, 0]
		},
        color: {
			value: new THREE.Color(.4, .4, .4),
			spread: new THREE.Color(0.1, 0.1, 0.1)
		},
        angle: {
			value: [0, Math.PI * 0.125]
		}
	});
	particleGroup.addEmitter(emitter);
    scene.add(particleGroup.mesh);
}
				
function mun() {
	textureLoader.load('imj/shade/transp1.png', function (tex) {
		mun2(tex);
		}, function (xhr) {}, function (xhr) {}
	);		
}	

function mun2(alfa) {	
	textureLoader.load('imj/mun.jpg', function (tex2) {
		var mater = new THREE.MeshPhongMaterial({ map: tex2, emissive: 0x3c3c3c, transparent: true, alphaMap: alfa, fog: false});
		var mun = new THREE.Mesh( new THREE.SphereGeometry(900, 24, 24), mater);
		mun.position.set(4000, 500, 0);
		mun.rotation.y = Math.PI/-2;
		mun.castShadow = false;
		mun.receiveShadow = true;
		munG.add( mun );	
		mun3(alfa);
		}, function ( xhr ) {}, function ( xhr ) {}
	);	
}

function mun3(alfa) {		
	textureLoader.load('imj/arw2.png', function (tex3) {
		var geom2 = new THREE.PlaneGeometry(5000, 4000);
		var mater = new THREE.MeshPhongMaterial({ map: tex3, color: 0xf8f8f8, emissive: 0x999999, transparent: true, opacity: 0.65, alphaMap: alfa, fog: false });
		var arw2 = new THREE.Mesh(geom2, mater);
		arw2.position.set(4450, 600, 0);
		arw2.rotation.y = Math.PI/-2;
		arw2.castShadow = false;
		arw2.receiveShadow = false;
		munG.add(arw2);		
		scene.add(munG);				
		}, function ( xhr ) {}, function ( xhr ) {}
	);	
}

function animate() {
	requestAnimationFrame(animate);
	var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		if (pif>0) {
			pif -= 0.001;
			document.getElementById('pinfo2').style.opacity = pif;
			cntnr.style.opacity = 1-pif;
		} else {
			document.getElementById('pinfo2').style.opacity = 0;
			document.getElementById('pinfo2').style.display = 'none';
			cntnr.style.opacity = 1;
			
			var aud = document.getElementById('aud'); 
			//document.getElementById('aud').volume = .8;
			//document.getElementById('aud').play();
			aud.volume = .8;
			//aud.pause(); 
			
			var promised = aud.play();
			if (promised) {
				//promised.then(function() { console.log('played'); })
				promised.catch(function(error) { 
					//aud.play(); console.log('play'); 
					var tempDiv = document.createElement("div");                 
					tempDiv.id = "noAud"; 
					//tempDiv.innerHTML = "MUSIC OFF";  
					tempDiv.innerHTML = "UNMUTE";  
					tempDiv.style.display = "block"; 
					tempDiv.style.position = "absolute";
					tempDiv.style.margin = "auto";					
					tempDiv.style.top = "60%"; 
					tempDiv.style.bottom = tempDiv.style.left = tempDiv.style.right = "0"; 
					tempDiv.style.width = "160px";
					tempDiv.style.height = "48px";
					tempDiv.style.lineHeight = "44px";
					tempDiv.style.fontSize = "24px"; 
					tempDiv.style.textAlign = "center"; 
					tempDiv.style.color = "rgba(255, 255, 255, 0.7)";
					tempDiv.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
					tempDiv.style.border = "2px solid rgba(255, 255, 255, 0.7)";
					tempDiv.style.cursor = "pointer"; 

					container.addEventListener( 'click', containerClick, false ); 
					//container.click(); 
					container.appendChild(tempDiv); 
				});
				//promised.catch(function(error) { console.error(error); });
				//promised.catch(() => { aud.play(); aud.volume = .8; console.log('play'); })
			}			
			
			ntro = false;
		}
	}	
	if (terrain.visible) {
		var time = Date.now() * 0.001;
		animDelta = THREE.Math.clamp(animDelta + 0.00075 * animDeltaDir, 0, 0.03);
		uniformsNoise['time'].value += delta * animDelta;
		uniformsNoise['offset'].value.x += delta * 0.03;
		uniformsTerrain['uOffset'].value.x = 3 * uniformsNoise['offset'].value.x;
		quadTarget.material = mlib['heightmap'];
		renderer.render(sceneRT, cameraO, heightMap, true);
		quadTarget.material = mlib['normal'];
		renderer.render(sceneRT, cameraO, normalMap, true);
	}	
	camera.position.x += Math.sin(timer*.18) * .2;
	camera.position.y += Math.cos(timer*.22) * .3;
	camera.position.z += Math.sin(timer*.25) * .5;					
	munG.position.x -= Math.sin(timer*.18) * .2;
	munG.position.y -= Math.cos(timer*.22) * .3;
	munG.position.z -= Math.sin(timer*.25) * .5;				
	render(delta);
}

function render(dt) {
	particleGroup.tick(dt);
	//camera.lookAt(scene.position);
	controls.update();	
	renderer.render(scene, camera);	
}

if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	

function containerClick(e) {
	e.preventDefault();
	
	document.getElementById('aud').play();	
	
	//console.log('play');
	
	container.removeEventListener( 'click', containerClick, false ); 
	
	noAud.parentNode.removeChild(noAud);	
}


	

