if (!Array.prototype.findE) {
  Array.prototype.findE = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findE called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

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
      sort = ['price', 'time'].findE((e) => e === sort);
      sortDir = ['asc', 'desc'].findE((e) => e === sort.toLowerCase());
      sort = (sort === 'time') ? 'createdAt' : sort;

      const result = await ProductService.find({
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
