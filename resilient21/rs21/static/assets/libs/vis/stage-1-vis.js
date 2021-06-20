console.log("TESTIIIING")
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

document.addEventListener("DOMContentLoaded", function() {
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
	var logoPoints = [[0,3], [1,2], [2,3], [3,2], [4,3], [5,2], [4,1], [5,0], [6,1], [7,2], [6,3], [8,3], [7,4], [9,4], [8,5], [10,5]];
	var logoScale = d3.scaleLinear()
		.domain([0, width])
		.range([0, d3.max(logoPoints.map(function(point){
			return d3.max(point);
		}))]);

	// DOT SET UP ****************************************

	var dots = [];
	var numDots = null;
	var radius = 5;
	var spread = 20;

	var lineDistanceScale = d3.scaleLinear()
		.domain([0, 1920])
		.range([40, 200]);
	var sineLineDistanceScale = d3.scaleLinear()
		.domain([0, 1920])
		.range([20, 100]);
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
		numDots = Math.floor(.4 * ((height < width) ? (height / 2) : (width / 2)));

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
				if (stepNum === 1) {
					d.direction = d.direction + ((Math.random() * .1) - 0.05);
					d.x = d.x + Math.cos(d.direction) * d.speed;
					d.y = d.y + Math.sin(d.direction) * d.speed;
				} else if (stepNum === 2) {
					d.x = xScale(i);
					d.y = (height / 2) + ((d.radius * spread) - (spread / 2)) - (Math.sin((time * 0.0001) + d.x * 0.01) * (height / 4));
					d.sineZ = Math.sin(time * 0.0001 + d.x * 0.01);
				} else if (stepNum === 3) {
					d.x = width / 2;
					d.y = height / 2;
				}

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
			if (stepNum === 1) {
				gradient.addColorStop(0, 'rgba(34, 34, 34, ' + d.z + ')');
				gradient.addColorStop((d.z + blurStop) > 1 ? 1 : (d.z + blurStop), 'rgba(34, 34, 34, ' + d.z + ')');
				gradient.addColorStop(1, 'transparent');
			} else if (stepNum === 2) {
				var rgbColor = rgbToArray(colorRampWidth(d.x));
				// gradient.addColorStop(0, colorRampNumDots(i));
				// gradient.addColorStop(sineScale((d.sineZ + blurStop) > 1 ? 1 : (d.sineZ + blurStop)), colorRampNumDots(i));
				// gradient.addColorStop(1, 'transparent');
				gradient.addColorStop(0, colorRampWidth(d.x));
				gradient.addColorStop(sineScale((d.sineZ + blurStop) > 1 ? 1 : (d.sineZ + blurStop)), "rgba(" + rgbColor[0] + ", " + rgbColor[1] + ", " + rgbColor[2] + ", " + d.sineZ + ")");
				gradient.addColorStop(1, 'transparent');
			}
			context.fillStyle = gradient;
			context.fill();
			context.closePath();

			// LINES
			dots.forEach(function(dot) {
				var distance = Math.sqrt(((d.x - dot.x) * (d.x - dot.x)) + ((d.y - dot.y) * (d.y - dot.y)));
				var zRange = 0.1;
				var drawLine = false;
				if (stepNum === 1) {
					var zRange = 0.1;
					if ((d.z > (dot.z - (zRange))) && (d.z < (dot.z + (zRange)))) {
						drawLine = true;
					}
				} else if (stepNum === 2) {
					// var zRange = 0.15;
					// if ((sineScale(d.sineZ) > (sineScale(dot.sineZ) - (zRange))) && (sineScale(d.sineZ) < (sineScale(dot.sineZ) + (zRange)))) {
					// 	drawLine = true;
					// }
					var sineDistance = 100;
					if (distance < sineDistance) {
						drawLine = true;
					}
				}

				if (drawLine && distance < lineDistance) {
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

			var mouseDistance = Math.sqrt(((d.x - mousePos.x) * (d.x - mousePos.x)) + ((d.y - mousePos.y) * (d.y - mousePos.y)));
			if (mouseDistance < 150) {
				context.beginPath();
				context.moveTo(mousePos.x, mousePos.y);
				context.lineTo(d.x, d.y);
				context.strokeStyle = colorRampLines(mouseDistance);
				// context.strokeStyle = lineColor;
				if (stepNum === 2) {
					context.strokeStyle = colorRampWidth(d.x);
					// gradient.addColorStop(sineScale((d.sineZ) > 1 ? 1 : (d.sineZ)), "rgba(" + rgbColor[0] + ", " + rgbColor[1] + ", " + rgbColor[2] + ", " + d.sineZ + ")");
				}
				context.stroke();
				context.closePath();
			}
		});
		window.requestAnimationFrame(step);
	}
	window.requestAnimationFrame(step);

	// ON RESIZE ****************************************
	window.onresize = initialize;
});
