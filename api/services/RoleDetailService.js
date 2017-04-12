module.exports = {

  checkHaveSameRole: async({ data, rolename }) => {
    try {
      const findRoleDetail = await RoleDetail.findAll({
        where: {
          MenuItemId: data.MenuItemId,
          name: rolename,
        },
      });
      if(Object.keys(findRoleDetail).length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      throw e;
    }
  },

}
