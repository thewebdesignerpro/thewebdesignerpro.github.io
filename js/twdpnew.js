$(document).ready(function(){

var top_val = $('#ipadmenu li a').css('top');
$('#ipadmenu li.selected').children('a').stop().animate({top:0}, {easing: 'easeOutQuad', duration:400});        
$('#ipadmenu li').hover(
function () {
$(this).children('a').stop().animate({top:0}, {easing: 'easeOutQuad', duration:400});       
},
function () {
$(this).children('a').stop().animate({top:top_val}, {easing: 'easeOutQuad', duration:400});     
$('#ipadmenu li.selected').children('a').stop().animate({top:0}, {easing: 'easeOutQuad', duration:400});        
});

var oScroll2 = $('#maincontent');
	if(oScroll2.length > 0){
		oScroll2.tinyscrollbar();

		function myScroll(a) {
		var pos = a.position();
		var ppos = pos.top - 10;
		
	    $(".overview").animate({
		"top": "-" + ppos + "px"
		}, "fast", function(){ 
		oScroll2.tinyscrollbar_update(ppos);
		});
		}
		
		function hideIt () {
		$('#folio').css('display', 'none');
		}		
				
		$('#home').click(function(){
		var p1 = $("#homeh");
		myScroll(p1);
		return false;		
		});
				
		$('#about').click(function(){
		var p1 = $("#abouth");
		myScroll(p1);
		return false;		
		});
		
		$('#services').click(function(){
		var p1 = $("#servicesh");
		myScroll(p1);		
		return false;		
		});
		
		$('#contact').click(function(){
		var p1 = $("#contacth");
		myScroll(p1);
		return false;				
		});
		
		$('#home2').click(function(){
		var p1 = $("#homeh");
		hideIt();
		myScroll(p1);
		return false;		
		});
				
		$('#about2').click(function(){
		var p1 = $("#abouth");
		hideIt();
		myScroll(p1);
		return false;		
		});
		
		$('#services2').click(function(){
		var p1 = $("#servicesh");
		hideIt();
		myScroll(p1);
		return false;				
		});
		
		$('#contact2').click(function(){
		var p1 = $("#contacth");
		hideIt();		
		myScroll(p1);
		return false;				
		});		

		$('#contact3').click(function(){
		var p1 = $("#contacth");
		myScroll(p1);
		return false;				
		});
															
	}
	
    var oScroll1 = $('#vwprt');
    if(oScroll1.length > 0){
    oScroll1.tinyscrollbar();
	
	function hideThem () {
	$('#pfh').css('display', 'none');
	$('#pph').css('display', 'none');
	$('#tsh').css('display', 'none');			
	$('#vwprtb').css('display', 'none');
	$('#privacyb').css('display', 'none');
	$('#termsb').css('display', 'none');
	}

	function myFolio(hhh,ace,abc) {
	var p1 = $("#folio");

	hideThem();
	
	$('#' + hhh).css('display', 'block');
	$('#' + ace).load(abc + '.html');
	$('#' + ace).css('display', 'block');

    p1.fadeIn("slow");
	oScroll1.tinyscrollbar_update();
    }
		    	
	$('#portfolio').click(function(){
	myFolio('pfh', 'vwprtb', 'portfolio');
	return false;				
	});
	
	$('#portfolio2').click(function(){
	myFolio('pfh', 'vwprtb', 'portfolio');
	return false;				
	});
	
	$('#portfolio3').click(function(){
	myFolio('pfh', 'vwprtb', 'portfolio');
	return false;				
	});		

	$('#privacy2').click(function(){
	myFolio('pph', 'privacyb', 'privacy');
	return false;				
	});
	
	$('#terms2').click(function(){
	myFolio('tsh', 'termsb', 'terms');
	return false;				
	});		
	
	$('#pcloseb').click(function(){
	var p1 = $("#folio");
    p1.fadeOut("slow");
	oScroll1.tinyscrollbar_update();
	return false;				
	});
		
	}
				
    var adtb = $('#addthisb');
	var scit = $('#socialit');

	scit.mouseenter(function(){
	adtb.fadeIn(500);
	});
	adtb.mouseleave(function(){	
	adtb.fadeOut(100);	
	});
	
	
			
});	