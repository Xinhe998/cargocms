module.exports.init = async () => {
  try {
    const isDevMode = sails.config.environment === 'development';
    const isDropMode = sails.config.models.migrate == 'drop';

    if (isDevMode && isDropMode) {

      const user = await User.findOne();
      const userDetail = await UserDetail.create({
        subscriberId: 'motorworld168',
        sexuality: 'male',
        UserId: user.id
      });

    }
  } catch (e) {
    console.error(e);
  }
};
