module.exports = {

  find: async (req, res) => {
    try {
      const { query, method, body } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      const include = [CategoryDescription];
      const isPost = method === 'POST';
      let mServerSidePaging = isPost ? body.serverSidePaging : serverSidePaging;
      let mQuery = isPost ? body : query;
      let result;
      if (mServerSidePaging) {
        result = await PagingService.process({ query: mQuery, modelName, include });
      } else {
        const items = await sails.models[modelName].findAll({
          include
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
      const item = await Category.findOne({
        where:{
          id
        },
        include: [CategoryDescription]
      });
      res.ok({data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      let data = req.body;
      const item = await Category.create(data);

      await CategoryDescription.create({
        ...data,
        CategoryId: item.id
      });

      const message = 'Create success.';
      res.ok({ message, data: { item } } );
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      data.ImageId = data.ImageId || null;
      data.ParentId = data.ParentId || null;
      delete data.deletedAt;

      const categoryDescriptionData = data.CategoryDescription;
      delete data.CategoryDescription;
      delete categoryDescriptionData.deletedAt;

      const item = await Category.update(data ,{
        where: { id, },
      });

      await CategoryDescription.update(categoryDescriptionData,{
        where: {
          CategoryId: id
        }
      });

      const message = 'Update success.';
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Category.destroy({ where: { id } });
      await CategoryDescription.destroy({
        where: {
          CategoryId: id
        }
      })
      const message = 'Delete success';
      res.ok({message, data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  }
}
