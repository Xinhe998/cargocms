module.exports = {
  index: async (req, res) => {
    const modelName = req.options.controller.split("/").reverse()[0];
    sails.log.info("modelName", modelName);
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    // TODO: 根據 roles 判斷權限，使用 RoleService.hasRoleDetailOfMenuItem
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      // TODO: 根據 Role 替換
      permissions: {
        create: true,
        update: true,
        delete: true,
      },
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/create'
    });
  },
  edit: async (req, res) => {
    let allRole = await Role.findAll();
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      permissions: {
        create: true,
        update: true,
        delete: true,
      },
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/user/show',
      permissions: {
        create: true,
        update: true,
        delete: true,
      },
    });
  },
}
