describe('about Role Service operation.', function() {

  let testRole, testRoleUser, testMenuItem;
  before(async (done) => {
    try {
      testRole = await Role.findOrCreate({
        where: {authority: 'RoleServiceTest'},
        defaults: {authority: 'RoleServiceTest'}
      });
      testRole = testRole[0].dataValues;

      testRoleUser = await User.findOne({
        where: {username: 'testRoleUser'}
      });
      if(testRoleUser == null){
        testRoleUser = await User.create({
          username: 'testRoleUser',
          email: 'testRoleUser@example.com',
          firstName: 'test',
          lastName: 'RoleUser'
        })
      }
      await testRoleUser.addRole(testRole.id);

      testMenuItem = await MenuItem.create({
        icon: 'home',
        href: '/admin/testRoleUserService',
        title: 'test',
        sequence: 0
      });

      await RoleDetail.create({
        name: "READ",
        MenuItemId: testMenuItem.id,
        RoleId: testRole.id
      });

      done();
    } catch (e) {
      done(e)
    }
  });

  it.only('取得 User 及其所屬 Group 所有 Role', async (done) => {
    try {
      await RoleService.getUserAllRole({
        user: testRoleUser
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('取得 User 及其所屬 Group 是否有特定 Role 存在', async (done) => {
    RoleService.hasRole();
  });

  it('取得 User 及其所屬 Group 可以存取之 MenuItem', async (done) => {
    RoleService.getAccessibleMenuItems();
  });

  it('取得 User 及其所屬 Group 特定 RoleDetail 是否存在(MenuItem)', async (done) => {
    RoleService.hasRoleDetailOfMenuItem();
  });

  it('取得 User 及其所屬 Group 可否存取特定 API', async (done) => {
    RoleService.canAccessApi();
  });

});
