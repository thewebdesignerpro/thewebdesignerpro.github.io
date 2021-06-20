/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
   
var clock = new THREE.Clock();
const floorPosY = -8, rnd1 = Math.random(Math.PI); 
var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, pis=0, pif=pif2=1, ntro = true, 
	renderer, camera, scene, controls, stats;
var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), navOn = false,	popped = '0';
var grupo = new THREE.Group();	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;

if (!Detector.webgl) {
    var warning = Detector.getWebGLErrorMessage();
    //document.getElementById('container').appendChild(warning);	
    cntnr.appendChild(warning);	
	cntnr.style.backgroundColor = 'transparent';
	document.body.style.backgroundImage = "url('imj/shade/hom1/hombg.jpg')";
	document.body.style.backgroundSize = 'cover';
	document.body.style.backgroundPosition = 'center';
} else {
	if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}		
	cntnr.style.opacity = 0;
}

function init() {
	camera = new THREE.PerspectiveCamera(50, ww/wh, 1, 5000);
	camera.position.set(0, 5, 30);
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0x000000, 0.03);
	camera.lookAt(scene.position);	
	var ambientLight = new THREE.AmbientLight(0x111111); 
	grupo.add(ambientLight);
	var spotLight = new THREE.SpotLight(0xffffff, 1, 200, Math.PI/6, .75);
	spotLight.position.set(0, 35, 40);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 200;
	spotLight.shadow.camera.fov = 50;
	//spotLight.power = Math.PI*1;
	grupo.add(spotLight);	
	//var helper = new THREE.CameraHelper( spotLight.shadow.camera );
	//grupo.add( helper );
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x282829, 1);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;			
	renderer.sortObjects = false;
	var cntnr = document.getElementById('container');
	cntnr.appendChild(renderer.domElement);	
/*	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
	controls.minDistance = 2;
	controls.maxDistance = 100;	*/
	backDrop(function(tex) {
		mesa(tex);
		upu(tex);
		imac(tex);
		ifon(tex);
		mug(tex);
		lamp(tex);
	});
	pader();
	sahig();	
	animate();
}		

function backDrop(callback) {
	var sky = new THREE.CubeTextureLoader()
	.setPath( 'imj/map/cube/dalas/' )
	.load([
		'posx.jpg',
		'negx.jpg',
		'posy.jpg',
		'negy.jpg',
		'posz.jpg',
		'negz.jpg'
	]);	
	sky.format = THREE.RGBFormat;
	sky.mapping = THREE.CubeReflectionMapping;	
	if (callback) return callback(sky);	
}

function pader() {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/hom1/noise1.jpg', function (tex) {
		var geometry = new THREE.PlaneBufferGeometry(80, 40, 24, 12);
		var material = new THREE.MeshStandardMaterial({color: 0x737679, metalness: .2, roughness: .45});
		material.shading = THREE.FlatShading;
		material.displacementMap = tex;
		material.displacementScale = 2.6;		
		var pader = new THREE.Mesh(geometry, material);
		pader.position.set(0, floorPosY+20, -12.5);
		pader.receiveShadow = true;		
		grupo.add(pader);
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);		
}

function sahig() {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/hom1/woodflr2.jpg', function (tex) {
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(5, 10);		
		var geometry = new THREE.PlaneBufferGeometry(40, 80);
		var material = new THREE.MeshStandardMaterial({map: tex, bumpMap: tex, bumpScale: .1, metalness: 0, roughness: .7});
		var sahig = new THREE.Mesh(geometry, material);
		sahig.position.set(0, floorPosY, 9);
		sahig.rotation.set(Math.PI/-2, 0, Math.PI/-2);
		sahig.receiveShadow = true;		
		grupo.add(sahig);
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);	
}

