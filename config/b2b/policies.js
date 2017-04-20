module.exports = {
  "api/admin/CategoryController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },
  "api/admin/CategoryDescriptionController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/ProductDescriptionController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/ProductController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/ProductOptionController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/SupplierController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },
  "api/admin/SupplierShipOrderController": {
    '*': ['passport', 'sessionAuth', 'isSupplier'],
    // '*': [],
  },
  "api/admin/SupplierShipOrderProductController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/OrderController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/OrderPaymentController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/OrderPaymentStatusController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/OrderPaymentHistoryController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/SupplierShipOrderHistoryController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "api/admin/OrderHistoryController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "b2b/OrderController": {
    'orderForm': ['passport', 'sessionAuth', 'validEmail'],
  },

  "api/OrderController": {
    '*': ['passport', 'sessionAuth', 'validEmail'],
  },

  "api/ConfirmOrderController": {
    '*': ['passport', 'sessionAuth'],
  },

  'b2b/MainController': {
    // 'portfolio': ['nocache'],
    'editPofile': ['nocache'],
    'validateEmail': [],
  },
}
