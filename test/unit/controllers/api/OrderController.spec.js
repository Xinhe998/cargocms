import createHelper from "../../../util/createHelper.js"
import { mockAdmin, unMockAdmin } from "../../../util/adminAuthHelper.js"
// import supplierShipOrder from './suppliershiporder';
const exec = require('child_process').exec;

describe('about Order controllers', () => {

  let supplier, product1, product2, product3, category1, category2, category3, user, roleAdmin;
  before(async function(done){
    try{
      user = await User.create({
        username: 'buyer',
        email: 'buyer@example.com',
        firstName: '劉',
        lastName: '拜爾',
        birthday: new Date(),
        phone1: '(04)2201-9020',
        phone2: '0900-000-000',
        address: '西區台灣大道二段2號16F-1',
        address2: '台中市',
      });

      console.log('user.roles=>', user);

      await mockAdmin();
      supplier = await createHelper.supplier('一六八生猛海鮮');

      category1 = await createHelper.supplierCategory('魚類');
      category2 = await createHelper.supplierCategory('海蝦蟹');
      category3 = await createHelper.supplierCategory('貝類');

      product1 = await createHelper.product({name: '波士頓龍蝦', category:[category2.id]});
      product2 = await createHelper.product({name: '肥美黑鮪魚', category:[category1.id]});
      product3 = await createHelper.product({name: '鮮甜大扇貝', category:[category3.id]});

      await createHelper.supplierProduct(supplier.id, product1.id);
      await createHelper.supplierProduct(supplier.id, product2.id);
      await createHelper.supplierProduct(supplier.id, product3.id);

      await createHelper.orderStatus();

      done();
    } catch (e) {
      done(e);
    }
  });

  after(async (done) => {
    await createHelper.deleteAllOrderStatus();
    await unMockAdmin();
    done();
  });

  it('User shopping car Order some Products.', async (done) => {
    try{
      const token = '8178e7c8e88a68321af84bc7b77e2e38';
      let product = [
        {
          id: product1.id,
          quantity: 3,
        },{
          id: product2.id,
          quantity: 2,
        },{
          id: product3.id,
          quantity: 5,
        }];
      product = JSON.stringify(product);

      const orderData = {
        lastname: '劉',
        firstname: '拜爾',
        products: product,
        telephone: '04-22019020',
        fax: '',
        email: 'buyer@gmail.com',
        shippingFirstname: '拜爾',
        shippingLastname: '劉',
        shippingAddress1: '台灣大道二段2號16F-1',
        county: '台中市',
        zipcode: '403',
        district: '西區',
        shippingMethod: '低溫宅配',
        shippingCode: 'ship123456',
        ip: '',
        forwardedIp: '',
        userAgent: '',
        comment: '這是一個訂購測試',
        token: token
      };


      const res = await request(sails.hooks.http.app)
      .post(`/api/order`).set('Accept', 'application/json').send( orderData );


      res.status.should.be.eq(200);

      const order = await Order.findOne({
        where: {
          orderNumber: res.body.data.item.orderNumber
        }
      });

      const orderProduct = await OrderProduct.findAll({
        where: {
          OrderId: order.id
        }
      });

      orderProduct.length.should.be.equal(3);

      const orderHistory = await OrderHistory.findAll({
        where: {
          OrderId: order.id
        }
      });
      orderHistory.length.should.be.equal(1);

      const orderStatus = await OrderStatus.findOne({
        where: {
          name: 'NEW'
        }
      })
      orderHistory[0].OrderStatusId.should.be.equal(orderStatus.id);

      // const orderPayment = await OrderPayment.findOne({
      //   where: {
      //     id: order.OrderPaymentId
      //   },
      //   include: OrderPaymentStatus
      // });
      // orderPayment.status.should.be.eq('NEW');
      //
      // const orderPaymentHistory = await OrderPaymentHistory.findAll({
      //   where: {
      //     OrderPaymentId: orderPayment.id,
      //   },
      // });
      // orderPaymentHistory.length.should.be.eq(1);

      done();
    } catch (e) {
      done(e);
    }

  });

  it('Repeat Order ', async (done) => {
    try{
      let repeatOrder = [];

      const token = '9487e7c8e88a68321af84bc7b77e2168';
      let product = [
        {
          id: product1.id,
          quantity: 3,
        },{
          id: product2.id,
          quantity: 2,
        },{
          id: product3.id,
          quantity: 5,
        }];
      product = JSON.stringify(product);

      const orderData = {
        lastname: '日',
        firstname: '晶晶',
        products: product,
        telephone: '04-22019020',
        fax: '',
        email: 'buyer@gmail.com',
        shippingFirstname: '拜爾',
        shippingLastname: '劉',
        shippingAddress1: '台灣大道二段2號16F-1',
        county: '台中市',
        zipcode: '403',
        district: '西區',
        shippingMethod: '低溫宅配',
        shippingCode: 'ship654321',
        ip: '',
        forwardedIp: '',
        userAgent: '',
        comment: '這是一個訂購測試',
        token: token
      };

      repeatOrder.push(
        request(sails.hooks.http.app)
        .post(`/api/order`).set('Accept', 'application/json')
        .send( orderData )
      );
      repeatOrder.push(
        request(sails.hooks.http.app)
        .post(`/api/order`).set('Accept', 'application/json')
        .send( orderData )
      );

      const result = await Promise.all(repeatOrder);
      // console.log("====Promise result ===", result);

      const check = await Order.findAll({ where: { token }});
      check.length.should.be.eq(1);
      done();
    } catch(e){
      done(e);
    }
  });

  it('Order Controller get Order Info data', async(done) => {
    try{
      const order = await Order.findById(1);

      const res = await request(sails.hooks.http.app)
      .get(`/orderinfo/${order.orderNumber}`);

      res.status.should.be.eq(200);
      // res.body.data.item.invoiceNo.should.be.eq('87654321');
      // res.body.data.product.length.should.be.eq(3);

      done();
    } catch (e) {
      done(e);
    }
  });

  it.only('Order Controller quicky create order and confirm order', async(done) => {
    try{
      const command = 'for i in {1..10}\n do\n curl -X POST -d "lastname=日&firstname=晶晶&products=[{\\"id\\":\\"1\\",\\"quantity\\":\\"3\\"},{\\"id\\":\\"1\\",\\"quantity\\":\\"2\\"},{\\"id\\":\\"1\\",\\"quantity\\":\\"5\\"}]&"telephone"="04-22019020"&"fax"=""&"email"="buyer@gmail.com"&"shippingFirstname"="拜爾"&"shippingLastname"="劉"&"shippingAddress1"="台灣大道二段2號16F-1"&"county"="台中市"&"zipcode"="403"&"district"="西區"&"shippingMethod"="低溫宅配"&"shippingCode"="ship654321"&"ip"=""&"forwardedIp"=""&"userAgent"=""&"comment"="這是一個訂購測試"&"token"=$i" http://localhost:1338/api/order \ndate +%s\ndone';

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        done();
      });
      // let product = [
      //   {
      //     id: product1.id,
      //     quantity: 3,
      //   },{
      //     id: product2.id,
      //     quantity: 2,
      //   },{
      //     id: product3.id,
      //     quantity: 5,
      //   }];
      // product = JSON.stringify(product);
      //
      // const orderData = {
      //   lastname: '日',
      //   firstname: '晶晶',
      //   products: product,
      //   telephone: '04-22019020',
      //   fax: '',
      //   email: 'buyer@gmail.com',
      //   shippingFirstname: '拜爾',
      //   shippingLastname: '劉',
      //   shippingAddress1: '台灣大道二段2號16F-1',
      //   county: '台中市',
      //   zipcode: '403',
      //   district: '西區',
      //   shippingMethod: '低溫宅配',
      //   shippingCode: 'ship654321',
      //   ip: '',
      //   forwardedIp: '',
      //   userAgent: '',
      //   comment: '這是一個訂購測試'
      // };

      // let makeOrders = []
      // for (let i = 0; i < 4; i++) {
      //   let copyOrderData = {...orderData};
      //   copyOrderData.token = `makeOrderNo.${i}`;
      //   makeOrders.push(
      //     request(sails.hooks.http.app)
      //     .post(`/api/order`).set('Accept', 'application/json')
      //     .send( copyOrderData )
      //   );
      // }
      // await Promise.all(makeOrders);

      // const confirmArray = [];
      // const confirmToken = `confirm-${new Date().getTime()}`;
      // for (let i = 0; i < 4; i++) {
      //   confirmArray.push(
      //     request(sails.hooks.http.app)
      //     .put(`/api/admin/order/confirm/${Number(i) + 1}`)
      //     .send({ tracking: 'n/a', orderConfirmComment: 'no' })
      //   );
      // }
      // const result = await Promise.all(confirmArray);
      //
      // console.log('result=>', result);

      // done();
    } catch (e) {
      sails.log.error(e);
      done(e);
    }
  });

  it.skip('Order Controller repeat confirm order ', async(done) => {
    try{
      let product = [
        {
          id: product1.id,
          quantity: 3,
        },{
          id: product2.id,
          quantity: 2,
        },{
          id: product3.id,
          quantity: 5,
        }];
      product = JSON.stringify(product);

      const orderData = {
        lastname: '狂',
        firstname: '晶晶',
        products: product,
        telephone: '04-22019020',
        fax: '',
        email: 'buyer@gmail.com',
        shippingFirstname: '拜爾',
        shippingLastname: '劉',
        shippingAddress1: '台灣大道二段2號16F-1',
        county: '台中市',
        zipcode: '403',
        district: '西區',
        shippingMethod: '低溫宅配',
        shippingCode: 'ship654321',
        ip: '',
        forwardedIp: '',
        userAgent: '',
        comment: '這是一個訂購測試'
      };

      orderData.token = new Date().getTime();
      const res = await request(sails.hooks.http.app)
      .post(`/api/order`).set('Accept', 'application/json')
      .send( orderData )

      res.status.should.be.eq(200);

      const order = await Order.findOne({
        where: {
          orderNumber: res.body.data.item.orderNumber
        }
      });

      const confirmArray = [];
      const confirmToken = `confirm-${new Date().getTime()}`;
      for (let i = 0; i < 3; i++) {
        confirmArray.push(
          request(sails.hooks.http.app)
          .put(`/api/admin/order/confirm/${order.id}`)
          .send({ tracking: 'n/a', orderConfirmComment: 'no', token: confirmToken })
        );
      }
      const result = await Promise.all(confirmArray);

      done();
    } catch (e) {
      done(e);
    }
  });
});
