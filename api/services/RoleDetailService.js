module.exports = {

  checkRoleDetailHaveREADName: async({ data }) => {
    try {
      const findRoleDetail = await RoleDetail.findAll({
        where: {
          MenuItemId: data.MenuItemId,
        },
      });
      for(let item of findRoleDetail) {
        if(item.dataValues.name === 'READ' || item.dataValues.name === 'READ_WRITE') {
          return true;
        }
      }
      return false;
    } catch (e) {
      throw e;
    }
  },

  checkHaveSameRole: async({ data }) => {
    try {
      const findRoleDetail = await RoleDetail.findAll({
        where: {
          MenuItemId: data.MenuItemId,
          name: data.name
        }
      });
      for (var item in findRoleDetail) {
        return true;
      }
      return false;
    } catch (e) {
      throw e;
    }
  },

}
