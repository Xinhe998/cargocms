/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = async function(req, res, next) {

  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  const user = AuthService.getSessionUser(req);

  if (sails.config.verificationEmail && user.verificationEmailToken) {
    const modelUser = await User.findById(user.id);

    if (modelUser.verificationEmailToken) {
      req.flash('info', '請先驗證完您的 Email 才能使用此功能');
      return res.redirect('/edit/me');
    }
  }

  return next();

};
