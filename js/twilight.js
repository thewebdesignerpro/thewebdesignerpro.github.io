/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */
function init(){camera=new THREE.PerspectiveCamera(60,ww/wh,.1,6e3),camera.position.set(150,20,-14.4),scene=new THREE.Scene,camera.lookAt(scene.position);var e=new THREE.SpotLight(4469538,3,400,Math.PI/4,1);e.position.set(-220,4,21.4),e.castShadow=!1,scene.add(e),renderer=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),renderer.setPixelRatio(window.devicePixelRatio),renderer.setSize(ww,wh),renderer.setClearColor(0,1),renderer.shadowMap.enabled=!1,renderer.sortObjects=!1;var n=document.getElementById("container");n.appendChild(renderer.domElement),backDrop(function(e){viz(e)}),oDio(),document.addEventListener("mousemove",onDocumentMouseMove,!1)}function backDrop(e){var n=(new THREE.CubeTextureLoader).setPath("imj/map/cube/hdr014/").load(["face-r.jpg","face-l.jpg","face-t.jpg","face-d.jpg","face-f.jpg","face-b.jpg"]);return n.format=THREE.RGBFormat,n.mapping=THREE.CubeReflectionMapping,scene.background=n,e?e(n):void 0}function oDio(){var e=new THREE.AudioListener;camera.add(e);var n=new THREE.Audio(e),t=new THREE.AudioLoader,o=new Audio,a="mp3";o.canPlayType("audio/ogg")&&(a="ogg");var r="aud/128/toactwi."+a;t.load(r,function(e){n.setBuffer(e),n.setLoop(!0),n.setVolume(.5),n.play()}),analyser1=new THREE.AudioAnalyser(n,256)}function viz(e){var n=new THREE.TextureLoader;n.load("imj/shade/alfa1.png",function(n){n.wrapS=n.wrapT=THREE.RepeatWrapping;var t=new THREE.RingGeometry(.1,180,40,51),o=new THREE.MeshPhysicalMaterial({color:13421772,envMap:e,envMapIntensity:1,metalness:.5,reflectivity:.75,clearCoat:.8,transparent:!0,opacity:.9});plane1=new THREE.Mesh(t,o),plane1.position.y=9,plane1.rotation.x=-Math.PI/2,scene.add(plane1),vertices=plane1.geometry.vertices;var a=new THREE.RingGeometry(180,2e3,40,1),r=new THREE.MeshPhysicalMaterial({color:13421772,envMap:e,envMapIntensity:1,metalness:.5,reflectivity:.75,clearCoat:.8,transparent:!0,opacity:.9,alphaMap:n}),i=new THREE.Mesh(a,r);i.position.y=9,i.rotation.x=-Math.PI/2,scene.add(i),animate()},function(e){console.log(e.loaded/e.total*100+"% loaded")},function(e){console.log("Error loading texture")})}function onDocumentMouseMove(e){mouseX=e.clientX-wwh,mouseY=e.clientY-whh,scene&&(-mouseY>whh/4&&(camera.position.y=mouseY*-.15),camera.position.z=.1*-mouseX-14.4)}function animate(){.003*Date.now();if(ntro&&(po1-=.001,po2+=.001,po1>0?pinfo.style.opacity=po1:(pinfo.style.opacity=0,pinfo.style.display="none",ntro=!1),1>po2?cntnr.style.opacity=po2:(cntnr.style.opacity=1,ntro=!1)),plane1&&analyser1){analyser1.getFrequencyData();for(var e=0;40>e;e++){var n=vertices[e];n.z=analyser1.data[0]*-.02}for(var e=40;2040>e;e+=40)for(var t=Math.round(e/40),o=0;40>o;o++){var a=e+o,n=vertices[a];n.z=analyser1.data[t]*-.02}plane1.geometry.verticesNeedUpdate=!0,plane1.geometry.computeVertexNormals(),plane1.geometry.computeFaceNormals()}render(),requestAnimationFrame(animate)}function render(){camera.lookAt(scene.position),renderer.render(scene,camera)}var clock=new THREE.Clock;const floorPosY=-20,rnd1=Math.random(Math.PI);var mouseX=mouseY=mouseZ=0,ww=window.innerWidth,wh=window.innerHeight,wwh=ww/2,whh=wh/2,pis=0,pif=pif2=1,ntro=!0,renderer,camera,scene,controls,stats,cntnr=document.getElementById("container"),nv=document.getElementById("nav"),nvo=document.getElementById("nvo"),srbs=document.getElementById("serbis"),flio=document.getElementById("folio"),kont=document.getElementById("kontak"),srvc=document.getElementById("services"),prtf=document.getElementById("portfolio"),cntc=document.getElementById("contact"),cntnt=document.getElementById("content"),cntnt2=document.getElementById("content2"),cntnt3=document.getElementById("content3"),x1=document.getElementById("x1"),x2=document.getElementById("x2"),x3=document.getElementById("x3"),navOn=!1,popped="0",pinfo=document.getElementById("pinfo2"),po1=1,po2=0,grupo=new THREE.Group,mouse=new THREE.Vector2;document.body.style.width=ww+"px",document.body.style.height=wh+"px",cntnr.style.width=ww+"px",cntnr.style.height=wh+"px",cntnt.style.fontSize=(ww+wh)/2*.02;var gaf=0,vertices,vertices2,plane1,plane2,light,ambientLight,oras=0,analyser1;if(Detector.webgl)window.addEventListener?window.addEventListener("load",init,!1):window.attachEvent?window.attachEvent("onload",init):window.onload=init,cntnr.style.opacity=0;else{var warning=Detector.getWebGLErrorMessage();cntnr.appendChild(warning),cntnr.style.backgroundColor="transparent",document.body.style.backgroundImage="url('imj/shade/hom1/hombg.jpg')",document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center"}

