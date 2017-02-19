import jwt from 'jsonwebtoken';
module.exports = {

  isAuthenticated: function(req) {
    if (req.session.authenticated) {
      return true;
    } else {
      return false;
    }
  },

  getSessionUser: function(req) {
    if (req.session.passport != undefined && req.session.passport.user) {
      return req.session.passport.user;
    } else {
      return null;
    }
  },

  isAdmin: function(req) {
    let user = AuthService.getSessionUser(req);
    let isAdmin = false;
    if (user) {
      console.log('user=>', user);
      if (user.Roles) {
        user.Roles.forEach((role) => {
          if(role.authority == 'admin') isAdmin = true;
        });
      }
      if (user.rolesArray) {
        user.rolesArray.forEach((role) => {
          if(role == 'admin') isAdmin = true;
        });
      }
    }

    return isAdmin;
  },

  isSupplier: function(req) {

    let user = AuthService.getSessionUser(req);
    let isSupplier = false;
    if (user) {
      user.Roles.forEach((role) => {
        if(role.authority == 'supplier') isSupplier = true;
      });
    }

    return isSupplier;
  },

  getSessionEncodeToJWT: function(req) {
    const user = AuthService.getSessionUser(req);
    const isWebView = AuthService.isWebView(req.headers['user-agent']);
    let jwtToken = '';
    if ((req.session.needJwt || isWebView ) && user ) {
      try {
        jwtToken = jwt.sign(JSON.stringify(user), 'secret');
      } catch (e) {
        console.log(e);
        throw new Error(e);
      }
    }
    req.session.needJwt = false;
    return jwtToken;
  },

  isWebView: function(userAgent) {
    return userAgent.indexOf('React-Native') !== -1;
  }
}
