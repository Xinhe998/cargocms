import moment from 'moment';
describe('about SearchPecker Controller operation.', function() {

  let searchPecker, defaultSearchPecker, searchPeckerId;
  before('建立 SearchPecker 資料', async (done) => {
    try {
      defaultSearchPecker = {
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

      SearchPeckerLog.create({
        rank: '5',
        url: 'labfnp.com',
        recordDate: moment(new Date()).format('YYYY/MM/DD'),
        SearchPeckerId: result.id
      });

      let checkSearchPecker = await SearchPecker.findOne({
        where: {
          id: result.id
        },
        include: SearchPeckerLog
      })

      let checkSearchPeckerLog = await SearchPeckerLog.find({
        SearchPeckerId: result.id
      });

      sails.log.debug(checkSearchPecker, checkSearchPeckerLog)

      done()
    } catch (e) {
      done(e)
    }
  });


    it('get SearchPecker all keyword rank should success.', async (done) => {
      try {
        const res = await request(sails.hooks.http.app)
        .get(`/api/admin/keywordrank`);
        res.body.should.be.Object;
        res.status.should.be.eq(200);
        sails.log.info(JSON.stringify(res.body, null, 2));
        done();
      } catch (e) {
        done(e);
      }
    });


  it('update SearchPecker should success.', async (done) => {
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
    try {
      const res = await request(sails.hooks.http.app)
      .put(`/api/admin/searchpecker/${searchPeckerId}`)
      .send(updateData);
      res.body.should.be.Object;
      res.status.should.be.eq(200);
      sails.log.info(res.body);
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
