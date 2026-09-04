/**
 * author Armstrong "Army" Chiu
 * URL: https://thewebdesignerpro.com/     
 */
 

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
//import { Water } from 'three/addons/objects/Water.js';
//import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'; 

//import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';


//import Lenis from 'lenis'; 

const idleTO = 120, florY = -1, ceilY = 140;  

let camera, scene, renderer, clock; 
const grups = []; 
let isMobil = false; 
let mouseX = 0, mouseY = 0;  

const ui = {}, _ = {}, x = {}; 

let brainTex; 

const uniforms = {
	u_time: {type: 'f', value: 0.0},
	u_frequency: {type: 'f', value: 0.0},
	uTexture: { value: brainTex } // Pass texture as a uniform
}


// TEMP START
let stats;

stats = new Stats();
ui.stats = document.getElementById('stats'); 
ui.stats.appendChild( stats.dom );
//document.body.appendChild( stats.dom );

// TEMP END


if ( WebGL.isWebGL2Available() ) {
	
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}				
	
} else {		

	const warning = WebGL.getWebGL2ErrorMessage();
    kontainer.appendChild(warning);	
	
	kontainer.style.background = "url('img/spheretecl.jpg') center top no-repeat"; 
	kontainer.style.backgroundSize = "cover"; 
	
 	fader.style.opacity = 0;
    fader.style.display = "none";
	fader.parentNode.removeChild(fader);	
	
	cL(loadr, 0, "paus");
	loadr.style.display = "none";	
	loadr.parentNode.removeChild(loadr);		
	
}

function eL(e, aor, evt, f) {
	
	if (aor == 0) {
		e.addEventListener(evt, f, false);
	} else {
		e.removeEventListener(evt, f, false);
	}
	
}

function cL(e, aor, cls) {
	
	if (aor == 0) {
		if (!e.classList.contains(cls)) e.classList.add(cls); 
	} else {		
		if (e.classList.contains(cls)) e.classList.remove(cls); 
	}
	
}

const lenis = new Lenis({
	autoRaf: true,
}); 

//const lenis = new Lenis(); 

// Listen for the scroll event and log the event data
//lenis.on('scroll', (e) => {
//	console.log(e);
//});	

function init() {
	
	function $(id) {
		return document.getElementById(id);
	}	
	
		
	ui.kontainer = $('kontainer'); 
	ui.content = $('content'); 
	
	//ui.swtchKam = $('swtchKam'); 
	ui.onAud = $('onAud'); 
	ui.offAud = $('offAud'); 
	
	//ui.swtchKam.style.visibility = "hidden"; 
	
	ui.loadr = $('loadr'); 
	ui.fader = $('fader'); 
	ui.fader.style.opacity = 1;		
	
	let dummy = document.createElement("div");
	dummy.setAttribute("id", "dummy");
	document.body.appendChild(dummy);
	
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

		_.prevW = _.prevH = 0; 	
	}
	
	dummy.parentNode.removeChild(dummy);		
	
	_.width = window.innerWidth; 
	_.height = window.innerHeight; 
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    //document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
    ui.kontainer.style.height = _.height + 'px';    

    //ui.kontainer.style.opacity = 0;		
    ui.kontainer.style.backgroundColor = '#000000';		

	const fogCol = 0x000000; 

	
	_.camPosZ = 20; 
	

	renderer = new THREE.WebGLRenderer({antialias: true, alpha: false});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( _.width, _.height );
	renderer.setClearColor(fogCol, 1.0); 
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
	//renderer.toneMapping = THREE.ACESFilmicToneMapping;	
	renderer.outputColorSpace = THREE.LinearSRGBColorSpace; 
