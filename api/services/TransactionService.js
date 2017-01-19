const self = {


  action: function({ transaction, callbackData }, array, index) {
    // if (array.length == index) {
    //   sails.log.debug('return');
    //   return callbackData;
    // } else {
    //   const model = array[index].model;
    //   const action = array[index].action;
      const data = array[index].data;
    //   sails.log.debug("data", model, action, data);
      //  這邊這樣子正常執行
      // return sails.models[model][action](data)
      // 加上 transaction 就會 LOCK
      return User.create(data, { transaction })
      .then(function(callbackData){
        console.log("callbackData", callbackData.id);
        return callbackData
        // return self.action({ transaction, callbackData }, array, index + 1);
      })
      .catch(function(err){
        sails.log.error(err);
        throw err;
      })

    // }
  },

  transactionArray: function({isolationLevel, array}) {
    let transaction = null;
    return sequelize.transaction({ })
    .then(function (t) {
      transaction = t
      // return self.action({ transaction }, array, 0);
      console.log("1");
      try {
        return User.create({
          username: 'asdaasd',
          email: '123sdlf@gmil.com',
          firstName: '測試Transaction',
          lastName: ''
        },{ transaction: t }).then(function(a){
          console.log("2", a);
        }).catch(function(e){
          console.log("err",e);
        })

      } catch (e) {
        console.log(e);
      }
    })
    .then(function(data){
      console.log("finish", data.id);
      transaction.commit();
    })
    .catch(function(err) {
      sails.log.error('transaction error', err.toString());
      transaction.rollback();
      return err
    });
  },
}

module.exports = self;
