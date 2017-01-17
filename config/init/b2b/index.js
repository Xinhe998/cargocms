import product from './product';
import supplier from './supplier';
import supplierShipOrder from './suppliershiporder';
import order from './order';
import orderProduct from './orderproduct';
import orderPayment from './orderpayment';
import orderStatus from './orderstatus';
import menuItem from './menuItem';
import fakeusers from './../default/fakeusers';
import user from './../default/user';

module.exports.init = async function(){
  console.log("=== init b2b data ===");
  await product.init();
  await supplier.init();
  await orderStatus.init();
  await order.init();
  await orderProduct.init();
  await supplierShipOrder.init();
  await menuItem.init();
  await fakeusers.init();
  await user.init();
}
