import jwt from 'jsonwebtoken';
import moment from 'moment';

module.exports = {
  findAll: async () => {
    try {
      return await User.findAll();
    } catch (e) {
      throw e;
    }
  },

  create: async ({
    username,
    email,
    firstName,
    lastName,
    locale,
    Passports,
    birthday,
    phone1,
    phone2,
    address,
    address2,
    rolesArray,
    Supplier,
  }) => {
    try {
      sails.log.info({
        username,
        email,
        firstName,
        lastName,
        locale,
        Passports,
        birthday,
        phone1,
        phone2,
        address,
        address2,
        rolesArray,
        Supplier
      });

      const supplierId = Supplier ? Supplier.id : null;

      const findExistUser = await User.find({
        where: { $or: [ {username}, {email} ] }
      });

      if (findExistUser)
        throw new Error(`user ${findExistUser.username} exist!`);

      let user = await User.create({
        username,
        email,
        firstName,
        lastName,
        locale,
        birthday: birthday === '' ? null : birthday,
        phone1,
        phone2,
        address,
        address2,
        SupplierId: supplierId
      });
      await Passport.create({
        provider: 'local',
        password: Passports[0].password,
        UserId: user.id
      });


      rolesArray = rolesArray.map(function(data) {
        return { authority: data}
      });
      const userRoles = await Role.findAll({
        where: {
          '$or': rolesArray
        }
      });
      await user.addRoles(userRoles);

      return user;
    } catch (e) {
      sails.log.error(e);
      throw e;
    }
  },

  update: async (user = {
    id,
    username,
    email,
    firstName,
    lastName,
    locale,
    Passports,
    rolesArray,
    birthday,
    phone1,
    phone2,
    address,
    address2,
    Supplier,
  }) => {
    try {
      sails.log.info('update user service=>', user);

      const supplierId = user.Supplier.id ? user.Supplier.id : null;

      let updatedUser = await User.findOne({
        where: {
          id: parseInt(user.id, 10)
        },
        include: Passport,
      });

      if (updatedUser) {
        const passport = await Passport.findById(updatedUser.Passports[0].id);
        const isOldPassword = await passport.validatePassword(user.Passports[0].password);
        if (!isOldPassword) {
          passport.password = user.Passports[0].password;
          await passport.save();
        }
        updatedUser.username = user.username;
        updatedUser.email = user.email;
        updatedUser.firstName = user.firstName;
        updatedUser.lastName = user.lastName;
        updatedUser.locale = user.locale;
        updatedUser.phone1 = user.phone1;
        updatedUser.phone2 = user.phone2;
        updatedUser.address = user.address;
        updatedUser.address2 = user.address2;
        updatedUser.SupplierId = supplierId;

        if( user.birthday !== "" ){
          updatedUser.birthday = user.birthday;
        }


        if (supplierId) {
          user.rolesArray.push('supplier');
        } else {
          user.rolesArray = user.rolesArray.map( function(data) {
            if(data !== 'supplier'){
              return data;
            }
          });
        }

        const rolesArray = user.rolesArray.map( function(data) {
          return { authority: data };
        });
        const userRoles = await Role.findAll({
          where: {
            '$or': rolesArray
          }
        });
        await updatedUser.setRoles(userRoles);
        updatedUser = await updatedUser.save();
      }
      return updatedUser;
    } catch (e) {
      throw e;
    }
  },

  updateByUser: async (user = {
    id,
    username,
    email,
    firstName,
    lastName,
    locale,
    Passports,
    password,
    passwordConfirm,
    verificationEmailToken,
    avatarImgId,
  }) => {
    try {
      sails.log.info('updateByUser service=>', user);
      let updatedUser = await User.findOne({
        where: {
          id: parseInt(user.id, 10)
        },
        include: Passport,
      });
      if (updatedUser) {
        const checkPwdNotEmpty = user.password !== '';
        if (checkPwdNotEmpty) {

          const checkPwdAreEqual = user.password === user.passwordConfirm;
          if (checkPwdAreEqual) {

            const passport = await Passport.findById(updatedUser.Passports[0].id);
            passport.password = user.password;
            await passport.save();
          }
        }

        if(user.avatarImgId){
          const userAvatar = await Image.findById(user.avatarImgId);
          user.avatar = userAvatar.url;
          user.avatarThumb = userAvatar.url;
        }

        updatedUser.username = user.username;
        updatedUser.email = user.email;
        updatedUser.firstName = user.firstName;
        updatedUser.lastName = user.lastName;
        updatedUser.locale = user.locale;
        updatedUser.phone1 = user.phone1;
        updatedUser.phone2 = user.phone2;
        updatedUser.address = user.address;
        updatedUser.address2 = user.address2;
        updatedUser.verificationEmailToken = user.verificationEmailToken;
        updatedUser.avatar = user.avatar;
        updatedUser.avatarThumb = user.avatarThumb;

        if (user.birthday !== '') {
          updatedUser.birthday = user.birthday;
        }

        updatedUser = await updatedUser.save();
      }
      return updatedUser;
    } catch (e) {
      throw e;
    }
  },

  sendVerificationEmail: async({ userId, email,  displayName, signToken, type}) => {
    try {
      const token = jwt.sign({
        exp: moment(new Date()).add(1, 'h').valueOf(),
        userId,
        email,
      }, signToken);
      let messageConfig = await MessageService.checkNewEmail({
        email: email,
        api: `/validate/email?token=${token}`,
        username: displayName,
        type: type,
      });
      let message = await Message.create(messageConfig);
      await MessageService.sendMail(message);
    } catch (e) {
      throw e;
    }
  }
}