//	renderer.sortObjects = false;	
	ui.kontainer.appendChild(renderer.domElement); 
	
	// Check for float-RT support
	// TODO (abelnation): figure out fall-back for float textures
	if ( renderer.capabilities.isWebGL2 === false && ! renderer.extensions.get( 'OES_texture_float' ) ) {
		alert( 'OES_texture_float not supported' );
		throw 'missing webgl extension';
	}

	if ( renderer.capabilities.isWebGL2 === false && ! renderer.extensions.get( 'OES_texture_float_linear' ) ) {
		alert( 'OES_texture_float_linear not supported' );
		throw 'missing webgl extension';
	}	
	
    scene = new THREE.Scene();
	
	x.camGrup = new THREE.Group(); 
	
	grups[0] = new THREE.Group(); 
	grups[1] = new THREE.Group(); 

	camera = new THREE.PerspectiveCamera( 50, _.width / _.height, .1, 10000 ); 
	camera.position.set(0, 0, _.camPosZ); 

    x.camGrup.add(camera);		
	
	scene.add( new THREE.AmbientLight( 0xcdcdcd ) );	

	x.spotLight = []; 
	
	x.spotLight[0] = new THREE.SpotLight( 0xffffff, 20000, 100, Math.PI/8, 1 );
	x.spotLight[0].position.set( -30, 30, 40 );
	x.spotLight[0].shadow.camera.near = 1;
	x.spotLight[0].shadow.camera.far = 100;
	x.spotLight[0].shadow.camera.fov = 50;
	
	scene.add( x.spotLight[0] );	
	
	scene.add(x.camGrup); 
	
	eL(window, 1, "load", init); 
	eL(window, 0, "resize", onWindowResize); 
	eL(window, 0, "mousemove", onMouseMove); 
	
    clock = new THREE.Clock();	
	clock.autoStart = false; 	
	//clock.start(); 		
	
	_.mouse = new THREE.Vector2(); 	
	_.entro = true; 
	_.idleTimer = 0; 
	_.fokus = true; 
	
	_.pointer = new THREE.Vector2();
	_.ptrDown = false; 

	x.target0 = new THREE.Object3D(); 
	x.target0.position.set(0, 0, 0); 
	scene.add(x.target0);
	
	//x.target1 = new THREE.Object3D(); 
	//x.target1.position.set(0, 0, 500); 
	//scene.add(x.target1);
	
	//x.spotLight[0].target = x.target1; 

	//x.rotCam = false; 
	
	_.checkPt = []; 
	_.zoomIn = true; 
	_.prevScrollTop = 0; 
	
	initBloom(); 
	
	

	//fadeScene(); 
	
	//onWindowResize(); 
	
}

function initBloom() {
	const renderScene = new RenderPass(scene, camera);
	
	//const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(_.width, _.height));
	bloomPass.threshold = .45; 
	bloomPass.strength = 2.;
	bloomPass.radius = 1.;
	
	_.bloomComposer = new EffectComposer(renderer);
	_.bloomComposer.addPass(renderScene);
	_.bloomComposer.addPass(bloomPass);
	
	const outputPass = new OutputPass();
	_.bloomComposer.addPass(outputPass);	
	
	addStars(); 
	
}

function addStars() {
	
	//const geometry = new THREE.PlaneGeometry( 35500, 17750 );
	//const geometry = new THREE.PlaneGeometry( 350, 175 );
	const geometry = new THREE.PlaneGeometry( 400, 200 );
	const material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	
	x.stars = new THREE.Mesh( geometry, material );
	//x.stars.position.z = -5000;
	x.stars.position.z = -60;

	grups[1].add( x.stars );
	//scene.add( grups[1] );

	const geometry2 = new THREE.PlaneGeometry( 350, 175 );
	const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
	
	const dummyP = new THREE.Mesh( geometry2, material2 );
	dummyP.position.z = 60;
	dummyP.visible = false; 
	
	grups[1].add( dummyP );
	scene.add( grups[1] );

	
	const loader = new THREE.TextureLoader(), 
		  url2 = 'img/', 
		  fileName = 'milkyway2k', 
		  frmt = '.jpg'; 
		  
	//let fileName = 'milkyway2k'; 
	//	  
	//switch (true) {
	//	case (_.width > 1440):
	//		fileName = 'milkyway2k'; 
	//		console.log('2k');
	//		break;
	//	case (_.width > 1024): 
	//		fileName = 'milkyway1k'; 
	//		console.log('1k');
	//		break;
	//	default:
	//		
	//}
	
	loader.load( url2 + fileName + frmt, function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		////tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(2, 2);    
	
		x.stars.material.map = tx; 
		x.stars.material.needsUpdate = true; 
		
		x.stars.material.wireframe = false; 
	});  	
	
	prepSphere(); 
	//addSphere(); 
}

