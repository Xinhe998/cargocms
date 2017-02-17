module.exports.init = async () => {
  try {

    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {
      let searchPeckerData = [
        {
          keywords: '客製化香水 調香 香水 實驗室',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: 'crawlerAgent/google/reault/html/report.html',
          reportImage: '/assets/labfnp/img/searchscreentshot_google.png',
          pageNo: '1',
          pageNoPrev: '1',
          pageNoWarn: '5',
          targetUrl: 'labfnp.com',
          searchEngine: 'www.google.com.tw'
        }, {
          keywords: '客製化香水 調香 香水 實驗室',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: 'crawlerAgent/bing/reault/html/report.html',
          reportImage: '/assets/labfnp/img/searchscreentshot_bing.png',
          pageNo: '1',
          pageNoPrev: '1',
          pageNoWarn: '5',
          targetUrl: 'labfnp.com',
          searchEngine: 'www.bing.com'
        }, {
          keywords: '客製化香水 調香 香水 實驗室',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: 'crawlerAgent/yahoo/reault/html/report.html',
          reportImage: '/assets/labfnp/img/searchscreentshot_yahoo.png',
          pageNo: '1',
          pageNoPrev: '1',
          pageNoWarn: '5',
          targetUrl: 'labfnp.com',
          searchEngine: 'tw.yahoo.com'
        }, {
          keywords: '客製化香水 調香 香水 實驗室',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: 'crawlerAgent/baidu/reault/html/report.html',
          reportImage: '/assets/labfnp/img/searchscreentshot_baidu.png',
          pageNo: '1',
          pageNoPrev: '1',
          pageNoWarn: '5',
          targetUrl: 'labfnp.com',
          searchEngine: 'www.baidu.com'
        }
      ];
      await SearchPecker.bulkCreate(searchPeckerData);
    }

  } catch (e) {
    console.error(e);
  }
};
