describe.only('about Transaction Service operation.', function() {

  describe('test action', () => {
    it('create MenuItem、User should success.', async (done) => {
      try {
        // User.create({
        //   username: 'admin',
        //   email: '123sdlf@gmil.com',
        //   firstName: '李仁',
        //   lastName: '管'
        // });
        // MenuItem.create({ icon: 'wrench', href: '#', title: '資料維護'});

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
          console.log("!!!!!", data);
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
  });

});
