/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */

const idleTO = 120; 
var renderer, camera, scene, controls, clock, group; 
var isMobil = false; 
var ui = {}, win = {}, mesh = {}; 

if ( THREE.WEBGL.isWebGLAvailable() === false ) {	
    var warning = THREE.WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);	
	/*ui.kontainer.style.opacity = 1;
	ui.kontainer.style.backgroundColor = 'transparent';
	document.body.style.backgroundImage = "url('images/nowebgl.jpg')";	
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';	*/
	//console.log(warning); 
} else {
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
}				

function init() {
	ui.kontainer = document.getElementById('kontainer'); 
	
	var dummy = document.getElementById('dummy'); 	
	
    if (window.getComputedStyle(dummy, null).getPropertyValue("left")=='9000px') {
        isMobil = false;
    } else {
        isMobil = true;        
    }

    if (isMobil) {
		//document.addEventListener('gesturestart', function (e) {
			//e.preventDefault();
		//}, false);
		
		document.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		}, false);			
		
		ui.kontainer.addEventListener('gesturechange', function (e) {
			e.preventDefault();
		}, false);		
    }
	
	dummy.parentNode.removeChild(dummy);		
	
	win.width = window.innerWidth; 
	win.height = window.innerHeight; 
	
    document.body.style.width = win.width + 'px';
    document.body.style.height = win.height + 'px';    
    ui.kontainer.style.width = win.width + 'px';    
    ui.kontainer.style.height = win.height + 'px';
    ui.kontainer.style.opacity = 0;		
	
	ui.myProfile = document.getElementById('myProfile'); 
	ui.aboutJM = document.getElementById('aboutJM'); 
	ui.moiInfo = document.getElementById('moiInfo'); 
	
	ui.myPlanets = document.getElementById('myPlanets'); 	
	ui.planetsInfo = document.getElementById('planetsInfo'); 	
	ui.moiPlanets = document.getElementById('moiPlanets'); 	
	
	ui.moiPlanets.innerHTML = planetData.planet1.content; 
	
	ui.myMap = document.getElementById('myMap'); 	
	ui.myTimeline = document.getElementById('myTimeline'); 	
	
	ui.timelineZ = document.getElementById('timelineZ'); 	
	ui.timelineX = document.getElementById('timelineX'); 	
	ui.timelineEntry = document.getElementById('timelineEntry'); 	
	
	camera = new THREE.PerspectiveCamera( 60, win.width / win.height, 1, 20000 );
	camera.position.set( 0, 0, 10000 );
	//camera.lookAt( 0, 0, 0 );

    scene = new THREE.Scene();
    scene.add(camera);
	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( win.width, win.height );
	renderer.setClearColor(0x000000, 1.0); 
	renderer.shadowMap.enabled = false;
	//renderer.sortObjects = false;
	//document.body.appendChild( renderer.domElement );
	ui.kontainer.appendChild(renderer.domElement); 

	var aLight = new THREE.AmbientLight( 0x202020 ); 
	scene.add( aLight );	
	
	//mesh.light = new THREE.PointLight( 0xff4400, 1, 1000 );
	mesh.light = new THREE.PointLight( 0xff9911, 1, 1000 );
	//mesh.light.position.set( 50, 50, 50 );
	scene.add( mesh.light );	
	
	/*var spotLight = new THREE.SpotLight( 0xffffff );
	spotLight.position.set( -100, 100, 100 );
	spotLight.castShadow = false;
	//spotLight.shadow.mapSize.width = 1024;
	//spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 100;
	spotLight.shadow.camera.far = 500;
	spotLight.shadow.camera.fov = 30;
	scene.add( spotLight );*/
	
	onWindowResize(); 			
	
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = .2;
    controls.autoRotateSpeed = .1;	
    controls.autoRotate = true;    	
    controls.minDistance = 1;
    controls.maxDistance = 11000;    
    //controls.minPolarAngle = Math.PI/3;    
    controls.rotateSpeed = .2;
    controls.zoomSpeed = .8;
    controls.panSpeed = .1;
	//controls.update();	
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	
	clock.start(); 	
	
	window.removeEventListener("load", init, false);
	window.addEventListener('resize', onWindowResize, false);
	
	addStars();
	drawGalaxy();
	drawNebula(); 
	drawAsteroids(); 
	theSun(); 
	thePlanets(); 
	
	win.entro = true; 
	
	win.composer = new THREE.EffectComposer( renderer );
	win.composer.addPass( new THREE.RenderPass( scene, camera ) );

	win.glitchPass = new THREE.GlitchPass();
	win.composer.addPass( win.glitchPass );	
	win.glitchPass.goWild = false; 	
	
	win.mouse = new THREE.Vector2(); 
	mesh.intersected = null;
	
	mesh.raycaster = new THREE.Raycaster();
	
	ui.aboutJM.addEventListener('click', aboutJMClick, false);    
	ui.planetsInfo.addEventListener('click', planetsInfoClick, false);    
	
	//ui.myMap.addEventListener('click', myMapClick, false);    
	ui.myTimeline.addEventListener('click', myTimelineClick, false);    	
	
	ui.timelineX.addEventListener('click', timelineXClick, false);    	
	
	//document.addEventListener('mousemove', onMouseMove2, false);
	
	if (isMobil) {
		ui.kontainer.addEventListener( 'touchstart', onMouseMove2, false );
		//ui.kontainer.addEventListener( 'touchmove', onMouseMove2, false );		
		
		ui.kontainer.addEventListener('touchend', kontainerClick, false);  
	} else {
		ui.kontainer.addEventListener('mousemove', onMouseMove2, false);
		
		ui.kontainer.addEventListener('click', kontainerClick, false);  
		ui.kontainer.addEventListener('wheel', onMouseWheel, false);		
	}
	
	win.idleTimer = 0; 
	
	fadeScene(); 	
}

