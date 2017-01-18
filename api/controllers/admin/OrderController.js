module.exports = {
  index: async (req, res) => {
    let orderStatus = await OrderStatus.findAll();
    orderStatus = orderStatus.map((data) => {
      return { name: data.name, title: req.__(`${data.name}`)};
    })

    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      orderStatus
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/create'
    });
  },
  edit: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/edit'
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/show'
    });
  },
}
