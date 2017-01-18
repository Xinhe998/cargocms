module.exports = {
  'get /api/admin/userdetail': 'api/admin/UserDetailController.find',
  'get /api/admin/userdetail/:id': 'api/admin/UserDetailController.findOne',
  'post /api/admin/userdetail': 'api/admin/UserDetailController.create',
  'put /api/admin/userdetail/:id': 'api/admin/UserDetailController.update',
  'delete /api/admin/userdetail/:id': 'api/admin/UserDetailController.destroy',
};
