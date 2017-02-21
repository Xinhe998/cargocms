describe('about SearchPecker Service.', function() {
  let searchPecker, defaultSearchPecker, searchPeckerId;
  before('建立 SearchPecker 資料', async (done) => {
    try {
      const defaultSearchPecker = {
        // id: '1',
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
      // TODO searchPecker = SearchPecker.create
      const result = await SearchPecker.create(defaultSearchPecker);
      searchPeckerId = result.id;
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
      searchPecker.keywords.should.be.eq(updateData.keywords);
      searchPecker.crawlerAgent.should.be.eq(updateData.crawlerAgent);
      searchPecker.reportHtml.should.be.eq(updateData.reportHtml);
      searchPecker.reportImage.should.be.eq(updateData.reportImage);
      searchPecker.pageNo.should.be.eq(updateData.pageNo);
      searchPecker.pageNoPrev.should.be.eq(updateData.pageNoPrev);
      searchPecker.pageNoWarn.should.be.eq(updateData.pageNoWarn);
      searchPecker.targetUrl.should.be.eq(updateData.targetUrl);
      searchPecker.searchEngine.should.be.eq(updateData.searchEngine);
      done();
    } catch (e) {
      done(e)
    }
  });

});
