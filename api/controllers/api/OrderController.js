module.exports = {
  createOrder: async (req, res) => {
    try{
      let data = req.body;
      const loginUser = AuthService.getSessionUser(req);
      data.UserId = loginUser.id;

      if( data.firstname !== loginUser.firstName || data.lastname  !== loginUser.lastName){
        data.firstname = loginUser.firstName;
        data.lastname  = loginUser.lastName;
      }

      // some data can fetch from request
      data.userAgent = req.header["user-agent"] || '';
      data.ip = req.ip;
      // not sure which should record
      data.forwardedIp = req.headers["X-Real-IP"] || '';
      // data.forwardedIp = req.headers["X-Forwarded-For"] || '';
      data.acceptLanguage = req.header["accept-language"] || '';

      // check Product Numbers
      const products = JSON.parse(data.products);
      const stock = await ProductService.checkStock({products});
      if (!stock) throw Error('訂購的產品庫存量不足！');


      const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;

      const success = (order) => {
        const message = 'Order create success';
        return res.ok({
          message,
          data: {
            item: {
              orderNumber: order.orderNumber
            }
          }
        })

      };
      const error = () => {
        return res.redirect('/');
      };

      let transaction;
      return sequelize.transaction({ isolationLevel })
      .then(function (t) {
        transaction = t;
        return OrderService.createOrder(transaction, data);
      })
      .then(function(order){
        transaction.commit();
        success(order);
      })
      .catch(sequelize.UniqueConstraintError, function(e) {
        throw Error('此交易已失效，請重新下訂')
      })
      .catch(function(err) {
        sails.log.error('訂單建立 Order 失敗', err.toString());
        transaction.rollback();
        error();
      });

    } catch (e) {
      res.serverError(e);
    }
  },

  getOrderInfo: async (req, res) => {
    try{
      const orderNumber = req.params.orderNumber;
      const order = await Order.findOne({
        where: {
          orderNumber
        },
        include: [ User , OrderStatus ]
       });
      const loginUser = AuthService.getSessionUser(req);
      let message = '';
      if(!order){
        return res.notFound();
      }

      if(!loginUser || loginUser.id !== order.UserId){
        message = '您沒有足夠權限瀏覽此網頁';
        return res.forbidden(message);
      }

      const orderProduct = await OrderProduct.findAll({
        where: {
          OrderId: order.id
        }
      })

      message = 'get Order info success';

      res.view('b2b/order/index',{
        message: message,
        data: {
          item: order,
          product: orderProduct,
        }
      });

    } catch(e) {
      res.serverError(e);
    }
  },
  getOrderHistory: async (req, res) => {
    try{
      let user = AuthService.getSessionUser(req);

      let message = ''
      if(!user){
        message = '您沒有權限瀏覽此網頁，請先登入。';
        return res.forbidden(message);
      }

      const items = await Order.findAll({
        where: {
          UserId: user.id
        },
        include: [OrderStatus, OrderProduct],
        order: [['createdAt', 'DESC']],
      })

      message = 'get order history success.';
      res.view('b2b/order/orderhistory',{
        message,
        data:{
          items
        }
      });

    } catch (e) {
      res.serverError(e);
    }
  }
}
