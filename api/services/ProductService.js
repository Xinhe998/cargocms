module.exports = {
  find: async ({start, length, categoryId, supplierId, limit}) => {
    try{

      let query = {
        include: [
          {
            model: Category,
            where: {
              id: categoryId
            }
          }
        ]
      };

      if(supplierId){
        query.include.push({
          model: Supplier,
          where: {
            id: supplierId
          }
        });
      }

      if ( limit === 'true'){
        query.offset = Number(start);
        query.limit = Number(length);
      }

      const product = await Product.findAll(query);

      return product;

    } catch (e) {
      sails.log.error(e);
    }
  },

  create: async ({data}) => {
    try{
      const categories = data.categoryId.map( function (data) {
        return { id: data };
      });
      const productCategory = await Category.findAll({
        where: {
          '$or': categories
        }
      })

      const product = await Product.create(data);

      await product.setCategories(productCategory);

      return product;
    } catch (e) {
      sails.log.error(e);
    }
  },

  update: async ({data}) => {
    try{



    } catch (e) {
      sails.log.error(e);
    }
  }
}
