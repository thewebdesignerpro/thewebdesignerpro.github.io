/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, geom2, mater2, geom3, mater3, mesh, wall, wall2, well, arw, neb, x = y = z = xb = yb = zb = 0, pif = 1, ntro = true;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - wwh );
	mouseY = ( event.clientY - whh );	
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
var camera = new THREE.PerspectiveCamera( 35, ww / wh,  0.1, 3000 );
camera.position.set( -3, 1, 1.5 );
camera.position.set( 0, 1, 8 );
//camera.position.set( 0, 1, 3 );
camera.position.set( 1, 1, 6 );
camera.position.set( 4, 1, 5 );
var scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2( 0xd4f0e6, 0.04 );
scene.fog = new THREE.FogExp2( 0xa3a8ab, 0.05 );
camera.lookAt( scene.position );

//var hLight = new THREE.HemisphereLight( 0xd4f0e6, 0x648076, 1.5 );
var hLight = new THREE.HemisphereLight( 0xf4faff, 0xa3a7aa, 1 );
hLight.position.set( -1, 20, -10 );
hLight.position.set( 0, 150, 0 );
//scene.add( hLight );

var alight = new THREE.AmbientLight( 0x939393 ); 
scene.add( alight );

//var light = new THREE.PointLight( 0xffffff, 1, 20 );
var light = new THREE.PointLight( 0xf4faff, 1, 150 );
light.position.set( 0, -10, -30 );
light.position.set( 0, -150, 0 );
light.position.set( -5, 20, 8 );
//scene.add( light );

var spotL = new THREE.SpotLight( 0xffffff, 1, 300, Math.PI/16 );
//var spotL = new THREE.SpotLight( 0xffffff, 4, 300, Math.PI/40, 10.0 );
//var spotL = new THREE.SpotLight( 0xffffff, 1, 300 );
spotL.position.set( -5, 20, 6 );
spotL.castShadow = true;
//spotL.onlyShadow = true;
spotL.shadowMapWidth = 512;
spotL.shadowMapHeight = 512;
spotL.shadowDarkness = 0.5;
spotL.shadowCameraNear = 10;
spotL.shadowCameraFar = 300;
//spotL.shadowCameraFov = 50;
spotL.shadowCameraFov = 20;
//spotL.shadowBias = 0;
//spotL.shadowCameraVisible = true;
scene.add( spotL );
var lightHelper = new THREE.SpotLightHelper( spotL, 1 );
//scene.add( lightHelper );

var group = new THREE.Group();

var path = "imj/map/cube/skybox/";
var format = '.jpg';
var urls = [
	path + 'px' + format, path + 'nx' + format,
	path + 'py' + format, path + 'ny' + format,
	path + 'pz' + format, path + 'nz' + format
];
var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
				
var shader = THREE.NormalDisplacementShader;
var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

