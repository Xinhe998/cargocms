describe('about Role Service operation.', function() {

  it('取得 User 及其所屬 Group 所有 Role', async (done) => {
    RoleService.getAllRole();
  });

  it('取得 User 及其所屬 Group 可以存取之 MenuItem', async (done) => {
    RoleService.getRoleOfMenuItems();
  });

  it('取得 User 及其所屬 Group 特定 Role 是否存在', async (done) => {
    RoleService.hasRole();
  });

});
