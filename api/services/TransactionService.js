const self = {

  action({ transaction, callbackData }, array, index) {
    sails.log.debug("input", array.length, index, transaction);
    if (array.length == index) {
      sails.log.debug('return');
      return callbackData;
    } else {
      const model = array[index].model;
      const action = array[index].action;
      const data = array[index].data;
      sails.log.debug("data", model, action, data);
      return sails.models[model][action](data)
      .then(function(callbackData){
        // sails.log.info("callbackData", callbackData, transaction);
        return self.action({ transaction, callbackData }, array, index + 1);
      })
      .catch(function(err){
        sails.log.error(err);
        throw err;
      })

    }
  },

  transactionArray: function({isolationLevel, array}) {
    let transaction = null;
    return sequelize.transaction({ isolationLevel })
    .then(function (t) {
      transaction = t
      return self.action({ transaction }, array, 0);
    })
    .then(function(){
      transaction.commit();
    })
    .catch(sequelize.UniqueConstraintError, function(e) {
      throw Error('')
    })
    .catch(function(err) {
      sails.log.error('transaction error', err.toString());
      transaction.rollback();
      return err
    });
  },
}

module.exports = self;
