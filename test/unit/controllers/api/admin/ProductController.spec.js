var sinon = require('sinon');
import {mockAdmin, unMockAdmin} from "../../../../util/adminAuthHelper.js"
import createHelper from "../../../../util/createHelper.js"

describe('about Backend Product Controller operations.', function() {
  let image, product1, product2, product3,
      category1, category2, category3, category4, category5, category6;

  before(async (done) => {
    try {
      await mockAdmin();

      category1 = await createHelper.supplierCategory('魚類');
      category2 = await createHelper.supplierCategory('淡水魚類');
      category3 = await createHelper.supplierCategory('深海魚類');
      category4 = await createHelper.supplierCategory('甲殼類');
      category5 = await createHelper.supplierCategory('淡水蝦蟹');
      category6 = await createHelper.supplierCategory('海蝦蟹');

      image = await Image.create({
        filePath: 'http://www.labfnp.com/modules/core/img/update1.jpg',
        type: 'image/jpeg',
        storage: 'url',
      });

      product1 = await createHelper.product({
        name: '頂級黑鮪魚',
        category: [category1.id , category3.id]
      });
      product2 = await createHelper.product({
        name: '台灣大草蝦',
        category: [category4.id, category5.id]
      });
      product3 = await createHelper.product({
        name: '北海道帝王蟹',
        category: [category4.id, category6.id]
      });

      done();
    } catch (e) {
      done(e)
    }
  });

  after(async (done) => {
    await unMockAdmin();
    done();
  });

  it('test for add a product.', async (done) => {
    try {
      const productData = {
        model: 'product1',
        sku: 1,
        upc: 1,
        ean: 1,
        jan: 1,
        isbn: 1,
        mpn: 1,
        location: 1,
        ImageId: image.id,
        categoriesId: [category1.id, category2.id]
      }
      const res = await request(sails.hooks.http.app)
      .post(`/api/admin/product`).send(productData);
      res.status.should.be.eq(200);
      res.body.success.should.be.eq(true);
      res.body.data.item.model.should.be.eq('product1');

      const newProduct = await Product.findOne({
        where: {
          id: res.body.data.item.id
        },
        include:{ model: Category, include: CategoryDescription }
      });
      newProduct.Categories.length.should.be.equal(2);

      done();
    } catch (e) {
      done(e);
    }
  });

  it('test for update a product.', async (done) => {
    try {
      const updatedProduct = {
        model: '深海頂級黑鮪魚',
        sku: 1,
        upc: 1,
        ean: 1,
        jan: 1,
        isbn: 1,
        mpn: 1,
        location: 1,
        ImageId: image.id,
        categoriesId: [category1.id, category2.id, category3.id]
      };
      const res = await request(sails.hooks.http.app)
      .put(`/api/admin/product/${product1.id}`).send(updatedProduct);
      res.status.should.be.eq(200);
      res.body.success.should.be.eq(true);

      const product = await Product.findOne({
        where:{
          id: product1.id
        },
        include:{ model: Category, include: CategoryDescription }
      });

      product.model.should.be.equal('深海頂級黑鮪魚');
      product.Categories.length.should.be.equal(3);

      done();
    } catch (e) {
      done(e);
    }
  });

  it('test for delete a product.', async (done) => {
    try {
      const deletedProduct = await Product.findOne({where: {model: 'product1'}});
      const res = await request(sails.hooks.http.app)
      .delete(`/api/admin/product/${deletedProduct.id}`);
      res.status.should.be.eq(200);
      res.body.success.should.be.eq(true);

      const product = await Product.findById(deletedProduct.id);
      (product === null).should.be.true;

      done();
    } catch (e) {
      done(e);
    }
  });

  it('test for list all products.', async (done) => {
    try {
      const res = await request(sails.hooks.http.app)
      .get(`/api/admin/product`);
      res.status.should.be.eq(200);
      res.body.data.items.length.should.be.equal(3);
      done();
    } catch (e) {
      done(e);
    }
  });

});
