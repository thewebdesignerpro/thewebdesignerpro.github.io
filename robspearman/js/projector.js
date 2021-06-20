/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

var mouseX = mouseY = mouseZ = kr = 0, ww = window.innerWidth, wh = window.innerHeight, wwh = ww/2, whh = wh/2,	controls, entro = true,	cntnr = document.getElementById('container'), 
	renderer, camera, scene, spotL, spotL0, spotLHelper, controls, stats, geom, mater, mater2, tex=[], gridH, domeF, domeB, oldD, HH=pHH=0, pCases, deskT, curNum=0, 
gear = document.getElementById("gear"), kontrols = document.getElementById("kontrols"), klose = document.getElementById("klose"), k1 = document.getElementById("k1"), 
k2 = document.getElementById("k2"), k3s = document.getElementById("k3s"), k4 = document.getElementById("k4"), k5 = document.getElementById("k5"), 
k7 = document.getElementById("k7"), k8 = document.getElementById("k8"), k8v = document.getElementById("k8v"), k9 = document.getElementById("k9"), k9v = document.getElementById("k9v"), 
k10 = document.getElementById("k10"), k11 = document.getElementById("k11"), k11v = document.getElementById("k11v");

if (window.location.hash) {			
	var cnum = window.location.hash.slice(1);
	if ((cnum>0)&&(cnum<themodels.length+1)) {
		curNum = cnum-1;
		//console.log(cnum);
	} else {
		window.location.hash = '';
	}
	//console.log(themodels.length);
	//console.log('hash '+window.location.hash);
	//console.log('hash '+hash);
	//player.setTrack(parseInt(hash, 10) - 1);		
}

var domeTF=kon=kos=false;

// metric
var metre = 35; 

var florHeight = -metre*2, projHeight=20;
var springL=metre*(themodels[curNum][3]*.26), podH=0;
var domeG = new THREE.Group();	
var loader = new THREE.TextureLoader();


document.body.style.width = ww+'px';
document.body.style.height = wh+'px';	
cntnr.style.width = ww+'px';	
cntnr.style.height = wh+'px';
//cntnt.style.fontSize = ((ww+wh)/2)*0.02;

if (! Detector.webgl) Detector.addGetWebGLMessage();

function getDeg(deg) {
	var rad = deg * Math.PI/180;
	return rad;
}

function rnd3(num) {    
    return +(Math.round(num+"e+3")+"e-3");
}

function init() {
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(ww, wh);
	renderer.setClearColor(0x000000, 0);
	renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;		
	var container = document.getElementById('container');
	container.appendChild(renderer.domElement);	
	
	camera = new THREE.PerspectiveCamera(60, ww/wh,  0.1, 10000);
	camera.position.set(0, 10, 200);
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.001);
	camera.lookAt(scene.position);	
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.23;
	//controls.enableZoom = false;
	controls.minDistance = 10;
	controls.maxDistance = 700;	
	//controls.maxPolarAngle = Math.PI/1.05;	
	//controls.center.set(0, 0, 20);
	//camera.position.copy(controls.center).add(new THREE.Vector3(0, 0, 10));
	
	var aLight = new THREE.AmbientLight(0x626262);
	scene.add(aLight);
	
	spotL0 = new THREE.SpotLight(0xffffff, 3, 300, Math.PI/4);
	spotL0.position.set(0, 150, 0);
	spotL0.castShadow = true;
	spotL0.shadowMapWidth = 1024;
	spotL0.shadowMapHeight = 1024;
	spotL0.shadowDarkness = 0.5;
	spotL0.shadowCameraNear = 20;
	spotL0.shadowCameraFar = 1000;
	spotL0.shadowCameraFov = 50;
	scene.add(spotL0);	
	//var spotL0Helper = new THREE.SpotLightHelper(spotL0);
	//scene.add(spotL0Helper);	
		
	var axisHelper = new THREE.AxisHelper(5);
	scene.add(axisHelper);
	
	statS();
	
	gridM();
	floorT();

	k9.value = themodels[curNum][4];	
	domeTex(curNum+1, function(tx) {
		makeDome(curNum+1, tx);
		projectoR(curNum+1);
		deskTop(curNum+1);
		spotLite(curNum+1);	
		animate();
	});	

	initUI();
}	

