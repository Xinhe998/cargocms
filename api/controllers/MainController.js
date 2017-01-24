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
  }
}