function prepSphere() {
	const geometry = new THREE.IcosahedronGeometry(5, 35 );

	const material = new THREE.MeshStandardMaterial({ color: 0x0055dd, wireframe: true }); 
	material.transparent = true; 
	//material.opacity = .5; 
	
	x.sphere = new THREE.Mesh(geometry, material);
	grups[0].add(x.sphere);
	scene.add( grups[0] );

	//x.sphere.position.z = 14.8;
	//x.sphere.position.z = 5.;
	
	//console.log(x.sphere.geometry.attributes.position);	
	
	const geometry2 = new THREE.IcosahedronGeometry(4.82, 35 );
	const material2 = new THREE.MeshLambertMaterial({ color: 0x70a0c0, wireframe: true }); 

	x.sphere2 = new THREE.Mesh(geometry2, material2);
	grups[0].add(x.sphere2);
	//scene.add( grups[0] );

	//x.sphere.position.z = 14.8;
	//x.sphere.position.z = 5.;
	

	
	const loader = new THREE.TextureLoader(), 
		  loader1 = new THREE.TextureLoader(), 
		  loader2 = new THREE.TextureLoader(), 
		  loader3 = new THREE.TextureLoader(), 
		  loader4 = new THREE.TextureLoader(), 
		  loader5 = new THREE.TextureLoader(), 
		  url2 = 'img/test/', 
		  fileName = 'test1', 
		  fileName1 = 'test1_rough', 
		  fileName2 = 'test1_alpha', 
		  fileName3 = 'test1_glow', 
		  fileName4 = 'test1_disp', 
		  fileName5 = 'test1_metal', 
		  frmt = '.jpg'; 
	
	loader.load( url2 + fileName + frmt, function(tx) { 	
		tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		//tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		tx.repeat.set(8, 4);    	
	
		x.sphere.material.map = tx; 
		x.sphere.material.color.set(0xffffff); 
		x.sphere.material.needsUpdate = true; 
		
		x.sphere.material.wireframe = x.sphere2.material.wireframe = false; 
		
		fadeScene(); 
		
	});
	
	loader1.load( url2 + fileName1 + frmt, function(tx1) { 	
		tx1.wrapS = tx1.wrapT = THREE.RepeatWrapping;    
		//tx1.wrapS = tx1.wrapT = THREE.MirroredRepeatWrapping;    
		tx1.repeat.set(8, 4);    	
	
		x.sphere.material.roughnessMap = tx1; 
		x.sphere.material.needsUpdate = true; 
	});
	
	loader2.load( url2 + fileName2 + frmt, function(tx2) { 	
		tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
		//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
		tx2.repeat.set(8, 4);    	
	
		x.sphere.material.alphaMap = tx2; 
		x.sphere.material.needsUpdate = true; 
	});
	
	//loader2.load( url2 + fileName2 + frmt, function(tx2) { 	
	//	tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
	//	//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx2.repeat.set(8, 4);    	
	//
	//	x.sphere.material.normalScale.set(1.5, 1.5); 
	//	x.sphere.material.normalMap = tx2; 
	//	x.sphere.material.needsUpdate = true; 
	//});
	
	//loader2.load( url2 + fileName2 + frmt, function(tx2) { 	
	//	tx2.wrapS = tx2.wrapT = THREE.RepeatWrapping;    
	//	//tx2.wrapS = tx2.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx2.repeat.set(8, 4);    	
	//
	//	x.sphere.material.bumpScale = 30; 
	//	x.sphere.material.bumpMap = tx2; 
	//	x.sphere.material.needsUpdate = true; 
	//});
	
	//loader3.load( url2 + fileName3 + frmt, function(tx3) { 	
	//	tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
	//	//tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
	//	tx3.repeat.set(8, 4);    	
	//
	//	x.sphere.material.aoMapIntensity = 1; 
	//	x.sphere.material.aoMap = tx3; 
	//	x.sphere.material.needsUpdate = true; 
	//});
	
	loader3.load( url2 + fileName3 + frmt, function(tx3) { 	
		//tx3.wrapS = tx3.wrapT = THREE.RepeatWrapping;    
		tx3.wrapS = tx3.wrapT = THREE.MirroredRepeatWrapping;    
		tx3.repeat.set(2, 1);    	
		
		tx3.colorSpace = THREE.SRGBColorSpace;
	
		x.sphere2.material.emissive.set(0x70a0c0); 
		x.sphere2.material.emissiveMap = tx3; 
		x.sphere2.material.needsUpdate = true; 
	});
	
	loader4.load( url2 + fileName4 + frmt, function(tx4) { 	
		tx4.wrapS = tx4.wrapT = THREE.RepeatWrapping;    
		//tx4.wrapS = tx4.wrapT = THREE.MirroredRepeatWrapping;    
		tx4.repeat.set(8, 4);    	
	
		x.sphere.material.bumpScale = 13; 
		x.sphere.material.bumpMap = tx4; 
		
		//x.sphere.material.displacementScale = .5; 
		x.sphere.material.displacementMap = tx4; 
		x.sphere.material.needsUpdate = true; 		
		
		x.sphere2.material.displacementScale = .9; 
		x.sphere2.material.displacementMap = tx4; 
		x.sphere2.material.needsUpdate = true; 
	});
	
	loader5.load( url2 + fileName5 + frmt, function(tx5) { 	
		tx5.wrapS = tx5.wrapT = THREE.RepeatWrapping;    
		//tx5.wrapS = tx5.wrapT = THREE.MirroredRepeatWrapping;    
		tx5.repeat.set(8, 4);    	
	
		x.sphere.material.metalness = 1; 
		x.sphere.material.metalnessMap = tx5; 
		x.sphere.material.needsUpdate = true; 
	});
	
}