/*function addMesh(event) {
	event.preventDefault();
	
	var vec = new THREE.Vector3(); 
	var pos = new THREE.Vector3(); 
	
	vec.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	vec.unproject( camera );
	vec.sub( camera.position ).normalize();
	var distance = - camera.position.z / vec.z;
	pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );	
	
	var geometry = new THREE.BoxBufferGeometry( 200, 200, 10 );
	var material = new THREE.MeshLambertMaterial( { transparent: true } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = pos.x;
	mesh.position.y = pos.y;
	mesh.position.z = 0;
	scene.add( mesh );

	console.log(event.clientX);
	console.log(event.clientY);
	
	//control.attach( mesh );
	
	//window.removeEventListener( 'click', addMesh, false );    
}*/

function fadeScene() {
	onWindowResize(); 	
	
    (function fadeIn() {
        var val = parseFloat(ui.kontainer.style.opacity);
        if (!((val += .01) > 1.0)) {
            ui.kontainer.style.opacity = val;
			
            requestAnimationFrame(fadeIn);
        } else {
            ui.kontainer.style.opacity = 1.0;
			
			var welcome = document.getElementById("welcome"); 
			welcome.style.zIndex = 10;
			
			var tweenA = new TWEEN.Tween( {x: 0})
				.to({ x: 1 }, 300)
				.delay(0)	
				.onUpdate(function() {
					//welcome.style.opacity = this.x; 
					welcome.style.transform = 'scale(' + this.x + ')'; 
				})
				.onComplete(function() {
					
				})
				.start();	
				
			tweenA.easing(TWEEN.Easing.Back.Out); 
			
			var explore = document.getElementById("explore"); 
			explore.addEventListener( 'click', exploreClick, false ); 			
			
			onWindowResize(); 			
        }
    })();	
}

function addStars() {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    for ( var i = 0; i < 7000; i ++ ) {
		var vct = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct.normalize();
		vct.multiplyScalar(THREE.Math.randFloat(900, 9900)); 

        vertices.push( vct.x, vct.y, vct.z );
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	var material = new THREE.PointsMaterial({ size: 30, sizeAttenuation: true, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending }); 
	mesh.stars = new THREE.Points( geometry, material );
	scene.add( mesh.stars ); 		
		
	mesh.stars.visible = false; 
	
    var geometry2 = new THREE.BufferGeometry();
    var vertices2 = [];

    for ( var j = 0; j < 1000; j ++ ) {
		var vct2 = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct2.normalize();
		vct2.multiplyScalar(THREE.Math.randFloat(900, 9900)); 

        vertices2.push( vct2.x, vct2.y, vct2.z );
    }
    geometry2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

	var material2 = new THREE.PointsMaterial({ size: 40, sizeAttenuation: true, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending }); 
	mesh.stars2 = new THREE.Points( geometry2, material2 );
	scene.add( mesh.stars2 ); 		
		
	mesh.stars2.visible = false; 
	
    var geometry3 = new THREE.BufferGeometry();
    var vertices3 = [];

    for ( var k = 0; k < 1000; k ++ ) {
		var vct3 = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct3.normalize();
		vct3.multiplyScalar(THREE.Math.randFloat(900, 9900)); 

        vertices3.push( vct3.x, vct3.y, vct3.z );
    }
    geometry3.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices3, 3 ) );

	var material3 = new THREE.PointsMaterial({ size: 38, sizeAttenuation: true, transparent: true, opacity: .9, depthWrite: false, blending: THREE.AdditiveBlending }); 
	mesh.stars3 = new THREE.Points( geometry3, material3 );
	scene.add( mesh.stars3 ); 		
		
	mesh.stars3.visible = false; 
	
	var textureLoaderA = new THREE.TextureLoader();

	textureLoaderA.load( 'images/star0.jpg', function(tx) { 	
		mesh.stars.material.map =  tx; 
		mesh.stars.material.needsUpdate = true;
		mesh.stars.visible = true; 
	});    

	var textureLoaderB = new THREE.TextureLoader();

	textureLoaderB.load( 'images/star1.jpg', function(tx) { 	
		mesh.stars2.material.map = tx; 
		mesh.stars2.material.needsUpdate = true;
		mesh.stars2.visible = true; 
	});    

	var textureLoaderC = new THREE.TextureLoader();

	textureLoaderC.load( 'images/star2.jpg', function(tx) { 	
		mesh.stars3.material.map = tx; 
		mesh.stars3.material.needsUpdate = true;
		mesh.stars3.visible = true; 
	});    
}