function statS() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.left = '0px';
	stats.domElement.style.zIndex = 100;
	cntnr.appendChild(stats.domElement);
}

function gridM() {
	var groupH = new THREE.Group();
	gridH = new THREE.GridHelper(800, 20);
	gridH.position.y = florHeight+.1;
	gridH.setColors(0x040404, 0x040404);
	groupH.add(gridH);	
	groupH.rotation.y = Math.PI/4;	
	scene.add(groupH);	
}

function floorT() {
	loader.load(
		'img/cement.jpg',
		function (texture) {
			var geometry = new THREE.PlaneBufferGeometry(240, 240);
			var material = new THREE.MeshPhongMaterial({color: 0x505050, map: texture, shininess: 25});
			var floorT = new THREE.Mesh(geometry, material);
			floorT.position.y = florHeight;
			floorT.rotation.set(-Math.PI/2, 0, Math.PI/4);
			floorT.castShadow = true;
			floorT.receiveShadow = true;
			scene.add(floorT);
		},
		function ( xhr ) {
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
}

function domeTex(pNum, callback) {
	var cNum = pNum-1;
	loader.load(
		themodels[cNum][9],
		function (texture) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.x = -1;
			tex[cNum] = texture;        
			if (callback) {
				return callback(texture);
			}			
		},
		function (xhr) {
			console.log((xhr.loaded/xhr.total * 100) + '% loaded');
		},
		function (xhr) {
			console.log('An error happened');
		}
	);
}

//function makeDome(pNum, tex, dia) {
function makeDome(pNum, tex) {
	var cNum = pNum-1;
	var angle = getDeg(180-themodels[cNum][8])*.5;
	var rtan = Math.tan(angle);
	//var rad = (dia*metre*.5) || (themodels[cNum][3]*metre*.5);
	var rad = k8.value*metre*.5;
	var H = rad*rtan;		
	
/*	var geometry = new THREE.SphereBufferGeometry(rad+.8, 32, 32, 0, Math.PI*2, 0, Math.PI*.5);
	var material0 = new THREE.MeshPhongMaterial({color: 0xaaaaaa, side: THREE.BackSide, transparent: true, opacity: 0.0});
	domey = new THREE.Mesh(geometry, material0);
	domey.position.y = florHeight+(themodels[cNum][4]*metre)+(k9v.innerHTML*metre)+H+1.5;
	domeG.add(domey);	*/

	geom = new THREE.SphereGeometry(rad+.4, 32, 32, 0, Math.PI*2, 0, Math.PI*.5);
	mater = new THREE.MeshPhongMaterial({map: tex, shininess: 20, transparent: true, opacity: 0.5});
	domeF = new THREE.Mesh(geom, mater);
	//domeF.position.copy(domey.position);			
	domeF.position.y = florHeight+springL;			
	domeG.add(domeF);
	
	geom = new THREE.SphereGeometry(rad, 32, 32, 0, Math.PI*2, 0, Math.PI*.5);
	mater = new THREE.MeshPhongMaterial({map: tex, shininess: 20, side: THREE.BackSide});
	domeB = new THREE.Mesh(geom, mater);
	domeB.position.copy(domeF.position);			
	domeG.add(domeB);

	scene.add(domeG);

	//k11.value = k11v.innerHTML = HH = rnd3(Math.abs(florHeight-domeF.position.y)/metre);	//todo
	k11.value = k11v.innerHTML = HH = rnd3(springL/metre);	
	curNum = cNum;
	domeTF = true;
}			
			
function projectoR(pNum, dia) {
	var cNum = pNum-1;
	var angle = getDeg(180-themodels[cNum][8])*.5;
	var rtan = Math.tan(angle);
	//var rad = (dia*metre*.5) || (themodels[cNum][3]*metre*.5);
	var rad = (dia*metre*.5) || (k8.value*metre*.5);
	var H = rad*rtan;	
	var pCase = new THREE.Geometry();

	var material = new THREE.MeshPhongMaterial({color: 0x030303, shininess: 50, transparent: true, opacity: 1.0, depthWrite: true, depthTest: true});
	var geometry = new THREE.CylinderGeometry(1.8, 1.8, .6, 16);
	var clens = new THREE.Mesh(geometry, material);
	//clens.position.y = themodels[cNum][4]*metre*.5+.5;
	clens.position.y = k9.value*metre*.5+.3;
	
	var geometry = new THREE.IcosahedronGeometry( 1.2, 4 );
	var eglow = new THREE.Mesh(geometry, material);
	eglow.scale.y = .5;
	//eglow.position.y = themodels[cNum][4]*metre*.5+.8;				
	//eglow.position.y = k9.value*metre*.5+.8;				
	eglow.position.y = k9.value*metre*.5+.4;				
		
	if (themodels[cNum][10]=='box') {
		//var geometry = new THREE.BoxGeometry(themodels[cNum][6]*metre, themodels[cNum][4]*metre, themodels[cNum][7]*metre);
		var geometry = new THREE.BoxGeometry(themodels[cNum][6]*metre, k9.value*metre, themodels[cNum][7]*metre);
	} else {
		//var geometry = new THREE.CylinderGeometry(themodels[cNum][6]*metre/2, themodels[cNum][7]*metre/2, themodels[cNum][4]*metre, 32);
		var geometry = new THREE.CylinderGeometry(themodels[cNum][6]*metre/2, themodels[cNum][7]*metre/2, k9.value*metre, 32);
	}
	//console.log(HH);
	var projector = new THREE.Mesh(geometry, material);
	projector.updateMatrix();
	pCase.merge(projector.geometry, projector.matrix);	
	clens.updateMatrix();
	pCase.merge(clens.geometry, clens.matrix);	
	eglow.updateMatrix();
	pCase.merge(eglow.geometry, eglow.matrix);
	
	pCases = new THREE.Mesh(pCase, material);	
	pCases.castShadow = true;
	pCases.receiveShadow = true;
	scene.add(pCases);	

	//pCases.position.y = florHeight+((themodels[cNum][4]*metre)/2)+(themodels[cNum][4]*metre);
	//pCases.position.y = florHeight+((k9.value*metre)/2)+(themodels[cNum][4]*metre);			//todo
	//pCases.position.y = (springL-H-((1+k9.value)*metre*.5))-florHeight;
	pHH = podH = (springL-H)/metre-k9.value;
	k2.innerHTML = rnd3(podH);
	pCases.position.y = florHeight+(podH+(k9.value*.5))*metre+.3;
	//console.log(pCases.position.y);
}

function deskTop(pNum) {
	var cNum = pNum-1;
	//var geometry = new THREE.BoxGeometry(36, .5, 36	);
	var geometry = new THREE.BoxGeometry(40, podH*metre, 40);
	//var material = new THREE.MeshPhongMaterial({color: 0x606060, transparent: true, opacity: .95});
	var material = new THREE.MeshPhongMaterial({color: 0x1a1a1a, side:THREE.FrontSide});
	deskT = new THREE.Mesh(geometry, material);
	//deskT.position.y = florHeight+(themodels[cNum][4]*metre);	//todo
	deskT.position.y = florHeight+(podH*metre*.5);
	//deskT.position.y = florHeight+springL-H/2+.5;
	deskT.castShadow = true;
	deskT.receiveShadow = true;	
	scene.add(deskT);
}

function spotLite(pNum, dia) {
	var cNum = pNum-1;
//	angel=getDeg(themodels[cNum][8])/2;
	var angle = getDeg(180-themodels[cNum][8])*.5;
	var rtan = Math.tan(angle);
	var rad = (dia*metre*.5) || (k8.value*metre*.5);
	var H = rad*rtan;	
	//console.log(H);
	var geometry = new THREE.CylinderGeometry(k8.value*metre*.5, 1, H, 32, 1, true);
	var material = new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe: true, transparent: true, opacity: .05});
	spotL = new THREE.Mesh(geometry, material);
	spotL.position.y = florHeight+springL-H/2+.5;
	scene.add(spotL);	
	
