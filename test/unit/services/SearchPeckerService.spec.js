describe.only('about SearchPecker Service.', function() {
  let searchPecker, defaultSearchPecker;
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

  it('根據 ID 更新 SearchPecker', async (done) => {
    try {
      const updateData = {

      }
      const searchPecker = SearchPeckerService.update({ searchPeckerId, ...updateData})
      searchPecker.keywords.shoule.be.eq(updateData.keywords);
      searchPecker.crawlerAgent.shoule.be.eq(updateData.crawlerAgent);
      searchPecker.reportHtml.shoule.be.eq(updateData.reportHtml);
      searchPecker.reportImage.shoule.be.eq(updateData.reportImage);
      searchPecker.pageNo.shoule.be.eq(updateData.pageNo);
      searchPecker.pageNoPrev.shoule.be.eq(updateData.pageNoPrev);
      searchPecker.pageNoWarn.shoule.be.eq(updateData.pageNoWarn);
      searchPecker.targetUrl.shoule.be.eq(updateData.targetUrl);
      searchPecker.searchEngine.shoule.be.eq(updateData.searchEngine);
      done();
    } catch (e) {
      done(e)
    }
  });

});
