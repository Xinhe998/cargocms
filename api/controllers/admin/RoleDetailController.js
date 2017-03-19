var menuItems = {}, roleid = {};
(async function() {
  menuItems = await MenuItem.findAllWithSubMenu();
  roleid = await Role.findAll();
})();

module.exports = {
  index: async (req, res) => {
    res.ok({
      view: true,
      serverSidePaging: true,
      layout: 'admin/default/index',
      name: ["READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"],
      roleid: roleid,
      menuItems: menuItems
    });
  },
  create: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/create',
      name: ["READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"],
      roleid: roleid,
      menuItems: menuItems
    });
  },
  edit: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/edit',
      name: ["READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"],
      roleid: roleid,
      menuItems: menuItems
    });

  },
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/show',
      name: ["READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"],
      roleid: roleid,
      menuItems: menuItems
    });
  },
}
