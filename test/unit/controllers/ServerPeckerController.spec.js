describe('about SearchPecker Controller operation.', function() {

  let searchPecker, defaultSearchPecker, searchPeckerId;
  before('建立 SearchPecker 資料', (done) => {
    try {
      defaultSearchPecker = {

      }
      // TODO searchPecker = SearchPecker.create
      done()
    } catch (e) {
      done(e)
    }
  });

  it('update SearchPecker should success.', async (done) => {
    const updateData = {

    }
    try {
      const res = await request(sails.hooks.http.app)
      .put(`/api/admin/crawler/rank/${searchPeckerId}`)
      .send(updateData);
      res.body.should.be.Object;
      res.status.shoule.be.eq(200);
      res.body.data.keywords.shoule.be.eq(updateData.keywords);
      res.body.data.crawlerAgent.shoule.be.eq(updateData.crawlerAgent);
      res.body.data.reportHtml.shoule.be.eq(updateData.reportHtml);
      res.body.data.reportImage.shoule.be.eq(updateData.reportImage);
      res.body.data.pageNo.shoule.be.eq(updateData.pageNo);
      res.body.data.pageNoPrev.shoule.be.eq(updateData.pageNoPrev);
      res.body.data.pageNoWarn.shoule.be.eq(updateData.pageNoWarn);
      res.body.data.targetUrl.shoule.be.eq(updateData.targetUrl);
      res.body.data.searchEngine.shoule.be.eq(updateData.searchEngine);
      done();
    } catch (e) {
      done(e);
    }
  });

});
