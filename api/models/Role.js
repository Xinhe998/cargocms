module.exports = {
  attributes: {
    authority: Sequelize.STRING
  },

  associations: function() {
    Role.hasMany(RoleDetail);
  },
  options: {
  }

};
