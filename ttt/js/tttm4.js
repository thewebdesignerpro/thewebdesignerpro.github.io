/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

	var cSpeed=1;
	var cTotalFrames=21;
	var liId = document.getElementById('loaderImage');
	var cFrameWidth;
		if (window.innerWidth>1280) {
			cFrameWidth = 640;
		} else {
			cFrameWidth = 320;
		}

	var cImageSrc='js/imj/lsprite.png';
	var cImageTimeout=false;
	var cIndex=0;
	var cXpos=0;
	var SECONDS_BETWEEN_FRAMES=0;
	var myVar;
	
	function startAnimation(){
		
		liId.style.backgroundImage='url('+cImageSrc+')';

		var FPS = Math.round(100/cSpeed);
		SECONDS_BETWEEN_FRAMES = 1 / FPS;
		
		myVar = setTimeout('continueAnimation()', SECONDS_BETWEEN_FRAMES/1000);
		
	}
	
	function continueAnimation(){

		if (window.innerWidth>1280) {
			cFrameWidth = 640;
		} else {
			cFrameWidth = 320;
		}
		
		liId.style.backgroundPosition=(-cXpos)+'px 0';
		
		myVar = setTimeout('continueAnimation()', SECONDS_BETWEEN_FRAMES*1000);
	}
	
	function imageLoader(s, fun){
		clearTimeout(cImageTimeout);
		cImageTimeout=0;
		var genImage = new Image();
		genImage.onload=function (){cImageTimeout=setTimeout(fun, 0)};
		//genImage.onerror=new Function('alert(\'Could not load the image\')');
		genImage.src=s;
	}
	
	//The following code starts the animation
	new imageLoader(cImageSrc, 'startAnimation()');
	
	
	var cSpeed2=20;
	var cTotalFrames2=20;
	var cFrameWidth2=300;
	var liId2 = document.getElementById('loaderImage2');
	var cImageSrc2='js/imj/lsprite4.png';
	
	var cImageTimeout2=false;
	var cIndex2=0;
	var cXpos2=0;
	var SECONDS_BETWEEN_FRAMES2=0;
	var myVar2;
	
	function startAnimation2(){
		
		liId2.style.backgroundImage='url('+cImageSrc2+')';

		var FPS = Math.round(100/cSpeed2);
		SECONDS_BETWEEN_FRAMES2 = 1 / FPS;
		
		//myVar2 = setTimeout('continueAnimation2()', SECONDS_BETWEEN_FRAMES2/1000);
		
	}
	
	function continueAnimation2(){
		cXpos2 += cFrameWidth2;

		cIndex2 += 1;
		 
		if (cIndex2 >= cTotalFrames2) {
			cXpos2 =0;
			cIndex2=0;
			//clearTimeout(myVar);
		}
		
		liId2.style.backgroundPosition=(-cXpos2)+'px 0';
		
		myVar2 = setTimeout('continueAnimation2()', SECONDS_BETWEEN_FRAMES2*1000);

	}
	
	function imageLoader2(s, fun) {
		clearTimeout(cImageTimeout2);
		cImageTimeout2=0;
		var genImage2 = new Image();
		genImage2.onload=function (){cImageTimeout2=setTimeout(fun, 0)};
		//genImage2.onerror=new Function('alert(\'Could not load the image\')');
		genImage2.src=s;
	}
	
	new imageLoader2(cImageSrc2, 'startAnimation2()');
	

function overLyStop() {
	if (allL) {
		clearTimeout(myVar2);
		$('#overLy').fadeOut(5000, function() {
			$('.player-play').trigger('click', function(e) {e.preventDefault();});
		});
		cXpos2 =0;
		cIndex2=0;
		//console.log('lws');		
	}
}

audioCtx = new AudioContext();

