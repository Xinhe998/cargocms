/**
 * Authentication Controller
#
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
const url = require('url');

module.exports = {

  index: async function(req, res) {
    let loginUser = null;
    let displayName = '未登入';
    let avatar = '/assets/admin/img/avatars/default.png';
    loginUser = AuthService.getSessionUser(req);
    let roleDetailName = 'READ';
    let roles = await RoleService.getUserAllRole({ user:loginUser });

    if(loginUser != null){
      if(loginUser.avatar != null) avatar = loginUser.avatar
      displayName = loginUser.displayName
    }

    let menuItems =  await MenuItem.findAllWithSubMenu();
    for(let menuItem of menuItems) {
      if (menuItem.SubMenuItems && menuItem.SubMenuItems.length > 0) {
        for (var subitemNum = 0; subitemNum < menuItem.SubMenuItems.length; subitemNum++) {
          let model = menuItem.SubMenuItems[subitemNum].dataValues.model;
          let permissions = UserService.getPermissions(roles, model);
          let forbiddenMenuItem = permissions.read_write === false && permissions.read===false;
          if(forbiddenMenuItem) {
            menuItem.SubMenuItems.splice(subitemNum, 1);
            subitemNum-=1;
          }
        }
      }
    }
    res.ok({
      view: true,
      menuItems, loginUser, avatar, displayName,
    });
  },

  login: function(req, res) {
    let reqError = req.flash('error')[0] || null;
    res.ok({view: true, errors: reqError});
  },

  dashboard: function(req, res) {
    res.ok({view: true});
  },

  config: function(req, res) {
    let config = {
      title: 'CargoCMS 雲端管理系統',
      copyright: '© Laboratory of Fragrance &amp; Perfume',
    };

    res.set('Content-Type', 'text/javascript');
    res.send(new Buffer('var __ADMIN_CONFIG__='+JSON.stringify(config)+';'));
  },

};