function drawGalaxy() {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

	//clock.start();
	var timer = Date.now()*.03;
	
    for ( var i = 0; i < 4000; i ++ ) {
		var x = 2 * Math.random() - 1, 
			z = 2 * Math.random() - 1, 
		//var x = Math.cos(clock.getElapsedTime()), 
			//z = Math.cos(clock.getElapsedTime()), 		
		//var x = Math.cos(timer + i) * 2, 
			//z = Math.sin(timer + i) * 2, 
			y = 2 * Math.random() - 1;
			//y = Math.abs((x + z) * .4) * (2 * Math.random() - 1);
			
		//console.log(z);	
		
		var vct = new THREE.Vector3(x, y, z);
		vct.normalize();
		vct.multiplyScalar(THREE.Math.randFloat(100, 2000)); 

        vertices.push( vct.x, vct.y, vct.z );
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	var material = new THREE.PointsMaterial({ size: 80, sizeAttenuation: true, color: 0xddeeff, transparent: true, opacity: 0, depthWrite: false }); 
	material.blending = THREE.AdditiveBlending;	
	//material.morphTargets = true;	
	mesh.galaxy = new THREE.Points( geometry, material );
	scene.add( mesh.galaxy ); 		
		
	mesh.galaxy.visible = false; 
	mesh.galaxy.scale.set(.001, .0001, .001); 
	
	var textureLoader = new THREE.TextureLoader();

	textureLoader.load( 'images/star0.png', function(tx) { 	
		mesh.galaxy.material.map = tx; 
		mesh.galaxy.material.needsUpdate = true;
		mesh.galaxy.visible = true; 
	});    
	
	//clock.stop(); 
	
	//animate(); 
	
	/*var tweenB = new TWEEN.Tween( mesh.stars.rotation )
	.to({ x: 0, y: Math.PI, z: 0 }, 9000)
	.delay(100)	
	.onUpdate(function() {

	})
	.onComplete(function() {
		mesh.stars.rotation.y %= Math.PI; 
	})
	.start();	
	
	var tweenC = new TWEEN.Tween( mesh.galaxy.rotation )
	.to({ x: 0, y: Math.PI, z: 0 }, 9000)
	.delay(100)	
	.onUpdate(function() {

	})
	.onComplete(function() {
		mesh.galaxy.rotation.y %= Math.PI; 
	})
	.start();	*/
}

function drawNebula() {
	var geometry = new THREE.SphereBufferGeometry( 9000, 18, 16 );
	var material = new THREE.MeshBasicMaterial( { transparent: true, opacity: .6, side: THREE.BackSide } );
	mesh.nebula = new THREE.Mesh( geometry, material );
	scene.add(mesh.nebula);
	mesh.nebula.visible = false; 
	//console.log(geometry.attributes.position.length); 

	var textureLoader = new THREE.TextureLoader();

	textureLoader.load( 'images/equi2.jpg', function(tx) { 	
		mesh.nebula.material.map = tx; 
		mesh.nebula.material.needsUpdate = true;
		mesh.nebula.visible = true; 
	});    	
}

function drawAsteroids() {
	/*var geometry = new THREE.CylinderBufferGeometry( 300, 300, 200, 16, 1, true );
	var material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 1, side: THREE.BackSide} );
	mesh.cylinder = new THREE.Mesh( geometry, material );
	scene.add( mesh.cylinder );	
	mesh.cylinder.visible = false; */
	
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    for ( var i = 0; i < 60; i ++ ) {
		var vct = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct.normalize();
		vct.multiplyScalar(THREE.Math.randFloat(1100, 1300)); 

        vertices.push( vct.x, vct.y, vct.z );
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

	var material = new THREE.PointsMaterial({ color: 0xcccccc, size: 30, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false }); 
	mesh.asteroids = new THREE.Points( geometry, material );
	scene.add( mesh.asteroids ); 		
		
	mesh.asteroids.visible = false; 	
	mesh.asteroids.scale.set(1, .05, 1); 
	
    var geometry2 = new THREE.BufferGeometry();
    var vertices2 = [];

    for ( var i = 0; i < 60; i ++ ) {
		var vct2 = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct2.normalize();
		vct2.multiplyScalar(THREE.Math.randFloat(1200, 1300)); 

        vertices2.push( vct2.x, vct2.y, vct2.z );
    }
    geometry2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );

	var material2 = new THREE.PointsMaterial({ color: 0xcccccc, size: 30, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false }); 
	mesh.asteroids2 = new THREE.Points( geometry2, material2 );
	scene.add( mesh.asteroids2 ); 		
		
	mesh.asteroids2.visible = false; 	
	mesh.asteroids2.scale.set(1, .05, 1); 
	
    var geometry3 = new THREE.BufferGeometry();
    var vertices3 = [];

    for ( var i = 0; i < 60; i ++ ) {
		var vct3 = new THREE.Vector3(2 * Math.random() - 1, 2 * Math.random() - 1, 2 * Math.random() - 1 );
		vct3.normalize();
		vct3.multiplyScalar(THREE.Math.randFloat(1100, 1200)); 

        vertices3.push( vct3.x, vct3.y, vct3.z );
    }
    geometry3.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices3, 3 ) );

	var material3 = new THREE.PointsMaterial({ color: 0xcccccc, size: 30, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false }); 
	mesh.asteroids3 = new THREE.Points( geometry3, material3 );
	scene.add( mesh.asteroids3 ); 		
		
	mesh.asteroids3.visible = false; 	
	mesh.asteroids3.scale.set(1, .05, 1); 
	
	var textureLoader = new THREE.TextureLoader();
		textureLoader2 = new THREE.TextureLoader();
		textureLoader3 = new THREE.TextureLoader();

	textureLoader.load( 'images/asteroid1b.png', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(5, 1);    
		
		mesh.asteroids.material.map = tx; 
		mesh.asteroids.material.needsUpdate = true;
		mesh.asteroids.visible = true; 
	});  	
	
	textureLoader2.load( 'images/asteroid2b.png', function(tx) { 	
		mesh.asteroids2.material.map = tx; 
		mesh.asteroids2.material.needsUpdate = true;
		mesh.asteroids2.visible = true; 
	});  	
	
	textureLoader3.load( 'images/asteroid3b.png', function(tx) { 	
		mesh.asteroids3.material.map = tx; 
		mesh.asteroids3.material.needsUpdate = true;
		mesh.asteroids3.visible = true; 
	});  	
}	

