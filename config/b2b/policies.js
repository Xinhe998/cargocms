module.exports = {
  "api/admin/CategoryController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },
  "api/admin/CategoryDescriptionController": {
    '*': ['passport', 'sessionAuth', 'isAdmin'],
  },

  "b2b/OrderController": {
    '*': ['passport', 'sessionAuth'],
  },

  'b2b/MainController': {
    // 'portfolio': ['nocache'],
    'editPofile': ['nocache'],
    'validateEmail': [],
  },
}
