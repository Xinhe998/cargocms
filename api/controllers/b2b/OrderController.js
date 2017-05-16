module.exports = {
  orderForm: async (req, res) => {
    if (!AuthService.isAuthenticated(req)){
      res.redirect('/');
    }

    const token = await UtilsService.tokenGenerator();

    // get all payment methods from db
    const paymentMethodArray = [];
    let paymentMethods = await Config.findAll({
      where: {
        name: 'paymentMethods'
      }
    });
    paymentMethods = JSON.parse(JSON.stringify(paymentMethods));
    paymentMethods.forEach((item) => {
      paymentMethodArray.push(item.key);
    });

    res.view(
      'b2b/order/form',
      {
        token,
        data: {
          paymentMethods: paymentMethodArray,
        }
      }
    );
  },
}
