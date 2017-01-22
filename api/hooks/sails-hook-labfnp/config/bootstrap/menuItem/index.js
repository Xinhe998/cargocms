module.exports.init = async () => {
  try {
    const {environment} = sails.config;

    let newMenuItems = [
      { icon: 'home', href: '/admin/dashboard', title: '控制台', sequence: 0},
      { icon: 'wrench', href: '#', title: '資料維護', sequence: 1},
      { icon: 'puzzle-piece', href: '#', title: '實驗室', sequence: 2},

      { href: '/admin/user', title: '會員資料', sequence: 20, ParentMenuItemId: 2},
      { href: '/admin/post', title: '內容資料', sequence: 30, ParentMenuItemId: 2},
      { href: '/admin/event', title: '活動票券', sequence: 40, ParentMenuItemId: 2},
      { href: '/admin/labfnp/recipe', title: '配方資料', sequence: 50, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scent', title: '香味分子', sequence: 60, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scentnote', title: '香調', sequence: 70, ParentMenuItemId: 2},
      { href: '/admin/labfnp/scentfeedback', title: '香調回饋', sequence: 80, ParentMenuItemId: 2},
      { href: '/admin/labfnp/feeling', title: '感覺', sequence: 90, ParentMenuItemId: 2},
      { href: '/admin/quote', title: '箴言', sequence: 100, ParentMenuItemId: 2},
      { href: '/admin/allpay', title: '訂單', sequence: 110, ParentMenuItemId: 2},
      { href: '/admin/eventallpay', title: '票券訂單', sequence: 120, ParentMenuItemId: 2},
      { href: '/admin/facebook/feed', title: '動態', sequence: 130, ParentMenuItemId: 2},
      { href: '/admin/message', title: '訊息', sequence: 140, ParentMenuItemId: 2},
      { href: '/admin/contact', title: '聯繫訊息', sequence: 150, ParentMenuItemId: 2},
      { href: '/admin/mock', title: '隨機資料表', sequence: 20, ParentMenuItemId: 3},

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
