module.exports = {
  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        // const include = [ ProductDescription, Supplier, { model: Category, include: CategoryDescription  }];
        result = await PagingService.process({query, modelName});
      } else {
        const items = await sails.models[modelName].findAll({
          include: [ ProductDescription, Supplier, { model: Category, include: CategoryDescription  }]
        });
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Product.findOne({
        where: {
          id
        },
        include:[ ProductDescription, Supplier, { model: Category, include: CategoryDescription  }]
      });
      res.ok({ data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      const data = req.body;
      delete data['length'];
      delete data['width'];
      delete data['height'];
      // const item = await Product.create(data);
      const item = await ProductService.create({data});
      const message = 'Create success.';
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      if(!data.deletedAt){
        data.deletedAt = null;
      }

      const item = await ProductService.update({id, data});
      const message = 'Update success.';
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Product.deleteById(id);
      
      const deleteProductImage = await ProductImage.destroy({
        where: {
          ProductId: id
        }
      });

      const message = 'Delete success.';
      res.ok({ message, data: { item, deleteProductImage } });
    } catch (e) {
      res.serverError(e);
    }
  }
}
