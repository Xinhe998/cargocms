describe.skip('about Role Service operation.', function() {

  it('取得 User 及其所屬 Group 所有 Role', async (done) => {
    RoleService.getAllRole();
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
