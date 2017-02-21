module.exports = {
  attributes: {
    rank: {
      type: Sequelize.INTEGER(32),
      allowNull: false,
    },
    url: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    recordDate: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    createdDateTime:{
      type: Sequelize.VIRTUAL,
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
      get: function(){
        try{
          return UtilsService.DataTimeFormat(this.getDataValue('updatedAt'));
        } catch(e){
          sails.log.error(e);
        }
      }
    }
  },
  associations: () => {
    // SearchPeckerLog.belongsTo(SearchPecker);
  },
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
