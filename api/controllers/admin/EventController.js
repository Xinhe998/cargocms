import moment from 'moment';

module.exports = {
  index: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      permissions,
    });
    sails.log.info("permissions " + permissions);
  },
  create: async (req, res) => {
    let startTime = Date.now();
    let endTime = Date.now() + 86400000; // add one day.
    const permissions = await UserService.getPermissions(req);
    startTime = moment(startTime).format("YYYY/MM/DD 00:00");
    endTime = moment(endTime).format("YYYY/MM/DD 00:00");
    res.ok({
      view: true,
      layout: 'admin/default/create',
      StartDate: startTime,
      EndDate: endTime,
      permissions,
    });
  },
  edit: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      permissions,
    });

  },
  show: async (req, res) => {
    const permissions = await UserService.getPermissions(req);
    res.ok({
      view: true,
      layout: 'admin/default/show',
      permissions,
    });
  },
}
