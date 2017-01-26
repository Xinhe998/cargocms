import moment from 'moment';
import sh from 'shorthash';

module.exports = {
  createOrder: async ( transaction ,data ) => {
    try{
      const products = JSON.parse(data.products);

      let totalPrice = 0;
      for(let p of products){
        let product = await Product.find({
          where: {
            id: p.id,
          },
        });

        totalPrice += Number(product.price) * Number( p.quantity );
      }
      data.total = totalPrice;


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
      data.paymentMethod = '',
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

      if (data.telephone ==! data.shippingTelephone) {
        data.telephone = data.shippingTelephone;
      }
      if (data.email ==! data.shippingEmail) {
        data.email = data.shippingEmail;
      }

      await OrderService.updateUserData({userId: data.UserId, email: data.email, phone1: data.telephone, transaction});

      const orderStatus = await OrderStatus.findOne({
        where: { name:'NEW' }
      });
      data.OrderStatusId = orderStatus.id;

      let orderProducts = [];
      let needUpdateProducts = [];
      for(const p of products){
        const product = await Product.findOne({
          where: {
            id: p.id,
          },
          include: ProductDescription
        });
        orderProducts.push({
          ProductId: product.id,
          name: product.ProductDescription.name,
          model: product.model,
          quantity: p.quantity,
          price: product.price,
          total: (product.price * p.quantity),
          tax: (product.price * p.quantity) * 0.05,
        });

        if (product.subtract) {
          const quantity = Number(product.quantity) - Number(p.quantity);
          needUpdateProducts.push(
            Product.update({ quantity },{
              where: {
                id: p.id
              },
              transaction
            })
          );
        }
      }

      //定義建立訂單相關的函式
      const createOrder = (transaction) => {
        return new Promise(function(resolve, reject) {
          Order.create(data, {transaction})
          .then(function(order) {
            resolve(order);
          }).catch(function(err){
            reject(err);
          });
        });
      }

      const createOrderProduct = (transaction, orderData) => {
        return new Promise(function(resolve, reject) {

          orderProducts = orderProducts.map(function( data ){
            data.OrderId = orderData.id;
            return data;
          });

          OrderProduct.bulkCreate(orderProducts, {transaction})
          .then( function(orderProduct){
            resolve(orderProduct);
          }).catch( function(err){
            reject(err);
          })

        });
      }

      const subtractProduct = (transaction, orderProduct) => {
        return sequelize.Promise.each(needUpdateProducts, function (updateProduct) {
          return updateProduct;
        });
      }

      const createHistory = (transaction, orderData, orderProductData) => {
        return new Promise(function(resolve, reject) {

          const orderProducts = orderProductData.map(function(data) {
            return {
              name: data.name,
              quantity: data.quantity,
              price: data.price,
              total: data.total
            }
          });

          OrderHistory.create({
            OrderId: orderData.id,
            notify: true,
            OrderStatusId: orderStatus.id,
            comment: `使用者 ID: ${data.UserId}，建立訂單 Order ID: ${orderData.id}，訂購產品: ${JSON.stringify(orderProducts)}`,
          }, { transaction })
          .then(function(order) {
            resolve(OrderHistory);
          }).catch(function(err){
            reject(err);
          });

        });
      }

      const sendEmail = (transaction, config) => {
        return new Promise(function(resolve, reject) {
          // TODO: 寄送 Email
          resolve('Send Email OK');
        });
      }

      console.log("=== create data =>",data);
      console.log("=== make order");
      let orderData, orderProductData, historyData;
      return createOrder(transaction)
      .then(function(order) {
        orderData = order;
        return createOrderProduct(transaction, orderData);
      })
      .then(function(productData) {
        orderProductData = productData;
        return createHistory(transaction, orderData, orderProductData);
      })
      .then(function(orderHistory){
        historyData = orderHistory;
        return subtractProduct(transaction, orderProductData)
      })
      .then( function(subtractProductData) {
        let config = {};
        return sendEmail({ transaction, config });
      })
      .then( function(email) {
        return orderData;
      });

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
          User.sequelize.fn('DATE_FORMAT', User.sequelize.col('createdAt'), '%Y%m%d'), date
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
}
