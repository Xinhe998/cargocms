

module.exports = {
  initAssets: (express, app, maxAge) => {
    for (var name in sails.hooks) {
      console.log("=== hook ===", name);
      if(sails.hooks[name].assetsInit){
        console.log("=== hook has assetsInit ===", name);
        sails.hooks[name].assetsInit(express, app, maxAge);
      }
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
