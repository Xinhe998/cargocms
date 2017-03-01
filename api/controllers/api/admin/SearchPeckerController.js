module.exports = {

  find: async (req, res) => {
    try {
      const { query, method, body } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      const include = [];
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
      let item = await SearchPecker.findOne({
        where:{
          id
        },
        include: SearchPeckerLog,
      });
      item = item.toJSON();
      const recordDate = ['x'];
      const rank = ['排名'];
      item.SearchPeckerLogs.forEach((data) => {
        recordDate.push(data.recordDate);
        rank.push(data.rank);
      })
      const rankTrend = {
        up: ['上升'],
        down: ['下降'],
      };
      for(let i = 1; i < rank.length ; i++) {
        let result = rank[i] - rank[i - 1];
        if (result !== 0) result *= -1;
        console.log(result);
        if (result > 0) {
          rankTrend.up.push(result);
          rankTrend.down.push(null);
        } else if (result <  0) {
          rankTrend.up.push(null);
          rankTrend.down.push(result);
        } else {
          rankTrend.up.push(null);
          rankTrend.down.push(null);
        }
      }

      console.log(rankTrend);

      res.ok({data: {item: { ...item, recordDate, rank, rankTrend }}});
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      let data = req.body;
      const item = await SearchPecker.create(data);
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
      const message = 'Update success.';
      const item = await SearchPecker.update(data ,{
        where: { id, },
      });
      const resultData = await SearchPecker.findById(id);
      res.ok({ message, data:resultData  });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await SearchPecker.destroy({ where: { id } });
      let message = 'Delete success';
      res.ok({message, data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  findAll: async(req, res) => {
    try {
      let item = await SearchPecker.findAll({
        include: SearchPeckerLog
      })
      console.log(item);
      res.ok({message: 'get data sucess', data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  }
}
