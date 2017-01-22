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
  }
};
