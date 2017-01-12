module.exports = {
  attributes: {
    name: Sequelize.STRING
  },

  associations: function() {
    RoleDetail.belongsTo(MenuItem)
  },
  options: {
  }

};
