describe.only('about SearchPecker Service.', function() {
  let searchPecker, defaultSearchPecker, searchPeckerId = 1;
  before('建立 SearchPecker 資料', async (done) => {
    try {
      const defaultSearchPecker = {
        keywords: 'testKeywords',
        crawlerAgent: 'testCrawlerAgent',
        reportHtml: 'testReportHtml',
        reportImage: 'testReportImage',
        pageNo: '0',
        pageNoPrev: '0',
        pageNoWarn: '0',
        targetUrl: 'testTargetUrl',
        searchEngine: 'testSearchEngine'
      };
      console.log(defaultSearchPecker);
      // TODO searchPecker = SearchPecker.create
      const result = await SearchPecker.create(defaultSearchPecker);
      // sails.log.info('create SearchPecker spec=>', result);
      result.should.be.Object;
      result.keywords.should.be.equal(defaultSearchPecker.keywords);
      done();
    } catch (e) {
      done(e);
    }
  });

  it('根據 ID 更新 SearchPecker', async (done) => {
    try {
      const updateData = {
        keywords: 'updateKeywords',
        crawlerAgent: 'updateCrawlerAgent',
        reportHtml: 'updateReportHtml',
        reportImage: 'updateReportImage',
        pageNo: '1',
        pageNoPrev: '1',
        pageNoWarn: '1',
        targetUrl: 'updateTargetUrl',
        searchEngine: 'updateSearchEngine'
      }
      const searchPecker = await SearchPeckerService.update({ searchPeckerId, ...updateData});
      searchPecker.should.be.Object;
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
