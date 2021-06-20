app.controller("HomeControl", ["$rootScope", "$scope", "$timeout", "$document", "smoothScroll", function($rootScope, $scope, $timeout, $document, smoothScroll){

	var t1 = document.getElementsByClassName("t1"),
		t2 = document.getElementsByClassName("t2"),
		t3 = document.getElementsByClassName("t3"),
		// b1 = document.getElementsByClassName("b1"),
		action = document.getElementById("call-to-action"), 
		currSlide = -1, inited = false;

	var sections = document.getElementsByClassName("slide");

	var heightI = (document.documentElement && document.documentElement.scrollTop) ||
			  document.body.scrollTop;

	var t4 = document.getElementsByClassName("nav-links-action");

	if(heightI <=1){
		t1[0].classList.add("t1-FX");
		//t1[0].classList.add("fade-1");
		// b1[0].classList.add("bold-1");
	}
	
	window.addEventListener('scroll', function() {
		if (t1[0] != undefined && t2[0] != undefined && t3[0] != undefined && sections[0] != undefined && heightI != undefined && t4[0] != undefined) {
			var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			var currentHeight = (document.documentElement && document.documentElement.scrollTop) ||
				  document.body.scrollTop;

			if(currentHeight <=1){
				t1[0].classList.add("t1-FX");
				t2[0].classList.remove("t2-FX");
				t3[0].classList.remove("t3-FX");
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
				t2[0].classList.add("t2-FX");
				t1[0].classList.remove("t1-FX");
				t3[0].classList.remove("t3-FX");
				//t2[0].classList.add("fade-1");
				// b1[1].classList.add("bold-1");
				// $timeout.cancel($scope.animTimeout);
				// $scope.anim.setSlide(2);
				// $scope.animTimeout = $timeout(function() {$scope.anim.setSlide(3);}, 1000);
			}
			if (currentHeight >= (screenHeight/1.2 * 3) - screenHeight) {
				t3[0].classList.add("t3-FX");
				t1[0].classList.remove("t1-FX");
				t2[0].classList.remove("t2-FX");
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



	// TEMPORARY VISUALIZATION START:
	// WARNING: UUUUUUGLY CODE AHEAD

	// D3 Vis start
	/*
	$scope.visInitialized = false;

	if (!$scope.visInitialized) {
		$scope.visInitialized = true;
		// console.log("TESTIIIING")
		// LERP SET UP ****************************************
		var lerping = false;
		var lerpTime = 0.1;
		var lerpWaitTime = 1000;

		function lerp(a, b, t) {
			a.x = a.x + t * (b.x - a.x);
			a.y = a.y + t * (b.y - a.y);
			return a;
		}

		// STEP SET UP ****************************************
		var stepNum = 1;
		var maxSteps = 2;

		function changeStep(step) {
			if (step) {
				if (stepNum + 1 <= maxSteps) {
					stepNum++;
				} else {
					stepNum = 1;
				}
			} else {
				if (stepNum - 1 >= 1) {
					stepNum--;
				} else {
					stepNum = maxSteps;
				}
			}

			lerping = true;
			window.clearInterval(lerpTimeout);
			var lerpTimeout = window.setTimeout(function() {lerping = false}, lerpWaitTime);
		}

		// document.addEventListener("DOMContentLoaded", function() {
			// CANVAS SET UP ****************************************
			var output = d3.select("#rs21Vis");
			var width = window.innerWidth;
			var height = window.innerHeight;

			output.attr("width", width)
				.attr("height", height);
			var context = output.node().getContext("2d");

			function getMousePos(event) {
				return {
					x: event.clientX,
					y: event.clientY
				};
			}
			window.addEventListener('mousemove', function(event) {
				mousePos = getMousePos(event);
			}, false);
			var mousePos = {x: -1000, y: -1000};

			// output.node().addEventListener('mousedown', function(event) {
			// 	var randRadius = Math.random() * radius;
			// 	dots.push({
			// 		x: getMousePos(event).x,
			// 		y: getMousePos(event).y,
			// 		radius: randRadius,
			// 		direction: (Math.random() * (Math.PI * 2)),
			// 		speed: randRadius * 0.5
			// 	});
			// }, false);

			// LOGO POINTS SET UP ****************************************
			// var logoPoints = [[0,3], [1,2], [2,3], [3,2], [4,3], [5,2], [4,1], [5,0], [6,1], [7,2], [6,3], [8,3], [7,4], [9,4], [8,5], [10,5]];
			// var logoScale = d3.scaleLinear()
			// 	.domain([0, width])
			// 	.range([0, d3.max(logoPoints.map(function(point){
			// 		return d3.max(point);
			// 	}))]);

			// DOT SET UP ****************************************

			var dots = [];
			var numDots = null;
			var radius = 5;
			var spread = 20;

			var lineDistanceScale = d3.scaleLinear()
				.domain([1000, 1920])
				.range([200, 250]);
			// var sineLineDistanceScale = d3.scaleLinear()
			// 	.domain([0, 1920])
			// 	.range([20, 100]);
			var lineDistance = lineDistanceScale(width);
			var lineColor = "rgba(51,51,51,0.2)";

			var sineScale = d3.scaleLinear()
				.domain([-1, 1])
				.range([0, 1]);

			function rgbToArray(color) {
				var colorArr = [];

				colorArr = color.split(",");
				colorArr[0] = colorArr[0].substr(4, colorArr[0].length);
				colorArr[2] = colorArr[2].substr(0, colorArr[2].length - 1);

				return colorArr;
			}

			// var xScale = d3.scaleLinear()
			// 	.domain([0, numDots])
			// 	.range([0, width]);
			// var yScale = d3.scaleLinear()
			// 	.domain([0, numDots])
			// 	.range([0, height]);

			// var colorRampNumDots = d3.scaleLinear()
			// 	.domain([0, (numDots / 13) * 1, (numDots / 13) * 2, (numDots / 13) * 3, (numDots / 13) * 4, (numDots / 13) * 5, (numDots / 13) * 6, (numDots / 13) * 7, (numDots / 13) * 8, (numDots / 13) * 9, (numDots / 13) * 10, (numDots / 13) * 11, numDots])
			// 	.range(["#d7df23", "#8dc63f", "#009444", "#00a79d", "#27aae1", "#1c75bc", "#27aae1", "#fbb040", "#f7941e", "#f15a29", "#ef4136", "#be1e2d" ,"#ec008c"]);
			// var colorRampWidth = d3.scaleLinear()
			// 	.domain([0, (width / 13) * 1, (width / 13) * 2, (width / 13) * 3, (width / 13) * 4, (width / 13) * 5, (width / 13) * 6, (width / 13) * 7, (width / 13) * 8, (width / 13) * 9, (width / 13) * 10, (width / 13) * 11, width])
			// 	.range(["#d7df23", "#8dc63f", "#009444", "#00a79d", "#27aae1", "#1c75bc", "#27aae1", "#fbb040", "#f7941e", "#f15a29", "#ef4136", "#be1e2d" ,"#ec008c"]);

			// var colorRampLines = d3.scaleLinear()
			// 	.domain([0, lineDistance])
			// 	.range(["rgba(51,51,51,0.5)", "rgba(51,51,51,0)"]);

			function initialize() {
				width = window.innerWidth;
				height = window.innerHeight;
				output.attr("width", width)
					.attr("height", height);

				dots = [];
				dotPositionsStep1 = [];
				dotPositionsStep2 = [];
				numDots = Math.floor(.2 * ((height < width) ? (height / 2) : (width / 2)));

				lineDistance = lineDistanceScale(width);

				xScale = d3.scaleLinear()
					.domain([0, numDots])
					.range([0, width]);
				yScale = d3.scaleLinear()
					.domain([0, numDots])
					.range([0, height]);

				colorRampNumDots = d3.scaleLinear()
					.domain([0, (numDots / 13) * 1, (numDots / 13) * 2, (numDots / 13) * 3, (numDots / 13) * 4, (numDots / 13) * 5, (numDots / 13) * 6, (numDots / 13) * 7, (numDots / 13) * 8, (numDots / 13) * 9, (numDots / 13) * 10, (numDots / 13) * 11, numDots])
					.range(["#d7df23", "#8dc63f", "#009444", "#00a79d", "#27aae1", "#1c75bc", "#27aae1", "#fbb040", "#f7941e", "#f15a29", "#ef4136", "#be1e2d" ,"#ec008c"]);
				colorRampWidth = d3.scaleLinear()
					.domain([0, (width / 13) * 1, (width / 13) * 2, (width / 13) * 3, (width / 13) * 4, (width / 13) * 5, (width / 13) * 6, (width / 13) * 7, (width / 13) * 8, (width / 13) * 9, (width / 13) * 10, (width / 13) * 11, width])
					.range(["#d7df23", "#8dc63f", "#009444", "#00a79d", "#27aae1", "#1c75bc", "#27aae1", "#fbb040", "#f7941e", "#f15a29", "#ef4136", "#be1e2d" ,"#ec008c"]);

				colorRampLines = d3.scaleLinear()
					.domain([0, lineDistance])
					.range(["rgba(51,51,51,0.5)", "rgba(51,51,51,0)"]);

				var zScale = d3.scaleLinear()
					.domain([0, radius])
					.range([1, 0]);

				for (var i = 0; i < numDots; i++) {
					var randRadius = (Math.random() * (radius - 1)) + 1;
					dots.push({
						x: xScale(i),
						y: (Math.random() * height),
						z: zScale(Math.random() * randRadius),
						sineZ: 0,
						radius: randRadius,
						direction: (Math.random() * (Math.PI * 2)),
						speed: randRadius * 0.05
					});

					dotPositionsStep1.push({x: dots[i].x, y: dots[i].y});
				}
			}
			initialize();

			var styles = [
				{
					radiusScale: 1
				},
				{
					radiusScale: 2
				},
				{
					radiusScale: 0
				}
			];

			// DRAWING ****************************************

			function step(time) {
				if (stepNum === 2 && lerping) {
					dotPositionsStep2 = [];
					for (var i = 0; i < numDots; i++) {
						dotPositionsStep2.push({
							x: xScale(i),
							y: (height / 2) + ((dots[i].radius * spread) - (spread / 2)) - (Math.sin((time * 0.0001) + dots[i].x * 0.01) * (height / 4))
						});
					}
				}

				context.clearRect(0,0,width,height); // Clear canvas

				dots.forEach(function(d, i) {
					if (lerping) {
						if (stepNum === 1) {
							d = lerp(d, dotPositionsStep1[i], lerpTime);
						} else if (stepNum === 2) {
							d = lerp(d, dotPositionsStep2[i], lerpTime);
						}
					} else {
						// if (stepNum === 1) {
							d.direction = d.direction + ((Math.random() * .1) - 0.05);
							d.x = d.x + Math.cos(d.direction) * d.speed;
							d.y = d.y + Math.sin(d.direction) * d.speed;
						// } else if (stepNum === 2) {
						// 	d.x = xScale(i);
						// 	d.y = (height / 2) + ((d.radius * spread) - (spread / 2)) - (Math.sin((time * 0.0001) + d.x * 0.01) * (height / 4));
						// 	d.sineZ = Math.sin(time * 0.0001 + d.x * 0.01);
						// } else if (stepNum === 3) {
						// 	d.x = width / 2;
						// 	d.y = height / 2;
						// }

						if (d.x > (width + d.radius)) {
							d.x = 0 - d.radius;
						}
						if (d.x < (0 - d.radius)) {
							d.x = width + d.radius;
						}
						if (d.y > (height + d.radius)) {
							d.y = 0 - d.radius;
						}
						if (d.y < (0 - d.radius)) {
							d.y = height + d.radius;
						}
					}

					context.beginPath();
					context.arc(d.x, d.y, d.radius * styles[stepNum - 1].radiusScale, 0, 2 * Math.PI, false);
					var blurStop = 0;
					gradient = context.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
					// if (stepNum === 1) {
						gradient.addColorStop(0, 'rgba(34, 34, 34, ' + d.z + ')');
						gradient.addColorStop((d.z + blurStop) > 1 ? 1 : (d.z + blurStop), 'rgba(34, 34, 34, ' + d.z + ')');
						gradient.addColorStop(1, 'transparent');
					// } else if (stepNum === 2) {
					// 	var rgbColor = rgbToArray(colorRampWidth(d.x));
					// 	// gradient.addColorStop(0, colorRampNumDots(i));
					// 	// gradient.addColorStop(sineScale((d.sineZ + blurStop) > 1 ? 1 : (d.sineZ + blurStop)), colorRampNumDots(i));
					// 	// gradient.addColorStop(1, 'transparent');
					// 	gradient.addColorStop(0, colorRampWidth(d.x));
					// 	gradient.addColorStop(sineScale((d.sineZ + blurStop) > 1 ? 1 : (d.sineZ + blurStop)), "rgba(" + rgbColor[0] + ", " + rgbColor[1] + ", " + rgbColor[2] + ", " + d.sineZ + ")");
					// 	gradient.addColorStop(1, 'transparent');
					// }
					context.fillStyle = gradient;
					context.fill();
					context.closePath();

					// LINES
					dots.forEach(function(dot) {
						// var distance = Math.sqrt(((d.x - dot.x) * (d.x - dot.x)) + ((d.y - dot.y) * (d.y - dot.y)));
						var zRange = 0.1;
						var drawLine = false;
						// if (stepNum === 1) {
							var zRange = 0.1;
							if ((d.z > (dot.z - (zRange))) && (d.z < (dot.z + (zRange)))) {
								drawLine = true;
							}
						// } else if (stepNum === 2) {
						// 	// var zRange = 0.15;
						// 	// if ((sineScale(d.sineZ) > (sineScale(dot.sineZ) - (zRange))) && (sineScale(d.sineZ) < (sineScale(dot.sineZ) + (zRange)))) {
						// 	// 	drawLine = true;
						// 	// }
						// 	var sineDistance = 100;
						// 	if (distance < sineDistance) {
						// 		drawLine = true;
						// 	}
						// }

						var xDiff, yDiff, distance;
						if (drawLine && ((xDiff = Math.abs(d.x - dot.x)) < lineDistance) && ((yDiff = Math.abs(d.y - dot.y)) < lineDistance)) {
								distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
								context.beginPath();
								context.moveTo(dot.x, dot.y);
								context.lineTo(d.x, d.y);
								// var lineColor = rgbaToArray(colorRampLines(distance));
								// context.strokeStyle = "rgba(" + lineColor[0] + ", " + lineColor[1] + ", " + lineColor[2] + ", " + d.z + lineColor[3] > 1 ? 1 : d.z + lineColor[3] + ")";
								context.strokeStyle = colorRampLines(distance);
								if (stepNum === 2) {
									context.strokeStyle = colorRampWidth(d.x);
								}
								context.stroke();
								context.closePath();
							}
					});

					// var mouseDistance = Math.sqrt(((d.x - mousePos.x) * (d.x - mousePos.x)) + ((d.y - mousePos.y) * (d.y - mousePos.y)));
					var xDiff, yDiff, mouseDistance;
					if (((xDiff = Math.abs(d.x - mousePos.x)) < lineDistance) && ((yDiff = Math.abs(d.y - mousePos.y)) < lineDistance)) {
						mouseDistance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
						context.beginPath();
						context.moveTo(mousePos.x, mousePos.y);
						context.lineTo(d.x, d.y);
						context.strokeStyle = colorRampLines(mouseDistance);
						// context.strokeStyle = lineColor;
						// if (stepNum === 2) {
						// 	context.strokeStyle = colorRampWidth(d.x);
						// 	// gradient.addColorStop(sineScale((d.sineZ) > 1 ? 1 : (d.sineZ)), "rgba(" + rgbColor[0] + ", " + rgbColor[1] + ", " + rgbColor[2] + ", " + d.sineZ + ")");
						// }
						context.stroke();
						context.closePath();
					}
				});
				window.requestAnimationFrame(step);
			}
			window.requestAnimationFrame(step);

			// ON RESIZE ****************************************
			window.onresize = initialize;
		// });
		}
	*/
	// D3 Vis end
	
	
	/****** Added by Army Chiu  ******/
    scrollToSlide();

    function scrollToSlide() {
       setTimeout(scrollToSlide, 9000);
	   
	   switch(currSlide) {
			case 0:
				document.getElementById('scrollTo1').click();
				currSlide = 1;
				break;
			case 1:
				document.getElementById('scrollTo2').click();
				currSlide = 2;
				break;			
			case 2:
				document.getElementById('scrollTo0').click();
				currSlide = 0;
				break;
			default:
				currSlide = 0;
		}
    }


	// WebGL code
			var group;
			var kontainer;
			var particlesData = [];
			var camera, scene, renderer;
			var positions, colors;
			var particles;
			var pointCloud;
			var particlePositions;
			var linesMesh;

			var maxParticleCount = 500;
			var particleCount = 200;
			//var r = (window.innerWidth + window.innerHeight)/2;
			var r = 1500;
			if (window.innerWidth > window.innerHeight) {
				r = window.innerWidth * .92;
			} else {
				r = window.innerHeight * .92;
			}
			var rHalf = r / 2;

			var effectController = {
				showDots: true,
				showLines: true,
				minDistance: 200,
				limitConnections: true,
				maxConnections: 60,
				particleCount: 200
			};


			function init3() {

				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, .1, 5000 );
				camera.position.z = 1280;

				scene = new THREE.Scene();


				group = new THREE.Group();
				scene.add( group );



				var segments = maxParticleCount * maxParticleCount;

				positions = new Float32Array( segments * 3 );
				colors = new Float32Array( segments * 3 );

				var pMaterial = new THREE.PointsMaterial( {
					color: 0x676767,
					size: 3,
					blending: THREE.AdditiveBlending,
					transparent: true,
					sizeAttenuation: false
				} );

				particles = new THREE.BufferGeometry();
				particlePositions = new Float32Array( maxParticleCount * 3 );

				for ( var i = 0; i < maxParticleCount; i++ ) {

					var x = Math.random() * r - r / 2;
					var y = Math.random() * r - r / 2;
					var z = Math.random() * r - r / 2;

					particlePositions[ i * 3     ] = x;
					particlePositions[ i * 3 + 1 ] = y;
					particlePositions[ i * 3 + 2 ] = z;

					// add it to the geometry
					particlesData.push( {
						velocity: new THREE.Vector3( -1 + Math.random() * 2, -1 + Math.random() * 2,  -1 + Math.random() * 2 ),
						numConnections: 0
					} );

				}

				particles.setDrawRange( 0, particleCount );
				particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) );

				// create the particle system
				pointCloud = new THREE.Points( particles, pMaterial );
				group.add( pointCloud );

				var geometry = new THREE.BufferGeometry();

				geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) );
				geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) );

				geometry.computeBoundingSphere();

				geometry.setDrawRange( 0, 0 );

				var material = new THREE.LineBasicMaterial( {
					color: 0x999999, 
					//vertexColors: THREE.VertexColors,
					blending: THREE.AdditiveBlending,
					transparent: true
				} );

				linesMesh = new THREE.LineSegments( geometry, material );
				group.add( linesMesh );

				//

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor(0xffffff, 0);

				renderer.gammaInput = true;
				renderer.gammaOutput = true;

				kontainer = document.getElementById( 'kontainer' );
				kontainer.appendChild( renderer.domElement );
				//console.log('appended');
				//

				window.addEventListener( 'resize', onWindowResize, false );

				animate();
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				var vertexpos = 0;
				var colorpos = 0;
				var numConnected = 0;

				for ( var i = 0; i < particleCount; i++ )
					particlesData[ i ].numConnections = 0;

				for ( var i = 0; i < particleCount; i++ ) {

					// get the particle
					var particleData = particlesData[i];

					particlePositions[ i * 3     ] += particleData.velocity.x;
					particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
					particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

					if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
						particleData.velocity.y = -particleData.velocity.y;

					if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
						particleData.velocity.x = -particleData.velocity.x;

					if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
						particleData.velocity.z = -particleData.velocity.z;

					if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
						continue;

					// Check collision
					for ( var j = i + 1; j < particleCount; j++ ) {

						var particleDataB = particlesData[ j ];
						if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
							continue;

						var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
						var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
						var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
						var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

						if ( dist < effectController.minDistance ) {

							particleData.numConnections++;
							particleDataB.numConnections++;

							var alpha = 1.0 - dist / effectController.minDistance;

							positions[ vertexpos++ ] = particlePositions[ i * 3     ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ i * 3 + 2 ];

							positions[ vertexpos++ ] = particlePositions[ j * 3     ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 1 ];
							positions[ vertexpos++ ] = particlePositions[ j * 3 + 2 ];

							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;

							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;
							colors[ colorpos++ ] = alpha;

							numConnected++;
						}
					}
				}


				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;

				pointCloud.geometry.attributes.position.needsUpdate = true;

				requestAnimationFrame( animate );

				render();

			}

			function render() {

				var time = Date.now() * 0.001;

				group.rotation.y = time * 0.1;
				renderer.render( scene, camera );

			}	

	/*if (window.addEventListener) {
		window.addEventListener("load", init, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", init);
	} else {
		window.onload = init;
	}*/	

	$(document).ready(function() {
		init3();
	});	


	
			
			
}]);