/*	spotL = new THREE.SpotLight(0xffffff, 1, 1000, angel);
	//spotL.position.y = florHeight+(themodels[cNum][4]*metre)+(themodels[cNum][4]*metre)+1;	//todo
	spotL.position.y = springL-H+florHeight;
	spotL.castShadow = false;
	spotL.shadowMapWidth = 512;
	spotL.shadowMapHeight = 512;
	spotL.shadowCameraNear = 20;
	spotL.shadowCameraFar = 1000;
	spotL.shadowCameraFov = 50;
	scene.add(spotL);	
	if (spotL.position.y==0) spotL.position.y = 0.01;
	if (spotL.position.y>0)	spotL.rotation.x = Math.PI;
	spotLHelper = new THREE.SpotLightHelper(spotL);
	scene.add(spotLHelper);	*/
}	

function uiX() {
	//k4.innerHTML = themodels[curNum][10]; 
	k5.innerHTML = themodels[curNum][2];
	k6.innerHTML = themodels[curNum][6]+' x '+themodels[curNum][7]; 
	k7.innerHTML = themodels[curNum][8]+"&#176";
	k8.value = k8v.innerHTML = k8.max = themodels[curNum][3];
	k9.value = k9v.innerHTML = k9.min = k9min.innerHTML = themodels[curNum][4];
	k9.max = k9max.innerHTML = themodels[curNum][5];
	k10.setAttribute('href', themodels[curNum][11]);

	if (themodels[curNum][4]==themodels[curNum][5]) {
		//k9.className = k11.className = "dis";
		k9.className = "dis";
	} else {
		k9.className = "";
	}
	
	oldD = themodels[curNum][3];
}


