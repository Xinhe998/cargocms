module.exports.init = async () => {
  try {
    const {environment} = sails.config;

    let newMenuItems = [
      { icon: 'home', href: '/admin/dashboard', title: '控制台', sequence: 0},
      { icon: 'wrench', href: '#', title: '資料維護', sequence: 1},
      { icon: 'product-hunt', href: '#', title: '產品管理', sequence: 2},
      { icon: 'file-text', href: '#', title: '訂單管理', sequence: 3},
      { icon: 'truck', href: '#', title: '供應商', sequence: 4},
      { icon: 'sliders', href: '#', title: '設定', sequence: 160},

      { href: '/admin/user', title: '會員資料', sequence: 20, ParentMenuItemId: 2},
      { href: '/admin/message', title: '訊息', sequence: 140, ParentMenuItemId: 2},
      { href: '/admin/contact', title: '聯繫訊息', sequence: 150, ParentMenuItemId: 2},
      { href: '/admin/post', title: 'Q&A類別', sequence: 160, ParentMenuItemId: 2},
      { href: '/admin/event', title: 'Q&A內容', sequence: 170, ParentMenuItemId: 2},

      { href: '/admin/product', title: '產品', sequence: 20, ParentMenuItemId: 3},
      { href: '/admin/productdescription', title: '產品描述', sequence: 30, ParentMenuItemId: 3},
      { href: '/admin/productoption', title: '產品選項', sequence: 40, ParentMenuItemId: 3},
      { href: '/admin/category', title: '產品分類', sequence: 50, ParentMenuItemId: 3},

      { href: '/admin/order', title: '訂單', sequence: 20, ParentMenuItemId: 4},
      { href: '/admin/orderproduct', title: '產品訂單', sequence: 30, ParentMenuItemId: 4},
      { href: '/admin/orderpayment', title: '訂單付款資訊', sequence: 40, ParentMenuItemId: 4},
      { href: '/admin/orderpaymentstatus', title: '付款狀態', sequence: 50, ParentMenuItemId: 4},
      { href: '/admin/orderpaymenthistory', title: '訂單付款紀錄', sequence: 60, ParentMenuItemId: 4},
      { href: '/admin/orderhistory', title: '訂單歷程', sequence: 70, ParentMenuItemId: 4},


      { href: '/admin/supplier', title: '供應商清單', sequence: 20, ParentMenuItemId: 5},
      // { href: '/admin/suppliershiporder', title: '供應商出貨訂單', sequence: 30, ParentMenuItemId: 5},
      // { href: '/admin/suppliershiporderproduct', title: '供應商出貨單細項', sequence: 40, ParentMenuItemId: 5},
      { href: '/admin/suppliershiporderhistory', title: '供應商出貨單歷程', sequence: 50, ParentMenuItemId: 5},

      { href: '/admin/config?paymentSetting', title: 'ATM設定', sequence: 20, ParentMenuItemId: 6},
      { href: '/admin/config?taxrate', title: '結帳設定', sequence: 30, ParentMenuItemId: 6},


    ]

    let title = newMenuItems.map(item => item.title)
    let findMenuItems = await MenuItem.findAll({where:{title}})
    let findTitle = findMenuItems.map(item => item.title)

    let createMenuItems = title.reduce((result, title, index) => {
      if(findTitle.indexOf(title) == -1){
        result.push(newMenuItems[index])
        return result
      }
      return result
    }, [])


    await MenuItem.bulkCreate(createMenuItems);
  } catch (e) {
    console.error(e);
  }
};
