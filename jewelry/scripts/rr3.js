/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */
var renderer,camera,scene,controls,stats,spotLight,mater,clock=new THREE.Clock,mouseX=mouseY=mouseZ=0,ww=window.innerWidth,wh=window.innerHeight,wwh=ww/2,whh=wh/2,pis=0,pif=pif2=1,ntro=!0,cntnr=document.getElementById("container"),grupo=new THREE.Group,mouse=new THREE.Vector2,mouseXprev=mouseYprev=camRotX=camRotY=0;if(document.body.style.width=ww+"px",document.body.style.height=wh+"px",cntnr.style.width=ww+"px",cntnr.style.height=wh+"px",Detector.webgl)window.addEventListener?window.addEventListener("load",init,!1):window.attachEvent?window.attachEvent("onload",init):window.onload=init;else{var warning=Detector.getWebGLErrorMessage();cntnr.appendChild(warning),cntnr.style.backgroundColor="transparent"}function init(){(camera=new THREE.PerspectiveCamera(60,ww/wh,.1,1e4)).position.set(0,5,60),scene=new THREE.Scene,camera.lookAt(scene.position),ambientLight=new THREE.AmbientLight(3355443),(spotLight=new THREE.SpotLight(16777215,1,100,Math.PI/4,.5)).position.set(-30,30,30),spotLight.position.set(0,30,30),spotLight.castShadow=!1,spotLight.shadow.mapSize.width=1024,spotLight.shadow.mapSize.height=1024,spotLight.shadow.camera.near=5,spotLight.shadow.camera.far=200,spotLight.shadow.camera.fov=60,scene.add(spotLight),new THREE.DirectionalLight(16777215,1).castShadow=!0,(renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0})).setPixelRatio(window.devicePixelRatio),renderer.setSize(ww,wh),renderer.setClearColor(0,1),renderer.shadowMap.enabled=!1,renderer.shadowMapSoft=!0,renderer.shadowMap.type=THREE.PCFSoftShadowMap,renderer.sortObjects=!1,(cntnr=document.getElementById("container")).appendChild(renderer.domElement),stats=new Stats,cntnr.appendChild(stats.dom),(controls=new THREE.OrbitControls(camera,renderer.domElement)).enableDamping=!0,controls.dampingFactor=.25,controls.autoRotateSpeed=.1,controls.minDistance=50,controls.maxDistance=600,langit(function(e){loadFingerSizes(e),loadHeads(e)}),langit2(function(e){loadGem04(e)})}function langit(e){var n="images/map/cube/factory2/",t=".jpg",a=[n+"face-r"+t,n+"face-l"+t,n+"face-t"+t,n+"face-d"+t,n+"face-f"+t,n+"face-b"+t],o=(new THREE.CubeTextureLoader).load(a);if(o.format=THREE.RGBFormat,o.mapping=THREE.CubeReflectionMapping,e)return e(o)}function langit2(e){var n="images/map/cube/factory1/",t=".jpg",a=[n+"face-r"+t,n+"face-l"+t,n+"face-t"+t,n+"face-d"+t,n+"face-f"+t,n+"face-b"+t],o=(new THREE.CubeTextureLoader).load(a);if(o.format=THREE.RGBFormat,o.mapping=THREE.CubeReflectionMapping,e)return e(o)}function loadFingerSizes(e){var n=new THREE.MeshStandardMaterial({color:16777215,envMap:e,envMapIntensity:1.5,metalness:.9,roughness:.7});(new THREE.OBJLoader).load("models/xport3/metal01.obj",function(e){console.log(e),e.children[0].material=n,scene.add(e);var t=(new THREE.TextureLoader).load("images/texture/0682f206.jpg");t.wrapS=t.wrapT=THREE.RepeatWrapping,t.repeat.set(1,3),t.repeat.set(2,6),t.repeat.set(4,12),t.repeat.set(16,48),e.children[0].material.emissiveMap=t,e.children[0].material.roughnessMap=t,e.children[0].material.bumpMap=t,e.children[0].material.bumpScale=.01},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("An error happened")})}function loadHeads(e){var n=new THREE.MeshStandardMaterial({color:15649877,envMap:e,envMapIntensity:1.5,metalness:.9,roughness:.7});(new THREE.OBJLoader).load("models/xport3/userlayer04.obj",function(e){console.log(e),e.children[0].material=n,scene.add(e);var t=(new THREE.TextureLoader).load("images/texture/fd57962a.jpg");t.wrapS=t.wrapT=THREE.RepeatWrapping,t.repeat.set(16,4),e.children[0].material.emissiveMap=t,e.children[0].material.roughnessMap=t,e.children[0].material.bumpMap=t,e.children[0].material.bumpScale=.01,animate()},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("An error happened")})}function loadGem02(e){var n=new THREE.MeshPhongMaterial({color:12303291,envMap:e,emissive:8947848,emissiveIntensity:1.5,combine:THREE.MixOperation,shininess:60,specular:15658734,reflectivity:.7,transparent:!0,opacity:.96,side:THREE.DoubleSide});(new THREE.OBJLoader).load("models/xport2/gem02.obj",function(e){console.log(e),e.children[0].material=n,scene.add(e)},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("An error happened")})}function loadGem04(e){var n=new THREE.MeshPhongMaterial({color:14540253,envMap:e,emissive:11184810,emissiveIntensity:1.5,combine:THREE.MixOperation,shininess:60,specular:15658734,reflectivity:.9,transparent:!0,opacity:.95,side:THREE.DoubleSide});(new THREE.OBJLoader).load("models/xport3/gem04.obj",function(e){console.log(e),e.children[0].material=n,scene.add(e)},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("An error happened")})}function animate(){requestAnimationFrame(animate);clock.getDelta();var e=.003*Date.now();scene.rotation.x=Math.sin(.1*e),scene.rotation.y=Math.cos(.1*e),scene.rotation.z=Math.sin(.1*e),render(),stats.update()}function render(){controls.update(),renderer.render(scene,camera)}function onWindowResize(e){ww=window.innerWidth,wh=window.innerHeight,wwh=ww/2,whh=wh/2,renderer.setSize(ww,wh),camera.aspect=ww/wh,camera.updateProjectionMatrix(),document.body.style.width=cntnr.style.width=ww+"px",document.body.style.height=cntnr.style.height=wh+"px"}window.addEventListener("resize",onWindowResize,!1);   

