module.exports = {
  orderForm: async (req, res) => {
    const token = await UtilsService.tokenGenerator();
    res.view(
      'b2b/order/form',
      {
        token
      }
    );
  },
}
