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
          throw Error('已有商品揀貨完成，不能取消訂單');
        }
      }


      let supplierShipOrderProductIdArray = findSupplierShipOrderProduct.map((prod) => {
        prod = prod.toJSON();
        return prod.id;
      })
      let supplierShipOrder = await SupplierShipOrder.findById(id,{ transaction });
      supplierShipOrder.status = status;
      await supplierShipOrder.save({ transaction });

      const supplierShipOrderHistory = await SupplierShipOrderHistory.create({
        notify: true,
        comment: `出貨單 SupplierShipOrder ID: ${id}，狀態變更:${status}`,
        SupplierShipOrderId: id
      }, { transaction });

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
        }
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
        await OrderHistory.create({
          notify: true,
          comment: `訂單 ID: ${id} 的出貨單皆完成配送，修改狀態為 COMPLETED.`,
          OrderId: supplierShipOrder.OrderId
        },{ transaction });
      }

      transaction.commit();

      // Product Shipped, inform custom by send email.
      if (status === 'SHIPPED') {
        const order = await Order.findById(supplierShipOrder.OrderId);
        const productName = findSupplierShipOrderProduct.map((prod) => {
          prod = prod.toJSON();
          return prod.model;
        })
        const mailMessage = {};
        mailMessage.orderNumber = order.orderNumber;
        mailMessage.productName = productName.join(',');
        mailMessage.shippingName = order.shipplingLastName + order.shippingFirstName;
        mailMessage.phone = order.telephone;
        mailMessage.address = order.shippingPostcode + order.shippingCity + order.shippingAddress1;
        mailMessage.address = order.email;
        const messageConfig = await MessageService.orderProductShipped(mailMessage);
        const mail = await Message.create(messageConfig);
        await MessageService.sendMail(mail);
      }

      let message = 'update status success';
      return res.ok({ message });
    } catch (e) {
      transaction.rollback();
      res.serverError(e);
    }
  },
}
