/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
//(function(){

const floorposY = -4.9, rnd1 = Math.random(Math.PI); 

var mouseX = mouseY = mouseZ = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2, entro = true,
	renderer, camera, scene, spotL, controls, stats, lookAtScene = false, geometry, material, vertices, starS, starGeom, starMater, 
	spotLight, materO1, materO2;

var	cntnr = document.getElementById('container'), nv = document.getElementById('nav'), nvo = document.getElementById('nvo'),
	srbs = document.getElementById('serbis'), flio = document.getElementById('folio'), kont = document.getElementById('kontak'), 
	srvc = document.getElementById('services'),	prtf = document.getElementById('portfolio'), cntc = document.getElementById('contact'),
	cntnt = document.getElementById('content'), cntnt2 = document.getElementById('content2'), cntnt3 = document.getElementById('content3'),
	x1 = document.getElementById('x1'), x2 = document.getElementById('x2'), x3 = document.getElementById('x3'), 
	closeit = document.getElementById("closeit"), picker = document.getElementById("picker"), slider = document.getElementById("slider"), 
	navOn = colpi = false,	popped = '0', pinfo = document.getElementById('pinfo2'), po1 = 1.0, po2 = 0;	
	
var loader = new THREE.TextureLoader();		
var loadO = new THREE.OBJLoader();
var clock = new THREE.Clock();
	
document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
container.style.width = ww+'px';	
container.style.height = wh+'px';
cntnt.style.fontSize = ((ww+wh)/2)*0.02;
cntnr.style.opacity = 0;

if (!Detector.webgl) Detector.addGetWebGLMessage();

function init() {
	camera = new THREE.PerspectiveCamera(50, ww/wh,  1, 5000);
	camera.position.set(14, 1.5, 16);
	scene = new THREE.Scene();
	camera.lookAt(scene.position);	
	spotLight = new THREE.SpotLight(0xffffff, 4, 70, Math.PI/5, .8);
	spotLight.position.set(0, 50, 0);	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 200;
	spotLight.shadow.camera.fov = 40;
	scene.add(spotLight);	
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	renderer.sortObjects = false;
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = .25;
    controls.autoRotateSpeed = .2;
    //controls.autoRotate = true;	
	controls.minDistance = 5;
	controls.maxDistance = 100;	
	//controls.minPolarAngle = Math.PI/3;	
	//controls.maxPolarAngle = Math.PI/1.9;	
	langit(function(tx) {
		loadKar(tx);
	});
	loadSopa();
	sahig();
	animate();
}	

function langit(callback) {
	var path = "imj/map/cube/slc2/";
	var format = '.jpg';
	var urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
	];
	var rCube = new THREE.CubeTextureLoader().load(urls);
	
	rCube.format = THREE.RGBFormat;
	rCube.mapping = THREE.CubeReflectionMapping;

	if (callback) return callback(rCube);
}

