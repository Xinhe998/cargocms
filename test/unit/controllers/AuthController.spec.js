describe.only('about Auth Controller operation.', function() {
  it('register user should success.', async (done) => {

    try {

      let newUser = {
        username: 'newUser',
        email: 'newUser@gmail.com',
        password: 'newUser'
      }

      let result = await request(sails.hooks.http.app)
      .post('/auth/local/register')
      .set('Accept', 'text/html')
      .set('Content-Type', 'text/html')
      // type text/html needs to be JSON.stringify
      .send(JSON.stringify(newUser));

      let {email} = newUser;
      let checkUser = await User.findOne({
        where: { email },
        include: Passport
      });
      console.log(checkUser);
      checkUser.email.should.be.equal(newUser.email);
      result.status.should.be.equal(302);

      done();
    } catch (e) {
      done(e);
    }
  });

  describe('login user use eamil', () => {
    let user;
    before(async (done) => {
      try {
        let testuser = {
          email: 'testuser@gmail.com',
          username: 'testuser'
        }
        user = await User.create(testuser);
        await Passport.create({provider: 'local', password: 'testuser', UserId: user.id});
        done();
      } catch (e) {
        done(e);
      }
    });

    it('should be success.', async (done) => {
      try {
        let loginInfo = {
          identifier: 'testuser@gmail.com',
          password: 'testuser'
        }
        let result = await request(sails.hooks.http.app)
        .post('/auth/local')
        .set('Accept', 'text/html')
        .set('Content-Type', 'text/html')
        // type text/html needs to be JSON.stringify
        .send(JSON.stringify(loginInfo));
        result.status.should.be.equal(302);
        let checkUser = await User.findById(user.id);
        checkUser.userAgent.should.not.eq('');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  describe('login user by user name and password with JWT', () => {
    let user;
    before(async (done) => {
      try {
        let testuser = {
          email: 'jwtuser@gmail.com',
          username: 'jwtuser'
        }
        user = await User.create(testuser);
        await Passport.create({ provider: 'local', password: 'jwtuser', UserId: user.id });
        done();
      } catch (e) {
        done(e);
      }
    });

    it('login should be success.', async (done) => {
      try {
        let loginInfo = {
          identifier: 'jwtuser@gmail.com',
          password: 'jwtuser'
        }
        const result = await request(sails.hooks.http.app)
        .post('/auth/local')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(loginInfo);
        console.log('result=>', result);
        result.status.should.be.equal(200);
        // result.jwtToken.should.not.eq('');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

});
