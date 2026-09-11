import * as THREE from 'three';
//import {GUI} from 'dat.gui';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0x222222);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
);

const params = {
	red: 1.0,
	green: 1.0,
	blue: 1.0,
	threshold: 0.5,
	strength: 0.5,
	radius: 0.8
}

let container, stats;

stats = new Stats();
//container.appendChild( stats.dom );
document.body.appendChild( stats.dom );

/*const gui = new GUI();

gui.add( params, 'minScale', 1, 30 );
gui.add( params, 'maxScale', 1, 30 );
gui.add( params, 'rotate' );
gui.add( params, 'clear' );
gui.open(); */

//renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

// 1. Load the texture
const textureLoader = new THREE.TextureLoader();
const textureLoader2 = new THREE.TextureLoader();
//const myTexture = textureLoader.load('img/earth/moon/color4k.jpg');
//const myTexture = textureLoader.load('img/chip001c.jpg');

let myTexture, myTexture2; 

const uniforms = {
	u_time: {type: 'f', value: 0.0},
	u_frequency: {type: 'f', value: 0.0},
	u_red: {type: 'f', value: 1.0},
	u_green: {type: 'f', value: 1.0},
	u_blue: {type: 'f', value: 1.0}
	, uTexture: { value: myTexture } // Pass texture as a uniform
}

textureLoader.load( 'img/brain/braintex2.jpg', function(tx0) { 
	//tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
	////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
	//tx0.repeat.set(20, 20);    		
	
	myTexture = tx0;
	
	uniforms.uTexture.value = myTexture; 
	

}); 	

textureLoader.load( 'img/8k_stars_milky_way.jpg', function(tx1) { 
	//tx0.wrapS = tx0.wrapT = THREE.RepeatWrapping;    
	////tx0.wrapS = tx0.wrapT = THREE.MirroredRepeatWrapping;    
	//tx0.repeat.set(20, 20);    		
	
	myTexture2 = tx1;
	
	//uniforms.uTexture.value = myTexture; 
	
	//mesh.material.needsUpdate = true; 
	
	if (milkyMater) {
		milkyMater.map = myTexture2;
		milkyMater.needsUpdate = true; 
	}
}); 	


// 2. Create the ShaderMaterial with uniforms
//const customMaterial = new THREE.ShaderMaterial({
//  uniforms: {
//    uTexture: { value: myTexture } // Pass texture as a uniform
//  },
//  vertexShader: `
//    varying vec2 vUv;
//
//    void main() {
//      vUv = uv; // Pass the UV coordinates to the fragment shader
//      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//    }
//  `,
//  fragmentShader: `
//    uniform sampler2D uTexture; // Receive the texture sampler
//    varying vec2 vUv;           // Receive the UV coordinates
//
//    void main() {
//      // Sample the color from the texture at the current UV coordinate
//      vec4 textureColor = texture2D(uTexture, vUv);
//      
//      gl_FragColor = textureColor;
//    }
//  `
//});

//const mat = new THREE.ShaderMaterial({
const customMaterial = new THREE.ShaderMaterial({
	uniforms,
	//niforms: {
    // uTexture: { value: myTexture } // Pass texture as a uniform
    //,	
	vertexShader: document.getElementById('vertexshader').textContent,
	fragmentShader: document.getElementById('fragmentshader').textContent
});


//const loader = new FBXLoader();
//const mesh = await loader.loadAsync( 'obj/brain/blobtest.fbx' );
//
////mesh.scale.set(.08,.08,.08);
//mesh.scale.set(.035,.035,.035);
//mesh.children[0].material = customMaterial; 
////mesh.children[0].material.wireframe = true;
////mesh.position.y = -4;
//mesh.position.y = 0;
//scene.add( mesh );
//
//console.log(mesh.children[0]);

const geo = new THREE.IcosahedronGeometry(3.5, 30 );
//const mesh = new THREE.Mesh(geo, mat);
const mesh = new THREE.Mesh(geo, customMaterial);
scene.add(mesh);
//mesh.material.wireframe = true;

//console.log(mesh.geometry);



const uniforms2 = {
	time: {type: 'f', value: 0.0}
	//u_time: {type: 'f', value: 0.0},
	//, uTexture: { value: myTexture } // Pass texture as a uniform
}