function initUI() {
	kontrols.style.right = -320;
	
	for (var i=0; i<themodels.length; i++) {
		var j = i+1, sm = true;
		for (var k=0; k<i; k++) {
			if (themodels[k][0]==themodels[i][0]) {
				sm = false;
			}
			if (!sm) break;
		}
		//if (sm)	k1.options[k1.options.length] = new Option(themodels[i][0], j);
		k1.options[k1.options.length] = new Option(themodels[i][0], j);
		if (!sm) k1.options[i].className = "dn";	
		k3s.options[k3s.options.length] = new Option(themodels[i][1], j);
		//if (themodels[i][0]!=themodels[0][0]) k3s.options[i].className = "dn";
		if (themodels[i][0]!=themodels[curNum][0]) k3s.options[i].className = "dn";
	}
	//k1.options[0].selected = 'selected';
	//console.log(curNum);
	k1.options[curNum].className = "";		
	k1.options[curNum].selected = 'selected';
	//k3s.options[0].selected = 'selected';
	k3s.options[curNum].selected = 'selected';
	uiX();
}

function mChange(x) {
	if (x) {
		springL=metre*(themodels[curNum][3]*.26);
		var cnum = curNum+1;
		window.location.hash = '#'+cnum;
	}
	
	if (domeTF) {
		domeTF = false;
		//domeG.remove(domey);
		domeG.remove(domeF);
		domeG.remove(domeB);
		scene.remove(domeG);
	}	
	scene.remove(pCases);
	//scene.remove(spotLHelper);
	scene.remove(deskT);
	scene.remove(spotL);
	
	projectoR(curNum+1);
	//deskT.position.y = florHeight+(themodels[curNum][4]*metre);		//todo
	deskTop(curNum+1);
	spotLite(curNum+1);	
	
	if (!domeTF) {
		if (!tex[curNum]) {
			domeTex(curNum+1, function(tx) {
				makeDome(curNum+1, tx);
			});
		} else {
			makeDome(curNum+1, tex[curNum]);
		}
	}

	if (x) {
		for (var i=0; i<themodels.length; i++) {
			if (themodels[i][0]!=themodels[curNum][0]) {
				k3s.options[i].className = "dn";
			} else {
				k3s.options[i].className = "";	
			}
			k3s.options[curNum].selected = 'selected';
		}	
	}
	//console.log(x);
	//renderer.render(scene, camera);
}

