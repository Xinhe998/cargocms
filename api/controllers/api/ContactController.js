module.exports = {

  create: async (req, res) => {
    try {
      await UtilsService.checkRecaptcha(req.body);
      const { name, email, phone, content } = req.body;
      await Contact.create({ name, email, phone, content, success: true });

      req.flash('info', 'success');
      res.redirect('/contact');
    } catch (e) {
      req.flash('info', 'fail');
      res.redirect('/contact');
    }
  },
}
