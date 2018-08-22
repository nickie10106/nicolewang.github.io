"use strict";

var border_coef;
var result_coef;
var notify_width;

$(document).ready(function() {

     function clear_notify_field() {
		 
	    $('.notify').removeClass('invalid valid');
	    $('.notify input[type=email]').attr("placeholder", "Your Email");
	    
		if ( $('.notify').hasClass('closed') ) {
		   $('.notify input[type=email]').val("");
		}
		
	  }
	
	   $('body').on("click touchstart", function(){
		
        if ( !$('.notify').hasClass('closed') ) {

			$('.notify').addClass('closed');
			$('.notify button').addClass('hack');
			
			clear_notify_field();
			  
			if (border_coef > 6) {
			  $('.hack').addClass('border-6');
		    } 
			
			if (border_coef > 8) {
			  $('.hack').addClass('border-8');
		    }

			$('.notify input[type=email]').blur();	
		}
	  });

	$('.notify button[type="button"]').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
		
	   if ( $(this).hasClass('hack') ) {
		 $('.notify button').removeClass('hack');
	   }
	   
    });
	
	$('.notify button[type="button"]').click(function(event){
	
	
	function round_mod(value, precision) {
        var precision_number = Math.pow(10, precision);
        return Math.round(value * precision_number) / precision_number;
    }
		
	if (breakpoint.value == 'mobile') {
		  
		  var border_coef;
		
          notify_width = $('.notify').width();

		  var result = 16400 / notify_width / 100;
		  
		  result_coef = 1 / result;
		  border_coef = result_coef * 2; 

        result = round_mod(result, 2);
	
		var cssAnimation = document.createElement('style');
        cssAnimation.type = 'text/css';
        var rules = document.createTextNode('@keyframes notify-hack-before {'+
        'from { transform: scaleX(1) translate3d(0,0,0) }'+
        'to { transform: scaleX('+ result +') translate3d(0,0,0);  }'+
        '}');
        
		var rules_webkit = document.createTextNode('@-webkit-keyframes notify-hack-before {'+
        'from { transform: scaleX(1) translate3d(0,0,0) }'+
        'to { transform: scaleX('+ result +') translate3d(0,0,0);  }'+
        '}');
        
		cssAnimation.appendChild(rules);
        cssAnimation.appendChild(rules_webkit);
        document.getElementsByTagName("head")[0].appendChild(cssAnimation);  
	  }	
		
      if ( $('.notify').hasClass('closed') ) {
	     $('.notify').removeClass('closed');
		 $('.notify input[type=email]').focus();
	  }	
    });
	
    
	$('.notify button[type="button"]').on("click", function(event){
		return false;
	});
	
	$('.notify input[type="email"]').on("click touchstart", function(event){
		return false;
	});
	
	
	$('.notify input[type="submit"]').on("click touchstart", function(event){
		$('.notify-me').trigger('submit');
		return false;
	});
	
   (function () {
    var oldVal;
    
    var checkLength = function (val) {
       clear_notify_field();
    }

    $('.notify input[type=email]').bind('DOMAttrModified textInput input change keypress paste focus', function () {
        var val = this.value;
        if (val !== oldVal) {
            oldVal = val;
            checkLength(val);
        }
    });
    }());
	
	$('.notify-me').submit(function(e){
				
		var form = $(this),
				message        =  $('.notify'),
				message_input  =  $('.notify input[type=email]'),
				messageSuccess = 'Your email is sended',
				messageInvalid = 'Please enter a valid email address',
				messageSigned  = 'This email is already signed',
				messageErrore  = 'Error request';
					
		e.preventDefault();
		
    $.ajax({
      url     : 'php/notify-me.php',
      type    : 'POST',
      data    : form.serialize(),
      success : function(data){
								
				form.find('.btn').prop('disabled', true);
				
				switch(data) {
					case 0:
					
						message_input.attr("placeholder", messageSuccess);
						message.addClass('valid');
					
						setTimeout(function(){
							form.trigger('reset');
						}, 2000);
						
						break;
					case 1:
						message_input.attr("placeholder", messageInvalid);
						message.addClass('invalid');
						
						break;
					case 2:
						message_input.attr("placeholder", messageSigned);
						message.addClass('invalid');
						
						setTimeout(function(){
							form.trigger('reset');
						}, 2000);
						
						break;
					default:
						message_input.attr("placeholder", messageErrore);
						message.addClass('invalid');
				}
				
				form.find('.btn').prop('disabled', false);
                message_input.val('');				
        }
      });
    });
	
	$('.contact-form').submit(function(e){
				
		var form = $(this);
		e.preventDefault();
		
		$.ajax({
			type: 'POST',
			url : 'php/contact.php',
			data: form.serialize(),
			success: function(data){
				
				form.find('.form-message').html(data);
				form.find('.btn').prop('disabled', true);
				
				setTimeout(function(){
				   form.find('.form-message span').addClass('visible');
			    }, 50);
					
				if ($(data).is('.send-true')){
					setTimeout(function(){
						form.trigger('reset');
						form.find('.btn').prop('disabled', false);
					}, 2000);
				} else {
					form.find('.btn').prop('disabled', false);
				}
			}
		});
    });
	
}); 