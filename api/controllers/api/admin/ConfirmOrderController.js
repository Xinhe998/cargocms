module.exports = {
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

  confirm: async (req, res) => {
    const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    let transaction = await sequelize.transaction({ isolationLevel });
    try{
      const { id } = req.params;
      const { tracking, orderConfirmComment, confirmOrderData } = req.body;
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
        // const productSupplierId = orderProduct.Product.SupplierId;
        let productSupplierId = '';
        for (const orderProductConfirmData of confirmOrderData) {
          if (orderProduct.id == orderProductConfirmData.orderProductId) {
            productSupplierId = orderProductConfirmData.supplierId;
            break;
          }
        }

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
            option: orderProduct.option,
          }
        );

        supplierShipOrderTotalList[productSupplierId] += Number(orderProduct.total);

        orderProductsName.push({
          name: orderProduct.name,
          quantity: orderProduct.quantity,
          price: orderProduct.price,
          total: orderProduct.total,
          option: orderProduct.option,
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
        const orderProductStringTable = await OrderService.stringOrderProduct({ modelName:'orderproduct' , orderId: order.id });
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

        //supplier ship order info email
        const supplierShipOrders = await SupplierShipOrder.findAll({ where: { OrderId: order.id } });
        for (const shipOrder of supplierShipOrders) {
          const supplier = await Supplier.findById(shipOrder.SupplierId);
          const shipOrderProductTable = await OrderService.stringOrderProduct({ modelName:'suppliershiporderproduct' , orderId: shipOrder.id });
          const mailMessage = {
            email: supplier.email,
            supplier: supplier.name,
            serialNumber: shipOrder.shipOrderNumber,
            productName: shipOrderProductTable,
            shipmentUsername: `${shipOrder.lastname}${shipOrder.firstname}`,
            shipmentAddress: shipOrder.shippingAddress1,
            shipmentEmail: shipOrder.shippingEmail,
            phone: shipOrder.shippingTelephone,
          };
          const messageConfig = await MessageService.shipOrderCreated(mailMessage);
          const supplierEmail = await Message.create(messageConfig);
          await MessageService.sendMail(supplierEmail);
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
}
