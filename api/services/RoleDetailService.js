module.exports = {

  checkRoleDetailHaveREADName: async({ data }) => {
    try {
      const findRoleDetail = await RoleDetail.findAll({
        where: {
          MenuItemId: data.MenuItemId,
          name: 'READ'
        }
      });
      for (var item in findRoleDetail) 
      {
        return true;
      }
      return false;
    } catch (e) {
      throw e;
    }
  },


}
