"use strict";

$(document).ready(function() {

   $("select").selectOrDie({
    size: 6
   });
   
   $('.sod_list').mCustomScrollbar({scrollInertia: 100, theme: "select", scrollbarPosition: "inside", mouseWheel:{ preventDefault: true }, keyboard:{ enable: true } }); 
   
});