function mesa(tex) {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/hom1/noise2.jpg', function (tex) {
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(15, 15);		
		var mater = new THREE.MeshStandardMaterial({color: 0xfffaf4, map: tex, bumpMap: tex, bumpScale: .015, metalness: 0, roughness: .1});
		loadM("obj/home1/tabletop.obj", 0, floorPosY+1.4, -2, 0, Math.PI, 0, 3, 3, 6, function(obj) {
			obj.material = mater;
			obj.castShadow = true;
			obj.receiveShadow = true;
			grupo.add(obj);
		});			
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);			
	loadM("obj/home1/tablebars.obj", 0, floorPosY, -2, 0, Math.PI, 0, 3, 3.5, 6, function(obj) {
		var mater = new THREE.MeshPhongMaterial({shininess: 5, color: 0xeeeeee, envMap: tex});
		mater.reflectivity = .8;		
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;		
		grupo.add(obj);
	});
}

function upu(tex) {
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/hom1/noise2.jpg', function (tex) {
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(5, 5);		
		var mater = new THREE.MeshPhongMaterial({color: 0x111111, map: tex, bumpMap: tex, bumpScale: .03, specularMap: tex});
		loadM("obj/home1/chairacb.obj", 2.6, floorPosY, 8, 0, -2.4, 0, 12, 12, 12, function(obj) {
			obj.material = mater;
			obj.castShadow = true;
			obj.receiveShadow = true;
			grupo.add(obj);
		});		
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);			
	loadM("obj/home1/chairacs.obj", 2.6, floorPosY, 8, 0, -2.4, 0, 12, 12, 12, function(obj) {
		var mater = new THREE.MeshPhongMaterial({color: 0xeeeeee, shininess: 10, envMap: tex});
		mater.combine = THREE.MixOperation;
		mater.reflectivity = .85;		
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;		
		grupo.add(obj);
	});
	scene.add(grupo);
}

function imac(tex) {
	loadM("obj/home1/imaksh2.obj", .08, floorPosY+14.17, -3, 0, 0, 0, 14, 14, 14, function(obj) {
		var mater = new THREE.MeshPhongMaterial({shininess: 20, color: 0xcccccc});
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		grupo.add(obj);
	});		
	loadM("obj/home1/imaksb3.obj", .08, floorPosY+14.17, -3, 0, 0, 0, 14, 14, 14, function(obj) {
		var mater = new THREE.MeshPhongMaterial({shininess: 20, color: 0x050505, envMap: tex});
		mater.reflectivity = .5;
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		grupo.add(obj);
	});		
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/hom1/imakscr.jpg', function (tx) {
		var geom = new THREE.PlaneBufferGeometry(8.6, 4.88);
		var mater2 = new THREE.MeshPhongMaterial({shininess: 5, map: tx, transparent: true, opacity: .68});
		var imakScr = new THREE.Mesh(geom, mater2);
		imakScr.rotation.x = -.1727;
		imakScr.position.set(0, 6.876, -3.164);
		grupo.add(imakScr);		
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);				
	loadM("obj/home1/keyb.obj", -.1, floorPosY+10.06, .7, 0, 0, 0, 1.5, 1.5, 1.5, function(obj) {
		var mater = new THREE.MeshPhongMaterial({shininess: 30, color: 0xcccccc});
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		grupo.add(obj);
	});		
	loadM("obj/home1/mmouse.obj", 3.6, floorPosY+10.29, .7, 0, 0, 0, 1.5, 1.5, 1.5, function(obj) {
		var mater = new THREE.MeshPhongMaterial({shininess: 10, color: 0xefefef, envMap: tex});
		mater.combine = THREE.AddOperation;
		mater.reflectivity = .45;
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.rotation.y = .15;
		grupo.add(obj);
	});	
}

function ifon(tex) {
	loadM("obj/home1/ifon.obj", -5.2, floorPosY+10.16, .5, 0, 0, 0, 1.6, 1.6, 1.6, function(obj) {
		var mater = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: .1, roughness: .1});
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.rotation.y = 2.2;
		grupo.add(obj);
	});	
	var loader = new THREE.TextureLoader();
	loader.load('imj/shade/hom1/ifonscr.jpg', function (tx) {
		var geom = new THREE.PlaneBufferGeometry(.86, 1.4);
		var mater2 = new THREE.MeshPhongMaterial({map: tx, envMap: tex, transparent: true, opacity: .8});
		mater2.combine = THREE.MixOperation;
		mater2.reflectivity = .5;
		var ifscr = new THREE.Mesh(geom, mater2);
		ifscr.rotation.set(Math.PI/-2, 0, -2.512);
		ifscr.position.set(-5.195, 2.26, .504);
		ifscr.receiveShadow = true;
		grupo.add(ifscr);
	},  function (xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
		function (xhr) { console.log('Error loading texture'); }
	);		

}	
	
