module.exports = {

  find: async (req, res) => {
    try {
      const { query, method, body } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      const include = [ SupplierShipOrderProduct, Supplier, Order ];
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
      const item = await SupplierShipOrder.findOne({
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
      const item = await SupplierShipOrder.create(data);
      let message = 'Create success.';
      res.ok({ message, data: { item } } );
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const message = 'Update success.';
      const item = await SupplierShipOrder.update(data ,{
        where: { id, },
      });
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await SupplierShipOrder.destroy({ where: { id } });
      let message = 'Delete success';
      res.ok({message, data: {item}});
    } catch (e) {
      res.serverError(e);
    }
  },

  status: async (req, res) => {
    const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    let transaction = await sequelize.transaction({isolationLevel});
    try {
      const { id } = req.params;
      const { status, comment } = req.body;

      let findSupplierShipOrderProduct = await SupplierShipOrderProduct.findAll({
        where: {
          SupplierShipOrderId: id
        }
      });

      if (status == 'CANCELLED') {
        let checkSupplierShipOrderProductHasCOMPLETED = await SupplierShipOrderProduct.findAll({
          where: {
            SupplierShipOrderId: id,
            status: 'COMPLETED',
          }
        });
        if (checkSupplierShipOrderProductHasCOMPLETED.length > 0) {
          await SupplierShipOrderHistory.create({
            notify: true,
            comment: `取消出貨單操作：失敗，已有商品揀貨完成，不能取消訂單。 SupplierShipOrder ID: ${id}`,
            SupplierShipOrderId: id
          });
          return res.ok({ success: false, message: '已有商品揀貨完成，不能取消訂單'});
        }
      }


      let supplierShipOrderProductIdArray = findSupplierShipOrderProduct.map((prod) => {
        prod = prod.toJSON();
        return prod.id;
      })
      let supplierShipOrder = await SupplierShipOrder.findById(id);
      supplierShipOrder.status = status;
      await supplierShipOrder.save({ transaction });

      await SupplierShipOrderProduct.update({ status }, {
        where: {
          id: supplierShipOrderProductIdArray
        },
        transaction
      });


      let shipOrderCompleted = true;
      let checkShipOrderCompleted = await SupplierShipOrder.findAll({
        where: {
          OrderId: supplierShipOrder.OrderId
        },
        transaction
      });
      for (let i = 0; i < checkShipOrderCompleted.length; i++) {
        if (checkShipOrderCompleted[i].status !== 'COMPLETED') {
          shipOrderCompleted = false;
          break;
        }
      }
      if (shipOrderCompleted) {
        const orderstatus = await OrderStatus.findOne({
          where: {
            name: 'COMPLETED'
          }
        });
        await Order.update({OrderStatusId: orderstatus.id}, {
          where: {
            id: supplierShipOrder.OrderId
          },
          transaction
        });

      }

      transaction.commit();

      // Product Shipped, inform custom by send email.
      try {
        if (status === 'SHIPPED') {
          const order = await Order.findById(supplierShipOrder.OrderId);
          console.log("## the Order ==>", order);
          const productName = findSupplierShipOrderProduct.map((prod) => {
            prod = prod.toJSON();
            return prod.model;
          })
          console.log("## product names =>",productName);
          const mailMessage = {};
          mailMessage.orderNumber = order.orderNumber;
          mailMessage.productName = productName.join('<br />');
          mailMessage.shippingName = order.shippingLastname + order.shippingFirstname;
          mailMessage.username  = order.displayName;
          mailMessage.telephone = order.telephone;
          mailMessage.address = order.shippingPostcode + order.shippingCity + order.shippingAddress1;
          mailMessage.email = order.email;
          const messageConfig = await MessageService.orderProductShipped(mailMessage);
          console.log("messageConfig ==>",messageConfig);
          const mail = await Message.create(messageConfig);
          await MessageService.sendMail(mail);
        }
      } catch (e) {
        sails.log.error(e);
      }

      let message = 'update status success';
      return res.ok({ message });
    } catch (e) {
      transaction.rollback();
      res.serverError(e);
    }
  },
}