const starsMaterial = new THREE.ShaderMaterial({
  //uniforms2, 
  uniforms: {
	time: {type: 'f', value: 0.0}
	//u_time: {type: 'f', value: 0.0},
	//, uTexture: { value: myTexture } // Pass texture as a uniform
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv; // Pass the UV coordinates to the fragment shader
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 vUv;

// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
highp float Rand(vec2 co)
{
    highp float a = 1552.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
float iAspectRatio = 2.0;
float Noise(vec2 UV, float Seed, vec2 Frequency){
	vec2 PerlinR = vec2(UV.x, UV.y) * vec2(Frequency);
	highp vec2 Perlin1Pos = vec2(floor(PerlinR.x), floor(PerlinR.y));
	
	float RandX0 = (Perlin1Pos.x+(Perlin1Pos.y)*Seed);
	float RandX1 = ((Perlin1Pos.x+1.0)+(Perlin1Pos.y)*Seed);
	float RandX2 = (Perlin1Pos.x+(Perlin1Pos.y+1.0)*Seed);
	float RandX3 = ((Perlin1Pos.x+1.0)+(Perlin1Pos.y+1.0)*Seed);
	
	float Perlin0Val = Rand(vec2(RandX0,RandX0*0.1224));
	float Perlin1Val = Rand(vec2(RandX1,RandX1*0.1224));
	float Perlin2Val = Rand(vec2(RandX2,RandX2*0.1224));
	float Perlin3Val = Rand(vec2(RandX3,RandX3*0.1224));
	
	vec2 Perc = (sin(((PerlinR - Perlin1Pos) * vec2(3.1415926)) - vec2(1.570796)) * vec2(0.5)) + vec2(0.5);
	
	float Val0to2 = (Perlin0Val*(1.0-Perc.y)) + (Perlin2Val*Perc.y); 
	float Val1to3 = (Perlin1Val*(1.0-Perc.y)) + (Perlin3Val*Perc.y); 
	
	return (Val0to2 * (1.0-Perc.x)) + (Val1to3 * Perc.x);	
}
float PerlinNoise1(vec2 UV, float Seed){
	float RetVal = 0.0;
	RetVal += Noise(UV, Seed * 1.2, vec2(2.0)) * 0.5;
	RetVal += Noise(UV, Seed * 1.4, vec2(5.0)) * 0.25;
	RetVal += Noise(UV, Seed * 1.1, vec2(10.0)) * 0.125;
	RetVal += Noise(UV, Seed * 1.5, vec2(24.0)) * 0.0625;
	RetVal += Noise(UV, Seed * 1.2, vec2(54.0)) * 0.03125;
	RetVal += Noise(UV, Seed * 1.3, vec2(128.0)) * 0.025625;
	return RetVal;
}
float PerlinNoise2(vec2 UV, float Seed){
	float RetVal = 0.0;
	RetVal += Noise(UV, Seed * 1.2, vec2(6.0)) * 0.5;
	RetVal += Noise(UV, Seed * 1.4, vec2(12.0)) * 0.25;
	RetVal += Noise(UV, Seed * 1.1, vec2(24.0)) * 0.125;
	RetVal += Noise(UV, Seed * 1.5, vec2(40.0)) * 0.0625;
	RetVal += Noise(UV, Seed * 1.2, vec2(80.0)) * 0.03125;
	RetVal += Noise(UV, Seed * 1.3, vec2(158.0)) * 0.025625;
	return RetVal;
}
void main(){
	vec2 UV = vUv;
	//UV *= vec2(2.1);	
	
//	vec2 TimeOffset = vec2(time * .0062379, cos(time * 0.0962379)) * vec2(sin(time * 0.0041839) + 1.1);
//	vec2 TempVec2A = TimeOffset;
	vec2 TempVec2A = vec2(0,0);
	vec2 TempVec2B = vec2(0.0);
	vec2 TempVec2C = vec2(0.0);
	vec3 TempVec3A = vec3(0.0);
//	TempVec2C.x = pow(.8 - PerlinNoise1(UV + TempVec2A, 1.32143), 2.0);
	TempVec2C.x = pow(.8 - PerlinNoise1(UV + TempVec2A, 1.32143), 2.0);
	TempVec3A = vec3(TempVec2C.x) * vec3(0.25, 0.4, 0.5);
//	TempVec2C.x = pow(((.9 - PerlinNoise2(UV + (TempVec2A * vec2(1.15)), 12.523)) * TempVec2C.x), 1.1);
	TempVec2C.x = pow(((.9 - PerlinNoise2(UV + (TempVec2A * vec2(1.15)), 12.523)) * TempVec2C.x), 1.1);
	TempVec3A += vec3(TempVec2C.x) * vec3(.0, .1, .8);
	
	vec4 RetVal = vec4(.0,.0,.0,1);	
	TempVec2C.x = Rand(vec2(UV.x, UV.y));
	TempVec2C.y = Rand(vec2(UV.y, UV.x));
	//highp float PowIn = ((sin(((time+10.0)*TempVec2C.x*2.7))*.8)+0.5); 
	highp float PowIn = ((sin(((time+10.0)*TempVec2C.x*2.7))*.4)+0.5); 
	RetVal.xyz = max(vec3(TempVec2C.x * pow(TempVec2C.y, 20.0) * pow(PowIn, 1.0) * .4), vec3(0.0)); 
	RetVal.xyz += TempVec3A;

	gl_FragColor = RetVal;

}
  `
});


const geometry = new THREE.PlaneGeometry( 500, 250 );
const milkyMater = new THREE.MeshBasicMaterial( { color: 0xffffff } );
//const plane = new THREE.Mesh( geometry, starsMaterial );

if (myTexture) {
	milkyMater.map = myTexture2;
	milkyMater.needsUpdate = true; 
}

const plane = new THREE.Mesh( geometry, milkyMater );
plane.position.z = -70;
//plane.position.z = -1;
scene.add( plane );
//camera.add( plane );




const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
//audioLoader.load('./assets/Beats.mp3', function(buffer) {
//audioLoader.load('./aud/80x-deep-synthwave-203118.mp3', function(buffer) {
audioLoader.load('./aud/ouverture-du-bal-a-la-cour-du-roi-269370.mp3', function(buffer) {
	sound.setBuffer(buffer);
	window.addEventListener('click', function() {
		sound.play();
		sound.setVolume( .5 );
	});
});

const analyser = new THREE.AudioAnalyser(sound, 32);

const gui = new GUI();

const colorsFolder = gui.addFolder('Colors');
colorsFolder.add(params, 'red', 0, 1).onChange(function(value) {
	uniforms.u_red.value = Number(value);
});
colorsFolder.add(params, 'green', 0, 1).onChange(function(value) {
	uniforms.u_green.value = Number(value);
});
colorsFolder.add(params, 'blue', 0, 1).onChange(function(value) {
	uniforms.u_blue.value = Number(value);
});

const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function(value) {
	bloomPass.threshold = Number(value);
});
bloomFolder.add(params, 'strength', 0, 3).onChange(function(value) {
	bloomPass.strength = Number(value);
});
bloomFolder.add(params, 'radius', 0, 1).onChange(function(value) {
	bloomPass.radius = Number(value);
});

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function(e) {
	let windowHalfX = window.innerWidth / 2;
	let windowHalfY = window.innerHeight / 2;
	//mouseX = (e.clientX - windowHalfX) / 100;
	mouseX = (e.clientX - windowHalfX) / 80;
	//mouseY = (e.clientY - windowHalfY) / 100;
	mouseY = (e.clientY - windowHalfY) / 60;
});

const clock = new THREE.Clock();
function animate() {
	mesh.rotation.y = clock.getElapsedTime() * .5;
	
	camera.position.x += (mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * 0.5;
//	camera.lookAt(scene.position);
	starsMaterial.uniforms.time.value = 0;
	uniforms.u_time.value = clock.getElapsedTime() * .2;
//	uniforms.u_frequency.value = analyser.getAverageFrequency();
	uniforms.u_frequency.value = analyser.getAverageFrequency() * .5;
	//uniforms.u_frequency.value = Math.sin(clock.getElapsedTime())*100.;
    bloomComposer.render();
	
	stats.update();
	
	//console.log(uniforms.u_frequency.value);
	//console.log(renderer.info.render.calls); // Returns the draw call count for the frame
	
	requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
	bloomComposer.setSize(window.innerWidth, window.innerHeight);
});