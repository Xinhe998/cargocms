//
// const ScentNoteData = require('./data/ScentNote');
// const ScentData = require('./data/Scent');
// const ScentDetail = require('./data/ScentDetail.json');
// const FeelingData = require('./data/Feeling');
const products = require('./data/Product.json');
const parts = require('./data/Part.json');
const performances = require('./data/Performance.json');

module.exports.init = async () => {
  try {
    const {environment} = sails.config;

    sails.log.debug('>>>> config/init/jason >>>>');
    let newMenuItems = [
      { icon: 'home', href: '/admin/dashboard', title: '控制台', sequence: 0},
      { icon: 'wrench', href: '#', title: '資料維護', sequence: 1},
      // { icon: 'puzzle-piece', href: '#', title: '實驗室', sequence: 2},

      // { href: '/admin/user', title: '會員資料', sequence: 20, ParentMenuItemId: 2},
      // { href: '/admin/post', title: '內容資料', sequence: 30, ParentMenuItemId: 2},
      { href: '/admin/message', title: '產品介紹管理', sequence: 20, ParentMenuItemId: 2},
      { href: '/admin/message', title: '周邊配件管理', sequence: 30, ParentMenuItemId: 2},
      { href: '/admin/message', title: '工程實績管理', sequence: 40, ParentMenuItemId: 2},

      // { href: '/admin/labfnp/recipe', title: '配方資料', sequence: 40, ParentMenuItemId: 2},
      // { href: '/admin/labfnp/scent', title: '香味分子', sequence: 50, ParentMenuItemId: 2},
      // { href: '/admin/labfnp/scentnote', title: '香調', sequence: 60, ParentMenuItemId: 2},
      // { href: '/admin/labfnp/feeling', title: '感覺', sequence: 70, ParentMenuItemId: 2},
      // { href: '/admin/slogan', title: '口號', sequence: 80, ParentMenuItemId: 2},
      // { href: '/admin/allpay', title: '訂單', sequence: 90, ParentMenuItemId: 2},
      // { href: '/admin/mock', title: '隨機資料表', sequence: 20, ParentMenuItemId: 3},
      // { href: '/admin/facebook/feed', title: '動態', sequence: 110, ParentMenuItemId: 2}

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
    //
    // const productGroups = [
    //   {
    //     title: '輕型自動門機',
    //     name: '123',
    //     type: 'product',
    //   },{
    //     title: '中型自動門機',
    //     name: '123',
    //     type: 'product',
    //   },{
    //     title: '重型自動門機',
    //     name: '123',
    //     type: 'product',
    //   },{
    //     title: '重疊型自動門機',
    //     name: '123',
    //     type: 'product',
    //   },{
    //     title: '圓弧型自動門機',
    //     name: '123',
    //     type: 'product',
    //   }
    // ];
    // productGroups.map(async (item, i) => {
    //   item.sequence = i
    //   await Group.create(item);
    // });
    //
    // const partGroups = ['無線觸摸開關', '紅外線感應器', '各式感應開關', '對照式安全光線', '感應卡機及電鎖', '自動門耗材', '免灌膠玻璃上下料'];
    // partGroups.map(async (item, i) => {
    //   let newGroup = { title: item };
    //   newGroup.sequence = i;
    //   newGroup.name = '123';
    //   newGroup.type = 'part';
    //   await Group.create(newGroup);
    // });
    //
    // const performanceGroups = ['上市櫃、高科技', '學校、公家機構', '生技、醫療業', '食品餐飲業', '服務、製造業', '門市、連鎖超商', '大樓、華廈社區'];
    // performanceGroups.map(async (item, i) => {
    //   let newGroup = { title: item };
    //   newGroup.sequence = i;
    //   newGroup.name = '123';
    //   newGroup.type = 'performance';
    //   await Group.create(newGroup);
    // });
    //
    // products.rows.forEach((e) => {
    //   Post.createItem(Object.assign({}, e, { itemType: Product }))
    // });
    //
    // parts.rows.forEach((e) => {
    //   Post.createItem(Object.assign({}, e, { itemType: Part }))
    // });
    //
    // performances.rows.forEach((e) => {
    //   Post.createPerformance(e)
    // });

  } catch (e) {
    console.error(e);
  }
};
