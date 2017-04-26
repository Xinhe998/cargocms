import moment from 'moment';
import sh from 'shorthash';

module.exports = {
  createOrder: async ( transaction ,data ) => {
    try{
      const products = JSON.parse(data.products);
      let totalPrice = 0;
      let totalTaxRate = 0;
      for(let p of products){
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

      await OrderService.updateUserData({userId: data.UserId, email: data.email, phone1: data.telephone, transaction});

      const orderStatus = await OrderStatus.findOne({
        where: {
          name:'NEW'
        }
      });
      data.OrderStatusId = orderStatus.id;
      const order = await Order.create(data, {transaction});

      for(const p of products){
        const product = await Product.findOne({
          where: {
            id: p.id
          },
          include: ProductDescription
        });


        if (!product || !product.ProductDescription) {
          throw new Error(`產品資訊不正確，無法建立產品訂單，產品 ID: ${p.id}`);
        }

        if (product.subtract) {
          let productUpdate = await Product.findById(product.id);
          productUpdate.quantity = Number(product.quantity) - Number(p.quantity);
          if (productUpdate.quantity < 0) throw new Error(`產品ID: ${productUpdate.id}，庫存量不足`);
          await productUpdate.save({ transaction });
        }

        let productTaxRate = await Product.findOne({ where:{ id: p.id  } });
        let price = Number(product.price) * Number(p.quantity);
        let noTaxPrice = Math.round(price / (1 + Number(productTaxRate.taxRate)));
        let tax = price - noTaxPrice;

        const orderProductCreateData = {
          ProductId: product.id,
          name: product.ProductDescription.name,
          model: product.model,
          quantity: p.quantity,
          price: product.price,
          total: noTaxPrice,
          tax: tax,
          OrderId: order.id,
        };

        let subtractQuantity = Number(p.quantity);
        if (p.optionId) {
          const productOption = await ProductOption.findOne({
            where: {
              id: p.optionId
            },
            include: [ProductOptionValue]
          }); 
          subtractQuantity = Number(productOption.ProductOptionValue.quantity) * Number(p.quantity);

          orderProductCreateData.total = Number(p.quantity) * Number(productOption.ProductOptionValue.price);
          orderProductCreateData.price = productOption.ProductOptionValue.price;
          orderProductCreateData.tax   = orderProductCreateData.total - ( Math.round(orderProductCreateData.total / (1 + Number(productTaxRate.taxRate))));
          orderProductCreateData.option = productOption.value;
        }

        if (product.subtract) {
          let productUpdate = await Product.findById(product.id);
          productUpdate.quantity = Number(product.quantity) - Number(subtractQuantity);
          if (productUpdate.quantity < 0) 
            throw new Error(`產品ID: ${productUpdate.id}，庫存量不足`);
          
          await productUpdate.save({ transaction });
        }
        
        await OrderProduct.create(orderProductCreateData, { transaction });
      }

      const orderHistory = await OrderHistory.create({
        OrderId: order.id,
        notify: true,
        OrderStatusId: order.OrderStatusId,
        comment: `使用者 ID: ${order.UserId}，建立訂單 Order ID: ${order.id}，訂購產品: ${JSON.stringify(products)}`
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
          <td>${p.formatPrice}</td>
          <td>${p.formatTotal}</td>
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
  }
}