if (window.location.hash) {
      var hash2;
      hash2 = window.location.hash.slice(1);
//	  console.log('hash2'+hash2);
      if (hash2) {
	  	  //console.log(hash);
//		  if (allL) {
			var zyx = parseInt(hash2, 10);
//			console.log('zyx'+zyx);
			switch(zyx) {
				case 1:
					loadAudioBuffer("tttrakz/br128/TTT01SilentEarthling.mp3", 1);	  
					break;
				case 2:
					loadAudioBuffer("tttrakz/br128/TTT02Strebek.mp3", 2);	  
					break;
				case 3:
					loadAudioBuffer("tttrakz/br128/TTT03Kraken.mp3", 3);		  
					break;
				case 4:
					loadAudioBuffer("tttrakz/br128/TTT04Blimp.mp3", 4);
					break;					
				case 5:
					loadAudioBuffer("tttrakz/br128/TTT05Engrams.mp3", 5);
					break;					
				case 6:
					loadAudioBuffer("tttrakz/br128/TTT06Tekkers.mp3", 6);
					break;										
				case 7:
					loadAudioBuffer("tttrakz/br128/TTT07Hemisphere.mp3", 7);
					break;										
				case 8:
					loadAudioBuffer("tttrakz/br128/TTT08RainbowRoad.mp3", 8);
					break;										
				case 9:
					loadAudioBuffer("tttrakz/br128/TTT09Elsewhere.mp3", 9);
					break;															
				default:
			}
      }
} else {
	loadAudioBuffer("tttrakz/br128/TTT01SilentEarthling.mp3", 1);
}

function loadAudioBuffer(url, xyz) {
	// Load asynchronously
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
		audioCtx.decodeAudioData(request.response, function(buffer) {
			switch(xyz) {
				case 1:
					adBuff = buffer;
					//finishLoad(adBuff);
					if (!trak1B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff);
						} else {
							//buffAudio = new BuffAudio(audioCtx, adBuff);
							finLoad(adBuff);
						}	
						//sourceb = true;
						//mcount = 1;
						trak1B = true;						
					}
					//gainNode2.gain.value = 0;
					break;
				case 2:
					adBuff2 = buffer;
					if (!trak2B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff2);
						} else {
							//buffAudio = new BuffAudio(audioCtx, adBuff2);
							finLoad(adBuff2);
						}	
						//sourceb = true;
						//mcount = 1;
						trak2B = true;						
					}
					break;
				case 3:
					adBuff3 = buffer;
					if (!trak3B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff3);
						} else {
							//buffAudio = new BuffAudio(audioCtx, adBuff3);
							finLoad(adBuff3);
						}	
						//sourceb = true;
						//mcount = 1;
						trak3B = true;						
					}
					break;				
				case 4:
					adBuff4 = buffer;
					if (!trak4B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff4);
						} else {
							//buffAudio = new BuffAudio(audioCtx, adBuff4);
							finLoad(adBuff4);
						}	
						//sourceb = true;
						//mcount = 1;
						trak4B = true;
					}
					break;
				case 5:
					adBuff5 = buffer;
					if (!trak5B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff5);
						} else {
							//buffAudio = new BuffAudio(audioCtx, adBuff5);
							finLoad(adBuff5);
						}	
						//sourceb = true;
						//mcount = 1;
						trak5B = true;
					}
					break;					
				case 6:
					adBuff6 = buffer;
					if (!trak6B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff6);
						} else {
							finLoad(adBuff6);
						}	
						trak6B = true;
					}
					break;										
				case 7:
					adBuff7 = buffer;
					if (!trak7B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff7);
						} else {
							finLoad(adBuff7);
						}	
						trak7B = true;
					}
					break;										
				case 8:
					adBuff8 = buffer;
					if (!trak8B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff8);
						} else {
							finLoad(adBuff8);
						}	
						trak8B = true;
					}
					break;										
				case 9:
					adBuff9 = buffer;
					if (!trak9B) {
						if (allL) {
							buffAudio.initNewBuffer(adBuff9);
						} else {
							finLoad(adBuff9);
						}	
						trak9B = true;
					}
					break;															
				default:

			}
			overLyStop();
			
			//cXpos = cFrameWidth*19;
			//cIndex = 19;
			if (cIndex < cTotalFrames-1) {
				cXpos += cFrameWidth;
				cIndex += 1;
//				console.log('% '+percentComplete);
			}					
			
		}, function(e) {
			console.log(e);
		});

		cXpos += cFrameWidth;
		cIndex += 1;
	};	//onload
	
	request.send();
}

function finLoad(aB) {

	//source.buffer = adBuff;
	//buffAudio = new BuffAudio(audioCtx, adBuff);
	buffAudio = new BuffAudio(audioCtx, aB);
	sourceb = true;
	mcount = 1;
	//source.loop = true;
	//source.loop = false;
	//SEEK
	//source.start(0.0);
	//gainNode2.gain.value = 0;

//	startViz();
	//console.log('finishload');
}

