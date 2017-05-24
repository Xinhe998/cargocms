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
    let orderStatus = await OrderStatus.findAll();
    orderStatus = orderStatus.map((data) => {
      return { name: data.name, title: req.__(`${data.name}`)};
    })

    res.ok({
      view: true,
      layout: 'admin/default/create',
      orderStatus
    });
  },
  edit: async (req, res) => {
    let orderStatus = await OrderStatus.findAll();
    orderStatus = orderStatus.map((data) => {
      return { name: data.name, title: req.__(`${data.name}`)};
    })

    res.ok({
      view: true,
      layout: 'admin/default/edit',
      orderStatus
    });

  },
  show: async (req, res) => {
    let orderStatus = await OrderStatus.findAll();
    orderStatus = orderStatus.map((data) => {
      return { name: data.name, title: req.__(`${data.name}`)};
    })

    res.ok({
      view: true,
      layout: 'admin/default/show',
      orderStatus
    });
  },
}
