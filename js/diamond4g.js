/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, x = y = z = pis = 0, pif = 1, ntro = true, bebe, bebe2, bebe3, bebe4, anima0, anima1, anima2, anima3, startT = Date.now(), oldT = 0, frame, animp, diamond, diamondR, diamondW, diamondB, dglow;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
//document.getElementById( 'optn' ).style.opacity = 0;

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var container = document.getElementById('container');
container.style.background = '#0a0c0e';

//var tri = THREE.ImageUtils.loadTexture('imj/tri1.png', undefined, bB);

var camera = new THREE.PerspectiveCamera( 50, ww/wh,  0.1, 110000 );
camera.position.set(0, 3, 12);
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x0a0c0e, 0.015 );
camera.lookAt( scene.position );

var ambL = new THREE.AmbientLight( 0x444444 );
scene.add( ambL );

//var spotL = new THREE.SpotLight( 0xffffff, 5, 150, Math.PI/4 );
var spotL = new THREE.SpotLight( 0xffffff, 10, 110, Math.PI/4 );
//var spotL = new THREE.SpotLight( 0xffffff, 1, 100, Math.PI/4 );
spotL.position.set( 0, 80, 0 );
//spotL.position.set( 0, 10, 0 );
spotL.castShadow = true;
//spotL.shadowOnly = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.1;
spotL.shadowCameraNear = 40;
//spotL.shadowCameraNear = 5;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 45;
//spotL.shadowCameraVisible = true;
scene.add( spotL );
spotL.lookAt(scene.position);
var spotLightHelper = new THREE.SpotLightHelper( spotL );
//scene.add( spotLightHelper );

var pointL = new THREE.PointLight( 0xffffff, 3, 100 );
pointL.position.set( 9, 2, -14 );
pointL.position.set( 5, 2, -7 );
scene.add( pointL );
//var pointL2 = new THREE.PointLight( 0xffffff, 4, 200 );
var pointL2 = new THREE.PointLight( 0xffffff, 3, 100 );
pointL2.position.set( -14, 2, 14 );
pointL2.position.set( 2, 2.2, 2 );
//pointL2.position.set( 0, 0, 0 );
scene.add( pointL2 );
var pointL3 = new THREE.PointLight( 0xffffff, 3, 100 );
pointL3.position.set( -14, 2, 2 );
pointL3.position.set( -7, 2, 2 );
scene.add( pointL3 );
var pointL4 = new THREE.PointLight( 0xffffff, 1.5, 1 );
pointL4.position.set( -3, .7, 4 );
scene.add( pointL4 );
var pointL5 = pointL4.clone();
var pointL6 = pointL4.clone();
var pointL7 = pointL4.clone();
var pointL8 = pointL4.clone();
pointL5.position.set( 3, .7, -4 );
scene.add( pointL5 );
pointL6.position.set( -4, .7, 4 );
scene.add( pointL6 );
pointL7.position.set( -3, .7, -3 );
scene.add( pointL7 );
pointL8.position.set( 3, .7, 3 );
scene.add( pointL8 );

var sphereSize = 1;
var pointLightHelper = new THREE.PointLightHelper( pointL2, sphereSize );
//scene.add( pointLightHelper );

var Gem = new THREE.Group();
 
