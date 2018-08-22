"use strict";

var IE8 = document.all && document.querySelector && !document.addEventListener;

	function isWebkit() {
	  if(navigator.userAgent.indexOf('AppleWebKit') != -1){
         return true;
      } else {
		 return false;
	  }
    }
	
	function is_IE_touch() {
      return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
      //navigator.msMaxTouchPoints for microsoft IE backwards compatibility
    }

	var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
	
	var uaandroid;
	var isAndroid;
	
	uaandroid = navigator.userAgent.toLowerCase();
    isAndroid = uaandroid.indexOf("android") > -1; //&& ua.indexOf("mobile");

	function isAndroidBrowser() {

var objAgent = navigator.userAgent;
var objfullVersion = ''+parseFloat(navigator.appVersion);
var objOffsetVersion=objAgent.indexOf("Chrome");

  if (objOffsetVersion != -1) {
   objfullVersion = objAgent.substring(objOffsetVersion+7, objOffsetVersion+9);
    if (objfullVersion < 33) {
      return true;
    }
  }
     return false;
}
	

if (IE8 !== true) {
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
};
} else {
var breakpoint = 'desktop';
}

  var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

  if (isTouch === true) {
    document.getElementsByTagName('body')[0].className+=' touch';
  }
  
  if (document.all && !window.atob || document.all && !document.addEventListener) {
	document.getElementsByTagName('body')[0].className+=' ie9-lower';
  }  

	function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

 function whichTransitionEvent(){
    var t,
      el = document.createElement("fakeelement");

	  var transitions = {
		"transition"      : "transitionend",
		"OTransition"     : "oTransitionEnd",
		"MozTransition"   : "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
	  }

	  for (t in transitions){
		if (el.style[t] !== undefined){
		  return transitions[t];
		}
	  }
	}

    var transitionEvent = whichTransitionEvent();
	
	
	function whichAnimationEvent(){
  var t,
      el = document.createElement("fakeelement");

  var animations = {
    	'WebkitAnimation' : 'webkitAnimationEnd',
		'OAnimation' : 'oAnimationEnd',
		'animation' : 'animationend'
    }

  for (t in animations){
    if (el.style[t] !== undefined){
      return animations[t];
    }
  }
}

var animationEvent = whichAnimationEvent();

var now = new Date();
var start = new Date(now.getFullYear(), 0, 0);
var diff = now - start;
var oneDay = 1000 * 60 * 60 * 24;
var day = Math.floor(diff / oneDay);
//$(".digits .day").html(day);
      
    function checkTime(i) {
      if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
      return i;
    }
	
	var isiPad, uaipad;
	
    isiPad = navigator.userAgent.match(/iPad/i) != null;
    uaipad = navigator.userAgent;
    isiPad = /iPad/i.test(uaipad) || /iPhone OS 3_1_2/i.test(uaipad) || /iPhone OS 3_2_2/i.test(uaipad);
	
	if (isiPad === true) {
	  $('body').addClass('ipad');
	} 
	
	
	if (document.all && !window.atob || document.all && !document.addEventListener) {
	
	   // IE9 & lower
	 
 	} else {
	
	var minutes, seconds;
	
	minutes = document.getElementById("minutes");
    seconds = document.getElementById("seconds");
	
	if (minutes !== null && seconds !== null) {
	
	  if (isWebkit === true || isiPad === true) {
        seconds.addEventListener('webkitAnimationIteration', function() {
	       if (Number(minutes.innerHTML) != '00') {
	        minutes.innerHTML = Number(minutes.innerHTML) - 1;
		   } else {
		    minutes.innerHTML = 59;
		   }
        });
	  } else {
	    seconds.addEventListener('animationiteration', function() {
	      if (Number(minutes.innerHTML) != '00') {
	       minutes.innerHTML = Number(minutes.innerHTML) - 1;
		   } else {
		  minutes.innerHTML = 59;
		 }
       });
	 }
	
	}
	
	}