function loadKar(tex) {
materO1 = new THREE.MeshStandardMaterial({color: 0x000000, roughness: .45, metalness: .65, envMap: tex});	
materO2 = new THREE.MeshStandardMaterial({color: 0x000000, roughness: .45, metalness: .65, envMap: tex, side: THREE.DoubleSide});	
loadO.load(
	'obj/kar/dodgebros.obj',
	function (object, materials) {
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.rotation.x = Math.PI/-2;
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		var spindl = object.children[0];
		spindl.position.set(.55, -.55, 0);
		var hub = object.children[1];
		hub.position.set(.45, -.58, 0);
		var bnd = object.children[2];
		bnd.position.set(.395, -.57, 0);		
		var hudlte = object.children[8];
		hudlte.position.set(-1.665, -2.65, 0);
		var hedlte = object.children[9];
		hedlte.position.set(-6.31, -1.9, 0);
		var foglte  = object.children[10];
		foglte.position.set(-7.43, -.525, 0);
		var moblte = object.children[11];
		moblte.position.set(-1.56, -3, 2.06);
		var crme = object.children[13];
		crme.position.set(-3.83, -2.72, 0);
		var hndl  = object.children[27];
		hndl.position.set(1.152, -1.902, 0);
		var bmpr  = object.children[28];
		bmpr.position.set(-.355, .02, 0);
		var mater2 = new THREE.MeshStandardMaterial({color: 0x777777, roughness: .1, metalness: .5, envMap: tex});	
		spindl.material = hub.material = bnd.material = hudlte.material = hedlte.material = foglte.material = moblte.material = crme.material = hndl.material = bmpr.material = mater2;
		var whitw = object.children[6];
		whitw.position.set(.02, -.6, 0);
		var materW = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x090807, roughness: .6, metalness: .2});	
		whitw.material = materW;
		var drum = object.children[3];
		drum.position.set(.077, -.592, 0);
		var rim = object.children[4];
		rim.position.set(.12, -.58, 0);
		var spoks = object.children[7];
		spoks.position.set(.0455, -.578, 0);
		var trm  = object.children[14];
		trm.position.set(2.4, -3.08, 0);
		var ruf  = object.children[15];
		ruf.position.set(2.4025, -3.163, 0);
		var ffndr  = object.children[18];
		ffndr.position.set(-4.452, -.5872, 0);
		var rfndr  = object.children[20];
		rfndr.position.set(4.635, -.52, 0);
		drum.material = rim.material = spoks.material = trm.material = ruf.material = ffndr.material = rfndr.material = materO1;
		var fdor  = object.children[19];
		fdor.position.set(-.144, -1.80, 0);
		var rbod  = object.children[22];
		rbod.position.set(4.952, -1.87, 0);
		var bdor  = object.children[24];
		bdor.position.set(2.423, -1.78, 0);
		var hud = object.children[16];
		hud.position.set(-4.212, -1.363, 0);
		var fbod  = object.children[17];
		fbod.position.set(.064, -1.166, 0);		
		var gril = object.children[12];
		gril.position.set(-6.21, -1.14, 0);
		hud.material = fbod.material = fdor.material = rbod.material = bdor.material = gril.material = materO2;
		var rfrme  = object.children[21];
		rfrme.position.set(6.168, .2452, 0);		
		var rubr = object.children[5];
		rubr.position.set(-.0235, -.585, 0);
		var stp  = object.children[25];
		stp.position.set(.67, .44, 0);
		var btom  = object.children[26];
		btom.position.set(-.5, -.444, 0);
		var materM = new THREE.MeshLambertMaterial({color: 0x060606});	
		rubr.material = stp.material = btom.material = rfrme.material = materM;		
		var glas  = object.children[23];
		glas.position.set(2.38, -3.06, 0);
		var mater3 = new THREE.MeshStandardMaterial({color: 0xcccccc, roughness: .2, metalness: .2, envMap: tex, transparent: true, opacity: .5});	
		glas.material = mater3;	
		scene.add(spindl);
		scene.add(hub);
		scene.add(bnd);
		scene.add(drum);
		scene.add(rim);
		scene.add(rubr);
		scene.add(whitw);
		scene.add(spoks);
		scene.add(hudlte);
		scene.add(hedlte);
		scene.add(foglte);
		scene.add(moblte);
		scene.add(gril);
		scene.add(crme);
		scene.add(trm);
		scene.add(ruf);
		scene.add(hud);
		scene.add(fbod);
		scene.add(ffndr);
		scene.add(fdor);
		scene.add(rfndr);
		scene.add(rfrme);
		scene.add(rbod);
		scene.add(glas);
		scene.add(bdor);
		scene.add(stp);
		scene.add(btom);
		scene.add(hndl);
		scene.add(bmpr);
		var geomT = new THREE.PlaneBufferGeometry(2.48, .88);
		var materT = new THREE.MeshBasicMaterial({color: 0x06ff06});
		var tapal1 = new THREE.Mesh(geomT, materM);
		tapal1.rotation.x = Math.PI/-2;
		tapal1.position.set(.077, -3.78, 2.49);
		var tapal2 = new THREE.Mesh(geomT, materO1);
		tapal2.scale.x = .6;
		tapal2.scale.y = 1.2;
		tapal2.rotation.set(0, Math.PI/2, Math.PI/2);
		tapal2.position.set(6.3, -3.1, .35);
		var tapal3 = new THREE.Mesh(geomT, materM);
		tapal3.scale.x = 1.15;
		tapal3.scale.y = 4;
		tapal3.rotation.set(0, Math.PI/-2, Math.PI/2);
		tapal3.position.set(1.8, -2.425, 0);
		var tapal4 = new THREE.Mesh(geomT, materM);
		tapal4.scale.x = 3;
		tapal4.scale.y = 4;
		tapal4.rotation.x = Math.PI/-2;
		tapal4.position.set(-2, -3.5, 0);
		var geomTc = new THREE.CircleBufferGeometry(1.6, 8, 0, Math.PI);
		var tapal5 = new THREE.Mesh(geomTc, materM);
		tapal5.scale.y = 1.38;
		tapal5.position.set(-4.08, -3.71, -2);
		var tapal6 = tapal5.clone();
		tapal6.rotation.y = Math.PI;
		tapal6.position.z = 2;
		scene.add(tapal1);		
		scene.add(tapal2);
		scene.add(tapal3);
		scene.add(tapal4);
		scene.add(tapal5);
		scene.add(tapal6);
		var geomB = new THREE.CylinderBufferGeometry(.026, .026, .94, 8, 1, true);
		var materB = new THREE.MeshLambertMaterial({color: 0x030303});	
		var manib1 = new THREE.Mesh(geomB, materB);
		manib1.rotation.z = .98;
		manib1.position.set(1.38, -1.2, -.8);
		var geomB2 = new THREE.CylinderBufferGeometry(.015, .015, .9, 8, 1, true);
		var manib2 = new THREE.Mesh(geomB2, materB);
		manib2.rotation.z = -.43;
		manib2.position.set(1, -.95, -.8);
		var manib3 = manib2.clone();
		manib3.rotation.set(Math.PI/2, 0, 0);
		var geomB2 = new THREE.TorusBufferGeometry(.44, .026, 8, 24);
		var materB4 = new THREE.MeshPhongMaterial({color: 0x040404, shininess: 10});	
		var manib4 = new THREE.Mesh(geomB2, materB4);
		manib4.rotation.x = Math.PI/2;
		manib4.rotation.y = -2;
		manib4.position.set(1, -.95, -.8);		
		var geomM5 = new THREE.CircleBufferGeometry(.05, 8);
		var materB5 = new THREE.MeshPhongMaterial({color: 0x040404, shininess: 14, side: THREE.DoubleSide});	
		var manib5 = new THREE.Mesh(geomM5, materB5);
		manib5.rotation.x = Math.PI/2;
		manib5.rotation.y = -2;
		manib5.position.set(.985, -.94, -.8);		
		scene.add(manib1);		
		scene.add(manib2);		
		scene.add(manib3);		
		scene.add(manib4);		
		scene.add(manib5);		
	});
}

