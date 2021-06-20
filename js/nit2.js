/* Author: Armstrong Chiu
   URL: https://thewebdesignerpro.com/     */

function onWindowResize( event ) {
	ww = window.innerWidth;
    wh = window.innerHeight,
	wwh = ww/2, whh = wh/2;	
	
	renderer.setSize( ww, wh );
	camera.aspect = ww / wh;
	camera.updateProjectionMatrix();
	
	document.body.style.width = cntnr.style.width = ww+'px';
	document.body.style.height = cntnr.style.height = wh+'px';	

	if (ww > wh) {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((ww+wh)/2)*0.022+'px';
	} else {
		cntnt.style.fontSize = cntnt2.style.fontSize = ((ww+wh)/2)*0.028+'px';
	}
}
window.addEventListener( 'resize', onWindowResize, false );			

function fadeOff(a){
	a.style.opacity = 1;
	(function fade() {
		if ((a.style.opacity -= .08) < 0) {
			a.style.opacity = 0;
			a.style.display = 'none';
		} else {
			requestAnimationFrame(fade);
		}
	})();
}
	
function fadeOn(a) {
	a.style.opacity = 0;
	a.style.display = 'block';
	(function fade() {
		var val = parseFloat(a.style.opacity);
		if (!((val += .04) > 1)) {
			a.style.opacity = val;
			requestAnimationFrame(fade);
		} else {
			a.style.opacity = 1;
		}
	})();
}

nv.addEventListener('click', function(e) {
	if (navOn) {
		fadeOff(nvo);
		navOn = false;
	} else {
		fadeOn(nvo);
		navOn = true;
	}
	e.preventDefault();
});

function loadCon(url, bx) {
	var root = "/";

	if	(url != root) {
		var xhr = new XMLHttpRequest();
		if (bx=='s') {
			xhr.open("GET", "//thewebdesignerpro.com/services.txt", true);
			//xhr.responseType = "document";
			xhr.setRequestHeader('Content-type', 'text/plain');
			xhr.send();			
			xhr.onreadystatechange = function(e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {
					cntnt.innerHTML = xhr.responseText;
				}
			}
		} else if (bx=='p') {
			xhr.open("GET", "//thewebdesignerpro.com/portfolio.txt", true);
			xhr.setRequestHeader('Content-type', 'text/plain');
			xhr.send();			
			xhr.onreadystatechange = function(e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {
					cntnt2.innerHTML = xhr.responseText;
				}
			}				
		} else {
			xhr.open("GET", "//thewebdesignerpro.com/contact.txt", true);
			xhr.setRequestHeader('Content-type', 'text/plain');
			xhr.send();			
			xhr.onreadystatechange = function(e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {
					cntnt3.innerHTML = xhr.responseText;
					document.getElementById("name").focus();
				}
			}
		}
	}
}

function hPushpop(url, bx) {
	href = url.getAttribute("href");
	fadeOff(nvo);
	navOn = false;
	loadCon(href, bx);
	history.pushState(null, null, href);
	if (popped = '0') {	popped = '1'; }
}

srbs.addEventListener('click', function(e) {
	hPushpop(this, 's');
	prtf.style.display = 'none';
	cntc.style.display = 'none';
	fadeOn(srvc);
	document.title = 'Services | The Web Designer Pro';
	e.preventDefault();
});
x1.addEventListener('click', function(e) {
	hPushpop(this, ' ');
	fadeOff(srvc);
	document.title = 'The Web Designer Pro';
	e.preventDefault();
});
flio.addEventListener('click', function(e) {
	hPushpop(this, 'p');
	srvc.style.display = 'none';
	cntc.style.display = 'none';
	fadeOn(prtf);
	document.title = 'Portfolio | The Web Designer Pro';
	e.preventDefault();
});
x2.addEventListener('click', function(e) {
	hPushpop(this, ' ');
	fadeOff(prtf);
	document.title = 'The Web Designer Pro';
	e.preventDefault();
});
kont.addEventListener('click', function(e) {
	hPushpop(this, 'c');
	srvc.style.display = 'none';
	prtf.style.display = 'none';
	fadeOn(cntc);
	document.title = 'Contact | The Web Designer Pro';
	e.preventDefault();
});
x3.addEventListener('click', function(e) {
	hPushpop(this, ' ');
	fadeOff(cntc);
	document.title = 'The Web Designer Pro';
	e.preventDefault();
});

window.onpopstate = function(e) {
	if (popped == '1') {
		srvc.style.display = 'none';
		prtf.style.display = 'none';
		cntc.style.display = 'none';
		document.title = 'The Web Designer Pro';
	}
};

if (window.addEventListener) {
	window.addEventListener("load", animate, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", animate);
} else {
	window.onload = animate;
}	