function pChange() {
	//curNum = k1.selectedIndex;
	curNum = k1.value-1;
	uiX();
	mChange(1);
}
function sChange() {
	curNum = k3s.value-1;
	uiX();
	mChange(1);
}
	
k1.addEventListener("change", pChange, false);

k3s.addEventListener("change", sChange, false);

k8.addEventListener('input', function(e) {
	k8v.innerHTML = this.value;
	
	mChange();
	
	var q = pCases.position.y-((k9.value*metre+.3)*.5);
	if (q<florHeight) {
		unt.style.opacity = '0.0';
		alrt.style.opacity = '1.0';
		//console.log(q);
	} else {
		unt.style.opacity = '1.0';
		alrt.style.opacity = '0.0';
	}
	/*if (domeTF) {
		domeTF = false;
		//domeG.remove(domey);
		domeG.remove(domeF);
		domeG.remove(domeB);
		scene.remove(domeG);
	}
	if (!domeTF) {
		makeDome(curNum+1, tex[curNum], this.value);
		//makeDome(curNum+1, tex[curNum]);
	}	*/
	
	//oldD = this.value;
	//k11.value = k11v.innerHTML = HH;
	//console.log('k8');
	
}, false);

k9.addEventListener('input', function(e) {
	k9v.innerHTML = this.value;
	
	//mChange();
	scene.remove(pCases);
	//scene.remove(spotLHelper);
	scene.remove(deskT);
	//scene.remove(spotL);
	
	projectoR(curNum+1);
	//deskT.position.y = florHeight+(themodels[curNum][4]*metre);		//todo
	deskTop(curNum+1);
	//spotLite(curNum+1);	
	
	var q = pCases.position.y-((k9.value*metre+.3)*.5);
	if (q<florHeight) {
		unt.style.opacity = '0.0';
		alrt.style.opacity = '1.0';
		//console.log(q);
	} else {
		unt.style.opacity = '1.0';
		alrt.style.opacity = '0.0';
	}	


/*	k9v.innerHTML = pHH = this.value;
	pCases.position.y = florHeight+((themodels[curNum][8]*metre)/2)+(pHH*metre);
	deskT.position.y = florHeight+(pHH*metre);
	spotL.position.y = florHeight+(themodels[curNum][8]*metre)+(pHH*metre)+1;
	
	var angle = getDeg(180-themodels[curNum][8])*.5;
	var rtan = Math.tan(angle);
	var rad = k8v.innerHTML*metre*.5;
	var H = rad*rtan;
	domey.position.y = florHeight+(themodels[curNum][8]*metre)+(pHH*metre)+H+1.5;
	domeF.position.copy(domey.position);	
	domeB.position.copy(domey.position);	
	k11.value = k11v.innerHTML = HH = rnd3(Math.abs(florHeight-domey.position.y)/metre);*/
}, false);

