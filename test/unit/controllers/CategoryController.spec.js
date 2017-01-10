

describe.skip('about category Controller operation.', function() {

  it('get category list by parentId should be success.', async (done) => {
    try {

      request(sails.hooks.http.app).get(`/api/category?parentId=1`)

      /* results
      {
        success: true;
        message: ""
        data: [{
          sortOrder: 1,
          ParentId: 1,
          CategoryDescription:{
             name: 'categoryData1',
             description: 'test desc 1',
             metaTitle: 'meta title 1',
             metaDescription: 'meta desc 1',
             metaKeyword: 'meta,keyword,test,1',
          },
         }]
      }
      */

      done();
    } catch (e) {
      done(e);
    }
  });

});
