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
      res.status.should.be.eq(200);
      res.body.data.keywords.should.be.eq(updateData.keywords);
      res.body.data.crawlerAgent.should.be.eq(updateData.crawlerAgent);
      res.body.data.reportHtml.should.be.eq(updateData.reportHtml);
      res.body.data.reportImage.should.be.eq(updateData.reportImage);
      res.body.data.pageNo.should.be.eq(updateData.pageNo);
      res.body.data.pageNoPrev.should.be.eq(updateData.pageNoPrev);
      res.body.data.pageNoWarn.should.be.eq(updateData.pageNoWarn);
      res.body.data.targetUrl.should.be.eq(updateData.targetUrl);
      res.body.data.searchEngine.should.be.eq(updateData.searchEngine);
      done();
    } catch (e) {
      done(e);
    }
  });

});
