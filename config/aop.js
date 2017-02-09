import meld from 'meld';
import trace from 'meld/aspect/trace';
module.exports.aop = {
  init: async function(){
    console.log("=== aop init ===");

    // global.OrderService.createOrder = meld(OrderService.createOrder, trace());


    var sendMail = async function(result) {


        let order = await result

        let mailMessage = {};
        mailMessage.serialNumber = order.orderNumber;
        mailMessage.paymentTotalAmount = order.total;
        mailMessage.productName = '';
        mailMessage.email = order.email;
        mailMessage.username = `${order.lastname}${order.firstname}`;
        mailMessage.shipmentUsername = `${order.lastname}${order.firstname}`;
        mailMessage.shipmentAddress = order.shippingAddress1;
        mailMessage.note = order.comment;
        mailMessage.phone = order.telephone;
        mailMessage.invoiceNo = `${order.invoicePrefix}${order.invoiceNo}`;

        console.log("=== mailMessage ===", mailMessage);

        const messageConfig = await MessageService.orderToShopConfirm(mailMessage);
        const mail = await Message.create(messageConfig);
        await MessageService.sendMail(mail);
        console.log("=== mail send success ===");
    }

    global.OrderService.createOrder = meld.after(OrderService.createOrder, sendMail);

    console.log("=== aop init end ===");

  }
}
