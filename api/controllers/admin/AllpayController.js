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
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      layout: 'admin/default/create',
      permissions,
    });
  },
  edit: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      permissions,
    });

  },
  show: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      layout: 'admin/default/show',
      permissions,
    });
  },
}