function addSphere() {
	const loader = new THREE.TextureLoader(), 
		  url2 = 'img/brain/', 
		  fileName = 'braintex3', 
		  //fileName = 'brain-tissues-surface-creases-seamless-pattern_8071-38498', 
		  frmt = '.jpg'; 
	
	loader.load( url2 + fileName + frmt, function(tx) { 	
		//tx.wrapS = tx.wrapT = THREE.RepeatWrapping;    
		////tx.wrapS = tx.wrapT = THREE.MirroredRepeatWrapping;    
		//tx.repeat.set(2, 2);    	
	
		brainTex = tx;
		uniforms.uTexture.value = brainTex; 
		
		//const geometry = new THREE.IcosahedronGeometry(250, 30 );
		const geometry = new THREE.IcosahedronGeometry(5, 30 );
		
		const material = new THREE.ShaderMaterial({
			uniforms, 
			//uniforms: {
			//	u_time: {type: 'f', value: 0.0},
			//	u_frequency: {type: 'f', value: 0.0},
			//	uTexture: { value: tx } // Pass texture as a uniform
			//},	
			vertexShader: `
				#ifdef GL_ES
				precision mediump float;
				#endif
				//#extension GL_OES_standard_derivatives : enable
				
				uniform float u_time;
			
				vec3 mod289(vec3 x)
				{
				return x - floor(x * (1.0 / 289.0)) * 289.0;
				}
				
				vec4 mod289(vec4 x)
				{
				return x - floor(x * (1.0 / 289.0)) * 289.0;
				}
				
				vec4 permute(vec4 x)
				{
				return mod289(((x*34.0)+10.0)*x);
				}
				
				vec4 taylorInvSqrt(vec4 r)
				{
				return 1.79284291400159 - 0.85373472095314 * r;
				}
				
				vec3 fade(vec3 t) {
				return t*t*t*(t*(t*6.0-15.0)+10.0);
				}
			
				// Classic Perlin noise, periodic variant
				float pnoise(vec3 P, vec3 rep)
				{
				vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
				vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
				Pi0 = mod289(Pi0);
				Pi1 = mod289(Pi1);
				vec3 Pf0 = fract(P); // Fractional part for interpolation
				vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
				vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
				vec4 iy = vec4(Pi0.yy, Pi1.yy);
				vec4 iz0 = Pi0.zzzz;
				vec4 iz1 = Pi1.zzzz;
			
				vec4 ixy = permute(permute(ix) + iy);
				vec4 ixy0 = permute(ixy + iz0);
				vec4 ixy1 = permute(ixy + iz1);
			
				vec4 gx0 = ixy0 * (1.0 / 7.0);
				vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
				gx0 = fract(gx0);
				vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
				vec4 sz0 = step(gz0, vec4(0.0));
				gx0 -= sz0 * (step(0.0, gx0) - 0.5);
				gy0 -= sz0 * (step(0.0, gy0) - 0.5);
			
				vec4 gx1 = ixy1 * (1.0 / 7.0);
				vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
				gx1 = fract(gx1);
				vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
				vec4 sz1 = step(gz1, vec4(0.0));
				gx1 -= sz1 * (step(0.0, gx1) - 0.5);
				gy1 -= sz1 * (step(0.0, gy1) - 0.5);
			
				vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
				vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
				vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
				vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
				vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
				vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
				vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
				vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
			
				vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
				g000 *= norm0.x;
				g010 *= norm0.y;
				g100 *= norm0.z;
				g110 *= norm0.w;
				vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
				g001 *= norm1.x;
				g011 *= norm1.y;
				g101 *= norm1.z;
				g111 *= norm1.w;
			
				float n000 = dot(g000, Pf0);
				float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
				float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
				float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
				float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
				float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
				float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
				float n111 = dot(g111, Pf1);
			
				vec3 fade_xyz = fade(Pf0);
				vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
				vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
				float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
				return 2.2 * n_xyz;
				}
			
				varying vec3 vNormal;
				
				uniform float u_frequency;
			
				varying vec2 vUv;	  
				
				void main() {
					vUv = uv; // Pass the UV coordinates to the fragment shader
					
					//gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);		  
					
					float noise = 3.0 * pnoise(position + u_time, vec3(10.0));
					float displacement = (u_frequency / 30.) * (noise / 10.);
					vec3 newPosition = position + normal * displacement;
					
					vNormal = normalize(normalMatrix * normal);
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
				}
			`,
			fragmentShader: `
				#ifdef GL_ES
				precision mediump float;
				#endif
				//#extension GL_OES_standard_derivatives : enable
				
				//uniform float u_red;
				//uniform float u_blue;
				//uniform float u_green;
				
				uniform sampler2D uTexture; // Receive the texture sampler
				varying vec2 vUv;           // Receive the UV coordinates		
					
				#define PI2 6.28318530718
				#define MAX_ITER 5
				
				uniform float u_time;
				uniform vec2 resolution;
				
				varying vec3 vNormal;
				
				
				void mainImage( out vec4 fragColor, in vec2 fragCoord )
				{
					float time = u_time * .12;
					//vec2 uv = fragCoord.xy / resolution.xy;
					//vec2 uv = fragCoord.xy / (1920.,1080.);
					vec2 uv = vUv;
				
					vec2 p = mod(uv * PI2, PI2) - 254.0  ;
					vec2 i = vec2(p);
					float c = 1.2;
					float inten =  0.0064;
				
					for (int n = 0; n < MAX_ITER; n++) {
						float t = u_time * (1.0 - (7.2 / float(n + 1)));
						i = p + vec2(cos(t - i.x) + sin(t - i.y), sin(t - i.y) + cos(t + i.x));
						c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
					}
				
					c /= float(MAX_ITER);
					c = 1.23-pow(c, 1.22);
				//    vec3 colour = vec3(0.1+pow(abs(c),19.2), 0.1+pow(abs(c),50.2), 0.12+pow(abs(c), 5.0));
			//		vec3 colour = vec3(0.1+pow(abs(c),30.), 0.1+pow(abs(c),7.5), 0.12+pow(abs(c), 5.));
					vec3 colour = vec3(0.0+pow(abs(c), 30.), 0.0+pow(abs(c), 25.), 0.0+pow(abs(c), 20.));
			
				
				//    fragColor = vec4(colour, 1);
					
					
					//vec3 lightDir = normalize(vec3(-.9, 1.0, 1.1));
			//		vec3 lightDir = normalize(vec3(.7, -1.0, 5.0));
					//vec3 lightDir = normalize(vec3(.0, .0, -5.0));
					vec3 lightDir = normalize(vec3(.5, -.5, 1.0));
					//vec3 lightDir = normalize(vec3(.5, -.5, 2.));
					//float diff = max(dot(vNormal, lightDir), 0.2); // 0.2 is ambient light
					float diff = max(dot(vNormal, lightDir), 0.5); // 0.2 is ambient light
					//fragColor = vec4(vec3(colour * diff), 1.);	
				//    fragColor = vec4(vec3(colour - (diff * .8)), 1.);	
					fragColor = (gl_FragColor * .95) + vec4(vec3(colour - (diff * .9)), 1.);	
					//fragColor = (gl_FragColor * .96) + vec4(vec3(colour - (diff * .9)) + (vec3(u_red, u_green, u_blue) / 2.), 1.);	
					//fragColor = vec4(vec3(colour * diff), 1.0);	
					//gl_FragColor = vec4(vec3(0.5 * diff), 1.0);	
				}
					
				void main() {
					//vUv = uv; // Pass the UV coordinates to the fragment shader
				
					// Sample the color from the texture at the current UV coordinate
					vec4 textureColor = texture2D(uTexture, vUv);
					
					gl_FragColor = textureColor;		
				
					//gl_FragColor = vec4(vec3(u_red, u_green, u_blue), 1. );
					
					//vec4 textureColor = mainImage(gl_FragColor, gl_FragCoord.xy);	
				
					mainImage(gl_FragColor, gl_FragCoord.xy);					
				}			
			
			`
			//, wireframe: true
			//, side: 1
			//, lights: true

		});
		
		x.sphere = new THREE.Mesh(geometry, material);
		grups[0].add(x.sphere);

		//x.sphere.material.wireframe = true;
		//x.sphere.position.z = 14.8;
		//x.sphere.position.z = 5.;
		
		//console.log(x.sphere.geometry);
		
		fadeScene(); 
		
	}); 
	
}


