module.exports = {
  index: async (req, res) => {
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index'
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/create'
    });
  },
  edit: async (req, res) => {
    let allRole = await Role.findAll();
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      allRole: allRole,
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/user/show'
    });
  },
}
