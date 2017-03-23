import MockData from 'mockup-data';

module.exports = {
  index: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      permissions,
    });
  },
  create: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      permissions,
    });
  },
  edit: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      permissions,
    });
  },
  show: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      permissions,
    });
  },
}
