module.exports = {
  update: async (pecker = {
    searchPeckerId,
    keywords,
    crawlerAgent,
    reportHtml,
    reportImage,
    pageNo,
    pageNoPrev,
    pageNoWarn,
    targetUrl,
    searchEngine
  }) => {
    try {
      let updatedPecker = await SearchPecker.findOne({
        where: {
          id: parseInt(pecker.searchPeckerId, 10)
        }
      });
      if (updatedPecker) {
        updatedPecker.keywords = pecker.keywords;
        updatedPecker.crawlerAgent = pecker.crawlerAgent;
        updatedPecker.reportHtml = pecker.reportHtml;
        updatedPecker.reportImage = pecker.reportImage;
        updatedPecker.pageNo = pecker.pageNo;
        updatedPecker.pageNoPrev = pecker.pageNoPrev;
        updatedPecker.pageNoWarn = pecker.pageNoWarn;
        updatedPecker.targetUrl = pecker.targetUrl;
        updatedPecker.searchEngine = pecker.searchEngine;
        updatedPecker = updatedPecker.save();
      } else {
        sails.log.error(`can't find by ${pecker.searchPeckerId}.`);
      }
      return updatedPecker;
    } catch (e) {
      throw e;
    }
  }
}
