import moment from 'moment';
import sh from 'shorthash';

module.exports = {

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      const include = [OrderStatus];
      if (serverSidePaging) {
        result = await PagingService.process({query, modelName, include});
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
      const item = await Order.findOne({
        where: {
          id: id
        },
        include: [
          OrderStatus,
          {
            model: OrderProduct,
            include: {
              model: Product,
              include: Supplier
            }
          },
        ]
      });
      res.ok({ data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  create: async (req, res) => {
    try {
      const data = req.body;

      data.customField = '';
      data.paymentCompany = '';
      data.paymentAddress2 = '';
      data.paymentCountry = '';
      data.paymentCountryId = 0;
      data.paymentZone = '';
      data.paymentZoneId = 0;
      data.paymentAddressFormat = '';
      data.paymentCustomField = '';
      data.shippingCompany = '';
      data.shippingAddress2 = '';
      data.shippingCountry = '';
      data.shippingCountryId = 0;
      data.shippingZone = '';
      data.shippingZoneId = 0;
      data.shippingAddressFormat = '';
      data.shippingCustomField = '';
      data.commission = 0.0;
      data.marketingId = 0;
      data.languageId = 0;
      data.ip = '';
      data.forwardedIp = '';
      data.userAgent = '';
      data.acceptLanguage = '';

      const message = 'Create success.';
      const item = await Order.create(data);

      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      data.customField = '';
      data.paymentCompany = '';
      data.paymentAddress2 = '';
      data.paymentCountry = '';
      data.paymentCountryId = 0;
      data.paymentZone = '';
      data.paymentZoneId = 0;
      data.paymentAddressFormat = '';
      data.paymentCustomField = '';
      data.shippingCompany = '';
      data.shippingAddress2 = '';
      data.shippingCountry = '';
      data.shippingCountryId = 0;
      data.shippingZone = '';
      data.shippingZoneId = 0;
      data.shippingAddressFormat = '';
      data.shippingCustomField = '';
      data.commission = 0.0;
      data.marketingId = 0;
      data.languageId = 0;
      // data.ip = '';
      // data.forwardedIp = '';
      // data.userAgent = '';
      data.acceptLanguage = '';

      const message = 'Update success.';
      const item = await Order.update(data ,{
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
      const item = await Order.destroy({ where: { id } });
      const message = 'Delete success.';
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
    }
  },

  confirm: async (req, res) => {
    const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    let transaction = await sequelize.transaction({ isolationLevel });
    try{
      const { id } = req.params;
      const { tracking, orderConfirmComment } = req.body;
      const user = AuthService.getSessionUser(req);

      let orderProducts = await OrderProduct.findAll({
        where:{
          OrderId: id
        },
        include:[ Order, Product]
      });

      let orderStatus, order;
      try {
        orderStatus = await OrderStatus.findOne({ where: { name: 'PROCESSING' } });
        if (!orderStatus.id) {
          return res.ok({ success: false, message: 'status PROCESSING is not exist!' });
        }
        order = await Order.findById(id);
        if (!order.id) {
          return res.ok({ success: false, message: `order id ${id} is not exist!` });
        }
      } catch (e) {
        sails.log.error(e);
      }

      await Order.update({
        tracking: tracking,
        OrderStatusId: orderStatus.id
      },{
        where: {
          id
        },
        transaction
      })

      await OrderHistory.create({
        notify: true,
        // comment: `訂單 ID: ${id} 確認訂單，確認理由：${orderConfirmComment}.`,
        comment: `使用者 ID: ${user.id} 操作，訂單 ID: ${id} 確認訂單.`,
        OrderId: order.id,
        OrderStatusId: orderStatus.id,
      }, { transaction });

      sails.log.info('Order CONFIRM', Order);

      let suppliers = [];
      let supplierOrderProduts = {}; //將 orderProduct 利用 supplier ID 作索引分類 supplier 的 supplierOrderProduct
      let supplierShipOrderTotalList = {}; // 利用 supplier Id 作索引，分類出供應商產品價格數量的加總
      let orderProductsName = [];
      for (const orderProduct of orderProducts) {
        const productSupplierId = orderProduct.Product.SupplierId;
        if (suppliers.indexOf(productSupplierId) === -1) {
          suppliers.push(productSupplierId);
          supplierOrderProduts[productSupplierId] = [];
          supplierShipOrderTotalList[productSupplierId] = 0;
        }

        supplierOrderProduts[productSupplierId].push(
          {
            SupplierShipOrderId: 0,
            ProductId: orderProduct.ProductId,
            name: orderProduct.name,
            model: orderProduct.model,
            quantity: orderProduct.quantity,
            price: orderProduct.price,
            total: orderProduct.total,
            tax: orderProduct.tax,
            status: 'NEW',
          }
        );

        supplierShipOrderTotalList[productSupplierId] += Number(orderProduct.total);

        orderProductsName.push({
          name: orderProduct.name,
          quantity: orderProduct.quantity,
          price: orderProduct.price,
          total: orderProduct.total
        });
      }


      for (const supplier of suppliers) {
        // 產生Ship訂單編號
        let shipOrderNumber = await OrderService.orderNumberGenerator({
          modelName: 'suppliershiporder',
          userId: order.UserId,
          product: JSON.stringify(orderProductsName)
        });
        sails.log.info('產生出貨單編號:', shipOrderNumber);
        const taxrate = sails.config.taxrate || 0;
        const total = supplierShipOrderTotalList[supplier];
        const tax   = Math.round(total * taxrate);
        const totalIncludeTax = total + tax;

        const newSupplierShipOrder = await SupplierShipOrder.create({
          shipOrderNumber: shipOrderNumber,
          OrderId: id,
          SupplierId: supplier,
          invoiceNo: order.invoiceNo,
          invoicePrefix: order.invoicePrefix,
          firstname: order.firstname,
          lastname: order.lastname,
          email: order.email,
          telephone: order.telephone,
          fax: order.fax,
          customField: order.customField,
          paymentFirstname: order.paymentFirstname,
          paymentLastname: order.paymentLastname,
          paymentCompany: order.paymentCompany,
          paymentAddress1: order.paymentAddress1,
          paymentAddress2: order.paymentAddress2,
          paymentCity: order.paymentCity,
          paymentPostcode: order.paymentPostcode,
          paymentCountry: order.paymentCountry,
          paymentCountryId: order.paymentCountryId,
          paymentZone: order.paymentZone,
          paymentZoneId: order.paymentZoneId,
          paymentAddressFormat: order.paymentAddressFormat,
          paymentCustomField: order.paymentCustomField,
          paymentMethod: order.paymentMethod,
          paymentCode: order.paymentCode,
          shippingFirstname: order.shippingFirstname,
          shippingLastname: order.shippingLastname,
          shippingCompany: order.shippingCompany,
          shippingAddress1: order.shippingAddress1,
          shippingAddress2: order.shippingAddress2,
          shippingCity: order.shippingCity,
          shippingPostcode: order.shippingPostcode,
          shippingCountry: order.shippingCountry,
          shippingCountryId: order.shippingCountryId,
          shippingZone: order.shippingZone,
          shippingZoneId: order.shippingZoneId,
          shippingAddressFormat: order.shippingAddressFormat,
          shippingCustomField: order.shippingCustomField,
          shippingMethod: order.shippingMethod,
          shippingCode: order.shippingCode,
          comment: order.comment,
          total: total,
          tax: tax,
          totalIncludeTax: totalIncludeTax,
          commission: order.commission,
          tracking: order.tracking,
          ip: order.ip,
          forwardedIp: order.forwardedIp,
          userAgent: order.userAgent,
          acceptLanguage: order.acceptLanguage,
          status: 'NEW',
          shippingEmail: order.shippingEmail,
          shippingTelephone: order.shippingTelephone,
        }, { transaction });

        for (let shipOrderProduct of supplierOrderProduts[supplier]) {
          shipOrderProduct.SupplierShipOrderId = newSupplierShipOrder.id;
          await SupplierShipOrderProduct.create(shipOrderProduct, {transaction});
        }
      }

      transaction.commit();

      console.log('Order=>', order);
      console.log('Order.orderNumber=>', order.orderNumber);
      try {
        const orderProductStringTable = await OrderService.stringOrderProduct({orderId: order.id});
        let mailMessage = {
          email: order.email,
          serialNumber: order.orderNumber,
          username: `${order.lastname}${order.firstname}`,
          productName: orderProductStringTable,
          shipmentUsername: `${order.lastname}${order.firstname}`,
          shipmentAddress: order.shippingAddress1,
          note: order.comment,
          phone: order.shippingTelephone,
        };
        let messageConfig = await MessageService.orderConfirm(mailMessage);
        const mail = await Message.create(messageConfig);
        await MessageService.sendMail(mail);

        if (order.email !== order.shippingEmail) {
          mailMessage.email = order.shippingEmail;
          messageConfig = await MessageService.orderConfirm(mailMessage);
          let shippingMail = await Message.create(messageConfig);
          await MessageService.sendMail(shippingMail);
        }
        
      } catch (e) {
        sails.log.error(e);
      }

      const message = 'Success Confirm Order';
      const item = order;
      res.ok({ message, data: { item } });
    } catch (e) {
      transaction.rollback();
      res.serverError(e);
    }
  },

  updateStatus: async (req, res) => {
    try{
      const { id } = req.params;
      const { status } = req.body;

      const orderStatus = await OrderStatus.findOne({
        where: {
          name: status
        }
      });

      const item = await Order.find({
        where: {
          id,
        },
      });
      item.OrderStatusId = orderStatus.id;
      await item.save();

      await OrderHistory.create({
        notify: true,
        comment: `訂單 ID:${id} 變更狀態為:${status}`,
        OrderId: id,
        OrderStatudId: orderStatus.id
      });

      let messageConfig, mail;
      switch (status) {
        case 'PROCESSING':
          console.log('mail@PROCESSING');
          messageConfig = await MessageService.orderConfirm({
            email: item.email,
            serialNumber: item.orderNumber,
            username: `${item.lastname}${item.firstname}`,
          });
          break;
      }
      mail = await Message.create(messageConfig);
      await MessageService.sendMail(mail);

      const message = '訂單狀態變更成功.';
      const itemId = item.id;
      res.ok({ message, data: { itemId } });

    } catch (e) {
      res.serverError(e);
    }
  }
}
