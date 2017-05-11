module.exports = {
  index: async (req, res) => {
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

      if( !category ){
        category = 1;
      }
      
      // 防錯
      sort = ['price', 'time'].Find((e) => e === sort);
      sortDir = ['asc', 'desc'].Find((e) => e === sortDir.toLowerCase());
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

      let categorys = await Category.findAll({
        order: 'sortOrder asc',
        include: CategoryDescription
      });

      // categorys = categorys.map(function( category ){
      //   return category.CategoryDescription.name;
      // });

      res.view('index',
        {
          data:{
            items: result,
            categorys,
          },
          errors: req.flash('error')[0],
        }
      );
    } catch (e) {
      sails.log.error(e);
    }
  },

  detail: async (req, res) => {
    try{
      let item = await Product.findOne({
        where: {
          id: req.params.id
        },
        include: [ProductDescription, ProductOption, ProductOptionValue, ProductImage]
      });
      res.view('b2b/product/detail',{
        data: {
          item,
        }
      });
    } catch (e) {
      sails.log.error(e);
    }
  },
};
