module.exports = {

  find: async (req, res) => {
    try {
      const { query, method, body } = req;
      const { serverSidePaging, filter } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      const include = [  ];
      const isPost = method === 'POST';
      let mServerSidePaging = isPost ? body.serverSidePaging : serverSidePaging;
      let mQuery = isPost ? body : query;
      let result;
      if (mServerSidePaging) {
        result = await PagingService.process({ query: mQuery, modelName, include });
        let newData = [];
        const dataLength = result.data.length;
        const createPaymentMethod = (dataLength > 1) ? false : true;
        if(filter === 'paymentMethods') {
          if(createPaymentMethod) {
            let paymentValues = JSON.parse(result.data[0].value);
            for(let item of paymentValues) {
              let data = {
                'name': 'paymentMethods',
                'key': item.type,
                'description': item.other,
                'value': '[\"' + item.provider + '\"]',
                'type': 'array',
              }
              const fomateData = await Config.create(data);
              newData.push(fomateData);
            }
            // await ConfigService.load();
            result.data = newData;
          } else {
            result.data.shift();
          }
        }
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
      const item = await Config.findOne({
        where:{
          id
        },
        include: []
      });
      res.ok({data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      let data = req.body;
      const item = await Config.create(data);
      let message = 'Create success.';
      res.ok({ message, data: { item } } );
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      delete data.deletedAt;
      const message = 'Update success.';
      if(data.description === '')
        delete data.description
      const item = await Config.update(data ,{
        where: { id, },
      });
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Config.destroy({ where: { id } });
      let message = 'Delete success';
      res.ok({message, data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  reload: async (req, res) => {
    try {
      await ConfigService.sync();
      await ConfigService.load();
      const message = 'reload config success';
      res.ok({message, data: {}});
    } catch (e) {
      res.serverError(e);
    }
  }
}
