module.exports = {

  getUserAllRole: async({ user }) => {
    try {
      const findUser = await User.findOne({
        where: {
          id: user.id
        },
        include: Role,
      })
      const rolesId = findUser.Roles.map((data) => data.id);
      let roleGroup = await RoleDetail.findAll({
        where: {
          RoleId: rolesId,
        },
        include: MenuItem
      });
      return roleGroup;
    } catch (e) {
      throw e;
    }
  },

  hasRole: function(user, roleName) {
  },

  hasRoleDetail: function(user, roleName) {
  },

  getAccessibleMenuItems: function(user) {
  },

  hasRoleDetailOfMenuItem: function(user, menuItem, roleDetailName) {
  },

  canAccessApi: function(user, menuItem, httpMethod, apiPath) {
  },

}
