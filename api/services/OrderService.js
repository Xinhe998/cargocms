import moment from 'moment';
import sh from 'shorthash';
import _ from 'lodash';

module.exports = {
  createOrder: async ( transaction ,data ) => {
    try{
      const orderProductList = JSON.parse(data.products);
      console.log('====================================');
      console.log('orderProductList=>', orderProductList);
      console.log('====================================');
      let totalPrice = 0;
      let totalTaxRate = 0;
      for(let p of orderProductList){
        let product = await Product.findById(p.id);
        if (p.optionId) {
          let productOptionValue = await ProductOptionValue.findOne({ where:{ ProductOptionId: p.optionId }});
          let productTaxRate = await Product.findOne({ where:{ id: p.id  } });
          let price = Number(productOptionValue.price) * Number(p.quantity);
          let noTaxPrice = Math.round(price / (1 + Number(productTaxRate.taxRate)));
          let tax = price - noTaxPrice;
          totalTaxRate += tax;
          totalPrice += price;
        } else {
          let productTaxRate = await Product.findOne({ where:{ id: p.id  } });
          let price = Number(product.price) * Number(p.quantity);
          let noTaxPrice = Math.round(price / (1 + Number(productTaxRate.taxRate)));
          let tax = price - noTaxPrice;
          totalTaxRate += tax;
          totalPrice += price;
        }
      }
      data.total = totalPrice - totalTaxRate;
      data.tax   = totalTaxRate;
      data.totalIncludeTax = data.total + totalTaxRate;

      data.orderNumber = await OrderService.orderNumberGenerator({modelName: 'order', userId: data.UserId, product: data.porducts})
      sails.log.info('產生訂單編號:',data.orderNumber);

      data.tracking = '訂單建立';
      data.shippingCode = '';
      data.comment = data.comment || '';
      data.fax = '';
      data.shippingLastname = data.shippingLastname || data.lastname;
      data.shippingFirstname= data.shippingFirstname || data.firstname;

      data.shippingCity = data.county;
      data.shippingPostcode = data.zipcode;
      data.shippingAddress1 = data.district + data.shippingAddress1;
      delete data.county;
      delete data.zipcode
      delete data.district
      delete data.products;
      //ignore columns
      data.invoiceNo = '',
      data.invoicePrefix = '',
      data.paymentFirstname = '',
      data.paymentLastname = '',
      data.paymentAddress1 = '',
      data.paymentCity = '',
      data.paymentPostcode = '',
      // data.paymentMethod = '',
      data.paymentCode = '',
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
      data.commission = 0.0000;
      data.marketingId = 0;
      data.languageId = 0;

      // if (data.telephone ==! data.shippingTelephone) {
      //   data.telephone = data.shippingTelephone;
      // }
      // if (data.email ==! data.shippingEmail) {
      //   data.email = data.shippingEmail;
      // }

      await OrderService.updateUserData({
        userId: data.UserId, email: data.email, phone1: data.telephone, transaction
      });

      const orderStatus = await OrderStatus.findOne({
        where: {
          name:'NEW'
        }
      });
      data.OrderStatusId = orderStatus.id;
      const order = await Order.create(data, {transaction});

      for(const orderedProduct of orderProductList){
        const findProduct = await Product.findOne({
          where: {
            id: orderedProduct.id
          },
          include: ProductDescription
        });


        const hasOrderedOption = !_.isNil(orderedProduct.optionId) && !_.isEmpty(orderedProduct.optionId);
        let findProductOption = {};

        const findProductFailed = !findProduct || !findProduct.ProductDescription;
        const findOptionFailed = hasOrderedOption && !findProductOption;
        if (findProductFailed || findOptionFailed) {
          throw new Error(`發生錯誤，無法建立產品訂單！產品名稱: ${orderedProduct.model}`);
        }

        let productTaxRate = await Product.findOne({ where:{ id: orderedProduct.id  } });
        let price = Number(findProduct.price) * Number(orderedProduct.quantity);
        let noTaxPrice = Math.round(price / (1 + Number(productTaxRate.taxRate)));
        let tax = price - noTaxPrice;

        const orderProductCreateData = {
          ProductId: findProduct.id,
          name: findProduct.ProductDescription.name,
          model: findProduct.model,
          quantity: orderedProduct.quantity,
          price: findProduct.price,
          total: noTaxPrice,
          tax: tax,
          OrderId: order.id,
        };

        if (hasOrderedOption) {
          const productOption = await ProductOption.findOne({
            where: {
              id: orderedProduct.optionId
            },
            include: [ProductOptionValue]
          }); 
          if (productOption.ProductOptionValue.subtract) {
            // calc product Quantity
            const productUpdate = await Product.findById(findProduct.id);
            const calcNewQuantity = Number(productUpdate.quantity) - Number(orderedProduct.quantity);

            // cala productOption Quantity
            const calcNewOptionQuantity = Number(productOption.ProductOptionValue.quantity) -  Number(orderedProduct.quantity);
            if (calcNewOptionQuantity < findProduct.minimum || calcNewQuantity < findProduct.minimum) {
              const now = new Date().toLocaleString();
              const purchasableCount = Number(productOption.ProductOptionValue.quantity) - Number(findProduct.minimum);
              const productName = findProduct.model;
              const productOptionName = productOption.value;
              throw new Error(`『${productName}（${productOptionName}）』庫存量不足！\n\n 該商品於 ${now} 庫存只有 ${purchasableCount} 個！`);
            }
            // save Quantity to product
            productUpdate.quantity = calcNewQuantity;
            await productUpdate.save({ transaction });

            // save Quantity to productOption
            productOption.ProductOptionValue.quantity = calcNewOptionQuantity;
            await productOption.ProductOptionValue.save({ transaction });

            let test = await ProductOptionValue.find({
              where: { id: productOption.ProductOptionValue.id }
            })
          }
          orderProductCreateData.total = Number(orderedProduct.quantity) * Number(productOption.ProductOptionValue.price);
          orderProductCreateData.price = productOption.ProductOptionValue.price;
          orderProductCreateData.tax   = orderProductCreateData.total - ( Math.round(orderProductCreateData.total / (1 + Number(productTaxRate.taxRate))));
          orderProductCreateData.option = productOption.value;
        }

        if (findProduct.subtract) {
          const productUpdate = await Product.findById(findProduct.id);
          const calcNewQuantity = Number(productUpdate.quantity) - Number(orderedProduct.quantity);

          if (calcNewQuantity < findProduct.minimum) {
            const now = new Date().toLocaleString();
            const productName = findProduct.model;
            const purchasableCount = Number(productUpdate.quantity) - Number(findProduct.minimum);
            throw new Error(`『${productName}』庫存量不足！\n\n 該商品於 ${now} 庫存只有 ${purchasableCount} 個！`);
          }
          productUpdate.quantity = calcNewQuantity;
          await productUpdate.save({ transaction });
        }
        
        
        await OrderProduct.create(orderProductCreateData, { transaction });
      }

      let resultComment = '';
      const orderProducts = JSON.parse(JSON.stringify(orderProductList));


      for (let item = 0, orderProductsLen = orderProducts.length; item < orderProductsLen; item++) {
        for (const key in orderProducts[item]) {
          resultComment += ` ${key}:${orderProducts[item][key]}`;
        }
        if(item < orderProductsLen - 1) {
          resultComment += ',';
        }
      }

      const orderHistory = await OrderHistory.create({
        OrderId: order.id,
        notify: true,
        OrderStatusId: order.OrderStatusId,
        comment: `使用者 ID: ${order.UserId}，建立訂單 Order ID: ${order.id}，訂購產品: ${resultComment}`
      }, {transaction});

      return order;

    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  updateUserData: async ({ userId, email, phone1, transaction }) => {
    try {
      let updateUserData = await User.findById(userId);
          updateUserData = updateUserData.toJSON();
      let userNeedUpdate = false;
      //update Phone
      if( !updateUserData.phone1 && !updateUserData.phone2 ) {
        updateUserData.phone1 = phone1;
        userNeedUpdate = true;
      }
      //update Email
      if( !updateUserData.email ){
        updateUserData.email = email;
        userNeedUpdate = true;
      }
      if(userNeedUpdate) {
        await User.update(updateUserData, {
          where: {
            id: userId
          },
          transaction
        });
        // updateUserData = await updateUserData.save().catch(sequelize.UniqueConstraintError, function(err) {
        //   sails.log.error('Email 重複，不更新使用者帳號資訊');
        // });
      };
    } catch (e) {
      sails.log.error('更新使用者失敗', e);
      throw e;
    }
  },

  orderNumberGenerator: async ({modelName, userId, product}) => {
    try {
      //產生訂單編號
      let date = moment(new Date(), moment.ISO_8601).format("YYYYMMDD");
      let second = new Date().getTime().toString();
      second = second.substr( second.length - 4 );


      let orderNumber = await sails.models[modelName].findAll({
        where: sequelize.where(
          sails.models[modelName].sequelize.fn('DATE_FORMAT', sails.models[modelName].sequelize.col('createdAt'), '%Y%m%d'), date
        )
      });

      if(orderNumber){
        orderNumber = (orderNumber.length + 1 ).toString();
        for( let i = orderNumber.length; i < 5 ; i++){
          orderNumber = '0' + orderNumber;
        }
      } else {
        orderNumber = '00001';
      }

      const crc = sh.unique(`${userId}${product}${date}${orderNumber}`);
      orderNumber = date + second + orderNumber + crc.substr(0, 3);

      return orderNumber;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  stringOrderProduct: async ({modelName, orderId }) => {
    try {
      let query = {
        where: {
          OrderId: orderId
        }
      };
      if (modelName === 'suppliershiporderproduct'){
        query = {
          where: {
            SupplierShipOrderId: orderId
          }
        };
      }

      const orderProducts = await sails.models[modelName].findAll(query);
      let orderProductTable = '';
      for (const p of orderProducts) {
        let productName = p.name;
        if (p.option) {
          productName = productName + `(${p.option})`;
        }
        orderProductTable += `
        <tr>
          <td>${productName}</td>
          <td>${p.quantity}</td>
          <td>${p.regularPrice}</td>
          <td>${p.regularTotal}</td>
        </tr>
        `;
      }
      orderProductTable = `
      <table>
      <thead>
        <tr>
          <th>名稱</th><th>數量</th><th>單價</th><th>小計</th>
        </tr>
      </thead>
      <tbody>
        ${orderProductTable}
      </tbody>
      </table>`;

      return orderProductTable;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  async updateStatus (id, status) {
    try {

      sails.log('id, status=>', id, status)

      if(_.isNil(id) || _.isNil(status)) {
        throw new Error('can not find id or status');
      }

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
      if(status === 'NEW') {
        item.tracking = '訂單建立'
      }
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

      return item;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  }

}