var cubeMap = new THREE.CubeTexture( [] );
var cubeMapR = new THREE.CubeTexture( [] );
cubeMap.format = cubeMapR.format = THREE.RGBFormat;
cubeMap.mapping = THREE.CubeReflectionMapping;
cubeMapR.mapping = THREE.CubeRefractionMapping;
cubeMap.flipY = cubeMapR.flipY = false;
//cubeMap.flipY = false;
//cubeMapR.flipY = true;
var loada = new THREE.ImageLoader();
//loada.load('imj/map/cube/skybox7c.jpg', function(tex) {
//loada.load('imj/map/cube/skybox7b.jpg', function(tex) {
//loada.load('imj/map/cube/skybox6b.jpg', function(tex) {
//loada.load('imj/map/cube/skybox5.jpg', function(tex) {
//loada.load('imj/map/cube/skybox8b.jpg', function(tex) {
loada.load('imj/map/cube/skybox10.jpg', function(tex) {
//loada.load('imj/map/cube/skyboxbw.jpg', function(tex) {
	var getSide = function (x, y) {
		var size = 1024;
		//var size = 512;
		var canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		var context = canvas.getContext('2d');
		context.drawImage(tex, -x*size, -y*size);
		return canvas;
	};
	cubeMap.images[0] = getSide(2, 1);
	cubeMap.images[1] = getSide(0, 1);
	cubeMap.images[2] = getSide(1, 0);
	cubeMap.images[3] = getSide(1, 2);
	cubeMap.images[4] = getSide(1, 1);
	cubeMap.images[5] = getSide(3, 1);
	cubeMap.needsUpdate = true;
	cubeMapR.images[0] = getSide(2, 1);
	cubeMapR.images[1] = getSide(0, 1);
	cubeMapR.images[2] = getSide(1, 0);
	cubeMapR.images[3] = getSide(1, 2);
	cubeMapR.images[4] = getSide(1, 1);
	cubeMapR.images[5] = getSide(3, 1);
	cubeMapR.needsUpdate = true;	
});
/*var cubeShader = THREE.ShaderLib['cube'];
cubeShader.uniforms['tCube'].value = cubeMap;
var skyBoxMaterial = new THREE.ShaderMaterial({	fragmentShader: cubeShader.fragmentShader, vertexShader: cubeShader.vertexShader, uniforms: cubeShader.uniforms, depthWrite: false, side: THREE.BackSide});
var skyBox = new THREE.Mesh(new THREE.BoxGeometry( 100000, 100000, 100000 ), skyBoxMaterial);
scene.add( skyBox );*/
//var cubeMapR = cubeMap.clone();
//var cubeMapR = cubeMap;
//cubeMapR.mapping = THREE.CubeRefractionMapping;

var rainbMap = new THREE.CubeTexture( [] );
rainbMap.format = THREE.RGBFormat;
rainbMap.mapping = THREE.CubeRefractionMapping;
rainbMap.mapping = THREE.CubeReflectionMapping;
rainbMap.flipY = false;
loada = new THREE.ImageLoader();
//loada.load('imj/map/cube/rainbow.jpg', function(tex) {
//loada.load('imj/map/cube/skyboxbw2.jpg', function(tex) {
loada.load('imj/map/cube/skyboxbw3.jpg', function(tex) {
	var getSide = function (x, y) {
		var size = 256;
		//var size = 1024;
		var canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		var context = canvas.getContext('2d');
		context.drawImage(tex, -x*size, -y*size);
		return canvas;
	};
	rainbMap.images[0] = getSide(2, 1);
	rainbMap.images[1] = getSide(0, 1);
	rainbMap.images[2] = getSide(1, 0);
	rainbMap.images[3] = getSide(1, 2);
	rainbMap.images[4] = getSide(1, 1);
	rainbMap.images[5] = getSide(3, 1);
	rainbMap.needsUpdate = true;
});

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

//				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};


/*				var loader = new THREE.ImageLoader( manager );
				loader.load( 'textures/UV_Grid_Sm.jpg', function ( image ) {

					texture.image = image;
					texture.needsUpdate = true;

				} );*/
				