function fadeScene() {
	
	onWindowResize(); 	
	
    (function fadeIn() {
		
		let val = parseFloat(ui.fader.style.opacity); 
		
		if (!((val -= .05) < 0)) {
 			ui.fader.style.opacity = val;
            
			requestAnimationFrame(fadeIn); 
			
        } else {
			
 			ui.fader.style.opacity = 0;
            ui.fader.style.display = "none";
			ui.fader.parentNode.removeChild(ui.fader);	
			
			onWindowResize(); 			
			
			eL(ui.kontainer, 0, 'pointerdown', onPointerDown); 
			eL(ui.kontainer, 0, "pointermove", onPointerMove); 
			
			//x.camV3 = new THREE.Vector3(); 			
			
			animate();  
			
			theOptions(); 
			
			cL(ui.loadr, 0, "paus");
			ui.loadr.style.display = "none";	
			ui.loadr.parentNode.removeChild(ui.loadr);			
 
			window.scrollY = window.pageYOffset = document.documentElement.scrollTop = document.body.scrollTop = 0; 
			//ui.content.scrollTop = 0; 
			//window.scrollTo(0, 0); 
			//ui.content.scrollTo(0, 0);  
			
        }
		
    })();	
	
}	

function theOptions() {
	
	//ui.swtchKam.style.visibility = "visible"; 	
	
	if (isMobil) {
		
		//eL(ui.swtchKam, 0, 'touchstart', swtchKamClick); 
		eL(ui.onAud, 0, 'touchstart', audClick); 
		eL(ui.offAud, 0, 'touchstart', audClick);
		
	} else {
		
		//eL(ui.swtchKam, 0, 'click', swtchKamClick); 
		eL(ui.onAud, 0, 'click', audClick); 
		eL(ui.offAud, 0, 'click', audClick);	
		
	}	 
	
}