function theSun() {
	/*var geometry = new THREE.SphereBufferGeometry( 16, 32, 28 );
	var material = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0, blending: THREE.AdditiveBlending } );
	//var material = new THREE.MeshStandardMaterial( { roughness: 0.3, metalness: 0.3, blending: THREE.AdditiveBlending, lightMapIntensity: 9 } );
	mesh.sun = new THREE.Mesh( geometry, material );
	scene.add(mesh.sun);
	mesh.sun.visible = false; 
	//console.log(geometry.attributes.position); 

	var textureLoader = new THREE.TextureLoader();

	//textureLoader.load( 'img/Terrestrial4.png', function(tx) { 	
	textureLoader.load( 'images/fire2.jpg', function(tx) { 	
	//textureLoader.load( 'images/sunset1.jpg', function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.repeat.set(16, 8);    		
	
		mesh.sun.material.map = tx; 
		mesh.sun.material.needsUpdate = true;
		mesh.sun.visible = true; 
		
		animate();
	});    	
	*/
	
	//var geometry = new THREE.CircleBufferGeometry( 48, 32 );
	var geometry = new THREE.CircleBufferGeometry( 24, 16 );

	mesh.uniFs = {
		time: { type: "f", value: 1.0 },
		alpha: { type: "f", value: 0.01 },		
		resolution: { type: "v2", value: new THREE.Vector2()  }
	};	

	mesh.uniFs.resolution.value.x = 40;
    mesh.uniFs.resolution.value.y = 40;
	
	var material = new THREE.ShaderMaterial({
		uniforms: mesh.uniFs,
		vertexShader: shades.vsGlow, 
		fragmentShader: shades.fsGlow
		, transparent: true 
		//, opacity: 0.1
		//, alphaTest: 0.5
		, depthWrite: false
		, blending: THREE.AdditiveBlending
	}); 	
	
	mesh.sunGlow = new THREE.Mesh( geometry, material );
	scene.add( mesh.sunGlow );	
	
	mesh.sunGlow.scale.set(0.01, 0.01, 0.01); 
	//mesh.uniFs.alpha.value = 0.01; 
	
	//animate(); 
}

