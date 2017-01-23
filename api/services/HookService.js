

module.exports = {
  customMiddleware: (express, app, multipleViews) => {
    try {
      for (var name in sails.hooks) {
        if(sails.hooks[name].customMiddleware){
          sails.hooks[name].customMiddleware(express, app, multipleViews, sails);
        }
      }
    } catch (e) {
      throw e;
    }
  },
  bootstrap: async (initDefault) => {
    try {
      for (var name in sails.hooks) {
        if(sails.hooks[name].bootstrap){
          await sails.hooks[name].bootstrap(initDefault);
        }
      }
    } catch (e) {
      throw e;
    }
  }
}
