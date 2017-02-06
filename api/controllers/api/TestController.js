
module.exports = {
  test: async(req, res) => {
    const isolationLevel = sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
    let transaction = await sequelize.transaction({isolationLevel});
    try {
      const time = new Date().getTime().toString();
      const name = Math.random().toString(36).substring(3, 7) + time ;
      console.log("user new name ==>",name);
      let user = await User.findById(4, { transaction });
      user.username = name;
      await user.save({ transaction });

      transaction.commit();
      res.ok({
        message:`test user success.`,
        data: {},
      });
    } catch (e) {
      transaction.rollback();
      res.serverError(e);
    }
  }
}