//function swtchKamClick(event) {	
//
//    if (event) event.preventDefault(); 
//	
//	x.rotCam = !x.rotCam;  
//	
//	x.camGrup.rotation.set(0, 0, 0);  
//	camera.position.x = 0; 
//	
//	_.idleTimer = 0; 
//	
//}

function audClick(event) {
	
    if (event) event.preventDefault(); 

	if (x.sound) {
		
		if (x.sound.isPlaying) {
			
			cL(ui.offAud, 0, "noneIt2");
			cL(ui.onAud, 1, "noneIt2");

			x.sound.pause(); 

		} else {
			
			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");			

			x.sound.play(); 

		}
		
	} else {
		
		addAud(); 

	}

	_.idleTimer = 0; 
	
}

function onMouseMove( event ) {
	
   // if (event) event.preventDefault();

	let mouse = {}; 
	
	if (event.clientX) {
		
		mouse.x = ( event.clientX - _.widthH ) / 60;   
		mouse.y = ( event.clientY - _.heightH ) / 60; 	
		
	} else {
		
		mouse.x = ( event.x - _.widthH ) / 60; 
		mouse.y = ( event.y - _.heightH ) / 60; 
		
	}
	
	mouseX = mouse.x;
	mouseY = mouse.y; 	
	
	_.idleTimer = 0; 
	
}


function onPointerDown( event ) {
	
    if (event) event.preventDefault();

	let pointer = {}; 
	
	if (event.clientX) {
		
		pointer.x = ( event.clientX / _.width ) * 2 - 1;  
		pointer.y = - ( event.clientY / _.height ) * 2 + 1;	
		
	} else {
		
		pointer.x = ( event.x / _.width ) * 2 - 1;  
		pointer.y = - ( event.y / _.height ) * 2 + 1;		
		
	}	
	
	_.ptrDown = true; 

	_.pointer.x = pointer.x;
	_.pointer.y = pointer.y; 	
		
	_.idleTimer = 0; 
	
}	

function onPointerMove( event ) {
	
    if (event) event.preventDefault();

	let pointer = {}; 
	
	if (event.clientX) {
		
		pointer.x = ( event.clientX / _.width ) * 2 - 1;  
		pointer.y = - ( event.clientY / _.height ) * 2 + 1;	
		
	} else {
		
		pointer.x = ( event.x / _.width ) * 2 - 1;  
		pointer.y = - ( event.y / _.height ) * 2 + 1;		
		
	}
	
	_.pointer.x = pointer.x;
	_.pointer.y = pointer.y; 	
	
	_.idleTimer = 0; 
	
}

function wheelE( event ) {
	
    if (event) event.preventDefault();

	_.idleTimer = 0;
	
}	

