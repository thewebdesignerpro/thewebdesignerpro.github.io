app.controller("HomeControl", ["$rootScope", "$scope", "$timeout", "$document", "smoothScroll", function($rootScope, $scope, $timeout, $document, smoothScroll){

	var t1 = document.getElementsByClassName("t1"),
		t2 = document.getElementsByClassName("t2"),
		t3 = document.getElementsByClassName("t3"),
		// b1 = document.getElementsByClassName("b1"),
		action = document.getElementById("call-to-action"), 
		currSlide = 0, inited = false;
//		currSlide = -1, inited = false;

	var sections = document.getElementsByClassName("slide");

	var heightI = (document.documentElement && document.documentElement.scrollTop) ||
			  document.body.scrollTop;

	var t4 = document.getElementsByClassName("nav-links-action");

	if(heightI <=1){
		//t1[0].classList.add("t1-FX");
		//t2[0].classList.add("t2-FX");
		//t3[0].classList.add("t3-FX");
		t1[0].classList.add("fade-1");
		// b1[0].classList.add("bold-1");
	}
	
	window.addEventListener('scroll', function() {
		if (t1[0] != undefined && t2[0] != undefined && t3[0] != undefined && sections[0] != undefined && heightI != undefined && t4[0] != undefined) {
			var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			var currentHeight = (document.documentElement && document.documentElement.scrollTop) ||
				  document.body.scrollTop;

			if(currentHeight <=1){
/*				t1[0].classList.add("t1-FX");
				t2[0].classList.remove("t2-FX");
				t3[0].classList.remove("t3-FX");				*/
				t1[0].classList.add("fade-1");
				t2[0].classList.remove("fade-1");
				t3[0].classList.remove("fade-1");
				//e.switch(0);
				//currSlide = 0;
				// b1[0].classList.add("bold-1");
				// $timeout.cancel($scope.animTimeout);
				// $scope.anim.setSlide(1);
			}
			if (currentHeight >= (screenHeight/1.2 * 1) - screenHeight) {
				t4[0].classList.remove("header-2");
				t4[0].classList.add("header-2");
				// $timeout.cancel($scope.animTimeout);
				// $scope.anim.setSlide(1);
			}
			if (currentHeight >= (screenHeight/1.2 * 2) - screenHeight) {
/*				t2[0].classList.add("t2-FX");
				t1[0].classList.remove("t1-FX");
				t3[0].classList.remove("t3-FX");				*/
				t2[0].classList.add("fade-1");
				t1[0].classList.remove("fade-1");
				t3[0].classList.remove("fade-1");
				//e.switch(1);
				//currSlide = 1;
				//t2[0].classList.add("fade-1");
				// b1[1].classList.add("bold-1");
				// $timeout.cancel($scope.animTimeout);
				// $scope.anim.setSlide(2);
				// $scope.animTimeout = $timeout(function() {$scope.anim.setSlide(3);}, 1000);
			}
			if (currentHeight >= (screenHeight/1.2 * 3) - screenHeight) {
/*				t3[0].classList.add("t3-FX");
				t1[0].classList.remove("t1-FX");
				t2[0].classList.remove("t2-FX");				*/
				t3[0].classList.add("fade-1");
				t1[0].classList.remove("fade-1");
				t2[0].classList.remove("fade-1");
				//e.switch(2);
				//currSlide = 2;
				//t3[0].classList.add("fade-1");
				// t3[2].classList.add("fade-1");
				// b1[2].classList.add("bold-1");
				t4[0].classList.add("header-1");
				t4[0].classList.remove("header-2");
				action.classList.add("action-btn");
				// $timeout.cancel($scope.animTimeout);
				// $scope.anim.setSlide(3);
			}
		}
	});

	// $scope.canvas = document.getElementById('rs21Vis');
	// $scope.ctx = $scope.canvas.getContext('2d');
	// $scope.visWidth = window.innerWidth;
	// $scope.visHeight = window.innerHeight;

	// $scope.canvas.width = $scope.visWidth;
	// $scope.canvas.height = $scope.visHeight;

	// $scope.anim = window['rs21-animation'].default($scope.ctx, $scope.visWidth, $scope.visHeight)
	// $scope.anim.start()
	// $scope.anim.setSlide(0);
	// $scope.animTimeout = $timeout(function() {$scope.anim.setSlide(1);}, 1000);



/* The new vis by Kam */

console.log('update')

function gaussian(mean, stdev) {
  var y2;
  var use_last = false;
  return function() {
    var y1;
    if (use_last) {
      y1 = y2;
      use_last = false;
    } else {
      var x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      use_last = true;
    }

    var retval = mean + stdev * y1;
    return retval;
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

 function subset(arr, s, n){
   var newArr = [];
   var len = arr.length;
   if(len < s + n){
     //console.log('wrap')
     for(var i = s; i < len; i++){
       newArr.push(arr[i]);
     }
     for(var i = 0; i < s+n-len; i++){ 
       newArr.push(arr[i]);
     }
   } else {
     for(var i = s; i < s+n; i++){
       newArr.push(arr[i]) 
     }
   } 
   return newArr
 }

function env() {

  this.currentPhase = 0;

  var res = window.innerWidth * window.innerHeight;
  var scale = 0;

  if (res > 1800000) {
    scale = 4;
  } else if (res > 1000000) {
    scale = 3.4;
  } else if (res > 300000) {
    scale = 2.8
  } else {
    scale = 2.2
  }

  //setup
  //this.c = document.createElement('canvas')
  this.c = document.getElementById('rs21Vis');
  this.c.setAttribute('width', window.innerWidth);
  this.c.setAttribute('height', window.innerHeight);
  //this.c.setAttribute('style', 'position:absolute;margin:0;padding:0;top:0;left:0;pointer-events:none;')
  //document.body.appendChild(this.c)
  this.ctx = this.c.getContext('2d');
  //this.ctx = this.c.getContext('2d', {alpha: false});
  //this.ctx.fillStyle = 'white';
  //this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  //Three.js
  this.scene = new THREE.Scene();
  this.camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  this.camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  this.renderer = new THREE.WebGLRenderer({antialias: false});
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setPixelRatio( window.devicePixelRatio );
  this.renderer2 = new THREE.WebGLRenderer({antialias: false});
  this.renderer2.setSize(window.innerWidth, window.innerHeight);
  this.renderer2.setPixelRatio( window.devicePixelRatio );	
  
  var mat = new THREE.MeshPhongMaterial();

  this.camera1.position.z = 65;
  //this.camera2.position.z = 135;  
  this.camera2.position.z = 150;  

  //make the layers
  this.dotSets = [];

  this.properties = [{
    "l": 1,
    "v": Math.round(1 * scale),
    "u": Math.round(2 * scale),
    "gr": 20,
    "r": 4,
    "ro": [-2, -1, 3],
    "period": 0.004,
    "amplitude": 100,
    "speed": 1,
    "spread": gaussian(0, 50)
  }, {
    "l": 2,
    "v": Math.round(2 * scale),
    "u": Math.round(4 * scale),
    "gr": 40,
    "r": 3,
    "ro": [-1, 1, 2],
    "period": 0.001,
    "amplitude": 200,
    "speed": 1,
    "spread": gaussian(0, 150)
  }, {
    "l": 3,
    "v": Math.round(4 * scale),
    "u": Math.round(8 * scale),
    "gr": 60,
    "r": 2,
    "ro": [-1, 3, 1],
    "period": 0.006,
    "amplitude": 150,
    "speed": 1,
    "spread": gaussian(0, 300)
  }];

  this.context = {
    "ctx": this.ctx,
    "c1": this.camera1,
    "c2": this.camera2
  }

  for (var prop of this.properties) {
    var geo = new THREE.SphereGeometry(prop.gr, prop.u, prop.v);
    var obj = new THREE.Mesh(geo, mat);
    this.scene.add(obj);
    this.dotSets.push(new dotSet(obj, prop, this.context));
  }

  this.switch = function(p) {
    this.currentPhase = p;
	//console.log(this.currentPhase);
    for (var ds of this.dotSets) {
      ds.nextPhase = p;
    }
  }

  //animate the layers
  this.animate = function(t) {

    this.renderer.render(this.scene, this.camera1);
    this.renderer2.render(this.scene, this.camera2);
    //this.render(this.ctx);
    for (var dS of this.dotSets) {
      dS.draw(t, 0);
    }
  }


			
}

function dotSet(o, p, c) {

  this.l = p.l;
  this.currentPhase = 0;
  this.nextPhase = 0;
  this.transitioning = 0;
  this.ctx = c.ctx;
  this.obj = o;
  
  

  var rawEdges = new Set();

  for (var face of this.obj.geometry.faces) {
    rawEdges.add([face.a, face.b]);
    rawEdges.add([face.b, face.c]);
    rawEdges.add([face.c, face.a]);
  }
  
  this.edges = Array.from(rawEdges);
  this.edges = shuffle(this.edges);
  this.shift = 0;
  this.subset = this.edges.length * 0.1;

  this.dots = [];

  for (var j = 0; j < this.obj.geometry.vertices.length; j++) {
    this.dots.push(new dot(p.spread))
  }

  function getFirst(t, d) {
	
    var x = (window.innerWidth * (t + d.rand1)) % window.innerWidth;
    var s = d.rand2 - ((d.rand2 - d.rand3) * (x / window.innerWidth))
    var y = Math.sin((window.innerWidth * (t + d.rand1)) % window.innerWidth * p.period) * p.amplitude + (window.innerHeight * 0.5) + (s);
    return {
      "x": x,
      "y": y
    }
  }

  function getSecond(t, v) {

    var pos = v.clone();
    pos.project(c.c1);
    pos.x = Math.round((pos.x + 1) * window.innerWidth / 2);
    pos.y = Math.round((-pos.y + 1) * window.innerHeight / 2);

    return {
      "x": pos.x,
      "y": pos.y
    }

  }

  function getThird(t, v) {

    var pos = v.clone();
    pos.project(c.c2);
    pos.x = Math.round((pos.x + 1) * window.innerWidth / 2);
    pos.y = Math.round((-pos.y + 1) * window.innerHeight / 2);

    return {
      "x": pos.x,
      "y": pos.y
    }

  }

  var pFunctions = [
    getFirst,
    getSecond,
    getThird
  ];

  function ease(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };

  this.drawDot = function(x, y, r, c) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI)
    var grad = this.ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, c);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    this.ctx.fillStyle = grad;
    this.ctx.fill();
    this.ctx.closePath();
  }
  
  var flag = 0

  this.draw = function(t, tr) {
    if(flag == 0){
    this.obj.rotation.x += 0.002 * p.ro[0];
    this.obj.rotation.y += 0.002 * p.ro[1];
    this.obj.rotation.z += 0.002 * p.ro[2];
    flag = 1;
    }
    this.obj.updateMatrix();
    this.obj.geometry.applyMatrix(this.obj.matrix);
    if (this.currentPhase == this.nextPhase) {
      for (var i = 0; i < this.dots.length; i++) {
        var pos = {};
        if (this.currentPhase === 0) {
          pos = pFunctions[0](t, this.dots[i]);
        } else if (this.currentPhase === 1) {
          pos = pFunctions[1](t, this.obj.geometry.vertices[i]);
        } else if (this.currentPhase === 2) {
          pos = pFunctions[2](t, this.obj.geometry.vertices[i]);
        }
        this.dots[i].x = pos.x;
        this.dots[i].y = pos.y;
        this.drawDot(pos.x, pos.y, p.r, "black");
      }

    } else {
      //end the transition
      if (this.transitioning >= 1) {
        this.transitioning = 1;
      }
      var tr = ease(this.transitioning);
      for (var i = 0; i < this.dots.length; i++) {
        var pos1 = {};
        var pos2 = {};
        if (this.currentPhase == 0 && this.nextPhase == 1) {
          pos1 = pFunctions[0](t, this.dots[i]);
          pos2 = pFunctions[1](t, this.obj.geometry.vertices[i]);
        } else if (this.currentPhase == 0 && this.nextPhase == 2) {
          pos1 = pFunctions[0](t, this.dots[i]);
          pos2 = pFunctions[2](t, this.obj.geometry.vertices[i]);
        } else if (this.currentPhase == 1 && this.nextPhase == 0) {
          pos1 = pFunctions[1](t, this.obj.geometry.vertices[i]);
          pos2 = pFunctions[0](t, this.dots[i]);
        } else if (this.currentPhase == 1 && this.nextPhase == 2) {
          pos1 = pFunctions[1](t, this.obj.geometry.vertices[i]);
          pos2 = pFunctions[2](t, this.obj.geometry.vertices[i]);
        } else if (this.currentPhase == 2 && this.nextPhase == 0) {
          pos1 = pFunctions[2](t, this.obj.geometry.vertices[i]);
          pos2 = pFunctions[0](t, this.dots[i]);
        } else if (this.currentPhase == 2 && this.nextPhase == 1) {
          pos1 = pFunctions[2](t, this.obj.geometry.vertices[i]);
          pos2 = pFunctions[1](t, this.obj.geometry.vertices[i]);
        }
        var x = ((pos2.x - pos1.x) * tr) + pos1.x;
        var y = ((pos2.y - pos1.y) * tr) + pos1.y;
        this.dots[i].x = x;
        this.dots[i].y = y;
        this.drawDot(x, y, p.r, "black");
      }

	  // Quicken the transition
      //this.transitioning += 0.01;
      this.transitioning += 0.025;

      if (this.transitioning >= 1) {
        this.currentPhase = this.nextPhase;
        this.transitioning = 0;
      }
    }
    this.shift += 1
    this.shift = this.shift % this.edges.length;
    
    var connections = subset(this.edges,this.shift,this.subset);
    for(var edge of connections){
        var x = this.dots[edge[0]].x - this.dots[edge[1]].x;
        var y = this.dots[edge[0]].y - this.dots[edge[1]].y;
        var dist = Math.sqrt(x*x + y*y);
        if(dist < this.l * 100){
          var col = (dist / (this.l * 100));
          var m = 255;
          var colorValue = Math.round( col * m );
          this.ctx.beginPath();
          this.ctx.strokeStyle = "rgba("+ colorValue +"," + colorValue + "," + colorValue + "," + col + ")";
          this.ctx.moveTo(this.dots[edge[0]].x,this.dots[edge[0]].y);
          this.ctx.lineTo(this.dots[edge[1]].x,this.dots[edge[1]].y);
          this.ctx.stroke();
          this.ctx.closePath();
        }
    }
  }

}

function dot(g) {

  this.x = 0;
  this.y = 0;

  this.rand1 = Math.random();
  this.rand2 = g();
  this.rand3 = g();

}

var e = new env();
var t = 0;

function render() {
	//var time = Date.now() * 0.001;
  //e.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  e.ctx.clearRect(0, 0, e.c.width, e.c.height);
  
  //e.ctx.fillStyle = 'white';
  //e.ctx.fillRect(0, 0, e.c.width, e.c.height);
  
  // Faster than clearRect and fillRect
  //e.c.width = e.c.width;	
    
  e.animate(t);
  t += 0.002;
  
  //console.log(t);
  //var tt = t%.2;
  //if (tt==0) e.switch(1);
  
  requestAnimationFrame(render);
}
render();

        window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {
                e.c.width = window.innerWidth;
                e.c.height = window.innerHeight;
				e.camera1.aspect = window.innerWidth / window.innerHeight;
				e.camera2.aspect = window.innerWidth / window.innerHeight;
				e.camera1.updateProjectionMatrix();
				e.camera2.updateProjectionMatrix();
				e.renderer.setSize( window.innerWidth, window.innerHeight );
				e.renderer2.setSize( window.innerWidth, window.innerHeight );
				
				if (window.innerWidth<760) {
					e.camera1.position.z = 80;
					e.camera2.position.z = 190;
				} else {
					e.camera1.position.z = 65;
					e.camera2.position.z = 150;
				}
        }
			
	
	/****** Added by Army Chiu  ******/
    /*scrollToSlide();

    function scrollToSlide() {
	   switch(currSlide) {
			case 0:
				document.getElementById('scrollTo1').click();
				//e.switch(1);
				//currSlide = 1;				
				break;
			case 1:
				document.getElementById('scrollTo2').click();
				//e.switch(2);
				//currSlide = 2;				
				break;			
			case 2:
				document.getElementById('scrollTo0').click();
				//e.switch(0);
				//currSlide = 0;				
				break;
			default:
				currSlide = 0;
		}
		setTimeout(scrollToSlide, 6500);
		//setTimeout(scrollToSlide, 4000);
    }*/

	setInterval(function () {
	   switch(currSlide) {
			case 0:
				document.getElementById('scrollTo1').click();
				break;
			case 1:
				document.getElementById('scrollTo2').click();
				break;			
			case 2:
				document.getElementById('scrollTo0').click();
				break;
			default:
				currSlide = 0;
		}		
	}, 6500); 
	
/*	function removeTFX() {
		t1[0].classList.remove("t1-FX");
		t2[0].classList.remove("t2-FX");
		t3[0].classList.remove("t3-FX");				
	}*/
	
	function scrollBody(t) {
		if( t.length ) {
			$('html, body').stop().animate({
				scrollTop: t.offset().top
			}, 1000);
		}
	}	
	
	$("#scrollTo1").click(function(event) {
		event.preventDefault();
		//removeTFX();
		//t2[0].classList.add("t2-FX");		
		scrollBody($(this.getAttribute('href')));
		e.switch(1);
		currSlide = 1;						
	});	
	$("#scrollTo2").click(function(event) {
		event.preventDefault();
		//removeTFX();
		//t3[0].classList.add("t3-FX");
		scrollBody($(this.getAttribute('href')));		
		e.switch(2);
		currSlide = 2;						
	});	
	$("#scrollTo0").click(function(event) {
		event.preventDefault();
		//removeTFX();
		//t1[0].classList.add("t1-FX");
		scrollBody($(this.getAttribute('href')));		
		e.switch(0);
		currSlide = 0;				
	});	


			
			
}]);

