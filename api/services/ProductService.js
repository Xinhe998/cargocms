module.exports = {
  find: async ({start, length, categoryId, supplierId, limit}) => {
    try{

      let query = {
        order: 'sortOrder ASC',
        where: {
          publish: true,
        },
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

  checkStock: async ({transaction, products}) => {
    try{
      let stock = true;
      
      for(let p of products){
        let product = await Product.findById(p.id, {transaction});
        
        if (p.optionId) {
          const productOption = await ProductOption.findById(p.optionId);
          if (productOption.ProductId !== p.id) {
            throw Error ('產品與產品選項不匹配');
          }

          let productOptionValue = await ProductOptionValue.findOne({
            where: {
              ProductOptionId: p.optionId
            },
            transaction
          });

          let orderQuantity = Number(p.quantity) * Number(productOptionValue.quantity);
          
          if (product.quantity < orderQuantity) {
            stock = false;
            break;
          }
        } else {
          if (product.quantity < p.quantity) {
            stock = false;
            break;
          }
        }
        
      }

      return stock;
    } catch (e) {
      sails.log.error(e);
    }
  },

  create: async ({data}) => {
    try{
      //ignore column
      console.log('create product data =>', data);

      data.points = 0;
      data.dateAvailable = UtilsService.DataTimeFormat().date;

      const categories = data.categoriesId.map( function(data) {
        return { id: data };
      });
      console.log('# create # categories =>',categories);
      const productCategory = await Category.findAll({
        where: {
          '$or': categories
        }
      });
      const suppliers = data.suppliersId.map( function(data) {
        return { id: data };
      });
      console.log('# create # suppliers =>',suppliers);
      const productSuppliers = await Supplier.findAll({
        where: {
          '$or': suppliers
        }
      });

      const product = await Product.create(data);

      const productDescription = await ProductDescription.create({
        name: product.model,
        description: '',
        tag: '',
        metaTitle: '',
        metaDescription: '',
        metaKeyword: '',
        ProductId: product.id
      });

      await product.setCategories(productCategory);
      await product.setSuppliers(productSuppliers);

      return product;
    } catch (e) {
      sails.log.error(e);
    }
  },

  update: async ({id, data}) => {
    try{
      //ignore column
      data.points = 0;

      const categories = data.categoriesId.map( function (data) {
        return { id: data };
      });
      const productCategory = await Category.findAll({
        where: {
          '$or': categories
        }
      })
      const suppliers = data.suppliersId.map( function(data) {
        return { id: data };
      });
      const productSuppliers = await Supplier.findAll({
        where: {
          '$or': suppliers
        }
      });

      let product = await Product.update(data, {
        where: {
          id
        }
      });
      product = await Product.findById(id);

      await product.setCategories(productCategory);
      await product.setSuppliers(productSuppliers);

      return product;
    } catch (e) {
      sails.log.error(e);
    }
  }
}
