/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,
	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0',
	geom, mater, x = y = z = pis = 0, pif = 1, ntro = true, bebe, bebe2, bebe3, bebe4, anima0, anima1, anima2, anima3, startT = Date.now(), oldT = 0, frame, animp;
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
document.getElementById( 'optn' ).style.opacity = 0;

function onDocumentMouseMove(event) {
	mouseX = (event.clientX-wwh);
	mouseY = (event.clientY-whh);	
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

var container = document.getElementById('container');
container.style.background = '#0a0e12';

//var skin = THREE.ImageUtils.loadTexture('imj/skin/alien0.jpg', undefined, bB);
var skin;

function iSkin() {
	skin = THREE.ImageUtils.loadTexture('imj/skin/alien0.jpg', undefined, bB);	
}

var camera = new THREE.PerspectiveCamera( 40, ww/wh,  0.1, 10000 );
camera.position.set(0, 3, 60);
var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0x0a0e12, 0.015 );
camera.lookAt( scene.position );

var spotL = new THREE.SpotLight( 0xffffff, 12, 150, Math.PI/4 );
spotL.position.set( 0, 100, 0 );
spotL.castShadow = true;
spotL.shadowMapWidth = 1024;
spotL.shadowMapHeight = 1024;
spotL.shadowDarkness = 0.6;
spotL.shadowCameraNear = 40;
spotL.shadowCameraFar = 1000;
spotL.shadowCameraFov = 45;
scene.add( spotL );
spotL.lookAt( scene.position );

var geometry = new THREE.CylinderGeometry( 0.1, 50, 150, 32*2, 20, true);
geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -geometry.parameters.height/2, 0));
geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
var materspl = new THREEx.VolumetricSpotLightMaterial();
var vspotL	= new THREE.Mesh( geometry, materspl );
vspotL.position.set( 0, 100, 0 );
vspotL.lookAt( scene.position );
materspl.uniforms.lightColor.value.set('#ffffff');
materspl.uniforms.spotPosition.value = vspotL.position;
scene.add( vspotL );
	
var clock = new THREE.Clock();
function bB() {				
	var loader = new THREE.JSONLoader();
	loader.load('obj/alien2.json', function (geometry, materials) {
		mater = new THREE.MeshLambertMaterial({map: skin, overdraw: 0.5, side: THREE.FrontSide, skinning: true});
		bebe = new THREE.SkinnedMesh(geometry, mater);	  
		var scale = 1;
		bebe.position.set(0, -0.025, 0);
		bebe.position.set(0, -4, 0);
		bebe.position.set(0, -4.15, 15);
		bebe.scale.set(scale, scale, scale);
		bebe.castShadow = true;
		bebe.receiveShadow = true;
		scene.add(bebe);
		bebe2 = bebe.clone();
		var scale = .9;
		bebe2.position.set(-15, -4.3, 4);
		bebe2.scale.set(scale, scale, scale);
		scene.add(bebe2);		
		bebe3 = bebe.clone();
		var scale = 1.1;
		bebe3.position.set(1, -4.35, -15);
		bebe3.scale.set(scale, scale, scale);
		scene.add(bebe3);
		bebe4 = bebe.clone();
		var scale = .8;
		bebe4.position.set(15, -3.5, 6);
		bebe4.scale.set(scale, scale, scale);
		scene.add(bebe4);		
		anima0 = new THREE.Animation( bebe, animi[0] );
		anima1 = new THREE.Animation( bebe2, animi[1] );
		anima2 = new THREE.Animation( bebe3, animi[2] );
		anima3 = new THREE.Animation( bebe4, animi[3] );
		anima0.timeScale = .8;	  
		anima1.timeScale = .8;	  
		anima2.timeScale = .8;	  
		anima3.timeScale = .8;	  
		anima0.loop = false;
		anima1.loop = false;
		anima2.loop = false;
		anima3.loop = false;
		animp = 4;
		
		animate();
	});
}	

var geomf = new THREE.PlaneBufferGeometry( 6000, 6000 );
var materf = new THREE.MeshPhongMaterial( { color: 0x0a0e12, wireframe: false } );
var ground = new THREE.Mesh( geomf, materf );
ground.position.set( 0, -4, 0 );
ground.rotation.x = -Math.PI/2;
ground.receiveShadow = true;
scene.add( ground );

if (Audio != undefined) {
	var au = new Audio();
	var ext = "ogg";
	if (au.canPlayType("audio/mp3")) ext = "mp3";
	var mus = new Audio("aud/bigbang."+ext);
	mus.volume = .6;
	mus.loop = true;
	mus.muted = true;	
	mus.load();
	mus.addEventListener("loadeddata", function() {
		startT = Date.now();
		this.play();
	}, false);
} else {
	startT = Date.now();
}

if (!Detector.webgl) Detector.addGetWebGLMessage();
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize(ww, wh);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;
container.appendChild( renderer.domElement );			

