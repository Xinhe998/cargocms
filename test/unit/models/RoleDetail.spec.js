

describe('about RoleDetail model operation.', function() {
  describe('新增 RoleDetail', function() {
    let testRole, testRoleUser, testMenuItem;
    before(async (done) => {
      try {
        testRole = await Role.findOrCreate({
          where: {authority: 'test'},
          defaults: {authority: 'test'}
        });

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

        testMenuItem = await MenuItem.create({
          icon: 'home',
          href: '/admin/test',
          title: 'test',
          sequence: 0
        });
        done();
      } catch (e) {
        done(e)
      }
    });

    it('建立允許全部操作之權限', async (done) => {
      try {

        RoleDetail.create({
          name: "READ_WRITE",
          MenuItemId: testMenuItem.id,
          RoleId: testRole.id
        });

        done();
      } catch (e) {
        done(e)
      }
    });

    it('建立允許部分操作之權限', async (done) => {
      try {

        RoleDetail.create({
          name: "READ",
          MenuItemId: testMenuItem.id,
          RoleId: testRole.id
        });

        RoleDetail.create({
          name: "UPDATE",
          MenuItemId: testMenuItem.id,
          RoleId: testRole.id
        });

        RoleDetail.create({
          name: "DELETE",
          MenuItemId: testMenuItem.id,
          RoleId: testRole.id
        });

        RoleDetail.create({
          name: "CREATE",
          MenuItemId: testMenuItem.id,
          RoleId: testRole.id
        });

        done();
      } catch (e) {
        done(e)
      }
    });

  });

});
