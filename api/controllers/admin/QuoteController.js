module.exports = {
  index: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      permissions,
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/create',
    });
  },
  edit: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      permissions,
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/show',
      permissions,
    });
  },
}
