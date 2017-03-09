module.exports = {
  attributes: {
    authority: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(255),
      allowNull: false,
    }
  },

  associations: function() {
    Role.hasMany(RoleDetail);
  },
  options: {
  }

};
