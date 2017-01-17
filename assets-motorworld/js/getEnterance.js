var mainUrl = 'http://beta.motorworld.com.tw';
// var mainUrl = window.location.origin;
// var mainUrl = 'http://localhost:5001';
//----------------------------------------------------------------------------/
//------------------------------- main part ----------------------------------//
//----------------------------------------------------------------------------//
// javascript: (function(e, s) {
//     e.src = s;
//     e.onload = function() {
//         jQuery.noConflict();
//         console.log('jQuery injected');
//
//         $ = jQuery;
//         refuel();
//         console.log("[Merlin] : refuel!");
//     };
//     document.head.appendChild(e);
// })(document.createElement('script'), '//code.jquery.com/jquery-latest.min.js');
refuel();
//-------------------------------- refuel ------------------------------------//
function refuel() {

  if($('div#member').length == 0) {
    $('div#top-field1').append('<div id="member"></div>') ;
  }

  var jsUrl = mainUrl + "/assets/motorworld/js/postscribe.min.js";

  $.getScript(jsUrl)
    .done(function(script, textStatus) {
      launch();
      console.log("[Merlin] : launch!");
    }) // end done
    .fail(function(jqxhr, settings, exception) {
      console.log("[Merlin] : Load postscribe failed. :(");
    }); // end fail

} // end refuel

//-------------------------------- launch ------------------------------------//
function launch() {

  var timeStamp = new Date();
  var jsUrl = mainUrl + "/assets/motorworld/js/divBuilder.js?t=" + timeStamp;
  $.getScript(jsUrl)
    .done(function(script, textStatus) {
      getEntrance();
    }) // end success
    .fail(function(jqxhr, settings, exception) {
      console.log("[Merlin] : Load divBuilder failed.:(");
    }); // end fail

}; // end launch
