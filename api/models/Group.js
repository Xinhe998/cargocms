module.exports = {
  attributes: {
    name: Sequelize.STRING,
    description: Sequelize.STRING
  },

  associations: function() {
    
    Group.belongsToMany(Role, {

      through: 'GroupRole',
      foreignKey: {
        name: 'RoleId',
        as: 'Groups'
      }
    });

    Role.belongsToMany(Group, {
      through: 'GroupRole',
      foreignKey: {
        name: 'GroupId',
        as: 'Roles'
      }
    });

  },
  options: {
  }

};
