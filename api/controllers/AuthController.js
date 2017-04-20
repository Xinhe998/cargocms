/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
const url = require('url');

module.exports = {
  login: function(req, res) {
    try{
      if(req.session.authenticated) return res.redirect('/');
      let user = {
        identifier: '',
        password: ''
      }
      let form = req.flash('form')[0];

      if (form) {
        const isLogin = form.identifier && form.password;
        if (isLogin) user = form;
      }

      let url = req.query.url || '/';

      res.ok({
        //layout: false,
        user,
        errors: req.flash('error')[0],
        url
      });
    } catch (e){
      sails.log.error(e);
      res.serverError(e);
    }
  },

  logout: function(req, res) {
    req.session.authenticated = false;
    req.logout();
    return res.redirect(req.query.url || sails.config.urls.afterLogout);
  },

  provider: function(req, res) {
    try {
      passport.endpoint(req, res);
    } catch (e) {
      sails.log.error(e);
    }
  },

  register: async (req, res) => {
    if(AuthService.isAuthenticated(req)) return res.redirect('/');
    try {
      let user = {
        username: '',
        email: '',
        lastName: '',
        firstName: '',
        birthday: '',
        phone1: '',
        phone2: '',
        address: '',
        address2: '',
        city: '',
        district: '',
        postCode: '',
      }
      let form = req.flash('form')[0];

      if (form) {
        const isRegist = form.username && form.email;
        if (isRegist) user = form;
      }

      res.ok({
        user,
        errors: req.flash('error'),
        reCAPTCHAKey: sails.config.reCAPTCHA.key
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  status: (req, res) => {
    let authenticated = AuthService.isAuthenticated(req)
    let sessionUser = AuthService.getSessionUser(req)
    res.ok({authenticated, sessionUser});
  },

  callback: async function(req, res) {
    const tryAgain = function(err) {
      let flashError = req.flash('error')[0];
      if (err && !flashError) {
        req.flash('error', 'Error.Passport.Generic');
      } else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      let action = req.param('action');
      switch (action) {
        case 'register':
          res.redirect('/register');
          break;
        case 'disconnect':
          res.redirect('back');
          break;
        default:
          var reference;
          try {
            reference = url.parse(req.headers.referer);
          } catch (e) {
            reference = { path : "/" };
          }
          if (req.wantsJSON) {
            res.forbidden(err);
          } else {
            res.redirect(reference.path);
          }
          break;
      }
    }; // end tryAgain
    const authCallback = function(err, user, challenges, status) {
      sails.log.info('=== callback url ===', url);
      sails.log.info('=== callback user ===', user);
      sails.log.info('=== passport.callback ===', err);
      if (err || !user) return tryAgain(err);

      const loginCallback = function(err) {
        if (err) return tryAgain(err);

        // update user lastLogin status
        req.session.authenticated = true;
        const userAgent = req.headers['user-agent'];
        user.loginSuccess({ userAgent });
        console.log('user=>', user);

        // check action
        const action = req.param('action');
        sails.log.info('action=>', action);
        switch (action) {
          case 'register':
            if (sails.config.verificationEmail) {
              req.flash('info', '註冊成功!! 接下來補齊您的資料，並於信箱查收驗證信');
              return res.redirect('/edit/me');
            }
            break;
        }

        // make respond depends on dataType
        if (req.wantsJSON) {
          const jwtToken = AuthService.getSessionEncodeToJWT(req);
          return res.ok({
            jwtToken,
          });
        } else {
          let url = req.query.url;
          if (!url && req.body) url = req.body.url;
          url = url || sails.config.urls.afterSignIn;
          // console.log('url=>', url);
          return res.redirect(url);
        }
      }; // end loginCallback
      req.login(user, loginCallback);
    }; // end authCallback
    try {
      await passport.callback(req, res, authCallback);
    } catch (e) {
      sails.log.error(e);
      throw new Error(e);
    }
  },

  disconnect: function(req, res) {
    passport.disconnect(req, res);
  },

  forgot: function(req, res) {
    try {
      res.ok({ view: true, reCAPTCHAKey: sails.config.reCAPTCHA.key });
    } catch (e) {
      res.serverError(e);
    }
  },
};
