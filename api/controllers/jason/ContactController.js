module.exports = {

  index: async function(req, res) {
    try {
      const info = req.flash('info')[0] || '';
      return res.view({ info, reCAPTCHAKey: sails.config.reCAPTCHA.key });
    }
    catch (e) {
      res.serverError(e);
    }
  },

}
