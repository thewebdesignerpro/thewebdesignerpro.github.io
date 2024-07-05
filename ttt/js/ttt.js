/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

//var playlstb, sosyalb = infob = planim = false, notemsg=0, light, spotL, spotL2;
var playlstb, sosyalb = buysb = infob = planim = false, notemsg=0, light, spotL;
//var scene;

//document.getElementById('volumt').addEventListener('change', function() {
   // gainNode.gain.value = this.value;
   //this.disabled;
//});

/*$.fn.fadeSlideLeft = function(speed,fn) {
    return $(this).animate({
        'opacity' : 0,
        'width' : '0px'
    },speed || 400,function() {
        $.isFunction(fn) && fn.call(this);
    });
}*/

$('#soclnks').nanoScroller();
$('#instr2').nanoScroller();
$('#instr').nanoScroller();

$("#playlist-temp li").click(function() {
		return false;
});
//$(".buys").click(function() {
//		return false;
//});

	$("#sharer").click(function() {
		$("#sosyal").animate({right:'+=280px'},500);
		//$(this).show("slide", { direction: "left" }, -300);
		//sosyal.show();
		sosyalb=true;
		$('#playlst').hide();	
		$('#minfo2').hide();	
		$('#minfo').hide();	
		$('#sharerx').show();
		$('#sharer').hide();	  
		return false;
    });			
	$("#sharerx").click(function() {
		$("#sosyal").animate({right:'-=280px'},500);
		//$("#sosyal").animate({right:'toggle'},0);
		//$(this).show("slide", { direction: "right" }, 300);
		//sosyal.hide();
		sosyalb=false;
		$('#sharer').show();
		$('#sharerx').hide();	  
		$('#playlst').show();	
		$('#minfo2').show();	
		$('#minfo').show();		  
		return false;
    });	
	
	$("#minfo2").click(function() {
		$("#buy").animate({right:'+=280px'},500);
		info2b=true;
		//$('#playlst').hide();	
		$('#minfo').hide();			
		$('#minfo2x').show();
		$('#minfo2').hide();	  
		return false;
    });			
	$("#minfo2x").click(function() {
		$("#buy").animate({right:'-=280px'},500);
		info2b=false;
		$('#minfo2').show();
		$('#minfo2x').hide();	  
		$('#minfo').show();		  
		return false;
    });	
	
	$("#minfo").click(function() {
		$("#info").animate({right:'+=280px'},500);
		infob=true;
		$('#playlst').hide();	
		$('#minfo2').hide();	
		$('#sharer').hide();			
		$('#minfox').show();
		$('#minfo').hide();	  
		return false;
    });			
	$("#minfox").click(function() {
		$("#info").animate({right:'-=280px'},500);
		infob=false;
		$('#minfo').show();
		$('#minfox').hide();	  
		$('#playlst').show();	
		$('#minfo2').show();	
		$('#sharer').show();				  
		return false;
    });		