k11.addEventListener('input', function(e) {
	var angle = getDeg(180-themodels[curNum][8])*.5;
	var rtan = Math.tan(angle);
	var rad = k8.value*metre*.5;
	var H = rad*rtan;
	
	scene.remove(deskT);
	
	k11.value = k11v.innerHTML = HH = this.value;
	springL = HH*metre;
	domeF.position.y = domeB.position.y = florHeight+springL;	
	//k11.value = k11v.innerHTML = HH = rnd3(springL/metre);	

	pHH = podH = (springL-H)/metre-k9.value;
	k2.innerHTML = rnd3(podH);
	pCases.position.y = florHeight+(podH+(k9.value*.5))*metre+.3;
	deskTop(curNum+1);
	spotL.position.y = florHeight+springL-H/2+.5;
	
	var q = pCases.position.y-((k9.value*metre+.3)*.5);
	if (q<florHeight) {
		unt.style.opacity = '0.0';
		alrt.style.opacity = '1.0';
		//console.log(q);
	} else {
		unt.style.opacity = '1.0';
		alrt.style.opacity = '0.0';
	}
	//console.log(pCases.position.y);
	
/*	var oldDy = domey.position.y,
		oldPy = pCases.position.y,
		oldDey = deskT.position.y, 
		oldSy = spotL.position.y, 
		oldDm = k11v.innerHTML,
		oldPm = k9v.innerHTML;
	
	if (themodels[curNum][4]!=themodels[curNum][5]) {
		var angle = getDeg(180-themodels[curNum][8])*.5;
		var rtan = Math.tan(angle);
		var rad = k8v.innerHTML*metre*.5;
		var H = rad*rtan;

		domey.position.y = florHeight+(this.value*metre);
		domeF.position.copy(domey.position);	
		domeB.position.copy(domey.position);	
		
		spotL.position.y = domey.position.y - H;
		pCases.position.y = spotL.position.y-(themodels[curNum][8]*metre*.5);
		deskT.position.y = spotL.position.y-(themodels[curNum][8]*metre)-1;
		
		var t = rnd3(Math.abs(florHeight-(deskT.position.y+1))/metre);
		
		var tmp = t*metre;
		
		if ((t<=themodels[curNum][4])||(t>=themodels[curNum][5])||(deskT.position.y<=florHeight)) {
			domey.position.y = domeF.position.y = domeB.position.y = oldDy;
			spotL.position.y = oldSy;
			pCases.position.y = oldPy;
			deskT.position.y = oldDey;			
			k11.value = k11v.innerHTML = HH = oldDm;
			k9.value = k9v.innerHTML = pHH = oldPm;
		} else {
			k9.value = k9v.innerHTML = pHH = t;
			k11.value = k11v.innerHTML = HH = this.value;						
		}
	} else {
		k11.value = k11v.innerHTML = HH;		
	}
*/	
}, false);

gear.addEventListener('click', function(e) {
	kr=0;
	gear.style.display='none';
	kontrols.style.display = 'block';
	kon = true;
	e.preventDefault();
}, false);

klose.addEventListener('click', function(e) {
	kos = true;
	kr = 1.0;
	e.preventDefault();
}, false);
	
function onWindowResize(event) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	renderer.setSize(ww, wh);
	camera.aspect = ww/wh;
	camera.updateProjectionMatrix();
	document.body.style.width = cntnr.style.width = ww+'px';
	document.body.style.height = cntnr.style.height = wh+'px';	
}
window.addEventListener('resize', onWindowResize, false);		
				
function animate() {
	requestAnimationFrame(animate);
	var timer = Date.now()*.001;
	//var timer = new Date().getTime();	
	
	if (domeTF) {

	}

	if ((Math.abs(camera.position.x)<20)&&(camera.position.y<-22)&&(camera.position.y>-188)&&(Math.abs(camera.position.z)<20)) {
		pCases.material.opacity = 0.4;
		pCases.material.depthWrite = false;
		pCases.material.depthTest = false;
		deskT.material.visible = false;
	} else {
		pCases.material.opacity = 1.0;
		pCases.material.depthWrite = true;
		pCases.material.depthTest = true;		
		deskT.material.visible = true;		
	}
	
	if (kon) {
		kr += .025;
		kontrols.style.opacity = kr;
		if (kr>=1.0) kon=false;
	}
	
	if (kos) {
		kr -= .05;
		kontrols.style.opacity = kr;
		if (kr<=0) {
			kos=false;
			kontrols.style.display='none';
			gear.style.display='block';
		}
	}
	
	controls.update();
	stats.update();	
	render();
}

function render() {
	camera.lookAt(scene.position);
	renderer.render(scene, camera);	
}

if (window.addEventListener) {
	window.addEventListener("load", init, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}
