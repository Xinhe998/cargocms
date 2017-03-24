module.exports = {
  index: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
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
      layout: 'admin/default/create'
    });
  },
  edit: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = UserService.getPermissions(model, user);
    let allRole = await Role.findAll();
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      permissions,
      allRole: allRole,
    });

  },
  show: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = UserService.getPermissions(model, user);
    res.ok({
      view: true,
      layout: 'admin/user/show',
      permissions,
    });
  },
}
