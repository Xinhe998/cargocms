import MockData from 'mockup-data';

module.exports = {
  index: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      permissions,
    });
  },
  create: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      permissions,
    });
  },
  edit: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      permissions,
    });
  },
  show: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    res.ok({
      view: true,
      permissions,
    });
  },
}