function onWindowResize() {
	
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    
	if (isMobil) {
		
		if (_.width == _.prevW) {
			
			_.width = _.prevH; 
			_.height = _.prevW; 
			
		}
		
		_.prevW = _.width; 
		_.prevH = _.height; 	

	}
	
    _.widthH = _.width / 2;
    _.heightH = _.height / 2;        	
	
    document.body.style.width = ui.kontainer.style.width = _.width + 'px';
    //document.body.style.height = ui.kontainer.style.height = _.height + 'px';    
    ui.kontainer.style.height = _.height + 'px';    
	
	camera.aspect = _.width / _.height;
	camera.updateProjectionMatrix();

	renderer.setSize(_.width, _.height);	
	
	_.bloomComposer.setSize(_.width, _.height); 

	//_.camPosZ = 20; 
	
	if (_.width > _.height) {

		x.stars.rotation.z = 0; 
	
		_.camPosZ = 20;
		//_.camPosZ = (_.width / _.height) * 10;
		
	} else {

		x.stars.rotation.z = Math.PI/-2; 
	
		_.camPosZ = 30; 
		//_.camPosZ = (_.height / _.width) * 15;
		
	}		
	
	_.scrollPtr = Math.round(ui.content.offsetHeight / _.camPosZ); 
	
	//console.log(ui.content.offsetHeight); 
	
	_.checkPt[0] = Math.round(ui.content.offsetHeight * .25); 
	_.checkPt[1] = Math.round(ui.content.offsetHeight * .4); 
	_.checkPt[2] = Math.round(ui.content.offsetHeight * .55); 
	_.checkPt[3] = Math.round(ui.content.offsetHeight * .85); 
	_.checkPt[4] = Math.round(ui.content.offsetHeight * .5); 
	
	
	_.idleTimer = 0; 
	
}

function addAud() {
	
	if (!x.sound) {
		
		let url = 'mntn'; 			
		url += '.mp3'; 	

		const listener = new THREE.AudioListener();
		camera.add( listener );
		
		x.sound = new THREE.Audio( listener );
		
		const audioLoader = new THREE.AudioLoader();
		
		audioLoader.load( 'aud/' + url, function( buffer ) {
		
			x.sound.setBuffer( buffer );
			x.sound.setLoop( true );
			x.sound.setVolume( 1.0 );

			x.sound.play(); 
			
			x.analyser = new THREE.AudioAnalyser( x.sound, 32 );

			cL(ui.onAud, 0, "noneIt2");
			cL(ui.offAud, 1, "noneIt2");	
			
		}); 
	
	}
	
}

