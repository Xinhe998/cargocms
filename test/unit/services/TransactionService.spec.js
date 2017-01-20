describe('about Transaction Service operation.', function() {

  before((done) => {
    console.log("=== before ===");
    done();
    // setTimeout(done, 10000);

  });

  it('create MenuItem、User should success.', async (done) => {
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
      }];
      // }, {
      //   model: 'menuitem',
      //   action: 'create',
      //   data: { icon: 'wrench', href: '#', title: 'Test'}
      // }]
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

  it.only('test2.', async (done) => {
    try {
      // var createUser = (transaction) => {
      //   return new Promise(function(resolve, reject) {
      //     User.create({
      //       username: 'asdaasd',
      //       email: '123sdlf@gmil.com',
      //       firstName: '測試Transaction',
      //       lastName: ''
      //     }, {transaction})
      //     .then(function(order) {
      //       resolve(order);
      //     }).catch(function(err) {
      //       reject(err)
      //     });
      //   });
      // }
      var isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
      var transaction = await sequelize.transaction({isolationLevel});
      await User.create({
          username: 'asdaasd',
          email: '123sdlf@gmil.com',
          firstName: '測試Transaction',
          lastName: ''
        }, {transaction})
      console.log("start");
      // return sequelize.transaction(function(t){
      //   console.log("1");
      //   return User.create({
      //     username: 'asdaasd',
      //     email: '123sdlf@gmil.com',
      //     firstName: '測試Transaction',
      //     lastName: ''
      //   }).then((data) => {
      //     console.log("=== data ===", data);
      //   })
      // })

      done();
    } catch (e) {
      done(e)
    }
  });

});
