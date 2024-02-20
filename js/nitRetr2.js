/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

let 
nv=document.getElementById("nav"),
nvo=document.getElementById("nvo"),
srbs=document.getElementById("serbis"),
flio=document.getElementById("folio"),
kont=document.getElementById("kontak"),
srvc=document.getElementById("services"),
prtf=document.getElementById("portfolio"),
cntc=document.getElementById("contact"),
cntnt=document.getElementById("content"),
cntnt2=document.getElementById("content2"),
cntnt3=document.getElementById("content3"),
x1=document.getElementById("x1"),
x2=document.getElementById("x2"),
x3=document.getElementById("x3"); 
//pinfo=document.getElementById("pinfo2");   

let navOn = false; 
   
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
			xhr.open("GET", "services.txt", true);
			//xhr.responseType = "document";
			xhr.setRequestHeader('Content-type', 'text/plain');
			xhr.send();			
			xhr.onreadystatechange = function(e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {
					cntnt.innerHTML = xhr.responseText;
				}
			}
		} else if (bx=='p') {
			xhr.open("GET", "portfolio.txt", true);
			xhr.setRequestHeader('Content-type', 'text/plain');
			xhr.send();			
			xhr.onreadystatechange = function(e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {
					cntnt2.innerHTML = xhr.responseText;
				}
			}				
		} else {
			xhr.open("GET", "contact.txt", true);
			xhr.setRequestHeader('Content-type', 'text/plain');
			xhr.send();			
			xhr.onreadystatechange = function(e) { 
				if (xhr.readyState == 4 && xhr.status == 200) {
					cntnt3.innerHTML = xhr.responseText;
				//	document.getElementById("name").focus();
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
}

/*if (window.addEventListener) {
	window.addEventListener("load", animate, false);
} else if (window.attachEvent) {
	window.attachEvent("onload", animate);
} else {
	window.onload = animate;
}*/	
