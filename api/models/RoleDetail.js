module.exports = {
  attributes: {
    name: {
      type: Sequelize.ENUM("READ_WRITE", "READ", "CREATE", "UPDATE", "DELETE"),
      defaultValue: 'READ_WRITE',
    },
    api: {
      type: Sequelize.STRING
    }

  },

  associations: function() {
    RoleDetail.belongsTo(MenuItem)
  },
  options: {
  }

};
