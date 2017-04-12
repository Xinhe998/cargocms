module.exports = {

  find: async (req, res) => {
    try {
      const { query, method, body } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      const include = [  ];
      const isPost = method === 'POST';
      let mServerSidePaging = isPost ? body.serverSidePaging : serverSidePaging;
      let mQuery = isPost ? body : query;
      let result;
      if (mServerSidePaging) {
        result = await PagingService.process({ query: mQuery, modelName, include });
      } else {
        const items = await sails.models[modelName].findAll({
          include
        });
        result = { data: { items } };
      }
      res.ok(result);
    } catch (e) {
      res.serverError(e);
    }
  },

  findOne: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await RoleDetail.findOne({
        where:{
          id
        },
        include: []
      });
      res.ok({data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      let data = req.body;
      let checkHaveREAD_WRITE = await RoleDetailService.checkHaveSameRole({ data, rolename: 'READ_WRITE' });
      let checkHaveREAD = await RoleDetailService.checkHaveSameRole({ data, rolename: 'READ' });
      let checkHaveSameRole = await RoleDetailService.checkHaveSameRole({ data, rolename: data.name });

      if((checkHaveREAD_WRITE || checkHaveREAD) && !checkHaveSameRole) {
        sails.log('1 data=>', data);
        const item = await RoleDetail.create(data);
        let message = 'Create success.';
        res.ok({ message, data: { item } } );
      } else if((!checkHaveREAD_WRITE || !checkHaveREAD) && !checkHaveSameRole) {
       sails.log('2 data=>', data);
        let addCreate = { name: 'READ', api: '', RoleId: data.RoleId, MenuItemId: data.MenuItemId  };
        await RoleDetail.create(addCreate);
        let itme = await RoleDetail.create(data);
        let message = 'Create success.';
        res.ok({ message, data: { item } } );
      } else {
        throw Error('此權限已存在!');
      }
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id, MenuItemId } = req.params;
      const data = req.body;
      let checkHaveSameRole = await RoleDetailService.checkHaveSameRole({ data, rolename: data.name  });

      if(!checkHaveSameRole) {
        const item = await RoleDetail.update(data ,{
          where: { id, },
        });

        let checkHaveREAD = await RoleDetailService.checkHaveSameRole({ data, rolename: 'READ' });
        if(!checkHaveREAD) {
          let addCreate = { name: 'READ', api: '', RoleId: data.RoleId, MenuItemId: data.MenuItemId  };
          await RoleDetail.create(addCreate);
        }

        const message = 'Update success.';
        res.ok({ message, data: { item } });
      } else {
        throw Error('此權限已存在!');
      }
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const MenuItemId = await  RoleDetail.findOne({ where: { id } });
      const findMenuItemId = await MenuItem.findOne({ where: { id: MenuItemId.dataValues.MenuItemId } });
      const loinUser = AuthService.getSessionUser(req).username;
      const checkAdminUpdateRolePage = (findMenuItemId.dataValues.title === '詳細權限' || findMenuItemId.dataValues.title === '權限') && loinUser === 'admin';
      if(checkAdminUpdateRolePage) {
        throw Error("無法刪除此權限！  刪除後將會造成此頁無法進入！");
      } else {
        const item = await RoleDetail.destroy({ where: { id } });
        let message = 'Delete success';
        res.ok({message, data: {item}});
      }
    } catch (e) {
      res.serverError(e);
    }
  }
}
