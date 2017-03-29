module.exports = {
  index: async (req, res) => {
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const permissions = await UserService.getPermissions(model, user);
    if(permissions.read === true || permissions.read_write === true) {
      res.ok({
        view: true,
        serverSidePaging: true,
        layout: 'admin/default/index',
        permissions,
      });
    } else {
      res.forbidden();
    }
  }
}
