   "use strict";
   
   /* polyfill released by Erik Möller and Paul Irish which provides support RequestAnimationFrame for older browsers */
   
   (function() {
   var lastTime = 0;
   var vendors = ['ms', 'moz', 'webkit', 'o'];
   for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
   window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
   window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
    || window[vendors[x]+'CancelRequestAnimationFrame']; 
    }
    if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
    timeToCall);
    lastTime = currTime + timeToCall;
    return id;
    };
    if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
    };
    }());
	
   /* polyfill end */

   var preloader_progress;
   var preloader_progress_new;
   var preloader_container_width;
   var preloader_container_height;
   var preloader_coef_width;
   var preloader_coef_height;
   var preloader_tot_progress;
   var preloader_tot_progress2;
   var preloader_tot_progress3;
   var preloader_tot_progress4;
   
   var preloader_last_progress;
   
   var preloader_canv1;
   var preloader_canv2;
   var preloader_canv3;
   var preloader_canv4;
   
   var this_preloader_canv1;
   var this_preloader_canv2;
   var this_preloader_canv3;
   var this_preloader_canv4;
   
   var preloader_line4_fill_fix;
   var preloader_line2percent;
   var preloader_line3percent;
   var preloader_line4percent;
   
   var preloader_pixelXX;
   var preloader_preloader_pixelXXX;
   
   	if (document.all && document.querySelector && !document.addEventListener === true) {
	   throw new Error("You are using Internet Explorer 8. Not of all functional of this site may work perfectly.");
	}
	
   function getRandomInt(min, max)
   { 
    return Math.floor(Math.random() * (max - min + 1)) + min;  
   } 
   
  
	var progress_bar = document.createElement('div');
	    progress_bar.id = 'progress-bar';
		
	var img = document.createElement("img");
    img.src = "img/light/logo.svg";
	img.id = 'preloader-logo';
	progress_bar.appendChild(img);
	
	var progress_bar_div = document.createElement('div');	
	progress_bar.appendChild(progress_bar_div);
	
	var preloader_outer = document.createElement('div');
	    preloader_outer.id = 'preloader-outer';
	
    var preloader_container = document.createElement('div');
        preloader_container.id = 'preloader';
		
	var preloader_hack = document.createElement('div');
        preloader_hack.id = 'preloader-hack';
		
    var canvas_div = document.createElement('canvas');
    canvas_div.id = 'canvas';
	
	var preloader_wrapper = document.createElement('div');
        preloader_wrapper.id = 'preloader-wrapper';
    	
	preloader_container.appendChild(canvas_div);
    preloader_outer.appendChild(preloader_container);
		
	document.getElementsByTagName('html')[0].appendChild(preloader_wrapper);
    document.getElementsByTagName('html')[0].appendChild(preloader_outer);
	document.getElementsByTagName('html')[0].appendChild(progress_bar);
	document.getElementsByTagName('html')[0].appendChild(preloader_hack);
	
    preloader_container_width = document.getElementById('preloader').offsetWidth;
	preloader_container_height = document.getElementById('preloader').offsetHeight;
	
	var gllenght = (preloader_container_width + preloader_container_height) * 2;
	
    var width_percent_len = Math.round( ( preloader_container_width / gllenght) * 100 );
    var height_percent_len = Math.round( ( preloader_container_height / gllenght) * 100 );
	
    preloader_coef_width = 100 / width_percent_len;
    preloader_coef_height = 100 / height_percent_len;

	var preloader_logo_complete = document.getElementById("preloader-logo");
	preloader_logo_complete.onload = function() {
        this.style.opacity = "1";
    };
	
	function preloader_close() {
		
		    document.querySelectorAll("#progress-bar > div")[0].innerHTML = '100%';
			
		    document.getElementById("preloader-hack").classList.add('left');
		
		    clearInterval(draw_line);
			clearInterval(draw_progress);
		
		    setTimeout(function() { 
			
		      document.getElementById("preloader-hack").classList.add('transition');
			  
			  	if ( !document.querySelectorAll("body")[0].classList.contains('light') ) { 
	                
					document.getElementById("preloader-hack").style.border = "2px #fff solid";

                }
			  
			  document.getElementById("preloader").style.transition = "background 0s";
			  document.getElementById("preloader").style.background = "transparent";
			  document.getElementById("preloader-outer").style.background = "transparent";
			  document.getElementById("preloader-wrapper").style.background = "transparent";
			  document.getElementById("progress-bar").style.opacity = "0";
			
			}, 50);
			
			setTimeout(function() { 
              
			  document.getElementById("canvas").style.opacity = "0";
			  clearInterval(draw_line);
			  var draw_line = undefined;
			  document.getElementsByTagName('html')[0].removeChild(progress_bar);
			  document.getElementsByTagName('html')[0].removeChild(preloader_outer);
			  document.getElementsByTagName('html')[0].removeChild(preloader_wrapper);
			  document.getElementsByTagName('html')[0].removeChild(preloader_hack);
			  document.getElementsByTagName('html')[0].style.overflow = "auto";
			  document.removeEventListener('touchmove', touchmoveprevent, false);
			  
			}, 1500);
	}
	
	function mat() {
		
	  preloader_tot_progress = preloader_progress * preloader_coef_width;
	  preloader_tot_progress2 = (preloader_progress - width_percent_len) * preloader_coef_height;
	  preloader_tot_progress3 = (preloader_progress - width_percent_len - height_percent_len) * preloader_coef_width;
	  preloader_tot_progress4 = (preloader_progress - width_percent_len - height_percent_len - width_percent_len) * preloader_coef_height;
	  
	  preloader_canv1 = (preloader_container_width / 100) * preloader_tot_progress;
	  preloader_canv2 = (preloader_container_height / 100) * preloader_tot_progress2;
	  preloader_canv3 = (preloader_container_width / 100) * preloader_tot_progress3;
	  preloader_canv4 = (preloader_container_height / 100) * preloader_tot_progress4;
	  
	}
	
	mat();
	
	preloader_progress = 0;
	
	window.onload = function(){
		
       setTimeout(function() { 
	      preloader_progress = 100;
		  mat();
	   }, 1000);
	   
    }
	
	var preloader_last_progress = 50;
	
	function drawprogress() {
	
	  if (preloader_progress > 0 && preloader_progress < 101) {
		
		if (preloader_progress < 100) {
	      
		  preloader_last_progress = Number(preloader_progress);
		  document.querySelectorAll("#progress-bar > div")[0].innerHTML = ''+ preloader_progress +'%';
		
		} else {
						
	      setInterval(function() {
            
			if (preloader_last_progress < 95) {
			   
			   preloader_last_progress = Number(preloader_last_progress + 5);
			   document.querySelectorAll("#progress-bar > div")[0].innerHTML = ''+ preloader_last_progress +'%';
			   
			}
			
	      }, 500);
		  
		}
		
	  }
    }
	
    var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d');
	    
	canvas.width = document.getElementById('preloader').offsetWidth;
	canvas.height = document.getElementById('preloader').offsetHeight;
	
	ctx.lineWidth = 4;
	ctx.beginPath();
    ctx.moveTo(0,0);
	
	setTimeout(function() {
	  document.getElementById("preloader").style.background = '#fff';
	}, 10)
	
	var pixelX = 0;
	var xx = 1;
	
	var line1_fill = 0;
	var line2_fill = 0;
	var line3_fill = 0;
	var line4_fill = 0;
	preloader_line4_fill_fix = 0;
		
	var speed = canvas.width / 54.4;
	
	var slow_speed = 0.5;
	var grow_speed = canvas.width / 54.4;
	
	var progress_last;
	var preloader_progress_new;
	var checkbox = 0;
	
	
	function func1() {	 
	           if (pixelX > preloader_canv1) {
				   speed = slow_speed;
				   checkbox = 0;
	           }
			   
			   if (checkbox == 1) {
				   speed = grow_speed;
			   }
	}
	
	function func2() {
	            if (pixelX > preloader_canv2) {
				   speed = slow_speed;
				   checkbox = 0;
	           }
			   
			   if (checkbox == 1) {
				   speed = grow_speed;
			   }
	}
	
	function func3() {
	            if (pixelX > preloader_canv3) {
				   speed = slow_speed;
				   checkbox = 0;
	           }
			   
			   if (checkbox == 1) {
				   speed = grow_speed;
			   }
	}
	
	function func4() {
	            if (pixelX > preloader_canv4) {
				   speed = slow_speed;
				   checkbox = 0;
	           }
			   
			   if (checkbox == 1) {
				   speed = grow_speed;
			   }
	}
		
	function drawline() {
		
	window.scrollTo(0,0);
	progress_last = preloader_progress;
	
	if (progress_last !== preloader_progress_new && typeof(preloader_progress_new) !== 'undefined') {
         checkbox = 1;
    }
	
	pixelX = pixelX + speed;
    var grd=ctx.createLinearGradient(0,0,0,0);
    grd.addColorStop(0,"black");
    grd.addColorStop(1,"white");
	
		if (xx == 1) {
		
		  if (pixelX < preloader_container_width && line1_fill !== 1 && line2_fill !== 1 && line3_fill !== 1) {
			  
			 var coef_gradient = pixelX / preloader_container_width * 2;
             var grd = ctx.createLinearGradient(0,0,(pixelX * coef_gradient),0);
             grd.addColorStop(0,"black");
             grd.addColorStop(1,"white");
             ctx.strokeStyle=grd;
			 ctx.lineTo((pixelX + 15), 0);
			 
		   requestAnimationFrame(func1);
			
           if (pixelX > (preloader_container_width - 20) ) {
			  document.getElementById("preloader-hack").classList.add('top');
		      line1_fill = 1;
			  pixelX = 0;
		   }
			
		  } else if (line1_fill == 1 && line2_fill !== 1 && line3_fill !== 1 && line4_fill !== 1) {
		  
		     preloader_line2percent = preloader_progress - width_percent_len;
			 this_preloader_canv2 = (preloader_container_height / 100) * preloader_coef_height * preloader_line2percent;
			 		  
			  requestAnimationFrame(func2);
			  ctx.moveTo(preloader_container_width, 0);
				
			  var coef_gradient2 = pixelX / preloader_container_height * 3;
			  
			  if (pixelX < 25) {
				var grd = ctx.createLinearGradient(0,0,0,100);
              } else if (pixelX > (preloader_container_height - 100 ) ) {
				var grd = ctx.createLinearGradient(0,0,0,(pixelX * 10));
			  } else {
		        var grd = ctx.createLinearGradient(0,0,0,(pixelX * coef_gradient2));
			  }
			  
              grd.addColorStop(0, "black");
              grd.addColorStop(1, "white");
			
			  ctx.strokeStyle = grd;
			  ctx.lineTo(preloader_container_width, pixelX);
			  
			    if (pixelX > (preloader_container_height) ) {
				   document.getElementById("preloader-hack").classList.add('right');
		           line2_fill = 1;
				   pixelX = -10;
		        }
		 
		  } else if (line1_fill == 1 && line2_fill == 1 && line3_fill !== 1 && line4_fill !== 1) {
		  		  
		  preloader_line3percent = preloader_progress - width_percent_len - height_percent_len;
		  this_preloader_canv3 = (preloader_container_width / 100) * preloader_coef_width * preloader_line3percent;
		  
			 requestAnimationFrame(func3);
			 
			 preloader_pixelXX = preloader_container_width - pixelX;
			 var coef_gradient3 = pixelX / preloader_container_width * 3;
             var grd = ctx.createLinearGradient( (preloader_container_width - pixelX) , 0, (preloader_container_width - pixelX + 200 / coef_gradient3), 0);

             grd.addColorStop(0, "white");
             grd.addColorStop(1, "black");
			
             ctx.strokeStyle = grd;
			 ctx.lineTo(preloader_pixelXX + 20, preloader_container_height);
			 
			 setTimeout(function() { 
			    if (preloader_pixelXX < 10 ) {
				   document.getElementById("preloader-hack").classList.add('bottom');
		           line3_fill = 1;
				   pixelX = 0;
		        }	
			 }, 100);
			  			 
		  } else if (line3_fill == 1) {

             preloader_line4percent = preloader_progress - width_percent_len - height_percent_len - width_percent_len;
		     this_preloader_canv4 = (preloader_container_height / 100) * preloader_coef_height * preloader_line4percent;
		 
			 requestAnimationFrame(func4);
		     ctx.moveTo(0, preloader_container_height);
		     
		     setTimeout(function() {
			   preloader_preloader_pixelXXX = (preloader_container_height - pixelX);
			   
			   if (preloader_preloader_pixelXXX < -10 ) {
				 setTimeout(function() {
		           line4_fill = 1;
				 }, 50);
		       }
			   
			   var grd = ctx.createLinearGradient( 0, (preloader_container_height - pixelX) , 0, (preloader_container_height - pixelX + 75) );

               grd.addColorStop(0, "white");
               grd.addColorStop(1, "black");
			
               ctx.strokeStyle = grd;
			   ctx.lineTo(0, preloader_preloader_pixelXXX);
			   
			 }, 100);
			 
			   if (line4_fill == 1) {
				  preloader_close(); 
			   }
			
			 }

		}

        ctx.stroke();
		preloader_progress_new = preloader_progress;
		
    }

    var draw_line = setInterval(drawline, 17);
	var draw_progress = setInterval(drawprogress, 200);
	
	document.getElementsByTagName('html')[0].style.overflow = "hidden";
	
	var touchmoveprevent = function(m) {
	    m.preventDefault();
	};
	
	document.addEventListener('touchmove', touchmoveprevent, false);
	