import marked from 'marked';
import fs from 'fs';
import path from 'path';

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
      const { url } = req.query;
      let md = function (filename) {
        const filePath = path.join(sails.config.paths.views , filename);
        const include = fs.readFileSync (filePath, 'utf8');
        let html = marked(include);

        return html;
      };
      const layout = sails.config.projectInfo.termsPrivacy.layout || sails.config.views.layout;
      return res.view('terms',
      {
        layout,
        data: {
          md,
          url
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  privacy: function(req, res) {
    try{
      const { url } = req.query;
      let md = function (filename) {
        const filePath = path.join(sails.config.paths.views , filename);
        const include = fs.readFileSync (filePath, 'utf8');
        let html = marked(include);

        return html;
      };

      const layout = sails.config.projectInfo.termsPrivacy.layout || sails.config.views.layout;
      return res.view('privacy',
      {
        layout,
        data: {
          md,
          url
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },
}