function animate() {
	requestAnimationFrame( animate );
	var timer = new Date().getTime();	
	if (ntro) {
		if (pif>0) {
			pif -= 0.0025;
			document.getElementById( 'pinfo2' ).style.opacity = pif;
			if (pif<=0.5) {
				pis += 0.0025;
				document.getElementById( 'optn' ).style.opacity = pis;			
				animp = 0;
				anima0.play();
			}	
		} else {
			document.getElementById( 'pinfo2' ).style.opacity = 0;
			document.getElementById( 'optn' ).style.opacity = .5;
			ntro = false;
		}
	} else {	
		camera.position.x = -mouseX*0.1;
		camera.position.y = -mouseY*0.1+(wh*0.025);		
		if (animp!=0) { bebe.rotation.y += 0.003; } else { bebe.rotation.y += 0.001; } 
		if (animp!=1) { bebe2.rotation.y -= 0.003; } else { bebe2.rotation.y += 0.001; } 
		if (animp!=2) { bebe3.rotation.y += 0.003; } else { bebe3.rotation.y -= 0.001; } 
		if (animp!=3) { bebe4.rotation.y -= 0.003; } else { bebe4.rotation.y -= 0.001; } 
	}
	switch(animp) {
		case 0:
			if (!anima0.isPlaying) {
				animp = 1;
				anima1.play();
			}
			break;
		case 1:
			if (!anima1.isPlaying) {
				animp = 2;
				anima2.play();
			}			
			break;		
		case 2:
			if (!anima2.isPlaying) {
				animp = 3;
				anima3.play();
			}			
			break;		
		case 3:
			if (!anima3.isPlaying) {
				animp = 0;
				anima0.play();
			}			
			break;
		default: 				
			animp = 4;
	}	
	if (Audio != undefined) {	
		var musT = mus.currentTime;
		if (musT == 0) {
			musT = (timer-startT)/1000;
		}				
		if (frame<1172) {
			frame = Math.round(musT * 5.9192);
		} else {
			frame = 1171;
			startT = Date.now();
		}	
		spotL.intensity = aud[frame]*7;		
	} else {
		spotL.intensity = Math.random()*20;
	}
	x = 1 * Math.random();
	y = 1 * Math.random();
	z = 1 * Math.random();
	spotL.color.setRGB(x,y,z);
	materspl.uniforms.lightColor.value = spotL.color;
	spotL.position.x = Math.sin(timer*0.0003)*80;
	spotL.position.z = Math.cos(timer*0.0002)*80;
	vspotL.position.set(spotL.position.x,100,spotL.position.z);
	render();
}

function render() {
	var delta = clock.getDelta();
	THREE.AnimationHandler.update(delta);
	camera.lookAt(scene.position);
	spotL.lookAt(scene.position);
	vspotL.lookAt(scene.position);
	renderer.render(scene, camera);	
}
optn1.addEventListener('click', function(e) {
	//mus.volume = .2;
	mus.muted = true;
	optn2.classList.remove("sel");
	optn3.classList.remove("sel");
	optn1.classList.add("sel");			
	e.preventDefault();	
});
optn2.addEventListener('click', function(e) {
	mus.muted = false;
	mus.volume = .5;
	optn1.classList.remove("sel");
	optn3.classList.remove("sel");
	optn2.classList.add("sel");				
	e.preventDefault();
});
optn3.addEventListener('click', function(e) {
	mus.muted = false;
	mus.volume = 1;
	optn1.classList.remove("sel");
	optn2.classList.remove("sel");
	optn3.classList.add("sel");				
	e.preventDefault();	
});
optn5.addEventListener('click', function(e) {
	anima0.timeScale = 0.2;	  
	anima1.timeScale = 0.2;	  
	anima2.timeScale = 0.2;	  
	anima3.timeScale = 0.2;	  	
	optn6.classList.remove("sel");
	optn7.classList.remove("sel");
	optn5.classList.add("sel");
	e.preventDefault();
});
optn6.addEventListener('click', function(e) {
	anima0.timeScale = .8;	  
	anima1.timeScale = .8;	  
	anima2.timeScale = .8;	  
	anima3.timeScale = .8;	  	
	optn5.classList.remove("sel");
	optn7.classList.remove("sel");
	optn6.classList.add("sel");
	e.preventDefault();
});
optn7.addEventListener('click', function(e) {
	anima0.timeScale = 1.4;	  
	anima1.timeScale = 1.4;	  
	anima2.timeScale = 1.4;	  
	anima3.timeScale = 1.4;	  	
	optn5.classList.remove("sel");
	optn6.classList.remove("sel");
	optn7.classList.add("sel");
	e.preventDefault();
});
optn8.addEventListener('click', function(e) {
	mater.wireframe = !(mater.wireframe);
	//materf.wireframe = !(materf.wireframe);
	optn8.classList.toggle("sel");
	e.preventDefault();
});
optn9.addEventListener('click', function(e) {
	e.preventDefault();	
});

if (window.addEventListener) {
	window.addEventListener("load", iSkin, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", iSkin);
} else {
	window.onload = iSkin;
}
