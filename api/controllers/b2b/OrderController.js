import crypto from 'crypto';

module.exports = {
  orderForm: async (req, res) => {

    const token = crypto.randomBytes(32).toString('hex').substr(0, 32);

    res.view(
      'b2b/order/form',
      {
        token
      }
    );
  }
}
