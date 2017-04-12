var RoleNames = ["READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"];

module.exports = {
  index: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = UserService.getPermissions(roles, model);
    if(permissions.read === true || permissions.read_write === true) {
      res.ok({
        view: true,
        serverSidePaging: true,
        layout: 'admin/default/index',
        name: RoleNames,
        roleid: await Role.findAll(),
        menuItems: await MenuItem.findAllWithSubMenu(),
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
  create: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = UserService.getPermissions(roles, model);
    if(permissions.read_write === true || (permissions.read === true && permissions.create === true)) {
      res.ok({
        view: true,
        layout: 'admin/default/create',
        name: RoleNames,
        roleid: await Role.findAll(),
        menuItems: await MenuItem.findAllWithSubMenu(),
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
  edit: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = UserService.getPermissions(roles, model);
    if(permissions.read_write === true || (permissions.read === true && permissions.update === true)) {
      res.ok({
        view: true,
        layout: 'admin/default/edit',
        name: RoleNames,
        roleid: await Role.findAll(),
        menuItems: await MenuItem.findAllWithSubMenu(),
        permissions,
        user: user.username
      });
    } else {
      res.forbidden();
    }

  },
  show: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = UserService.getPermissions(roles, model);
    if(permissions.read === true || permissions.read_write === true) {
      res.ok({
        view: true,
        layout: 'admin/default/show',
        name: RoleNames,
        roleid: await Role.findAll(),
        menuItems: await MenuItem.findAllWithSubMenu(),
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
}
