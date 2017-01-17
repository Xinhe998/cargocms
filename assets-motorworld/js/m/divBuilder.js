// var mainUrl = 'http://beta.motorworld.com.tw';
// var mainUrl = window.location.origin;
var mainUrl = 'http://localhost:5001';

var divId = '#member';
var urlParams = '';
var height = 30;

function getEntrance() {
  console.log('urlParams=>', window.location);
  urlParams = window.location.search || '?debug=false';
  var hasDebug = urlParams.split('?')[1].split('=')[0] == 'debug';
  var isDebug = hasDebug && urlParams.split('?')[1].split('=')[1] == 'true';
  console.log('[Merlin] : should I magically show the entrance? =>', isDebug);

  if(isDebug) {
    var timeStamp = new Date();
    iFrameTarget = mainUrl + '/entrance?t=' + timeStamp.getTime();
    iFrameDiv ='<iframe src=' + iFrameTarget + ' ' +
      'frameborder="0" scrolling="no" name="member" height=' + height + '></iframe>';
    try {
      setStyle();
      $(divId).append(iFrameDiv);
    } catch (e) {
      console.log(e);
    }
  }
}

function setStyle() {
  $(divId).css('text-align', 'center');
  $(divId).css('background-color', 'white');
  $(divId).css('width', '100%');
  $(divId).css('height', height + 'px');
  $(divId).css('padding-top', '10px');

  $(divId).css('top', '10px');
  $(divId).css('position', 'absolute');
  $(divId).css('z-index', '999999');

}
