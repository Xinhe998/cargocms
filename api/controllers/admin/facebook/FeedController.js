module.exports = {
  index: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      permissions,
    });
  }
}