function thePlanets() {
	var textureLoader = [];
	mesh.planet = []; 
	mesh.orbitGap = 4; 	
	mesh.planetGroup = new THREE.Group(); 
	win.n = 0; 
	
	for (var i = 0; i < 9; i++) {
		var geometry = new THREE.SphereBufferGeometry( 1.5, 20, 16 );
		var material = new THREE.MeshStandardMaterial( { transparent: true, opacity: 0, roughness: 0.5, metalness: 0.25, bumpScale: .15 } );
		mesh.planet[i] = new THREE.Mesh( geometry, material );
		
		mesh.planet[i].position.x = mesh.orbitGap * i + 8;
		mesh.planetGroup.add(mesh.planet[i]);
		mesh.planet[i].visible = false; 
		
		mesh.planet[i].name = 'planet' + (i + 1); 
		
		//console.log(geometry.attributes.position); 
		//console.log(mesh.planet[i].position);
		
		textureLoader[i] = new THREE.TextureLoader();
		
		//win.imgUrl = 'images/planets/tx' + i + '.jpg'; 
		
		//textureLoader.load( 'img/Terrestrial4.png', function(tx) { 	
		//textureLoader.load( 'images/Martian-EQUIRECTANGULAR-1-1024x512.png', function(tx) { 		
		textureLoader[i].load( 'images/planets/tx' + i + '.jpg', function(tx) { 	
			//mesh.planet[win.n].material.map = mesh.planet[win.n].material.bumpMap = mesh.planet[win.n].material.roughnessMap = tx; 
			//mesh.planet[win.n].material.needsUpdate = true;
			//mesh.planet[win.n].visible = true; 
			//win.n += 1; 			
			//console.log(tx.id);
			
			var num = tx.id - 12; 
			
			mesh.planet[num].material.map = mesh.planet[num].material.bumpMap = mesh.planet[num].material.roughnessMap = tx; 
			mesh.planet[num].material.needsUpdate = true;
			mesh.planet[num].visible = true; 			
		});    	
	
		if (i == 8) {
			scene.add(mesh.planetGroup);
			
			animate();  
		}
	}

}	

function autoTypeAbout() {
	//document.getElementById('myProfile'); 
	//ui.moiInfo.innerHTML = aboutData.fotoAndTitle.content; 

	var speed = 40, 
		spc = false,  	
		i = 0, 
		tmpTxt = '', 
		txt = aboutData.aboutMe.content; 

	//console.log(txt.length);
	//ui.moiInfo.innerHTML += txt;
	
	typeIt(); 
	
	function typeIt() { 
		if (i < txt.length) {
			tmpTxt += txt.charAt(i);
			
			if (txt.charAt(i) == '<') {
				spc = true;
				speed = 1; 
			} else if (txt.charAt(i) == '>') {
				spc = false; 
				speed = 40; 
			}			
			
			if (!spc) {
				if (txt.charAt(i) == '>') {
					ui.moiInfo.innerHTML = tmpTxt;
				} else {
					ui.moiInfo.innerHTML += txt.charAt(i);
				}
			}
			
			ui.moiInfo.scrollTop = ui.moiInfo.scrollHeight;
			
			i++;
			
			//console.log(speed);
			if (win.aboutOpen) setTimeout(typeIt, speed);
		}
	}	
}

