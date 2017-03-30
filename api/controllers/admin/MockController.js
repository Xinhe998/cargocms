import MockData from 'mockup-data';

module.exports = {
  index: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = await UserService.getPermissions(roles, model, user);
    if(permissions.read === true || permissions.read_write === true) {
      res.ok({
        view: true,
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
    const permissions = await UserService.getPermissions(roles, model, user);
    if(permissions.read === true || permissions.read_write === true || permissions.create === true) {
      res.ok({
        view: true,
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
    const permissions = await UserService.getPermissions(roles, model, user);
    if(permissions.read === true || permissions.read_write === true || permissions.update === true) {
      res.ok({
        view: true,
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
  show: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = await UserService.getPermissions(roles, model, user);
    if(permissions.read === true || permissions.read_write === true) {
      res.ok({
        view: true,
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
}
