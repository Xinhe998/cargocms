module.exports = {
  index: async (req, res) => {
    const {query} = req;
    let getQuery = '';
    for(let item in query) {
       getQuery = item
    }
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      query: getQuery,
    });
  },
  create: async (req, res) => {
    /* 暫時拔掉
    const {query} = req;
    let getQuery = '';
    for(let item in query) {
       getQuery = item
    }
    res.ok({
      view: true,
      layout: 'admin/default/create',
      query: getQuery,
    });
    */
  },
  edit: async (req, res) => {
    const { query } = req;
    const { id } = req.params;
    const item = await Config.findOne({
      where:{
        id
      },
    });
    let getQuery = '';
    for(let item in query) {
       getQuery = item
    }
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      query: getQuery,
      type: item.key
    });

  },
  show: async (req, res) => {
    const {query} = req;
    const { id } = req.params;
    const item = await Config.findOne({
      where:{
        id
      },
    });
    let getQuery = '';
    for(let item in query) {
       getQuery = item
    }
    res.ok({
      view: true,
      layout: 'admin/default/show',
      query: getQuery,
      type: item.key,
    });
  },
}
