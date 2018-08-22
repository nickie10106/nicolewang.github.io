"use strict";

var count_j,
		social_current_right,
		social_now_right,
		page_count_click_all;

 $(document).ready(function() {
	 
  $(".social-btn a").on("click touchstart", function(e){
		e.stopPropagation();
  });
 
 $('.social-btn ul').addClass("opacity-initial");
   
   var opacity_temp = 0.25;
   
   $(".social-btn .show").click(function(event) {
	   
	   $('.social-btn > a').css('transition', 'opacity ' + opacity_temp + 's');
	   $('.social-btn > a').css('opacity', '0');
	   
	   if ( $(this).hasClass('click') ) {
		   $('.social-btn > a').removeClass("show");
	   }
		
	   setTimeout(function() {  
		      $('.social-btn > a').css('opacity', '0.5');
			  $('.social-btn > a').toggleClass("click");
			  $('.social-btn > a').addClass("show");
       }, (opacity_temp * 1000) );
	   
	   setTimeout(function() {
			  $('.social-btn > a').removeAttr('style');  
       }, (opacity_temp * 1000 * 2) );
	  
		$(this).next('ul').removeClass("opacity-initial");
		
	    if ( $(this).next('ul').hasClass("vis-1") ) {
				  
				  $(this).next('ul').children('li').each(function(elem) {
	                       
						social_current_right = parseInt ( $(this).css('right'), 10 );
						if (social_current_right > 0) {
                          social_now_right = social_current_right - 10;
                        } else {
                          social_now_right = social_current_right + 10;
                        }						
						$(this).css('right', ''+social_now_right+'px');
                  });
				  
		} else {
		
		            var ul = document.querySelectorAll(".social-btn li");
                    var count_click = 0;

					var li_count = 0;
					for (var count_m = 0; count_m < ul.length; count_m++) {
						li_count++;
					}
					
					var divide = li_count / 2;
					
					if (parseInt(divide, 10) != divide) {
						var divide_s = Math.ceil(divide);
					} else {
						var divide_s = divide;
					}
					
					var li_left_count = 0;
					
					for (var count_j = 0; count_j < ul.length; count_j++) {
						if (count_j >= divide_s) {
						} else {
						  li_left_count++; 
						}
					}

					var left_count = 0;
					var margin = '48';
					var random = true;

					for (var count_s = 0; count_s < ul.length; count_s++) {
						
						var result_margin = margin * count_s;
						
						if (count_s >= divide_s) {
						
						  minus = left_count * margin;
						  result_margin = result_margin - minus;
						  result_margin = result_margin + 49;
						  
						  if (page_count_click_all % 2 == 0) {
						  
							 var minus = '-';
							 
						  } else {
						  
							 var minus = '';
						  }
						  
						  if (random === false) {
							 var minus = '-';
						  }
						
						  ul[count_s].style.right = ""+ minus +""+ (result_margin) +"px";
								  
						} else {
						  
						  if (page_count_click_all % 2 == 0) {
							 var minus = '';
						  } else {
							 var minus = '-';
						  }
						  
						  if (random === false) {
							 var minus = '';
						  }
						  
						  result_margin = margin * li_left_count;
						  ul[count_s].style.right = ""+ minus +""+ result_margin +"px";
						  
						  left_count++;
						  li_left_count--;
						  
						}
					}

		}
	   

	        $(this).next('ul').toggleClass("vis-1");
			if ( $(this).next('ul').hasClass('vis-1') ) {
			  $(this).next('ul').children('li').children('a').show();
			}
			
			$('footer').toggleClass("social-open");
			
		  if (document.all && !window.atob) {
			   if ( !$(this).next('ul').hasClass("vis-1") ) {
				  
			   }
          }
		 
    });

});

progress = 35;