import fakeusers from './../default/fakeusers';
import menuItem from './menuItem';
import order from './order';
import orderPayment from './orderpayment';
import orderProduct from './orderproduct';
import orderStatus from './orderstatus';
import product from './product';
import supplier from './supplier';
import supplierShipOrder from './suppliershiporder';
import user from './../default/user';

const importHelper = async(modelName, obj) => {
    try {
        const helper = require(`./${modelName}/importHelper`);
        return await helper.create(obj)
    } catch (e) {
        sails.log.error(e);
    }
};

module.exports = {
    init: async function() {
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

        await ImportDataService.create(importHelper);
    }
}