module.exports = {

  action(transaction, array, index) {
    try {
      if (array.length == index) {
        return ;
      } else {
        action(transaction, array, index + 1) {
      }
    } catch (e) {
      sails.log.error(e);
    }
  }

  transactionArray: function({isolationLevel, array}) {
    return sequelize.transaction({ isolationLevel })
    .then(function (transaction) {
      return action(transaction, array, 0);
    })
    .then(function(){
      transaction.commit();
    })
    .catch(sequelize.UniqueConstraintError, function(e) {
      throw Error('此交易已失效，請重新下訂')
    })
    .catch(function(err) {
      sails.log.error('訂單建立 RecipeOrder 失敗', err.toString());
      transaction.rollback();
      return err
    });
  },
}
