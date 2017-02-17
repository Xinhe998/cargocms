module.exports = {
  attributes: {
    keywords: {
      type: Sequelize.STRING(255),
      allowNull: false,
      set: function (val) {
        if (val) {
          this.setDataValue('keywords', JSON.stringify(val));
        } else {
          this.setDataValue('keywords', '[]');
        }
      },
      get: function () {
        try {
          var keywords = this.getDataValue('keywords');
          if (keywords) {
            return JSON.parse(keywords);
          } else {
            return [];
          }
        } catch (e) {
          console.log(e);
          return [];
        }
      }
    },

    crawlerAgent: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    reportHtml: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    reportImage: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    pageNo: {
      type: Sequelize.INTEGER(32),
      allowNull: false,
    },

    pageNoPrev: {
      type: Sequelize.INTEGER(32),
      allowNull: false,
    },

    pageNoWarn: {
      type: Sequelize.INTEGER(32),
      allowNull: false,
    },

    targetUrl: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },

    searchEngine: {
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
  associations: () => {},
  options: {
    classMethods: {},
    instanceMethods: {},
    hooks: {}
  }
};
