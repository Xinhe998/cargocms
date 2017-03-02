module.exports = {
  attributes: {
    name: {
      type: Sequelize.ENUM('READ_WRITE','READ','CREATE','UPDATE','DELETE'),
      defaultValue: 'READ_WRITE',
    },
    api: {
      type: Sequelize.STRING(255),
      defaultValue: null,
    },
    createdDateTime:{
      type: Sequelize.VIRTUAL,
      allowNull: false,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('createdAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },
    updatedDateTime:{
      type: Sequelize.VIRTUAL,
      allowNull: false,
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    },
    RoleId: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    MenuItemId: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
  },
  associations: () => {},
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
