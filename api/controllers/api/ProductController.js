module.exports = {
  find: async (req , res) => {
    try{
      /**
       * @property {Object} query - req.query
       * @property {Number} query.start - 起始位置
       * @property {Number} query.length - 長度
       * @property {Number} query.category - 種類ID
       * @property {Number} query.supplier - 供應商ID
       * @property {Boolean} query.limit - 是否限制長度
       * @property {String} query.q - 關鍵字
       * @property {String} query.sort - 用哪個屬性來排序 ('price'|'time')
       * @property {String} query.sortDir - 排序方向 ('asc'|'desc')
       */
      let {start, length, category, supplier, limit, q, sort, sortDir = 'asc'} = req.query;
      
      // 防錯
      if(sort.split('|').length > 1)
        [sort, sortDir] = sort.split('|')
      sort = ['price', 'time'].Find((e) => e === sort);
      sortDir = ['asc', 'desc'].Find((e) => e === sortDir.toLowerCase());
      sort = (sort === 'time') ? 'createdAt' : sort;

      const result = await ProductService.findAll({
        start,
        length,
        categoryId: category,
        supplierId: supplier,
        limit,
        keyword: q, 
        sortBy: sort,
        sortDir
      });

      const message = 'Get Product Success';
      res.ok({
        message,
        data: {
          items: result
        }
      });

    } catch (e) {
      res.serverError(e);
    }
  }
}
