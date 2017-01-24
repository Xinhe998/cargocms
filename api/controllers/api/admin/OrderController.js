import moment from 'moment';
import sh from 'shorthash';

module.exports = {

  find: async (req, res) => {
    try {
      const { query } = req;
      const { serverSidePaging } = query;
      const modelName = req.options.controller.split("/").reverse()[0];
      let result;
      if (serverSidePaging) {
        const include = [OrderStatus, OrderProduct];
        result = await PagingService.process({query, modelName, include});
      } else {
        const items = await sails.models[modelName].findAll({
          include: [OrderStatus, OrderProduct]
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
        include: [OrderStatus, OrderProduct]
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
    const transaction = await sequelize.transaction({ isolationLevel });
    try{
      const { id } = req.params;
      const { tracking, orderConfirmComment } = req.body;

      let orderProducts = await OrderProduct.findAll({
        where:{
          OrderId: id
        },
        include:[ Order, Product]
      });

      const orderStatus = await OrderStatus.findOne({ where: { name: 'PROCESSING' } });
      if (!orderStatus.id) {
        throw new Error('status PROCESSING is not exist!');
      }
      const order = await Order.findById(id);
      if (!order.id) {
        throw new Error(`order id ${id} is not exist!`);
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
        comment: `訂單 ID: ${id} 確認訂單.`,
        OrderId: order.id
      }, { transaction });

      sails.log.info('Order CONFIRM', Order);

      let suppliers = [];
      let supplierOrderProduts = {}; //將 orderProduct 利用 supplier ID 作索引分類 supplier 的 supplierOrderProduct
      let supplierShipOrderTotalList = {}; // 利用 supplier Id 作索引，分類出供應商產品價格數量的加總
      for (const orderProduct of orderProducts) {

        if (suppliers.indexOf(orderProduct.Product.SupplierId) === -1) {
          suppliers.push(orderProduct.Product.SupplierId);
          supplierOrderProduts[orderProduct.Product.SupplierId] = [];
          supplierShipOrderTotalList[orderProduct.Product.SupplierId] = 0;
        }

        supplierOrderProduts[orderProduct.Product.SupplierId].push(
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

        supplierShipOrderTotalList[orderProduct.Product.SupplierId] += Number(orderProduct.total);
      }

      const orderProductsName = orderProducts.map(data => data.name);

      let supplierShipOrderCreateList = [];

      for (const supplier of suppliers) {
        // 產生Ship訂單編號
        const date = moment(new Date(), moment.ISO_8601).format("YYYYMMDD");
        let second = new Date().getTime().toString();
        second = second.substr( second.length - 4 );
        const _where = {
          where: sequelize.where(
            User.sequelize.fn('DATE_FORMAT', User.sequelize.col('createdAt'), '%Y%m%d'), date
        )};
        let shipOrderNumber = await SupplierShipOrder.findAll(_where);
        if (shipOrderNumber) {
          shipOrderNumber = (shipOrderNumber.length + 1 ).toString();
          for (let i = shipOrderNumber.length; i < 5 ; i++) {
            shipOrderNumber = '0' + shipOrderNumber;
          }
        } else {
          shipOrderNumber = '00001';
        }
        const crc = sh.unique(`${order.UserId}${orderProductsName.toString()}${date}${shipOrderNumber}`);
        shipOrderNumber = date + second + shipOrderNumber + crc.substr(0, 3);
        sails.log.info('產生出貨單編號:', shipOrderNumber);

        supplierShipOrderCreateList.push(
          {
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
            total: supplierShipOrderTotalList[supplier],
            commission: order.commission,
            tracking: order.tracking,
            ip: order.ip,
            forwardedIp: order.forwardedIp,
            userAgent: order.userAgent,
            acceptLanguage: order.acceptLanguage,
            status: 'NEW',
          }
        )
      }
      const supplierShipOrder = await SupplierShipOrder.bulkCreate(supplierShipOrderCreateList, { transaction });

      let supplierOrderProdutsCreateList = [];
      for (let i = 0; i < supplierShipOrder.length; i++) {
        //修改 出貨單訂單產品 內的出貨單ＩＤ
        for(let index = 0; index < supplierOrderProduts[ supplierShipOrder[i].SupplierId ].length; index++) {
          supplierOrderProduts[ supplierShipOrder[i].SupplierId ][index].SupplierShipOrderId = supplierShipOrder[i].id;

          supplierOrderProdutsCreateList.push( supplierOrderProduts[ supplierShipOrder[i].SupplierId ][index] )
        }
      }
      await SupplierShipOrderProduct.bulkCreate(supplierOrderProdutsCreateList, {transaction});



      transaction.commit();
      const message = 'Success Confirm Order';
      const item = order;
      res.ok({ message, data: { item } });
    } catch (e) {
      res.serverError(e);
      transaction.rollback();
    }
  },

  updateStatus: async (req, res) => {
    try{
      const { id } = req.params;
      const {status ,statusComment} = req.body;

      const orderStatus = await OrderStatus.findOne({
        where: {
          name: status
        }
      });

      const item = await Order.update({
        OrderStatusId: orderStatus.id
      },{
        where: {
          id
        }
      })

      await OrderHistory.create({
        notify: true,
        comment: `訂單 ID:${id} 變更狀態:${status}，變更理由:${statusComment}.`,
        OrderId: id,
        OrderStatudId: orderStatus.id
      });

      const message = '訂單狀態變更成功.';
      res.ok({ message, data: { item } });

    } catch (e) {
      res.serverError(e);
    }
  }
}
