module.exports = {
  getMetaTag: () => {
    try{
      let meta = {};
      if (sails.config.metas.meta) {
        meta = sails.config.metas.meta;
      }
      return meta;
    } catch (e) {
      throw e;
    }
  },

  getOgTag: () => {
    try{
      let og = {};
      if (sails.config.metas.og) {
        og = sails.config.metas.og;
      }
      return og;
    } catch (e) {
      throw e;
    }
  },

  getFbAppId: () => {
    try{
      let appId = '';
      if (sails.config.facebook) {
        appId = sails.config.passport.facebook.options.clientID;
      }

      return appId;
    } catch (e) {
      throw e;
    }
  },

}
