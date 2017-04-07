import moment from 'moment';

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
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
  create: async (req, res) => {
    let startTime = Date.now();
    let endTime = Date.now() + 86400000; // add one day.
    const model = req.options.controller.split("/").reverse()[0];
    const user = AuthService.getSessionUser(req);
    const roles = await RoleService.getUserAllRole({ user });
    const permissions = UserService.getPermissions(roles, model);
    startTime = moment(startTime).format("YYYY/MM/DD 00:00");
    endTime = moment(endTime).format("YYYY/MM/DD 00:00");
    if(permissions.read_write === true || permissions.create === true) {
      res.ok({
        view: true,
        layout: 'admin/default/create',
        StartDate: startTime,
        EndDate: endTime,
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
    if(permissions.read_write === true || permissions.update === true) {
      res.ok({
        view: true,
        layout: 'admin/default/edit',
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
    const permissions = UserService.getPermissions(roles, model);
    if(permissions.read === true || permissions.read_write === true) {
      res.ok({
        view: true,
        layout: 'admin/default/show',
        permissions,
      });
    } else {
      res.forbidden();
    }
  },
}