function exploreClick(e) {
	e.preventDefault(); 
	
	controls.autoRotate = false; 
	
	var explore = document.getElementById("explore"); 
	explore.removeEventListener( 'click', exploreClick, false ); 	
	
	var myName = document.getElementById("myName"), 
		welcome = document.getElementById("welcome"),  
		entro = document.getElementById("entro"),  
		theLogo = document.getElementById("theLogo");  
		//bg14 = document.getElementsByClassName("bg14");   
		//ntro = document.getElementsByClassName("ntro"); 
	
	win.entro = false; 
	
	var tweenA = new TWEEN.Tween( {x: 1})
		.to({ x: 0 }, 1000)
		.delay(500)	
		.onUpdate(function() {
			welcome.style.opacity = this.x; 
			/*var opac = this.x * .1; 
			welcome.style.opacity = opac; 
			var size = 11. - this.x; 
			welcome.style.transform = 'scale(' + size + ')'; */
		})
		.onComplete(function() {
			entro.style.zIndex = welcome.style.zIndex = -1;		
			//welcome.style.transform = 'scale(0)'; 
			welcome.style.display = 'none';		
			
			explore.parentNode.removeChild(explore);
			myName.parentNode.removeChild(myName);
			welcome.parentNode.removeChild(welcome);
			entro.parentNode.removeChild(entro);
		})
		.start();		
	
	var tweenB = new TWEEN.Tween( camera.position )
		.to({ x: 0, y: 0, z: 50 }, 3000)
		.delay(500)	
		.onUpdate(function() {
			
		})
		.onComplete(function() {
			controls.autoRotate = true; 
			
			//if (!clock.running) clock.start(); 
			
			ui.myProfile.classList.add('shown'); 
			ui.aboutJM.innerHTML = '<img src="images/klose2.png" alt="">'; 
			win.aboutOpen = true; 
			
			//bg14[0].style.opacity = 1; 
			ui.aboutJM.classList.remove('d0'); 
			
			/*ui.myPlanets.classList.add('shown'); 
			ui.planetsInfo.innerHTML = '<img src="images/klose2.png" alt="">'; 
			win.planetsOpen = true; 
			
			ui.planetsInfo.classList.remove('d0'); */
			
			//ntro[0].classList.remove("ntro"); 
			
			win.planetsOpen = win.timelineOpen = false; 
			ui.planetsInfo.classList.remove('d0'); 
			
			autoTypeAbout(); 
			
			ui.myMap.style.display = ui.myTimeline.style.display = "block"; 
		})
		.start();	
		
	tweenB.easing(TWEEN.Easing.Exponential.InOut); 

	var tweenC = new TWEEN.Tween( mesh.galaxy.scale )
		.to({ x: 5, y: .5, z: 5 }, 3000)
		.delay(500)	
		.onStart(function() {
			controls.enabled = false; 
			
			mesh.galaxy.material.opacity = .9; 
		})		
		.onUpdate(function() {
	
		})
		.onComplete(function() {
			controls.enabled = true; 
		})
		.start();	
	
	var tweenD = new TWEEN.Tween( { x: 0.9 } )
		.to({ x: 0 }, 500)
		.delay(3000)	
		.onUpdate(function() {
			mesh.galaxy.material.opacity = this.x; 
			
		})
		.onComplete(function() {
			mesh.galaxy.visible = false; 	
			
			scene.remove(mesh.galaxy); 			
			mesh.galaxy.geometry.dispose(); 
			mesh.galaxy.material.dispose(); 
			mesh.galaxy = undefined; 			
		})
		.start();	
		
	var tweenE = new TWEEN.Tween( mesh.sunGlow.scale )
		.to({ x: 1, y: 1, z: 1 }, 3000)
		.delay(500)	
		.onStart(function() {
			
		})		
		.onUpdate(function() {
			//mesh.sun.material.opacity = mesh.planet[0].material.opacity = mesh.asteroids.material.opacity = mesh.asteroids2.material.opacity = mesh.asteroids3.material.opacity = this.x; 
			mesh.planet[0].material.opacity = mesh.asteroids.material.opacity = mesh.asteroids2.material.opacity = mesh.asteroids3.material.opacity = this.x; 
		})
		.onComplete(function() {
			var nPlanets = mesh.planet.length; 
			
			for (var n = 0; n < nPlanets; n++) {
				mesh.planet[n].material.transparent = false; 
				mesh.planet[n].material.opacity = 1; 
			}
			
			//mesh.sun.material.transparent = false; 
			//mesh.sun.material.opacity = mesh.asteroids.material.opacity = mesh.asteroids2.material.opacity = mesh.asteroids3.material.opacity = 1; 
			mesh.asteroids.material.opacity = mesh.asteroids2.material.opacity = mesh.asteroids3.material.opacity = 1; 
		})
		.start();		
		
	var tweenF = new TWEEN.Tween( {x: -54})
		.to({ x: 0 }, 500)
		.delay(3500)	
		.onUpdate(function() {
			theLogo.style.transform = 'translateY(' + this.x + 'px)';
		})
		.onComplete(function() {
			theLogo.style.transform = 'translateY(0)';
			
			var vec = new THREE.Vector3(); 
			var pos = new THREE.Vector3(); 
			
			vec.set( ( 0 / window.innerWidth ) * 2 - 1, - ( 0 / window.innerHeight ) * 2 + 1, 0.5 );
			vec.unproject( camera );
			vec.sub( camera.position ).normalize();
			var distance = - camera.position.z / vec.z;
			pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );		
			
			var posX = pos.x * .104; 
		})
		.start();			
}

function onWindowResize() {
	//if (!isMobil) {
    win.width = window.innerWidth;
    win.height = window.innerHeight;
    
	if (isMobil) {
        var winWH = document.documentElement.getBoundingClientRect();
        var winWHx = document.documentElement.clientWidth, 
            winWHy = document.documentElement.clientHeight;
        if (winWH) {
            win.width = winWH.width;
            win.height = winWH.height;
        } else if (winWHx) {
            win.width = winWHx;
            win.height = winWHy;            
        } else {
            var tmpWW = win.width;
            win.width = win.height; 
            win.height = tmpWW;
        }
    }
        
    //wwh = win.width / 2;
    //whh = win.height / 2;                
    
    document.body.style.width = ui.kontainer.style.width = win.width + 'px';
    document.body.style.height = ui.kontainer.style.height = win.height + 'px';    
	
	camera.aspect = win.width / win.height;
	camera.updateProjectionMatrix();

	renderer.setSize(win.width, win.height);	
	
	if (win.entro) win.composer.setSize(win.width, win.height);	
	
	win.idleTimer = 0; 
}

function onMouseMove2( event ) {
    event.preventDefault();
	
    var clientX = event.clientX || event.touches[ 0 ].clientX;
    var clientY = event.clientY || event.touches[ 0 ].clientY;	
	
	win.mouse.x = (clientX / win.width) * 2 - 1;
    win.mouse.y = -(clientY / win.height) * 2 + 1;    
	
    mesh.raycaster.setFromCamera(win.mouse, camera);
	
	var intersects; 
	
	intersects = mesh.raycaster.intersectObjects([ mesh.planetGroup ], true);  
    //console.log(intersects); 
	
	if (intersects.length > 0) {
        if (mesh.intersected != intersects[0].object) mesh.intersected = intersects[0].object;
		
		//console.log(mesh.intersected.name); 
		
		ui.kontainer.style.cursor = "pointer"; 
	} else {
		mesh.intersected = null; 
		 
		ui.kontainer.style.cursor = "default"; 
	}
	
	win.idleTimer = 0; 
}	

