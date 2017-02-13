import marked from 'marked';

module.exports = {
  index: function(req, res) {
    // let user = AuthService.getSessionUser(req);
    // // in jade use `#{data.user} to access`
    // return res.ok({user})

    try {
      console.log("!!!!!!!!!!!!!!!!!!!!!", UtilsService.isMobile(req));
      let url = "/";
      if(UtilsService.isMobile(req)) {
        url = 'http://m.motorworld.com.tw/';
      } else {
        url = 'http://www.motorworld.com.tw/home';
      }
      return res.redirect(url);
    } catch (e) {
      res.serverError(e);
    }
  },

  terms: function(req, res) {
    try{

      let md = function (filename) {
        const path = __dirname +"/views/docs/" + filename;
        const include = fs.readFileSync (path, 'utf8');
        let html = marked (include);

        return html;
      };


      return res.view('terms',
      {
        data: {
          path: __dirname
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  privacy: function(req, res) {
    try{

    } catch (e) {
      res.serverError(e);
    }
  },
}
