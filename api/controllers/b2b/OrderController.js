module.exports = {
  orderForm: async (req, res) => {
    if (!req.session.authenticated){
      res.redirect('/');
    }

    const token = await UtilsService.tokenGenerator();
    res.view(
      'b2b/order/form',
      {
        token
      }
    );
  },
}
