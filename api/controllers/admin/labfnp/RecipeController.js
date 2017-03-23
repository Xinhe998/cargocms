module.exports = {
  index: async (req, res) => {
    const permissions = UserService.getPermissions(req);
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      permissions,
    });
  },
  create: async (req, res) => {
    const permissions = UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/create',
      permissions,
    });
  },
  edit: async (req, res) => {
    const permissions = UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      permissions,
    })
  },
  show: async (req, res) => {
    const permissions = UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/labfnp/recipe/show',
      permissions,
    });
  },
}