function animate() { 

	if (_.idleTimer < idleTO) {
		
		if (!clock.running) clock.start(); 
		const timer = Date.now() * 0.001; 
		
		// Best approach for modern development
		const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		
	//	console.log(scrollTop); // Outputs the exact pixels scrolled from the top
		
		// Targets both elements to ensure compatibility across all rendering modes
		//document.documentElement.scrollTop = 0;
		//document.body.scrollTop = 0;		

		_.zoomIn = (_.prevScrollTop > scrollTop) ? false : true; 
		

		x.sphere.rotation.y = timer * .1;
		x.sphere2.rotation.y = timer * .1;
		
	//	camera.position.x += (mouseX - camera.position.x) * .5;
	//	camera.position.y += (-mouseY - camera.position.y) * .5;
		
		//x.stars.rotation.y = (-mouseX - camera.position.x) * .01; 
	
		//starsMaterial.uniforms.time.value = 0;
		
	//	uniforms.u_time.value = clock.getElapsedTime() * .2;
		//uniforms.u_time.value = timer * .5;
		
	//	if ((x.analyser) && (x.sound.isPlaying)) {
	//		uniforms.u_frequency.value = x.analyser.getAverageFrequency();
	//	//	uniforms.u_frequency.value = x.analyser.getAverageFrequency() * .5;
	//	} else {
	//		uniforms.u_frequency.value = Math.sin(clock.getElapsedTime())*35.;
	//		//uniforms.u_frequency.value = 30.;			
	//	}

		
		camera.position.z = _.camPosZ - scrollTop / _.scrollPtr; 
		
	//	if (scrollTop < _.checkPt[4]) {
			grups[0].rotation.x = (scrollTop / ui.content.offsetHeight) * 2.2; 
			grups[1].rotation.x = (scrollTop / ui.content.offsetHeight) * .8; 
	//	} 
	//	else {
	//		grups[0].rotation.x = 2.5 - (scrollTop / ui.content.offsetHeight) * 2.5; 
	//	}
		
	//	if (scrollTop < _.checkPt[4]) {
	//		camera.rotation.x = (scrollTop / ui.content.offsetHeight) * .8; 
	//	} else {
	//		camera.rotation.x = .8 - (scrollTop / ui.content.offsetHeight) * .8; 
	//	}
		
		if (scrollTop > _.checkPt[2]) {
			x.sphere.position.x = Math.sin(timer*100) * .1;
			x.sphere.position.z = Math.cos(timer*100) * .05;
		}
		
		//console.log(scrollTop / ui.content.offsetHeight); 
		
	//	if (_.zoomIn) {
	//		//if (camera.rotation.x < (Math.PI/8)) camera.rotation.x += .01; 
	//		camera.rotation.x = (camera.rotation.x < (Math.PI/4)) ? (camera.rotation.x += .008) : (Math.PI/4); 
	//		grups[0].rotation.x = (grups[0].rotation.x < (Math.PI/3)) ? (grups[0].rotation.x += .008) : (Math.PI/3); 
	//	} else {
	//		//if (camera.rotation.x > 0) camera.rotation.x -= .01; 
	//		camera.rotation.x = (camera.rotation.x > 0) ? (camera.rotation.x -= .008) : (0); 
	//		grups[0].rotation.x = (grups[0].rotation.x > 0) ? (grups[0].rotation.x -= .008) : (0); 
	//	}		

	//	if (_.prevScrollTop != scrollTop) {
	//			
	//		
	//		
	//		//console.log(_.checkPt[0]); 
	//		
	//
	//		
	//		switch (true) {
	//			case (scrollTop < _.checkPt[0]):
	//				camera.rotation.x = (camera.rotation.x > 0) ? (camera.rotation.x -= .008) : (0); 
	//				grups[0].rotation.x = (grups[0].rotation.x > 0) ? (grups[0].rotation.x -= .008) : (0); 
	//			
	//				break; 
	//				
	//			case ((scrollTop >= _.checkPt[0]) && (scrollTop < _.checkPt[1])):
	//				//camera.rotation.x = (_.zoomIn) ? (camera.rotation.x + .05) : (camera.rotation.x - .05); 
	//				//camera.rotation.x = scrollTop / 5000; 
	//				
	//				if (_.zoomIn) {
	//					//if (camera.rotation.x < (Math.PI/8)) camera.rotation.x += .01; 
	//					camera.rotation.x = (camera.rotation.x < (Math.PI/8)) ? (camera.rotation.x += .008) : (Math.PI/8); 
	//					grups[0].rotation.x = (grups[0].rotation.x < (Math.PI/3)) ? (grups[0].rotation.x += .008) : (Math.PI/3); 
	//				} else {
	//					//if (camera.rotation.x > 0) camera.rotation.x -= .01; 
	//					camera.rotation.x = (camera.rotation.x > 0) ? (camera.rotation.x -= .008) : (0); 
	//					grups[0].rotation.x = (grups[0].rotation.x > 0) ? (grups[0].rotation.x -= .008) : (0); 
	//				}
	//				
	//				console.log(camera.rotation.x); 
	//			
	//				break;
	//				
	//			case ((scrollTop >= _.checkPt[1]) && (scrollTop < _.checkPt[2])): 
	//				camera.rotation.x = (camera.rotation.x < (Math.PI/8)) ? (camera.rotation.x += .008) : (Math.PI/8);
	//				grups[0].rotation.x = (grups[0].rotation.x < (Math.PI/3)) ? (grups[0].rotation.x += .008) : (Math.PI/3);
	//
	//				break;
	//				
	//			default:
	//				
	//		}		
	//	}		
	
	
	
		//let y0 = x.sphere2.material.emissiveMap.offset.y + .001;   
		//
		//if (y0 >= 1) y0 = 0; 
		////if (y1 >= 1) y1 = 0; 
		
		x.sphere2.material.emissiveMap.offset.x = Math.sin(timer*.5); 		
		x.sphere2.material.emissiveMap.offset.y = Math.cos(timer*.2); 		
		//x.sphere2.material.emissiveMap.offset.y = y0; 		
		//x.sphere2.material.alphaMap.offset.y = y1; 	
		
		
		
		_.prevScrollTop = scrollTop;
		
		
		
		_.idleTimer += 0.01; 
		
		render();
		
	} else {
		
		if (clock.running) clock.stop(); 
		
		if (x.sound) {
			
			if (x.sound.isPlaying) x.sound.pause(); 
			
		}
		
	}
	
	if (document.hasFocus()) {
		
		if (!_.fokus) {
			
			_.idleTimer = 0; 
			_.fokus = true; 
			
			if (x.sound) {
				
				if (!x.sound.isPlaying) x.sound.play(); 
				
			}
			
		}
		
	} else {
		
		_.idleTimer = idleTO; 	
		_.fokus = false; 
		
		if (x.sound) {
			
			if (x.sound.isPlaying) x.sound.pause(); 
			
		}
		
	}	
	
	//lenis.raf(time); 
	//lenis.animate(); 	
	
    requestAnimationFrame(animate); 	
	
}

function render() {
	//camera.lookAt(scene.position); 
	
	//renderer.render( scene, camera );	
	
	_.bloomComposer.render();
	
	stats.update(); 
}


	
	