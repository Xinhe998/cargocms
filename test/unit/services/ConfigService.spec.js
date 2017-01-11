describe.skip('about Config Service operation.', function() {
  it('將 sails.config 同步至 config model', async (done) => {

    try {
      let result = ConfigService.sync();
      result.should.be.true;
      done();
    } catch (e) {
      done(e);
    }

  });

  it('config model 更新後，重新載入 sails.config', async (done) => {

    try {
      let result = ConfigService.load();
      result.should.be.true;
      done();
    } catch (e) {
      done(e);
    }

  });

  it('相關 service 重新初始，如：email, passport', async (done) => {

    try {
      let result = ConfigService.initService();
      result.should.be.true;
      done();
    } catch (e) {
      done(e);
    }

  });

});
