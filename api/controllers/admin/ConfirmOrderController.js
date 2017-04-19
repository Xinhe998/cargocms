module.exports = {
  show: async (req, res) => {
    res.ok({
      view: true,
      layout: 'admin/default/show'
    });
  },
}