function onMouseWheel( event ) {
    event.preventDefault();
    //event.stopPropagation();                

    win.idleTimer = 0;
}	

function aboutJMClick(event) {
	if (event) event.preventDefault(); 
	
	if (win.aboutOpen) {
		ui.myProfile.classList.remove('shown'); 
			
		ui.aboutJM.innerHTML = '<img src="images/cv.png" alt="">'; 
		win.aboutOpen = false; 		
	} else {
		ui.myProfile.classList.add('shown'); 
			
		ui.aboutJM.innerHTML = '<img src="images/klose2.png" alt="">'; 
		win.aboutOpen = true; 		
		
		autoTypeAbout(); 
	}
	
	win.idleTimer = 0; 
}

function planetsInfoClick(event) {
	if (event) event.preventDefault(); 
	
	if (win.timelineOpen) {
		ui.timelineZ.classList.remove('shown'); 
			
		win.timelineOpen = false; 	
	}
	
	if (win.planetsOpen) {
		ui.myPlanets.classList.remove('shown'); 
			
		ui.planetsInfo.innerHTML = '<img src="images/planet.png" alt="">'; 
		win.planetsOpen = false; 		
	} else {
		ui.myPlanets.classList.add('shown'); 
			
		ui.planetsInfo.innerHTML = '<img src="images/klose2.png" alt="">'; 
		win.planetsOpen = true; 		
	}
	
	win.idleTimer = 0; 
}

function myMapClick(event) {
	event.preventDefault(); 
	
	
	//win.idleTimer = 0; 
}

function myTimelineClick(event) {	
	if (event) event.preventDefault(); 
	
	if (win.planetsOpen) {
		ui.myPlanets.classList.remove('shown'); 
			
		ui.planetsInfo.innerHTML = '<img src="images/planet.png" alt="">'; 
		win.planetsOpen = false; 	
	}
	
	if (win.timelineOpen) {
		if (mesh.currSelected != 2) {
			ui.timelineZ.classList.remove('shown'); 
			
			win.timelineOpen = false; 		
		}
	} else {
		ui.timelineZ.classList.add('shown'); 
			
		win.timelineOpen = true; 		
		
		var tlLength = timelineData.length; 
		
		for (var i = 0; i < tlLength; i++) {
			var tlEntry = document.createElement("div"); 
			tlEntry.innerHTML = timelineData[i].content; 
			
			ui.timelineEntry.appendChild(tlEntry); 
		}
	}	
	
	win.idleTimer = 0; 
}

function timelineXClick(event) {
	if (event) event.preventDefault(); 
	
	if (win.timelineOpen) {
		ui.timelineZ.classList.remove('shown'); 
			
		win.timelineOpen = false; 		
	}
	
	win.idleTimer = 0; 
}