function mug(tex) {
	loadM("obj/home1/mug1.obj", 7.3, floorPosY+10.15, -.7, 0, 0, 0, .85, .85, .85, function(obj) {
		var mater = new THREE.MeshStandardMaterial({color: 0x060606, metalness: 0, roughness: .3, envMap: tex});
		mater.reflectivity = .1;
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		grupo.add(obj);
	});	
	var geom = new THREE.CircleBufferGeometry(.48, 24);
	var mater2 = new THREE.MeshPhongMaterial({color: 0x502600, envMap: tex});
	//mater2.combine = THREE.MixOperation;
	mater2.reflectivity = .75;
	var kape = new THREE.Mesh(geom, mater2);
	kape.rotation.x = Math.PI/-2;
	kape.position.set(7.47, 2.9, -.71);
	kape.receiveShadow = true;
	grupo.add(kape);
}	

function lamp(tex) {
	loadM("obj/home1/lamp.obj", -7.8, floorPosY+10.15, -1, 0, 0, 0, .8, .9, .8, function(obj) {
		var mater = new THREE.MeshStandardMaterial({color: 0x777777, metalness: .7, roughness: .4, envMap: tex});
		mater.reflectivity = .25;
		obj.material = mater;
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.rotation.y = -.6;
		grupo.add(obj);
	});	
	
}	

function loadM(url, x, y, z, rotX, rotY, rotZ, sclX, sclY, sclZ, callback) {
	var loader = new THREE.OBJLoader();
	loader.load(url, function (obj) {
		//obj.children[0].geometry.computeVertexNormals();
		//obj.children[0].geometry.computeFaceNormals();
		//obj.children[0].geometry.computeBoundingBox();
		obj.children[0].position.set(x,y,z);		
		obj.children[0].rotation.set(rotX,rotY,rotZ);
		obj.children[0].scale.set(sclX, sclY, sclZ);
		if (callback) return callback(obj.children[0]);
	});
}

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(e) {
	mouseX = e.clientX - wwh;
	mouseY = e.clientY - whh;
}

function animate() {
	var delta = clock.getDelta();
	var timer = Date.now()*.003;
	if (ntro) {
		if (pis<1) {
			//pif -= 0.0001;
			//pif2 -= 0.00015;
			pis += .005;
			/*document.getElementById('pinfo').style.opacity = pif;
			document.getElementById('pinfo2').style.opacity = pif2;*/
			//if (pif<=0.5) {
				//pis += 0.00025;
			//}	
			cntnr.style.opacity = pis;
		} else {
			/*document.getElementById('pinfo').style.opacity = 0;
			document.getElementById('pinfo2').style.opacity = 0;
			document.getElementById('aud').volume = .6;
			document.getElementById('aud').play();*/
			cntnr.style.opacity = 1;
			ntro = false;
		}
	}	

	if (camera) {
		//camera.position.x += (mouseX - camera.position.x) * .001;
		//camera.position.y += (-mouseY - camera.position.y) * .001;		
		if ((grupo.rotation.x<Math.PI/2) && (grupo.rotation.x>-.5)) {
			grupo.rotation.x += -mouseY * .00005;
			if (grupo.rotation.x>=Math.PI/2) grupo.rotation.x = Math.PI/2-.01;
			if (grupo.rotation.x<=-.5) grupo.rotation.x = -.49;
		}		
		if ((grupo.rotation.y<Math.PI/1.2) && (grupo.rotation.y>-Math.PI/1.2)) {
			grupo.rotation.y += -mouseX * .00005;
			if (grupo.rotation.y>=Math.PI/1.2) grupo.rotation.y = Math.PI/1.2-.01;
			if (grupo.rotation.y<=-Math.PI/1.2) grupo.rotation.y = -Math.PI/1.2+.01;
		}
	}
	
	render();
	requestAnimationFrame(animate);	
}

function render() {
	camera.lookAt(scene.position);
	//controls.update();	
	renderer.render(scene, camera);	
}

/*if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}	*/