var loada = new THREE.TextureLoader();
loada.load(
	//'imj/shade/tx/ps1509-disp.jpg',
	//'img/pyramid.jpg',
	//'img/cb1.png',
	'imj/earthsr2.jpg',
	//'imj/shade/patchw.jpg',
	function ( tex ) {
				uniforms[ "enableAO" ].value = 1;
				uniforms[ "enableDiffuse" ].value = 0;
				uniforms[ "enableSpecular" ].value = 1;
				uniforms[ "enableReflection" ].value = 0;
				uniforms[ "enableDisplacement" ].value = 1;
				
				//uniforms[ "tNormal" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-norm.jpg" );
				uniforms[ "tAO" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-ao.jpg" );
				uniforms[ "tNormal" ].value = THREE.ImageUtils.loadTexture( "imj/earth.jpg" );
				//uniforms[ "tAO" ].value = THREE.ImageUtils.loadTexture( "imj/earth.jpg" );				
				
		uniforms[ "tDisplacement" ].value = tex;
				//uniforms[ "uDisplacementBias" ].value = -0.4;
		//uniforms[ "uDisplacementScale" ].value = 1.0;		
		uniforms[ "uDisplacementScale" ].value = 0.3;		
//		uniforms[ "uDisplacementScale" ].value = 0.5;		
		
				uniforms[ "uNormalScale" ].value.y = 0.3;
//				uniforms[ "uNormalScale" ].value.y = -0.5;
				
		//uniforms[ "tDiffuse" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-diff.jpg" );
		uniforms[ "tSpecular" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps1509-spec.jpg" );		
		//uniforms[ "tDiffuse" ].value = THREE.ImageUtils.loadTexture( "imj/earth.jpg" );
		uniforms[ "tSpecular" ].value = THREE.ImageUtils.loadTexture( "imj/earth.jpg" );

				uniforms[ "diffuse" ].value.setHex( 0xf28d7d );
				//uniforms[ "specular" ].value.setHex( 0xffffff );

//				uniforms[ "shininess" ].value = 4;

//				uniforms[ "tCube" ].value = reflectionCube;
				//uniforms[ "reflectivity" ].value = 0.1;

				uniforms[ "diffuse" ].value.convertGammaToLinear();
				uniforms[ "specular" ].value.convertGammaToLinear();		
		
		//uniforms[ "uRepeat"].value.wrapS = uniforms[ "uRepeat"].value.wrapT = THREE.RepeatWrapping;
		//uniforms.uRepeat.wrapS = uniforms.uRepeat.wrapT = THREE.RepeatWrapping;
		//uniforms.uRepeat.value = new THREE.Vector2( 1, 1 );
		//uniforms.uRepeat.repeat.set( 8, 8 );		
		
		var param = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms, lights: true, fog: true };
		mater = new THREE.ShaderMaterial( param );		
		geom = new THREE.PlaneGeometry( 4, 4, 64, 64 );
//		geom = new THREE.PlaneGeometry( 4, 4, 48, 96 );
//		geom = new THREE.PlaneGeometry( 4, 4, 160, 160 );
//		geom = new THREE.SphereGeometry(1, 64, 64 );
		geom.computeTangents();
		mesh = new THREE.Mesh(geom, mater);
		mesh.position.set(0, -1.3, 0);
//		mesh.position.set(0, -1.6, 0);
//		mesh.position.set(0, 0, 0);
		mesh.rotation.x -= Math.PI/2;
//		mesh.rotation.y -= Math.PI/4;
		//mesh.scale.set( 2, 2, 1 );
		//mesh.material.wireframe = true;
		//mesh.material.side = THREE.FrontSide;
		mesh.material.side = THREE.DoubleSide;
		//mesh.material.shading = THREE.FlatShading;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		//group.add(mesh);
	}, function ( xhr ) {}, function ( xhr ) {}
);

var shader2 = THREE.NormalDisplacementShader;
var uniforms2 = THREE.UniformsUtils.clone( shader2.uniforms );
loada.load(
	'imj/shade/tx/ps0174-disp.jpg',
	function ( tex ) {
		uniforms2[ "enableAO" ].value = true;
		uniforms2[ "enableDiffuse" ].value = 0;
		uniforms2[ "enableSpecular" ].value = true;
		uniforms2[ "enableReflection" ].value = false;
		uniforms2[ "enableDisplacement" ].value = true;
		
		uniforms2[ "tNormal" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-norm.jpg" );
		uniforms2[ "tAO" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-ao.jpg" );
				
		uniforms2[ "tDisplacement" ].value = tex;
		//uniforms2[ "uDisplacementBias" ].value = -0.4;
		uniforms2[ "uDisplacementScale" ].value = 0.2;		
		
		uniforms2[ "uNormalScale" ].value.y = 0.2;
				
		//uniforms2[ "tDiffuse" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-diff.jpg" );
		uniforms2[ "tSpecular" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0174-spec.jpg" );		

		uniforms2[ "diffuse" ].value.setHex( 0xaa2211 );
		//uniforms2[ "specular" ].value.setHex( 0xffffff );
		//uniforms2[ "shininess" ].value = 3;

		uniforms2[ "tCube" ].value = reflectionCube;
		uniforms2[ "reflectivity" ].value = 0.1;

		uniforms2[ "diffuse" ].value.convertGammaToLinear();
		uniforms2[ "specular" ].value.convertGammaToLinear();		
		
		var param2 = { fragmentShader: shader2.fragmentShader, vertexShader: shader2.vertexShader, uniforms: uniforms2, lights: true, fog: true };
		mater2 = new THREE.ShaderMaterial( param2 );		
		geom2 = new THREE.PlaneGeometry( 4, 4, 64, 64 );
		geom2.computeTangents();
		wall = new THREE.Mesh(geom2, mater2);
		wall.position.set(0, 0.81, -2.02);
		//wall.rotation.x -= Math.PI/2;
		//wall.rotation.y -= Math.PI/4;
		//wall.scale.set( 2, 2, 1 );
		wall.material.side = THREE.FrontSide;
		//wall.material.shading = THREE.FlatShading;
		wall.castShadow = true;
		wall.receiveShadow = true;
		group.add(wall);
		
		wall2 = wall.clone();
		group.add(wall2);
		wall2.rotation.y += Math.PI/2;
		//wall2.rotation.y -= Math.PI/2;
		wall2.position.set(-2.02, 0.81, 0);
	}, function ( xhr ) {}, function ( xhr ) {}
);

var shader3 = THREE.NormalDisplacementShader;
var uniforms3 = THREE.UniformsUtils.clone( shader3.uniforms );
loada.load(
	'imj/shade/tx/ps0246s-disp.jpg',
	function ( tex ) {
		uniforms3[ "enableAO" ].value = true;
		uniforms3[ "enableDiffuse" ].value = true;
		uniforms3[ "enableSpecular" ].value = true;
		uniforms3[ "enableReflection" ].value = false;
		uniforms3[ "enableDisplacement" ].value = true;
		
		uniforms3[ "tNormal" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-norm.jpg" );
		uniforms3[ "tAO" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-ao.jpg" );
				
		uniforms3[ "tDisplacement" ].value = tex;
		//uniforms3[ "uDisplacementBias" ].value = -0.2;
		uniforms3[ "uDisplacementScale" ].value = 0.2;		
		
		uniforms3[ "uNormalScale" ].value.y = 0.2;
				
		uniforms3[ "tDiffuse" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-diff.jpg" );
		uniforms3[ "tSpecular" ].value = THREE.ImageUtils.loadTexture( "imj/shade/tx/ps0246s-spec.jpg" );		

		//uniforms3[ "diffuse" ].value.setHex( 0xffcc88 );
		//uniforms3[ "specular" ].value.setHex( 0xffffff );
		//uniforms3[ "shininess" ].value = 1;

		//uniforms3[ "tCube" ].value = reflectionCube;
		//uniforms3[ "reflectivity" ].value = 0.1;

		//uniforms3[ "diffuse" ].value.convertGammaToLinear();
		//uniforms3[ "specular" ].value.convertGammaToLinear();		
		
		var param3 = { fragmentShader: shader3.fragmentShader, vertexShader: shader3.vertexShader, uniforms: uniforms3, lights: true, fog: true };
		mater3 = new THREE.ShaderMaterial( param3 );		
		//geom3 = new THREE.CylinderGeometry( 0, 0.3, 1.3, 12, 3, true );
		//geom3 = new THREE.CylinderGeometry( 0.1, 0.25, 0.5, 12, 3, true );
		geom3 = new THREE.SphereGeometry(0.5, 32, 32 );
		//geom3 = new THREE.BoxGeometry(1, 1, 1 );
		//geom3 = new THREE.TorusGeometry( 0.5, 0.2, 16, 16 );
		//geom3 = new THREE.TorusKnotGeometry( 0.6, 0.1, 64, 16, 2, 1, 3 );  // 1 3, 2 1, 2 6, 6 3,          3 3 ireg torus
		
/*		var CustomSinCurve = THREE.Curve.create(
			function ( scale ) { //custom curve constructor
				this.scale = (scale === undefined) ? 1 : scale;
			},
			function ( t ) { //getPoint: t is between 0-1
				//var tx = t * 3 - 1.5,
					//ty = Math.sin( 2 * Math.PI * t ),
				var tx = t * 3 - 1.5,
					ty = Math.sin( 2 * Math.PI * t ),
					tz = 0;
				return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
			}
		);
		var path = new CustomSinCurve( 2 );
		geom3 = new THREE.TubeGeometry(
			path,  //path
			20,    //segments
			1,     //radius
			8,     //radiusSegments
			false  //closed
		);
*/
		geom3.computeTangents();
		well = new THREE.Mesh(geom3, mater3);
		well.position.set(0.9, -0.62, -0.9);
		well.position.set(1, -0.85, -1);
		well.position.set(0,0,0);
		//well.rotation.y -= Math.PI/3;
		//well.scale.set( 2, 2, 1 );
		well.material.side = THREE.DoubleSide;
		//well.material.shading = THREE.FlatShading;
		well.castShadow = true;
		well.receiveShadow = true;
	//	group.add(well);
	}, function ( xhr ) {}, function ( xhr ) {}
);


loada.load(
	'imj/cloud2.jpg',
	function ( tex2 ) {
		var geometry = new THREE.SphereGeometry(40, 64, 64 );
		var geometry = new THREE.SphereGeometry(100, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {map: tex2, wrapAround: true, overdraw: 0.5, side: THREE.BackSide, fog: false } );
		//var material = new THREE.MeshLambertMaterial( {map: tex2, color: 0xffffff, wrapAround: true, overdraw: 0.5, side: THREE.BackSide, fog: false } );
		material.wrapRGB.set( 0.1, 0.1, 0.1 );
		sky = new THREE.Mesh( geometry, material );
		sky.rotation.y += 0.4;
		sky.position.set(0, 0, 0);
		scene.add( sky );
	},	function ( xhr ) {}, function ( xhr ) {}
);

//group.position.set(0,0,-30);
group.rotation.set(0, -Math.PI/4, 0);
scene.add(group);

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( ww, wh );
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
var container = document.getElementById( 'container' );
container.appendChild( renderer.domElement );			

function animate() {
	requestAnimationFrame( animate );
	var time = new Date().getTime();	
	
/*	if (ntro) {
		if (group.position.z<0) {
			//group.position.x = Math.sin(time*0.005)<(time*0.0000001);
			//group.position.z += 1.0-(time*0.00000000000054);
			//group.position.z -= Math.sin(time*0.001);
			group.position.z += 0.3;
			pif -= 0.008;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
		} else {
			group.position.z = 0;
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			ntro = false;
		}
	}	*/ document.getElementById( 'pinfo2' ).style.opacity = 0;
	
    //mater.uniforms.uDisplacementScale.value = (Math.sin(time*0.0006)*0.7)-1.6;
    //mater.uniforms.uDisplacementScale.value = -1+(Math.sin(time*0.0006)*1.0);
//    mater.uniforms.uDisplacementScale.value = 0.25+(Math.sin(time*0.001)*0.15);
//    mater3.uniforms.uDisplacementScale.value = 0.15+(Math.sin(time*0.001)*0.1);
  //  mater.uniforms.uDisplacementScale.value = -0.1+(Math.sin(time*0.015)*0.5);
  //  mater.uniforms.uDisplacementScale.value = -0.1+(Math.sin(time*0.0015)*0.5);
  //  mater.uniforms.uNormalScale.value = -0.1+(Math.sin(time*0.0015)*0.5);
	//camera.position.x = Math.sin(time*0.00007) * 3;
	//mesh.rotation.z += 0.0015;	
	x += 0.0015; y += 0.002; z -= 0.001; 
	x += Math.tan(time*0.001)*0.0015; y += Math.tan(time*0.0005)*0.00225; z -= Math.tan(time*0.0015)*0.00075;
	//mesh.rotation.set(x,y,z);	
//	well.rotation.set(x,y,z);	
//	well.position.y += Math.sin(time*0.001)*0.004;
	//sky.rotation.y += 0.001;	

	xb -= Math.cos(time*0.001)*0.001;
	yb -= Math.cos(time*0.001)*0.002;
	zb -= Math.cos(time*0.001)*0.001;
	//yb -= Math.PI/4;
	group.rotation.set(xb, yb, zb);		
	
	camera.position.x = mouseX * 0.009 + 4;
	camera.position.y = mouseY * 0.008;	
	render();
}

function render() {
	camera.lookAt( scene.position );
	renderer.render(scene, camera);	
}

/*
function playA() {
	document.getElementById('aud').play();
}

if (window.addEventListener) {
	window.addEventListener("load", playA, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", playA);
} else {
	window.onload = playA;
}
*/