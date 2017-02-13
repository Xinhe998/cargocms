import fs from 'fs';
import marked from 'marked';
import path from 'path';

module.exports = {
  index: function(req, res) {
    let user = AuthService.getSessionUser(req);
    // in jade use `#{data.user} to access`
    return res.ok({user})
  },

  terms: function(req, res) {
    try{
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
          md
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  privacy: function(req, res) {
    try{
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
          md
        }
      });
    } catch (e) {
      res.serverError(e);
    }
  },
}
