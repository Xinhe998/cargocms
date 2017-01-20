module.exports = {
  '/': {
    controller: 'b2b/ProductController',
    action: 'index'
  },

  'get /product': 'b2b/ProductController.index',

  'get /order/form': {
    // view: 'b2b/order/form'
    controller: 'b2b/OrderController',
    action: 'orderForm'
  },

  'get /ship/*': function(req, res, next) {
    res.sendfile(sails.config.appPath + '/react-app-ship/dist/index.html');
  },

  'get /api/admin/category': 'api/admin/CategoryController.find',
  'get /api/admin/category/:id': 'api/admin/CategoryController.findOne',
  'post /api/admin/category': 'api/admin/CategoryController.create',
  'put /api/admin/category/:id': 'api/admin/CategoryController.update',
  'delete /api/admin/category/:id': 'api/admin/CategoryController.destroy',

  'get /api/admin/categorydescription': 'api/admin/CategoryDescriptionController.find',
  'get /api/admin/categorydescription/:id': 'api/admin/CategoryDescriptionController.findOne',
  'post /api/admin/categorydescription': 'api/admin/CategoryDescriptionController.create',
  'put /api/admin/categorydescription/:id': 'api/admin/CategoryDescriptionController.update',
  'delete /api/admin/categorydescription/:id': 'api/admin/CategoryDescriptionController.destroy',

};