function loadSopa() {
loadO.load(
	'obj/interior/sofablock2.obj',
	function (object, materials) {
		var mater = new THREE.MeshStandardMaterial({color: 0x010101, metalness: .2});	
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh) {
				child.geometry.computeVertexNormals();
				child.geometry.computeFaceNormals();			
				child.castShadow = true;
				child.receiveShadow = true;
				child.material = mater;
			}
		});
		var sopa1 = object.children[0].clone();
		sopa1.scale.set(1.1, 1, 2.3);
		sopa1.position.set(-.3, -2.8, 0);
		var sopa2 = sopa1.clone();
		sopa2.position.x = -3.3;
		var sopa3 = object.children[0].clone();
		sopa3.scale.set(1.15, .4, 2.3);
		sopa3.rotation.z = Math.PI/1.8;
		sopa3.position.set(-1, -1.5, 0);
		var sopa4 = sopa3.clone();
		sopa4.position.x = -4;
		scene.add(sopa1);
		scene.add(sopa2);
		scene.add(sopa3);
		scene.add(sopa4);
	});
}

function sahig() {
	var geometry = new THREE.PlaneBufferGeometry(300, 300);
	var material = new THREE.MeshStandardMaterial({color: 0x555555, roughness: .6, metalness: .3, transparent: true, opacity: .8});
	var sahig = new THREE.Mesh(geometry, material);
	sahig.rotateX(Math.PI/-2);
	sahig.position.y = floorposY;
	sahig.receiveShadow = true;	
	scene.add(sahig);	
	var material2 = new THREE.MeshStandardMaterial({color: 0x555555, roughness: .6, metalness: .3});
	var sahig2 = new THREE.Mesh(geometry, material2);
	sahig2.rotateX(Math.PI/-2);
	sahig2.position.y = floorposY-.1;
	scene.add(sahig2);	
}

function getRadian(deg) {
	var rad = deg * Math.PI / 180;
	return rad;
}

function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now()*.02;
	if (entro) {
		po1 -= .005;
		po2 += .01;
		if (po1 > 0) {
			pinfo.style.opacity = po1;
		} else {
			pinfo.style.opacity = 0;
			pinfo.style.display = 'none';
			entro = false;
			//document.getElementById('aud').play();
		}		
		if (po2 < 1.0) {
			cntnr.style.opacity = po2;
		} else {
			cntnr.style.opacity = 1.0;
		}
	}
	//controls.autoRotate = false;
	render();
}

function render() {
	camera.lookAt(scene.position);
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

closeit.addEventListener('click', function(e) {
	if (colpi) {
		fadeOff(picker);
		fadeOff(slider);
		closeit.innerHTML = 'C H A N G E&nbsp;&nbsp;C O L O R';
	} else {
		fadeOn(picker);
		fadeOn(slider);
		closeit.innerHTML = 'C L O S E';
	}
	colpi = !colpi;	
	e.preventDefault();
}, false);

ColorPicker(
    document.getElementById('slider'),
    document.getElementById('picker'),
    function(hex, hsv, rgb) {
		materO1.color.set(hex);
		materO2.color.set(hex);
});

//}());