var tri1 = THREE.ImageUtils.loadTexture('imj/tri1.png', undefined, bB);	
tri1.wrapS = tri1.wrapT = THREE.RepeatWrapping;
tri1.repeat.set( 16, 16);
tri1.repeat.set( 1, 1);
function bB() {				
	var loader = new THREE.JSONLoader();
	loader.load('obj/diamond-round.json', function (geometry, materials) {
		//console.log('y');
		//mater = new THREE.MeshPhongMaterial({color: 0xffffff, emissive: 0xffffff, envMap: cubeMap, overdraw: 0.5, side: THREE.DoubleSide, skinning: true, wireframe: false});
		mater = new THREE.MeshPhongMaterial({envMap: cubeMap, overdraw: 0.5, side: THREE.FrontSide, wireframe: false, transparent: true, opacity: 0.5, shading: THREE.FlatShading, shininess: 60, metal: false, combine: THREE.MixOperation});
		//diamond = new THREE.SkinnedMesh(geometry, mater);	  
		diamond = new THREE.Mesh(geometry, mater);	  
		var scale = 1;
		diamond.position.set(0, 0, 0);
		diamond.scale.set(scale, scale, scale);
		diamond.castShadow = true;
		diamond.receiveShadow = true;
		Gem.add(diamond);
		
		//diamondR = diamond.clone();	
		mater = new THREE.MeshPhongMaterial({envMap: cubeMapR, overdraw: 0.5, transparent: true, opacity: 0.8, shading: THREE.FlatShading, refractionRatio: 0.9});
		//cubeMap.mapping = THREE.CubeRefractionMapping;
		diamondR = new THREE.Mesh(geometry, mater);	  
		var scale = 1;
		//diamondR.material.envMap = cubeMapR;
		//diamondR.material.needsUpdate = true;
		diamondR.position.set(0, 0, 0);
		diamondR.scale.set(scale, scale, scale);		
		diamondR.castShadow = false;
		diamondR.receiveShadow = false;		
		Gem.add(diamondR);

		mater = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 90, transparent: true, opacity: 0.5, shading: THREE.FlatShading});
		//cubeMap.mapping = THREE.CubeRefractionMapping;
		diamondW = new THREE.Mesh(geometry, mater);	  
		var scale = .97;
		//diamondW.material.envMap = cubeMapR;
		//diamondW.material.needsUpdate = true;
		diamondW.position.set(0, 0, 0);
		diamondW.scale.set(scale, scale, scale);		
		diamondW.castShadow = false;
		diamondW.receiveShadow = false;		
		//Gem.add(diamondW);		
		
		mater = new THREE.MeshPhongMaterial({envMap: rainbMap, transparent: true, opacity: 0.125, shading: THREE.FlatShading});
		diamondB = new THREE.Mesh(geometry, mater);	  
		//var scale = 0.99;
		var scale = 1;
		diamondB.position.set(0, 0, 0);
		diamondB.scale.set(scale, scale, scale);		
		diamondB.castShadow = false;
		diamondB.receiveShadow = false;		
		Gem.add(diamondB);		

		var geomet = new THREE.SphereGeometry( 2, 32, 32 );
		mater = new THREE.MeshPhongMaterial({map: tri1, wrapAround: true, transparent: true, opacity: 0.90, overdraw: 0.5, side: THREE.BackSide});
		var diamondT = new THREE.Mesh(geomet, mater);	  
		var scale = 2.01;		
		diamondT.position.set(0, 0, 0);
		diamondT.scale.set(scale, scale, scale);				
		diamondT.castShadow = true;
		diamondT.receiveShadow = true;		
		//Gem.add(diamondT);				
		
		/*var materg = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0, transparent: true } );
		dglow = new THREE.Mesh( geometry, materg );
		//dglow.position.set(0, 0, 22.7);
		Gem.add( dglow );			
		var glowM1 = new THREEx.GeometricGlowMesh(dglow, 0.1, 0.05, 5.0);
		dglow.add(glowM1.object3d);
		var ouni = glowM1.outsideMesh.material.uniforms;
		ouni.glowColor.value.set('#cccccc');		*/
	});
	
}	
scene.add(Gem);
Gem.rotation.x = -Math.PI/4.5;	
	
//var clock = new THREE.Clock();
/*function bB() {				
	var loader = new THREE.OBJLoader();
	loader.load('obj/Diamond_Emerald_Cut.obj', function (diamond) {
		diamond.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material.envMap = cubeMap;
				//child.material.envMap = skin;
				//child.material.combine = THREE.MixOperation;
				//child.material.combine = THREE.AddOperation;
				//child.material.color = 0xffffff;
				//child.material.emissive = 0xffffff;
				//child.material.transparent = true;
				//child.material.opacity = 0.9;
				//child.material.reflectivity = 1, 
				//child.material.metal = true;
				//child.material.shininess = 90;
				child.material.specular = 0xffffff;
				child.material.shading = THREE.FlatShading;
				child.material.castShadow = true;
				child.material.receiveShadow = true;
				
			}
		});
		diamond.position.y = 0;
		//diamond.castShadow = true;
//		diamond.receiveShadow = true;
		scene.add(diamond);

	}, onProgress, onError);
}*/	

var geomf = new THREE.PlaneBufferGeometry( 6000, 6000 );
var materf = new THREE.MeshPhongMaterial( { color: 0x0a0c0e, specular: 0x111111, shininess: 1, wireframe: false } );
var ground = new THREE.Mesh( geomf, materf );
ground.position.set( 0, -5, 0 );
ground.position.set( 0, -1.2, 0 );
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = true;
//Gem.add( ground );
scene.add( ground );

if (!Detector.webgl) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(ww, wh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
container.appendChild(renderer.domElement);			

function animate() {
	requestAnimationFrame(animate);
	var timer = new Date().getTime();	
	
	x += .005;	y -= .01;	z += .008;
	//Gem.rotation.set(x,y,z);
	//diamondB.rotation.y += 0.001;
	//dglow.rotation.y += 0.02;
	scene.rotation.y += 0.005;
	camera.position.x = -mouseX*0.04;
	camera.position.y = -mouseY*0.03+(wh*0.01);		
	//camera.position.y = -mouseY*0.05+(wh*0.025);		
		
	render();
}

function render() {
	camera.lookAt(scene.position);
	spotL.lookAt(scene.position);
	renderer.render(scene, camera);	
}

