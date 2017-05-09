module.exports = {
  find: async (req , res) => {
    try{
      const {start, length, category, supplier, limit, q} = req.query;

      const result = await ProductService.find({
        start,
        length,
        categoryId: category,
        supplierId: supplier,
        limit,
        keyword: q
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
