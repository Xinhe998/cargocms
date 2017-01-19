describe('about Transaction Service operation.', function() {

  it.only('create MenuItem、User should success.', async (done) => {
    try {
      const array = [{
        model: 'user',
        action: 'create',
        data: {
          username: 'asdaasd',
          email: '123sdlf@gmil.com',
          firstName: '測試Transaction',
          lastName: ''
        }
      }, {
        model: 'menuitem',
        action: 'create',
        data: { icon: 'wrench', href: '#', title: 'Test'}
      }]
      // const model = array[0].model;
      // const action = array[0].action;
      // const data = array[0].data;
      // sails.log.info(sails.models[model]);
      // sails.models[model][action](data)
      // .then(function(callbackData){
      //   console.log(callbackData);
      //   done();
      // })

      const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      TransactionService.transactionArray({ isolationLevel, array})
      .then(function(data){
        done();
      })
      .catch(function(err){
        done(err);
      })

      // done();
    } catch (e) {
      done(e)
    }
  });

  it.skip('test2.', async (done) => {
    try {
      const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      let transaction;
      return sequelize.transaction({ isolationLevel })
      .then(function (t) {
        transaction = t
        return User.create({
          username: 'asdaasd',
          email: '123sdlf@gmil.com',
          firstName: '測試Transaction',
          lastName: ''
        }, {transaction})
      })
      .then(function(){
        transaction.commit();
        done()
      })
      .catch(function(err) {
        sails.log.error('transaction error', err.toString());
        transaction.rollback();
      });

      // done();
    } catch (e) {
      done(e)
    }
  });

});
