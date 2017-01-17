var mainUrl = 'http://beta.motorworld.com.tw';
// var mainUrl = window.location.origin;

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
  $(divId).css('right', '120px');
  $(divId).css('width', '200px');
  $(divId).css('position', 'absolute');
  $(divId).css('margin-top', '80px');
  $(divId).css('height', height + 'px');
  $('div#top-field1').css('padding-bottom', '25px');
}
