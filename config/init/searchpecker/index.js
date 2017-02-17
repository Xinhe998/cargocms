module.exports.init = async () => {
  try {

    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {
      let searchPeckerData = [
        {
          keywords: '客製化香水,調香,香水 實驗室',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: '<html...',
          reportImage: 'https://s3.../ID/screentshot1.png',
          pageNo: '1',
          pageNoPrev: '10',
          pageNoWarn: '5',
          targetUrl: 'labfnp.com',
          searchEngine: 'www.google.com.tw'
        }, {
          keywords: '豆花,小吃',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: '<html...',
          reportImage: 'https://s3.../ID/screentshot2.png',
          pageNo: '2',
          pageNoPrev: '11',
          pageNoWarn: '5',
          targetUrl: '',
          searchEngine: 'www.google.com.tw'
        }, {
          keywords: '紅茶, 飲料',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: '<html...',
          reportImage: 'https://s3.../ID/screentshot3.png',
          pageNo: '3',
          pageNoPrev: '12',
          pageNoWarn: '5',
          targetUrl: '',
          searchEngine: 'www.google.com.tw'
        }, {
          keywords: '麵包,餐廳,義大利麵',
          crawlerAgent: 'CargoSearchBot-v.10',
          reportHtml: '<html...',
          reportImage: 'https://s3.../ID/screentshot4.png',
          pageNo: '4',
          pageNoPrev: '13',
          pageNoWarn: '5',
          targetUrl: '',
          searchEngine: 'www.google.com.tw'
        }
      ];
      await SearchPecker.bulkCreate({

      });
    }

  } catch (e) {
    console.error(e);
  }
};