function kontainerClick(event) {
    event.preventDefault(); 
	//event.stopPropagation();
	//console.log('k');
	
	if (mesh.intersected) {
		switch (mesh.intersected.name) {
			case 'planet1': 
				ui.moiPlanets.innerHTML = planetData.planet1.content; 
				mesh.currSelected = 1; 
				
				break;
			case 'planet2': 
				//ui.moiPlanets.innerHTML = planetData.planet2.content; 
				mesh.currSelected = 2; 

				myTimelineClick(); 
				
				break;
			case 'planet3': 
				//ui.moiPlanets.innerHTML = planetData.planet3.content; 
				mesh.currSelected = 3; 
				
				window.open (
					//"mymap.html", "_blank"
					//"https://zone80.space/mymap.html", "_blank"
					"http://thewebdesignerpro.com/julien/beta/mymap.html", "_blank"
				);				
				
				break;
			case 'planet4': 
				ui.moiPlanets.innerHTML = planetData.planet4.content; 
				mesh.currSelected = 4; 
				
				break;
			case 'planet5': 
				ui.moiPlanets.innerHTML = planetData.planet5.content; 
				mesh.currSelected = 5; 
				
				break;
			case 'planet6': 
				ui.moiPlanets.innerHTML = planetData.planet6.content; 
				mesh.currSelected = 6; 
				
				break;
			case 'planet7': 
				ui.moiPlanets.innerHTML = planetData.planet7.content; 
				mesh.currSelected = 7; 
				
				break;
			case 'planet8': 
				ui.moiPlanets.innerHTML = planetData.planet8.content; 
				mesh.currSelected = 8; 
				
				break;
			case 'planet9': 
				ui.moiPlanets.innerHTML = planetData.planet9.content; 
				mesh.currSelected = 9; 
				
				break;
			default:
			
		}
		
		if (win.planetsOpen) {
			if ((mesh.currSelected != 2) && (mesh.currSelected != 3)) {
				ui.myPlanets.style.opacity = 0; 
		
				var tweenIt = new TWEEN.Tween({x: 0})
					.to({ x: 1 }, 1000)
					.delay(100)	
					.onUpdate(function() {
						ui.myPlanets.style.opacity = this.x; 
					})
					.onComplete(function() {
						ui.myPlanets.style.opacity = 1; 
					})
					.start();					
			}
		} else {
			if ((mesh.currSelected != 2) && (mesh.currSelected != 3)) {			
				ui.myPlanets.classList.add('shown'); 
					
				ui.planetsInfo.innerHTML = '<img src="images/klose2.png" alt="">'; 
				win.planetsOpen = true; 		
			}	
				
			if (mesh.currSelected != 2) {	
				if (win.timelineOpen) {
					ui.timelineZ.classList.remove('shown'); 
						
					win.timelineOpen = false; 	
				}	
			}
		}		
		
		controls.enabled = false; 
		
		mesh.zoomIn = true; 
		
		var planetPos = new THREE.Vector3();  
		planetPos.copy(mesh.intersected.position); 
        //planetPos.normalize();

		//var zoomPos = planetPos.multiplyScalar(2 * (mesh.orbitGap * (mesh.currSelected-1) + 8)); 
		var zoomPos = planetPos.multiplyScalar(1.6 - ((mesh.currSelected-1) * .04)); 
			
		var tweenIn = new TWEEN.Tween(camera.position)
			.to(zoomPos, 500)
			.delay(10)	
			.onComplete(function() {
				mesh.zoomIn = false; 
				
				controls.enabled = true; 
			})
			.start();			
			
		tweenIn.easing(TWEEN.Easing.Quadratic.Out); 			
	}
	
	win.idleTimer = 0; 
}

function animate() { 
    requestAnimationFrame(animate);

	if (win.idleTimer < idleTO) {
		if (!clock.running) clock.start(); 
		
		var elapsed = clock.getElapsedTime() + 60.;	
		
		var	mti2 = Math.cos(elapsed * 0.5);  
		if (mti2 < 0) mti2 *= -1;
					
		mesh.uniFs.alpha.value = mti2 + .1;	
					
		mesh.light.intensity = mti2 + 1; 	
		
		for (var i = 0; i < 9; i++) {
			var og = mesh.orbitGap * i + 8, 
				orbtX = orbtY = orbtZ = 8, 
				tme = 0; 
				
			switch (i) {
				case 0: 
					tme = elapsed * .13; 
				
					break;	
				case 1: 
					tme = elapsed * .11; 
				
					break;			
				case 2: 
					tme = elapsed * .09; 
				
					break;
				case 3: 
					tme = elapsed * .07; 
				
					break; 				
				case 4: 
					tme = elapsed * .05; 
				
					break;				
				case 5: 						
					tme = elapsed * .04; 
				
					break;
				case 6: 
					tme = elapsed * .03; 
				
					break;				
				case 7: 
					tme = elapsed * .02; 
				
					break;				
				case 8: 
					tme = elapsed * .01; 
				
					break;
				default: 
				
			}	
				
			/*if (i < 3) {
				orbtX = Math.sin(tme) * og; 
				orbtY = Math.sin(tme) * og; 
				orbtZ = Math.cos(tme) * og; 
			} else if (i < 6) {
				orbtX = Math.cos(tme) * og; 
				orbtY = Math.cos(tme) * og; 
				orbtZ = Math.sin(tme) * og; 			
			} else {
				orbtX = Math.sin(tme) * og; 
				orbtY = Math.sin(tme) * og; 
				orbtZ = Math.sin(tme) * og; 			
			}*/			
				
			/*if (mesh.currSelected == i+1) {
				if (!mesh.zoomIn) mesh.planet[i].position.set(orbtX, orbtY, orbtZ); 
			} else {
				mesh.planet[i].position.set(orbtX, orbtY, orbtZ); 
			}*/
			
			orbtX = Math.sin(tme) * og; 
			orbtZ = Math.cos(tme) * og; 
			
			mesh.planet[i].position.set(orbtX, 0, orbtZ); 
		}
		
		win.idleTimer += 0.01; 
		
		render();
	} else {
		clock.stop(); 
		
		//console.log('stop');
		//if (document.hasFocus()) win.idleTimer = 0; 
	}
	
	if (!document.hasFocus()) win.idleTimer = idleTO; 	

	//console.log(elapsed);
	
	TWEEN.update();	
}
	
function render() {
	mesh.sunGlow.lookAt(camera.position); 	
	//mesh.panelGroup.lookAt(camera.position); 	
	
	controls.update(); 

	if (win.entro) {
		win.composer.render();	
	} else {
		renderer.render( scene, camera );	
	}
	
}
